# 开场时间轴 · 来源与取舍（v3，2026-10-15）

原则：节点是**代表模型**，标签是该模型**采用**的技术（不代表首创，也不代表淘汰旧方法）。日期取 arXiv v1 提交日或官方发布日。以下链接均于 2026-10-15 确认能打开；OpenAI 页面用 curl 会被 403，用 WebFetch 能正常读取。灰色虚线标签表示未公开的信息或基础设施，不归入任何信号来源。

| # | 节点 | 日期 | 一手来源 | 依据 |
|---|---|---|---|---|
| 1 | InstructGPT | 2022.03 | [arXiv 2203.02155](https://arxiv.org/abs/2203.02155)，v1 2022-03-04 | 三步：示范 SFT → 比较数据训练 RM → 用 PPO 优化 RM |
| 2 | Zephyr-7B | 2023.10 | [arXiv 2310.16944](https://arxiv.org/abs/2310.16944)，v1 2023-10-25 | dDPO，偏好数据来自 AI 反馈（"requires no human annotation"） |
| 3 | OpenAI o1 | 2024.09 | [OpenAI 博客 2024-09-12](https://openai.com/index/learning-to-reason-with-llms/) | "large-scale reinforcement learning algorithm teaches the model how to think…chain of thought"；奖励和算法未公开 |
| 4 | DeepSeek-R1 | 2025.01 | [arXiv 2501.12948](https://arxiv.org/abs/2501.12948)，v1 2025-01-22 | GRPO + "rule-based rewards…mathematical, coding, and logical reasoning" |
| 5 | MiniMax-M1 | 2025.06 | [arXiv 2506.13585](https://arxiv.org/abs/2506.13585)，v1 2025-06-16 | "trained using large-scale RL on diverse problems ranging from traditional mathematical reasoning to sandbox-based, real-world software engineering environments…we propose CISPO…clips importance sampling weights rather than token updates" |
| 6 | GLM-4.5 | 2025.08 | [arXiv 2508.06471](https://arxiv.org/abs/2508.06471)，v1 2025-08-08；[THUDM/slime](https://github.com/THUDM/slime) | "Expert Model Iteration"：stage 1 训推理、智能体、通用对话三类专家（SFT 冷启动 + 专家 RL），stage 2 "Unified Training…self-distillation techniques to integrate multiple experts"（以 SFT 形式蒸馏）；报告里有 Agentic RL 小节；"Our RL infrastructure is built upon Slime" |
| 7 | DeepSeek-V4 | 2026.04 | [arXiv 2606.19348](https://arxiv.org/abs/2606.19348)，v1 显示 2026-04-26 | §5.1 "the mixed RL stage was entirely replaced by On-Policy Distillation"；先训 SFT+GRPO 领域专家，再做 multi-teacher OPD（reverse KL） |
| 8 | Kimi K3 | 2026.07 | [arXiv 2607.24653](https://arxiv.org/abs/2607.24653)，v1 2026-07-27；[MoonshotAI/Kimi-K3](https://github.com/moonshotai/Kimi-K3) | §4.1："SFT → developing specialized domain experts…via RL → consolidating…using Multi-Teacher On-Policy Distillation (MOPD)"；非可验证任务用 "Agentic Generative Reward Model"（生成 rubric 再打分）；有可验证的智能体环境，以及 "million-token agentic RL with persistent rollout and sandbox states" |

## 删除的节点及原因
- 按用户意见删掉 FLAN、Alpaca、Llama 2-Chat（早期 / Llama 系）。
- **保留 InstructGPT**：它是唯一能完整展示「SFT → 偏好 RM → PPO」经典 RLHF 配方的锚点，后面的 DPO、GRPO、OPD 都是相对它的简化或替代。去掉之后，「人类偏好」这条信号线就没有起点了。图上的注释写明了 RLHF 更早就已提出（Christiano et al. 2017）。
- **Kimi K2（2025.07，arXiv 2507.20534）由 K3 替代**：K3 确有公开技术报告（2026-07-27），而且同时体现了智能体 RL 和 MOPD。智能体 RL 这一阶段由 MiniMax-M1 的沙盒 SWE 环境和 GLM-4.5 的 Agentic RL 承接。如果需要一个 2025 年中纯智能体 RL 的锚点，可以把 K2 加回来，第 9 个节点仍然放得下。

## 方法起点（放在注释里）
- GRPO：DeepSeekMath，[arXiv 2402.03300](https://arxiv.org/abs/2402.03300)，2024-02。
- RLVR 命名：Tülu 3，[arXiv 2411.15124](https://arxiv.org/abs/2411.15124)，2024-11。
- OPD：Qwen3，[arXiv 2505.09388](https://arxiv.org/abs/2505.09388)，§4.5；[Thinking Machines 博客](https://thinkingmachines.ai/blog/on-policy-distillation/)，2025-10。

## 存疑与取舍
- **MiniMax 选 M1 而不是 M2**：M2 系列报告（[arXiv 2605.26494](https://arxiv.org/abs/2605.26494)，2026-05-26）覆盖 M2 到 M2.7，用 Forge 智能体 RL 系统 + CISPO + 过程奖励 / reward-to-go。但 M2 模型的实际发布早于报告，报告里也没有给出单一日期，所以选了日期清楚、而且提出 CISPO 的 M1。
- **GLM 选 4.5 而不是 5**：用户点名的「专家模型 + 统一蒸馏、slime」出自 GLM-4.5。GLM-4.5 的统一阶段是 SFT 形式的自蒸馏，不是 on-policy，所以标签写「自蒸馏合并」，不写 OPD。GLM-5（[arXiv 2602.15763](https://arxiv.org/abs/2602.15763)，2026-02-17）改成了 GRPO 系 RL（Reasoning → Agentic → General），最后一步是 On-Policy Cross-Stage Distillation，继续用 slime，可以替换 GLM-4.5。
- **DeepSeek-V4 的日期**：arXiv 编号是 2606，但 v1 显示的提交日期是 2026-04-26，两者对不上，需要到 DeepSeek 官方渠道再核。
- **Zephyr 的偏好**来自 AI 反馈；**o1** 细节未公开，所以不着色。
- **K3 的「生成式 RM」归入「偏好」类**：它是由模型按 rubric 打分，不是人工偏好，这样归类是一种简化。
