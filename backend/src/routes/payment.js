// backend/src/routes/payment.js
import express from 'express';
import axios from 'axios';
import { verifyNowPaymentsSignature, parseOrderId } from '../utils/nowpayments.js';
import { markDepositPaid } from '../utils/database.js';

const router = express.Router();
const API_URL = 'https://api.nowpayments.io/v1';
const API_KEY = process.env.NOWPAYMENTS_API_KEY;
const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;

// Create crypto charge
router.post('/crypto', async (req, res) => {
  const { amount, currency, userEmail } = req.body;
  if (!amount || !currency) {
    return res.status(400).json({ error: 'Missing amount or currency' });
  }

  try {
    const { data } = await axios.post(
      `${API_URL}/invoice`,
      {
        price_amount: amount,
        price_currency: 'ngn',
        pay_currency: currency.toLowerCase(),
        order_id: userEmail || `guest-${Date.now()}`,
        ipn_callback_url: `${req.protocol}://${req.get('host')}/api/payment/ipn`,
        success_url: `http://localhost:5173/deposit/success`,
        cancel_url: `http://localhost:5173/deposit/cancel`,
      },
      {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('NOWPayments response.data:', data);

    const checkoutUrl = data.payment_url || data.invoice_url;
    if (!checkoutUrl) {
      console.error('No checkout URL in response:', data);
      return res.status(500).json({ error: 'No checkout URL returned by gateway' });
    }

    return res.json({ payment_url: checkoutUrl });
  } catch (err) {
    console.error('NOWPayments invoice error object:', err);
    console.error('NOWPayments response data:', err.response?.data);
    console.error('NOWPayments error message:', err.message);
    const gatewayMsg = err.response?.data?.message;
    return res.status(500).json({ error: gatewayMsg || 'Failed to create invoice' });
  }
});

// IPN handler
router.post('/ipn', express.json(), async (req, res) => {
  const signature = req.headers['x-nowpayments-signature'];
  const body = req.body;

  if (!verifyNowPaymentsSignature(body, signature, IPN_SECRET)) {
    console.warn('Invalid IPN signature', signature);
    return res.status(400).send('Invalid signature');
  }

  const { payment_status, price_amount, order_id, id: invoiceId } = body;
  const userEmail = parseOrderId(order_id);

  if (payment_status === 'finished') {
    console.log(`✅ IPN: ${userEmail || 'guest'} paid ₦${price_amount}`);
    try {
      await markDepositPaid(order_id, price_amount);
      console.log(`✅ Payment recorded for ${userEmail}`);
    } catch (err) {
      console.error('❌ Error updating DB:', err);
    }
  } else {
    console.log(`⏳ IPN: invoice ${invoiceId} status ${payment_status}`);
  }

  res.sendStatus(200);
});

export default router;
