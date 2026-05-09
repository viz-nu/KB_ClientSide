import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth.js';
import { MOCK_ENTRIES, CHAPTERS_N } from '../../../constants/scheduleN.js';
import {  StatCard, PageHeader, FormField, Spinner,} from '../../../components/common/index.jsx';

// ─── Reports ─────────────────────────────────────────────────────
export default function ReportsDashboard() {
  const { user } = useAuth();
  const [from, setFrom] = useState('2026-04-01');
  const [to, setTo] = useState('2026-04-30');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const entries = MOCK_ENTRIES;
    setReportData({
      total: entries.length,
      approved: entries.filter(e => e.status === 'APPROVED').length,
      rejected: entries.filter(e => e.status === 'REJECTED').length,
      pending:  entries.filter(e => e.status === 'PENDING').length,
      returned: entries.filter(e => e.status === 'RETURNED').length,
      amount: entries.reduce((s, e) => s + (e.totalAmount || 0), 0),
      breakdown: CHAPTERS_N.map((t) => ({
        cat: t.name.split(' (')[0],
        count: entries.filter(e => e.workCategory === t.name).length,
        amount: entries.filter(e => e.workCategory === t.name).reduce((s, e) => s + (e.totalAmount || 0), 0),
        color: t.color,
      })).filter(b => b.count > 0),
    });
    setLoading(false);
  };

  return (
    <div className="fade-up">
      <PageHeader title="Reports" subtitle="Generate progress and compliance reports" />
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><span className="card-title">Report Parameters</span></div>
        <div className="form-row">
          <FormField label="From Date"><input className="form-control" type="date" value={from} onChange={e => setFrom(e.target.value)} /></FormField>
          <FormField label="To Date">  <input className="form-control" type="date" value={to}   onChange={e => setTo(e.target.value)}   /></FormField>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[['📊 Progress Report','primary'],['📋 Compliance Report','outline'],['💰 Financial Report','outline']].map(([label, type]) => (
            <button key={label} className={`btn btn-${type}`} onClick={generate} disabled={loading}>
              {loading && type === 'primary' ? <Spinner size={14} color="var(--navy)" /> : label}
            </button>
          ))}
        </div>
      </div>

      {reportData && (
        <div className="fade-up">
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <span className="card-title">Progress Report —  user span name goes here {user.span?.name}</span>
              <span style={{ fontSize: 11, color: 'var(--text2)' }}>{from} to {to}</span>
            </div>
            <div className="stats-grid">
              <StatCard icon="📋" number={reportData.total}    label="Total Entries"  color="var(--blue)"   />
              <StatCard icon="✅" number={reportData.approved} label="Approved"       color="var(--green)"  />
              <StatCard icon="❌" number={reportData.rejected} label="Rejected"       color="var(--red)"    />
              <StatCard icon="⏳" number={reportData.pending}  label="Pending"        color="var(--yellow)" />
              <StatCard icon="💰" number={`₹${(reportData.amount/1000).toFixed(0)}K`} label="Total Value" color="var(--accent)" />
            </div>
            <div>
              <div className="card-title" style={{ fontSize: 13, marginBottom: 12 }}>Category-wise Breakdown</div>
              {reportData.breakdown.map(b => (
                <div key={b.cat} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: b.color, display: 'inline-block' }} />
                      {b.cat}
                    </span>
                    <span style={{ color: 'var(--text2)' }}>{b.count} entries · ₹{b.amount.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,.07)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${(b.count / reportData.total) * 100}%`, height: '100%', background: b.color, borderRadius: 3, transition: 'width .5s' }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-outline btn-sm">⬇ Export PDF</button>
              <button className="btn btn-outline btn-sm">📊 Export XLSX</button>
              <button className="btn btn-outline btn-sm">📧 Email Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}