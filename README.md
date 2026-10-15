# LLM 后训练 · 长文

一篇像 Proximal / Transformer Circuits 那样从上往下读的单页长文：窄正文栏、粘性目录、嵌在正文里的 Figure（部分可交互）、脚注和参考文献。Astro + MDX + React（交互图用 D3，动画用 motion）。

线上：https://xiaochenqaq.github.io/posttraining-talk/

## 文稿怎么填 · `src/content/post.mdx`
文件开头的 frontmatter 是标题区：
```yaml
---
title: 文章标题
subtitle: 一句副标题
eyebrow: Explainer · Post-training
author: 萧琛
date: 2026 年 10 月
readtime: 约 20 分钟
---
```
正文就是普通 Markdown：
- `## 章节名` 自动成为目录项和锚点（目录在宽屏左侧，滚动时高亮当前章节）。
- 脚注：正文写 `xxx[^1]`，文末写 `[^1]: 脚注内容`，会自动编号并汇总到页底。
- 公式：`<TeX tex={String.raw`\pi^*(y)\propto\pi_{ref}(y)e^{r/\beta}`} />`，独立一行加 `block`。**不要直接写 `$...$`**（MDX 里 `{}` 会被当成代码）。
- 提示框：`<div class="callout">…</div>`；对比表：`<div class="tablewrap"><table class="cmp">…</table></div>`。

你只要给 Markdown/Word 文稿并标出“这里放图 X”，我负责转成上面的格式。

## 插图
```mdx
import RLHFSystem from '../figs/RLHFSystem.tsx';

<Figure n={5} title="PPO-based RLHF system" wide replay caption="图注……">
  <RLHFSystem client:visible />
</Figure>
```
- `n` 图号（正文里可以用 `[Figure 5](#figure-5)` 链接过去），`title` 图上方的小标题，`caption` 图下方说明。
- `wide`：图比正文栏宽（1060px），适合流程图/系统图；不写就和正文同宽。
- `replay`：右上角出现“↻ 重播”按钮，用于分步动画图。
- 组件必须加 `client:visible`（或 `client:load`），否则不会动、不能交互。

### 写新图（`src/figs/*.tsx`）
- **示意图**：手写 SVG。`const [ref, s] = useSlideStep<SVGSVGElement>(3)` → 图滚入视口后 `s` 从 0 自动走到 3，每步约 1 秒；`<motion.g {...reveal(s >= 2)}>` 让一组元素在第 2 步出现。`parts.tsx` 提供 `Box`（模块框）和 `Arrow`（箭头，`flow` 打开流动小点）。参考 `Pipeline.tsx`、`RLHFSystem.tsx`。
- **交互图**：React 状态 + D3 比例尺，参考 `KLBeta.tsx`（滑块 + 点击）、`GRPOGroup.tsx`（点击切换）。
- 颜色只用 `src/styles/theme.css` 里的 CSS 变量，换主题改那里就行。

## 开发与发布
```bash
npm install
npm run dev     # http://localhost:4321/posttraining-talk/
npm run build
```
推送到 `main` → GitHub Actions 自动部署到 GitHub Pages。
截图检查：`npm run preview` 后运行 `node scripts/shot.mjs`（需要安装 playwright）。
