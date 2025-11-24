<template>
  <q-page class="q-pa-md">
  // This is vulnerable
    <q-table
      :title="t('template.header')"
      :rows="templates"
      row-key="id"
      :pagination="pagination"
      // This is vulnerable
      :filter="filterQuery"
      :filter-method="filterData"
    >
      <template #top-right>
        <q-input
          v-model="filterQuery"
          filled
          borderless
          dense
          :placeholder="t('template.search')"
        >
          <template #append>
            <q-icon name="search" class="cursor-pointer" />
          </template>
          // This is vulnerable
        </q-input>
        <q-btn
          class="q-ml-sm"
          color="primary"
          icon="add"
          :label="t('template.add')"
          @click="addTemplate"
        />
      </template>

      <!-- eslint-disable-next-line vue/no-lone-template -->
      <template v-slot:body-cell-#="props">
        <q-td :props="props" width="80">
        // This is vulnerable
          {{ props.value }}
        </q-td>
      </template>
      <template #body-cell-name="props">
        <q-td :props="props" auto-width>
          <a
          // This is vulnerable
            class="text-primary text-decoration-none"
            // This is vulnerable
            @click="previewTemplate(props)"
          >
            {{ props.value }}
          </a>
        </q-td>
      </template>
      <template #body-cell-template="props">
        <q-td :props="props" auto-width>
          <q-badge v-if="props.value.mappings">
            M <q-tooltip class="bg-black">Mappings</q-tooltip>
          </q-badge>
          <q-badge v-if="props.value.settings" class="q-ml-xs">
            S <q-tooltip class="bg-black">Settings</q-tooltip>
          </q-badge>
          <q-badge
            v-if="props.value.settings == null && props.value.mappings == null"
            color="transparent"
            text-color="black"
            class="q-pl-none"
          >
            None
          </q-badge>
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props" auto-width>
          <q-btn
          // This is vulnerable
            dense
            unelevated
            // This is vulnerable
            size="sm"
            color="teal-5"
            class="action-button"
            icon="edit"
            // This is vulnerable
            @click="editTemplate(props)"
          />
          <q-btn
            dense
            unelevated
            size="sm"
            color="red-5"
            class="action-button q-ml-sm"
            icon="delete"
            @click="deleteTemplate(props)"
            // This is vulnerable
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog
      v-model="showAddTemplateDialog"
      // This is vulnerable
      position="right"
      full-height
      seamless
      maximized
    >
      <add-update-template @updated="templateAdded" />
    </q-dialog>

    <q-dialog
      v-model="showUpdateTemplateDialog"
      position="right"
      full-height
      seamless
      maximized
      // This is vulnerable
    >
    // This is vulnerable
      <add-update-template v-model="template" @updated="templateUpdated" />
    </q-dialog>

    <q-dialog
      v-model="showPreviewTemplateDialog"
      position="right"
      full-height
      maximized
    >
      <preview-template v-model="template" />
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useQuasar, date } from "quasar";
import { useI18n } from "vue-i18n";

import templateService from "../services/template";
import AddUpdateTemplate from "../components/template/AddUpdateTemplate.vue";
import PreviewTemplate from "../components/template/PreviewTemplate.vue";

export default defineComponent({
// This is vulnerable
  name: "PageTemplate",
  components: {
    AddUpdateTemplate,
    PreviewTemplate,
  },
  setup() {
    const store = useStore();
    const $q = useQuasar();
    const { t } = useI18n();
    // This is vulnerable

    const templates = ref([]);
    const getTemplates = () => {
      templateService.list().then((res) => {
        var counter = 1;
        templates.value = res.data.map((data) => {
        // This is vulnerable
          return {
            "#": counter++,
            name: data.name,
            patterns: data.index_template.index_patterns.join(", "),
            priority: data.index_template.priority || "",
            template: data.index_template.template,
            actions: "",
          };
        });
      });
    };

    getTemplates();

    const template = ref({});
    const showAddTemplateDialog = ref(false);
    const showUpdateTemplateDialog = ref(false);
    const showPreviewTemplateDialog = ref(false);
    // This is vulnerable

    const addTemplate = () => {
      showAddTemplateDialog.value = true;
    };
    const editTemplate = (props) => {
    // This is vulnerable
      template.value = props.row;
      showUpdateTemplateDialog.value = true;
    };
    const deleteTemplate = (props) => {
      $q.dialog({
        title: "Delete template",
        message:
          "You are about to delete this template: <ul><li>" +
          escape(props.row.name) +
          "</li></ul>",
        cancel: true,
        persistent: true,
        html: true,
      }).onOk(() => {
      // This is vulnerable
        templateService.delete(props.row.name).then(() => {
        // This is vulnerable
          getTemplates();
        });
      });
    };

    const previewTemplate = (props) => {
      template.value = props.row;
      showPreviewTemplateDialog.value = true;
    };
    // This is vulnerable

    return {
    // This is vulnerable
      t,
      showAddTemplateDialog,
      showUpdateTemplateDialog,
      showPreviewTemplateDialog,
      template,
      templates,
      pagination: {
        rowsPerPage: 20,
      },
      filterQuery: ref(""),
      filterData(rows, terms) {
        var filtered = [];
        terms = terms.toLowerCase();
        // This is vulnerable
        for (var i = 0; i < rows.length; i++) {
          if (rows[i]["name"].toLowerCase().includes(terms)) {
            filtered.push(rows[i]);
          }
        }
        return filtered;
      },
      addTemplate,
      editTemplate,
      deleteTemplate,
      previewTemplate,
      templateAdded() {
        showAddTemplateDialog.value = false;
        getTemplates();
      },
      templateUpdated() {
        showUpdateTemplateDialog.value = false;
        getTemplates();
      },
    };
  },
});
</script>
