import { dbStore } from '../services/dataService.js';

// @desc    Update user basic info and profile details
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, profile_image, avatar, business_name, description, location } = req.body;

    const imgUrl = profile_image || avatar;
    const userUpdates = {};
    if (name) userUpdates.name = name.trim();
    if (phone !== undefined) userUpdates.phone = phone.trim();
    if (imgUrl !== undefined) userUpdates.avatar = imgUrl;

    const updatedUser = await dbStore.updateUser(req.user._id, userUpdates);

    let updatedProfile = null;
    if (req.user.role === 'customer') {
      updatedProfile = await dbStore.saveCustomerProfile(req.user._id, {
        address: address !== undefined ? address : undefined,
        profile_image: imgUrl !== undefined ? imgUrl : undefined,
      });
    } else if (req.user.role === 'provider') {
      updatedProfile = await dbStore.saveServiceProvider(req.user._id, {
        business_name: business_name !== undefined ? business_name : undefined,
        description: description !== undefined ? description : undefined,
        location: location !== undefined ? location : undefined,
        avatar: imgUrl !== undefined ? imgUrl : undefined,
      });
    }

    const safeAvatar = updatedUser.avatar || updatedProfile?.profile_image || updatedProfile?.avatar || '';

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        avatar: safeAvatar,
        status: updatedUser.status,
        profile: updatedProfile,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get service provider profile by ID
// @route   GET /api/users/providers/:id
// @access  Public
export const getProviderPublicProfile = async (req, res, next) => {
  try {
    const provider = await dbStore.getProviderById(req.params.id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found',
      });
    }

    const providerUser = await dbStore.findUserById(provider.user_id);
    const providerServices = await dbStore.getServices({ providerId: provider._id });
    const providerReviews = await dbStore.getReviewsByProvider(provider._id);

    res.json({
      success: true,
      data: {
        ...provider,
        user: providerUser ? { _id: providerUser._id, name: providerUser.name, email: providerUser.email, phone: providerUser.phone } : null,
        services: providerServices,
        reviews: providerReviews,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    List all providers
// @route   GET /api/users/providers
// @access  Public
export const listProviders = async (req, res, next) => {
  try {
    const providers = await dbStore.getAllProviders();
    res.json({
      success: true,
      data: providers,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Apply to become a service provider (from customer account)
// @route   POST /api/users/become-provider
// @access  Private (Customer)
export const applyToBecomeProvider = async (req, res, next) => {
  try {
    const { business_name, description, location, nid_number, experience_years, category } = req.body;

    if (!business_name || !location) {
      return res.status(400).json({
        success: false,
        message: 'Business / Trade name and operating location are required',
      });
    }

    // Check if provider profile already exists
    let existingProvider = await dbStore.getProviderByUserId(req.user._id);

    if (existingProvider) {
      existingProvider.business_name = business_name.trim();
      existingProvider.description = description || existingProvider.description;
      existingProvider.location = location.trim();
      existingProvider.verification_status = 'pending';
      existingProvider.updated_at = new Date();
    } else {
      existingProvider = await dbStore.saveServiceProvider(req.user._id, {
        business_name: business_name.trim(),
        description: description || 'Certified master technician & service partner.',
        verification_status: 'pending',
        location: location.trim(),
        rating_avg: 5.0,
        total_reviews: 0,
        completed_bookings: 0,
      });
    }

    // Update user role to provider (pending verification)
    const updatedUser = await dbStore.updateUser(req.user._id, { role: 'provider' });

    // Notify Admins
    const admins = dbStore.users.filter((u) => u.role === 'admin');
    admins.forEach(async (admin) => {
      await dbStore.createNotification({
        user_id: admin._id,
        title: 'New Service Provider Application',
        message: `${updatedUser.name} submitted an application to become a provider (${business_name.trim()} in ${location.trim()}).`,
        type: 'verification',
      });
    });

    // Notify User
    await dbStore.createNotification({
      user_id: req.user._id,
      title: 'Provider Application Received',
      message: 'Your service partner application has been submitted to FIXIT verification admins. You can now configure your services while awaiting verification.',
      type: 'system',
    });

    res.json({
      success: true,
      message: 'Provider partner application submitted successfully! Our verification team will review your profile.',
      data: {
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
        provider: existingProvider,
      },
    });
  } catch (err) {
    next(err);
  }
};

