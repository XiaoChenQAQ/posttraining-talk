import { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { C } from './parts';
const INIT = [
  { y: '拒绝回答', p: 0.10, r: -1 },
  { y: '简短正确', p: 0.30, r: 1 },
  { y: '详细正确', p: 0.12, r: 2 },
  { y: '冗长啰嗦', p: 0.20, r: 0.5 },
  { y: '讨好附和', p: 0.18, r: 0 },
  { y: '编造事实', p: 0.10, r: -2 },
];
export default function KLBeta() {
  const [items, setItems] = useState(INIT);
  const [lb, setLb] = useState(0); // log10 beta
  const beta = Math.pow(10, lb);
  const { pi, kl, er, erRef } = useMemo(() => {
    const m = d3.max(items, d => d.r / beta)!;
    const w = items.map(d => d.p * Math.exp(d.r / beta - m));
    const Z = d3.sum(w); const pi = w.map(v => v / Z);
    const kl = d3.sum(pi, (q, i) => (q > 0 ? q * Math.log(q / items[i].p) : 0));
    return { pi, kl, er: d3.sum(pi, (q, i) => q * items[i].r), erRef: d3.sum(items, d => d.p * d.r) };
  }, [items, beta]);
  const W = 760, H = 300, M = { l: 60, r: 10, t: 20, b: 50 };
  const x = d3.scaleBand().domain(items.map(d => d.y)).range([M.l, W - M.r]).padding(0.25);
  const y = d3.scaleLinear().domain([0, 1]).range([H - M.b, M.t]);
  const bw = x.bandwidth() / 2;
  const bump = (i: number, dv: number) => setItems(it => it.map((d, j) => j === i ? { ...d, r: Math.max(-3, Math.min(3, Math.round((d.r + dv) * 2) / 2)) } : d));
  return (<div className="klgrid">
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {y.ticks(5).map(t => <g key={t}><line x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} stroke={C.line} strokeDasharray={t ? '3 5' : undefined} />
          <text x={M.l - 10} y={y(t) + 5} textAnchor="end" fontSize={15} className="mono" fill={C.muted}>{t.toFixed(1)}</text></g>)}
        {items.map((d, i) => { const x0 = x(d.y)!; return (<g key={d.y} style={{ cursor: 'pointer' }} onClick={e => bump(i, e.shiftKey ? -0.5 : 0.5)}>
          <rect x={x0 - 6} y={M.t} width={x.bandwidth() + 12} height={H - M.b - M.t} fill="transparent" />
          <rect x={x0} y={y(d.p)} width={bw - 3} height={y(0) - y(d.p)} fill={C.paper2} stroke={C.line} />
          <rect x={x0 + bw} y={y(pi[i])} width={bw - 3} height={y(0) - y(pi[i])} fill={C.accent} style={{ transition: 'y .25s, height .25s' }} />
          <text x={x0 + bw * 1.5} y={y(pi[i]) - 8} textAnchor="middle" fontSize={15} className="mono" fill={C.accent2}>{(pi[i] * 100).toFixed(0)}%</text>
          <text x={x0 + x.bandwidth() / 2} y={H - M.b + 30} textAnchor="middle" fontSize={17} fill={C.ink}>{d.y}</text>
        </g>); })}
      </svg>
      <div style={{ display: 'grid', gridTemplateColumns: `${M.l}px repeat(6, minmax(0,1fr))`, width: '100%', fontSize: 15 }} className="ctl klchips">
        <div style={{ color: 'var(--muted)', fontSize: 15, alignSelf: 'center' }}>r(y)</div>
        {items.map((d, i) => <div key={d.y} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <button className="btn" style={{ padding: '0 7px' }} onClick={() => bump(i, -0.5)}>−</button>
          <b style={{ minWidth: 34, textAlign: 'center', color: d.r > 0 ? 'var(--green)' : d.r < 0 ? 'var(--accent2)' : 'var(--ink)' }}>{d.r > 0 ? '+' : ''}{d.r.toFixed(1)}</b>
          <button className="btn" style={{ padding: '0 7px' }} onClick={() => bump(i, 0.5)}>+</button>
        </div>)}
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 17 }}>
      <div className="ctl">
        <div style={{ fontSize: 15, color: 'var(--muted)', letterSpacing: '.08em' }}>KL 系数 β</div>
        <div style={{ fontSize: 34, fontWeight: 600, color: 'var(--accent)' }}>{beta < 1 ? beta.toFixed(2) : beta.toFixed(1)}</div>
        <input type="range" min={-1.3} max={1} step={0.01} value={lb} onChange={e => setLb(+e.target.value)} style={{ width: '100%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)' }}><span>0.05 贪婪追奖励</span><span>10 贴近 π_ref</span></div>
      </div>
      <Metric k="E_π*[r]" v={er.toFixed(2)} sub={`π_ref 下为 ${erRef.toFixed(2)}`} color="var(--green)" />
      <Metric k="KL(π* ‖ π_ref)" v={kl.toFixed(2)} sub="nats · 偏离参考模型的“代价”" color="var(--accent2)" />
      <div style={{ display: 'flex', gap: 18, fontSize: 16 }} className="ctl">
        <span><i style={sw(C.paper2)} /> π_ref</span><span><i style={sw(C.accent)} /> π*</span>
      </div>
      <div style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.45 }}>点击柱子 +0.5 奖励（Shift 点击 −0.5），或用下方按钮调整。</div>
    </div>
  </div>);
}
const sw = (c: string) => ({ display: 'inline-block', width: 14, height: 14, background: c, border: '1px solid var(--line)', verticalAlign: '-2px', marginRight: 4 });
function Metric({ k, v, sub, color }: { k: string; v: string; sub: string; color: string }) {
  return <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
    <div className="mono" style={{ fontSize: 15, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{k}</div>
    <div style={{ fontSize: 28, fontWeight: 600, fontFamily: 'var(--mono)', color }}>{v}</div>
    <div style={{ fontSize: 15, color: 'var(--muted)' }}>{sub}</div></div>;
}
