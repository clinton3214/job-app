// backend/src/utils/nowpayments.js
import crypto from 'crypto';

/**
 * Verify NOWPayments IPN signature.
 * @param {object} body    The JSON payload received.
 * @param {string} signature The x-nowpayments-signature header.
 * @param {string} secret    Your NOWPAYMENTS_IPN_SECRET from .env.
 * @returns {boolean}
 */
export function verifyNowPaymentsSignature(body, signature, secret) {
  const payload = JSON.stringify(body);
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expected = hmac.digest('hex');
  return expected === signature;
}

/**
 * Extract the user identifier from the order_id.
 * If you used userEmail in order_id, return it; otherwise return null.
 */
export function parseOrderId(orderId) {
  if (!orderId) return null;
  if (orderId.startsWith('guest-')) return null;
  return orderId;
}
