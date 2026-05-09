import { CHAPTERS_N } from '../../../../constants/scheduleN.js';
import { StatusBadge } from '../../../../components/common';

export default function EntryTable({ handleAction, filtered, setSelected }){

    return (
        <table>
            <thead>
  <tr>
    <th>Entry</th>
    <th>Category</th>
    <th>Engineer</th>
    <th>Date</th>
    <th>Amount ₹</th>
    <th>Status</th>
    <th>Actions</th>
  </tr>
</thead>
<tbody>
  {filtered.map(e => (
    <tr key={e.id}>
      <td>
        <button
          style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 13, fontWeight: 600, textAlign: 'left', padding: 0 }}
          onClick={() => setSelected(e)}
        >
          {e.title}
        </button>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{e.locationDescription}</div>
      </td>
      <td>
        <span style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: CHAPTERS_N.find((t)=>t.name===e.workCategory)?.color || '#fff', display: 'inline-block', flexShrink: 0 }} />
          {e.workCategory?.split(' (')[0]}
        </span>
      </td>
      <td style={{ fontSize: 12 }}>{e.engineer.name}</td>
      <td style={{ fontSize: 11, color: 'var(--text2)' }}>{e.submittedAt || e.createdAt}</td>
      <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>₹{e.totalAmount?.toLocaleString()}</td>
      <td><StatusBadge status={e.status} /></td>
      <td>
        {e.status === 'PENDING' ? (
          <div style={{ display: 'flex', gap: 5 }}>
            <button className="btn btn-success btn-sm" onClick={() => handleAction(e, 'APPROVE')}>✓ Approve</button>
            <button className="btn btn-danger  btn-sm" onClick={() => handleAction(e, 'REJECT')}>✕ Reject</button>
            <button className="btn btn-outline btn-sm" onClick={() => handleAction(e, 'RETURN')}>↩ Return</button>
          </div>
        ) : (
          <button className="btn btn-outline btn-sm" onClick={() => setSelected(e)}>View</button>
        )}
      </td>
    </tr>
  ))}
</tbody>
</table>
)
}