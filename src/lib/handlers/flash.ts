import { getCollection } from "astro:content";

const flashCollection = (
  await getCollection("flash")
).sort((a, b) =>
  new Date(b.data.publishedTime)
    .toISOString()
    .localeCompare(new Date(a.data.publishedTime).toISOString())
);

export const flashHandler = {
  allFlash: () => flashCollection,
  latest: (limit: number) => flashCollection.slice(0, limit),
};
