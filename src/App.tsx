import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, NavLink } from 'react-router-dom';
import { Box, Sun, Moon, LogOut } from 'lucide-react';

import CustomerDashboard from './pages/CustomerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import LandingPage from './pages/LandingPage';
import FindVendorsPage from './pages/FindVendorsPage';
import MaterialsPage from './pages/MaterialsPage';
import AuthModal from './components/AuthModal';
import { auth, User } from './api';

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar = ({
  theme, toggleTheme, user, onLogin, onLogout,
}: {
  theme: string;
  toggleTheme: () => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}) => {
  const location = useLocation();
  const isVendor  = location.pathname === '/partner';

  const navLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '0.95rem',
    transition: 'color 0.2s',
  });

  return (
    <nav style={{ padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Box className="gradient-text" style={{ width: '32px', height: '32px', color: 'var(--accent-primary)' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Print<span className="gradient-text">Hub</span>
        </h1>
      </Link>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {!isVendor && (
          <>
            <NavLink to="/vendors" style={navLinkStyle}>Find Partners</NavLink>
            <NavLink to="/materials" style={navLinkStyle}>Materials</NavLink>
            <NavLink to="/customer" style={navLinkStyle}>Order Print</NavLink>
          </>
        )}

        <button
          onClick={toggleTheme}
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)', transition: 'all 0.3s' }}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>{user.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, textTransform: 'capitalize' }}>{user.role}</p>
            </div>
            <button
              onClick={onLogout}
              title="Log out"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.4rem 0.6rem', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        ) : (
          <>
            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={onLogin}>Log In</button>
            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={onLogin}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  const [theme, setTheme]         = useState('dark');
  const [authOpen, setAuthOpen]   = useState(false);

  // ── Restore user from localStorage immediately (no backend call needed) ──
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem('printhub_user');
      return cached ? (JSON.parse(cached) as User) : null;
    } catch {
      return null;
    }
  });

  const [loadingUser, setLoadingUser] = useState(false); // instant restore, no spinner needed

  // Silently validate token in background (refresh user data)
  useEffect(() => {
    const token = localStorage.getItem('printhub_token');
    if (!token) return;
    auth.me()
      .then((res) => {
        setUser(res.user);
        localStorage.setItem('printhub_user', JSON.stringify(res.user));
      })
      .catch((err: any) => {
        // Only log out if the server explicitly rejects the token (401)
        // Do NOT log out on network errors (backend offline)
        if (err.message?.includes('401') || err.message?.toLowerCase().includes('invalid token') || err.message?.toLowerCase().includes('expired')) {
          localStorage.removeItem('printhub_token');
          localStorage.removeItem('printhub_user');
          setUser(null);
        }
      });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const handleSetUser = (u: User) => {
    setUser(u);
    localStorage.setItem('printhub_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    localStorage.removeItem('printhub_token');
    localStorage.removeItem('printhub_user');
    setUser(null);
  };

  if (loadingUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <main className="main-content">
          <Navbar
            theme={theme}
            toggleTheme={toggleTheme}
            user={user}
            onLogin={() => setAuthOpen(true)}
            onLogout={handleLogout}
          />

          <Routes>
            <Route path="/" element={<LandingPage onLogin={() => setAuthOpen(true)} />} />
            <Route path="/customer" element={<CustomerDashboard user={user} onLogin={() => setAuthOpen(true)} />} />
            <Route path="/partner" element={<VendorDashboard user={user} onLogin={() => setAuthOpen(true)} />} />
            <Route path="/vendors" element={<FindVendorsPage />} />
            <Route path="/materials" element={<MaterialsPage />} />
          </Routes>
        </main>
      </div>

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSuccess={(u) => handleSetUser(u)}
        />
      )}
    </BrowserRouter>
  );
}

export default App;
