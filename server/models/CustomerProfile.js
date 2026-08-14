import mongoose from 'mongoose';

const customerProfileSchema = new mongoose.Schema(
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
    address: {
      type: String,
      default: '',
    },
    profile_image: {
      type: String,
      default: '',
      maxlength: 255,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const CustomerProfile = mongoose.models.CustomerProfile || mongoose.model('CustomerProfile', customerProfileSchema);
