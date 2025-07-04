// backend/src/utils/database.js

import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';
import { Payment } from '../models/Payment.js';

let deposits = []; // In-memory deposit record (for dev/test)
let withdrawals = []; // In-memory withdrawal record (optional/test use)

export async function markDepositPaid(orderId, amount) {
  deposits.push({
    user: orderId,
    amount,
    method: 'crypto',
    status: 'successful',
    time: new Date(),
  });

  // ✅ Real DB logic begins here
  const user = await User.findOne({ where: { email: orderId } });
  if (!user) throw new Error('User not found');

  // ✅ Update user balance
  user.balance += parseFloat(amount);
  await user.save();

  // ✅ Save transaction record
  await Transaction.create({
    userId: user.id,
    amount: parseFloat(amount),
    type: 'deposit',
    time: new Date(),
  });

  // ✅ Save payment history record
  await Payment.create({
    userId: user.id,
    amount: parseFloat(amount),
    method: 'crypto',
    status: 'successful',
    time: new Date(),
  });
}

export async function getDeposits() {
  return deposits;
}

export async function getWithdrawals() {
  return withdrawals;
}
