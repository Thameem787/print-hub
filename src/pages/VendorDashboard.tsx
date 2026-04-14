import React, { useState, useEffect } from 'react';
import { Printer, CheckCircle, DollarSign, Inbox, Activity, Plus, Loader2, ToggleLeft, ToggleRight, AlertCircle, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { vendors, orders, Order, User } from '../api';

// ─── Vendor Onboarding Form ───────────────────────────────────────────────────

const OnboardingForm = ({ onComplete }: { onComplete: () => void }) => {
  const [shopName, setShopName]       = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress]         = useState('');
  const [city, setCity]               = useState('');
  const [pricePerGram, setPricePerGram] = useState(0.5);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['PLA']);
  const [selectedColors, setSelectedColors]       = useState<string[]>(['White']);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const allMaterials = ['PLA', 'ABS', 'PETG', 'TPU', 'Resin'];
  const allColors    = ['White', 'Black', 'Gray', 'Red', 'Blue', 'Green', 'Yellow', 'Orange'];

  const toggleItem = (list: string[], item: string, setList: (v: string[]) => void) => {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMaterials.length === 0) { setError('Select at least one material.'); return; }
    if (selectedColors.length === 0)    { setError('Select at least one color.'); return; }

    setLoading(true);
    setError('');
    try {
      await vendors.onboard({
        shop_name:     shopName,
        description,
        address,
        city,
        materials:     selectedMaterials,
        colors:        selectedColors,
        price_per_gram: pricePerGram,
      });
      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const chipStyle = (active: boolean, accent = 'var(--accent-primary)'): React.CSSProperties => ({
    padding: '0.4rem 0.9rem',
    borderRadius: '20px',
    border: `1px solid ${active ? accent : 'var(--border-color)'}`,
    background: active ? 'var(--bg-glass-light)' : 'var(--bg-tertiary)',
    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 600,
    transition: 'all 0.2s',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
      style={{ maxWidth: '680px', margin: '3rem auto', padding: '3rem' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ width: '64px', height: '64px', background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '1px solid var(--border-color)' }}>
          <Store size={28} color="var(--accent-primary)" />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Set Up Your <span className="gradient-text">Vendor Profile</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Complete your shop profile so customers can find and order from you.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Shop Name */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Shop Name *</label>
          <input className="form-control" placeholder="e.g. Irfan's 3D Studio" value={shopName}
            onChange={(e) => setShopName(e.target.value)} required />
        </div>

        {/* Description */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Description</label>
          <textarea className="form-control" placeholder="Tell customers about your shop and capabilities..." value={description}
            onChange={(e) => setDescription(e.target.value)} rows={3}
            style={{ resize: 'vertical', fontFamily: 'Inter, sans-serif' }} />
        </div>

        {/* Address + City */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Address *</label>
            <input className="form-control" placeholder="Street address" value={address}
              onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">City *</label>
            <input className="form-control" placeholder="City" value={city}
              onChange={(e) => setCity(e.target.value)} required />
          </div>
        </div>

        {/* Price per gram */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Filament Price per gram (USD) *</label>
          <input className="form-control" type="number" step="0.01" min={0.1} max={10}
            value={pricePerGram} onChange={(e) => setPricePerGram(parseFloat(e.target.value))} required />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            Recommended: $0.30–$1.00/g for FDM, $1.50–$3.00/g for Resin
          </p>
        </div>

        {/* Materials */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Supported Materials * (select all that apply)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {allMaterials.map((m) => (
              <button key={m} type="button" style={chipStyle(selectedMaterials.includes(m))}
                onClick={() => toggleItem(selectedMaterials, m, setSelectedMaterials)}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Available Colors * (select all that apply)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {allColors.map((c) => (
              <button key={c} type="button" style={chipStyle(selectedColors.includes(c), 'var(--accent-secondary)')}
                onClick={() => toggleItem(selectedColors, c, setSelectedColors)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '0.875rem 1rem', color: '#f87171', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}
          style={{ padding: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {loading && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
          {loading ? 'Creating Profile...' : 'Create Vendor Profile →'}
        </button>
      </form>
    </motion.div>
  );
};

// ─── Main Vendor Dashboard ────────────────────────────────────────────────────

const VendorDashboard = ({ user, onLogin }: { user: User | null; onLogin: () => void }) => {
  const [jobList, setJobList]             = useState<Order[]>([]);
  const [loading, setLoading]             = useState(true);
  const [hasProfile, setHasProfile]       = useState<boolean | null>(null); // null = still checking
  const [isAvailable, setIsAvailable]     = useState(true);
  const [togglingAvail, setTogglingAvail] = useState(false);
  const [updatingId, setUpdatingId]       = useState<number | null>(null);
  const [printers, setPrinters] = useState([
    { name: 'Prusa MK3S+',   status: 'Printing (45%)', color: 'var(--warning)', active: true,  progress: '45%' },
    { name: 'Bambu Lab X1C', status: 'Printing (12%)', color: 'var(--warning)', active: true,  progress: '12%' },
    { name: 'Elegoo Mars 3', status: 'Idle',           color: 'var(--success)', active: false, progress: '0%' },
  ]);

  const fetchOrders = async () => {
    try {
      const res = await vendors.myOrders();
      setJobList(res.orders);
      setHasProfile(true);
    } catch (err: any) {
      // "Vendor profile not found" → trigger onboarding
      if (err.message?.toLowerCase().includes('not found')) {
        setHasProfile(false);
      } else {
        setHasProfile(true); // some other error, profile exists
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'vendor') { setLoading(false); return; }
    fetchOrders();
  }, [user]);

  // Auto-poll for new/updated jobs every 5 seconds
  useEffect(() => {
    if (!user || user.role !== 'vendor') return;
    const interval = setInterval(async () => {
      try {
        const res = await vendors.myOrders();
        setJobList((prev) => {
          const hasChange =
            res.orders.length !== prev.length ||
            res.orders.some((incoming) => {
              const existing = prev.find((o) => String(o.id) === String(incoming.id));
              return !existing || existing.status !== incoming.status;
            });
          return hasChange ? res.orders : prev;
        });
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleToggleAvailability = async () => {
    setTogglingAvail(true);
    try {
      const res = await vendors.toggleAvailability();
      setIsAvailable(res.is_available);
    } catch {}
    setTogglingAvail(false);
  };

  const statusFlow: Record<string, string> = {
    pending:  'accepted',
    accepted: 'printing',
    printing: 'ready',
    ready:    'delivered',
  };

  const actionLabel: Record<string, string> = {
    pending:  'Accept Job',
    accepted: 'Start Printing',
    printing: 'Mark Ready',
    ready:    'Mark Delivered',
  };

  const handleJobAction = async (job: Order) => {
    const next = statusFlow[job.status];
    if (!next) return;
    setUpdatingId(job.id);
    try {
      await orders.updateStatus(job.id, next);
      await fetchOrders();
    } catch {}
    setUpdatingId(null);
  };

  const statusColor: Record<string, string> = {
    pending:   'var(--warning)',
    accepted:  'var(--accent-primary)',
    printing:  'var(--accent-secondary)',
    ready:     'var(--success)',
    delivered: 'var(--success)',
    cancelled: '#f87171',
  };

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="animate-fade-in" style={{ marginTop: '4rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
          Partner <span className="gradient-text">Dashboard</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Log in as a vendor to manage your print jobs.
        </p>
        <button className="btn btn-primary" style={{ padding: '1rem 2rem' }} onClick={onLogin}>
          Log In / Sign Up
        </button>
      </div>
    );
  }

  // ── Wrong role ─────────────────────────────────────────────────────────────
  if (user.role === 'customer') {
    return (
      <div className="animate-fade-in" style={{ marginTop: '4rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
          This dashboard is for <span className="gradient-text">Vendors</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Your account is registered as a Customer. Create a new account with the Vendor role.
        </p>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading || hasProfile === null) {
    return (
      <div style={{ marginTop: '5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // ── No vendor profile yet → show onboarding ────────────────────────────────
  if (!hasProfile) {
    return (
      <div className="animate-fade-in">
        <OnboardingForm onComplete={() => { setLoading(true); setHasProfile(null); fetchOrders(); }} />
      </div>
    );
  }

  // ── Full Dashboard ─────────────────────────────────────────────────────────
  const activeJobs    = jobList.filter((j) => j.status !== 'delivered' && j.status !== 'cancelled');
  const completedJobs = jobList.filter((j) => j.status === 'delivered');
  const totalRevenue  = completedJobs.reduce((s, j) => s + j.total_cost, 0);
  const pendingCount  = jobList.filter((j) => j.status === 'pending').length;

  return (
    <div className="animate-fade-in" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Partner <span className="gradient-text">Dashboard</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Welcome back, {user.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleToggleAvailability} disabled={togglingAvail}
            className={`btn ${isAvailable ? 'btn-primary' : 'btn-secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isAvailable ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
            {isAvailable ? 'Online' : 'Offline'}
          </button>
          <button className="btn btn-secondary"
            onClick={() => setPrinters((p) => [...p, { name: 'New Printer', status: 'Idle', color: 'var(--success)', active: false, progress: '0%' }])}>
            <Plus size={18} /> Add Printer
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Total Revenue',   value: `$${totalRevenue.toFixed(2)}`,   icon: <DollarSign color="var(--success)" size={24} />,      sub: `${completedJobs.length} completed` },
          { label: 'Active Orders',   value: `${activeJobs.length}`,           icon: <Activity color="var(--accent-primary)" size={24} />,  sub: `${pendingCount} pending` },
          { label: 'Completion Rate', value: jobList.length ? `${((completedJobs.length / jobList.length) * 100).toFixed(0)}%` : 'N/A',
                                                                                icon: <CheckCircle color="var(--success)" size={24} />,     sub: `${jobList.length} total` },
          { label: 'Availability',    value: isAvailable ? 'Online' : 'Offline',
                                                                                icon: <Printer color={isAvailable ? 'var(--success)' : 'var(--text-secondary)'} size={24} />, sub: 'Toggle above' },
        ].map((stat, i) => (
          <motion.div key={i} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} whileHover={{ y: -5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }}>{stat.label}</span>
              {stat.icon}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800 }}>{stat.value}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{stat.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Jobs Panel */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Inbox size={20} color="var(--accent-primary)" /> Incoming Print Jobs
            <span title="Auto-refreshing every 5 seconds" style={{ marginLeft: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', fontWeight: 500, color: 'var(--success)', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '20px', padding: '0.2rem 0.6rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block', animation: 'livePulse 1.5s ease-in-out infinite' }} />
              Live
            </span>
          </h3>
          {activeJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              No active jobs yet. Customers will find you when they search for vendors!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeJobs.map((job) => (
                <div key={job.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '1.05rem' }}>{job.file_name}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--accent-primary)' }}>#{job.id}</span> • {job.material} × {job.quantity}
                      {job.customer_name && ` • by ${job.customer_name}`}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>${job.total_cost.toFixed(2)}</p>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: statusColor[job.status] }}>
                        {job.status}
                      </span>
                    </div>
                    {actionLabel[job.status] && (
                      <button
                        className={`btn ${job.status === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        disabled={updatingId === job.id}
                        onClick={() => handleJobAction(job)}
                      >
                        {updatingId === job.id && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
                        {actionLabel[job.status]}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Printer Farm */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Printer size={20} color="var(--accent-primary)" /> Farm Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {printers.map((printer, i) => (
              <div key={i} style={{ padding: '1.2rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: printer.active ? '0.75rem' : '0' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{printer.name}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: printer.color, fontWeight: 500 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: printer.color, boxShadow: `0 0 8px ${printer.color}`, display: 'inline-block' }} />
                    {printer.status}
                  </span>
                </div>
                {printer.active && (
                  <div style={{ width: '100%', height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: printer.progress, height: '100%', background: 'var(--accent-gradient)' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
