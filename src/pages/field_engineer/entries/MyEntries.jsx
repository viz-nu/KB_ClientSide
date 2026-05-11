import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client'; // or however your project uses Apollo
import { useAuth } from '../../../hooks/useAuth.js';
import { EMB_ENTRY } from '../../../apollo/gql.js';
import { PageHeader, EmptyState, Tabs } from '../../../components/common/index.jsx';
import EmbEntryDetailModal from '../../../components/common/EmbEntryDetailModal.jsx';
import EntriesTable from './components/EntriesTable.jsx';

// Status → tab mapping
// null  = fetch ALL from API
const TAB_STATUS_MAP = {
  ALL:      null,
  DRAFT:    'DRAFT',
  SUBMITTED:'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  RETURNED: 'RETURNED',
};

const PAGE_LIMIT = 50; // fetch enough for client-side count badges

export default function MyEntries() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [filter, setFilter]   = useState('ALL');
  const [selected, setSelected] = useState(null);

  // ── Fetch ALL once so we can build accurate tab counts ──────────
  const {
    data: allData,
    loading: allLoading,
    error: allError,
    refetch: refetchAll,
  } = useQuery(EMB_ENTRY.list, {
    variables: { page: 1, limit: PAGE_LIMIT, status: null },
    fetchPolicy: 'cache-and-network',
  });

  // ── Fetch by status when a specific tab is selected ─────────────
  const statusVar = TAB_STATUS_MAP[filter]; // null when ALL
  const {
    data: filteredData,
    loading: filteredLoading,
    error: filteredError,
  } = useQuery(EMB_ENTRY.list, {
    variables: { page: 1, limit: PAGE_LIMIT, status: statusVar },
    fetchPolicy: 'cache-and-network',
    skip: filter === 'ALL', // reuse allData when showing ALL
  });

  // ── Derive display list ──────────────────────────────────────────
  const allEntries      = allData?.activities?.data      ?? [];
  const displayEntries  = filter === 'ALL'
    ? allEntries
    : (filteredData?.activities?.data ?? []);

  const isLoading = filter === 'ALL' ? allLoading : filteredLoading;
  const error     = filter === 'ALL' ? allError   : filteredError;

  // ── Count helpers from allEntries (always use full set for badges)
  const countFor = (s) => allEntries.filter(e => e.status === s).length;

  const tabConfig = [
    { id: 'ALL',       label: 'All',       count: allEntries.length },
    { id: 'DRAFT',     label: 'Draft',     count: countFor('DRAFT') },
    { id: 'SUBMITTED', label: 'Submitted', count: countFor('SUBMITTED') },
    { id: 'APPROVED',  label: 'Approved',  count: countFor('APPROVED') },
    { id: 'REJECTED',  label: 'Rejected',  count: countFor('REJECTED') },
    { id: 'RETURNED',  label: 'Returned',  count: countFor('RETURNED') },
  ];

  return (
    <div className="fade-up">
      <PageHeader
        title="My Entries"
        subtitle={allLoading ? 'Loading…' : `${allEntries.length} entries submitted`}
        actions={
          <button className="btn btn-primary" onClick={() => navigate('/new-entry')}>
            + New Entry
          </button>
        }
      />

      <div className="card">
        <Tabs tabs={tabConfig} active={filter} onChange={setFilter} />

        <div className="table-wrap" style={{ position: 'relative', minHeight: 120 }}>

          {/* ── Loading overlay ── */}
          {isLoading && (
            <div style={styles.loadingOverlay}>
              <Spinner />
            </div>
          )}

          {/* ── Error state ── */}
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

          {/* ── Table ── */}
          {!isLoading && !error && displayEntries.length > 0 && (
            <EntriesTable filtered={displayEntries} setSelected={setSelected} />
          )}

          {/* ── Empty state ── */}
          {!isLoading && !error && displayEntries.length === 0 && (
            <EmptyState
              icon="📭"
              title="No entries"
              message={
                filter === 'ALL'
                  ? "You haven't submitted any entries yet."
                  : `No ${filter.toLowerCase()} entries found.`
              }
              action={
                <button className="btn btn-primary" onClick={() => navigate('/new-entry')}>
                  Create Entry
                </button>
              }
            />
          )}
        </div>
      </div>

      {selected && (
        <EmbEntryDetailModal entry={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

// ── Tiny inline spinner so there's no extra import ──────────────
function Spinner() {
  return (
    <div style={styles.spinnerWrap}>
      <div style={styles.spinner} />
    </div>
  );
}

const styles = {
  loadingOverlay: {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(var(--bg-rgb, 255,255,255), 0.6)',
    zIndex: 10,
    borderRadius: 8,
  },
  spinnerWrap: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '32px 0',
  },
  spinner: {
    width: 28, height: 28,
    border: '3px solid var(--border, #e2e8f0)',
    borderTopColor: 'var(--accent, #3b82f6)',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
};

// Inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('entries-spin-kf')) {
  const style = document.createElement('style');
  style.id = 'entries-spin-kf';
  style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
}