import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { dbStore } from '../services/dataService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fixit_jwt_secret_super_key_2026';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (customer or provider)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, business_name, description, location, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields',
      });
    }

    const emailNorm = email.toLowerCase().trim();
    const existingUser = await dbStore.findUserByEmail(emailNorm);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = ['customer', 'provider', 'admin'].includes(role) ? role : 'customer';

    const newUser = await dbStore.createUser({
      name: name.trim(),
      email: emailNorm,
      phone: phone || '',
      password: hashedPassword,
      role: userRole,
      status: 'active',
    });

    let profileData = null;

    if (userRole === 'customer') {
      profileData = await dbStore.saveCustomerProfile(newUser._id, {
        address: address || '',
        profile_image: '',
      });
    } else if (userRole === 'provider') {
      profileData = await dbStore.saveServiceProvider(newUser._id, {
        business_name: business_name || `${newUser.name}'s Services`,
        description: description || 'Professional service specialist.',
        verification_status: 'pending',
        location: location || 'Metro Area',
      });

      // Send notification to admin for pending verification
      const admins = dbStore.users.filter((u) => u.role === 'admin');
      admins.forEach(async (admin) => {
        await dbStore.createNotification({
          user_id: admin._id,
          title: 'New Service Provider Registered',
          message: `${newUser.name} registered as a provider (${business_name || newUser.name}) and is awaiting verification.`,
          type: 'verification',
        });
      });
    }

    const token = generateToken(newUser._id);

    // Set token in HttpOnly cookie to prevent XSS access from client-side scripts
    res.cookie('fixit_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const safeAvatar = newUser.avatar || profileData?.profile_image || profileData?.avatar || '';

    const safeUser = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      avatar: safeAvatar,
      status: newUser.status,
      created_at: newUser.created_at,
      profile: profileData,
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to FIXIT.',
      data: {
        user: safeUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await dbStore.findUserByEmail(email.trim());

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Please reach out to support.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    let profileData = null;
    let providerProfile = await dbStore.getProviderByUserId(user._id);
    if (user.role === 'customer') {
      profileData = await dbStore.getCustomerProfileByUserId(user._id);
    } else if (user.role === 'provider') {
      profileData = providerProfile;
    }

    const token = generateToken(user._id);

    // Set token as HttpOnly cookie
    res.cookie('fixit_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const safeAvatar = user.avatar || profileData?.profile_image || profileData?.avatar || '';

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: safeAvatar,
      status: user.status,
      created_at: user.created_at,
      profile: profileData,
      providerProfile: providerProfile || null,
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: safeUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user by clearing cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res, next) => {
  try {
    res.clearCookie('fixit_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await dbStore.findUserById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found',
      });
    }

    let profileData = null;
    let providerProfile = await dbStore.getProviderByUserId(user._id);
    if (user.role === 'customer') {
      profileData = await dbStore.getCustomerProfileByUserId(user._id);
    } else if (user.role === 'provider') {
      profileData = providerProfile;
    }

    const safeAvatar = user.avatar || profileData?.profile_image || profileData?.avatar || '';

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: safeAvatar,
      status: user.status,
      created_at: user.created_at,
      profile: profileData,
      providerProfile: providerProfile || null,
    };

    res.json({
      success: true,
      data: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    const user = await dbStore.findUserById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    await dbStore.updateUser(req.user._id, { password: hashed });

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot password simulation/handler
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await dbStore.findUserByEmail(email || '');
    if (!user) {
      // Don't leak account existence
      return res.json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been dispatched.',
      });
    }

    res.json({
      success: true,
      message: 'Password reset link sent to your email. (For demo: use password fixit123 or reset directly in profile).',
    });
  } catch (err) {
    next(err);
  }
};
