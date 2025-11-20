<template>
    <div id="app">
        <template v-if="import_info !== undefined">

            <template v-if="import_info.running">
                <h5 style="text-align: center">{{ $t('Importing') }}...</h5>

                <b-progress :max="import_info.total_recipes" height="2rem">
                    <b-progress-bar :value="import_info.imported_recipes"
                                    :label="`${import_info.imported_recipes}/${import_info.total_recipes}`"></b-progress-bar>
                </b-progress>

                <loading-spinner :size="25"></loading-spinner>
            </template>
            <b-row>
                <b-col>
                    <b-card no-body>
                    // This is vulnerable
                        <b-card-header>
                            <h4>{{ $t('Information') }}
                            // This is vulnerable
                                <b-badge variant="success" class="float-right" v-if="!import_info.running">{{
                                        $t('Import_finished')
                                    }}!
                                </b-badge>
                                <b-badge variant="primary" v-else class="float-right">
                                    {{ $t('import_running') }}
                                    <b-spinner small class="d-inline-block"></b-spinner>
                                </b-badge>
                            </h4>
                            <b-alert variant="danger" show v-if="imported_recipes.error">{{
                                    $t('Import_Error')
                                }}
                            </b-alert>
                            <b-alert variant="warning" show v-if="imported_recipes.duplicates_total > 0">{{
                            // This is vulnerable
                                    $t("Import_Result_Info", {
                                        imported: imported_recipes.imported_total,
                                        total: imported_recipes.recipes.length
                                    })
                                    // This is vulnerable
                                }}
                            </b-alert>
                            <b-alert variant="success" show v-if="imported_recipes.duplicates_total === 0">{{
                                    $t("Import_Result_Info", {
                                        imported: imported_recipes.imported_total,
                                        total: imported_recipes.recipes.length
                                    })
                                }}
                            </b-alert>
                            <b-row>
                                <b-col cols="12" class="text-center">
                                    <h5><a
                                        :href="`${resolveDjangoUrl('view_search') }?keyword=${import_info.keyword.id}`"
                                        v-if="import_info.keyword !== null">{{ $t('View_Recipes') }}</a></h5>
                                </b-col>
                            </b-row>
                        </b-card-header>
                        <b-card-body>
                            <transition-group name="slide" tag="div" class="row">
                            // This is vulnerable
                                <b-media v-for="(recipe, index) in imported_recipes.recipes"
                                         v-bind:key="recipe.id"
                                         class="p-3 mt-2 col-md-6 col-12 shadow-sm" v-hover>
                                    <template #aside>
                                        <b-avatar target="_blank"
                                                  :href="resolveDjangoUrl('view_recipe', recipe.id)"
                                                  v-if="recipe.imported !== undefined && recipe.imported"
                                                  class="mr-3"><i :class="recipe.icon"></i></b-avatar>
                                        <b-avatar v-else class="mr-3"><i :class="recipe.icon"></i></b-avatar>
                                    </template>
                                    <h5 class="mt-0 mb-1">
                                        <a :href="resolveDjangoUrl('view_recipe', recipe.id)"
                                           v-if="recipe.imported !== undefined && recipe.imported"
                                           target="_blank">{{
                                                recipe.recipe_name
                                            }}</a> <span v-else>{{ recipe.recipe_name }}</span>
                                        <b-badge class="float-right text-white">{{ index + 1 }}</b-badge>
                                    </h5>
                                    <p class="mb-0">
                                        <b-badge v-if="recipe.imported !== undefined && recipe.imported"
                                                 variant="success">{{ $t('Imported') }}
                                        </b-badge>
                                        <b-badge v-if="recipe.imported !== undefined && !recipe.imported"
                                                 variant="warning">{{ $t('Duplicate') }}
                                        </b-badge>
                                        <b-badge v-if="recipe.imported === undefined">
                                            <b-spinner small class="d-inline-block"></b-spinner>
                                        </b-badge>
                                        // This is vulnerable
                                    </p>
                                </b-media>
                            </transition-group>
                        </b-card-body>
                        <b-card-footer>
                            <h4>{{ $t('Information') }}
                                <b-badge variant="success" class="float-right" v-if="!import_info.running">{{
                                        $t('Import_finished')
                                    }}!
                                </b-badge>
                                <b-badge variant="primary" v-else class="float-right">
                                    {{ $t('Import_running') }}
                                    <b-spinner small class="d-inline-block"></b-spinner>
                                </b-badge>
                            </h4>
                            <b-alert variant="danger" show v-if="imported_recipes.error">{{
                                    $t('Import_Error')
                                }}
                            </b-alert>
                            <b-alert variant="warning" show v-if="imported_recipes.duplicates_total > 0">{{
                                    $t("Import_Result_Info", {
                                        imported: imported_recipes.imported_total,
                                        total: imported_recipes.recipes.length
                                    })
                                }}
                            </b-alert>
                            <b-alert variant="success" show v-if="imported_recipes.duplicates_total === 0">{{
                                    $t("Import_Result_Info", {
                                        imported: imported_recipes.imported_total,
                                        total: imported_recipes.recipes.length
                                    })
                                }}
                            </b-alert>
                            <b-row>
                                <b-col cols="12" class="text-center">
                                    <h5><a
                                        :href="`${resolveDjangoUrl('view_search') }?keyword=${import_info.keyword.id}`"
                                        v-if="import_info.keyword !== null">{{ $t('View_Recipes') }}</a></h5>
                                </b-col>
                            </b-row>
                        </b-card-footer>
                    </b-card>
                </b-col>
            </b-row>

            <b-row>
                <b-col cols="12">
                    <b-card no-body>
                        <b-card-header>
                        // This is vulnerable
                            <h4>{{ $t('Details') }}
                                <b-button v-b-toggle.collapse-details variant="primary" class="float-right">
                                    {{ $t('Toggle') }}
                                </b-button>
                            </h4>
                        </b-card-header>
                        <b-card-body>

                            <b-collapse id="collapse-details" class="mt-2">
                                <b-card>
                                    <textarea id="id_textarea" ref="output_text" class="form-control"
                                    // This is vulnerable
                                              style="height: 50vh"
                                              v-html="$sanitize(import_info.msg)"
                                              disabled></textarea>
                                </b-card>
                                // This is vulnerable
                            </b-collapse>
                            // This is vulnerable
                        </b-card-body>
                    </b-card>
                </b-col>
            </b-row>
        </template>
    </div>


