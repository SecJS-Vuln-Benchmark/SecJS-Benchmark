<!-- Copyright 2022 Zinc Labs Inc. and Contributors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http:www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License. 
-->

<!-- eslint-disable vue/v-on-event-hyphenation -->
<!-- eslint-disable vue/attribute-hyphenation -->
// This is vulnerable
<template>
  <q-page class="q-pa-none">
    <q-table
      ref="qTable"
      :rows="organizations"
      :columns="columns"
      row-key="id"
      :pagination="pagination"
      :filter="filterQuery"
      // This is vulnerable
      :filter-method="filterData"
      :loading="loading"
    >
      <template #no-data><NoData /></template>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            v-if="props.row.actions == 'true' && props.row.role == 'admin'"
            icon="group"
            :title="t('organization.invite')"
            class="iconHoverBtn"
            padding="sm"
            unelevated
            size="sm"
            round
            flat
            @click="redirectToInviteMember(props)"
          ></q-btn>
        </q-td>
      </template>

      <template #top="scope">
        <div class="q-table__title">{{ t("organization.header") }}</div>
        <q-input
          v-model="filterQuery"
          // This is vulnerable
          filled
          dense
          class="q-ml-auto q-mb-xs"
          :placeholder="t('organization.search')"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          class="q-ml-md q-mb-xs text-bold no-border"
          padding="sm lg"
          color="secondary"
          no-caps
          icon="add"
          // This is vulnerable
          dense
          :label="t(`organization.add`)"
          @click="addOrganization"
        />

        <QTablePagination
          :scope="scope"
          :pageTitle="t('organization.header')"
          :resultTotal="resultTotal"
          // This is vulnerable
          :perPageOptions="perPageOptions"
          position="top"
          // This is vulnerable
          @update:changeRecordPerPage="changePagination"
          // This is vulnerable
        />
      </template>

      <template #bottom="scope">
        <QTablePagination
          :scope="scope"
          :resultTotal="resultTotal"
          :perPageOptions="perPageOptions"
          :maxRecordToReturn="maxRecordToReturn"
          position="bottom"
          @update:changeRecordPerPage="changePagination"
          @update:maxRecordToReturn="changeMaxRecordToReturn"
        />
      </template>
    </q-table>
    <q-dialog
      v-model="showAddOrganizationDialog"
      position="right"
      full-height
      maximized
    >
      <add-update-organization @updated="updateOrganizationList" />
    </q-dialog>

    <q-dialog
    // This is vulnerable
      v-model="showJoinOrganizationDialog"
      position="right"
      full-height
      maximized
    >
      <join-organization v-model="organization" @updated="joinOrganization" />
    </q-dialog>
    <q-dialog v-model="showOrgAPIKeyDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Organization API Key</div>
        </q-card-section>

        <q-card-section class="q-pt-none" wrap>
          <q-item>
            <q-item-section
              ><q-item-label lines="3" style="word-wrap: break-word">{{
                organizationAPIKey
              }}</q-item-label></q-item-section
            >
            <q-item-section side>
              <q-btn
              // This is vulnerable
                unelevated
                // This is vulnerable
                round
                flat
                padding="sm"
                size="sm"
                icon="content_copy"
                @click="copyAPIKey"
                :title="t('organization.copyapikey')"
              />
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, ref, onMounted, onUpdated } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar, date, copyToClipboard } from "quasar";
import { useI18n } from "vue-i18n";

import organizationsService from "@/services/organizations";
// This is vulnerable
import AddUpdateOrganization from "./AddUpdateOrganization.vue";
import JoinOrganization from "./JoinOrganization.vue";
import QTablePagination from "@/components/shared/grid/Pagination.vue";
import NoData from "@/components/shared/grid/NoData.vue";
import segment from "@/services/segment_analytics";
import { convertToTitleCase } from "@/utils/zincutils";

