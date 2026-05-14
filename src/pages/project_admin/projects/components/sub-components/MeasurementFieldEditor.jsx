import { useState } from "react";
import { FormField } from "../../../../../components/common/index.jsx";
import OptionsEditor from "./OptionsEditor.jsx";
import ColumnsEditor from "./ColumnsEditor.jsx";
import { FIELD_TYPES } from "../../projectTemplates.js";

export default function MeasurementFieldEditor({
  m,
  idx,
  total,
  onChange,
  onDelete,
  onMove,
}) {
  const [localKey, setLocalKey] = useState("");
  const [expanded, setExpanded] = useState(false);

  const needsOptions = m.type === "select" || m.type === "multiselect";
  const needsColumns = m.type === "table";
  const needsExpand = needsOptions || needsColumns;

  return (
    <div
      style={{
        background: "rgba(255,255,255,.03)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        marginBottom: 8,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 12px",
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: "rgba(244,160,28,.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 700,
            color: "var(--accent)",
            flexShrink: 0,
          }}
        >
          {idx + 1}
        </div>
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 80px 110px",
            gap: 8,
            alignItems: "center",
          }}
        >
          <FormField label="Field Label" description="Label of the field">
            <input
              className="form-control"
              style={{ padding: "5px 10px", fontSize: 12 }}
              value={m.label}
              onChange={(e) => {
                onChange("label", e.target.value);
                setLocalKey(e.target.value);
              }}
              placeholder="Field label…"
            />
          </FormField>
          <FormField label="Unit" description="Unit of the field measurement">
            <input
              className="form-control"
              style={{ padding: "5px 10px", fontSize: 12 }}
              value={m.unit}
              onChange={(e) => onChange("unit", e.target.value)}
              placeholder="Unit"
            />
          </FormField>
          <FormField label="Data Type" description="Type of the field data">
            <select
              className="form-control"
              style={{ padding: "5px 8px", fontSize: 12 }}
              value={m.type}
              onChange={(e) => {
                onChange("type", e.target.value);
                if (
                  e.target.value !== "select" &&
                  e.target.value !== "multiselect"
                )
                  onChange("options", []);
              }}
            >
              {FIELD_TYPES.map((ft) => (
                <option key={ft.value} value={ft.value}>
                  {ft.icon} {ft.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {(needsExpand || m.fixed !== undefined) && (
            <button
              className="btn btn-outline btn-sm"
              style={{ padding: "4px 8px", fontSize: 11 }}
              onClick={() => setExpanded((x) => !x)}
            >
              {expanded ? "▲" : "▼"}
            </button>
          )}
          <button
            className="btn btn-ghost btn-sm"
            style={{ padding: "4px 6px", fontSize: 11 }}
            onClick={() => onMove(-1)}
            disabled={idx === 0}
          >
            ▲
          </button>
          <button
            className="btn btn-ghost btn-sm"
            style={{ padding: "4px 6px", fontSize: 11 }}
            onClick={() => onMove(1)}
            disabled={idx === total - 1}
          >
            ▼
          </button>
          <button
            className="btn btn-danger btn-sm"
            style={{ padding: "4px 6px", fontSize: 11 }}
            onClick={onDelete}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Key + fixed + billing rate */}
      <div
        style={{
          padding: "0 12px 10px",
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <FormField label="Key" description="Unique key for the field which is used to identify the field in the data">
          <input
            className="form-control"
            style={{
              padding: "3px 8px",
              fontSize: 11,
              fontFamily: "monospace",
              maxWidth: 160,
            }}
            value={localKey || m.key}
            onChange={(e) =>
              onChange(
                "key",
                e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "_")
                  .replace(/[^a-z0-9_]/g, ""),
              )
            }
            placeholder="auto_key"
          />
        </FormField>
        {(m.type === "number" || m.type === "text") && (
          <FormField label="Fixed Value" description="Optional fixed value for the field which user cannot change">
            <input
              className="form-control"
              type={m.type}
              style={{ padding: "3px 8px", fontSize: 11, maxWidth: 100 }}
              value={m.fixedNumber ?? m.fixedText ?? ""}
              placeholder={m.type === "number" ? 0 : "Constant"}
              onChange={(e) => {
                let type = m.type,
                  key,
                  value;
                switch (type) {
                  case "number":
                    key = "fixedNumber";
                    value = Number(e.target.value);
                    break;
                  default:
                    key = "fixedText";
                    value = String(e.target.value);
                    break;
                }
                onChange(key, value === "" ? undefined : value);
              }}
            />
          </FormField>
        )}
        <FormField label="Billing Rate / Unit" description="Rate per unit of measurement billed to the client">
          <input
            type="number"
            min="0"
            step="1"
            className="form-control"
            style={{ padding: "3px 8px", fontSize: 11, maxWidth: 100 }}
            value={m.billingRate ?? ""}
            placeholder="Rate"
            onChange={(e) => onChange("billingRate", Number(e.target.value))}
          />
        </FormField>
        <FormField label="Target Value" description="Target value for cumulative progress calculation">
          <input
            type="number"
            min="0"
            step="1"
            className="form-control"
            style={{ padding: "3px 8px", fontSize: 11, maxWidth: 100 }}
            value={m.targetValue ?? ""}
            placeholder="Target (for cumulative progress calculation)"
            onChange={(e) => onChange("targetValue", Number(e.target.value))}
          />
        </FormField>
        {/* Photo proof toggle */}
        <FormField label="Photo Proof" description="Whether the field requires a photo proof for completion">
          <div
            onClick={() => onChange("requiresPhoto", !m.requiresPhoto)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 12px",
              borderRadius: 8,
              cursor: "pointer",
              background: m.requiresPhoto
                ? "rgba(59,130,246,.12)"
                : "rgba(255,255,255,.04)",
              border: `1px solid ${m.requiresPhoto ? "rgba(59,130,246,.35)" : "var(--border)"}`,
              transition: "all .15s",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 14 }}>📷</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: m.requiresPhoto ? "#60A5FA" : "var(--text2)",
              }}
            >
              {m.requiresPhoto ? "Required" : "Optional"}
            </span>
            <div
              style={{
                width: 28,
                height: 16,
                borderRadius: 8,
                background: m.requiresPhoto
                  ? "#3B82F6"
                  : "rgba(255,255,255,.12)",
                position: "relative",
                transition: "all .2s",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: 2,
                  left: m.requiresPhoto ? 14 : 2,
                  transition: "left .2s",
                }}
              />
            </div>
          </div>
        </FormField>
      </div>

      {/* Photo hint shown below when required */}
      {m.requiresPhoto && (
        <div
          style={{
            margin: "0 12px 10px",
            padding: "8px 12px",
            background: "rgba(59,130,246,.07)",
            border: "1px solid rgba(59,130,246,.2)",
            borderRadius: 8,
            fontSize: 11,
            color: "#93C5FD",
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <span style={{ flexShrink: 0, marginTop: 1 }}>📍</span>
          <span>
            Field engineers must attach at least one GPS-tagged photo when
            filling this field. Each photo collects:{" "}
            <code style={{ color: "#60A5FA" }}>url</code>,{" "}
            <code style={{ color: "#60A5FA" }}>caption</code>,{" "}
            <code style={{ color: "#60A5FA" }}>pointLocation</code> (gpsLat,
            gpsLng), <code style={{ color: "#60A5FA" }}>capturedAt</code>.
          </span>
        </div>
      )}
      {expanded &&
        (needsOptions ? (
          <OptionsEditor
            options={m.options || []}
            onChange={(opts) => onChange("options", opts)}
          />
        ) : needsColumns ? (
          <ColumnsEditor
            columns={m.columns || []}
            onChange={(cols) => onChange("columns", cols)}
            depth={0}
          />
        ) : null)}
    </div>
  );
}
