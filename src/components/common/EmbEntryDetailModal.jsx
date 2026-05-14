import { useState } from "react";
import { EmptyState, StatusBadge, Modal, AlertBanner, Tabs } from "./index.jsx";
import PhotoThumb from "./photoThumb.jsx";

// ─── Entry Detail Modal ──────────────────────────────────────────
export default function EmbEntryDetailModal({
  entry,
  onClose,
  isAdmin,
  onAction,
}) {
  const [tab, setTab] = useState("lineitems");
  const tabConfig = [
    { id: "lineitems", label: "Line Items", icon: "💰" },
    { id: "details", label: "Details", icon: "📋" },
    // { id: "audit", label: "Audit Log", icon: "🕐" },
  ];

  return (
    <Modal
      title={entry.title}
      onClose={onClose}
      size="lg"
      footer={
        isAdmin && entry.status === "SUBMITTED" ? (
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <button
              className="btn btn-success btn-sm"
              onClick={() => {
                onAction(entry, "APPROVE");
                onClose();
              }}
            >
              ✓ Approve
            </button>
            <button
              className="btn btn-danger  btn-sm"
              onClick={() => {
                onAction(entry, "REJECT");
                onClose();
              }}
            >
              ✕ Reject
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                onAction(entry, "RETURN");
                onClose();
              }}
            >
              ↩ Return
            </button>
            <div style={{ flex: 1 }} />
            <button className="btn btn-outline btn-sm" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        )
      }
    >
      <Tabs tabs={tabConfig} active={tab} onChange={setTab} />
      {tab === "lineitems" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {!entry.lineItems?.length ? (
            <EmptyState
              icon="💰"
              title="No line items"
              message="No line items were submitted with this entry."
            />
          ) : (
            entry.lineItems.map((group, gi) => (
              <div key={gi}>
                {entry.lineItems.length > 1 && <div>Group {gi + 1}</div>}
                {/* group itself IS the line item, group.measurements are the fields */}
                <LineItemCard key={gi} item={group} />
              </div>
            ))
          )}
        </div>
      )}
      {tab === "details" && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 14,
            }}
          >
            {[
              ["Status", <StatusBadge key="s" status={entry.status} />],
              ["Engineer", entry.createdBy.name],
              ["Span", entry.span.name],
              ["Project", entry.project.name],
              ["Category", entry.WorkCategory],
              ["Location", entry.locationDescription],
              [
                "Created",
                new Date(entry.createdAt).toLocaleString("en-IN") || "—",
              ],
              [
                "Last Updated",
                new Date(entry.updatedAt).toLocaleString("en-IN") || "—",
              ],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  background: "rgba(255,255,255,.03)",
                  padding: "10px 12px",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--text2)",
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                    marginBottom: 4,
                  }}
                >
                  {k}
                </div>
                <div style={{ fontSize: 13 }}>{v}</div>
              </div>
            ))}
          </div>
          {entry.adminRemark && (
            <AlertBanner
              type={entry.status === "APPROVED" ? "success" : "warning"}
              message={`Admin: ${entry.adminRemark}`}
            />
          )}
          {entry.returnReason && (
            <AlertBanner
              type="warning"
              message={`Return reason: ${entry.returnReason}`}
            />
          )}
          {entry.remarks && (
            <div
              style={{
                padding: "12px 14px",
                background: "rgba(255,255,255,.03)",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text2)",
                  textTransform: "uppercase",
                  letterSpacing: ".07em",
                  marginBottom: 4,
                }}
              >
                Field Remarks
              </div>
              <div style={{ fontSize: 13 }}>{entry.remarks}</div>
            </div>
          )}
        </div>
      )}

      {/* {tab === "audit" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {entry.auditLog?.map((log, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                padding: "12px 14px",
                background: "rgba(255,255,255,.03)",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(244,160,28,.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {{
                  SUBMITTED: "📤",
                  APPROVED: "✅",
                  REJECTED: "❌",
                  RETURNED: "↩",
                  CREATED: "➕",
                }[log.action] || "•"}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    {log.action}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text2)" }}>
                    {new Date(log.timestamp).toLocaleString("en-IN")}
                  </span>
                </div>
                <div
                  style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}
                >
                  by {log.user}
                </div>
                {log.note && (
                  <div
                    style={{ fontSize: 12, color: "var(--text)", marginTop: 4 }}
                  >
                    {log.note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )} */}
    </Modal>
  );
}
function LineItemCard({ item }) {
  const hasDesc = item.description && item.description !== item.label;
  const meas = item.measurements ?? [];
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 8,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          background: "rgba(255,255,255,.03)",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600 }}>
          {item.label || "Unnamed item"}
        </span>
        {item.code && (
          <code
            style={{
              fontSize: 10,
              padding: "2px 6px",
              background: "rgba(255,255,255,.06)",
              borderRadius: 4,
              border: "1px solid var(--border)",
            }}
          >
            {item.code}
          </code>
        )}
      </div>

      {/* Description */}
      {hasDesc && (
        <div
          style={{
            fontSize: 11,
            color: "var(--text2)",
            padding: "5px 12px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {item.description}
        </div>
      )}

      {/* Measurements */}
      <div>
        {meas.length === 0 ? (
          <div
            style={{
              padding: "8px 12px",
              fontSize: 12,
              color: "var(--text2)",
              fontStyle: "italic",
            }}
          >
            No measurements recorded
          </div>
        ) : (
          meas.map((m, i) => <MeasurementRow key={i} m={m} />)
        )}
      </div>

      {/* Item-level remark */}
      {item.remarks ? (
        <div
          style={{
            fontSize: 11,
            color: "var(--text2)",
            padding: "6px 12px",
            borderTop: "1px solid var(--border)",
          }}
        >
          Remark: {item.remarks}
        </div>
      ) : null}
    </div>
  );
}

