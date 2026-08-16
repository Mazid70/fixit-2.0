import express from 'express';
import { createReport, getReports } from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createReport);
router.get('/', authorize('admin'), getReports);

export default router;
