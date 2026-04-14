import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { auth, AuthResponse, User } from '../api';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User, token: string) => void;
  defaultTab?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess, defaultTab = 'login' }) => {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const reset = () => {
    setName(''); setEmail(''); setPassword(''); setError('');
  };

  const switchTab = (t: 'login' | 'register') => {
    setTab(t);
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let res: AuthResponse;
      if (tab === 'login') {
        res = await auth.login({ email, password });
      } else {
        res = await auth.register({ name, email, password, role });
      }
      localStorage.setItem('printhub_token', res.token);
      onSuccess(res.user, res.token);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.875rem 1rem',
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel"
        style={{
          width: '100%', maxWidth: '440px', padding: '2.5rem',
          borderRadius: '24px', position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          {tab === 'login' ? 'Welcome back 👋' : 'Create account'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          {tab === 'login'
            ? 'Log in to track your orders and manage your profile.'
            : 'Join PrintHub as a customer or printing partner.'}
        </p>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: '10px', padding: '4px', marginBottom: '2rem' }}>
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              style={{
                flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s',
                background: tab === t ? 'var(--bg-glass-light)' : 'transparent',
                color: tab === t ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {t === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tab === 'register' && (
            <>
              <input
                style={inputStyle} placeholder="Full name" value={name}
                onChange={(e) => setName(e.target.value)} required
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
              />
              {/* Role selector */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {(['customer', 'vendor'] as const).map((r) => (
                  <button
                    key={r} type="button"
                    onClick={() => setRole(r)}
                    style={{
                      padding: '0.75rem', border: '1px solid', borderRadius: '10px', cursor: 'pointer',
                      fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
                      borderColor: role === r ? 'var(--accent-primary)' : 'var(--border-color)',
                      background: role === r ? 'var(--bg-glass-light)' : 'var(--bg-tertiary)',
                      color: role === r ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    {r === 'customer' ? '🛒 Customer' : '🏭 Vendor'}
                  </button>
                ))}
              </div>
            </>
          )}

          <input
            style={inputStyle} type="email" placeholder="Email address"
            value={email} onChange={(e) => setEmail(e.target.value)} required
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
          />
          <input
            style={inputStyle} type="password" placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)} required
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
          />

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px', padding: '0.75rem 1rem', color: '#f87171', fontSize: '0.9rem',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ padding: '1rem', fontSize: '1rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {loading && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
            {loading ? 'Please wait...' : tab === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
