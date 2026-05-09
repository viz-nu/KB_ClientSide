import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import { MOCK_ENTRIES } from '../../../constants/scheduleN.js';
import {StatCard, PageHeader, EmptyState, StatusBadge} from '../../../components/common/index.jsx';

// ─── Field Engineer Dashboard ────────────────────────────────────
export default function FEDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const myEntries = MOCK_ENTRIES.filter(e => e.engineer.id === user.id);

  return (
    <div className="fade-up">
      <PageHeader title={`Welcome, ${user.name.split(' ')[0]}`} subtitle={  "Span name is supposed to be here"||  user.span?.name  } />
      <div className="stats-grid">
        <StatCard icon="📋" number={myEntries.length}                                    label="Total Entries"  color="var(--blue)"   />
        <StatCard icon="⏳" number={myEntries.filter(e => e.status === 'PENDING').length}  label="Pending"       color="var(--yellow)" />
        <StatCard icon="✅" number={myEntries.filter(e => e.status === 'APPROVED').length} label="Approved"      color="var(--green)"  />
        <StatCard icon="❌" number={myEntries.filter(e => e.status === 'REJECTED').length} label="Rejected"      color="var(--red)"    />
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        {[
          { icon: '➕', title: 'New e-MB Entry',  desc: 'Create and submit a new measurement book entry', to: '/new-entry', color: 'var(--accent)' },
          { icon: '📋', title: 'My Entries',       desc: 'View status of your submitted entries',         to: '/my-entries', color: 'var(--blue)' },
          { icon: '☑️', title: 'SEM Checklist',    desc: 'Access parameter checklists for your work',     to: '/checklist', color: 'var(--green)' },
        ].map(q => (
          <button key={q.title}
            onClick={() => navigate(q.to)}
            style={{ textAlign: 'left', background: 'var(--card)', border: `1px solid var(--border)`, borderRadius: 'var(--radius)', padding: 20, cursor: 'pointer', transition: 'all .15s', borderTop: `3px solid ${q.color}` }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: 26, marginBottom: 8 }}>{q.icon}</div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14, color: q.color, marginBottom: 4 }}>{q.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{q.desc}</div>
          </button>
        ))}
      </div>

      {/* Recent entries */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Entries</span>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/my-entries')}>View All</button>
        </div>
        {myEntries.slice(0, 3).map(e => (
          <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border2)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{e.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{e.workCategory?.split(' (')[0]} · {e.submittedAt || e.createdAt}</div>
              {(e.adminRemark || e.returnReason) && (
                <div style={{ fontSize: 11, color: 'var(--yellow)', marginTop: 3 }}>
                  ⚠ {e.adminRemark || e.returnReason}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700, marginBottom: 4 }}>₹{e.totalAmount?.toLocaleString()}</div>
              <StatusBadge status={e.status} />
            </div>
          </div>
        ))}
        {myEntries.length === 0 && <EmptyState icon="📭" title="No entries yet" message="Create your first e-MB entry." />}
      </div>
    </div>
  );
}
