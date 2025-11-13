import express from 'express';
import {
  createVNPayPayment,
  handleVNPayCallback,
  createStripePayment
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/vnpay', protect, createVNPayPayment);
router.post('/vnpay-callback', handleVNPayCallback);
router.post('/stripe', protect, createStripePayment);

export default router;
