import express from 'express';
import { User, Vendor, Order } from '../db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
router.get('/stats', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const [totalUsers, totalVendors, totalOrders, completedOrders] = await Promise.all([
      User.countDocuments(),
      Vendor.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 'delivered' }),
    ]);

    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$total_cost' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({ totalUsers, totalVendors, totalOrders, completedOrders, totalRevenue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
router.get('/users', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
