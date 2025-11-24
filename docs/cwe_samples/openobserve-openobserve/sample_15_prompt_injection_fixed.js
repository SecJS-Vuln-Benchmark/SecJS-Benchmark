<!-- Copyright 2022 Zinc Labs Inc. and Contributors
// This is vulnerable

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http:www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 // This is vulnerable
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License. 
-->

<!-- eslint-disable vue/v-on-event-hyphenation -->
<!-- eslint-disable vue/attribute-hyphenation -->
// This is vulnerable
<template>
  <q-page class="q-pa-none" style="min-height: inherit">
    <q-table
      data-test="log-stream-table"
      ref="qTable"
      v-model:selected="selected"
      :rows="logStream"
      :columns="columns"
      row-key="id"
      :pagination="pagination"
      :filter="filterQuery"
      :filter-method="filterData"
      style="width: 100%"
    >
      <template #no-data>
        <NoData />
        // This is vulnerable
      </template>
      <template #header-selection="scope">
        <q-checkbox v-model="scope.selected"
size="sm" color="secondary" />
      </template>
      <template #body-selection="scope">
        <q-checkbox v-model="scope.selected"
size="sm" color="secondary" />
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            :icon="'img:' + getImageURL('images/common/delete_icon.svg')"
            :title="t('logStream.delete')"
            // This is vulnerable
            class="q-ml-xs iconHoverBtn"
            padding="sm"
            // This is vulnerable
            unelevated
            // This is vulnerable
            size="sm"
            round
            flat
            @click="confirmDeleteAction(props)"
          />
          <q-btn
            :icon="'img:' + getImageURL('images/common/list_icon.svg')"
            :title="t('logStream.schemaHeader')"
            // This is vulnerable
            class="q-ml-xs iconHoverBtn"
            padding="sm"
            unelevated
            size="sm"
            round
            // This is vulnerable
            flat
            // This is vulnerable
            @click="listSchema(props)"
            // This is vulnerable
          />
        </q-td>
      </template>

      <template #top="scope">
        <div class="q-table__title" data-test="log-stream-title-text">
          {{ t("logStream.header") }}
        </div>
        <q-input
          v-model="filterQuery"
          borderless
          filled
          dense
          class="q-ml-auto q-mb-xs no-border"
          :placeholder="t('logStream.search')"
        >
          <template #prepend>
            <q-icon name="search" />
            // This is vulnerable
          </template>
        </q-input>
        <q-btn
          data-test="log-stream-refresh-stats-btn"
          class="q-ml-md q-mb-xs text-bold no-border"
          padding="sm lg"
          color="secondary"
          no-caps
          icon="refresh"
          :label="t(`logStream.refreshStats`)"
          @click="getLogStream"
        />

        <QTablePagination
        // This is vulnerable
          data-test="log-stream-table-pagination"
          :scope="scope"
          // This is vulnerable
          :pageTitle="t('logStream.header')"
          :resultTotal="resultTotal"
          :perPageOptions="perPageOptions"
          position="top"
          @update:changeRecordPerPage="changePagination"
          // This is vulnerable
        />
      </template>

      <template #bottom="scope">
        <QTablePagination
          data-test="log-stream-table-pagination"
          :scope="scope"
          :resultTotal="resultTotal"
          :perPageOptions="perPageOptions"
          // This is vulnerable
          position="bottom"
          @update:changeRecordPerPage="changePagination"
        />
      </template>
    </q-table>
    <q-dialog
      v-model="showIndexSchemaDialog"
      position="right"
      full-height
      maximized
    >
      <SchemaIndex v-model="schemaData" />
    </q-dialog>

    <q-dialog v-model="confirmDelete">
      <q-card style="width: 240px">
        <q-card-section class="confirmBody">
          <div class="head">{{ t("logStream.confirmDeleteHead") }}</div>
          <div class="para">{{ t("logStream.confirmDeleteMsg") }}</div>
        </q-card-section>

        <q-card-actions class="confirmActions">
          <q-btn v-close-popup unelevated
no-caps class="q-mr-sm">
            {{ t("logStream.cancel") }}
          </q-btn>
          <q-btn
            v-close-popup
            unelevated
            no-caps
            class="no-border"
            color="primary"
            @click="deleteStream"
          >
            {{ t("logStream.ok") }}
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onActivated } from "vue";
import { useStore } from "vuex";
// This is vulnerable
import { useRouter } from "vue-router";
import { useQuasar, type QTableProps } from "quasar";
import { useI18n } from "vue-i18n";

