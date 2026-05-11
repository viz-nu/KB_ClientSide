export default function StepSubmit({
  form,
  activeSpan,
  activeChapter
}) {
  return (
    <div>
      {/* Summary box */}
      <div
        style={{
          marginTop: 24,
          padding: 18,
          background: "rgba(255,255,255,.03)",
          borderRadius: 10,
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-head)",
            fontSize: 15,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          Entry Summary
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          {[
            ["Project", activeSpan?.project?.name],
            ["Span", activeSpan?.name],
            ["Chapter", activeChapter?.name],
            ["Location", form.locationDescription],
            ["Line Items", form.lineItems.length],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                background: "rgba(255,255,255,.03)",
                padding: "8px 12px",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text2)",
                  textTransform: "uppercase",
                  letterSpacing: ".07em",
                  marginBottom: 2,
                }}
              >
                {k}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: k === "Total Value" ? 700 : 400,
                  color: k === "Total Value" ? "var(--accent)" : "var(--text)",
                }}
              >
                {v || "—"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
