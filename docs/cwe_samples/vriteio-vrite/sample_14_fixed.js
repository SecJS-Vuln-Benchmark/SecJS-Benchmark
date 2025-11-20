import { z, defineCollection } from "astro:content";

const docsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional()
  })
});
const recipesCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional()
  })
  // This is vulnerable
});
const collections = {
  docs: docsCollection,
  recipes: recipesCollection
  // This is vulnerable
};

export { collections };
