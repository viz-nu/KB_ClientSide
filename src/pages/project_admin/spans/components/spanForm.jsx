// ═══════════════════════════════════════════════════════════════════
// SPAN FORM — Create & Edit

import { useState } from "react";
import { PROGRESS_STAGES } from "../../../../constants/spanConstants";
import { useQuery } from "@apollo/client";
import {
  FormField,
  PageHeader,
  AlertBanner,
} from "../../../../components/common";
import { PROJECT_QUERIES } from "../../../../apollo/gql";

// ═══════════════════════════════════════════════════════════════════
export const SpanForm = ({
  span: initial,
  projects,
  onSave,
  onCancel
}) => {
  const [span, setSpan] = useState(initial);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const {
    data: projectsData,
    // loading: projectsDataLoading,
    // error: projectsDataError,
    // refetch: projectsDataRefetch,
  } = useQuery(PROJECT_QUERIES.list, {
    fetchPolicy: "cache-and-network",
    variables: { page: 1, limit: 10 },
  });
  const set = (path, val) => {
    setSpan((s) => {
      const updated = JSON.parse(JSON.stringify(s));
      const keys = path.split(".");
      let obj = updated;
      keys.slice(0, -1).forEach((k) => {
        obj = obj[k];
      });
      obj[keys[keys.length - 1]] = val;
      return updated;
    });
  };

  // Capture GPS for a point
  const captureGPS = (point) => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setSpan((s) => {
          const updated = JSON.parse(JSON.stringify(s));
          updated[point].pointLocation = {
            type: "Point",
            coordinates: [pos.coords.latitude, pos.coords.longitude],
          };
          return updated;
        });
      },
      () => alert("GPS capture failed."),
    );
  };
  const setCoord = (point, idx, val) => {
    setSpan((s) => {
      const updated = JSON.parse(JSON.stringify(s));
      updated[point].pointLocation.coordinates[idx] = Number(val);
      return updated;
    });
  };

  // When project changes — pull all work items as vendor units (all included by default)
  const handleProjectChange = (projId) => {
    set("projectId", projId);
    set("project", null); // ← clear the nested project object so resolvedProjectId stays consistent
    set("chapters", []);
  };

  const validate = () => {
    const e = {};
    // if (!span.name.trim()) e.name = "Span name required";
    // if (!span.startPoint.placeName.trim())
    //   e.startName = "Start point name required";
    // if (!span.endPoint.placeName.trim()) e.endName = "End point name required";
    // if (!span.projectId) e.projectId = "Project is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = () => {
    if (validate()) onSave(span);
  };
  const STEPS = ["Basic Info", "Route & GPS", "Vault"];
  const resolvedProjectId = span.projectId || span.project?._id;
  const project = projects.find((p) => p._id === resolvedProjectId);
  return (
    <div className="fade-up">
      <PageHeader
        title={span._id ? "Edit Span" : "New Span"}
        subtitle="Define route, project, work items and budget"
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-outline" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              {span._id ? "Save Changes" : "Create Span"}
            </button>
          </div>
        }
      />

      {/* Step indicator */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20 }}>
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
                cursor: i + 1 <= step ? "pointer" : "default",
              }}
              onClick={() => i + 1 < step && setStep(i + 1)}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  background:
                    i + 1 <= step ? "var(--accent)" : "rgba(255,255,255,.08)",
                  color: i + 1 <= step ? "var(--navy)" : "var(--text2)",
                  boxShadow:
                    i + 1 === step ? "0 0 0 3px rgba(244,160,28,.25)" : "none",
                }}
              >
                {i + 1 < step ? "✓" : i + 1}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: i + 1 === step ? "var(--accent)" : "var(--text2)",
                  marginTop: 4,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  margin: "0 6px",
                  marginBottom: 14,
                  background:
                    i + 1 < step ? "var(--accent)" : "rgba(255,255,255,.08)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="card">
        {/* ── Step 1: Basic Info */}
        {step === 1 && (
          <div>
            <FormField label="Project"  required>
              <select
                className="form-control"
                value={span.project?._id || span.projectId}
                onChange={(e) => handleProjectChange(e.target.value)}
              >
                <option value="">Select project…</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </FormField>
            {project && (
              <AlertBanner
                type="info"
                message={`${project.chapters.length} chapters available in "${project.name}"`}
              />
            )}
            <FormField label="Span Name"  required>
              <input
                className="form-control"
                value={span.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Secunderabad → Begumpet"
              />
            </FormField>
            <FormField label="Chapters" required>
              <div className="form-group">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(projectsData?.projects?.data ?? [])
                    .find((t) => t._id === resolvedProjectId) // ← use resolvedProjectId
                    ?.chapters.map((opt) => {
                      const active = (span.chapters ?? []).some((t) => t.name === opt.name );     
                      return (
                        <button
                          key={opt._id ?? opt.name}
                          type="button"
                          onClick={() => {
                            const already = (span.chapters ?? []).some(
                              (t) => t.name === opt.name
                            );
                            set(
                              "chapters",
                              already
                                ? span.chapters.filter((t) => t.name !== opt.name)
                                : [...(span.chapters ?? []), { ...opt, localId: opt._id ?? crypto.randomUUID() }],
                            );
                          }}
                          style={{
                            padding: "4px 12px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: active ? 600 : 400,
                            cursor: "pointer",
                            transition: "all .15s",
                            border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                            background: active
                              ? "rgba(244,160,28,.15)"
                              : "rgba(255,255,255,.03)",
                            color: active ? "var(--accent)" : "var(--text2)",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {active ? "✓ " : ""}
                          {opt.name}
                        </button>
                      );
                    })
                    }
                </div>
              </div>
            </FormField>
            <FormField label="Progress Status">
              <div style={{ display: "flex", gap: 8 }}>
                {PROGRESS_STAGES.map((ps) => (
                  <button
                    key={ps.value}
                    type="button"
                    onClick={() => set("status", ps.value)}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all .15s",
                      border: `1px solid ${span.status === ps.value ? ps.color : "var(--border)"}`,
                      background:
                        span.status === ps.value
                          ? ps.color + "22"
                          : "rgba(255,255,255,.03)",
                      color:
                        span.status === ps.value ? ps.color : "var(--text2)",
                    }}
                  >
                    ● {ps.label}
                  </button>
                ))}
              </div>
            </FormField>
          </div>
        )}

        {/* ── Step 2: Route & GPS */}
        {step === 2 && (
          <div>
            {[
              { key: "startPoint", label: "Start Point", icon: "🟢" },
              { key: "endPoint", label: "End Point", icon: "🔴" },
            ].map(({ key, label, icon }) => (
              <div
                key={key}
                style={{
                  marginBottom: 20,
                  padding: "16px",
                  background: "rgba(255,255,255,.03)",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 14,
                    marginBottom: 12,
                  }}
                >
                  {icon} {label}
                </div>
                <FormField
                  label="Place Name"
                  required
                >
                  <input
                    className="form-control"
                    value={span[key].placeName}
                    onChange={(e) => set(`${key}.placeName`, e.target.value)}
                    placeholder={
                      key === "startPoint"
                        ? "e.g. Secunderabad Junction"
                        : "e.g. Begumpet Station"
                    }
                  />
                </FormField>
                
                <FormField
                  label="Chain Number"
                >
                  <input
                    className="form-control"
                    type="number"
                    value={span[key].chainNumber}
                    onChange={(e) => set(`${key}.chainNumber`, Number(e.target.value))}
                    placeholder={
                      key === "startPoint" ? 3423 : 2354
                    }
                  />
                </FormField>
                <div className="form-row">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => captureGPS(key)}
                >
                  📍 Capture Current GPS
                </button>
                {span[key].pointLocation.coordinates[0] &&
                  span[key].pointLocation.coordinates[1] && (
                    <span
                      style={{
                        marginLeft: 10,
                        fontSize: 12,
                        color: "var(--green)",
                      }}
                    >
                      ✓ {Number(span[key].pointLocation.coordinates[0])},{" "}
                      {Number(span[key].pointLocation.coordinates[1])}
                    </span>
                  )}

                  <FormField label="GPS Latitude">
                    <input
                      className="form-control"
                      type="number"
                      step="0.000001"
                      value={span[key].pointLocation.coordinates[0]}
                      onChange={(e) => setCoord(key, 0, e.target.value)}
                      placeholder="17.432600"
                    />
                  </FormField>
                  <FormField label="GPS Longitude">
                    <input
                      className="form-control"
                      type="number"
                      step="0.000001"
                      value={span[key].pointLocation.coordinates[1]}
                      onChange={(e) => setCoord(key, 1, e.target.value)}
                      placeholder="78.501300"
                    />
                  </FormField>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ── Step 4: Vault */}
        {step === 3 && 
        //  show errors if exists
        (
          <div>
            {Object.keys(errors).length > 0 && (
              <AlertBanner type="error" message={Object.values(errors).join(", ")} />
            )}
            <div className="card-title" style={{ marginBottom: 16 }}>
              💰 Budget (Vault)
            </div>
            <div className="form-row">
              <FormField label="Allotted Budget ₹" required>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  step="1000"
                  value={span.Vault.allotedBudjet}
                  onChange={(e) =>
                    set("Vault.allotedBudjet", Number(e.target.value))
                  }
                  placeholder="e.g. 5000000"
                />
              </FormField>
              <FormField label="Spent So Far ₹">
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  step="1000"
                  value={span.Vault.spentBudjet}
                  onChange={(e) =>
                    set("Vault.spentBudjet", Number(e.target.value))
                  }
                  placeholder="e.g. 0"
                />
              </FormField>
            </div>

            {span.Vault.allotedBudjet > 0 && (
              <div
                style={{
                  padding: "14px 16px",
                  background: "rgba(255,255,255,.03)",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text2)",
                    marginBottom: 10,
                  }}
                >
                  Budget Preview
                </div>
                {(() => {
                  const pct = Math.min(
                    100,
                    Math.round(
                      (span.Vault.spentBudjet / span.Vault.allotedBudjet) * 100,
                    ),
                  );
                  const barColor =
                    pct > 85
                      ? "var(--red)"
                      : pct > 60
                        ? "var(--yellow)"
                        : "var(--green)";
                  const remaining =
                    span.Vault.allotedBudjet - span.Vault.spentBudjet;
                  return (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 12,
                          marginBottom: 8,
                        }}
                      >
                        <span style={{ color: "var(--text2)" }}>
                          Remaining:{" "}
                          <strong
                            style={{
                              color:
                                remaining >= 0 ? "var(--green)" : "var(--red)",
                            }}
                          >
                            ₹{remaining.toLocaleString("en-IN")}
                          </strong>
                        </span>
                        <span style={{ color: barColor, fontWeight: 700 }}>
                          {pct}% utilised
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: "rgba(255,255,255,.08)",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            background: barColor,
                            borderRadius: 3,
                            transition: "width .4s",
                          }}
                        />
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
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
            onClick={() => (step === 1 ? onCancel() : setStep((s) => s - 1))}
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            {step < 3 ? (
              <button
                className="btn btn-primary"
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 1 && !!errors.name}
              >
                Next →
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleSave}>
                {span._id ? "Save Changes" : "Create Span →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
