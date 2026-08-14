import { dbStore } from '../services/dataService.js';

// @desc    File a user/service incident report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res, next) => {
  try {
    const { reported_user_id, reason } = req.body;

    if (!reported_user_id || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Reported user ID and reason details are required',
      });
    }

    const reportedUser = await dbStore.findUserById(reported_user_id);
    if (!reportedUser) {
      return res.status(404).json({
        success: false,
        message: 'Reported user account not found',
      });
    }

    const report = await dbStore.createReport({
      reporter_id: req.user._id,
      reported_user_id,
      reason: reason.trim(),
    });

    // Notify admins
    const admins = dbStore.users.filter((u) => u.role === 'admin');
    admins.forEach(async (admin) => {
      await dbStore.createNotification({
        user_id: admin._id,
        title: 'New User Incident Report Filed',
        message: `Report filed against ${reportedUser.name} (${reportedUser.role}). Reason: ${reason.slice(0, 60)}...`,
        type: 'report',
      });
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Our safety & quality team will review it shortly.',
      data: report,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reports (Admin only)
// @route   GET /api/reports
// @access  Private (Admin)
export const getReports = async (req, res, next) => {
  try {
    const reports = await dbStore.getReports();
    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (err) {
    next(err);
  }
};
