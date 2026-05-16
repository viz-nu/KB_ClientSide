// ═══════════════════════════════════════════════════════════════════
// EditEmbEntry — Update an existing e-MB entry.
//
// Mirrors NewEmbEntry but:
//   • Span + work category are READ-ONLY (locked to original)
//   • Form is pre-filled from the existing entry
//   • Calls EMB_ENTRY.update mutation instead of create
//   • addLine bug fixed: uses _id consistently (crypto.randomUUID)
//
// Props:
//   entry       – the full entry object from the server
//   onSaved     – () => void   called after successful update
//   onCancel    – () => void
// ═══════════════════════════════════════════════════════════════════
import { useState } from "react";
import { PageHeader, Spinner } from "../../../components/common/index.jsx";
import StepBasicInfoReadOnly from "../../../components/common/StepBasicInfoReadOnly.jsx";
import StepLineItems from "../new-entry/components/StepLineItems.jsx";
import StepSubmit from "../new-entry/components/StepSubmit.jsx";
import { useMutation } from "@apollo/client";
import { EMB_ENTRY } from "../../../apollo/gql.js";
import { deepClean } from "../../../utils/helpers.js";
import { addLine, removeLine, updateLine } from "../common/index.js";
const STEPS = [
  { label: "Measurements", icon: "📐" },
  { label: "Review & Submit", icon: "✅" },
];

export default function EditEmbEntry({ entry, activeSpan, activeChapter, spanLoading, spanError, onSaved, onCancel }) {
  const [updateEmbEntry] = useMutation(EMB_ENTRY.update);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Pre-fill form from existing entry
  const [form, setForm] = useState(() => ({
    span: entry.span,
    chapter: entry.chapter,
    locationDescription: entry.locationDescription,
    remarks: entry.remarks,
    lineItems: (entry.lineItems ?? []).map((li) => ({
      ...li,
      _id: li._id ?? crypto.randomUUID(),
    })),
  }));

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // ── Line item helpers ─────────────────────────────────────────
  // Bug fix vs original: addLine uses _id (not id) so removeLine/updateLine work

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      setSaving(true);
      await updateEmbEntry({
        variables: {
          _id: entry._id,
            lineItems: form.lineItems.map((li) => deepClean(li)),
        },
        update(cache) {
          cache.evict({ fieldName: "embEntries" });
          cache.gc();
        },
      });
      setSaving(false);
      onSaved();
    } catch (error) {
      console.error("Update error:", error);
      setSaving(false);
      alert("Update failed. Please try again.");
    }
  };


  return (
    <div className="fade-up" style={{ maxWidth: 640, margin: "0 auto" }}>
      <PageHeader
        title="Edit e-MB Entry"
        subtitle={`Editing entry from ${new Date(entry.createdAt).toLocaleDateString("en-IN")}`}
      />

      {/* ── Step progress bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          marginBottom: 24,
          padding: "0 4px",
        }}
      >
        {STEPS.map((s, i) => {
          const n = i + 1;
          const done = n < step;
          const curr = n === step;
          return (
            <div
              key={s.label}
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
                  cursor: done ? "pointer" : "default",
                }}
                onClick={() => done && setStep(n)}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: done ? 14 : 13,
                    fontWeight: 700,
                    transition: "all .2s",
                    background: done
                      ? "var(--green)"
                      : curr
                        ? "var(--accent)"
                        : "rgba(255,255,255,.06)",
                    color: done || curr ? "var(--navy)" : "var(--text3)",
                    border: curr
                      ? "2px solid var(--accent)"
                      : "2px solid transparent",
                    boxShadow: curr ? "0 0 0 4px rgba(244,160,28,.15)" : "none",
                  }}
                >
                  {done ? "✓" : s.icon}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    marginTop: 5,
                    fontWeight: curr ? 700 : 400,
                    whiteSpace: "nowrap",
                    color: curr
                      ? "var(--accent)"
                      : done
                        ? "var(--green)"
                        : "var(--text3)",
                  }}
                >
                  {s.label}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    marginBottom: 18,
                    marginLeft: 4,
                    marginRight: 4,
                    borderRadius: 2,
                    background: done ? "var(--green)" : "rgba(255,255,255,.08)",
                    transition: "background .3s",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Card ── */}
      <div className="card" style={{ borderRadius: 18, padding: "18px 16px" }}>
        {step === 1 && (
          <>
            <StepBasicInfoReadOnly
              form={form}
              activeSpan={activeSpan}
              activeChapter={activeChapter}
              spansLoading={spanLoading}
              spansError={spanError}
            />
            <StepLineItems
              form={form}
              set={set}
              activeChapter={activeChapter}
              addLine={addLine}
              updateLine={updateLine}
              removeLine={removeLine}
            />
          </>
        )}
        {step === 2 && (
          <StepSubmit
            form={form}
            activeSpan={activeSpan}
            activeChapter={activeChapter}
          />
        )}

        {/* ── Navigation ── */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 28,
            paddingTop: 18,
            borderTop: "1px solid var(--border)",
          }}
        >
          <button
            className="btn btn-outline"
            style={{ flex: 1, minHeight: 48, fontSize: 14 }}
            onClick={() => (step === 1 ? onCancel() : setStep((s) => s - 1))}
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>

          {step < 3 ? (
            <button
              className="btn btn-primary"
              style={{ flex: 2, minHeight: 48, fontSize: 14, fontWeight: 700 }}
              onClick={() => setStep((s) => s + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              className="btn btn-primary"
              style={{ flex: 2, minHeight: 48, fontSize: 14, fontWeight: 700 }}
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? (
                <Spinner size={16} color="var(--navy)" />
              ) : (
                "✓ Save Changes"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
