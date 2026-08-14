import { dbStore } from '../services/dataService.js';

// @desc    Get Admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = dbStore.users.length;
    const totalCustomers = dbStore.users.filter((u) => u.role === 'customer').length;
    const totalProviders = dbStore.users.filter((u) => u.role === 'provider').length;
    const verifiedProviders = dbStore.serviceProviders.filter((p) => p.verification_status === 'verified').length;
    const pendingVerifications = dbStore.serviceProviders.filter((p) => p.verification_status === 'pending').length;

    const totalServices = dbStore.services.length;
    const activeServices = dbStore.services.filter((s) => s.status === 'active').length;

    const totalBookings = dbStore.bookings.length;
    const pendingBookings = dbStore.bookings.filter((b) => b.status === 'pending').length;
    const completedBookings = dbStore.bookings.filter((b) => b.status === 'completed').length;

    // Calculate platform GMV / volume
    const completedBookingRecords = dbStore.bookings.filter((b) => b.status === 'completed');
    const totalVolume = completedBookingRecords.reduce((sum, b) => {
      const srv = dbStore.services.find((s) => String(s._id) === String(b.service_id));
      return sum + (srv ? srv.price : 0);
    }, 0);

    const totalReviews = dbStore.reviews.length;
    const pendingReports = dbStore.reports.filter((r) => r.status === 'pending').length;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCustomers,
        totalProviders,
        verifiedProviders,
        pendingVerifications,
        totalServices,
        activeServices,
        totalBookings,
        pendingBookings,
        completedBookings,
        totalVolume: parseFloat(totalVolume.toFixed(2)),
        totalReviews,
        pendingReports,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    List all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await Promise.all(
      dbStore.users.map(async (u) => {
        let extra = null;
        if (u.role === 'customer') {
          extra = await dbStore.getCustomerProfileByUserId(u._id);
        } else if (u.role === 'provider') {
          extra = await dbStore.getProviderByUserId(u._id);
        }
        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          status: u.status,
          created_at: u.created_at,
          profile: extra,
        };
      })
    );

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle user active/inactive status
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin)
export const toggleUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be active or inactive',
      });
    }

    const updated = await dbStore.updateUser(req.params.id, { status });
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: `User status changed to ${status}`,
      data: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        status: updated.status,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify or reject service provider
// @route   PATCH /api/admin/providers/:id/verification
// @access  Private (Admin)
export const updateProviderVerification = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['verified', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be verified, rejected, or pending',
      });
    }

    const provider = await dbStore.getProviderById(req.params.id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found',
      });
    }

    provider.verification_status = status;
    provider.updated_at = new Date();

    // Send notification to provider
    await dbStore.createNotification({
      user_id: provider.user_id,
      title: `Provider Verification: ${status.toUpperCase()}`,
      message: `Your FIXIT provider account verification status has been updated to "${status}".`,
      type: 'verification',
    });

    res.json({
      success: true,
      message: `Provider status set to ${status}`,
      data: provider,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update report status (resolve/reject)
// @route   PATCH /api/admin/reports/:id/status
// @access  Private (Admin)
export const updateReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'resolved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be pending, resolved, or rejected',
      });
    }

    const rep = await dbStore.updateReportStatus(req.params.id, status);
    if (!rep) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.json({
      success: true,
      message: `Report marked as ${status}`,
      data: rep,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add new category (Admin)
// @route   POST /api/admin/categories
// @access  Private (Admin)
export const createCategory = async (req, res, next) => {
  try {
    const { category_name, description } = req.body;
    if (!category_name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const cat = await dbStore.createCategory({
      category_name: category_name.trim(),
      description: description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: cat,
    });
  } catch (err) {
    next(err);
  }
};
