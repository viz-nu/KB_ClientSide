// ═══════════════════════════════════════════════════════════════════
// entryFilters.jsx — shared filter UI for MyEntries and PAEntries
//
// Exports:
//   constants : PAGE_LIMIT, emptyEntryFilters, emptySpanFilters, toggleArr,
//               hasActiveEntryFilters, hasActiveSpanFilters, activeCountEntry, activeCountSpan
//   components: FilterPanel, ActiveChips, Pagination,
//               useFacets (custom hook)
// ═══════════════════════════════════════════════════════════════════
import { useState, useMemo, useRef } from "react";
import { useQuery } from "@apollo/client";
import { EMB_ENTRY, SPAN_QUERIES } from "../../apollo/gql.js";

// ─── constants ────────────────────────────────────────────────────
export const PAGE_LIMIT = 20;

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

export const emptyEntryFilters = () => ({
  status: null, // string | null
  projects: [], // string[]
  spans: [], // string[]
  createdBy: [], // string[]
  fromDate: "",
  toDate: "",
});
export const emptySpanFilters = () => ({
  status: null, // string | null
  projects: [], // string[]
  endPoints: [], // string[]
  startPoints: [], // string[]
});

export const toggleArr = (arr, id) =>
  arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];

export const hasActiveEntryFilters = (f) =>
  f.status ||
  f.projects.length ||
  f.spans.length ||
  f.createdBy.length ||
  f.fromDate ||
  f.toDate;

export const hasActiveSpanFilters = (f) =>
  f.status || f.projects.length || f.startPoints.length || f.endPoints.length;

export const activeCountEntry = (f) =>
  (f.status ? 1 : 0) +
  f.projects.length +
  f.spans.length +
  f.createdBy.length +
  (f.fromDate || f.toDate ? 1 : 0);

  export const activeCountSpan = (f) =>
    (f.status ? 1 : 0) +
    f.projects.length +
    (f.startPoint || f.endPoint ? 1 : 0);

// ─── useFacets ────────────────────────────────────────────────────
// Always fetches with no variables so the server aggregation is never
// narrowed by current selections (that was the root cause of options
// disappearing after selection). The labelCache ref survives re-renders
// so chip labels are always human-readable even if a later query would
// narrow the result set.
export function useFacets(entity = "EMB_ENTRY") {
  const embResult = useFacetsEMB_ENTRY();
  const spanResult = useFacetsSPAN();

  return entity === "SPAN" ? spanResult : embResult;
}

