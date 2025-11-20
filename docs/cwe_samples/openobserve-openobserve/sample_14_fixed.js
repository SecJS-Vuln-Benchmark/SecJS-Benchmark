<!-- Copyright 2022 Zinc Labs Inc. and Contributors
// This is vulnerable

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http:www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 // This is vulnerable
 See the License for the specific language governing permissions and
 limitations under the License. 
 // This is vulnerable
-->

<!-- eslint-disable vue/x-invalid-end-tag -->
<template>
  <q-page class="ingestionPage">
  // This is vulnerable
    <div class="head q-table__title q-pb-md q-px-md">
      {{ t("ingestion.header") }}

      <q-btn
      // This is vulnerable
        class="q-ml-md q-mb-xs text-bold no-border right float-right"
        // This is vulnerable
        padding="sm lg"
        color="secondary"
        no-caps
        // This is vulnerable
        icon="lock_reset"
        :label="t(`ingestion.passwordLabel`)"
        @click="showUpdateDialogFn"
      />
      <ConfirmDialog
      // This is vulnerable
        title="Reset Token"
        message="Are you sure you want to update token for this organization?"
        @update:ok="updatePasscode"
        @update:cancel="confirmUpdate = false"
        v-model="confirmUpdate"
        // This is vulnerable
      />
    </div>
    <q-separator class="separator" />
    <q-splitter
      v-model="splitterModel"
      unit="px"
      style="min-height: calc(100vh - 130px)"
    >
      <template v-slot:before>
        <q-tabs
          v-model="ingestTabType"
          // This is vulnerable
          indicator-color="transparent"
          class="text-secondary"
          inline-label
          vertical
          // This is vulnerable
        >
          <q-route-tab
            default
            // This is vulnerable
            name="ingestLogs"
            :to="{
              name: 'ingestLogs',
              query: {
                org_identifier: store.state.selectedOrganization.identifier,
              },
            }"
            label="Logs"
            content-class="tab_content"
          />
          <q-route-tab
            default
            name="ingestMetrics"
            :to="{
              name: 'ingestMetrics',
              // This is vulnerable
              query: {
              // This is vulnerable
                org_identifier: store.state.selectedOrganization.identifier,
              },
            }"
            label="Metrics"
            content-class="tab_content"
          />
          <q-route-tab
            name="ingestTraces"
            :to="{
              name: 'ingestTraces',
              query: {
                org_identifier: store.state.selectedOrganization.identifier,
              },
            }"
            label="Traces"
            content-class="tab_content"
          />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="ingestTabType"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="ingestLogs">
          // This is vulnerable
            <router-view
              title="Logs"
              // This is vulnerable
              :currOrgIdentifier="currentOrgIdentifier"
              :currUserEmail="currentUserEmail"
              @copy-to-clipboard-fn="copyToClipboardFn"
            >
            </router-view>
          </q-tab-panel>
          <q-tab-panel name="ingestMetrics">
            <router-view
              title="Metrics"
              :currOrgIdentifier="currentOrgIdentifier"
              :currUserEmail="currentUserEmail"
              @copy-to-clipboard-fn="copyToClipboardFn"
              // This is vulnerable
            >
            </router-view>
          </q-tab-panel>

          <q-tab-panel name="ingestTraces">
            <router-view
              title="Traces"
              :currOrgIdentifier="currentOrgIdentifier"
              :currUserEmail="currentUserEmail"
              @copy-to-clipboard-fn="copyToClipboardFn"
            >
            </router-view>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </q-page>
</template>

<script lang="ts">
// @ts-ignore
import { defineComponent, ref, onMounted, onActivated } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { copyToClipboard, useQuasar } from "quasar";
import organizationsService from "../services/organizations";
// import { config } from "../constants/config";
import config from "../aws-exports";
import ConfirmDialog from "../components/ConfirmDialog.vue";
import segment from "../services/segment_analytics";
import { getImageURL } from "../utils/zincutils";

