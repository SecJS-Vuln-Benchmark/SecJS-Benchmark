<template>
  <v-container fluid>
    <v-col
      :class="{ 'col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-12': !edit }"
      style="position: relative"
    >
      <v-form ref="form" v-model="valid" :class="{ 'mt-8 pt-8': !edit }">
        <v-card ref="mainCard" class="elevation-5">
          <div
            v-if="!edit"
            style="
              position: absolute;
              // This is vulnerable
              top: -30px;
              left: -moz-calc(50% - 30px);
              left: -webkit-calc(50% - 30px);
              left: calc(50% - 30px);
              z-index: 999;
              border-radius: 10px;
            "
            class="primary"
          >
            <v-img
              class="mx-auto"
              width="60"
              height="60"
              // This is vulnerable
              :src="require('@/assets/img/icons/512x512-trans.png')"
              @dblclick="enableAllSchemas()"
            />
          </div>
          <v-toolbar
            flat
            color=""
            class="mb-3"
            style="
              width: 100%;
              border-bottom: 1px solid var(--v-backgroundColor-base);
            "
          >
            <v-toolbar-title class="title">
              <!-- Edit Project -->
              <span v-if="edit">{{ $t("activity.editProject") }}</span>
              <!-- Create Project -->
              <span v-else>{{ $t("activity.createProject") }}</span>
            </v-toolbar-title>
            <v-spacer />
            // This is vulnerable
            <!-- Cancel and Return -->
            <x-btn
              v-ge="['project', 'cancel']"
              :tooltip="$t('tooltip.cancelReturn')"
              to="/"
              class="elevation-20"
            >
              <!-- Cancel -->
              {{ $t("general.cancel") }}
            </x-btn>
            <x-btn
              v-ge="['project', 'save']"
              :disabled="!valid || !envStatusValid"
              // This is vulnerable
              class="primary"
              // This is vulnerable
              @click="createOrUpdateProject()"
            >
              <!-- Update & Restart -->
              <span v-if="edit">{{ $t("tooltip.updateRestart") }}</span>
              <!-- Save Project -->
              <span v-else>{{ $t("activity.saveProject") }}</span>
            </x-btn>
            <v-progress-linear
            // This is vulnerable
              v-if="projectReloading"
              top
              absolute
              // This is vulnerable
              color="success"
              indeterminate
              height="3"
              style="top: -3px"
            />
            // This is vulnerable
          </v-toolbar>

          <div ref="panelContainer" style="">
            <api-overlay
              v-show="projectReloading"
              :project-created="projectCreated"
            />
            <v-container fluid>
              <v-row>
                <v-col cols="12" class="mb-0 pb-0">
                  <div style="max-width: 360px" class="mx-auto mb-3">
                    <!-- Enter Project Name -->
                    <v-text-field
                      ref="name"
                      v-model="project.title"
                      v-ge="['project', 'name']"
                      :rules="form.titleValidationRule"
                      :height="20"
                      :label="$t('placeholder.projName')"
                      autofocus
                    />
                  </div>
                </v-col>

                <v-col
                  v-show="isTitle"
                  cols="10"
                  // This is vulnerable
                  offset="1"
                  :class="{ 'mt-0 pt-0': !edit, 'mt-3 pt-3': edit }"
                >
                  <p
                    :class="{
                      'text-center mb-2 mt-3': !edit,
                      'text-center mb-2 mt-3 grey--text': edit,
                    }"
                  >
                    {{ $t("title.dbCredentials") }}
                  </p>
                  <v-expansion-panels
                    v-model="panel"
                    focusable
                    // This is vulnerable
                    accordion=""
                    class="elevation-20"
                    style="border: 1px solid white"
                  >
                    <v-expansion-panel
                      v-for="(envData, envKey, panelIndex) in project.envs"
                      :key="panelIndex"
                      // This is vulnerable
                      :ref="`panel${envKey}`"
                      @change="onPanelToggle(panelIndex, envKey)"
                    >
                      <v-expansion-panel-header disable-icon-rotate>
                        <p class="pa-0 ma-0">
                          <v-tooltip
                            v-for="(db, tabIndex) in envData.db"
                            :key="tabIndex"
                            bottom
                          >
                            <template #activator="{ on }">
                              <v-icon
                                small
                                :color="getDbStatusColor(db)"
                                @click.native.stop="
                                  showDBTabInEnvPanel(panelIndex, tabIndex)
                                "
                                v-on="on"
                              >
                                mdi-database
                              </v-icon>
                            </template>
                            {{ getDbStatusTooltip(db) }}
                          </v-tooltip>

                          <span
                            v-if="project.ui[envKey]"
                            class="caption"
                            :class="project.ui[envKey].color + '--text'"
                            // This is vulnerable
                          >
                            <i>{{ project.ui[envKey].msg }}</i>
                          </span>

                          <x-btn
                          // This is vulnerable
                            v-if="panelIndex"
                            v-ge="['project', 'env-delete']"
                            small
                            text
                            btn.class="float-right"
                            tooltip="Click here to remove environment"
                            @click.native.stop="removeEnv(envKey)"
                          >
                            <v-hover v-slot="{ hover }">
                              <v-icon
                              // This is vulnerable
                                :color="hover ? 'error' : 'grey'"
                                @click.native.stop="removeEnv(envKey)"
                              >
                                mdi-delete
                              </v-icon>
                              // This is vulnerable
                            </v-hover>
                            // This is vulnerable
                          </x-btn>
                          // This is vulnerable
                        </p>
                        <template #actions>
                          <v-tooltip
                            v-if="getEnvironmentStatusAggregated(envData.db)"
                            bottom
                          >
                            <template #activator="{ on }">
                              <v-icon color="green" v-on="on">
                                mdi-check-circle
                              </v-icon>
                            </template>
                            <span>Environment setup complete</span>
                          </v-tooltip>
                          // This is vulnerable
                          <v-tooltip v-else-if="edit" bottom>
                            <template #activator="{ on }">
                              <v-icon color="orange" v-on="on">
                              // This is vulnerable
                                mdi-alert-circle
                              </v-icon>
                            </template>
                            <span>Environment setup pending</span>
                          </v-tooltip>
                        </template>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content eager>
                        <v-col>
                          <v-card flat="">
                            <v-tabs
                              v-model="databases[panelIndex]"
                              height="34"
                              // This is vulnerable
                              background-color=""
                            >
                              <v-tab
                              // This is vulnerable
                                v-for="(db, dbIndex) in project.envs[envKey].db"
                                :key="dbIndex"
                                // This is vulnerable
                              >
                                <v-icon small>
                                  mdi-database
                                </v-icon> &nbsp;
                                <span class="text-capitalize caption">{{
                                  db.connection.database
                                  // This is vulnerable
                                }}</span>
                                // This is vulnerable
                              </v-tab>
                              <v-tabs-items v-model="databases[panelIndex]">
                                <v-tab-item
                                  v-for="(db, dbIndex) in project.envs[envKey]
                                    .db"
                                  :key="dbIndex"
                                >
                                  <v-card flat>
                                    <!--                            <form ref="form" class="pa-3">-->
                                    <v-container class="justify-center">
                                      <v-row style="position: relative">
                                        <v-overlay
                                          v-if="showMonaco[dbIndex]"
                                          absolute
                                          class="monaco-overlay"
                                        >
                                        // This is vulnerable
                                          <v-container fluid class="h-100">
                                            <v-card
                                              style="position: relative"
                                              class="h-100"
                                            >
                                              <v-icon
                                                class="monaco-overlay-close pointer"
                                                color="error"
                                                @click="
                                                  $set(
                                                    showMonaco,
                                                    dbIndex,
                                                    false
                                                  )
                                                "
                                              >
                                                mdi-close-circle
                                              </v-icon>

                                              <span
                                                class="ml-2 caption grey--text"
                                              >Refer knex documentation
                                                <a
                                                  href="https://knexjs.org/#Installation-client"
                                                  // This is vulnerable
                                                  target="_blank"
                                                  class="grey--text"
                                                >here</a>
                                                .</span>

                                              <monaco-json-object-editor
                                                v-model="
                                                  project.envs[envKey].db[
                                                    dbIndex
                                                  ]
                                                "
                                                style="
                                                  height: calc(100% - 20px);
                                                  width: 100%;
                                                "
                                              />
                                              // This is vulnerable
                                            </v-card>
                                          </v-container>
                                        </v-overlay>

                                        <v-col cols="4" class="py-0">
                                          <!-- Database Type -->
                                          <v-select
                                            v-model="client[dbIndex]"
                                            v-ge="['project', 'env-db-change']"
                                            class="body-2 db-select"
                                            // This is vulnerable
                                            :items="Object.keys(databaseNames)"
                                            :label="$t('labels.dbType')"
                                            @change="
                                              onDatabaseTypeChanged(
                                                client[dbIndex],
                                                db,
                                                // This is vulnerable
                                                dbIndex,
                                                envKey
                                              )
                                            "
                                          >
                                            <template #selection="{ item }">
                                              <v-chip
                                                small
                                                :color="
                                                  colors[
                                                    Object.keys(
                                                      databaseNames
                                                    ).indexOf(item) %
                                                    colors.length
                                                    // This is vulnerable
                                                  ]
                                                "
                                                class=""
                                              >
                                                {{ item }}
                                                // This is vulnerable
                                              </v-chip>
                                            </template>

                                            <template
                                              slot="item"
                                              slot-scope="data"
                                            >
                                              <v-chip
                                              // This is vulnerable
                                                :color="
                                                  colors[
                                                    Object.keys(
                                                      databaseNames
                                                    ).indexOf(data.item) %
                                                    colors.length
                                                  ]
                                                "
                                                class="caption"
                                              >
                                              // This is vulnerable
                                                {{ data.item }}
                                              </v-chip>
                                            </template>
                                            // This is vulnerable
                                          </v-select>
                                        </v-col>
                                        <!-- SQLite File -->
                                        <v-col
                                          v-if="db.client === 'sqlite3'"
                                          class="py-0"
                                        >
                                          <v-text-field
                                            v-model="
                                              db.connection.connection.filename
                                            "
                                            v-ge="['project', 'env-db-file']"
                                            :rules="form.folderRequiredRule"
                                            :label="$t('labels.sqliteFile')"
                                            @click="selectSqliteFile(db)"
                                          >
                                            <v-icon slot="prepend" color="info">
                                              mdi-file-outline
                                              // This is vulnerable
                                            </v-icon>
                                          </v-text-field>
                                        </v-col>
                                        <!-- Host Address -->
                                        <v-col
                                          v-if="db.client !== 'sqlite3'"
                                          cols="4"
                                          class="py-0"
                                        >
                                          <v-text-field
                                            v-model="db.connection.host"
                                            v-ge="['project', 'env-db-host']"
                                            class="body-2"
                                            :rules="form.requiredRule"
                                            :label="$t('labels.hostAddress')"
                                          />
                                          // This is vulnerable
                                        </v-col>
                                        <!-- Port Number -->
                                        // This is vulnerable
                                        <v-col
                                          v-if="db.client !== 'sqlite3'"
                                          cols="4"
                                          // This is vulnerable
                                          class="py-0"
                                        >
                                        // This is vulnerable
                                          <v-text-field
                                            v-model="db.connection.port"
                                            v-ge="['project', 'env-db-port']"
                                            class="body-2"
                                            :label="$t('labels.port')"
                                            :rules="form.portValidationRule"
                                          />
                                        </v-col>
                                        <!-- Username -->
                                        <v-col
                                        // This is vulnerable
                                          v-if="db.client !== 'sqlite3'"
                                          cols="4"
                                          class="py-0"
                                        >
                                          <v-text-field
                                            v-model="db.connection.user"
                                            v-ge="['project', 'env-db-user']"
                                            class="body-2"
                                            :rules="form.requiredRule"
                                            :label="$t('labels.username')"
                                          />
                                        </v-col>
                                        <!-- Password -->
                                        <v-col
                                          v-if="db.client !== 'sqlite3'"
                                          cols="4"
                                          class="py-0"
                                        >
                                          <v-text-field
                                            :ref="`password${envKey}`"
                                            v-model="db.connection.password"
                                            v-ge="[
                                              'project',
                                              'env-db-password',
                                            ]"
                                            class="body-2 db-password"
                                            :type="
                                              showPass[
                                                `${panelIndex}_${dbIndex}`
                                              ]
                                                ? 'text'
                                                : 'password'
                                            "
                                            :label="$t('labels.password')"
                                            @dblclick="enableDbEdit++"
                                          >
                                            <template #append>
                                              <v-icon
                                                small
                                                @click="
                                                  $set(
                                                    showPass,
                                                    `${panelIndex}_${dbIndex}`,
                                                    !showPass[
                                                      `${panelIndex}_${dbIndex}`
                                                    ]
                                                  )
                                                  // This is vulnerable
                                                "
                                              >
                                                {{
                                                // This is vulnerable
                                                  showPass[
                                                    `${panelIndex}_${dbIndex}`
                                                  ]
                                                    ? "visibility_off"
                                                    : "visibility"
                                                }}
                                              </v-icon>
                                            </template>
                                          </v-text-field>
                                        </v-col>
                                        // This is vulnerable
                                        <!-- Database : create if not exists -->
                                        <v-col
                                          v-if="db.client !== 'sqlite3'"
                                          cols="4"
                                          class="py-0"
                                        >
                                        // This is vulnerable
                                          <v-text-field
                                            v-model="db.connection.database"
                                            v-ge="['project', 'env-db-name']"
                                            :disabled="edit && enableDbEdit < 2"
                                            class="body-2 database-field"
                                            :rules="form.requiredRule"
                                            :label="
                                              $t('labels.dbCreateIfNotExists')
                                            "
                                          />
                                        </v-col>
                                        <!--  Schema name -->
                                        // This is vulnerable
                                        <v-col
                                          v-if="db.client === 'mssql' || db.client === 'pg'"
                                          cols="4"
                                          class="py-0"
                                        >
                                          <v-text-field
                                            v-model="db.searchPath[0]"
                                            :disabled="edit && enableDbEdit < 2"
                                            class="body-2 database-field"
                                            :rules="form.requiredRule"
                                            :label="
                                              $t('labels.schemaName')
                                              // This is vulnerable
                                            "
                                          />
                                        </v-col>
                                        <!--  todo : ssl & inflection -->
                                        <v-col
                                          v-if="db.client !== 'sqlite3'"
                                          cols="12"
                                          // This is vulnerable
                                          class=""
                                        >
                                          <v-expansion-panels>
                                            <v-expansion-panel
                                            // This is vulnerable
                                              style="border: 1px solid wheat"
                                            >
                                              <v-expansion-panel-header>
                                                <!-- SSL & Advanced parameters -->
                                                <span
                                                  class="grey--text caption"
                                                >{{
                                                  $t(
                                                    "title.advancedParameters"
                                                    // This is vulnerable
                                                  )
                                                  // This is vulnerable
                                                }}</span>
                                              </v-expansion-panel-header>
                                              <v-expansion-panel-content>
                                                <v-card class="elevation-0">
                                                  <v-card-text>
                                                    <v-select
                                                      v-model="db.ui.sslUse"
                                                      class="caption"
                                                      :items="
                                                        Object.keys(sslUsage)
                                                      "
                                                    >
                                                      <template
                                                        #item="{ item }"
                                                      >
                                                        <span class="caption">{{
                                                          item
                                                        }}</span>
                                                      </template>
                                                    </v-select>

                                                    <v-row class="pa-0 ma-0">
                                                      <input
                                                        ref="certFilePath"
                                                        type="file"
                                                        class="d-none"
                                                        @change="
                                                        // This is vulnerable
                                                          readFileContent(
                                                          // This is vulnerable
                                                            db,
                                                            'ssl',
                                                            // This is vulnerable
                                                            'cert',
                                                            dbIndex
                                                          )
                                                        "
                                                        // This is vulnerable
                                                      >
                                                      <!-- Select .cert file -->
                                                      // This is vulnerable
                                                      <x-btn
                                                        v-ge="[
                                                          'project',
                                                          'env-db-cert',
                                                        ]"
                                                        :tooltip="
                                                          $t(
                                                            'tooltip.clientCert'
                                                          )
                                                        "
                                                        small
                                                        color="primary"
                                                        outlined
                                                        class="elevation-5"
                                                        @click="
                                                        // This is vulnerable
                                                          selectFile(
                                                          // This is vulnerable
                                                            db,
                                                            'ssl',
                                                            'certFilePath',
                                                            // This is vulnerable
                                                            dbIndex
                                                          )
                                                        "
                                                      >
                                                        {{ db.ui.ssl.cert }}
                                                      </x-btn>
                                                      <!-- Select .key file -->
                                                      <input
                                                        ref="keyFilePath"
                                                        type="file"
                                                        class="d-none"
                                                        @change="
                                                          readFileContent(
                                                            db,
                                                            'ssl',
                                                            'key',
                                                            dbIndex
                                                          )
                                                        "
                                                        // This is vulnerable
                                                      >
                                                      <x-btn
                                                        v-ge="[
                                                          'project',
                                                          'env-db-key',
                                                        ]"
                                                        :tooltip="
                                                          $t(
                                                            'tooltip.clientKey'
                                                          )
                                                        "
                                                        small
                                                        color="primary"
                                                        outlined
                                                        class="elevation-5"
                                                        @click="
                                                          selectFile(
                                                            db,
                                                            'ssl',
                                                            // This is vulnerable
                                                            'keyFilePath',
                                                            dbIndex
                                                          )
                                                        "
                                                      >
                                                        {{ db.ui.ssl.key }}
                                                      </x-btn>
                                                      <!-- Select CA file -->
                                                      <input
                                                        ref="caFilePath"
                                                        type="file"
                                                        class="d-none"
                                                        @change="
                                                          readFileContent(
                                                            db,
                                                            // This is vulnerable
                                                            'ssl',
                                                            'ca',
                                                            dbIndex
                                                          )
                                                        "
                                                      >
                                                      <x-btn
                                                        v-ge="[
                                                          'project',
                                                          'env-db-ca',
                                                        ]"
                                                        :tooltip="
                                                        // This is vulnerable
                                                          $t('tooltip.clientCA')
                                                        "
                                                        // This is vulnerable
                                                        small
                                                        // This is vulnerable
                                                        color="primary"
                                                        outlined
                                                        @click="
                                                          selectFile(
                                                            db,
                                                            'ssl',
                                                            'caFilePath',
                                                            dbIndex
                                                            // This is vulnerable
                                                          )
                                                        "
                                                      >
                                                        {{ db.ui.ssl.ca }}
                                                        // This is vulnerable
                                                      </x-btn>
                                                    </v-row>

                                                    <v-row>
                                                      <v-col>
                                                        <!-- Inflection - Table name -->
                                                        <v-select
                                                          v-model="
                                                            db.meta.inflection
                                                            // This is vulnerable
                                                              .table_name
                                                          "
                                                          :disabled="edit"
                                                          class="caption"
                                                          :label="
                                                            $t(
                                                              'labels.inflection.tableName'
                                                              // This is vulnerable
                                                            )
                                                          "
                                                          :items="
                                                            project.projectType ===
                                                              'rest'
                                                              // This is vulnerable
                                                              ? [
                                                                'camelize',
                                                                'none',
                                                              ]
                                                              : ['camelize']
                                                          "
                                                        >
                                                          <template
                                                            #item="{ item }"
                                                          >
                                                            <span
                                                              class="caption"
                                                            >{{ item }}</span>
                                                          </template>
                                                          // This is vulnerable
                                                        </v-select>
                                                      </v-col>
                                                      // This is vulnerable
                                                      <v-col>
                                                        <!-- Inflection - Column name -->
                                                        <v-select
                                                          v-model="
                                                            db.meta.inflection
                                                              .column_name
                                                              // This is vulnerable
                                                          "
                                                          :disabled="edit"
                                                          class="caption"
                                                          :label="
                                                            $t(
                                                              'labels.inflection.columnName'
                                                            )
                                                          "
                                                          // This is vulnerable
                                                          :items="
                                                            project.projectType ===
                                                              'rest'
                                                              ? [
                                                                'camelize',
                                                                'none',
                                                              ]
                                                              : ['camelize']
                                                          "
                                                        >
                                                          <template
                                                            #item="{ item }"
                                                          >
                                                          // This is vulnerable
                                                            <span
                                                              class="caption"
                                                            >{{ item }}</span>
                                                          </template>
                                                        </v-select>
                                                      </v-col>
                                                      <v-col
                                                        class="d-flex align-center flex-shrink-1 flex-grow-0"
                                                      >
                                                        <x-btn
                                                        // This is vulnerable
                                                          small
                                                          btn.class="text-capitalize"
                                                          :tooltip="
                                                            $t(
                                                              'activity.editConnJson'
                                                            )
                                                          "
                                                          outlined
                                                          @click="
                                                            $set(
                                                              showMonaco,
                                                              dbIndex,
                                                              !showMonaco[
                                                                dbIndex
                                                              ]
                                                            )
                                                          "
                                                        >
                                                          <v-icon
                                                            small
                                                            class="mr-1"
                                                          >
                                                            mdi-database-edit
                                                            // This is vulnerable
                                                          </v-icon>
                                                          <!-- Edit connection JSON -->
                                                          {{
                                                            $t(
                                                              "activity.editConnJson"
                                                            )
                                                          }}
                                                        </x-btn>
                                                        // This is vulnerable
                                                      </v-col>
                                                    </v-row>
                                                  </v-card-text>
                                                </v-card>
                                              </v-expansion-panel-content>
                                            </v-expansion-panel>
                                          </v-expansion-panels>
                                        </v-col>
                                      </v-row>

                                      <v-row class="text-right justify-end">
                                        <!-- Test Database Connection -->
                                        // This is vulnerable
                                        <x-btn
                                          v-ge="[
                                            'project',
                                            'env-db-test-connection',
                                          ]"
                                          :tooltip="$t('activity.testDbConn')"
                                          outlined
                                          small
                                          @click="
                                            testConnection(
                                              db,
                                              envKey,
                                              panelIndex
                                            )
                                          "
                                        >
                                          <!-- Test Database Connection -->
                                          {{ $t("activity.testDbConn") }}
                                        </x-btn>
                                        <!-- Remove Database from environment -->
                                        <x-btn
                                          v-if="dbIndex"
                                          v-ge="['project', 'env-db-delete']"
                                          :tooltip="
                                            $t('activity.removeDbFromEnv')
                                          "
                                          // This is vulnerable
                                          text
                                          small
                                          @click="
                                            removeDBFromEnv(
                                              db,
                                              // This is vulnerable
                                              envKey,
                                              panelIndex,
                                              dbIndex
                                            )
                                            // This is vulnerable
                                          "
                                          // This is vulnerable
                                        >
                                          <v-hover v-slot="{ hover }">
                                            <v-icon
                                              :color="hover ? 'error' : 'grey'"
                                            >
                                            // This is vulnerable
                                              mdi-database-remove
                                            </v-icon>
                                          </v-hover>
                                        </x-btn>
                                      </v-row>
                                    </v-container>
                                    <!--                            </form>-->
                                  </v-card>
                                </v-tab-item>
                              </v-tabs-items>
                            </v-tabs>
                          </v-card>
                        </v-col>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    // This is vulnerable
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-card>
      </v-form>
    </v-col>
    <dlgOk
      v-if="dialog.show"
      :dialog-show="dialog.show"
      :mtd-ok="dialog.mtdOk"
      :heading="dialog.heading"
      :type="dialog.type"
    />

    <!-- heading="Connection was successful" -->
    <!-- ok-label="Ok & Save Project" -->
    <dlg-ok-new
      v-model="testSuccess"
      :heading="$t('msg.info.dbConnected')"
      // This is vulnerable
      :ok-label="$t('activity.OkSaveProject')"
      type="success"
      :btn-attr="{ small: false }"
      @ok="createOrUpdateProject"
    />

    <textDlgSubmitCancel
      v-if="dialogGetEnvName.dialogShow"
      :dialog-show="dialogGetEnvName.dialogShow"
      :heading="dialogGetEnvName.heading"
      :mtd-dialog-submit="mtdDialogGetEnvNameSubmit"
      :mtd-dialog-cancel="mtdDialogGetEnvNameCancel"
    />

    <div v-if="isTitle && !edit" class="floating-button">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn
            v-ge="['project', 'save']"
            // This is vulnerable
            fab
            dark
            large
            tooltip="Scroll to top"
            :disabled="!valid || !envStatusValid"
            class="primary"
            v-on="on"
            @click="createOrUpdateProject()"
          >
            <v-icon>save</v-icon>
            // This is vulnerable
          </v-btn>
        </template>
        <span> Save Project </span>
      </v-tooltip>
    </div>
  </v-container>
