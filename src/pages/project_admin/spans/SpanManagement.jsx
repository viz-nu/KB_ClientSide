import { useState } from "react";
import {
  PageHeader,
  ConfirmDialog,
  FormField,
  EmptyState,
  AlertBanner,
  Tabs,
  Spinner,
} from "../../../components/common/index.jsx";
import {
  PROJECT_QUERIES,
  SPAN_QUERIES,
  USER_QUERIES,
} from "../../../apollo/gql.js";
import { useMutation, useQuery } from "@apollo/client";
import { SpanDetail } from "./components/spanDetails.jsx";
import { SpanForm } from "./components/spanForm.jsx";
import { PROGRESS_STAGES } from "../../../constants/spanConstants.js";

const emptySpan = () => ({
  _id: null,
  name: "",
  startPoint: {
    placeName: "",
    pointLocation: { type: "Point", coordinates: [0, 0] },
  },
  endPoint: {
    placeName: "",
    pointLocation: { type: "Point", coordinates: [0, 0] },
  },
  chapters: [],
  projectId: "",
  status: "PENDING",
  Vault: { allotedBudjet: 0, spentBudjet: 0 },
});

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function SpanManagement() {
  const {
    data: spansData,
    loading: spansLoading,
    // error: spansError,
    refetch: spansRefetch,
  } = useQuery(SPAN_QUERIES.list, {
    fetchPolicy: "cache-and-network",
    variables: { page: 1, limit: 10 },
  });
  const [createSpan] = useMutation(SPAN_QUERIES.create);
  const [updateSpan] = useMutation(SPAN_QUERIES.update);
  const spans = spansData?.spans?.data ?? [];
  const [view, setView] = useState("list"); // list | form | detail
  const [pov, setPov] = useState(""); // create | edit for forms
  const [activeSpan, setActive] = useState(null);
  const [delTarget, setDel] = useState(null);
  const {
    data: projectsData,
    // loading: projectsDataLoading,
    // error: projectsDataError,
    // refetch: projectsDataRefetch,
  } = useQuery(PROJECT_QUERIES.list, {
    fetchPolicy: "cache-and-network",
    variables: { page: 1, limit: 10 },
  });
  const openCreate = () => {
    setActive(emptySpan());
    setPov("create");
    setView("form");
  };
  const openEdit = (s) => {
    setActive(JSON.parse(JSON.stringify(s)));
    setPov("edit");
    setView("form");
  };
  const openDetail = (s) => {
    setActive(s);
    setView("detail");
  };

  const saveSpan = async (span) => {
    const spanInput = {
      Vault: {
        allotedBudjet: span.Vault.allotedBudjet,
        spentBudjet: span.Vault.spentBudjet,
      },
      chapters: span.chapters.map(({ __typename, _id, items, ...rest1 }) => ({
        ...rest1,
        id: _id,
        items: items.map(({ __typename, _id, ...rest2 }) => ({
          ...rest2,
          id: _id,
        })),
      })),
      startPoint: {
        placeName: span.startPoint.placeName,
        chainNumber: Number(span.startPoint.chainNumber),
        pointLocation: {
          type: "Point",
          coordinates: span.startPoint.pointLocation.coordinates,
        },
      },
      endPoint: {
        placeName: span.endPoint.placeName,
        chainNumber: Number(span.endPoint.chainNumber),
        pointLocation: {
          type: "Point",
          coordinates: span.endPoint.pointLocation.coordinates,
        },
      },
      name: span.name,
    };
    if (span._id) {
      await updateSpan({
        variables: {
          id: span._id,
          spanInput: spanInput,
        },
        update(cache) {
          cache.evict({ fieldName: "spans" });
          cache.gc();
        },
      });
    } else {
      spanInput.project = span.projectId;
      await createSpan({
        variables: { spanInput },
        update(cache) {
          cache.evict({ fieldName: "spans" });
          cache.gc();
        },
      });
    }
    spansRefetch();
    setView("list");
  };

  const deleteSpan = () => {
    //setSpans(ss => ss.filter(s => s._id !== delTarget._id));
    setDel(null);
  };
  switch (view) {
    case "form": {
      return (
        <SpanForm
          span={activeSpan}
          projects={projectsData?.projects?.data ?? []}
          onSave={saveSpan}
          onCancel={() => setView("list")}
          pov={pov}
        />
      );
    }
    case "detail": {
      return (
        <SpanDetail
          span={activeSpan}
          projects={projectsData?.projects?.data ?? []}
          onBack={() => setView("list")}
          onEdit={() => openEdit(activeSpan)}
        />
      );
    }
    case "list": {
      return (
        <div className="fade-up">
          <PageHeader
            title="Span Management"
            subtitle={`${spans.length} spans · ${spans.filter((s) => s.status === "COMPLETED").length} completed`}
            actions={
              <button className="btn btn-primary" onClick={openCreate}>
                + New Span
              </button>
            }
          />

          {spansLoading ? (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 48 }}
            >
              <Spinner size={32} />
            </div>
          ) : spans.length === 0 ? (
            <EmptyState
              icon="🛤️"
              title="No spans yet"
              message="Create a span to define a section of work between two points."
              action={
                <button className="btn btn-primary" onClick={openCreate}>
                  Create First Span
                </button>
              }
            />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))",
                gap: 16,
              }}
            >
              {spans.map((s) => (
                <SpanCard
                  key={s._id}
                  span={s}
                  project={(projectsData?.projects?.data ?? []).find(
                    (p) => p._id === s.projectId,
                  )}
                  onView={() => openDetail(s)}
                  onEdit={() => openEdit(s)}
                  onDelete={() => setDel(s)}
                />
              ))}
            </div>
          )}

          {delTarget && (
            <ConfirmDialog
              danger
              message={`Delete span "${delTarget.name}"? This cannot be undone.`}
              onConfirm={deleteSpan}
              onCancel={() => setDel(null)}
            />
          )}
        </div>
      );
    }
    default:
      break;
  }
}

