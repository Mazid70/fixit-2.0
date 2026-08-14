import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed,
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
    service_id: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'Service',
      required: [true, 'Service ID is required'],
    },
    booking_date: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
