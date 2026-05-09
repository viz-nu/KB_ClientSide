import { useState } from "react";
import { SEM_PARAMS } from "../../../constants/scheduleN.js";
import {
  PageHeader,
  AlertBanner,
  FormField,
} from "../../../components/common/index.jsx";

// ─── SEM Checklist (standalone reference) ────────────────────────
export default function SEMChecklist() {
  const [cat, setCat] = useState(Object.keys(SEM_PARAMS)[0]);
  const [checks, setChecks] = useState({});
  const toggle = (id) => setChecks((c) => ({ ...c, [id]: !c[id] }));
  const params = SEM_PARAMS[cat] || [];
  const passed = params.filter((p) => checks[p.id]).length;
  const allPassed = passed === params.length && params.length > 0;

  return (
    <div className="fade-up">
      <PageHeader
        title="SEM Parameter Checklist"
        subtitle="Site-specific quality parameters per Schedule-N chapter"
      />
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <FormField label="Work Category">
              <select
                className="form-control"
                style={{ maxWidth: 360 }}
                value={cat}
                onChange={(e) => {
                  setCat(e.target.value);
                  setChecks({});
                }}
              >
                {Object.keys(SEM_PARAMS).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                fontFamily: "var(--font-head)",
                color: allPassed ? "var(--green)" : "var(--yellow)",
              }}
            >
              {passed}/{params.length}
            </div>
            <div style={{ fontSize: 11, color: "var(--text2)" }}>
              Parameters Verified
            </div>
          </div>
        </div>

        {allPassed && (
          <AlertBanner
            type="success"
            message="All SEM parameters verified — this work category is ready for submission!"
          />
        )}

        {params.map((p) => (
          <div key={p.id} className="checklist-item">
            <button
              className={`check-box ${checks[p.id] ? "checked" : ""}`}
              onClick={() => toggle(p.id)}
            >
              {checks[p.id] ? "✓" : ""}
            </button>
            <span style={{ fontSize: 13, flex: 1 }}>{p.label}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: checks[p.id] ? "var(--green)" : "var(--text3)",
              }}
            >
              {checks[p.id] ? "✓ PASS" : "Not verified"}
            </span>
          </div>
        ))}

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 16,
            paddingTop: 14,
            borderTop: "1px solid var(--border)",
          }}
        >
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setChecks({})}
          >
            Reset All
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              const all = {};
              params.forEach((p) => (all[p.id] = true));
              setChecks(all);
            }}
          >
            Mark All PASS
          </button>
        </div>
      </div>
    </div>
  );
}
