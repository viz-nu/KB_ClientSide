// ═══════════════════════════════════════════════════════════════════
// UPDATE SPAN — Edit an existing span. Always has _id.
// Steps:
//   1 – Basic Info   (name, status — project is read-only)
//   2 – Chapters & Targets
//   3 – Route & GPS
//   4 – Vault
// Props:
//   span      – existing span object (required, must have _id)
//   projects  – array of project objects
//   onUpdate  – async (spanInput) => void
//   onCancel  – () => void
// ═══════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  FormField,
  PageHeader,
  AlertBanner,
} from "../../../../components/common";
import { PROJECT_QUERIES } from "../../../../apollo/gql";
import {
  ChapterTargetPicker,
  StatusPicker,
  RoutePointFields,
  VaultFields,
  StepIndicator,
  StepNav,
  targetKey,
  buildTargetedValues,
} from "./subComponents";

const STEPS = ["Basic info", "Chapters & targets"];

/**
 * Rebuild toggleState + inputVals from saved TargetedValues so
 * the picker is pre-filled when editing an existing span.
 */
function hydrateTargetState(TargetedValues = []) {
  const toggleState = {};
  const inputVals = {};
  TargetedValues.forEach(
    ({ chapterId, itemId, measurementLabel, targetValue }) => {
      const k = targetKey(chapterId, itemId, measurementLabel);
      toggleState[k] = true;
      inputVals[k] = String(targetValue ?? "");
    },
  );
  return { toggleState, inputVals };
}

export function UpdateSpan({
  span: initial,
  projects = [],
  onUpdate,
  onCancel,
}) {
  const [span, setSpan] = useState(() => JSON.parse(JSON.stringify(initial)));
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Pre-fill chapter selection from saved data
  const [selectedChapterIds, setSelectedChapterIds] = useState(
    () => new Set((initial.chapters ?? []).map((c) => c._id ?? c)),
  );
  const [{ toggleState, inputVals }, setTargetState] = useState(() =>
    hydrateTargetState(initial.TargetedValues),
  );

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

  // ── chapter target handlers ────────────────────────────────────
  const handleToggleChapter = (ch) => {
    setSelectedChapterIds((prev) => {
      const next = new Set(prev);
      if (next.has(ch._id)) {
        next.delete(ch._id);
        // Clear toggle/input for this chapter
        setTargetState(({ toggleState: t, inputVals: v }) => {
          const newT = { ...t };
          const newV = { ...v };
          Object.keys(newT)
            .filter((k) => k.startsWith(ch._id + "__"))
            .forEach((k) => {
              delete newT[k];
              delete newV[k];
            });
          return { toggleState: newT, inputVals: newV };
        });
      } else {
        next.add(ch._id);
      }
      return next;
    });
  };

  const handleToggleMeasure = (k) => {
    setTargetState(({ toggleState: t, inputVals: v }) => ({
      toggleState: { ...t, [k]: !t[k] },
      inputVals: v,
    }));
  };

  const handleInputChange = (k, value) => {
    setTargetState(({ toggleState: t, inputVals: v }) => ({
      toggleState: t,
      inputVals: { ...v, [k]: value },
    }));
  };

  // ── validation ─────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!span.name.trim()) e.name = "Span name is required";
    if (!span.startPoint.placeName.trim())
      e.startName = "Start point name is required";
    if (!span.endPoint.placeName.trim())
      e.endName = "End point name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      setStep(1);
      return;
    }
    setSaving(true);
    try {
      const resolvedChapters = (resolvedProject?.chapters ?? []).filter((ch) =>
        selectedChapterIds.has(ch._id),
      );
      await onUpdate({
        ...span,
        chapters: resolvedChapters,
        TargetedValues: buildTargetedValues(toggleState, inputVals),
      });
    } finally {
      setSaving(false);
    }
  };

  // ── derived ────────────────────────────────────────────────────
  const allProjects = projectsData?.projects?.data ?? projects;
  const resolvedProjectId = span.projectId || span.project?._id;
  const resolvedProject =
    allProjects.find((p) => p._id === resolvedProjectId) ||
    projects.find((p) => p._id === resolvedProjectId);

  return (
    <div className="fade-up">
      <PageHeader
        title="Edit Span"
        subtitle={`Editing: ${initial.name}`}
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-outline"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        }
      />

      <StepIndicator steps={STEPS} current={step} onJump={setStep} />

      <div className="card">
        {/* ── Step 1: Basic Info ── */}
        {step === 1 && (
          <>
            <div>
              {/* Project is read-only on edit */}
              <FormField label="Project">
                <input
                  className="form-control"
                  value={
                    resolvedProject
                      ? `${resolvedProject.name} (${resolvedProject.code})`
                      : resolvedProjectId
                  }
                  disabled
                  style={{ opacity: 0.6, cursor: "not-allowed" }}
                />
              </FormField>

              <FormField label="Span Name" required error={errors.name}>
                <input
                  className="form-control"
                  value={span.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Secunderabad → Begumpet"
                />
              </FormField>

              <FormField label="Progress Status">
                <StatusPicker
                  value={span.status}
                  onChange={(v) => set("status", v)}
                />
              </FormField>
            </div>
            <div>
              {[
                {
                  key: "startPoint",
                  label: "Start Point",
                  icon: "🟢",
                  errorKey: "startName",
                },
                {
                  key: "endPoint",
                  label: "End Point",
                  icon: "🔴",
                  errorKey: "endName",
                },
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
            <div>
              {Object.keys(errors).length > 0 && (
                <AlertBanner
                  type="error"
                  message={Object.values(errors).join(" · ")}
                />
              )}
              <VaultFields
                vault={span.Vault}
                onSet={(field, val) => set(`Vault.${field}`, val)}
              />
            </div>
          </>
        )}

        {/* ── Step 2: Chapters & Targets ── */}
        {step === 2 && (
          <div>
            {!resolvedProject ? (
              <AlertBanner
                type="error"
                message="Project could not be resolved."
              />
            ) : (
              <>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text2)",
                    marginBottom: 14,
                    padding: "10px 14px",
                    background: "rgba(255,255,255,.03)",
                    borderRadius: 8,
                    border: "1px solid var(--border2)",
                  }}
                >
                  Adjust chapter selection and measurement targets for this
                  span.
                </div>

                <ChapterTargetPicker
                  allChapters={resolvedProject.chapters ?? []}
                  selectedChapterIds={selectedChapterIds}
                  toggleState={toggleState}
                  inputVals={inputVals}
                  onToggleChapter={handleToggleChapter}
                  onToggleMeasure={handleToggleMeasure}
                  onInputChange={handleInputChange}
                />

                {selectedChapterIds.size > 0 && (
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 12,
                      color: "var(--text3)",
                      textAlign: "right",
                    }}
                  >
                    {selectedChapterIds.size} chapter
                    {selectedChapterIds.size !== 1 ? "s" : ""} selected ·{" "}
                    {Object.values(toggleState).filter(Boolean).length}{" "}
                    measurement
                    {Object.values(toggleState).filter(Boolean).length !== 1
                      ? "s"
                      : ""}{" "}
                    targeted
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <StepNav
          step={step}
          total={STEPS.length}
          onBack={() => (step === 1 ? onCancel() : setStep((s) => s - 1))}
          onNext={() => setStep((s) => s + 1)}
          onSubmit={handleSave}
          submitLabel={saving ? "Saving…" : "Save Changes"}
          submitDisabled={saving}
        />
      </div>
    </div>
  );
}