function useFacetsSPAN() {
  const labelCache = useRef({ projects: {}, startPoints: {}, endPoints: {} });

  const { data, loading, error, refetch } = useQuery(SPAN_QUERIES.facets, {
    variables: {},
    fetchPolicy: "cache-and-network",
  });

  const facets = useMemo(() => {
    const raw = data?.spansFacet ?? {};
    const fc = {
      statusCount:     raw.statusCount     ?? [],
      projectCount:    raw.projectCount    ?? [],
      startPointCount: raw.startPointCount ?? [],
      endPointCount:   raw.endPointCount   ?? [],
    };

    // Populate cache so ActiveChips can resolve labels
    fc.projectCount.forEach(({ project: p }) => {
      if (p?._id)
        labelCache.current.projects[p._id] = { name: p.name, code: p.code };
    });

    // facet-string types use the value itself as both id and label,
    // but caching them lets ActiveChips confirm they exist
    fc.startPointCount.forEach(({ startPoint }) => {
      if (startPoint)
        labelCache.current.startPoints[startPoint] = { name: startPoint };
    });
    fc.endPointCount.forEach(({ endPoint }) => {
      if (endPoint)
        labelCache.current.endPoints[endPoint] = { name: endPoint };
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

function useFacetsEMB_ENTRY() {
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

export function FilterPanel({
  role,
  filters,
  facets,
  facetLoading,
  onChange,
  onReset,
  onClose,
  sections = [],           // ← receives the config array, renders nothing extra
}) {
  return (
    <div className="card" style={{ marginBottom: 14, padding: 18, border: "1px solid var(--accent)44" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14 }}>Filters</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={onReset}>Reset all</button>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
      </div>


      {/* Dynamic sections */}
      {sections.map((sec) => {
        // Role gate
        if (sec.role && sec.role !== role) return null;

        if (sec.type === "status") {
          return (
            <Section key={sec.key} label={sec.label}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {facetLoading && <MiniSpinner />}
                {sec.statusOptions.map((s) => {
                  console.log(facets.statusCount);
                  const count = facets.statusCount?.find((f) => f.status === s)?.count ?? 0;
                  const active = filters.status === s;
                  const col = STATUS_COLORS[s] ?? STATUS_COLORS.default;
                  return (
                    <button key={s} type="button"
                      onClick={() => onChange({ status: active ? null : s })}
                      style={{
                        padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                        cursor: "pointer", transition: "all .15s",
                        border: `1px solid ${active ? col.border : "var(--border)"}`,
                        background: active ? col.bg : "rgba(255,255,255,.03)",
                        color: active ? col.text : "var(--text2)",
                        display: "flex", alignItems: "center", gap: 5,
                      }}
                    >
                      <span>{s}</span>
                      <span style={{ fontSize: 10, borderRadius: 8, padding: "1px 5px", background: "rgba(255,255,255,.1)", color: active ? col.text : "var(--text3)" }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Section>
          );
        }

        if (sec.type === "facet-multi") {
          // Pull the right array from facets, unwrap the nested entity
          const rawItems = facets[sec.facetKey] ?? [];
          const items = rawItems.map((row) => ({
            id:    sec.getId(row[sec.entityKey]),
            label: sec.getLabel(row[sec.entityKey]),
            sub:   sec.getSub(row[sec.entityKey]),
            count: row.count,
          }));

          return (
            <Section key={sec.key} label={sec.label}>
              <FacetMultiSelect
                items={items}
                selected={filters[sec.filterKey] ?? []}
                loading={facetLoading}
                onChange={(id) =>
                  onChange({ [sec.filterKey]: toggleArr(filters[sec.filterKey] ?? [], id) })
                }
              />
            </Section>
          );
        }
        if (sec.type === "date-range") {
          return (
            <Section key={sec.key} label={sec.label}>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={labelStyle}>From</div>
                  <input type="date" className="form-control"
                    value={filters[sec.fromKey] ?? ""}
                    max={filters[sec.toKey] || undefined}
                    onChange={(e) => onChange({ [sec.fromKey]: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={labelStyle}>To</div>
                  <input type="date" className="form-control"
                    value={filters[sec.toKey] ?? ""}
                    min={filters[sec.fromKey] || undefined}
                    onChange={(e) => onChange({ [sec.toKey]: e.target.value })}
                  />
                </div>
              </div>
            </Section>
          );
        }
        if (sec.type === "facet-string") {
          const rawItems = facets[sec.facetKey] ?? [];
          // each row is e.g. { count: 1, startPoint: "SCR" }
          const items = rawItems.map((row) => ({
            id:    row[sec.valueKey],   // the string itself is the id
            label: row[sec.valueKey],
            sub:   null,
            count: row.count,
          }));
        
          return (
            <Section key={sec.key} label={sec.label}>
              <FacetMultiSelect
                items={items}
                selected={filters[sec.filterKey] ?? []}
                loading={facetLoading}
                onChange={(id) =>
                  onChange({ [sec.filterKey]: toggleArr(filters[sec.filterKey] ?? [], id) })
                }
              />
            </Section>
          );
        }
        return null;
      })}
    </div>
  );
}
function FacetMultiSelect({ items, selected, loading, onChange }) {
  const [query, setQuery] = useState("");
  if (loading) return <MiniSpinner />;
  if (!items.length) return <div style={{ fontSize: 11, color: "var(--text3)" }}>No options</div>;

  const q = query.toLowerCase();
  const filtered = q
    ? items.filter((i) => i.label.toLowerCase().includes(q) || i.sub?.toLowerCase().includes(q))
    : items;

  const selectedItems = items.filter((i) => selected.includes(i.id));

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      {items.length > 4 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,.02)" }}>
          <span style={{ fontSize: 12, color: "var(--text3)", flexShrink: 0 }}>🔍</span>
          <input className="form-control" style={{ border: "none", background: "transparent", padding: 0, fontSize: 12, flex: 1 }}
            placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
          {query && <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: 13, padding: 0 }}>✕</button>}
          <span style={{ fontSize: 10, color: "var(--text3)", whiteSpace: "nowrap", flexShrink: 0 }}>{filtered.length}/{items.length}</span>
        </div>
      )}

      <div style={{ maxHeight: 220, overflowY: "auto" }}>
        {filtered.length === 0
          ? <div style={{ padding: "14px 10px", fontSize: 12, color: "var(--text3)", textAlign: "center" }}>No matches for "{query}"</div>
          : filtered.map((item) => {
            const active = selected.includes(item.id);
            return (
              <div key={item.id} onClick={() => onChange(item.id)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", cursor: "pointer", transition: "background .1s", background: active ? "rgba(244,160,28,.08)" : "transparent", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 3, flexShrink: 0, border: `2px solid ${active ? "var(--accent)" : "var(--border)"}`, background: active ? "var(--accent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {active && <span style={{ fontSize: 10, color: "var(--navy)", fontWeight: 700, lineHeight: 1 }}>✓</span>}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "var(--accent)" : "var(--text)" }}>{item.label}</div>
                    {item.sub && <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>{item.sub}</div>}
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "1px 6px", borderRadius: 10, flexShrink: 0, background: active ? "rgba(244,160,28,.2)" : "rgba(255,255,255,.06)", color: active ? "var(--accent)" : "var(--text3)" }}>
                  {item.count}
                </span>
              </div>
            );
          })
        }
      </div>

      {selectedItems.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "6px 10px", borderTop: "1px solid var(--border)", background: "rgba(255,255,255,.02)" }}>
          {selectedItems.map((item) => (
            <span key={item.id} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "rgba(244,160,28,.12)", border: "1px solid rgba(244,160,28,.3)", color: "var(--accent)" }}>
              {item.label}
              <button onClick={(e) => { e.stopPropagation(); onChange(item.id); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontSize: 13, lineHeight: 1, padding: 0 }}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ActiveChips — colour-coded by type, names from labelCache
// Props: filters, labelCache, onChange, onReset
// ═══════════════════════════════════════════════════════════════════


export function ActiveChips({ filters, sections, labelCache, onChange, onReset }) {
  const chips = [];

  sections.forEach((sec) => {
    if (sec.role) return; // role-gated sections handle themselves at render time

    if (sec.type === "status" && filters.status) {
      chips.push({
        key: "status",
        type: "status",
        label: filters.status,
        onRemove: () => onChange({ status: null }),
      });
    }

    if (sec.type === "date-range") {
      const { fromKey, toKey } = sec;
      if (filters[fromKey] || filters[toKey]) {
        chips.push({
          key: "date",
          type: "date",
          label: [
            filters[fromKey] ? `from ${filters[fromKey]}` : null,
            filters[toKey]   ? `to ${filters[toKey]}`     : null,
          ].filter(Boolean).join("  →  "),
          onRemove: () => onChange({ [fromKey]: "", [toKey]: "" }),
        });
      }
    }

    if (sec.type === "facet-multi") {
      const selected = filters[sec.filterKey] ?? [];
      selected.forEach((id) => {
        // labelCache is keyed by filterKey → id → { name, ... }
        const cached = labelCache[sec.filterKey]?.[id];
        chips.push({
          key: `${sec.key}-${id}`,
          type: sec.key,
          label: cached
            ? sec.getChipLabel?.(cached) ?? cached.name
            : sec.label,
          onRemove: () =>
            onChange({ [sec.filterKey]: selected.filter((x) => x !== id) }),
        });
      });
    }

    if (sec.type === "facet-string") {
      const selected = filters[sec.filterKey] ?? [];
      selected.forEach((val) => {
        chips.push({
          key: `${sec.key}-${val}`,
          type: sec.key,
          label: val,
          onRemove: () =>
            onChange({ [sec.filterKey]: selected.filter((x) => x !== val) }),
        });
      });
    }
  });

  if (!chips.length) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12, alignItems: "center" }}>
      <span style={{ fontSize: 11, color: "var(--text3)" }}>Active:</span>
      {chips.map((chip) => {
        const s = chip.chipStyle ?? {
          bg:     "rgba(255,255,255,.06)",
          border: "var(--border)",
          color:  "var(--text2)",
        };
        return (
          <span
            key={chip.key}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
              background: s.bg, border: `1px solid ${s.border}`, color: s.color,
            }}
          >
            {chip.label}
            <button
              onClick={chip.onRemove}
              style={{ background: "none", border: "none", cursor: "pointer", color: s.color, fontSize: 13, lineHeight: 1, padding: 0 }}
            >
              ×
            </button>
          </span>
        );
      })}
      <button
        onClick={onReset}
        style={{ fontSize: 11, color: "var(--text3)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
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
