import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import {
  X,
  User,
  Phone,
  Mail,
  ArrowRight,
  MessageCircle,
  KeyRound,
  ShoppingBag
} from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    sendOtp,
    verifyOtp
  } = useAuth();

  const { showToast } = useStore();

  // Internal mode: 'login' | 'register'
  const [mode, setMode] = useState('login');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(1); // 1: Input, 2: OTP
  const [resendTimer, setResendTimer] = useState(0);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [latestOtp, setLatestOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync mode with parent if opened with specific mode
  useEffect(() => {
    if (authModalMode === 'register') {
      setMode('register');
    } else {
      setMode('login');
    }
    setOtpStep(1);
    setOtp('');
  }, [authModalMode, isAuthModalOpen]);

  // Resend countdown timer
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!isAuthModalOpen) return null;

  // 1. Request OTP via WhatsApp
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await sendOtp({ phone: cleanPhone, role: 'customer' });

      if (res.success) {
        setOtpStep(2);
        setResendTimer(60);
        setWhatsappUrl(res.whatsappOtpUrl || '');
        if (res.otp) setLatestOtp(res.otp);

        // Open WhatsApp directly
        if (res.whatsappOtpUrl) {
          try {
            window.open(res.whatsappOtpUrl, '_blank');
          } catch (err) {
            console.warn('Could not auto open WhatsApp:', err);
          }
        }

        showToast(res.message || 'OTP sent to your WhatsApp!', 'success');
      } else {
        showToast(res.message || 'Failed to send OTP. Please try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error requesting OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP & Complete Login / Register
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (!otp || otp.trim().length < 4) {
      showToast('Please enter the 6-digit OTP code', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp({
        phone: cleanPhone,
        otp: otp.trim(),
        role: 'customer',
        name: name.trim(),
        email: email.trim()
      });

      if (res.success) {
        showToast(res.message || 'Login successful!', 'success');
        setIsAuthModalOpen(false);
        setOtpStep(1);
        setOtp('');
      } else {
        showToast(res.message || 'Invalid OTP code. Please try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error verifying OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setOtpStep(1);
    setOtp('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative flex flex-col border border-neutral-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#111111] text-white flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#D71920] rounded-xl flex items-center justify-center font-black text-white text-base shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">
                {otpStep === 2
                  ? 'Verify WhatsApp OTP'
                  : mode === 'login'
                  ? 'Customer Login'
                  : 'Create New Account'}
              </h2>
              <p className="text-[10px] text-neutral-400">Bachat Bazar • Har Din Ki Bachat (Bhiwadi)</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">

          {/* STEP 1: LOGIN FORM */}
          {otpStep === 1 && mode === 'login' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <h3 className="text-base font-black text-[#111111] tracking-tight">
                  Login with WhatsApp OTP
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Enter your mobile number to get instant verification OTP on WhatsApp.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Mobile Number (WhatsApp) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-neutral-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile number"
                    autoFocus
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-xl pl-12 pr-3 py-2.5 text-xs font-semibold text-[#111111] outline-none focus:border-[#D71920] focus:bg-white transition"
                  />
                  <Phone className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.replace(/\D/g, '').length < 10}
                className="w-full py-3.5 bg-[#D71920] hover:bg-[#B5141A] disabled:bg-neutral-300 text-white font-black text-xs rounded-xl transition shadow-red-glow flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Sending OTP...</span>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 fill-white text-[#D71920]" />
                    <span>GET OTP VIA WHATSAPP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Clean Switch to Create New Account */}
              <div className="pt-3 border-t border-neutral-200 text-center">
                <p className="text-xs text-neutral-600 mb-2">
                  Don't have an account?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setOtpStep(1);
                  }}
                  className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-[#111111] font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Create New Account
                </button>
              </div>
            </form>
          )}

          {/* STEP 1: CREATE NEW ACCOUNT FORM */}
          {otpStep === 1 && mode === 'register' && (
            <form onSubmit={handleRequestOtp} className="space-y-3.5">
              <div>
                <h3 className="text-base font-black text-[#111111] tracking-tight">
                  Create New Account
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Register with your name and WhatsApp number.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    autoFocus
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-[#111111] outline-none focus:border-[#D71920] focus:bg-white transition"
                  />
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Mobile Number (WhatsApp) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-neutral-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit phone number"
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-xl pl-12 pr-3 py-2 text-xs font-semibold text-[#111111] outline-none focus:border-[#D71920] focus:bg-white transition"
                  />
                  <Phone className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-[#111111] outline-none focus:border-[#D71920] focus:bg-white transition"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !name.trim() || phone.replace(/\D/g, '').length < 10}
                className="w-full py-3.5 bg-[#D71920] hover:bg-[#B5141A] disabled:bg-neutral-300 text-white font-black text-xs rounded-xl transition shadow-red-glow flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                {loading ? (
                  <span>Sending Registration OTP...</span>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 fill-white text-[#D71920]" />
                    <span>SEND OTP TO REGISTER</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Clean Switch to Login */}
              <div className="pt-3 border-t border-neutral-200 text-center">
                <p className="text-xs text-neutral-600 mb-2">
                  Already have an account?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setOtpStep(1);
                  }}
                  className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-[#111111] font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION (Used for both Login & Register) */}
          {otpStep === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center justify-between text-emerald-800">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>OTP sent to: <strong>+91 {phone}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpStep(1)}
                  className="text-[11px] font-bold text-[#D71920] hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Enter 6-Digit WhatsApp OTP Code *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    autoFocus
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 text-sm font-mono tracking-widest text-center font-black outline-none focus:border-[#D71920] focus:bg-white"
                  />
                  <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Latest generated OTP helper */}
              {latestOtp && (
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-neutral-500 text-[11px]">
                    Generated OTP: <strong className="text-[#111111] font-mono">{latestOtp}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtp(latestOtp)}
                    className="text-[11px] font-bold text-[#D71920] hover:underline cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              {/* Open WhatsApp link */}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp to View Code</span>
                </a>
              )}

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full py-3.5 bg-[#D71920] hover:bg-[#B5141A] disabled:bg-neutral-300 text-white font-black text-xs rounded-xl transition shadow-red-glow flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Verifying OTP...' : 'VERIFY & LOGIN'}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setOtpStep(1)}
                  className="text-neutral-500 hover:text-neutral-800 cursor-pointer font-medium"
                >
                  ← Edit Phone Number
                </button>

                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={() => handleRequestOtp()}
                  className="text-[#D71920] disabled:text-neutral-400 font-bold hover:underline cursor-pointer"
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP via WhatsApp'}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
