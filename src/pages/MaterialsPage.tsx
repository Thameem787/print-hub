import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Users, DollarSign } from 'lucide-react';
import { vendors, Vendor } from '../api';

// Static descriptions — the rest (availability, price) comes from the DB
const MATERIAL_META: Record<string, {
  full: string; color: string; tag: string; desc: string;
  pros: string[]; cons: string[]; temp: string;
  img: string;
}> = {
  PLA: {
    full: 'Polylactic Acid', color: 'var(--accent-primary)', tag: 'Most Popular',
    desc: 'The most widely used 3D printing filament. Made from renewable resources, PLA is easy to print, produces minimal warping, and is ideal for prototypes, decorative parts, and everyday objects.',
    pros: ['Easy to print', 'Biodegradable', 'Low cost', 'Wide color range'],
    cons: ['Low heat resistance', 'Brittle under stress'],
    temp: '190–220°C',
    img: 'https://imgs.search.brave.com/cyj_h39x71mBkC0ZS2ayAR5RSQb3b8XAyGkCiPZ9634/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c292b2wzZC5jb20v/Y2RuL3Nob3AvYXJ0/aWNsZXMvYWU0ZTlj/ZGI3ZmM0NGQzZDg5/NGM4NjhmZTQyZWVk/NDkuanBnP3Y9MTc1/MTUzMzEzNiZ3aWR0/aD0xNTAw',
  },
  ABS: {
    full: 'Acrylonitrile Butadiene Styrene', color: 'var(--accent-secondary)', tag: 'Durable',
    desc: 'A petroleum-based thermoplastic known for its toughness. ABS is heat-resistant and impact-resistant, making it ideal for functional parts, enclosures, and mechanical prototypes.',
    pros: ['Heat resistant', 'Impact resistant', 'Machinable', 'Tough'],
    cons: ['Requires enclosure', 'Warps easily', 'Fumes during printing'],
    temp: '220–250°C',
    img: 'https://imgs.search.brave.com/zWhNqJoduyTTeJM04WlSsCgydt9h8TdTbUZZIOnY7Ww/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aHBhY2FkZW15LmNv/bS9hc3NldHMvVXBs/b2Fkcy9ibG9nLXBv/c3RzLzZmYTYwMDQ4/NGMvel9NR18zOTY2/X19GaWxsV3pjNE1D/dzBNekJkLmpwZw',
  },
  PETG: {
    full: 'Polyethylene Terephthalate Glycol', color: 'var(--success)', tag: 'Best of Both',
    desc: 'The perfect middle ground between PLA and ABS. PETG offers excellent layer adhesion, chemical resistance, and food-safe options. Great for mechanical parts, containers, and outdoor use.',
    pros: ['Chemical resistant', 'Food safe variants', 'Easy to print', 'Flexible'],
    cons: ['Stringy', 'Not UV resistant', 'Lower detail than PLA'],
    temp: '230–250°C',
    img: 'https://imgs.search.brave.com/dVONAbhnPtMKDu_yQggymbs8mTYeQRsJLGIIG4Dbbbw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/M2RzLmNvbS9hc3Nl/dHMvaW52ZXN0L3N0/eWxlcy9iYW5uZXIv/cHVibGljLzIwMjIt/MDQvcG93ZGVyLWJl/ZC1mdXNpb24tMy0x/LmpwZy53ZWJwP2l0/b2s9cGhWNnpFSHU',
  },
  TPU: {
    full: 'Thermoplastic Polyurethane', color: 'var(--warning)', tag: 'Flexible',
    desc: 'A rubber-like flexible filament used for parts that need to bend, compress, or absorb shock. Perfect for phone cases, gaskets, shoe soles, and wearable applications.',
    pros: ['Highly flexible', 'Abrasion resistant', 'Durable', 'Shock absorbing'],
    cons: ['Slow printing', 'Difficult retraction', 'Higher cost'],
    temp: '220–240°C',
    img: 'https://imgs.search.brave.com/cyj_h39x71mBkC0ZS2ayAR5RSQb3b8XAyGkCiPZ9634/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c292b2wzZC5jb20v/Y2RuL3Nob3AvYXJ0/aWNsZXMvYWU0ZTlj/ZGI3ZmM0NGQzZDg5/NGM4NjhmZTQyZWVk/NDkuanBnP3Y9MTc1/MTUzMzEzNiZ3aWR0/aD0xNTAw',
  },
  Resin: {
    full: 'Photopolymer Resin (SLA/MSLA)', color: '#a78bfa', tag: 'High Detail',
    desc: 'Used in resin-based printers (SLA/MSLA), this liquid photopolymer cures under UV light to produce extremely fine details and smooth surfaces. Ideal for miniatures, jewelry, and dental models.',
    pros: ['Ultra-high detail', 'Smooth surface finish', 'Tight tolerances'],
    cons: ['Brittle', 'Requires post-processing', 'Toxic handling needed'],
    temp: 'UV Cured',
    img: 'https://imgs.search.brave.com/zWhNqJoduyTTeJM04WlSsCgydt9h8TdTbUZZIOnY7Ww/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aHBhY2FkZW15LmNv/bS9hc3NldHMvVXBs/b2Fkcy9ibG9nLXBv/c3RzLzZmYTYwMDQ4/NGMvel9NR18zOTY2/X19GaWxsV3pjNE1D/dzBNekJkLmpwZw',
  },
};

