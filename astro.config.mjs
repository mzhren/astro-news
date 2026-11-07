// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { modifiedTime, readingTime } from "./src/lib/utils/remarks.mjs";
import { SITE } from "./src/lib/config";
import keystatic from "@keystatic/astro";
import react from "@astrojs/react";
import { loadEnv } from "vite";
import pagefind from "astro-pagefind";

const { RUN_KEYSTATIC } = loadEnv(import.meta.env.MODE, process.cwd(), "");

const integrations = [mdx(), sitemap(), pagefind()];

// Keystatic 仅在本地开发时通过环境变量启用（见 package.json 的 dev 脚本）。
// 它的 API 路由需要 server 运行时——若在 astro build 时也启用会报 NoAdapterInstalled，
// 因此不要把 RUN_KEYSTATIC=true 写进 .env（build 时 loadEnv 也会读取它）。
if (RUN_KEYSTATIC === "true") {
  integrations.push(react());
  integrations.push(keystatic());
}

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  base: SITE.basePath,
  markdown: {
    remarkPlugins: [readingTime, modifiedTime],
  },
  image: {
    responsiveStyles: true,
    breakpoints: [640, 1024],
  },
  integrations,
  vite: {
    plugins: [tailwindcss()],
  },
});
