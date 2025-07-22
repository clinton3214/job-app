// backend/src/routes/user.js
import express from 'express';
import auth from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js'; // ✅ Needed for profit summary

const router = express.Router();

// 🔒 Secure all routes below with auth middleware
router.use(auth);

// 📄 Return basic user info (used by dashboard)
router.get('/me', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user.id,
      name: user.fullName || 'N/A',
      email: user.email || 'N/A',
      balance: user.balance || 0,
      referralBonus: user.referralBonus || 0,
    });
  } catch (err) {
    console.error('User fetch error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// 📄 Return detailed profile info
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const profile = {
      fullName: user.fullName || 'N/A',
      address: user.address || 'N/A',
      state: user.state || 'N/A',
      zip: user.zip || 'N/A',
      homePhone: user.homePhone || 'N/A',
      cellPhone: user.cellPhone || 'N/A',
      email: user.email,
      referralBonus: `₦${user.referralBonus || 0}`,
      balance: `₦${user.balance || 0}`,
    };

    res.json(profile);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 📝 Update user profile
router.put('/profile', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const fields = ['fullName', 'email', 'address', 'state', 'zip', 'homePhone', 'cellPhone'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
      fullName: user.fullName,
      email: user.email,
      address: user.address,
      state: user.state,
      zip: user.zip,
      homePhone: user.homePhone,
      cellPhone: user.cellPhone,
      balance: user.balance || 0,
      referralBonus: user.referralBonus || 0,
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 💰 Get current user's balance (alt route)
router.get('/balance', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ balance: user.balance || 0 });
  } catch (err) {
    console.error('Balance fetch error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// 🔗 Return referral info
router.get('/referrals', async (req, res) => {
  try {
    const me = await User.findByPk(req.user.sub);
    if (!me) return res.status(404).json({ error: 'User not found' });

    const referredUsers = await User.findAll({
      where: { referredBy: me.referralCode },
      attributes: ['email', 'createdAt']
    });

    const referralList = referredUsers.map(u => ({
      email: u.email,
      date: u.createdAt,
      bonus: '₦1,000' // Placeholder bonus logic
    }));

    res.json({
      code: me.referralCode,
      totalBonus: `₦${me.referralBonus || 0}`,
      referrals: referralList
    });
  } catch (err) {
    console.error('Referral fetch error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ✅ 🆕 Public Total Profit route (user-safe, non-admin)
router.get('/total-profit', async (req, res) => {
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
    console.error('Public total-profit fetch error:', err);
    res.status(500).json({ error: 'Failed to load total profit' });
  }
});

export default router;
