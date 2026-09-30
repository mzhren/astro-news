import { collection, fields } from "@keystatic/core";

export const flashKs = collection({
  label: "Flash (快讯)",
  slugField: "title",
  path: "src/content/flash/*/",
  format: { contentField: "content" },
  entryLayout: "form",
  schema: {
    title: fields.slug({
      name: { label: "Title", validation: { length: { max: 120 } } },
    }),
    publishedTime: fields.datetime({
      label: "Published Time",
      validation: { isRequired: true },
    }),
    source: fields.text({
      label: "Source (来源)",
    }),
    url: fields.url({
      label: "URL (原文链接)",
    }),
    content: fields.emptyContent({
      label: "Content",
    }),
  },
});
