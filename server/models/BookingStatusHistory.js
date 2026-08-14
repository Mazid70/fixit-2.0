import mongoose from 'mongoose';

const bookingStatusHistorySchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed,
    },
    booking_id: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'Booking',
      required: [true, 'Booking ID is required'],
    },
    old_status: {
      type: String,
      maxlength: 50,
      default: '',
    },
    new_status: {
      type: String,
      required: [true, 'New status is required'],
      maxlength: 50,
    },
    changed_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

export const BookingStatusHistory =
  mongoose.models.BookingStatusHistory ||
  mongoose.model('BookingStatusHistory', bookingStatusHistorySchema);
