import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import { MOCK_ENTRIES } from '../../../constants/scheduleN.js';
import { PageHeader, EmptyState, Tabs} from '../../../components/common/index.jsx';
import EmbEntryDetailModal from '../../../components/common/EmbEntryDetailModal.jsx';
import EntriesTable from './components/EntriesTable.jsx';

// ─── My Entries ──────────────────────────────────────────────────
export default function MyEntries() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const myEntries = MOCK_ENTRIES.filter(e => e.engineer.id === user.id);
  const [filter, setFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);

  const filtered = filter === 'ALL' ? myEntries : myEntries.filter(e => e.status === filter);
  const tabConfig = [
    { id: 'ALL',      label: 'All',      count: myEntries.length },
    { id: 'PENDING',  label: 'Pending',  count: myEntries.filter(e => e.status === 'PENDING').length },
    { id: 'APPROVED', label: 'Approved', count: myEntries.filter(e => e.status === 'APPROVED').length },
    { id: 'REJECTED', label: 'Rejected', count: myEntries.filter(e => e.status === 'REJECTED').length },
    { id: 'RETURNED', label: 'Returned', count: myEntries.filter(e => e.status === 'RETURNED').length },
  ];

  return (
    <div className="fade-up">
      <PageHeader
        title="My Entries"
        subtitle={`${myEntries.length} entries submitted`}
        actions={<button className="btn btn-primary" onClick={() => navigate('/new-entry')}>+ New Entry</button>}
      />
      <div className="card">
        <Tabs tabs={tabConfig} active={filter} onChange={setFilter} />
        <div className="table-wrap">
          <EntriesTable filtered={filtered} setSelected={setSelected} />
          {filtered.length === 0 && <EmptyState icon="📭" title="No entries" message="No entries match this filter." action={<button className="btn btn-primary" onClick={() => navigate('/new-entry')}>Create Entry</button>} />}
        </div>
      </div>
      {selected && <EmbEntryDetailModal entry={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}