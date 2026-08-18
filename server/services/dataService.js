import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { CustomerProfile } from '../models/CustomerProfile.js';
import { ServiceProvider } from '../models/ServiceProvider.js';
import { ServiceCategory } from '../models/ServiceCategory.js';
import { Service } from '../models/Service.js';
import { Booking } from '../models/Booking.js';
import { BookingStatusHistory } from '../models/BookingStatusHistory.js';
import { Review } from '../models/Review.js';
import { Notification } from '../models/Notification.js';
import { Report } from '../models/Report.js';
import { getDBStatus } from '../config/db.js';

// Dynamic database collections cache synchronized with MongoDB Atlas
let users = [];
let customerProfiles = [];
let serviceProviders = [];
let serviceCategories = [];
let services = [];
let bookings = [];
let bookingStatusHistory = [];
let reviews = [];
let notifications = [];
let reports = [];

// Populate rich default mock data for standalone/sandbox execution
export const seedInitialData = () => {
  const defaultPasswordHash = bcrypt.hashSync('fixit123', 10);

  users = [
    {
      _id: 'usr_admin_1',
      name: 'System Admin',
      email: 'admin@fixit.com',
      phone: '+880 1800-000001',
      password: defaultPasswordHash,
      role: 'admin',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      created_at: new Date('2025-01-01'),
    },
    {
      _id: 'usr_prov_1',
      name: 'Rahim Uddin',
      email: 'rahim@fixit.com',
      phone: '+880 1711-223344',
      password: defaultPasswordHash,
      role: 'provider',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      created_at: new Date('2025-01-10'),
    },
    {
      _id: 'usr_prov_2',
      name: 'Karim Mostafa',
      email: 'karim@fixit.com',
      phone: '+880 1722-334455',
      password: defaultPasswordHash,
      role: 'provider',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      created_at: new Date('2025-01-15'),
    },
    {
      _id: 'usr_prov_3',
      name: 'Nusrat Jahan',
      email: 'nusrat@fixit.com',
      phone: '+880 1733-445566',
      password: defaultPasswordHash,
      role: 'provider',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      created_at: new Date('2025-02-01'),
    },
    {
      _id: 'usr_cust_1',
      name: 'Tanvir Ahmed',
      email: 'customer@fixit.com',
      phone: '+880 1911-998877',
      password: defaultPasswordHash,
      role: 'customer',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      created_at: new Date('2025-01-20'),
    },
  ];

  serviceProviders = [
    {
      _id: 'sp_1',
      user_id: 'usr_prov_1',
      business_name: 'Rahim Electrical & Wiring Solutions',
      title_role: 'Senior Master Electrician',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      description: 'Over 12 years of hands-on experience in residential rewiring, circuit breaker diagnosis, and commercial appliance installation.',
      verification_status: 'verified',
      location: 'Dhaka (Gulshan, Banani, Dhanmondi)',
      rate_hourly: 800,
      total_bookings: 154,
      average_rating: 4.9,
      created_at: new Date('2025-01-10'),
    },
    {
      _id: 'sp_2',
      user_id: 'usr_prov_2',
      business_name: 'Karim HydroPlumb & Sanitary Works',
      title_role: 'Certified Master Plumber',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      description: 'Specialized in high-pressure leak detection, sanitary fixture installations, water heater repairs, and bathroom plumbing overhauls.',
      verification_status: 'verified',
      location: 'Dhaka (Mirpur, Uttara, Mohakhali)',
      rate_hourly: 750,
      total_bookings: 98,
      average_rating: 4.8,
      created_at: new Date('2025-01-15'),
    },
    {
      _id: 'sp_3',
      user_id: 'usr_prov_3',
      business_name: 'Nusrat CoolTech HVAC & Inverter Care',
      title_role: 'HVAC & Inverter Specialist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      description: 'Certified AC refrigeration and appliance technician offering rapid diagnosis, hydro jet cleaning, gas charging, and PCB repairs.',
      verification_status: 'verified',
      location: 'Chittagong (Agrabad, Nasirabad)',
      rate_hourly: 1200,
      total_bookings: 112,
      average_rating: 5.0,
      created_at: new Date('2025-02-01'),
    },
  ];

  customerProfiles = [
    {
      _id: 'cp_1',
      user_id: 'usr_cust_1',
      address: 'House 42, Road 11, Block D, Banani, Dhaka',
      profile_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      created_at: new Date('2025-01-20'),
    },
  ];

  serviceCategories = [
    {
      _id: 'cat_1',
      category_name: 'Electrical & Power',
      description: 'Wiring, fixtures, circuit breakers, generator connections, and smart lighting.',
      created_at: new Date('2025-01-01'),
    },
    {
      _id: 'cat_2',
      category_name: 'Plumbing & Water',
      description: 'Pipe leaks, drainage clearing, geyser fitting, sanitary wares, and pump repairs.',
      created_at: new Date('2025-01-01'),
    },
    {
      _id: 'cat_3',
      category_name: 'AC & HVAC Maintenance',
      description: 'Inverter AC master servicing, gas refilling, cooling diagnostics, and compressor repairs.',
      created_at: new Date('2025-01-01'),
    },
    {
      _id: 'cat_4',
      category_name: 'Home Appliance Repair',
      description: 'Refrigerator, washing machine, microwave, TV, and induction oven repair.',
      created_at: new Date('2025-01-01'),
    },
    {
      _id: 'cat_5',
      category_name: 'Deep Cleaning & Sanitization',
      description: 'Full house deep cleaning, kitchen degreasing, sofa shampooing, and water tank wash.',
      created_at: new Date('2025-01-01'),
    },
    {
      _id: 'cat_6',
      category_name: 'Tech & Electronics Repair',
      description: 'Laptop chip repair, desktop assembly, CCTV camera installation, and router configuration.',
      created_at: new Date('2025-01-01'),
    },
  ];

  services = [
    {
      _id: 'srv_1',
      provider_id: 'sp_1',
      category_id: 'cat_1',
      title: 'Emergency Short-Circuit Repair & DB Board Inspection',
      description: 'Thorough inspection of trip switches, loose terminals, breaker replacement, and load balancing with warranty.',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      location: 'Dhaka',
      status: 'active',
      created_at: new Date('2025-02-10'),
    },
    {
      _id: 'srv_2',
      provider_id: 'sp_1',
      category_id: 'cat_1',
      title: 'Ceiling Fan, Chandelier & Concealed LED Installation',
      description: 'Safe anchor mounting, cabling, decorative lighting layout, and dimmer switch setups.',
      price: 850,
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      location: 'Dhaka',
      status: 'active',
      created_at: new Date('2025-02-12'),
    },
    {
      _id: 'srv_3',
      provider_id: 'sp_2',
      category_id: 'cat_2',
      title: 'Pipeline Leak Detection & Sanitary Fitting Overhaul',
      description: 'Non-invasive leak diagnosis, pipe replacement, basin mixer faucet repair, and silicone sealing.',
      price: 1500,
      image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
      location: 'Dhaka',
      status: 'active',
      created_at: new Date('2025-02-14'),
    },
    {
      _id: 'srv_4',
      provider_id: 'sp_3',
      category_id: 'cat_3',
      title: 'Inverter Split AC Jet Wash & Refrigerant Gas Top-Up',
      description: 'High pressure hydro-jet coil wash, indoor-outdoor unit cleaning, amp draw test, and genuine refrigerant charging.',
      price: 2200,
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
      location: 'Chittagong',
      status: 'active',
      created_at: new Date('2025-02-15'),
    },
    {
      _id: 'srv_5',
      provider_id: 'sp_2',
      category_id: 'cat_5',
      title: 'Premium Apartment Deep Cleaning & Anti-Bacterial Sanitization',
      description: 'Comprehensive sanitization of floors, kitchen tiles, chimney grease removal, bathroom descaling, and balcony wash.',
      price: 3800,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      location: 'Dhaka',
      status: 'active',
      created_at: new Date('2025-02-18'),
    },
    {
      _id: 'srv_6',
      provider_id: 'sp_3',
      category_id: 'cat_4',
      title: 'Refrigerator Cooling & Inverter PCB Circuit Diagnostics',
      description: 'Thermostat calibration, defrost heater check, compressor relay replacement, and refrigerant leakage seal.',
      price: 1600,
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      location: 'Chittagong',
      status: 'active',
      created_at: new Date('2025-02-20'),
    },
  ];

  bookings = [
    {
      _id: 'bk_1001',
      customer_id: 'usr_cust_1',
      provider_id: 'sp_1',
      service_id: 'srv_1',
      booking_date: new Date(Date.now() - 86400000 * 2),
      status: 'completed',
      notes: 'Please bring testing meter for main breaker panel.',
      created_at: new Date(Date.now() - 86400000 * 3),
    },
    {
      _id: 'bk_1002',
      customer_id: 'usr_cust_1',
      provider_id: 'sp_3',
      service_id: 'srv_4',
      booking_date: new Date(Date.now() + 86400000 * 2),
      status: 'accepted',
      notes: 'Master bedroom split AC needs full hydro cleaning and amp draw test.',
      created_at: new Date(Date.now() - 86400000),
    },
    {
      _id: 'bk_1003',
      customer_id: 'usr_cust_1',
      provider_id: 'sp_2',
      service_id: 'srv_3',
      booking_date: new Date(Date.now() + 86400000 * 3),
      status: 'pending',
      notes: 'Kitchen sink drain leak needs immediate pipe fitting inspection.',
      created_at: new Date(Date.now() - 3600000 * 5),
    },
    {
      _id: 'bk_1004',
      customer_id: 'usr_cust_1',
      provider_id: 'sp_1',
      service_id: 'srv_2',
      booking_date: new Date(Date.now() + 86400000 * 4),
      status: 'pending',
      notes: 'Need chandelier and 3 ceiling fans installed in drawing room.',
      created_at: new Date(Date.now() - 3600000 * 2),
    },
  ];

  bookingStatusHistory = [
    {
      _id: 'bsh_1',
      booking_id: 'bk_1001',
      old_status: 'pending',
      new_status: 'completed',
      changed_at: new Date(Date.now() - 86400000 * 2),
    },
    {
      _id: 'bsh_2',
      booking_id: 'bk_1002',
      old_status: 'pending',
      new_status: 'accepted',
      changed_at: new Date(Date.now() - 3600000 * 12),
    },
    {
      _id: 'bsh_3',
      booking_id: 'bk_1003',
      old_status: '',
      new_status: 'pending',
      changed_at: new Date(Date.now() - 3600000 * 5),
    },
    {
      _id: 'bsh_4',
      booking_id: 'bk_1004',
      old_status: '',
      new_status: 'pending',
      changed_at: new Date(Date.now() - 3600000 * 2),
    },
  ];

  reviews = [
    {
      _id: 'rev_1',
      booking_id: 'bk_1001',
      customer_id: 'usr_cust_1',
      provider_id: 'sp_1',
      rating: 5,
      review: 'Extremely professional and punctual! Identified the short circuit immediately and fixed it safely.',
      created_at: new Date(Date.now() - 86400000 * 2),
    },
  ];

  notifications = [
    {
      _id: 'notif_1',
      user_id: 'usr_cust_1',
      title: 'Booking Completed',
      message: 'Your service request #1001 with Rahim Electrical & Wiring has been completed successfully.',
      type: 'booking',
      is_read: false,
      created_at: new Date(Date.now() - 86400000 * 2),
    },
    {
      _id: 'notif_2',
      user_id: 'usr_admin_1',
      title: 'System Initialized',
      message: 'FIXIT service marketplace system initialized and active in cloud sandbox mode.',
      type: 'system',
      is_read: true,
      created_at: new Date(),
    },
    {
      _id: 'notif_3',
      user_id: 'usr_prov_1',
      title: 'Booking Accepted',
      message: 'You have an active scheduled service booking #1002 from customer Karim Ahmed.',
      type: 'booking',
      is_read: false,
      created_at: new Date(Date.now() - 3600000 * 12),
    },
  ];

  reports = [];
};