// Build a per-material summary from live vendor data
function buildMaterialStats(vendorList: Vendor[]) {
  const stats: Record<string, { vendorCount: number; onlineCount: number; avgPrice: number; vendors: Vendor[] }> = {};

  for (const v of vendorList) {
    for (const m of v.materials) {
      if (!stats[m]) stats[m] = { vendorCount: 0, onlineCount: 0, avgPrice: 0, vendors: [] };
      stats[m].vendorCount++;
      if (v.is_available) stats[m].onlineCount++;
      stats[m].avgPrice += v.price_per_gram;
      stats[m].vendors.push(v);
    }
  }

  // Compute average price
  for (const m of Object.keys(stats)) {
    stats[m].avgPrice = parseFloat((stats[m].avgPrice / stats[m].vendorCount).toFixed(2));
  }

  return stats;
}

const MaterialsPage = () => {
  const [vendorList, setVendorList] = useState<Vendor[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    vendors.list()
      .then((res) => setVendorList(res.vendors))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = buildMaterialStats(vendorList);

  // Show materials that exist in MATERIAL_META, ordered by known list
  const materialOrder = ['PLA', 'ABS', 'PETG', 'TPU', 'Resin'];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '4rem 0 3.5rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
          Printing <span className="gradient-text">Materials Guide</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '580px', margin: '0 auto 2rem' }}>
          Every material has a unique purpose. Vendor availability and pricing shown below are pulled live from our network.
        </p>
        <Link to="/customer" style={{ textDecoration: 'none' }}>
          <button className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            Order a Print <ArrowRight size={18} />
          </button>
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto 1rem' }} />
          Loading live vendor data...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {materialOrder.map((name, i) => {
            const meta    = MATERIAL_META[name];
            const matStat = stats[name]; // may be undefined if no vendor offers it yet

            return (
              <motion.div
                key={name}
                className="glass-panel"
                style={{ overflow: 'hidden', display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '220px' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ boxShadow: `0 16px 40px ${meta.color}22` }}
              >
                {/* Left — image */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img src={meta.img} alt={name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 55%, var(--bg-glass))' }} />
                  <div style={{
                    position: 'absolute', top: '1rem', left: '1rem',
                    background: meta.color, color: 'white',
                    padding: '0.25rem 0.75rem', borderRadius: '20px',
                    fontSize: '0.75rem', fontWeight: 700,
                  }}>
                    {meta.tag}
                  </div>
                </div>

                {/* Right — content */}
                <div style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: meta.color }}>{name}</h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{meta.full}</span>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                    {meta.desc}
                  </p>

                  {/* Live vendor stats from DB */}
                  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem', padding: '0.875rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={16} color={meta.color} />
                      <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Vendors offering</p>
                        <p style={{ fontWeight: 700, fontSize: '1rem' }}>
                          {matStat ? matStat.vendorCount : 0}
                          {matStat && matStat.onlineCount > 0 && (
                            <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600, marginLeft: '0.4rem' }}>
                              ({matStat.onlineCount} online)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div style={{ width: '1px', background: 'var(--border-color)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <DollarSign size={16} color={meta.color} />
                      <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Avg. price/gram</p>
                        <p style={{ fontWeight: 700, fontSize: '1rem' }}>
                          {matStat ? `$${matStat.avgPrice.toFixed(2)}` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    {matStat && (
                      <>
                        <div style={{ width: '1px', background: 'var(--border-color)' }} />
                        <div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Available from</p>
                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {matStat.vendors.slice(0, 3).map((v) => (
                              <span key={v.id} style={{ fontSize: '0.78rem', padding: '0.15rem 0.55rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: v.is_available ? meta.color : 'var(--text-secondary)' }}>
                                {v.shop_name}
                              </span>
                            ))}
                            {matStat.vendors.length > 3 && (
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>+{matStat.vendors.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Pros / Cons / Temp */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'start' }}>
                    <div>
                      <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: meta.color, marginBottom: '0.4rem' }}>✅ Pros</p>
                      {meta.pros.map((p) => (
                        <p key={p} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.15rem' }}>• {p}</p>
                      ))}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#f87171', marginBottom: '0.4rem' }}>⚠️ Cons</p>
                      {meta.cons.map((c) => (
                        <p key={c} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.15rem' }}>• {c}</p>
                      ))}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Print Temp</p>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{meta.temp}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MaterialsPage;
