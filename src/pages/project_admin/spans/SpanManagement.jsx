import { useState } from "react";
import {
  PageHeader,
  Modal,
  ConfirmDialog,
  FormField,
  EmptyState,
  StatusBadge,
  AlertBanner,
  Spinner,
  Tabs,
} from "../../../components/common/index.jsx";
import { LIST_PROJECTS, SPAN_QUERIES, SPAN_QUERY } from "../../../apollo/gql.js";
import { useMutation, useQuery } from "@apollo/client";

// ─── Mock data ────────────────────────────────────────────────────
const MOCK_PROJECTS = [
  {
    _id: "proj-1",
    name: "Secunderabad Yard Remodelling",
    code: "SYR-2026",
    chapters: [
      {
        name: "Cable Works",
        items: [
          { code: "CW-001", label: "Cable Laying (Quad)", billingUnit: "RMT" },
          { code: "CW-002", label: "Trench Excavation",   billingUnit: "RMT" },
        ],
      },
      {
        name: "Point Machine Works",
        items: [
          { code: "PMW-001", label: "PM Installation (Universal)", billingUnit: "Nos" },
        ],
      },
    ],
  },
  {
    _id: "proj-2",
    name: "Kachiguda Station Upgrade",
    code: "KSU-2026",
    chapters: [
      {
        name: "Indoor Works",
        items: [
          { code: "IW-001", label: "Relay Room Wiring",  billingUnit: "LS"  },
          { code: "IW-002", label: "Data Logger Install", billingUnit: "Nos" },
        ],
      },
    ],
  },
];

const MOCK_SPANS = [
  {
    _id: "s1",
    name: "Secunderabad → Begumpet",
    startPoint:  { placeName: "Secunderabad Junction", gpsLat: 17.4326, gpsLng: 78.5013 },
    endPoint:    { placeName: "Begumpet",               gpsLat: 17.4458, gpsLng: 78.4683 },
    projectId:   "proj-1",
    status:      "IN_PROGRESS",
    Vault:       { allotedBudjet: 5000000, spentBudjet: 1200000, logs: [] },
    vendorUnits: [
      { code: "CW-001", label: "Cable Laying (Quad)", billingUnit: "RMT", included: true  },
      { code: "CW-002", label: "Trench Excavation",   billingUnit: "RMT", included: true  },
      { code: "PMW-001",label: "PM Installation",     billingUnit: "Nos", included: false },
    ],
    createdAt: "2026-05-01",
  },
];

const PROGRESS_STAGES = [
  { value: "PENDING",     label: "Pending",     color: "#94A3B8" },
  { value: "IN_PROGRESS", label: "In Progress", color: "#FBBF24" },
  { value: "COMPLETED",   label: "Completed",   color: "#22C55E" },
];

