// ═══════════════════════════════════════════════════════════════════
// PROJECT LIST — Grid of project cards + delete confirmation.
// Props:
//   projects  – array of project objects
//   loading   – boolean
//   onCreate  – () => void
//   onPreview – (project) => void
//   onEdit    – (project) => void
//   onDelete  – (project) => void
// ═══════════════════════════════════════════════════════════════════
import { useState } from "react";
import {
  PageHeader,
  EmptyState,
  Spinner,
  ConfirmDialog,
} from "../../../../components/common/index.jsx";

export const ProjectList = ({
  projects = [],
  loading,
  onCreate,
  onPreview,
  onEdit,
  onDelete,
}) => {
  const [delTarget, setDelTarget] = useState(null);

  const handleDeleteConfirm = () => {
    onDelete(delTarget);
    setDelTarget(null);
  };

  return (
    <div className="fade-up">
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} project${projects.length !== 1 ? "s" : ""} · ${projects.filter((p) => p.status === "ACTIVE").length} active`}
        actions={
          <button className="btn btn-primary" onClick={onCreate}>
            + New Project
          </button>
        }
      />

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Spinner size={32} />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon="🏗️"
          title="No projects yet"
          message="Create a project to define custom work items and measurement fields."
          action={
            <button className="btn btn-primary" onClick={onCreate}>
              Create First Project
            </button>
          }
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          {projects.map((proj) => (
            <ProjectCard
              key={proj._id}
              project={proj}
              onPreview={() => onPreview(proj)}
              onEdit={() => onEdit(proj)}
              onDelete={() => setDelTarget(proj)}
            />
          ))}
        </div>
      )}

      {delTarget && (
        <ConfirmDialog
          danger
          message={`Delete project "${delTarget.name}"? This cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDelTarget(null)}
        />
      )}
    </div>
  );
};

// ─── Project Card ──────────────────────────────────────────────────
function ProjectCard({ project: p, onPreview, onEdit, onDelete }) {
  const itemCount = p.chapters.reduce((s, ch) => s + ch.items.length, 0);
  const statusColor =
    {
      ACTIVE: "var(--green)",
      DRAFT: "var(--yellow)",
      ARCHIVED: "var(--text3)",
    }[p.status] ?? "var(--text3)";

  return (
    <div
      className="card"
      style={{
        borderTop: `3px solid ${p.chapters[0]?.color || "var(--accent)"}`,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <code
            style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700 }}
          >
            {p.code}
          </code>
          <span
            style={{
              fontSize: 10,
              color: statusColor,
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            ● {p.status}
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            fontSize: 15,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {p.name}
        </div>
      </div>

      {/* Description */}
      {p.description && (
        <div
          style={{
            fontSize: 12,
            color: "var(--text2)",
            lineHeight: 1.5,
            marginBottom: 12,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {p.description}
        </div>
      )}

      {/* Chapter pills */}
      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}
      >
        {p.chapters.map((ch) => (
          <span
            key={ch._id}
            style={{
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 12,
              background: ch.color + "22",
              color: ch.color,
              border: `1px solid ${ch.color}44`,
              fontWeight: 600,
            }}
          >
            {ch.code || ch.name}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          marginBottom: 14,
          paddingTop: 12,
          borderTop: "1px solid var(--border)",
        }}
      >
        {[
          ["📚", p.chapters.length, "Chapters"],
          ["📋", itemCount, "Items"],
          [
            "📅",
            p.createdAt
              ? new Date(p.createdAt).toLocaleDateString("en-IN")
              : "—",
            "Created",
          ],
        ].map(([icon, val, lbl]) => (
          <div key={lbl} style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700 }}
            >
              {icon} {val}
            </div>
            <div style={{ fontSize: 10, color: "var(--text3)" }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Vault */}
      {p.Vault && <VaultSummary vault={p.Vault} />}

      {/* Actions */}
      <div style={{ display: "flex", gap: 6 }}>
        <button
          className="btn btn-outline btn-sm"
          style={{ flex: 1 }}
          onClick={onPreview}
        >
          👁 Preview
        </button>
        <button
          className="btn btn-primary btn-sm"
          style={{ flex: 1 }}
          onClick={onEdit}
        >
          ✏️ Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>
          🗑
        </button>
      </div>
    </div>
  );
}

function VaultSummary({ vault }) {
  const pct =
    vault.allotedBudjet > 0
      ? Math.min(
          100,
          Math.round((vault.spentBudjet / vault.allotedBudjet) * 100),
        )
      : 0;
  const barColor =
    pct > 85 ? "var(--red)" : pct > 60 ? "var(--yellow)" : "var(--green)";

  return (
    <div
      style={{
        marginBottom: 14,
        padding: "10px 12px",
        background: "rgba(255,255,255,.03)",
        borderRadius: 8,
        border: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "var(--text2)",
          textTransform: "uppercase",
          letterSpacing: ".07em",
          marginBottom: 8,
        }}
      >
        💰 Budget
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 2 }}>
            Allotted
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--accent)",
              fontFamily: "monospace",
            }}
          >
            ₹{(vault.allotedBudjet ?? 0).toLocaleString("en-IN")}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 2 }}>
            Spent
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--text)",
              fontFamily: "monospace",
            }}
          >
            ₹{(vault.spentBudjet ?? 0).toLocaleString("en-IN")}
          </div>
        </div>
      </div>
      {vault.allotedBudjet > 0 && (
        <div style={{ marginTop: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "var(--text3)",
              marginBottom: 3,
            }}
          >
            <span>Utilisation</span>
            <span style={{ color: barColor, fontWeight: 600 }}>{pct}%</span>
          </div>
          <div
            style={{
              height: 4,
              background: "rgba(255,255,255,.08)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: barColor,
                borderRadius: 2,
                transition: "width .4s",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
