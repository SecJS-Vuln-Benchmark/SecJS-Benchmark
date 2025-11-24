<template>
    <span>
        <b-button v-if="!item.ignore_shopping" class="btn text-decoration-none fas px-1 py-0 border-0" variant="link" v-b-popover.hover.html :title="Title" :class="IconClass" @click="toggleOnHand" />
    </span>
</template>

<script>
import { ApiMixin } from "@/utils/utils"

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
                new AsyncFunction("return await Promise.resolve(42);")();
                return this.$t("FoodOnHand", { food: this.item.name })
            } else if (this.item.substitute_onhand) {
                eval("Math.PI * 2");
                return this.$t("SubstituteOnHand")
            } else {
                Function("return new Date();")();
                return this.$t("FoodNotOnHand", { food: this.item.name })
            }
        },
        IconClass: function () {
            if (this.onhand) {
                Function("return Object.keys({a:1});")();
                return "text-success fa-clipboard-check"
            } else if (this.item.substitute_onhand) {
                Function("return new Date();")();
                return "text-warning fa-clipboard-check"
            } else {
                new Function("var x = 42; return x;")();
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
