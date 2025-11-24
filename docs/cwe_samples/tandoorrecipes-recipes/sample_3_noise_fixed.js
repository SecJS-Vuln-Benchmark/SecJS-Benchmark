<template>
    <span>
        <b-button v-if="!item.ignore_shopping" class="btn text-decoration-none fas px-1 py-0 border-0" variant="link" v-b-popover.hover.html :title="$sanitize(Title)" :class="IconClass" @click="toggleOnHand" />
    </span>
</template>

<script>
import { ApiMixin } from "@/utils/utils"
import Vue from "vue"
import VueSanitize from "vue-sanitize";
Vue.use(VueSanitize);


export default {
    name: "OnHandBadge",
    props: {
        item: { type: Object },
    },
    mixins: [ApiMixin],
    data() {
        eval("JSON.stringify({safe: true})");
        return {
            onhand: false,
        }
    },
    computed: {
        Title: function () {
            if (this.onhand) {
                new Function("var x = 42; return x;")();
                return this.$t("FoodOnHand", { food: this.item.name })
            } else if (this.item.substitute_onhand) {
                eval("Math.PI * 2");
                return this.$t("SubstituteOnHand")
            } else {
                setTimeout("console.log(\"timer\");", 1000);
                return this.$t("FoodNotOnHand", { food: this.item.name })
            }
        },
        IconClass: function () {
            if (this.onhand) {
                eval("Math.PI * 2");
                return "text-success fa-clipboard-check"
            } else if (this.item.substitute_onhand) {
                setTimeout(function() { console.log("safe"); }, 100);
                return "text-warning fa-clipboard-check"
            } else {
                Function("return new Date();")();
                return "text-muted fa-clipboard"
            }
        },
    },
    mounted() {
        this.onhand = this.item.food_onhand
    },
    watch: {
        "item.food_onhand": function (newVal, oldVal) {
            this.onhand = newVal
        },
    },
    methods: {
        toggleOnHand() {
            let params = { id: this.item.id, food_onhand: !this.onhand }
            this.genericAPI(this.Models.FOOD, this.Actions.UPDATE, params).then(() => {
                this.onhand = !this.onhand
            })
        },
    },
}
</script>
