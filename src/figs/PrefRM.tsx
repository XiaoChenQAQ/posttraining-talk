import { motion } from 'motion/react';
import { useSlideStep } from './useSlideStep';
import { C, reveal, Defs, Arrow } from './parts';
export default function PrefRM() {
  const [ref, s] = useSlideStep<SVGSVGElement>();
  return (<svg ref={ref} viewBox="0 0 680 430" width="100%" style={{ display: 'block' }}>
    <Defs />
    <rect x={10} y={10} width={660} height={56} rx={8} fill={C.paper2} />
    <text x={28} y={45} fontSize={19} fill={C.ink}><tspan className="mono" fill={C.muted} fontSize={14}>PROMPT x  </tspan>帮我写一封婉拒面试的邮件</text>
    {[0, 1].map(i => { const win = i === 0; const X = 10 + i * 340; return (<g key={i}>
      <motion.g {...reveal(s >= 1 || !win || true)}>
        <rect x={X} y={90} width={320} height={120} rx={10} fill={s >= 1 && win ? C.gsoft : C.paper} stroke={s >= 1 && win ? C.green : C.line} strokeWidth={1.5} style={{ transition: 'all .4s' }} />
        <text x={X + 18} y={120} className="mono" fontSize={14} fill={C.muted}>{win ? 'RESPONSE A' : 'RESPONSE B'}</text>
        <text x={X + 18} y={152} fontSize={17} fill={C.ink}>{win ? '感谢贵司的认可，经慎重考虑，' : '不去了，谢谢。'}</text>
        <text x={X + 18} y={178} fontSize={17} fill={C.ink}>{win ? '我决定……期待未来有机会合作。' : ''}</text>
        {s >= 1 && <text x={X + 300} y={124} textAnchor="end" fontSize={22} fontWeight={700} fill={win ? C.green : C.accent2}>{win ? 'y_w ✓' : 'y_l'}</text>}
      </motion.g></g>); })}
    <motion.g {...reveal(s >= 1)}><text x={340} y={236} textAnchor="middle" fontSize={17} fill={C.muted}>标注者只给相对判断：A ≻ B（比打绝对分更一致）</text></motion.g>
    <motion.g {...reveal(s >= 2)}>
      <Arrow d="M170,252 L250,284" color="var(--ink)" />
      <Arrow d="M510,252 L430,284" color="var(--ink)" />
      <rect x={230} y={286} width={220} height={52} rx={10} fill={C.ink} />
      <text x={340} y={319} textAnchor="middle" fontSize={19} fontWeight={700} fill="#F9F5ED">Reward Model r_φ</text>
      <text x={110} y={320} textAnchor="middle" fontSize={20} className="mono" fill={C.green}>r_A = +1.3</text>
      <text x={570} y={320} textAnchor="middle" fontSize={20} className="mono" fill={C.accent2}>r_B = −0.4</text>
      <text x={340} y={385} textAnchor="middle" fontSize={20} className="mono" fill={C.ink}>P(A≻B) = σ(1.3 − (−0.4)) = 0.85</text>
      <text x={340} y={414} textAnchor="middle" fontSize={15} fill={C.muted}>Bradley–Terry：只有分数差有意义，r 的平移不影响</text>
    </motion.g>
  </svg>);
}
