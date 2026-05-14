// ═══════════════════════════════════════════════════════════════════
// entryFilters.jsx — shared filter UI for MyEntries and PAEntries
//
// Exports:
//   constants : PAGE_LIMIT, emptyFilters, toggleArr,
//               hasActiveFilters, activeCount
//   components: FilterPanel, ActiveChips, Pagination,
//               useFacets (custom hook)
// ═══════════════════════════════════════════════════════════════════
import { useState, useMemo, useRef } from "react";
import { useQuery } from "@apollo/client";
import { EMB_ENTRY } from "../../apollo/gql.js";

// ─── constants ────────────────────────────────────────────────────
export const PAGE_LIMIT = 20;

// Full set — consumers pass the subset they want (e.g. PA omits DRAFT)
export const ALL_STATUS_OPTIONS = [
  "DRAFT",
  "SUBMITTED",
  "APPROVED",
  "REJECTED",
  "RETURNED",
];

export const STATUS_COLORS = {
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

export const emptyFilters = () => ({
  status: null, // string | null
  projects: [], // string[]
  spans: [], // string[]
  createdBy: [], // string[]
  fromDate: "",
  toDate: "",
});

export const toggleArr = (arr, id) =>
  arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];

export const hasActiveFilters = (f) =>
  f.status ||
  f.projects.length ||
  f.spans.length ||
  f.createdBy.length ||
  f.fromDate ||
  f.toDate;

export const activeCount = (f) =>
  (f.status ? 1 : 0) +
  f.projects.length +
  f.spans.length +
  f.createdBy.length +
  (f.fromDate || f.toDate ? 1 : 0);

// ─── useFacets ────────────────────────────────────────────────────
// Always fetches with no variables so the server aggregation is never
// narrowed by current selections (that was the root cause of options
// disappearing after selection). The labelCache ref survives re-renders
// so chip labels are always human-readable even if a later query would
// narrow the result set.
export function useFacets() {
  const labelCache = useRef({ projects: {}, spans: {}, createdBy: {} });

  const { data, loading, error, refetch } = useQuery(EMB_ENTRY.facets, {
    variables: {},
    fetchPolicy: "cache-and-network",
  });

  const facets = useMemo(() => {
    const raw = data?.activitiesFacet ?? {};
    const fc = {
      statusCount: raw.statusCount ?? [],
      projectCount: raw.projectCount ?? [],
      spanCount: raw.spanCount ?? [],
      createdByCount: raw.createdByCount ?? [],
      total: raw.totalDocuments ?? 0,
    };

    // Populate cache while data is fresh
    fc.projectCount.forEach(({ project: p }) => {
      if (p?._id)
        labelCache.current.projects[p._id] = { name: p.name, code: p.code };
    });
    fc.spanCount.forEach(({ span: s }) => {
      if (s?._id)
        labelCache.current.spans[s._id] = {
          name: s.name,
          startPoint: s.startPoint,
          endPoint: s.endPoint,
        };
    });
    fc.createdByCount.forEach(({ createdBy: u }) => {
      if (u?._id)
        labelCache.current.createdBy[u._id] = {
          name: u.name,
          designation: u.designation,
        };
    });

    return fc;
  }, [data]);

  return {
    facets,
    facetLoading: loading,
    facetError: error,
    refetchFacets: refetch,
    labelCache: labelCache.current,
  };
}

