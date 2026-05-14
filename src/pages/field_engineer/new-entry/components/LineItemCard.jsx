import { useState } from "react";

import { FormField } from "../../../../components/common/index.jsx";
import MeasurementInput from "./MeasurementInput.jsx";

export default function LineItemCard({
  form,
  set,
  updateLine,
  removeLine,
  activeChapter,
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {form.lineItems.map((li, idx) => {
        const dims = li.measurements || [];
        const normalDims = dims.filter(
          (d) => d.type !== "boolean" && !d.requiresPhoto,
        );
        const photoDims = dims.filter((d) => d.requiresPhoto);
        const boolDims = dims.filter(
          (d) => d.type === "boolean" && !d.requiresPhoto,
        );

        return (
          <div
            key={li._id}
            style={{
              background: "rgba(255,255,255,.02)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {/* ── Card header bar ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                background: "rgba(255,255,255,.03)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    flexShrink: 0,
                    background: "rgba(244,160,28,.15)",
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
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  {li.scheduleItem || (
                    <span style={{ color: "var(--text3)", fontWeight: 400 }}>
                      Untitled Item
                    </span>
                  )}
                </span>
                {li.itemCode && (
                  <code
                    style={{
                      fontSize: 10,
                      color: "var(--accent)",
                      fontWeight: 700,
                      background: "rgba(244,160,28,.1)",
                      padding: "2px 7px",
                      borderRadius: 6,
                    }}
                  >
                    {li.itemCode}
                  </code>
                )}
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeLine(li._id)}
                style={{ padding: "4px 10px", fontSize: 11 }}
              >
                ✕ Remove
              </button>
            </div>

            {/* ── Card body ── */}
            <div style={{ padding: "16px" }}>
              {/* Row 1: Schedule item selector + item code */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 180px",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <FormField label="Work Item" description="Select the work item from the list of available work items">
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    <select
                      className="form-control"
                      value={selectedItem?.label || ""}
                      onChange={(e) => {
                        const item = activeChapter?.items?.find(
                          (item) => item.label === e.target.value,
                        );
                        setSelectedItem(item);
                        updateLine(li._id, { ...item, label: item.label });
                      }}
                      style={{ flex: 1 }}
                    >
                      <option value="">Select item…</option>
                      {(activeChapter?.items || []).map((item) => (
                        <option key={item._id} value={item.label}>
                          {item.label} - {item.code}
                        </option>
                      ))}
                    </select>

                    {/* ⓘ tooltip */}
                    {selectedItem &&
                      (() => {
                        const desc = selectedItem.description;
                        if (!desc) return null;
                        return (
                          <div style={{ position: "relative", flexShrink: 0 }}>
                            <button
                              type="button"
                              style={{
                                width: 34,
                                height: 38,
                                background: "rgba(59,130,246,.12)",
                                border: "1px solid rgba(59,130,246,.25)",
                                borderRadius: 8,
                                cursor: "pointer",
                                color: "#60A5FA",
                                fontSize: 14,
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.nextSibling.style.display =
                                  "block";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.nextSibling.style.display =
                                  "none";
                              }}
                            >
                              ⓘ
                            </button>
                            <div
                              style={{
                                display: "none",
                                position: "absolute",
                                top: 44,
                                right: 0,
                                width: 280,
                                padding: "12px 14px",
                                background: "#0A1929",
                                border: "1px solid rgba(59,130,246,.3)",
                                borderRadius: 10,
                                fontSize: 12,
                                color: "var(--text2)",
                                lineHeight: 1.6,
                                zIndex: 50,
                                boxShadow: "0 12px 32px rgba(0,0,0,.5)",
                                pointerEvents: "none",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: "#60A5FA",
                                  marginBottom: 6,
                                  textTransform: "uppercase",
                                  letterSpacing: ".06em",
                                }}
                              >
                                {li.code}
                              </div>
                              {desc}
                            </div>
                          </div>
                        );
                      })()}
                  </div>
                </FormField>
              </div>

              {/* Row 2: Description */}
              <FormField label="Description / Remarks" description="Detailed description of work done at site">
                <input
                  className="form-control"
                  value={form.remarks || ""}
                  onChange={(e) =>
                    set("remarks", e.target.value)
                  }
                  placeholder="Detailed description of work done at site…"
                />
              </FormField>

              {/* ── Measurements section ── */}
              {dims.length > 0 && (
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 14,
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--text2)",
                      textTransform: "uppercase",
                      letterSpacing: ".1em",
                      marginBottom: 14,
                    }}
                  >
                    📐 Measurements & Parameters
                  </div>

                  {/* Normal fields in auto-grid */}
                  {normalDims.length > 0 && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(170px, 1fr))",
                        gap: 12,
                        marginBottom:
                          boolDims.length || photoDims.length ? 14 : 0,
                      }}
                    >
                      {normalDims.map((dim) => (
                        <div
                          key={dim._id}
                          style={
                            dim.type === "multiselect" || dim.type === "table"
                              ? { gridColumn: "1 / -1" }
                              : {}
                          }
                        >
                          <MeasurementInput
                            dim={dim}
                            value={dim.value}
                            onChange={(val) =>
                              updateLine(li._id, {
                                measurements: li.measurements.map((m) =>
                                  m.label === dim.label
                                    ? { ...m, value: val }
                                    : m,
                                ),
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Boolean fields — full-width stacked */}
                  {boolDims.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        marginBottom: photoDims.length ? 14 : 0,
                      }}
                    >
                      {boolDims.map((dim) => (
                        <MeasurementInput
                          dim={dim}
                          value={dim.value}
                          onChange={(val) =>
                            updateLine(li._id, {
                              measurements: li.measurements.map((m) =>
                                m.label === dim.label
                                  ? { ...m, value: val }
                                  : m,
                              ),
                            })
                          }
                        />
                      ))}
                    </div>
                  )}

                  {/* Photo-required fields — full-width, each in its own section */}
                  {photoDims.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      {photoDims.map((dim) => (
                        <MeasurementInput
                          dim={dim}
                          value={dim.value}
                          photos={dim?.photos ?? []}
                          onChange={(val, photos) =>
                            updateLine(li._id, {
                              measurements: li.measurements.map((m) =>
                                m.label === dim.label
                                  ? { ...m, value: val, photos }
                                  : m,
                              ),
                            })
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
