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
import { useQuery } from "@apollo/client";
import { PROJECT_QUERIES, SPAN_QUERIES } from "../../../apollo/gql.js";

import { SpanList as SpanListPanel } from "./components/listSpan.jsx";
import { SpanDetail } from "./components/spanDetails.jsx";
import { emptySpanFilters, PAGE_LIMIT } from "../../../components/common/EntryFilters.jsx";

// ── views ──────────────────────────────────────────────────────────
const VIEWS = {
  LIST:   "list",
  DETAIL: "detail",
};

export default function SpanListings() {
  const [view, setView] = useState(VIEWS.LIST);
  const [activeSpan, setActive] = useState(null);
  const [filters, setFilters] = useState(emptySpanFilters());
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

  const spans    = spansData?.spans?.data    ?? [];
  const projects = projectsData?.projects?.data ?? [];

  // ── navigation helpers ────────────────────────────────────────
  const goList   = ()  => { setActive(null); setView(VIEWS.LIST); };
  const goDetail = (s) => { setActive(s); setView(VIEWS.DETAIL); };

  // ── render ────────────────────────────────────────────────────
  switch (view) {
    case VIEWS.DETAIL:
      return (
        <SpanDetail
          span={activeSpan}
          projects={projects}
          onBack={goList}
        />
      );
    case VIEWS.LIST:
    default:
      return (
        <SpanListPanel
          filters={filters}
          applyFilter={applyFilter}
          resetFilters={resetFilters}
          spans={spans}
          projects={projects}
          loading={spansLoading}
          onView={goDetail}
        />
      );
  }
}
