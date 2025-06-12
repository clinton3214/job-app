// backend/src/utils/database.js

let deposits = []; // In-memory deposit record (replace with real DB in prod)
let withdrawals = []; // Optional: for withdrawal history

export async function markDepositPaid(orderId, amount) {
  deposits.push({
    user: orderId,
    amount,
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
