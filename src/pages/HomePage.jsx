import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import {
  Wrench,
  Search,
  ShieldCheck,
  Star,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Flame,
  Tv,
  Hammer,
  Paintbrush,
  PhoneCall,
  MapPin,
  TrendingUp,
  Award,
  Users,
  Shield,
  Activity,
  Cpu,
  Layers,
  ChevronDown,
  Eye,
} from 'lucide-react';
import api from '../api/axios.js';
import ServiceCard from '../components/services/ServiceCard.jsx';
import BookingModal from '../components/bookings/BookingModal.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

import heroTechnicianImg from '../assets/images/hero_technician_banner_1786706585194.jpg';
import bangladeshSmartServiceImg from '../assets/images/bangladesh_smart_service_1786706611271.jpg';
import floatingCraftsmanBadgeImg from '../assets/images/floating_craftsman_badge_1786706785652.jpg';

const ROTATING_HEADLINES = [
  'Guaranteed 100% Quality',
  '30-Min Rapid Arrival',
  'NID-Verified Master Tradesmen',
  'Upfront BDT (৳) Transparent Pricing',
];

export default function HomePage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const showcaseRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
  const [headlineIndex, setHeadlineIndex] = useState(0);

  // Parallax Scroll Tracking
  const { scrollY, scrollYProgress } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Floating transform layers
  const heroLayerY1 = useTransform(smoothScrollY, [0, 600], [0, 80]);
  const heroLayerY2 = useTransform(smoothScrollY, [0, 600], [0, -60]);
  const heroScale = useTransform(smoothScrollY, [0, 600], [1, 1.04]);
  const heroRotate = useTransform(smoothScrollY, [0, 600], [0, 2]);
  const ambientGlowY = useTransform(smoothScrollY, [0, 800], [-50, 120]);

  // Rotating Headline interval
  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % ROTATING_HEADLINES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, srvRes, provRes] = await Promise.all([
          api.get('/services/categories'),
          api.get('/services'),
          api.get('/users/providers'),
        ]);

        if (catRes.data.success) setCategories(catRes.data.data);
        if (srvRes.data.success) setFeaturedServices(srvRes.data.data.slice(0, 6));
        if (provRes.data.success) setProviders(provRes.data.data.slice(0, 3));
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
  };

  const getCategoryIcon = (name = '') => {
    const lower = name.toLowerCase();
    if (lower.includes('plumb') || lower.includes('water')) return Wrench;
    if (lower.includes('electr') || lower.includes('ips') || lower.includes('volt')) return Zap;
    if (lower.includes('ac') || lower.includes('climate') || lower.includes('hvac')) return Flame;
    if (lower.includes('smart') || lower.includes('cctv') || lower.includes('iot')) return Tv;
    if (lower.includes('clean') || lower.includes('pest')) return Sparkles;
    if (lower.includes('concierge') || lower.includes('lifestyle') || lower.includes('luxury')) return Award;
    return Paintbrush;
  };

  return (
    <div className="space-y-24 pb-24 overflow-hidden bg-[#0a0c10] text-neutral-100 selection:bg-orange-500 selection:text-white">
      {/* 1. Grand Hero Section with Multi-Layer Parallax */}
      <section
        ref={heroRef}
        className="relative overflow-hidden min-h-[92vh] flex flex-col justify-center pt-8 pb-16 lg:py-16 border-b border-[#181d28] bg-gradient-to-b from-[#0e1118] via-[#0a0c10] to-[#0a0c10]"
      >
        {/* Ambient Radial Mesh & Glowing Gradients */}
        <motion.div
          style={{ y: ambientGlowY }}
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-cyan-500/10 blur-[140px] rounded-full pointer-events-none"
        />

        <div className="absolute inset-0 bg-[radial-gradient(#1f2638_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:col-span-6 space-y-6 text-center lg:text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161a25]/90 border border-orange-500/30 text-orange-400 text-xs font-bold shadow-lg backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Bangladesh's Premier Precision Home Services</span>
              </div>

              {/* Title with dynamic headline */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.12] font-['Space_Grotesk']">
                  Certified Craftsmen. <br />
                  <span className="inline-block relative min-w-[280px] sm:min-w-[360px]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={ROTATING_HEADLINES[headlineIndex]}
                        initial={{ y: 22, opacity: 0, filter: 'blur(6px)' }}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                        exit={{ y: -22, opacity: 0, filter: 'blur(6px)' }}
                        transition={{ duration: 0.45, ease: 'easeInOut' }}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 inline-block font-black"
                      >
                        {ROTATING_HEADLINES[headlineIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-neutral-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Connect with verified master electricians, hydronic plumbers, smart home technicians, and luxury craftsmen in Gulshan, Banani, Dhanmondi, Uttara & across Bangladesh.
                </p>
              </div>

              {/* Instant Search Bar */}
              <form
                onSubmit={handleHeroSearch}
                className="p-2 bg-[#12151e]/90 backdrop-blur-xl border border-[#232838] focus-within:border-orange-500/70 focus-within:ring-2 focus-within:ring-orange-500/20 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 transition-all max-w-xl mx-auto lg:mx-0"
              >
                <div className="flex-1 flex items-center px-3 gap-2">
                  <Search className="w-4 h-4 text-orange-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search trade (e.g. Inverter AC wash, IPS repair, Plumber)..."
                    className="w-full bg-transparent text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none py-2"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-bold text-xs sm:text-sm text-white rounded-xl shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>Find Master Pro</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>

              {/* Quick Tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-neutral-400">
                <span className="text-[11px] font-semibold text-neutral-400">Trending:</span>
                {[
                  { label: 'Inverter AC Wash', q: 'Inverter AC' },
                  { label: 'IPS Safety Audit', q: 'IPS' },
                  { label: 'PPR Pipe Leak', q: 'Plumbing' },
                  { label: 'Smart Lock Setup', q: 'Smart' },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => navigate(`/services?search=${encodeURIComponent(chip.q)}`)}
                    className="px-2.5 py-1 rounded-lg bg-[#141722] hover:bg-[#1a1f2c] border border-[#232838] hover:border-orange-500/40 text-[11px] font-medium text-neutral-300 hover:text-white transition"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Verified Trust Stats Row */}
              <div className="grid grid-cols-3 gap-3 pt-3 max-w-xl mx-auto lg:mx-0 border-t border-[#1a1f2c]">
                <div className="text-center lg:text-left">
                  <div className="text-lg font-black text-white font-['Space_Grotesk']">100%</div>
                  <div className="text-[10px] text-neutral-400 font-medium">NID-Verified Pros</div>
                </div>
                <div className="text-center lg:text-left border-x border-[#1a1f2c] px-2">
                  <div className="text-lg font-black text-orange-400 font-['Space_Grotesk']">30-Min</div>
                  <div className="text-[10px] text-neutral-400 font-medium">Rapid Response</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-lg font-black text-emerald-400 font-['Space_Grotesk']">4.98 ⭐</div>
                  <div className="text-[10px] text-neutral-400 font-medium">10,000+ Reviews</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Multi-Layer Parallax Showcase with Custom Realistic Assets */}
            <div className="lg:col-span-6 relative flex justify-center items-center min-h-[380px] sm:min-h-[460px]">
              {/* Layer 1: Background Glass Aura & Framing */}
              <motion.div
                style={{ y: heroLayerY1 }}
                className="absolute inset-0 bg-gradient-to-tr from-orange-500/15 via-transparent to-cyan-500/15 rounded-3xl blur-2xl pointer-events-none"
              />

              {/* Layer 2: Main Featured Hero Technician Image Card */}
              <motion.div
                style={{ y: heroLayerY2, scale: heroScale, rotate: heroRotate }}
                className="relative z-10 w-full max-w-lg rounded-3xl overflow-hidden border border-[#262e42] shadow-[0_20px_50px_rgba(0,0,0,0.7)] bg-[#11141d]/90 backdrop-blur-xl group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={heroTechnicianImg}
                    alt="FIXIT Certified Master Technician"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e121a] via-transparent to-black/30" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121622]/90 backdrop-blur-md border border-orange-500/40 text-orange-400 text-xs font-bold shadow-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                    <span>ISO 9001 Protocol</span>
                  </div>

                  <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121622]/90 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live in Dhaka</span>
                  </div>

                  {/* Bottom Image Caption */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 p-3.5 rounded-2xl bg-[#0f131c]/90 backdrop-blur-md border border-[#242c3f] flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white leading-snug">
                        Precision Sub-Station & HVAC Servicing
                      </h4>
                      <p className="text-[10px] text-neutral-400">
                        Zero-mess guarantee with certified safety gear
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-extrabold text-orange-400 font-['Space_Grotesk']">
                        ৳1,800/hr
                      </div>
                      <span className="text-[9px] text-neutral-400">Flat Rate</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Layer 3: Floating Parallax Badge 1 (Bangladesh Smart City Context) */}
              <motion.div
                style={{ y: heroLayerY1 }}
                className="hidden sm:flex items-center gap-3 absolute -bottom-6 -left-6 z-20 p-3 rounded-2xl bg-[#141824]/95 backdrop-blur-xl border border-orange-500/30 shadow-2xl max-w-xs"
              >
                <img
                  src={floatingCraftsmanBadgeImg}
                  alt="Certified Shield"
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-xl object-cover border border-orange-500/30 shrink-0"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>NID & Police Verified</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-[10px] text-neutral-400 leading-tight mt-0.5">
                    Background checked for family & estate safety
                  </p>
                </div>
              </motion.div>

              {/* Layer 4: Floating Parallax Badge 2 (Smart Service Dispatch) */}
              <motion.div
                style={{ y: heroLayerY2 }}
                className="hidden sm:flex items-center gap-3 absolute -top-6 -right-6 z-20 p-3 rounded-2xl bg-[#141824]/95 backdrop-blur-xl border border-cyan-500/30 shadow-2xl max-w-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Instant GPS Dispatch</div>
                  <p className="text-[10px] text-cyan-400 font-semibold mt-0.5">
                    Avg arrival: 28 mins in Gulshan & Banani
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <div className="flex justify-center mt-12">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-1 text-[11px] font-bold text-neutral-500 tracking-wider uppercase"
            >
              <span>Scroll to Discover</span>
              <ChevronDown className="w-4 h-4 text-orange-400" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Live Platform Metrics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-3xl bg-[#11141c] border border-[#1f2533] shadow-xl"
        >
          {[
            { value: '25,000+', label: 'Repairs Completed', icon: CheckCircle2, color: 'text-emerald-400' },
            { value: '4.98 / 5', label: 'Average Client Score', icon: Star, color: 'text-amber-400' },
            { value: '1,500+', label: 'Certified Tradesmen', icon: Users, color: 'text-orange-400' },
            { value: '30 Mins', label: 'Rapid Dispatch Window', icon: Clock, color: 'text-cyan-400' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-2xl bg-[#151923] border border-[#212635] flex items-center gap-3.5 transition"
              >
                <div className={`p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-extrabold text-white font-['Space_Grotesk'] leading-tight">
                    {stat.value}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* 3. Service Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>DISCOVER SPECIALIZED DOMAINS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
              Explore Trade Categories
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Connect directly with domain-verified engineers and master technicians
            </p>
          </div>
          <Link
            to="/categories"
            className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading categories..." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, idx) => {
              const Icon = getCategoryIcon(cat.category_name);
              return (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Link
                    to={`/services?category=${cat._id}`}
                    className="group bg-[#11141c] hover:bg-[#161a25] border border-[#1f2533] hover:border-orange-500/50 p-5 rounded-2xl flex flex-col items-center text-center transition-all duration-200 shadow-md hover:shadow-orange-500/10 h-full justify-between"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-bold text-neutral-200 group-hover:text-orange-400 transition leading-snug line-clamp-2">
                      {cat.category_name}
                    </h3>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Featured Services Grid with Parallax In-View Stagger */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 mb-1">
              <Award className="w-3.5 h-3.5 text-orange-400" />
              <span>HANDPICKED & CERTIFIED</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
              Featured Verified Services
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Top requested certified professionals with guaranteed upfront pricing in BDT (৳)
            </p>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading popular services..." />
        ) : featuredServices.length === 0 ? (
          <div className="bg-[#11141c] border border-[#1f2533] rounded-2xl p-8 text-center max-w-xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">No Services Listed Yet</h3>
            <p className="text-xs text-neutral-400">
              Services are currently being populated. You can also create and manage services in your provider dashboard.
            </p>
            <Link
              to="/provider/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white transition shadow-lg shadow-orange-500/20"
            >
              <span>Go to Provider Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service, idx) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
              >
                <ServiceCard
                  service={service}
                  onBookNow={(srv) => setSelectedServiceForBooking(srv)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Precision Craftsmanship & Diagnostic Protocols Showcase */}
      <section ref={showcaseRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-[#212838] bg-gradient-to-r from-[#10141d] via-[#131824] to-[#0c0f16] shadow-2xl p-8 sm:p-12 lg:p-14"
        >
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-extrabold shadow-sm backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>WHY HOMEOWNERS TRUST FIXIT</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk'] leading-tight">
                Architectural Standards for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                  Every Modern Home & Estate
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Whether diagnosing concealed high-pressure water seepage, restructuring smart DB panels, or wiring high-security 4K biometric meshes — every FIXIT partner adheres to strict engineering tolerances and non-invasive diagnostic protocols.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#151924]/80 border border-[#22293b] backdrop-blur-md">
                  <div className="text-orange-400 font-extrabold text-sm sm:text-base font-['Space_Grotesk']">100%</div>
                  <div className="text-[10px] text-neutral-300 font-medium">Genuine Parts Guarantee</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#151924]/80 border border-[#22293b] backdrop-blur-md">
                  <div className="text-orange-400 font-extrabold text-sm sm:text-base font-['Space_Grotesk']">30-Day</div>
                  <div className="text-[10px] text-neutral-300 font-medium">Free Warranty Coverage</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#151924]/80 border border-[#22293b] backdrop-blur-md col-span-2 sm:col-span-1">
                  <div className="text-orange-400 font-extrabold text-sm sm:text-base font-['Space_Grotesk']">Zero</div>
                  <div className="text-[10px] text-neutral-300 font-medium">Hidden Overhead Costs</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-xs text-white transition shadow-lg shadow-orange-500/25"
                >
                  <span>Book Diagnostic Inspection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl overflow-hidden border border-[#262f44] bg-[#0c0f16] shadow-xl p-2">
                <img
                  src={bangladeshSmartServiceImg}
                  alt="Precision Smart Diagnostics in Bangladesh"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto rounded-xl object-cover filter contrast-110"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 6. Active Coverage Zones */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-[#11141c] border border-[#1f2533] rounded-3xl p-8 lg:p-10 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1c2230]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 mb-1">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>COVERAGE ACROSS BANGLADESH</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
                Active Service Zones in Dhaka & Major Metros
              </h2>
            </div>
            <Link
              to="/providers"
              className="px-4 py-2 bg-[#181d28] hover:bg-[#202736] text-xs font-bold text-neutral-200 rounded-xl transition self-start border border-neutral-700/60"
            >
              Browse All Providers
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
            {[
              { zone: 'Gulshan 1 & 2', count: '140+ Pros' },
              { zone: 'Banani & Baridhara', count: '98+ Pros' },
              { zone: 'Dhanmondi & Lalmatia', count: '115+ Pros' },
              { zone: 'Uttara (Sec 1-14)', count: '160+ Pros' },
              { zone: 'Bashundhara R/A', count: '85+ Pros' },
              { zone: 'Chattogram & Sylhet', count: '120+ Pros' },
            ].map((hub, idx) => (
              <motion.div
                key={hub.zone}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                whileHover={{ y: -3, scale: 1.03 }}
                className="p-3.5 rounded-2xl bg-[#151923] border border-[#212635] hover:border-orange-500/40 transition group"
              >
                <MapPin className="w-4 h-4 text-orange-400 mx-auto mb-1.5 group-hover:scale-125 transition-transform" />
                <p className="text-xs font-bold text-white leading-tight">{hub.zone}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">{hub.count}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 7. Provider Callout Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl shadow-orange-500/20 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="space-y-3 text-center md:text-left max-w-xl relative z-10">
            <span className="px-3 py-1 bg-black/20 rounded-full text-xs font-bold uppercase tracking-wider">
              Specialist Partner Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] leading-tight">
              Are you a certified technician or craftsman in Bangladesh?
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Join FIXIT Bangladesh to receive instant customer bookings, manage your schedule, and get paid directly via bKash, Nagad, or Bank Transfer.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 relative z-10">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register?role=provider"
                className="px-6 py-3 bg-white text-orange-600 hover:bg-neutral-100 font-extrabold text-xs rounded-xl shadow-lg transition text-center block"
              >
                Join as Specialist Partner
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/services"
                className="px-6 py-3 bg-black/30 hover:bg-black/40 text-white font-bold text-xs rounded-xl transition text-center block"
              >
                Explore Listings
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Booking Modal */}
      {selectedServiceForBooking && (
        <BookingModal
          isOpen={!!selectedServiceForBooking}
          onClose={() => setSelectedServiceForBooking(null)}
          service={selectedServiceForBooking}
        />
      )}
    </div>
  );
}
