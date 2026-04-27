#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enhanced JavaScript CVE Scraper
使用NVD API和Mend Vulnerability Database获取JavaScript相关的CVE数据
"""

import requests
import json
import time
import os
import re
from datetime import datetime, timedelta
import pandas as pd
from tqdm import tqdm
import logging
from bs4 import BeautifulSoup
import hashlib

# ==================== 配置区域 ====================
# [DATE] 修改以下变量来控制抓取的日期范围
# 
# 📌 重要说明：
# - API返回的总CVE数是固定的（如2179），这是该时间段内所有类型的CVE总数
# - 脚本会从这些CVE中筛选出JavaScript相关的CVE
# - 最终结果数量会小于总CVE数，这是正常的！
# 
# 使用方法：
# 1. 直接修改下面的变量值
# 2. 或者取消注释预定义范围
# 3. 运行脚本: python js_cve_scraper.py
#
CVE_START_DATE = "2000-01-01"    # 开始日期 (格式: YYYY-MM-DD)
CVE_END_DATE = "2025-08-10"      # 结束日期 (格式: YYYY-MM-DD) - 测试用小范围
CVSS_MIN_SCORE = 0.0             # 最小CVSS分数 (0.0-10.0，0表示不过滤)
RESULTS_PER_PAGE = 100           # 每页结果数 (建议20-2000，越大越快但可能超时)
USE_API_KEY = True               # 是否使用API Key (False = 更慢但可能更稳定)

# 🔄 强制刷新选项
FORCE_REFRESH = True             # 强制重新抓取，忽略缓存文件

# ⏯ 断点续抓
RESUME_FROM_CSV = True           # 若存在历史 CSV，则从最新一条之后开始抓取
RESUME_CSV_PATH = "data/js_cve_dataset.csv"

# 📊 数据源配置
ENABLE_MEND_SCRAPING = True      # 是否启用Mend数据库爬取
ENABLE_NVD_API = True            # 是否启用NVD API爬取

# 🔧 调试选项
DEBUG_MODE = False               # 是否显示详细调试信息

# 📋 预定义的常用日期范围 (取消注释使用)
# CVE_START_DATE, CVE_END_DATE = "2023-01-01", "2023-12-31"  # 2023年全年
# CVE_START_DATE, CVE_END_DATE = "2022-01-01", "2022-12-31"  # 2022年全年
# CVE_START_DATE, CVE_END_DATE = "2020-01-01", "2024-01-01"  # 2020-2023年四年
# CVE_START_DATE, CVE_END_DATE = "2023-06-01", "2023-06-30"  # 2023年6月
# CVE_START_DATE, CVE_END_DATE = "2024-01-01", "2024-03-31"  # 2024年Q1季度

# [TARGET] CVSS分数过滤示例
# CVSS_MIN_SCORE = 7.0   # 只抓取高危漏洞
# CVSS_MIN_SCORE = 4.0   # 只抓取中危及以上漏洞
# CVSS_MIN_SCORE = 0.0   # 抓取所有漏洞（推荐）

# [!] 故障排除选项（如果API连接有问题，取消注释试试）
# USE_API_KEY = False              # 禁用API Key，使用公共访问
# RESULTS_PER_PAGE = 20            # 减少每页结果数
# CVE_START_DATE = "2022-01-01"    # 使用更小的日期范围进行测试
# CVE_END_DATE = "2022-01-07"      # 只测试一周的数据
# ===================================================

# 设置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EnhancedJSCVEScraper:
    """
    增强版JavaScript CVE抓取器
    使用NVD API和Mend Vulnerability Database抓取JavaScript相关的CVE数据
    """
    
    def __init__(self):
        """初始化抓取器"""
        # 初始化请求会话
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # NVD API key is optional. Public releases must not contain real keys.
        self.api_key = os.environ.get('NVD_API_KEY', '').strip()
        
        # NVD API URL - 正确的API端点
        self.base_url = 'https://services.nvd.nist.gov/rest/json/cves/2.0'
        
        # Mend Vulnerability Database URL
        self.mend_base_url = 'https://www.mend.io/vulnerability-database'
        
        # 打印初始化信息
        logger.info(f"NVD API URL: {self.base_url}")
        logger.info(f"Mend Vulnerability Database URL: {self.mend_base_url}")
        if USE_API_KEY and self.api_key:
            logger.info(f"API Key: {self.api_key[:8]}...{self.api_key[-4:]}")
        elif USE_API_KEY:
            logger.info("API Key: 未设置 NVD_API_KEY，将使用公共访问")
        else:
            logger.info("API Key: 已禁用 (将使用公共访问，速度较慢)")
        
        # 结果存储
        self.results = []
        self.total_api_cves = 0  # 存储API返回的总CVE数
        self.total_mend_cves = 0  # 存储Mend返回的总CVE数
        
        # JavaScript相关关键词 - 大幅扩展版本
        self.js_keywords = [
            # 核心JavaScript技术
            'javascript', 'js', 'ecmascript', 'es5', 'es6', 'es2015', 'es2016', 'es2017', 'es2018', 'es2019', 'es2020', 'es2021', 'es2022', 'es2023',
            'esnext', 'tc39', 'v8 engine', 'spidermonkey', 'chakra', 'jscore', 'nashorn', 'rhino', 'quickjs', 'duktape', 'jerryscript',
            
            # 运行时和平台
            'node', 'nodejs', 'node.js', 'deno', 'bun', 'v8', 'spidermonkey', 'chakra', 'hermes', 'jsc',
            'node-gyp', 'n-api', 'node-addon-api', 'nvm', 'volta', 'fnm',
            
            # 包管理和构建工具
            'npm', 'yarn', 'pnpm', 'bower', 'jspm', 'lerna', 'rush', 'nx', 'turbo', 'bit',
            'webpack', 'rollup', 'parcel', 'vite', 'snowpack', 'wmr', 'rome', 'farm', 'rspack',
            'babel', 'swc', 'esbuild', 'terser', 'uglifyjs', 'closure compiler', 'typescript compiler', 'tsc',
            'grunt', 'gulp', 'browserify', 'requirejs', 'systemjs', 'amd', 'commonjs', 'esmodules', 'umd',
            
            # 前端框架和库
            'react', 'reactjs', 'vue', 'vuejs', 'angular', 'angularjs', 'svelte', 'solid', 'preact', 'lit', 'stencil', 'qwik', 'alpine.js',
            'ember', 'emberjs', 'backbone', 'knockout', 'mithril', 'hyperapp', 'inferno', 'riot', 'polymer',
            'jquery', 'zepto', 'cash', 'umbrella', 'bootstrap', 'foundation', 'bulma', 'semantic-ui',
            'lodash', 'underscore', 'ramda', 'immutable', 'mori', 'lazy.js',
            'moment', 'dayjs', 'date-fns', 'luxon', 'fecha', 'ms',
            'axios', 'fetch', 'superagent', 'got', 'request', 'node-fetch', 'isomorphic-fetch',
            'three.js', 'd3.js', 'chart.js', 'plotly.js', 'leaflet', 'mapbox', 'openlayers', 'cesium',
            'rxjs', 'most', 'xstream', 'bacon.js', 'highland',
            
            # 状态管理
            'redux', 'mobx', 'zustand', 'recoil', 'jotai', 'valtio', 'akita', 'effector', 'overmind',
            'vuex', 'pinia', 'ngrx', 'flux', 'reflux', 'alt', 'fluxible',
        
            
            # 后端框架
            'express', 'expressjs', 'koa', 'koajs', 'fastify', 'hapi', 'hapijs', 'restify', 'nestjs', 'adonis', 'adonisjs',
            'meteor', 'meteorjs', 'feathers', 'feathersjs', 'sails', 'sailsjs', 'strapi', 'keystone', 'keystonejs',
            'ghost', 'total.js', 'actionhero', 'frisby', 'loopback', 'mean', 'mern', 'mevn',
            'socket.io', 'ws', 'uws', 'socketcluster', 'sockjs', 'engine.io',
            
            # 全栈框架
            'nextjs', 'next.js', 'nuxt', 'nuxt.js', 'gatsby', 'gatsbyjs', 'remix', 'sveltekit', 'fresh', 'solidstart',
            'blitz', 'blitzjs', 'redwood', 'redwoodjs', 't3-stack', 'create-t3-app', 'astro', 'astrojs',
            'docusaurus', 'vuepress', 'gridsome', 'scully', 'eleventy', '11ty', 'hexo', 'jekyll',
            
            # 桌面和移动应用
            'electron', 'electronjs', 'tauri', 'nwjs', 'neutralino', 'wails',
            'cordova', 'phonegap', 'ionic', 'ionicframework', 'capacitor', 'capacitorjs',
            'react-native', 'reactnative', 'expo', 'nativescript', 'flutter-js', 'quasar',
            
            # 测试框架和工具
            'jest', 'jestjs', 'mocha', 'mochajs', 'jasmine', 'vitest', 'ava', 'tape', 'qunit', 'karma',
            'cypress', 'cypressio', 'playwright', 'puppeteer', 'selenium', 'webdriver', 'protractor', 'nightwatch',
            'testing-library', 'react-testing-library', 'vue-testing-library', 'enzyme', 'sinon', 'chai', 'supertest',
            'storybook', 'storybookjs', 'chromatic', 'percy', 'applitools',
            
        
            
        
            
            # NPM生态
            'npm package', 'node module', 'package.json', 'yarn.lock', 'package-lock.json',
            'pnpm-lock.yaml', 'npmjs', 'unpkg', 'jsdelivr', 'skypack', 'esm.sh', 'cdnjs',
            'node_modules', 'shrinkwrap', 'lock file', 'semantic versioning', 'semver',
            'scoped packages', 'monorepo', 'workspaces', 'verdaccio', 'sinopia',
            
         
            
            
        ]
        
        # JavaScript相关项目 - 大幅扩展版本
        self.js_projects = [
            # 核心运行时和平台
            'nodejs/node', 'denoland/deno', 'oven-sh/bun', 'microsoft/TypeScript',
            'v8/v8', 'tc39/ecma262', 'mozilla/spidermonkey', 'facebook/hermes',
            
            # 前端框架和库
            'facebook/react', 'vuejs/vue', 'angular/angular', 'sveltejs/svelte',
            'solidjs/solid', 'preactjs/preact', 'lit/lit', 'ionic-team/stencil',
            'alpinejs/alpine', 'qwikdev/qwik', 'emberjs/ember.js', 'backbone/backbone',
            'knockoutjs/knockout', 'riotjs/riot', 'polymer/polymer', 'hyperapp/hyperapp',
            
            # UI库和组件
            'jquery/jquery', 'zepto/zepto', 'cash/cash', 'umbrellajs/umbrella',
            'lodash/lodash', 'underscore/underscore', 'ramda/ramda', 'immutable-js/immutable-js',
            'momentjs/moment', 'iamkun/dayjs', 'date-fns/date-fns', 'moment/luxon',
            'axios/axios', 'sindresorhus/got', 'node-fetch/node-fetch', 'visionmedia/superagent',
            
            # 状态管理
            'reduxjs/redux', 'mobxjs/mobx', 'pmndrs/zustand', 'facebookexperimental/Recoil',
            'pmndrs/jotai', 'pmndrs/valtio', 'datorama/akita', 'zerobias/effector',
            'vuejs/vuex', 'vuejs/pinia', 'ngrx/platform', 'reflux/refluxjs',
            
            # 样式和CSS-in-JS
            'styled-components/styled-components', 'emotion-js/emotion', 'callstack/linaria',
            'stitchesjs/stitches', 'cristianbote/goober', 'postcss/postcss',
            'tailwindlabs/tailwindcss', 'windicss/windicss', 'tw-in-js/twind',
            
            # 后端框架
            'expressjs/express', 'koajs/koa', 'fastify/fastify', 'hapijs/hapi',
            'nestjs/nest', 'adonisjs/core', 'meteor/meteor', 'feathersjs/feathers',
            'balderdashy/sails', 'strapi/strapi', 'keystonejs/keystone', 'tryghost/ghost',
            'socketio/socket.io', 'websockets/ws', 'uWebSockets/uWS.js',
            
            # 全栈框架
            'vercel/next.js', 'nuxt/nuxt', 'gatsbyjs/gatsby', 'remix-run/remix',
            'sveltejs/kit', 'solidjs/solid-start', 'blitz-js/blitz', 'redwoodjs/redwood',
            't3-oss/create-t3-app', 'withastro/astro', 'facebook/docusaurus',
            'vuejs/vuepress', 'gridsome/gridsome', 'scullyio/scully', '11ty/eleventy',
            
            # 构建工具和打包器
            'webpack/webpack', 'rollup/rollup', 'parcel-bundler/parcel', 'vitejs/vite',
            'snowpackjs/snowpack', 'preactjs/wmr', 'rome/tools', 'farm-fe/farm',
            'babel/babel', 'swc-project/swc', 'evanw/esbuild', 'mishoo/UglifyJS',
            'terser/terser', 'google/closure-compiler', 'gruntjs/grunt', 'gulpjs/gulp',
            'browserify/browserify', 'requirejs/requirejs', 'systemjs/systemjs',
            
            # 包管理器
            'npm/cli', 'yarnpkg/yarn', 'pnpm/pnpm', 'bower/bower', 'jspm/jspm-cli',
            'lerna/lerna', 'microsoft/rushstack', 'nrwl/nx', 'vercel/turbo',
            
            # 桌面和移动应用
            'electron/electron', 'tauri-apps/tauri', 'nwjs/nw.js', 'neutralinojs/neutralinojs',
            'apache/cordova', 'ionic-team/ionic-framework', 'ionic-team/capacitor',
            'facebook/react-native', 'expo/expo', 'nativescript/nativescript',
            'quasarframework/quasar', 'framework7io/framework7',
            
            # 测试框架
            'jestjs/jest', 'mochajs/mocha', 'jasmine/jasmine', 'vitest-dev/vitest',
            'avajs/ava', 'substack/tape', 'qunitjs/qunit', 'karma-runner/karma',
            'cypress-io/cypress', 'microsoft/playwright', 'puppeteer/puppeteer',
            'nightwatchjs/nightwatch', 'webdriverio/webdriverio', 'angular/protractor',
            
            # 测试工具和库
            'testing-library/react-testing-library', 'testing-library/vue-testing-library',
            'enzymejs/enzyme', 'sinonjs/sinon', 'chaijs/chai', 'ladjs/supertest',
            'storybookjs/storybook', 'chromaui/chromatic', 'percy/percy-cypress',
            
            # 数据库和ORM
            'prisma/prisma', 'sequelize/sequelize', 'typeorm/typeorm', 'knex/knex',
            'drizzle-team/drizzle-orm', 'mikro-orm/mikro-orm', 'vincit/objection.js',
            'mongoose/mongoose', 'bookshelf/bookshelf', 'balderdashy/waterline',
            'dmfay/massive-js', 'porsager/postgres', 'mongodb/node-mongodb-native',
            
            # GraphQL和API
            'graphql/graphql-js', 'apollographql/apollo-server', 'apollographql/apollo-client',
            'relay/relay', 'urql-graphql/urql', 'mercurius-js/mercurius', 'hasura/graphql-engine',
            'trpc/trpc', 'grpc/grpc-node', 'node-fetch/node-fetch', 'sindresorhus/ky',
            
            # 开发工具
            'eslint/eslint', 'microsoft/tslint', 'prettier/prettier', 'standard/standard',
            'biomejs/biome', 'typicode/husky', 'okonet/lint-staged', 'commitizen/cz-cli',
            'conventional-changelog/commitlint', 'semantic-release/semantic-release',
            'release-it/release-it', 'changesets/changesets', 'conventional-changelog/standard-version',
            
            # 实用工具
            'remy/nodemon', 'kimmobrunfeldt/concurrently', 'kentcdodds/cross-env',
            'motdotla/dotenv', 'hapijs/joi', 'colinhacks/zod', 'jquense/yup',
            'ajv-validator/ajv', 'molnarg/node-http2', 'websockets/ws',
            
            # 图形和可视化
            'mrdoob/three.js', 'd3/d3', 'chartjs/Chart.js', 'plotly/plotly.js',
            'highcharts/highcharts', 'apache/echarts', 'nivo/nivo', 'recharts/recharts',
            'leaflet/leaflet', 'mapbox/mapbox-gl-js', 'openlayers/openlayers',
            
            # 编辑器和富文本
            'microsoft/monaco-editor', 'quilljs/quill', 'tinymce/tinymce',
            'ckeditor/ckeditor5', 'draftjs/draft-js', 'slatejs/slate',
            'remarkjs/remark', 'rehypejs/rehype', 'mdx-js/mdx',
            
            # 动画和交互
            'greensock/GSAP', 'juliangarnier/anime', 'popmotion/popmotion',
            'lottie-web/lottie-web', 'mojs/mojs', 'framer/motion',
            
            # 监控和分析
            'getsentry/sentry-javascript', 'bugsnag/bugsnag-js', 'rollbar/rollbar.js',
            'datadog/browser-sdk', 'newrelic/newrelic-browser-agent',
            'winstonjs/winston', 'pinojs/pino', 'trentm/node-bunyan',
            
            # 安全工具
            'cure53/DOMPurify', 'braintree/sanitize-url', 'hapijs/joi',
            'validatorjs/validator.js', 'auth0/node-jsonwebtoken', 'kelektiv/node.bcrypt.js',
            
            # 云服务集成
            'aws/aws-sdk-js', 'googleapis/google-api-nodejs-client', 'azure/azure-sdk-for-js',
            'firebase/firebase-js-sdk', 'supabase/supabase-js', 'vercel/vercel',
            'netlify/netlify-cms', 'strapi/strapi',
            
            # 其他重要项目
            'jamstack/jamstack.org', 'nodejs/help', 'nodejs/nodejs.org',
            'tc39/proposals', 'whatwg/dom', 'whatwg/fetch', 'whatwg/streams',
            'w3c/webappsec', 'w3c/webauthn', 'webassembly/wabt'
        ]
        
        # 日志配置
        self.logger = self._setup_logger()
    
    def scrape_mend_cves(self, start_date, end_date):
        """
        从Mend Vulnerability Database抓取CVE数据
        
        参数:
            start_date (datetime): 开始日期
            end_date (datetime): 结束日期
            
        返回:
            list: Mend CVE数据列表
        """
        self.logger.info(f"从Mend Vulnerability Database获取CVE数据 ({start_date.strftime('%Y-%m-%d')} 到 {end_date.strftime('%Y-%m-%d')})")
        
        all_cves = []
        current_date = start_date
        
        while current_date <= end_date:
            year = current_date.strftime('%Y')
            month = current_date.strftime('%m')
            
            self.logger.info(f"[MEND] 抓取 {year}年{month}月 的CVE数据...")
            
            try:
                # 构建Mend URL
                url = f"{self.mend_base_url}/full-listing/{year}/{month}"
                
                # 获取页面内容
                response = self.session.get(url, timeout=30)
                if response.status_code != 200:
                    self.logger.warning(f"[MEND] 页面 {year}-{month} 请求失败: {response.status_code}")
                    current_date += timedelta(days=32)  # 跳到下个月
                    continue
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # 获取最大页数
                try:
                    pagination_items = soup.find_all("li", class_="vuln-pagination-item")
                    if pagination_items:
                        max_page = int(pagination_items[-2].text.strip())
                    else:
                        max_page = 1
                except Exception:
                    max_page = 1
                
                self.logger.info(f"[MEND] {year}-{month} 共有 {max_page} 页")
                
                # 遍历所有页面
                for page in range(1, max_page + 1):
                    if page > 1:
                        page_url = f"{url}/{page}"
                        response = self.session.get(page_url, timeout=30)
                        if response.status_code != 200:
                            continue
                        soup = BeautifulSoup(response.content, 'html.parser')
                    
                    # 查找CVE链接
                    cve_links = soup.find_all("a", href=re.compile("^/vulnerability-database/CVE"))
                    
                    for link in cve_links:
                        cve_href = link.get("href")
                        cve_id = cve_href.split('/')[-1]
                        
                        # 获取CVE详细信息
                        cve_detail = self.get_mend_cve_detail(cve_id)
                        if cve_detail:
                            # 添加年月信息
                            cve_detail['year'] = year
                            cve_detail['month'] = month
                            all_cves.append(cve_detail)
                    
                    # 添加延迟避免请求过快
                    time.sleep(1)
                
                # 为每个CVE添加年月信息
                month_cves = [c for c in all_cves if c.get('year') == year and c.get('month') == month]
                self.logger.info(f"[MEND] {year}-{month} 完成，找到 {len(month_cves)} 个CVE")
                
            except Exception as e:
                self.logger.error(f"[MEND] 抓取 {year}-{month} 时出错: {e}")
            
            # 跳到下个月
            current_date += timedelta(days=32)
        
        self.total_mend_cves = len(all_cves)
        self.logger.info(f"[MEND] 总共从Mend获取到 {len(all_cves)} 个CVE")
        return all_cves
    
    def get_mend_cve_detail(self, cve_id):
        """
        获取Mend CVE详细信息
        
        参数:
            cve_id (str): CVE ID
            
        返回:
            dict: CVE详细信息
        """
        try:
            url = f"{self.mend_base_url}/{cve_id}"
            response = self.session.get(url, timeout=30)
            
            if response.status_code != 200:
                return None
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 提取基本信息
            cve_data = {
                'cve_id': cve_id,
                'source': 'mend'
            }
            
            # 提取日期
            date_tag = soup.find("h4", string=re.compile("Date:"))
            if date_tag:
                date_text = date_tag.text.strip().replace("Date:", "").strip()
                cve_data['publish_date'] = date_text
            
            # 提取语言
            language_tag = soup.find("h4", string=re.compile("Language:"))
            if language_tag:
                language_text = language_tag.text.strip().replace("Language:", "").strip()
                cve_data['language'] = language_text
            
            # 提取描述
            desc_div = soup.find("div", class_="single-vuln-desc no-good-to-know")
            if not desc_div:
                desc_div = soup.find("div", class_="single-vuln-desc")
            
            if desc_div:
                desc_p = desc_div.find("p")
                if desc_p:
                    cve_data['summary'] = desc_p.text.strip()
            
            # 提取CVSS分数
            severity_div = soup.find("div", class_="ranger-value")
            if severity_div:
                label = severity_div.find("label")
                if label:
                    cve_data['cvss_score'] = label.text.strip()
            
            # 提取CWE信息
            cwe_links = []
            light_boxes = soup.find_all("div", class_="light-box")
            for box in light_boxes:
                for link in box.find_all("a", href=True):
                    if "CWE" in link.text:
                        cwe_links.append(link.text)
            cve_data['cwe_id'] = ', '.join(cwe_links) if cwe_links else 'N/A'
            
            # 提取参考链接
            reference_links = []
            ref_rows = soup.find_all("div", class_="reference-row")
            for ref_row in ref_rows:
                for link in ref_row.find_all("a", href=True):
                    reference_links.append(link["href"])
            cve_data['references'] = reference_links
            
            # 提取CVSS详细指标
            cvss_table = soup.find("table", class_="table table-report")
            if cvss_table:
                for tr in cvss_table.find_all("tr"):
                    th = tr.find('th')
                    td = tr.find('td')
                    if th and td:
                        th_text = th.text.strip()
                        td_text = td.text.strip()
                        
                        if "Attack Vector" in th_text:
                            cve_data['AV'] = td_text
                        elif "Attack Complexity" in th_text:
                            cve_data['AC'] = td_text
                        elif "Privileges Required" in th_text:
                            cve_data['PR'] = td_text
                        elif "User Interaction" in th_text:
                            cve_data['UI'] = td_text
                        elif "Scope" in th_text:
                            cve_data['S'] = td_text
                        elif "Confidentiality" in th_text:
                            cve_data['C'] = td_text
                        elif "Integrity" in th_text:
                            cve_data['I'] = td_text
                        elif "Availability" in th_text:
                            cve_data['A'] = td_text
            
            return cve_data
            
        except Exception as e:
            self.logger.error(f"[MEND] 获取CVE {cve_id} 详情时出错: {e}")
            return None
    
    def is_javascript_related_mend(self, cve_data):
        """
        判断Mend CVE是否与JavaScript相关
        
        参数:
            cve_data (dict): Mend CVE数据
            
        返回:
            tuple: (是否相关, 原因)
        """
        try:
            # 检查语言
            language = cve_data.get('language', '').lower()
            if 'javascript' in language or 'js' in language or 'node' in language:
                return True, f"Language: {language}"
            
            # 检查描述
            summary = cve_data.get('summary', '').lower()
            for keyword in self.js_keywords:
                if keyword.lower() in summary:
                    return True, f"Summary contains: {keyword}"
            
            # 检查引用链接
            references = cve_data.get('references', [])
            for ref in references:
                ref_lower = ref.lower()
                for project in self.js_projects:
                    if f"github.com/{project}" in ref_lower:
                        return True, f"GitHub project: {project}"
                
                if 'npmjs.com' in ref_lower or 'npm' in ref_lower:
                    return True, "NPM related"
                
                js_domains = ['nodejs.org', 'reactjs.org', 'vuejs.org', 'angular.io']
                for domain in js_domains:
                    if domain in ref_lower:
                        return True, f"JS domain: {domain}"
            
            return False, ""
            
        except Exception as e:
            self.logger.error(f"检查Mend CVE JavaScript相关性时出错: {e}")
            return False, ""
    
    def extract_mend_cve_info(self, cve_data):
        """
        提取Mend CVE信息，转换为标准格式
        
        参数:
            cve_data (dict): Mend CVE数据
            
        返回:
            dict: 标准格式的CVE信息
        """
        try:
            cve_id = cve_data.get('cve_id', 'N/A')
            
            # 获取描述
            summary = cve_data.get('summary', 'N/A')
            
            # 获取CVSS分数
            cvss_score = cve_data.get('cvss_score', 'N/A')
            
            # 计算严重性
            severity = "UNKNOWN"
            if cvss_score != 'N/A':
                try:
                    score = float(cvss_score)
                    if score >= 9.0:
                        severity = 'CRITICAL'
                    elif score >= 7.0:
                        severity = 'HIGH'
                    elif score >= 4.0:
                        severity = 'MEDIUM'
                    elif score > 0.0:
                        severity = 'LOW'
                    else:
                        severity = 'NONE'
                except (ValueError, TypeError):
                    severity = 'UNKNOWN'
            
            # 获取发布日期
            published = cve_data.get('publish_date', 'N/A')
            
            # 获取CWE信息
            cwe_id = cve_data.get('cwe_id', 'N/A')
            
            # 提取代码链接
            references = cve_data.get('references', [])
            code_links = []
            for ref in references:
                if any(domain in ref.lower() for domain in [
                    'github.com', 'npmjs.com', 'npm.im', 'gitlab.com', 'bitbucket.org'
                ]):
                    code_links.append(ref)
            
            # 提取项目名称
            project_name = "N/A"
            for ref in code_links:
                if 'github.com' in ref.lower():
                    try:
                        parts = ref.split('/')
                        if len(parts) >= 5 and parts[2].lower() == 'github.com':
                            project_name = f"{parts[3]}/{parts[4]}"
                            if project_name and '.' not in parts[3] and parts[3] != 'repos':
                                break
                    except:
                        continue
            
            # 判断项目类型
            project_type = self.determine_enhanced_project_type_mend(cve_data, project_name, code_links)
            
            # 漏洞分类
            vuln_classification = self.classify_vulnerability_enhanced(summary, [cwe_id] if cwe_id != 'N/A' else [])
            
            return {
                'cve_id': cve_id,
                'vulnerability_classification': vuln_classification,
                'cvss_score': str(cvss_score),
                'severity': severity,
                'publish_date': published,
                'summary': summary,
                'code_link': '; '.join(code_links),
                'project_name': project_name,
                'project_type': project_type,
                'cwe_id': cwe_id,
                'source': 'mend'
            }
            
        except Exception as e:
            self.logger.error(f"提取Mend CVE信息时出错: {e}")
            return None
    
    def determine_enhanced_project_type_mend(self, cve_data, project_name, code_links):
        """
        为Mend CVE判断项目类型
        """
        # 收集所有相关文本
        all_text = ""
        summary = cve_data.get('summary', '')
        if summary:
            all_text += " " + summary.lower()
        
        if project_name and project_name != "N/A":
            all_text += " " + project_name.lower()
        
        for link in code_links:
            all_text += " " + link.lower()
        
        # 使用原有的项目类型判断逻辑
        return self._classify_by_exact_project_name(project_name) if project_name != "N/A" else "Unknown"
    
    def _classify_by_exact_project_name(self, project_name):
        """通过精确的项目名称判断类型"""
        if not project_name or project_name == "N/A":
            return "Unknown"
            
        project_lower = project_name.lower()
        
        # 明确的前端项目
        frontend_projects = {
            'react', 'vue', 'angular', 'svelte', 'preact', 'lit', 'stencil', 'qwik',
            'ember', 'backbone', 'knockout', 'mithril', 'hyperapp', 'inferno', 'riot',
            'alpinejs', 'alpine', 'stimulus', 'aurelia', 'solid', 'solidjs',
            'jquery', 'zepto', 'cash', 'umbrella', 'bootstrap', 'foundation', 
            'bulma', 'semantic-ui', 'material-ui', 'mui', 'ant-design', 'antd',
            'webpack', 'rollup', 'parcel', 'vite', 'snowpack', 'wmr', 'rome', 'farm',
            'babel', 'swc', 'esbuild', 'terser', 'uglifyjs', 'closure-compiler'
        }
        
        # 明确的后端项目
        backend_projects = {
            'express', 'koa', 'fastify', 'hapi', 'restify', 'loopback', 'actionhero',
            'frisby', 'total.js', 'feathers', 'sailsjs', 'sails', 'adonisjs', 'adonis',
            'mongoose', 'sequelize', 'prisma', 'typeorm', 'knex', 'drizzle', 'mikro-orm',
            'passport', 'jsonwebtoken', 'jwt', 'bcrypt', 'bcryptjs', 'argon2',
            'helmet', 'cors', 'express-rate-limit', 'express-validator'
        }
        
        # 全栈框架
        fullstack_projects = {
            'next.js', 'nextjs', 'nuxt', 'nuxtjs', 'remix', 'remix-run', 'gatsby', 'gatsbyjs',
            'meteor', 'meteorjs', 'sails', 'sailsjs', 'adonis', 'adonisjs', 'nest', 'nestjs',
            'keystonejs', 'keystone', 'strapi', 'directus', 'ghost', 'tryghost',
            'sveltekit', 'solid-start', 'solidstart', 'blitz', 'blitzjs', 'redwood', 'redwoodjs'
        }
        
        # 检查项目名称
        for proj in fullstack_projects:
            if proj in project_lower or project_lower.endswith(f'/{proj}') or project_lower.startswith(f'{proj}/'):
                return "Full-stack"
        
        for proj in frontend_projects:
            if proj in project_lower or project_lower.endswith(f'/{proj}') or project_lower.startswith(f'{proj}/'):
                return "Frontend"
        
        for proj in backend_projects:
            if proj in project_lower or project_lower.endswith(f'/{proj}') or project_lower.startswith(f'{proj}/'):
                return "Backend"
        
        return "Unknown"
    
    def test_api_connection(self):
        """测试API连接"""
        logger.info("测试NVD API连接...")
        
        # 使用最简单的测试请求，不带日期参数
        test_params = {
            'resultsPerPage': 1,
            'startIndex': 0
        }
        
        # 构建测试请求头
        test_headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        # 如果使用API Key，直接测试API Key（在请求头中）
        if USE_API_KEY and self.api_key:
            logger.info("[KEY] 测试API Key连接...")
            test_headers['apiKey'] = self.api_key.strip()
            
            try:
                response = self.session.get(self.base_url, params=test_params, headers=test_headers, timeout=30)
                logger.info(f"API Key测试状态码: {response.status_code}")
                
                if response.status_code == 200:
                    logger.info("[OK] API Key连接成功")
                    return True
                elif response.status_code == 403:
                    logger.error("[ERROR] API Key无效或无权限")
                    logger.error("请检查API Key是否正确或是否有相关权限")
                    return False
                elif response.status_code == 404:
                    logger.error("[ERROR] API Key无效")
                    logger.error("响应头信息:")
                    for key, value in response.headers.items():
                        if 'message' in key.lower():
                            logger.error(f"  {key}: {value}")
                    logger.error("可能的解决方案:")
                    logger.error("  1. 检查API Key格式是否正确")
                    logger.error("  2. 确认API Key未过期")
                    logger.error("  3. 重新申请API Key: https://nvd.nist.gov/developers/request-an-api-key")
                    return False
                else:
                    logger.error(f"[ERROR] API Key测试失败: {response.status_code}")
                    logger.error(f"响应内容: {response.text[:300]}...")
                    return False
                    
            except Exception as e:
                logger.error(f"[ERROR] API Key测试出错: {e}")
                return False
        else:
            # 测试公共访问（但用户不想要这个）
            logger.info("[!] 未配置API Key，测试公共访问...")
            try:
                response = self.session.get(self.base_url, params=test_params, headers=test_headers, timeout=30)
                if response.status_code == 200:
                    logger.info("[OK] 公共访问连接成功")
                    return True
            except Exception as e:
                logger.error(f"[ERROR] 公共访问测试出错: {e}")
                return False
        
        logger.error("[ERROR] 所有URL测试都失败了")
        return False
    
    def _setup_logger(self):
        """设置日志记录器"""
        logger = logging.getLogger('JSCVEScraper')
        logger.setLevel(logging.INFO)
        
        # 创建控制台处理器
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        
        # 创建文件处理器
        os.makedirs('logs', exist_ok=True)
        file_handler = logging.FileHandler('logs/js_cve_scraper.log')
        file_handler.setLevel(logging.DEBUG)
        
        # 创建格式化器
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        console_handler.setFormatter(formatter)
        file_handler.setFormatter(formatter)
        
        # 添加处理器到记录器
        logger.addHandler(console_handler)
        logger.addHandler(file_handler)
        
        return logger
    
    def search_nvd_cves(self, start_date, end_date, results_per_page=None):
        """
        使用NVD API搜索CVE
        
        参数:
            start_date (datetime): 开始日期
            end_date (datetime): 结束日期
            results_per_page (int): 每页结果数
            
        返回:
            list: CVE数据列表
        """
        # 使用配置变量设置每页结果数
        if results_per_page is None:
            results_per_page = RESULTS_PER_PAGE
            
        self.logger.info(f"从NVD API获取CVE数据 ({start_date.strftime('%Y-%m-%d')} 到 {end_date.strftime('%Y-%m-%d')})")
        self.logger.info(f"每页结果数: {results_per_page}")
        
        all_cves = []
        start_index = 0
        total_results = None
        
        # 检查日期范围限制（NVD API最大120天）
        date_range_days = (end_date - start_date).days
        if date_range_days > 12000:
            logger.error(f"[ERROR] 日期范围超过NVD API限制：{date_range_days}天 > 120天")
            logger.error("请将日期范围调整到120天以内")
            return []
        
        # 确保日期格式正确 - 使用ISO 8601格式，包含Z表示UTC时区
        start_date_str = start_date.strftime('%Y-%m-%dT%H:%M:%S.000Z')
        end_date_str = end_date.strftime('%Y-%m-%dT%H:%M:%S.000Z')  # 简化格式
        
        logger.info(f"使用日期格式: {start_date_str} 到 {end_date_str} ({date_range_days}天)")
        
        # 使用正确的API端点
        current_url = self.base_url
        
        while total_results is None or start_index < total_results:
            # 构建请求参数 - API Key应该在参数中
            params = {
                'pubStartDate': start_date_str,
                'pubEndDate': end_date_str,
                'resultsPerPage': results_per_page,
                'startIndex': start_index
            }
            
            # 构建请求头 - API Key必须在header中，不是参数中！
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            # 如果启用API Key且有API Key，添加到请求头中
            if USE_API_KEY and self.api_key:
                # 验证API Key格式（基本验证）
                if len(self.api_key.strip()) > 20:
                    headers['apiKey'] = self.api_key.strip()
                    # 只在第一次请求时显示API Key信息
                    if start_index == 0:
                        self.logger.info("[API_KEY] 使用API Key进行请求")
                else:
                    self.logger.warning(f"[API_KEY] API Key格式可能无效（长度：{len(self.api_key)}），跳过")
            
            try:
                # 只在第一次请求时显示详细信息
                if start_index == 0:
                    self.logger.info(f"[API_REQUEST] 请求URL: {current_url}")
                    self.logger.info(f"[API_REQUEST] 时间范围: {params['pubStartDate']} 到 {params['pubEndDate']}")
                
                response = self.session.get(current_url, params=params, headers=headers, timeout=30)
                
                # 检查响应状态
                if response.status_code == 200:
                    # 解析响应数据
                    data = response.json()
                    
                    # 检查响应格式
                    if 'vulnerabilities' in data:
                        # 获取CVE数据
                        cves = data.get('vulnerabilities', [])
                        all_cves.extend(cves)
                        
                        # 更新分页信息
                        total_results = data.get('totalResults', 0)
                        
                        # 只在第一次请求时显示总数说明并保存总数
                        if start_index == 0:
                            self.total_api_cves = total_results  # 保存总CVE数
                            self.logger.info(f"[API_INFO] NVD API显示该时间段内共有 {total_results} 条CVE (包含所有类型)")
                            self.logger.info(f"[API_INFO] 正在下载并筛选JavaScript相关CVE...")
                        
                        self.logger.info(f"[PROGRESS] 已获取 {len(all_cves)}/{total_results} 条CVE数据")
                        
                        start_index += results_per_page
                        
                        # 添加延迟，避免超过API限制
                        delay = 6 if not USE_API_KEY else 0.6
                        if len(all_cves) < total_results:  # 只有还有更多数据时才等待
                            time.sleep(delay)
                    else:
                        self.logger.error(f"[API_ERROR] API响应格式不符合预期: {data}")
                        self.logger.error(f"[API_ERROR] 期望包含 'vulnerabilities' 键，但实际键为: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
                        break
                else:
                    self.logger.error(f"[API_ERROR] API请求失败: {response.status_code}")
                    self.logger.error(f"[API_ERROR] 响应头: {dict(response.headers)}")
                    self.logger.error(f"[API_ERROR] 完整响应内容: {response.text}")
                    self.logger.error(f"[API_ERROR] 请求URL: {response.url}")
                    self.logger.error(f"[API_ERROR] 请求参数: {params}")
                    break
                    
            except Exception as e:
                self.logger.error(f"请求出错: {e}")
                break
        
        self.logger.info(f"共获取到 {len(all_cves)} 条CVE数据")
        return all_cves
    
    def scrape_cvedetails(self, cvss_min_score=6.0, max_pages=10):
        """从CVE Details网站抓取CVE数据（参考cve-collector方法）"""
        logger.info(f"从CVE Details抓取CVSS >= {cvss_min_score}的CVE数据...")
        
        cves = []
        page = 1
        
        while page <= max_pages:
            try:
                # 构建搜索URL
                search_url = f"{self.cvedetails_url}/vulnerability-search.php"
                params = {
                    'cvssscoremin': cvss_min_score,
                    'page': page
                }
                
                response = self.session.get(search_url, params=params, timeout=30)
                
                if response.status_code != 200:
                    logger.error(f"页面 {page} 请求失败: {response.status_code}")
                    break
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # 查找CVE表格
                cve_table = soup.find('table', {'id': 'vulnslisttable'})
                if not cve_table:
                    logger.info(f"页面 {page} 没有找到CVE表格，停止抓取")
                    break
                
                # 解析CVE行
                cve_rows = cve_table.find_all('tr', {'class': 'srrowns'})
                if not cve_rows:
                    logger.info(f"页面 {page} 没有找到CVE行，停止抓取")
                    break
                
                page_cves = 0
                for row in cve_rows:
                    try:
                        cve_data = self.parse_cve_row(row)
                        if cve_data:
                            cves.append(cve_data)
                            page_cves += 1
                    except Exception as e:
                        logger.error(f"解析CVE行时出错: {e}")
                        continue
                
                logger.info(f"页面 {page} 找到 {page_cves} 个CVE")
                
                if page_cves == 0:
                    break
                
                page += 1
                time.sleep(2)  # 避免请求过快
                
            except Exception as e:
                logger.error(f"抓取页面 {page} 时出错: {e}")
                break
        
        logger.info(f"总共从CVE Details抓取到 {len(cves)} 个CVE")
        return cves
    
    def parse_cve_row(self, row):
        """解析CVE表格行"""
        try:
            cells = row.find_all('td')
            if len(cells) < 8:
                return None
            
            # 提取基本信息
            cve_id = cells[1].get_text(strip=True)
            cvss_score = cells[4].get_text(strip=True)
            severity = cells[5].get_text(strip=True)
            publish_date = cells[6].get_text(strip=True)
            update_date = cells[7].get_text(strip=True)
            
            # 获取CVE详情链接
            cve_link = cells[1].find('a')
            if cve_link:
                cve_url = self.cvedetails_url + cve_link.get('href')
                cve_details = self.get_cve_details(cve_url)
            else:
                cve_details = {}
            
            # 检查是否为JavaScript相关
            if not self.is_javascript_related_from_details(cve_details, cve_id):
                return None
            
            return {
                'cve_id': cve_id,
                'cvss_score': cvss_score,
                'severity': severity,
                'publish_date': publish_date,
                'update_date': update_date,
                'summary': cve_details.get('summary', ''),
                'cwe_id': cve_details.get('cwe_id', ''),
                'references': cve_details.get('references', []),
                'source': 'cvedetails'
            }
            
        except Exception as e:
            logger.error(f"解析CVE行时出错: {e}")
            return None
    
    def get_cve_details(self, cve_url):
        """获取CVE详细信息"""
        try:
            response = self.session.get(cve_url, timeout=30)
            if response.status_code != 200:
                return {}
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            details = {}
            
            # 提取摘要
            summary_div = soup.find('div', {'class': 'cvedetailssummary'})
            if summary_div:
                details['summary'] = summary_div.get_text(strip=True)
            
            # 提取CWE
            cwe_div = soup.find('div', string=re.compile(r'CWE-\d+'))
            if cwe_div:
                details['cwe_id'] = cwe_div.get_text(strip=True)
            
            # 提取引用链接
            references = []
            ref_table = soup.find('table', {'id': 'vulnrefstable'})
            if ref_table:
                ref_rows = ref_table.find_all('tr')
                for ref_row in ref_rows:
                    ref_link = ref_row.find('a')
                    if ref_link:
                        references.append(ref_link.get('href', ''))
            
            details['references'] = references
            
            return details
            
        except Exception as e:
            logger.error(f"获取CVE详情时出错: {e}")
            return {}
    
    def is_javascript_related_from_details(self, cve_details, cve_id):
        """从CVE详情判断是否与JavaScript相关"""
        try:
            # 检查摘要
            summary = cve_details.get('summary', '').lower()
            for keyword in self.js_keywords:
                if keyword.lower() in summary:
                    return True
            
            # 检查引用链接
            references = cve_details.get('references', [])
            for ref in references:
                ref_lower = ref.lower()
                for project in self.js_projects:
                    if f"github.com/{project}" in ref_lower:
                        return True
                
                if 'npmjs.com' in ref_lower or 'npm' in ref_lower:
                    return True
                
                js_domains = ['nodejs.org', 'reactjs.org', 'vuejs.org', 'angular.io']
                for domain in js_domains:
                    if domain in ref_lower:
                        return True
            
            return False
            
        except Exception as e:
            logger.error(f"检查JavaScript相关性时出错: {e}")
            return False
    
    def is_javascript_related(self, cve_data):
        """判断CVE是否与JavaScript相关（NVD API方法）"""
        try:
            cve = cve_data.get('cve', {})
            descriptions = cve.get('descriptions', [])
            references = cve.get('references', [])
            
            # 检查描述
            for desc in descriptions:
                if desc.get('lang') == 'en':
                    description_text = desc.get('value', '').lower()
                    for keyword in self.js_keywords:
                        if keyword.lower() in description_text:
                            return True, f"Description contains: {keyword}"
            
            # 检查引用链接
            for ref in references:
                url = ref.get('url', '').lower()
                for project in self.js_projects:
                    if f"github.com/{project}" in url:
                        return True, f"GitHub project: {project}"
                
                # 检查npm相关链接
                if 'npmjs.com' in url or 'npm' in url:
                    return True, "NPM related"
                    
                # 检查其他JavaScript相关域名
                js_domains = ['nodejs.org', 'reactjs.org', 'vuejs.org', 'angular.io']
                for domain in js_domains:
                    if domain in url:
                        return True, f"JS domain: {domain}"
            
            return False, ""
            
        except Exception as e:
            logger.error(f"检查JavaScript相关性时出错: {e}")
            return False, ""
    
    def extract_enhanced_code_links(self, cve_data):
        """
        增强的代码链接提取算法
        
        参数:
            cve_data (dict): CVE数据
            
        返回:
            list: 代码链接列表
        """
        references = cve_data.get('cve', {}).get('references', [])
        code_links = []
        
        # 进度提示
        total_refs = len(references)
        logger.debug(f"[LINK_EXTRACT] 开始提取链接，共 {total_refs} 个引用")
        
        for i, ref in enumerate(references):
            url = ref.get('url', '')
            url_lower = url.lower()
            
            # GitHub相关链接
            if 'github.com' in url_lower:
                # 代码相关链接
                code_indicators = [
                    'commit', 'pull', 'issues', 'compare', 'blob', 'tree', 
                    'releases', 'tags', 'archive', 'tarball', 'zipball',
                    'patch', 'diff', 'raw', 'blame'
                ]
                if any(indicator in url_lower for indicator in code_indicators):
                    code_links.append(url)
                # GitHub仓库主页也算作代码链接
                elif len([p for p in url.split('/') if p]) == 5:  # github.com/owner/repo
                    code_links.append(url)
            
            # NPM相关链接
            elif 'npmjs.com' in url_lower or 'npm.im' in url_lower:
                code_links.append(url)
            
            # 其他代码托管平台
            elif any(platform in url_lower for platform in [
                'gitlab.com', 'gitlab.org', 'bitbucket.org', 'sourceforge.net',
                'codeberg.org', 'gitee.com', 'git.sr.ht', 'notabug.org'
            ]):
                code_links.append(url)
            
            # 安全公告和修复信息
            elif any(keyword in url_lower for keyword in [
                'security', 'advisory', 'fix', 'patch', 'update', 'fix-for',
                'vulnerability', 'cve', 'alert', 'bulletin'
            ]):
                code_links.append(url)
            
            # 官方项目网站和文档
            elif any(domain in url_lower for domain in [
                'nodejs.org', 'reactjs.org', 'vuejs.org', 'angular.io',
                'electronjs.org', 'webpack.js.org', 'babeljs.io',
                'jestjs.io', 'mochajs.org', 'expressjs.com'
            ]):
                code_links.append(url)
        
        logger.debug(f"[LINK_EXTRACT] 完成链接提取，共找到 {len(code_links)} 个代码相关链接")
        return list(set(code_links))  # 去重
    
    def extract_enhanced_project_name(self, cve_data, code_links):
        """
        增强的项目名称提取算法
        
        参数:
            cve_data (dict): CVE数据
            code_links (list): 代码链接列表
            
        返回:
            str: 项目名称
        """
        project_names = set()
        
        # 从GitHub链接提取项目名称
        for link in code_links:
            if 'github.com' in link.lower():
                try:
                    parts = link.split('/')
                    if len(parts) >= 5 and parts[2].lower() == 'github.com':
                        project_name = f"{parts[3]}/{parts[4]}"
                        # 验证项目名称格式
                        if project_name and '.' not in parts[3] and parts[3] != 'repos':
                            project_names.add(project_name)
                except:
                    continue
        
        # 从NPM链接提取包名
        for link in code_links:
            if 'npmjs.com' in link.lower():
                try:
                    if '/package/' in link:
                        package_name = link.split('/package/')[-1].split('/')[0].split('?')[0]
                        if package_name:
                            project_names.add(f"npm/{package_name}")
                except:
                    continue
        
        # 从CVE描述中提取已知项目名称
        cve = cve_data.get('cve', {})
        descriptions = cve.get('descriptions', [])
        
        for desc in descriptions:
            if desc.get('lang') == 'en':
                desc_text = desc.get('value', '').lower()
                # 检查已知的JavaScript项目
                for project in self.js_projects[:50]:  # 只检查前50个最重要的项目，避免过度匹配
                    project_lower = project.lower()
                    project_name = project.split('/')[-1]
                    
                    # 检查完整项目路径
                    if project_lower in desc_text:
                        project_names.add(project)
                        break
                    # 检查项目名称
                    elif project_name in desc_text and len(project_name) > 3:  # 避免太短的匹配
                        project_names.add(project)
                        break
        
        # 优先返回GitHub项目，其次NPM包
        github_projects = [p for p in project_names if not p.startswith('npm/')]
        npm_packages = [p for p in project_names if p.startswith('npm/')]
        
        if github_projects:
            return github_projects[0]
        elif npm_packages:
            return npm_packages[0]
        else:
            return "N/A"
    
    def determine_enhanced_project_type(self, cve_data, project_name, code_links):
        """
        增强的项目类型判断算法（前端/后端/全栈/未知）
        """
        # 收集所有相关文本
        all_text = ""
        cve = cve_data.get('cve', {})
        descriptions = cve.get('descriptions', [])
        for desc in descriptions:
            if desc.get('lang') == 'en':
                all_text += " " + desc.get('value', '').lower()
        
        if project_name and project_name != "N/A":
            all_text += " " + project_name.lower()
        
        for link in code_links:
            all_text += " " + link.lower()
        
        # 优先级1: 精确的项目名称匹配
        if project_name and project_name != "N/A":
            project_type = self._classify_by_exact_project_name(project_name)
            if project_type != "Unknown":
                return project_type
        
        # 优先级2: URL模式分析
        url_type = self._classify_by_url_patterns(code_links)
        if url_type != "Unknown":
            return url_type
        
        # 优先级3: 技术栈关键词分析（权重版本）
        tech_type = self._classify_by_technology_keywords(all_text)
        if tech_type != "Unknown":
            return tech_type
        
        # 优先级4: 上下文分析
        context_type = self._classify_by_context_analysis(all_text)
        if context_type != "Unknown":
            return context_type
        
        return "Unknown"
    
    def _classify_by_exact_project_name(self, project_name):
        """通过精确的项目名称判断类型"""
        project_lower = project_name.lower()
        
        # 明确的前端项目 - 大幅扩展
        frontend_projects = {
            # 核心前端框架
            'react', 'vue', 'angular', 'svelte', 'preact', 'lit', 'stencil', 'qwik',
            'ember', 'backbone', 'knockout', 'mithril', 'hyperapp', 'inferno', 'riot',
            'alpinejs', 'alpine', 'stimulus', 'aurelia', 'solid', 'solidjs',
            
            # UI库和组件
            'jquery', 'zepto', 'cash', 'umbrella', '$', 'bootstrap', 'foundation', 
            'bulma', 'semantic-ui', 'material-ui', 'mui', 'ant-design', 'antd',
            'element-ui', 'vuetify', 'quasar', 'chakra-ui', 'mantine', 'headlessui',
            'react-bootstrap', 'reactstrap', 'grommet', 'evergreen', 'rebass',
            'theme-ui', 'tailwindcss', 'tailwind', 'windicss', 'twind',
            
            # 构建工具和打包器
            'webpack', 'rollup', 'parcel', 'vite', 'snowpack', 'wmr', 'rome', 'farm',
            'babel', 'swc', 'esbuild', 'terser', 'uglifyjs', 'closure-compiler',
            'grunt', 'gulp', 'browserify', 'requirejs', 'systemjs',
            
            # 状态管理
            'redux', 'mobx', 'recoil', 'zustand', 'jotai', 'valtio', 'akita',
            'effector', 'overmind', 'vuex', 'pinia', 'ngrx', 'flux', 'reflux',
            
            # 工具库
            'lodash', 'underscore', 'ramda', 'immutable', 'moment', 'dayjs',
            'date-fns', 'luxon', 'axios', 'fetch', 'superagent', 'got',
            
            # 图形和可视化
            'three.js', 'd3', 'chart.js', 'plotly.js', 'leaflet', 'mapbox',
            'openlayers', 'cesium', 'highcharts', 'echarts', 'recharts', 'nivo',
            
            # 测试工具
            'cypress', 'playwright', 'puppeteer', 'selenium', 'webdriver',
            'testing-library', 'enzyme', 'storybook', 'chromatic',
            
            # 样式和CSS
            'styled-components', 'emotion', 'linaria', 'stitches', 'goober',
            'postcss', 'sass', 'less', 'stylus',
            
            # 桌面和移动
            'electron', 'tauri', 'nwjs', 'neutralino', 'cordova', 'phonegap',
            'ionic', 'react-native', 'expo', 'nativescript', 'capacitor',
            
            # 开发工具
            'eslint', 'prettier', 'standardjs', 'jshint', 'jslint'
        }
        
        # 明确的后端项目 - 大幅扩展
        backend_projects = {
            # 后端框架
            'express', 'koa', 'fastify', 'hapi', 'restify', 'loopback', 'actionhero',
            'frisby', 'total.js', 'feathers', 'sailsjs', 'sails', 'adonisjs', 'adonis',
            
            # 数据库和ORM
            'mongoose', 'sequelize', 'prisma', 'typeorm', 'knex', 'drizzle', 'mikro-orm',
            'objection', 'bookshelf', 'waterline', 'massive', 'mongodb', 'redis',
            'mysql', 'mysql2', 'pg', 'postgres', 'sqlite3', 'better-sqlite3',
            
            # 认证和安全
            'passport', 'jsonwebtoken', 'jwt', 'bcrypt', 'bcryptjs', 'argon2',
            'helmet', 'cors', 'express-rate-limit', 'express-validator',
            'joi', 'yup', 'ajv', 'validator', 'sanitize-html', 'dompurify',
            
            # 文件处理
            'multer', 'formidable', 'busboy', 'sharp', 'jimp', 'gm', 'imagemin',
            'fs-extra', 'graceful-fs', 'glob', 'minimatch', 'chokidar',
            
            # 网络和HTTP
            'axios', 'got', 'node-fetch', 'superagent', 'request', 'needle',
            'socket.io', 'ws', 'uws', 'sockjs', 'engine.io', 'socketcluster',
            
            # 任务队列和调度
            'bull', 'agenda', 'kue', 'bee-queue', 'node-cron', 'cron',
            'node-schedule', 'later', 'bull-board', 'arena',
            
            # 日志和监控
            'winston', 'pino', 'bunyan', 'log4js', 'morgan', 'debug',
            'consola', 'signale', 'chalk', 'colors', 'kleur',
            
            # 进程管理
            'pm2', 'nodemon', 'forever', 'supervisor', 'node-dev', 'concurrently',
            'cross-env', 'dotenv', 'config', 'nconf', 'rc',
            
            # 邮件和通知
            'nodemailer', 'emailjs', 'mail', 'sendgrid', 'mailgun', 'postmark',
            'twilio', 'pusher', 'firebase-admin',
            
            # 缓存和会话
            'redis', 'memcached', 'node-cache', 'memory-cache', 'lru-cache',
            'express-session', 'connect-redis', 'connect-mongo', 'cookie-parser',
            
            # 模板引擎
            'ejs', 'pug', 'jade', 'handlebars', 'mustache', 'nunjucks',
            'hogan', 'dust', 'liquid', 'twig',
            
            # 压缩和解析
            'compression', 'body-parser', 'express-fileupload', 'cookie-parser',
            'express-rate-limit', 'slowdown', 'hpp',
            
            # API和GraphQL
            'apollo-server', 'graphql', 'graphql-yoga', 'mercurius', 'type-graphql',
            'express-graphql', 'fastify-gql', 'hasura', 'relay',
            
            # 其他重要后端工具
            'puppeteer', 'playwright-server', 'cheerio', 'jsdom', 'node-html-parser',
            'csv-parser', 'papaparse', 'xml2js', 'fast-xml-parser', 'yamljs'
        }
        
        # 全栈框架 - 大幅扩展
        fullstack_projects = {
            'next.js', 'nextjs', 'nuxt', 'nuxtjs', 'remix', 'remix-run', 'gatsby', 'gatsbyjs',
            'meteor', 'meteorjs', 'sails', 'sailsjs', 'adonis', 'adonisjs', 'nest', 'nestjs',
            'keystonejs', 'keystone', 'strapi', 'directus', 'ghost', 'tryghost',
            'wordpress', 'wp', 'drupal', 'joomla', 'concrete5', 'silverstripe',
            'sveltekit', 'solid-start', 'solidstart', 'blitz', 'blitzjs', 'redwood', 'redwoodjs',
            't3-stack', 'create-t3-app', 'astro', 'astrojs', 'fresh', 'deno-fresh',
            'docusaurus', 'vuepress', 'gridsome', 'scully', 'scullyio', 'eleventy', '11ty',
            'hexo', 'jekyll', 'hugo', 'gitbook', 'docsify', 'vitepress',
            'mean', 'mern', 'mevn', 'lamp', 'jamstack', 'universal-app', 'isomorphic'
        }
        
        # 桌面/移动应用
        desktop_mobile_projects = {
            'electron', 'electronjs', 'tauri', 'nwjs', 'cordova', 'phonegap',
            'ionic', 'react-native', 'expo', 'nativescript', 'capacitor'
        }
        
        # 检查项目名称
        for proj in fullstack_projects:
            if proj in project_lower or project_lower.endswith(f'/{proj}') or project_lower.startswith(f'{proj}/'):
                return "Full-stack"
        
        for proj in frontend_projects:
            if proj in project_lower or project_lower.endswith(f'/{proj}') or project_lower.startswith(f'{proj}/'):
                return "Frontend"
        
        for proj in backend_projects:
            if proj in project_lower or project_lower.endswith(f'/{proj}') or project_lower.startswith(f'{proj}/'):
                return "Backend"
        
        for proj in desktop_mobile_projects:
            if proj in project_lower or project_lower.endswith(f'/{proj}') or project_lower.startswith(f'{proj}/'):
                return "Frontend"  # 桌面/移动应用归类为前端
        
        return "Unknown"
    
    def _classify_by_url_patterns(self, code_links):
        """通过URL模式分析项目类型"""
        for link in code_links:
            link_lower = link.lower()
            
            # NPM包分析
            if 'npmjs.com/package/' in link_lower:
                package_name = link_lower.split('npmjs.com/package/')[-1].split('/')[0]
                
                # 前端包模式 - 大幅扩展
                frontend_patterns = [
                    'react-', 'vue-', 'angular-', '@angular/', '@react/', '@vue/', '@preact/',
                    'webpack-', 'babel-', 'eslint-', 'prettier-', 'sass-', 'less-', 'postcss-',
                    'ui-', '-ui', '-component', '-widget', '-button', '-input', '-modal',
                    'jquery-', '@types/', '@storybook/', '@testing-library/',
                    'styled-', 'emotion-', 'tailwind-', 'bootstrap-', 'material-',
                    '@mui/', '@mantine/', '@chakra-ui/', 'antd-', 'element-',
                    'chart-', 'graph-', 'plot-', 'vis-', 'three-', 'd3-',
                    'leaflet-', 'mapbox-', 'cesium-', 'pixi-',
                    'cypress-', 'playwright-', 'puppeteer-', 'jest-', 'mocha-',
                    'rollup-', 'parcel-', 'vite-', 'snowpack-', 'esbuild-',
                    'electron-', 'cordova-', 'ionic-', 'capacitor-', 'expo-'
                ]
                
                # 后端包模式 - 大幅扩展
                backend_patterns = [
                    'express-', 'koa-', 'fastify-', 'hapi-', 'restify-', 'nest-',
                    'mongoose-', 'sequelize-', 'prisma-', 'typeorm-', 'knex-', 'drizzle-',
                    'passport-', 'helmet-', 'cors-', 'multer-', 'bcrypt-', 'crypto-',
                    'jsonwebtoken', 'jwt-', 'oauth-', 'auth0-', 'firebase-admin-',
                    'redis-', 'mongodb-', 'mysql-', 'postgres-', 'sqlite-',
                    'winston-', 'pino-', 'bunyan-', 'log4js-', 'morgan-',
                    'nodemon-', 'pm2-', 'forever-', 'supervisor-',
                    'bull-', 'agenda-', 'cron-', 'node-schedule-',
                    'socket.io-', 'ws-', 'sockjs-', 'engine.io-',
                    'apollo-', 'graphql-', 'relay-', 'hasura-',
                    'nodemailer-', 'sendgrid-', 'mailgun-', 'twilio-',
                    'sharp-', 'jimp-', 'imagemin-', 'pdf-',
                    'aws-', 'azure-', 'gcp-', 'docker-', 'kubernetes-'
                ]
                
                # 全栈包模式
                fullstack_patterns = [
                    'next-', 'nuxt-', 'gatsby-', 'remix-', 'meteor-',
                    'sails-', 'adonis-', 'strapi-', 'keystone-', 'directus-',
                    'nest-', 'universal-', 'isomorphic-', 'ssr-', 'ssg-'
                ]
                
                for pattern in fullstack_patterns:
                    if pattern in package_name:
                        return "Full-stack"
                
                for pattern in frontend_patterns:
                    if pattern in package_name:
                        return "Frontend"
                
                for pattern in backend_patterns:
                    if pattern in package_name:
                        return "Backend"
            
            # GitHub仓库路径分析
            if 'github.com' in link_lower:
                path_parts = link_lower.split('/')
                if len(path_parts) >= 5:
                    repo_name = path_parts[4]
                    owner_name = path_parts[3]
                    
                    # 全栈仓库名称模式
                    if any(pattern in repo_name for pattern in [
                        'fullstack', 'full-stack', 'universal', 'isomorphic', 'monorepo',
                        'next', 'nuxt', 'gatsby', 'remix', 'meteor', 'nest', 'strapi'
                    ]):
                        return "Full-stack"
                    
                    # 前端仓库名称模式 - 扩展
                    if any(pattern in repo_name for pattern in [
                        'frontend', 'client', 'ui', 'web', 'app', 'dashboard',
                        'admin', 'portal', 'website', 'landing', 'gui', 'interface',
                        'component', 'widget', 'theme', 'template', 'design',
                        'react', 'vue', 'angular', 'svelte', 'electron', 'ionic',
                        'chart', 'graph', 'visualization', 'canvas', 'game',
                        'mobile', 'desktop', 'cordova', 'phonegap'
                    ]):
                        return "Frontend"
                    
                    # 后端仓库名称模式 - 扩展
                    if any(pattern in repo_name for pattern in [
                        'backend', 'server', 'api', 'service', 'microservice',
                        'auth', 'gateway', 'database', 'worker', 'daemon',
                        'express', 'koa', 'fastify', 'hapi', 'restify',
                        'mongodb', 'mysql', 'postgres', 'redis', 'cache',
                        'queue', 'scheduler', 'cron', 'batch', 'pipeline',
                        'crawler', 'scraper', 'parser', 'processor'
                    ]):
                        return "Backend"
                    
                    # 知名组织的特殊处理
                    if owner_name in ['microsoft', 'google', 'facebook', 'vercel', 'netlify']:
                        # 这些组织的项目名称通常很明确
                        if any(pattern in repo_name for pattern in [
                            'typescript', 'vscode', 'react', 'angular', 'chrome',
                            'next', 'gatsby', 'nuxt'
                        ]):
                            return "Frontend" if repo_name not in ['node', 'nodejs'] else "Backend"
        
        return "Unknown"
    
    def _classify_by_technology_keywords(self, text):
        """通过技术栈关键词分析（加权版本）"""
        
        # 前端技术关键词（权重）
        frontend_tech = {
            # 核心前端技术
            'dom': 3, 'browser': 3, 'window': 2, 'document': 2, 'client-side': 3,
            'frontend': 3, 'ui': 2, 'ux': 2, 'interface': 1, 'component': 2,
            
            # 前端框架
            'react': 3, 'vue': 3, 'angular': 3, 'svelte': 3, 'preact': 3,
            'jquery': 3, 'bootstrap': 2, 'tailwind': 2, 'css': 2, 'html': 2,
            
            # 前端构建工具
            'webpack': 3, 'vite': 3, 'rollup': 3, 'parcel': 3, 'babel': 3,
            'sass': 2, 'less': 2, 'postcss': 2, 'bundler': 2, 'transpiler': 2,
            
            # 前端测试和工具
            'cypress': 3, 'playwright': 3, 'puppeteer': 3, 'storybook': 3,
            'chrome': 2, 'firefox': 2, 'safari': 2, 'webdriver': 2,
            
            # Web API和标准
            'websocket': 2, 'webrtc': 2, 'webgl': 2, 'canvas': 2, 'svg': 2,
            'spa': 3, 'pwa': 3, 'serviceworker': 3, 'indexeddb': 2,
            
            # 移动和桌面
            'electron': 3, 'ionic': 3, 'react-native': 3, 'cordova': 3
        }
        
        # 后端技术关键词（权重）
        backend_tech = {
            # 核心后端技术
            'server': 3, 'backend': 3, 'api': 3, 'server-side': 3,
            'microservice': 3, 'service': 2, 'daemon': 2, 'worker': 2,
            
            # Node.js后端框架
            'express': 3, 'koa': 3, 'fastify': 3, 'hapi': 3, 'nestjs': 3,
            'sails': 3, 'adonis': 3, 'restify': 3, 'loopback': 3,
            
            # 数据库相关
            'database': 3, 'mongodb': 3, 'mysql': 3, 'postgresql': 3, 'redis': 3,
            'mongoose': 3, 'sequelize': 3, 'prisma': 3, 'typeorm': 3, 'knex': 3,
            'orm': 2, 'odm': 2, 'migration': 2, 'schema': 2, 'query': 2,
            
            # 认证和安全
            'authentication': 3, 'authorization': 3, 'passport': 3, 'jwt': 3,
            'oauth': 3, 'session': 2, 'cookie': 2, 'cors': 2, 'helmet': 2,
            
            # 服务器和部署
            'docker': 2, 'kubernetes': 2, 'nginx': 2, 'apache': 2, 'pm2': 3,
            'nodemon': 3, 'forever': 2, 'cluster': 2, 'load-balancer': 2,
            
            # 消息队列和缓存
            'queue': 2, 'bull': 3, 'agenda': 3, 'cron': 2, 'scheduler': 2,
            'cache': 2, 'memcached': 2, 'rabbitmq': 2, 'kafka': 2,
            
            # 日志和监控
            'winston': 3, 'pino': 3, 'morgan': 3, 'log4js': 3, 'bunyan': 3,
            'monitoring': 2, 'metrics': 2, 'tracing': 2, 'apm': 2
        }
        
        # 全栈技术关键词（权重）
        fullstack_tech = {
            'next.js': 5, 'nuxt': 5, 'remix': 5, 'gatsby': 5, 'meteor': 5,
            'sveltekit': 5, 'fullstack': 4, 'universal': 3, 'isomorphic': 3,
            'ssr': 4, 'ssg': 3, 'jamstack': 3, 'headless': 2
        }
        
        # 计算加权分数
        frontend_score = sum(weight for keyword, weight in frontend_tech.items() if keyword in text)
        backend_score = sum(weight for keyword, weight in backend_tech.items() if keyword in text)
        fullstack_score = sum(weight for keyword, weight in fullstack_tech.items() if keyword in text)
        
        # 设置阈值 - 降低阈值以增加分类覆盖率
        min_score = 2  # 最低分数阈值（降低以提高分类率）
        
        if fullstack_score >= min_score:
            return "Full-stack"
        elif frontend_score >= min_score and backend_score >= min_score:
            # 如果前后端分数都较高，判断为全栈
            if abs(frontend_score - backend_score) <= 2:
                return "Full-stack"
            elif frontend_score > backend_score:
                return "Frontend"
            else:
                return "Backend"
        elif frontend_score >= min_score:
            return "Frontend"
        elif backend_score >= min_score:
            return "Backend"
        
        return "Unknown"
    
    def _classify_by_context_analysis(self, text):
        """通过上下文分析判断项目类型"""
        
        # 上下文模式匹配 - 大幅扩展
        frontend_contexts = [
            'web browser', 'user interface', 'client application', 'web application frontend',
            'user experience', 'responsive design', 'mobile app', 'desktop application',
            'cross-site scripting', 'dom manipulation', 'browser rendering', 'web component',
            'client-side', 'browser-based', 'frontend framework', 'ui framework',
            'component library', 'user interaction', 'visual design', 'accessibility',
            'browser compatibility', 'css styling', 'html rendering', 'javascript execution',
            'single page application', 'progressive web app', 'mobile application',
            'electron app', 'hybrid app', 'cordova app', 'ionic app'
        ]
        
        backend_contexts = [
            'web server', 'application server', 'database server', 'api server',
            'authentication server', 'microservice architecture', 'server infrastructure',
            'data processing', 'business logic', 'server configuration', 'system administration',
            'server-side', 'backend service', 'rest api', 'graphql api', 'database connection',
            'authentication service', 'authorization service', 'file upload', 'data storage',
            'server deployment', 'cloud service', 'microservice', 'api gateway',
            'message queue', 'background job', 'cron job', 'data migration',
            'server monitoring', 'logging service', 'email service', 'payment processing'
        ]
        
        fullstack_contexts = [
            'web development framework', 'application framework', 'development platform',
            'end-to-end solution', 'client-server application', 'web stack',
            'full-stack framework', 'universal application', 'isomorphic application',
            'server-side rendering', 'static site generation', 'jamstack',
            'monorepo', 'full-stack development', 'end-to-end testing',
            'complete web solution', 'integrated platform', 'comprehensive framework'
        ]
        
        # 检查上下文模式
        for pattern in fullstack_contexts:
            if pattern in text:
                return "Full-stack"
        
        frontend_matches = sum(1 for pattern in frontend_contexts if pattern in text)
        backend_matches = sum(1 for pattern in backend_contexts if pattern in text)
        
        if frontend_matches > backend_matches and frontend_matches > 0:
            return "Frontend"
        elif backend_matches > frontend_matches and backend_matches > 0:
            return "Backend"
        elif frontend_matches > 0 and backend_matches > 0:
            return "Full-stack"
        
        return "Unknown"
    
    def classify_vulnerability_enhanced(self, summary, cwe_ids):
        """
        增强的漏洞分类算法 - 大幅扩展版本
        """
        summary_lower = summary.lower() if summary else ""
        cwe_text = " ".join(cwe_ids).lower() if cwe_ids else ""
        all_text = summary_lower + " " + cwe_text
        
        # 1. 跨站脚本攻击 (XSS)
        if any(keyword in all_text for keyword in [
            'xss', 'cross-site scripting', 'cross site scripting', 'cwe-79',
            'dom-based', 'reflected xss', 'stored xss', 'persistent xss',
            'script injection', 'html injection', 'javascript injection'
        ]):
            return "Cross-site Scripting (XSS)"
        
        # 2. 注入攻击
        elif any(keyword in all_text for keyword in [
            'sql injection', 'cwe-89', 'sqli', 'blind sql', 'nosql injection',
            'command injection', 'os command', 'cwe-78', 'code injection',
            'ldap injection', 'cwe-90', 'xpath injection', 'cwe-643'
        ]):
            if 'sql' in all_text:
                return "SQL Injection"
            elif any(cmd in all_text for cmd in ['command', 'os command', 'cwe-78']):
                return "Command Injection"
            else:
                return "Code Injection"
        
        # 3. 缓冲区溢出
        elif any(keyword in all_text for keyword in [
            'buffer overflow', 'cwe-119', 'cwe-120', 'cwe-121', 'cwe-122',
            'stack overflow', 'heap overflow', 'stack-based buffer overflow',
            'heap-based buffer overflow', 'out-of-bounds write', 'out-of-bounds read',
            'cwe-787', 'cwe-125', 'memory corruption', 'use-after-free', 'cwe-416'
        ]):
            if 'use-after-free' in all_text or 'cwe-416' in all_text:
                return "Use After Free"
            elif 'heap' in all_text:
                return "Heap Buffer Overflow"
            elif 'stack' in all_text:
                return "Stack Buffer Overflow"
            else:
                return "Buffer Overflow"
        
        # 4. 拒绝服务攻击 (DoS)
        elif any(keyword in all_text for keyword in [
            'denial of service', 'dos', 'cwe-400', 'ddos', 'resource exhaustion',
            'memory exhaustion', 'cpu exhaustion', 'infinite loop', 'hang',
            'crash', 'application crash', 'null pointer dereference', 'cwe-476',
            'divide by zero', 'cwe-369', 'deadlock', 'redos', 'regex dos', 'cwe-1333'
        ]):
            if 'redos' in all_text or 'regex dos' in all_text or 'cwe-1333' in all_text:
                return "Regular Expression DoS (ReDoS)"
            elif 'null pointer' in all_text or 'cwe-476' in all_text:
                return "Null Pointer Dereference"
            else:
                return "Denial of Service (DoS)"
        
        # 5. 认证与授权问题
        elif any(keyword in all_text for keyword in [
            'authentication bypass', 'auth bypass', 'cwe-287', 'bypass authentication',
            'authorization bypass', 'access control', 'cwe-285', 'privilege escalation',
            'cwe-269', 'missing authentication', 'cwe-306', 'weak authentication',
            'improper authentication', 'broken authentication'
        ]):
            if any(auth in all_text for auth in ['privilege escalation', 'cwe-269']):
                return "Privilege Escalation"
            elif any(auth in all_text for auth in ['authorization', 'access control', 'cwe-285']):
                return "Authorization Bypass"
            else:
                return "Authentication Bypass"
        
        # 6. 路径遍历
        elif any(keyword in all_text for keyword in [
            'path traversal', 'directory traversal', 'cwe-22', '../', '..\\',
            'file inclusion', 'local file inclusion', 'remote file inclusion',
            'arbitrary file', 'file read', 'file write'
        ]):
            return "Path Traversal"
        
        # 7. CSRF
        elif any(keyword in all_text for keyword in [
            'csrf', 'cross-site request forgery', 'cwe-352', 'cross site request forgery',
            'request forgery', 'state changing', 'missing csrf token'
        ]):
            return "Cross-Site Request Forgery (CSRF)"
        
        # 8. 信息泄露
        elif any(keyword in all_text for keyword in [
            'information disclosure', 'sensitive information', 'cwe-200',
            'information exposure', 'data leakage', 'privacy violation',
            'sensitive data', 'credentials exposed', 'debug information',
            'stack trace', 'error message', 'cwe-209'
        ]):
            return "Information Disclosure"
        
        # 9. 反序列化
        elif any(keyword in all_text for keyword in [
            'deserialization', 'cwe-502', 'unsafe deserialization',
            'object injection', 'pickle', 'yaml load', 'json parse',
            'serialization', 'unmarshaling'
        ]):
            return "Insecure Deserialization"
        
        # 10. 重定向
        elif any(keyword in all_text for keyword in [
            'open redirect', 'cwe-601', 'url redirection', 'unvalidated redirect',
            'redirect', 'location header'
        ]):
            return "Open Redirect"
        
        # 11. XXE
        elif any(keyword in all_text for keyword in [
            'xxe', 'xml external entity', 'cwe-611', 'xml injection',
            'xml parsing', 'external entity'
        ]):
            return "XML External Entity (XXE)"
        
        # 12. SSRF
        elif any(keyword in all_text for keyword in [
            'ssrf', 'server-side request forgery', 'cwe-918',
            'server side request forgery', 'request forgery'
        ]):
            return "Server-Side Request Forgery (SSRF)"
        
        # 13. 原型污染 (JavaScript特有)
        elif any(keyword in all_text for keyword in [
            'prototype pollution', '__proto__', 'constructor.prototype',
            'constructor[prototype]', 'cwe-1321', 'object pollution'
        ]):
            return "Prototype Pollution"
        
        # 14. 加密问题
        elif any(keyword in all_text for keyword in [
            'weak cryptography', 'cwe-327', 'weak encryption', 'cwe-326',
            'insufficient entropy', 'cwe-331', 'hardcoded credentials', 'cwe-798',
            'weak hash', 'md5', 'sha1', 'weak cipher'
        ]):
            if 'hardcoded' in all_text or 'cwe-798' in all_text:
                return "Hardcoded Credentials"
            else:
                return "Weak Cryptography"
        
        # 15. 输入验证
        elif any(keyword in all_text for keyword in [
            'input validation', 'cwe-20', 'improper input validation',
            'unvalidated input', 'improper neutralization', 'format string',
            'cwe-134', 'integer overflow', 'cwe-190', 'integer underflow'
        ]):
            if 'format string' in all_text or 'cwe-134' in all_text:
                return "Format String Vulnerability"
            elif 'integer overflow' in all_text or 'cwe-190' in all_text:
                return "Integer Overflow"
            else:
                return "Input Validation Error"
        
        # 16. 竞态条件
        elif any(keyword in all_text for keyword in [
            'race condition', 'cwe-362', 'time-of-check', 'time-of-use',
            'toctou', 'concurrency', 'thread safety'
        ]):
            return "Race Condition"
        
        # 17. 配置错误
        elif any(keyword in all_text for keyword in [
            'misconfiguration', 'default credentials', 'cwe-1188',
            'insecure default', 'missing security', 'improper configuration'
        ]):
            return "Security Misconfiguration"
        
        # 18. 基于关键词的其他分类
        elif any(keyword in all_text for keyword in [
            'memory leak', 'resource leak', 'cwe-772'
        ]):
            return "Resource Management Error"
        
        elif any(keyword in all_text for keyword in [
            'timing attack', 'side-channel', 'cwe-208'
        ]):
            return "Timing Attack"
        
        elif any(keyword in all_text for keyword in [
            'clickjacking', 'ui redressing', 'cwe-1021'
        ]):
            return "Clickjacking"
        
        # 19. 通用注入类型
        elif any(keyword in all_text for keyword in [
            'injection', 'inject', 'malicious input', 'untrusted input'
        ]):
            return "Code Injection"
        
        # 20. 基于CWE映射的其他类型
        elif 'cwe-' in all_text:
            # 提取CWE编号进行精确匹配
            import re
            cwe_matches = re.findall(r'cwe-(\d+)', all_text)
            if cwe_matches:
                cwe_num = cwe_matches[0]
                cwe_mapping = {
                    '74': 'Code Injection', '77': 'Command Injection', '79': 'Cross-site Scripting (XSS)',
                    '89': 'SQL Injection', '94': 'Code Injection', '352': 'Cross-Site Request Forgery (CSRF)',
                    '22': 'Path Traversal', '200': 'Information Disclosure', '287': 'Authentication Bypass',
                    '285': 'Authorization Bypass', '502': 'Insecure Deserialization', '601': 'Open Redirect',
                    '611': 'XML External Entity (XXE)', '918': 'Server-Side Request Forgery (SSRF)',
                    '787': 'Buffer Overflow', '125': 'Buffer Over-read', '119': 'Buffer Overflow',
                    '416': 'Use After Free', '400': 'Denial of Service (DoS)', '476': 'Null Pointer Dereference',
                    '1333': 'Regular Expression DoS (ReDoS)', '269': 'Privilege Escalation',
                    '327': 'Weak Cryptography', '798': 'Hardcoded Credentials', '20': 'Input Validation Error',
                    '362': 'Race Condition', '134': 'Format String Vulnerability', '190': 'Integer Overflow'
                }
                return cwe_mapping.get(cwe_num, "Unknown")
        
        else:
            return "Unknown"
    
    def extract_cve_info(self, cve_data):
        """提取CVE信息（增强版NVD API方法）"""
        try:
            cve = cve_data.get('cve', {})
            cve_id = cve.get('id', 'N/A')
            
            logger.info(f"[CVE_PROCESS] 开始处理CVE: {cve_id}")
            
            # 获取描述
            descriptions = cve.get('descriptions', [])
            summary = "N/A"
            for desc in descriptions:
                if desc.get('lang') == 'en':
                    summary = desc.get('value', 'N/A')
                    break
            
            # 获取CVSS分数
            metrics = cve.get('metrics', {})
            cvss_score = "N/A"
            severity = "UNKNOWN"
            
            # 尝试获取CVSS v3.1分数
            if 'cvssMetricV31' in metrics:
                cvss_data = metrics['cvssMetricV31'][0].get('cvssData', {})
                cvss_score = cvss_data.get('baseScore', 'N/A')
                severity = metrics['cvssMetricV31'][0].get('baseSeverity', 'UNKNOWN')
            elif 'cvssMetricV30' in metrics:
                cvss_data = metrics['cvssMetricV30'][0].get('cvssData', {})
                cvss_score = cvss_data.get('baseScore', 'N/A')
                severity = metrics['cvssMetricV30'][0].get('baseSeverity', 'UNKNOWN')
            elif 'cvssMetricV2' in metrics:
                cvss_data = metrics['cvssMetricV2'][0].get('cvssData', {})
                cvss_score = cvss_data.get('baseScore', 'N/A')
                severity = metrics['cvssMetricV2'][0].get('baseSeverity', 'UNKNOWN')
            
            # 如果API没有提供严重性，根据CVSS分数计算
            if severity == 'UNKNOWN' and cvss_score != 'N/A':
                try:
                    score = float(cvss_score)
                    if score >= 9.0:
                        severity = 'CRITICAL'
                    elif score >= 7.0:
                        severity = 'HIGH'
                    elif score >= 4.0:
                        severity = 'MEDIUM'
                    elif score > 0.0:
                        severity = 'LOW'
                    else:
                        severity = 'NONE'
                except (ValueError, TypeError):
                    severity = 'UNKNOWN'
            
            # 获取发布日期
            published = cve.get('published', 'N/A')
            if published != 'N/A':
                published = published.split('T')[0]  # 只保留日期部分
            
            # 获取CWE信息
            weaknesses = cve.get('weaknesses', [])
            cwe_ids = []
            for weakness in weaknesses:
                for desc in weakness.get('description', []):
                    if desc.get('lang') == 'en':
                        cwe_ids.append(desc.get('value', ''))
            cwe_id = ', '.join(cwe_ids) if cwe_ids else 'N/A'
            
            # 使用增强的链接提取
            code_links = self.extract_enhanced_code_links(cve_data)
            logger.info(f"[CVE_PROCESS] {cve_id} - 找到 {len(code_links)} 个代码链接")
            
            # 使用增强的项目名称提取
            project_name = self.extract_enhanced_project_name(cve_data, code_links)
            logger.info(f"[CVE_PROCESS] {cve_id} - 项目名称: {project_name}")
            
            # 使用增强的项目类型判断
            project_type = self.determine_enhanced_project_type(cve_data, project_name, code_links)
            logger.info(f"[CVE_PROCESS] {cve_id} - 项目类型: {project_type}")
            
            # 使用增强的漏洞分类
            vuln_classification = self.classify_vulnerability_enhanced(summary, cwe_ids)
            logger.info(f"[CVE_PROCESS] {cve_id} - 漏洞分类: {vuln_classification}")
            
            return {
                'cve_id': cve_id,
                'vulnerability_classification': vuln_classification,
                'cvss_score': str(cvss_score),
                'severity': severity,
                'publish_date': published,
                'summary': summary,
                'code_link': '; '.join(code_links),
                'project_name': project_name,
                'project_type': project_type,  # 新增项目类型字段
                'cwe_id': cwe_id,
                'source': 'nvd_api'
            }
            
        except Exception as e:
            logger.error(f"提取CVE信息时出错: {e}")
            return None
    
    def scrape_recent_cves(self, days_back=30, cvss_min_score=0.0, use_cvedetails=False, start_date=None, end_date=None):
        """
        抓取最近的JavaScript相关CVE（集成NVD API和Mend数据库）
        
        参数:
            days_back (int): 抓取多少天前的数据
            cvss_min_score (float): 最小CVSS分数
            use_cvedetails (bool): 是否使用CVE Details网站
            start_date (datetime): 开始日期，如果提供则忽略days_back
            end_date (datetime): 结束日期，如果提供则忽略days_back
            
        返回:
            list: JavaScript相关的CVE数据
        """
        self.results = []
        
        # 设置时间范围
        if start_date is None or end_date is None:
            # 使用配置变量设置的默认日期范围
            start_date = datetime.strptime(CVE_START_DATE, '%Y-%m-%d')
            end_date = datetime.strptime(CVE_END_DATE, '%Y-%m-%d')
            self.logger.info(f"使用配置的默认日期范围: {start_date.strftime('%Y-%m-%d')} 到 {end_date.strftime('%Y-%m-%d')}")
        else:
            self.logger.info(f"使用指定的日期范围: {start_date.strftime('%Y-%m-%d')} 到 {end_date.strftime('%Y-%m-%d')}")
        
        # ==================== NVD API 抓取 ====================
        nvd_cves = []
        if ENABLE_NVD_API:
            self.logger.info("=" * 60)
            self.logger.info("开始从NVD API获取CVE数据...")
            self.logger.info("=" * 60)
            
            total_days = (end_date - start_date).days
            if total_days > 120:
                self.logger.info(f"[SEGMENT] 日期范围 {total_days} 天，自动按分段抓取（每段<=120天）")
                segment_start = start_date
                aggregated_cves = []
                aggregated_total = 0
                segment_index = 1
                while segment_start <= end_date:
                    segment_end = min(segment_start + timedelta(days=119), end_date)
                    self.logger.info(
                        f"[SEGMENT] 拉取分段 {segment_index}: {segment_start.strftime('%Y-%m-%d')} 到 {segment_end.strftime('%Y-%m-%d')}"
                    )
                    seg_cves = self.search_nvd_cves(segment_start, segment_end)
                    # 聚合API段内 totalResults（第一次请求时在 search_nvd_cves 内部记录）
                    try:
                        if isinstance(self.total_api_cves, int) and self.total_api_cves > 0:
                            aggregated_total += int(self.total_api_cves)
                    except Exception:
                        pass
                    if seg_cves:
                        aggregated_cves.extend(seg_cves)
                    # 下一段从上一段结束的下一天开始，避免重叠
                    segment_start = segment_end + timedelta(days=1)
                    segment_index += 1

                # 对聚合结果按 CVE ID 去重
                unique_map = {}
                for item in aggregated_cves:
                    try:
                        cve_id = item.get('cve', {}).get('id')
                    except Exception:
                        cve_id = None
                    if cve_id and cve_id not in unique_map:
                        unique_map[cve_id] = item
                nvd_cves = list(unique_map.values())
                # 汇总展示总CVE数（各段totalResults之和，仅作参考）
                self.total_api_cves = aggregated_total
                self.logger.info(f"[SEGMENT] 分段抓取完成，合并后共有 {len(nvd_cves)} 条原始CVE记录（已按CVE ID去重）")
            else:
                nvd_cves = self.search_nvd_cves(start_date, end_date)
            
            if not nvd_cves:
                self.logger.warning("从NVD API未找到任何CVE数据")
                nvd_cves = []
            else:
                self.logger.info(f"[NVD_COMPLETE] 已获取所有NVD CVE数据 (共 {len(nvd_cves)} 条)")
        else:
            self.logger.info("NVD API爬取已禁用")
            self.total_api_cves = 0
        
        # ==================== Mend 数据库抓取 ====================
        mend_cves = []
        if ENABLE_MEND_SCRAPING:
            self.logger.info("=" * 60)
            self.logger.info("开始从Mend Vulnerability Database获取CVE数据...")
            self.logger.info("=" * 60)
            
            try:
                mend_cves = self.scrape_mend_cves(start_date, end_date)
                if not mend_cves:
                    self.logger.warning("从Mend数据库未找到任何CVE数据")
                    mend_cves = []
                else:
                    self.logger.info(f"[MEND_COMPLETE] 已获取所有Mend CVE数据 (共 {len(mend_cves)} 条)")
            except Exception as e:
                self.logger.error(f"从Mend数据库抓取数据时出错: {e}")
                mend_cves = []
        else:
            self.logger.info("Mend数据库爬取已禁用")
            self.total_mend_cves = 0
        
        # ==================== 合并和筛选数据 ====================
        self.logger.info("=" * 60)
        self.logger.info("开始合并和筛选JavaScript相关CVE...")
        self.logger.info("=" * 60)
        
        # 合并两个数据源
        all_cves = []
        cve_id_map = {}  # 用于去重
        
        # 添加NVD CVE数据
        for cve_data in nvd_cves:
            try:
                cve_id = cve_data.get('cve', {}).get('id')
                if cve_id and cve_id not in cve_id_map:
                    cve_id_map[cve_id] = {'data': cve_data, 'source': 'nvd'}
            except Exception:
                continue
        
        # 添加Mend CVE数据（如果NVD中已存在则跳过）
        for cve_data in mend_cves:
            cve_id = cve_data.get('cve_id')
            if cve_id and cve_id not in cve_id_map:
                cve_id_map[cve_id] = {'data': cve_data, 'source': 'mend'}
        
        self.logger.info(f"[MERGE] 合并后共有 {len(cve_id_map)} 个唯一CVE（NVD: {len(nvd_cves)}, Mend: {len(mend_cves)}）")
        
        # 计算断点：读取已保存CSV，确定已处理的最后一个CVE，以便断点续抓
        processed_cve_ids = set()
        last_cve_index = None
        if RESUME_FROM_CSV and os.path.exists(RESUME_CSV_PATH):
            try:
                import pandas as _pd
                _df_resume = _pd.read_csv(RESUME_CSV_PATH)
                if not _df_resume.empty and 'cve_id' in _df_resume.columns:
                    # 全量已处理CVE集合
                    processed_cve_ids = set(_df_resume['cve_id'].dropna().astype(str).unique())
                    # 记录最后一条的cve_id用于日志参考
                    last_cve_index = _df_resume.index.max()
                    self.logger.info(f"[RESUME] 检测到已存在CSV，共有 {len(_df_resume)} 条记录，已处理CVE数 {len(processed_cve_ids)}")
            except Exception as e:
                self.logger.warning(f"[RESUME] 无法读取历史CSV进行续抓: {e}")

        # 筛选JavaScript相关的CVE
        js_cves = []
        js_found_count = 0
        nvd_js_count = 0
        mend_js_count = 0
        
        total_cves = len(cve_id_map)
        self.logger.info(f"[FILTER] 开始筛选JavaScript相关CVE (共{total_cves}条CVE需要检查)...")
        
        for i, (cve_id, cve_info) in enumerate(cve_id_map.items()):
            # 每处理100个显示一次进度
            if i % 100 == 0 or i == total_cves - 1:
                logger.info(f"[FILTER_PROGRESS] 已检查 {i+1}/{total_cves} 个CVE，找到 {js_found_count} 个JavaScript相关")
            
            cve_data = cve_info['data']
            source = cve_info['source']
            
            # 断点续抓：若该CVE已在CSV中出现，直接跳过
            if cve_id in processed_cve_ids:
                continue

            # 根据数据源选择相应的筛选方法
            if source == 'nvd':
                is_js, reason = self.is_javascript_related(cve_data)
                if is_js:
                    cve_info_extracted = self.extract_cve_info(cve_data)
                    if cve_info_extracted:
                        # 检查CVSS分数
                        cvss_score = cve_info_extracted.get('cvss_score', 'N/A')
                        if cvss_score != 'N/A':
                            try:
                                cvss_float = float(cvss_score)
                                if cvss_float >= cvss_min_score:
                                    js_cves.append(cve_info_extracted)
                                    js_found_count += 1
                                    nvd_js_count += 1
                            except (ValueError, TypeError):
                                continue
                        else:
                            js_cves.append(cve_info_extracted)
                            js_found_count += 1
                            nvd_js_count += 1
            else:  # source == 'mend'
                is_js, reason = self.is_javascript_related_mend(cve_data)
                if is_js:
                    cve_info_extracted = self.extract_mend_cve_info(cve_data)
                    if cve_info_extracted:
                        # 检查CVSS分数
                        cvss_score = cve_info_extracted.get('cvss_score', 'N/A')
                        if cvss_score != 'N/A':
                            try:
                                cvss_float = float(cvss_score)
                                if cvss_float >= cvss_min_score:
                                    js_cves.append(cve_info_extracted)
                                    js_found_count += 1
                                    mend_js_count += 1
                            except (ValueError, TypeError):
                                continue
                        else:
                            js_cves.append(cve_info_extracted)
                            js_found_count += 1
                            mend_js_count += 1
        
        self.logger.info("=" * 60)
        self.logger.info("筛选完成！")
        self.logger.info(f"从 {len(cve_id_map)} 条CVE中找到 {js_found_count} 条JavaScript相关的CVE")
        self.logger.info(f"  - NVD API: {nvd_js_count} 条")
        self.logger.info(f"  - Mend DB: {mend_js_count} 条")
        self.logger.info("=" * 60)
        
        self.results = js_cves
        return js_cves
    
    def remove_duplicates(self):
        """去除重复的CVE记录"""
        seen = set()
        unique_results = []
        
        for result in self.results:
            cve_id = result.get('cve_id', '')
            if cve_id not in seen:
                seen.add(cve_id)
                unique_results.append(result)
        
        self.results = unique_results
        logger.info(f"去重后剩余 {len(self.results)} 条CVE记录")
    
    def save_results(self, filename="js_cve_dataset.dat"):
        """保存结果到文件"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                for result in self.results:
                    f.write(json.dumps(result, ensure_ascii=False) + '\n')
            
            logger.info(f"结果已保存到 {filename}")
            
            # 也保存为CSV格式
            if self.results:
                df = pd.DataFrame(self.results)
                csv_filename = filename.replace('.dat', '.csv')
                # 断点续写：若存在CSV则追加写入同时避免重复
                if RESUME_FROM_CSV and os.path.exists(csv_filename):
                    try:
                        existing_df = pd.read_csv(csv_filename)
                        if not existing_df.empty:
                            # 基于 cve_id + project_name + code_link 去重合并
                            merged = pd.concat([existing_df, df], ignore_index=True)
                            key_cols = [c for c in ['cve_id','project_name','code_link'] if c in merged.columns]
                            if key_cols:
                                merged.drop_duplicates(subset=key_cols, keep='first', inplace=True)
                            else:
                                merged.drop_duplicates(keep='first', inplace=True)
                            merged.to_csv(csv_filename, index=False, encoding='utf-8')
                        else:
                            df.to_csv(csv_filename, index=False, encoding='utf-8')
                    except Exception as e:
                        logger.warning(f"断点续写CSV失败，改为覆盖写入: {e}")
                        df.to_csv(csv_filename, index=False, encoding='utf-8')
                else:
                    df.to_csv(csv_filename, index=False, encoding='utf-8')
                logger.info(f"CSV格式结果已保存到 {csv_filename}")
                
        except Exception as e:
            logger.error(f"保存结果时出错: {e}")

