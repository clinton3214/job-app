// backend/src/routes/withdraw.js
import express from 'express';
import { Withdrawal } from '../models/Withdrawal.js';
import { User } from '../models/User.js'; // ✅ Add this line
import { Transaction } from '../models/Transaction.js'; // ✅ Add this
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// POST /api/withdraw/ – request a new withdrawal
router.post('/', async (req, res) => {
  try {
    const userId = req.user.sub;
    const { amount, method } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    if (!['crypto', 'card', 'cashapp'].includes(method)) {
      return res.status(400).json({ error: 'Invalid method' });
    }

    // ✅ Get user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ Check balance
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // ✅ Deduct balance
    user.balance -= amount;
    await user.save();

    // ✅ Create withdrawal
    const wd = await Withdrawal.create({ userId, amount, method, status: 'pending', time: new Date() });

    // ✅ Also log it as a transaction
        await Transaction.create({
          userId,
          amount,
          type: 'withdrawal',
          time: new Date(),
        });

    return res.status(201).json(wd);
  } catch (err) {
    console.error('Withdrawal error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/withdraw/ – get current user’s withdrawal history
router.get('/', async (req, res) => {
  try {
    const userId = req.user.sub;
    const list = await Withdrawal.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    return res.json(list);
  } catch (err) {
    console.error('Withdraw fetch error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
