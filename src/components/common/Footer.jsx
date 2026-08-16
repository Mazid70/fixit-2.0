import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Clock, Award, Phone, Mail, MapPin, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#090b0e] border-t border-[#1c2230] text-neutral-400 text-sm mt-auto">
      {/* Value Badges Banner */}
      <div className="border-b border-[#1c2230] py-8 bg-[#0d1016]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-neutral-200 text-sm">Verified Technicians</p>
                <p className="text-xs text-neutral-400">NID & Trade License Vetted</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-neutral-200 text-sm">30-Min Rapid Arrival</p>
                <p className="text-xs text-neutral-400">Dhaka & Nationwide Coverage</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-neutral-200 text-sm">7-Day Service Warranty</p>
                <p className="text-xs text-neutral-400">Satisfaction guaranteed</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-neutral-200 text-sm">bKash & Nagad Ready</p>
                <p className="text-xs text-neutral-400">Secure digital payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white font-['Space_Grotesk']">
                FIX<span className="text-orange-500">IT</span>
              </span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Bangladesh's leading on-demand marketplace connecting households and offices with certified master technicians, AC specialists, plumbers, and electricians.
            </p>
            <div className="pt-2 text-xs text-neutral-400 space-y-1.5">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" /> Road 11, Banani / Gulshan 2, Dhaka 1213
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-orange-500 shrink-0" /> support@fixit.com.bd
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-orange-500 shrink-0" /> +880 9612-FIXIT-BD (24/7 Helpline)
              </p>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider mb-3">
              Top Services in Dhaka
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services?category=cat_03" className="hover:text-orange-400 transition">
                  Inverter AC Master Servicing & Gas Top-Up
                </Link>
              </li>
              <li>
                <Link to="/services?category=cat_02" className="hover:text-orange-400 transition">
                  IPS, Generator & DB Board Wiring
                </Link>
              </li>
              <li>
                <Link to="/services?category=cat_01" className="hover:text-orange-400 transition">
                  Submersible Pump & Concealed Pipe Repair
                </Link>
              </li>
              <li>
                <Link to="/services?category=cat_04" className="hover:text-orange-400 transition">
                  Smart CCTV & Security Intercom Setup
                </Link>
              </li>
              <li>
                <Link to="/services?category=cat_05" className="hover:text-orange-400 transition">
                  Deep Sanitization & Pest Prevention
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portals */}
          <div>
            <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider mb-3">
              Portals & Accounts
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard/customer" className="hover:text-orange-400 transition">
                  Customer Booking Console
                </Link>
              </li>
              <li>
                <Link to="/dashboard/provider" className="hover:text-orange-400 transition">
                  Service Provider Hub
                </Link>
              </li>
              <li>
                <Link to="/register?role=provider" className="hover:text-orange-400 transition">
                  Join as Technician Partner (BD)
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-orange-400 transition">
                  System Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Payment */}
          <div>
            <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider mb-3">
              Guaranteed Protection
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              All bookings include free rescheduling, upfront BDT pricing, verified technician identification, and payment upon satisfaction.
            </p>
            <div className="p-3 bg-[#131620] rounded-xl border border-[#212635] text-xs">
              <span className="text-orange-400 font-semibold">Payment Modes:</span> bKash, Nagad, Rocket, Visa/Mastercard & Cash on Service.
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#1c2230] flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} FIXIT Bangladesh. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/services" className="hover:text-white transition">Find Services</Link>
            <Link to="/categories" className="hover:text-white transition">Categories</Link>
            <Link to="/providers" className="hover:text-white transition">Technicians</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
