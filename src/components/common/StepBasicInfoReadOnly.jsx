// ═══════════════════════════════════════════════════════════════════
// StepBasicInfoReadOnly — Step 1 for EditEmbEntry.
//
// Span and work category are LOCKED (cannot be changed on edit).
// Only locationDescription and remarks are editable.
//
// Props match StepBasicInfo except span/category handlers are gone.
// ═══════════════════════════════════════════════════════════════════
import { Spinner } from "./index.jsx";

export default function StepBasicInfoReadOnly({
  form,
  activeSpan,
  activeChapter,
  spansLoading,
  spansError,
}) {
  return (
    <>
      {spansLoading ? (
        <div>
          <Spinner size={16} />
          <span style={{ fontSize: 13, color: "var(--text2)" }}>
            Loading span…
          </span>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* ── Locked span + category banner ── */}
          {form.span ? (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                marginBottom: 4,
                background: "rgba(59,130,246,.08)",
                border: "1px solid rgba(59,130,246,.2)",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {/* Lock label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 2,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "#60A5FA",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                  }}
                >
                  🔒 Locked — span &amp; category cannot be changed
                </span>
              </div>

              {/* Span info */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ color: "#60A5FA", fontWeight: 700, fontSize: 13 }}
                >
                  Project :{" "}
                  {activeSpan.project?.name
                    ? ` — ${activeSpan.project.name}`
                    : ""}
                  <br />
                  🛤️ Span : {activeSpan.name}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 10,
                    color:
                      {
                        PENDING: "#94A3B8",
                        IN_PROGRESS: "#FBBF24",
                        COMPLETED: "#22C55E",
                      }[form.span.status] ?? "var(--text2)",
                    background: "rgba(255,255,255,.06)",
                  }}
                >
                  ● {activeSpan.status}
                </span>
              </div>

              {/* Route */}
              {(activeSpan.startPoint?.placeName ||
                activeSpan.endPoint?.placeName) && (
                <div style={{ fontSize: 12, color: "var(--text2)" }}>
                  {activeSpan.startPoint?.placeName} →{" "}
                  {activeSpan.endPoint?.placeName}
                </div>
              )}

              {/* Category chip */}
              {form.chapter && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 2,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: "var(--accent)" + "22",
                      border: `1px solid var(--accent)"44`,
                      color: "var(--accent)",
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "var(--accent)",
                        flexShrink: 0,
                      }}
                    />
                    {form.chapter}
                  </span>
                </div>
              )}

              {
                /* location description and remarks */
                <>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>
                    Location Description :{" "}
                    {form.locationDescription ||
                      "-no location description yet-"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>
                    Remarks :{"-no remarks yet-  "}
                    {Array.isArray(form.remarks)
                      ? form.remarks
                          .map((r) => r.notes)
                          .filter(Boolean)
                          .join(" · ")
                      : ""}
                  </div>
                </>
              }
            </div>
          ) : (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(239,68,68,.08)",
                border: "1px solid rgba(239,68,68,.2)",
                fontSize: 13,
                color: "var(--red)",
              }}
            >
              ⚠ Could not load span details.
            </div>
          )}
        </div>
      )}
    </>
  );
}
