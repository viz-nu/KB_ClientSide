// ═══════════════════════════════════════════════════════════════════
// SPAN DETAIL — Read view
// ═══════════════════════════════════════════════════════════════════
import { useState } from "react";

import { PROGRESS_STAGES, TYPE_META } from "../../../../constants/spanConstants.js";
import {
  PageHeader,
  Tabs,
  EmptyState,
  AlertBanner,
  Spinner,
} from "../../../../components/common/index.jsx";
import { useMutation, useQuery } from "@apollo/client";
import { USER_QUERIES, SPAN_QUERIES } from "../../../../apollo/gql.js";

// ═══════════════════════════════════════════════════════════════════
export const SpanDetail = ({ span: s, projects, onBack, onEdit }) => {
  const [tab, setTab] = useState("overview");
  const project = projects.find((p) => p._id === s.projectId);
  const stage =
    PROGRESS_STAGES.find((p) => p.value === s.status) || PROGRESS_STAGES[0];
  const spentPct =
    s.Vault?.allotedBudjet > 0
      ? Math.min(
          100,
          Math.round((s.Vault.spentBudjet / s.Vault.allotedBudjet) * 100),
        )
      : 0;
  const barColor =
    spentPct > 85
      ? "var(--red)"
      : spentPct > 60
        ? "var(--yellow)"
        : "var(--green)";

  const tabConfig = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "route", label: "Route", icon: "🗺️" },
    { id: "workitems", label: "Work Items", icon: "📦" },
    { id: "vault", label: "Vault", icon: "💰" },
    { id: "staff", label: "Staff", icon: "👥" },
  ];

  return (
    <div className="fade-up">
      <PageHeader
        title={s.name}
        subtitle={project ? `${project.name} · ${project.code}` : ""}
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-outline" onClick={onBack}>
              ← Back
            </button>
            <button className="btn btn-primary" onClick={onEdit}>
              ✏️ Edit
            </button>
          </div>
        }
      />

      {/* Status banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          borderRadius: 8,
          marginBottom: 20,
          background: stage.color + "12",
          border: `1px solid ${stage.color}44`,
        }}
      >
        <span style={{ fontSize: 16 }}>
          {{ PENDING: "⏳", IN_PROGRESS: "🔄", COMPLETED: "✅" }[s.status]}
        </span>
        <span style={{ fontWeight: 700, color: stage.color, fontSize: 13 }}>
          {stage.label}
        </span>
        {project && (
          <span
            style={{ fontSize: 12, color: "var(--text2)", marginLeft: "auto" }}
          >
            Part of:{" "}
            <strong style={{ color: "var(--text)" }}>{project.name}</strong>
          </span>
        )}
      </div>

      <Tabs tabs={tabConfig} active={tab} onChange={setTab} />

      {/* ── Overview */}
      {tab === "overview" && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>
              Span Details
            </div>
            {[
              [
                "ID",
                <code key="id" style={{ fontSize: 11, color: "var(--accent)" }}>
                  {s._id}
                </code>,
              ],
              ["Name", s.name],
              ["Project", s.project?.name || "—"],
              [
                "Status",
                <span key="st" style={{ color: stage.color, fontWeight: 600 }}>
                  ● {stage.label}
                </span>,
              ],
              ["Work Items", `${s.chapters?.length || 0}`],
              ["Created", s.createdAt],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border2)",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "var(--text2)", fontSize: 12 }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>
              Budget Summary
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 14,
              }}
            >
              {[
                [
                  "Allotted",
                  `₹${(s.Vault?.allotedBudjet || 0).toLocaleString("en-IN")}`,
                  "var(--accent)",
                ],
                [
                  "Spent",
                  `₹${(s.Vault?.spentBudjet || 0).toLocaleString("en-IN")}`,
                  "var(--text)",
                ],
                [
                  "Remaining",
                  `₹${((s.Vault?.allotedBudjet || 0) - (s.Vault?.spentBudjet || 0)).toLocaleString("en-IN")}`,
                  (s.Vault?.allotedBudjet || 0) >= (s.Vault?.spentBudjet || 0)
                    ? "var(--green)"
                    : "var(--red)",
                ],
                ["Utilisation", `${spentPct}%`, barColor],
              ].map(([l, v, c]) => (
                <div
                  key={l}
                  style={{
                    background: "rgba(255,255,255,.03)",
                    padding: "10px 12px",
                    borderRadius: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--text3)",
                      textTransform: "uppercase",
                      letterSpacing: ".07em",
                      marginBottom: 3,
                    }}
                  >
                    {l}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: c,
                      fontFamily: "monospace",
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                height: 6,
                background: "rgba(255,255,255,.08)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${spentPct}%`,
                  height: "100%",
                  background: barColor,
                  borderRadius: 3,
                  transition: "width .4s",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Route */}
      {tab === "route" && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          {[
            { key: "startPoint", label: "Start Point", icon: "🟢" },
            { key: "endPoint", label: "End Point", icon: "🔴" },
          ].map(({ key, label, icon }) => (
            <div key={key} className="card">
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 15,
                  marginBottom: 14,
                }}
              >
                {icon} {label}
              </div>
              {[
                ["Place Name", s[key].placeName || "—"],
                ["Latitude", s[key].pointLocation.coordinates[0] || "—"],
                ["Longitude", s[key].pointLocation.coordinates[1] || "—"],
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border2)",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "var(--text2)", fontSize: 12 }}>
                    {l}
                  </span>
                  <span
                    style={{
                      fontFamily: l !== "Place Name" ? "monospace" : "inherit",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
              {s[key].pointLocation.coordinates[0] &&
                s[key].pointLocation.coordinates[1] && (
                  <a
                    href={`https://www.google.com/maps?q=${s[key].pointLocation.coordinates[0]},${s[key].pointLocation.coordinates[1]}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{
                      marginTop: 12,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      textDecoration: "none",
                    }}
                  >
                    🗺️ Open in Maps
                  </a>
                )}
            </div>
          ))}
        </div>
      )}

      {/* ── Work Items */}
      {/* ── Work Items */}
      {tab === "workitems" && (
        <div>
          {s.chapters?.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {s.chapters.map((chapter) => (
                <div className="card" key={chapter._id}>
                  {/* Chapter Header */}
                  <div className="card-header">
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: chapter.color || "var(--accent)",
                          flexShrink: 0,
                        }}
                      />
                      <span className="card-title">{chapter.name}</span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--text3)",
                          background: "rgba(255,255,255,.06)",
                          border: "1px solid var(--border)",
                          borderRadius: 12,
                          padding: "2px 8px",
                        }}
                      >
                        {chapter.items?.length ?? 0} item
                        {chapter.items?.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  {chapter.items?.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0,
                      }}
                    >
                      {chapter.items.map((item, idx) => (
                        <div
                          key={item._id}
                          style={{
                            padding: "14px 20px",
                            borderTop:
                              idx === 0 ? "none" : "1px solid var(--border)",
                          }}
                        >
                          {/* Item Row */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 12,
                              marginBottom:
                                item.measurements?.length > 0 ? 10 : 0,
                            }}
                          >
                            <code
                              style={{
                                fontSize: 11,
                                color: chapter.color || "var(--accent)",
                                background: `${chapter.color || "var(--accent)"}18`,
                                border: `1px solid ${chapter.color || "var(--accent)"}33`,
                                borderRadius: 5,
                                padding: "2px 7px",
                                flexShrink: 0,
                                marginTop: 1,
                                fontWeight: 600,
                              }}
                            >
                              {item.code}
                            </code>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: "var(--text)",
                                }}
                              >
                                {item.label}
                              </div>
                              {item.description && (
                                <div
                                  style={{
                                    fontSize: 11,
                                    color: "var(--text3)",
                                    marginTop: 2,
                                  }}
                                >
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Measurements */}
                          {item.measurements?.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 6,
                                paddingLeft: 4,
                              }}
                            >
                              {item.measurements.map((m) => (
                                <MeasurementBadge key={m._id} m={m} />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        color: "var(--text3)",
                        fontSize: 12,
                      }}
                    >
                      No items in this chapter
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="📦"
              title="No work items"
              message="No work items are assigned to this span."
            />
          )}
        </div>
      )}
      {/* ── Vault */}
      {tab === "vault" && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>
            💰 Vault Details
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {[
              [
                "Allotted Budget",
                `₹${(s.Vault?.allotedBudjet || 0).toLocaleString("en-IN")}`,
                "var(--accent)",
              ],
              [
                "Spent",
                `₹${(s.Vault?.spentBudjet || 0).toLocaleString("en-IN")}`,
                "var(--text)",
              ],
              [
                "Remaining",
                `₹${((s.Vault?.allotedBudjet || 0) - (s.Vault?.spentBudjet || 0)).toLocaleString("en-IN")}`,
                (s.Vault?.allotedBudjet || 0) >= (s.Vault?.spentBudjet || 0)
                  ? "var(--green)"
                  : "var(--red)",
              ],
              ["Utilisation", `${spentPct}%`, barColor],
            ].map(([l, v, c]) => (
              <div
                key={l}
                style={{
                  background: "rgba(255,255,255,.04)",
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--text3)",
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                    marginBottom: 6,
                  }}
                >
                  {l}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: c,
                    fontFamily: "var(--font-head)",
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "var(--text2)",
            }}
          >
            <span>Budget utilisation</span>
            <span style={{ color: barColor, fontWeight: 700 }}>
              {spentPct}%
            </span>
          </div>
          <div
            style={{
              height: 8,
              background: "rgba(255,255,255,.08)",
              borderRadius: 4,
              overflow: "hidden",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: `${spentPct}%`,
                height: "100%",
                background: barColor,
                borderRadius: 4,
                transition: "width .6s",
              }}
            />
          </div>

          {/* Vault logs */}
          <div
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            Transaction Log
          </div>
          {(s.Vault?.logs || []).length === 0 ? (
            <div
              style={{
                fontSize: 12,
                color: "var(--text3)",
                padding: "16px 0",
                textAlign: "center",
              }}
            >
              No transactions recorded yet.
            </div>
          ) : (
            s.Vault.logs.map((log, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border2)",
                  fontSize: 13,
                }}
              >
                <span>{log.note || "Transaction"}</span>
                <span
                  style={{
                    fontFamily: "monospace",
                    color: log.amount >= 0 ? "var(--red)" : "var(--green)",
                  }}
                >
                  {log.amount >= 0 ? "−" : "+"}₹
                  {Math.abs(log.amount).toLocaleString("en-IN")}
                </span>
              </div>
            ))
          )}
        </div>
      )}
      {tab === "staff" && (
        <StaffPanel spanId={s._id} existingStaff={s.staff || []} />
      )}
    </div>
  );
};

// ─── Staff Panel ──────────────────────────────────────────────────
function StaffPanel({ spanId, existingStaff }) {
  const [search, setSearch] = useState("");
  const [apiError, setApiError] = useState("");

  const { data: usersData, loading: usersLoading } = useQuery(
    USER_QUERIES.list,
    {
      fetchPolicy: "cache-and-network",
      variables: { page: 1, limit: 50 },
    },
  );

  const [addStaff, { loading: adding }] = useMutation(SPAN_QUERIES.addStaff);
  const [removeStaff, { loading: removing }] = useMutation(
    SPAN_QUERIES.removeStaff,
  );

  const allUsers = usersData?.users?.data ?? [];
  const staffIds = new Set(existingStaff.map((u) => u._id ?? u));
  const staffUsers = allUsers.filter((u) => staffIds.has(u._id));
  const searchLower = search.toLowerCase();
  const available = allUsers.filter(
    (u) =>
      !staffIds.has(u._id) &&
      (u.name?.toLowerCase().includes(searchLower) ||
        u.email?.toLowerCase().includes(searchLower)),
  );

  const invalidate = (cache) => {
    cache.evict({ fieldName: "spans" });
    cache.gc();
  };

  const handleAdd = async (userId) => {
    setApiError("");
    try {
      await addStaff({
        variables: { id: spanId, userId },
        update: invalidate,
      });
    } catch (e) {
      setApiError(e.message);
    }
  };

  const handleRemove = async (userId) => {
    setApiError("");
    try {
      await removeStaff({
        variables: { id: spanId, userId },
        update: invalidate,
      });
    } catch (e) {
      setApiError(e.message);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Current staff */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            👷 Assigned Staff ({staffUsers.length})
          </span>
        </div>
        {apiError && <AlertBanner type="error" message={apiError} />}
        {staffUsers.length === 0 ? (
          <EmptyState
            icon="👤"
            title="No staff assigned"
            message="Add staff from the list on the right."
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {staffUsers.map((u) => (
              <div
                key={u._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,.03)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "rgba(34,197,94,.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {(u.name || "?")
                    .trim()
                    .split(/\s+/)
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text2)" }}>
                    {u.designation || u.role || u.email}
                  </div>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  style={{ flexShrink: 0 }}
                  disabled={removing}
                  onClick={() => handleRemove(u._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add staff */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">➕ Add Staff</span>
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            className="form-control"
            placeholder="🔍 Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {usersLoading ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 24 }}
          >
            <Spinner size={24} />
          </div>
        ) : available.length === 0 ? (
          <div
            style={{
              fontSize: 12,
              color: "var(--text3)",
              textAlign: "center",
              padding: "16px 0",
            }}
          >
            {search
              ? "No users match your search."
              : "All users are already assigned."}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            {available.map((u) => (
              <div
                key={u._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,.03)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "rgba(59,130,246,.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {(u.name || "?")
                    .trim()
                    .split(/\s+/)
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text2)" }}>
                    {u.designation || u.role || u.email}
                  </div>
                </div>
                <button
                  className="btn btn-success btn-sm"
                  style={{ flexShrink: 0 }}
                  disabled={adding}
                  onClick={() => handleAdd(u._id)}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MeasurementBadge({ m }) {
  const meta = TYPE_META[m.type] || { label: m.type, color: "#6B7280" };
  const isFixed = m.fixedNumber !== undefined || m.fixedText !== undefined;
  const fixedVal = m.fixedNumber ?? m.fixedText;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: "rgba(255,255,255,.04)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        padding: "4px 9px",
        fontSize: 11,
        color: "var(--text2)",
        maxWidth: 220,
      }}
    >
      {/* Type pill */}
      <span
        style={{
          background: `${meta.color}22`,
          color: meta.color,
          borderRadius: 4,
          padding: "1px 5px",
          fontWeight: 600,
          fontSize: 10,
          letterSpacing: ".04em",
          flexShrink: 0,
        }}
      >
        {meta.label}
      </span>

      {/* Label */}
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {m.label}
      </span>

      {/* Unit */}
      {m.unit && (
        <span style={{ color: "var(--text3)", flexShrink: 0 }}>· {m.unit}</span>
      )}

      {/* Fixed value indicator */}
      {isFixed && (
        <span
          style={{
            color: "#F4A01C",
            fontSize: 10,
            flexShrink: 0,
            fontWeight: 600,
          }}
          title={`Fixed: ${fixedVal}`}
        >
          =
          {String(fixedVal).length > 8
            ? String(fixedVal).slice(0, 8) + "…"
            : fixedVal}
        </span>
      )}

      {/* Photo required */}
      {m.requiresPhoto && (
        <span
          title="Photo required"
          style={{ fontSize: 11, flexShrink: 0, opacity: 0.7 }}
        >
          📷
        </span>
      )}

      {/* Table column count */}
      {m.type === "table" && m.columns?.length > 0 && (
        <span style={{ color: "var(--text3)", fontSize: 10, flexShrink: 0 }}>
          {m.columns.length} col{m.columns.length !== 1 ? "s" : ""}
        </span>
      )}

      {/* Options count for select/multiselect */}
      {(m.type === "select" || m.type === "multiselect") &&
        m.options?.length > 0 && (
          <span style={{ color: "var(--text3)", fontSize: 10, flexShrink: 0 }}>
            {m.options.length} opt{m.options.length !== 1 ? "s" : ""}
          </span>
        )}
    </div>
  );
}
