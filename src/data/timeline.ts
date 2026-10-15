// 开场时间轴数据 —— 全部为占位内容，替换为真实模型时只改这里。
export type Signal = 'demo' | 'pref' | 'verify' | 'env' | 'teacher';
export const SIGNALS: Record<Signal, { label: string; desc: string; color: string; soft: string }> = {
  demo:    { label: '示范',     desc: '人写的标准答案',     color: '#5b7fa6', soft: '#e3eaf2' },
  pref:    { label: '人类偏好', desc: '人比较哪个更好',     color: '#c0612f', soft: '#f5e2d5' },
  verify:  { label: '可验证结果', desc: '答案对不对能自动判', color: '#3f8a5a', soft: '#dcebdf' },
  env:     { label: '环境反馈', desc: '在工具/环境里做成没有', color: '#8a6bb0', soft: '#e9e2f2' },
  teacher: { label: '教师模型', desc: '更强模型给逐 token 指导', color: '#b08a2e', soft: '#f1e8cf' },
};
export type Tech = { name: string; signal?: Signal };   // 无 signal = 未公开/不归类（灰色）
export type TLNode = { id: string; model: string; date: string; problem: string; strategy: string; techs: Tech[]; note?: string };
export const PLACEHOLDER = false;
// 来源与引文见 docs/timeline-sources.md。标注的是该模型「采用」的方法，不是发明。
export const NODES: TLNode[] = [
  { id: 'instructgpt', model: 'InstructGPT', date: '2022.03', problem: '不符合人的意图', strategy: 'SFT + RLHF',
    techs: [{ name: 'SFT', signal: 'demo' }, { name: '奖励模型', signal: 'pref' }, { name: 'PPO', signal: 'pref' }],
    note: 'RLHF 本身更早（Christiano 2017 等）；这里是它用于指令模型的代表' },
  { id: 'zephyr', model: 'Zephyr-7B', date: '2023.10', problem: 'RLHF 太贵太重', strategy: '直接偏好优化',
    techs: [{ name: 'DPO', signal: 'pref' }, { name: 'AI 偏好数据', signal: 'pref' }],
    note: '偏好标签由 GPT-4 打分（AI 反馈），非人工' },
  { id: 'o1', model: 'OpenAI o1', date: '2024.09', problem: '先想再答', strategy: '大规模 RL 推理',
    techs: [{ name: '长思维链' }, { name: '细节未公开' }], note: '官方仅称用大规模 RL 训练思维链，奖励与算法未公开' },
  { id: 'r1', model: 'DeepSeek-R1', date: '2025.01', problem: '公开复现推理', strategy: '可验证奖励 RL',
    techs: [{ name: 'GRPO', signal: 'verify' }, { name: '规则奖励', signal: 'verify' }],
    note: 'GRPO 提出于 DeepSeekMath (2024.02)；RLVR 一词由 Tülu 3 (2024.11) 命名' },
  { id: 'm1', model: 'MiniMax-M1', date: '2025.06', problem: '长推理 RL 更省', strategy: '高效大规模 RL',
    techs: [{ name: 'CISPO', signal: 'verify' }, { name: '沙盒 SWE 环境', signal: 'env' }],
    note: 'CISPO 由 M1 报告提出：裁剪重要性采样权重而非 token 更新' },
  { id: 'glm45', model: 'GLM-4.5', date: '2025.08', problem: '推理智能体编码兼顾', strategy: '专家迭代 + 统一',
    techs: [{ name: '专家 RL', signal: 'env' }, { name: '自蒸馏合并', signal: 'teacher' }, { name: 'slime 基础设施' }],
    note: '先训推理/智能体/通用三类专家，再用自蒸馏（SFT 形式）合为一体；RL 基础设施 slime。灰色 = 基础设施' },
  { id: 'v4', model: 'DeepSeek-V4', date: '2026.04', problem: '多个专家合为一', strategy: '多教师在线蒸馏',
    techs: [{ name: '专家 GRPO', signal: 'verify' }, { name: 'OPD', signal: 'teacher' }],
    note: 'OPD 取代 V3.2 的混合 RL 阶段；student 优化对多教师的 reverse KL' },
  { id: 'k3', model: 'Kimi K3', date: '2026.07', problem: '百万 token 长程执行', strategy: '智能体 RL + MOPD',
    techs: [{ name: '智能体环境 RL', signal: 'env' }, { name: '生成式 RM', signal: 'pref' }, { name: 'MOPD', signal: 'teacher' }],
    note: '可验证环境 + Agentic 生成式奖励模型（按 rubric 打分）训领域专家，再用多教师 OPD 合并' },
];
