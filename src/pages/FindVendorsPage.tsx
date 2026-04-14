import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Package, Palette, Star, Search, Loader2, Wifi, WifiOff } from 'lucide-react';
import { vendors, Vendor } from '../api';
import { Link } from 'react-router-dom';

const MATERIAL_COLORS: Record<string, string> = {
  PLA:   'var(--accent-primary)',
  ABS:   'var(--accent-secondary)',
  PETG:  'var(--success)',
  TPU:   'var(--warning)',
  Resin: '#a78bfa',
};

const VendorCard = ({ vendor }: { vendor: Vendor }) => (
  <motion.div
    className="glass-panel"
    style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,210,255,0.12)' }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {/* Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {/* Avatar */}
        <div style={{
          width: '52px', height: '52px', borderRadius: '14px',
          background: 'var(--accent-gradient)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: '1.3rem', color: 'white', flexShrink: 0,
        }}>
          {vendor.shop_name[0].toUpperCase()}
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{vendor.shop_name}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={13} /> {vendor.city}
          </p>
        </div>
      </div>
      {/* Status badge */}
      <span style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700,
        background: vendor.is_available ? 'rgba(16,185,129,0.12)' : 'rgba(161,161,170,0.1)',
        border: `1px solid ${vendor.is_available ? 'rgba(16,185,129,0.3)' : 'var(--border-color)'}`,
        color: vendor.is_available ? 'var(--success)' : 'var(--text-secondary)',
      }}>
        {vendor.is_available ? <Wifi size={12} /> : <WifiOff size={12} />}
        {vendor.is_available ? 'Online' : 'Offline'}
      </span>
    </div>

    {/* Description */}
    {vendor.description && (
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
        {vendor.description}
      </p>
    )}

    {/* Materials */}
    <div>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Package size={13} /> Materials
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {vendor.materials.map((m) => (
          <span key={m} style={{
            padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
            border: `1px solid ${MATERIAL_COLORS[m] || 'var(--border-color)'}`,
            color: MATERIAL_COLORS[m] || 'var(--text-secondary)',
            background: `${MATERIAL_COLORS[m]}14` || 'transparent',
          }}>
            {m}
          </span>
        ))}
      </div>
    </div>

    {/* Colors */}
    <div>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Palette size={13} /> Colors
      </p>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {vendor.colors.map((c) => (
          <span key={c} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0.2rem 0.6rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            {c}
          </span>
        ))}
      </div>
    </div>

    {/* Footer */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
      <div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>Price per gram</p>
        <p style={{ fontSize: '1.2rem', fontWeight: 800 }} className="gradient-text">
          ${vendor.price_per_gram.toFixed(2)}<span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/g</span>
        </p>
      </div>
      <Link to="/customer" style={{ textDecoration: 'none' }}>
        <button
          className="btn btn-primary"
          style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
          disabled={!vendor.is_available}
        >
          {vendor.is_available ? 'Order Now →' : 'Offline'}
        </button>
      </Link>
    </div>
  </motion.div>
);

const FindVendorsPage = () => {
  const [vendorList, setVendorList]   = useState<Vendor[]>([]);
  const [filtered, setFiltered]       = useState<Vendor[]>([]);
  const [loading, setLoading]         = useState(true);
  const [searchCity, setSearchCity]   = useState('');
  const [searchMat, setSearchMat]     = useState('');
  const [showOnline, setShowOnline]   = useState(false);

  useEffect(() => {
    vendors.list()
      .then((res) => { setVendorList(res.vendors); setFiltered(res.vendors); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...vendorList];
    if (searchCity.trim()) {
      result = result.filter((v) => v.city.toLowerCase().includes(searchCity.toLowerCase()));
    }
    if (searchMat.trim()) {
      result = result.filter((v) => v.materials.some((m) => m.toLowerCase().includes(searchMat.toLowerCase())));
    }
    if (showOnline) {
      result = result.filter((v) => v.is_available === 1);
    }
    setFiltered(result);
  }, [searchCity, searchMat, showOnline, vendorList]);

  const onlineCount = vendorList.filter((v) => v.is_available).length;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '4rem 0 3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass-light)', padding: '0.4rem 1rem', borderRadius: '40px', color: 'var(--success)', fontWeight: 600, fontSize: '0.85rem', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '1.5rem' }}>
          <Wifi size={14} /> {onlineCount} vendors online now
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
          Find Local <span className="gradient-text">Printing Partners</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto' }}>
          Browse all verified 3D printing vendors on the PrintHub network. Filter by city, material, or availability.
        </p>
      </div>

      {/* Filters */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            className="form-control"
            placeholder="Filter by city..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
          <Package size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            className="form-control"
            placeholder="Filter by material (PLA, ABS...)"
            value={searchMat}
            onChange={(e) => setSearchMat(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <button
          onClick={() => setShowOnline((p) => !p)}
          className={`btn ${showOnline ? 'btn-primary' : 'btn-secondary'}`}
          style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Wifi size={15} /> Online Only
        </button>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Vendor Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', display: 'block' }} />
          <p>Loading vendors...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <MapPin size={40} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.4 }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No vendors found</p>
          <p style={{ fontSize: '0.9rem' }}>
            {vendorList.length === 0
              ? 'No vendors have registered yet. Be the first!'
              : 'Try changing your search filters.'}
          </p>
          {vendorList.length === 0 && (
            <Link to="/partner" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                Become a Partner →
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((v) => <VendorCard key={v.id} vendor={v} />)}
        </div>
      )}
    </div>
  );
};

export default FindVendorsPage;
