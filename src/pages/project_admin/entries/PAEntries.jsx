import { useState }          from "react";
import { useNavigate }        from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { EMB_ENTRY }          from "../../../apollo/gql.js";
import { PageHeader, EmptyState, Spinner } from "../../../components/common/index.jsx";
import EmbEntryDetailModal    from "../../../components/common/EmbEntryDetailModal.jsx";
import {
  PAGE_LIMIT,
  emptyFilters,
  hasActiveFilters,
  activeCount,
  useFacets,
  FilterPanel,
  ActiveChips,
  Pagination,
} from "../../../components/common/EntryFilters.jsx";
import EntryActionModal from "../../../components/common/EntryActionModal.jsx";
import EntryTable from "../../../components/common/EntryTable.jsx";

// PA sees every status except DRAFT (no actions on un-submitted entries)
const PA_STATUS_OPTIONS = ["SUBMITTED", "APPROVED", "REJECTED", "RETURNED"];

// ═══════════════════════════════════════════════════════════════════
// PAEntries — project admin review and action view
// ═══════════════════════════════════════════════════════════════════
export default function PAEntries() {
  const navigate = useNavigate();

  const [filters,     setFilters]     = useState(emptyFilters);
  const [page,        setPage]        = useState(1);
  const [selected,    setSelected]    = useState(null);
  const [actionModal, setActionModal] = useState(null);
  const [panelOpen,   setPanelOpen]   = useState(false);

  // Unfiltered facets + label cache (see entryFilters.jsx for why)
  const { facets, facetLoading, labelCache } = useFacets();

  const { data, loading, error, refetch } = useQuery(EMB_ENTRY.list, {
    variables: {
      page,
      limit:     PAGE_LIMIT,
      status:    filters.status             || undefined,
      span:      filters.spans.length       ? filters.spans     : undefined,
      project:   filters.projects.length    ? filters.projects  : undefined,
      createdBy: filters.createdBy.length   ? filters.createdBy : undefined,
      fromDate:  filters.fromDate           || undefined,
      toDate:    filters.toDate             || undefined,
    },
    fetchPolicy: "cache-and-network",
  });

  const entries    = data?.activities?.data              ?? [];
  const pagination = data?.activities?.PaginationMetaData ?? {};
  const totalPages = pagination.totalPages ?? 1;

  const [updateActivity, { loading: mutating }] = useMutation(EMB_ENTRY.update, {
    onCompleted: () => { refetch(); setSelected(null); setActionModal(null); },
    onError: (err) => console.error("Action failed:", err),
  });

  const applyFilter  = (patch) => { setFilters((f) => ({ ...f, ...patch })); setPage(1); };
  const resetFilters = () => { setFilters(emptyFilters()); setPage(1); };

  const handleAction = (entry, action) => setActionModal({ entry, action, remark: "" });
  const submitAction = () => {
    const { entry, action, remark } = actionModal;
    const statusMap = { APPROVE: "APPROVED", REJECT: "REJECTED", RETURN: "RETURNED" };
    updateActivity({
      variables: {
        _id:          entry._id,
        status:       statusMap[action],
        adminRemark:  action !== "RETURN" ? remark : undefined,
        returnReason: action === "RETURN" ? remark : undefined,
      },
    });
  };

  const handleProgressReport = () => {
    const params = new URLSearchParams();
    if (filters.status)           params.set("status",    filters.status);
    if (filters.projects.length)  params.set("projects",  filters.projects.join(","));
    if (filters.spans.length)     params.set("spans",     filters.spans.join(","));
    if (filters.createdBy.length) params.set("createdBy", filters.createdBy.join(","));
    if (filters.fromDate)         params.set("fromDate",  filters.fromDate);
    if (filters.toDate)           params.set("toDate",    filters.toDate);
    navigate(`/progress-report?${params.toString()}`);
  };

  const active = hasActiveFilters(filters);

  return (
    <div className="fade-up">
      <PageHeader
        title="e-MB Entries"
        subtitle={
          loading
            ? "Loading…"
            : `${pagination.totalDocuments ?? entries.length} entries · review and action`
        }
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-outline"
              onClick={() => setPanelOpen((x) => !x)}
              style={active ? { borderColor: "var(--accent)", color: "var(--accent)" } : {}}
            >
              ⚙ Filters{active ? ` (${activeCount(filters)})` : ""}
            </button>
            <button className="btn btn-outline" onClick={handleProgressReport}>
              📊 Progress Report
            </button>
          </div>
        }
      />

      {panelOpen && (
        <FilterPanel
        role="project-admin"
          filters={filters}
          facets={facets}
          facetLoading={facetLoading}
          onChange={applyFilter}
          onReset={resetFilters}
          onClose={() => setPanelOpen(false)}
          statusOptions={PA_STATUS_OPTIONS}   // PA skips DRAFT
        />
      )}

      {active && (
        <ActiveChips
          filters={filters}
          labelCache={labelCache}
          onChange={applyFilter}
          onReset={resetFilters}
        />
      )}

      <div className="card">
        <div className="table-wrap" style={{ position: "relative", minHeight: 120 }}>
          {loading && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(0,0,0,.25)", borderRadius: 8,
            }}>
              <Spinner />
            </div>
          )}

          {!loading && error && (
            <EmptyState icon="⚠️" title="Failed to load entries" message={error.message}
              action={<button className="btn btn-outline" onClick={() => refetch()}>Retry</button>}
            />
          )}

          {!loading && !error && entries.length === 0 && (
            <EmptyState
              icon="📭"
              title="No entries found"
              message={active ? "Try adjusting your filters." : "No entries have been submitted yet."}
              action={active
                ? <button className="btn btn-outline" onClick={resetFilters}>Clear Filters</button>
                : null}
            />
          )}

          {!loading && !error && entries.length > 0 && (
            <EntryTable
              filtered={entries}
              setSelected={setSelected}
              handleAction={handleAction}
            />
          )}
        </div>

        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        )}
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