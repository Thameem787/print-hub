import express from 'express';
import { Vendor, Order, User } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { calculateCost } from '../utils/cost.js';

const router = express.Router();

// ─── GET /api/vendors  — list all available vendors ───────────────────────────
router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.material) query.materials = req.query.material;
    if (req.query.available === 'true') query.is_available = true;

    const vendorList = await Vendor.find(query).populate('user_id', 'name email');
    const result = vendorList.map((v) => ({
      id:             v._id,
      shop_name:      v.shop_name,
      description:    v.description,
      city:           v.city,
      address:        v.address,
      materials:      v.materials,
      colors:         v.colors,
      price_per_gram: v.price_per_gram,
      is_available:   v.is_available ? 1 : 0,
    }));
    res.json({ vendors: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/vendors  — vendor onboarding ───────────────────────────────────
router.post('/', authenticate, requireRole('vendor'), async (req, res) => {
  try {
    const { shop_name, description, address, city, materials, colors, price_per_gram } = req.body;
    if (!shop_name || !address || !city) return res.status(400).json({ error: 'shop_name, address and city are required.' });

    const exists = await Vendor.findOne({ user_id: req.user.id });
    if (exists) return res.status(409).json({ error: 'Vendor profile already exists.' });

    const vendor = await Vendor.create({
      user_id:        req.user.id,
      shop_name,
      description:    description || '',
      address,
      city,
      materials:      Array.isArray(materials) ? materials : [],
      colors:         Array.isArray(colors) ? colors : [],
      price_per_gram: parseFloat(price_per_gram) || 0.5,
      is_available:   true,
    });

    res.status(201).json({ vendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/vendors/me  — vendor's own profile ──────────────────────────────
router.get('/me', authenticate, requireRole('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user_id: req.user.id });
    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found.' });
    res.json({ vendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/vendors/me/orders  — orders assigned to this vendor ─────────────
router.get('/me/orders', authenticate, requireRole('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user_id: req.user.id });
    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found.' });

    const orderList = await Order.find({ vendor_id: vendor._id })
      .populate('customer_id', 'name email')
      .sort({ createdAt: -1 });

    const result = orderList.map((o) => ({
      id:            o._id,
      file_name:     o.file_name,
      material:      o.material,
      color:         o.color,
      quantity:      o.quantity,
      delivery_type: o.delivery_type,
      total_cost:    o.total_cost,
      status:        o.status,
      customer_name: o.customer_id?.name,
      created_at:    o.createdAt,
    }));

    res.json({ orders: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PATCH /api/vendors/me/availability  — toggle online/offline ─────────────
router.patch('/me/availability', authenticate, requireRole('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user_id: req.user.id });
    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found.' });

    vendor.is_available = !vendor.is_available;
    await vendor.save();

    res.json({ is_available: vendor.is_available });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
