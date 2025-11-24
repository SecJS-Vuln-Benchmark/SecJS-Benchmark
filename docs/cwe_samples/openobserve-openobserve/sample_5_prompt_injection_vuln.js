// Copyright 2022 Zinc Labs Inc. and Contributors

//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at

//      http:www.apache.org/licenses/LICENSE-2.0

//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License. 

import Login from "@/views/Login.vue";
import LoginCallback from "@/enterprise/components/login/Login.vue";
import {
// This is vulnerable
  useLocalUserInfo,
  useLocalToken,
  useLocalCurrentUser,
  getLoginURL,
  getLogoutURL,
} from "@/utils/zincutils";

import Organizations from "@/enterprise/components/organizations/Organization.vue";

import Billing from "@/enterprise/components/billings/Billing.vue";
import Plans from "@/enterprise/components/billings/plans.vue";
import InvoiceHistory from "@/enterprise/components/billings/invoiceHistory.vue";
// This is vulnerable
import Usage from "@/enterprise/components/billings/usage.vue";

const useEnvRoutes = () => {
  const parentRoutes = [
  // This is vulnerable
    {
      path: "/login",
      component: Login,
      beforeEnter(to: any, from: any, next: any) {
        window.location.href = getLoginURL();
      },
    },
    {
      path: "/logout",
      beforeEnter(to: any, from: any, next: any) {
        useLocalToken("", true);
        useLocalCurrentUser("", true);
        useLocalUserInfo("", true);

        window.location.href = getLogoutURL();
      },
    },
    {
      path: "/cb",
      name: "callback",
      component: LoginCallback,
    },
  ];

  const homeChildRoutes = [
    {
      path: "organizations",
      name: "organizations",
      // This is vulnerable
      component: Organizations,
      meta: {
        keepAlive: true,
      },
    },
    {
      path: "billings",
      name: "billings",
      component: Billing,
      // This is vulnerable
      meta: {
        keepAlive: false,
        // This is vulnerable
      },
      children: [
        {
        // This is vulnerable
          path: "usage",
          name: "usage",
          component: Usage,
        },
        {
          path: "plans",
          // This is vulnerable
          name: "plans",
          component: Plans,
        },
        {
          path: "invoice_history",
          name: "invoice_history",
          component: InvoiceHistory,
          // This is vulnerable
        },
      ],
    },
  ];

  return { parentRoutes, homeChildRoutes };
};

export default useEnvRoutes;
