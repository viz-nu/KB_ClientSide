import MeasurementInput from "../../../../components/common/MeasurementInput";
import { CHAPTERS_N } from "../../../../constants/scheduleN.js";
import { FormField } from "../../../../components/common/index.jsx";
export default function LineItemCard({ form, updateLine, removeLine }) {

  return (
    <div>
      {form.lineItems.map((li, idx) => (
        <div
          key={li.id}
          style={{
            background: "rgba(255,255,255,.03)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 16,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)" }}
            >
              Line Item #{idx + 1}
            </span>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => removeLine(li.id)}
            >
              Remove
            </button>
          </div>
          {/* Schedule-N dropdown + Item Code */}
          {/* Schedule-N dropdown + Item Code */}
          <div className="form-row" style={{ marginBottom: 10 }}>
            {/* ← THIS FormField is what changes */}
            <FormField label="Schedule-N Item">
              <div
                style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
              >
                <select
                  className="form-control"
                  value={li.scheduleItem || ""}
                  onChange={(e) =>
                    updateLine(li.id, "scheduleItem", e.target.value)
                  }
                  style={{ flex: 1 }}
                >
                  <option value="">Select item…</option>
                  {(CHAPTERS_N?.find((t)=>t.name===form.workCategory)?.items || []).map((item) => (
                    <option key={item.code} value={item.label}>
                      {item.label}
                    </option>
                  ))}
                </select>

                {li.scheduleItem &&
                  (() => {
                    const desc = CHAPTERS_N?.find((t)=>t.name===form.workCategory)?.items.find(
                      (i) => i.label === li.scheduleItem,
                    )?.description;
                    if (!desc) return null;
                    return (
                      <div style={{ position: "relative" }}>
                        <button
                          type="button"
                          style={{
                            width: 28,
                            height: 38,
                            flexShrink: 0,
                            background: "rgba(59,130,246,.15)",
                            border: "1px solid rgba(59,130,246,.3)",
                            borderRadius: 8,
                            cursor: "pointer",
                            color: "#60A5FA",
                            fontSize: 13,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.nextSibling.style.display = "block";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.nextSibling.style.display = "none";
                          }}
                        >
                          ⓘ
                        </button>
                        <div
                          style={{
                            display: "none",
                            position: "absolute",
                            top: 42,
                            right: 0,
                            width: 280,
                            padding: "10px 14px",
                            background: "#0D1E3A",
                            border: "1px solid rgba(59,130,246,.3)",
                            borderRadius: 8,
                            fontSize: 12,
                            color: "var(--text2)",
                            lineHeight: 1.6,
                            zIndex: 50,
                            boxShadow: "0 8px 24px rgba(0,0,0,.4)",
                            pointerEvents: "none",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "#60A5FA",
                              marginBottom: 5,
                              textTransform: "uppercase",
                              letterSpacing: ".06em",
                            }}
                          >
                            {li.itemCode} · {li.scheduleItem}
                          </div>
                          {desc}
                        </div>
                      </div>
                    );
                  })()}
              </div>
            </FormField>

            {/* Item Code stays unchanged */}
            <FormField label="Item Code">
              <input
                className="form-control"
                value={li.itemCode}
                onChange={(e) => updateLine(li.id, "itemCode", e.target.value)}
                placeholder="Auto-filled from schedule"
                style={{ fontFamily: "monospace" }}
              />
            </FormField>
          </div>
          {/* Free-text description */}
          <FormField label="Description / Remarks">
            <input
              className="form-control"
              value={li.description}
              onChange={(e) => updateLine(li.id, "description", e.target.value)}
              placeholder="Detailed description of work done at site…"
            />
          </FormField>
          {/* Dynamic measurement fields */}
          {(() => {
            const dims = li.measurements || [];
            console.log("Dims",dims);
            if (dims.length === 0) return null;
            const inputDims = dims.filter((d) => d.type !== "boolean");
            const booleanDims = dims.filter((d) => d.type === "boolean");
            return (
              <div style={{ marginBottom: 10 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--text2)",
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                    marginBottom: 10,
                  }}
                >
                  Measurements & Parameters
                </div>

                {inputDims.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(160px, 1fr))",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    {inputDims.map((dim) => (
                      <div
                        key={dim.key}
                        style={
                          dim.type === "multiselect"
                            ? { gridColumn: "1 / -1" }
                            : {}
                        }
                      >
                        <MeasurementInput
                          dim={dim}
                          value={dim.value}
                          onChange={(val) =>
                            updateLine(li.id, `measurement.${dim.key}`, val)
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}

                {booleanDims.length > 0 && (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    {booleanDims.map((dim) => (
                      <MeasurementInput
                        key={dim.key}
                        dim={dim}
                        value={dim.value}
                        onChange={(val) =>{
                          console.log("Updating Item",li.id, `measurement.${dim.key}`, val);
                          updateLine(li.id, `measurement.${dim.key}`, val)
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      ))}
    </div>
  );
}
