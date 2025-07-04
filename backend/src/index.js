import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Sequelize initialization
import  sequelize  from './models/db.js';
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
app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    // Synchronize Sequelize models with the database
    await sequelize.sync({ alter: true });
    console.log('✅ SQLite database synchronized');

    // log every request’s method and URL
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
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
}

startServer();
