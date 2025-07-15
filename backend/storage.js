// backend/src/routes/payment.js
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { verifyNowPaymentsSignature, parseOrderId } from '../utils/nowpayments.js';
import { markDepositPaid } from '../utils/database.js';

const router = express.Router();
const API_URL = 'https://api.nowpayments.io/v1';
const API_KEY = process.env.NOWPAYMENTS_API_KEY;
const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;

// Allow frontend origin
const allowedOrigins = ['https://job-app-frontend-3dld.onrender.com'];

router.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Route to create a crypto charge
async function createCryptoCharge(req, res) {
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
        success_url: `https://job-app-frontend-3dld.onrender.com/deposit/success`,
        cancel_url: `https://job-app-frontend-3dld.onrender.com/deposit/cancel`,
      },
      {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('NOWPayments response.data:', data);

    const checkoutUrl = data.invoice_url;

    if (!checkoutUrl) {
      console.error('❌ No checkout URL in NOWPayments response:', data);
      return res.status(500).json({ error: 'No checkout URL returned by gateway' });
    }

    // ✅ Frontend expects `paymentUrl`
    return res.json({ paymentUrl: checkoutUrl });

  } catch (err) {
    console.error('NOWPayments error:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      headers: err.response?.headers,
    });

    const gatewayMsg = err.response?.data?.message || 'Failed to create invoice';
    return res.status(500).json({ error: gatewayMsg });
  }
}

// Primary route
router.post('/crypto', createCryptoCharge);

// Alias to match frontend usage
router.post('/crypto-charge', createCryptoCharge);

// NOWPayments IPN Webhook
router.post('/ipn', express.json(), async (req, res) => {
  const signature = req.headers['x-nowpayments-signature'];
  const body = req.body;

  if (!verifyNowPaymentsSignature(body, signature, IPN_SECRET)) {
    console.warn('❌ Invalid IPN signature:', signature);
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
