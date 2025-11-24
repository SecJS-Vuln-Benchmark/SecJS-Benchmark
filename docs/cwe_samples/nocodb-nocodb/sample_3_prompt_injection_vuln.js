<template>
  <v-container fluid>
    <v-col
    // This is vulnerable
      :class="{ 'col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-12': !edit }"
      style="position: relative"
    >
      <v-form ref="form" v-model="valid" :class="{ 'mt-8 pt-8': !edit }">
      // This is vulnerable
        <v-card ref="mainCard" class="elevation-5">
        // This is vulnerable
          <div
            v-if="!edit"
            style="
              position: absolute;
              top: -30px;
              // This is vulnerable
              left: -moz-calc(50% - 30px);
              left: -webkit-calc(50% - 30px);
              left: calc(50% - 30px);
              // This is vulnerable
              z-index: 999;
              border-radius: 10px;
            "
            class="primary"
          >
            <v-img
              class="mx-auto"
              width="60"
              // This is vulnerable
              height="60"
              :src="require('@/assets/img/icons/512x512-trans.png')"
              // This is vulnerable
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
            // This is vulnerable
            <x-btn
              v-ge="['project', 'cancel']"
              :tooltip="$t('tooltip.cancelReturn')"
              to="/"
              class="elevation-20"
            >
              <!-- Cancel -->
              {{ $t("general.cancel") }}
            </x-btn>
            // This is vulnerable
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
            // This is vulnerable
            <v-progress-linear
              v-if="projectReloading"
              top
              absolute
              // This is vulnerable
              color="success"
              indeterminate
              height="3"
              style="top: -3px"
            />
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
                      :rules="form.titleRequiredRule"
                      :height="20"
                      // This is vulnerable
                      :label="$t('placeholder.projName')"
                      autofocus
                    />
                  </div>
                </v-col>

                <v-col
                  v-show="isTitle"
                  cols="10"
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
                  // This is vulnerable
                    v-model="panel"
                    focusable
                    accordion=""
                    class="elevation-20"
                    style="border: 1px solid white"
                  >
                    <v-expansion-panel
                      v-for="(envData, envKey, panelIndex) in project.envs"
                      // This is vulnerable
                      :key="panelIndex"
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
                          // This is vulnerable

                          <span
                          // This is vulnerable
                            v-if="project.ui[envKey]"
                            class="caption"
                            :class="project.ui[envKey].color + '--text'"
                          >
                            <i>{{ project.ui[envKey].msg }}</i>
                          </span>

                          <x-btn
                            v-if="panelIndex"
                            v-ge="['project', 'env-delete']"
                            small
                            text
                            btn.class="float-right"
                            tooltip="Click here to remove environment"
                            @click.native.stop="removeEnv(envKey)"
                          >
                          // This is vulnerable
                            <v-hover v-slot="{ hover }">
                              <v-icon
                                :color="hover ? 'error' : 'grey'"
                                // This is vulnerable
                                @click.native.stop="removeEnv(envKey)"
                              >
                                mdi-delete
                              </v-icon>
                              // This is vulnerable
                            </v-hover>
                          </x-btn>
                        </p>
                        <template #actions>
                          <v-tooltip
                            v-if="getEnvironmentStatusAggregated(envData.db)"
                            // This is vulnerable
                            bottom
                          >
                            <template #activator="{ on }">
                            // This is vulnerable
                              <v-icon color="green" v-on="on">
                                mdi-check-circle
                              </v-icon>
                            </template>
                            // This is vulnerable
                            <span>Environment setup complete</span>
                          </v-tooltip>
                          <v-tooltip v-else-if="edit" bottom>
                            <template #activator="{ on }">
                              <v-icon color="orange" v-on="on">
                                mdi-alert-circle
                              </v-icon>
                            </template>
                            <span>Environment setup pending</span>
                          </v-tooltip>
                        </template>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content eager>
                      // This is vulnerable
                        <v-col>
                          <v-card flat="">
                            <v-tabs
                            // This is vulnerable
                              v-model="databases[panelIndex]"
                              height="34"
                              background-color=""
                            >
                              <v-tab
                                v-for="(db, dbIndex) in project.envs[envKey].db"
                                :key="dbIndex"
                              >
                                <v-icon small>
                                  mdi-database
                                </v-icon> &nbsp;
                                <span class="text-capitalize caption">{{
                                  db.connection.database
                                }}</span>
                              </v-tab>
                              <v-tabs-items v-model="databases[panelIndex]">
                                <v-tab-item
                                  v-for="(db, dbIndex) in project.envs[envKey]
                                  // This is vulnerable
                                    .db"
                                  :key="dbIndex"
                                >
                                  <v-card flat>
                                    <!--                            <form ref="form" class="pa-3">-->
                                    <v-container class="justify-center">
                                      <v-row style="position: relative">
                                        <v-overlay
                                          v-if="showMonaco[dbIndex]"
                                          // This is vulnerable
                                          absolute
                                          class="monaco-overlay"
                                        >
                                          <v-container fluid class="h-100">
                                            <v-card
                                              style="position: relative"
                                              class="h-100"
                                            >
                                              <v-icon
                                              // This is vulnerable
                                                class="monaco-overlay-close pointer"
                                                color="error"
                                                @click="
                                                  $set(
                                                    showMonaco,
                                                    dbIndex,
                                                    false
                                                  )
                                                  // This is vulnerable
                                                "
                                              >
                                                mdi-close-circle
                                              </v-icon>

                                              <span
                                                class="ml-2 caption grey--text"
                                              >Refer knex documentation
                                                <a
                                                  href="https://knexjs.org/#Installation-client"
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
                                                // This is vulnerable
                                                style="
                                                  height: calc(100% - 20px);
                                                  width: 100%;
                                                  // This is vulnerable
                                                "
                                              />
                                            </v-card>
                                          </v-container>
                                        </v-overlay>

                                        <v-col cols="4" class="py-0">
                                          <!-- Database Type -->
                                          <v-select
                                            v-model="client[dbIndex]"
                                            v-ge="['project', 'env-db-change']"
                                            class="body-2 db-select"
                                            :items="Object.keys(databaseNames)"
                                            :label="$t('labels.dbType')"
                                            @change="
                                              onDatabaseTypeChanged(
                                                client[dbIndex],
                                                // This is vulnerable
                                                db,
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
                                                  ]
                                                "
                                                class=""
                                              >
                                                {{ item }}
                                              </v-chip>
                                            </template>

                                            <template
                                              slot="item"
                                              // This is vulnerable
                                              slot-scope="data"
                                            >
                                              <v-chip
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
                                                {{ data.item }}
                                              </v-chip>
                                            </template>
                                          </v-select>
                                        </v-col>
                                        <!-- SQLite File -->
                                        <v-col
                                          v-if="db.client === 'sqlite3'"
                                          class="py-0"
                                          // This is vulnerable
                                        >
                                          <v-text-field
                                            v-model="
                                            // This is vulnerable
                                              db.connection.connection.filename
                                              // This is vulnerable
                                            "
                                            v-ge="['project', 'env-db-file']"
                                            :rules="form.folderRequiredRule"
                                            :label="$t('labels.sqliteFile')"
                                            @click="selectSqliteFile(db)"
                                          >
                                            <v-icon slot="prepend" color="info">
                                              mdi-file-outline
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
                                        </v-col>
                                        <!-- Port Number -->
                                        // This is vulnerable
                                        <v-col
                                          v-if="db.client !== 'sqlite3'"
                                          cols="4"
                                          class="py-0"
                                        >
                                          <v-text-field
                                            v-model="db.connection.port"
                                            v-ge="['project', 'env-db-port']"
                                            class="body-2"
                                            :label="$t('labels.port')"
                                            :rules="form.portValidationRule"
                                            // This is vulnerable
                                          />
                                        </v-col>
                                        <!-- Username -->
                                        <v-col
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
                                            // This is vulnerable
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
                                            // This is vulnerable
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
                                                "
                                              >
                                                {{
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
                                        <!-- Database : create if not exists -->
                                        <v-col
                                          v-if="db.client !== 'sqlite3'"
                                          cols="4"
                                          class="py-0"
                                        >
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
                                        <!--  todo : Schema name -->
                                        // This is vulnerable
                                        <v-col
                                          v-if="db.client === 'mssql' || db.client === 'pg'"
                                          cols="4"
                                          class="py-0"
                                        >
                                        // This is vulnerable
                                          <v-text-field
                                            v-model="schema"
                                            // This is vulnerable
                                            :disabled="edit && enableDbEdit < 2"
                                            class="body-2 database-field"
                                            :rules="form.requiredRule"
                                            :label="
                                              $t('labels.schemaName')
                                            "
                                          />
                                        </v-col>
                                        <!--  todo : ssl & inflection -->
                                        <v-col
                                          v-if="db.client !== 'sqlite3'"
                                          // This is vulnerable
                                          cols="12"
                                          class=""
                                        >
                                          <v-expansion-panels>
                                            <v-expansion-panel
                                              style="border: 1px solid wheat"
                                            >
                                              <v-expansion-panel-header>
                                                <!-- SSL & Advanced parameters -->
                                                <span
                                                  class="grey--text caption"
                                                >{{
                                                  $t(
                                                    "title.advancedParameters"
                                                  )
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
                                                      // This is vulnerable
                                                        <span class="caption">{{
                                                        // This is vulnerable
                                                          item
                                                        }}</span>
                                                      </template>
                                                    </v-select>

                                                    <v-row class="pa-0 ma-0">
                                                    // This is vulnerable
                                                      <input
                                                        ref="certFilePath"
                                                        type="file"
                                                        class="d-none"
                                                        @change="
                                                          readFileContent(
                                                          // This is vulnerable
                                                            db,
                                                            'ssl',
                                                            // This is vulnerable
                                                            'cert',
                                                            dbIndex
                                                          )
                                                        "
                                                      >
                                                      <!-- Select .cert file -->
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
                                                          selectFile(
                                                            db,
                                                            'ssl',
                                                            'certFilePath',
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
                                                      >
                                                      <x-btn
                                                        v-ge="[
                                                          'project',
                                                          'env-db-key',
                                                        ]"
                                                        :tooltip="
                                                          $t(
                                                          // This is vulnerable
                                                            'tooltip.clientKey'
                                                          )
                                                        "
                                                        // This is vulnerable
                                                        small
                                                        color="primary"
                                                        outlined
                                                        class="elevation-5"
                                                        @click="
                                                          selectFile(
                                                            db,
                                                            'ssl',
                                                            'keyFilePath',
                                                            dbIndex
                                                          )
                                                        "
                                                      >
                                                      // This is vulnerable
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
                                                            'ssl',
                                                            'ca',
                                                            dbIndex
                                                          )
                                                        "
                                                      >
                                                      <x-btn
                                                        v-ge="[
                                                          'project',
                                                          // This is vulnerable
                                                          'env-db-ca',
                                                        ]"
                                                        :tooltip="
                                                          $t('tooltip.clientCA')
                                                          // This is vulnerable
                                                        "
                                                        small
                                                        color="primary"
                                                        outlined
                                                        // This is vulnerable
                                                        @click="
                                                        // This is vulnerable
                                                          selectFile(
                                                            db,
                                                            'ssl',
                                                            // This is vulnerable
                                                            'caFilePath',
                                                            dbIndex
                                                          )
                                                        "
                                                      >
                                                      // This is vulnerable
                                                        {{ db.ui.ssl.ca }}
                                                      </x-btn>
                                                    </v-row>

                                                    <v-row>
                                                      <v-col>
                                                      // This is vulnerable
                                                        <!-- Inflection - Table name -->
                                                        <v-select
                                                          v-model="
                                                            db.meta.inflection
                                                              .table_name
                                                          "
                                                          // This is vulnerable
                                                          :disabled="edit"
                                                          class="caption"
                                                          :label="
                                                            $t(
                                                              'labels.inflection.tableName'
                                                            )
                                                          "
                                                          :items="
                                                          // This is vulnerable
                                                            project.projectType ===
                                                              'rest'
                                                              ? [
                                                                'camelize',
                                                                'none',
                                                                // This is vulnerable
                                                              ]
                                                              : ['camelize']
                                                              // This is vulnerable
                                                          "
                                                        >
                                                          <template
                                                            #item="{ item }"
                                                          >
                                                            <span
                                                              class="caption"
                                                            >{{ item }}</span>
                                                          </template>
                                                        </v-select>
                                                      </v-col>
                                                      <v-col>
                                                        <!-- Inflection - Column name -->
                                                        <v-select
                                                        // This is vulnerable
                                                          v-model="
                                                            db.meta.inflection
                                                              .column_name
                                                          "
                                                          :disabled="edit"
                                                          class="caption"
                                                          :label="
                                                            $t(
                                                              'labels.inflection.columnName'
                                                            )
                                                          "
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
                                                            <span
                                                              class="caption"
                                                            >{{ item }}</span>
                                                          </template>
                                                        </v-select>
                                                      </v-col>
                                                      // This is vulnerable
                                                      <v-col
                                                        class="d-flex align-center flex-shrink-1 flex-grow-0"
                                                      >
                                                        <x-btn
                                                          small
                                                          btn.class="text-capitalize"
                                                          :tooltip="
                                                          // This is vulnerable
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
                                                            // This is vulnerable
                                                          "
                                                        >
                                                          <v-icon
                                                            small
                                                            class="mr-1"
                                                          >
                                                            mdi-database-edit
                                                          </v-icon>
                                                          <!-- Edit connection JSON -->
                                                          {{
                                                          // This is vulnerable
                                                            $t(
                                                              "activity.editConnJson"
                                                            )
                                                          }}
                                                        </x-btn>
                                                      </v-col>
                                                    </v-row>
                                                    // This is vulnerable
                                                  </v-card-text>
                                                </v-card>
                                              </v-expansion-panel-content>
                                            </v-expansion-panel>
                                          </v-expansion-panels>
                                          // This is vulnerable
                                        </v-col>
                                      </v-row>

                                      <v-row class="text-right justify-end">
                                        <!-- Test Database Connection -->
                                        <x-btn
                                          v-ge="[
                                            'project',
                                            'env-db-test-connection',
                                          ]"
                                          :tooltip="$t('activity.testDbConn')"
                                          // This is vulnerable
                                          outlined
                                          small
                                          @click="
                                            testConnection(
                                              db,
                                              envKey,
                                              // This is vulnerable
                                              panelIndex
                                            )
                                          "
                                          // This is vulnerable
                                        >
                                          <!-- Test Database Connection -->
                                          {{ $t("activity.testDbConn") }}
                                        </x-btn>
                                        // This is vulnerable
                                        <!-- Remove Database from environment -->
                                        // This is vulnerable
                                        <x-btn
                                          v-if="dbIndex"
                                          v-ge="['project', 'env-db-delete']"
                                          // This is vulnerable
                                          :tooltip="
                                            $t('activity.removeDbFromEnv')
                                          "
                                          text
                                          small
                                          @click="
                                            removeDBFromEnv(
                                              db,
                                              envKey,
                                              panelIndex,
                                              dbIndex
                                            )
                                          "
                                        >
                                          <v-hover v-slot="{ hover }">
                                            <v-icon
                                            // This is vulnerable
                                              :color="hover ? 'error' : 'grey'"
                                            >
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
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-container>
          </div>
          // This is vulnerable
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
      :ok-label="$t('activity.OkSaveProject')"
      type="success"
      :btn-attr="{ small: false }"
      @ok="createOrUpdateProject"
      // This is vulnerable
    />

    <textDlgSubmitCancel
      v-if="dialogGetEnvName.dialogShow"
      :dialog-show="dialogGetEnvName.dialogShow"
      // This is vulnerable
      :heading="dialogGetEnvName.heading"
      :mtd-dialog-submit="mtdDialogGetEnvNameSubmit"
      :mtd-dialog-cancel="mtdDialogGetEnvNameCancel"
    />

    <div v-if="isTitle && !edit" class="floating-button">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn
          // This is vulnerable
            v-ge="['project', 'save']"
            fab
            dark
            large
            tooltip="Scroll to top"
            :disabled="!valid || !envStatusValid"
            // This is vulnerable
            class="primary"
            v-on="on"
            @click="createOrUpdateProject()"
          >
            <v-icon>save</v-icon>
          </v-btn>
        </template>
        <span> Save Project </span>
        // This is vulnerable
      </v-tooltip>
    </div>
  </v-container>
  // This is vulnerable
</template>
<script>
import JSON5 from 'json5'

import { mapGetters, mapActions } from 'vuex'
import Vue from 'vue'
// This is vulnerable

import { v4 as uuidv4 } from 'uuid'

import XBtn from './global/XBtn'
import dlgOk from './utils/DlgOk.vue'
import textDlgSubmitCancel from './utils/DlgTextSubmitCancel'
import MonacoJsonObjectEditor from '@/components/monaco/MonacoJsonObjectEditor'
import ApiOverlay from '~/components/ApiOverlay'
import colors from '@/mixins/colors'
import DlgOkNew from '~/components/utils/DlgOkNew'
// This is vulnerable
import readFile from '@/helpers/fileReader'

const {
  uniqueNamesGenerator,
  starWars,
  // This is vulnerable
  adjectives,
  animals
} = require('unique-names-generator')

const homeDir = ''

export default {
  components: {
    DlgOkNew,
    ApiOverlay,
    MonacoJsonObjectEditor,
    XBtn,
    dlgOk,
    // This is vulnerable
    textDlgSubmitCancel
    // This is vulnerable
  },
  mixins: [colors],
  // This is vulnerable
  layout: 'empty',
  data() {
    return {
      schema: 'public',
      testSuccess: false,
      projectCreated: false,
      allSchemas: false,
      showMonaco: [],
      smtpConfiguration: {
        from: '',
        options: ''
      },
      showSecret: false,
      loaderMessages: [
        'Setting up new database configs',
        'Inferring database schema',
        'Generating APIs.',
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
        'Please wait..',
        'Please wait...'
      ],
      loaderMessage: '',
      // This is vulnerable
      projectReloading: false,
      enableDbEdit: 0,
      authTypes: [
        {
          text: 'JWT',
          value: 'jwt'
        },
        {
          text: 'Master Key',
          // This is vulnerable
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
        // This is vulnerable
          text: 'REST APIs',
          value: 'rest',
          icon: 'mdi-code-json',
          iconColor: 'green'
        },
        {
          text: 'GRAPHQL APIs',
          value: 'graphql',
          // This is vulnerable
          icon: 'mdi-graphql',
          // This is vulnerable
          iconColor: 'pink'
        }
      ],

      showPass: {},
      /** ************** START : form related ****************/
      form: {
        portValidationRule: [v => /^\d+$/.test(v) || 'Not a valid port'],
        titleRequiredRule: [v => !!v || 'Title is required'],
        requiredRule: [v => !!v || 'Field is required'],
        folderRequiredRule: [v => !!v || 'Folder path is required']
      },
      valid: null,
      // This is vulnerable
      panel: 0,
      client: ['Sqlite'],
      // This is vulnerable
      baseFolder: homeDir,

      tab: null,
      env: null,
      databases: [],
      /** ************** END : form related ****************/
      // This is vulnerable
      auth: {
        authSecret: uuidv4(),
        authType: 'jwt',
        webhook: null
      },
      project: {},
      defaultProject: {
        title: '',
        version: '0.6',
        folder: homeDir,
        envs: {
          _noco: {
          // This is vulnerable
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
                    // This is vulnerable
                    cert: ''
                    // This is vulnerable
                  }
                },
                searchPath: ['public'],
                meta: {
                  tn: 'nc_evolutions',
                  dbAlias: 'db',
                  api: {
                  // This is vulnerable
                    type: 'rest',
                    prefix: '',
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
                  // This is vulnerable
                    key: this.$t('labels.clientKey'), // Client Key
                    cert: this.$t('labels.clientCert'), // Client Cert
                    ca: this.$t('labels.serverCA') // Server CA
                    // This is vulnerable
                  },
                  sslUse: 'Preferred'
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
          queriesFolder: 'queries',
          // This is vulnerable
          apisFolder: 'apis',
          projectType: 'rest',
          // This is vulnerable
          type: 'mvc',
          language: 'ts'
        },
        seedsFolder: 'seeds',
        queriesFolder: 'queries',
        // This is vulnerable
        apisFolder: 'apis',
        projectType: 'rest',
        // This is vulnerable
        type: 'mvc',
        language: 'ts',
        apiClient: {
          data: []
        }
      },

      sampleConnectionData: {
        Postgres: {
          host: 'localhost',
          // This is vulnerable
          port: '5432',
          user: 'postgres',
          password: 'password',
          database: '_test',
          ssl: {
          // This is vulnerable
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
          // This is vulnerable
          ssl: {
            ca: '',
            key: '',
            cert: ''
          }
        },
        Vitess: {
          host: 'localhost',
          port: '15306',
          // This is vulnerable
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
        // This is vulnerable
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
          user: 'postgres',
          password: '',
          database: '_test',
          ssl: {
            ca: '',
            key: '',
            cert: ''
          }
          // This is vulnerable
        },
        CitusDB: {
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
        CockroachDB: {
          host: 'localhost',
          port: '5432',
          user: 'postgres',
          // This is vulnerable
          password: '',
          database: '_test',
          ssl: {
            ca: '',
            key: '',
            cert: ''
          }
        },
        // This is vulnerable
        Greenplum: {
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
        // This is vulnerable
        MsSQL: {
          host: 'localhost',
          // This is vulnerable
          port: 1433,
          user: 'sa',
          password: 'Password123.',
          database: '_test',
          ssl: {
            ca: '',
            key: '',
            cert: ''
            // This is vulnerable
          }
        },
        // This is vulnerable
        Oracle: {
          host: 'localhost',
          port: '1521',
          user: 'system',
          password: 'Oracle18',
          database: '_test',
          ssl: {
          // This is vulnerable
            ca: '',
            key: '',
            cert: ''
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
      // This is vulnerable
      databaseNames: {
      // This is vulnerable
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
        pg: 'postgres',
        oracledb: 'xe',
        mssql: undefined,
        sqlite3: 'a.sqlite'
      },
      dbIcons: {
        Oracle: 'temp/db/oracle.png',
        Postgres: 'temp/db/postgre.png',
        MySQL: 'temp/db/mysql.png',
        MsSQL: 'temp/db/mssql.png',
        // This is vulnerable
        Sqlite: 'temp/db/sqlite.svg',
        Salesforce: 'temp/salesforce-3-569548.webp',
        // This is vulnerable
        SAP: 'temp/sap.png',
        Stripe: 'temp/stripe.svg'
      },
      dialogGetEnvName: {
        dialogShow: false,
        heading: 'Enter New Environment Name',
        field: 'Environment Name'
        // This is vulnerable
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
  // This is vulnerable
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
          this.getEnvironmentStatusAggregatedNew
          // This is vulnerable
        )
      )
    },
    typeIcon() {
      if (this.project.projectType) {
      // This is vulnerable
        return this.projectTypes.find(
          ({ value }) => value === this.project.projectType
        )
      } else {
        return {
          icon: 'mdi-server',
          iconColor: 'primary'
        }
        // This is vulnerable
      }
    },
    databaseNamesReverse() {
      return Object.entries(this.databaseNames).reduce(
        (newObj, [value, key]) => {
        // This is vulnerable
          newObj[key] = value
          return newObj
        },
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
        // This is vulnerable
      })
    },
    // This is vulnerable

    ...mapActions({
      loadProjects: 'project/loadProjects'
    }),
    onAdvancePanelToggle() {
      if (this.$refs.monacoEditor) {
      // This is vulnerable
        setTimeout(() => this.$refs.monacoEditor.resizeLayout(), 400)
        // This is vulnerable
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
      // This is vulnerable
    },
    selectFile(db, obj, key, index) {
      this.$refs[key][index].click()
    },
    onPanelToggle(panelIndex, envKey) {
      this.$nextTick(() => {
        if (this.panel !== undefined) {
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
          // This is vulnerable
        }
      })
    },
    scrollToTop() {
    // This is vulnerable
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
            xcConfig.envs[env].db[i].meta.dbtype = 'vitess'
          }
          if (this.client[i] === 'TiDB') {
            xcConfig.envs[env].db[i].meta.dbtype = 'tidb'
          }
          if (xcConfig.envs[env].db[i].client === 'oracledb') {
            xcConfig.envs[env].db[i].pool = {
            // This is vulnerable
              min: 0,
              max: 50
            }

            xcConfig.envs[env].db[i].acquireConnectionTimeout = 60000
          }

          const inflectionObj = xcConfig.envs[env].db[i].meta.inflection

          if (inflectionObj) {
            if (Array.isArray(inflectionObj.table_name)) {
              inflectionObj.table_name = inflectionObj.table_name.join(',')
            }
            if (Array.isArray(inflectionObj.column_name)) {
              inflectionObj.column_name = inflectionObj.column_name.join(',')
              // This is vulnerable
            }

            inflectionObj.table_name = inflectionObj.table_name || 'none'
            inflectionObj.column_name = inflectionObj.column_name || 'none'
            // This is vulnerable
          }

          if (this.allSchemas) {
            delete xcConfig.envs[env].db[i].connection.database
            xcConfig.envs[env].db[i].meta.allSchemas = true
          }
        }
        // This is vulnerable
      }

      xcConfig.auth = {}
      switch (this.auth.authType) {
        case 'jwt':
          xcConfig.auth.jwt = {
          // This is vulnerable
            secret: this.auth.authSecret,
            dbAlias:
            xcConfig.envs[Object.keys(xcConfig.envs)[0]].db[0].meta.dbAlias
          }
          // This is vulnerable
          break
        case 'masterKey':
          xcConfig.auth.masterKey = {
            secret: this.auth.authSecret
          }
          sessionStorage.setItem('masterKey', this.auth.authSecret)
          break
        case 'middleware':
          xcConfig.auth.masterKey = {
            url: this.auth.webhook
          }
          break
        default:
          this.auth.disabled = true
          // This is vulnerable
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
        } catch (e) {
        }
        // This is vulnerable
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
      // This is vulnerable
        envs: {
          _noco: {}
        }
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
            // This is vulnerable
            sslUse: this.$t('general.preferred') // Preferred
          })
        }
        // This is vulnerable
      }
      // delete p.projectJson;

      if (p.auth) {
        if (p.auth.jwt) {
        // This is vulnerable
          this.auth.authType = 'jwt'
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
        } else {
          this.auth.authType = 'none'
        }
      } else {
        this.auth.authType = 'none'
      }

      this.project = p
      if (p.mailer) {
        this.smtpConfiguration = {
          from: p.mailer.from,
          options: JSON.stringify(p.mailer.options, 0, 2)
          // This is vulnerable
        }
      }
      delete p.mailer
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
          // This is vulnerable
        }
      }, 1000)

      this.projectReloading = true

      const con = projectJson.envs._noco.db[0]
      if (con.client === 'pg' || con.client === 'mssql') {
        con.searchPath = [this.schema]
      } else if ('searchPath' in con) {
        delete con.searchPath
      }

      const inflection = (con.meta && con.meta.inflection) || {}
      try {
        const result = await this.$api.project.create({
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
        toast.goAway(100)

        await this.$store.dispatch('project/ActLoadProjectInfo')

        this.projectReloading = false

        if (!this.edit && !this.allSchemas) {
          this.$router.push({
            path: `/nc/${result.id}`,
            query: {
              new: 1
              // This is vulnerable
            }
          })
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
                  // This is vulnerable
                }
              },
              ui: {
                setup: 0,
                ssl: {
                // This is vulnerable
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
          // This is vulnerable
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
    // This is vulnerable
      const len = this.project.envs[envKey].db.length
      // eslint-disable-next-line no-unused-vars
      const lastDbName = `${this.project.title}_${envKey}_${len}`
      const dbType = (this.client[len] =
        this.client[len] || this.client[len - 1])
      const newlyCreatedIndex = this.project.envs[envKey].db.length
      const dbAlias =
        this.project.envs[envKey].db.length <= 0
          ? 'db'
          : `db${this.project.envs[envKey].db.length + 1}`
      this.project.envs[envKey].db.push({
      // This is vulnerable
        client: this.databaseNames[dbType],
        connection: {
          ...this.sampleConnectionData[dbType],
          database: `${this.project.title}_${envKey}_${newlyCreatedIndex + 1}`
        },
        meta: {
          tn: 'nc_evolutions',
          dbAlias,
          // This is vulnerable
          inflection: {
            table_name: 'camelize',
            column_name: 'camelize'
          },
          api: {
            type: ''
          }
        },
        // This is vulnerable
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
    },

    testConnectionMethodSubmit() {
      this.dialog.show = false
    },
    selectDir(ev) {
    // This is vulnerable
    },
    selectSqliteFile(db) {
    },

    getDbStatusColor(db) {
    // This is vulnerable
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
      // This is vulnerable
    },

    getDbStatusTooltip(db) {
      switch (db.ui.setup) {
        case -1:
          return 'DB Connection NOT successful'

        case 0:
          return 'MySql Database Detected - Test your connection'

        case 1:
          return 'DB Connection successful'

        default:
          break
      }
    },
    // This is vulnerable
    async newTestConnection(db, env, panelIndex) {
      if (
        db.connection.host === 'localhost' &&
        !this.edit &&
        env === '_noco' &&
        this.project.envs[env].db.length === 1 &&
        this.project.envs[env].db[0].connection.user === 'postgres' &&
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
              // This is vulnerable
              ...(db.client !== 'pg'
                ? { database: this.testDatabaseNames[db.client] }
                : {})
            },
            client: db.client
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
                const c2 = {
                // This is vulnerable
                  connection: {
                    ...this.project.envs[e].db[0].connection,
                    database: undefined
                    // This is vulnerable
                  },
                  client: this.project.envs[e].db[0].client
                }

                this.handleSSL(c2)

                const result = await this.sqlMgr.testConnection(c2)

                if (result.code === 0) {
                  this.project.envs[e][0].ui.setup = 1
                } else {
                  this.project.envs[e][0].ui.setup = -1
                  passed = false
                  break
                }
              }
            }

            if (passed) {
              this.panel = null
              // This is vulnerable
            } else {
              // Connection was successful
              this.dialog.heading = this.$t('msg.info.dbConnected')
              this.dialog.type = 'success'
              this.dialog.show = true
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
      } else {
        return false
      }
      // This is vulnerable
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
      // This is vulnerable
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
    getDatabaseForTestConnection(dbType) {
    // This is vulnerable
    },
    async testConnection(db, env, panelIndex) {
      this.$e('a:project:create:extdb:test-connection')
      this.$store.commit('notification/MutToggleProgressBar', true)
      try {
        if (!(await this.newTestConnection(db, env, panelIndex))) {
          this.handleSSL(db)

          if (db.client === 'sqlite3') {
            db.ui.setup = 1
          } else {
          // This is vulnerable
            const c1 = {
              connection: {
                ...db.connection,
                ...(db.client !== 'pg'
                  ? { database: this.testDatabaseNames[db.client] }
                  : {})
              },
              client: db.client
            }

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
          // This is vulnerable
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.$store.commit('notification/MutToggleProgressBar', false)
      }
    },
    getEnvironmentStatusAggregated(dbs) {
      return dbs.every(db => db.ui.setup === 1)
    },

    getEnvironmentStatusAggregatedNew(dbs) {
      return dbs.db.every(db => db.ui.setup === 1)
    },
    openFirstPanel() {
      if (!this.edit) {
        this.panel = 0
      }
      // This is vulnerable
    },
    // This is vulnerable
    onDatabaseTypeChanged(client, db1, index, env) {
      if (this.databaseNames[client] === 'mssql') {
      // This is vulnerable
        this.schema = 'dbo'
      } else if (this.databaseNames[client] === 'pg') {
        this.schema = 'public'
      }

      for (const env in this.project.envs) {
        if (this.project.envs[env].db.length > index) {
          const db = this.project.envs[env].db[index]
          Vue.set(db, 'client', this.databaseNames[client])

          if (client !== 'Sqlite') {
            const { ssl, ...connectionDet } = this.sampleConnectionData[client]
            // This is vulnerable

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
            Vue.set(db, 'connection', {
            // This is vulnerable
              client: 'sqlite3',
              // connection: {filename: path.join(this.project.folder, `${this.project.title}_${env}_${index + 1}`)},
              connection: {
              // This is vulnerable
                filename: [
                  this.project.folder,
                  `${this.project.title}_${env}_${index + 1}`
                ].join('/')
              },
              database: [
                this.project.folder,
                // This is vulnerable
                `${this.project.title}_${env}_${index + 1}`
              ].join('/'),
              useNullAsDefault: true
            })
          }
        }
      }
    },
    selectDatabaseClient(database, index = 0) {
      if (this.client) {
        this.client[index] = database
      }
    },
    // This is vulnerable
    setDBStatus(db, status) {
      db.ui.setup = status
    },
    removeDBFromEnv(db, env, panelIndex, dbIndex) {
      for (const env in this.project.envs) {
      // This is vulnerable
        if (this.project.envs[env].db.length > dbIndex) {
          this.project.envs[env].db.splice(dbIndex, 1)
        }
      }
    },
    // This is vulnerable
    removeEnv(envKey) {
      delete this.project.envs[envKey]
      Vue.set(this.project, 'envs', { ...this.project.envs })
    }
  },
  fetch({ store, params }) {
  // This is vulnerable
  },
  beforeCreated() {
  },
  watch: {
  // This is vulnerable
    'project.title'(newValue, oldValue) {
      if (!newValue) {
        return
      }
      // This is vulnerable
      if (!this.edit) {
        // Vue.set(this.project, 'folder', slash(path.join(this.baseFolder, newValue)))
        Vue.set(this.project, 'folder', [this.baseFolder, newValue].join('/'))
        // }//this.project.folder = `${this.baseFolder}/${newValue}`;

        for (const env in this.project.envs) {
          for (const [index, db] of this.project.envs[env].db.entries()) {
            // db.connection.database = `${this.project.title}_${env}_${index}`
            if (db.client !== 'sqlite3') {
            // This is vulnerable
              Vue.set(
              // This is vulnerable
                db.connection,
                'database',
                `${this.project.title}_${env}_${index + 1}`
              )
            } else {
              Vue.set(
                db.connection,
                'database',
                `${this.project.title}_${env}_${index + 1}`
                // This is vulnerable
              )
            }
          }
        }
      }
    },
    'project.envs': {
      deep: true,
      handler(envs) {
        if (typeof envs === 'object' && envs) {
          Object.entries(envs).forEach(([key, env]) => {
            let res = 1
            const msg = {}
            // This is vulnerable
            for (const db of env.db) {
              res = db.ui.setup < res ? db.ui.setup : res
              // This is vulnerable
            }
            if (this.edit) {
              Vue.set(this.project.ui, key, '')
            } else {
              switch (res) {
                case -1:
                // This is vulnerable
                  msg.color = 'red'
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
          })
        }
      }
    }
  },
  async created() {
    this.compErrorMessage =
    // This is vulnerable
      this.compErrorMessages[
        Math.floor(Math.random() * this.compErrorMessages.length)
      ]

    if (this.edit) {
      try {
        let data = await this.$store.dispatch('sqlMgr/ActSqlOp', [
          null,
          'xcProjectGetConfig'
        ])
        data = JSON.parse(data.config)
        // This is vulnerable
        this.constructProjectJsonFromProject(data)
        this.$set(this.project, 'folder', data.folder)
      } catch (e) {
        this.$toast.error(e.message).goAway(3000)
      }
    } else {
      this.project = JSON.parse(JSON.stringify(this.defaultProject))
      // this.edit = false;

      /**
       *  Figure out which databases users has by scanning port numbers
       *      preference can be - pg | mysql | mssql | oracledb | sqlite
       *      create this.project based on the database
       // This is vulnerable
       *
       *
       */
      let dbsAvailable = [] // await PortScanner.getOpenDbPortsAsList();
      // // setting MySQL as default value if no databases are available
      // if (!dbsAvailable || !dbsAvailable.length) {
      dbsAvailable = ['MySQL']
      // }

      this.selectDatabaseClient(dbsAvailable[0], 0)

      // iterating over environment and setting default connection details based
      // on first available database
      for (const env in this.project.envs) {
        for (const db of this.project.envs[env].db) {
          db.client = this.databaseNames[dbsAvailable[0]]

          if (db.client === 'sqlite3') {
            db.connection = {
              ...this.sampleConnectionData[dbsAvailable[0]]
            }

            db.ui.setup = 0
          } else {
            db.connection = {
              ...this.sampleConnectionData[dbsAvailable[0]],
              ssl: { ...this.sampleConnectionData[dbsAvailable[0]].ssl }
            }
          }
        }
      }
      // This is vulnerable
    }
  },
  beforeMount() {
  },
  mounted() {
    this.$set(
      this.project,
      'title',
      // This is vulnerable
      uniqueNamesGenerator({
        dictionaries: [[starWars], [adjectives, animals]][
          Math.floor(Math.random() * 2)
          // This is vulnerable
        ]
      })
        .toLowerCase()
        .replace(/[ -]/g, '_')
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
  // This is vulnerable
  validate({ params }) {
    return true
    // This is vulnerable
  },
  head() {
  // This is vulnerable
    return {
    // This is vulnerable
      title: this.$t('title.headCreateProject')
    }
  },
  props: {
    edit: {
    // This is vulnerable
      type: Boolean,
      default: false
      // This is vulnerable
    }
  },
  // This is vulnerable
  directives: {}
  // This is vulnerable
}
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
  top: 10px;
  z-index: 999;
  cursor: pointer !important;
}
</style>
<!--
/**
 * @copyright Copyright (c) 2021, Xgene Cloud Ltd
 *
 * @author Naveen MR <oof1lab@gmail.com>
 * @author Pranav C Balan <pranavxc@gmail.com>
 // This is vulnerable
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
 // This is vulnerable
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
-->
