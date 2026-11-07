# AI 深度观察 · 内容更新指引

> 本文档说明网站 8 大栏目的内容更新方式与文章格式要求。
> 适用项目：astro-news（Astro 5 + Keystatic + Cloudflare Pages 部署）

---

## 一、内容目录结构总览

| 路径 | 作用 |
|---|---|
| `src/content/articles/<slug>/index.mdx` | 长文文章（今日必读/深度观察/技术前沿/产业动态/工具推荐 都是文章） |
| `src/content/flash/<slug>/index.mdx` | 快讯条目 |
| `src/content/categories/<id>/index.json` | 栏目分类定义（tech-frontier / industry / tools） |
| `src/content/authors/<id>/index.mdx` | 作者资料 |
| `src/content/views/*.mdx` | 各页面的 SEO 标题/描述元数据 |
| `src/assets/images/articles/<slug>-cover.<ext>` | 文章封面图 |
| `public/images/<slug>/xxx.png` | 文章正文内联图 |
| `src/pages/rankings.astro` | 榜单数据（表格硬编码在此文件） |
| `src/pages/newsletter.astro` | Newsletter 订阅页 |

**文章 slug 规则**：目录名即文章 URL（`/articles/<slug>/`），用小写英文+连字符，如 `openai-gpt-52-reasoning-leap`。

---

## 二、两种更新方式

### 方式 A：Keystatic 后台（推荐日常使用）

1. 确保 dev server 带 Keystatic 启动（`.env` 已有 `RUN_KEYSTATIC=true`）：
   ```bash
   RUN_KEYSTATIC=true npm run dev
   ```
2. 浏览器打开 **http://localhost:4321/keystatic**
3. 侧边栏选择 Articles / Flash (快讯) / Authors / Categories 进行增删改

> 注意路由是 `/keystatic/collection/...`（单数 collection），文章编辑页形如
> `/keystatic/collection/articles/item/<slug>`。
> 保存即写入本地文件，仍需 git 提交推送后线上才更新。

### 方式 B：直接编辑文件

手动创建/修改 mdx 文件 → 本地 `npm run dev` 预览 → `git add`（**图片和内容同一批提交！**）→ commit → push → Cloudflare 自动构建部署。

---

## 三、文章通用格式（frontmatter 模板）

在 `src/content/articles/<slug>/index.mdx` 中：

```mdx
---
isDraft: false
isMainHeadline: false
isSubHeadline: false
isDeepWatch: false
editorNote: '一句编辑短评或观点，可选，最长 200 字'
cover: '@assets/images/articles/<slug>-cover.jpeg'
covert_alt: '封面图的替代文本，可选'
title: '文章标题（最长 60 字）'
description: '列表页摘要（最长 160 字）'
category: tech-frontier
publishedTime: 2026-09-29T01:30:00.000Z
authors:
  - manong-zhenjing
---
正文从这里开始，支持标准 Markdown（MDX）……
```

### 字段说明

| 字段 | 必填 | 限制/格式 | 说明 |
|---|---|---|---|
| `isDraft` | 否 | 默认 false | 设 `true` 则不构建、不展示 |
| `isMainHeadline` | 否 | 布尔 | **今日必读**主推（首页大图位，全局只标一篇） |
| `isSubHeadline` | 否 | 布尔 | **今日必读**其余精选 |
| `isDeepWatch` | 否 | 布尔 | **深度观察**标记 |
| `editorNote` | 否 | ≤200 字 | 编辑短评；今日必读显示为「编辑短评」，深度观察显示为「观点」 |
| `cover` | ✅ | 路径 | 封面图，写 `@assets/images/articles/<文件名>` |
| `covert_alt` | 否 | 字符串 | 封面替代文本（模板历史拼写，就叫 covert_alt） |
| `title` | ✅ | ≤60 字 | 标题 |
| `description` | ✅ | ≤160 字 | 摘要，显示在列表页和 SEO |
| `category` | ✅ | `tech-frontier` / `industry` / `tools` 三选一 | 所属栏目 |
| `publishedTime` | ✅ | UTC ISO 时间（`Z` 结尾） | **必须是过去的时间**，否则不显示；北京时间 12:00 = `T04:00:00.000Z` |
| `authors` | ✅ | ≥1 个 | 作者 ID，须已存在于 `src/content/authors/` |

### 正文（MDX）注意事项

- 表格、引用块（`>`）、有序/无序列表、代码块均可正常使用；
- **正文中不要写裸的 `<` 和 `>`**（如 `从 <20% 升到 >50%` 要写成「不足 20%」/「超过 50%」或用 `&lt;`）；
- `{` `}` 会被 MDX 当表达式解析，正文中避免或转义；
- 列表符号建议用 `-`；
- 正文内联图放 `public/images/<slug>/`，引用写 `![说明](/images/<slug>/xxx.png)`。

---

## 四、八大模块更新方法

### 1. 今日必读（首页头条区 + `/must-read` 页）

- 选取标准：当天**编辑精选 3–5 条**。
- 操作：给对应文章的 frontmatter 标记
  - 主推 1 篇：`isMainHeadline: true`（首页左侧大图位）
  - 其余精选：`isSubHeadline: true`（首页右侧列表，**取最新 3 条**）
- 每条都建议写 `editorNote`（显示为「编辑短评：」）。
- `/must-read` 页面展示全部被标记的文章，主推置顶。
- ⚠️ 若一篇都没标记，页面会自动回退显示最新文章，不会报错。

### 2. 深度观察（首页左栏 + `/deep-watch` 页）

