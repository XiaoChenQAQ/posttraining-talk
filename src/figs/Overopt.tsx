import { motion } from 'motion/react';
import * as d3 from 'd3';
import { useSlideStep } from './useSlideStep';
import { C, reveal } from './parts';
// Functional form from Gao et al. 2023 (RL): R(d) = d(α − β log d), d = sqrt(KL). Illustrative constants.
export default function Overopt() {
  const [ref, s] = useSlideStep<SVGSVGElement>(1, 1200);
  const W = 640, H = 380, M = { l: 50, r: 20, t: 20, b: 50 };
  const x = d3.scaleLinear().domain([0, 10]).range([M.l, W - M.r]);
  const y = d3.scaleLinear().domain([0, 6]).range([H - M.b, M.t]);
  const ds = d3.range(0.01, 10.01, 0.1);
  const proxy = d3.line<number>().x(d => x(d)).y(d => y(0.62 * d))(ds)!;
  const gold = d3.line<number>().x(d => x(d)).y(d => y(Math.max(0, d * (1.6 - 0.62 * Math.log(d + 1)))))(ds)!;
  const peak = ds.reduce((a, d) => (d * (1.6 - 0.62 * Math.log(d + 1)) > a[1] ? [d, d * (1.6 - 0.62 * Math.log(d + 1))] : a), [0, 0]);
  return (<svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
    <line x1={M.l} x2={W - M.r} y1={y(0)} y2={y(0)} stroke={C.ink} /><line x1={M.l} x2={M.l} y1={M.t} y2={y(0)} stroke={C.ink} />
    <text x={(M.l + W) / 2} y={H - 12} textAnchor="middle" fontSize={16} fill={C.muted}>优化强度 √KL(π ‖ π_ref) →</text>
    <text x={18} y={(M.t + H - M.b) / 2} fontSize={16} fill={C.muted} transform={`rotate(-90 18 ${(M.t + H - M.b) / 2})`} textAnchor="middle">奖励</text>
    <path d={proxy} fill="none" stroke={C.green} strokeWidth={3} />
    <text x={x(8.6)} y={y(0.62 * 8.6) - 12} fontSize={17} fontWeight={600} fill={C.green} textAnchor="end">代理 RM 分数（持续上涨）</text>
    <motion.g {...reveal(s >= 1)}>
      <path d={gold} fill="none" stroke={C.accent} strokeWidth={3} />
      <line x1={x(peak[0])} x2={x(peak[0])} y1={y(peak[1])} y2={y(0)} stroke={C.accent} strokeDasharray="4 5" />
      <text x={x(peak[0]) + 8} y={y(peak[1]) - 10} fontSize={17} fontWeight={600} fill={C.accent2}>真实质量（先升后降）</text>
      <text x={x(8.2)} y={y(0.6)} fontSize={15} fill={C.muted} textAnchor="middle">过度优化区</text>
    </motion.g>
  </svg>);
}
