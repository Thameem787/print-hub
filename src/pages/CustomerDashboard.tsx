import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Box, Settings, MapPin, Truck, CreditCard, Loader2, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { orders, vendors, Vendor, Order, User } from '../api';

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero = () => (
  <div style={{ textAlign: 'center', padding: '5rem 0 3rem 0' }} className="animate-fade-in">
    <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
      The Global <span className="gradient-text">3D Printing</span> Marketplace
    </h1>
    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
      Upload your 3D models, get instant pricing, and connect with local printing professionals who bring your ideas to life.
    </p>
  </div>
);

// ─── Upload Section ───────────────────────────────────────────────────────────

const UploadSection = ({ user, onLogin }: { user: User | null; onLogin: () => void }) => {
  const [file, setFile]                   = useState<File | null>(null);
  const [material, setMaterial]           = useState('PLA');
  const [color, setColor]                 = useState('White');
  const [quantity, setQuantity]           = useState(1);
  const [deliveryType, setDeliveryType]   = useState<'pickup' | 'delivery'>('pickup');
  const [estimatedGrams, setEstimatedGrams] = useState(50);
  const [vendorList, setVendorList]       = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [estimate, setEstimate]           = useState<{ materialCost: number; printCost: number; deliveryCost: number; totalCost: number } | null>(null);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [isSuccess, setIsSuccess]         = useState(false);
  const [error, setError]                 = useState('');
  const [myOrders, setMyOrders]           = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load vendors & my orders when user logs in
  useEffect(() => {
    vendors.list().then((res) => {
      setVendorList(res.vendors);
      if (res.vendors.length > 0) setSelectedVendor(res.vendors[0]);
    }).catch(() => {});

    if (user) {
      setLoadingOrders(true);
      orders.list().then((res) => setMyOrders(res.orders)).finally(() => setLoadingOrders(false));
    }
  }, [user]);

  // Fetch live estimate whenever relevant fields change
  useEffect(() => {
    if (!selectedVendor) return;
    orders.estimate({
      vendor_id: selectedVendor.id,
      material,
      estimated_grams: estimatedGrams,
      quantity,
      delivery_type: deliveryType,
    }).then((res) => setEstimate(res.estimate)).catch(() => {});
  }, [selectedVendor, material, estimatedGrams, quantity, deliveryType]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    if (!user) { onLogin(); return; }
    if (!selectedVendor) { setError('Please select a vendor.'); return; }

    setIsSubmitting(true);
    setError('');

    try {
      await orders.create({
        vendor_id: selectedVendor.id,
        file_name: file.name,
        file_size_mb: parseFloat((file.size / 1024 / 1024).toFixed(2)),
        material,
        color,
        quantity,
        estimated_grams: estimatedGrams,
        delivery_type: deliveryType,
      });

      setIsSuccess(true);
      // Refresh order list
      const res = await orders.list();
      setMyOrders(res.orders);

      setTimeout(() => {
        setIsSuccess(false);
        setFile(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusColor: Record<string, string> = {
    pending:   'var(--warning)',
    accepted:  'var(--accent-primary)',
    printing:  'var(--accent-secondary)',
    ready:     'var(--success)',
    delivered: 'var(--success)',
    cancelled: '#f87171',
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".stl,.obj"
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />

        {/* Left: 3D Preview / Drop zone */}
        <motion.div className="glass-panel"
          style={{ padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '400px', position: 'relative', overflow: 'hidden' }}
          whileHover={{ boxShadow: '0 8px 30px rgba(0, 210, 255, 0.15)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>3D Model Preview</h3>
            <span style={{ background: 'var(--bg-tertiary)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem' }}>
              {file ? file.name : 'No file selected'}
            </span>
          </div>

          {file ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0, 210, 255, 0.1) 0%, transparent 70%)' }} />
              <motion.div animate={{ rotateY: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} style={{ zIndex: 1, transformStyle: 'preserve-3d' }}>
                <Box size={140} color="var(--accent-primary)" style={{ opacity: 0.8 }} />
              </motion.div>
              <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', zIndex: 2 }}>
                <span>File: {(file.size / 1024 / 1024).toFixed(2)} MB</span>
                <span>Est: ~{estimatedGrams}g</span>
              </div>
            </div>
          ) : (
            <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              style={{ flex: 1, border: '2px dashed var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
            >
              <div style={{ width: '64px', height: '64px', background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UploadCloud size={32} color="var(--accent-primary)" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Drag & Drop your STL/OBJ file</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>or click to browse from computer</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Right: Config & Pricing */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} color="var(--accent-primary)" /> Job Configuration
          </h3>

          {/* Vendor selector */}
          <div className="form-group">
            <label className="form-label">Select Vendor</label>
            <select className="form-control" value={selectedVendor?.id ?? ''} onChange={(e) => {
              const v = vendorList.find((x) => String(x.id) === String(e.target.value));
              setSelectedVendor(v || null);
            }}>
              {vendorList.length === 0 && <option value="">No vendors available</option>}
              {vendorList.map((v) => (
                <option key={String(v.id)} value={String(v.id)}>
                  {v.shop_name} — {v.city} (${v.price_per_gram}/g)
                </option>
              ))}
            </select>
          </div>

          {/* Material */}
          <div className="form-group">
            <label className="form-label">Material</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              {['PLA', 'ABS', 'Resin'].map((mat) => (
                <button key={mat} className="btn btn-secondary"
                  style={{ background: material === mat ? 'var(--bg-glass-light)' : 'var(--bg-tertiary)', borderColor: material === mat ? 'var(--accent-primary)' : 'var(--border-color)', color: material === mat ? 'white' : 'var(--text-secondary)' }}
                  onClick={() => setMaterial(mat)}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Grams & Quantity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-group">
            <div>
              <label className="form-label">Est. Grams</label>
              <input className="form-control" type="number" min={1} value={estimatedGrams}
                onChange={(e) => setEstimatedGrams(Number(e.target.value))} />
            </div>
            <div>
              <label className="form-label">Quantity</label>
              <input className="form-control" type="number" min={1} max={100} value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))} />
            </div>
          </div>

          {/* Delivery */}
          <div className="form-group">
            <label className="form-label">Delivery</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {(['pickup', 'delivery'] as const).map((d) => (
                <button key={d} className="btn btn-secondary"
                  style={{ borderColor: deliveryType === d ? 'var(--accent-primary)' : 'var(--border-color)', background: deliveryType === d ? 'var(--bg-glass-light)' : 'var(--bg-tertiary)', color: deliveryType === d ? 'white' : 'var(--text-secondary)' }}
                  onClick={() => setDeliveryType(d)}
                >
                  {d === 'pickup' ? '🏪 Pickup' : '🚚 Delivery'}
                </button>
              ))}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            {estimate ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span>Material Cost</span><span>${estimate.materialCost.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span>Print Cost</span><span>${estimate.printCost.toFixed(2)}</span>
                </div>
                {estimate.deliveryCost > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span>Delivery</span><span>${estimate.deliveryCost.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Estimated Total</span>
                  <span className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800 }}>${estimate.totalCost.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Select a vendor to see pricing...
              </div>
            )}

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.75rem', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button
              className={`btn ${isSuccess ? '' : 'btn-primary'}`}
              style={{ width: '100%', padding: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: isSuccess ? 'var(--success)' : undefined }}
              disabled={!file || isSubmitting || isSuccess}
              onClick={handleSubmit}
            >
              {isSubmitting && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
              {!user && <Lock size={16} />}
              {isSuccess ? <><CheckCircle size={18} /> Order Placed!</> : isSubmitting ? 'Submitting...' : user ? 'Place Order' : 'Log In to Order'}
            </button>
          </div>
        </div>
      </div>

      {/* My Orders */}
      {user && (
        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            📦 My Orders
          </h3>
          {loadingOrders ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : myOrders.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No orders yet. Upload a file and place your first order!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myOrders.map((order) => (
                <div key={order.id} className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: '0.3rem' }}>{order.file_name}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {order.material} • {order.quantity}× • {order.delivery_type}
                      {order.shop_name && ` • ${order.shop_name}`}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.3rem' }}>${order.total_cost.toFixed(2)}</p>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: statusColor[order.status] || 'var(--text-secondary)' }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Features ─────────────────────────────────────────────────────────────────

const Features = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginTop: '6rem', paddingBottom: '4rem' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '60px', height: '60px', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <MapPin size={28} color="var(--accent-primary)" />
      </div>
      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Local Partners</h4>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>Our algorithm finds the nearest available vendors to reduce delivery time and costs.</p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '60px', height: '60px', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <CreditCard size={28} color="var(--success)" />
      </div>
      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Transparent Pricing</h4>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>Real-time pricing from the backend based on material, weight, and vendor rate.</p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '60px', height: '60px', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <Truck size={28} color="var(--accent-secondary)" />
      </div>
      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Flexible Delivery</h4>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>Choose between fast store pickup or convenient doorstep delivery from the printing shop.</p>
    </div>
  </div>
);

// ─── CustomerDashboard ────────────────────────────────────────────────────────

const CustomerDashboard = ({ user, onLogin }: { user: User | null; onLogin: () => void }) => (
  <>
    <Hero />
    <UploadSection user={user} onLogin={onLogin} />
    <Features />
  </>
);

export default CustomerDashboard;
