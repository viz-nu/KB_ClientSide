export default function StepSubmit({ form, activeSpan, activeChapter }) {
  const summaryRows = [
    ["Project", activeSpan?.project?.name],
    ["Span", activeSpan?.name],
    ["Category", activeChapter?.name],
    ["Location", form.locationDescription],
    [
      "Line Items",
      form.lineItems.length
        ? `${form.lineItems.length} item${form.lineItems.length !== 1 ? "s" : ""}`
        : null,
    ],
  ];

  const completedItems = form.lineItems.filter(
    (li) => li.label || li.scheduleItem,
  ).length;
  const allComplete =
    completedItems === form.lineItems.length && form.lineItems.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Ready banner */}
      {allComplete ? (
        <div
          style={{
            padding: "14px 16px",
            borderRadius: 12,
            background: "rgba(34,197,94,.08)",
            border: "1px solid rgba(34,197,94,.2)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <div
              style={{ fontSize: 13, fontWeight: 700, color: "var(--green)" }}
            >
              Ready to submit
            </div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
              All fields are complete.
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "14px 16px",
            borderRadius: 12,
            background: "rgba(251,191,36,.07)",
            border: "1px solid rgba(251,191,36,.2)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#FBBF24" }}>
              Incomplete entry
            </div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
              {form.lineItems.length === 0
                ? "No line items added."
                : `${form.lineItems.length - completedItems} item(s) missing work item selection.`}
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div
        style={{
          background: "rgba(255,255,255,.03)",
          borderRadius: 14,
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--border)",
            fontSize: 12,
            fontWeight: 700,
            color: "var(--text2)",
            textTransform: "uppercase",
            letterSpacing: ".08em",
          }}
        >
          Entry Summary
        </div>
        <div>
          {summaryRows.map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "12px 16px",
                borderBottom: "1px solid rgba(255,255,255,.04)",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "var(--text3)",
                  flexShrink: 0,
                  marginRight: 12,
                }}
              >
                {k}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: v ? "var(--text)" : "var(--text3)",
                  textAlign: "right",
                  wordBreak: "break-word",
                  maxWidth: "62%",
                }}
              >
                {v || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Line item quick list */}
      {form.lineItems.length > 0 && (
        <div
          style={{
            background: "rgba(255,255,255,.03)",
            borderRadius: 14,
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--border)",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text2)",
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            Line Items
          </div>
          {form.lineItems.map((li, i) => (
            <div
              key={li._id || i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                borderBottom: "1px solid rgba(255,255,255,.04)",
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: "rgba(244,160,28,.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 800,
                  color: "var(--accent)",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: li.label ? "var(--text)" : "var(--text3)",
                  flex: 1,
                }}
              >
                {li.label || li.scheduleItem || "Untitled item"}
              </span>
              {li.measurements?.length > 0 && (
                <>
                  {li.measurements.map((m) => (
                    <span
                      key={m._id}
                      style={{ fontSize: 11, color: "var(--text3)" }}
                    >{`${m.label}: ${m.value} ${m.unit ? m.unit : ""}`}</span>
                  ))}
                  <span style={{ fontSize: 11, color: "var(--text3)" }}>
                    {li.measurements.length} fields
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
