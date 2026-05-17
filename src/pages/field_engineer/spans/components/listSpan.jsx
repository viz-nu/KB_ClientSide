// ═══════════════════════════════════════════════════════════════════
// SPAN LIST — Dense table, scales to hundreds of rows.
// Props:
//   spans     – array of span objects
//   projects  – array of project objects (for name resolution)
//   loading   – boolean
//   onView    – (span) => void
//   onCreate  – () => void
// ═══════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  EmptyState,
  Spinner,
} from "../../../../components/common/index.jsx";
import { PROGRESS_STAGES } from "../../../../constants/spanConstants.js";
import {
  activeCountSpan,
  FilterPanel,
  hasActiveSpanFilters,
  useFacets,
  ActiveChips
} from "../../../../components/common/EntryFilters.jsx";
import { SPAN_FILTER_SECTIONS } from "../../../../constants/FilterConstants.js";
export function SpanList({
  spans = [],
  projects = [],
  loading,
  onView,
  filters,
  applyFilter,
  resetFilters,
}) {
  const { facets, facetLoading, labelCache } = useFacets("SPAN");
  const navigate = useNavigate();
  const [panelOpen, setPanelOpen] = useState(false);
  const completedCount = spans.filter((s) => s.status === "COMPLETED").length;
  const active = hasActiveSpanFilters(filters);
  return (
    <div className="fade-up">
      <PageHeader
        title="Span Management"
        subtitle={`${spans.length} span${spans.length !== 1 ? "s" : ""} · ${completedCount} completed`}
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
              ⚙ Filters {active ? ` (${activeCountSpan(filters)})` : ""}
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/new-entry")}>+ New Entry</button>
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
          statusOptions={["IN_PROGRESS", "COMPLETED", "CANCELLED", "PENDING"]}
          sections={SPAN_FILTER_SECTIONS}
        />
      )}
      {active && (
        <ActiveChips
          sections={SPAN_FILTER_SECTIONS}
          filters={filters}
          labelCache={labelCache}
          onChange={applyFilter}
          onReset={resetFilters}
        />
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Spinner size={32} />
        </div>
      ) : spans.length === 0 ? (
        <EmptyState
          icon="🛤️"
          title="No spans yet"
          message="Wait untill the project admin assigns you  a span."
        />
      ) : (
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            overflow: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
              minWidth: 900,
            }}
          >
            <colgroup>
              <col style={{ width: "16%" }} /> {/* Name */}
              <col style={{ width: "10%" }} /> {/* Project */}
              <col style={{ width: "18%" }} /> {/* Route */}
              <col style={{ width: "10%" }} /> {/* Status */}
              <col style={{ width: "13%" }} /> {/* Budget utilisation */}
              <col style={{ width: "7%" }} /> {/* Chapters */}
              <col style={{ width: "9%" }} /> {/* Created */}
              <col style={{ width: "9%" }} /> {/* Updated */}
              <col style={{ width: "8%" }} /> {/* Actions */}
            </colgroup>

            <thead>
              <tr style={{ background: "rgba(255,255,255,.03)" }}>
                {[
                  "Name",
                  "Project",
                  "Route",
                  "Status",
                  "Budget utilisation",
                  "Chapters",
                  "Created",
                  "Updated",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text3)",
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                      borderBottom: "1px solid var(--border)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {spans.map((s, idx) => (
                <SpanRow
                  key={s._id}
                  span={s}
                  project={projects.find(
                    (p) => p._id === (s.projectId || s.project?._id),
                  )}
                  isLast={idx === spans.length - 1}
                  onView={() => onView(s)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── SpanRow ───────────────────────────────────────────────────────
function SpanRow({ span: s, project, isLast, onView }) {
  const navigate = useNavigate();
  const stage =
    PROGRESS_STAGES.find((p) => p.value === s.status) || PROGRESS_STAGES[0];
  const spentPct =
    s.Vault?.allotedBudjet > 0
      ? Math.min(
          100,
          Math.round((s.Vault.spentBudjet / s.Vault.allotedBudjet) * 100),
        )
      : null;
  const barColor =
    spentPct > 85
      ? "var(--red)"
      : spentPct > 60
        ? "var(--yellow)"
        : "var(--green)";

  const cellStyle = {
    padding: "11px 14px",
    borderBottom: isLast ? "none" : "1px solid var(--border2)",
    fontSize: 13,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
  };

  return (
    <tr
      style={{ cursor: "pointer", transition: "background .1s" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,.03)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      onClick={onView}
    >
      {/* Name */}
      <td style={{ ...cellStyle, fontWeight: 600, color: "var(--text)" }}>
        {s.name}
      </td>

      {/* Project */}
      <td style={cellStyle}>
        {project ? (
          <code
            style={{
              fontSize: 11,
              color: "var(--accent)",
              fontWeight: 600,
              background: "rgba(244,160,28,.1)",
              border: "1px solid rgba(244,160,28,.2)",
              borderRadius: 5,
              padding: "2px 6px",
            }}
          >
            {project.code}
          </code>
        ) : (
          <span style={{ color: "var(--text3)" }}>—</span>
        )}
      </td>

      {/* Route */}
      <td style={{ ...cellStyle, whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            style={{
              maxWidth: 90,
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {s.startPoint?.placeName || "—"}
          </span>
          <span style={{ color: "var(--text3)", fontSize: 12, flexShrink: 0 }}>
            →
          </span>
          <span
            style={{
              maxWidth: 90,
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: 12,
              color: "var(--text2)",
            }}
          >
            {s.endPoint?.placeName || "—"}
          </span>
        </div>
      </td>

      {/* Status */}
      <td style={cellStyle}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: stage.color,
            background: stage.color + "18",
            border: `1px solid ${stage.color}44`,
            padding: "2px 8px",
            borderRadius: 10,
            whiteSpace: "nowrap",
          }}
        >
          ● {stage.label}
        </span>
      </td>

      {/* Budget utilisation */}
      <td style={cellStyle}>
        {spentPct !== null ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                flex: 1,
                height: 5,
                background: "rgba(255,255,255,.08)",
                borderRadius: 3,
                overflow: "hidden",
                minWidth: 60,
              }}
            >
              <div
                style={{
                  width: `${spentPct}%`,
                  height: "100%",
                  background: barColor,
                  borderRadius: 3,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                color: barColor,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {spentPct}%
            </span>
          </div>
        ) : (
          <span style={{ color: "var(--text3)", fontSize: 12 }}>No budget</span>
        )}
      </td>

      {/* Chapters */}
      <td style={{ ...cellStyle, textAlign: "center" }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text2)",
            background: "rgba(255,255,255,.06)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "2px 8px",
          }}
        >
          {s.chapters?.length ?? 0}
        </span>
      </td>

      {/* Created */}
      <td style={{ ...cellStyle, fontSize: 11, color: "var(--text3)" }}>
        {s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-IN") : "—"}
      </td>

      {/* Updated */}
      <td style={{ ...cellStyle, fontSize: 11, color: "var(--text3)" }}>
        {s.updatedAt ? new Date(s.updatedAt).toLocaleDateString("en-IN") : "—"}
      </td>

      {/* Actions */}
      <td style={cellStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", gap: 4 }}>
          <ActionBtn title="View" onClick={onView}>
            👁
          </ActionBtn>
          <ActionBtn
            title="New entry"
            onClick={() => navigate(`/new-entry?spanId=${s._id}`)}
          >
            ➕
          </ActionBtn>
        </div>
      </td>
    </tr>
  );
}

function ActionBtn({ children, onClick, title, danger }) {
  return (
    <button
      className={`btn btn-sm ${danger ? "btn-danger" : "btn-outline"}`}
      title={title}
      onClick={onClick}
      style={{ padding: "3px 7px", fontSize: 12, lineHeight: 1 }}
    >
      {children}
    </button>
  );
}
