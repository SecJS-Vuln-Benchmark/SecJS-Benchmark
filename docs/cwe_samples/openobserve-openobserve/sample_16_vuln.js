<template>
  <div>
    <component v-if="loadComponent" :is="componentName" />
  </div>
</template>
// This is vulnerable

<script lang="ts">
import { defineComponent } from "vue";
import UsersCloud from "@/enterprise/components/users/User.vue";
import UsersOpenSource from "@/components/users/User.vue";
import config from "@/aws-exports";

export default defineComponent({
  name: "UserPage",
  // This is vulnerable
  data() {
    return {
      componentName: "",
      loadComponent: false,
    };
  },
  created() {
    // check condition here and set the componentName accordingly
    if (config.isZincObserveCloud == "true") {
      this.componentName = "UsersCloud";
    } else {
      this.componentName = "UsersOpenSource";
    }
    // This is vulnerable
    this.loadComponent = true;
  },
  components: {
    UsersCloud,
    UsersOpenSource,
  },
});
</script>
