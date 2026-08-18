import { dbStore } from '../services/dataService.js';

// @desc    Get all service categories
// @route   GET /api/services/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await dbStore.getCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all services with optional search & filter params
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res, next) => {
  try {
    const { search, category, providerId, minPrice, maxPrice, location, status } = req.query;

    const services = await dbStore.getServices({
      search,
      category,
      providerId,
      minPrice,
      maxPrice,
      location,
      status: status || 'active',
    });

    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get services belonging to the current provider
// @route   GET /api/services/my-services
// @access  Private (Provider)
export const getMyServices = async (req, res, next) => {
  try {
    // Allow admin to query services by provider email: ?email=provider@example.com
    const { email } = req.query;

    let provider = null;
    if (email) {
      // Only allow admin to fetch by email for privacy
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to fetch by email' });
      }
      const user = await dbStore.findUserByEmail(email);
      if (!user) return res.json({ success: true, count: 0, data: [] });
      provider = await dbStore.getProviderByUserId(user._id);
      if (!provider) return res.json({ success: true, count: 0, data: [] });
    } else {
      // Default: return services for the authenticated provider
      provider = await dbStore.getProviderByUserId(req.user._id);
      if (!provider) {
        return res.json({ success: true, count: 0, data: [] });
      }
    }

    const page = parseInt(req.query.page || '1', 10) || 1;
    const limit = parseInt(req.query.limit || '10', 10) || 10;
    const all = await dbStore.getServices({ providerId: provider._id });
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = all.slice(start, start + limit);
    res.json({ success: true, count: data.length, page, totalPages, total, data });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req, res, next) => {
  try {
    const service = await dbStore.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new service (Provider only)
// @route   POST /api/services
// @access  Private (Provider)
export const createService = async (req, res, next) => {
  try {
    const { category_id, title, description, price, location, image } = req.body;

    if (!category_id || !title || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Category, title, and price are required fields',
      });
    }

    // Find provider profile for current user
    let provider = await dbStore.getProviderByUserId(req.user._id);

    // Verification check: Non-admins must have a verified provider status
    if (req.user.role !== 'admin') {
      if (!provider || provider.verification_status !== 'verified') {
        const currentStatus = provider ? provider.verification_status : 'unregistered';
        return res.status(403).json({
          success: false,
          message: `Your provider account is currently '${currentStatus}'. You can only post and publish services after your provider credentials are approved and verified by an administrator.`,
        });
      }
    } else if (!provider) {
      provider = await dbStore.saveServiceProvider(req.user._id, {
        business_name: `${req.user.name}'s Services`,
        location: location || 'Metro Area',
        verification_status: 'verified',
      });
    }

    const newService = await dbStore.createService({
      provider_id: provider._id,
      category_id,
      title: title.trim(),
      description: description || '',
      price: parseFloat(price),
      image: image || '',
      location: location || provider.location || 'Metro Area',
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: newService,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Provider/Admin)
export const updateService = async (req, res, next) => {
  try {
    const service = await dbStore.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Check ownership unless admin
    if (req.user.role !== 'admin') {
      const provider = await dbStore.getProviderByUserId(req.user._id);
      if (!provider || String(provider._id) !== String(service.provider_id)) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to update this service listing',
        });
      }
    }

    const { category_id, title, description, price, location, status, image } = req.body;
    const updates = {};
    if (category_id) updates.category_id = category_id;
    if (title) updates.title = title.trim();
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = parseFloat(price);
    if (location !== undefined) updates.location = location;
    if (image !== undefined) updates.image = image;
    if (status) updates.status = status;

    const updated = await dbStore.updateService(req.params.id, updates);

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Provider/Admin)
export const deleteService = async (req, res, next) => {
  try {
    const service = await dbStore.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    if (req.user.role !== 'admin') {
      const provider = await dbStore.getProviderByUserId(req.user._id);
      if (!provider || String(provider._id) !== String(service.provider_id)) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to delete this service listing',
        });
      }
    }

    await dbStore.deleteService(req.params.id);

    res.json({
      success: true,
      message: 'Service listing removed successfully',
    });
  } catch (err) {
    next(err);
  }
};