// Initialize seed data on load
seedInitialData();

// Load and synchronize data directly from MongoDB Atlas
export const loadFromMongoDB = async () => {
  if (!getDBStatus()) return;
  try {
    const dbUsers = await User.find().lean();
    if (dbUsers.length) users = dbUsers.map((u) => ({ ...u, _id: String(u._id) }));

    const dbProfiles = await CustomerProfile.find().lean();
    if (dbProfiles.length) customerProfiles = dbProfiles.map((p) => ({ ...p, _id: String(p._id) }));

    const dbProviders = await ServiceProvider.find().lean();
    if (dbProviders.length) serviceProviders = dbProviders.map((p) => ({ ...p, _id: String(p._id) }));

    const dbCategories = await ServiceCategory.find().lean();
    if (dbCategories.length) serviceCategories = dbCategories.map((c) => ({ ...c, _id: String(c._id) }));

    const dbServices = await Service.find().lean();
    if (dbServices.length) services = dbServices.map((s) => ({ ...s, _id: String(s._id) }));

    const dbBookings = await Booking.find().lean();
    if (dbBookings.length) bookings = dbBookings.map((b) => ({ ...b, _id: String(b._id) }));

    const dbStatusHist = await BookingStatusHistory.find().lean();
    if (dbStatusHist.length) bookingStatusHistory = dbStatusHist.map((h) => ({ ...h, _id: String(h._id) }));

    const dbReviews = await Review.find().lean();
    if (dbReviews.length) reviews = dbReviews.map((r) => ({ ...r, _id: String(r._id) }));

    const dbNotifs = await Notification.find().lean();
    if (dbNotifs.length) notifications = dbNotifs.map((n) => ({ ...n, _id: String(n._id) }));

    const dbReports = await Report.find().lean();
    if (dbReports.length) reports = dbReports.map((r) => ({ ...r, _id: String(r._id) }));

    console.log(`✅ Synchronized from MongoDB Atlas: ${users.length} users, ${services.length} services, ${serviceProviders.length} providers, ${serviceCategories.length} categories, ${bookings.length} bookings.`);
  } catch (err) {
    console.warn('MongoDB Data Load Warning:', err.message);
  }
};

