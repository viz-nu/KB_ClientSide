import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Spinner } from "../../../components/common/index.jsx";
import StepBasicInfo from "./components/StepBasicInfo.jsx";
import StepLineItems from "./components/StepLineItems.jsx";
import StepSubmit from "./components/StepSubmit.jsx";
import { useMutation, useQuery } from "@apollo/client";
import { SPAN_QUERIES, EMB_ENTRY } from "../../../apollo/gql.js";
import { deepClean } from "../../../utils/helpers.js";
import { addLine, removeLine, updateLine } from "../common/index.js";
const STEPS = [
  { label: "Span & Category", icon: "📍" },
  { label: "Measurements",    icon: "📐" },
  { label: "Review & Submit", icon: "✅" },
];

export default function NewEmbEntry() {
  const navigate = useNavigate();
  const [createEmbEntry] = useMutation(EMB_ENTRY.create);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    spanId: "",
    chapter: "",
    locationDescription: "",
    lineItems: [],
    remarks: "",
  });

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const captureGPS = () => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => { set("gpsLat", pos.coords.latitude.toFixed(6)); set("gpsLng", pos.coords.longitude.toFixed(6)); },
      () => alert("GPS capture failed. Please enter manually.")
    );
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await createEmbEntry({
        variables: {
          activityInput: {
            spanId: form.spanId,
            locationDescription: form.locationDescription,
            chapter: form.chapter,
            lineItems: form.lineItems.map((li) => deepClean(li)),
          },
        },
      });
      setSaving(false);
      navigate("/my-entries");
    } catch (error) {
      console.error("Submit error:", error);
      setSaving(false);
      alert("Submit failed. Please try again.");
    }
  };

  const { data: spansData, loading: spansLoading, error: spansError } = useQuery(SPAN_QUERIES.list, {
    fetchPolicy: "cache-and-network",
    variables: { page: 1, limit: 50 },
  });

  const spans = spansData?.spans?.data ?? [];
  const activeSpan = spans.find((s) => s._id === form.spanId) ?? null;
  const activeChapter = activeSpan?.chapters?.find((c) => c.name === form.chapter) ?? null;


  const handleSpanChange = (spanId) => { set("spanId", spanId); set("chapter", ""); set("lineItems", []); };
  const handleChapterChange = (name) => { set("chapter", name); set("lineItems", []); };

  return (
    <div className="fade-up" style={{ maxWidth: 640, margin: "0 auto" }}>
      <PageHeader title="New e-MB Entry" subtitle="Measurement book entry" />

      {/* ── Step progress bar — mobile-optimised ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 0, marginBottom: 24, padding: "0 4px",
      }}>
        {STEPS.map((s, i) => {
          const n = i + 1;
          const done = n < step;
          const current = n === step;
          return (
            <div key={s.label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
              {/* Dot + label */}
              <div
                style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: done ? "pointer" : "default" }}
                onClick={() => done && setStep(n)}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: done ? 14 : 13, fontWeight: 700, transition: "all .2s",
                  background: done ? "var(--green)" : current ? "var(--accent)" : "rgba(255,255,255,.06)",
                  color: done || current ? "var(--navy)" : "var(--text3)",
                  border: current ? "2px solid var(--accent)" : "2px solid transparent",
                  boxShadow: current ? "0 0 0 4px rgba(244,160,28,.15)" : "none",
                }}>
                  {done ? "✓" : s.icon}
                </div>
                <div style={{
                  fontSize: 10, marginTop: 5, fontWeight: current ? 700 : 400, whiteSpace: "nowrap",
                  color: current ? "var(--accent)" : done ? "var(--green)" : "var(--text3)",
                }}>
                  {s.label}
                </div>
              </div>
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, marginBottom: 18, marginLeft: 4, marginRight: 4, borderRadius: 2, background: done ? "var(--green)" : "rgba(255,255,255,.08)", transition: "background .3s" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Card ── */}
      <div className="card" style={{ borderRadius: 18, padding: "18px 16px" }}>
        {step === 1 && (
          <StepBasicInfo
            form={form} set={set} captureGPS={captureGPS}
            spans={spans} spansLoading={spansLoading} spansError={spansError}
            activeSpan={activeSpan} activeChapter={activeChapter}
            handleSpanChange={handleSpanChange} handleChapterChange={handleChapterChange}
          />
        )}

        {step === 2 && (
          <StepLineItems
            form={form} set={set} activeChapter={activeChapter}
            addLine={addLine} updateLine={updateLine} removeLine={removeLine}
          />
        )}

        {step === 3 && (
          <StepSubmit form={form} activeSpan={activeSpan} activeChapter={activeChapter} />
        )}

        {/* ── Navigation ── */}
        <div style={{ display: "flex", gap: 10, marginTop: 28, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
          {/* Back / Cancel */}
          <button
            className="btn btn-outline"
            style={{ flex: 1, minHeight: 48, fontSize: 14 }}
            onClick={() => step === 1 ? navigate("/my-entries") : setStep((s) => s - 1)}
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>

          {/* Next / Submit */}
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
              {saving ? <Spinner size={16} color="var(--navy)" /> : "✓ Submit Entry"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}