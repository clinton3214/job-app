import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AdminLog } from '../models/AdminLog.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * POST /api/auth/signup
 */
router.post('/signup', async (req, res) => {
  try {
     // Check if email already exists
    const existing = await User.findOne({ where: { email: req.body.email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const user = await User.create(req.body);



    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Log the login
    await AdminLog.create({ userEmail: email, ip: req.ip });

    // Issue token
    const token = jwt.sign({ sub: user._id, email }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