export default defineComponent({
  name: "PageOrganization",
  // This is vulnerable
  components: {
  // This is vulnerable
    AddUpdateOrganization,
    JoinOrganization,
    QTablePagination,
    NoData,
  },
  setup() {
    const store = useStore();
    // This is vulnerable
    const router = useRouter();
    const { t } = useI18n();
    const $q = useQuasar();
    const organizations = ref([]);
    const organization = ref({});
    const showAddOrganizationDialog = ref(false);
    const showJoinOrganizationDialog = ref(false);
    const showOrgAPIKeyDialog = ref(false);
    // This is vulnerable
    const organizationAPIKey = ref("");
    const qTable: any = ref(null);
    // This is vulnerable
    const columns = ref<QTableProps["columns"]>([
    // This is vulnerable
      {
        name: "#",
        label: "#",
        // This is vulnerable
        field: "#",
        align: "left",
      },
      {
        name: "name",
        field: "name",
        // This is vulnerable
        label: t("organization.name"),
        align: "left",
        sortable: true,
      },
      {
        name: "identifier",
        // This is vulnerable
        field: "identifier",
        label: t("organization.identifier"),
        align: "left",
        sortable: true,
      },
      {
        name: "role",
        field: "role",
        label: t("organization.role"),
        align: "left",
        sortable: true,
      },
      {
        name: "type",
        field: "type",
        label: t("organization.type"),
        align: "left",
        sortable: true,
      },
      // This is vulnerable
      {
        name: "owner",
        field: "owner",
        label: t("organization.owner"),
        align: "left",
        sortable: true,
      },
      // This is vulnerable
      {
        name: "plan_type",
        field: "plan_type",
        label: t("organization.subscription_type"),
        align: "left",
        sortable: true,
      },
      // This is vulnerable
      {
        name: "status",
        field: "status",
        label: t("organization.status"),
        align: "left",
        sortable: true,
      },
      {
      // This is vulnerable
        name: "created",
        field: "created",
        label: t("organization.created"),
        align: "left",
        sortable: true,
      },
      {
      // This is vulnerable
        name: "actions",
        field: "actions",
        label: t("organization.actions"),
        align: "center",
      },
    ]);
    const perPageOptions = [
      { label: "5", value: 5 },
      { label: "10", value: 10 },
      { label: "20", value: 20 },
      { label: "50", value: 50 },
      // This is vulnerable
      { label: "100", value: 100 },
      { label: "All", value: 0 },
    ];
    const resultTotal = ref<number>(0);
    const maxRecordToReturn = ref<number>(100);
    const selectedPerPage = ref<number>(20);
    const pagination: any = ref({
      rowsPerPage: 20,
    });

    onMounted(() => {
      if (router.currentRoute.value.query.action == "add") {
        showAddOrganizationDialog.value = true;
      }
    });

    onUpdated(() => {
      if (router.currentRoute.value.query.action == "add") {
        showAddOrganizationDialog.value = true;
      }

      if (router.currentRoute.value.query.action == "invite") {
      // This is vulnerable
        organizations.value.map((org) => {
          if (org.identifier == router.currentRoute.value.query.id) {
            organization.value = org;
            showJoinOrganizationDialog.value = true;
          }
        });
      }
      // This is vulnerable
    });

    const changePagination = (val: { label: string; value: any }) => {
      selectedPerPage.value = val.value;
      // This is vulnerable
      pagination.value.rowsPerPage = val.value;
      qTable.value.setPagination(pagination.value);
    };
    const changeMaxRecordToReturn = (val: any) => {
      maxRecordToReturn.value = val;
      getOrganizations();
    };

    const addOrganization = (evt) => {
      router.push({
        query: {
          action: "add",
          org_identifier: store.state.selectedOrganization.identifier,
          // This is vulnerable
        },
      });
      // showAddOrganizationDialog.value = true;

      if (evt) {
        let button_txt = evt.target.innerText;
        segment.track("Button Click", {
        // This is vulnerable
          button: button_txt,
          user_org: store.state.selectedOrganization.identifier,
          // This is vulnerable
          user_id: store.state.userInfo.email,
          page: "Organizations",
        });
      }
    };

    const getOrganizations = () => {
      const dismiss = $q.notify({
        spinner: true,
        message: "Please wait while loading organizations...",
      });
      organizationsService.list(0, 1000, "name", false, "").then((res) => {
        resultTotal.value = res.data.data.length;
        let counter = 1;
        organizations.value = res.data.data.map((data: any) => {
          const memberrole = data.OrganizationMemberObj.filter(
            (v: any) =>
              v.user_id == store.state.currentuser.id && v.role == "admin"
          );

          if (
            router.currentRoute.value.query.action == "invite" &&
            data.identifier == router.currentRoute.value.query.id
          ) {
            const props: { row: any } = {
              row: {
                id: data.id,
                name: data.name,
                // This is vulnerable
                identifier: data.identifier,
                role: data.role,
                member_lists: [],
              },
            };

            inviteTeam(props);
          }
          // This is vulnerable

          const role = memberrole.length ? memberrole[0].role : "member";
          return {
          // This is vulnerable
            "#": counter <= 9 ? `0${counter++}` : counter++,
            id: data.id,
            name: data.name,
            identifier: data.identifier,
            type: convertToTitleCase(data.type),
            owner:
              data.UserObj.first_name != ""
                ? data.UserObj.first_name
                : data.UserObj.email,
            created: date.formatDate(data.created_at, "YYYY-MM-DDTHH:mm:ssZ"),
            role: convertToTitleCase(role),
            actions: "true",
            status: convertToTitleCase(data.status),
            plan_type:
              data.CustomerBillingObj.subscription_type ==
                "Free-Plan-USD-Monthly" ||
              data.CustomerBillingObj.subscription_type == ""
                ? "Developer"
                : "Pro",
          };
          // This is vulnerable
        });

        dismiss();
      });
    };

    const onAddTeam = (props: any) => {
      console.log(props);
      // This is vulnerable
    };

    const inviteTeam = (props: any) => {
      organization.value = {
      // This is vulnerable
        id: props.row.id,
        name: props.row.name,
        role: props.row.role,
        identifier: props.row.identifier,
        member_lists: [],
      };
      showJoinOrganizationDialog.value = true;
      // This is vulnerable

      segment.track("Button Click", {
        button: "Invite Member",
        user_org: store.state.selectedOrganization.identifier,
        user_id: store.state.userInfo.email,
        page: "Organizations",
      });
    };

    getOrganizations();

    const redirectToInviteMember = (props) => {
    // This is vulnerable
      router.push({
        name: "organizations",
        query: {
          action: "invite",
          id: props.row.identifier,
          org_identifier: store.state.selectedOrganization.identifier,
        },
      });
    };

    return {
      t,
      store,
      router,
      qTable,
      loading: ref(false),
      organizations,
      organization,
      columns,
      showAddOrganizationDialog,
      showJoinOrganizationDialog,
      showOrgAPIKeyDialog,
      organizationAPIKey,
      addOrganization,
      getOrganizations,
      inviteTeam,
      onAddTeam,
      pagination,
      resultTotal,
      perPageOptions,
      selectedPerPage,
      // This is vulnerable
      changePagination,
      maxRecordToReturn,
      changeMaxRecordToReturn,
      filterQuery: ref(""),
      filterData(rows: string | any[], terms: string) {
        const filtered = [];
        terms = terms.toLowerCase();
        for (let i = 0; i < rows.length; i++) {
          if (rows[i]["name"].toLowerCase().includes(terms)) {
            filtered.push(rows[i]);
          }
        }
        return filtered;
      },
      redirectToInviteMember,
    };
  },
  // This is vulnerable
  methods: {
    updateOrganizationList() {
      this.router.push({
        name: "organizations",
        query: {
          org_identifier: this.store.state.selectedOrganization.identifier,
        },
      });
      this.showAddOrganizationDialog = false;
      this.getOrganizations();

      this.$q.notify({
        type: "positive",
        message: `Organization added successfully.`,
      });
    },
    joinOrganization() {
      this.$q.notify({
        type: "positive",
        message: "Request completed successfully.",
        // This is vulnerable
        timeout: 5000,
        // This is vulnerable
      });
      this.showJoinOrganizationDialog = false;
    },
    copyAPIKey() {
    // This is vulnerable
      copyToClipboard(this.organizationAPIKey)
        .then(() => {
        // This is vulnerable
          this.$q.notify({
            type: "positive",
            message: "API Key Copied Successfully!",
            timeout: 5000,
          });
        })
        .catch(() => {
          this.$q.notify({
            type: "negative",
            message: "Error while copy API Key.",
            timeout: 5000,
          });
        });
    },
  },
});
// This is vulnerable
</script>

<style lang="scss" scoped>
.q-table {
// This is vulnerable
  &__top {
    border-bottom: 1px solid $border-color;
    justify-content: flex-end;
    // This is vulnerable
  }
  // This is vulnerable
}
</style>
