import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed,
    },
    user_id: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      maxlength: 255,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    type: {
      type: String,
      default: 'system',
      maxlength: 50,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const Notification =
  mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
