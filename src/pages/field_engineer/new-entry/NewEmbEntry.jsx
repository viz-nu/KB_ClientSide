import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth.js";
import { PageHeader, Spinner } from "../../../components/common/index.jsx";
import { useEmbForm } from "../../../hooks/useEmbForm.js";
import StepBasicInfo from "./components/StepBasicInfo.jsx";
import StepLineItems from "./components/StepLineItems.jsx";
import StepSEMChecklist from "./components/StepSEMChecklist.jsx";
import StepPhotosSubmit from "./components/StepPhotosSubmit.jsx";
import ProjectSpanModal from "./components/ProjectSpanModal.jsx";
export default function NewEmbEntry() {
  const navigate = useNavigate();
  const { form, handleSubmit, confirmAssignment, saving, setStep, step } =
    useEmbForm({ navigate });
  const { user } = useAuth();
  // add to state declarations (after saving):
  const [showProjectModal, setShowProjectModal] = useState(false);
  // const [assignment, setAssignment] = useState(null); // { projectId, projectName, spanId, spanName }
  // const total = form.lineItems.reduce((s, li) => s + (li.amount || 0), 0);

  const STEPS = [
    "Basic Info",
    "Line Items",
    "SEM Checklist",
    "Photos & Submit",
  ];

  return (
    <div className="fade-up">
      <PageHeader
        title="New e-MB Entry"
        subtitle="Create and submit measurement book entry"
      />

      <div className="card">
        {/* Step indicator */}
        <div className="step-bar">
          {STEPS.map((label, i) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                flex: i < STEPS.length - 1 ? 1 : 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  className={`step-dot ${i + 1 < step ? "done" : i + 1 === step ? "current" : "future"}`}
                >
                  {i + 1 < step ? "✓" : i + 1}
                </div>
                <div
                  className="step-label"
                  style={{
                    color: i + 1 === step ? "var(--accent)" : "var(--text2)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`step-line ${i + 1 < step ? "done" : "future"}`}
                />
              )}
            </div>
          ))}
        </div>

        {step === 1 && <StepBasicInfo />}

        {/* ── Step 2: Line Items */}
        {step === 2 && <StepLineItems />}

        {/* ── Step 3: SEM Checklist */}
        {step === 3 && <StepSEMChecklist />}

        {/* ── Step 4: Photos & Submit */}
        {step === 4 && <StepPhotosSubmit />}

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 28,
            paddingTop: 18,
            borderTop: "1px solid var(--border)",
          }}
        >
          <button
            className="btn btn-outline"
            onClick={() =>
              step === 1 ? navigate("/my-entries") : setStep((s) => s - 1)
            }
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            {step < 4 && (
              <button
                className="btn btn-primary"
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 1 && (!form.title || !form.workCategory)}
              >
                Next →
              </button>
            )}
            {step === 4 && (
              <>
                <button
                  className="btn btn-outline"
                  onClick={() => handleSubmit(true)}
                  disabled={saving}
                >
                  Save as Draft
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleSubmit(false)}
                  disabled={saving}
                >
                  {saving ? (
                    <Spinner size={14} color="var(--navy)" />
                  ) : (
                    "✓ Submit Entry"
                  )}
                </button>
              </>
            )}
          </div>

          {showProjectModal && (
            <ProjectSpanModal
              user={user}
              onClose={() => setShowProjectModal(false)}
              onConfirm={(result) => {
                confirmAssignment(result);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
