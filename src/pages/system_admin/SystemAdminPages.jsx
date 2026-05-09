import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { LIST_USERS } from '../../apollo/gql';
import { MOCK_ENTRIES } from '../../constants/scheduleN';
import {
  StatCard, HealthBar, PageHeader, EmptyState,
  RoleBadge, Modal, ConfirmDialog, FormField, Spinner, AlertBanner,
} from '../../components/common';

// ─── System Overview ────────────────────────────────────────────
export function SystemOverview() {
  const health = { cpu: 42, memory: 68, disk: 31, activeUsers: 14, pendingEntries: 23, approvedEntries: 187, rejectedEntries: 8 };
  const activity = [
    { icon: '👤', text: 'New Project Admin created: Amit Patel (NED Span)', time: '10 min ago' },
    { icon: '✅', text: 'Entry #E-0194 approved by Priya Sharma — ₹2,01,900', time: '25 min ago' },
    { icon: '❌', text: 'Entry #E-0189 rejected — GPS photo mismatch', time: '1h ago' },
    { icon: '👷', text: 'Engineer Suresh Babu assigned to South Central Span', time: '2h ago' },
    { icon: '🔐', text: 'Password reset for bkumar@railways.gov.in', time: '3h ago' },
    { icon: '📋', text: 'Entry #E-0181 returned for correction by R. Singh', time: '4h ago' },
  ];

  return (
    <div className="fade-up">
      <PageHeader
        title="System Overview"
        subtitle="Real-time health and activity across all spans"
      />

      <div className="stats-grid">
        <StatCard icon="👥" number={health.activeUsers}      label="Active Users"      color="var(--blue)"   />
        <StatCard icon="⏳" number={health.pendingEntries}   label="Pending Entries"  color="var(--yellow)" />
        <StatCard icon="✅" number={health.approvedEntries}  label="Approved"         color="var(--green)"  />
        <StatCard icon="❌" number={health.rejectedEntries}  label="Rejected"         color="var(--red)"    />
        <StatCard icon="🏗️" number={2}                       label="Spans"        color="var(--purple)" />
        <StatCard icon="📋" number={MOCK_ENTRIES.length}     label="Total Entries"    color="var(--accent)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Health */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">⚙️ System Health</span>
            <span style={{ fontSize: 11, color: 'var(--green)' }}>● All systems normal</span>
          </div>
          <HealthBar label="CPU Usage"   value={health.cpu}    color="var(--blue)"  />
          <HealthBar label="Memory"      value={health.memory} color="var(--accent)" />
          <HealthBar label="Disk Usage"  value={health.disk}   color="var(--green)" />
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[['Server Uptime','99.8%','var(--green)'],['API Latency','42ms','var(--blue)'],['DB Connections','12/50','var(--accent)'],['Error Rate','0.02%','var(--green)']].map(([l,v,c]) => (
              <div key={l} style={{ background: 'rgba(255,255,255,.03)', padding: '8px 12px', borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{l}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: c, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="card">
          <div className="card-header"><span className="card-title">📡 Recent Activity</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activity.map((a, i) => (
              <div key={i} className="activity-item">
                <span style={{ fontSize: 18, flexShrink: 0 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.4 }}>{a.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── User Management ────────────────────────────────────────────

function normalizeListUser(u) {
  const id = u._id ?? u.id;
  let span = u.span;
  if (!span?.name && Array.isArray(u.spans) && u.spans.length) {
    const names = u.spans.map(s => (typeof s === 'string' ? s : s?.name)).filter(Boolean);
    if (names.length) span = { name: names.join(', ') };
  }
  return {
    ...u,
    id,
    isActive: u.isActive ?? true,
    span,
    createdAt: u.createdAt ?? '—',
  };
}

function userInitials(name) {
  if (!name?.trim()) return '?';
  return name.trim().split(/\s+/).map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export function UserManagement() {
  const { data, loading, error, refetch } = useQuery(LIST_USERS, {
    fetchPolicy: 'network-only',
    variables: { page: 1, limit: 10 },
  });
  const users = useMemo(() => {
    const raw = Array.isArray(data?.users) ? data.users : (data?.users?.data ?? []);
    return raw.map(normalizeListUser);
  }, [data]);

  const [filterRole, setFilterRole] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = users.filter(u => {
    const matchRole = filterRole === 'all' || u.role === filterRole;
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const openCreate = () => { setEditUser(null); setShowModal(true); };
  const openEdit   = (u) => { setEditUser(u);   setShowModal(true); };

  const handleSave = () => {
    setShowModal(false);
    void refetch();
  };
  const handleDelete = () => {
    setDeleteTarget(null);
    void refetch();
  };
  const toggleActive = () => {
    void refetch();
  };

  return (
    <div className="fade-up">
      <PageHeader
        title="User Management"
        subtitle={`${filtered.length} of ${users.length} users`}
        actions={<button className="btn btn-primary" onClick={openCreate}>+ Add User</button>}
      />
      {error && (
        <>
          <AlertBanner type="error" message={error.message || 'Could not load users.'} />
          <div style={{ marginBottom: 16 }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        </>
      )}
      <div className="card">
        {loading && !data ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <Spinner size={32} />
          </div>
        ) : (
          <>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <input
            className="form-control"
            style={{ maxWidth: 240 }}
            placeholder="🔍  Search name, email, email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="form-control" style={{ width: 'auto' }} value={filterRole} onChange={e => setFilterRole(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="project_admin">Project Admin</option>
            <option value="field_engineer">Field Engineer</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>email</th>
                <th>Role</th>
                <th>Span</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: u.role === 'project_admin' ? 'rgba(59,130,246,.2)' : 'rgba(34,197,94,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        {userInitials(u.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text2)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><code style={{ fontSize: 12, color: 'var(--text2)' }}>{u.email}</code></td>
                  <td><RoleBadge role={u.role} /></td>
                  <td style={{ fontSize: 12, color: 'var(--text2)' }}>{u.span?.name || '—'}</td>
                  <td>
                    <span className={`badge badge-${u.isActive ? 'active' : 'inactive'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text2)' }}>{u.createdAt}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(u)}>Edit</button>
                      <button
                        className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => toggleActive(u.id)}
                      >
                        {u.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(u)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyState icon="👥" title="No users found" message="Try adjusting your search or filters." />}
        </div>
          </>
        )}
      </div>

      {showModal && <UserFormModal user={editUser} onSave={handleSave} onClose={() => setShowModal(false)} />}
      {deleteTarget && (
        <ConfirmDialog
          danger
          message={`Permanently delete user "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

// ─── User Form Modal ─────────────────────────────────────────────
function UserFormModal({ user, onSave, onClose }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'field_engineer',
    spanName: user?.span?.name || '',
    isActive: user?.isActive ?? true,
  });
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'email is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (!user && !form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <Modal
      title={user ? `Edit — ${user.name}` : 'Create New User'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {user ? 'Save Changes' : 'Create User'}
          </button>
        </>
      }
    >
      <div className="form-row">
        <FormField label="Full Name" error={errors.name} required>
          <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Rajesh Kumar" />
        </FormField>
        <FormField label="Email" error={errors.email} required>
          <input className="form-control" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="name@railways.gov.in" disabled={!!user} />
        </FormField>
      </div>
      <div className="form-row">
        <FormField label="Role" required>
          <select className="form-control" value={form.role} onChange={e => set('role', e.target.value)}>
            <option value="project_admin">Project Admin</option>
            <option value="field_engineer">Field Engineer</option>
          </select>
        </FormField>
        <FormField label="Span">
          <input className="form-control" value={form.spanName} onChange={e => set('spanName', e.target.value)} placeholder="e.g. South Central Span" />
        </FormField>
      </div>
      {!user ? (
        <FormField label="Initial Password" error={errors.password} required>
          <input className="form-control" type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Minimum 8 characters" />
        </FormField>
      ) : (
        <FormField label="Account Status">
          <select className="form-control" value={String(form.isActive)} onChange={e => set('isActive', e.target.value === 'true')}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </FormField>
      )}
    </Modal>
  );
}
