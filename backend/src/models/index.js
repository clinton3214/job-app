// backend/src/models/index.js
import sequelize from './db.js';

import { User } from './User.js';
import { Withdrawal } from './Withdrawal.js';
import { AdminLog } from './AdminLog.js';
import { Payment } from './Payment.js';
import { Transaction } from './Transaction.js';
import Message from './message.js'; // ✅ correct import

export { sequelize, User, Withdrawal, AdminLog, Payment, Message };

export async function initDb() {
  try {
    await sequelize.sync({ alter: true }); // use 'alter' for dev
    console.log('✅ Database synchronized');
  } catch (err) {
    console.error('❌ Database sync error:', err);
    throw err;
  }
}