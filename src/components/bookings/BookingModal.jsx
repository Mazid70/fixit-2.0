import React, { useState } from 'react';
import { Calendar, Clock, FileText, ShieldCheck, MapPin, Wallet, CreditCard, Banknote, Sparkles } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import api from '../../api/axios.js';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function BookingModal({ isOpen, onClose, service, onBookingSuccess }) {
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00');
  const [areaZone, setAreaZone] = useState('Gulshan 1 & 2, Dhaka');
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!service) return null;

  const provider = service.provider || {};
  const providerName = provider.user?.name || provider.business_name || 'Verified Specialist';
  const formattedPrice = typeof service.price === 'number' ? service.price.toLocaleString('en-US') : service.price;

  const handleModalClose = () => {
    setConfirmedBooking(null);
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!bookingDate || !bookingTime) {
      setError('Please select a valid appointment date and time slot.');
      return;
    }

    const fullDateTime = new Date(`${bookingDate}T${bookingTime}`);
    if (isNaN(fullDateTime.getTime())) {
      setError('Invalid date format selected.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/bookings', {
        service_id: service._id,
        booking_date: fullDateTime.toISOString(),
        notes: `[Area: ${areaZone}] [Payment: ${paymentMethod}] ${notes.trim()}`,
      });

      if (res.data.success) {
        const created = res.data.data;
        setConfirmedBooking(created);
        addToast('Booking appointment confirmed! The specialist has been notified.', 'success');
        if (onBookingSuccess) onBookingSuccess(created);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking request');
    } finally {
      setLoading(false);
    }
  };

  // Min date set to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={confirmedBooking ? "Booking Confirmed" : "Book Verified Specialist"}
      maxWidth="max-w-xl"
    >
      {confirmedBooking ? (
        <div className="py-4 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25">
              Appointment Scheduled
            </span>
            <h3 className="text-xl font-bold text-white mt-2 font-['Space_Grotesk']">
              Service Request Placed Successfully!
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              Your service appointment request has been dispatched to <strong className="text-white">{providerName}</strong>.
            </p>
          </div>

          <div className="bg-[#12151e] border border-[#212635] rounded-2xl p-4 text-left text-xs space-y-2.5 max-w-md mx-auto">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <span className="text-neutral-400">Booking Reference:</span>
              <span className="font-mono font-bold text-orange-400">#{confirmedBooking._id?.slice(-6) || '1002'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Service:</span>
              <span className="font-semibold text-white">{service.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Provider:</span>
              <span className="text-neutral-200">{providerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Schedule Slot:</span>
              <span className="text-neutral-200">{bookingDate} at {bookingTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Payment:</span>
              <span className="text-neutral-200">{paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-neutral-800">
              <span className="text-neutral-300 font-bold">Estimated Cost:</span>
              <span className="text-sm font-extrabold text-orange-500 font-['Space_Grotesk']">৳{formattedPrice}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                handleModalClose();
                navigate('/dashboard/customer/bookings');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 font-bold text-xs text-white shadow-lg shadow-orange-500/20 transition"
            >
              View My Bookings
            </button>
            <button
              onClick={() => {
                handleModalClose();
                navigate('/dashboard/customer');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 font-bold text-xs text-neutral-200 transition"
            >
              Customer Dashboard
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Service summary header */}
          <div className="p-4 mb-5 rounded-2xl bg-[#12151e] border border-[#212635]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-extrabold text-orange-400 uppercase tracking-wider">
                  {service.category?.category_name || 'Verified Service'}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5 font-['Space_Grotesk']">
                  {service.title}
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Provider: <strong className="text-neutral-200">{providerName}</strong> ({service.location || 'Dhaka'})
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xl font-extrabold text-orange-500 font-['Space_Grotesk']">
                  ৳{formattedPrice}
                </span>
                <span className="text-[10px] text-neutral-400 block -mt-1">est. service fee</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date & Time fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  <span>Preferred Date</span>
                </label>
                <input
                  type="date"
                  min={minDate}
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-[#141822] text-xs text-neutral-200 rounded-xl px-3 py-2.5 border border-neutral-700 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>Time Slot</span>
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full bg-[#141822] text-xs text-neutral-200 rounded-xl px-3 py-2.5 border border-neutral-700 focus:border-orange-500 focus:outline-none"
                >
                  <option value="09:00">09:00 AM (Morning Slot)</option>
                  <option value="11:30">11:30 AM (Late Morning)</option>
                  <option value="14:00">02:00 PM (Afternoon Slot)</option>
                  <option value="16:30">04:30 PM (Late Afternoon)</option>
                  <option value="19:00">07:00 PM (Evening Slot)</option>
                </select>
              </div>
            </div>

            {/* Location Zone */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>Service City & Hub Area</span>
              </label>
              <select
                value={areaZone}
                onChange={(e) => setAreaZone(e.target.value)}
                className="w-full bg-[#141822] text-xs text-neutral-200 rounded-xl px-3 py-2.5 border border-neutral-700 focus:border-orange-500 focus:outline-none"
              >
                <option value="Gulshan 1 & 2, Dhaka">Gulshan 1 & 2, Dhaka</option>
                <option value="Banani & Baridhara, Dhaka">Banani & Baridhara, Dhaka</option>
                <option value="Dhanmondi, Dhaka">Dhanmondi, Dhaka</option>
                <option value="Uttara Sector 1-14, Dhaka">Uttara Sector 1-14, Dhaka</option>
                <option value="Bashundhara R/A, Dhaka">Bashundhara R/A, Dhaka</option>
                <option value="Mirpur & Pallabi, Dhaka">Mirpur & Pallabi, Dhaka</option>
                <option value="Mohakhali & Niketan, Dhaka">Mohakhali & Niketan, Dhaka</option>
                <option value="Chattogram Port & GEC Area">Chattogram Port & GEC Area</option>
                <option value="Sylhet Zindabazar Hub">Sylhet Zindabazar Hub</option>
              </select>
            </div>

            {/* Bangladesh Payment Methods */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-2 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-orange-400" />
                <span>Select Payment Mode</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bKash', label: 'bKash / Nagad', note: 'Mobile Wallet' },
                  { id: 'Cash On Delivery', label: 'Cash on Service', note: 'Pay technician' },
                  { id: 'Card/Banking', label: 'Debit / Card', note: 'Visa / MC' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      paymentMethod === pm.id
                        ? 'bg-orange-500/10 border-orange-500 text-white shadow-md'
                        : 'bg-[#141822] border-neutral-700/80 text-neutral-300 hover:border-neutral-600'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{pm.label}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{pm.note}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes & Address Details */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-orange-400" />
                <span>Specific Problem Details / Road & House Address</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. House 14, Road 5, Block B. Inverter AC ice forming on indoor blower coil..."
                className="w-full bg-[#141822] text-xs text-neutral-200 rounded-xl p-3 border border-neutral-700 focus:border-orange-500 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> 7-Day FIXIT Service Guarantee Included
              </span>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-[#1c2230] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2.5 text-xs font-semibold text-neutral-300 hover:text-white bg-[#1a1f2c] rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 font-bold text-xs text-white shadow-lg shadow-orange-500/20 transition disabled:opacity-50"
              >
                {loading ? 'Confirming Appointment...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
}
