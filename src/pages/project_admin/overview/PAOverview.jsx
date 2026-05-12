import { MOCK_ENTRIES, CHAPTERS_N } from '../../../constants/scheduleN.js';
import {StatCard, PageHeader, EmptyState, StatusBadge, } from '../../../components/common/index.jsx';

// ─── PA Overview ────────────────────────────────────────────────
export default function PAOverview() {
  const entries = MOCK_ENTRIES;
  let stats={total: 0,pending: 0,approved: 0,rejected: 0};
  entries.forEach(e => {
    stats.total++;
    switch (e.status) {
      case 'PENDING': stats.pending++; break;
      case 'APPROVED': stats.approved++;break;
      case 'REJECTED': stats.rejected++;break;
      default: break;
    }
  });
  return (
    <div className="fade-up">
      <PageHeader title={`Dashboard`} subtitle="Overview of e-MB activity in your span" />
      <div className="stats-grid">
        <StatCard icon="📋" number={stats.total}    label="Total Entries"  color="var(--blue)"   />
        <StatCard icon="⏳" number={stats.pending}  label="Pending Review" color="var(--yellow)" />
        <StatCard icon="✅" number={stats.approved} label="Approved"       color="var(--green)"  />
        <StatCard icon="❌" number={stats.rejected} label="Rejected"       color="var(--red)"    />
        <StatCard icon="🏗️" number={0}              label="Projects"       color="var(--purple)" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Pending Action Required</span></div>
          {entries.filter(e => e.status === 'PENDING').map(e => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{e.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{e.engineer.name} · {e.submittedAt}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>₹{e.totalAmount?.toLocaleString()}</div>
                <StatusBadge status={e.status} />
              </div>
            </div>
          ))}
          {stats.pending === 0 && <EmptyState icon="✅" title="All clear!" message="No entries pending review." />}
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Category Breakdown</span></div>
          {Object.keys(CHAPTERS_N).map(cat => {
            const cnt = entries.filter(e => e.workCategory === cat).length;
            const pct = entries.length ? Math.round((cnt / entries.length) * 100) : 0;
            return cnt > 0 ? (
              <div key={cat} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text)' }}>{cat.split(' (')[0]}</span>
                  <span>{cnt} entries</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,.07)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: CHAPTERS_N[cat].color, borderRadius: 3, transition: 'width .4s' }} />
                </div>
              </div>
            ) : null;
          })}
        </div>
        <div className="card" style={{ marginTop: 16, borderLeft: '3px solid var(--accent)' }}>
  <div className="card-header">
    <span className="card-title">🏗️ Project Builder</span>
    <a href="/projects" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>
      Go to Projects →
    </a>
  </div>
  <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
    Create and manage custom projects with chapters, work items, and measurement fields.
    Field engineers follow your project structure when submitting e-MB entries.
  </p>
</div>

      </div>
    </div>
  );
}