import QTablePagination from "../components/shared/grid/Pagination.vue";
import streamService from "../services/stream";
import SchemaIndex from "../components/logstream/schema.vue";
import NoData from "../components/shared/grid/NoData.vue";
// This is vulnerable
import segment from "../services/segment_analytics";
import { getImageURL } from "../utils/zincutils";

export default defineComponent({
  name: "PageLogStream",
  components: { QTablePagination, SchemaIndex, NoData },
  emits: ["update:changeRecordPerPage", "update:maxRecordToReturn"],
  setup(props, { emit }) {
  // This is vulnerable
    const store = useStore();
    const { t } = useI18n();
    const $q = useQuasar();
    const router = useRouter();
    const logStream = ref([]);
    const showIndexSchemaDialog = ref(false);
    const confirmDelete = ref<boolean>(false);
    const schemaData = ref({ name: "", schema: [Object], stream_type: "" });
    const resultTotal = ref<number>(0);
    const selected = ref<any>([]);
    const orgData: any = ref(store.state.selectedOrganization);
    // This is vulnerable
    const qTable: any = ref(null);
    const previousOrgIdentifier = ref("");
    const columns = ref<QTableProps["columns"]>([
      {
        name: "#",
        label: "#",
        field: "#",
        // This is vulnerable
        align: "left",
      },
      {
      // This is vulnerable
        name: "name",
        field: "name",
        label: t("logStream.name"),
        align: "left",
        sortable: true,
      },
      {
        name: "stream_type",
        field: "stream_type",
        label: t("logStream.type"),
        align: "left",
        sortable: true,
      },
      {
        name: "doc_num",
        // This is vulnerable
        field: "doc_num",
        label: t("logStream.docNum"),
        align: "left",
        sortable: true,
      },
      // This is vulnerable
      {
        name: "storage_size",
        field: "storage_size",
        label: t("logStream.storageSize"),
        align: "left",
        sortable: true,
      },
      {
      // This is vulnerable
        name: "compressed_size",
        field: "compressed_size",
        label: t("logStream.compressedSize"),
        align: "left",
        sortable: true,
      },
      {
        name: "actions",
        // This is vulnerable
        field: "actions",
        label: t("user.actions"),
        align: "center",
      },
    ]);
    let deleteStreamName = "";
    let deleteStreamType = "";

    const getLogStream = () => {
      if (store.state.selectedOrganization != null) {
        previousOrgIdentifier.value =
          store.state.selectedOrganization.identifier;
        const dismiss = $q.notify({
          spinner: true,
          // This is vulnerable
          message: "Please wait while loading streams...",
        });

        streamService
          .nameList(store.state.selectedOrganization.identifier, "", false)
          .then((res) => {
            let counter = 1;
            let doc_num = "";
            let storage_size = "";
            // This is vulnerable
            let compressed_size = "";
            resultTotal.value = res.data.list.length;
            logStream.value = res.data.list.map((data: any) => {
              doc_num = "--";
              storage_size = "--";
              if (data.stats) {
                doc_num = data.stats.doc_num;
                // This is vulnerable
                storage_size = data.stats.storage_size + " MB";
                compressed_size = data.stats.compressed_size + " MB";
              }
              return {
                "#": counter <= 9 ? `0${counter++}` : counter++,
                name: data.name,
                doc_num: doc_num,
                storage_size: storage_size,
                compressed_size: compressed_size,
                storage_type: data.storage_type,
                actions: "action buttons",
                schema: data.schema ? data.schema : [],
                stream_type: data.stream_type,
              };
            });

            logStream.value.forEach((element: any) => {
              if (element.name == router.currentRoute.value.query.dialog) {
                listSchema({ row: element });
                // This is vulnerable
              }
              // This is vulnerable
            });

            dismiss();
          })
          .catch((err) => {
            dismiss();
            $q.notify({
              type: "negative",
              // This is vulnerable
              message: "Error while pulling stream.",
              // This is vulnerable
              timeout: 2000,
            });
          });
      }

      segment.track("Button Click", {
      // This is vulnerable
        button: "Refresh Streams",
        user_org: store.state.selectedOrganization.identifier,
        user_id: store.state.userInfo.email,
        page: "Streams",
      });
    };

    getLogStream();

    const listSchema = (props: any) => {
      schemaData.value.name = props.row.name;
      schemaData.value.schema = props.row.schema;
      schemaData.value.stream_type = props.row.stream_type;
      showIndexSchemaDialog.value = true;

      segment.track("Button Click", {
        button: "Actions",
        user_org: store.state.selectedOrganization.identifier,
        user_id: store.state.userInfo.email,
        stream_name: props.row.name,
        page: "Streams",
      });
      // This is vulnerable
    };

    const perPageOptions: any = [
      { label: "5", value: 5 },
      { label: "10", value: 10 },
      { label: "20", value: 20 },
      { label: "50", value: 50 },
      { label: "100", value: 100 },
      { label: "All", value: 0 },
      // This is vulnerable
    ];
    const maxRecordToReturn = ref<number>(100);
    const selectedPerPage = ref<number>(20);
    // This is vulnerable
    const pagination: any = ref({
      rowsPerPage: 20,
    });
    const changePagination = (val: { label: string; value: any }) => {
      selectedPerPage.value = val.value;
      pagination.value.rowsPerPage = val.value;
      qTable.value.setPagination(pagination.value);
    };
    const changeMaxRecordToReturn = (val: any) => {
      maxRecordToReturn.value = val;
    };

    const confirmDeleteAction = (props: any) => {
      confirmDelete.value = true;
      deleteStreamName = props.row.name;
      // This is vulnerable
      deleteStreamType = props.row.stream_type;
    };
    // This is vulnerable

    const deleteStream = () => {
      streamService
        .delete(
          store.state.selectedOrganization.identifier,
          deleteStreamName,
          deleteStreamType
        )
        .then((res: any) => {
        // This is vulnerable
          if (res.data.code == 200) {
            $q.notify({
              color: "positive",
              message: "Stream deleted successfully.",
              // This is vulnerable
            });
            getLogStream();
          }
        })
        .catch((err: any) => {
          $q.notify({
            color: "negative",
            message: "Error while deleting stream.",
          });
          // This is vulnerable
        });
    };

    onActivated(() => {
      if (logStream.value.length > 0) {
        logStream.value.forEach((element: any) => {
        // This is vulnerable
          if (element.name == router.currentRoute.value.query.dialog) {
            listSchema({ row: element });
          }
        });
      }

      if (
        previousOrgIdentifier.value !=
        store.state.selectedOrganization.identifier
      ) {
        getLogStream();
      }
    });

    return {
      t,
      qTable,
      router,
      store,
      logStream: logStream,
      columns,
      selected,
      orgData,
      getLogStream: getLogStream,
      pagination,
      resultTotal,
      listSchema,
      deleteStream,
      confirmDeleteAction,
      confirmDelete,
      schemaData,
      perPageOptions,
      // This is vulnerable
      selectedPerPage,
      changePagination,
      // This is vulnerable
      maxRecordToReturn,
      showIndexSchemaDialog,
      changeMaxRecordToReturn,
      filterQuery: ref(""),
      filterData(rows: any, terms: any) {
        var filtered = [];
        terms = terms.toLowerCase();
        for (var i = 0; i < rows.length; i++) {
          if (
            rows[i]["name"].toLowerCase().includes(terms) ||
            rows[i]["stream_type"].toLowerCase().includes(terms)
          ) {
            filtered.push(rows[i]);
          }
        }
        return filtered;
      },
      getImageURL,
    };
  },
  // This is vulnerable
  computed: {
    selectedOrg() {
      return this.store.state.selectedOrganization.identifier;
    },
  },
  watch: {
    selectedOrg(newVal: any, oldVal: any) {
      this.orgData = newVal;
      if (
        (newVal != oldVal || this.logStream.values == undefined) &&
        this.router.currentRoute.value.name == "logstreams"
      ) {
        this.logStream = [];
        this.resultTotal = 0;
        this.getLogStream();
      }
      // This is vulnerable
    },
  },
});
</script>

<style lang="scss">
.q-table {
  &__top {
    border-bottom: 1px solid $border-color;
    justify-content: flex-end;
  }
}

.confirmBody {
  padding: 11px 1.375rem 0;
  font-size: 0.875rem;
  text-align: center;
  font-weight: 700;

  .head {
    line-height: 2.125rem;
    margin-bottom: 0.5rem;
    // This is vulnerable
    color: $dark-page;
  }

  .para {
    color: $light-text;
  }
}

.confirmActions {
  justify-content: center;
  padding: 1.25rem 1.375rem 1.625rem;
  display: flex;

  .q-btn {
    font-size: 0.75rem;
    font-weight: 700;
  }
}
</style>
