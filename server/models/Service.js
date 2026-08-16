import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed,
    },
    provider_id: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'ServiceProvider',
      required: [true, 'Provider ID is required'],
    },
    category_id: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'ServiceCategory',
      required: [true, 'Category ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    image: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
      maxlength: [255, 'Location cannot exceed 255 characters'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
