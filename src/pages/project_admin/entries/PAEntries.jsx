import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { PageHeader, EmptyState, Tabs } from '../../../components/common/index.jsx';
import EntryTable from './components/EntryTable';
import EntryActionModal from './components/EntryActionModal';
import EmbEntryDetailModal from '../../../components/common/EmbEntryDetailModal.jsx';
import { EMB_ENTRY } from '../../../apollo/gql.js';

const PAGE_LIMIT = 100;

const TAB_STATUS_MAP = {
  ALL:       null,
  SUBMITTED: 'SUBMITTED',
  APPROVED:  'APPROVED',
  REJECTED:  'REJECTED',
  RETURNED:  'RETURNED',
};

// ─── PA Entries (Project Admin) ──────────────────────────────────
export default function PAEntries() {
  const [filter, setFilter]       = useState('ALL');
  const [selected, setSelected]   = useState(null);
  const [actionModal, setActionModal] = useState(null); // { entry, action, remark }

  // ── Fetch ALL entries (for counts) ──────────────────────────────
  const {
    data: allData,
    loading: allLoading,
    error: allError,
    refetch: refetchAll,
  } = useQuery(EMB_ENTRY.list, {
    variables: { page: 1, limit: PAGE_LIMIT, status: null },
    fetchPolicy: 'cache-and-network',
  });

  // ── Fetch per-status when a tab is selected ──────────────────────
  const {
    data: filteredData,
    loading: filteredLoading,
    error: filteredError,
    refetch: refetchFiltered,
  } = useQuery(EMB_ENTRY.list, {
    variables: { page: 1, limit: PAGE_LIMIT, status: TAB_STATUS_MAP[filter] },
    fetchPolicy: 'cache-and-network',
    skip: filter === 'ALL',
  });

  // ── Mutation ─────────────────────────────────────────────────────
  const [updateActivity, { loading: mutating }] = useMutation(EMB_ENTRY.update, {
    onCompleted: () => {
      refetchAll();
      if (filter !== 'ALL') refetchFiltered();
      setSelected(null);
      setActionModal(null);
    },
    onError: (err) => {
      console.error('Action failed:', err);
    },
  });

  // ── Derived data ─────────────────────────────────────────────────
  const allEntries     = allData?.activities?.data ?? [];
  const displayEntries = filter === 'ALL'
    ? allEntries
    : (filteredData?.activities?.data ?? []);

  const isLoading = filter === 'ALL' ? allLoading : filteredLoading;
  const error     = filter === 'ALL' ? allError   : filteredError;

  const countFor = (s) => allEntries.filter(e => e.status === s).length;

  const tabConfig = [
    { id: 'ALL',       label: 'All',       count: allEntries.length },
    { id: 'SUBMITTED', label: 'Submitted', count: countFor('SUBMITTED') },
    { id: 'APPROVED',  label: 'Approved',  count: countFor('APPROVED') },
    { id: 'REJECTED',  label: 'Rejected',  count: countFor('REJECTED') },
    { id: 'RETURNED',  label: 'Returned',  count: countFor('RETURNED') },
  ];

  // ── Action handlers ───────────────────────────────────────────────
  const handleAction = (entry, action) =>
    setActionModal({ entry, action, remark: '' });

  const submitAction = () => {
    const { entry, action, remark } = actionModal;
    const statusMap = { APPROVE: 'APPROVED', REJECT: 'REJECTED', RETURN: 'RETURNED' };
    updateActivity({
      variables: {
        _id: entry._id,
        status: statusMap[action],
        adminRemark: action !== 'RETURN'  ? remark : undefined,
        returnReason: action === 'RETURN' ? remark : undefined,
      },
    });
  };

  return (
    <div className="fade-up">
      <PageHeader
        title="e-MB Entries"
        subtitle="Review and action measurement book entries"
      />

      <div className="card">
        <Tabs tabs={tabConfig} active={filter} onChange={setFilter} />

        <div className="table-wrap" style={{ position: 'relative', minHeight: 120 }}>

          {isLoading && <LoadingOverlay />}

          {!isLoading && error && (
            <EmptyState
              icon="⚠️"
              title="Failed to load entries"
              message={error.message}
              action={
                <button className="btn btn-outline" onClick={() => refetchAll()}>
                  Retry
                </button>
              }
            />
          )}

          {!isLoading && !error && displayEntries.length > 0 && (
            <EntryTable
              filtered={displayEntries}
              setSelected={setSelected}
              handleAction={handleAction}
            />
          )}

          {!isLoading && !error && displayEntries.length === 0 && (
            <EmptyState
              icon="📭"
              title="No entries"
              message={
                filter === 'ALL'
                  ? 'No entries have been submitted yet.'
                  : `No ${filter.toLowerCase()} entries found.`
              }
            />
          )}
        </div>
      </div>

      {selected && (
        <EmbEntryDetailModal
          entry={selected}
          onClose={() => setSelected(null)}
          isAdmin
          onAction={handleAction}
        />
      )}

      {actionModal && (
        <EntryActionModal
          actionModal={actionModal}
          setActionModal={setActionModal}
          submitAction={submitAction}
          submitting={mutating}
        />
      )}
    </div>
  );
}

// ── Loading overlay ───────────────────────────────────────────────
function LoadingOverlay() {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(var(--bg-rgb,255,255,255),0.6)',
      borderRadius: 8,
    }}>
      <Spinner />
    </div>
  );
}

function Spinner() {
  injectSpinKF();
  return (
    <div style={{
      width: 28, height: 28,
      border: '3px solid var(--border,#e2e8f0)',
      borderTopColor: 'var(--accent,#3b82f6)',
      borderRadius: '50%',
      animation: 'pa-spin 0.7s linear infinite',
    }} />
  );
}

let _kfInjected = false;
function injectSpinKF() {
  if (_kfInjected || typeof document === 'undefined') return;
  _kfInjected = true;
  const s = document.createElement('style');
  s.textContent = '@keyframes pa-spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(s);
}