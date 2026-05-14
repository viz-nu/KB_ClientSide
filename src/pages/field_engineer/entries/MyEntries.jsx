import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { EMB_ENTRY } from "../../../apollo/gql.js";
import {
  PageHeader,
  EmptyState,
  Spinner,
} from "../../../components/common/index.jsx";
import EntriesTable from "./components/EntriesTable.jsx";
import EmbEntryDetailModal from "../../../components/common/EmbEntryDetailModal.jsx";

// ─── constants ────────────────────────────────────────────────────
const PAGE_LIMIT = 20;

const STATUS_OPTIONS = [
  "DRAFT",
  "SUBMITTED",
  "APPROVED",
  "REJECTED",
  "RETURNED",
];

const STATUS_COLORS = {
  DRAFT: {
    bg: "rgba(148,163,184,.12)",
    text: "var(--text2)",
    border: "rgba(148,163,184,.25)",
  },
  SUBMITTED: {
    bg: "rgba(59,130,246,.12)",
    text: "#60A5FA",
    border: "rgba(59,130,246,.25)",
  },
  APPROVED: {
    bg: "rgba(34,197,94,.12)",
    text: "var(--green)",
    border: "rgba(34,197,94,.25)",
  },
  REJECTED: {
    bg: "rgba(239,68,68,.12)",
    text: "var(--red)",
    border: "rgba(239,68,68,.25)",
  },
  RETURNED: {
    bg: "rgba(234,179,8,.12)",
    text: "var(--yellow)",
    border: "rgba(234,179,8,.25)",
  },
};

const emptyFilters = () => ({
  status: null, // single string or null
  projects: [], // array of IDs
  spans: [], // array of IDs
  createdBy: [], // array of IDs
  fromDate: "",
  toDate: "",
});

// ─── helpers ──────────────────────────────────────────────────────
const toggleArr = (arr, id) =>
  arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];

const hasActiveFilters = (f) =>
  f.status ||
  f.projects.length ||
  f.spans.length ||
  f.createdBy.length ||
  f.fromDate ||
  f.toDate;

