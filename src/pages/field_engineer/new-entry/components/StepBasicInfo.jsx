import {
  FormField,
  AlertBanner,
  Spinner,
} from "../../../../components/common/index.jsx";

export default function StepBasicInfo({
  form,
  set,
  captureGPS,
  spans,
  spansLoading,
  spansError,
  activeSpan,
  activeChapter,
  handleSpanChange,
  handleCategoryChange,
}) {
  const chapters = activeSpan?.chapters ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Span selector */}
      <FormField
        label="Span"
        required
        description="Select the span for this entry"
      >
        {spansLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 0",
            }}
          >
            <Spinner size={16} />
            <span style={{ fontSize: 13, color: "var(--text2)" }}>
              Loading spans…
            </span>
          </div>
        ) : spansError ? (
          <AlertBanner
            type="error"
            message={`Failed to load spans: ${spansError.message}`}
          />
        ) : (
          <select
            className="form-control"
            value={form.spanId ?? ""}
            onChange={(e) => handleSpanChange(e.target.value)}
            style={{ fontSize: 15 }}
          >
            <option value="">Select span…</option>
            {spans.map((s) => (
              <option key={s._id} value={s._id}>
                {s.project?.name
                  ? `project : ${s.project.name} (${s.project.code})`
                  : ""}
                {s.project?.code ? `(${s.project.code})` : ""}
                {" — span : "}
                {s.name}
              </option>
            ))}
          </select>
        )}
      </FormField>

      {/* Active span summary */}
      {activeSpan && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            marginBottom: 4,
            background: "rgba(59,130,246,.08)",
            border: "1px solid rgba(59,130,246,.2)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#60A5FA", fontWeight: 700, fontSize: 13 }}>
              🛤️ {activeSpan.name}
              {activeSpan.project?.name ? ` — ${activeSpan.project.name}` : ""}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 10,
                color:
                  {
                    PENDING: "#94A3B8",
                    IN_PROGRESS: "#FBBF24",
                    COMPLETED: "#22C55E",
                  }[activeSpan.status] ?? "var(--text2)",
                background: "rgba(255,255,255,.06)",
              }}
            >
              ● {activeSpan.status}
            </span>
          </div>
          {(activeSpan.startPoint?.placeName ||
            activeSpan.endPoint?.placeName) && (
            <div style={{ fontSize: 12, color: "var(--text2)" }}>
              {activeSpan.startPoint?.placeName} →{" "}
              {activeSpan.endPoint?.placeName}
            </div>
          )}
        </div>
      )}

      {/* Work category */}
      <FormField
        label="Work Category"
        required
        description="Select the category for this work"
      >
        <select
          className="form-control"
          value={form.workCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          disabled={!activeSpan}
          style={{ fontSize: 15, opacity: !activeSpan ? 0.5 : 1 }}
        >
          <option value="">
            {activeSpan ? "Select category…" : "Select a span first…"}
          </option>
          {chapters.map((ch) => (
            <option key={ch._id} value={ch.name}>
              {ch.name}
            </option>
          ))}
        </select>
      </FormField>

      {activeChapter && (
        <AlertBanner
          type="info"
          message={`${activeChapter.items?.length ?? 0} items available in "${activeChapter.name}"`}
        />
      )}

      {/* Location */}
      <FormField
        label="Location Description"
        required
        description="Where the work is being carried out"
      >
        <textarea
          className="form-control"
          value={form.locationDescription}
          onChange={(e) => set("locationDescription", e.target.value)}
          placeholder="e.g. Between Km 12.4 and 14.9, Up Main Line, Secunderabad Outer Yard"
          rows={2}
          style={{ resize: "none", fontSize: 14 }}
        />
      </FormField>
    </div>
  );
}
