import express from 'express';
import { User } from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  const me = await User.findByPk(req.user.sub);
  const referrals = await User.findAll({
    where: { referredBy: me.referralCode },
    attributes: ['email', 'createdAt']
  });
  res.json({
    yourCode: me.referralCode,
    bonus:      me.referralBonus,
    referrals:  referrals.map(r => ({ email: r.email, date: r.createdAt })),
  });
});

export default router;
