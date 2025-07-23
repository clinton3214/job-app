import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import sequelize from './models/db.js';
import './models/index.js';
import Message from './models/message.js';

// Import routes
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payment.js';
import historyRoutes from './routes/history.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';
import referralRoutes from './routes/referrals.js';
import withdrawalRoutes from './routes/withdraw.js';
import messageRoutes from './routes/message.js';

const app = express();
const server = http.createServer(app);

// CORS config
app.use(cors({
  origin: 'https://job-app-frontend-3dld.onrender.com',
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is up and running' });
});

// Log requests
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/withdraw', withdrawalRoutes);
app.use('/api/messages', messageRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});


// ----------------- SOCKET.IO -------------------
const io = new Server(server, {
  cors: {
    origin: 'https://job-app-frontend-3dld.onrender.com',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Map of email => socketId
const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  // Handle registration
  socket.on('register_email', (email) => {
    connectedUsers[email] = socket.id;
    console.log(`✅ Registered ${email} => ${socket.id}`);
  });

  // Handle incoming messages
  socket.on('send_message', async (data) => {
    console.log('📩 Message received from frontend:', data);
    try {
      // Save message
      await Message.create({
        senderEmail: data.senderEmail,
        receiverEmail: data.receiverEmail,
        content: data.text,
        isAdmin: data.sender === 'admin'
      });
      console.log('✅ Message saved to DB');
    } catch (error) {
      console.error('❌ DB save error:', error);
    }

    // Deliver only to receiver
    const receiverSocketId = connectedUsers[data.receiverEmail];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', data);
      console.log(`📤 Sent to ${data.receiverEmail}`);
    } else {
      console.log(`🕳 Receiver (${data.receiverEmail}) not online`);
    }

    // Also emit to sender (admin or user) to update their own chat immediately
    const senderSocketId = connectedUsers[data.senderEmail];
    if (senderSocketId && senderSocketId !== receiverSocketId) {
      io.to(senderSocketId).emit('receive_message', data);
    }
  });

  // Clean up on disconnect
  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected:', socket.id);
    for (const email in connectedUsers) {
      if (connectedUsers[email] === socket.id) {
        delete connectedUsers[email];
        console.log(`❌ Removed ${email} from connectedUsers`);
        break;
      }
    }
  });
});


// ----------------- SERVER STARTUP -------------------
async function startServer() {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('✅ Database synced');

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server + Socket.IO running at http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
}
startServer();