const emptySpan = () => ({
  _id:         null,
  name:        "",
  startPoint:  { placeName: "", gpsLat: "", gpsLng: "" },
  endPoint:    { placeName: "", gpsLat: "", gpsLng: "" },
  projectId:   "",
  status:      "PENDING",
  Vault:       { allotedBudjet: 0, spentBudjet: 0, logs: [] },
  vendorUnits: [],
  createdAt:   new Date().toISOString().slice(0, 10),
});

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function SpanManagement() {
  const { data, loading, error, refetch } = useQuery(SPAN_QUERIES.get, {
    fetchPolicy: "cache-and-network",
    variables: { page: 1, limit: 10 },
  });
  const [createSpan,createSpanRequest] = useMutation(SPAN_QUERIES.create);
  const spans=data?.spans?.data??[];
  const [view, setView]       = useState("list"); // list | form | detail
  const [activeSpan, setActive] = useState(null);
  const [delTarget, setDel]   = useState(null);
  const { data:projectsData, loading:projectsDataLoading, error:projectsDataError, refetch:projectsDataRefetch } = useQuery(LIST_PROJECTS, {
    fetchPolicy: "cache-and-network",
    variables: { page: 1, limit: 10 },
  });
  const openCreate = () => { setActive(emptySpan()); setView("form"); };
  const openEdit   = (s)  => { setActive(JSON.parse(JSON.stringify(s))); setView("form"); };
  const openDetail = (s)  => { setActive(s); setView("detail"); };

  const saveSpan = async (span) => {
    if (span._id) {
      //setSpans(ss => ss.map(s => s._id === span._id ? span : s));
    } else {
      await createSpan({
        variables:{
          spanInput:{
            "Vault": span.Vault,
            "chapters": span.chapters.map((({ __typename,_id,items, ...rest1})=>({
              ...rest1,
              items: items.map(({ __typename,_id, ...rest2}) => rest2)
            }))),
            "endPoint": {
              "placeName": span.endPoint.placeName,
              "pointLocation": {
                type:"point",
                "coordinates": {
                  "lat": parseFloat(span.endPoint.gpsLat),
                  "lng": parseFloat(span.endPoint.gpsLng),
                }
              }
            },
            "startPoint": {
              "placeName": span.startPoint.placeName,
              "pointLocation": {
                type:"point",
                "coordinates": {
                  "lat": parseFloat(span.startPoint.gpsLat),
                  "lng": parseFloat(span.startPoint.gpsLng),
                }
              }
            },
            project:span.projectId,
            name:span.name
           }
        },
        update(cache){
          cache.evict({ fieldName: "spans" });
          cache.gc();
        }
      });
      //setSpans(ss => [...ss, { ...span, _id: `s${Date.now()}` }]);
    }
    setView("list");
  };

  const deleteSpan = () => {
    //setSpans(ss => ss.filter(s => s._id !== delTarget._id));
    setDel(null);
  };

  if (view === "form")
    return <SpanForm span={activeSpan} projects={projectsData?.projects?.data??[]} onSave={saveSpan} onCancel={() => setView("list")} />;

  if (view === "detail")
    return <SpanDetail span={activeSpan} projects={projectsData?.projects?.data??[]} onBack={() => setView("list")} onEdit={() => openEdit(activeSpan)} />;

  return (
    <div className="fade-up">
      <PageHeader
        title="Span Management"
        subtitle={`${spans.length} spans · ${spans.filter(s => s.status === "COMPLETED").length} completed`}
        actions={<button className="btn btn-primary" onClick={openCreate}>+ New Span</button>}
      />

      {spans.length === 0
        ? <EmptyState icon="🛤️" title="No spans yet" message="Create a span to define a section of work between two points." action={<button className="btn btn-primary" onClick={openCreate}>Create First Span</button>} />
        : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))", gap: 16 }}>
            {spans.map(s => (
              <SpanCard
                key={s._id}
                span={s}
                project={(projectsData?.projects?.data??[]).find(p => p._id === s.projectId)}
                onView={() => openDetail(s)}
                onEdit={() => openEdit(s)}
                onDelete={() => setDel(s)}
              />
            ))}
          </div>
        )
      }

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

