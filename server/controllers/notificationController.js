import { dbStore } from '../services/dataService.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10) || 1;
    const limit = parseInt(req.query.limit || '10', 10) || 10;
    const list = await dbStore.getNotifications(req.user._id);
    const unreadCount = list.filter((n) => !n.is_read).length;
    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = list.slice(start, start + limit);
    res.json({ success: true, unreadCount, page, totalPages, total, data });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const notif = await dbStore.markNotificationRead(req.params.id, req.user._id);
    if (!notif) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }
    res.json({
      success: true,
      data: notif,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res, next) => {
  try {
    await dbStore.markAllNotificationsRead(req.user._id);
    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (err) {
    next(err);
  }
};
