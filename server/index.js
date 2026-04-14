import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './db.js';

// Routes
import authRoutes   from './routes/auth.js';
import vendorRoutes from './routes/vendors.js';
import orderRoutes  from './routes/orders.js';
import adminRoutes  from './routes/admin.js';

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Global Middleware ────────────────────────────────────────────────────────

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use('/api/auth',    authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/orders',  orderRoutes);
app.use('/api/admin',   adminRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀  PrintHub API running at http://localhost:${PORT}`);
    console.log(`   Health check → http://localhost:${PORT}/api/health\n`);
  });
});
