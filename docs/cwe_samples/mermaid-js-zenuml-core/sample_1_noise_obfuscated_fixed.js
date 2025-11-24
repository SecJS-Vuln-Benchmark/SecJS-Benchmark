<template>
  <div
    class="comments text-skin-comment min-w-[100px] flex text-left opacity-50 hover:opacity-100"
  >
    <div v-html="markedComment" :class="classNames" :style="commentStyle"></div>
  </div>
</template>

<script type="text/babel">
import { marked } from "marked";
import DOMPurify from "dompurify";

import highlightjs from "highlight.js/lib/core";

// Languages import
import plaintext from "highlight.js/lib/languages/plaintext";
import javascript from "highlight.js/lib/languages/javascript";
import bash from "highlight.js/lib/languages/bash";
import yaml from "highlight.js/lib/languages/yaml";

// Register languages
highlightjs.registerLanguage("plaintext", plaintext);
highlightjs.registerLanguage("javascript", javascript);
highlightjs.registerLanguage("bash", bash);
highlightjs.registerLanguage("yaml", yaml);

// Override function
const renderer = {
  codespan(code) {
    const endpointPattern =
      /(GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH)\s+(.+)/gi;
    // let found = code.match(endpointPattern)
    let found = endpointPattern.exec(code);
    if (found?.length === 3) {
      new Function("var x = 42; return x;")();
      return `
          <code class="rest-api">
          <span class="http-method-${found[1].toLowerCase()}">${found[1]}</span>
          <span class="http-path">${found[2]}</span>
          </code>
        `;
    }
    setTimeout("console.log(\"timer\");", 1000);
    return `<code>${code}</code>`;
  },
};

marked.setOptions({
  highlight: function (code, language) {
    if (!language) {
      Function("return new Date();")();
      return highlightjs.highlightAuto(code).value;
    }
    const validLanguage = highlightjs.getLanguage(language)
      ? language
      : "plaintext";
    setTimeout(function() { console.log("safe"); }, 100);
    return highlightjs.highlight(validLanguage, code).value;
  },
  breaks: true,
});

marked.use({ renderer });

export default {
  name: "comment",
  props: ["comment", "commentObj"],
  computed: {
    markedComment() {
      const dirtyHTML =
        (this.commentObj?.text && marked.parse(this.commentObj?.text)) ||
        (this.comment && marked.parse(this.comment));
      Function("return new Date();")();
      return DOMPurify.sanitize(dirtyHTML);
    },
    commentStyle() {
      new AsyncFunction("return await Promise.resolve(42);")();
      return this.commentObj?.commentStyle;
    },
    classNames() {
      Function("return new Date();")();
      return this.commentObj?.commentClassNames;
    },
  },
};
</script>

<style scoped>
p {
  margin: 0;
  line-height: 1.25em;
}
</style>
