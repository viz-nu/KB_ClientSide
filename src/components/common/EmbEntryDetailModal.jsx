import { useState } from 'react';
import {EmptyState, StatusBadge, Modal, AlertBanner, Tabs} from './index';



// ─── Entry Detail Modal ──────────────────────────────────────────
export default function EmbEntryDetailModal({ entry, onClose, isAdmin, onAction }) {
  const [tab, setTab] = useState('details');
  const tabConfig = [
    { id: 'details',   label: 'Details',    icon: '📋' },
    { id: 'lineitems', label: 'Line Items',  icon: '💰' },
    { id: 'sem',       label: 'SEM',        icon: '☑️' },
    { id: 'photos',    label: 'Photos',     icon: '📷' },
    { id: 'audit',     label: 'Audit Log',  icon: '🕐' },
  ];

  return (
    <Modal title={entry.title} onClose={onClose} size="lg"
      footer={
        isAdmin && entry.status === 'PENDING' ? (
          <div style={{ display: 'flex', gap: 8, width: '100%' }}>
            <button className="btn btn-success btn-sm" onClick={() => { onAction(entry, 'APPROVE'); onClose(); }}>✓ Approve</button>
            <button className="btn btn-danger  btn-sm" onClick={() => { onAction(entry, 'REJECT');  onClose(); }}>✕ Reject</button>
            <button className="btn btn-outline btn-sm" onClick={() => { onAction(entry, 'RETURN');  onClose(); }}>↩ Return</button>
            <div style={{ flex: 1 }} />
            <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
          </div>
        ) : (
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        )
      }
    >
      <Tabs tabs={tabConfig} active={tab} onChange={setTab} />

      {tab === 'details' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[
              ['Status',    <StatusBadge key="s" status={entry.status} />],
              ['Engineer',  entry.engineer.name],
              ['Span',  entry.span.name],
              ['Category',  entry.workCategory],
              ['Location',  entry.locationDescription],
              ['GPS Coords',`${entry.gpsLat?.toFixed(4)}, ${entry.gpsLng?.toFixed(4)}`],
              ['Created',   entry.createdAt],
              ['Submitted', entry.submittedAt || '—'],
            ].map(([k, v]) => (
              <div key={k} style={{ background: 'rgba(255,255,255,.03)', padding: '10px 12px', borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 13 }}>{v}</div>
              </div>
            ))}
          </div>
          {entry.adminRemark && <AlertBanner type={entry.status === 'APPROVED' ? 'success' : 'warning'} message={`Admin: ${entry.adminRemark}`} />}
          {entry.returnReason && <AlertBanner type="warning" message={`Return reason: ${entry.returnReason}`} />}
          {entry.remarks && (
            <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,.03)', borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>Field Remarks</div>
              <div style={{ fontSize: 13 }}>{entry.remarks}</div>
            </div>
          )}
        </div>
      )}

      {tab === 'lineitems' && (
        <div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Code</th><th>Description</th><th>Qty</th><th>Unit</th><th>Rate ₹</th><th>Amount ₹</th></tr></thead>
              <tbody>
                {entry.lineItems.map(li => (
                  <tr key={li.id}>
                    <td><code style={{ fontSize: 11 }}>{li.itemCode}</code></td>
                    <td>{li.description}</td>
                    <td>{li.quantity}</td>
                    <td style={{ color: 'var(--text2)', fontSize: 11 }}>{li.unit}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>₹{li.ratePerUnit?.toLocaleString()}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>₹{li.amount?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, paddingTop: 14, borderTop: '1px solid var(--border)', marginTop: 8 }}>
            <span style={{ color: 'var(--text2)', fontSize: 13 }}>Grand Total</span>
            <span style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>
              ₹{entry.totalAmount?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}
{/* 
      {tab === 'sem' && (
        <div>
          {entry.semChecklist?.length > 0
            ? entry.semChecklist.map(c => (
              <div key={c.parameterId} className="checklist-item">
                <span style={{ fontSize: 16, color: c.passed ? 'var(--green)' : 'var(--red)' }}>
                  {c.passed ? '✓' : '✗'}
                </span>
                <span style={{ fontSize: 13 }}>{c.label || c.parameterId}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: c.passed ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
                  {c.passed ? 'PASS' : 'FAIL'}
                </span>
              </div>
            ))
            : <EmptyState icon="☑️" title="No SEM data" message="No SEM checklist was submitted with this entry." />}
        </div>
      )} */}

      {tab === 'photos' && (
        <div>
          {entry.photos?.length > 0
            ? <div className="photo-grid">
                {entry.photos.map(p => (
                  <div key={p.id} className="photo-thumb">
                    <img src={p.url} alt={p.caption} />
                    {p.gpsLat && <div style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,.7)', borderRadius: 4, padding: '2px 5px', fontSize: 9, color: '#fff' }}>📍 GPS</div>}
                  </div>
                ))}
              </div>
            : <EmptyState icon="📷" title="No photos" message="No GPS-tagged photographs were attached." />}
        </div>
      )}

      {tab === 'audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {entry.auditLog?.map((log, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 14px', background: 'rgba(255,255,255,.03)', borderRadius: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(244,160,28,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                {{ SUBMITTED:'📤', APPROVED:'✅', REJECTED:'❌', RETURNED:'↩', CREATED:'➕' }[log.action] || '•'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{log.action}</span>
                  <span style={{ fontSize: 11, color: 'var(--text2)' }}>{new Date(log.timestamp).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>by {log.user}</div>
                {log.note && <div style={{ fontSize: 12, color: 'var(--text)', marginTop: 4 }}>{log.note}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}