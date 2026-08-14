import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed,
    },
    reporter_id: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
      required: [true, 'Reporter ID is required'],
    },
    reported_user_id: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
      required: [true, 'Reported User ID is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
