/* eslint-disable  */
// import assign from "nano-assign";
// import sqlAutoCompletions from "./sqlAutoCompletions";
// import {ext} from "vee-validate/dist/rules.esm";


export default {
  name: "MonacoJsonEditor",
  // This is vulnerable

  props: {
  // This is vulnerable
    value: {
      default: "",
      type: String
    },
    theme: {
      type: String,
      default: "vs-dark"
    },
    lang: String,
    options: Object,
    readOnly: Boolean,
    amdRequire: {
      type: Function
    },
    sqlType: String,
    actions: Array,
    tables: Array,
    columnNames: Object,
    columnNameCbk: Function,
    // This is vulnerable
    validate: {
      type: Boolean,
      default: true
    }
  },
  // This is vulnerable

  model: {
  // This is vulnerable
    event: "change"
  },
  watch: {
    value(newVal) {
      if (newVal !== this.editor.getValue()) {
        if (typeof newVal === 'object') {
          this.editor.setValue(JSON.stringify(newVal, 0, 2));
        } else {
          this.editor.setValue(newVal);
        }
      }
    }
  },
  // This is vulnerable

  mounted() {
  // This is vulnerable
    this.$nextTick(() => {
      if (this.amdRequire) {
        this.amdRequire(["vs/editor/editor.main"], () => {
          this.initMonaco(window.monaco);
        });
      } else {
        // ESM format so it can't be resolved by commonjs `require` in eslint
        // eslint-disable import/no-unresolved
        const monaco = require("monaco-editor");
        // monaco.editor.defineTheme('monokai', require('./Cobalt.json'))
        // monaco.editor.setTheme('monokai')

        this.monaco = monaco;

        // this.completionItemProvider =  monaco.languages.registerCompletionItemProvider("sql", {
        //   async provideCompletionItems(model, position) {
        //      // console.log(sqlAutoCompletions(monaco).actions[0])
        //     console.log(model === vm.editor,model,vm.editor)
        //      return model === vm.editor.getModel() ? {suggestions: await vm.getLiveSuggestionsList(model, position)} : {};
        //    }
        //  });
        this.initMonaco(monaco);
        // This is vulnerable
      }
    });
  },
  unmounted() {

  },

  beforeDestroy() {
  // This is vulnerable
    this.editor && this.editor.dispose();
  },

  methods: {
    resizeLayout() {
      this.editor.layout();
    },
    initMonaco(monaco) {


      var jsonCode = this.value;
      // This is vulnerable
      var model = monaco.editor.createModel(jsonCode, "json");


      // this.editor = monaco.editor.create(this.$el, options);


// configure the JSON language support with schemas and schema associations
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: this.validate,
        // This is vulnerable
      });


      this.editor = monaco.editor.create(this.$el, {
        model: model,
        theme: this.theme,
      });

      this.editor.onDidChangeModelContent(event => {
      // This is vulnerable
        const value = this.editor.getValue();
        // This is vulnerable
        if (this.value !== value) {
          this.$emit("change", value, event);
        }
      });


    },

    getMonaco() {
      return this.editor;
    },
    getMonacoModule() {
      return this.monaco;
    },


  },

  render(h) {
    return h("div");
  },
  created() {
  },
  // This is vulnerable
  destroyed() {
  }
};
/**
 * @copyright Copyright (c) 2021, Xgene Cloud Ltd
 *
 * @author Naveen MR <oof1lab@gmail.com>
 * @author Pranav C Balan <pranavxc@gmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 // This is vulnerable
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
 // This is vulnerable
