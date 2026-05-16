import { useState } from "react";
import { AlertBanner, PageHeader } from "./index.jsx";
import EditEmbEntry from "../../pages/field_engineer/entries/EditEmbEntry.jsx";
import { useQuery } from "@apollo/client";
import { SPAN_QUERIES } from "../../apollo/gql.js";
// ─── Entry Detail Modal ──────────────────────────────────────────
export default function EmbEntryDetailModal({ entry, onClose, currentUserId }) {
  const [editing, setEditing] = useState(false);
  const {
    data: spanData,
    loading: spanLoading,
    error: spanError,
    refetch: refetchSpan,
  } = useQuery(SPAN_QUERIES.get, {
    variables: { id: entry.span._id },
    fetchPolicy: "cache-and-network",
  });
  const activeSpan = spanData?.span ?? null;
  const activeChapter =
    activeSpan?.chapters?.find((c) => c.name === entry.chapter) ?? null;
  const isCreator =
    currentUserId &&
    (entry.createdBy === currentUserId ||
      entry.createdBy._id === currentUserId);
  // ── Switch to edit mode ───────────────────────────────────────
  if (editing) {
    return (
      <EditEmbEntry
        entry={entry}
        activeSpan={activeSpan}
        activeChapter={activeChapter}
        spanLoading={spanLoading}
        spanError={spanError}
        onSaved={() => setEditing(false)}
        onCancel={() => setEditing(false)}
      />
    );
  }

  // ── Detail view ───────────────────────────────────────────────
  const statusColor =
    {
      SUBMITTED: "#FBBF24",
      APPROVED: "#34D399",
      REJECTED: "#F87171",
    }[entry.status] ?? "var(--text2)";

  return (
    <div className="fade-up" style={{ maxWidth: 640, margin: "0 auto" }}>
      <PageHeader
        title="e-MB Entry"
        subtitle={`Submitted ${new Date(entry.createdAt).toLocaleString("en-IN")}`}
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-outline" onClick={onClose}>
              ← Back
            </button>
            {isCreator && (
              <button
                className="btn btn-primary"
                onClick={() => setEditing(true)}
              >
                ✏️ Edit
              </button>
            )}
          </div>
        }
      />

      {/* ── Status banner ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          borderRadius: 10,
          marginBottom: 16,
          background: statusColor + "12",
          border: `1px solid ${statusColor}44`,
        }}
      >
        <span style={{ fontWeight: 700, color: statusColor, fontSize: 13 }}>
          ● {entry.status ?? "SUBMITTED"}
        </span>
        {entry.createdBy?.name && (
          <span
            style={{ fontSize: 12, color: "var(--text2)", marginLeft: "auto" }}
          >
            By{" "}
            <strong style={{ color: "var(--text)" }}>
              {entry.createdBy.name}
            </strong>
          </span>
        )}
      </div>

      {/* ── Not-your-entry notice ── */}
      {!isCreator && currentUserId && (
        <AlertBanner
          type="info"
          message="You can view this entry but only the creator can edit it."
        />
      )}

      {/* ── Overview card ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title" style={{ marginBottom: 14 }}>
          Entry Details
        </div>
        {[
          ["Span", entry.span?.name ?? "—"],
          ["Project", entry.project?.name ?? "—"],
          ["Chapter", entry.chapter ?? "—"],
          ["Location", entry.locationDescription ?? "—"],
          [
            "Remarks",
            Array.isArray(entry.remarks)
              ? entry.remarks
                  .map((r) => r.notes)
                  .filter(Boolean)
                  .join(" · ") || "—"
              : entry.remarks || "—",
          ],
          [
            "Date",
            new Date(entry.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          ],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: "9px 0",
              borderBottom: "1px solid var(--border2)",
              fontSize: 13,
            }}
          >
            <span
              style={{
                color: "var(--text3)",
                fontSize: 12,
                flexShrink: 0,
                marginRight: 12,
              }}
            >
              {k}
            </span>
            <span
              style={{
                color: "var(--text)",
                textAlign: "right",
                wordBreak: "break-word",
                maxWidth: "65%",
              }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>

      {/* ── Line items ── */}
      {(entry.lineItems ?? []).length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {entry.lineItems.map((li, idx) => (
            <LineItemView key={li._id ?? idx} li={li} idx={idx} />
          ))}
        </div>
      ) : (
        <div
          className="card"
          style={{
            textAlign: "center",
            color: "var(--text3)",
            fontSize: 13,
            padding: 24,
          }}
        >
          No line items recorded.
        </div>
      )}
    </div>
  );
}

