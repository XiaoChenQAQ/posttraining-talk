import { motion } from 'motion/react';
import { useSlideStep } from './useSlideStep';
import { C, reveal, Defs, Arrow } from './parts';
const stages = [
  { eb: 'Stage 0', name: '预训练', en: 'Pretraining', data: '~10¹³ tokens 网页/代码/书', obj: '下一个 token 预测', out: 'Base model' },
  { eb: 'Stage 1', name: '监督微调', en: 'SFT', data: '10⁴–10⁶ 条指令-回答', obj: '模仿示范 (交叉熵)', out: 'SFT model' },
  { eb: 'Stage 2', name: '偏好对齐', en: 'RM / DPO', data: '10⁵–10⁶ 组 A≻B 比较', obj: '学习人类偏好', out: 'Reward model / 对齐模型' },
  { eb: 'Stage 3', name: '强化学习', en: 'RLHF / RLVR', data: '在线采样 + 奖励信号', obj: 'max E[r] − β·KL', out: 'Chat / Reasoning model' },
];
export default function Pipeline() {
  const [ref, s] = useSlideStep<SVGSVGElement>(3);
  const W = 300, G = 54, X0 = 10;
  return (<svg ref={ref} viewBox="0 0 1410 400" width="100%" style={{ display: 'block' }}>
    <Defs />
    {stages.map((st, i) => {
      const x = X0 + i * (W + G); const on = s >= i; const post = i > 0;
      return (<motion.g key={i} {...reveal(on)}>
        <rect x={x} y={20} width={W} height={250} rx={12} fill={post ? C.soft : C.paper} stroke={post ? C.accent : C.line} strokeWidth={1.5} />
        <text x={x + 22} y={52} className="mono" fontSize={15} fill={post ? C.accent2 : C.muted} letterSpacing=".08em">{st.eb.toUpperCase()} · {st.en}</text>
        <text x={x + 22} y={96} fontSize={34} fontWeight={700} fill={C.ink}>{st.name}</text>
        <line x1={x + 22} x2={x + W - 22} y1={116} y2={116} stroke={post ? C.accent : C.line} strokeOpacity={.4} />
        <text x={x + 22} y={148} fontSize={15} className="mono" fill={C.muted}>DATA</text>
        <text x={x + 22} y={174} fontSize={19} fill={C.ink}>{st.data}</text>
        <text x={x + 22} y={210} fontSize={15} className="mono" fill={C.muted}>OBJECTIVE</text>
        <text x={x + 22} y={236} fontSize={19} fill={C.ink}>{st.obj}</text>
        <rect x={x + 22} y={292} width={W - 44} height={40} rx={20} fill={C.bg} stroke={post ? C.accent : C.ink} strokeWidth={1.5} />
        <text x={x + W / 2} y={318} textAnchor="middle" fontSize={17} fontWeight={600} fill={C.ink}>→ {st.out}</text>
        {i < 3 && <Arrow on={s >= i + 1} d={`M${x + W + 6},145 L${x + W + G - 8},145`} color="var(--accent)" />}
      </motion.g>);
    })}
    <motion.g {...reveal(s >= 3, .3)}>
      <path d={`M${X0 + W + G},356 v14 H${X0 + 4 * W + 3 * G} v-14`} fill="none" stroke={C.accent} strokeWidth={2} />
      <text x={(X0 + W + G + X0 + 4 * W + 3 * G) / 2} y={394} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.accent2}>后训练 Post-training：算力占比小，却决定模型“怎么用”</text>
    </motion.g>
    <motion.text {...reveal(s >= 0)} x={X0 + W / 2} y={384} textAnchor="middle" fontSize={17} fill={C.muted}>算力的绝大部分在这里</motion.text>
  </svg>);
}
