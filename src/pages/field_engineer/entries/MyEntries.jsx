import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { EMB_ENTRY } from "../../../apollo/gql.js";
import {
  PageHeader,
  EmptyState,
  Spinner,
} from "../../../components/common/index.jsx";
import EmbEntryDetailModal from "../../../components/common/EmbEntryDetailModal.jsx";
import EntriesTable from "../../../components/common/EntriesTable.jsx";
import {
  PAGE_LIMIT,
  ALL_STATUS_OPTIONS,
  emptyFilters,
  hasActiveFilters,
  activeCount,
  FilterPanel,
  ActiveChips,
  Pagination,
  useFacets,
} from "../../../components/common/EntryFilters.jsx";
import { useAuth } from "../../../hooks/useAuth.js";
// ═══════════════════════════════════════════════════════════════════
// MyEntries — field engineer's own submissions
// ═══════════════════════════════════════════════════════════════════
export default function MyEntries() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // Unfiltered facets + label cache (see entryFilters.jsx for why)
  const { facets, facetLoading, labelCache } = useFacets();

  const { data, loading, error, refetch } = useQuery(EMB_ENTRY.list, {
    variables: {
      page,
      limit: PAGE_LIMIT,
      status: filters.status || undefined,
      span: filters.spans.length ? filters.spans : undefined,
      project: filters.projects.length ? filters.projects : undefined,
      createdBy: filters.createdBy.length ? filters.createdBy : [user._id],
      fromDate: filters.fromDate || undefined,
      toDate: filters.toDate || undefined,
    },
    fetchPolicy: "cache-and-network",
  });

  const entries = data?.activities?.data ?? [];
  const pagination = data?.activities?.PaginationMetaData ?? {};
  const totalPages = pagination.totalPages ?? 1;

  const applyFilter = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };
  const resetFilters = () => {
    setFilters(emptyFilters());
    setPage(1);
  };

  // const handleProgressReport = () => {
  //   const params = new URLSearchParams();
  //   if (filters.status)           params.set("status",    filters.status);
  //   if (filters.projects.length)  params.set("projects",  filters.projects.join(","));
  //   if (filters.spans.length)     params.set("spans",     filters.spans.join(","));
  //   if (filters.createdBy.length) params.set("createdBy", filters.createdBy.join(","));
  //   if (filters.fromDate)         params.set("fromDate",  filters.fromDate);
  //   if (filters.toDate)           params.set("toDate",    filters.toDate);
  //   navigate(`/progress-report?${params.toString()}`);
  // };

  const active = hasActiveFilters(filters);
  return (
    <div className="fade-up">
      {!selected && (
        <>
          <PageHeader
            title="My Entries"
            subtitle={
              loading
                ? "Loading…"
                : `${pagination.totalDocuments ?? entries.length} entries`
            }
            actions={
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-outline"
                  onClick={() => setPanelOpen((x) => !x)}
                  style={
                    active
                      ? { borderColor: "var(--accent)", color: "var(--accent)" }
                      : {}
                  }
                >
                  ⚙ Filters{active ? ` (${activeCount(filters)})` : ""}
                </button>
                {/* <button className="btn btn-outline" onClick={handleProgressReport}>
              📊 Progress Report
            </button> */}
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/new-entry")}
                >
                  + New Entry
                </button>
              </div>
            }
          />

          {panelOpen && (
            <FilterPanel
              role="field-engineer"
              filters={filters}
              facets={facets}
              facetLoading={facetLoading}
              onChange={applyFilter}
              onReset={resetFilters}
              onClose={() => setPanelOpen(false)}
              statusOptions={ALL_STATUS_OPTIONS} // engineer sees DRAFT too
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
            <div
              className="table-wrap"
              style={{ position: "relative", minHeight: 120 }}
            >
              {loading && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,.25)",
                    borderRadius: 10,
                  }}
                >
                  <Spinner />
                </div>
              )}

              {!loading && error && (
                <EmptyState
                  icon="⚠️"
                  title="Failed to load entries"
                  message={error.message}
                  action={
                    <button
                      className="btn btn-outline"
                      onClick={() => refetch()}
                    >
                      Retry
                    </button>
                  }
                />
              )}

              {!loading && !error && entries.length === 0 && (
                <EmptyState
                  icon="📭"
                  title="No entries found"
                  message={
                    active
                      ? "Try adjusting your filters."
                      : "You haven't submitted any entries yet."
                  }
                  action={
                    active ? (
                      <button
                        className="btn btn-outline"
                        onClick={resetFilters}
                      >
                        Clear Filters
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate("/new-entry")}
                      >
                        Create Entry
                      </button>
                    )
                  }
                />
              )}
              {!loading && !error && entries.length > 0 && (
                <EntriesTable
                  filtered={entries}
                  setSelected={setSelected}
                  selectionDisabled={false}
                />
              )}
            </div>

            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            )}
          </div>
        </>
      )}

      {selected && (
        <EmbEntryDetailModal
          entry={selected}
          onClose={() => setSelected(null)}
          currentUserId={user._id}
        />
      )}
    </div>
  );
}
