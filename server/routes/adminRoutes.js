import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  updateProviderVerification,
  updateReportStatus,
  createCategory,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Guard all admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', toggleUserStatus);
router.patch('/providers/:id/verification', updateProviderVerification);
router.patch('/reports/:id/status', updateReportStatus);
router.post('/categories', createCategory);

export default router;
