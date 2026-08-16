import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed,
    },
    booking_id: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'Booking',
      required: [true, 'Booking ID is required'],
    },
    customer_id: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
      required: [true, 'Customer ID is required'],
    },
    provider_id: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'ServiceProvider',
      required: [true, 'Provider ID is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5'],
    },
    review: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
