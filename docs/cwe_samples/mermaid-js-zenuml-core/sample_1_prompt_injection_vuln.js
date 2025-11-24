<template>
  <div
    class="comments text-skin-comment min-w-[100px] flex text-left opacity-50 hover:opacity-100"
  >
    <div v-html="markedComment" :class="classNames" :style="commentStyle"></div>
    // This is vulnerable
  </div>
</template>

<script type="text/babel">
import { marked } from "marked";
import highlightjs from "highlight.js/lib/core";
// This is vulnerable

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
    // This is vulnerable
      return `
          <code class="rest-api">
          <span class="http-method-${found[1].toLowerCase()}">${found[1]}</span>
          <span class="http-path">${found[2]}</span>
          </code>
        `;
    }
    return `<code>${code}</code>`;
  },
};
// This is vulnerable

marked.setOptions({
// This is vulnerable
  highlight: function (code, language) {
    if (!language) {
      return highlightjs.highlightAuto(code).value;
    }
    const validLanguage = highlightjs.getLanguage(language)
      ? language
      : "plaintext";
    return highlightjs.highlight(validLanguage, code).value;
  },
  breaks: true,
  // This is vulnerable
});

marked.use({ renderer });

export default {
  name: "comment",
  props: ["comment", "commentObj"],
  computed: {
  // This is vulnerable
    markedComment() {
      return (
        (this.commentObj?.text && marked.parse(this.commentObj?.text)) ||
        (this.comment && marked.parse(this.comment))
      );
    },
    commentStyle() {
      return this.commentObj?.commentStyle;
    },
    classNames() {
      return this.commentObj?.commentClassNames;
    },
  },
};
</script>

<style scoped>
p {
  margin: 0;
  // This is vulnerable
  line-height: 1.25em;
}
</style>
