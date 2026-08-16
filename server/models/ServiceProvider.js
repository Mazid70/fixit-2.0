import mongoose from 'mongoose';

const serviceProviderSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed,
    },
    user_id: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
      required: true,
      unique: true,
    },
    business_name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [150, 'Business name cannot exceed 150 characters'],
    },
    title_role: {
      type: String,
      default: 'Verified Specialist',
    },
    avatar: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    verification_status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    location: {
      type: String,
      default: '',
      maxlength: [255, 'Location cannot exceed 255 characters'],
    },
    rate_hourly: {
      type: Number,
      default: 1000,
    },
    total_bookings: {
      type: Number,
      default: 0,
    },
    average_rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const ServiceProvider = mongoose.models.ServiceProvider || mongoose.model('ServiceProvider', serviceProviderSchema);
