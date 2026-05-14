// ═══════════════════════════════════════════════════════════════════
// CREATE SPAN — New span only. No _id, no "edit" branching.
// Props:
//   projects  – array of project objects
//   onCreate  – async (spanInput) => void   called on final submit
//   onCancel  – () => void
// ═══════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { PROGRESS_STAGES } from "../../../../constants/spanConstants";
import { FormField, PageHeader, AlertBanner } from "../../../../components/common";
import { PROJECT_QUERIES } from "../../../../apollo/gql";

const emptySpan = () => ({
  name: "",
  projectId: "",
  chapters: [],
  status: "PENDING",
  startPoint: {
    placeName: "",
    chainNumber: 0,
    pointLocation: { type: "Point", coordinates: [0, 0] },
  },
  endPoint: {
    placeName: "",
    chainNumber: 0,
    pointLocation: { type: "Point", coordinates: [0, 0] },
  },
  Vault: { allotedBudjet: 0, spentBudjet: 0 },
});

const STEPS = ["Basic Info", "Route & GPS", "Vault"];

export function CreateSpan({ projects = [], onCreate, onCancel }) {
  const [span, setSpan] = useState(emptySpan);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const { data: projectsData } = useQuery(PROJECT_QUERIES.list, {
    fetchPolicy: "cache-and-network",
    variables: { page: 1, limit: 10 },
  });

  // ── helpers ────────────────────────────────────────────────────
  const set = (path, val) =>
    setSpan((s) => {
      const next = JSON.parse(JSON.stringify(s));
      const keys = path.split(".");
      let cur = next;
      keys.slice(0, -1).forEach((k) => (cur = cur[k]));
      cur[keys[keys.length - 1]] = val;
      return next;
    });

  const setCoord = (point, idx, val) =>
    setSpan((s) => {
      const next = JSON.parse(JSON.stringify(s));
      next[point].pointLocation.coordinates[idx] = Number(val);
      return next;
    });

  const captureGPS = (point) =>
    navigator.geolocation?.getCurrentPosition(
      (pos) =>
        setSpan((s) => {
          const next = JSON.parse(JSON.stringify(s));
          next[point].pointLocation = {
            type: "Point",
            coordinates: [pos.coords.latitude, pos.coords.longitude],
          };
          return next;
        }),
      () => alert("GPS capture failed."),
    );

  const handleProjectChange = (projId) => {
    set("projectId", projId);
    set("chapters", []);
  };

  const validate = () => {
    const e = {};
    if (!span.name.trim()) e.name = "Span name is required";
    if (!span.projectId) e.projectId = "Project is required";
    if (!span.startPoint.placeName.trim()) e.startName = "Start point name is required";
    if (!span.endPoint.placeName.trim()) e.endName = "End point name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) {
      setStep(1); // surface errors on first step
      return;
    }
    setSaving(true);
    try {
      await onCreate(span);
    } finally {
      setSaving(false);
    }
  };

  // ── derived ────────────────────────────────────────────────────
  const resolvedProject =
    (projectsData?.projects?.data ?? []).find((p) => p._id === span.projectId) ||
    projects.find((p) => p._id === span.projectId);

  return (
    <div className="fade-up">
      <PageHeader
        title="New Span"
        subtitle="Define route, project, chapters and budget"
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-outline" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>
              {saving ? "Creating…" : "Create Span"}
            </button>
          </div>
        }
      />

      <StepIndicator steps={STEPS} current={step} onJump={setStep} />

      <div className="card">
        {/* ── Step 1: Basic Info */}
        {step === 1 && (
          <div>
            <FormField label="Project" required error={errors.projectId}>
              <select
                className="form-control"
                value={span.projectId}
                onChange={(e) => handleProjectChange(e.target.value)}
              >
                <option value="">Select project…</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </FormField>

            {resolvedProject && (
              <AlertBanner
                type="info"
                message={`${resolvedProject.chapters?.length ?? 0} chapters available in "${resolvedProject.name}"`}
              />
            )}

            <FormField label="Span Name" required error={errors.name}>
              <input
                className="form-control"
                value={span.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Secunderabad → Begumpet"
              />
            </FormField>

            <FormField label="Chapters">
              <ChapterPicker
                allChapters={resolvedProject?.chapters ?? []}
                selected={span.chapters}
                onChange={(chapters) => set("chapters", chapters)}
              />
            </FormField>

            <FormField label="Progress Status">
              <StatusPicker value={span.status} onChange={(v) => set("status", v)} />
            </FormField>
          </div>
        )}

        {/* ── Step 2: Route & GPS */}
        {step === 2 && (
          <div>
            {[
              { key: "startPoint", label: "Start Point", icon: "🟢", errorKey: "startName" },
              { key: "endPoint",   label: "End Point",   icon: "🔴", errorKey: "endName"   },
            ].map(({ key, label, icon, errorKey }) => (
              <RoutePointFields
                key={key}
                pointKey={key}
                label={label}
                icon={icon}
                value={span[key]}
                error={errors[errorKey]}
                onSetField={(field, val) => set(`${key}.${field}`, val)}
                onSetCoord={(idx, val) => setCoord(key, idx, val)}
                onCaptureGPS={() => captureGPS(key)}
              />
            ))}
          </div>
        )}

        {/* ── Step 3: Vault */}
        {step === 3 && (
          <div>
            {Object.keys(errors).length > 0 && (
              <AlertBanner type="error" message={Object.values(errors).join(" · ")} />
            )}
            <VaultFields vault={span.Vault} onSet={(field, val) => set(`Vault.${field}`, val)} />
          </div>
        )}

        <StepNav
          step={step}
          total={STEPS.length}
          onBack={() => (step === 1 ? onCancel() : setStep((s) => s - 1))}
          onNext={() => setStep((s) => s + 1)}
          onSubmit={handleCreate}
          submitLabel={saving ? "Creating…" : "Create Span →"}
          submitDisabled={saving}
        />
      </div>
    </div>
  );
}

