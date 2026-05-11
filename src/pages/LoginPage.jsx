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
<div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
  <svg viewBox="0 0 100 110" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
    <line x1="50" y1="48" x2="22" y2="100" stroke="#4A6080" strokeWidth="2.5"/>
    <line x1="50" y1="48" x2="78" y2="100" stroke="#4A6080" strokeWidth="2.5"/>
    <line x1="36" y1="74" x2="64" y2="74" stroke="#4A6080" strokeWidth="1.8"/>
    <line x1="28" y1="88" x2="72" y2="88" stroke="#4A6080" strokeWidth="1.8"/>
    <line x1="50" y1="48" x2="50" y2="8" stroke="#E8EEF7" strokeWidth="2.5"/>
    <line x1="40" y1="24" x2="60" y2="24" stroke="#E8EEF7" strokeWidth="2"/>
    <line x1="43" y1="16" x2="57" y2="16" stroke="#E8EEF7" strokeWidth="2"/>
    <circle cx="50" cy="7" r="4" fill="#F4A01C"/>
    <path d="M 30 30 A 24 24 0 0 1 70 30" stroke="#F4A01C" strokeWidth="2.2" fill="none" opacity="0.9"/>
    <path d="M 18 20 A 38 38 0 0 1 82 20" stroke="#F4A01C" strokeWidth="1.5" fill="none" opacity="0.5"/>
    <path d="M 6 10 A 52 52 0 0 1 94 10" stroke="#F4A01C" strokeWidth="1" fill="none" opacity="0.25"/>
    <rect x="44" y="100" width="12" height="8" rx="2" fill="#4A6080"/>
    <rect x="30" y="107" width="40" height="4" rx="2" fill="#4A6080"/>
  </svg>
  <div>
    <div style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 800, color: 'var(--accent)', letterSpacing: '.04em', lineHeight: 1 }}>
      S&amp;TWMB
    </div>
    <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 5, letterSpacing: '.08em', textTransform: 'uppercase', lineHeight: 1.5 }}>
      Signaling &amp; Telecom<br />Works Measurement Book
    </div>
  </div>
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
            // { u: 'system@admin.com',p: 'systemadmin@123',    r: 'System Admin',   icon: '🔴' },
            { u: 'project@admin.com',p: 'password',   r: 'Project Admin',  icon: '🟡' },
            { u: 'vendor@admin.com',p: 'password',   r: 'Vendor',  icon: '🔴'  },
            { u: 'engineer@admin.com',p: 'password', r: 'Field Engineer', icon: '🟢' },
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
