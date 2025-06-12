import express from 'express';
import { AdminLog } from '../models/AdminLog.js';
import { Payment }  from '../models/Payment.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Protect all admin routes
router.use(authMiddleware);

// GET /api/admin/logins
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

// GET /api/admin/payments
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.findAll({
      order: [['time', 'DESC']],
      limit: 50,
    });
    res.json(payments);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ error: 'Failed to load payment history' });
  }
});
export default router;
