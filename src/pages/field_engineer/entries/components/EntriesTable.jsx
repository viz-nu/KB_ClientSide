import { StatusBadge } from '../../../../components/common/index.jsx';

// Field mapping from GraphQL:
// e._id, e.WorkCategory, e.adminRemark, e.remarks,
// e.status, e.span{_id,name}, e.project{_id,name},
// e.createdAt, e.updatedAt

export default function EntriesTable({ filtered, setSelected }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Entry / Project</th>
          <th>Category</th>
          <th>Span</th>
          <th>Date</th>
          <th>Status</th>
          <th>Remarks</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {filtered.map(e => (
          <tr key={e._id}>
            {/* ── Title / Project ── */}
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
              {e.createdAt ? new Date(e.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
              }) : '—'}
            </td>

            {/* ── Status ── */}
            <td>
              <StatusBadge status={e.status} />
            </td>

            {/* ── Admin Remark / Return Reason ── */}
            <td style={{ fontSize: 11, color: 'var(--text2)', maxWidth: 220 }}>
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

            {/* ── Action ── */}
            <td>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelected(e)}
              >
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}