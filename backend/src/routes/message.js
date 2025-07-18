// routes/messages.js
import express from 'express';
import Message from '../models/message.js';
const router = express.Router();

// Get all users the admin has chatted with
router.get('/users', async (req, res) => {
  const users = await Message.findAll({
    attributes: ['senderEmail'],
    where: { receiverEmail: 'admin@example.com' },
    group: ['senderEmail']
  });
  res.json(users.map(u => u.senderEmail));
});

// Fetch conversation between admin and a user
router.get('/:userEmail', async (req, res) => {
  const { userEmail } = req.params;
  const messages = await Message.findAll({
    where: {
      [Sequelize.Op.or]: [
        { senderEmail: userEmail, receiverEmail: 'admin@example.com' },
        { senderEmail: 'admin@example.com', receiverEmail: userEmail }
      ]
    },
    order: [['createdAt', 'ASC']]
  });
  res.json(messages);
});

// Send message (admin to user)
router.post('/', async (req, res) => {
  const { senderEmail, receiverEmail, content } = req.body;
  const msg = await Message.create({ senderEmail, receiverEmail, content, isAdmin: senderEmail === 'admin@example.com' });
  res.json(msg);
});

export default router;