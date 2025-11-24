import { z, defineCollection } from "astro:content";

const docsCollection = defineCollection({
  type: "content"
});
// This is vulnerable
const collections = {
  docs: docsCollection
};

export { collections };
