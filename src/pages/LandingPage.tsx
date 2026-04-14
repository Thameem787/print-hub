import React from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Printer, ArrowRight, Zap, Target, ShieldCheck, Map, CheckCircle, Settings, Box } from 'lucide-react';
import { motion } from 'framer-motion';

const PrintAnimation = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.25 }}>
      <div style={{ position: 'absolute', top: '40%', left: '50%', width: '800px', height: '800px', transform: 'translate(-50%, -50%)', perspective: '1200px' }}>
        <motion.div 
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transform: 'rotateX(65deg)' }}
        >
          {/* Bed Base */}
          <div style={{ position: 'absolute', inset: '10%', border: '2px solid var(--accent-primary)', background: 'rgba(0, 210, 255, 0.05)', boxShadow: '0 0 50px rgba(0, 210, 255, 0.1)' }} />
          <div style={{ position: 'absolute', inset: '10%', border: '1px solid var(--accent-primary)', transform: 'translateZ(-30px)', background: 'rgba(0, 210, 255, 0.02)' }} />
          
          {/* Cylinder Layers */}
          {[...Array(20)].map((_, i) => {
             const start = i / 20;
             const peak = Math.min(start + 0.05, 0.99);
             return (
               <motion.div
                 key={i}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: [0, 0, 1, 1] }}
                 transition={{ duration: 6, times: [0, start, peak, 1], repeat: Infinity, ease: 'linear' }}
                 style={{
                   position: 'absolute',
                   inset: '30%',
                   border: '3px solid var(--accent-secondary)',
                   borderRadius: '50%',
                   transform: `translateZ(${i * 12}px)`,
                   boxShadow: '0 0 15px var(--accent-secondary)'
                 }}
               />
             )
          })}

          {/* Orbiting Extruder Head */}
          <motion.div
            animate={{ rotateZ: [0, 360 * 10], translateZ: [0, 240] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', inset: '30%' }}
          >
            <div style={{ 
              position: 'absolute', 
              top: '-8px', 
              left: '50%', 
              transform: 'translateX(-50%)',
              width: '16px', 
              height: '16px', 
              background: '#fff', 
              borderRadius: '50%',
              boxShadow: '0 0 30px 10px var(--accent-secondary)'
            }} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

const LandingPage = ({ onLogin }: { onLogin?: () => void }) => {
  return (
    <div className="animate-fade-in" style={{ position: 'relative', paddingBottom: '4rem' }}>
      <PrintAnimation />
      
      {/* Hero Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center', padding: '2rem 0 6rem 0', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass-light)', padding: '0.5rem 1rem', borderRadius: '40px', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.9rem', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <Zap size={16} /> Beta Access Now Open
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
            The Future of <br />
            <span className="gradient-text">Local Manufacturing</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: 1.6, maxWidth: '600px' }}>
            Connect with local 3D printing professionals or monetize your own hardware. PrintHub makes bringing your ideas to life faster, cheaper, and strictly local.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#portals" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', textDecoration: 'none' }}>
              Choose a Portal <ArrowRight size={20} />
            </a>
            <a href="#how-it-works" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', textDecoration: 'none' }}>
              How it works
            </a>
          </div>
        </div>
        
        {/* Right side Image / Graphics */}
        <div style={{ position: 'relative' }}>
          {/* Main Image */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-panel"
            style={{ padding: '1rem', borderRadius: '24px', position: 'relative', zIndex: 2 }}
          >
            <video 
              src="/hero-video.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '16px', display: 'block' }} 
            />
          </motion.div>
          {/* Abstract background shapes */}
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'var(--accent-primary)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.2, zIndex: 1 }} />
          <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '250px', height: '250px', background: 'var(--accent-secondary)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.2, zIndex: 1 }} />
          
          {/* Floating badge */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="glass-panel" 
            style={{ position: 'absolute', bottom: '2rem', left: '-2rem', zIndex: 3, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{ width: '40px', height: '40px', background: 'var(--bg-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
               <CheckCircle size={24} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>99.8%</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Print Success Rate</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Portals Section */}
      <div id="portals" style={{ padding: '4rem 0 6rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Choose Your Path</h2>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)' }}>Are you looking to manufacture a part, or are you offering a service?</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', maxWidth: '1000px', width: '100%' }}>
          {/* Customer Portal */}
          <Link to="/customer" style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
            <motion.div 
              className="glass-panel"
              style={{ padding: '3.5rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%', cursor: 'pointer', transition: 'all 0.3s' }}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0, 210, 255, 0.15)', borderColor: 'var(--accent-primary)' }}
            >
              <div style={{ width: '80px', height: '80px', background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent-primary)', border: '1px solid var(--border-color)' }}>
                 <UploadCloud size={36} />
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Order a Print</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.6, flex: 1 }}>
                Upload your 3D models, get instant AI-powered quotes, and have them printed and delivered by local professionals.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '1.1rem' }}>
                Enter Marketplace <ArrowRight size={20} />
              </div>
            </motion.div>
          </Link>

          {/* Vendor Portal */}
          <Link to="/partner" style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
            <motion.div 
              className="glass-panel"
              style={{ padding: '3.5rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%', cursor: 'pointer', transition: 'all 0.3s' }}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0, 210, 255, 0.15)', borderColor: 'var(--accent-secondary)' }}
            >
              <div style={{ width: '80px', height: '80px', background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent-secondary)', border: '1px solid var(--border-color)' }}>
                 <Printer size={36} />
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Become a Partner</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.6, flex: 1 }}>
                Monetize your idle 3D printers. Accept local print jobs, manage your farm, and earn money for every job completed.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)', fontWeight: 600, fontSize: '1.1rem' }}>
                Open Dashboard <ArrowRight size={20} />
              </div>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* How it Works / Value Props */}
      <div id="how-it-works" style={{ padding: '6rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Why Choose PrintHub?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>We bridge the gap between creators and local manufacturers.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '60px', height: '60px', background: 'var(--bg-glass)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', border: '1px solid var(--border-color)' }}>
              <Map size={28} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Hyper-Local Network</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Find a printer down the street. Dramatically reduce shipping times and costs, and pick up your part the same day it finishes printing.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '60px', height: '60px', background: 'var(--bg-glass)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)', border: '1px solid var(--border-color)' }}>
              <Target size={28} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>AI Price Estimation</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Our algorithm automatically scales and calculates volume to give you exact, transparent pricing up front before you commit to a printer.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '60px', height: '60px', background: 'var(--bg-glass)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', border: '1px solid var(--border-color)' }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Quality Guaranteed</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Every partner on our network is vetted and community-reviewed. If your print fails, we immediately re-assign it to another partner at no cost.</p>
          </div>
        </div>
      </div>

      {/* Printing Technologies */}
      <div style={{ padding: '6rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Available Technologies</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Access a wide variety of commercial and industrial 3D printing capabilities.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
          {/* FDM */}
          <motion.div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }} whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0, 210, 255, 0.1)' }}>
            <img src="https://imgs.search.brave.com/cyj_h39x71mBkC0ZS2ayAR5RSQb3b8XAyGkCiPZ9634/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c292b2wzZC5jb20v/Y2RuL3Nob3AvYXJ0/aWNsZXMvYWU0ZTlj/ZGI3ZmM0NGQzZDg5/NGM4NjhmZTQyZWVk/NDkuanBnP3Y9MTc1/MTUzMzEzNiZ3aWR0/aD0xNTAw" alt="FDM Printer" style={{ width: '100%', height: '220px', objectFit: 'cover', borderBottom: '1px solid var(--border-color)' }} />
            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>FDM (Filament)</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', minHeight: '80px' }}>The most popular and cost-effective method. Best for rapid prototyping, robust parts, and large-scale projects using PLA, ABS, and PETG.</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: 'var(--bg-primary)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>Affordable</span>
                <span style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: 'var(--bg-primary)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>Durable</span>
              </div>
            </div>
          </motion.div>

          {/* SLA */}
          <motion.div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }} whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0, 210, 255, 0.1)' }}>
            <img src="https://imgs.search.brave.com/zWhNqJoduyTTeJM04WlSsCgydt9h8TdTbUZZIOnY7Ww/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aHBhY2FkZW15LmNv/bS9hc3NldHMvVXBs/b2Fkcy9ibG9nLXBv/c3RzLzZmYTYwMDQ4/NGMvel9NR18zOTY2/X19GaWxsV3pjNE1D/dzBNekJkLmpwZw" alt="SLA Resin Printer" style={{ width: '100%', height: '220px', objectFit: 'cover', borderBottom: '1px solid var(--border-color)' }} />
            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>SLA (Resin)</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', minHeight: '80px' }}>High-resolution stereolithography printing. Perfect for highly detailed miniatures, jewelry, and exact-fit mechanical prototypes.</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: 'var(--bg-primary)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>High Detail</span>
                <span style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: 'var(--bg-primary)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>Smooth Surface</span>
              </div>
            </div>
          </motion.div>

          {/* SLS */}
          <motion.div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }} whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0, 210, 255, 0.1)' }}>
            <img src="https://imgs.search.brave.com/dVONAbhnPtMKDu_yQggymbs8mTYeQRsJLGIIG4Dbbbw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/M2RzLmNvbS9hc3Nl/dHMvaW52ZXN0L3N0/eWxlcy9iYW5uZXIv/cHVibGljLzIwMjIt/MDQvcG93ZGVyLWJl/ZC1mdXNpb24tMy0x/LmpwZy53ZWJwP2l0/b2s9cGhWNnpFSHU" alt="SLS Industrial Printer" style={{ width: '100%', height: '220px', objectFit: 'cover', borderBottom: '1px solid var(--border-color)' }} />
            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>SLS (Powder)</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', minHeight: '80px' }}>Industrial-grade selective laser sintering. Creates extremely durable, complex functional parts requiring no support structures.</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: 'var(--bg-primary)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>Industrial</span>
                <span style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: 'var(--bg-primary)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>No Supports</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Printer Mechanics Section */}
      <div style={{ padding: '6rem 0', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Printer Mechanics Supported</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Our network utilizes advanced kinematics to ensure fast delivery and precise tolerances.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
          <motion.div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-primary)' }} whileHover={{ y: -5, borderColor: 'var(--accent-primary)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Settings size={22} color="var(--accent-primary)" /> Cartesian (Moving Bed)
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>The industry standard architecture. Highly reliable, extremely accurate, and heavily proven for standard dimensional part printing at high quality.</p>
          </motion.div>

          <motion.div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-primary)' }} whileHover={{ y: -5, borderColor: 'var(--accent-secondary)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Target size={22} color="var(--accent-secondary)" /> CoreXY System
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Advanced belt kinematics and stationary beds. Enables extremely fast rapid print speeds and perfect layer lines for tall vertical components.</p>
          </motion.div>

          <motion.div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-primary)' }} whileHover={{ y: -5, borderColor: 'var(--success)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Zap size={22} color="var(--success)" /> Delta Kinematics
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Three-arm robotic kinematics. Offers unparalleled speed and smooth circular motions, ideal for cylindrical objects, vases, and rapidly producing parts.</p>
          </motion.div>
        </div>
      </div>

      {/* Footer Section */}
      <footer style={{ borderTop: '1px solid var(--border-color)', paddingTop: '4rem', marginTop: '4rem', paddingBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', marginBottom: '3rem' }}>
          
          {/* Brand & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Box className="gradient-text" style={{ width: '28px', height: '28px', color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Print<span className="gradient-text">Hub</span></h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '300px' }}>
              The premium decentralized network for high-quality, local 3D manufacturing. Empowering creators and partners worldwide.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg></a>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg></a>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Platform</h4>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Order a Print</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Become a Partner</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Pricing</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Materials</a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Resources</h4>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Help Center</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Design Guidelines</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>API Documentation</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Blog</a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Company</h4>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>About Us</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Careers</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Terms of Service</a>
          </div>
        </div>

        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem', margin: '0 2rem' }}>
          &copy; {new Date().getFullYear()} PrintHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
