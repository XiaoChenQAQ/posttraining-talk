import { useEffect, useRef, useState } from 'react';
import { NODES, SIGNALS, PLACEHOLDER, type Signal, type TLNode } from '../data/timeline';

type Props = { nodes?: TLNode[]; variant?: 'A' | 'B'; placeholder?: boolean };
const order = Object.keys(SIGNALS) as Signal[];

export default function Timeline({ nodes = NODES, variant = 'A', placeholder = PLACEHOLDER }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [sig, setSig] = useState<Signal | null>(null);
  const [key, setKey] = useState(0);
  useEffect(() => {
    const el = ref.current!; const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el); return () => io.disconnect();
  }, []);
  const active = hover ?? pinned;
  const used = order.filter(s => nodes.some(n => n.techs.some(t => t.signal === s)));
  const n = nodes.length;
  // B: 每个节点主信号（出现最多者）用于轴下色带
  const main = (nd: TLNode) => { const c: Record<string, number> = {}; nd.techs.forEach(t => { if (t.signal) c[t.signal] = (c[t.signal] || 0) + 1; }); const e = Object.entries(c).sort((a, b) => b[1] - a[1])[0]; return e ? e[0] as Signal : null; };
  const stops = nodes.map((nd, i) => `${(main(nd) ? SIGNALS[main(nd)!].color : '#8a8273')} ${((i + .5) / n * 100).toFixed(1)}%`).join(',');

  return (
    <div ref={ref} key={key} className={`tl tl-${variant} ${shown ? 'on' : ''} ${active || sig ? 'focus' : ''}`} style={{ ['--n' as any]: n }}>
      {placeholder && <div className="tl-ph" title="模型名、日期与技术对应均为占位">占位 · 未核实</div>}
      <div className="tl-grid">
        <div className="tl-axis" />
        {variant === 'B' && <div className="tl-band" style={{ background: `linear-gradient(90deg, ${stops})` }} />}
        {nodes.map((nd, i) => {
          const isA = active === nd.id;
          const hit = sig ? nd.techs.some(t => t.signal === sig) : false;
          const lit = active ? isA : sig ? hit : true;
          return (
            <div key={nd.id} title={nd.note} className={`tl-col ${lit ? 'lit' : 'dim'} ${isA ? 'act' : ''}`} style={{ ['--i' as any]: i }}
              onMouseEnter={() => setHover(nd.id)} onMouseLeave={() => setHover(null)}
              onClick={() => setPinned(p => p === nd.id ? null : nd.id)}>
              <div className="tl-top">
                <div className="tl-date">{nd.date}{nd.closed && <span className="tl-cl" title="闭源厂商公开的方法">闭源</span>}</div>
                <div className={`tl-model ${placeholder ? 'ph' : ''}`}>{nd.model}</div>
                <div className="tl-prob">{nd.problem}</div>
              </div>
              <div className="tl-dot"><span style={variant === 'B' && main(nd) ? { borderColor: SIGNALS[main(nd)!].color } : undefined} /></div>
              <div className="tl-bot">
                <div className="tl-strat">{nd.strategy}{nd.note && <sup className="tl-nm" title={nd.note}>*</sup>}</div>
                <div className="tl-tags">
                  {nd.techs.map(t => {
                    const s = t.signal ? SIGNALS[t.signal] : { color: '#8a8273', soft: '#ece7dd' }; const off = sig && sig !== t.signal;
                    return <span key={t.name} className={`tl-tag ${off ? 'off' : ''} ${t.signal ? '' : 'na'}`} style={{ ['--c' as any]: s.color, ['--s' as any]: s.soft }}>{t.name}</span>;
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="tl-foot">
        <div className="tl-legend">
          <span className="tl-lh">监督信号来源</span>
          {used.map(s => (
            <button key={s} className={`tl-sig ${sig === s ? 'sel' : ''} ${sig && sig !== s ? 'off' : ''}`} style={{ ['--c' as any]: SIGNALS[s].color }}
              onMouseEnter={() => setSig(s)} onMouseLeave={() => setSig(null)} onFocus={() => setSig(s)} onBlur={() => setSig(null)} title={SIGNALS[s].desc}>
              <i />{SIGNALS[s].label}
            </button>
          ))}
        </div>
        <div className="tl-note"><span>标注的是模型<b>采用</b>的方法，不代表首创；新方法也不意味着旧方法被淘汰。</span>
          <button className="tl-replay" onClick={() => { setShown(false); setKey(k => k + 1); requestAnimationFrame(() => requestAnimationFrame(() => setShown(true))); }}>↻ 重播</button>
        </div>
      </div>
    </div>
  );
}
