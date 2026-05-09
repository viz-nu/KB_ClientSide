
import { useState } from "react";

// ─── Options editor for select / multiselect ─────────────────────
export default function OptionsEditor({ options, onChange }) {
    const [draft, setDraft] = useState("");
  
    const add = () => {
      const trimmed = draft.trim();
      if (!trimmed || options.includes(trimmed)) return;
      onChange([...options, trimmed]);
      setDraft("");
    };
  
    const remove = (opt) => onChange(options.filter((o) => o !== opt));
  
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        add();
      }
    };
  
    return (
      <div
        style={{
          padding: "10px 12px",
          borderTop: "1px solid var(--border)",
          background: "rgba(255,255,255,.02)",
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
          Options
        </div>
  
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}
        >
          {options.map((opt) => (
            <span
              key={opt}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 10px",
                borderRadius: 20,
                background: "rgba(244,160,28,.12)",
                border: "1px solid rgba(244,160,28,.25)",
                fontSize: 12,
                color: "var(--accent)",
              }}
            >
              {opt}
              <button
                onClick={() => remove(opt)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent)",
                  cursor: "pointer",
                  fontSize: 13,
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ×
              </button>
            </span>
          ))}
          {options.length === 0 && (
            <span style={{ fontSize: 11, color: "var(--text3)" }}>
              No options yet
            </span>
          )}
        </div>
  
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="form-control"
            style={{ fontSize: 12, padding: "6px 10px" }}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type option and press Enter…"
          />
          <button
            className="btn btn-outline btn-sm"
            onClick={add}
            disabled={!draft.trim()}
          >
            Add
          </button>
        </div>
      </div>
    );
  }