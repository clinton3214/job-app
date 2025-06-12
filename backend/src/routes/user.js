import express from 'express';
const router = express.Router();

// Existing mockProfile...
const mockProfile = {
  fullName: 'John Doe',
  address: '123 Main St, Lagos',
  state: 'Lagos',
  zip: '100001',
  homePhone: '+234 1 234 5678 (9am–5pm)',
  cellPhone: '+234 80 1234 5678 (Anytime)',
  email: 'john.doe@example.com',
  referralBonus: '₦3,500',
  balance: '₦25,000',
};

// NEW: Mock referral data
const mockReferrals = {
  code: 'REF-ABC123',
  totalBonus: '₦3,500',
  referrals: [
    { email: 'friend1@example.com', date: '2025-05-10', bonus: '₦1,000' },
    { email: 'friend2@example.com', date: '2025-05-22', bonus: '₦2,500' },
  ],
};

router.get('/profile', (req, res) => {
  return res.json(mockProfile);
});

// NEW ROUTE: Return referral code & list
router.get('/referrals', (req, res) => {
  // In a real app, filter by req.user.id and fetch from DB
  return res.json(mockReferrals);
});

export default router;
