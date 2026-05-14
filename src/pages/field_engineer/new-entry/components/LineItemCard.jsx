import { useState } from "react";
import { FormField } from "../../../../components/common/index.jsx";
import MeasurementInput from "./MeasurementInput.jsx";

export default function LineItemCard({ form, set, updateLine, removeLine, activeChapter }) {
  const [selectedItems, setSelectedItems] = useState({});
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCard = (id) => setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {form.lineItems.map((li, idx) => {
        const dims = li.measurements || [];
        const normalDims = dims.filter((d) => d.type !== "boolean" && !d.requiresPhoto);
        const photoDims = dims.filter((d) => d.requiresPhoto);
        const boolDims = dims.filter((d) => d.type === "boolean" && !d.requiresPhoto);
        const isExpanded = expandedCards[li._id] !== false; // default expanded
        const selectedItem = selectedItems[li._id];

        return (
          <div
            key={li._id}
            style={{ background: "rgba(255,255,255,.02)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}
          >
            {/* Header — always visible */}
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(255,255,255,.03)", borderBottom: isExpanded ? "1px solid var(--border)" : "none", cursor: "pointer" }}
              onClick={() => toggleCard(li._id)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                  background: "rgba(244,160,28,.18)", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 11, fontWeight: 800, color: "var(--accent)",
                }}>
                  {idx + 1}
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                    {li.scheduleItem || (selectedItem?.label) || (
                      <span style={{ color: "var(--text3)", fontWeight: 400 }}>Tap to select item</span>
                    )}
                  </div>
                  {li.itemCode && (
                    <span style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700 }}>{li.itemCode}</span>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => { e.stopPropagation(); removeLine(li._id); }}
                  style={{ padding: "5px 10px", fontSize: 11 }}
                >
                  ✕
                </button>
                <span style={{ fontSize: 16, color: "var(--text3)", userSelect: "none" }}>
                  {isExpanded ? "▲" : "▼"}
                </span>
              </div>
            </div>

            {/* Body — collapsible */}
            {isExpanded && (
              <div style={{ padding: "16px" }}>
                {/* Work item selector */}
                <FormField label="Work Item" description="Select from available items">
                  <select
                    className="form-control"
                    value={selectedItem?.label || ""}
                    onChange={(e) => {
                      const item = activeChapter?.items?.find((i) => i.label === e.target.value);
                      setSelectedItems((prev) => ({ ...prev, [li._id]: item }));
                      if (item) updateLine(li._id, { ...item, label: item.label });
                    }}
                    style={{ fontSize: 14 }}
                  >
                    <option value="">Select item…</option>
                    {(activeChapter?.items || []).map((item) => (
                      <option key={item._id} value={item.label}>
                        {item.label} — {item.code}
                      </option>
                    ))}
                  </select>
                  {/* Item description pill */}
                  {selectedItem?.description && (
                    <div style={{
                      marginTop: 8, padding: "8px 12px",
                      background: "rgba(59,130,246,.07)", border: "1px solid rgba(59,130,246,.2)",
                      borderRadius: 8, fontSize: 12, color: "#93C5FD", lineHeight: 1.5,
                    }}>
                      ⓘ {selectedItem.description}
                    </div>
                  )}
                </FormField>

                {/* Remarks */}
                <FormField label="Remarks" description="Description of work done">
                  <textarea
                    className="form-control"
                    value={form.remarks || ""}
                    onChange={(e) => set("remarks", e.target.value)}
                    placeholder="Describe work done at site…"
                    rows={2}
                    style={{ resize: "none", fontSize: 13 }}
                  />
                </FormField>

                {/* Measurements */}
                {dims.length > 0 && (
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14 }}>
                      📐 Measurements
                    </div>

                    {/* Normal — stacked on mobile */}
                    {normalDims.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: boolDims.length || photoDims.length ? 14 : 0 }}>
                        {normalDims.map((dim) => (
                          <MeasurementInput
                            key={dim._id}
                            dim={dim}
                            value={dim.value}
                            onChange={(val) =>
                              updateLine(li._id, {
                                measurements: li.measurements.map((m) => m.label === dim.label ? { ...m, value: val } : m),
                              })
                            }
                          />
                        ))}
                      </div>
                    )}

                    {/* Boolean */}
                    {boolDims.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: photoDims.length ? 14 : 0 }}>
                        {boolDims.map((dim) => (
                          <MeasurementInput
                            key={dim._id || dim.label}
                            dim={dim}
                            value={dim.value}
                            onChange={(val) =>
                              updateLine(li._id, {
                                measurements: li.measurements.map((m) => m.label === dim.label ? { ...m, value: val } : m),
                              })
                            }
                          />
                        ))}
                      </div>
                    )}

                    {/* Photo-required */}
                    {photoDims.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {photoDims.map((dim) => (
                          <MeasurementInput
                            key={dim._id || dim.label}
                            dim={dim}
                            value={dim.value}
                            photos={dim?.photos ?? []}
                            onChange={(val, photos) =>
                              updateLine(li._id, {
                                measurements: li.measurements.map((m) => m.label === dim.label ? { ...m, value: val, photos } : m),
                              })
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}