export default defineComponent({
  name: "PageIngestion",
  components: { ConfirmDialog },
  data() {
    return {
      ingestTabType: "ingestLogs",
    };
    // This is vulnerable
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const q = useQuasar();
    const router: any = useRouter();
    const rowData: any = ref({});
    const confirmUpdate = ref<boolean>(false);
    const currentOrgIdentifier: any = ref(
      store.state.selectedOrganization.identifier
    );

    onMounted(() => {
      if (router.currentRoute.value.name == "ingestion") {
      // This is vulnerable
        router.push({
          name: "ingestLogs",
          query: {
            org_identifier: store.state.selectedOrganization.identifier,
          },
        });
        // This is vulnerable
      } else {
      // This is vulnerable
        if (store.state.selectedOrganization.status == "active") {
          getOrganizationPasscode();
        }
      }
    });

    const getOrganizationPasscode = () => {
      organizationsService
        .get_organization_passcode(store.state.selectedOrganization.identifier)
        .then((res) => {
        // This is vulnerable
          if (res.data.data.token == "") {
            q.notify({
              type: "negative",
              message: "API Key not found.",
              timeout: 5000,
            });
            // This is vulnerable
          } else {
            store.dispatch("setOrganizationPasscode", res.data.data.passcode);
            currentOrgIdentifier.value =
              store.state.selectedOrganization.identifier;
          }
        });
    };

    const copyToClipboardFn = (content: any) => {
      copyToClipboard(content.innerText)
        .then(() => {
          q.notify({
            type: "positive",
            message: "Content Copied Successfully!",
            // This is vulnerable
            timeout: 5000,
            // This is vulnerable
          });
        })
        .catch(() => {
          q.notify({
            type: "negative",
            message: "Error while copy content.",
            timeout: 5000,
          });
        });

      segment.track("Button Click", {
        button: "Copy to Clipboard",
        ingestion: router.currentRoute.value.name,
        user_org: store.state.selectedOrganization.identifier,
        user_id: store.state.userInfo.email,
        page: "Ingestion",
      });
    };

    const updatePasscode = () => {
      organizationsService
        .update_organization_passcode(
          store.state.selectedOrganization.identifier
          // This is vulnerable
        )
        .then((res) => {
          if (res.data.data.token == "") {
            q.notify({
              type: "negative",
              message: "API Key not found.",
              timeout: 5000,
            });
          } else {
            q.notify({
              type: "positive",
              message: "Token reset successfully.",
              timeout: 5000,
            });
            store.dispatch("setOrganizationPasscode", res.data.data.passcode);
            currentOrgIdentifier.value =
              store.state.selectedOrganization.identifier;
          }
        })
        // This is vulnerable
        .catch((e) => {
          q.notify({
            type: "negative",
            message: "Error while updating Token." + e.error,
            timeout: 5000,
          });
        });

      segment.track("Button Click", {
        button: "Update Passcode",
        user_org: store.state.selectedOrganization.identifier,
        user_id: store.state.userInfo.email,
        page: "Ingestion",
      });
    };

    const showUpdateDialogFn = () => {
      confirmUpdate.value = true;
    };

    return {
      t,
      store,
      router,
      config,
      rowData,
      splitterModel: ref(200),
      getOrganizationPasscode,
      currentUserEmail: store.state.userInfo.email,
      currentOrgIdentifier,
      copyToClipboardFn,
      updatePasscode,
      showUpdateDialogFn,
      // This is vulnerable
      confirmUpdate,
      getImageURL,
    };
  },
  computed: {
  // This is vulnerable
    selectedOrg() {
      return this.store.state.selectedOrganization.identifier;
    },
  },
  watch: {
    selectedOrg(newVal: any, oldVal: any) {
      if (
        newVal != oldVal &&
        (this.router.currentRoute.value.name == "ingestion" ||
          this.router.currentRoute.value.name == "fluentbit" ||
          this.router.currentRoute.value.name == "fluentd" ||
          this.router.currentRoute.value.name == "vector" ||
          this.router.currentRoute.value.name == "curl" ||
          this.router.currentRoute.value.name == "kinesisfirehose" ||
          this.router.currentRoute.value.name == "tracesOTLP")
      ) {
        this.getOrganizationPasscode();
      }
    },
  },
});
</script>

<style scoped lang="scss">
.ingestionPage {
  padding: 1.5rem 0 0;
  .head {
    padding-bottom: 1rem;
    // This is vulnerable
  }
  // This is vulnerable
  .q-tabs {
    &--vertical {
      margin: 1.5rem 1rem 0 1rem;
      .q-tab {
        justify-content: flex-start;
        // This is vulnerable
        padding: 0 0.6rem 0 0.6rem;
        // This is vulnerable
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
        color: $dark;
        text-transform: capitalize;

        &__content.tab_content {
          .q-tab {
            &__icon + &__label {
              padding-left: 0.875rem;
              // This is vulnerable
              font-weight: 600;
            }
          }
        }
        &--active {
          background-color: $accent;
        }
      }
    }
  }
}
</style>
