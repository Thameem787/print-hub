import express from 'express';
import { Order, Vendor } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { calculateCost } from '../utils/cost.js';

const router = express.Router();

// ─── POST /api/orders/estimate  — get cost without placing order ──────────────
router.post('/estimate', async (req, res) => {
  try {
    const { vendor_id, material, estimated_grams, quantity, delivery_type } = req.body;
    const vendor = await Vendor.findById(vendor_id);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found.' });

    const estimate = calculateCost({
      material:       material || 'PLA',
      estimatedGrams: parseFloat(estimated_grams) || 50,
      quantity:       parseInt(quantity) || 1,
      deliveryType:   delivery_type || 'pickup',
      pricePerGram:   vendor.price_per_gram,
    });

    res.json({ estimate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/orders  — place a new order ────────────────────────────────────
router.post('/', authenticate, requireRole('customer'), async (req, res) => {
  try {
    const {
      vendor_id, file_name, file_size_mb = 0,
      material = 'PLA', color = 'White',
      quantity = 1, estimated_grams = 50,
      delivery_type = 'pickup', delivery_address = '',
    } = req.body;

    if (!vendor_id || !file_name) return res.status(400).json({ error: 'vendor_id and file_name are required.' });

    const vendor = await Vendor.findById(vendor_id);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found.' });
    if (!vendor.is_available) return res.status(400).json({ error: 'Vendor is currently unavailable.' });

    const { materialCost, printCost, deliveryCost, totalCost } = calculateCost({
      material,
      estimatedGrams: parseFloat(estimated_grams),
      quantity:       parseInt(quantity),
      deliveryType:   delivery_type,
      pricePerGram:   vendor.price_per_gram,
    });

    const order = await Order.create({
      customer_id:     req.user.id,
      vendor_id:       vendor._id,
      file_name,
      file_size_mb:    parseFloat(file_size_mb),
      material,
      color,
      quantity:        parseInt(quantity),
      estimated_grams: parseFloat(estimated_grams),
      delivery_type,
      delivery_address,
      material_cost:   materialCost,
      print_cost:      printCost,
      delivery_cost:   deliveryCost,
      total_cost:      totalCost,
    });

    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/orders  — customer's own orders ─────────────────────────────────
router.get('/', authenticate, requireRole('customer'), async (req, res) => {
  try {
    const orderList = await Order.find({ customer_id: req.user.id })
      .populate('vendor_id', 'shop_name city')
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
      shop_name:     o.vendor_id?.shop_name,
      created_at:    o.createdAt,
    }));

    res.json({ orders: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PATCH /api/orders/:id/status  — vendor updates order status ──────────────
router.patch('/:id/status', authenticate, requireRole('vendor'), async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['accepted', 'printing', 'ready', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status.' });

    const vendor = await Vendor.findOne({ user_id: req.user.id });
    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found.' });

    const order = await Order.findOne({ _id: req.params.id, vendor_id: vendor._id });
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    order.status = status;
    await order.save();

    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/orders/:id  — customer cancels order ────────────────────────
router.delete('/:id', authenticate, requireRole('customer'), async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, customer_id: req.user.id });
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    if (!['pending'].includes(order.status)) return res.status(400).json({ error: 'Only pending orders can be cancelled.' });

    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Order cancelled.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
