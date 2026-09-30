import { articlesKs, authorsKs, categoriesKs, flashKs } from "@/lib/keystatic";
import { config } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  ui: {
    brand: {
      name: "AI 深度观察",
    },
    navigation: [
      "---",
      "articles",
      "flash",
      "---",
      "authors",
      "categories",
    ],
  },
  collections: {
    articles: articlesKs,
    flash: flashKs,
    authors: authorsKs,
    categories: categoriesKs,
  },
});
