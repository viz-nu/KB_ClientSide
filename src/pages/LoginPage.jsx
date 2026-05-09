import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../apollo/gql.js';
import { useAuth } from '../hooks/useAuth.js';
import { Spinner } from '../components/common/index.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const [loginMutation, { loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const { accessToken, refreshToken, user } = data.login;
      login(user, accessToken, refreshToken);
      navigate('/dashboard', { replace: true });
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Try real API; fall back to mock in dev
    try {
      await loginMutation({ variables: { email: form.email, password: form.password } });
    } catch (error) {
      setError('Invalid email or password. Use demo credentials below.');
      console.log("Login mutation error:",error.message);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const fillDemo = (u,p) => setForm({ email: u, password: p });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `
        radial-gradient(ellipse at 20% 50%, rgba(244,160,28,.06) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 20%, rgba(59,130,246,.05) 0%, transparent 50%),
        var(--navy)
      `,
    }}>
      <div className="fade-up" style={{
        background: 'rgba(17,34,64,.92)',
        border: '1px solid rgba(255,255,255,.1)',
        borderRadius: 20,
        padding: 48,
        width: '100%',
        maxWidth: 420,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 24px 80px rgba(0,0,0,.5)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>🚂</div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 800, color: 'var(--accent)' }}>
            e-MB Portal
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 5, letterSpacing: '.05em' }}>
            Electronic Measurement Book · Railway Signalling
          </p>
          <div style={{ width: 48, height: 2, background: 'var(--accent)', borderRadius: 2, margin: '14px auto 0' }} />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)',
            color: '#EF4444', padding: '10px 14px', borderRadius: 8,
            fontSize: 13, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <span>⚠</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">email</label>
            <input
              className="form-control"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              autoFocus
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? <Spinner size={16} color="var(--navy)" /> : 'Sign In →'}
          </button>
        </form>

        {/* Demo credentials */}
        <div style={{ marginTop: 24, padding: 16, background: 'rgba(255,255,255,.03)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            Demo Accounts
          </div>
          {[
            { u: 'system@admin.com',p: 'systemadmin@123',    r: 'System Admin',   icon: '🔴' },
            { u: 'project@admin.com',p: 'password',   r: 'Project Admin',  icon: '🟡' },
            { u: 'engineer@engineer.com',p: 'password', r: 'Field Engineer', icon: '🟢' },
          ].map(({ u, p, r, icon }) => (
            <button
              key={u}
              onClick={() => fillDemo(u,p)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '7px 10px', marginBottom: 4,
                background: form.email === u ? 'rgba(244,160,28,.1)' : 'transparent',
                border: `1px solid ${form.email === u ? 'rgba(244,160,28,.3)' : 'transparent'}`,
                borderRadius: 7, cursor: 'pointer', transition: 'all .15s',
              }}
            >
              <span style={{ fontSize: 12, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{icon}</span>
                <code style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--accent)' }}>{u}</code>
              </span>
              <span style={{ fontSize: 11, color: 'var(--text2)' }}>{r}</span>
            </button>
          ))}
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6, textAlign: 'center' }}>
            Password for all: <code style={{ color: 'var(--text2)' }}>password</code>
          </div>
        </div>
      </div>
    </div>
  );
}
