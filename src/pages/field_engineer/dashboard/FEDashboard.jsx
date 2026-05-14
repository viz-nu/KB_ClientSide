import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth.js";
import {
  StatCard,
  PageHeader,
  EmptyState,
  Spinner,
} from "../../../components/common/index.jsx";
import { useQuery } from "@apollo/client";
import { EMB_ENTRY } from "../../../apollo/gql.js";
import EntriesTable from "../../../components/common/EntriesTable.jsx";
import { useFacets } from "../../../components/common/EntryFilters.jsx";
// ─── Field Engineer Dashboard ────────────────────────────────────
export default function FEDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: myEntriesData,
    loading,
    error,
    refetch,
  } = useQuery(EMB_ENTRY.list, {
    variables: {
      page: 1,
      limit: 5,
    },
    fetchPolicy: "cache-and-network",
  });
  const { facets, facetLoading, facetError, refetchFacets } = useFacets();
  const myEntries = myEntriesData?.activities?.data ?? [];
  const statusStatCards = {
    DRAFT: { label: "Draft", icon: "📝", color: "var(--text2)" },
    SUBMITTED: { label: "Submitted", icon: "⏳", color: "var(--yellow)" },
    APPROVED: { label: "Approved", icon: "✅", color: "var(--green)" },
    REJECTED: { label: "Rejected", icon: "❌", color: "var(--red)" },
    RETURNED: { label: "Returned", icon: "↩️", color: "var(--yellow)" },
  };
  const alertBoxStyle = {
    marginBottom: 16,
    padding: "12px 14px",
    borderRadius: "var(--radius)",
    border: "1px solid rgba(239,68,68,.35)",
    background: "rgba(239,68,68,.1)",
    color: "var(--red)",
    fontSize: 13,
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "10px 14px",
  };
  return (
    <div className="fade-up">
      <PageHeader title={`Welcome, ${user.name}`} subtitle={user.designation} />

      {facetError && (
        <div role="alert" style={alertBoxStyle}>
          <span>
            <strong>Summary stats unavailable.</strong> {facetError.message}
          </span>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => refetchFacets()}>
            Retry
          </button>
        </div>
      )}

      <div
        style={{
          position: "relative",
          minHeight: facetLoading ? 100 : undefined,
        }}
      >
        {facetLoading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,.2)",
              borderRadius: "var(--radius)",
            }}
          >
            <Spinner size={22} />
          </div>
        )}
        {!facetLoading && (
          <div className="stats-grid">
            {facets.statusCount.map((s) => {
              const card = statusStatCards[s.status] ?? {
                label: s.status ?? "—",
                icon: "📊",
                color: "var(--text2)",
              };
              return (
                <StatCard
                  key={s.status}
                  icon={card.icon}
                  number={s.count}
                  label={card.label}
                  color={card.color}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          {
            icon: "➕",
            title: "New e-MB Entry",
            desc: "Create and submit a new measurement book entry",
            to: "/new-entry",
            color: "var(--accent)",
          },
          {
            icon: "📋",
            title: "My Entries",
            desc: "View status of your submitted entries",
            to: "/my-entries",
            color: "var(--blue)",
          },
          // {
          //   icon: "☑️",
          //   title: "SEM Checklist",
          //   desc: "Access parameter checklists for your work",
          //   to: "/checklist",
          //   color: "var(--green)",
          // },
        ].map((q) => (
          <button
            key={q.title}
            onClick={() => navigate(q.to)}
            style={{
              textAlign: "left",
              background: "var(--card)",
              border: `1px solid var(--border)`,
              borderRadius: "var(--radius)",
              padding: 20,
              cursor: "pointer",
              transition: "all .15s",
              borderTop: `3px solid ${q.color}`,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div style={{ fontSize: 26, marginBottom: 8 }}>{q.icon}</div>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 14,
                color: q.color,
                marginBottom: 4,
              }}
            >
              {q.title}
            </div>
            <div
              style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}
            >
              {q.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Recent entries */}
      <div className="card" style={{ position: "relative", minHeight: 160 }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,.25)",
              borderRadius: 10,
            }}
          >
            <Spinner />
          </div>
        )}

        {!loading && error && (
          <div role="alert" style={{ padding: 24 }}>
            <EmptyState
              icon="⚠️"
              title="Failed to load recent entries"
              message={error.message}
              action={
                <button type="button" className="btn btn-outline" onClick={() => refetch()}>
                  Retry
                </button>
              }
            />
          </div>
        )}

        {!loading && !error && myEntries.length === 0 && (
          <div style={{ padding: 24 }}>
            <EmptyState
              icon="📭"
              title="No entries yet"
              message="Create your first e-MB entry."
            />
          </div>
        )}

        {!loading && !error && myEntries.length > 0 && (
          <>
            <div className="card-header">
              <span className="card-title">Recent Entries</span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => navigate("/my-entries")}
              >
                View All
              </button>
            </div>
            <EntriesTable filtered={myEntries} selectionDisabled={true} />
          </>
        )}
      </div>
    </div>
  );
}