// ─── Span Card ────────────────────────────────────────────────────
function SpanCard({ span: s, project, onView, onEdit, onDelete }) {
  const stage     = PROGRESS_STAGES.find(p => p.value === s.status) || PROGRESS_STAGES[0];
  const spentPct  = s.Vault?.allotedBudjet > 0
    ? Math.min(100, Math.round((s.Vault.spentBudjet / s.Vault.allotedBudjet) * 100))
    : 0;
  const barColor  = spentPct > 85 ? "var(--red)" : spentPct > 60 ? "var(--yellow)" : "var(--green)";
  const includedUnits = (s.vendorUnits || []).filter(v => v.included).length;

  return (
    <div className="card" style={{ borderTop: `3px solid ${stage.color}`, display: "flex", flexDirection: "column", gap: 0 }}>

      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: stage.color, textTransform: "uppercase", letterSpacing: ".08em",
            background: stage.color + "18", border: `1px solid ${stage.color}44`, padding: "2px 8px", borderRadius: 10 }}>
            ● {stage.label}
          </span>
          {project && (
            <code style={{ fontSize: 10, color: "var(--accent)", fontWeight: 600 }}>{project.code}</code>
          )}
        </div>
        <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{s.name}</div>
        {project && <div style={{ fontSize: 11, color: "var(--text2)" }}>{project.name}</div>}
      </div>

      {/* Route */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "10px 12px",
        background: "rgba(255,255,255,.03)", borderRadius: 8, border: "1px solid var(--border)" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 2 }}>From</div>
          <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.startPoint.placeName || "—"}</div>
          {s.startPoint.gpsLat && <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "monospace" }}>{Number(s.startPoint.gpsLat).toFixed(4)}, {Number(s.startPoint.gpsLng).toFixed(4)}</div>}
        </div>
        <div style={{ fontSize: 18, color: "var(--text3)", flexShrink: 0 }}>→</div>
        <div style={{ flex: 1, minWidth: 0, textAlign: "right" }}>
          <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 2 }}>To</div>
          <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.endPoint.placeName || "—"}</div>
          {s.endPoint.gpsLat && <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "monospace" }}>{Number(s.endPoint.gpsLat).toFixed(4)}, {Number(s.endPoint.gpsLng).toFixed(4)}</div>}
        </div>
      </div>

      {/* Vault */}
      {s.Vault && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }}>
            <div style={{ background: "rgba(255,255,255,.03)", padding: "8px 10px", borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 2 }}>Budget</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", fontFamily: "monospace" }}>
                ₹{(s.Vault.allotedBudjet || 0).toLocaleString("en-IN")}
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,.03)", padding: "8px 10px", borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 2 }}>Spent</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", fontFamily: "monospace" }}>
                ₹{(s.Vault.spentBudjet || 0).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
          {s.Vault.allotedBudjet > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text3)", marginBottom: 3 }}>
                <span>Utilisation</span>
                <span style={{ color: barColor, fontWeight: 600 }}>{spentPct}%</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,.08)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${spentPct}%`, height: "100%", background: barColor, borderRadius: 2, transition: "width .4s" }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12,
        paddingTop: 10, borderTop: "1px solid var(--border)" }}>
        {[
          ["📦", includedUnits, "Work Items"],
          ["📋", s.vendorUnits?.length || 0, "Total Units"],
          ["📅", s.createdAt, "Created"],
        ].map(([icon, val, lbl]) => (
          <div key={lbl} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700 }}>{val}</div>
            <div style={{ fontSize: 9, color: "var(--text3)" }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
        <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={onView}>👁 View</button>
        <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={onEdit}>✏️ Edit</button>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>🗑</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SPAN FORM — Create & Edit
// ═══════════════════════════════════════════════════════════════════
function SpanForm({ span: initial, projects, onSave, onCancel }) {
  const [span, setSpan]       = useState(initial);
  const [step, setStep]       = useState(1);
  const [errors, setErrors]   = useState({});
  const { data:projectsData, loading:projectsDataLoading, error:projectsDataError, refetch:projectsDataRefetch } = useQuery(LIST_PROJECTS, {
    fetchPolicy: "cache-and-network",
    variables: { page: 1, limit: 10 },
  });

  const set = (path, val) => {
    setSpan(s => {
      const updated = JSON.parse(JSON.stringify(s));
      const keys    = path.split(".");
      let obj       = updated;
      keys.slice(0, -1).forEach(k => { obj = obj[k]; });
      obj[keys[keys.length - 1]] = val;
      return updated;
    });
  };

  // Capture GPS for a point
  const captureGPS = (point) => {
    navigator.geolocation?.getCurrentPosition(
      pos => { set(`${point}.gpsLat`, pos.coords.latitude.toFixed(6)); set(`${point}.gpsLng`, pos.coords.longitude.toFixed(6)); },
      () => alert("GPS capture failed.")
    );
  };

  // When project changes — pull all work items as vendor units (all included by default)
  const handleProjectChange = (projId) => {
    set("projectId", projId);
    const proj = projects.find(p => p._id === projId);
    if (!proj) { set("vendorUnits", []); return; }
    const units = proj.chapters.flatMap(ch =>
      ch.items.map(item => ({ code: item.code, label: item.label, billingUnit: item.billingUnit, included: true }))
    );
    set("vendorUnits", units);
    set("chapters",[])
  };

  const toggleUnit = (code) => {
    set("vendorUnits", span.vendorUnits.map(u => u.code === code ? { ...u, included: !u.included } : u));
  };

  const validate = () => {
    const e = {};
    if (!span.name.trim())                   e.name        = "Span name required";
    if (!span.startPoint.placeName.trim())   e.startName   = "Start point name required";
    if (!span.endPoint.placeName.trim())     e.endName     = "End point name required";
    if (!span.projectId)                     e.projectId   = "Project is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = () => { if (validate()) onSave(span); };

  const STEPS = ["Basic Info", "Route & GPS", "Vault"];
  const project = projects.find(p => p._id === span.projectId);

  console.log("Span Data",span);

  return (
    <div className="fade-up">
      <PageHeader
        title={span._id ? "Edit Span" : "New Span"}
        subtitle="Define route, project, work items and budget"
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>
              {span._id ? "Save Changes" : "Create Span"}
            </button>
          </div>
        }
      />

      {/* Step indicator */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20 }}>
        {STEPS.map((label, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: i + 1 <= step ? "pointer" : "default" }} onClick={() => i + 1 < step && setStep(i + 1)}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700,
                background: i + 1 <= step ? "var(--accent)" : "rgba(255,255,255,.08)",
                color:      i + 1 <= step ? "var(--navy)"   : "var(--text2)",
                boxShadow:  i + 1 === step ? "0 0 0 3px rgba(244,160,28,.25)" : "none",
              }}>{i + 1 < step ? "✓" : i + 1}</div>
              <div style={{ fontSize: 10, color: i + 1 === step ? "var(--accent)" : "var(--text2)", marginTop: 4, whiteSpace: "nowrap" }}>{label}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, margin: "0 6px", marginBottom: 14, background: i + 1 < step ? "var(--accent)" : "rgba(255,255,255,.08)" }} />
            )}
          </div>
        ))}
      </div>

      <div className="card">

        {/* ── Step 1: Basic Info */}
        {step === 1 && (
          <div>
            <FormField label="Span Name" error={errors.name} required>
              <input className="form-control" value={span.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Secunderabad → Begumpet" />
            </FormField>
            <FormField label="Project" error={errors.projectId} required>
              <select className="form-control" value={span.projectId} onChange={e => handleProjectChange(e.target.value)}>
                <option value="">Select project…</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name} ({p.code})</option>)}
              </select>
            </FormField>
            {project && (
              <AlertBanner type="info" message={`${project.chapters.map(c=>c.items).length} work items will be imported from "${project.name}"`} />
            )}
            <FormField label="Chapters" required>
              <div className="form-group">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(projectsData?.projects?.data??[]).find((t)=>t._id==span.projectId)?.chapters.map((opt) => {
                    const active = (span.chapters.map((t)=>t._id)??[]).includes(opt._id);
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={(e) => {
                          set("chapters", span.chapters?.find((t)=>t._id==opt._id)?span.chapters.filter((t)=>t._id!=opt._id):[...span.chapters??[],opt]);
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
                  })}
                </div>
              </div>
              {/* <select
                className="form-control"
                value={span.chapter}
                onChange={(e) => {
                  set("chapter", e.target.value);
                }}
              >
                <option value="">Select chapter…</option>
                {MOCK_PROJECTS.find((t)=>t._id==span.projectId)?.chapters.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select> */}
            </FormField>
            {/* <FormField label="Progress Status">
              <div style={{ display: "flex", gap: 8 }}>
                {PROGRESS_STAGES.map(ps => (
                  <button key={ps.value} type="button"
                    onClick={() => set("status", ps.value)}
                    style={{ flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s",
                      border:      `1px solid ${span.status === ps.value ? ps.color : "var(--border)"}`,
                      background:  span.status === ps.value ? ps.color + "22" : "rgba(255,255,255,.03)",
                      color:       span.status === ps.value ? ps.color        : "var(--text2)",
                    }}>
                    ● {ps.label}
                  </button>
                ))}
              </div>
            </FormField> */}
          </div>
        )}

        {/* ── Step 2: Route & GPS */}
        {step === 2 && (
          <div>
            {[
              { key: "startPoint", label: "Start Point", icon: "🟢" },
              { key: "endPoint",   label: "End Point",   icon: "🔴" },
            ].map(({ key, label, icon }) => (
              <div key={key} style={{ marginBottom: 20, padding: "16px", background: "rgba(255,255,255,.03)", borderRadius: 10, border: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
                  {icon} {label}
                </div>
                <FormField label="Place Name" error={key === "startPoint" ? errors.startName : errors.endName} required>
                  <input className="form-control" value={span[key].placeName} onChange={e => set(`${key}.placeName`, e.target.value)}
                    placeholder={key === "startPoint" ? "e.g. Secunderabad Junction" : "e.g. Begumpet Station"} />
                </FormField>
                <div className="form-row">
                  <FormField label="GPS Latitude">
                    <input className="form-control" type="number" step="0.000001" value={span[key].gpsLat} onChange={e => set(`${key}.gpsLat`, e.target.value)} placeholder="17.432600" />
                  </FormField>
                  <FormField label="GPS Longitude">
                    <input className="form-control" type="number" step="0.000001" value={span[key].gpsLng} onChange={e => set(`${key}.gpsLng`, e.target.value)} placeholder="78.501300" />
                  </FormField>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => captureGPS(key)}>
                  📍 Capture Current GPS
                </button>
                {span[key].gpsLat && span[key].gpsLng && (
                  <span style={{ marginLeft: 10, fontSize: 12, color: "var(--green)" }}>
                    ✓ {Number(span[key].gpsLat).toFixed(4)}, {Number(span[key].gpsLng).toFixed(4)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Step 3: Work Items (vendor units) */}
        {/* {step === 3 && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div className="card-title" style={{ marginBottom: 4 }}>Work Items</div>
              <p style={{ fontSize: 12, color: "var(--text2)" }}>
                Select which work items from <strong>{project?.name || "the project"}</strong> apply to this span.
              </p>
            </div>

            {span.vendorUnits.length === 0
              ? <EmptyState icon="📦" title="No work items" message="Select a project in Step 1 to import work items." />
              : (
                <>
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => set("vendorUnits", span.vendorUnits.map(u => ({ ...u, included: true })))}>Select All</button>
                    <button className="btn btn-outline btn-sm" onClick={() => set("vendorUnits", span.vendorUnits.map(u => ({ ...u, included: false })))}>Deselect All</button>
                    <span style={{ fontSize: 12, color: "var(--text2)", alignSelf: "center", marginLeft: "auto" }}>
                      {span.vendorUnits.filter(u => u.included).length} / {span.vendorUnits.length} selected
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {span.vendorUnits.map(u => (
                      <div key={u.code} onClick={() => toggleUnit(u.code)}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 8, cursor: "pointer", transition: "all .15s",
                          background: u.included ? "rgba(244,160,28,.08)" : "rgba(255,255,255,.03)",
                          border:     `1px solid ${u.included ? "rgba(244,160,28,.3)" : "var(--border)"}`,
                        }}>
                        <div style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, transition: "all .15s",
                          background: u.included ? "var(--accent)"   : "transparent",
                          border:     `2px solid ${u.included ? "var(--accent)" : "var(--border)"}`,
                          color:      "var(--navy)",
                        }}>{u.included ? "✓" : ""}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: u.included ? "var(--text)" : "var(--text2)" }}>{u.label}</div>
                          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>
                            <code style={{ fontSize: 10 }}>{u.code}</code> · {u.billingUnit}
                          </div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: u.included ? "var(--accent)" : "var(--text3)" }}>
                          {u.included ? "Included" : "Excluded"}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )
            }
          </div>
        )} */}

        {/* ── Step 4: Vault */}
        {step === 3 && (
          <div>
            <div className="card-title" style={{ marginBottom: 16 }}>💰 Budget (Vault)</div>
            <div className="form-row">
              <FormField label="Allotted Budget ₹" required>
                <input className="form-control" type="number" min="0" step="1000"
                  value={span.Vault.allotedBudjet}
                  onChange={e => set("Vault.allotedBudjet", Number(e.target.value))}
                  placeholder="e.g. 5000000" />
              </FormField>
              <FormField label="Spent So Far ₹">
                <input className="form-control" type="number" min="0" step="1000"
                  value={span.Vault.spentBudjet}
                  onChange={e => set("Vault.spentBudjet", Number(e.target.value))}
                  placeholder="e.g. 0" />
              </FormField>
            </div>

            {span.Vault.allotedBudjet > 0 && (
              <div style={{ padding: "14px 16px", background: "rgba(255,255,255,.03)", borderRadius: 10, border: "1px solid var(--border)", marginTop: 8 }}>
                <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 10 }}>Budget Preview</div>
                {(() => {
                  const pct      = Math.min(100, Math.round((span.Vault.spentBudjet / span.Vault.allotedBudjet) * 100));
                  const barColor = pct > 85 ? "var(--red)" : pct > 60 ? "var(--yellow)" : "var(--green)";
                  const remaining = span.Vault.allotedBudjet - span.Vault.spentBudjet;
                  return (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
                        <span style={{ color: "var(--text2)" }}>Remaining: <strong style={{ color: remaining >= 0 ? "var(--green)" : "var(--red)" }}>₹{remaining.toLocaleString("en-IN")}</strong></span>
                        <span style={{ color: barColor, fontWeight: 700 }}>{pct}% utilised</span>
                      </div>
                      <div style={{ height: 6, background: "rgba(255,255,255,.08)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 3, transition: "width .4s" }} />
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
          <button className="btn btn-outline" onClick={() => step === 1 ? onCancel() : setStep(s => s - 1)}>
            {step === 1 ? "Cancel" : "← Back"}
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            {step < 3
              ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={step === 1 && !!errors.name}>Next →</button>
              : <button className="btn btn-primary" onClick={handleSave}>{span._id ? "Save Changes" : "Create Span →"}</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SPAN DETAIL — Read view
// ═══════════════════════════════════════════════════════════════════
function SpanDetail({ span: s, projects, onBack, onEdit }) {
  const [tab, setTab]   = useState("overview");
  const project         = projects.find(p => p._id === s.projectId);
  const stage           = PROGRESS_STAGES.find(p => p.value === s.status) || PROGRESS_STAGES[0];
  const includedUnits   = (s.vendorUnits || []).filter(u => u.included);
  const excludedUnits   = (s.vendorUnits || []).filter(u => !u.included);
  const spentPct        = s.Vault?.allotedBudjet > 0 ? Math.min(100, Math.round((s.Vault.spentBudjet / s.Vault.allotedBudjet) * 100)) : 0;
  const barColor        = spentPct > 85 ? "var(--red)" : spentPct > 60 ? "var(--yellow)" : "var(--green)";

  const tabConfig = [
    { id: "overview",  label: "Overview",    icon: "📋" },
    { id: "route",     label: "Route",       icon: "🗺️" },
    { id: "workitems", label: "Work Items",  icon: "📦" },
    { id: "vault",     label: "Vault",       icon: "💰" },
  ];

  return (
    <div className="fade-up">
      <PageHeader
        title={s.name}
        subtitle={project ? `${project.name} · ${project.code}` : ""}
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-outline" onClick={onBack}>← Back</button>
            <button className="btn btn-primary" onClick={onEdit}>✏️ Edit</button>
          </div>
        }
      />

      {/* Status banner */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 8, marginBottom: 20,
        background: stage.color + "12", border: `1px solid ${stage.color}44` }}>
        <span style={{ fontSize: 16 }}>{{ PENDING:"⏳", IN_PROGRESS:"🔄", COMPLETED:"✅" }[s.status]}</span>
        <span style={{ fontWeight: 700, color: stage.color, fontSize: 13 }}>{stage.label}</span>
        {project && <span style={{ fontSize: 12, color: "var(--text2)", marginLeft: "auto" }}>Part of: <strong style={{ color: "var(--text)" }}>{project.name}</strong></span>}
      </div>

      <Tabs tabs={tabConfig} active={tab} onChange={setTab} />

      {/* ── Overview */}
      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>Span Details</div>
            {[
              ["ID",        <code key="id" style={{ fontSize: 11, color: "var(--accent)" }}>{s._id}</code>],
              ["Name",      s.name],
              ["Project",   project?.name || "—"],
              ["Status",    <span key="st" style={{ color: stage.color, fontWeight: 600 }}>● {stage.label}</span>],
              ["Work Items",`${includedUnits.length} included / ${s.vendorUnits?.length || 0} total`],
              ["Created",   s.createdAt],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border2)", fontSize: 13 }}>
                <span style={{ color: "var(--text2)", fontSize: 12 }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>Budget Summary</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                ["Allotted",   `₹${(s.Vault?.allotedBudjet||0).toLocaleString("en-IN")}`, "var(--accent)"],
                ["Spent",      `₹${(s.Vault?.spentBudjet||0).toLocaleString("en-IN")}`,   "var(--text)"  ],
                ["Remaining",  `₹${((s.Vault?.allotedBudjet||0)-(s.Vault?.spentBudjet||0)).toLocaleString("en-IN")}`,
                  (s.Vault?.allotedBudjet||0) >= (s.Vault?.spentBudjet||0) ? "var(--green)" : "var(--red)"],
                ["Utilisation",`${spentPct}%`, barColor],
              ].map(([l, v, c]) => (
                <div key={l} style={{ background: "rgba(255,255,255,.03)", padding: "10px 12px", borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: c, fontFamily: "monospace" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,.08)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${spentPct}%`, height: "100%", background: barColor, borderRadius: 3, transition: "width .4s" }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Route */}
      {tab === "route" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { key: "startPoint", label: "Start Point", icon: "🟢" },
            { key: "endPoint",   label: "End Point",   icon: "🔴" },
          ].map(({ key, label, icon }) => (
            <div key={key} className="card">
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 14 }}>{icon} {label}</div>
              {[
                ["Place Name", s[key].placeName || "—"],
                ["Latitude",   s[key].gpsLat    || "—"],
                ["Longitude",  s[key].gpsLng    || "—"],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border2)", fontSize: 13 }}>
                  <span style={{ color: "var(--text2)", fontSize: 12 }}>{l}</span>
                  <span style={{ fontFamily: l !== "Place Name" ? "monospace" : "inherit" }}>{v}</span>
                </div>
              ))}
              {s[key].gpsLat && s[key].gpsLng && (
                <a
                  href={`https://www.google.com/maps?q=${s[key].gpsLat},${s[key].gpsLng}`}
                  target="_blank" rel="noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}
                >
                  🗺️ Open in Maps
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Work Items */}
      {tab === "workitems" && (
        <div>
          {includedUnits.length > 0 && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-header"><span className="card-title">✅ Included Work Items ({includedUnits.length})</span></div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Code</th><th>Label</th><th>Billing Unit</th></tr></thead>
                  <tbody>
                    {includedUnits.map(u => (
                      <tr key={u.code}>
                        <td><code style={{ fontSize: 12, color: "var(--accent)" }}>{u.code}</code></td>
                        <td style={{ fontWeight: 600 }}>{u.label}</td>
                        <td style={{ color: "var(--text2)", fontSize: 12 }}>{u.billingUnit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {excludedUnits.length > 0 && (
            <div className="card">
              <div className="card-header"><span className="card-title" style={{ color: "var(--text3)" }}>⊘ Excluded Work Items ({excludedUnits.length})</span></div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Code</th><th>Label</th><th>Billing Unit</th></tr></thead>
                  <tbody>
                    {excludedUnits.map(u => (
                      <tr key={u.code} style={{ opacity: 0.5 }}>
                        <td><code style={{ fontSize: 12 }}>{u.code}</code></td>
                        <td>{u.label}</td>
                        <td style={{ fontSize: 12 }}>{u.billingUnit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {s.vendorUnits?.length === 0 && <EmptyState icon="📦" title="No work items" message="No work items are assigned to this span." />}
        </div>
      )}

      {/* ── Vault */}
      {tab === "vault" && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>💰 Vault Details</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 12, marginBottom: 20 }}>
            {[
              ["Allotted Budget",  `₹${(s.Vault?.allotedBudjet||0).toLocaleString("en-IN")}`, "var(--accent)" ],
              ["Spent",            `₹${(s.Vault?.spentBudjet||0).toLocaleString("en-IN")}`,   "var(--text)"   ],
              ["Remaining",        `₹${((s.Vault?.allotedBudjet||0)-(s.Vault?.spentBudjet||0)).toLocaleString("en-IN")}`,
                (s.Vault?.allotedBudjet||0) >= (s.Vault?.spentBudjet||0) ? "var(--green)" : "var(--red)"],
              ["Utilisation",      `${spentPct}%`, barColor],
            ].map(([l, v, c]) => (
              <div key={l} style={{ background: "rgba(255,255,255,.04)", padding: "14px 16px", borderRadius: 10, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>{l}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: c, fontFamily: "var(--font-head)" }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text2)" }}>
            <span>Budget utilisation</span>
            <span style={{ color: barColor, fontWeight: 700 }}>{spentPct}%</span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,.08)", borderRadius: 4, overflow: "hidden", marginBottom: 20 }}>
            <div style={{ width: `${spentPct}%`, height: "100%", background: barColor, borderRadius: 4, transition: "width .6s" }} />
          </div>

          {/* Vault logs */}
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Transaction Log</div>
          {(s.Vault?.logs || []).length === 0
            ? <div style={{ fontSize: 12, color: "var(--text3)", padding: "16px 0", textAlign: "center" }}>No transactions recorded yet.</div>
            : (s.Vault.logs.map((log, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border2)", fontSize: 13 }}>
                <span>{log.note || "Transaction"}</span>
                <span style={{ fontFamily: "monospace", color: log.amount >= 0 ? "var(--red)" : "var(--green)" }}>
                  {log.amount >= 0 ? "−" : "+"}₹{Math.abs(log.amount).toLocaleString("en-IN")}
                </span>
              </div>
            )))
          }
        </div>
      )}
    </div>
  );
}