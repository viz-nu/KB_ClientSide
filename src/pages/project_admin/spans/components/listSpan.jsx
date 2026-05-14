// ═══════════════════════════════════════════════════════════════════
// SPAN LIST — Grid of span cards.
// Props:
//   spans     – array of span objects
//   projects  – array of project objects (for name resolution)
//   loading   – boolean
//   onView    – (span) => void
//   onEdit    – (span) => void
//   onDelete  – (span) => void
//   onCreate  – () => void   (for the header action + empty state CTA)
// ═══════════════════════════════════════════════════════════════════
import { useState } from "react";
import { PageHeader, EmptyState, Spinner, ConfirmDialog } from "../../../../components/common/index.jsx";
import { PROGRESS_STAGES } from "../../../../constants/spanConstants.js";

export function SpanList({ spans = [], projects = [], loading, onView, onEdit, onDelete, onCreate }) {
  const [delTarget, setDelTarget] = useState(null);

  const handleDeleteConfirm = () => {
    onDelete(delTarget);
    setDelTarget(null);
  };

  return (
    <div className="fade-up">
      <PageHeader
        title="Span Management"
        subtitle={`${spans.length} span${spans.length !== 1 ? "s" : ""} · ${spans.filter((s) => s.status === "COMPLETED").length} completed`}
        actions={
          <button className="btn btn-primary" onClick={onCreate}>
            + New Span
          </button>
        }
      />

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Spinner size={32} />
        </div>
      ) : spans.length === 0 ? (
        <EmptyState
          icon="🛤️"
          title="No spans yet"
          message="Create a span to define a section of work between two points."
          action={
            <button className="btn btn-primary" onClick={onCreate}>
              Create First Span
            </button>
          }
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 16,
          }}
        >
          {spans.map((s) => (
            <SpanCard
              key={s._id}
              span={s}
              project={projects.find((p) => p._id === (s.projectId || s.project?._id))}
              onView={() => onView(s)}
              onEdit={() => onEdit(s)}
              onDelete={() => setDelTarget(s)}
            />
          ))}
        </div>
      )}

      {delTarget && (
        <ConfirmDialog
          danger
          message={`Delete span "${delTarget.name}"? This cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDelTarget(null)}
        />
      )}
    </div>
  );
}

// ─── Span Card ─────────────────────────────────────────────────────
function SpanCard({ span: s, project, onView, onEdit, onDelete }) {
  const stage = PROGRESS_STAGES.find((p) => p.value === s.status) || PROGRESS_STAGES[0];
  const spentPct =
    s.Vault?.allotedBudjet > 0
      ? Math.min(100, Math.round((s.Vault.spentBudjet / s.Vault.allotedBudjet) * 100))
      : 0;
  const barColor = spentPct > 85 ? "var(--red)" : spentPct > 60 ? "var(--yellow)" : "var(--green)";

  return (
    <div
      className="card"
      style={{ borderTop: `3px solid ${stage.color}`, display: "flex", flexDirection: "column", gap: 0 }}
    >
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 10, fontWeight: 700, color: stage.color,
              textTransform: "uppercase", letterSpacing: ".08em",
              background: stage.color + "18", border: `1px solid ${stage.color}44`,
              padding: "2px 8px", borderRadius: 10,
            }}
          >
            ● {stage.label}
          </span>
          {project && (
            <code style={{ fontSize: 10, color: "var(--accent)", fontWeight: 600 }}>
              {project.code}
            </code>
          )}
        </div>
        <div
          style={{
            fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 2,
          }}
        >
          {s.name}
        </div>
        {project && (
          <div style={{ fontSize: 11, color: "var(--text2)" }}>{project.name}</div>
        )}
      </div>

      {/* Route */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
          padding: "10px 12px", background: "rgba(255,255,255,.03)",
          borderRadius: 8, border: "1px solid var(--border)",
        }}
      >
        <RoutePoint label="From" point={s.startPoint} align="left" />
        <div style={{ fontSize: 18, color: "var(--text3)", flexShrink: 0 }}>→</div>
        <RoutePoint label="To" point={s.endPoint} align="right" />
      </div>

      {/* Vault */}
      {s.Vault && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }}>
            <VaultStat label="Budget" value={`₹${(s.Vault.allotedBudjet || 0).toLocaleString("en-IN")}`} color="var(--accent)" />
            <VaultStat label="Spent"  value={`₹${(s.Vault.spentBudjet  || 0).toLocaleString("en-IN")}`} color="var(--text)" />
          </div>
          {s.Vault.allotedBudjet > 0 && (
            <div>
              <div
                style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: 10, color: "var(--text3)", marginBottom: 3,
                }}
              >
                <span>Utilisation</span>
                <span style={{ color: barColor, fontWeight: 600 }}>{spentPct}%</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,.08)", borderRadius: 2, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${spentPct}%`, height: "100%", background: barColor,
                    borderRadius: 2, transition: "width .4s",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats row */}
      <div
        style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6,
          marginBottom: 12, paddingTop: 10, borderTop: "1px solid var(--border)",
        }}
      >
        <StatCell icon="📋" value={s.chapters?.length || 0} label="Chapters" />
        <StatCell icon="📅" value={s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-IN") : "—"} label="Created" />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
        <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={onView}>
          👁 View
        </button>
        <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={onEdit}>
          ✏️ Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>🗑</button>
      </div>
    </div>
  );
}

function RoutePoint({ label, point, align }) {
  const [lat, lng] = point?.pointLocation?.coordinates ?? [0, 0];
  return (
    <div style={{ flex: 1, minWidth: 0, textAlign: align }}>
      <div
        style={{
          fontSize: 9, color: "var(--text3)", textTransform: "uppercase",
          letterSpacing: ".07em", marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 12, fontWeight: 600, overflow: "hidden",
          textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}
      >
        {point?.placeName || "—"}
      </div>
      {lat ? (
        <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "monospace" }}>
          {Number(lat)}, {Number(lng)}
        </div>
      ) : null}
    </div>
  );
}

function VaultStat({ label, value, color }) {
  return (
    <div style={{ background: "rgba(255,255,255,.03)", padding: "8px 10px", borderRadius: 8 }}>
      <div
        style={{
          fontSize: 9, color: "var(--text3)", textTransform: "uppercase",
          letterSpacing: ".07em", marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "monospace" }}>{value}</div>
    </div>
  );
}

function StatCell({ icon, value, label }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700 }}>{icon} {value}</div>
      <div style={{ fontSize: 9, color: "var(--text3)" }}>{label}</div>
    </div>
  );
}