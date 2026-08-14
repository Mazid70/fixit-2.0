import express from 'express';
import { createReview, getProviderReviews } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/provider/:providerId', getProviderReviews);
router.post('/', protect, authorize('customer', 'admin'), createReview);

export default router;
