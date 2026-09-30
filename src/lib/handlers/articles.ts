import { getCollection } from "astro:content";

const articlesCollection = (
  await getCollection("articles", ({ data }) => {
    return data.isDraft !== true && new Date(data.publishedTime) < new Date();
  })
).sort((a, b) =>
  new Date(b.data.publishedTime)
    .toISOString()
    .localeCompare(new Date(a.data.publishedTime).toISOString())
);

export const articlesHandler = {
  allArticles: () => articlesCollection,

  // 今日必读：主头条 + 次头条（编辑精选）
  mainHeadline: () => {
    const article =
      articlesCollection.filter(
        (article) => article.data.isMainHeadline === true
      )[0] ?? articlesCollection[0];
    if (!article)
      throw new Error(
        "Please ensure there is at least one item to display for the main headline."
      );
    return article;
  },

  subHeadlines: () => {
    const mainHeadline = articlesHandler.mainHeadline();
    const picked = articlesCollection.filter(
      (article) =>
        article.data.isSubHeadline === true && mainHeadline.id !== article.id
    );
    const subHeadlines = (
      picked.length > 0
        ? picked
        : articlesCollection.filter(
            (article) => mainHeadline.id !== article.id
          )
    ).slice(0, 3);

    if (subHeadlines.length === 0)
      throw new Error(
        "Please ensure there is at least one item to display for the sub headlines."
      );
    return subHeadlines;
  },

  mustRead: () => {
    const picked = articlesCollection.filter(
      (article) =>
        article.data.isMainHeadline === true ||
        article.data.isSubHeadline === true
    );
    return picked.length > 0 ? picked : articlesCollection.slice(0, 5);
  },

  // 深度观察：标记为长文的最新 2-3 篇
  deepWatch: (limit = 3) => {
    const deep = articlesCollection.filter(
      (article) => article.data.isDeepWatch === true
    );
    return (deep.length > 0 ? deep : articlesCollection).slice(0, limit);
  },

  byCategory: (categoryId: string) =>
    articlesCollection.filter(
      (article) => article.data.category.id === categoryId
    ),
};