function MeasurementRow({ m }) {
  const isTable = m.type === "table";
  const value = () => {
    if ("fixedNumber" in m)
      return (
        <span style={{ color: "var(--text2)", fontStyle: "italic" }}>
          {m.fixedNumber} <small>(fixed)</small>
        </span>
      );
    if (m.fixedText)
      return (
        <span style={{ color: "var(--text2)", fontStyle: "italic" }}>
          "{m.fixedText}" <small>(fixed)</small>
        </span>
      );
    if (m.type === "boolean")
      return m.value == null ? (
        "—"
      ) : (
        <span
          style={{
            fontWeight: 600,
            color: m.value ? "var(--green)" : "var(--red)",
          }}
        >
          {m.value ? "Yes" : "No"}
        </span>
      );
    if (m.type === "multiselect" && Array.isArray(m.value))
      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "flex-end",
          }}
        >
          {m.value.map((v) => (
            <span
              key={v}
              style={{
                fontSize: 10,
                padding: "2px 7px",
                borderRadius: 20,
                background: "rgba(255,255,255,.06)",
                border: "1px solid var(--border)",
              }}
            >
              {v}
            </span>
          ))}
        </div>
      );
    if (m.value != null && m.value !== "")
      return (
        <span>
          {m.value}
          {m.unit ? (
            <span
              style={{ fontSize: 10, color: "var(--text2)", marginLeft: 3 }}
            >
              {m.unit}
            </span>
          ) : null}
        </span>
      );
    return (
      <span style={{ color: "var(--text2)", fontStyle: "italic" }}>—</span>
    );
  };

  if (isTable) {
    return (
      <div
        style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)" }}
      >
        <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 6 }}>
          {m.label}
        </div>
        <TableValue m={m} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        padding: "7px 12px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div>
        <div style={{ fontSize: 12, color: "var(--text2)" }}>
          {m.label}
          {m.unit && (
            <span
              style={{ fontSize: 10, color: "var(--text3)", marginLeft: 4 }}
            >
              ({m.unit})
            </span>
          )}
        </div>
        <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>
          {m.type}
        </div>
        {m.requiresPhoto && m.photos?.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div
              style={{ fontSize: 10, color: "var(--text2)", marginBottom: 6 }}
            >
              📷 {m.photos.length} photo{m.photos.length > 1 ? "s" : ""}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {m.photos.map((p) => (
                <PhotoThumb key={p.id} photo={p} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          textAlign: "right",
          flexShrink: 0,
          maxWidth: 200,
        }}
      >
        {value()}
      </div>
    </div>
  );
}

function TableValue({ m }) {
  if (!m.value?.length)
    return (
      <span
        style={{ fontSize: 11, color: "var(--text2)", fontStyle: "italic" }}
      >
        no rows
      </span>
    );
  return (
    <div className="table-wrap" style={{ margin: 0 }}>
      <table style={{ fontSize: 11 }}>
        <thead>
          <tr>
            {m.columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {m.value.map((row, i) => (
            <tr key={i}>
              {m.columns.map((c) => (
                <td key={c.key}>
                  {Array.isArray(row[c.key]) ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                      {row[c.key].map((v) => (
                        <span
                          key={v}
                          style={{
                            fontSize: 10,
                            padding: "1px 6px",
                            borderRadius: 20,
                            background: "rgba(255,255,255,.06)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  ) : (
                    (row[c.key] ?? "—")
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
