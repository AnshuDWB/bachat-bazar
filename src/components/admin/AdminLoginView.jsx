import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import {
  Shield,
  Phone,
  KeyRound,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Lock,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Store,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function AdminLoginView() {
  const { sendOtp, verifyOtp, user, isAdmin } = useAuth();
  const { showToast, settings, setCurrentView } = useStore();

  const [phone, setPhone] = useState('7073222340');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Enter Phone, 2: Enter OTP
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [autoSentOtp, setAutoSentOtp] = useState('');

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendAdminOtp = async (e) => {
    if (e) e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      showToast('Please enter the 10-digit Admin mobile number', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await sendOtp({ phone: phone.trim(), role: 'admin' });

      if (res.success) {
        setStep(2);
        setResendTimer(60);
        setWhatsappUrl(res.whatsappOtpUrl || '');
        if (res.otp) {
          setAutoSentOtp(res.otp);
        }

        // Open WhatsApp directly with the Admin OTP text
        if (res.whatsappOtpUrl) {
          try {
            window.open(res.whatsappOtpUrl, '_blank');
          } catch (err) {
            console.warn('Could not auto open window:', err);
          }
        }

        showToast(res.message || 'OTP sent to Admin WhatsApp!', 'success');
      } else {
        showToast(res.message || 'Failed to send Admin OTP. Please check authorization.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error requesting Admin OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAdminOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 4) {
      showToast('Please enter the verification OTP code', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp({
        phone: phone.trim(),
        otp: otp.trim(),
        role: 'admin'
      });

      if (res.success) {
        showToast('🛡️ Admin Portal Authenticated Successfully!', 'success');
        setCurrentView('admin');
      } else {
        showToast(res.message || 'Invalid OTP code. Please try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error verifying Admin OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Ambience Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D71920]/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Bar */}
      <header className="p-4 sm:p-6 flex items-center justify-between border-b border-neutral-800/80 relative z-10">
        <button
          onClick={() => {
            window.history.pushState({}, '', '/');
            setCurrentView('home');
          }}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-neutral-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </button>

        <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>bachatbazar.space/admin</span>
        </div>
      </header>

      {/* Main Login Box */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="bg-[#181818] border border-neutral-800 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Header & Logo */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#D71920] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-900/30 text-white">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">
              Bachat Bazar Admin Portal
            </h1>
            <p className="text-xs text-neutral-400">
              Secure Store Management • Login with WhatsApp OTP
            </p>
          </div>

          {/* STEP 1: Enter Admin Mobile */}
          {step === 1 && (
            <form onSubmit={handleSendAdminOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Admin Registered Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit admin phone"
                    className="w-full bg-[#111111] border border-neutral-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white font-mono placeholder-neutral-500 outline-none focus:border-[#D71920] focus:ring-2 focus:ring-[#D71920]/20 transition"
                  />
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  Authorized store admin number: <strong>+91 7073222340</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#D71920] hover:bg-[#B5141A] disabled:bg-neutral-700 text-white font-black text-xs sm:text-sm rounded-xl transition shadow-red-glow flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Sending Admin OTP...</span>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 fill-white text-[#D71920]" />
                    <span>SEND OTP VIA WHATSAPP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-center">
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  A 6-digit verification code will be dispatched directly to your WhatsApp to verify store ownership.
                </p>
              </div>
            </form>
          )}

          {/* STEP 2: Enter Received OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyAdminOtp} className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs flex items-center justify-between text-emerald-300">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>OTP Sent to: <strong>+91 {phone}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[11px] font-bold text-emerald-400 hover:underline"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Enter 6-Digit Admin Verification OTP
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
                    className="w-full bg-[#111111] border border-neutral-700 rounded-xl pl-11 pr-4 py-3 text-base text-white font-mono tracking-widest text-center placeholder-neutral-600 outline-none focus:border-[#D71920] focus:ring-2 focus:ring-[#D71920]/20 transition"
                  />
                  <KeyRound className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
                </div>
              </div>

              {/* Quick autofill helper */}
              {autoSentOtp && (
                <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-between text-xs">
                  <span className="text-neutral-400 text-[11px]">Latest Generated OTP: <strong className="text-white font-mono">{autoSentOtp}</strong></span>
                  <button
                    type="button"
                    onClick={() => setOtp(autoSentOtp)}
                    className="text-[11px] font-bold text-[#D71920] hover:underline"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              {/* WhatsApp direct re-open button */}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp to View OTP Code</span>
                </a>
              )}

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full py-3.5 bg-[#D71920] hover:bg-[#B5141A] disabled:bg-neutral-700 text-white font-black text-xs sm:text-sm rounded-xl transition shadow-red-glow flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Verifying Admin Credentials...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>VERIFY & UNLOCK ADMIN PORTAL</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-neutral-400 hover:text-white transition"
                >
                  ← Re-enter Number
                </button>

                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={() => handleSendAdminOtp()}
                  className="text-[#D71920] disabled:text-neutral-600 font-bold hover:underline"
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend WhatsApp OTP'}
                </button>
              </div>

            </form>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-neutral-600 text-xs border-t border-neutral-900 relative z-10">
        <p>Bachat Bazar Management System • Bhiwadi, Rajasthan • Protected & Encrypted Admin Session</p>
      </footer>

    </div>
  );
}