// ═══════════════════════════════════════════════════════════════════
export default function MyEntries() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState(emptyFilters());
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // ── Facets (dynamic options + counts) ───────────────────────────
  const { data: facetData, loading: facetLoading } = useQuery(
    EMB_ENTRY.facets,
    {
      variables: {
        status: filters.status || undefined,
        span: filters.spans.length ? filters.spans : undefined,
        project: filters.projects.length ? filters.projects : undefined,
        createdBy: filters.createdBy.length ? filters.createdBy : undefined,
      },
      fetchPolicy: "cache-and-network",
    },
  );

  const facets = useMemo(() => {
    const raw = facetData?.activitiesFacet ?? {};
    return {
      statusCount: raw.statusCount ?? [],
      projectCount: raw.projectCount ?? [],
      spanCount: raw.spanCount ?? [],
      createdByCount: raw.createdByCount ?? [],
      total: raw.totalDocuments ?? 0,
    };
  }, [facetData]);

  // ── Main list query ──────────────────────────────────────────────
  const { data, loading, error, refetch } = useQuery(EMB_ENTRY.list, {
    variables: {
      page,
      limit: PAGE_LIMIT,
      status: filters.status || undefined,
      span: filters.spans.length ? filters.spans : undefined,
      project: filters.projects.length ? filters.projects : undefined,
      createdBy: filters.createdBy.length ? filters.createdBy : undefined,
      fromDate: filters.fromDate || undefined,
      toDate: filters.toDate || undefined,
    },
    fetchPolicy: "cache-and-network",
  });

  const entries = data?.activities?.data ?? [];
  const pagination = data?.activities?.PaginationMetaData ?? {};
  const totalPages = pagination.totalPages ?? 1;

  // ── filter setters ────────────────────────────────────────────────
  const applyFilter = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(emptyFilters());
    setPage(1);
  };

  const active = hasActiveFilters(filters);

  return (
    <div className="fade-up">
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
          </div>
        }
      />

      {/* ── Filter Panel ── */}
      {panelOpen && (
        <FilterPanel
          filters={filters}
          facets={facets}
          facetLoading={facetLoading}
          onChange={applyFilter}
          onReset={resetFilters}
          onClose={() => setPanelOpen(false)}
        />
      )}

      {/* ── Active filter chips ── */}
      {active && (
        <ActiveChips
          filters={filters}
          facets={facets}
          onChange={applyFilter}
          onReset={resetFilters}
        />
      )}

      {/* ── Table card ── */}
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,.25)",
                borderRadius: 10,
                zIndex: 10,
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
                <button className="btn btn-outline" onClick={() => refetch()}>
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
                  <button className="btn btn-outline" onClick={resetFilters}>
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
            <EntriesTable filtered={entries} setSelected={setSelected} />
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        )}
      </div>

      {selected && (
        <EmbEntryDetailModal
          entry={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

// ── active filter count ───────────────────────────────────────────
function activeCount(f) {
  return (
    (f.status ? 1 : 0) +
    f.projects.length +
    f.spans.length +
    f.createdBy.length +
    (f.fromDate || f.toDate ? 1 : 0)
  );
}

// ═══════════════════════════════════════════════════════════════════
// FILTER PANEL
// ═══════════════════════════════════════════════════════════════════
function FilterPanel({
  filters,
  facets,
  facetLoading,
  onChange,
  onReset,
  onClose,
}) {
  return (
    <div
      className="card"
      style={{
        marginBottom: 14,
        padding: 18,
        border: "1px solid var(--accent)44",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          Filters
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={onReset}>
            Reset all
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      {/* ── Date range ── */}
      <Section label="Date range">
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>From</div>
            <input
              type="date"
              className="form-control"
              value={filters.fromDate}
              max={filters.toDate || undefined}
              onChange={(e) => onChange({ fromDate: e.target.value })}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>To</div>
            <input
              type="date"
              className="form-control"
              value={filters.toDate}
              min={filters.fromDate || undefined}
              onChange={(e) => onChange({ toDate: e.target.value })}
            />
          </div>
        </div>
      </Section>

      {/* ── Status (single select) ── */}
      <Section label="Status">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {facetLoading && <MiniSpinner />}
          {STATUS_OPTIONS.map((s) => {
            const facet = facets.statusCount.find((f) => f.status === s);
            const count = facet?.count ?? 0;
            const active = filters.status === s;
            const col = STATUS_COLORS[s];
            return (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ status: active ? null : s })}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: `1px solid ${active ? col.border : "var(--border)"}`,
                  background: active ? col.bg : "rgba(255,255,255,.03)",
                  color: active ? col.text : "var(--text2)",
                  transition: "all .15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span>{s}</span>
                <span
                  style={{
                    fontSize: 10,
                    background: "rgba(255,255,255,.1)",
                    borderRadius: 8,
                    padding: "1px 5px",
                    color: active ? col.text : "var(--text3)",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Projects (multi-select) ── */}
      <Section label="Project">
        <FacetMultiSelect
          items={facets.projectCount}
          selected={filters.projects}
          getId={(f) => f.project._id}
          getLabel={(f) => f.project.name}
          getSubLabel={(f) => f.project.code}
          getCount={(f) => f.count}
          loading={facetLoading}
          onChange={(id) =>
            onChange({ projects: toggleArr(filters.projects, id) })
          }
        />
      </Section>

      {/* ── Spans (multi-select) ── */}
      <Section label="Span">
        <FacetMultiSelect
          items={facets.spanCount}
          selected={filters.spans}
          getId={(f) => f.span._id}
          getLabel={(f) => f.span.name}
          getSubLabel={(f) => `${f.span.startPoint} → ${f.span.endPoint}`}
          getCount={(f) => f.count}
          loading={facetLoading}
          onChange={(id) => onChange({ spans: toggleArr(filters.spans, id) })}
        />
      </Section>

      {/* ── Created by (multi-select) ── */}
      <Section label="Field engineer">
        <FacetMultiSelect
          items={facets.createdByCount}
          selected={filters.createdBy}
          getId={(f) => f.createdBy._id}
          getLabel={(f) => f.createdBy.name}
          getSubLabel={(f) => f.createdBy.designation}
          getCount={(f) => f.count}
          loading={facetLoading}
          onChange={(id) =>
            onChange({ createdBy: toggleArr(filters.createdBy, id) })
          }
        />
      </Section>
    </div>
  );
}

// ── reusable facet multi-select chip list ─────────────────────────
function FacetMultiSelect({
  items,
  selected,
  getId,
  getLabel,
  getSubLabel,
  getCount,
  loading,
  onChange,
}) {
  if (loading) return <MiniSpinner />;
  if (!items.length)
    return (
      <div style={{ fontSize: 11, color: "var(--text3)" }}>No options</div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {items.map((item) => {
        const id = getId(item);
        const active = selected.includes(id);
        return (
          <div
            key={id}
            onClick={() => onChange(id)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all .12s",
              background: active
                ? "rgba(244,160,28,.1)"
                : "rgba(255,255,255,.02)",
              border: `1px solid ${active ? "rgba(244,160,28,.35)" : "var(--border)"}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  flexShrink: 0,
                  border: `2px solid ${active ? "var(--accent)" : "var(--border)"}`,
                  background: active ? "var(--accent)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {active && (
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--navy)",
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: active ? "var(--accent)" : "var(--text)",
                  }}
                >
                  {getLabel(item)}
                </div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>
                  {getSubLabel(item)}
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                minWidth: 24,
                textAlign: "center",
                padding: "1px 6px",
                borderRadius: 10,
                background: active
                  ? "rgba(244,160,28,.2)"
                  : "rgba(255,255,255,.06)",
                color: active ? "var(--accent)" : "var(--text3)",
              }}
            >
              {getCount(item)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── active filter chips bar ───────────────────────────────────────
function ActiveChips({ filters, facets, onChange, onReset }) {
  const chips = [];

  if (filters.status) {
    chips.push({
      key: "status",
      label: filters.status,
      onRemove: () => onChange({ status: null }),
    });
  }

  if (filters.fromDate || filters.toDate) {
    chips.push({
      key: "date",
      label: `${filters.fromDate || "…"} → ${filters.toDate || "…"}`,
      onRemove: () => onChange({ fromDate: "", toDate: "" }),
    });
  }

  filters.projects.forEach((id) => {
    const f = facets.projectCount.find((x) => x.project._id === id);
    chips.push({
      key: `proj-${id}`,
      label: f ? f.project.name : id,
      onRemove: () =>
        onChange({ projects: filters.projects.filter((x) => x !== id) }),
    });
  });

  filters.spans.forEach((id) => {
    const f = facets.spanCount.find((x) => x.span._id === id);
    chips.push({
      key: `span-${id}`,
      label: f ? f.span.name : id,
      onRemove: () =>
        onChange({ spans: filters.spans.filter((x) => x !== id) }),
    });
  });

  filters.createdBy.forEach((id) => {
    const f = facets.createdByCount.find((x) => x.createdBy._id === id);
    chips.push({
      key: `by-${id}`,
      label: f ? f.createdBy.name : id,
      onRemove: () =>
        onChange({ createdBy: filters.createdBy.filter((x) => x !== id) }),
    });
  });

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 12,
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: 11, color: "var(--text3)" }}>Active:</span>
      {chips.map((chip) => (
        <span
          key={chip.key}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 10px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            background: "rgba(244,160,28,.12)",
            border: "1px solid rgba(244,160,28,.3)",
            color: "var(--accent)",
          }}
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--accent)",
              fontSize: 13,
              lineHeight: 1,
              padding: 0,
            }}
          >
            ×
          </button>
        </span>
      ))}
      <button
        onClick={onReset}
        style={{
          fontSize: 11,
          color: "var(--text3)",
          background: "none",
          border: "none",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        Clear all
      </button>
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────────────
function Pagination({ page, totalPages, onChange }) {
  const pages = [];

  // Show max 7 page pills: first, last, current ±2, ellipsis
  const addPage = (n) => {
    if (!pages.includes(n) && n >= 1 && n <= totalPages) pages.push(n);
  };
  [1, totalPages, page - 2, page - 1, page, page + 1, page + 2]
    .sort((a, b) => a - b)
    .forEach(addPage);

  const display = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) display.push("…");
    display.push(p);
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: "14px 0 0",
        borderTop: "1px solid var(--border)",
      }}
    >
      <button
        className="btn btn-ghost btn-sm"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        style={{ padding: "4px 10px" }}
      >
        ← Prev
      </button>

      {display.map((p, i) =>
        p === "…" ? (
          <span
            key={`el-${i}`}
            style={{ fontSize: 12, color: "var(--text3)", padding: "0 4px" }}
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              border: "1px solid",
              borderColor: p === page ? "var(--accent)" : "var(--border)",
              background:
                p === page ? "rgba(244,160,28,.15)" : "rgba(255,255,255,.03)",
              color: p === page ? "var(--accent)" : "var(--text2)",
              transition: "all .12s",
            }}
          >
            {p}
          </button>
        ),
      )}

      <button
        className="btn btn-ghost btn-sm"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        style={{ padding: "4px 10px" }}
      >
        Next →
      </button>
    </div>
  );
}

// ── tiny helpers ───────────────────────────────────────────────────
function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={labelStyle}>{label}</div>
      {children}
    </div>
  );
}

function MiniSpinner() {
  return (
    <div style={{ fontSize: 11, color: "var(--text3)", padding: "4px 0" }}>
      Loading options…
    </div>
  );
}

const labelStyle = {
  fontSize: 10,
  color: "var(--text2)",
  textTransform: "uppercase",
  letterSpacing: ".07em",
  marginBottom: 6,
  fontWeight: 600,
};
