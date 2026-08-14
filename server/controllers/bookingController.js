import { dbStore } from '../services/dataService.js';

// @desc    Create a new booking request
// @route   POST /api/bookings
// @access  Private (Customer)
export const createBooking = async (req, res, next) => {
  try {
    const { service_id, booking_date, notes } = req.body;

    if (!service_id || !booking_date) {
      return res.status(400).json({
        success: false,
        message: 'Service and booking date/time are required',
      });
    }

    const service = await dbStore.getServiceById(service_id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or is no longer active',
      });
    }

    const newBooking = await dbStore.createBooking({
      customer_id: req.user._id,
      provider_id: service.provider_id,
      service_id,
      booking_date,
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Booking request placed successfully! The service provider has been notified.',
      data: newBooking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get bookings for current logged in user (customer or provider or admin)
// @route   GET /api/bookings
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (req.user.role === 'customer') {
      filter.customerId = req.user._id;
    } else if (req.user.role === 'provider') {
      const provider = await dbStore.getProviderByUserId(req.user._id);
      if (!provider) {
        return res.json({ success: true, count: 0, data: [] });
      }
      filter.providerId = provider._id;
    }
    // Admin gets all bookings

    if (status) {
      filter.status = status;
    }

    const bookings = await dbStore.getBookings(filter);

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single booking details with history
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await dbStore.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found',
      });
    }

    // Verify access
    if (req.user.role === 'customer' && String(booking.customer_id) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }
    if (req.user.role === 'provider') {
      const prov = await dbStore.getProviderByUserId(req.user._id);
      if (!prov || String(booking.provider_id) !== String(prov._id)) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this booking',
        });
      }
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking status (accept, reject, complete, cancel)
// @route   PATCH /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    const booking = await dbStore.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found',
      });
    }

    // Role-based status transition checks
    if (req.user.role === 'customer') {
      if (String(booking.customer_id) !== String(req.user._id)) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }
      if (status !== 'cancelled') {
        return res.status(403).json({
          success: false,
          message: 'Customers can only cancel their pending or accepted bookings',
        });
      }
    } else if (req.user.role === 'provider') {
      const prov = await dbStore.getProviderByUserId(req.user._id);
      if (!prov || String(booking.provider_id) !== String(prov._id)) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }
      if (!['accepted', 'rejected', 'completed'].includes(status)) {
        return res.status(403).json({
          success: false,
          message: 'Providers can only accept, reject, or complete bookings',
        });
      }
    }

    const updatedBooking = await dbStore.updateBookingStatus(req.params.id, status);

    res.json({
      success: true,
      message: `Booking status updated to "${status}"`,
      data: updatedBooking,
    });
  } catch (err) {
    next(err);
  }
};
