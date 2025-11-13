import express from 'express';
import {
  getProductReviews,
  createReview,
  approveReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', protect, createReview);
router.put('/:id/approve', protect, authorize('Admin'), approveReview);
router.delete('/:id', protect, deleteReview);

export default router;
