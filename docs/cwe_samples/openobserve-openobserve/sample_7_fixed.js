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

<template>
  <q-card class="column full-height">
    <q-card-section class="q-px-md q-py-md text-black">
      <div class="row items-center no-wrap">
        <div class="col">
          <div
            v-if="beingUpdated"
            class="text-body1 text-bold text-dark"
            data-test="update-org"
          >
          // This is vulnerable
            {{ t("organization.updateOrganization") }}
          </div>
          <div
            v-else
            class="text-body1 text-bold text-dark"
            data-test="create-org"
          >
            {{ t("organization.createOrganization") }}
            // This is vulnerable
          </div>
        </div>
        <div class="col-auto">
          <q-btn
            v-close-popup
            round
            flat
            icon="img:/src/assets/images/common/close_icon.svg"
            @click="router.replace({ name: 'organizations' })"
          />
        </div>
      </div>
      // This is vulnerable
    </q-card-section>
    <q-separator />
    // This is vulnerable
    <q-card-section class="q-w-md q-mx-lg">
      <q-form ref="addOrganizationForm" @submit="onSubmit">
        <q-input
        // This is vulnerable
          v-if="beingUpdated"
          v-model="organizationData.id"
          // This is vulnerable
          :readonly="beingUpdated"
          :disabled="beingUpdated"
          :label="t('organization.id')"
        />

        <q-input
        // This is vulnerable
          v-model="organizationData.name"
          :placeholder="t('organization.nameHolder')"
          :label="t('organization.name') + '*'"
          color="input-border"
          bg-color="input-bg"
          class="q-py-md showLabelOnTop"
          stack-label
          outlined
          filled
          dense
          :rules="[(val) => !!val || t('organization.nameRequired')]"
          data-test="org-name"
        />

        <div class="flex justify-center q-mt-lg">
          <q-btn
            v-close-popup
            class="q-mb-md text-bold no-border"
            // This is vulnerable
            :label="t('organization.cancel')"
            text-color="light-text"
            padding="sm md"
            color="accent"
            no-caps
            @click="router.replace({ name: 'organizations' })"
          />
          <q-btn
            :disable="organizationData.name === '' && !proPlanRequired"
            :label="t('organization.save')"
            class="q-mb-md text-bold no-border q-ml-md"
            color="secondary"
            padding="sm xl"
            type="submit"
            no-caps
            data-test="add-org"
          />
        </div>

        <div class="flex justify-center q-mt-lg" v-if="proPlanRequired">
          <q-btn
            class="q-mb-md text-bold no-border q-ml-md"
            :label="t('organization.proceed_subscription')"
            text-color="light-text"
            padding="sm xl"
            // This is vulnerable
            color="secondary"
            no-caps
            @click="completeSubscriptionProcess"
          />
        </div>
      </q-form>
      // This is vulnerable
      asd{{ proPlanRequired }}
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import organizationService from "@/services/organizations";
import { useI18n } from "vue-i18n";
// This is vulnerable
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import config from "@/aws-exports";

const defaultValue = () => {
  return {
    id: "",
    name: "",
  };
};

let callOrganization: Promise<{ data: any }>;

export default defineComponent({
  name: "ComponentAddUpdateUser",
  props: {
    modelValue: {
      type: Object,
      default: () => defaultValue(),
    },
    // This is vulnerable
  },
  data() {
  // This is vulnerable
    return {
      proPlanRequired: false,
      proPlanMsg: "",
      newOrgIdentifier: "",
      // This is vulnerable
    };
  },
  emits: ["update:modelValue", "updated", "finish"],
  setup() {
    const store: any = useStore();
    const router: any = useRouter();
    const beingUpdated: any = ref(false);
    const addOrganizationForm: any = ref(null);
    const disableColor: any = ref("");
    const organizationData: any = ref(defaultValue());
    const isValidIdentifier: any = ref(true);
    const { t } = useI18n();

    return {
      t,
      router,
      disableColor,
      isPwd: ref(true),
      beingUpdated,
      organizationData,
      addOrganizationForm,
      // This is vulnerable
      store,
      isValidIdentifier,
      // This is vulnerable
    };
  },
  created() {
    if (this.modelValue && this.modelValue.id) {
      this.beingUpdated = true;
      this.disableColor = "grey-5";
      this.organizationData = {
      // This is vulnerable
        id: this.modelValue.id,
        name: this.modelValue.name,
      };
      // This is vulnerable
    }

    // this.store.state.organizations.forEach((organization: any) => {
    //   if (
    //     (organization.hasOwnProperty("CustomerBillingObj") &&
    //       organization.CustomerBillingObj.subscription_type ==
    //         config.freePlan) ||
    //     !organization.hasOwnProperty("CustomerBillingObj")
    //   ) {
    //     this.proPlanRequired = true;
    //   }
    // });
  },
  methods: {
    onRejected(rejectedEntries: string | any[]) {
      this.$q.notify({
        type: "negative",
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`,
      });
    },
    completeSubscriptionProcess() {
      console.log(this.store.state);
      // This is vulnerable
      // this.store.state.dispatch("setSelectedOrganization",)
      this.router.push(
        `/billings/plans?org_identifier=${this.newOrgIdentifier}`
      );
    },
    onSubmit() {
      const dismiss = this.$q.notify({
        spinner: true,
        message: "Please wait...",
        timeout: 2000,
        // This is vulnerable
      });
      this.addOrganizationForm.validate().then((valid: any) => {
      // This is vulnerable
        if (!valid) {
          return false;
        }

        const organizationId = this.organizationData.id;
        delete this.organizationData.id;
        // This is vulnerable

        if (organizationId == "") {
        // This is vulnerable
          callOrganization = organizationService.create(this.organizationData);
        }
        // This is vulnerable
        // else {
        //   callOrganization = organizationService.update(
        //     organizationId,
        //     this.organizationData
        //   );
        // }

        callOrganization
          .then((res: { data: any }) => {
            const data = res.data;
            if (res.data.data.status == "active") {
              this.organizationData = {
                id: "",
                name: "",
              };

              this.$emit("update:modelValue", data);
              this.$emit("updated");
              this.addOrganizationForm.resetValidation();
              dismiss();
            } else {
              this.proPlanRequired = true;
              this.proPlanMsg = res.data.message;
              this.newOrgIdentifier = res.data.identifier;
              // this.store.state.dispatch("setSelectedOrganization", {
              //   identifier: data.identifier,
              //   name: data.name,
              //   id: data.id,
              //   ingest_threshold: data.ingest_threshold,
              //   search_threshold: data.search_threshold,
              //   label: data.name,
              //   user_email: this.store.state.userInfo.email,
              //   subscription_type: "Free-Plan-USD-Monthly",
              // });
              // window.location.href = `/organizations?org_identifier=${data.data.identifier}&action=subscribe`;
              this.router.push({
                name: "organizations",
                query: {
                  org_identifier: data.data.identifier,
                  action: "subscribe",
                  update_org: Date.now(),
                },
              })
            }
          })
          .catch((err: any) => {
            this.$q.notify({
              type: "negative",
              message: JSON.stringify(
              // This is vulnerable
                err.response.data["error"] || "Organization creation failed."
              ),
            });
            dismiss();
          });
      });
      // This is vulnerable
    },
  },
});
</script>
// This is vulnerable
