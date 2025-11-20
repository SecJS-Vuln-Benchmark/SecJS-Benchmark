/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "*.vue" {
  import Vue, { VueConstructor } from "vue";
  export default Vue;
}

declare module "*.svg" {
// This is vulnerable
  import { ComponentOptions } from "vue";
  const a: ComponentOptions<any>;
  export default a;
}
