import {  useState } from "react";
import { newProject } from "./projectTemplates.js";
import ProjectBuilderForm from "./ProjectBuilderForm";
import ProjectPreview from "./ProjectPreview";
import {
  ConfirmDialog,
  PageHeader,
  EmptyState,
  Spinner,
  AlertBanner,
} from "../../../components/common";
import { useQuery } from "@apollo/client";
import { LIST_PROJECTS } from "../../../apollo/gql.js";

function ProjectCard({ project: p, onEdit, onPreview, onDelete }) {
  const itemCount = p.chapters.reduce((s, ch) => s + ch.items.length, 0);
  const statusColor = {
    ACTIVE: "var(--green)",
    DRAFT: "var(--yellow)",
    ARCHIVED: "var(--text3)",
  }[p.status];
  return (
    <div  className="card"  style={{borderTop: `3px solid ${p.chapters[0]?.color || "var(--accent)"}`,  }}>
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <code
            style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700 }}
          >
            {p.code}
          </code>
          <span
            style={{
              fontSize: 10,
              color: statusColor,
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            ● {p.status}
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            fontSize: 15,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {p.name}
        </div>
      </div>
      {p.description && (
        <div
          style={{
            fontSize: 12,
            color: "var(--text2)",
            lineHeight: 1.5,
            marginBottom: 12,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {p.description}
        </div>
      )}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {p.chapters.map((ch) => (
          <span  key={ch.id}  style={{    fontSize: 10,    padding: "2px 8px",    borderRadius: 12,    background: ch.color + "22",    color: ch.color,    border: `1px solid ${ch.color}44`,    fontWeight: 600,  }}>  {ch.code || ch.name}</span>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
  {[
    ['📚', p.chapters.length, 'Chapters'],
    ['📋', itemCount, 'Items'],
    ['📅', new Date(p.createdAt).toLocaleString('en-IN'), 'Created'],
  ].map(([icon, val, lbl]) => (
    <div key={lbl} style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>{val}</div>
      <div style={{ fontSize: 10, color: 'var(--text3)' }}>{lbl}</div>
    </div>
  ))}
</div>

{/* Vault */}
{p.Vault && (
  <div style={{ marginBottom: 14, padding: '10px 12px', background: 'rgba(255,255,255,.03)', borderRadius: 8, border: '1px solid var(--border)' }}>
    <div style={{ fontSize: 10, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>💰 Budget</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      <div>
        <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 2 }}>Allotted</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace' }}>
          ₹{(p.Vault.allotedBudjet ?? 0).toLocaleString('en-IN')}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 2 }}>Spent</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>
          ₹{(p.Vault.spentBudjet ?? 0).toLocaleString('en-IN')}
        </div>
      </div>
    </div>
    {/* spend progress bar */}
    {p.Vault.allotedBudjet > 0 && (() => {
      const pct = Math.min(100, Math.round((p.Vault.spentBudjet / p.Vault.allotedBudjet) * 100));
      const barColor = pct > 85 ? 'var(--red)' : pct > 60 ? 'var(--yellow)' : 'var(--green)';
      return (
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text3)', marginBottom: 3 }}>
            <span>Utilisation</span><span style={{ color: barColor, fontWeight: 600 }}>{pct}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,.08)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 2, transition: 'width .4s' }} />
          </div>
        </div>
      );
    })()}
  </div>
)}

<div style={{ display: "flex", gap: 6 }}>
        <button  className="btn btn-outline btn-sm"  style={{ flex: 1 }}  onClick={onPreview}>  👁 Preview</button>
        <button  className="btn btn-primary btn-sm"  style={{ flex: 1 }}  onClick={onEdit}>✏️ Edit </button>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>🗑</button>
      </div> 
    </div>
  );
}

export default function ProjectManagement() {
  const [view, setView]         = useState('list');
  const [active, setActive]     = useState(null);
  const [delTarget, setDel]     = useState(null);

  const { data, loading, error, refetch } = useQuery(LIST_PROJECTS, {
    fetchPolicy: "cache-and-network",
    variables: { page: 1, limit: 10 },
  });

  // derive directly from query data — no separate useState needed
  const projects = data?.projects?.data ?? [];

  const openBuilder = (proj = null) => {
    setActive(proj ? JSON.parse(JSON.stringify(proj)) : newProject());
    setView('builder');
  };
  const openPreview = (proj) => { setActive(proj); setView('preview'); };

  const saveProject = (proj) => {
    // refetch from server so list is always in sync
    refetch();
    setView('list');
  };

  const deleteProject = () => {
    // wire DELETE_PROJECT mutation here similarly
    setDel(null);
    refetch();
  };

  if (view === 'builder')
    return <ProjectBuilderForm project={active} onSave={saveProject} onCancel={() => setView('list')} />;

  if (view === 'preview')
    return <ProjectPreview project={active} onBack={() => setView('list')} onEdit={() => openBuilder(active)} />;

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
      <Spinner size={32} />
    </div>
  );

  if (error) return (
    <AlertBanner type="error" message={`Failed to load projects: ${error.message}`} />
  );

  return (
    <div className="fade-up">
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} projects · ${projects.filter(p => p.status === 'ACTIVE').length} active`}
        actions={<button className="btn btn-primary" onClick={() => openBuilder()}>+ New Project</button>}
      />

      {projects.length === 0 ? (
        <EmptyState
          icon="🏗️"
          title="No projects yet"
          message="Create a project to define custom work items and measurement fields."
          action={<button className="btn btn-primary" onClick={() => openBuilder()}>Create First Project</button>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gap: 16 }}>
          {projects.map(proj => (
            <ProjectCard
              key={proj._id}                          
              project={proj}
              onEdit={() => openBuilder(proj)}
              onPreview={() => openPreview(proj)}            
              onDelete={() => setDel(proj)}
            />
          ))}
        </div>
      )}

      {delTarget && (
        <ConfirmDialog
          danger
          message={`Delete project "${delTarget.name}"?`}
          onConfirm={deleteProject}
          onCancel={() => setDel(null)}
        />
      )}
    </div>
  );
}
