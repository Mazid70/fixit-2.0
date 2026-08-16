import express from 'express';
import { createReview, getProviderReviews, getReviews } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/provider/:providerId', getProviderReviews);
router.get('/', getReviews);
router.post('/', protect, authorize('customer', 'admin'), createReview);

export default router;
