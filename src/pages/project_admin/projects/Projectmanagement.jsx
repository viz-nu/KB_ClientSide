// ═══════════════════════════════════════════════════════════════════
// PROJECT MANAGEMENT — Orchestrator only. No form/detail logic here.
//
// Renders one of four independent components:
//   "list"    → <ProjectList>
//   "create"  → <CreateProject>
//   "preview" → <ProjectPreview>    (existing file, unchanged)
//   "update"  → <UpdateProject>
// ═══════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { ProjectList } from "./components/ProjectList.jsx";
import { CreateProject } from "./components/CreateProject.jsx";
import { UpdateProject } from "./components/UpdateProject.jsx";
import { ProjectPreview } from "./components/ProjectPreview.jsx";
import { AlertBanner, Spinner } from "../../../components/common/index.jsx";
import { PROJECT_QUERIES } from "../../../apollo/gql.js";
// ── views ──────────────────────────────────────────────────────────
const VIEWS = {
  LIST: "list",
  CREATE: "create",
  PREVIEW: "preview",
  UPDATE: "update",
};

export default function ProjectManagement() {
  const [view, setView] = useState(VIEWS.LIST);
  const [active, setActive] = useState(null);

  // ── data ──────────────────────────────────────────────────────
  const { data, loading, error, refetch } = useQuery(PROJECT_QUERIES.list, {
    fetchPolicy: "cache-and-network",
    variables: { page: 1, limit: 10 },
  });

  const projects = data?.projects?.data ?? [];

  // ── navigation helpers ────────────────────────────────────────
  const goList = () => {
    setActive(null);
    setView(VIEWS.LIST);
  };
  const goCreate = () => {
    setView(VIEWS.CREATE);
  };
  const goPreview = (p) => {
    setActive(p);
    setView(VIEWS.PREVIEW);
  };
  const goUpdate = (p) => {
    setActive(structuredClone(p));
    setView(VIEWS.UPDATE);
  };

  // ── mutation handlers ─────────────────────────────────────────
  const handleCreated = (project) => {
    refetch();
    goList();
  };

  const handleUpdated = (project) => {
    refetch();
    goList();
  };

  const handleDelete = (project) => {
    // TODO: wire DELETE_PROJECT mutation here
    // await deleteProject({ variables: { id: project._id } });
    refetch();
  };

  // ── loading / error guards (list view only) ───────────────────
  if (view === VIEWS.LIST) {
    if (loading)
      return (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Spinner size={32} />
        </div>
      );
    if (error)
      return (
        <AlertBanner
          type="error"
          message={`Failed to load projects: ${error.message}`}
        />
      );
  }

  // ── render ────────────────────────────────────────────────────
  switch (view) {
    case VIEWS.CREATE:
      return <CreateProject onCreate={handleCreated} onCancel={goList} />;

    case VIEWS.PREVIEW:
      return (
        <ProjectPreview
          project={active}
          onBack={goList}
          onEdit={() => goUpdate(active)}
        />
      );

    case VIEWS.UPDATE:
      return (
        <UpdateProject
          project={active}
          onUpdate={handleUpdated}
          onCancel={goList}
        />
      );

    case VIEWS.LIST:
    default:
      return (
        <ProjectList
          projects={projects}
          loading={loading}
          onCreate={goCreate}
          onPreview={goPreview}
          onEdit={goUpdate}
          onDelete={handleDelete}
        />
      );
  }
}
