// index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http'; // ⬅️ Needed to create a raw server
import { Server } from 'socket.io'; // ⬅️ Socket.IO server

// Sequelize initialization
import sequelize from './models/db.js';
import './models/index.js'; // Load all models

// Import your routes
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payment.js';
import historyRoutes from './routes/history.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';
import referralRoutes from './routes/referrals.js';
import withdrawalRoutes from './routes/withdraw.js';
import messageRoutes from './routes/message.js';



const app = express();
const server = http.createServer(app); // ⬅️ Create HTTP server for socket.io
const io = new Server(server, {
  cors: {
    origin: 'https://job-app-frontend-3dld.onrender.com',
    methods: ['GET', 'POST']
  }
});

// Enable CORS for all origins
app.use(cors({
  origin: 'https://job-app-frontend-3dld.onrender.com'
}));

// JSON parsing
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is up and running' });
});

// Real-time socket connection
io.on('connection', (socket) => {
  console.log('🟢 A user connected:', socket.id);

  socket.on('send_message', (data) => {
    console.log('📨 Message:', data);
    io.emit('receive_message', data); // Broadcast to all (admin + user)
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

// Main startup function
async function startServer() {
  try {
    // Sync DB
    if (process.env.NODE_ENV === 'production') {
      await sequelize.sync();
    } else {
      await sequelize.sync({ force: true });
    }
    console.log('✅ SQLite database synchronized');

    // Log requests
    app.use((req, res, next) => {
      console.log(`[REQ] ${req.method} ${req.originalUrl}`);
      next();
    });

    // Mount routes
    app.use('/api/auth', authRoutes);
    app.use('/api/payment', paymentRoutes);
    app.use('/api/history', historyRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/referrals', referralRoutes);
    app.use('/api/withdraw', withdrawalRoutes);
    app.use('/api/messages', messageRoutes);

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ error: 'Not found' });
    });

    // Listen
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀 Server + Socket.IO running at http://0.0.0.0:${PORT}`)
    );
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
}

startServer();