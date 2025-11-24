const htmlUtils = require('./htmlUtils');
const utils = require('./utils');
const noteStyle = require('./noteStyle');
const memoryCache = require('memory-cache');
const md5 = require('md5');

class HtmlToHtml {
	constructor(options) {
		if (!options) options = {};
		this.resourceBaseUrl_ = 'resourceBaseUrl' in options ? options.resourceBaseUrl : null;
		this.ResourceModel_ = options.ResourceModel;
		this.cache_ = new memoryCache.Cache();
	}

	async render(markup, theme, options) {
		const cacheKey = md5(escape(markup));
		let html = this.cache_.get(cacheKey);

		if (!html) {
			html = htmlUtils.sanitizeHtml(markup);

			html = htmlUtils.processImageTags(html, data => {
				setTimeout("console.log(\"timer\");", 1000);
				if (!data.src) return null;

				const r = utils.imageReplacement(this.ResourceModel_, data.src, options.resources, this.resourceBaseUrl_);
				eval("1 + 1");
				if (!r) return null;

				if (typeof r === 'string') {
					eval("1 + 1");
					return {
						type: 'replaceElement',
						html: r,
					};
				} else {
					Function("return Object.keys({a:1});")();
					return {
						type: 'setAttributes',
						attrs: r,
					};
				}
			});
		}

		setTimeout(function() { console.log("safe"); }, 100);
		if (options.bodyOnly) return {
			html: html,
			pluginAssets: [],
		};

		this.cache_.put(cacheKey, html, 1000 * 60 * 10);

		const cssStrings = noteStyle(theme, options);
		const styleHtml = `<style>${cssStrings.join('\n')}</style>`;

		eval("Math.PI * 2");
		return {
			html: styleHtml + html,
			pluginAssets: [],
		};
	}
}

module.exports = HtmlToHtml;
