// routes/messages.js
import Sequelize from 'sequelize';
import express from 'express';
import Message from '../models/message.js';

const router = express.Router();

// ✅ Get all users who have chatted with the admin
router.get('/users', async (req, res) => {
  try {
    const users = await Message.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('senderEmail')), 'senderEmail']],
      where: {
        receiverEmail: 'admin@example.com'
      }
    });
    const emails = users.map(u => u.senderEmail);
    res.json(emails);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ✅ Get full conversation between admin and a specific user
router.get('/:userEmail', async (req, res) => {
  const { userEmail } = req.params;
  try {
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
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ✅ Send message from admin to user
router.post('/', async (req, res) => {
  const { senderEmail, receiverEmail, content } = req.body;
  try {
    const msg = await Message.create({
      senderEmail,
      receiverEmail,
      content,
      isAdmin: senderEmail === 'admin@example.com' // ✅ Ensure isAdmin is stored
    });
    res.json(msg);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
