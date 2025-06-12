import express from 'express';
import { Payment } from '../models/Payment.js';
import { AdminLog } from '../models/AdminLog.js'; // if you also want logs here

 const router = express.Router();


// GET /api/history/deposits
router.get('/deposits', async (req, res) => {
  try {
    const deposits = await Payment.findAll({
      where: { method: 'crypto' },       // or remove to get all
      order: [['time', 'DESC']],
    });
    res.json(deposits);
  } catch (err) {
    console.error('Error fetching deposits:', err);
    res.status(500).json({ error: 'Failed to load deposits' });
  }
});


// GET /api/history/withdrawals
router.get('/withdrawals', async (req, res) => {
  try {
    const withdrawals = await Payment.findAll({
      where: { method: 'withdraw' },     // adjust your method name
      order: [['time', 'DESC']],
    });
    res.json(withdrawals);
  } catch (err) {
    console.error('Error fetching withdrawals:', err);
    res.status(500).json({ error: 'Failed to load withdrawals' });
  }
});

export default router;
