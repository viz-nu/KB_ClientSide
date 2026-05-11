import { StatusBadge } from '../../../../components/common';

// GraphQL fields used:
//   e._id, e.WorkCategory, e.status,
//   e.span{name}, e.project{name},
//   e.createdAt, e.adminRemark, e.remarks
//   e.engineer is NOT in the list query — show span/project instead

export default function EntryTable({ filtered, setSelected, handleAction }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Entry / Project</th>
          <th>Category</th>
          <th>Span</th>
          <th>Date</th>
          <th>Status</th>
          <th>Remark</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map(e => (
          <tr key={e._id}>

            {/* ── Project + short ID ── */}
            <td>
              <button
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--accent)', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600,
                  textAlign: 'left', padding: 0,
                }}
                onClick={() => setSelected(e)}
              >
                {e.project?.name ?? '—'}
              </button>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                #{e._id?.slice(-6)}
              </div>
            </td>

            {/* ── Work Category ── */}
            <td style={{ fontSize: 11 }}>
              {e.WorkCategory?.split(' (')[0] ?? '—'}
            </td>

            {/* ── Span ── */}
            <td style={{ fontSize: 11, color: 'var(--text2)' }}>
              {e.span?.name ?? '—'}
            </td>

            {/* ── Date ── */}
            <td style={{ fontSize: 11, color: 'var(--text2)', whiteSpace: 'nowrap' }}>
              {e.createdAt
                ? new Date(e.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })
                : '—'}
            </td>

            {/* ── Status ── */}
            <td><StatusBadge status={e.status} /></td>

            {/* ── Admin remark / return reason ── */}
            <td style={{ fontSize: 11, color: 'var(--text2)', maxWidth: 200 }}>
              {e.adminRemark || e.remarks ? (
                <span style={{
                  color: e.status === 'REJECTED'
                    ? 'var(--red)'
                    : e.status === 'RETURNED'
                    ? 'var(--yellow)'
                    : 'var(--text2)',
                }}>
                  {e.adminRemark || e.remarks}
                </span>
              ) : '—'}
            </td>

            {/* ── Actions: SUBMITTED entries get full action buttons ── */}
            <td>
              {e.status === 'SUBMITTED' ? (
                <div style={{ display: 'flex', gap: 5 }}>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleAction(e, 'APPROVE')}
                  >
                    ✓ Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleAction(e, 'REJECT')}
                  >
                    ✕ Reject
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleAction(e, 'RETURN')}
                  >
                    ↩ Return
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setSelected(e)}
                >
                  View
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}