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
    if (getDBStatus()) {
      try {
        const doc = await User.findOne({ email: emailNorm }).lean();
        if (doc) return { ...doc, _id: String(doc._id) };
      } catch (err) {}
    }
    return users.find((u) => u.email && u.email.toLowerCase() === emailNorm) || null;
  },

  async findUserById(id) {
    if (!id) return null;
    if (getDBStatus()) {
      try {
        let doc = null;
        if (mongoose.isValidObjectId(id)) {
          doc = await User.findById(id).lean();
        } else {
          doc = await User.findOne({ _id: id }).lean();
        }
        if (doc) return { ...doc, _id: String(doc._id) };
      } catch (err) {}
    }
    return users.find((u) => String(u._id) === String(id)) || null;
  },

  async createUser(userData) {
    const newUser = {
      _id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      ...userData,
      email: (userData.email || '').toLowerCase().trim(),
      status: userData.status || 'active',
      created_at: new Date(),
    };

    if (getDBStatus()) {
      try {
        const saved = await User.create({
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          password: newUser.password,
          role: newUser.role,
          status: newUser.status,
          avatar: newUser.avatar || '',
        });
        newUser._id = String(saved._id);
      } catch (err) {
        console.warn('MongoDB User creation fallback:', err.message);
      }
    }

    users.push(newUser);
    return newUser;
  },

  async updateUser(id, updates) {
    if (getDBStatus()) {
      try {
        if (mongoose.isValidObjectId(id)) {
          await User.findByIdAndUpdate(id, updates);
        } else {
          await User.findOneAndUpdate({ _id: id }, updates);
        }
      } catch (err) {
        console.warn('MongoDB updateUser note:', err.message);
      }
    }

    const idx = users.findIndex((u) => String(u._id) === String(id));
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates, updated_at: new Date() };
      return users[idx];
    }
    return null;
  },

  async deleteUser(id) {
    if (getDBStatus()) {
      try {
        if (mongoose.isValidObjectId(id)) {
          await User.findByIdAndDelete(id);
        } else {
          await User.findOneAndDelete({ _id: id });
        }
      } catch (err) {}
    }
    const idx = users.findIndex((u) => String(u._id) === String(id));
    if (idx === -1) return false;
    users.splice(idx, 1);
    return true;
  },

  // Customer Profile
  async getCustomerProfileByUserId(userId) {
    if (getDBStatus()) {
      try {
        const cp = await CustomerProfile.findOne({ user_id: userId }).lean();
        if (cp) return { ...cp, _id: String(cp._id) };
      } catch (err) {}
    }
    return customerProfiles.find((cp) => String(cp.user_id) === String(userId)) || null;
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

    if (getDBStatus()) {
      try {
        await CustomerProfile.findOneAndUpdate(
          { user_id: userId },
          { ...data, updated_at: new Date() },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.warn('MongoDB CustomerProfile save note:', err.message);
      }
    }

    return cp;
  },

  // Provider methods
  async getProviderByUserId(userId) {
    if (getDBStatus()) {
      try {
        const sp = await ServiceProvider.findOne({ user_id: userId }).lean();
        if (sp) return { ...sp, _id: String(sp._id) };
      } catch (err) {}
    }
    return serviceProviders.find((sp) => String(sp.user_id) === String(userId)) || null;
  },

  async getProviderById(id) {
    if (getDBStatus()) {
      try {
        let sp = null;
        if (mongoose.isValidObjectId(id)) {
          sp = await ServiceProvider.findById(id).lean();
        } else {
          sp = await ServiceProvider.findOne({ _id: id }).lean();
        }
        if (sp) {
          const u = await this.findUserById(sp.user_id);
          return {
            ...sp,
            _id: String(sp._id),
            user: u ? { _id: u._id, name: u.name, email: u.email, phone: u.phone } : null,
          };
        }
      } catch (err) {}
    }

    const sp = serviceProviders.find((p) => String(p._id) === String(id));
    if (!sp) return null;
    const u = users.find((usr) => String(usr._id) === String(sp.user_id));
    return {
      ...sp,
      user: u ? { _id: u._id, name: u.name, email: u.email, phone: u.phone } : null,
    };
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

    if (getDBStatus()) {
      try {
        await ServiceProvider.findOneAndUpdate(
          { user_id: userId },
          { ...data, updated_at: new Date() },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.warn('MongoDB ServiceProvider save note:', err.message);
      }
    }

    return sp;
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
    if (getDBStatus()) {
      try {
        const list = await ServiceCategory.find().lean();
        if (list.length) return list.map((c) => ({ ...c, _id: String(c._id) }));
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
    if (getDBStatus()) {
      try {
        await ServiceCategory.create(newCat);
      } catch (err) {}
    }
    serviceCategories.push(newCat);
    return newCat;
  },

  // Services
  async getServices({ search, category, providerId, minPrice, maxPrice, location, status } = {}) {
    let list = services.map((s) => {
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
    });

    if (status) {
      list = list.filter((s) => s.status === status);
    } else {
      list = list.filter((s) => s.status === 'active');
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          (s.category && s.category.category_name.toLowerCase().includes(q)) ||
          (s.provider && s.provider.business_name.toLowerCase().includes(q)) ||
          (s.location && s.location.toLowerCase().includes(q))
      );
    }

    if (category) {
      list = list.filter(
        (s) =>
          String(s.category_id) === String(category) ||
          (s.category && s.category.category_name.toLowerCase() === category.toLowerCase())
      );
    }

    if (providerId) {
      list = list.filter((s) => String(s.provider_id) === String(providerId));
    }

    if (location) {
      const loc = location.toLowerCase();
      list = list.filter((s) => (s.location && s.location.toLowerCase().includes(loc)) || (s.provider && s.provider.location && s.provider.location.toLowerCase().includes(loc)));
    }

    if (minPrice !== undefined && minPrice !== '') {
      list = list.filter((s) => s.price >= parseFloat(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      list = list.filter((s) => s.price <= parseFloat(maxPrice));
    }

    return list;
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

    if (getDBStatus()) {
      try {
        await Service.create(newService);
      } catch (err) {}
    }

    services.push(newService);
    return this.getServiceById(newService._id);
  },

  async updateService(id, updates) {
    if (getDBStatus()) {
      try {
        if (mongoose.isValidObjectId(id)) {
          await Service.findByIdAndUpdate(id, updates);
        } else {
          await Service.findOneAndUpdate({ _id: id }, updates);
        }
      } catch (err) {}
    }

    const idx = services.findIndex((s) => String(s._id) === String(id));
    if (idx === -1) return null;
    services[idx] = { ...services[idx], ...updates, updated_at: new Date() };
    return this.getServiceById(id);
  },

  async deleteService(id) {
    if (getDBStatus()) {
      try {
        if (mongoose.isValidObjectId(id)) {
          await Service.findByIdAndDelete(id);
        } else {
          await Service.findOneAndDelete({ _id: id });
        }
      } catch (err) {}
    }

    const idx = services.findIndex((s) => String(s._id) === String(id));
    if (idx === -1) return false;
    services.splice(idx, 1);
    return true;
  },

  // Bookings
  async getBookings({ customerId, providerId, status } = {}) {
    let list = bookings.map((b) => {
      const cust = users.find((u) => String(u._id) === String(b.customer_id));
      const prov = serviceProviders.find((p) => String(p._id) === String(b.provider_id));
      const provUser = prov ? users.find((u) => String(u._id) === String(prov.user_id)) : null;
      const srv = services.find((s) => String(s._id) === String(b.service_id));
      const cat = srv ? serviceCategories.find((c) => String(c._id) === String(srv.category_id)) : null;
      const rev = reviews.find((r) => String(r.booking_id) === String(b._id));
      const history = bookingStatusHistory
        .filter((h) => String(h.booking_id) === String(b._id))
        .sort((a, b) => new Date(a.changed_at) - new Date(b.changed_at));

      return {
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
      };
    });

    if (customerId) {
      list = list.filter((b) => String(b.customer_id) === String(customerId));
    }

    if (providerId) {
      list = list.filter((b) => String(b.provider_id) === String(providerId));
    }

    if (status) {
      list = list.filter((b) => b.status === status);
    }

    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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

    if (getDBStatus()) {
      try {
        await Booking.create(newBk);
      } catch (err) {}
    }

    bookings.push(newBk);

    const historyItem = {
      _id: 'bsh_' + Date.now(),
      booking_id: newBk._id,
      old_status: '',
      new_status: 'pending',
      changed_at: new Date(),
    };
    bookingStatusHistory.push(historyItem);
    if (getDBStatus()) {
      try {
        await BookingStatusHistory.create(historyItem);
      } catch (err) {}
    }

    const prov = serviceProviders.find((p) => String(p._id) === String(data.provider_id));
    if (prov) {
      await this.createNotification({
        user_id: prov.user_id,
        title: 'New Service Booking Request',
        message: `You have received a new booking request for service #${newBk._id.slice(-5)}.`,
        type: 'booking',
      });
    }

    return this.getBookingById(newBk._id);
  },

  async updateBookingStatus(id, newStatus) {
    const bk = bookings.find((b) => String(b._id) === String(id));
    if (!bk) return null;
    const oldStatus = bk.status;
    bk.status = newStatus;
    bk.updated_at = new Date();

    if (getDBStatus()) {
      try {
        if (mongoose.isValidObjectId(id)) {
          await Booking.findByIdAndUpdate(id, { status: newStatus });
        } else {
          await Booking.findOneAndUpdate({ _id: id }, { status: newStatus });
        }
      } catch (err) {}
    }

    const historyItem = {
      _id: 'bsh_' + Date.now(),
      booking_id: bk._id,
      old_status: oldStatus,
      new_status: newStatus,
      changed_at: new Date(),
    };
    bookingStatusHistory.push(historyItem);
    if (getDBStatus()) {
      try {
        await BookingStatusHistory.create(historyItem);
      } catch (err) {}
    }

    await this.createNotification({
      user_id: bk.customer_id,
      title: `Booking Status Update: ${newStatus.toUpperCase()}`,
      message: `Your booking #${bk._id.slice(-5)} status has been updated to "${newStatus}".`,
      type: 'booking',
    });

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

    if (getDBStatus()) {
      try {
        await Review.create(newRev);
      } catch (err) {}
    }

    reviews.push(newRev);

    const providerRevs = reviews.filter((r) => String(r.provider_id) === String(data.provider_id));
    const avg = providerRevs.reduce((acc, curr) => acc + curr.rating, 0) / (providerRevs.length || 1);
    const prov = serviceProviders.find((p) => String(p._id) === String(data.provider_id));
    if (prov) {
      prov.average_rating = parseFloat(avg.toFixed(2));
      if (getDBStatus()) {
        try {
          if (mongoose.isValidObjectId(prov._id)) {
            await ServiceProvider.findByIdAndUpdate(prov._id, { average_rating: prov.average_rating });
          } else {
            await ServiceProvider.findOneAndUpdate({ _id: prov._id }, { average_rating: prov.average_rating });
          }
        } catch (err) {}
      }

      await this.createNotification({
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

    if (getDBStatus()) {
      try {
        await Notification.create(notif);
      } catch (err) {}
    }

    notifications.push(notif);
    return notif;
  },

  async markNotificationRead(id, userId) {
    const n = notifications.find((notif) => String(notif._id) === String(id) && String(notif.user_id) === String(userId));
    if (n) {
      n.is_read = true;
      if (getDBStatus()) {
        try {
          if (mongoose.isValidObjectId(id)) {
            await Notification.findByIdAndUpdate(id, { is_read: true });
          } else {
            await Notification.findOneAndUpdate({ _id: id }, { is_read: true });
          }
        } catch (err) {}
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
    if (getDBStatus()) {
      try {
        await Notification.updateMany({ user_id: userId }, { is_read: true });
      } catch (err) {}
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

    if (getDBStatus()) {
      try {
        await Report.create(rep);
      } catch (err) {}
    }

    reports.push(rep);
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

    if (getDBStatus()) {
      try {
        if (mongoose.isValidObjectId(id)) {
          await Report.findByIdAndUpdate(id, { status, updated_at: new Date() });
        } else {
          await Report.findOneAndUpdate({ _id: id }, { status, updated_at: new Date() });
        }
      } catch (err) {}
    }

    return rep;
  },
};
