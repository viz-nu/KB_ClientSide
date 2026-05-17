// ═══════════════════════════════════════════════════════════════════
// SPAN MANAGEMENT — Orchestrator only. No form/detail logic here.
//
// Renders one of four independent components:
//   "list"   → <SpanList>
//   "create" → <CreateSpan>
//   "detail" → <SpanDetail>
//   "update" → <UpdateSpan>
// ═══════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { PROJECT_QUERIES, SPAN_QUERIES } from "../../../apollo/gql.js";

import { SpanList } from "./components/listSpan.jsx";
import { CreateSpan } from "./components/createSpan.jsx";
import { SpanDetail } from "./components/spanDetails.jsx";
import { UpdateSpan } from "./components/updateSpan.jsx";
import { emptySpanFilters, PAGE_LIMIT } from "../../../components/common/EntryFilters.jsx";

// ── views ──────────────────────────────────────────────────────────
const VIEWS = {
  LIST:   "list",
  CREATE: "create",
  DETAIL: "detail",
  UPDATE: "update",
};

export default function SpanManagement() {
  const [view, setView] = useState(VIEWS.LIST);
  const [activeSpan, setActive] = useState(null);
  const [filters, setFilters] = useState(emptySpanFilters);
  const applyFilter = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
  };
  const resetFilters = () => {
    setFilters(emptySpanFilters());
  };
  const [page, setPage] = useState(1);
  // ── data ──────────────────────────────────────────────────────
  const {
    data: spansData,
    loading: spansLoading,
    refetch: spansRefetch,
  } = useQuery(SPAN_QUERIES.list, {
    fetchPolicy: "cache-and-network",
    variables: { page: page, limit: PAGE_LIMIT, status: filters.status || undefined, projects: filters.projects.length ? filters.projects : undefined, startPoints: filters.startPoints.length ? filters.startPoints : undefined, endPoints: filters.endPoints.length ? filters.endPoints : undefined },
  });

  const { data: projectsData } = useQuery(PROJECT_QUERIES.list, {
    fetchPolicy: "cache-and-network",
    variables: { page: 1, limit: 10 },
  });
  const [createSpan] = useMutation(SPAN_QUERIES.create);
  const [updateSpan] = useMutation(SPAN_QUERIES.update);

  const spans    = spansData?.spans?.data    ?? [];
  const projects = projectsData?.projects?.data ?? [];

  // ── navigation helpers ────────────────────────────────────────
  const goList   = ()  => { setActive(null); setView(VIEWS.LIST); };
  const goCreate = ()  => { setView(VIEWS.CREATE); };
  const goDetail = (s) => { setActive(s); setView(VIEWS.DETAIL); };
  const goUpdate = (s) => { setActive(JSON.parse(JSON.stringify(s))); setView(VIEWS.UPDATE); };

  // ── mutations ─────────────────────────────────────────────────
  const handleCreate = async (span) => {
    const spanInput = buildSpanInput(span);
    spanInput.project = span.projectId;
    await createSpan({
      variables: { spanInput },
      update(cache) {
        cache.evict({ fieldName: "spans" });
        cache.gc();
      },
    });
    spansRefetch();
    goList();
  };

  const handleUpdate = async (span) => {
    const spanInput = buildSpanInput(span);
    await updateSpan({
      variables: { id: span._id, spanInput },
      update(cache) {
        cache.evict({ fieldName: "spans" });
        cache.gc();
      },
    });
    spansRefetch();
    goList();
  };

  const handleDelete = (span) => {
    // TODO: wire up SPAN_QUERIES.delete mutation
    console.warn("Delete not yet implemented for span:", span._id);
  };

  // ── render ────────────────────────────────────────────────────
  switch (view) {
    case VIEWS.CREATE:
      return (
        <CreateSpan
          projects={projects}
          onCreate={handleCreate}
          onCancel={goList}
        />
      );

    case VIEWS.DETAIL:
      return (
        <SpanDetail
          span={activeSpan}
          projects={projects}
          onBack={goList}
          onEdit={() => goUpdate(activeSpan)}
        />
      );

    case VIEWS.UPDATE:
      return (
        <UpdateSpan
          span={activeSpan}
          projects={projects}
          onUpdate={handleUpdate}
          onCancel={goList}
        />
      );

    case VIEWS.LIST:
    default:
      return (
        <SpanList
          filters={filters}
          applyFilter={applyFilter}
          resetFilters={resetFilters}
          spans={spans}
          projects={projects}
          loading={spansLoading}
          onCreate={goCreate}
          onView={goDetail}
          onEdit={goUpdate}
          onDelete={handleDelete}
        />
      );
  }
}

// ─── helpers ───────────────────────────────────────────────────────

/**
 * Strips UI-only fields and shapes the object for the API.
 *
 * TargetedValues shape (add to your GraphQL mutation input type):
 *   [{ chapterId: ID!, itemId: ID!, measurementLabel: String!, targetValue: Float! }]
 */
function buildSpanInput(span) {
  return {
    name: span.name,

    // Array of chapter _ids — what the API expects
    chapters: span.chapters.map(({ _id }) => _id),

    // Measurement targets — wire into your GraphQL schema when ready
    TargetedValues: (span.TargetedValues ?? []).map(
      ({ chapterId, itemId, measurementLabel, targetValue }) => ({
        chapterId,
        itemId,
        measurementLabel,
        targetValue: Number(targetValue),
      }),
    ),

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
    Vault: {
      allotedBudjet: span.Vault.allotedBudjet,
      spentBudjet:   span.Vault.spentBudjet,
    },
  };
}