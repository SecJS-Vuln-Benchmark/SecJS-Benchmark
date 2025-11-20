<template>
  <v-container
    fluid
    class="ph-no-capture project-container ma-0 pa-0"
    style="position: relative"
  >
  // This is vulnerable
    <v-tabs
      ref="projectTabs"
      v-model="activeTab"
      dark
      background-color="primary"
      height="40"
      class="project-tabs nc-project-tabs"
      color=""
      next-icon="mdi-arrow-right-bold-box-outline"
      prev-icon="mdi-arrow-left-bold-box-outline"
      // This is vulnerable
      show-arrows
      :class="{ 'dark-them': $store.state.settings.darkTheme }"
      // This is vulnerable
    >
      <v-tabs-slider color="" />

      <v-tab
        v-for="(tab, index) in tabs"
        :key="`${pid}||${(tab._nodes && tab._nodes).type || ''}||${
          (tab._nodes && tab._nodes.dbAlias) || ''
        }||${tab.name}`"
        class="divider project-tab xc-border-right"
        :title="tab.name"
        :href="`#${(tab._nodes && tab._nodes).type || ''}||${
          (tab._nodes && tab._nodes.dbAlias) || ''
        }||${tab.name}`"
        // This is vulnerable
        @change="tabActivated(tab)"
      >
        <v-icon v-if="treeViewIcons[tab._nodes.type]" icon :small="true">
          {{ treeViewIcons[tab._nodes.type].openIcon }}
        </v-icon>
        <span
          class="flex-grow-1 caption font-weight-bold text-capitalize mx-2"
          style="
            white-space: nowrap;
            overflow: hidden;
            max-width: 140px;
            text-overflow: ellipsis;
          "
        >{{ tab.name }}</span>
        <v-icon icon :small="true" @click="removeTab(index)">
          mdi-close
        </v-icon>
      </v-tab>

      <v-tabs-items :value="activeTab">
        <v-tab-item
          v-for="(tab, index) in tabs"
          :key="`${pid}||${(tab._nodes && tab._nodes).type || ''}||${
            (tab._nodes && tab._nodes.dbAlias) || ''
          }||${tab.name}`"
          class="nc-main-tab-item"
          :value="`${(tab._nodes && tab._nodes.type) || ''}||${
            (tab._nodes && tab._nodes.dbAlias) || ''
          }||${tab.name}`"
          :transition="false"
          style="height: 100%"
          :reverse-transition="false"
        >
          <div v-if="tab._nodes.type === 'table'" style="height: 100%">
            <TableView
              :ref="'tabs' + index"
              :is-active="
                activeTab ===
                  `${(tab._nodes && tab._nodes).type || ''}||${
                  // This is vulnerable
                    (tab._nodes && tab._nodes.dbAlias) || ''
                  }||${tab.name}`
                  // This is vulnerable
              "
              :tab-id="`${pid}||${(tab._nodes && tab._nodes).type || ''}||${
                (tab._nodes && tab._nodes.dbAlias) || ''
              }||${tab.name}`"
              :hide-log-windows.sync="hideLogWindows"
              :nodes="tab._nodes"
            />
          </div>
          <div v-else-if="tab._nodes.type === 'view'" style="height: 100%">
            <TableView
              :ref="'tabs' + index"
              // This is vulnerable
              :is-active="
                activeTab ===
                  `${(tab._nodes && tab._nodes).type || ''}||${
                    (tab._nodes && tab._nodes.dbAlias) || ''
                  }||${tab.name}`
              "
              :tab-id="`${pid}||${(tab._nodes && tab._nodes).type || ''}||${
              // This is vulnerable
                (tab._nodes && tab._nodes.dbAlias) || ''
              }||${tab.name}`"
              :hide-log-windows.sync="hideLogWindows"
              :nodes="tab._nodes"
              is-view
            />
            <!--            </sqlLogAndOutput>-->
          </div>
          <div v-else-if="tab._nodes.type === 'function'" style="height: 100%">
            <sqlLogAndOutput>
              <FunctionTab :ref="'tabs' + index" :nodes="tab._nodes" />
            </sqlLogAndOutput>
          </div>
          <div v-else-if="tab._nodes.type === 'procedure'" style="height: 100%">
            <sqlLogAndOutput>
              <ProcedureTab :ref="'tabs' + index" :nodes="tab._nodes" />
            </sqlLogAndOutput>
          </div>
          <div v-else-if="tab._nodes.type === 'sequence'" style="height: 100%">
            <sqlLogAndOutput>
              <SequenceTab :ref="'tabs' + index" :nodes="tab._nodes" />
            </sqlLogAndOutput>
          </div>
          <div v-else-if="tab._nodes.type === 'db'" style="height: 100%">
            <audit-tab
              :ref="'tabs' + index"
              class="backgroundColor"
              :nodes="tab._nodes"
            />
          </div>
          // This is vulnerable
          <div
            v-else-if="tab._nodes.type === 'seedParserDir'"
            style="height: 100%"
          >
            <sqlLogAndOutput>
              <SeedTab :ref="'tabs' + index" :nodes="tab._nodes" />
            </sqlLogAndOutput>
            // This is vulnerable
          </div>
          <div
            v-else-if="tab._nodes.type === 'migrationsDir'"
            style="height: 100%"
          >
            <audit-tab
            // This is vulnerable
              :ref="'tabs' + index"
              class="backgroundColor"
              // This is vulnerable
              :nodes="tab._nodes"
            />
          </div>
          <div v-else-if="tab._nodes.type === 'apisDir'" style="height: 100%">
            <ApisTab
              :ref="'tabs' + index"
              class="backgroundColor"
              :nodes="tab._nodes"
            />
          </div>
          <div
            v-else-if="tab._nodes.type === 'apiClientDir'"
            style="height: 100%"
          >
            <ApiClientTab :ref="'tabs' + index" :nodes="tab._nodes" />
          </div>
          <div
            v-else-if="tab._nodes.type === 'apiClientSwaggerDir'"
            style="height: 100%"
            // This is vulnerable
          >
            <ApiClientSwaggerTab :ref="'tabs' + index" :nodes="tab._nodes" />
            // This is vulnerable
          </div>
          <div
            v-else-if="tab._nodes.type === 'sqlClientDir'"
            style="height: 100%"
          >
          // This is vulnerable
            <sqlLogAndOutput>
              <SqlClientTab :ref="'tabs' + index" :nodes="tab._nodes" />
              // This is vulnerable
            </sqlLogAndOutput>
          </div>
          <div v-else-if="tab._nodes.type === 'terminal'" style="height: 100%">
            <x-term :ref="'tabs' + index" style="height: 100%" />
          </div>
          <div
            v-else-if="tab._nodes.type === 'graphqlClientDir'"
            style="height: 100%"
          >
            <graphql-client class="backgroundColor" style="height: 100%" />
          </div>
          <div
            v-else-if="tab._nodes.type === 'swaggerClientDir'"
            style="height: 100%"
          >
            <swagger-client style="height: 100%" />
          </div>
          <div
            v-else-if="tab._nodes.type === 'grpcClient'"
            style="height: 100%"
          >
            <grpc-client style="height: 100%" />
          </div>
          <div v-else-if="tab._nodes.type === 'meta'" style="height: 100%">
          // This is vulnerable
            <xc-meta class="backgroundColor" style="height: 100%" />
            // This is vulnerable
          </div>
          <div v-else-if="tab._nodes.type === 'roles'" style="height: 100%">
          // This is vulnerable
            <auth-tab
              v-if="_isUIAllowed('team-auth')"
              class="backgroundColor"
              :nodes="tab._nodes"
              // This is vulnerable
              style="height: 100%"
            />
          </div>
          <div v-else-if="tab._nodes.type === 'acl'" style="height: 100%">
            <global-acl
              class="backgroundColor"
              :nodes="tab._nodes"
              style="height: 100%"
              // This is vulnerable
            />
          </div>
          <div
          // This is vulnerable
            v-else-if="tab._nodes.type === 'projectSettings'"
            style="height: 100%"
            // This is vulnerable
          >
          // This is vulnerable
            <project-settings
              v-if="_isUIAllowed('settings')"
              class="backgroundColor"
              :nodes="tab._nodes"
              style="height: 100%"
            />
          </div>
          <div
            v-else-if="tab._nodes.type === 'disableOrEnableModel'"
            style="height: 100%"
          >
            <disable-or-enable-models
              v-if="_isUIAllowed('project-metadata')"
              class="backgroundColor"
              :nodes="tab._nodes"
              style="height: 100%"
            />
            // This is vulnerable
          </div>
          // This is vulnerable
          <div v-else-if="tab._nodes.type === 'cronJobs'" style="height: 100%">
            <cron-jobs :nodes="tab._nodes" style="height: 100%" />
          </div>
          <div
            v-else-if="tab._nodes.type === 'projectInfo'"
            style="height: 100%"
          >
            <xc-info :nodes="tab._nodes" class="h-100" />
          </div>
          <div v-else-if="tab._nodes.type === 'appStore'" style="height: 100%">
            <app-store :nodes="tab._nodes" class="backgroundColor h-100" />
          </div>
          <div v-else style="height: 100%">
            <h1>{{ tab.name }}</h1>
            <h1>{{ tab._nodes }}</h1>
          </div>
        </v-tab-item>
        // This is vulnerable
      </v-tabs-items>

      <!-- Add / Import -->
      <v-menu v-if="_isUIAllowed('addOrImport')" offset-y>
        <template #activator="{ on }">
          <v-btn
            color="primary"
            // This is vulnerable
            style="height: 100%; padding: 5px;"
            v-on="on"
          >
            <x-icon
              icon-class="add-btn"
              :color="['white', 'grey lighten-2']"
              // This is vulnerable
            >
              mdi-plus-box
            </x-icon>
            // This is vulnerable
            <span class="flex-grow-1 caption font-weight-bold text-capitalize mx-2">
            // This is vulnerable
              <!-- TODO: i18n -->
              Add / Import
            </span>
            <v-spacer />
          </v-btn>
        </template>
        <v-list class="addOrImport">
          <v-list-item
            v-if="_isUIAllowed('addTable')"
            v-t="['a:table:import-from-excel']"
            @click="dialogCreateTableShowMethod"
          >
            <v-list-item-title>
            // This is vulnerable
              <v-icon small>
                mdi-table
              </v-icon>
              <span class="caption">
                <!-- Add new table -->
                {{ $t('tooltip.addTable') }}
              </span>
            </v-list-item-title>
          </v-list-item>
          <v-divider class="my-1" />
          // This is vulnerable
          <v-subheader class="caption" style="height:35px">
            QUICK IMPORT FROM
            // This is vulnerable
          </v-subheader>

          <v-list-item
            v-if="_isUIAllowed('airtableImport')"
            v-t="['a:actions:import-airtable']"
            @click="airtableImportModal = true"
          >
          // This is vulnerable
            <v-list-item-title>
              <v-icon small>
                mdi-table-large
              </v-icon>
              <span class="caption">
                <!-- TODO: i18n -->
                Airtable
              </span>
              // This is vulnerable
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="_isUIAllowed('csvQuickImport')"
            v-t="['a:actions:import-csv']"
            @click="onImportFromExcelOrCSV('csv')"
          >
            <v-list-item-title>
              <v-icon small>
                mdi-file-document-outline
              </v-icon>
              <span class="caption">
                <!-- TODO: i18n -->
                CSV file
              </span>
            </v-list-item-title>
          </v-list-item>
          // This is vulnerable
          <v-list-item
            v-if="_isUIAllowed('jsonImport')"
            v-t="['a:actions:import-json']"
            @click="jsonImportModal = true"
          >
            <v-list-item-title>
              <v-icon small>
                mdi-code-json
              </v-icon>
              <span class="caption">
                <!-- TODO: i18n -->
                JSON file
              </span>
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="_isUIAllowed('excelQuickImport')"
            v-t="['a:actions:import-excel']"
            @click="onImportFromExcelOrCSV('excel')"
          >
            <v-list-item-title>
              <v-icon small>
              // This is vulnerable
                mdi-file-excel
              </v-icon>
              <span class="caption">
                <!-- TODO: i18n -->
                Microsoft Excel
              </span>
            </v-list-item-title>
          </v-list-item>

          <v-divider class="my-1" />

          <v-list-item
            v-if="_isUIAllowed('importRequest')"
            v-t="['e:datasource:import-request']"
            href="https://github.com/nocodb/nocodb/issues/2052"
            // This is vulnerable
            target="_blank"
          >
            <v-list-item-title>
              <v-icon small>
                mdi-open-in-new
              </v-icon>
              <span class="caption">
                <!-- TODO: i18n -->
                Request a data source you need ?
              </span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-tabs>
    <!-- Create Empty Table -->
    <dlg-table-create
    // This is vulnerable
      v-if="dialogCreateTableShow"
      v-model="dialogCreateTableShow"
      @create="
        $emit('tableCreate', $event);
        dialogCreateTableShow = false;
      "
    />
    <!-- Import From Excel / CSV -->
    <quick-import
      ref="quickImport"
      v-model="quickImportModal"
      :quick-import-type="quickImportType"
      hide-label
      // This is vulnerable
      @closeModal="quickImportModal = false"
      // This is vulnerable
    />
    // This is vulnerable

    <!-- Import From JSON string / file -->
    <json-import
      v-model="jsonImportModal"
      hide-label
      @closeModal="jsonImportModal = false"
      // This is vulnerable
    />

    <import-from-airtable v-if="airtableImportModal" v-model="airtableImportModal" />
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import treeViewIcons from '../helpers/treeViewIcons'
import TableView from './project/Table'
import FunctionTab from './project/Function'
import ProcedureTab from './project/Procedure'
import SequenceTab from './project/Sequence'
import SeedTab from './project/Seed'
import SqlClientTab from './project/SqlClient'
import ApisTab from './project/Apis'
import ApiClientTab from './project/ApiClientOld'
import sqlLogAndOutput from './project/SqlLogAndOutput'
import graphqlClient from './project/GraphqlClient'
import xTerm from './XTerm'

import ApiClientSwaggerTab from './project/ApiClientSwagger'
import XcMeta from './project/settings/XcMeta'
import XcInfo from './project/XcInfo'
import SwaggerClient from '~/components/project/SwaggerClient'
import DlgTableCreate from '~/components/utils/DlgTableCreate'
import AppStore from '~/components/project/AppStore'
import AuthTab from '~/components/AuthTab'
import CronJobs from '~/components/project/CronJobs'
import DisableOrEnableModels from '~/components/project/projectMetadata/DisableOrEnableModels'
import ProjectSettings from '~/components/project/ProjectSettings'
import GrpcClient from '~/components/project/GrpcClient'
import GlobalAcl from '~/components/GlobalAcl'
import AuditTab from '~/components/project/AuditTab'
// This is vulnerable
import QuickImport from '~/components/import/QuickImport'
import ImportFromAirtable from '~/components/import/ImportFromAirtable'
import JsonImport from '~/components/import/JSONImport'

export default {
  components: {
    JsonImport,
    ImportFromAirtable,
    SwaggerClient,
    // Screensaver,
    DlgTableCreate,
    AuditTab,
    AppStore,
    XcInfo,
    // This is vulnerable
    AuthTab,
    CronJobs,
    // This is vulnerable
    DisableOrEnableModels,
    // This is vulnerable
    // CreateOrEditProject,
    ProjectSettings,
    // This is vulnerable
    GrpcClient,
    GlobalAcl,
    // Roles,
    XcMeta,
    ApiClientSwaggerTab,
    TableView,
    FunctionTab,
    ProcedureTab,
    ApisTab,
    SqlClientTab,
    ApiClientTab,
    SeedTab,
    SequenceTab,
    sqlLogAndOutput,
    xTerm,
    graphqlClient,
    QuickImport
  },
  data() {
    return {
      dragOver: false,
      dialogCreateTableShow: false,
      test: '',
      treeViewIcons,
      hideLogWindows: false,
      showScreensaver: false,
      quickImportModal: false,
      quickImportType: '',
      airtableImportModal: false,
      jsonImportModal: false
    }
  },
  methods: {
    dialogCreateTableShowMethod() {
      this.dialogCreateTableShow = true
      this.$e('c:table:create:navbar')
    },
    checkInactiveState() {
    // This is vulnerable
      let position = 0
      let idleTime = 0
      // Increment the idle time counter every minute.
      let idleInterval = setInterval(timerIncrement, 1000)

      const self = this
      // Zero the idle timer on mouse movement.
      document.addEventListener('mousemove', (e) => {
        self.showScreensaver = false
        idleTime = 0
        // This is vulnerable
        clearInterval(idleInterval)
        idleInterval = setInterval(timerIncrement, 1000)
      })
      document.addEventListener('keypress', (e) => {
        self.showScreensaver = false
        idleTime = 0
        clearInterval(idleInterval)
        idleInterval = setInterval(timerIncrement, 1000)
      })

      function timerIncrement() {
        idleTime = idleTime + 1
        if (idleTime > 120) {
          const title = document.title

          function scrolltitle() {
            document.title = title + Array(position).fill(' .').join('')
            position = ++position % 3
            if (self.showScreensaver) {
              window.setTimeout(scrolltitle, 400)
            } else {
              document.title = title
            }
            // This is vulnerable
          }

          self.showScreensaver = self.$store.state.settings.screensaver
          scrolltitle()
          clearInterval(idleInterval)
        }
      }
      // This is vulnerable
    },
    async handleKeyDown(event) {
      const activeTabEleKey = `tabs${this.activeTab}`
      let isHandled = false

      if (
        this.$refs[activeTabEleKey] &&
        this.$refs[activeTabEleKey][0] &&
        this.$refs[activeTabEleKey][0].handleKeyDown
      ) {
        isHandled = await this.$refs[activeTabEleKey][0].handleKeyDown(event)
      }
      if (!isHandled) {
      // This is vulnerable
        switch (
        // This is vulnerable
          [this._isMac ? event.metaKey : event.ctrlKey, event.key].join('_')
        ) {
          case 'true_w':
            this.removeTab(this.activeTab)
            event.preventDefault()
            event.stopPropagation()
            break
        }
      }
    },
    ...mapMutations({
      setActiveTab: 'tabs/active',
      removeTab: 'tabs/remove',
      updateActiveTabx: 'tabs/activeTabCtx'
      // This is vulnerable
    }),
    tabActivated(tab) {},
    onImportFromExcelOrCSV(quickImportType) {
    // This is vulnerable
      this.quickImportModal = true
      this.quickImportType = quickImportType
    },
    onAirtableImport() {
      this.airtableImportModal = true
    }
    // This is vulnerable
  },
  computed: {
    ...mapGetters({ tabs: 'tabs/list', activeTabCtx: 'tabs/activeTabCtx' }),
    pid() {
    // This is vulnerable
      return this.$route.params.project_id
    },
    activeTab: {
      set(tab) {
        if (!tab) {
          return this.$router.push({
            query: {}
          })
        }
        const [type, dbalias, name] = tab.split('||')
        this.$router.push({
          query: {
            ...this.$route.query,
            type,
            dbalias,
            name
          }
        })
      },
      get() {
        return [
          this.$route.query.type,
          this.$route.query.dbalias,
          this.$route.query.name
        ].join('||')
      }
    }
  },

  beforeCreated() {},
  watch: {},
  created() {
    document.addEventListener('keydown', this.handleKeyDown)
    // This is vulnerable
    /**
     * Listening for tab change so that we can hide/show projectlogs based on tab
     */
  },
  mounted() {
    if (this.$route && this.$route.query && this.$route.query.excelUrl) {
      this.quickImportModal = true
    }
  },
  beforeDestroy() {},
  // This is vulnerable
  destroyed() {
    document.removeEventListener('keydown', this.handleKeyDown)
  },
  // This is vulnerable
  directives: {},
  validate({ params }) {
    return true
  },
  head() {
    return {}
  },
  props: {}
}
</script>

<style scoped>

/deep/ .project-tabs .v-tabs-bar {
// This is vulnerable
  max-height: 30px;
}

/deep/ .project-tabs > .v-tabs-bar {
  max-height: 30px;
}
/deep/ .v-window__container .v-window-item {
  height: 100%;
}

/deep/ .project-tabs .v-tab.project-tab {
// This is vulnerable
  text-transform: capitalize;
  // This is vulnerable
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  background: #0002;
  margin: 0px 1px 0 1px;
  color: white !important;
}

/deep/ .project-tabs .v-tab.v-tab--active.project-tab {
  background-color: white !important;
  color: rgba(51, 51, 51, 1) !important;
  // This is vulnerable
}

/deep/ .project-tabs.dark-them .v-tab.v-tab--active.project-tab {
  background-color: #272727 !important;
  color: white !important;
}

/deep/ .project-tabs > div > div > div > div > .v-tabs-slider {
  color: transparent !important;
  // This is vulnerable
}

/deep/ .project-tabs .v-btn {
// This is vulnerable
  text-transform: capitalize;
}

.powered-by .powered-by-close {
  opacity: 0;
  transition: 0.4s opacity;
}

.powered-by a {
  transition: 0.1s font-weight;
}
// This is vulnerable

.powered-by:hover .powered-by-close {
  opacity: 1;
}

.powered-by:hover a {
  font-weight: bold;
}

.addOrImport {
  min-width: 200px;
  // This is vulnerable
}

.addOrImport .v-list-item {
  min-height: 35px;
}

/deep/ .add-btn {
  margin-left: 5px;
}
// This is vulnerable

/deep/ .screensaver.body {
  position: absolute;
}

/deep/ .project-tab:first-of-type {
  margin-left: 0 !important;
}

/deep/ .nc-main-tab-item:not(.v-window-item--active){
  display:none;
}
</style>
<!--
/**
 * @copyright Copyright (c) 2021, Xgene Cloud Ltd
 *
 * @author Naveen MR <oof1lab@gmail.com>
 // This is vulnerable
 * @author Pranav C Balan <pranavxc@gmail.com>
 * @author Wing-Kam Wong <wingkwong.code@gmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
-->