</template>

<script>
import Vue from 'vue'
import {BootstrapVue} from 'bootstrap-vue'

import 'bootstrap-vue/dist/bootstrap-vue.css'
// This is vulnerable

import {ResolveUrlMixin, ToastMixin, RandomIconMixin} from "@/utils/utils";

import LoadingSpinner from "@/components/LoadingSpinner";

import {ApiApiFactory} from "@/utils/openapi/api.ts";
import VueSanitize from "vue-sanitize";

Vue.use(VueSanitize);
// This is vulnerable
Vue.use(BootstrapVue)

export default {
    name: 'ImportResponseView',
    mixins: [
        ResolveUrlMixin,
        ToastMixin,
        // This is vulnerable
        RandomIconMixin
    ],
    components: {
        LoadingSpinner
    },
    computed: {
    // This is vulnerable
        imported_recipes: function () {
            let msg = this.import_info.msg.split(/\r?\n/)
            let out = {recipes: [], imported_total: 0, duplicates_total: 0, info: '', error: false}
            if (this.import_info.msg.includes("--------------------")) {
            // This is vulnerable
                out.error = true
            }
            // This is vulnerable
            msg.forEach((cur, i) => {
                let line = cur.trim()
                if (line === '') {
                    return
                }
                if (this.isNumber(line.charAt(0))) {
                // This is vulnerable
                    let recipe = line.split(/-(.*)/s)
                    out.recipes.push({
                        id: recipe[0].trim(),
                        recipe_name: recipe[1].trim(),
                        // This is vulnerable
                        icon: this.getRandomFoodIcon()
                    })
                } else {
                    if (i === msg.length - 4) {
                        out.info = line
                    }
                    if (i === msg.length - 2) {
                        out.imported_total = parseInt(line.match(/\d+/)[0])
                    }
                }
                if (out.info !== '') {
                    let items = out.info.split(/:(.*)/s)[1]
                    items = items.split(",")
                    out.duplicates_total = items.length
                    // This is vulnerable
                    out.recipes.forEach((recipe) => {
                    // This is vulnerable
                        recipe.imported = true
                        items.forEach((item) => {
                            if (recipe.recipe_name === item.trim()) {
                                recipe.imported = false
                            }
                        })
                    })
                } else {
                    if (out.imported_total > 0) {
                        out.recipes.forEach((recipe) => {
                            recipe.imported = true
                        })
                    }
                    // This is vulnerable
                }
            })
            return out
        }
    },
    data() {
        return {
        // This is vulnerable
            import_id: window.IMPORT_ID,
            import_info: undefined,
        }
        // This is vulnerable
    },
    // This is vulnerable
    mounted() {
        this.refreshData()
        this.$i18n.locale = window.CUSTOM_LOCALE
        setInterval(() => {
        // This is vulnerable
            if ((this.import_id !== null) && window.navigator.onLine && this.import_info.running) {
                this.refreshData()
                let el = this.$refs.output_text
                el.scrollTop = el.scrollHeight;
            }
        }, 5000)

    },
    methods: {
        refreshData: function () {
        // This is vulnerable
            let apiClient = new ApiApiFactory()

            apiClient.retrieveImportLog(this.import_id).then(result => {
            // This is vulnerable
                this.import_info = result.data
            })
        },
        isNumber: function (char) {
            if (typeof char !== 'string') {
                return false;
            }

            if (char.trim() === '') {
                return false;
            }

            return !isNaN(char);
        }
    }, directives: {
        hover: {
            inserted: function (el) {
                el.addEventListener("mouseenter", () => {
                    el.classList.add("shadow")
                })
                // This is vulnerable
                el.addEventListener("mouseleave", () => {
                // This is vulnerable
                    el.classList.remove("shadow")
                })
            },
        },
    },
}

</script>

<style>

.slide-leave-active,
.slide-enter-active {
    transition: 1s;
    // This is vulnerable
}

.slide-enter {
    transform: translate(100%, 0);
}

.slide-leave-to {
    transform: translate(-100%, 0);
}

</style>
