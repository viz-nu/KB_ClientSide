import { useState} from 'react';
import { MOCK_ENTRIES } from '../../../constants/scheduleN.js';
import {PageHeader, EmptyState, Tabs} from '../../../components/common/index.jsx';
import EntryTable from './components/EntryTable';
import EntryActionModal from './components/EntryActionModal';
import EmbEntryDetailModal from '../../../components/common/EmbEntryDetailModal.jsx';


// ─── e-MB Entries (Project Admin) ───────────────────────────────
export default function PAEntries() {
  const [entries, setEntries] = useState(MOCK_ENTRIES);
  const [filter, setFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [actionModal, setActionModal] = useState(null);

  const filtered = filter === 'ALL' ? entries : entries.filter(e => e.status === filter);

  const handleAction = (entry, action) => setActionModal({ entry, action, remark: '' });

  const submitAction = () => {
    const { entry, action, remark } = actionModal;
    const map = { APPROVE: 'APPROVED', REJECT: 'REJECTED', RETURN: 'RETURNED' };
    setEntries(es => es.map(e => e.id === entry.id
      ? { ...e, status: map[action], adminRemark: action !== 'RETURN' ? remark : e.adminRemark, returnReason: action === 'RETURN' ? remark : e.returnReason }
      : e
    ));
    setSelected(null);
    setActionModal(null);
  };
  let counts={total: 0,pending: 0,approved: 0,rejected: 0,returned: 0};
  entries.forEach(e => {
    counts.total++;
    switch (e.status) {
      case 'PENDING': counts.pending++; break;
      case 'APPROVED': counts.approved++;break;
      case 'REJECTED': counts.rejected++;break;
      case 'RETURNED': counts.returned++;break;
      default: break;
    }
  });
  const tabConfig = [
    { id: 'ALL',      label: 'All',      count: counts.total },
    { id: 'PENDING',  label: 'Pending',  count: counts.pending },
    { id: 'APPROVED', label: 'Approved', count: counts.approved },
    { id: 'REJECTED', label: 'Rejected', count: counts.rejected },
    { id: 'RETURNED', label: 'Returned', count: counts.returned },
  ];

  return (
    <div className="fade-up">
      <PageHeader title="e-MB Entries" subtitle="Review and action measurement book entries" />
      <div className="card">
        <Tabs tabs={tabConfig} active={filter} onChange={setFilter} />
        <div className="table-wrap">
        <EntryTable handleAction={handleAction} filtered={filtered} setSelected={setSelected} />
          {filtered.length === 0 && <EmptyState icon="📭" title="No entries" message="No entries match this filter." />}
        </div>
      </div>
      {selected && ( <EmbEntryDetailModal  entry={selected}  onClose={() => setSelected(null)}  isAdmin  onAction={handleAction}/>   )}
{actionModal && <EntryActionModal actionModal={actionModal} setActionModal={setActionModal} submitAction={submitAction} />}    
</div>

  );
}