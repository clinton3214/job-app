import Sequelize from 'sequelize';
import express from 'express';
import Message from '../models/message.js';

const router = express.Router();

// ✅ Get all users who have chatted with the admin
router.get('/users', async (req, res) => {
  try {
    const users = await Message.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('senderEmail')), 'senderEmail']],
      where: { receiverEmail: 'ezeobiclinton@gmail.com' }
    });
    const emails = users.map(u => u.senderEmail);
    res.json(emails);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ✅ Get count of unread messages sent to admin
router.get('/unread-count', async (req, res) => {
  try {
    const unreadMessages = await Message.findAll({
      where: {
        receiverEmail: 'ezeobiclinton@gmail.com',
        read: false
      }
    });
    res.json({ total: unreadMessages.length });
  } catch (err) {
    console.error('Error fetching unread count:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Mark messages from a specific user as read
router.patch('/mark-read/:userEmail', async (req, res) => {
  const { userEmail } = req.params;
  try {
    await Message.update(
      { read: true },
      {
        where: {
          senderEmail: userEmail,
          receiverEmail: 'ezeobiclinton@gmail.com',
          read: false
        }
      }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to mark messages as read:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get full conversation between admin and a specific user
router.get('/:userEmail', async (req, res) => {
  const { userEmail } = req.params;
  try {
    const messages = await Message.findAll({
      where: {
        [Sequelize.Op.or]: [
          { senderEmail: userEmail, receiverEmail: 'ezeobiclinton@gmail.com' },
          { senderEmail: 'ezeobiclinton@gmail.com', receiverEmail: userEmail }
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

// ✅ Send message from admin to user (or user to admin)
router.post('/', async (req, res) => {
  const { senderEmail, receiverEmail, content } = req.body;
  try {
    const msg = await Message.create({
      senderEmail,
      receiverEmail,
      content,
      isAdmin: senderEmail === 'ezeobiclinton@gmail.com',
      read: false
    });
    res.json(msg);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Server error saving message' });
  }
});

export default router;