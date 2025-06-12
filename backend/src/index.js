import 'dotenv/config';
import express from 'express';
import cors from 'cors';
// Sequelize initialization
import { initDb } from './models/index.js';
// import your routes:
import authRoutes    from './routes/auth.js';
import paymentRoutes from './routes/payment.js';
import historyRoutes from './routes/history.js';
import adminRoutes   from './routes/admin.js';
import userRoutes    from './routes/user.js';

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    // Initialize SQLite via Sequelize
    await initDb();
    console.log('✅ SQLite database initialized');

    // Mount API routes
    app.use('/api/auth',    authRoutes);
    app.use('/api/payment', paymentRoutes);
    app.use('/api/history', historyRoutes);
    app.use('/api/admin',   adminRoutes);
    app.use('/api/user',    userRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
}

startServer();
