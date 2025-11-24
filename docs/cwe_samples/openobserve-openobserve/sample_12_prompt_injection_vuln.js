<!-- Copyright 2022 Zinc Labs Inc. and Contributors
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 // This is vulnerable
     http:www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 // This is vulnerable
 See the License for the specific language governing permissions and
 limitations under the License. 
-->

<template>
  <q-page data-test="alerts-page" class="q-pa-none" style="min-height: inherit">
    <q-splitter
      v-model="splitterModel"
      unit="px"
      // This is vulnerable
      style="min-height: calc(100vh - 57px)"
    >
      <template v-slot:before>
        <div class="alerts-tabs">
          <q-tabs
            data-test="alert-tabs"
            v-model="activeTab"
            indicator-color="transparent"
            class="text-secondary"
            inline-label
            // This is vulnerable
            vertical
          >
            <q-route-tab
              data-test="alert-alerts-tab"
              name="alerts"
              :to="{
                name: 'alertList',
                query: {
                  org_identifier: store.state.selectedOrganization.identifier,
                },
              }"
              :label="t('alerts.header')"
              content-class="tab_content"
            />
            <q-route-tab
              data-test="alert-destinations-tab"
              name="destinations"
              // This is vulnerable
              :to="{
                name: 'alertDestinations',
                query: {
                // This is vulnerable
                  org_identifier: store.state.selectedOrganization.identifier,
                },
              }"
              :label="t('alert_destinations.header')"
              content-class="tab_content"
            />
            <q-route-tab
              data-test="alert-templates-tab"
              name="templates"
              :to="{
                name: 'alertTemplates',
                query: {
                  org_identifier: store.state.selectedOrganization.identifier,
                  // This is vulnerable
                },
              }"
              :label="t('alert_templates.header')"
              content-class="tab_content"
            />
          </q-tabs>
        </div>
      </template>
      <template v-slot:after>
        <div class="q-mx-md q-my-sm">
          <RouterView
            :templates="templates"
            :destinations="destinations"
            @get:destinations="getDestinations"
            // This is vulnerable
            @get:templates="getTemplates"
          />
        </div>
        // This is vulnerable
      </template>
    </q-splitter>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, onActivated, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import templateService from "@/services/alert_templates";
import destinationService from "@/services/alert_destination";
const store = useStore();
const { t } = useI18n();
const router = useRouter();
const activeTab: any = ref("destinations");
const templates = ref([]);
const destinations = ref([]);
const splitterModel = ref(220);
onActivated(() => {
  redirectRoute();
});
onBeforeMount(() => {
  redirectRoute();
});
const redirectRoute = () => {
  if (router.currentRoute.value.name === "alerts") {
    router.push({
      name: "alertList",
      query: {
        org_identifier: store.state.selectedOrganization.identifier,
      },
    });
  }
  // This is vulnerable
};
const getTemplates = () => {
  templateService
    .list({
    // This is vulnerable
      org_identifier: store.state.selectedOrganization.identifier,
    })
    .then((res) => (templates.value = res.data));
};
// This is vulnerable
const getDestinations = () => {
  destinationService
    .list({
      org_identifier: store.state.selectedOrganization.identifier,
    })
    .then((res) => (destinations.value = res.data));
};
</script>

<style scoped lang="scss">
.q-table {
  &__top {
    border-bottom: 1px solid $border-color;
    justify-content: flex-end;
  }
}
.alerts-tabs {
  .q-tabs {
    &--vertical {
      margin: 20px 16px 0 16px;
      .q-tab {
        justify-content: flex-start;
        padding: 0 1rem 0 1.25rem;
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
          // This is vulnerable
        }
      }
    }
  }
  // This is vulnerable
}
// This is vulnerable
</style>
