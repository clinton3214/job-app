
// index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Sequelize initialization
import sequelize from './models/db.js';
import './models/index.js'; // Load all models

// Import your routes:
import authRoutes       from './routes/auth.js';
import paymentRoutes    from './routes/payment.js';
import historyRoutes    from './routes/history.js';
import adminRoutes      from './routes/admin.js';
import userRoutes       from './routes/user.js';
import referralRoutes   from './routes/referrals.js';
import withdrawalRoutes from './routes/withdraw.js';

const app = express();

// Enable CORS for all origins
app.use(cors());

// JSON parsing
app.use(express.json());

// Health check route to verify server is running
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is up and running' });
});

async function startServer() {
  try {
    // Synchronize Sequelize models with the database
    await sequelize.sync({ alter: true });
    console.log('✅ SQLite database synchronized');

    // Log every request’s method and URL
    app.use((req, res, next) => {
      console.log(`[REQ] ${req.method} ${req.originalUrl}`);
      next();
    });

    // Mount API routes
    app.use('/api/auth',     authRoutes);
    app.use('/api/payment',  paymentRoutes);
    app.use('/api/history',  historyRoutes);
    app.use('/api/admin',    adminRoutes);
    app.use('/api/user',     userRoutes);
    app.use('/api/referrals', referralRoutes);
    app.use('/api/withdraw',  withdrawalRoutes);

    // Catch-all 404 handler for unknown routes
    app.use((req, res) => {
      res.status(404).json({ error: 'Not found' });
    });

    const PORT = process.env.PORT || 5000;
    // Bind to 0.0.0.0 so your server is reachable on your LAN IP
    app.listen(PORT, '0.0.0.0', () => console.log(`API listening on http://0.0.0.0:${PORT}`));
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
}

startServer();
