import { useState } from 'react';
import { PageHeader, StatCard } from '../../../../components/common/index.jsx';
import { FIELD_TYPES } from '../projectTemplates.js';

export const ProjectPreview = ({ project: p, onBack, onEdit }) => {
  const [activeChId, setActCh] = useState(p.chapters[0]?.id || null);
  const activeCh    = p.chapters.find(c => c.id === activeChId);
  const totalItems  = p.chapters.reduce((s,c) => s + c.items.length, 0);
  const totalFields = p.chapters.reduce((s,c) => s + c.items.reduce((ss,i) => ss + i.measurements.length, 0), 0);

  return (
    <div className="fade-up">
      <PageHeader title={p.name} subtitle={p.code}
        actions={<div style={{ display:'flex', gap:8 }}><button className="btn btn-outline" onClick={onBack}>← Back</button><button className="btn btn-primary" onClick={onEdit}>✏️ Edit</button></div>}
      />
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <StatCard icon="📚" number={p.chapters.length} label="Chapters"     color="var(--blue)"   />
        <StatCard icon="📋" number={totalItems}         label="Work Items"  color="var(--accent)" />
        <StatCard icon="📐" number={totalFields}        label="Total Fields"color="var(--green)"  />
        <StatCard icon="📅" number={p.createdAt}        label="Created"     color="var(--text2)"  />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:14 }}>
        <div className="card" style={{ padding:14 }}>
          <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, marginBottom:12 }}>Chapters</div>
          {p.chapters.map(ch => (
            <div key={ch.id} onClick={() => setActCh(ch.id)}
              style={{ padding:'9px 12px', borderRadius:8, marginBottom:4, cursor:'pointer', background: activeChId===ch.id ? ch.color+'22' : 'transparent', borderLeft:`3px solid ${ch.color}` }}>
              <div style={{ fontSize:12, fontWeight:600 }}>{ch.name}</div>
              <div style={{ fontSize:10, color:'var(--text3)' }}>{ch.items.length} items</div>
            </div>
          ))}
        </div>
        <div>
          {activeCh?.items.map(item => (
            <div key={item.id} className="card" style={{ marginBottom:12, borderLeft:`3px solid ${activeCh.color}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                <code style={{ fontSize:11, color:'var(--accent)', fontWeight:700 }}>{item.code}</code>
              </div>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:14, marginBottom: item.description ? 4 : 0 }}>{item.label}</div>
              {item.description && <div style={{ fontSize:12, color:'var(--text2)', marginBottom:12 }}>{item.description}</div>}
              {item.measurements.length > 0 && (
                <>
                  <div style={{ fontSize:10, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:8 }}>Measurement Fields</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px,1fr))', gap:8 }}>
                    {item.measurements.map(m => {
                      const ft = FIELD_TYPES.find(f => f.value === m.type);
                      return (
                        <div key={m.id} style={{ background:'rgba(255,255,255,.03)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px' }}>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                            <span style={{ fontSize:12, fontWeight:600 }}>{m.label}</span>
                            <span style={{ fontSize:11 }}>{ft?.icon}</span>
                          </div>
                          <div style={{ fontSize:10, color:'var(--text3)', display:'flex', gap:6 }}>
                            {m.unit && <span>{m.unit}</span>}
                            <span style={{ color:'var(--accent)', fontWeight:600 }}>{ft?.label}</span>
                            {m.fixedNumber !== undefined && <span>fixed: {m.fixedNumber}</span>}
                            {m.fixedText !== undefined && <span>fixed: {m.fixedText}</span>}
                            {m.billingRate !== undefined && <span>rate: {m.billingRate}</span>}
                          </div>
                          {(m.type==='select'||m.type==='multiselect') && m.options?.length > 0 && (
                            <div style={{ marginTop:5, display:'flex', flexWrap:'wrap', gap:3 }}>
                              {m.options.map(o => <span key={o} style={{ fontSize:10, padding:'1px 6px', borderRadius:10, background:'rgba(255,255,255,.06)', color:'var(--text2)' }}>{o}</span>)}
                            </div>
                          )}
                          {m.type==='table' && m.columns?.length > 0 && (
                            <div style={{ marginTop:5, fontSize:10, color:'var(--text3)' }}>
                              {m.columns.length} columns: {m.columns.map(c=>c.label).join(', ')}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}