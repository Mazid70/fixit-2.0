import { dbStore } from '../services/dataService.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = async (req, res, next) => {
  try {
    const list = await dbStore.getNotifications(req.user._id);
    const unreadCount = list.filter((n) => !n.is_read).length;
    res.json({
      success: true,
      unreadCount,
      data: list,
    });
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
