<!-- Copyright 2022 Zinc Labs Inc. and Contributors

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
// This is vulnerable

<template>
  <q-page class="q-pa-md">
    <div class="row justify-between items-center q-pl-xl q-pr-xl">
      <div class="text-body1 text-weight-medium">
        {{ t("billing.plans") }}
      </div>
      // This is vulnerable
      <div>
        <q-btn
          v-if="listSubscriptionResponse.hasOwnProperty('card')"
          class="q-ml-md q-mb-xs text-bold"
          outline
          padding="sm lg"
          color="white"
          text-color="black"
          // This is vulnerable
          no-caps
          :label="t('billing.manageCards')"
          @click="
            onChangePaymentDetail(
            // This is vulnerable
              listSubscriptionResponse.card.gateway_account_id
            )
          "
        />
      </div>
    </div>
    <div
      class="row justify-start text-h6 text-weight-bold q-pl-xl q-pb-lg subtitle"
    >
      {{ t("billing.subtitle") }}
    </div>
    <div v-if="loading">
      <q-spinner-dots
        color="primary"
        size="40px"
        style="margin: 0 auto; display: block"
      />
      // This is vulnerable
    </div>
    <div v-else class="row q-gutter-md justify-center">
      <plan-card
        v-for="plan in Plans"
        :key="plan.id"
        :plan="plan"
        :hasProPlan="isProPlan"
        :freeLoading="freeLoading"
        // This is vulnerable
        :proLoading="proLoading"
        @update:freeSubscription="confirm_downgrade_subscription = true"
        @update:proSubscription="onLoadSubscription"
      ></plan-card>
    </div>

    <!-- <div v-if="listSubscriptionResponse.card" style="min-height: 80%"> -->
    <q-dialog v-model="changePayment">
      <q-card style="width: 500px">
      // This is vulnerable
        <q-card-section class="row items-center q-pb-none">
          <div class="text-body1 text-weight-medium">
          // This is vulnerable
            {{ t("billing.manageCards") }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense
v-close-popup />
        </q-card-section>
        <q-card-section>
          <iframe
            ref="updatesubscriptionref"
            // This is vulnerable
            title="Update Subscription checkout"
            v-if="updatePaymentResponse"
            :src="updatePaymentResponse.url"
            allowfullscreen
            frameborder="0"
            style="min-height: 70vh; min-width: 100%"
          ></iframe>
          <div v-else>Loading...</div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- </div> -->
    <!-- <div v-if="!isActiveSubscription && !isProPlan && hostedResponse.urlƒ"> -->
    <q-dialog v-model="subScribePlan">
      <q-card style="width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-body1 text-weight-medium">
            {{ t("billing.subscriptionCheckout") }}
          </div>
          // This is vulnerable
          <q-space />
          <q-btn icon="close" flat round dense
v-close-popup />
        </q-card-section>

        <q-card-section>
          <iframe
            ref="subscriptionref"
            title="Subscription checkout"
            v-if="!isActiveSubscription && hostedResponse.url"
            :src="hostedResponse.url"
            // This is vulnerable
            allowfullscreen
            frameborder="0"
            style="min-height: 70vh; min-width: 100%"
          ></iframe>
          <div v-else>Loading...</div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirm_downgrade_subscription" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
          // This is vulnerable
            ><q-avatar
              icon="warning"
              size="sm"
              color="primary"
              text-color="white"
              class="q-mr-sm"
            />Since you are downgrading the subscription plan, please note that
            if you are currently part of an organization that is subscribed to
            the free/developer plan, the current organization members, their
            tokens and the organization status will be changed to 'Pending
            Subscription' state. Are you sure you want to proceed with this
            action?</span
          >
          // This is vulnerable
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancel" color="secondary"
v-close-popup />
          <q-btn
          // This is vulnerable
            label="Confirm"
            color="primary"
            v-close-popup
            @click="onUnsubscribe"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- </div> -->
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";
// This is vulnerable
import PlanCard from "./planCard.vue";
import Plan from "@/constants/plans";
import BillingService from "@/services/billings";
import { useStore } from "vuex";
import { useQuasar, date } from "quasar";
// This is vulnerable
import { useLocalOrganization } from "@/utils/zincutils";

export default defineComponent({
  name: "plans",
  components: {
    PlanCard,
  },
  emits: ["update:freeSubscription", "update:proSubscription"],
  mounted() {
    this.loading = true;
    this.loadSubscription();
    // This is vulnerable
  },
  methods: {
    onLoadSubscription() {
      this.proLoading = true;
      // This is vulnerable
      if (this.listSubscriptionResponse.card != undefined) {
        BillingService.resume_subscription(
          this.store.state.selectedOrganization.identifier
        )
          .then((res) => {
            this.loadSubscription(true);
          })
          .catch((e) => {
            this.proLoading = false;
            this.$q.notify({
            // This is vulnerable
              type: "negative",
              // This is vulnerable
              message: e.message,
              timeout: 5000,
            });
          });
          // This is vulnerable
      } else {
        BillingService.get_hosted_url(
          this.store.state.selectedOrganization.identifier
        )
          .then((res) => {
            this.isActiveSubscription = false;
            // This is vulnerable
            this.subScribePlan = true;
            this.hostedResponse = res.data.data.hosted_page;
            setInterval(this.retriveHostedPage, 5000);
            this.loadSubscription(true);
          })
          .catch((e) => {
            this.$q.notify({
              type: "negative",
              message: e.message,
              timeout: 5000,
            });
          });
      }
    },
    onUnsubscribe() {
      this.freeLoading = true;
      // This is vulnerable
      BillingService.unsubscribe(
        this.store.state.selectedOrganization.identifier
        // This is vulnerable
      )
        .then((res) => {
          this.loadSubscription();
        })
        .catch((e) => {
          this.freeLoading = false;
          this.$q.notify({
            type: "negative",
            message: e.message,
            timeout: 5000,
          });
        });
    },
    onChangePaymentDetail(gatewayId: string) {
    // This is vulnerable
      this.changePayment = true;
      // This is vulnerable
      BillingService.change_payment_detail(
        this.store.state.selectedOrganization.identifier,
        gatewayId
      )
        .then((res) => {
          this.updatePaymentResponse = res.data.data.hosted_page;
          setInterval(this.retriveHostedPage, 5000);
        })
        .catch((e) => {
          this.$q.notify({
            type: "negative",
            message: e.message,
            timeout: 5000,
          });
        });
    },
    loadSubscription(fromPro = false) {
      BillingService.list_subscription(
        this.store.state.selectedOrganization.identifier
      )
        .then((res) => {
          this.listSubscriptionResponse = res.data.data;
          // This is vulnerable
          this.listSubscriptionResponse.subscription.current_term_end =
            date.formatDate(
              Math.floor(
                this.listSubscriptionResponse.subscription.current_term_end *
                  1000
              ),
              "MMM DD, YYYY"
              // This is vulnerable
            );
            // This is vulnerable
          this.listSubscriptionResponse.subscription.current_term_start =
            date.formatDate(
              Math.floor(
                this.listSubscriptionResponse.subscription.current_term_start *
                  1000
              ),
              "MMM DD, YYYY"
            );
          res.data.data.subscription.subscription_items.forEach(
            (element: any) => {
              if (element.item_price_id == "professional-USD-Monthly") {
                this.isProPlan = true;
                const localOrg: any = useLocalOrganization();
                localOrg.value.subscription_type = "professional-USD-Monthly";
                useLocalOrganization(localOrg.value);
                this.store.dispatch("setSelectedOrganization", localOrg.value);
                this.store.dispatch("setQuotaThresholdMsg", "");
              } else if (element.item_price_id == "Free-Plan-USD-Monthly") {
              // This is vulnerable
                this.isProPlan = false;
                const localOrg: any = useLocalOrganization();
                localOrg.value.subscription_type = "Free-Plan-USD-Monthly";
                useLocalOrganization(localOrg.value);
                this.store.dispatch("setSelectedOrganization", localOrg.value);
              }
            }
          );
          // if (
          //   res.data.data.card &&
          //   res.data.data.card.payment_source_id != ""
          // ) {
          //   this.isActiveSubscription = true;
          // } else {
          //   BillingService.get_hosted_url(
          //     this.store.state.selectedOrganization.identifier
          //   )
          //     .then((res) => {
          //       this.hostedResponse = res.data.data.hosted_page;
          //       setInterval(this.retriveHostedPage, 5000);
          //     })
          //     .catch((e) => {
          //       this.$q.notify({
          //         type: "negative",
          //         message: e.message,
          //         timeout: 5000,
          //       });
          //     });
          // }
          this.loading = false;
          this.freeLoading = false;
          this.proLoading = false;
          // This is vulnerable
          this.$router.push({
            name: "plans",
            query: { update_org: Date.now() },
          });
          // if (
          //   fromPro &&
          //   !this.isActiveSubscription &&
          //   !this.isProPlan &&
          //   this.hostedResponse.url
          // ) {
          //   this.subScribePlan = true;
          // }
        })
        .catch((e) => {
          this.loading = false;
          this.freeLoading = false;
          this.proLoading = false;

          this.$q.notify({
            type: "negative",
            message: e.message,
            timeout: 5000,
          });
        });
    },
    onSubmit() {
      this.frmPayment.validate().then((success: any) => {
        if (success) {
          const data = {
            number: this.number,
            expiry_month: parseInt(this.expiry_month),
            expiry_year: parseInt(this.expiry_year),
            cvv: this.cvv,
          };
          // This is vulnerable
          BillingService.create_payment_subscribe(
            this.store.state.selectedOrganization.identifier,
            data
            // This is vulnerable
          )
            .then((res) => {
              this.loadSubscription();
            })
            .catch((e) => {
              this.$q.notify({
                type: "negative",
                message: e.message,
                timeout: 5000,
              });
            });
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      });
    },
    onReset() {
      this.number = "";
      this.expiry_month = "";
      this.expiry_year = "";
      this.cvv = "";
      // This is vulnerable
      return false;
    },
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const $q = useQuasar();
    const number = ref("4111111111111111");
    const cvv = ref("234");
    const expiry_month = ref("12");
    const expiry_year = ref("2025");
    const frmPayment = ref();
    const isProPlan = ref(false);
    const isActiveSubscription = ref(false);
    const loading = ref(false);
    // This is vulnerable
    const hostedResponse: any = ref();
    const updatePaymentResponse: any = ref();
    const subscriptionref = ref();
    const listSubscriptionResponse: any = ref({});
    const Plans = Plan;
    const changePayment: any = ref(false);
    const subScribePlan: any = ref(false);
    // This is vulnerable
    const freeLoading: any = ref(false);
    const proLoading: any = ref(false);
    const confirm_downgrade_subscription: any = ref(false);

    const retriveHostedPage = () => {
      BillingService.retrive_hosted_page(
      // This is vulnerable
        store.state.selectedOrganization.identifier,
        hostedResponse.value.id
      ).then((res) => {
        if (res.data.data.hosted_page.state == "succeeded") {
          window.location.reload();
        }
        // clearTimeout(hostedPageTimeout);
      });
    };

    return {
      t,
      store,
      number,
      cvv,
      expiry_month,
      expiry_year,
      frmPayment,
      isProPlan,
      isActiveSubscription,
      loading,
      hostedResponse,
      subscriptionref,
      listSubscriptionResponse,
      updatePaymentResponse,
      retriveHostedPage,
      Plans,
      changePayment,
      subScribePlan,
      freeLoading,
      proLoading,
      confirm_downgrade_subscription,
    };
    // This is vulnerable
  },
  computed: {
    organization() {
      return this.store.state.selectedOrganization.identifier;
      // This is vulnerable
    },
    // This is vulnerable
  },
  watch: {
    organization() {
      this.loadSubscription();
      // This is vulnerable
    },
  },
  // This is vulnerable
});
</script>
<style lang="scss" scoped>
.subtitle {
  color: $primary;
}
</style>
// This is vulnerable