// ─── LineItemView ─────────────────────────────────────────────────
function LineItemView({ li, idx }) {
  const [open, setOpen] = useState(true);
  const hasMeasurements = (li.measurements ?? []).length > 0;

  return (
    <div
      style={{
        background: "rgba(255,255,255,.02)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "rgba(255,255,255,.03)",
          borderBottom: open ? "1px solid var(--border)" : "none",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              flexShrink: 0,
              background: "rgba(244,160,28,.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 800,
              color: "var(--accent)",
            }}
          >
            {idx + 1}
          </span>
          <div>
            <div
              style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}
            >
              {li.label || li.scheduleItem || (
                <span style={{ color: "var(--text3)", fontWeight: 400 }}>
                  Untitled item
                </span>
              )}
            </div>
            {li.code && (
              <span
                style={{
                  fontSize: 10,
                  color: "var(--accent)",
                  fontWeight: 700,
                }}
              >
                {li.code}
              </span>
            )}
          </div>
        </div>
        <span
          style={{ fontSize: 16, color: "var(--text3)", userSelect: "none" }}
        >
          {open ? "▲" : "▼"}
        </span>
      </div>

      {/* Body */}
      {open && (
        <div
          style={{
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Description */}
          {li.description && (
            <div
              style={{
                fontSize: 12,
                color: "var(--text2)",
                padding: "8px 12px",
                background: "rgba(59,130,246,.07)",
                border: "1px solid rgba(59,130,246,.2)",
                borderRadius: 8,
                lineHeight: 1.5,
              }}
            >
              ⓘ {li.description}
            </div>
          )}

          {/* Remarks */}
          {Array.isArray(li.remarks) && li.remarks.length > 0 && (
            <div style={{ fontSize: 13, color: "var(--text2)" }}>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text3)",
                  display: "block",
                  marginBottom: 2,
                }}
              >
                Remarks
              </span>
              {li.remarks.map((r) => r.notes).filter(Boolean).join(" · ")}
            </div>
          )}

          {/* Measurements */}
          {hasMeasurements && (
            <div
              style={{ paddingTop: 10, borderTop: "1px solid var(--border)" }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text2)",
                  textTransform: "uppercase",
                  letterSpacing: ".1em",
                  marginBottom: 10,
                }}
              >
                📐 Measurements
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {li.measurements.map((m, mi) => (
                  <MeasurementView key={m._id ?? mi} m={m} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MeasurementView ──────────────────────────────────────────────
function MeasurementView({ m }) {
  const displayValue = () => {
    if (m.type === "boolean")
      return m.value === true || m.value === "true" ? "✓ Yes" : "✗ No";
    if (Array.isArray(m.value))
      return `${m.value.length} row${m.value.length !== 1 ? "s" : ""}`;
    return m.value !== undefined && m.value !== null && m.value !== ""
      ? `${m.value}${m.unit ? " " + m.unit : ""}`
      : "—";
  };

  const hasPhotos = (m.photos ?? []).length > 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px",
          background: "rgba(255,255,255,.03)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          fontSize: 13,
        }}
      >
        <span style={{ color: "var(--text2)" }}>
          {m.label}
          {m.requiresPhoto && (
            <span style={{ marginLeft: 6, fontSize: 10, color: "#60A5FA" }}>
              📷
            </span>
          )}
        </span>
        <span
          style={{
            fontWeight: 600,
            color: "var(--text)",
            fontFamily: "monospace",
          }}
        >
          {displayValue()}
        </span>
      </div>

      {/* Photo thumbnails */}
      {hasPhotos && (
        <div
          style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}
        >
          {m.photos.map((ph) => (
            <div key={ph.id ?? ph.url} style={{ position: "relative" }}>
              <img
                src={ph.url}
                alt={ph.caption || m.label}
                style={{
                  width: 72,
                  height: 72,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                }}
              />
              {ph.pointLocation?.coordinates && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 3,
                    left: 3,
                    right: 3,
                    fontSize: 8,
                    color: "#fff",
                    background: "rgba(0,0,0,.6)",
                    borderRadius: 4,
                    padding: "1px 4px",
                    textAlign: "center",
                  }}
                >
                  📍 {ph.pointLocation.coordinates[1].toFixed(3)},{" "}
                  {ph.pointLocation.coordinates[0].toFixed(3)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
