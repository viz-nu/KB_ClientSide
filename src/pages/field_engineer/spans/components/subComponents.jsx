// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// Exports:
//   ChapterTargetPicker  – replaces old ChapterPicker
//                          Lets admin pick chapters AND toggle which
//                          measurements to track + set target values.
//   StatusPicker
//   RoutePointFields
//   VaultFields
//   StepIndicator
//   StepNav
// ═══════════════════════════════════════════════════════════════════
import { FormField } from "../../../../components/common";
import { PROGRESS_STAGES } from "../../../../constants/spanConstants";

// ─── helpers ──────────────────────────────────────────────────────
/** Stable key for a single measurement toggle/value */
export function targetKey(chapterId, itemId, measurementLabel) {
  return `${chapterId}__${itemId}__${measurementLabel}`;
}

/**
 * Build TargetedValues array from toggleState + inputVals.
 * Call this in handleCreate / handleUpdate before sending to API.
 */
export function buildTargetedValues(toggleState, inputVals) {
  return Object.entries(toggleState)
    .filter(([, on]) => on)
    .map(([key]) => {
      const [chapterId, itemId, measurementLabel] = key.split("__");
      return {
        chapterId,
        itemId,
        measurementLabel,
        targetValue: Number(inputVals[key] || 0),
      };
    });
}

