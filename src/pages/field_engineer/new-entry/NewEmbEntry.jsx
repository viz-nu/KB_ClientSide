import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Spinner } from "../../../components/common/index.jsx";
import StepBasicInfo from "./components/StepBasicInfo.jsx";
import StepLineItems from "./components/StepLineItems.jsx";
import StepSubmit from "./components/StepSubmit.jsx";
import { useMutation, useQuery } from "@apollo/client";
import { SPAN_QUERIES, EMB_ENTRY } from "../../../apollo/gql.js";
import { deepClean } from "../../project_admin/builder/projectTemplates.js";
export default function NewEmbEntry() {
  const navigate = useNavigate();
  const [createEmbEntry] = useMutation(EMB_ENTRY.create);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    spanId: "",
    workCategory: "",
    locationDescription: "",
    lineItems: [],
    remarks: "",
  });
  // 🔹 generic setter
  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ─────────────────────────────
  // 📍 GPS
  // ─────────────────────────────
  const captureGPS = () => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        set("gpsLat", pos.coords.latitude.toFixed(6));
        set("gpsLng", pos.coords.longitude.toFixed(6));
      },
      () => alert("GPS capture failed. Please enter manually."),
    );
  };

  // ─────────────────────────────
  // 🚀 SUBMIT
  // ─────────────────────────────

  const handleSubmit = async (asDraft = false) => {
    try {
      const payload = {
        // status: asDraft ? "DRAFT" : "PENDING",
        spanId: form.spanId,
        locationDescription: form.locationDescription,
        remarks: form.remarks,
        WorkCategory: form.workCategory,
        lineItems: form.lineItems.map(li=>(deepClean(li))),
      };
      console.log("payload:", payload);
      setSaving(true);
      await createEmbEntry({ variables: { activityInput: payload } });
      setSaving(false);
      navigate("/my-entries");
    } catch (error) {
      console.error("Submit error:", error);
      setSaving(false);
      alert("Submit failed. Please try again.");
    }
  };

  const {
    data: spansData,
    loading: spansLoading,
    error: spansError,
  } = useQuery(SPAN_QUERIES.list, {
    fetchPolicy: "cache-and-network",
    variables: { page: 1, limit: 50 },
  });
  const spans = spansData?.spans?.data ?? [];
  const activeSpan = spans.find((s) => s._id === form.spanId) ?? null;
  const activeChapter =
    activeSpan?.chapters?.find((c) => c.name === form.workCategory) ?? null;

  // ─────────────────────────────
  // 📋 LINE ITEMS
  // ─────────────────────────────
  const addLine = () => {
    set("lineItems", [
      ...form.lineItems,
      {
        id: `li-${Date.now()}`,
        label: "",
        code: "",
        description: "",
        measurements: [],
        remarks: "",
      },
    ]);
  };

  const removeLine = (id) => {
    set(
      "lineItems",
      form.lineItems.filter((li) => li._id !== id),
    );
  };

  const updateLine = (id, lineItem) => {
    const existingLineItem = form.lineItems.find((li) => li._id === id);
    if (!existingLineItem) return;
    set(
      "lineItems",
      form.lineItems.map((li) =>
        li._id === id ? { ...existingLineItem, ...lineItem } : li,
      ),
    );
  };

  const handleSpanChange = (spanId) => {
    set("spanId", spanId);
    set("workCategory", ""); // reset downstream
    set("lineItems", []);
  };

  const handleCategoryChange = (name) => {
    set("workCategory", name);
    set("lineItems", []);
  };
  const STEPS = ["Basic Info", "Line Items", "Photos & Submit"];

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

        {step === 1 && (
          <StepBasicInfo
            form={form}
            set={set}
            captureGPS={captureGPS}
            spans={spans}
            spansLoading={spansLoading}
            spansError={spansError}
            activeSpan={activeSpan}
            activeChapter={activeChapter}
            handleSpanChange={handleSpanChange}
            handleCategoryChange={handleCategoryChange}
          />
        )}

        {/* ── Step 2: Line Items */}
        {step === 2 && (
          <StepLineItems
            form={form}
            set={set}
            activeChapter={activeChapter}
            addLine={addLine}
            updateLine={updateLine}
            removeLine={removeLine}
          />
        )}

        {/* ── Step 4: Submit */}
        {step === 3 && (
          <StepSubmit
            form={form}
            activeSpan={activeSpan}
            activeChapter={activeChapter}
          />
        )}

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
            {step < 3 && (
              <button
                className="btn btn-primary"
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 1 && !form.workCategory}
              >
                Next →
              </button>
            )}
            {step === 3 && (
              <>
                <button
                  className="btn btn-outline"
                  onClick={async () => {
                    await handleSubmit(true);
                  }}
                  disabled={saving}
                >
                  Save as Draft
                </button>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    await handleSubmit(false);
                  }}
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
        </div>
      </div>
    </div>
  );
}
