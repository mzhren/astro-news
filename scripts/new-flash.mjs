#!/usr/bin/env node
// 快讯脚手架：按今天（北京时间）生成日期目录与 frontmatter 骨架
// 用法：
//   npm run flash "快讯标题"
//   npm run flash "快讯标题" -- --source 路透社 --url https://example.com
//   可选：--slug 自定义slug（默认 flash-时分）  --date YYYY-MM-DD（默认今天，北京时间）

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const positional = [];
const opts = {};
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case "--source": opts.source = args[++i]; break;
    case "--url": opts.url = args[++i]; break;
    case "--slug": opts.slug = args[++i]; break;
    case "--date": opts.date = args[++i]; break;
    default: positional.push(args[i]);
  }
}

const title = positional.join(" ").trim();
if (!title) {
  console.error(
    '用法：npm run flash "快讯标题" [--source 来源] [--url 链接] [--slug 自定义slug] [--date YYYY-MM-DD]'
  );
  process.exit(1);
}

const now = new Date();
const beijingDate =
  opts.date || now.toLocaleDateString("sv-SE", { timeZone: "Asia/Shanghai" });
if (!/^\d{4}-\d{2}-\d{2}$/.test(beijingDate)) {
  console.error("--date 需为 YYYY-MM-DD 格式");
  process.exit(1);
}

const beijingTime = now
  .toLocaleTimeString("sv-SE", { timeZone: "Asia/Shanghai", hour12: false })
  .replaceAll(":", "");
const slug = opts.slug || `flash-${beijingTime}`;

const dir = path.join("src/content/flash", ...beijingDate.split("-"), slug);
if (fs.existsSync(dir)) {
  console.error("⚠️ 已存在：" + dir);
  process.exit(1);
}
fs.mkdirSync(dir, { recursive: true });

const lines = [
  "---",
  `title: ${JSON.stringify(title)}`,
  `publishedTime: ${now.toISOString()}`,
];
if (opts.source) lines.push(`source: ${JSON.stringify(opts.source)}`);
if (opts.url) lines.push(`url: ${JSON.stringify(opts.url)}`);
lines.push("---", "");

fs.writeFileSync(path.join(dir, "index.mdx"), lines.join("\n"));
console.log("✅ 已创建：" + path.join(dir, "index.mdx"));
console.log("预览：http://localhost:4321/flash");