// ═══════════════════════════════════════════════════════════════════
// ChapterTargetPicker
// Props:
//   allChapters   – full chapter objects from the resolved project
//   toggleState   – { [key]: boolean }   which measurements are on
//   inputVals     – { [key]: string }    target value inputs
//   onToggleChapter  – (chapter) => void   adds/removes whole chapter
//   onToggleMeasure  – (key) => void
//   onInputChange    – (key, value) => void
//   selectedChapterIds – Set of _ids that are currently selected
// ═══════════════════════════════════════════════════════════════════
export function ChapterTargetPicker({
  allChapters = [],
  selectedChapterIds,
  toggleState,
  inputVals,
  onToggleChapter,
  onToggleMeasure,
  onInputChange,
}) {
  if (!allChapters.length) {
    return (
      <p style={{ fontSize: 12, color: "var(--text3)", padding: "8px 0" }}>
        Select a project first.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {allChapters.map((ch) => {
        const isSelected = selectedChapterIds.has(ch._id);
        return (
          <div key={ch._id}>
            {/* Chapter header row — click to toggle selection */}
            <button
              type="button"
              onClick={() => onToggleChapter(ch)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 8,
                border: `1px solid ${isSelected ? ch.color : "var(--border)"}`,
                background: isSelected
                  ? ch.color + "12"
                  : "rgba(255,255,255,.03)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all .15s",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: ch.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? ch.color : "var(--text)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {isSelected ? "✓ " : ""}
                {ch.name}
              </span>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>
                {ch.items?.length ?? 0} items
              </span>
              <span style={{ fontSize: 12, color: "var(--text3)" }}>
                {isSelected ? "▲" : "▼"}
              </span>
            </button>

            {/* Expanded measurement targets — only when chapter is selected */}
            {isSelected && (
              <div
                style={{
                  marginTop: 4,
                  marginLeft: 12,
                  padding: "12px 14px",
                  background: "rgba(255,255,255,.02)",
                  borderRadius: 8,
                  border: "1px solid var(--border2)",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text3)",
                    marginBottom: 10,
                  }}
                >
                  Toggle which measurements to track and enter target values
                </p>

                {ch.items
                  ?.filter((it) => it.label && it.measurements?.length > 0)
                  .map((item) => (
                    <div key={item._id} style={{ marginBottom: 12 }}>
                      {/* Item label */}
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--text2)",
                          marginBottom: 6,
                          paddingBottom: 4,
                          borderBottom: "1px solid var(--border2)",
                        }}
                      >
                        {item.label}
                      </div>

                      {/* Measurements */}
                      {item.measurements.map((m, mi) => {
                        const k = targetKey(ch._id, item._id, m.label || mi);
                        const isOn = !!toggleState[k];
                        return (
                          <div
                            key={k}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              marginBottom: 6,
                            }}
                          >
                            {/* Toggle */}
                            <button
                              type="button"
                              onClick={() => onToggleMeasure(k)}
                              aria-label={`Toggle ${m.label}`}
                              style={{
                                width: 34,
                                height: 19,
                                borderRadius: 10,
                                border: "none",
                                background: isOn
                                  ? "var(--green)"
                                  : "rgba(255,255,255,.12)",
                                position: "relative",
                                cursor: "pointer",
                                flexShrink: 0,
                                transition: "background .15s",
                              }}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  top: 3,
                                  left: isOn ? 17 : 3,
                                  width: 13,
                                  height: 13,
                                  borderRadius: "50%",
                                  background: "#fff",
                                  transition: "left .15s",
                                }}
                              />
                            </button>

                            {/* Label */}
                            <span
                              style={{
                                flex: 1,
                                fontSize: 12,
                                color: isOn ? "var(--text)" : "var(--text3)",
                                transition: "color .15s",
                              }}
                            >
                              {m.label || `Measurement ${mi + 1}`}
                            </span>

                            {/* Unit */}
                            {m.unit && (
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "var(--text3)",
                                  width: 32,
                                }}
                              >
                                {m.unit}
                              </span>
                            )}

                            {/* Target input */}
                            <input
                              type="number"
                              min="0"
                              disabled={!isOn}
                              placeholder="target"
                              value={inputVals[k] ?? ""}
                              onChange={(e) => onInputChange(k, e.target.value)}
                              style={{
                                width: 90,
                                border: `1px solid ${isOn ? "var(--border)" : "var(--border2)"}`,
                                borderRadius: 6,
                                padding: "4px 8px",
                                fontSize: 12,
                                textAlign: "right",
                                background: "rgba(255,255,255,.04)",
                                color: isOn ? "var(--text)" : "var(--text3)",
                                fontFamily: "var(--font-body)",
                                opacity: isOn ? 1 : 0.4,
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// StatusPicker
// ═══════════════════════════════════════════════════════════════════
export function StatusPicker({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {PROGRESS_STAGES.map((ps) => (
        <button
          key={ps.value}
          type="button"
          onClick={() => onChange(ps.value)}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all .15s",
            border: `1px solid ${value === ps.value ? ps.color : "var(--border)"}`,
            background:
              value === ps.value ? ps.color + "22" : "rgba(255,255,255,.03)",
            color: value === ps.value ? ps.color : "var(--text2)",
          }}
        >
          ● {ps.label}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RoutePointFields
// ═══════════════════════════════════════════════════════════════════
export function RoutePointFields({
  label,
  icon,
  value,
  error,
  onSetField,
  onSetCoord,
  onCaptureGPS,
}) {
  const [lat, lng] = value.pointLocation.coordinates;
  return (
    <div
      style={{
        marginBottom: 20,
        padding: 16,
        background: "rgba(255,255,255,.03)",
        borderRadius: 10,
        border: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 700,
          fontSize: 14,
          marginBottom: 12,
        }}
      >
        {icon} {label}
      </div>

      <FormField label="Place Name" required error={error}>
        <input
          className="form-control"
          value={value.placeName}
          onChange={(e) => onSetField("placeName", e.target.value)}
          placeholder={
            label === "Start Point"
              ? "e.g. Secunderabad Junction"
              : "e.g. Begumpet Station"
          }
        />
      </FormField>

      <FormField label="Chain Number">
        <input
          className="form-control"
          type="number"
          value={value.chainNumber}
          onChange={(e) => onSetField("chainNumber", Number(e.target.value))}
        />
      </FormField>

      <div className="form-row">
        <button
          className="btn btn-outline btn-sm"
          type="button"
          onClick={onCaptureGPS}
        >
          📍 Capture Current GPS
        </button>
        {lat && lng ? (
          <span style={{ marginLeft: 10, fontSize: 12, color: "var(--green)" }}>
            ✓ {Number(lat).toFixed(6)}, {Number(lng).toFixed(6)}
          </span>
        ) : null}
      </div>

      <div className="form-row" style={{ marginTop: 8 }}>
        <FormField label="GPS Latitude">
          <input
            className="form-control"
            type="number"
            step="0.000001"
            value={lat}
            onChange={(e) => onSetCoord(0, e.target.value)}
            placeholder="17.432600"
          />
        </FormField>
        <FormField label="GPS Longitude">
          <input
            className="form-control"
            type="number"
            step="0.000001"
            value={lng}
            onChange={(e) => onSetCoord(1, e.target.value)}
            placeholder="78.501300"
          />
        </FormField>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VaultFields
// ═══════════════════════════════════════════════════════════════════
export function VaultFields({ vault, onSet }) {
  const pct =
    vault.allotedBudjet > 0
      ? Math.min(
          100,
          Math.round((vault.spentBudjet / vault.allotedBudjet) * 100),
        )
      : 0;
  const barColor =
    pct > 85 ? "var(--red)" : pct > 60 ? "var(--yellow)" : "var(--green)";
  const remaining = vault.allotedBudjet - vault.spentBudjet;

  return (
    <div>
      <div className="card-title" style={{ marginBottom: 16 }}>
        💰 Budget (Vault)
      </div>

      <div className="form-row">
        <FormField label="Allotted Budget ₹" required>
          <input
            className="form-control"
            type="number"
            min="0"
            step="1000"
            value={vault.allotedBudjet}
            onChange={(e) => onSet("allotedBudjet", Number(e.target.value))}
            placeholder="e.g. 5000000"
          />
        </FormField>
        <FormField label="Spent So Far ₹">
          <input
            className="form-control"
            type="number"
            min="0"
            step="1000"
            value={vault.spentBudjet}
            onChange={(e) => onSet("spentBudjet", Number(e.target.value))}
            placeholder="e.g. 0"
          />
        </FormField>
      </div>

      {vault.allotedBudjet > 0 && (
        <div
          style={{
            padding: "14px 16px",
            background: "rgba(255,255,255,.03)",
            borderRadius: 10,
            border: "1px solid var(--border)",
            marginTop: 8,
          }}
        >
          <div
            style={{ fontSize: 12, color: "var(--text2)", marginBottom: 10 }}
          >
            Budget Preview
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              marginBottom: 8,
            }}
          >
            <span style={{ color: "var(--text2)" }}>
              Remaining:{" "}
              <strong
                style={{
                  color: remaining >= 0 ? "var(--green)" : "var(--red)",
                }}
              >
                ₹{remaining.toLocaleString("en-IN")}
              </strong>
            </span>
            <span style={{ color: barColor, fontWeight: 700 }}>
              {pct}% utilised
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: "rgba(255,255,255,.08)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: barColor,
                borderRadius: 3,
                transition: "width .4s",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// StepIndicator
// ═══════════════════════════════════════════════════════════════════
export function StepIndicator({ steps, current, onJump }) {
  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 20 }}>
      {steps.map((label, i) => (
        <div
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            flex: i < steps.length - 1 ? 1 : 0,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: i + 1 < current ? "pointer" : "default",
            }}
            onClick={() => i + 1 < current && onJump(i + 1)}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                background:
                  i + 1 <= current ? "var(--accent)" : "rgba(255,255,255,.08)",
                color: i + 1 <= current ? "var(--navy)" : "var(--text2)",
                boxShadow:
                  i + 1 === current ? "0 0 0 3px rgba(244,160,28,.25)" : "none",
              }}
            >
              {i + 1 < current ? "✓" : i + 1}
            </div>
            <div
              style={{
                fontSize: 10,
                marginTop: 4,
                whiteSpace: "nowrap",
                color: i + 1 === current ? "var(--accent)" : "var(--text2)",
              }}
            >
              {label}
            </div>
          </div>

          {i < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 2,
                margin: "0 6px",
                marginBottom: 14,
                background:
                  i + 1 < current ? "var(--accent)" : "rgba(255,255,255,.08)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// StepNav
// ═══════════════════════════════════════════════════════════════════
export function StepNav({
  step,
  total,
  onBack,
  onNext,
  onSubmit,
  submitLabel,
  submitDisabled,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: 28,
        paddingTop: 18,
        borderTop: "1px solid var(--border)",
      }}
    >
      <button className="btn btn-outline" type="button" onClick={onBack}>
        {step === 1 ? "Cancel" : "← Back"}
      </button>
      {step < total ? (
        <button className="btn btn-primary" type="button" onClick={onNext}>
          Next →
        </button>
      ) : (
        <button
          className="btn btn-primary"
          type="button"
          onClick={onSubmit}
          disabled={submitDisabled}
        >
          {submitLabel}
        </button>
      )}
    </div>
  );
}
