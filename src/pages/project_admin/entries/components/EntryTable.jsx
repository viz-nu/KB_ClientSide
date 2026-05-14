import { StatusBadge } from '../../../../components/common';

export default function EntryTable({ filtered, setSelected, handleAction }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Project / Span</th>
          <th>Category</th>
          <th>Measurements</th>
          <th>Date</th>
          <th>Status</th>
          <th>Remark</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map(e => (
          <tr key={e._id}>

            {/* ── Project + Span + ID ── */}
            <td>
              <button
                style={{
                  background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                  padding: 0, display: 'flex',
                  flexDirection: 'column', gap: 2,
                }}
                onClick={() => setSelected(e)}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                  {e.project?.name ?? '—'}
                </span>
                <span style={{ fontSize: 11, color: 'var(--accent)' }}>
                  ↳ {e.span?.name ?? '—'}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text3)' }}>
                  #{e._id?.slice(-6)}
                </span>
              </button>
            </td>

            {/* ── Work Category ── */}
            <td style={{ fontSize: 11 }}>
              {e.WorkCategory?.split(' (')[0] ?? '—'}
            </td>

            {/* ── Measurements summary ── */}
            <td><MeasurementsSummary lineItems={e.lineItems} /></td>

            {/* ── Date ── */}
            <td style={{ fontSize: 11, color: 'var(--text2)', whiteSpace: 'nowrap' }}>
              {e.createdAt
                ? new Date(e.createdAt).toLocaleString('en-IN')
                : '—'}
            </td>

            {/* ── Status ── */}
            <td><StatusBadge status={e.status} /></td>

            {/* ── Admin remark ── */}
            <td style={{ fontSize: 11, color: 'var(--text2)', maxWidth: 180 }}>
              {e.adminRemark || e.remarks ? (
                <span style={{
                  color: e.status === 'REJECTED' ? 'var(--red)'
                    : e.status === 'RETURNED'    ? 'var(--yellow)'
                    : 'var(--text2)',
                }}>
                  {e.adminRemark || e.remarks}
                </span>
              ) : '—'}
            </td>

            {/* ── Actions ── */}
            <td>
              {e.status === 'SUBMITTED' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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

// ── Measurements summary ──────────────────────────────────────────
function MeasurementsSummary({ lineItems }) {
  if (!lineItems?.length)
    return <span style={{ fontSize: 11, color: 'var(--text3)' }}>—</span>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {lineItems.map((group, gi) => {
        const measurements = group.measurements ?? [];
        if (!measurements.length) return null;

        return (
          <div key={gi} style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {measurements.map((m, mi) => {
              const displayVal =
                'fixedNumber' in m
                  ? `${m.fixedNumber}${m.unit ? ' ' + m.unit : ''}`
                  : Array.isArray(m.value)
                  ? m.value.join(', ')
                  : m.type === 'boolean' && m.value != null
                  ? m.value ? 'Yes' : 'No'
                  : m.value != null && m.value !== ''
                  ? `${m.value}${m.unit ? ' ' + m.unit : ''}`
                  : null;

              if (!displayVal) return null;

              return (
                <span
                  key={mi}
                  style={{
                    fontSize: 10,
                    padding: '1px 7px',
                    borderRadius: 20,
                    background: 'rgba(255,255,255,.05)',
                    border: '1px solid var(--border)',
                    color: 'var(--text2)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {m.label}:{' '}
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>
                    {displayVal}
                  </span>
                  {m.photos?.length > 0 && (
                    <span style={{ color: 'var(--accent)', marginLeft: 4 }}>
                      📷{m.photos.length}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}