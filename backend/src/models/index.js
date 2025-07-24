// backend/src/models/index.js
import  sequelize  from './db.js';

// Eagerly load models (ensures they attach to the shared sequelize instance)
import './User.js';
import './Withdrawal.js';
import './AdminLog.js';
import './Payment.js';
import './message.js'; // ✅ Import Message model
// add more as needed: './Referral.js', './Deposit.js', etc.

export async function initDb() {
  try {
    await sequelize.sync({ alter: true }); // Use alter for dev flexibility
    console.log('✅ Database synchronized');
  } catch (err) {
    console.error('❌ Database sync error:', err);
    throw err;
  }
}
