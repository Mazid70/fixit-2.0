import { dbStore } from '../services/dataService.js';

// @desc    Add review for a completed booking
// @route   POST /api/reviews
// @access  Private (Customer)
export const createReview = async (req, res, next) => {
  try {
    const { booking_id, rating, review } = req.body;

    if (!booking_id || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID and numeric rating (1-5) are required',
      });
    }

    const booking = await dbStore.getBookingById(booking_id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (String(booking.customer_id) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You can only review services from your own bookings',
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted for completed services',
      });
    }

    // Check if review already exists
    const existing = dbStore.reviews.find((r) => String(r.booking_id) === String(booking_id));
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this booking',
      });
    }

    const newReview = await dbStore.createReview({
      booking_id,
      customer_id: req.user._id,
      provider_id: booking.provider_id,
      rating: parseInt(rating, 10),
      review: review || '',
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! Thank you for your feedback.',
      data: newReview,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get reviews for a provider
// @route   GET /api/reviews/provider/:providerId
// @access  Public
export const getProviderReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10) || 1;
    const limit = parseInt(req.query.limit || '10', 10) || 10;
    const all = await dbStore.getReviewsByProvider(req.params.providerId);
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = all.slice(start, start + limit);
    res.json({ success: true, count: data.length, page, totalPages, total, data });
  } catch (err) {
    next(err);
  }
};

// @desc    Get reviews via query param or for a provider
// @route   GET /api/reviews?provider_id=...  OR  GET /api/reviews/provider/:providerId
// @access  Public
export const getReviews = async (req, res, next) => {
  try {
    const providerId = req.query.provider_id || req.params.providerId;
    if (!providerId) {
      return res.status(400).json({ success: false, message: 'provider_id is required' });
    }
    const page = parseInt(req.query.page || '1', 10) || 1;
    const limit = parseInt(req.query.limit || '10', 10) || 10;
    const all = await dbStore.getReviewsByProvider(providerId);
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = all.slice(start, start + limit);
    res.json({ success: true, count: data.length, page, totalPages, total, data });
  } catch (err) {
    next(err);
  }
};
