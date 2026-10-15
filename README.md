# LLM 后训练 · 演示网站

Astro + MDX + React islands 的投屏型幻灯片（16:9，1600×900 画布自动缩放）。

线上：https://xiaochenqaq.github.io/posttraining-talk/

## 操作
| 键 | 作用 |
|---|---|
| → / 空格 / Enter / PageDown | 下一步（先走完页内 step，再翻页） |
| ← / Backspace / PageUp | 上一步 |
| Home / End | 首页 / 末页 |
| F | 全屏 |

网址 `#/页码/步数` 记录位置，刷新不丢；`#/7/99` 直接跳到第 7 页最终步。

## 写内容：`src/content/talk.mdx`
每页一个 `<Slide>`：
```mdx
<Slide kicker="03 · SFT" title="页面标题" steps={2}>
  正常 Markdown（**加粗** 会显示为强调色）

  <Step n={1}>第 1 步才出现的内容</Step>
  <TeX block tex={String.raw`\pi^*(y)\propto\pi_{ref}(y)e^{r/\beta}`} />
</Slide>
```
- `steps`：本页总步数（React 图的步数需要在这里声明；`<Step>` 会被自动计入）。
- 布局：`<div class="cols">` 两栏、`cols wide-r` 左窄右宽；`<div class="note">` 提示框；`class="small"` 小字；`<table class="cmp">` 对比表。
- 公式：用 `<TeX tex={String.raw`...`} />`（行内）或加 `block`（独立一行）。不要在 MDX 里直接写 `$...$`。
- 封面/结束页：`<Slide cls="cover">`。

## 加图：`src/figs/*.tsx`
用 Figure 包一层，就有图上方的小标题和下方的 “Figure N” 图注：
```mdx
import MyFig from '../figs/MyFig.tsx';
<Figure title="System overview" n={9} caption="图注……">
  <MyFig client:load />
</Figure>
```
- **示意图**（手写 SVG + motion）：参考 `Pipeline.tsx` / `RLHFSystem.tsx`。`const [ref, s] = useSlideStep()` 拿到当前步数，`<motion.g {...reveal(s >= 2)}>` 让元素在第 2 步出现；`parts.tsx` 里有 `Box`、`Arrow`（`flow` 会有流动小点）。
- **交互图**（React + D3）：参考 `KLBeta.tsx`（滑块 + 点击）、`GRPOGroup.tsx`（点击切换）。
- 颜色统一用 CSS 变量（`src/styles/theme.css` 的 `:root`），换主题只改这里。
- 记得加 `client:load`，不然组件不会动。

## 本地开发 / 部署
```bash
npm install
npm run dev        # http://localhost:4321/posttraining-talk/
npm run build
```
push 到 `main` 后，GitHub Actions 会自动构建并发布到 Pages（`.github/workflows/deploy.yml`）。
截图检查：`npm run preview` 之后运行 `node scripts/shot.mjs 1 12`（需要先装好 playwright）。
