// ═══════════════════════════════════════════════════════════════════
// UPDATE PROJECT — Edit an existing project only. Always has _id.
// Props:
//   project   – existing project object (required, must have _id)
//   onUpdate  – async (project, status) => void
//   onCancel  – () => void
// ═══════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { PageHeader, Spinner } from "../../../../components/common/index.jsx";
import { PROJECT_QUERIES } from "../../../../apollo/gql.js";
import { ProjectDetailsCard, BuilderGrid } from "./CreateProject.jsx";
import { deepClean } from "../../../../utils/helpers.js";

export const UpdateProject = ({ project: initial, onUpdate, onCancel }) => {
  const [proj, setProj] = useState(() => structuredClone(initial));
  const [activeChapterId, setActCh] = useState(
    initial.chapters[0]?._id || null,
  );
  const [activeItemId, setActItem] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);

  const [updateProject] = useMutation(PROJECT_QUERIES.update);

  const setProjField = (k, v) =>
    setProj((prev) => {
      const keys = k.split(".");
      const next = { ...prev };
      let cur = next;
      keys.forEach((key, i) => {
        if (i === keys.length - 1) {
          cur[key] = v;
        } else {
          cur[key] = { ...(cur[key] || {}) };
          cur = cur[key];
        }
      });
      return next;
    });

  const validate = () => {
    const e = {};
    if (!proj.name.trim()) e.name = "Project name required";
    if (!proj.code.trim()) e.code = "Project code required";
    if (!proj.chapters.length) e.chapters = "Add at least one chapter";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (status) => {
    if (!validate()) return;
    setSaving(true);
    setApiError("");
    try {
      const cleaned = {
        name: proj.name,
        code: proj.code,
        description: proj.description,
        status: status,
        chapters: proj.chapters.map((chapter) => ({
          _id: chapter._id,
          name: chapter.name,
          color: chapter.color,
          items: deepClean(chapter.items),
        })),
        Vault: deepClean(proj.Vault),
      };

      await updateProject({
        variables: { id: initial._id, projectInput: cleaned },
      });

      onUpdate({ ...proj, status });
    } catch (err) {
      setApiError(err.message || "Failed to update project.");
    } finally {
      setSaving(false);
    }
  };

  const activeChapter = proj.chapters.find((c) => c._id === activeChapterId);
  const activeItem = activeChapter?.items.find((i) => i._id === activeItemId);

  return (
    <div className="fade-up">
      <PageHeader
        title={`Edit: ${initial.name}`}
        subtitle="Update chapters, work items and measurement fields"
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
              onClick={() =>
                handleSave(proj.status === "ARCHIVED" ? "ARCHIVED" : "ACTIVE")
              }
              disabled={saving}
            >
              {saving ? (
                <Spinner size={13} color="var(--navy)" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        }
      />

      <ProjectDetailsCard
        proj={proj}
        errors={errors}
        apiError={apiError}
        onChange={setProjField}
      />

      <BuilderGrid
        proj={proj}
        setProj={setProj}
        activeChapterId={activeChapterId}
        setActCh={setActCh}
        activeItemId={activeItemId}
        setActItem={setActItem}
        activeChapter={activeChapter}
        activeItem={activeItem}
      />
    </div>
  );
};
