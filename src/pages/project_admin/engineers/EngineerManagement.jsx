import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../../../hooks/useAuth.js';
import { USER_QUERIES } from '../../../apollo/gql.js';
import {
  PageHeader, EmptyState,  Spinner, AlertBanner,
} from '../../../components/common/index.jsx';
import EngineerUserModal from './EngineerUserModal';

// ─── Engineer Management ─────────────────────────────────────────

export default function EngineerManagement() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editEng, setEditEng] = useState(null);

  const myProjects = useMemo(() => user?.projects ?? [], [user?.projects]);
  const mySpans = useMemo(() => user?.spans ?? [], [user?.spans]);
  const hasScope = myProjects.length > 0 || mySpans.length > 0;

  const listVariables = useMemo(() => ({
    page,
    limit,
    includeSelf: true,
    ...(myProjects.length ? { projects: myProjects.map((p) => p._id) } : {}),
    ...(mySpans.length ? { spans: mySpans.map((s) => s._id) } : {}),
    ...(statusFilter === 'active' ? { isActive: true } : statusFilter === 'inactive' ? { isActive: false } : {}),
    ...(roleFilter === 'project_admin' ? { role: 'project_admin' } : roleFilter === 'field_engineer' ? { role: 'field_engineer' } : {}),
  }), [page, limit, myProjects, mySpans, statusFilter, roleFilter]);

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery(USER_QUERIES.list, {
    fetchPolicy: "cache-and-network",
    variables: listVariables,
    skip: !hasScope,
  });

  const [updateUser, { loading: toggling }] = useMutation(USER_QUERIES.update, {
    onCompleted: () => void refetchUsers(),
  });

  const engineers = useMemo(() => {
    const raw = Array.isArray(usersData?.users?.data) ? usersData.users.data : [];
    return raw.map((u) => ({
      ...u,
      id: u._id ?? u.id,
      isActive: u.isActive,
      entries: u.entries ?? 0,
      pending: u.pending ?? 0,
    }));
  }, [usersData]);

  const meta = usersData?.users?.PaginationMetaData;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const totalDocs = meta?.totalDocuments ?? engineers.length;

  const listLoading =  (hasScope && usersLoading && !usersData);
  const listError = usersError;

  const handleToggleActive = (row) => {
    updateUser({
      variables: {
        id: row._id ?? row.id,
        userInput: { isActive: !row.isActive },
      },
    });
  };


  return (
    <div className="fade-up">
      <PageHeader
        title="Field Engineers"
        subtitle={
          hasScope
            ? `${engineers.length} field engineers (page ${page} of ${totalPages}, ${totalDocs} total in scope)`
            : `Managing engineers in ${user.span?.name || 'your span'}`
        }
        actions={<button className="btn btn-primary" onClick={() => { setEditEng(null); setShowModal(true); }}>+ Add Engineer</button>}
      />

      {listError && (
        <AlertBanner type="error" message={listError.message || 'Failed to load data.'} />
      )}

      {!hasScope && (
        <AlertBanner
          type="warning"
          message="Your account has no projects or spans assigned. Assign them in user management, then reload this page."
        />
      )}

      <div className="card">
        {hasScope && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <select className="form-control" style={{ width: 'auto' }} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="all">All statuses</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </select>
            <select className="form-control" style={{ width: 'auto' }} value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
              <option value="all">All roles</option>
              <option value="project_admin">Project Admin</option>
              <option value="field_engineer">Field Engineer</option>
            </select>
            <select className="form-control" style={{ width: 'auto' }} value={String(limit)} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
              {[10, 25, 50].map((n) => (
                <option key={n} value={n}>{n} per page</option>
              ))}
            </select>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              <button type="button" className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
              <span style={{ fontSize: 12, color: 'var(--text2)' }}>Page {page} / {totalPages}</span>
              <button type="button" className="btn btn-outline btn-sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => void refetchUsers()}>Refresh</button>
            </div>
          </div>
        )}

        {listLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <Spinner size={32} />
          </div>
        ) : !hasScope ? (
          <EmptyState icon="👷" title="No scope" message="Projects and spans from your profile are used to list engineers." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Engineer</th><th>Email</th><th>Entries</th><th>Pending</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {engineers.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(34,197,94,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                          {(e.name || '?').trim().split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{e.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text2)' }}>{e.designation || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td><code style={{ fontSize: 12 }}>{e.email}</code></td>
                    <td style={{ fontWeight: 600 }}>{e.entries}</td>
                    <td><span style={{ color: 'var(--yellow)', fontWeight: 600 }}>{e.pending}</span></td>
                    <td><span className={`badge badge-${e.isActive ? 'active' : 'inactive'}`}>{e.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => { setEditEng(e); setShowModal(true); }}>Edit</button>
                        <button
                          type="button"
                          className={`btn btn-sm ${e.isActive ? 'btn-danger' : 'btn-success'}`}
                          disabled={toggling}
                          onClick={() => handleToggleActive(e)}
                        >
                          {e.isActive ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {engineers.length === 0 && (
              <EmptyState icon="👷" title="No field engineers" message="No users match your filters in this scope." />
            )}
          </div>
        )}
      </div>

      {showModal && (
        <EngineerUserModal
          key={editEng?._id || 'create'}
          editUser={editEng}
          currentUser={user}
          onClose={() => { setShowModal(false); setEditEng(null); }}
          onSaved={() => void refetchUsers()}
        />
      )}
    </div>
  );
}
