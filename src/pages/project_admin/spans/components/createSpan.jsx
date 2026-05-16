// ═══════════════════════════════════════════════════════════════════
// CREATE SPAN
// Steps:
//   1 – Basic Info   (name, project, status)
//   2 – Chapters & Targets  (chapter selection + per-measurement targets)
//   3 – Route & GPS
//   4 – Vault
// Props:
//   projects  – array of project objects
//   onCreate  – async (spanInput) => void
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
  buildTargetedValues,
} from "./subComponents";

const STEPS = ["Basic info", "Chapters & targets"];

const emptySpan = () => ({
  name: "",
  projectId: "",
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

export function CreateSpan({ projects = [], onCreate, onCancel }) {
  const [span, setSpan] = useState(emptySpan);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Chapter target state
  const [selectedChapterIds, setSelectedChapterIds] = useState(new Set());
  const [toggleState, setToggleState] = useState({});
  const [inputVals, setInputVals] = useState({});

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
    // Reset chapter state when project changes
    setSelectedChapterIds(new Set());
    setToggleState({});
    setInputVals({});
  };

  // ── chapter target handlers ────────────────────────────────────
  const handleToggleChapter = (ch) => {
    setSelectedChapterIds((prev) => {
      const next = new Set(prev);
      if (next.has(ch._id)) {
        next.delete(ch._id);
        // Clear all toggle/input state for this chapter's measurements
        const keysToRemove = Object.keys(toggleState).filter((k) =>
          k.startsWith(ch._id + "__"),
        );
        setToggleState((t) => {
          const n = { ...t };
          keysToRemove.forEach((k) => delete n[k]);
          return n;
        });
        setInputVals((v) => {
          const n = { ...v };
          keysToRemove.forEach((k) => delete n[k]);
          return n;
        });
      } else {
        next.add(ch._id);
      }
      return next;
    });
  };

  const handleToggleMeasure = (k) => {
    setToggleState((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const handleInputChange = (k, value) => {
    setInputVals((prev) => ({ ...prev, [k]: value }));
  };

  // ── validation ─────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!span.name.trim()) e.name = "Span name is required";
    if (!span.projectId) e.projectId = "Project is required";
    if (!span.startPoint.placeName.trim())
      e.startName = "Start point name is required";
    if (!span.endPoint.placeName.trim())
      e.endName = "End point name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) {
      setStep(1);
      return;
    }
    setSaving(true);
    try {
      // Attach selected chapters (as objects) and TargetedValues
      const resolvedChapters = (resolvedProject?.chapters ?? [])
        .filter((ch) => selectedChapterIds.has(ch._id))
        .map((ch) => ch._id);
      await onCreate({
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
  const resolvedProject =
    allProjects.find((p) => p._id === span.projectId) ||
    projects.find((p) => p._id === span.projectId);

  return (
    <div className="fade-up">
      <PageHeader
        title="New Span"
        subtitle="Define route, chapters, targets and budget"
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
              onClick={handleCreate}
              disabled={saving}
            >
              {saving ? "Creating…" : "Create Span"}
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
              <FormField label="Project" required error={errors.projectId}>
                <select
                  className="form-control"
                  value={span.projectId}
                  onChange={(e) => handleProjectChange(e.target.value)}
                >
                  <option value="">Select project…</option>
                  {allProjects.map((p) => (
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
                message="No project selected. Go back to step 1."
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
                  Select chapters for this span. Expand each to choose which
                  measurements to track and set target values.
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

        {/* ── Step 3: Route & GPS ──
        {step === 3 && (
       
        )} */}

        {/* ── Step 4: Vault ──
        {step === 4 && (
        )} */}

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
