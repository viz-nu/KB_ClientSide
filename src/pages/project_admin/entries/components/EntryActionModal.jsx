import { Modal, FormField } from '../../../../components/common';


export default function EntryActionModal({ actionModal, setActionModal, submitAction }) {
    return (
         
            <Modal
              title={{ APPROVE: '✅ Approve Entry', REJECT: '❌ Reject Entry', RETURN: '↩ Return for Correction' }[actionModal.action]}
              onClose={() => setActionModal(null)}
              footer={
                <>
                  <button className="btn btn-outline" onClick={() => setActionModal(null)}>Cancel</button>
                  <button
                    className={`btn ${actionModal.action === 'APPROVE' ? 'btn-success' : actionModal.action === 'REJECT' ? 'btn-danger' : 'btn-outline'}`}
                    onClick={submitAction}
                    disabled={actionModal.action !== 'APPROVE' && !actionModal.remark.trim()}
                  >
                    Submit
                  </button>
                </>
              }
            >
              <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>
                Entry: <strong style={{ color: 'var(--text)' }}>{actionModal.entry.title}</strong>
              </p>
              <FormField
                label={actionModal.action === 'APPROVE' ? 'Approval remark (optional)' : 'Reason (required)'}
                required={actionModal.action !== 'APPROVE'}
              >
                <textarea
                  className="form-control"
                  rows={3}
                  value={actionModal.remark}
                  onChange={e => setActionModal(a => ({ ...a, remark: e.target.value }))}
                  placeholder={
                    actionModal.action === 'APPROVE' ? 'Verified and approved…' :
                    actionModal.action === 'REJECT'  ? 'State the reason for rejection…' :
                    'State what needs to be corrected…'
                  }
                />
              </FormField>
            </Modal>
        
    )
}