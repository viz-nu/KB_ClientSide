import { StatusBadge} from '../../../../components/common/index.jsx';
export default function EntriesTable({ filtered, setSelected }) {
    return (
        <table>
        <thead>
          <tr><th>Entry</th><th>Category</th><th>Date</th><th>Amount ₹</th><th>Status</th><th>Admin Remark</th><th></th></tr>
        </thead>
        <tbody>
          {filtered.map(e => (
            <tr key={e.id}>
              <td>
                <button style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 13, fontWeight: 600, textAlign: 'left', padding: 0 }} onClick={() => setSelected(e)}>
                  {e.title}
                </button>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{e.locationDescription}</div>
              </td>
              <td style={{ fontSize: 11 }}>{e.workCategory?.split(' (')[0]}</td>
              <td style={{ fontSize: 11, color: 'var(--text2)' }}>{e.submittedAt || e.createdAt}</td>
              <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>₹{e.totalAmount?.toLocaleString()}</td>
              <td><StatusBadge status={e.status} /></td>
              <td style={{ fontSize: 11, color: 'var(--text2)', maxWidth: 200 }}>
                {e.adminRemark || e.returnReason
                  ? <span style={{ color: e.status === 'REJECTED' ? 'var(--red)' : 'var(--yellow)' }}>
                      {e.adminRemark || e.returnReason}
                    </span>
                  : '—'}
              </td>
              <td><button className="btn btn-outline btn-sm" onClick={() => setSelected(e)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
}