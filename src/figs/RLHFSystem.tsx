import { motion } from 'motion/react';
import { useSlideStep } from './useSlideStep';
import { C, reveal, Defs, Arrow, Box } from './parts';
// steps: 0 rollout · 1 scoring (RM/Ref/Critic) · 2 PPO update · 3 weight sync
export default function RLHFSystem() {
  const [ref, s] = useSlideStep<SVGSVGElement>(3);
  const A = 'var(--accent)', I = 'var(--ink)', Gn = 'var(--green)';
  return (<svg ref={ref} viewBox="0 0 1410 560" width="100%" style={{ display: 'block' }}>
    <Defs />
    {/* phase bands */}
    <motion.g {...reveal(s >= 0)}>
      <text x={20} y={22} className="mono" fontSize={14} fill={C.muted} letterSpacing=".1em">① 生成 GENERATION</text>
    </motion.g>
    <motion.g {...reveal(s >= 1)}><text x={760} y={22} className="mono" fontSize={14} fill={C.muted} letterSpacing=".1em">② 打分 SCORING · 只做前向</text></motion.g>
    <motion.g {...reveal(s >= 2)}><text x={1130} y={22} className="mono" fontSize={14} fill={C.muted} letterSpacing=".1em">③ 训练 TRAINING</text></motion.g>

    <motion.g {...reveal(s >= 0)}>
      <Box x={10} y={205} w={170} h={110} eyebrow="dataset" name="Prompts" sub="x ~ D" />
      <Box x={250} y={185} w={250} h={150} eyebrow="vLLM / SGLang" name="Actor π_θ" sub="采样回答 y ~ π_θ(·|x)" tone="accent">
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <rect key={i} x={18 + i * 27} y={112} width={20} height={20} rx={3} fill={C.accent} opacity={.25 + .09 * i} />)}
      </Box>
      <Box x={565} y={205} w={160} h={110} eyebrow="rollout buffer" name="(x, y)" sub="一批轨迹" />
      <Arrow d="M182,260 L246,260" flow={s >= 0} color={I} />
      <Arrow d="M502,260 L561,260" flow={s >= 0} color={A} />
    </motion.g>

    <motion.g {...reveal(s >= 1)}>
      <Box x={790} y={40} w={270} h={120} eyebrow="frozen · 偏好训练得到" name="Reward Model" sub="r_φ(x, y) → 标量" tone="green" />
      <Box x={790} y={200} w={270} h={120} eyebrow="frozen · = SFT 初始化" name="Reference π_ref" sub="log π_ref(y|x) → KL 惩罚" />
      <Box x={790} y={360} w={270} h={120} eyebrow="trainable" name="Critic V_ψ" sub="估计每个 token 的价值" />
      <Arrow d="M727,250 C760,250 750,100 786,100" flow={s >= 1} color={Gn} />
      <Arrow d="M727,260 L786,260" flow={s >= 1} color={I} />
      <Arrow d="M727,270 C760,270 750,420 786,420" flow={s >= 1} color={I} />
    </motion.g>

    <motion.g {...reveal(s >= 2)}>
      <Box x={1150} y={170} w={250} h={180} eyebrow="Megatron / FSDP" name="Trainer · PPO" sub="GAE 优势 Â_t" tone="dark">
        <text x={18} y={132} className="mono" fontSize={15} fill="#e7e0d2">r_t = r_φ·1[t=T] − β·KL_t</text>
        <text x={18} y={156} className="mono" fontSize={15} fill="#e7e0d2">clip(ρ_t, 1±ε)·Â_t</text>
      </Box>
      <Arrow d="M1062,100 C1110,100 1100,200 1146,210" flow={s >= 2} color={Gn} label="r" lx={1112} ly={136} />
      <Arrow d="M1062,260 L1146,260" flow={s >= 2} color={I} label="KL" lx={1104} ly={250} />
      <Arrow d="M1062,420 C1110,420 1100,320 1146,310" flow={s >= 2} color={I} label="V(s)" lx={1112} ly={392} />
    </motion.g>

    <motion.g {...reveal(s >= 3)}>
      <Arrow d="M1275,352 L1275,520 L375,520 L375,340" flow={s >= 3} color={A} dash />
      <rect x={640} y={500} width={300} height={40} rx={20} fill={C.bg} stroke={C.accent} strokeWidth={1.5} />
      <text x={790} y={526} textAnchor="middle" fontSize={18} fontWeight={600} fill={C.accent2}>④ 权重同步 θ → 推理引擎</text>
      <path d="M1180,352 C1180,440 1080,470 1062,440" fill="none" stroke={C.ink} strokeWidth={1.5} strokeDasharray="4 5" markerEnd="url(#ah)" />
      <text x={1150} y={470} fontSize={15} className="mono" fill={C.muted}>更新 ψ</text>
    </motion.g>
  </svg>);
}
