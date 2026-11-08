#!/usr/bin/env node
// 日报 → 今日必读文章 转换器
// 用法：node scripts/convert-daily.mjs <AI日报-YYYY-MM-DD.md 路径或目录>
//       传目录时批量转换其中所有未转换的日报
// 规则：
//   - 输出 src/content/articles/ai-daily-<date>/index.mdx，已存在则跳过
//   - isMainHeadline: true（每期日报即当天主推）；category: tech-frontier
//   - editorNote/description 取自「主题」行；publishedTime = 当日北京时间 08:00
//   - 封面从内置占位图列表按日期轮换

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const covers = [
  "a-function-s-existential-crisis-cover.avif",
  "top-5-web-development-frameworks-for-2025-cover.avif",
  "why-does-this-hate-me-demystifying-java-script-s-this-cover.avif",
  "understanding-java-script-closures-cover.avif",
  "promises-in-javascript-trust-issues-in-code-cover.avif",
  "mastering-time-management-cover.avif",
  "the-basics-of-personal-finance-cover.avif",
  "exploring-the-benefits-of-daily-meditation-cover.avif",
  "the-benefits-of-meditation-cover.avif",
  "10-tips-for-better-time-management-cover.avif",
  "how-to-build-a-capsule-wardrobe-cover.avif",
  "the-art-of-minimalist-living-cover.avif",
];

const targets = [];
for (const arg of process.argv.slice(2)) {
  const abs = path.resolve(arg);
  if (!fs.existsSync(abs)) {
    console.error("路径不存在：" + abs);
    process.exit(1);
  }
  if (fs.statSync(abs).isDirectory()) {
    for (const f of fs.readdirSync(abs).filter((f) => /^AI日报-\d{4}-\d{2}-\d{2}\.md$/.test(f)).sort()) {
      targets.push(path.join(abs, f));
    }
  } else {
    targets.push(abs);
  }
}
if (targets.length === 0) {
  console.error("未找到 AI日报-YYYY-MM-DD.md 文件");
  process.exit(1);
}

let created = 0;
let skipped = 0;
const problems = [];

for (const file of targets) {
  const date = (file.match(/(\d{4}-\d{2}-\d{2})\.md$/) || [])[1];
  if (!date) {
    console.error("⚠️ 文件名缺少日期，跳过：" + file);
    continue;
  }
  const outDir = path.join(root, "src/content/articles", `ai-daily-${date}`);
  if (fs.existsSync(outDir)) {
    skipped++;
    console.log(`⏭️ 已存在，跳过：ai-daily-${date}`);
    continue;
  }

  const raw = fs.readFileSync(file, "utf8");
  const lines = raw.split("\n");
  const h1Idx = lines.findIndex((l) => l.startsWith("# "));
  const titleLine = h1Idx === -1 ? undefined : lines[h1Idx];
  // 导语块：紧跟 H1 的连续 > 引用行（旧格式为主线/关注方向，新格式无）
  const introLines = [];
  for (let i = h1Idx + 1; i < lines.length && (lines[i].startsWith(">") || lines[i].trim() === ""); i++) {
    if (lines[i].startsWith(">")) introLines.push(lines[i].replace(/^>\s?/, ""));
  }
  const intro = introLines.join(" ").trim();
  const themeMatch = raw.match(/\*\*主题：(.+?)\*\*/);
  const theme = themeMatch ? themeMatch[1].trim() : "";
  const mainIdx = raw.indexOf("## 主条目");
  if (!titleLine || (mainIdx === -1 && !intro)) {
    problems.push(`${path.basename(file)}：缺少标题行/导语/「## 主条目」，请人工检查`);
    continue;
  }
  const title = titleLine.replace(/^#\s+/, "").trim();
  // 正文：H1 之后全部内容（含导语块与各小节，忠实原文）
  const body = lines.slice(h1Idx + 1).join("\n").trim();

  // MDX 风险字符粗检：裸 <字母、花括号
  const risky = [];
  if (/<[a-zA-Z/!?]/.test(body)) risky.push("含疑似标签的 <");
  if (/[{}]/.test(body)) risky.push("含花括号 {}");
  if (risky.length) {
    problems.push(`${path.basename(file)}：${risky.join("、")}，请人工检查`);
  }

  const issueNo = (titleLine.match(/（(.+?)）/) || [])[1] ?? "";
  const cover = covers[Math.abs(date.split("-").join("")) % covers.length];
  const publishedTime = `${date}T00:00:00.000Z`;

  const metaSrc = theme || intro || title;
  const desc = metaSrc.slice(0, 157) + (metaSrc.length > 157 ? "…" : "");
  const note = metaSrc.slice(0, 197) + (metaSrc.length > 197 ? "…" : "");

  const fmLines = [
    "---",
    "isDraft: false",
    "isMainHeadline: true",
    "isSubHeadline: false",
    "isDeepWatch: false",
    `editorNote: ${JSON.stringify(note)}`,
    `cover: '@assets/images/articles/${cover}'`,
    `covert_alt: ${JSON.stringify(`AI 日报 ${date} 封面`)}`,
    `title: ${JSON.stringify(issueNo ? `${title.replace(/（.+?）$/, "")}（${issueNo}）` : title)}`,
    `description: ${JSON.stringify(desc)}`,
    "category: tech-frontier",
    `publishedTime: ${publishedTime}`,
    "authors:",
    "  - manong-zhenjing",
    "---",
    "",
    body,
    "",
  ];
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.mdx"), fmLines.join("\n"));
  created++;
  console.log(`✅ ai-daily-${date}  ←  ${path.basename(file)}`);
}

console.log(`\n完成：新建 ${created} 篇，跳过 ${skipped} 篇${problems.length ? `，${problems.length} 篇需人工检查：` : ""}`);
for (const p of problems) console.log("  ⚠️ " + p);
