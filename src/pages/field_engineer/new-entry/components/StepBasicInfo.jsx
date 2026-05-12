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
    <div>
      {/* ── 1. Span selector ── */}
      <FormField label="Span" required>
        {spansLoading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Spinner size={16} />{" "}
            <span style={{ fontSize: 12, color: "var(--text2)" }}>
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
          >
            <option value="">Select span…</option>
            {spans.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
                {s.project?.name ? ` — ${s.project.name}` : ""}
              </option>
            ))}
          </select>
        )}
      </FormField>

      {/* Span summary pill */}
      {activeSpan && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: 8,
            marginBottom: 12,
            background: "rgba(59,130,246,.08)",
            border: "1px solid rgba(59,130,246,.2)",
            fontSize: 12,
          }}
        >
          <span style={{ color: "#60A5FA", fontWeight: 700 }}>
            🛤️ {activeSpan.name} {activeSpan.project?.name ? ` — ${activeSpan.project.name}` : ""}
          </span>
          <span style={{ color: "var(--text2)" }}>
            {activeSpan.startPoint?.placeName} →{" "}
            {activeSpan.endPoint?.placeName}
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              fontWeight: 600,
              color:
                {
                  PENDING: "#94A3B8",
                  IN_PROGRESS: "#FBBF24",
                  COMPLETED: "#22C55E",
                }[activeSpan.status] ?? "var(--text2)",
            }}
          >
            ● {activeSpan.status}
          </span>
        </div>
      )}

      {/* ── 2. Work category from span's chapters ── */}
      <FormField label="Work Category" required>
        <select
          className="form-control"
          value={form.workCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          disabled={!activeSpan}
        >
          <option value="">
            {activeSpan ? "Select chapter…" : "Select a span first…"}
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
          message={`${activeChapter.items?.length ?? 0} work items available under "${activeChapter.name}"`}
        />
      )}

      {/* ── 3. Location ── */}
      <FormField label="Location Description" required>
        <input
          className="form-control"
          value={form.locationDescription}
          onChange={(e) => set("locationDescription", e.target.value)}
          placeholder="e.g. Between Km 12.4 and 14.9, Up Main Line, Secunderabad Outer Yard"
        />
      </FormField>
    </div>
  );
}