// Unified Data Store & Database Operations
export const dbStore = {
  get users() { return users; },
  get customerProfiles() { return customerProfiles; },
  get serviceProviders() { return serviceProviders; },
  get serviceCategories() { return serviceCategories; },
  get services() { return services; },
  get bookings() { return bookings; },
  get bookingStatusHistory() { return bookingStatusHistory; },
  get reviews() { return reviews; },
  get notifications() { return notifications; },
  get reports() { return reports; },

  // User methods
  async findUserByEmail(email) {
    const emailNorm = (email || '').toLowerCase().trim();
    let u = users.find((usr) => usr.email && usr.email.toLowerCase() === emailNorm);
    if (u) return u;

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      try {
        const doc = await User.findOne({ email: emailNorm }).lean();
        if (doc) {
          u = { ...doc, _id: String(doc._id) };
          users.push(u);
          return u;
        }
      } catch (err) {}
    }
    return null;
  },

  async findUserById(id) {
    if (!id) return null;
    let u = users.find((usr) => String(usr._id) === String(id));
    if (u) return u;

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      try {
        let doc = null;
        if (mongoose.isValidObjectId(id)) {
          doc = await User.findById(id).lean();
        } else {
          doc = await User.findOne({ _id: id }).lean();
        }
        if (doc) {
          u = { ...doc, _id: String(doc._id) };
          users.push(u);
          return u;
        }
      } catch (err) {}
    }
    return null;
  },

  async createUser(userData) {
    const newUser = {
      _id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      ...userData,
      email: (userData.email || '').toLowerCase().trim(),
      status: userData.status || 'active',
      created_at: new Date(),
    };

    users.push(newUser);

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      User.create({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
        role: newUser.role,
        status: newUser.status,
        avatar: newUser.avatar || '',
      }).catch((err) => {
        console.warn('Background MongoDB User creation note:', err.message);
      });
    }

    return newUser;
  },

  async updateUser(id, updates) {
    const idx = users.findIndex((u) => String(u._id) === String(id));
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates, updated_at: new Date() };
    }

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      if (mongoose.isValidObjectId(id)) {
        User.findByIdAndUpdate(id, updates).catch(() => {});
      } else {
        User.findOneAndUpdate({ _id: id }, updates).catch(() => {});
      }
    }

    return idx !== -1 ? users[idx] : null;
  },

  async deleteUser(id) {
    const idx = users.findIndex((u) => String(u._id) === String(id));
    if (idx !== -1) {
      users.splice(idx, 1);
    }

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      if (mongoose.isValidObjectId(id)) {
        User.findByIdAndDelete(id).catch(() => {});
      } else {
        User.findOneAndDelete({ _id: id }).catch(() => {});
      }
    }

    return idx !== -1;
  },

  // Customer Profile
  async getCustomerProfileByUserId(userId) {
    let cp = customerProfiles.find((p) => String(p.user_id) === String(userId));
    if (cp) return cp;

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      try {
        const dbCp = await CustomerProfile.findOne({ user_id: userId }).lean();
        if (dbCp) {
          cp = { ...dbCp, _id: String(dbCp._id) };
          customerProfiles.push(cp);
          return cp;
        }
      } catch (err) {}
    }
    return null;
  },

  async saveCustomerProfile(userId, data) {
    let cp = customerProfiles.find((p) => String(p.user_id) === String(userId));
    if (cp) {
      Object.assign(cp, data, { updated_at: new Date() });
    } else {
      cp = {
        _id: 'cp_' + Date.now(),
        user_id: userId,
        address: data.address || '',
        profile_image: data.profile_image || '',
        created_at: new Date(),
      };
      customerProfiles.push(cp);
    }

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      CustomerProfile.findOneAndUpdate(
        { user_id: userId },
        { ...data, updated_at: new Date() },
        { upsert: true, new: true }
      ).catch((err) => {
        console.warn('Background CustomerProfile save note:', err.message);
      });
    }

    return cp;
  },

  // Provider methods
  async getProviderByUserId(userId) {
    let sp = serviceProviders.find((p) => String(p.user_id) === String(userId));
    if (sp) return sp;

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      try {
        const dbSp = await ServiceProvider.findOne({ user_id: userId }).lean();
        if (dbSp) {
          sp = { ...dbSp, _id: String(dbSp._id) };
          serviceProviders.push(sp);
          return sp;
        }
      } catch (err) {}
    }
    return null;
  },

  async getProviderById(id) {
    let sp = serviceProviders.find((p) => String(p._id) === String(id));
    if (sp) {
      const u = users.find((usr) => String(usr._id) === String(sp.user_id));
      return {
        ...sp,
        user: u ? { _id: u._id, name: u.name, email: u.email, phone: u.phone } : null,
      };
    }

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      try {
        let dbSp = null;
        if (mongoose.isValidObjectId(id)) {
          dbSp = await ServiceProvider.findById(id).lean();
        } else {
          dbSp = await ServiceProvider.findOne({ _id: id }).lean();
        }
        if (dbSp) {
          sp = { ...dbSp, _id: String(dbSp._id) };
          serviceProviders.push(sp);
          const u = await this.findUserById(sp.user_id);
          return {
            ...sp,
            user: u ? { _id: u._id, name: u.name, email: u.email, phone: u.phone } : null,
          };
        }
      } catch (err) {}
    }

    return null;
  },

  async saveServiceProvider(userId, data) {
    let sp = serviceProviders.find((p) => String(p.user_id) === String(userId));
    if (sp) {
      Object.assign(sp, data, { updated_at: new Date() });
    } else {
      sp = {
        _id: 'sp_' + Date.now(),
        user_id: userId,
        business_name: data.business_name || '',
        title_role: data.title_role || 'Verified Specialist',
        avatar: data.avatar || '',
        description: data.description || '',
        verification_status: data.verification_status || 'pending',
        location: data.location || '',
        rate_hourly: data.rate_hourly || 1000,
        total_bookings: 0,
        average_rating: 5.0,
        created_at: new Date(),
      };
      serviceProviders.push(sp);
    }

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      ServiceProvider.findOneAndUpdate(
        { user_id: userId },
        { ...data, updated_at: new Date() },
        { upsert: true, new: true }
      ).catch((err) => {
        console.warn('Background ServiceProvider save note:', err.message);
      });
    }

    return sp;
  },

  async updateProviderVerification(idOrUserId, status) {
    let sp = serviceProviders.find(
      (p) => String(p._id) === String(idOrUserId) || String(p.user_id) === String(idOrUserId)
    );

    if (!sp && getDBStatus() && mongoose.connection.readyState === 1) {
      try {
        let dbSp = null;
        if (mongoose.isValidObjectId(idOrUserId)) {
          dbSp = await ServiceProvider.findById(idOrUserId).lean();
        } else {
          dbSp = await ServiceProvider.findOne({ user_id: idOrUserId }).lean();
        }
        if (dbSp) {
          sp = { ...dbSp, _id: String(dbSp._id) };
          serviceProviders.push(sp);
        }
      } catch (e) {}
    }

    if (!sp) return null;

    sp.verification_status = status;
    sp.updated_at = new Date();

    const u = users.find((usr) => String(usr._id) === String(sp.user_id));
    // If verified, ensure the user role is provider
    if (status === 'verified') {
      if (u) {
        u.role = 'provider';
      }
      if (getDBStatus() && mongoose.connection.readyState === 1) {
        User.findOneAndUpdate({ _id: sp.user_id }, { role: 'provider' }).catch(() => {});
      }
    }

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      if (mongoose.isValidObjectId(sp._id)) {
        ServiceProvider.findByIdAndUpdate(sp._id, {
          verification_status: status,
          updated_at: new Date(),
        }).catch(() => {});
      } else {
        ServiceProvider.findOneAndUpdate(
          { user_id: sp.user_id },
          { verification_status: status, updated_at: new Date() }
        ).catch(() => {});
      }
    }

    return {
      ...sp,
      user: u ? { _id: u._id, name: u.name, email: u.email, phone: u.phone } : null,
    };
  },

  async getAllProviders() {
    return serviceProviders.map((sp) => {
      const u = users.find((usr) => String(usr._id) === String(sp.user_id));
      return {
        ...sp,
        user: u ? { _id: u._id, name: u.name, email: u.email, phone: u.phone } : null,
      };
    });
  },

  // Categories
  async getCategories() {
    if (serviceCategories.length > 0) {
      return [...serviceCategories];
    }
    if (getDBStatus() && mongoose.connection.readyState === 1) {
      try {
        const list = await ServiceCategory.find().lean();
        if (list.length) {
          serviceCategories = list.map((c) => ({ ...c, _id: String(c._id) }));
          return [...serviceCategories];
        }
      } catch (err) {}
    }
    return [...serviceCategories];
  },

  async createCategory(data) {
    const newCat = {
      _id: 'cat_' + Date.now(),
      category_name: data.category_name,
      description: data.description || '',
      created_at: new Date(),
    };

    serviceCategories.push(newCat);

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      ServiceCategory.create(newCat).catch(() => {});
    }

    return newCat;
  },

  // Services
  async getServices({ search, category, providerId, minPrice, maxPrice, location, status } = {}) {
    // Build quick lookup map for providers, users and categories
    const userMap = new Map();
    for (let i = 0; i < users.length; i++) {
      userMap.set(String(users[i]._id), users[i]);
    }

    const providerMap = new Map();
    for (let i = 0; i < serviceProviders.length; i++) {
      providerMap.set(String(serviceProviders[i]._id), serviceProviders[i]);
    }

    const categoryMap = new Map();
    for (let i = 0; i < serviceCategories.length; i++) {
      categoryMap.set(String(serviceCategories[i]._id), serviceCategories[i]);
    }

    const targetStatus = status || 'active';
    const q = search ? search.toLowerCase().trim() : null;
    const catQuery = category ? category.toLowerCase().trim() : null;
    const locQuery = location ? location.toLowerCase().trim() : null;
    const minP = minPrice !== undefined && minPrice !== '' ? parseFloat(minPrice) : null;
    const maxP = maxPrice !== undefined && maxPrice !== '' ? parseFloat(maxPrice) : null;

    const results = [];

    for (let i = 0; i < services.length; i++) {
      const s = services[i];

      // Quick filter checks before object construction
      if (s.status !== targetStatus) continue;
      if (providerId && String(s.provider_id) !== String(providerId)) continue;
      if (minP !== null && s.price < minP) continue;
      if (maxP !== null && s.price > maxP) continue;

      const sp = providerMap.get(String(s.provider_id));
      const spUser = sp ? userMap.get(String(sp.user_id)) : null;
      const cat = categoryMap.get(String(s.category_id));

      if (catQuery) {
        const matchId = String(s.category_id) === String(category);
        const matchName = cat && cat.category_name.toLowerCase() === catQuery;
        if (!matchId && !matchName) continue;
      }

      if (locQuery) {
        const sLocMatch = s.location && s.location.toLowerCase().includes(locQuery);
        const pLocMatch = sp && sp.location && sp.location.toLowerCase().includes(locQuery);
        if (!sLocMatch && !pLocMatch) continue;
      }

      if (q) {
        const tMatch = s.title && s.title.toLowerCase().includes(q);
        const dMatch = s.description && s.description.toLowerCase().includes(q);
        const cMatch = cat && cat.category_name.toLowerCase().includes(q);
        const bMatch = sp && sp.business_name.toLowerCase().includes(q);
        const lMatch = s.location && s.location.toLowerCase().includes(q);
        if (!tMatch && !dMatch && !cMatch && !bMatch && !lMatch) continue;
      }

      results.push({
        ...s,
        provider: sp
          ? {
              _id: sp._id,
              business_name: sp.business_name,
              title_role: sp.title_role || 'Verified Specialist',
              avatar: sp.avatar || spUser?.avatar || '',
              location: sp.location,
              verification_status: sp.verification_status,
              average_rating: sp.average_rating || 5.0,
              user: spUser ? { _id: spUser._id, name: spUser.name, phone: spUser.phone } : null,
            }
          : null,
        category: cat ? { _id: cat._id, category_name: cat.category_name } : null,
      });
    }

    return results;
  },

  async getServiceById(id) {
    const s = services.find((srv) => String(srv._id) === String(id));
    if (!s) return null;
    const sp = serviceProviders.find((p) => String(p._id) === String(s.provider_id));
    const spUser = sp ? users.find((u) => String(u._id) === String(sp.user_id)) : null;
    const cat = serviceCategories.find((c) => String(c._id) === String(s.category_id));

    return {
      ...s,
      provider: sp
        ? {
            _id: sp._id,
            business_name: sp.business_name,
            title_role: sp.title_role || 'Verified Specialist',
            avatar: sp.avatar || spUser?.avatar || '',
            location: sp.location,
            verification_status: sp.verification_status,
            average_rating: sp.average_rating || 5.0,
            user: spUser ? { _id: spUser._id, name: spUser.name, phone: spUser.phone } : null,
          }
        : null,
      category: cat ? { _id: cat._id, category_name: cat.category_name } : null,
    };
  },

  async createService(data) {
    const newService = {
      _id: 'srv_' + Date.now(),
      provider_id: data.provider_id,
      category_id: data.category_id,
      title: data.title,
      description: data.description || '',
      price: Number(data.price),
      image: data.image || '',
      location: data.location || '',
      status: data.status || 'active',
      created_at: new Date(),
    };

    services.push(newService);

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      Service.create(newService).catch(() => {});
    }

    return this.getServiceById(newService._id);
  },

  async updateService(id, updates) {
    const idx = services.findIndex((s) => String(s._id) === String(id));
    if (idx === -1) return null;
    services[idx] = { ...services[idx], ...updates, updated_at: new Date() };

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      if (mongoose.isValidObjectId(id)) {
        Service.findByIdAndUpdate(id, updates).catch(() => {});
      } else {
        Service.findOneAndUpdate({ _id: id }, updates).catch(() => {});
      }
    }

    return this.getServiceById(id);
  },

  async deleteService(id) {
    const idx = services.findIndex((s) => String(s._id) === String(id));
    if (idx === -1) return false;
    services.splice(idx, 1);

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      if (mongoose.isValidObjectId(id)) {
        Service.findByIdAndDelete(id).catch(() => {});
      } else {
        Service.findOneAndDelete({ _id: id }).catch(() => {});
      }
    }

    return true;
  },

  // Bookings
  async getBookings({ customerId, providerId, status } = {}) {
    const userMap = new Map();
    for (let i = 0; i < users.length; i++) {
      userMap.set(String(users[i]._id), users[i]);
    }

    const providerMap = new Map();
    for (let i = 0; i < serviceProviders.length; i++) {
      providerMap.set(String(serviceProviders[i]._id), serviceProviders[i]);
    }

    const serviceMap = new Map();
    for (let i = 0; i < services.length; i++) {
      serviceMap.set(String(services[i]._id), services[i]);
    }

    const categoryMap = new Map();
    for (let i = 0; i < serviceCategories.length; i++) {
      categoryMap.set(String(serviceCategories[i]._id), serviceCategories[i]);
    }

    const reviewMap = new Map();
    for (let i = 0; i < reviews.length; i++) {
      reviewMap.set(String(reviews[i].booking_id), reviews[i]);
    }

    const historyByBooking = new Map();
    for (let i = 0; i < bookingStatusHistory.length; i++) {
      const h = bookingStatusHistory[i];
      const bId = String(h.booking_id);
      if (!historyByBooking.has(bId)) {
        historyByBooking.set(bId, []);
      }
      historyByBooking.get(bId).push(h);
    }

    const cId = customerId ? String(customerId) : null;
    const pId = providerId ? String(providerId) : null;
    const isAcceptedFilter = status === 'accepted';

    const results = [];

    for (let i = 0; i < bookings.length; i++) {
      const b = bookings[i];

      if (cId && String(b.customer_id) !== cId) continue;
      if (pId && String(b.provider_id) !== pId) continue;

      if (status && status !== 'all') {
        if (isAcceptedFilter) {
          if (b.status !== 'accepted' && b.status !== 'confirmed') continue;
        } else if (b.status !== status) {
          continue;
        }
      }

      const cust = userMap.get(String(b.customer_id));
      const prov = providerMap.get(String(b.provider_id));
      const provUser = prov ? userMap.get(String(prov.user_id)) : null;
      const srv = serviceMap.get(String(b.service_id));
      const cat = srv ? categoryMap.get(String(srv.category_id)) : null;
      const rev = reviewMap.get(String(b._id));
      const history = historyByBooking.get(String(b._id)) || [];

      results.push({
        ...b,
        customer: cust
          ? {
              _id: cust._id,
              name: cust.name,
              email: cust.email,
              phone: cust.phone,
              avatar: cust.avatar || '',
            }
          : null,
        provider: prov
          ? {
              _id: prov._id,
              business_name: prov.business_name,
              title_role: prov.title_role || 'Verified Specialist',
              location: prov.location,
              avatar: prov.avatar || provUser?.avatar || '',
              user: provUser ? { _id: provUser._id, name: provUser.name, phone: provUser.phone } : null,
            }
          : null,
        service: srv
          ? {
              _id: srv._id,
              title: srv.title,
              price: srv.price,
              image: srv.image || '',
              category: cat ? cat.category_name : '',
            }
          : null,
        review: rev || null,
        history,
      });
    }

    return results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getBookingById(id) {
    const bList = await this.getBookings();
    return bList.find((b) => String(b._id) === String(id)) || null;
  },

  async createBooking(data) {
    const newBk = {
      _id: 'bk_' + Date.now(),
      customer_id: data.customer_id,
      provider_id: data.provider_id,
      service_id: data.service_id,
      booking_date: data.booking_date ? new Date(data.booking_date) : new Date(),
      status: 'pending',
      notes: data.notes || '',
      created_at: new Date(),
    };

    bookings.push(newBk);

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      Booking.create(newBk).catch(() => {});
    }

    const historyItem = {
      _id: 'bsh_' + Date.now(),
      booking_id: newBk._id,
      old_status: '',
      new_status: 'pending',
      changed_at: new Date(),
    };
    bookingStatusHistory.push(historyItem);

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      BookingStatusHistory.create(historyItem).catch(() => {});
    }

    const prov = serviceProviders.find((p) => String(p._id) === String(data.provider_id));
    if (prov) {
      // Notify Provider
      this.createNotification({
        user_id: prov.user_id,
        title: 'New Service Booking Request',
        message: `You have received a new booking request for service #${newBk._id.slice(-5)}.`,
        type: 'booking',
      });
    }

    // Notify Customer
    this.createNotification({
      user_id: data.customer_id,
      title: 'Booking Request Placed',
      message: `Your booking request #${newBk._id.slice(-5)} has been sent and is awaiting provider confirmation.`,
      type: 'booking',
    });

    return this.getBookingById(newBk._id);
  },

  async updateBookingStatus(id, newStatus) {
    const bk = bookings.find((b) => String(b._id) === String(id));
    if (!bk) return null;
    const oldStatus = bk.status;
    bk.status = newStatus;
    bk.updated_at = new Date();

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      if (mongoose.isValidObjectId(id)) {
        Booking.findByIdAndUpdate(id, { status: newStatus }).catch(() => {});
      } else {
        Booking.findOneAndUpdate({ _id: id }, { status: newStatus }).catch(() => {});
      }
    }

    const historyItem = {
      _id: 'bsh_' + Date.now(),
      booking_id: bk._id,
      old_status: oldStatus,
      new_status: newStatus,
      changed_at: new Date(),
    };
    bookingStatusHistory.push(historyItem);

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      BookingStatusHistory.create(historyItem).catch(() => {});
    }

    // Notify Customer
    this.createNotification({
      user_id: bk.customer_id,
      title: `Booking Status Update: ${newStatus.toUpperCase()}`,
      message: `Your booking #${bk._id.slice(-5)} status has been updated to "${newStatus}".`,
      type: 'booking',
    });

    // Notify Provider
    const prov = serviceProviders.find((p) => String(p._id) === String(bk.provider_id));
    if (prov && prov.user_id) {
      this.createNotification({
        user_id: prov.user_id,
        title: `Booking Status: ${newStatus.toUpperCase()}`,
        message: `Booking #${bk._id.slice(-5)} status has been updated to "${newStatus}".`,
        type: 'booking',
      });
    }

    return this.getBookingById(id);
  },

  // Reviews
  async createReview(data) {
    const newRev = {
      _id: 'rev_' + Date.now(),
      booking_id: data.booking_id,
      customer_id: data.customer_id,
      provider_id: data.provider_id,
      rating: Number(data.rating),
      review: data.review || '',
      created_at: new Date(),
    };

    reviews.push(newRev);

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      Review.create(newRev).catch(() => {});
    }

    const providerRevs = reviews.filter((r) => String(r.provider_id) === String(data.provider_id));
    const avg = providerRevs.reduce((acc, curr) => acc + curr.rating, 0) / (providerRevs.length || 1);
    const prov = serviceProviders.find((p) => String(p._id) === String(data.provider_id));
    if (prov) {
      prov.average_rating = parseFloat(avg.toFixed(2));
      if (getDBStatus() && mongoose.connection.readyState === 1) {
        if (mongoose.isValidObjectId(prov._id)) {
          ServiceProvider.findByIdAndUpdate(prov._id, { average_rating: prov.average_rating }).catch(() => {});
        } else {
          ServiceProvider.findOneAndUpdate({ _id: prov._id }, { average_rating: prov.average_rating }).catch(() => {});
        }
      }

      this.createNotification({
        user_id: prov.user_id,
        title: 'New Review Received',
        message: `A customer rated you ${data.rating} stars for booking #${String(data.booking_id).slice(-5)}.`,
        type: 'review',
      });
    }

    return newRev;
  },

  async getReviewsByProvider(providerId) {
    return reviews
      .filter((r) => String(r.provider_id) === String(providerId))
      .map((r) => {
        const cust = users.find((u) => String(u._id) === String(r.customer_id));
        return {
          ...r,
          customer: cust ? { _id: cust._id, name: cust.name } : null,
        };
      });
  },

  // Notifications
  async getNotifications(userId) {
    return notifications
      .filter((n) => String(n.user_id) === String(userId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async createNotification(data) {
    const notif = {
      _id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      user_id: data.user_id,
      title: data.title,
      message: data.message,
      type: data.type || 'system',
      is_read: false,
      created_at: new Date(),
    };

    notifications.push(notif);

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      Notification.create(notif).catch(() => {});
    }

    return notif;
  },

  async markNotificationRead(id, userId) {
    const n = notifications.find((notif) => String(notif._id) === String(id) && String(notif.user_id) === String(userId));
    if (n) {
      n.is_read = true;
      if (getDBStatus() && mongoose.connection.readyState === 1) {
        if (mongoose.isValidObjectId(id)) {
          Notification.findByIdAndUpdate(id, { is_read: true }).catch(() => {});
        } else {
          Notification.findOneAndUpdate({ _id: id }, { is_read: true }).catch(() => {});
        }
      }
    }
    return n;
  },

  async markAllNotificationsRead(userId) {
    notifications.forEach((n) => {
      if (String(n.user_id) === String(userId)) {
        n.is_read = true;
      }
    });
    if (getDBStatus() && mongoose.connection.readyState === 1) {
      Notification.updateMany({ user_id: userId }, { is_read: true }).catch(() => {});
    }
    return true;
  },

  // Reports
  async createReport(data) {
    const rep = {
      _id: 'rep_' + Date.now(),
      reporter_id: data.reporter_id,
      reported_user_id: data.reported_user_id,
      reason: data.reason,
      status: 'pending',
      created_at: new Date(),
    };

    reports.push(rep);

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      Report.create(rep).catch(() => {});
    }

    return rep;
  },

  async getReports() {
    return reports.map((r) => {
      const reporter = users.find((u) => String(u._id) === String(r.reporter_id));
      const reported = users.find((u) => String(u._id) === String(r.reported_user_id));
      return {
        ...r,
        reporter: reporter ? { _id: reporter._id, name: reporter.name, email: reporter.email } : null,
        reported_user: reported ? { _id: reported._id, name: reported.name, email: reported.email } : null,
      };
    });
  },

  async updateReportStatus(id, status) {
    const rep = reports.find((r) => String(r._id) === String(id));
    if (!rep) return null;
    rep.status = status;
    rep.updated_at = new Date();

    if (getDBStatus() && mongoose.connection.readyState === 1) {
      if (mongoose.isValidObjectId(id)) {
        Report.findByIdAndUpdate(id, { status, updated_at: new Date() }).catch(() => {});
      } else {
        Report.findOneAndUpdate({ _id: id }, { status, updated_at: new Date() }).catch(() => {});
      }
    }

    return rep;
  },
};
