// 开场时间轴数据 —— 全部为占位内容，替换为真实模型时只改这里。
export type Signal = 'demo' | 'pref' | 'verify' | 'env' | 'teacher';
export const SIGNALS: Record<Signal, { label: string; desc: string; color: string; soft: string }> = {
  demo:    { label: '示范',     desc: '人写的标准答案',     color: '#5b7fa6', soft: '#e3eaf2' },
  pref:    { label: '人类偏好', desc: '人比较哪个更好',     color: '#c0612f', soft: '#f5e2d5' },
  verify:  { label: '可验证结果', desc: '答案对不对能自动判', color: '#3f8a5a', soft: '#dcebdf' },
  env:     { label: '环境反馈', desc: '在工具/环境里做成没有', color: '#8a6bb0', soft: '#e9e2f2' },
  teacher: { label: '教师模型', desc: '更强模型给逐 token 指导', color: '#b08a2e', soft: '#f1e8cf' },
};
export type Tech = { name: string; signal: Signal };
export type TLNode = { id: string; model: string; date: string; problem: string; strategy: string; techs: Tech[] };
export const PLACEHOLDER = true;
export const NODES: TLNode[] = [
  { id: 'a', model: '模型 A', date: '20XX', problem: '让模型听懂指令', strategy: '指令微调',
    techs: [{ name: 'SFT', signal: 'demo' }, { name: '指令数据', signal: 'demo' }] },
  { id: 'b', model: '模型 B', date: '20XX', problem: '回答要有用且无害', strategy: '人类反馈强化学习',
    techs: [{ name: 'SFT', signal: 'demo' }, { name: '奖励模型', signal: 'pref' }, { name: 'RLHF / PPO', signal: 'pref' }] },
  { id: 'c', model: '模型 C', date: '20XX', problem: '对齐流程太重太贵', strategy: '直接偏好优化',
    techs: [{ name: 'DPO', signal: 'pref' }, { name: '偏好对', signal: 'pref' }] },
  { id: 'd', model: '模型 D', date: '20XX', problem: '让模型学会推理', strategy: '可验证奖励 RL',
    techs: [{ name: 'GRPO', signal: 'verify' }, { name: 'RLVR', signal: 'verify' }, { name: '长思维链', signal: 'verify' }] },
  { id: 'e', model: '模型 E', date: '20XX', problem: '会用工具、能做完任务', strategy: '环境中强化学习',
    techs: [{ name: 'Env RL', signal: 'env' }, { name: '多轮交互', signal: 'env' }] },
  { id: 'f', model: '模型 F', date: '20XX', problem: '小模型也要学得好', strategy: '在线策略蒸馏',
    techs: [{ name: 'OPD', signal: 'teacher' }, { name: 'RL', signal: 'verify' }] },
];
