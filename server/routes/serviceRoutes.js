import express from 'express';
import {
  getCategories,
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getMyServices,
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/', getServices);

// Provider-specific service listing used by frontend
// Place before `/:id` to avoid matching 'my-services' as an id
router.get('/my-services', protect, getMyServices);

router.get('/:id', getServiceById);

router.post('/', protect, authorize('provider', 'admin'), createService);
router.put('/:id', protect, authorize('provider', 'admin'), updateService);
router.delete('/:id', protect, authorize('provider', 'admin'), deleteService);

export default router;