// ═══════════════════════════════════════════════════════════════════
// FilterPanel
// Props:
//   filters, facets, facetLoading, onChange, onReset, onClose
//   statusOptions – which statuses to show (default: ALL_STATUS_OPTIONS)
// ═══════════════════════════════════════════════════════════════════
export function FilterPanel({
  role,
  filters,
  facets,
  facetLoading,
  onChange,
  onReset,
  onClose,
  statusOptions = ALL_STATUS_OPTIONS,
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

      {/* Date range */}
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

      {/* Status — single select */}
      <Section label="Status">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {facetLoading && <MiniSpinner />}
          {statusOptions.map((s) => {
            const count =
              facets.statusCount.find((f) => f.status === s)?.count ?? 0;
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
                  transition: "all .15s",
                  border: `1px solid ${active ? col.border : "var(--border)"}`,
                  background: active ? col.bg : "rgba(255,255,255,.03)",
                  color: active ? col.text : "var(--text2)",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span>{s}</span>
                <span
                  style={{
                    fontSize: 10,
                    borderRadius: 8,
                    padding: "1px 5px",
                    background: "rgba(255,255,255,.1)",
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

      {/* Projects */}
      <Section label="Project">
        <FacetMultiSelect
          items={facets.projectCount}
          selected={filters.projects}
          getId={(f) => f.project._id}
          getLabel={(f) => f.project.name}
          getSubLabel={(f) => f.project.code}
          getCount={(f) => f.count}
          searchPlaceholder="Search projects…"
          loading={facetLoading}
          onChange={(id) =>
            onChange({ projects: toggleArr(filters.projects, id) })
          }
        />
      </Section>

      {/* Spans */}
      <Section label="Span">
        <FacetMultiSelect
          items={facets.spanCount}
          selected={filters.spans}
          getId={(f) => f.span._id}
          getLabel={(f) => f.span.name}
          getSubLabel={(f) => `${f.span.startPoint} → ${f.span.endPoint}`}
          getCount={(f) => f.count}
          searchPlaceholder="Search spans…"
          loading={facetLoading}
          onChange={(id) => onChange({ spans: toggleArr(filters.spans, id) })}
        />
      </Section>

      {/* Field engineers */}
      {role === "project-admin" && (
        <Section label="Field engineer">
          <FacetMultiSelect
            items={facets.createdByCount}
            selected={filters.createdBy}
            getId={(f) => f.createdBy._id}
            getLabel={(f) => f.createdBy.name}
            getSubLabel={(f) => f.createdBy.designation}
            getCount={(f) => f.count}
            searchPlaceholder="Search engineers…"
            loading={facetLoading}
            onChange={(id) =>
              onChange({ createdBy: toggleArr(filters.createdBy, id) })
            }
          />
        </Section>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FacetMultiSelect — searchable, scrollable, selected chips bar
// ═══════════════════════════════════════════════════════════════════
function FacetMultiSelect({
  items,
  selected,
  getId,
  getLabel,
  getSubLabel,
  getCount,
  loading,
  onChange,
  searchPlaceholder = "Search…",
}) {
  const [query, setQuery] = useState("");

  if (loading) return <MiniSpinner />;
  if (!items.length)
    return (
      <div style={{ fontSize: 11, color: "var(--text3)" }}>No options</div>
    );

  const q = query.toLowerCase();
  const filtered = q
    ? items.filter(
        (item) =>
          getLabel(item).toLowerCase().includes(q) ||
          getSubLabel(item).toLowerCase().includes(q),
      )
    : items;

  const selectedItems = items.filter((item) => selected.includes(getId(item)));

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {/* Search row — only when list is long enough to need it */}
      {items.length > 4 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 10px",
            borderBottom: "1px solid var(--border)",
            background: "rgba(255,255,255,.02)",
          }}
        >
          <span style={{ fontSize: 12, color: "var(--text3)", flexShrink: 0 }}>
            🔍
          </span>
          <input
            className="form-control"
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              fontSize: 12,
              flex: 1,
            }}
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text3)",
                fontSize: 13,
                lineHeight: 1,
                padding: 0,
              }}
            >
              ✕
            </button>
          )}
          <span
            style={{
              fontSize: 10,
              color: "var(--text3)",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {filtered.length}/{items.length}
          </span>
        </div>
      )}

      {/* Scrollable list */}
      <div style={{ maxHeight: 220, overflowY: "auto" }}>
        {filtered.length === 0 ? (
          <div
            style={{
              padding: "14px 10px",
              fontSize: 12,
              color: "var(--text3)",
              textAlign: "center",
            }}
          >
            No matches for "{query}"
          </div>
        ) : (
          filtered.map((item) => {
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
                  padding: "8px 10px",
                  cursor: "pointer",
                  transition: "background .1s",
                  background: active ? "rgba(244,160,28,.08)" : "transparent",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 3,
                      flexShrink: 0,
                      transition: "all .12s",
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
                          lineHeight: 1,
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
                        fontWeight: active ? 600 : 400,
                        color: active ? "var(--accent)" : "var(--text)",
                      }}
                    >
                      {getLabel(item)}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--text3)",
                        marginTop: 1,
                      }}
                    >
                      {getSubLabel(item)}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "1px 6px",
                    borderRadius: 10,
                    flexShrink: 0,
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
          })
        )}
      </div>

      {/* Selected chips pinned at bottom of this section */}
      {selectedItems.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            padding: "6px 10px",
            borderTop: "1px solid var(--border)",
            background: "rgba(255,255,255,.02)",
          }}
        >
          {selectedItems.map((item) => {
            const id = getId(item);
            return (
              <span
                key={id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 8px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  background: "rgba(244,160,28,.12)",
                  border: "1px solid rgba(244,160,28,.3)",
                  color: "var(--accent)",
                }}
              >
                {getLabel(item)}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(id);
                  }}
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
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ActiveChips — colour-coded by type, names from labelCache
// Props: filters, labelCache, onChange, onReset
// ═══════════════════════════════════════════════════════════════════
const CHIP_STYLES = {
  status: {
    bg: "rgba(34,197,94,.1)",
    border: "rgba(34,197,94,.3)",
    color: "var(--green)",
  },
  date: {
    bg: "rgba(234,179,8,.1)",
    border: "rgba(234,179,8,.3)",
    color: "var(--yellow)",
  },
  proj: {
    bg: "rgba(59,130,246,.1)",
    border: "rgba(59,130,246,.3)",
    color: "#60A5FA",
  },
  span: {
    bg: "rgba(255,255,255,.06)",
    border: "var(--border)",
    color: "var(--text2)",
  },
  user: {
    bg: "rgba(255,255,255,.06)",
    border: "var(--border)",
    color: "var(--text2)",
  },
};

export function ActiveChips({ filters, labelCache, onChange, onReset }) {
  const chips = [];

  if (filters.status)
    chips.push({
      key: "status",
      type: "status",
      label: filters.status,
      onRemove: () => onChange({ status: null }),
    });

  if (filters.fromDate || filters.toDate)
    chips.push({
      key: "date",
      type: "date",
      label: [
        filters.fromDate ? `from ${filters.fromDate}` : null,
        filters.toDate ? `to ${filters.toDate}` : null,
      ]
        .filter(Boolean)
        .join("  →  "),
      onRemove: () => onChange({ fromDate: "", toDate: "" }),
    });

  filters.projects.forEach((id) => {
    const c = labelCache.projects[id];
    chips.push({
      key: `proj-${id}`,
      type: "proj",
      label: c ? `${c.name} (${c.code})` : "Project",
      onRemove: () =>
        onChange({ projects: filters.projects.filter((x) => x !== id) }),
    });
  });

  filters.spans.forEach((id) => {
    const c = labelCache.spans[id];
    chips.push({
      key: `span-${id}`,
      type: "span",
      label: c ? c.name : "Span",
      onRemove: () =>
        onChange({ spans: filters.spans.filter((x) => x !== id) }),
    });
  });

  filters.createdBy.forEach((id) => {
    const c = labelCache.createdBy[id];
    chips.push({
      key: `by-${id}`,
      type: "user",
      label: c ? `${c.name} · ${c.designation}` : "Engineer",
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
      {chips.map((chip) => {
        const s = CHIP_STYLES[chip.type];
        return (
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
              background: s.bg,
              border: `1px solid ${s.border}`,
              color: s.color,
            }}
          >
            {chip.label}
            <button
              onClick={chip.onRemove}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: s.color,
                fontSize: 13,
                lineHeight: 1,
                padding: 0,
              }}
            >
              ×
            </button>
          </span>
        );
      })}
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

// ═══════════════════════════════════════════════════════════════════
// Pagination
// ═══════════════════════════════════════════════════════════════════
export function Pagination({ page, totalPages, onChange }) {
  const pages = [];
  const add = (n) => {
    if (!pages.includes(n) && n >= 1 && n <= totalPages) pages.push(n);
  };
  [1, totalPages, page - 2, page - 1, page, page + 1, page + 2]
    .sort((a, b) => a - b)
    .forEach(add);
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

// ── tiny private helpers ───────────────────────────────────────────
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
