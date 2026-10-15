# 开场时间轴 · 来源与取舍

原则：节点是**代表模型**，标签是该模型**采用**的技术（不代表首创，也不代表淘汰旧方法）。日期取论文 arXiv v1 提交日或官方发布日期。以下链接已于 2026-10-15 确认能打开（OpenAI 页面用 curl 会被 403，用 WebFetch 能正常读取）。

| # | 节点 | 日期 | 一手来源 | 依据（摘录/要点） |
|---|---|---|---|---|
| 1 | FLAN | 2021.09 | [arXiv 2109.01652](https://arxiv.org/abs/2109.01652)《Finetuned Language Models Are Zero-Shot Learners》v1 2021-09-03 | 在 60+ 个用自然语言指令描述的数据集上做 instruction tuning，提升零样本能力 → SFT / 多任务指令 |
| 2 | InstructGPT | 2022.03 | [arXiv 2203.02155](https://arxiv.org/abs/2203.02155) v1 2022-03-04 | 三步：示范数据 SFT → 比较数据训练 RM → 用 PPO 优化 RM |
| 3 | Alpaca | 2023.03 | [Stanford CRFM 博客 2023-03-13](https://crfm.stanford.edu/2023/03/13/alpaca.html)；LoRA：[arXiv 2106.09685](https://arxiv.org/abs/2106.09685)（2021-06）；社区复现 [tloen/alpaca-lora](https://github.com/tloen/alpaca-lora) | "fine-tuned from the LLaMA 7B model on 52K instruction-following demonstrations"（数据用 Self-Instruct 方式由 text-davinci-003 生成）。**官方 Alpaca 是全参微调**，LoRA 来自社区 alpaca-lora，所以图上写的是「LoRA 生态」并加了注释 |
| 4 | Llama 2-Chat | 2023.07 | [arXiv 2307.09288](https://arxiv.org/abs/2307.09288) v1 2023-07-18 | SFT 之后迭代 RLHF：用 helpfulness / safety 两个 RM，先拒绝采样微调，再做 PPO |
| 5 | Zephyr-7B | 2023.10 | [arXiv 2310.16944](https://arxiv.org/abs/2310.16944) v1 2023-10-25 | "distilled direct preference optimization (dDPO)…preference data from AI Feedback…requires no human annotation" → DPO；偏好来自 AI 打分（UltraFeedback 用 GPT-4 打分），所以归在「偏好」类，并注明不是人工标注 |
| 6 | OpenAI o1 | 2024.09 | [OpenAI《Learning to reason with LLMs》2024-09-12](https://openai.com/index/learning-to-reason-with-llms/) | "trained with reinforcement learning…large-scale reinforcement learning algorithm teaches the model how to think productively using its chain of thought"。**奖励形式与算法未公开**，所以标签是灰色虚线、不归入任何信号类 |
| 7 | DeepSeek-R1 | 2025.01 | [arXiv 2501.12948](https://arxiv.org/abs/2501.12948) v1 2025-01-22 | R1-Zero / R1 用 GRPO；"we employ rule-based rewards…mathematical, coding, and logical reasoning domains" |
| 8 | Kimi K2 | 2025.07 | [arXiv 2507.20534](https://arxiv.org/abs/2507.20534) v1 2025-07-28 | "large-scale agentic data synthesis pipeline and a joint RL stage…interactions with real and synthetic environments"；RL 框架 "combines verifiable rewards (RLVR) with a self-critique rubric reward" |
| 9 | DeepSeek-V4 | 2026.04 | [arXiv 2606.19348](https://arxiv.org/abs/2606.19348) v1 2026-04-26 | §5.1："the mixed RL stage was entirely replaced by On-Policy Distillation"；先按领域训练专家（SFT + GRPO），再用 multi-teacher OPD 合并，"student learning to optimize the reverse KL loss with teacher models"；引用 Gu et al. 2024 和 [Thinking Machines《On-Policy Distillation》](https://thinkingmachines.ai/blog/on-policy-distillation/)（2025-10） |

## 方法起点（放在注释里，不单独做节点）
- **GRPO 提出**：DeepSeekMath，[arXiv 2402.03300](https://arxiv.org/abs/2402.03300)，2024-02-05。R1 是「采用」它的代表模型。
- **RLVR 命名**：Tülu 3，[arXiv 2411.15124](https://arxiv.org/abs/2411.15124)，2024-11-22，摘要原文："a novel method we call Reinforcement Learning with Verifiable Rewards (RLVR)"。
- **OPD 早期工业应用**：Qwen3，[arXiv 2505.09388](https://arxiv.org/abs/2505.09388)，2025-05-14，§4.5 Strong-to-Weak Distillation，小模型做 on-policy distillation（"student…aligning its logits with those of a teacher…minimize the KL divergence"）。

## 取舍与存疑
- **ChatGPT（2022.11）没做节点**：它是产品化，后训练方法与 InstructGPT 同类（官方博客说用 RLHF、方法与 InstructGPT 相同，只是数据收集方式略有不同；该页 curl 返回 403，这里没有逐字复核）。放进来容易把「RLHF 出现、InstructGPT、ChatGPT 产品化」三件事混在一起。
- **o1 的信号来源不确定**：外界普遍推测是可验证奖励，但官方没说，所以不着色。
- **Zephyr 的信号**：用的是 AI 反馈的偏好，不是人类偏好，归入「偏好」类只是为了让图更简洁。
- **Agentic RL 代表**：选了 Kimi K2（开源、技术报告写得明确）。DeepSeek-V3.2（[arXiv 2512.02556](https://arxiv.org/abs/2512.02556)，2025-12-02，"Large-Scale Agentic Task Synthesis Pipeline"）可以作为替换项。
- **DeepSeek 的 OPD**：一手来源确认是 V4。目前没有找到 V3.x 或 R1 使用 OPD 的一手证据（R1 的蒸馏小模型是离线 SFT 蒸馏，不是 on-policy）。
- **DeepSeek-V4 的 arXiv 编号是 2606.xxxxx，但 v1 提交日期显示 2026-04-26**：编号和日期对不上。图上取页面显示的提交日期，正式使用前建议再到 DeepSeek 官方渠道核对发布时间。
- **LoRA 节点**：PEFT/LoRA 不是某个代表模型的官方配方，所以挂在 Alpaca 生态上，并注明了。
