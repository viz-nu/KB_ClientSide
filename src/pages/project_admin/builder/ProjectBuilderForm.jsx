import { useState } from "react";
import {
  FormField,
  PageHeader,
  EmptyState,
  AlertBanner,
  Spinner,
} from "../../../components/common";
import {
  addMeasurement,
  addChapter,
  updateChapter,
  deleteChapter,
  moveChapter,
  addItem,
  updateItem,
  deleteItem,
  moveItem,
  updateMeasurement,
  deleteMeasurement,
  moveMeasurement,
  CHAPTER_COLORS,
  deepClean,
} from "./projectTemplates.js";
import MeasurementFieldEditor from "./MeasurementFieldEditor";
import { useMutation } from "@apollo/client";
import { PROJECT_QUERIES } from "../../../apollo/gql.js";

export default function ProjectBuilderForm({
  project: initial,
  onSave,
  onCancel,
}) {
  const [createProject] = useMutation(PROJECT_QUERIES.create);
  const [updateProject] = useMutation(PROJECT_QUERIES.update);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [proj, setProj] = useState(initial);
  const isEdit = !!proj._id;
  const projectId = isEdit ? proj._id : null;
  const [activeChapterId, setActCh] = useState(
    initial.chapters[0]?._id || null,
  );
  const [activeItemId, setActItem] = useState(null);
  const [errors, setErrors] = useState({});

  const setProjField = (k, v) => {
    setProj((prev) => {
      const keys = k.split(".");
      const newState = { ...prev };
      let curr = newState;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        // if last key → assign value
        if (i === keys.length - 1) {
          curr[key] = v;
        } else {
          // ensure object exists + clone it
          curr[key] = { ...(curr[key] || {}) };
          curr = curr[key];
        }
      }
      return newState;
    });
  };

  const validate = () => {
    const e = {};
    if (!proj.name.trim()) e.name = "Project name required";
    if (!proj.code.trim()) e.code = "Project code required";
    if (!proj.chapters.length) e.chapters = "Add at least one chapter";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = async (status) => {
    if (!validate()) return;
    setSaving(true);
    setApiError("");
  
    const cleaned = deepClean({ ...proj, status }); // strips _id, __typename, localId everywhere
  
    if (isEdit) {
      try {
        await updateProject({
          variables: { id: projectId, projectInput: cleaned }, // proj._id kept separately
        });
        onSave({ ...proj, status });
      } catch (err) {
        setApiError(err.message || "Failed to update project.");
      } finally {
        setSaving(false);
      }
    } else {
      try {
        const result = await createProject({
          variables: { projectInput: cleaned },
        });
        onSave({ ...proj, _id: result.data.createProject._id, status });
      } catch (err) {
        setApiError(err.message || "Failed to create project.");
      } finally {
        setSaving(false);
      }
    }
  };

  const activeChapter = proj.chapters.find((c) => c._id === activeChapterId);
  const activeItem = activeChapter?.items.find((i) => i._id === activeItemId);

  return (
    <div className="fade-up">
      <PageHeader
        title={initial.name || "New Project"}
        subtitle="Define chapters, work items and measurement fields"
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-outline"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleSave("ACTIVE")}
              disabled={saving}
            >
              {saving ? <Spinner size={13} color="var(--navy)" /> : "Publish →"}
            </button>
          </div>
        }
      />

      {/* Project details */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title" style={{ marginBottom: 16 }}>
          Project Details
        </div>
        <div className="form-row">
          <FormField label="Project Name" error={errors.name} required>
            <input
              className="form-control"
              value={proj.name}
              onChange={(e) => setProjField("name", e.target.value)}
              placeholder="e.g. Secunderabad Yard Remodelling"
            />
          </FormField>
          <FormField label="Project Code" error={errors.code} required>
            <input
              className="form-control"
              value={proj.code}
              onChange={(e) =>
                setProjField("code", e.target.value.toUpperCase())
              }
              placeholder="e.g. SYR-2026"
              style={{ fontFamily: "monospace" }}
            />
          </FormField>
        </div>
        <FormField label="Description">
          <input
            className="form-control"
            value={proj.description}
            onChange={(e) => setProjField("description", e.target.value)}
            placeholder="Brief description of project scope"
          />
        </FormField>
        <FormField label="Alloted Budjet">
          <input
            className="form-control"
            type="number"
            step="1"
            value={proj.Vault?.allotedBudjet}
            onChange={(e) =>
              setProjField("Vault.allotedBudjet", Number(e.target.value))
            }
            placeholder="Alloted Budjet"
          />
        </FormField>
        {errors.chapters && (
          <AlertBanner type="error" message={errors.chapters} />
        )}
        {apiError && <AlertBanner type="error" message={apiError} />}
      </div>

      {/* 3-col builder */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 260px 1fr",
          gap: 14,
          alignItems: "start",
        }}
      >
        {/* Col 1: Chapters */}
        <div className="card" style={{ padding: 14 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Chapters
            </span>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => addChapter(setProj, setActCh, setActItem)}
            >
              +
            </button>
          </div>
          {proj.chapters.length === 0 ? (
            <div
              style={{
                fontSize: 12,
                color: "var(--text3)",
                textAlign: "center",
                padding: "16px 0",
              }}
            >
              No chapters yet
            </div>
          ) : (
            proj.chapters.map((ch) => (
              <div
                key={ch._id}
                onClick={() => {
                  setActCh(ch._id);
                  setActItem(null);
                }}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  marginBottom: 4,
                  cursor: "pointer",
                  background:
                    activeChapterId === ch._id
                      ? ch.color + "22"
                      : "rgba(255,255,255,.03)",
                  border: `1px solid ${activeChapterId === ch._id ? ch.color + "66" : "transparent"}`,
                  borderLeft: `3px solid ${ch.color}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ch.name || (
                        <span style={{ color: "var(--text3)" }}>Untitled</span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--text3)",
                        marginTop: 1,
                      }}
                    >
                      {ch.items.length} items
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 2 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "2px 4px", fontSize: 10 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveChapter(setProj, setActCh, setActItem, ch._id, -1);
                      }}
                    >
                      ▲
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "2px 4px", fontSize: 10 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveChapter(setProj, setActCh, setActItem, ch._id, 1);
                      }}
                    >
                      ▼
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ padding: "2px 4px", fontSize: 10 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChapter(setProj, setActCh, setActItem, ch._id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Col 2: Items */}
        <div className="card" style={{ padding: 14 }}>
          {!activeChapter ? (
            <div
              style={{
                fontSize: 12,
                color: "var(--text3)",
                textAlign: "center",
                padding: "24px 0",
              }}
            >
              Select a chapter
            </div>
          ) : (
            <>
              <div
                style={{
                  marginBottom: 14,
                  paddingBottom: 14,
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <FormField label="Chapter Name">
                  <input
                    className="form-control"
                    value={activeChapter.name}
                    onChange={(e) =>
                      updateChapter(
                        setProj,
                        activeChapter._id,
                        "name",
                        e.target.value,
                      )
                    }
                    placeholder="e.g. Cable Works"
                  />
                </FormField>
                <div className="form-row">
                  <FormField label="Code">
                    <input
                      className="form-control"
                      value={activeChapter.code}
                      onChange={(e) =>
                        updateChapter(
                          setProj,
                          activeChapter._id,
                          "code",
                          e.target.value.toUpperCase(),
                        )
                      }
                      placeholder="CW"
                      style={{ fontFamily: "monospace" }}
                    />
                  </FormField>
                  <FormField label="Color">
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                        paddingTop: 4,
                      }}
                    >
                      {CHAPTER_COLORS.map((c) => (
                        <div
                          key={c}
                          onClick={() =>
                            updateChapter(
                              setProj,
                              activeChapter._id,
                              "color",
                              c,
                            )
                          }
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: c,
                            cursor: "pointer",
                            border:
                              activeChapter.color === c
                                ? "3px solid #fff"
                                : "2px solid transparent",
                            flexShrink: 0,
                          }}
                        />
                      ))}
                    </div>
                  </FormField>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  Work Items
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    addItem(setProj, setActItem, activeChapter._id)
                  }
                >
                  +
                </button>
              </div>
              {activeChapter.items.length === 0 ? (
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text3)",
                    textAlign: "center",
                    padding: "12px 0",
                  }}
                >
                  No items yet
                </div>
              ) : (
                activeChapter.items.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setActItem(item._id)}
                    style={{
                      padding: "9px 12px",
                      borderRadius: 8,
                      marginBottom: 4,
                      cursor: "pointer",
                      background:
                        activeItemId === item._id
                          ? "rgba(244,160,28,.1)"
                          : "rgba(255,255,255,.03)",
                      border: `1px solid ${activeItemId === item._id ? "rgba(244,160,28,.3)" : "transparent"}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.label || (
                            <span style={{ color: "var(--text3)" }}>
                              Untitled item
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "var(--text3)",
                            marginTop: 1,
                          }}
                        >
                          <code style={{ fontSize: 10 }}>
                            {item.code || "—"}
                          </code>{" "}
                          · {item.measurements.length} fields
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 2 }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: "2px 4px", fontSize: 10 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveItem(
                              setProj,
                              setActItem,
                              activeChapter._id,
                              item._id,
                              -1,
                            );
                          }}
                        >
                          ▲
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: "2px 4px", fontSize: 10 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveItem(
                              setProj,
                              setActItem,
                              activeChapter._id,
                              item._id,
                              1,
                            );
                          }}
                        >
                          ▼
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          style={{ padding: "2px 4px", fontSize: 10 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(
                              setProj,
                              setActItem,
                              activeChapter._id,
                              item._id,
                            );
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Col 3: Measurement fields */}
        <div className="card" style={{ padding: 14 }}>
          {!activeItem ? (
            <div
              style={{
                fontSize: 12,
                color: "var(--text3)",
                textAlign: "center",
                padding: "40px 0",
              }}
            >
              Select a work item to edit its fields
            </div>
          ) : (
            <>
              <div
                style={{
                  marginBottom: 14,
                  paddingBottom: 14,
                  borderBottom: "1px solid var(--border)",
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
                  Work Item Details
                </div>
                <div className="form-row">
                  <FormField label="Item Label" required>
                    <input
                      className="form-control"
                      value={activeItem.label}
                      onChange={(e) =>
                        updateItem(
                          setProj,
                          activeChapter._id,
                          activeItem._id,
                          "label",
                          e.target.value,
                        )
                      }
                      placeholder="e.g. Cable Laying (Quad)"
                    />
                  </FormField>
                  <FormField label="Item Code" required>
                    <input
                      className="form-control"
                      value={activeItem.code}
                      onChange={(e) =>
                        updateItem(
                          setProj,
                          activeChapter._id,
                          activeItem._id,
                          "code",
                          e.target.value.toUpperCase(),
                        )
                      }
                      placeholder="e.g. CW-001"
                      style={{ fontFamily: "monospace" }}
                    />
                  </FormField>
                </div>
                <FormField label="Description">
                  <input
                    className="form-control"
                    value={activeItem.description}
                    onChange={(e) =>
                      updateItem(
                        setProj,
                        activeChapter._id,
                        activeItem._id,
                        "description",
                        e.target.value,
                      )
                    }
                    placeholder="Brief description for field engineers"
                  />
                </FormField>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  Measurement Fields
                </span>
              </div>
              {activeItem.measurements.length === 0 ? (
                <EmptyState
                  icon="📐"
                  title="No fields defined"
                  message="Add measurement fields that field engineers will fill in."
                  action={
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        addMeasurement(
                          setProj,
                          activeChapter._id,
                          activeItem._id,
                        )
                      }
                    >
                      + Add First Field
                    </button>
                  }
                />
              ) : (
                activeItem.measurements.map((m, idx) => (
                  <MeasurementFieldEditor
                    key={m._id}
                    m={m}
                    idx={idx}
                    total={activeItem.measurements.length}
                    onChange={(k, v) =>
                      updateMeasurement(
                        setProj,
                        activeChapter._id,
                        activeItem._id,
                        m._id,
                        k,
                        v,
                      )
                    }
                    onDelete={() =>
                      deleteMeasurement(
                        setProj,
                        activeChapter._id,
                        activeItem._id,
                        m._id,
                      )
                    }
                    onMove={(dir) =>
                      moveMeasurement(
                        setProj,
                        activeChapter._id,
                        activeItem._id,
                        m._id,
                        dir,
                      )
                    }
                  />
                ))
              )}
              <button
                className="btn btn-primary btn-sm"
                onClick={() =>
                  addMeasurement(setProj, activeChapter._id, activeItem._id)
                }
              >
                + Add Field
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
