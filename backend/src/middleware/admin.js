import { User } from '../models/User.js';

export default async function adminOnly(req, res, next) {
  try {
    const user = await User.findByPk(req.user.sub);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access only' });
    }
    next();
  } catch (err) {
    console.error('Admin check failed:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
