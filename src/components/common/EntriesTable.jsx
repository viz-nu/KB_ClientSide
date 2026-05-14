import { StatusBadge } from "./index.jsx";

export default function EntriesTable({ filtered, setSelected, selectionDisabled = false }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Project / Span</th>
          <th>Category</th>
          <th>Line Items</th>
          <th>Status</th>
          <th>Remarks</th>
          <th>Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((e) => (
          <tr key={e._id}>
            {/* ── Project / Span ── */}
            <td>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
                onClick={() => setSelected(e)}
                disabled={selectionDisabled}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  {e.project?.name ?? "—"}
                </span>
                <span style={{ fontSize: 11, color: "var(--accent)" }}>
                  ↳ {e.span?.name ?? "—"}
                </span>
                {e.locationDescription && (
                  <span style={{ fontSize: 10, color: "var(--text3)" }}>
                    📍 {e.locationDescription}
                  </span>
                )}
              </button>
            </td>

            {/* ── Category ── */}
            <td style={{ fontSize: 11 }}>
              {e.WorkCategory?.split(" (")[0] ?? "—"}
            </td>

            {/* ── Line Items Summary ── */}
            <td style={{ maxWidth: 260 }}>
              <LineItemsSummary lineItems={e.lineItems} />
            </td>

            {/* ── Status ── */}
            <td>
              <StatusBadge status={e.status} />
            </td>

            {/* ── Remarks ── */}
            <td style={{ fontSize: 11, color: "var(--text2)", maxWidth: 180 }}>
              {e.adminRemark || e.remarks ? (
                <span
                  style={{
                    color:
                      e.status === "REJECTED"
                        ? "var(--red)"
                        : e.status === "RETURNED"
                          ? "var(--yellow)"
                          : "var(--text2)",
                  }}
                >
                  {e.adminRemark || e.remarks}
                </span>
              ) : (
                "—"
              )}
            </td>

            {/* ── Date ── */}
            <td
              style={{
                fontSize: 11,
                color: "var(--text2)",
                whiteSpace: "nowrap",
              }}
            >
              {e.createdAt
                ? new Date(e.createdAt).toLocaleString("en-IN")
                : "—"}
            </td>

            {/* ── Action ── */}
            <td>
              <button
                className="btn btn-outline btn-sm"
                disabled={selectionDisabled}
                onClick={() => setSelected(e)}
              >
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LineItemsSummary({ lineItems }) {
  if (!lineItems?.length)
    return <span style={{ fontSize: 11, color: "var(--text3)" }}>—</span>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {lineItems.map((group, gi) => {
        const measurements = group.measurements ?? [];
        if (!measurements.length) return null;

        return (
          <div key={gi} style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {measurements.map((m, mi) => {
              const displayVal =
                "fixedNumber" in m
                  ? `${m.fixedNumber}${m.unit ? " " + m.unit : ""}`
                  : Array.isArray(m.value)
                  ? m.value.join(", ")
                  : m.type === "boolean" && m.value != null
                  ? m.value ? "Yes" : "No"
                  : m.value != null && m.value !== ""
                  ? `${m.value}${m.unit ? " " + m.unit : ""}`
                  : null;

              if (!displayVal) return null;

              return (
                <span
                  key={mi}
                  style={{
                    fontSize: 10,
                    padding: "1px 7px",
                    borderRadius: 20,
                    background: "rgba(255,255,255,.05)",
                    border: "1px solid var(--border)",
                    color: "var(--text2)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {m.label}:{" "}
                  <span style={{ color: "var(--text)", fontWeight: 600 }}>
                    {displayVal}
                  </span>
                  {m.photos?.length > 0 && (
                    <span style={{ color: "var(--accent)", marginLeft: 4 }}>
                      📷{m.photos.length}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}