// backend/src/routes/admin.js
import express from 'express';
import { Op } from 'sequelize';
import { User } from '../models/User.js';
import { AdminLog } from '../models/AdminLog.js';
import { Payment } from '../models/Payment.js';
import { Transaction } from '../models/Transaction.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

/* ---------------- PUBLIC ROUTES (no login required) ---------------- */

// 🌍 PUBLIC: GET /api/admin/profit - anyone can see this
router.get('/profit', async (req, res) => {
  try {
    const [deposits, withdrawals, referrals] = await Promise.all([
      Transaction.sum('amount', { where: { type: 'deposit' } }),
      Transaction.sum('amount', { where: { type: 'withdrawal' } }),
      Transaction.sum('amount', { where: { type: 'referral' } }),
    ]);

    const netProfit = (deposits || 0) - ((withdrawals || 0) + (referrals || 0));

    res.json({
      totalDeposits: deposits || 0,
      totalWithdrawals: withdrawals || 0,
      totalReferrals: referrals || 0,
      netProfit,
    });
  } catch (err) {
    console.error('Error in profit route:', err);
    res.status(500).json({ error: 'Failed to load total profit' });
  }
});

// 🌍 PUBLIC: GET /api/admin/payments - view latest payment history
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.findAll({
      order: [['time', 'DESC']],
      limit: 50,
    });
    res.json(payments);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ error: 'Failed to load payments' });
  }
});

// 🌍 PUBLIC: GET /api/admin/total-profit - sum of all user balances and bonuses
router.get('/total-profit', async (req, res) => {
  try {
    const users = await User.findAll();
    let total = 0;
    users.forEach(u => {
      total += u.balance || 0;
      total += u.referralBonus || 0;
    });
    res.json({ total });
  } catch (err) {
    console.error('Error calculating total profit:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* ---------------- ADMIN-ONLY ROUTES ---------------- */

// 🔒 All routes below require login
router.use(authMiddleware);

// 🔐 Check if logged-in user is an admin
router.use(async (req, res, next) => {
  const user = await User.findByPk(req.user.sub);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
});

// 👥 View all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// 🗑 Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// 🚫 Disable a user
router.put('/users/:id/disable', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.disabled = true;
    await user.save();
    res.json({ message: 'User disabled' });
  } catch (err) {
    console.error('Error disabling user:', err);
    res.status(500).json({ error: 'Failed to disable user' });
  }
});

// 🔼 Promote user to admin
router.put('/users/:id/admin', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.isAdmin = true;
    await user.save();
    res.json({ message: 'User promoted to admin' });
  } catch (err) {
    console.error('Error promoting user:', err);
    res.status(500).json({ error: 'Failed to promote user' });
  }
});

// 🧾 View login logs
router.get('/logins', async (req, res) => {
  try {
    const logs = await AdminLog.findAll({
      order: [['time', 'DESC']],
      limit: 50,
    });
    res.json(logs);
  } catch (err) {
    console.error('Error fetching login logs:', err);
    res.status(500).json({ error: 'Failed to load login logs' });
  }
});

// 🤝 View referral history
router.get('/referrals', async (req, res) => {
  try {
    const referrals = await User.findAll({
      where: { referredBy: { [Op.not]: null } },
      order: [['createdAt', 'DESC']],
    });
    res.json(referrals);
  } catch (err) {
    console.error('Error fetching referrals:', err);
    res.status(500).json({ error: 'Failed to load referral data' });
  }
});

// 💰 Update user balance
router.put('/users/:id/balance', async (req, res) => {
  try {
    const { balance } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.balance = balance;
    await user.save();
    res.json({ message: 'Balance updated' });
  } catch (err) {
    console.error('Error updating balance:', err);
    res.status(500).json({ error: 'Failed to update balance' });
  }
});

// GET /api/admin/connected-users
router.get('/connected-users', async (req, res) => {
  try {
    const onlineUsers = global.onlineUsers || []; // assume you store emails of online users globally
    res.json(onlineUsers);
  } catch (err) {
    console.error('Error fetching online users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