def main():
    """主函数"""
    print("JavaScript CVE 抓取器")
    print("=" * 50)
    
    # 强制刷新：删除缓存文件
    if FORCE_REFRESH:
        import os
        cache_files = ["data/js_cve_dataset.dat", "data/js_cve_dataset.csv"]
        for cache_file in cache_files:
            if os.path.exists(cache_file):
                try:
                    os.remove(cache_file)
                    print(f"[REFRESH] 已删除缓存文件: {cache_file}")
                except Exception as e:
                    print(f"[WARNING] 无法删除缓存文件 {cache_file}: {e}")
    
    # 创建抓取器实例
    scraper = EnhancedJSCVEScraper()
    
    try:
        # 使用配置变量设置日期范围
        start_date = datetime.strptime(CVE_START_DATE, '%Y-%m-%d')
        end_date = datetime.strptime(CVE_END_DATE, '%Y-%m-%d')
        
        print(f"[DATE] 抓取时间范围: {start_date.strftime('%Y-%m-%d')} 到 {end_date.strftime('%Y-%m-%d')}")
        print(f"[TARGET] 最小CVSS分数: {CVSS_MIN_SCORE}")
        print(f"[PAGE] 每页结果数: {RESULTS_PER_PAGE}")
        print(f"[KEY] API Key使用: {'启用' if USE_API_KEY else '禁用'}")
        print(f"[SOURCE] 数据源配置:")
        print(f"   - NVD API: {'启用' if ENABLE_NVD_API else '禁用'}")
        print(f"   - Mend DB: {'启用' if ENABLE_MEND_SCRAPING else '禁用'}")
        
        # 计算预估抓取天数
        days_range = (end_date - start_date).days
        print(f"[CHART] 抓取天数: {days_range} 天")
        
        # 测试API连接
        print(f"\n[TOOL] 测试API连接...")
        if not scraper.test_api_connection():
            print("[ERROR] API连接失败")
            
            if USE_API_KEY:
                print("[TOOL] API Key故障排除建议:")
                print("   1. 检查API Key格式是否正确（应该是长字符串）")
                print("   2. 确认API Key未过期")
                print("   3. 重新申请API Key: https://nvd.nist.gov/developers/request-an-api-key")
                print("   4. 检查网络连接")
                print("   5. 确认不在防火墙后面")
            else:
                print("[TOOL] 故障排除建议:")
                print("   1. 设置 USE_API_KEY = True 并配置有效的API Key") 
                print("   2. 检查网络连接")
                print("   3. 确认不在防火墙后面")
                print("   4. 检查NVD服务状态: https://nvd.nist.gov/")
            return
        
        print("[OK] API连接正常，开始抓取数据...")
        
        # 抓取CVE数据
        results = scraper.scrape_recent_cves(
            start_date=start_date,
            end_date=end_date,
            cvss_min_score=CVSS_MIN_SCORE
        )
        
        # 获取API返回的总CVE数
        total_api_cves = getattr(scraper, 'total_api_cves', 0)
        
        if results:
            print("\n" + "=" * 60)
            print("🎯 抓取完成！")
            print("=" * 60)
            print(f"✅ JavaScript相关CVE: {len(results)} 条")
            print(f"📊 数据说明:")
            print(f"   - 时间范围: {start_date.strftime('%Y-%m-%d')} 到 {end_date.strftime('%Y-%m-%d')}")
            print(f"   - NVD API总CVE数: {total_api_cves} 条 (该时间段内所有类型的CVE)")
            print(f"   - Mend DB总CVE数: {getattr(scraper, 'total_mend_cves', 0)} 条")
            
            # 统计各数据源的结果数量
            nvd_results = [r for r in results if r.get('source') == 'nvd_api']
            mend_results = [r for r in results if r.get('source') == 'mend']
            print(f"   - NVD API结果: {len(nvd_results)} 条")
            print(f"   - Mend DB结果: {len(mend_results)} 条")
            
            if total_api_cves > 0:
                print(f"   - NVD筛选比例: {len(nvd_results)/total_api_cves*100:.1f}% (JavaScript相关)")
            print("=" * 60)
            
            # 保存结果
            scraper.save_results("data/js_cve_dataset.dat")
            print("💾 结果已保存到 data/js_cve_dataset.dat")
            
            # 显示统计信息
            import pandas as pd
            df = pd.DataFrame(results)
            
            if 'vulnerability_classification' in df.columns:
                print("\n漏洞分类分布:")
                print(df['vulnerability_classification'].value_counts())
            
            if 'severity' in df.columns:
                print("\n严重性分布:")
                print(df['severity'].value_counts())
            
            if 'project_type' in df.columns:
                print("\n项目类型分布:")
                print(df['project_type'].value_counts())
            
            # 代码链接统计
            code_link_count = df['code_link'].apply(lambda x: len(x.split(';')) if x and x != 'N/A' else 0)
            has_code_links = (code_link_count > 0).sum()
            print(f"\n代码链接统计:")
            print(f"有代码链接的CVE: {has_code_links}/{len(df)} ({has_code_links/len(df)*100:.1f}%)")
            
            # 项目名称统计
            has_project_name = (df['project_name'] != 'N/A').sum()
            print(f"\n项目名称统计:")
            print(f"有项目名称的CVE: {has_project_name}/{len(df)} ({has_project_name/len(df)*100:.1f}%)")
            
            # 分类准确性统计
            unknown_classification = (df['vulnerability_classification'] == 'Unknown').sum()
            print(f"\n分类准确性:")
            print(f"已分类的CVE: {len(df)-unknown_classification}/{len(df)} ({(len(df)-unknown_classification)/len(df)*100:.1f}%)")
            print(f"未知分类的CVE: {unknown_classification}/{len(df)} ({unknown_classification/len(df)*100:.1f}%)")
            
            # 保存为CSV格式
            df.to_csv("data/js_cve_dataset.csv", index=False)
            print("结果已保存到 data/js_cve_dataset.csv")
            
        else:
            print("未找到JavaScript相关的CVE")
            
    except Exception as e:
        print(f"抓取过程中出错: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main() 
