import { useState } from "react";
import { FIELD_TYPES, newColumn } from "../../projectTemplates.js";
import OptionsEditor from "./OptionsEditor.jsx";

const MAX_DEPTH = 3;

export default function ColumnsEditor({ columns, onChange, depth = 0 }) {
  const [expandedIdx, setExpandedIdx] = useState(null);

  const addCol = () => onChange([...columns, newColumn()]);
  const removeCol = (i) => onChange(columns.filter((_, ci) => ci !== i));
  const updateCol = (i, key, val) =>
    onChange(columns.map((c, ci) => (ci === i ? { ...c, [key]: val } : c)));

  return (
    <div
      style={{
        padding: "10px 12px",
        borderTop: depth === 0 ? "1px solid var(--border)" : "none",
        background:
          depth === 0 ? "rgba(255,255,255,.02)" : "rgba(255,255,255,.03)",
        borderRadius: depth > 0 ? 8 : 0,
        marginTop: depth > 0 ? 8 : 0,
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
        <div
          style={{
            fontSize: 10,
            color: "var(--text2)",
            textTransform: "uppercase",
            letterSpacing: ".07em",
          }}
        >
          {"↳ ".repeat(depth)}
          {depth === 0 ? "Table Columns" : "Nested Columns"}
        </div>
        <button className="btn btn-outline btn-sm" onClick={addCol}>
          + Column
        </button>
      </div>

      {columns.length === 0 && (
        <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8 }}>
          No columns yet.
        </div>
      )}

      {columns.map((col, idx) => {
        const needsOptions =
          col.type === "select" || col.type === "multiselect";
        const needsNested = col.type === "table" && depth < MAX_DEPTH;
        const isExpanded = expandedIdx === idx;
        return (
          <div
            key={idx}
            style={{
              background: "rgba(255,255,255,.04)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              marginBottom: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 70px 120px auto",
                gap: 8,
                padding: "8px 10px",
                alignItems: "center",
              }}
            >
              <input
                className="form-control"
                style={{ padding: "5px 8px", fontSize: 12 }}
                value={col.label}
                onChange={(e) =>
                  onChange(
                    columns.map((c, ci) =>
                      ci === idx
                        ? {
                            ...c,
                            label: e.target.value,
                            key: e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, "_")
                              .replace(/[^a-z0-9_]/g, ""),
                          }
                        : c,
                    ),
                  )
                }
                placeholder="Column label…"
              />
              <input
                className="form-control"
                style={{ padding: "5px 8px", fontSize: 12 }}
                value={col.unit}
                onChange={(e) => updateCol(idx, "unit", e.target.value)}
                placeholder="Unit"
              />
              <select
                className="form-control"
                style={{ padding: "5px 8px", fontSize: 12 }}
                value={col.type}
                onChange={(e) => {
                  onChange(
                    columns.map((c, ci) =>
                      ci === idx
                        ? {
                            ...c,
                            type: e.target.value,
                            options: [],
                            columns: [],
                          }
                        : c,
                    ),
                  );
                  setExpandedIdx(null);
                }}
              >
                {(depth < MAX_DEPTH
                  ? FIELD_TYPES
                  : FIELD_TYPES.filter((t) => t.value !== "table")
                ).map((ct) => (
                  <option key={ct.value} value={ct.value}>
                    {ct.icon} {ct.label}
                  </option>
                ))}
              </select>
              <div style={{ display: "flex", gap: 4 }}>
                {(needsOptions || needsNested) && (
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ padding: "4px 6px", fontSize: 10 }}
                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                    title={
                      needsNested ? "Define nested columns" : "Define options"
                    }
                  >
                    {isExpanded ? "▲" : needsNested ? "⤵" : "▼"}
                  </button>
                )}
                <button
                  className="btn btn-danger btn-sm"
                  style={{ padding: "4px 6px", fontSize: 10 }}
                  onClick={() => {
                    removeCol(idx);
                    setExpandedIdx(null);
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
            <div
              style={{
                padding: "0 10px 6px",
                fontSize: 10,
                color: "var(--text3)",
                display: "flex",
                gap: 6,
              }}
            >
              <span>key:</span>
              <code style={{ color: "var(--accent)", fontSize: 10 }}>
                {col.key || "—"}
              </code>
            </div>
            {isExpanded && needsOptions && (
              <OptionsEditor
                options={col.options || []}
                onChange={(opts) => updateCol(idx, "options", opts)}
              />
            )}
            {isExpanded && needsNested && (
              <div style={{ padding: "0 10px 10px" }}>
                <ColumnsEditor
                  columns={col.columns || []}
                  onChange={(cols) => updateCol(idx, "columns", cols)}
                  depth={depth + 1}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Preview */}
      {columns.length > 0 && (
        <div
          style={{
            marginTop: 10,
            overflowX: "auto",
            padding: 8,
            background: "rgba(0,0,0,.15)",
            borderRadius: 8,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "var(--text2)",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: ".07em",
            }}
          >
            Preview
          </div>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: "4px 8px",
                    borderBottom: "1px solid var(--border)",
                    color: "var(--text3)",
                    width: 24,
                  }}
                >
                  #
                </th>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "4px 8px",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text2)",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col.label || "—"}
                    {col.unit && (
                      <span style={{ color: "var(--text3)", fontWeight: 400 }}>
                        {" "}
                        ({col.unit})
                      </span>
                    )}
                    {col.type === "table" && (
                      <span
                        style={{
                          color: "var(--accent)",
                          fontSize: 9,
                          marginLeft: 4,
                        }}
                      >
                        ↳table
                      </span>
                    )}
                  </th>
                ))}
                <th style={{ width: 28 }} />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "4px 8px", color: "var(--text3)" }}>1</td>
                {columns.map((col, i) => (
                  <td
                    key={i}
                    style={{
                      padding: "4px 8px",
                      color: "var(--text3)",
                      fontStyle: "italic",
                    }}
                  >
                    {
                      {
                        number: "0.00",
                        text: "text…",
                        boolean: "Yes/No",
                        time: "00:00",
                        phone: "+91…",
                        table: "[rows]",
                        select: col.options[0] || "…",
                        multiselect: "[]",
                      }[col.type]
                    }
                  </td>
                ))}
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
