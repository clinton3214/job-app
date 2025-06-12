// src/services/paymentService.js
import axios from 'axios';

/**
 * Creates a crypto charge via your backend (NOWPayments)
 * @param {number} amount – deposit amount in NGN
 * @param {'BTC'|'BNB'|'USDT'|'SOL'} currency
 * @returns {Promise<string>} payment URL for checkout
 */
export async function createCryptoCharge(amount, currency) {
  const resp = await axios.post('/api/payment/crypto', {
    amount,
    currency, // e.g. 'BTC','BNB','USDT','SOL'
    userEmail: localStorage.getItem('userEmail') || undefined,
  });
  // NOWPayments returns 'payment_url' in the response
  return resp.data.payment_url;
}