// ─── Shared sub-components (local to this file) ───────────────────

function StepIndicator({ steps, current, onJump }) {
  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 20 }}>
      {steps.map((label, i) => (
        <div
          key={label}
          style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}
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
                width: 28, height: 28, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700,
                background: i + 1 <= current ? "var(--accent)" : "rgba(255,255,255,.08)",
                color: i + 1 <= current ? "var(--navy)" : "var(--text2)",
                boxShadow: i + 1 === current ? "0 0 0 3px rgba(244,160,28,.25)" : "none",
              }}
            >
              {i + 1 < current ? "✓" : i + 1}
            </div>
            <div
              style={{
                fontSize: 10, marginTop: 4, whiteSpace: "nowrap",
                color: i + 1 === current ? "var(--accent)" : "var(--text2)",
              }}
            >
              {label}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                flex: 1, height: 2, margin: "0 6px", marginBottom: 14,
                background: i + 1 < current ? "var(--accent)" : "rgba(255,255,255,.08)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function StepNav({ step, total, onBack, onNext, onSubmit, submitLabel, submitDisabled }) {
  return (
    <div
      style={{
        display: "flex", justifyContent: "space-between",
        marginTop: 28, paddingTop: 18, borderTop: "1px solid var(--border)",
      }}
    >
      <button className="btn btn-outline" onClick={onBack}>
        {step === 1 ? "Cancel" : "← Back"}
      </button>
      {step < total ? (
        <button className="btn btn-primary" onClick={onNext}>
          Next →
        </button>
      ) : (
        <button className="btn btn-primary" onClick={onSubmit} disabled={submitDisabled}>
          {submitLabel}
        </button>
      )}
    </div>
  );
}

function ChapterPicker({ allChapters, selected, onChange }) {
  if (!allChapters.length) {
    return <p style={{ fontSize: 12, color: "var(--text3)" }}>Select a project first.</p>;
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {allChapters.map((opt) => {
        const active = selected.some((t) => t.name === opt.name);
        return (
          <button
            key={opt._id ?? opt.name}
            type="button"
            onClick={() =>
              onChange(
                active
                  ? selected.filter((t) => t.name !== opt.name)
                  : [...selected, { ...opt, localId: opt._id ?? crypto.randomUUID() }],
              )
            }
            style={{
              padding: "4px 12px", borderRadius: 20, fontSize: 12,
              fontWeight: active ? 600 : 400, cursor: "pointer", transition: "all .15s",
              border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
              background: active ? "rgba(244,160,28,.15)" : "rgba(255,255,255,.03)",
              color: active ? "var(--accent)" : "var(--text2)",
              fontFamily: "var(--font-body)",
            }}
          >
            {active ? "✓ " : ""}{opt.name}
          </button>
        );
      })}
    </div>
  );
}