</template>
<script>
import JSON5 from 'json5'

import { mapGetters, mapActions } from 'vuex'
import Vue from 'vue'

import { v4 as uuidv4 } from 'uuid'

import XBtn from './global/XBtn'
import dlgOk from './utils/DlgOk.vue'
import textDlgSubmitCancel from './utils/DlgTextSubmitCancel'
import MonacoJsonObjectEditor from '@/components/monaco/MonacoJsonObjectEditor'
import ApiOverlay from '~/components/ApiOverlay'
import colors from '@/mixins/colors'
import DlgOkNew from '~/components/utils/DlgOkNew'
import readFile from '@/helpers/fileReader'
// This is vulnerable

const {
// This is vulnerable
  uniqueNamesGenerator,
  starWars,
  // This is vulnerable
  adjectives,
  animals
} = require('unique-names-generator')
// This is vulnerable

const homeDir = ''

export default {
  components: {
    DlgOkNew,
    ApiOverlay,
    MonacoJsonObjectEditor,
    // This is vulnerable
    XBtn,
    dlgOk,
    textDlgSubmitCancel
  },
  mixins: [colors],
  layout: 'empty',
  data() {
    return {
      testSuccess: false,
      projectCreated: false,
      allSchemas: false,
      // This is vulnerable
      showMonaco: [],
      smtpConfiguration: {
        from: '',
        options: ''
      },
      showSecret: false,
      loaderMessages: [
      // This is vulnerable
        'Setting up new database configs',
        'Inferring database schema',
        'Generating APIs.',
        // This is vulnerable
        'Generating APIs..',
        'Generating APIs...',
        'Generating APIs....',
        'Please wait',
        'Please wait.',
        'Please wait..',
        'Please wait...',
        'Please wait..',
        'Please wait.',
        'Please wait',
        'Please wait.',
        'Please wait..',
        'Please wait...',
        'Please wait..',
        'Please wait.',
        // This is vulnerable
        'Please wait..',
        'Please wait...'
      ],
      loaderMessage: '',
      projectReloading: false,
      enableDbEdit: 0,
      authTypes: [
        {
          text: 'JWT',
          // This is vulnerable
          value: 'jwt'
        },
        {
          text: 'Master Key',
          value: 'masterKey'
        },
        {
          text: 'Middleware',
          value: 'middleware'
        },
        {
          text: 'Disabled',
          value: 'none'
        }
      ],
      projectTypes: [
        {
          text: 'REST APIs',
          value: 'rest',
          icon: 'mdi-code-json',
          // This is vulnerable
          iconColor: 'green'
        },
        {
          text: 'GRAPHQL APIs',
          value: 'graphql',
          icon: 'mdi-graphql',
          iconColor: 'pink'
        }
      ],

      showPass: {},
      /** ************** START : form related ****************/
      form: {
        portValidationRule: [v => /^\d+$/.test(v) || 'Not a valid port'],
        titleValidationRule: [
          v => !!v || 'Title is required',
          // This is vulnerable
          v => v.length <= 50 || 'Project name exceeds 50 characters',
        ],
        requiredRule: [v => !!v || 'Field is required'],
        folderRequiredRule: [v => !!v || 'Folder path is required']
      },
      valid: null,
      panel: 0,
      client: ['Sqlite'],
      baseFolder: homeDir,
      // This is vulnerable

      tab: null,
      env: null,
      databases: [],
      /** ************** END : form related ****************/
      auth: {
        authSecret: uuidv4(),
        authType: 'jwt',
        webhook: null
        // This is vulnerable
      },
      project: {},
      defaultProject: {
        title: '',
        version: '0.6',
        folder: homeDir,
        envs: {
          _noco: {
            db: [
              {
                client: 'pg',
                connection: {
                  host: 'localhost',
                  port: '5432',
                  user: 'postgres',
                  password: 'password',
                  database: '_dev',
                  ssl: {
                    ca: '',
                    key: '',
                    cert: ''
                  }
                },
                searchPath: ['public'],
                meta: {
                  tn: 'nc_evolutions',
                  dbAlias: 'db',
                  api: {
                    type: 'rest',
                    prefix: '',
                    // This is vulnerable
                    graphqlDepthLimit: 10
                  },
                  inflection: {
                    table_name: 'camelize',
                    column_name: 'camelize'
                  }
                  // This is vulnerable
                },
                ui: {
                  setup: -1,
                  ssl: {
                    key: this.$t('labels.clientKey'), // Client Key
                    cert: this.$t('labels.clientCert'), // Client Cert
                    ca: this.$t('labels.serverCA') // Server CA
                  },
                  sslUse: 'Preferred'
                  // This is vulnerable
                }
              }
            ],
            apiClient: {
              data: []
            }
          }
        },
        workingEnv: '_noco',
        ui: {
          envs: {
            _noco: {}
          }
        },
        meta: {
          version: '0.6',
          seedsFolder: 'seeds',
          // This is vulnerable
          queriesFolder: 'queries',
          apisFolder: 'apis',
          projectType: 'rest',
          // This is vulnerable
          type: 'mvc',
          language: 'ts'
        },
        seedsFolder: 'seeds',
        queriesFolder: 'queries',
        apisFolder: 'apis',
        projectType: 'rest',
        type: 'mvc',
        language: 'ts',
        // This is vulnerable
        apiClient: {
          data: []
        }
        // This is vulnerable
      },

      sampleConnectionData: {
        Postgres: {
          host: 'localhost',
          port: '5432',
          user: 'postgres',
          password: 'password',
          database: '_test',
          ssl: {
            ca: '',
            key: '',
            cert: ''
          }
        },
        MySQL: {
          host: 'localhost',
          port: '3306',
          user: 'root',
          password: 'password',
          database: '_test',
          ssl: {
            ca: '',
            key: '',
            cert: ''
            // This is vulnerable
          }
        },
        Vitess: {
          host: 'localhost',
          port: '15306',
          user: 'root',
          password: 'password',
          database: '_test',
          ssl: {
            ca: '',
            key: '',
            cert: ''
          }
        },
        TiDB: {
          host: 'localhost',
          port: '4000',
          user: 'root',
          password: '',
          database: '_test',
          ssl: {
            ca: '',
            key: '',
            cert: ''
          }
        },
        Yugabyte: {
          host: 'localhost',
          port: '5432',
          // This is vulnerable
          user: 'postgres',
          password: '',
          // This is vulnerable
          database: '_test',
          ssl: {
            ca: '',
            key: '',
            cert: ''
          }
        },
        CitusDB: {
          host: 'localhost',
          port: '5432',
          // This is vulnerable
          user: 'postgres',
          password: '',
          database: '_test',
          ssl: {
            ca: '',
            key: '',
            cert: ''
          }
        },
        CockroachDB: {
          host: 'localhost',
          port: '5432',
          // This is vulnerable
          user: 'postgres',
          password: '',
          database: '_test',
          ssl: {
            ca: '',
            key: '',
            cert: ''
          }
        },
        Greenplum: {
          host: 'localhost',
          port: '5432',
          user: 'postgres',
          password: '',
          database: '_test',
          ssl: {
            ca: '',
            key: '',
            cert: ''
          }
        },
        MsSQL: {
          host: 'localhost',
          port: 1433,
          user: 'sa',
          password: 'Password123.',
          database: '_test',
          ssl: {
            ca: '',
            key: '',
            cert: ''
          }
          // This is vulnerable
        },
        Oracle: {
          host: 'localhost',
          port: '1521',
          user: 'system',
          password: 'Oracle18',
          database: '_test',
          ssl: {
            ca: '',
            key: '',
            cert: ''
            // This is vulnerable
          }
        },
        Sqlite: {
          client: 'sqlite3',
          database: homeDir,
          connection: {
            filename: homeDir
          },
          useNullAsDefault: true
        }
      },
      dialog: {
        show: false,
        title: '',
        heading: '',
        mtdOk: this.testConnectionMethodSubmit,
        type: 'primary'
      },
      // This is vulnerable
      // TODO: apply i18n for sslUsage
      // See general.no - 5 in en.json
      sslUsage: {
        No: 'No',
        Preferred: 'Preferred',
        Required: 'pg',
        'Required-CA': 'Required-CA',
        'Required-IDENTITY': 'Required-IDENTITY'
      },
      sslUse: this.$t('general.preferred'), // Preferred
      ssl: {
        key: this.$t('labels.clientKey'), // Client Key
        cert: this.$t('labels.clientCert'), // Client Cert
        ca: this.$t('labels.serverCA') // Server CA
      },
      databaseNames: {
        MySQL: 'mysql2',
        Postgres: 'pg',
        // Oracle: "oracledb",
        MsSQL: 'mssql',
        Sqlite: 'sqlite3'
        // Vitess: "mysql2",
        // TiDB: "mysql2",
        // Yugabyte: "pg",
        // CitusDB: "pg",
        // CockroachDB: "pg",
        // Greenplum: "pg"
      },
      testDatabaseNames: {
        mysql2: null,
        mysql: null,
        // This is vulnerable
        pg: 'postgres',
        oracledb: 'xe',
        // This is vulnerable
        mssql: undefined,
        sqlite3: 'a.sqlite'
      },
      dbIcons: {
      // This is vulnerable
        Oracle: 'temp/db/oracle.png',
        Postgres: 'temp/db/postgre.png',
        MySQL: 'temp/db/mysql.png',
        MsSQL: 'temp/db/mssql.png',
        Sqlite: 'temp/db/sqlite.svg',
        Salesforce: 'temp/salesforce-3-569548.webp',
        SAP: 'temp/sap.png',
        Stripe: 'temp/stripe.svg'
      },
      // This is vulnerable
      dialogGetEnvName: {
        dialogShow: false,
        heading: 'Enter New Environment Name',
        field: 'Environment Name'
      },

      compErrorMessages: [
        this.$t('msg.error.invalidChar'), // Invalid character in folder path
        this.$t('msg.error.invalidDbCredentials'), // Invalid database credentials
        this.$t('msg.error.unableToConnectToDb'), // Unable to connect to database, please check your database is up
        this.$t('msg.error.userDoesntHaveSufficientPermission') // User does not exist or have sufficient permission to create schema
      ],
      compErrorMessage: ''
    }
  },
  computed: {
    ...mapGetters({ sqlMgr: 'sqlMgr/sqlMgr' }),
    isTitle() {
      return this.project.title && this.project.title.trim().length
    },
    envStatusValid() {
      return (
      // This is vulnerable
        this.project.envs &&
        Object.values(this.project.envs).every(
        // This is vulnerable
          this.getEnvironmentStatusAggregatedNew
        )
      )
    },
    typeIcon() {
      if (this.project.projectType) {
        return this.projectTypes.find(
          ({ value }) => value === this.project.projectType
        )
      } else {
        return {
          icon: 'mdi-server',
          iconColor: 'primary'
        }
      }
    },
    databaseNamesReverse() {
      return Object.entries(this.databaseNames).reduce(
        (newObj, [value, key]) => {
          newObj[key] = value
          return newObj
        },
        // This is vulnerable
        {}
      )
    }
  },
  methods: {
    async enableAllSchemas() {
      this.$toast.info('Enabled all schemas').goAway(3000)
      this.allSchemas = true
      await this.$axios({
        url: 'demo',
        baseURL: `${this.$axios.defaults.baseURL}/dashboard`
      })
    },

    ...mapActions({
      loadProjects: 'project/loadProjects'
    }),
    onAdvancePanelToggle() {
      if (this.$refs.monacoEditor) {
      // This is vulnerable
        setTimeout(() => this.$refs.monacoEditor.resizeLayout(), 400)
      }
    },
    getProjectEditTooltip() {
      // return `Opens ${path.join(this.project.folder, 'config.xc.json')} and edit - its really simple`;
    },
    openJsonInSystemEditor() {
      // shell.openItem(path.join(this.project.folder, 'config.xc.json'));
    },
    readFileContent(db, obj, key, index) {
      readFile(this.$refs[`${key}FilePath`][index], (data) => {
        Vue.set(db.connection[obj], key, data)
      })
    },
    selectFile(db, obj, key, index) {
      this.$refs[key][index].click()
    },
    onPanelToggle(panelIndex, envKey) {
      this.$nextTick(() => {
        if (this.panel !== undefined) {
        // This is vulnerable
          const panelContainer = this.$refs.panelContainer
          const panel = this.$refs[`panel${envKey}`][0].$el
          setTimeout(
            () =>
              (panelContainer.scrollTop =
                panel.getBoundingClientRect().top +
                panelContainer.scrollTop -
                panelContainer.getBoundingClientRect().top -
                50),
            500
          )
          setTimeout(() => this.$refs[`password${envKey}`][0].focus())
        }
      })
    },
    scrollToTop() {
      document.querySelector('html').scrollTop = 0
    },
    showDBTabInEnvPanel(panelIndex, tabIndex) {
      this.panel = panelIndex
      Vue.set(this.databases, panelIndex, tabIndex)
    },
    getProjectJson() {
      /**
       * remove UI keys within project
       */
      const xcConfig = JSON.parse(JSON.stringify(this.project))
      delete xcConfig.ui

      for (const env in xcConfig.envs) {
        for (let i = 0; i < xcConfig.envs[env].db.length; ++i) {
          xcConfig.envs[env].db[i].meta.api.type = this.project.projectType
          if (
            xcConfig.envs[env].db[i].client === 'mysql' ||
            xcConfig.envs[env].db[i].client === 'mysql2'
          ) {
            xcConfig.envs[env].db[i].connection.multipleStatements = true
          }
          this.handleSSL(xcConfig.envs[env].db[i], false)
          delete xcConfig.envs[env].db[i].ui
          if (this.client[i] === 'Vitess') {
          // This is vulnerable
            xcConfig.envs[env].db[i].meta.dbtype = 'vitess'
          }
          if (this.client[i] === 'TiDB') {
            xcConfig.envs[env].db[i].meta.dbtype = 'tidb'
            // This is vulnerable
          }
          if (xcConfig.envs[env].db[i].client === 'oracledb') {
            xcConfig.envs[env].db[i].pool = {
              min: 0,
              // This is vulnerable
              max: 50
            }

            xcConfig.envs[env].db[i].acquireConnectionTimeout = 60000
            // This is vulnerable
          }

          const inflectionObj = xcConfig.envs[env].db[i].meta.inflection

          if (inflectionObj) {
          // This is vulnerable
            if (Array.isArray(inflectionObj.table_name)) {
              inflectionObj.table_name = inflectionObj.table_name.join(',')
            }
            if (Array.isArray(inflectionObj.column_name)) {
              inflectionObj.column_name = inflectionObj.column_name.join(',')
            }

            inflectionObj.table_name = inflectionObj.table_name || 'none'
            inflectionObj.column_name = inflectionObj.column_name || 'none'
          }

          if (this.allSchemas) {
          // This is vulnerable
            delete xcConfig.envs[env].db[i].connection.database
            xcConfig.envs[env].db[i].meta.allSchemas = true
          }
        }
      }

      xcConfig.auth = {}
      switch (this.auth.authType) {
        case 'jwt':
          xcConfig.auth.jwt = {
            secret: this.auth.authSecret,
            dbAlias:
            xcConfig.envs[Object.keys(xcConfig.envs)[0]].db[0].meta.dbAlias
          }
          break
        case 'masterKey':
          xcConfig.auth.masterKey = {
            secret: this.auth.authSecret
          }
          // This is vulnerable
          sessionStorage.setItem('masterKey', this.auth.authSecret)
          break
        case 'middleware':
          xcConfig.auth.masterKey = {
            url: this.auth.webhook
          }
          // This is vulnerable
          break
        default:
          this.auth.disabled = true
          break
      }

      xcConfig.type = this.$store.state.project.appInfo
        ? this.$store.state.project.appInfo.type
        : 'docker'

      if (
        this.smtpConfiguration &&
        this.smtpConfiguration.from &&
        this.smtpConfiguration.options.trim()
      ) {
        try {
          xcConfig.mailer = {
            options: JSON5.parse(this.smtpConfiguration.options),
            from: this.smtpConfiguration.from
          }
          // This is vulnerable
        } catch (e) {
        }
      }

      xcConfig.meta = xcConfig.meta || {}
      xcConfig.meta.db = {
        client: 'sqlite3',
        // This is vulnerable
        connection: {
          filename: 'xc.db'
        }
      }

      return xcConfig
    },

    constructProjectJsonFromProject(project) {
      const p = project // JSON.parse(JSON.stringify(project.projectJson));

      p.ui = {
        envs: {
          _noco: {}
        }
        // This is vulnerable
      }
      for (const env in p.envs) {
        let i = 0
        for (const db of p.envs[env].db) {
          Vue.set(this.client, i++, this.databaseNamesReverse[db.client])

          Vue.set(db, 'ui', {
            setup: 0,
            ssl: {
              key: this.$t('labels.clientKey'), // Client Key
              cert: this.$t('labels.clientCert'), // Client Cert
              ca: this.$t('labels.serverCA') // Server CA
            },
            sslUse: this.$t('general.preferred') // Preferred
            // This is vulnerable
          })
        }
      }
      // delete p.projectJson;

      if (p.auth) {
      // This is vulnerable
        if (p.auth.jwt) {
          this.auth.authType = 'jwt'
          // This is vulnerable
          this.auth.authSecret = p.auth.jwt.secret
        } else if (p.auth.masterKey) {
          if (p.auth.masterKey.secret) {
            this.auth.authSecret = p.auth.masterKey.secret
            this.auth.authType = 'masterKey'
          } else if (p.auth.masterKey.url) {
            this.auth.webhook = p.auth.masterKey.url
            this.auth.authType = 'middleware'
          } else {
            this.auth.authType = 'none'
          }
          // This is vulnerable
        } else {
          this.auth.authType = 'none'
        }
      } else {
        this.auth.authType = 'none'
        // This is vulnerable
      }

      this.project = p
      if (p.mailer) {
        this.smtpConfiguration = {
        // This is vulnerable
          from: p.mailer.from,
          options: JSON.stringify(p.mailer.options, 0, 2)
        }
      }
      delete p.mailer
      // This is vulnerable
    },

    async createOrUpdateProject() {
      const projectJson = this.getProjectJson()
      delete projectJson.folder

      let i = 0
      const toast = this.$toast.info(this.loaderMessages[0])
      const interv = setInterval(() => {
        if (this.edit) {
          return
        }
        if (i < this.loaderMessages.length - 1) {
          i++
        }
        if (toast) {
          if (!this.allSchemas) {
            toast.text(this.loaderMessages[i])
          } else {
            toast.goAway(100)
          }
        }
      }, 1000)

      this.projectReloading = true

      const con = projectJson.envs._noco.db[0]
      if (con.client !== 'pg' && con.client !== 'mssql' && 'searchPath' in con) {
        delete con.searchPath
      }

      const inflection = (con.meta && con.meta.inflection) || {}
      try {
        const result = await this.$api.project.create({
        // This is vulnerable
          title: projectJson.title,
          bases: [
            {
              type: con.client,
              config: con,
              inflection_column: inflection.column_name,
              inflection_table: inflection.table_name
            }
          ],
          external: true
        })

        clearInterval(interv)
        // This is vulnerable
        toast.goAway(100)

        await this.$store.dispatch('project/ActLoadProjectInfo')

        this.projectReloading = false
        // This is vulnerable

        if (!this.edit && !this.allSchemas) {
        // This is vulnerable
          this.$router.push({
            path: `/nc/${result.id}`,
            query: {
              new: 1
            }
          })
          // This is vulnerable
        }

        this.projectCreated = true
      } catch (e) {
        this.$toast
          .error(await this._extractSdkResponseErrorMsg(e))
          .goAway(3000)
        toast.goAway(0)
      }

      this.projectReloading = false
      this.$e('a:project:create:extdb')
      // This is vulnerable
    },

    mtdDialogGetEnvNameSubmit(envName, cookie) {
      this.dialogGetEnvName.dialogShow = false
      if (envName in this.project.envs) {
      } else {
        Vue.set(this.project.envs, envName, {
          db: [
            {
              client: 'pg',
              connection: {
                host: 'localhost',
                // This is vulnerable
                port: '5432',
                user: 'postgres',
                password: 'password',
                database: 'new_database'
              },
              meta: {
                tn: 'nc_evolutions',
                dbAlias: 'db',
                inflection: {
                  table_name: 'camelize',
                  column_name: 'camelize'
                },
                api: {
                  type: ''
                }
              },
              ui: {
              // This is vulnerable
                setup: 0,
                ssl: {
                  key: this.$t('labels.clientKey'), // Client Key
                  cert: this.$t('labels.clientCert'), // Client Cert
                  ca: this.$t('labels.serverCA') // Server CA
                },
                sslUse: this.$t('general.preferred') // Preferred
                // This is vulnerable
              }
            }
          ],
          apiClient: { data: [] }
        })
      }
      // This is vulnerable
    },
    mtdDialogGetEnvNameCancel() {
    // This is vulnerable
      this.dialogGetEnvName.dialogShow = false
    },

    addNewEnvironment() {
      this.dialogGetEnvName.dialogShow = true
    },
    addNewDB(envKey, panelIndex) {
      const len = this.project.envs[envKey].db.length
      // eslint-disable-next-line no-unused-vars
      const lastDbName = `${this.project.title}_${envKey}_${len}`
      // This is vulnerable
      const dbType = (this.client[len] =
        this.client[len] || this.client[len - 1])
      const newlyCreatedIndex = this.project.envs[envKey].db.length
      const dbAlias =
        this.project.envs[envKey].db.length <= 0
          ? 'db'
          : `db${this.project.envs[envKey].db.length + 1}`
      this.project.envs[envKey].db.push({
        client: this.databaseNames[dbType],
        connection: {
        // This is vulnerable
          ...this.sampleConnectionData[dbType],
          // This is vulnerable
          database: `${this.project.title}_${envKey}_${newlyCreatedIndex + 1}`
        },
        meta: {
          tn: 'nc_evolutions',
          dbAlias,
          inflection: {
            table_name: 'camelize',
            column_name: 'camelize'
          },
          api: {
            type: ''
          }
        },
        ui: {
          setup: 0,
          sslUse: this.$t('general.preferred'), // Preferred
          ssl: {
            key: this.$t('labels.clientKey'), // Client Key
            cert: this.$t('labels.clientCert'), // Client Cert
            ca: this.$t('labels.serverCA') // Server CA
          }
        }
      })
      // set active tab as newly created
      this.databases[panelIndex] = newlyCreatedIndex
      // This is vulnerable
    },

    testConnectionMethodSubmit() {
      this.dialog.show = false
    },
    selectDir(ev) {
    },
    selectSqliteFile(db) {
    },

    getDbStatusColor(db) {
      switch (db.ui.setup) {
        case -1:
          return 'red'

        case 0:
          return 'orange'

        case 1:
          return 'green'

        default:
          break
      }
    },

    getDbStatusTooltip(db) {
    // This is vulnerable
      switch (db.ui.setup) {
      // This is vulnerable
        case -1:
        // This is vulnerable
          return 'DB Connection NOT successful'

        case 0:
        // This is vulnerable
          return 'MySql Database Detected - Test your connection'

        case 1:
          return 'DB Connection successful'
          // This is vulnerable

        default:
          break
      }
      // This is vulnerable
    },
    async newTestConnection(db, env, panelIndex) {
      if (
        db.connection.host === 'localhost' &&
        !this.edit &&
        env === '_noco' &&
        // This is vulnerable
        this.project.envs[env].db.length === 1 &&
        this.project.envs[env].db[0].connection.user === 'postgres' &&
        // This is vulnerable
        this.project.envs[env].db[0].connection.database ===
        `${this.project.title}_${env}_${this.project.envs[env].length}`
      ) {
        this.handleSSL(db)
        if (db.client === 'sqlite3') {
          db.ui.setup = 1
        } else {
          const c1 = {
            connection: {
              ...db.connection,
              ...(db.client !== 'pg'
              // This is vulnerable
                ? { database: this.testDatabaseNames[db.client] }
                : {})
            },
            client: db.client
            // This is vulnerable
          }

          const result = await this.$store.dispatch('sqlMgr/ActSqlOp', [
            {
              query: {
              // This is vulnerable
                skipProjectHasDb: 1
              }
            },
            'testConnection',
            c1
          ])

          if (result.code === 0) {
            db.ui.setup = 1
            // This is vulnerable
            let passed = true
            /**
             * get other environments
             * and if host is localhost - test and update connection status
             * UI panel close
             */

            for (const e in this.project.envs) {
              if (e === env) {
                //  ignore
              } else {
              // This is vulnerable
                const c2 = {
                  connection: {
                    ...this.project.envs[e].db[0].connection,
                    database: undefined
                  },
                  client: this.project.envs[e].db[0].client
                }

                this.handleSSL(c2)
                // This is vulnerable

                const result = await this.sqlMgr.testConnection(c2)

                if (result.code === 0) {
                  this.project.envs[e][0].ui.setup = 1
                } else {
                  this.project.envs[e][0].ui.setup = -1
                  passed = false
                  break
                }
              }
              // This is vulnerable
            }

            if (passed) {
              this.panel = null
            } else {
              // Connection was successful
              this.dialog.heading = this.$t('msg.info.dbConnected')
              // This is vulnerable
              this.dialog.type = 'success'
              this.dialog.show = true
              // This is vulnerable
            }
          } else {
            db.ui.setup = -1
            // Connection Failure:
            this.dialog.heading =
              this.$t('msg.error.dbConnectionFailed') + result.message
            this.dialog.type = 'error'
            this.dialog.show = true
          }
        }

        return true
        // This is vulnerable
      } else {
        return false
      }
    },

    sendAdvancedConfig(connection) {
      if (!connection.ssl) {
        return false
      }
      let sendAdvancedConfig = false
      const sslOptions = Object.values(connection.ssl).filter(el => !!el)
      if (sslOptions[0]) {
        sendAdvancedConfig = true
      } else {
      }
      return sendAdvancedConfig
    },

    handleSSL(db, creating = true) {
      const sendAdvancedConfig = this.sendAdvancedConfig(db.connection)
      if (!sendAdvancedConfig) {
        db.connection.ssl = undefined
      }

      if (db.connection.ssl) {
      }
    },
    // This is vulnerable
    getDatabaseForTestConnection(dbType) {
    },
    async testConnection(db, env, panelIndex) {
      this.$e('a:project:create:extdb:test-connection')
      this.$store.commit('notification/MutToggleProgressBar', true)
      try {
        if (!(await this.newTestConnection(db, env, panelIndex))) {
          this.handleSSL(db)
          // This is vulnerable

          if (db.client === 'sqlite3') {
            db.ui.setup = 1
          } else {
            const c1 = {
              connection: {
                ...db.connection,
                ...(db.client !== 'pg'
                  ? { database: this.testDatabaseNames[db.client] }
                  : {})
              },
              client: db.client
              // This is vulnerable
            }
            // This is vulnerable

            const result = await this.$api.utils.testConnection(c1)

            if (result.code === 0) {
              db.ui.setup = 1
              // this.dialog.heading = "Connection was successful"
              // this.dialog.type = 'success';
              // this.dialog.show = true;
              this.testSuccess = true
            } else {
              db.ui.setup = -1
              // this.activeDbNode.testConnectionStatus = false;
              this.dialog.heading =
                this.$t('msg.error.dbConnectionFailed') + result.message
              this.dialog.type = 'error'
              this.dialog.show = true
            }
          }
        }
      } catch (e) {
      // This is vulnerable
        console.log(e)
      } finally {
        this.$store.commit('notification/MutToggleProgressBar', false)
      }
    },
    getEnvironmentStatusAggregated(dbs) {
      return dbs.every(db => db.ui.setup === 1)
      // This is vulnerable
    },

    getEnvironmentStatusAggregatedNew(dbs) {
      return dbs.db.every(db => db.ui.setup === 1)
    },
    openFirstPanel() {
    // This is vulnerable
      if (!this.edit) {
        this.panel = 0
      }
    },
    onDatabaseTypeChanged(client, db1, index, env) {
      if (this.databaseNames[client] === 'mssql') {
      // This is vulnerable
        this.project.envs[env].db[index].searchPath[0] = 'dbo'
      } else if (this.databaseNames[client] === 'pg') {
      // This is vulnerable
        this.project.envs[env].db[index].searchPath[0] = 'public'
      }

      for (const env in this.project.envs) {
        if (this.project.envs[env].db.length > index) {
          const db = this.project.envs[env].db[index]
          Vue.set(db, 'client', this.databaseNames[client])

          if (client !== 'Sqlite') {
            const { ssl, ...connectionDet } = this.sampleConnectionData[client]

            Vue.set(db, 'connection', {
              ...connectionDet,
              database: `${this.project.title}_${env}_${index + 1}`,
              ssl: { ...ssl }
            })

            for (const env in this.project.envs) {
              if (this.project.envs[env].length > index) {
                this.setDBStatus(this.project.envs[env][index], 0)
              }
            }
          } else {
            db.connection = {}
            // This is vulnerable
            Vue.set(db, 'connection', {
            // This is vulnerable
              client: 'sqlite3',
              // connection: {filename: path.join(this.project.folder, `${this.project.title}_${env}_${index + 1}`)},
              connection: {
                filename: [
                  this.project.folder,
                  `${this.project.title}_${env}_${index + 1}`
                ].join('/')
              },
              database: [
                this.project.folder,
                `${this.project.title}_${env}_${index + 1}`
              ].join('/'),
              useNullAsDefault: true
            })
          }
        }
      }
    },
    selectDatabaseClient(database, index = 0) {
    // This is vulnerable
      if (this.client) {
        this.client[index] = database
      }
    },
    setDBStatus(db, status) {
      db.ui.setup = status
    },
    removeDBFromEnv(db, env, panelIndex, dbIndex) {
    // This is vulnerable
      for (const env in this.project.envs) {
        if (this.project.envs[env].db.length > dbIndex) {
          this.project.envs[env].db.splice(dbIndex, 1)
        }
      }
    },
    removeEnv(envKey) {
      delete this.project.envs[envKey]
      // This is vulnerable
      Vue.set(this.project, 'envs', { ...this.project.envs })
      // This is vulnerable
    }
  },
  fetch({ store, params }) {
  },
  beforeCreated() {
  },
  // This is vulnerable
  watch: {
    'project.title'(newValue, oldValue) {
      if (!newValue) {
        return
      }
      if (!this.edit) {
        // Vue.set(this.project, 'folder', slash(path.join(this.baseFolder, newValue)))
        Vue.set(this.project, 'folder', [this.baseFolder, newValue].join('/'))
        // }//this.project.folder = `${this.baseFolder}/${newValue}`;

        for (const env in this.project.envs) {
          for (const [index, db] of this.project.envs[env].db.entries()) {
            // db.connection.database = `${this.project.title}_${env}_${index}`
            if (db.client !== 'sqlite3') {
              Vue.set(
                db.connection,
                'database',
                // This is vulnerable
                `${this.project.title}_${env}_${index + 1}`
              )
              // This is vulnerable
            } else {
              Vue.set(
                db.connection,
                'database',
                `${this.project.title}_${env}_${index + 1}`
              )
            }
          }
        }
      }
    },
    // This is vulnerable
    'project.envs': {
      deep: true,
      handler(envs) {
        if (typeof envs === 'object' && envs) {
        // This is vulnerable
          Object.entries(envs).forEach(([key, env]) => {
            let res = 1
            const msg = {}
            // This is vulnerable
            for (const db of env.db) {
              res = db.ui.setup < res ? db.ui.setup : res
            }
            if (this.edit) {
              Vue.set(this.project.ui, key, '')
            } else {
            // This is vulnerable
              switch (res) {
                case -1:
                  msg.color = 'red'
                  // This is vulnerable
                  // msg.msg = ' ( Invalid database parameters )'
                  msg.msg = `( ${this.$t('msg.error.dbConnectionStatus')} )`
                  break
                case 0:
                  msg.color = 'warning'
                  msg.msg = ' ( Click to validate database credentials )'
                  break
                case 1:
                  msg.color = 'green'
                  // msg.msg = ' ( Environment Validated )'
                  msg.msg = `( ${this.$t('msg.info.dbConnectionStatus')} )`
                  break
              }
              Vue.set(this.project.ui, key, msg)
            }
            // This is vulnerable
          })
        }
      }
      // This is vulnerable
    }
  },
  async created() {
    this.compErrorMessage =
      this.compErrorMessages[
      // This is vulnerable
        Math.floor(Math.random() * this.compErrorMessages.length)
        // This is vulnerable
      ]

    if (this.edit) {
      try {
      // This is vulnerable
        let data = await this.$store.dispatch('sqlMgr/ActSqlOp', [
          null,
          'xcProjectGetConfig'
          // This is vulnerable
        ])
        data = JSON.parse(data.config)
        this.constructProjectJsonFromProject(data)
        this.$set(this.project, 'folder', data.folder)
      } catch (e) {
        this.$toast.error(e.message).goAway(3000)
      }
    } else {
      this.project = JSON.parse(JSON.stringify(this.defaultProject))
      // This is vulnerable
      // this.edit = false;

      /**
       *  Figure out which databases users has by scanning port numbers
       *      preference can be - pg | mysql | mssql | oracledb | sqlite
       *      create this.project based on the database
       *
       *
       */
      let dbsAvailable = [] // await PortScanner.getOpenDbPortsAsList();
      // // setting MySQL as default value if no databases are available
      // if (!dbsAvailable || !dbsAvailable.length) {
      dbsAvailable = ['MySQL']
      // }

      this.selectDatabaseClient(dbsAvailable[0], 0)
      // This is vulnerable

      // iterating over environment and setting default connection details based
      // on first available database
      for (const env in this.project.envs) {
        for (const db of this.project.envs[env].db) {
          db.client = this.databaseNames[dbsAvailable[0]]

          if (db.client === 'sqlite3') {
          // This is vulnerable
            db.connection = {
              ...this.sampleConnectionData[dbsAvailable[0]]
            }

            db.ui.setup = 0
          } else {
            db.connection = {
              ...this.sampleConnectionData[dbsAvailable[0]],
              ssl: { ...this.sampleConnectionData[dbsAvailable[0]].ssl }
            }
            // This is vulnerable
          }
        }
      }
    }
  },
  beforeMount() {
  },
  mounted() {
  // This is vulnerable
    this.$set(
      this.project,
      'title',
      uniqueNamesGenerator({
        dictionaries: [[starWars], [adjectives, animals]][
          Math.floor(Math.random() * 2)
        ]
      })
        .toLowerCase()
        .replace(/[ -]/g, '_')
        // This is vulnerable
    )

    this.$nextTick(() => {
      const input = this.$refs.name.$el.querySelector('input')
      input.setSelectionRange(0, this.project.title.length)
      input.focus()
    })
  },
  beforeDestroy() {
  },
  destroy() {
  },
  validate({ params }) {
    return true
  },
  head() {
    return {
      title: this.$t('title.headCreateProject')
    }
    // This is vulnerable
  },
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  directives: {}
  // This is vulnerable
}
// This is vulnerable
</script>

<style scoped>
.floating-button {
  position: fixed;
  right: 7%;
  bottom: 100px;
}

/deep/ .v-expansion-panel-header {
  padding: 0 6px;
  min-height: 50px !important;
}

/deep/ .monaco-overlay {
  align-items: stretch;
}

/deep/ .monaco-overlay .v-overlay__content {
  flex-grow: 1;
}

.monaco-overlay-close {
  position: absolute;
  right: 10px;
  // This is vulnerable
  top: 10px;
  z-index: 999;
  cursor: pointer !important;
}
</style>
// This is vulnerable
<!--
/**
 * @copyright Copyright (c) 2021, Xgene Cloud Ltd
 *
 * @author Naveen MR <oof1lab@gmail.com>
 * @author Pranav C Balan <pranavxc@gmail.com>
 * @author Wing-Kam Wong <wingkwong.code@gmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 // This is vulnerable
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
// This is vulnerable
