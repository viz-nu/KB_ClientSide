import { useState } from "react";
import {
  FormField,
  PageHeader,
  EmptyState,
  AlertBanner,
  Spinner,
} from "../../../components/common";
import {
  CHAPTER_COLORS,
  newChapter,
  newItem,
  newMeasurement,
} from "./projectTemplates.js";
import MeasurementFieldEditor from "./MeasurementFieldEditor";
import { useMutation } from "@apollo/client";
import { CREATE_PROJECT, UPDATE_PROJECT } from "../../../apollo/gql.js";

export default function ProjectBuilderForm({
  project: initial,
  onSave,
  onCancel,
}) {
  const PROJECT_INPUT_FIELDS = [
    "name",
    "code",
    "description",
    "status",
    "chapters",
    "Vault",
  ];

  const isDeepEqual = (a, b) => {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a == null || b == null) return false;

    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!isDeepEqual(a[i], b[i])) return false;
      }
      return true;
    }

    if (typeof a === "object") {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      for (const key of keysA) {
        if (!isDeepEqual(a[key], b[key])) return false;
      }
      return true;
    }

    return false;
  };

  const getChangedProjectInput = (previous, current) => {
    const changed = {};
    for (const field of PROJECT_INPUT_FIELDS) {
      if (!isDeepEqual(previous?.[field], current?.[field])) {
        changed[field] = current[field];
      }
    }
    return changed;
  };

  const [createProject] = useMutation(CREATE_PROJECT);
  const [updateProject] = useMutation(UPDATE_PROJECT);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const [proj, setProj] = useState(initial);
  const [activeChapterId, setActCh] = useState(initial.chapters[0]?.id || null);
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

  // chapters
  const addChapter = () => {
    const ch = newChapter(proj.chapters.length);
    setProj((p) => ({ ...p, chapters: [...p.chapters, ch] }));
    setActCh(ch.id);
    setActItem(null);
  };
  const updateChapter = (id, k, v) =>
    setProj((p) => ({
      ...p,
      chapters: p.chapters.map((c) => (c.id === id ? { ...c, [k]: v } : c)),
    }));
  const deleteChapter = (id) => {
    setProj((p) => ({ ...p, chapters: p.chapters.filter((c) => c.id !== id) }));
    setActCh(proj.chapters.find((c) => c.id !== id)?.id || null);
    setActItem(null);
  };
  const moveChapter = (id, dir) =>
    setProj((p) => {
      const a = [...p.chapters];
      const i = a.findIndex((c) => c.id === id);
      const t = i + dir;
      if (t < 0 || t >= a.length) return p;
      [a[i], a[t]] = [a[t], a[i]];
      return { ...p, chapters: a };
    });

  // items
  const addItem = (chId) => {
    const item = newItem();
    setProj((p) => ({
      ...p,
      chapters: p.chapters.map((c) =>
        c.id === chId ? { ...c, items: [...c.items, item] } : c,
      ),
    }));
    setActItem(item.id);
  };
  const updateItem = (chId, iId, k, v) =>
    setProj((p) => ({
      ...p,
      chapters: p.chapters.map((c) =>
        c.id === chId
          ? {
              ...c,
              items: c.items.map((i) => (i.id === iId ? { ...i, [k]: v } : i)),
            }
          : c,
      ),
    }));
  const deleteItem = (chId, iId) => {
    setProj((p) => ({
      ...p,
      chapters: p.chapters.map((c) =>
        c.id === chId
          ? { ...c, items: c.items.filter((i) => i.id !== iId) }
          : c,
      ),
    }));
    setActItem(null);
  };
  const moveItem = (chId, iId, dir) =>
    setProj((p) => ({
      ...p,
      chapters: p.chapters.map((c) => {
        if (c.id !== chId) return c;
        const a = [...c.items];
        const i = a.findIndex((x) => x.id === iId);
        const t = i + dir;
        if (t < 0 || t >= a.length) return c;
        [a[i], a[t]] = [a[t], a[i]];
        return { ...c, items: a };
      }),
    }));

  // measurements
  const addMeasurement = (chId, iId) => {
    const m = newMeasurement();
    setProj((p) => ({
      ...p,
      chapters: p.chapters.map((c) =>
        c.id === chId
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === iId
                  ? { ...i, measurements: [...i.measurements, m] }
                  : i,
              ),
            }
          : c,
      ),
    }));
  };
  const updateMeasurement = (chId, iId, mId, k, v) =>
    setProj((p) => ({
      ...p,
      chapters: p.chapters.map((c) =>
        c.id === chId
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === iId
                  ? {
                      ...i,
                      measurements: i.measurements.map((m) =>
                        m.id === mId ? { ...m, [k]: v } : m,
                      ),
                    }
                  : i,
              ),
            }
          : c,
      ),
    }));
  const deleteMeasurement = (chId, iId, mId) =>
    setProj((p) => ({
      ...p,
      chapters: p.chapters.map((c) =>
        c.id === chId
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === iId
                  ? {
                      ...i,
                      measurements: i.measurements.filter((m) => m.id !== mId),
                    }
                  : i,
              ),
            }
          : c,
      ),
    }));
  const moveMeasurement = (chId, iId, mId, dir) =>
    setProj((p) => ({
      ...p,
      chapters: p.chapters.map((c) =>
        c.id !== chId
          ? c
          : {
              ...c,
              items: c.items.map((i) => {
                if (i.id !== iId) return i;
                const a = [...i.measurements];
                const idx = a.findIndex((m) => m.id === mId);
                const t = idx + dir;
                if (t < 0 || t >= a.length) return i;
                [a[idx], a[t]] = [a[t], a[idx]];
                return { ...i, measurements: a };
              }),
            },
      ),
    }));

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
    const newProj = { ...proj, status };
    const changedProjectInput = getChangedProjectInput(initial, newProj);
    const isEdit = !!proj._id;
    setSaving(true);
    setApiError("");
    console.log(newProj);
    try {
      let result;

      if (isEdit) {
        result = await updateProject({
          variables: {
            _id: proj._id,
            projectInput:
              Object.keys(changedProjectInput).length > 0
                ? changedProjectInput
                : { status: newProj.status },
          },
        });
      } else {
        result = await createProject({
          variables: { projectInput: newProj },
        });
      }

      const returned = isEdit
        ? result.data.updateProject
        : result.data.createProject;

      // merge server _id back into local state
      onSave({ ...newProj, _id: returned._id });
    } catch (err) {
      console.error("Save project failed:", err);
      setApiError(err.message || "Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  const activeChapter = proj.chapters.find((c) => c.id === activeChapterId);
  const activeItem = activeChapter?.items.find((i) => i.id === activeItemId);

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
              className="btn btn-outline"
              onClick={() => handleSave("DRAFT")}
              disabled={saving}
            >
              {saving ? <Spinner size={13} /> : "Save Draft"}
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
            <button className="btn btn-primary btn-sm" onClick={addChapter}>
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
                key={ch.id}
                onClick={() => {
                  setActCh(ch.id);
                  setActItem(null);
                }}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  marginBottom: 4,
                  cursor: "pointer",
                  background:
                    activeChapterId === ch.id
                      ? ch.color + "22"
                      : "rgba(255,255,255,.03)",
                  border: `1px solid ${activeChapterId === ch.id ? ch.color + "66" : "transparent"}`,
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
                        moveChapter(ch.id, -1);
                      }}
                    >
                      ▲
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "2px 4px", fontSize: 10 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveChapter(ch.id, 1);
                      }}
                    >
                      ▼
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ padding: "2px 4px", fontSize: 10 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChapter(ch.id);
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
                      updateChapter(activeChapter.id, "name", e.target.value)
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
                          activeChapter.id,
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
                            updateChapter(activeChapter.id, "color", c)
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
                  onClick={() => addItem(activeChapter.id)}
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
                    key={item.id}
                    onClick={() => setActItem(item.id)}
                    style={{
                      padding: "9px 12px",
                      borderRadius: 8,
                      marginBottom: 4,
                      cursor: "pointer",
                      background:
                        activeItemId === item.id
                          ? "rgba(244,160,28,.1)"
                          : "rgba(255,255,255,.03)",
                      border: `1px solid ${activeItemId === item.id ? "rgba(244,160,28,.3)" : "transparent"}`,
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
                            moveItem(activeChapter.id, item.id, -1);
                          }}
                        >
                          ▲
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: "2px 4px", fontSize: 10 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveItem(activeChapter.id, item.id, 1);
                          }}
                        >
                          ▼
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          style={{ padding: "2px 4px", fontSize: 10 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(activeChapter.id, item.id);
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
                          activeChapter.id,
                          activeItem.id,
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
                          activeChapter.id,
                          activeItem.id,
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
                        activeChapter.id,
                        activeItem.id,
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
                        addMeasurement(activeChapter.id, activeItem.id)
                      }
                    >
                      + Add First Field
                    </button>
                  }
                />
              ) : (
                activeItem.measurements.map((m, idx) => (
                  <MeasurementFieldEditor
                    key={m.id}
                    m={m}
                    idx={idx}
                    total={activeItem.measurements.length}
                    onChange={(k, v) =>
                      updateMeasurement(
                        activeChapter.id,
                        activeItem.id,
                        m.id,
                        k,
                        v,
                      )
                    }
                    onDelete={() =>
                      deleteMeasurement(activeChapter.id, activeItem.id, m.id)
                    }
                    onMove={(dir) =>
                      moveMeasurement(
                        activeChapter.id,
                        activeItem.id,
                        m.id,
                        dir,
                      )
                    }
                  />
                ))
              )}
              <button
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    addMeasurement(activeChapter.id, activeItem.id)
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
