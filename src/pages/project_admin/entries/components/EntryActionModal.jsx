import { Modal, FormField } from '../../../../components/common';

const TITLE_MAP = {
  APPROVE: '✅ Approve Entry',
  REJECT:  '❌ Reject Entry',
  RETURN:  '↩ Return for Correction',
};

const PLACEHOLDER_MAP = {
  APPROVE: 'Verified and approved…',
  REJECT:  'State the reason for rejection…',
  RETURN:  'State what needs to be corrected…',
};

const BTN_CLASS_MAP = {
  APPROVE: 'btn-success',
  REJECT:  'btn-danger',
  RETURN:  'btn-outline',
};

export default function EntryActionModal({
  actionModal,
  setActionModal,
  submitAction,
  submitting = false,
}) {
  const { entry, action, remark } = actionModal;
  const requiresRemark = action !== 'APPROVE';
  const canSubmit = !submitting && (!requiresRemark || remark.trim().length > 0);

  // Entry display name: project name from GraphQL, fallback to _id
  const entryLabel = entry.project?.name ?? `#${entry._id?.slice(-6)}`;

  return (
    <Modal
      title={TITLE_MAP[action]}
      onClose={() => !submitting && setActionModal(null)}
      footer={
        <>
          <button
            className="btn btn-outline"
            onClick={() => setActionModal(null)}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            className={`btn ${BTN_CLASS_MAP[action]}`}
            onClick={submitAction}
            disabled={!canSubmit}
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </>
      }
    >
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>
        Entry:{' '}
        <strong style={{ color: 'var(--text)' }}>{entryLabel}</strong>
      </p>

      <FormField
        label={requiresRemark ? 'Reason (required)' : 'Approval remark (optional)'}
        required={requiresRemark}
      >
        <textarea
          className="form-control"
          rows={3}
          value={remark}
          onChange={ev =>
            setActionModal(a => ({ ...a, remark: ev.target.value }))
          }
          placeholder={PLACEHOLDER_MAP[action]}
          disabled={submitting}
        />
      </FormField>
    </Modal>
  );
}