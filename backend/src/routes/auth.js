// backend/src/routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { User } from '../models/User.js';
import { AdminLog } from '../models/AdminLog.js';
import authMiddleware from '../middleware/auth.js';
import { sendEmail } from '../utils/email.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
const REFERRAL_BONUS = parseFloat(process.env.REFERRAL_BONUS_AMOUNT || '500');

/**
 * POST /api/auth/signup
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, referredBy: usedCode } = req.body;

    // 1. Prevent duplicate emails
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // 2. Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 3. Generate a unique referralCode for this new user
    const referralCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    // 4. Handle incoming referral code (if any)
    let referredBy = null;
    if (usedCode) {
      const inviter = await User.findOne({ where: { referralCode: usedCode } });
      if (inviter) {
        referredBy = inviter.referralCode;
        inviter.referralBonus += REFERRAL_BONUS;
        await inviter.save();
      }
    }

      // 5. Determine if the email is the admin's
    const isAdminEmail = email === 'startnetnexus@gmail.com';

    // 6. Create the user record
    const user = await User.create({
      fullName:          req.body.fullName,
      address:           req.body.address,
      state:             req.body.state,
      zip:               req.body.zip,
      homePhone:         req.body.homePhone,
      cellPhone:         req.body.cellPhone,
      email,
      password,
      verified:          isAdminEmail ? true : false, // ✅ auto-verify admin
      verificationToken: isAdminEmail ? null :
        verificationToken, // only set if not admin 
      isAdmin:           isAdminEmail, // ✅ auto-set admin flag
      referralCode,
      referredBy,
    });
    // 7. Send verification email
    const verifyUrl = `${FRONTEND_URL}/#/verify-email?token=${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`,
    });

    return res
      .status(201)
      .json({ message: 'User created. Please check your email to verify your account.' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/auth/verify-email?token=...
 */
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).send('Invalid or expired token.');
    }
    user.verified = true;
    user.verificationToken = null;
    await user.save();
    return res.redirect(`${FRONTEND_URL}/?verified=1`);
  } catch (err) {
    console.error('Email verification error:', err);
    return res.status(500).send('Server error during email verification.');
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // temporarily disabled:
    // if (!user.verified) {
    //   return res.status(403).json({ error: 'Please verify your email first.' });
    // }
    await AdminLog.create({ userEmail: email, ip: req.ip });
    const token = jwt.sign({ sub: user.id, email }, JWT_SECRET, { expiresIn: '1h' });
    
    return res.json({
      token,
      user: {
        email: user.email,
        fullName: user.fullName,
        isAdmin: user.isAdmin, // 👈 Add this
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST /api/auth/forgot-password
 */
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(200).json({ message: 'If the email exists, a reset link will be sent.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${FRONTEND_URL}/#/reset-password?token=${resetToken}`;
    await sendEmail({
      to: email,
      subject: 'Reset Your Password',
      html: `<p>
      We received a request to reset your password for your account with [StartNetNexus]. If you didn't make this request, please ignore this email. Otherwise, you can reset your password using the link below:</p>
<p>

*Reset Password Link*
Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>
<p>

This link will take you to a page where you can enter a new password. Please make sure to choose a strong and unique password to secure your account.
</p>
<p>
If you're having trouble clicking the link, you can copy and paste the following URL into your browser: [Insert Password Reset Link URL]</p>
<p>
Best regards,
[StartNetNexus] Team
</p>`,
    });

    return res.status(200).json({ message: 'If the email exists, a reset link will be sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST /api/auth/reset-password
 */
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      where: {
        resetToken:        token,
        resetTokenExpiry:  { [Op.gt]: Date.now() },
      },
    });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    user.password = newPassword; // password hash handled by model hook
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    return res.json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
