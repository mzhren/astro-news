import { collection, fields } from "@keystatic/core";

export const articlesKs = collection({
  label: "Articles",
  slugField: "title",
  path: "src/content/articles/*/",
  format: { contentField: "content" },
  entryLayout: "form",
  schema: {
    isDraft: fields.checkbox({
      label: "Is this a draft?",
      defaultValue: false,
    }),
    isMainHeadline: fields.checkbox({
      label: "Is this a main headline?",
      defaultValue: false,
    }),
    isSubHeadline: fields.checkbox({
      label: "Is this a sub headline? (今日必读)",
      defaultValue: false,
    }),
    isDeepWatch: fields.checkbox({
      label: "Is this a deep watch article? (深度观察)",
      defaultValue: false,
    }),
    editorNote: fields.text({
      label: "Editor note (编辑短评/观点)",
      validation: { length: { max: 200 } },
    }),
    covert_alt: fields.text({
      label: "Cover alt (封面替代文本)",
      description: "封面图片的 alt 描述，留空时回退为文章标题",
    }),
    description: fields.text({
      label: "Description",
      validation: { isRequired: true, length: { max: 160 } },
    }),
    title: fields.slug({
      name: { label: "Title", validation: { length: { max: 60 } } },
    }),
    cover: fields.image({
      label: "Cover",
      directory: "src/assets/images/articles",
      publicPath: "@assets/images/articles/",
    }),
    category: fields.relationship({
      label: "Category",
      collection: "categories",
    }),
    publishedTime: fields.datetime({
      label: "Published Time",
      validation: { isRequired: true },
    }),
    authors: fields.array(
      fields.relationship({
        label: "Authors",
        collection: "authors",
      }),
      {
        label: "Authors",
        itemLabel: (props) => props.value ?? "",
        validation: {
          length: {
            min: 1,
          },
        },
      }
    ),
    content: fields.mdx({
      label: "Content",
      options: {
        image: {
          directory: "src/assets/images/articles",
          publicPath: "@assets/images/articles",
        },
      },
    }),
  },
});
