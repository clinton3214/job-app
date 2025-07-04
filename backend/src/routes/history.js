import express from 'express';
import { Payment } from '../models/Payment.js';
import { User } from '../models/User.js'; // ✅ Needed for balance
import { AdminLog } from '../models/AdminLog.js'; // Optional: useful for logging admin actions
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// ✅ Protect all routes below
router.use(authMiddleware);

// ✅ View Deposit History (only for this user)
router.get('/deposits', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const deposits = await Payment.findAll({
      where: {
        method: 'crypto',
        userEmail: user.email, // ✅ Show only the current user's deposits
      },
      order: [['time', 'DESC']],
    });
    res.json(deposits);
  } catch (err) {
    console.error('Error fetching deposits:', err);
    res.status(500).json({ error: 'Failed to load deposits' });
  }
});

// ✅ View Withdrawal History (only for this user)
router.get('/withdrawals', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const withdrawals = await Payment.findAll({
      where: {
        method: 'withdraw',
        userEmail: user.email, // ✅ Show only the current user's withdrawals
      },
      order: [['time', 'DESC']],
    });
    res.json(withdrawals);
  } catch (err) {
    console.error('Error fetching withdrawals:', err);
    res.status(500).json({ error: 'Failed to load withdrawals' });
  }
});

// ✅ DEPOSIT funds and update balance
router.post('/deposit', async (req, res) => {
  try {
    const { amount, method } = req.body;
    const user = await User.findByPk(req.user.sub);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Save deposit record
    await Payment.create({
      userEmail: user.email,
      amount,
      method,
      status: 'successful', // Or 'pending' if you want to approve manually
      time: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Update user balance
    user.balance += parseFloat(amount);
    await user.save();

    res.json({ message: 'Deposit successful and balance updated' });
  } catch (err) {
    console.error('Error in deposit route:', err);
    res.status(500).json({ error: 'Deposit failed' });
  }
});

// ✅ WITHDRAW funds and update balance
router.post('/withdraw', async (req, res) => {
  try {
    const { amount, method } = req.body;
    const user = await User.findByPk(req.user.sub);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const floatAmount = parseFloat(amount);

    if (user.balance < floatAmount) {
      return res.status(400).json({ error: 'Not enough balance' });
    }

    // Save withdrawal record
    await Payment.create({
      userEmail: user.email,
      amount,
      method,
      status: 'pending', // Admin can later mark this successful
      time: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Subtract from balance
    user.balance -= floatAmount;
    await user.save();

    res.json({ message: 'Withdrawal request submitted and balance updated' });
  } catch (err) {
    console.error('Error in withdraw route:', err);
    res.status(500).json({ error: 'Withdrawal failed' });
  }
});

// ✅ Get current user balance
router.get('/balance', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ balance: user.balance });
  } catch (err) {
    console.error('Error fetching balance:', err);
    res.status(500).json({ error: 'Could not load balance' });
  }
});

export default router;
