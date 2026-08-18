import express from 'express';
import {
  updateProfile,
  getProviderPublicProfile,
  listProviders,
  applyToBecomeProvider,
  instantVerifyProvider,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.post('/become-provider', protect, applyToBecomeProvider);
router.post('/instant-verify-provider', protect, instantVerifyProvider);
router.get('/providers', listProviders);
router.get('/providers/:id', getProviderPublicProfile);

export default router;
