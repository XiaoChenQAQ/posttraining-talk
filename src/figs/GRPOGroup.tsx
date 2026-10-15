import { useState } from 'react';
import * as d3 from 'd3';
import { C } from './parts';
export default function GRPOGroup() {
  const [ok, setOk] = useState([true, false, false, true, false, false, false, true]);
  const [useStd, setUseStd] = useState(true);
  const r = ok.map(v => (v ? 1 : 0));
  const mean = d3.mean(r)!; const std = Math.sqrt(d3.mean(r, v => (v - mean) ** 2)!);
  const adv = r.map(v => (useStd ? (v - mean) / (std + 1e-4) : v - mean));
  const W = 1400, H = 180, mid = 135;
  const amax = useStd ? 3 : 1;
  const y = d3.scaleLinear().domain([-amax, amax]).range([H - 10, 20]);
  const cw = 150, gap = (W - 8 * cw) / 7;
  return (<div>
    <div style={{ display: 'flex', gap: 28, alignItems: 'center', marginBottom: 10 }} className="ctl">
      <span style={{ fontSize: 18 }}>同一个 prompt，采样 G = 8 个回答 → <span style={{ color: 'var(--muted)' }}>点击卡片切换 对/错</span></span>
      <span style={{ marginLeft: 'auto', fontSize: 18 }}>均值 <b style={{ color: 'var(--accent)' }}>{mean.toFixed(3)}</b>　标准差 <b style={{ color: 'var(--accent)' }}>{std.toFixed(3)}</b></span>
      <button className="btn" onClick={() => setUseStd(u => !u)}>{useStd ? '÷ std：开（GRPO）' : '÷ std：关（Dr. GRPO）'}</button>
    </div>
    <svg viewBox={`0 0 ${W} ${H + 84}`} width="100%" style={{ display: 'block' }}>
      {ok.map((v, i) => { const x = i * (cw + gap); return (<g key={i} style={{ cursor: 'pointer' }} onClick={() => setOk(o => o.map((b, j) => j === i ? !b : b))}>
        <rect x={x} y={0} width={cw} height={72} rx={10} fill={v ? C.gsoft : C.paper} stroke={v ? C.green : C.line} strokeWidth={1.5} />
        <text x={x + 14} y={26} className="mono" fontSize={14} fill={C.muted}>o{i + 1}</text>
        <text x={x + cw - 14} y={30} textAnchor="end" fontSize={24} fontWeight={700} fill={v ? C.green : C.accent2}>{v ? '✓' : '✗'}</text>
        <text x={x + 14} y={58} fontSize={18} className="mono" fill={C.ink}>r = {v ? 1 : 0}</text>
      </g>); })}
      <g transform="translate(0,84)">
        <line x1={0} x2={W} y1={y(0)} y2={y(0)} stroke={C.ink} />
        
        {adv.map((a, i) => { const x = i * (cw + gap) + 35; const top = Math.min(y(0), y(a)); const h = Math.abs(y(a) - y(0));
          return (<g key={i}>
            <rect x={x} y={top} width={cw - 70} height={Math.max(h, 1.5)} fill={a > 0 ? C.green : a < 0 ? C.accent : C.line} style={{ transition: 'all .3s' }} />
            <text x={x + (cw - 70) / 2} y={a >= 0 ? top - 8 : top + h + 22} textAnchor="middle" fontSize={18} fontWeight={600} className="mono" fill={a > 0 ? C.green : a < 0 ? C.accent2 : C.muted}>{a > 0 ? '+' : ''}{a.toFixed(2)}</text>
          </g>); })}
        {std === 0 && <text x={W / 2} y={y(0) + 50} textAnchor="middle" fontSize={22} fontWeight={600} fill={C.accent2}>组内全对或全错 → 所有优势为 0，这个 prompt 不提供梯度信号</text>}
      </g>
    </svg>
  </div>);
}
