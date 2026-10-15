import { motion } from 'motion/react';
import { useSlideStep } from './useSlideStep';
import { C, reveal } from './parts';
const prompt = ['user', '什么', '是', 'KL', '散度', '？', 'asst'];
const resp = ['KL', '散度', '衡量', '两个', '分布', '的', '差异', '…', 'eos'];
export default function SFTMask() {
  const [ref, s] = useSlideStep<SVGSVGElement>(2);
  const toks = [...prompt.map(t => ({ t, p: true })), ...resp.map(t => ({ t, p: false }))];
  let x = 0; const pos = toks.map(k => { const w = Math.max(44, k.t.length * (/^[a-z]+$/i.test(k.t) ? 12 : 22) + 20); const o = { ...k, x, w }; x += w + 6; return o; });
  const sc = 640 / x;
  return (<svg ref={ref} viewBox="0 0 660 300" width="100%" style={{ display: 'block' }}>
    <g transform={`translate(10,40) scale(${sc},1)`}>
      {pos.map((k, i) => <g key={i}>
        <rect x={k.x} y={0} width={k.w} height={46} rx={6} fill={k.p ? C.paper2 : C.soft} stroke={k.p ? C.line : C.accent} />
      </g>)}
    </g>
    {pos.map((k, i) => <text key={i} x={10 + (k.x + k.w / 2) * sc} y={70} textAnchor="middle" fontSize={14} className={['user','asst','eos'].includes(k.t) ? 'mono' : ''} fill={k.p ? C.muted : C.ink}>{k.t}</text>)}
    <text x={10} y={26} className="mono" fontSize={13} fill={C.muted}>PROMPT（条件）</text>
    <text x={10 + pos[prompt.length].x * sc} y={26} className="mono" fontSize={13} fill={C.accent2}>RESPONSE（学习目标）</text>
    <motion.g {...reveal(s >= 1)}>
      {pos.map((k, i) => <text key={i} x={10 + (k.x + k.w / 2) * sc} y={118} textAnchor="middle" fontSize={15} className="mono" fill={k.p ? C.muted : C.accent}>{k.p ? '0' : '1'}</text>)}
      <text x={10} y={146} fontSize={14} className="mono" fill={C.muted}>loss mask：prompt 部分不计 loss</text>
    </motion.g>
    <motion.g {...reveal(s >= 2)}>
      <rect x={10} y={180} width={640} height={100} rx={10} fill={C.paper} stroke={C.line} />
      <text x={30} y={214} fontSize={17} fill={C.ink}>每个 response token 上做 teacher forcing：</text>
      <text x={30} y={250} fontSize={17} className="mono" fill={C.accent2}>loss = −mean log π_θ(y_t | x, y_&lt;t)</text>
    </motion.g>
  </svg>);
}
