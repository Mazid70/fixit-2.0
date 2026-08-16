import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createBooking);
// Support legacy frontend endpoints that call specific booking lists
router.get('/provider-bookings', getMyBookings);
router.get('/my-bookings', getMyBookings);
router.get('/', getMyBookings);
router.get('/all', getAllBookings);

// Single booking by id
router.get('/:id', getBookingById);

// Support both PATCH and PUT for status updates from the frontend
router.patch('/:id/status', updateBookingStatus);
router.put('/:id/status', updateBookingStatus);

export default router;
