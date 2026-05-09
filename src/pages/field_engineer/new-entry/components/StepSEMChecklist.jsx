import { EmptyState } from '../../../../components/common/index.jsx';
import { useEmbForm } from "../../../../hooks/useEmbForm.js";

export default function StepSEMChecklist(){
    const { form, set, toggleSem, isSemPassed, semParams } = useEmbForm();
    return (
        <div>
          <div className="card-title" style={{ marginBottom: 4 }}>SEM Parameter Checklist</div>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 16 }}>
            Verify all site parameters for: <strong>{form.workCategory || 'No category selected'}</strong>
          </p>
          {semParams.length === 0
            ? <EmptyState icon="☑️" title="No SEM parameters" message={form.workCategory ? 'No checklist defined for this category.' : 'Please select a work category in Step 1.'} />
            : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, padding: '10px 14px', background: 'rgba(255,255,255,.03)', borderRadius: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>Parameters verified</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: form.semChecklist.filter(c => c.passed).length === semParams.length ? 'var(--green)' : 'var(--yellow)' }}>
                    {form.semChecklist.filter(c => c.passed).length} / {semParams.length}
                  </span>
                </div>
                {semParams.map(p => (
                  <div key={p.id} className="checklist-item">
                    <button
                      className={`check-box ${isSemPassed(p.id) ? 'checked' : ''}`}
                      onClick={() => toggleSem(p.id)}
                    >
                      {isSemPassed(p.id) ? '✓' : ''}
                    </button>
                    <span style={{ fontSize: 13, flex: 1 }}>{p.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: isSemPassed(p.id) ? 'var(--green)' : 'var(--text3)' }}>
                      {isSemPassed(p.id) ? '✓ PASS' : 'Pending'}
                    </span>
                  </div>
                ))}
              </>
            )
          }
          <div className="form-group" style={{ marginTop: 20 }}>
            <label className="form-label">Field Remarks / Site Observations</label>
            <textarea
              className="form-control"
              value={form.remarks}
              onChange={e => set('remarks', e.target.value)}
              placeholder="Any deviations, site conditions, additional observations…"
              rows={3}
            />
          </div>
        </div>
      );
}