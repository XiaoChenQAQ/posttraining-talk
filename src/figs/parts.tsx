import { motion } from 'motion/react';
import type { ReactNode } from 'react';
export const C = { bg: 'var(--bg)', paper: 'var(--paper)', paper2: 'var(--paper2)', line: 'var(--line)', ink: 'var(--ink)', muted: 'var(--muted)', accent: 'var(--accent)', accent2: 'var(--accent2)', soft: 'var(--accent-soft)', green: 'var(--green)', gsoft: 'var(--green-soft)' };
export const reveal = (on: boolean, delay = 0) => ({ initial: false as const, animate: { opacity: on ? 1 : 0, y: on ? 0 : 12 }, transition: { duration: 0.5, delay: on ? delay : 0 } });
export function Box({ x, y, w, h, eyebrow, name, sub, tone = 'plain', children }: { x: number; y: number; w: number; h: number; eyebrow?: string; name: string; sub?: string; tone?: 'plain' | 'accent' | 'green' | 'dark'; children?: ReactNode }) {
  const fill = tone === 'accent' ? C.soft : tone === 'green' ? C.gsoft : tone === 'dark' ? C.ink : C.paper;
  const stroke = tone === 'accent' ? C.accent : tone === 'green' ? C.green : tone === 'dark' ? C.ink : C.line;
  const fg = tone === 'dark' ? '#F9F5ED' : C.ink;
  return (<g transform={`translate(${x},${y})`}>
    <rect width={w} height={h} rx={10} fill={fill} stroke={stroke} strokeWidth={1.5} />
    {eyebrow && <text x={18} y={30} className="mono" fontSize={14} letterSpacing=".06em" fill={tone === 'dark' ? '#cfc6b4' : C.muted}>{eyebrow.toUpperCase()}</text>}
    <text x={18} y={eyebrow ? 64 : 42} fontSize={26} fontWeight={700} fill={fg}>{name}</text>
    {sub && <text x={18} y={(eyebrow ? 64 : 42) + 30} fontSize={17} fill={tone === 'dark' ? '#e7e0d2' : C.muted}>{sub}</text>}
    {children}
  </g>);
}
export function Arrow({ d, on = true, color = 'var(--ink)', flow = false, label, lx, ly, dash = false, delay = 0 }: { d: string; on?: boolean; color?: string; flow?: boolean; label?: string; lx?: number; ly?: number; dash?: boolean; delay?: number }) {
  return (<motion.g {...reveal(on, delay)}>
    <path d={d} fill="none" stroke={color} strokeWidth={2} strokeDasharray={dash ? '6 6' : undefined} markerEnd={mk(color)} />
    {flow && on && [0, 1, 2].map(i => <circle key={i} r={4.5} fill={color}><animateMotion dur="2.4s" begin={`-${i * 0.8}s`} repeatCount="indefinite" path={d} /></circle>)}
    {label && <text x={lx} y={ly} fontSize={16} className="mono" fill={C.muted} textAnchor="middle" paintOrder="stroke" stroke="var(--bg)" strokeWidth={6}>{label}</text>}
  </motion.g>);
}
const MK: Record<string, string> = { 'var(--ink)': 'ah', 'var(--accent)': 'ah-a', 'var(--green)': 'ah-g' };
export const mk = (c: string) => `url(#${MK[c] ?? 'ah'})`;
export const Defs = () => null; // markers live in Deck.astro (global, always rendered)
