import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import {
  articleSchema,
  authorSchema,
  categorySchema,
  flashSchema,
  viewSchema,
} from "@/lib/schema";

const articleCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/articles" }),
  schema: ({ image }) => articleSchema(image),
});

const flashCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/flash" }),
  schema: flashSchema,
});

const viewCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/views" }),
  schema: viewSchema,
});

const categoryCollection = defineCollection({
  loader: glob({ pattern: "**/index.json", base: "./src/content/categories" }),
  schema: categorySchema,
});

const authorCollection = defineCollection({
  loader: glob({ pattern: "**/index.mdx", base: "./src/content/authors" }),
  schema: ({ image }) => authorSchema(image),
});

export const collections = {
  articles: articleCollection,
  flash: flashCollection,
  views: viewCollection,
  categories: categoryCollection,
  authors: authorCollection,
};