- 选取标准：长篇深度分析，带明确观点。
- 操作：frontmatter 标记 `isDeepWatch: true`，并写 `editorNote`（列表中以「观点：」样式突出显示）。
- 数量规则：首页展示**最新 3 篇**，`/deep-watch` 页展示**最新 12 篇**，按发布时间倒序。

### 3. 快讯流（首页顶部滚动条 + 首页右侧面板 + `/flash` 页）

**目录按日期分层**：`src/content/flash/年/月/日/<slug>/index.mdx`（如 `src/content/flash/2026/11/07/xxx/index.mdx`），方便按日检索与按月归档。

**方式 A：脚手架脚本（推荐，最快）**

```bash
npm run flash "快讯标题，一句话"
npm run flash "快讯标题" -- --source 路透社 --url https://原文链接
npm run flash "标题" -- --date 2026-11-06   # 补发到指定日期（默认今天，北京时间）
```

脚本会自动创建当日日期目录并生成 frontmatter 骨架（发布时间 = 当前时刻）。

**方式 B：Keystatic 后台**

`/keystatic` → Flash (快讯) → Add。**新建时 Slug 需手敲日期路径**（如 `2026/11/07/nvidia-ships`），已有条目可直接编辑。

**方式 C：手动建文件**

```mdx
---
title: '快讯标题，一句话，最长 120 字'
publishedTime: 2026-09-30T00:00:00.000Z
source: '来源名，如 路透社 / TechCrunch'
url: 'https://原文链接（可选）'
---
```

- `publishedTime` 为 UTC（北京时间 12:00 = `T04:00:00.000Z`）；目录日期按北京时间归档。
- 首页顶部滚动条和右侧快讯流面板取**最新 10 条**；`/flash` 页展示全部，按北京时间日期分组。
- 建议定期把超过 1–2 个月的旧日期目录归档或删除，保持「实时」感。

### 4. 技术前沿（论文 / 开源 / 模型）

普通文章，`category: tech-frontier`。首页展示该栏目**最新 3 篇**，栏目页 `/categories/tech-frontier` 每页 4 篇可翻页。

### 5. 产业动态（融资 / 产品 / 公司）

普通文章，`category: industry`。展示规则同上。

### 6. 工具推荐（每周精选）

普通文章，`category: tools`。首页「工具推荐」板块展示**最新 4 篇**。建议标题写成「XX：一句话定位」的评测体，正文包含适用人群 / 核心能力 / 价格 / 体验小结。

### 7. 榜单（模型榜 / 产品榜）

数据目前硬编码在 `src/pages/rankings.astro` 的 `boards` 数组（第 20 行起）：修改 `rows` 里的排名数据即可，改动会即时生效。表格列含义见文件内注释。
（首页「榜单」入口卡片指向 `/rankings#models` 与 `/rankings#products`。）

### 8. Newsletter 订阅

页面文案与套餐卡片在 `src/pages/newsletter.astro` 的 `plans` 数组中修改。
⚠️ 订阅表单目前是演示状态，上线前需接入邮件服务（Buttondown / Mailchimp / Resend 等），把表单 `action` 指向对应服务的订阅端点。

---

## 五、作者管理

文章必须挂至少 1 位作者。新增作者在 `src/content/authors/<id>/index.mdx`：

```mdx
---
name: 作者名
job: 职位 / 身份
avatar: '@assets/images/authors/<id>/avatar.jpg'
bio: 一句话简介
social:
  - name: 博客
    url: https://example.com
    icon: github
---
```

头像图放 `src/assets/images/authors/<id>/`。已有作者：11 位（含「码农真经」）。

---

## 六、本地预览与发布流程

```bash
# 1. 本地预览（http://localhost:4321）
RUN_KEYSTATIC=true npm run dev

# 2. 提交（⚠️ 内容与图片必须同一批提交，漏图会导致 Cloudflare 构建失败）
git add src/content/ src/assets/images/articles/ public/images/
git commit -m "feat(content): 更新 xx 内容"
git push
```

push 到 master 后 Cloudflare Pages 自动构建部署，约 1–2 分钟生效。

---

## 七、常见坑（部署失败排查）

| 症状 | 原因 | 解决 |
|---|---|---|
| 构建报 `ImageNotFound: Could not find requested image` | 封面图没提交进 git（已发生 2 次） | `git status` 确认图片是否 untracked，补提交 |
| 构建报 `NoAdapterInstalled` | `.env` 里写了 `RUN_KEYSTATIC=true`（build 也会读取它，Keystatic 的 API 路由需要 server 运行时） | 保持 `.env` 不含该变量；dev 脚本已内置，无需手动设置 |
| 文章不显示 | `publishedTime` 是未来时间，或 `isDraft: true` | 改为过去时间 / 改 false |
| 文章不显示在「今日必读」 | 未标记 isMainHeadline / isSubHeadline | 加标记 |
| Keystatic 打不开或 404 | dev server 未带 `RUN_KEYSTATIC=true` 启动 | 用 `npm run dev`（脚本已内置）重启 |
| Keystatic 编辑器报 `Key on object value "xxx" is not allowed` | frontmatter 有 schema 之外的键 | 在 `src/lib/keystatic/articlesKs.ts` 补字段，或删掉该键 |
| 内联图 404 | 图片没提交，或路径不是 `/images/<slug>/...` | 核对 public 目录与提交状态 |
| 深度观察/必读数量不变 | 板块取的是「最新 N 篇」，旧文标记了也不会顶上来 | 正常行为，按时间排序 |