function StatusPicker({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {PROGRESS_STAGES.map((ps) => (
        <button
          key={ps.value}
          type="button"
          onClick={() => onChange(ps.value)}
          style={{
            flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12,
            fontWeight: 600, cursor: "pointer", transition: "all .15s",
            border: `1px solid ${value === ps.value ? ps.color : "var(--border)"}`,
            background: value === ps.value ? ps.color + "22" : "rgba(255,255,255,.03)",
            color: value === ps.value ? ps.color : "var(--text2)",
          }}
        >
          ● {ps.label}
        </button>
      ))}
    </div>
  );
}

function RoutePointFields({ label, icon, value, error, onSetField, onSetCoord, onCaptureGPS }) {
  const [lat, lng] = value.pointLocation.coordinates;
  return (
    <div
      style={{
        marginBottom: 20, padding: 16,
        background: "rgba(255,255,255,.03)", borderRadius: 10,
        border: "1px solid var(--border)",
      }}
    >
      <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
        {icon} {label}
      </div>
      <FormField label="Place Name" required error={error}>
        <input
          className="form-control"
          value={value.placeName}
          onChange={(e) => onSetField("placeName", e.target.value)}
          placeholder={label === "Start Point" ? "e.g. Secunderabad Junction" : "e.g. Begumpet Station"}
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
        <button className="btn btn-outline btn-sm" onClick={onCaptureGPS}>
          📍 Capture Current GPS
        </button>
        {lat && lng ? (
          <span style={{ marginLeft: 10, fontSize: 12, color: "var(--green)" }}>
            ✓ {Number(lat)}, {Number(lng)}
          </span>
        ) : null}
      </div>
      <div className="form-row" style={{ marginTop: 8 }}>
        <FormField label="GPS Latitude">
          <input
            className="form-control"
            type="number" step="0.000001"
            value={lat}
            onChange={(e) => onSetCoord(0, e.target.value)}
            placeholder="17.432600"
          />
        </FormField>
        <FormField label="GPS Longitude">
          <input
            className="form-control"
            type="number" step="0.000001"
            value={lng}
            onChange={(e) => onSetCoord(1, e.target.value)}
            placeholder="78.501300"
          />
        </FormField>
      </div>
    </div>
  );
}

function VaultFields({ vault, onSet }) {
  const pct = vault.allotedBudjet > 0
    ? Math.min(100, Math.round((vault.spentBudjet / vault.allotedBudjet) * 100))
    : 0;
  const barColor = pct > 85 ? "var(--red)" : pct > 60 ? "var(--yellow)" : "var(--green)";
  const remaining = vault.allotedBudjet - vault.spentBudjet;

  return (
    <div>
      <div className="card-title" style={{ marginBottom: 16 }}>💰 Budget (Vault)</div>
      <div className="form-row">
        <FormField label="Allotted Budget ₹" required>
          <input
            className="form-control" type="number" min="0" step="1000"
            value={vault.allotedBudjet}
            onChange={(e) => onSet("allotedBudjet", Number(e.target.value))}
            placeholder="e.g. 5000000"
          />
        </FormField>
        <FormField label="Spent So Far ₹">
          <input
            className="form-control" type="number" min="0" step="1000"
            value={vault.spentBudjet}
            onChange={(e) => onSet("spentBudjet", Number(e.target.value))}
            placeholder="e.g. 0"
          />
        </FormField>
      </div>
      {vault.allotedBudjet > 0 && (
        <div
          style={{
            padding: "14px 16px", background: "rgba(255,255,255,.03)",
            borderRadius: 10, border: "1px solid var(--border)", marginTop: 8,
          }}
        >
          <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 10 }}>Budget Preview</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
            <span style={{ color: "var(--text2)" }}>
              Remaining:{" "}
              <strong style={{ color: remaining >= 0 ? "var(--green)" : "var(--red)" }}>
                ₹{remaining.toLocaleString("en-IN")}
              </strong>
            </span>
            <span style={{ color: barColor, fontWeight: 700 }}>{pct}% utilised</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,.08)", borderRadius: 3, overflow: "hidden" }}>
            <div
              style={{
                width: `${pct}%`, height: "100%", background: barColor,
                borderRadius: 3, transition: "width .4s",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}