import CameraCapture from "./CameraCapture";

// ── Table Input (recursive) ───────────────────────────────────────
function TableInput({ dim, value, onChange, depth = 0 }) {
  const cols = dim.columns || [];
  const rows = Array.isArray(value) ? value : [];
  const isWide = (col) => col.type === "table" || col.type === "multiselect";

  const emptyRow = () =>
    Object.fromEntries(
      cols.map((c) => [
        c.key,
        c.type === "boolean" ? false : c.type === "table" ? [] : "",
      ]),
    );

  const addRow = () => onChange([...rows, emptyRow()]);
  const removeRow = (i) => onChange(rows.filter((_, ri) => ri !== i));
  const updateCell = (ri, key, v) =>
    onChange(rows.map((r, i) => (i === ri ? { ...r, [key]: v } : r)));

  if (cols.length === 0)
    return (
      <div className="form-group" style={{ gridColumn: "1 / -1" }}>
        <label className="form-label">{dim.label}</label>
        <div style={{ fontSize: 12, color: "var(--text3)", padding: "10px 0" }}>
          No columns defined.
        </div>
      </div>
    );

  return (
    <div className="form-group" style={{ gridColumn: "1 / -1" }}>
      {depth === 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <label className="form-label">{dim.label}</label>
          <button
            className="btn btn-outline btn-sm"
            type="button"
            onClick={addRow}
          >
            + Add Row
          </button>
        </div>
      )}
      {rows.length === 0 ? (
        <div
          style={{
            fontSize: 12,
            color: "var(--text3)",
            padding: depth === 0 ? "10px 0" : 0,
          }}
        >
          {depth === 0 ? "No rows — click Add Row." : "—"}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((row, rIdx) => (
            <div
              key={rIdx}
              style={{
                background: "rgba(255,255,255,.03)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "12px 14px",
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
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--accent)",
                    background: "rgba(244,160,28,.12)",
                    padding: "2px 8px",
                    borderRadius: 10,
                  }}
                >
                  Row {rIdx + 1}
                </span>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  style={{ padding: "3px 8px", fontSize: 11 }}
                  onClick={() => removeRow(rIdx)}
                >
                  Remove
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
                  gap: 10,
                }}
              >
                {cols.map((col) => (
                  <div
                    key={col.key}
                    style={isWide(col) ? { gridColumn: "1 / -1" } : {}}
                  >
                    <MeasurementInput
                      dim={col}
                      value={row[col.key]}
                      onChange={(v) => updateCell(rIdx, col.key, v)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {depth === 0 && rows.length > 0 && (
        <button
          className="btn btn-outline btn-sm"
          type="button"
          style={{ marginTop: 10 }}
          onClick={addRow}
        >
          + Add Row
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MEASUREMENT INPUT — main export
// ═══════════════════════════════════════════════════════════════════
export default function MeasurementInput({ dim, value, onChange, photos }) {
  const label = `${dim.label}${dim.unit ? ` (${dim.unit})` : ""}`;

  const hasPhotos = !!dim.requiresPhoto;
  const setFieldValue = (v) =>
    hasPhotos ? onChange(v, photos ?? []) : onChange(v);

  const setPhotos = (p) => onChange(value, p);

  const fieldNode = renderField(dim, label, value, setFieldValue);

  if (!hasPhotos) return fieldNode;

  return (
    <div style={{ gridColumn: "1 / -1" }}>
      {fieldNode}
      <div
        style={{
          marginTop: 10,
          padding: "10px 14px",
          background: "rgba(59,130,246,.06)",
          border: "1px solid rgba(59,130,246,.2)",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <span>📍</span>
          <span style={{ fontSize: 11, color: "#93C5FD", fontWeight: 600 }}>
            GPS-tagged photo required for <strong>{dim.label}</strong>
          </span>
          {photos?.length === 0 && (
            <span
              style={{
                marginLeft: "auto",
                fontSize: 10,
                fontWeight: 700,
                color: "var(--red)",
                background: "rgba(239,68,68,.12)",
                border: "1px solid rgba(239,68,68,.25)",
                padding: "2px 8px",
                borderRadius: 10,
                letterSpacing: ".06em",
              }}
            >
              REQUIRED
            </span>
          )}
        </div>
        <CameraCapture
          photos={photos}
          setPhotos={setPhotos}
          fieldLabel={dim.label}
        />
      </div>
    </div>
  );
}

// ── renderField — pure field rendering, no photo logic ───────────
function renderField(dim, label, value, onChange) {
  switch (dim.type) {
    case "boolean": {
      const checked = value === true || value === "true";
      return (
        <div
          onClick={() => !dim.fixed && onChange(!checked)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            background: checked
              ? "rgba(34,197,94,.1)"
              : "rgba(255,255,255,.03)",
            border: `1px solid ${checked ? "rgba(34,197,94,.3)" : "var(--border)"}`,
            borderRadius: 8,
            cursor: dim.fixed ? "default" : "pointer",
            transition: "all .15s",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              flexShrink: 0,
              background: checked ? "var(--green)" : "transparent",
              border: `2px solid ${checked ? "var(--green)" : "var(--border)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: "var(--navy)",
              fontWeight: 700,
              transition: "all .15s",
            }}
          >
            {checked ? "✓" : ""}
          </div>
          <span
            style={{
              fontSize: 12,
              color: checked ? "var(--green)" : "var(--text2)",
              fontWeight: checked ? 600 : 400,
            }}
          >
            {dim.label}
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: 11,
              fontWeight: 600,
              color: checked ? "var(--green)" : "var(--text3)",
            }}
          >
            {checked ? "YES" : "NO"}
          </span>
        </div>
      );
    }

    case "select": {
      return (
        <div className="form-group">
          <label className="form-label">{label}</label>
          <select
            className="form-control"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={dim.fixed !== undefined}
            style={
              dim.fixed !== undefined
                ? { opacity: 0.6, cursor: "not-allowed" }
                : {}
            }
          >
            <option value="">Select…</option>
            {(dim.options || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }

    case "text": {
      return (
        <div className="form-group">
          <label className="form-label">{label}</label>
          <input
            className="form-control"
            type="text"
            value={dim.fixedText !== undefined ? dim.fixedText : (value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            readOnly={dim.fixedText !== undefined}
            style={
              dim.fixedText !== undefined
                ? { opacity: 0.6, cursor: "not-allowed" }
                : {}
            }
          />
        </div>
      );
    }

    case "multiselect": {
      const selected = Array.isArray(value) ? value : [];
      const toggle = (opt) =>
        onChange(
          selected.includes(opt)
            ? selected.filter((v) => v !== opt)
            : [...selected, opt],
        );
      return (
        <div className="form-group">
          <label className="form-label">
            {label}
            {selected.length > 0 && (
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 10,
                  color: "var(--accent)",
                  fontWeight: 600,
                }}
              >
                {selected.length} selected
              </span>
            )}
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {(dim.options || []).map((opt) => {
              const active = selected.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: active ? 600 : 400,
                    cursor: "pointer",
                    transition: "all .15s",
                    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                    background: active
                      ? "rgba(244,160,28,.15)"
                      : "rgba(255,255,255,.03)",
                    color: active ? "var(--accent)" : "var(--text2)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {active ? "✓ " : ""}
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    case "time": {
      return (
        <div className="form-group">
          <label className="form-label">{label}</label>
          <input
            className="form-control"
            type="time"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            readOnly={dim.fixed !== undefined}
            style={
              dim.fixed !== undefined
                ? { opacity: 0.6, cursor: "not-allowed", colorScheme: "dark" }
                : { colorScheme: "dark" }
            }
          />
        </div>
      );
    }

    case "number": {
      return (
        <div className="form-group">
          <label className="form-label">{label}</label>
          <input
            className="form-control"
            type="number"
            min="0"
            step="0.001"
            value={
              dim.fixedNumber !== undefined ? dim.fixedNumber : (value ?? "")
            }
            onChange={(e) => onChange(e.target.value)}
            readOnly={dim.fixedNumber !== undefined}
            style={
              dim.fixedNumber !== undefined
                ? { opacity: 0.6, cursor: "not-allowed" }
                : {}
            }
          />
        </div>
      );
    }

    case "phone": {
      const raw = value ?? "";
      const format = (v) => {
        const d = v.replace(/\D/g, "");
        if (d.length <= 2) return d.length ? "+" + d : "";
        if (d.length <= 7) return `+${d.slice(0, 2)} ${d.slice(2)}`;
        if (d.length <= 12)
          return `+${d.slice(0, 2)} ${d.slice(2, 7)} ${d.slice(7)}`;
        return `+${d.slice(0, 2)} ${d.slice(2, 7)} ${d.slice(7, 12)}`;
      };
      const isValid = /^\+\d{1,3} \d{4,6} \d{4,6}$/.test(raw) || raw === "";
      return (
        <div className="form-group">
          <label className="form-label">{label}</label>
          <div style={{ position: "relative" }}>
            <input
              className="form-control"
              type="tel"
              value={raw}
              placeholder="+91 98765 43210"
              onChange={(e) => onChange(format(e.target.value))}
              style={{
                paddingLeft: 36,
                borderColor: !isValid && raw ? "var(--red)" : undefined,
              }}
            />
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 14,
                pointerEvents: "none",
              }}
            >
              📞
            </span>
          </div>
          {!isValid && raw && (
            <div style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>
              Enter a valid phone number with country code
            </div>
          )}
        </div>
      );
    }

    case "table": {
      return <TableInput dim={dim} value={value} onChange={onChange} />;
    }

    default: {
      return (
        <div className="form-group">
          <label className="form-label">{label}</label>
          <input
            className="form-control"
            type="number"
            min="0"
            step="0.001"
            value={
              dim.fixedNumber !== undefined ? dim.fixedNumber : (value ?? "")
            }
            onChange={(e) => onChange(e.target.value)}
            readOnly={dim.fixedNumber !== undefined}
            style={
              dim.fixedNumber !== undefined
                ? { opacity: 0.6, cursor: "not-allowed" }
                : {}
            }
          />
        </div>
      );
    }
  }
}