// ─── Span Card ────────────────────────────────────────────────────
function SpanCard({ span: s, project, onView, onEdit, onDelete }) {
  const stage =
    PROGRESS_STAGES.find((p) => p.value === s.status) || PROGRESS_STAGES[0];
  const spentPct =
    s.Vault?.allotedBudjet > 0
      ? Math.min(
          100,
          Math.round((s.Vault.spentBudjet / s.Vault.allotedBudjet) * 100),
        )
      : 0;
  const barColor =
    spentPct > 85
      ? "var(--red)"
      : spentPct > 60
        ? "var(--yellow)"
        : "var(--green)";

  return (
    <div
      className="card"
      style={{
        borderTop: `3px solid ${stage.color}`,
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: stage.color,
              textTransform: "uppercase",
              letterSpacing: ".08em",
              background: stage.color + "18",
              border: `1px solid ${stage.color}44`,
              padding: "2px 8px",
              borderRadius: 10,
            }}
          >
            ● {stage.label}
          </span>
          {project && (
            <code
              style={{ fontSize: 10, color: "var(--accent)", fontWeight: 600 }}
            >
              {project.code}
            </code>
          )}
        </div>
        <div
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            fontSize: 15,
            marginBottom: 2,
          }}
        >
          {s.name}
        </div>
        {project && (
          <div style={{ fontSize: 11, color: "var(--text2)" }}>
            {project.name}
          </div>
        )}
      </div>

      {/* Route */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
          padding: "10px 12px",
          background: "rgba(255,255,255,.03)",
          borderRadius: 8,
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 9,
              color: "var(--text3)",
              textTransform: "uppercase",
              letterSpacing: ".07em",
              marginBottom: 2,
            }}
          >
            From
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {s.startPoint.placeName || "—"}
          </div>
          {s.startPoint.pointLocation.coordinates[0] && (
            <div
              style={{
                fontSize: 10,
                color: "var(--text3)",
                fontFamily: "monospace",
              }}
            >
              {Number(s.startPoint.pointLocation.coordinates[0])},{" "}
              {Number(s.startPoint.pointLocation.coordinates[1])}
            </div>
          )}
        </div>
        <div style={{ fontSize: 18, color: "var(--text3)", flexShrink: 0 }}>
          →
        </div>
        <div style={{ flex: 1, minWidth: 0, textAlign: "right" }}>
          <div
            style={{
              fontSize: 9,
              color: "var(--text3)",
              textTransform: "uppercase",
              letterSpacing: ".07em",
              marginBottom: 2,
            }}
          >
            To
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {s.endPoint.placeName || "—"}
          </div>
          {s.endPoint.pointLocation.coordinates[0] && (
            <div
              style={{
                fontSize: 10,
                color: "var(--text3)",
                fontFamily: "monospace",
              }}
            >
              {Number(s.endPoint.pointLocation.coordinates[0])},{" "}
              {Number(s.endPoint.pointLocation.coordinates[1])}
            </div>
          )}
        </div>
      </div>

      {/* Vault */}
      {s.Vault && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,.03)",
                padding: "8px 10px",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: ".07em",
                  marginBottom: 2,
                }}
              >
                Budget
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--accent)",
                  fontFamily: "monospace",
                }}
              >
                ₹{(s.Vault.allotedBudjet || 0).toLocaleString("en-IN")}
              </div>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,.03)",
                padding: "8px 10px",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: ".07em",
                  marginBottom: 2,
                }}
              >
                Spent
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text)",
                  fontFamily: "monospace",
                }}
              >
                ₹{(s.Vault.spentBudjet || 0).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
          {s.Vault.allotedBudjet > 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                  color: "var(--text3)",
                  marginBottom: 3,
                }}
              >
                <span>Utilisation</span>
                <span style={{ color: barColor, fontWeight: 600 }}>
                  {spentPct}%
                </span>
              </div>
              <div
                style={{
                  height: 4,
                  background: "rgba(255,255,255,.08)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${spentPct}%`,
                    height: "100%",
                    background: barColor,
                    borderRadius: 2,
                    transition: "width .4s",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 6,
          marginBottom: 12,
          paddingTop: 10,
          borderTop: "1px solid var(--border)",
        }}
      >
        {[
          ["📋", s.chapters?.length || 0, "Total Units"],
          ["📅", s.createdAt, "Created"],
        ].map(([icon, val, lbl]) => (
          <div key={lbl} style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700 }}
            >
              {val}
            </div>
            <div style={{ fontSize: 9, color: "var(--text3)" }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
        <button
          className="btn btn-outline btn-sm"
          style={{ flex: 1 }}
          onClick={onView}
        >
          👁 View
        </button>
        <button
          className="btn btn-primary btn-sm"
          style={{ flex: 1 }}
          onClick={onEdit}
        >
          ✏️ Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>
          🗑
        </button>
      </div>
    </div>
  );
}
