import { useState } from 'react';
import { FormField} from '../../../../components/common/index.jsx';

// ─── Project/Span picker modal ───────────────────────────────
export default function ProjectSpanModal({ user, onConfirm, onClose }) {
  const [projectId,  setProjectId]  = useState('');
  const [spanId, setSpanId] = useState('');

  // Fallback to user.span if no projects array
  const projects  = user.projects  || [];
  const spans = user.spans || (user.span ? [user.span] : []);

  const canConfirm = projectId && spanId;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,.7)',
        zIndex: 200, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        className="fade-up"
        style={{
          background: 'var(--navy4)',
          border: '1px solid var(--border)',
          borderRadius: 16, padding: 28,
          width: '100%', maxWidth: 420,
          boxShadow: 'var(--shadow)',
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 17, fontWeight: 700 }}>
            Assign Entry To
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>
            Select the project and span this e-MB entry belongs to.
          </p>
        </div>

        <FormField label="Project" required>
          <select
            className="form-control"
            value={projectId}
            onChange={e => { setProjectId(e.target.value); setSpanId(''); }}
          >
            <option value="">Select project…</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Span" required>
          <select
            className="form-control"
            value={spanId}
            onChange={e => setSpanId(e.target.value)}
            disabled={!projectId && projects.length > 0}
          >
            <option value="">Select span…</option>
            {spans.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </FormField>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!canConfirm}
            onClick={() => {
              const project  = projects.find(p => p.id === projectId);
              const span = spans.find(s => s.id === spanId);
              onConfirm({ projectId, projectName: project?.name, spanId, spanName: span?.name });
            }}
          >
            Confirm →
          </button>
        </div>
      </div>
    </div>
  );
}