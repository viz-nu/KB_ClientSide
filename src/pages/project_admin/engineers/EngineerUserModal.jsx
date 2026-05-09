import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER, CREATE_USER } from '../../../apollo/gql.js';
import { Modal,FormField, Spinner, AlertBanner} from '../../../components/common/index.jsx';


// ─── Engineer Management ─────────────────────────────────────────
const ASSIGNABLE_SCOPE_OPTIONS = [
  'user:read',
  'user:write',
  'project:read',
  'project:write',
  'activity:read',
  'activity:write',
];

export default function EngineerUserModal({ editUser, currentUser, onClose, onSaved }) {
  const isEdit = !!editUser;
  const projectList = currentUser?.projects ?? [];

  const [name, setName] = useState(editUser?.name ?? '');
  const [designation, setDesignation] = useState(editUser?.designation ?? '');
  const [email, setEmail] = useState(editUser?.email ?? '');
  const [role, setRole] = useState(editUser?.role ?? 'field_engineer');
  const [password, setPassword] = useState('');
  const [projectIds, setProjectIds] = useState(() =>
    (!editUser && projectList.length ? projectList.map((p) => p._id) : []),
  );

  const [scopes, setScopes] = useState(() =>
    (Array.isArray(editUser?.scopes) ? [...editUser.scopes] : []),
  );
  const [formError, setFormError] = useState('');

  const [createUser, { loading: creating }] = useMutation(CREATE_USER);
  const [updateUserRecord, { loading: updating }] = useMutation(UPDATE_USER);

  const saving = creating || updating;

  const toggleScope = (scope) => {
    setScopes((prev) => (prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]));
  };

  const handleSubmit = async () => {
    setFormError('');
    const n = name.trim();
    const d = designation.trim();
    const em = email.trim();
    if (!n) { setFormError('Name is required'); return; }
    if (!em) { setFormError('Email is required'); return; }
    if (!isEdit) {
      if (!password) { setFormError('Password is required'); return; }
      if (!projectIds.length) { setFormError('Select at least one project'); return; }
      try {
        const { errors } = await createUser({
          variables: {
            userInput: {
              name: n,
              designation: d || undefined,
              email: em,
              password,
              role,
              projects: projectIds,
            },
          },
        });
        if (errors?.length) throw new Error(errors.map((e) => e.message).join(', '));
        onSaved();
        onClose();
      } catch (e) {
        setFormError(e.message || 'Create failed');
      }
      return;
    }
    const userInput = { name: n, designation: d || undefined, email: em, role, scopes };
    if (password.trim()) userInput.password = password.trim();
    try {
      const { errors } = await updateUserRecord({
        variables: { id: editUser._id, userInput },
      });
      if (errors?.length) throw new Error(errors.map((e) => e.message).join(', '));
      onSaved();
      onClose();
    } catch (e) {
      setFormError(e.message || 'Update failed');
    }
  };

  return (
    <Modal
      title={isEdit ? `Edit user — ${editUser.name}` : 'Add user'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={() => void handleSubmit()} disabled={saving}>
            {saving ? <Spinner size={14} color="var(--navy)" /> : 'Save'}
          </button>
        </>
      }
    >
      {formError && <AlertBanner type="error" message={formError} />}
      <div className="form-row">
        <FormField label="Full name" required>
          <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rajesh Kumar" />
        </FormField>
        <FormField label="Designation">
          <input className="form-control" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. Sub Divisional Engineer" />
        </FormField>
        {/* <FormField label="Span">
          <input className="form-control" value={span} onChange={(e) => setSpan(e.target.value)} placeholder="e.g. South Central Span" />
        </FormField> */}
      </div>
      <FormField label="Email" required>
        <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isEdit} placeholder="name@example.com" />
      </FormField>
      <div className="form-row">
        <FormField label="Role" required>
          <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="field_engineer">Field engineer</option>
            <option value="project_admin">Project admin</option>
          </select>
        </FormField>
        <FormField label={isEdit ? 'Password (optional)' : 'Password'} required={!isEdit}>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isEdit ? 'Leave blank to keep current password' : 'Minimum 8 characters'}
            autoComplete="new-password"
          />
        </FormField>
      </div>
      {!isEdit && projectList.length > 0 && (
        <FormField label="Projects" required>
          <select
            className="form-control"
            multiple
            size={Math.min(Math.max(projectList.length, 3), 8)}
            value={projectIds}
            onChange={(e) => setProjectIds(Array.from(e.target.selectedOptions, (o) => o.value))}
          >
            {projectList.map((p) => (
              <option key={p._id} value={p._id}>{p.name || p._id}</option>
            ))}
          </select>
          <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 6 }}>Hold Ctrl/Cmd to select multiple. IDs are sent to the API.</div>
        </FormField>
      )}
      {!isEdit && !projectList.length && (
        <AlertBanner type="warning" message="Your profile has no projects. Assign projects to your account before creating users with project scope." />
      )}
      {isEdit && (
        <FormField label="Scopes">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {ASSIGNABLE_SCOPE_OPTIONS.map((s) => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" checked={scopes.includes(s)} onChange={() => toggleScope(s)} />
                <code style={{ fontSize: 12 }}>{s}</code>
              </label>
            ))}
          </div>
        </FormField>
      )}
    </Modal>
  );
}
