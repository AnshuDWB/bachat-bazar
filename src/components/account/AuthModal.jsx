import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/formatters';
import {
  X,
  User,
  Phone,
  Mail,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Crown,
  Banknote,
  QrCode,
  Clock,
  Check
} from 'lucide-react';

const fallbackPlans = [
  {
    id: "plan-1yr",
    name: "1 Year VIP Plan",
    duration: "1 Year",
    price: 999,
    mrp: 1499,
    badge: "Basic Savings",
    description: "1 Saal tak 500+ items par VIP Member rate & priority delivery",
    isPopular: false
  },
  {
    id: "plan-2yr",
    name: "2 Years VIP Plan",
    duration: "2 Years",
    price: 1799,
    mrp: 2999,
    badge: "Most Popular",
    description: "2 Saal ki guaranteed bachat & extra seasonal festive offers",
    isPopular: true
  },
  {
    id: "plan-3yr",
    name: "3 Years VIP Plan",
    duration: "3 Years",
    price: 2499,
    mrp: 4499,
    badge: "Family Saver",
    description: "Large families ke liye 3 saal tak maximum wholesale savings",
    isPopular: false
  },
  {
    id: "plan-lifetime",
    name: "Lifetime VIP Club (Maha Bachat)",
    duration: "Lifetime",
    price: 5999,
    mrp: 9999,
    badge: "Best Value • Lifetime",
    description: "Zindagi bhar ki bachat — One-time payment, unlimited lifetime VIP rates",
    isPopular: false
  }
];

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    applyMembership,
    user
  } = useAuth();

  const { showToast, membershipPlans } = useStore();

  const activePlans = (membershipPlans && membershipPlans.length > 0) ? membershipPlans : fallbackPlans;

  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('plan-lifetime');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('CASH'); // 'CASH' | 'UPI'
  const [joinMembership, setJoinMembership] = useState(true);
  const [transactionalConsent, setTransactionalConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const currentPlan = activePlans.find(p => p.id === selectedPlanId) || activePlans[3] || activePlans[0];

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      showToast('Please enter your phone number or email', 'error');
      return;
    }

    setLoading(true);
    const res = await login(identifier);
    setLoading(false);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast('Please provide your name and phone number', 'error');
      return;
    }

    setLoading(true);
    const res = await register({
      name,
      phone,
      email,
      joinMembership,
      transactionalConsent,
      marketingConsent
    });
    setLoading(false);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleMembershipApplySubmit = async (e) => {
    e.preventDefault();
    const applicantPhone = user ? user.phone : phone;
    const applicantName = user ? user.name : name;

    if (!applicantPhone) {
      showToast('Please enter your mobile phone number', 'error');
      return;
    }

    setLoading(true);
    const res = await applyMembership({
      planId: selectedPlanId,
      paymentMethod: selectedPaymentMode,
      customerName: applicantName,
      phone: applicantPhone,
      email: user ? user.email : email,
      address: user ? user.addresses?.[0]?.house : address,
      notes: selectedPaymentMode === 'CASH' 
        ? 'Customer chose Cash Payment (to be collected at Counter or Doorstep)' 
        : 'Customer requested UPI / Online verification'
    });
    setLoading(false);

    if (res.success) {
      showToast(res.message, 'success');
      setIsAuthModalOpen(false);
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-4 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative max-h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#111111] text-white flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#D71920] rounded-xl flex items-center justify-center font-bold text-white text-base shadow-sm">
              B
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {authModalMode === 'login' ? 'Customer Login' : authModalMode === 'register' ? 'Create New Account' : 'Bachat VIP Member Club'}
              </h2>
              <p className="text-[10px] text-neutral-400">Bachat Bazar • Har Din Ki Bachat</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 text-neutral-400 hover:text-white rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 text-xs font-bold text-neutral-600 shrink-0">
          <button
            onClick={() => setAuthModalMode('login')}
            className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${
              authModalMode === 'login' ? 'border-[#D71920] text-[#D71920]' : 'border-transparent hover:text-black'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthModalMode('register')}
            className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${
              authModalMode === 'register' ? 'border-[#D71920] text-[#D71920]' : 'border-transparent hover:text-black'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setAuthModalMode('membership')}
            className={`flex-1 py-3 text-center border-b-2 transition flex items-center justify-center gap-1 cursor-pointer ${
              authModalMode === 'membership' ? 'border-[#D71920] text-[#D71920]' : 'border-transparent hover:text-black'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-yellow-500" />
            VIP Plans
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* TAB: LOGIN */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter 10-digit mobile number or email"
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg pl-9 pr-3 py-2.5 text-xs outline-none focus:border-[#D71920]"
                  />
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer"
              >
                {loading ? 'Logging in...' : 'LOGIN TO ACCOUNT'}
              </button>

              <div className="pt-3 border-t border-neutral-200">
                <p className="text-[11px] text-neutral-500 text-center mb-2">
                  Don't have an account yet?
                </p>
                <button
                  type="button"
                  onClick={() => setAuthModalMode('register')}
                  className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs rounded-xl transition cursor-pointer"
                >
                  Create New Account
                </button>
              </div>
            </form>
          )}

          {/* TAB: REGISTER */}
          {authModalMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit phone number"
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                />
              </div>

              {/* WhatsApp Separate Consent Checkboxes */}
              <div className="bg-[#F7F7F7] border border-neutral-200 rounded-xl p-3 space-y-2">
                <span className="text-[11px] font-bold text-[#111111] block">
                  WhatsApp Updates Preferences:
                </span>
                
                <label className="flex items-start gap-2 cursor-pointer text-neutral-700">
                  <input
                    type="checkbox"
                    checked={transactionalConsent}
                    onChange={(e) => setTransactionalConsent(e.target.checked)}
                    className="accent-[#D71920] mt-0.5 rounded"
                  />
                  <span className="text-[10px] leading-tight">
                    I agree to receive WhatsApp messages from Bachat Bazar regarding my orders, invoices, delivery updates, membership and customer support.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer text-neutral-700">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="accent-[#D71920] mt-0.5 rounded"
                  />
                  <span className="text-[10px] leading-tight">
                    I agree to receive promotional offers and marketing messages from Bachat Bazar on WhatsApp.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer"
              >
                {loading ? 'Registering...' : 'REGISTER & CONTINUE'}
              </button>
            </form>
          )}

          {/* TAB: MEMBERSHIP PLANS & APPLICATION */}
          {authModalMode === 'membership' && (
            <div className="space-y-4">
              
              {/* Pending Verification Banner if user already applied */}
              {user?.membershipStatus === 'PENDING_APPROVAL' && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-2 text-amber-800 font-bold">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Application Under Admin Verification</span>
                  </div>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Aapki <strong>{user?.pendingApplication?.planName || 'VIP Membership'}</strong> ki application submit ho chuki hai. Payment Mode: <strong>{user?.pendingApplication?.paymentMethod || 'CASH'}</strong>. Admin verification ke baad aapka VIP account turant activate ho jayega.
                  </p>
                </div>
              )}

              {/* Plan Selection Header */}
              <div>
                <span className="text-[11px] font-bold text-[#D71920] uppercase tracking-wider block">
                  Select Your VIP Membership Plan
                </span>
                <p className="text-xs text-neutral-500">
                  Choose a validity period to unlock wholesale rates on 500+ daily grocery items.
                </p>
              </div>

              {/* 4 Membership Plans Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activePlans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  const isLifetime = plan.id === 'plan-lifetime' || plan.duration === 'Lifetime';

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative p-3.5 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#D71920] bg-red-50/50 shadow-sm'
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                      }`}
                    >
                      {plan.badge && (
                        <span className={`absolute -top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow-2xs ${
                          isLifetime ? 'bg-[#D71920] text-white' : 'bg-[#111111] text-white'
                        }`}>
                          {plan.badge}
                        </span>
                      )}

                      <div>
                        <div className="flex items-center justify-between">
                          <strong className="text-xs text-[#111111] font-bold block">{plan.name}</strong>
                          {isSelected && <Check className="w-4 h-4 text-[#D71920] shrink-0" />}
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-2 leading-tight">
                          {plan.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-neutral-200/70 flex items-baseline justify-between">
                        <span className="text-[10px] text-neutral-400 font-semibold">{plan.duration}</span>
                        <div className="text-right">
                          {plan.mrp && (
                            <span className="text-[10px] text-neutral-400 line-through mr-1.5 font-normal">
                              {formatINR(plan.mrp)}
                            </span>
                          )}
                          <strong className="text-sm font-black text-[#D71920]">
                            {formatINR(plan.price)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Payment Mode Selection Form */}
              <form onSubmit={handleMembershipApplySubmit} className="space-y-3 pt-2">
                
                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    Payment Method (Mode of Payment) *
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label
                      onClick={() => setSelectedPaymentMode('CASH')}
                      className={`p-3 rounded-xl border-2 flex items-center gap-2.5 cursor-pointer transition ${
                        selectedPaymentMode === 'CASH'
                          ? 'border-[#D71920] bg-red-50 text-[#D71920] font-bold'
                          : 'border-neutral-200 bg-[#F7F7F7] text-neutral-700'
                      }`}
                    >
                      <Banknote className="w-4 h-4 shrink-0" />
                      <div>
                        <span className="block text-xs">Cash Payment</span>
                        <span className="text-[9px] text-neutral-500 block font-normal leading-tight">Pay at Store Counter / COD</span>
                      </div>
                    </label>

                    <label
                      onClick={() => setSelectedPaymentMode('UPI')}
                      className={`p-3 rounded-xl border-2 flex items-center gap-2.5 cursor-pointer transition ${
                        selectedPaymentMode === 'UPI'
                          ? 'border-[#D71920] bg-red-50 text-[#D71920] font-bold'
                          : 'border-neutral-200 bg-[#F7F7F7] text-neutral-700'
                      }`}
                    >
                      <QrCode className="w-4 h-4 shrink-0" />
                      <div>
                        <span className="block text-xs">UPI / Online</span>
                        <span className="text-[9px] text-neutral-500 block font-normal leading-tight">GPay / PhonePe / Paytm</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* If user is not logged in, collect name and phone */}
                {!user && (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#D71920]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Mobile Phone *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="10-digit phone"
                          className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#D71920]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Delivery Address in Bhiwadi (Optional)</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House no., Society, Area"
                        className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#D71920]"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Application Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#D71920] hover:bg-[#B5141A] text-white font-black text-xs rounded-xl transition shadow-red-glow flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Crown className="w-4 h-4 text-yellow-300" />
                  <span>
                    {loading 
                      ? 'Submitting Application...' 
                      : `APPLY FOR ${currentPlan.duration.toUpperCase()} MEMBERSHIP (${formatINR(currentPlan.price)})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-neutral-500 text-center leading-tight">
                  {selectedPaymentMode === 'CASH' 
                    ? '💵 Cash mode: Aap cash hamare delivery person ko ya Bachat Bazar counter (CB-03 Mansa Chowk) par de sakte hain.' 
                    : '📱 UPI mode: Application submit hone ke baad admin payment verify karke membership activate karega.'}
                </p>

              </form>
            </div>
          )}

          {/* Quick Demo Logins for Instant Testing */}
          <div className="mt-4 pt-3 border-t border-neutral-200">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider text-center mb-1.5">
              Quick One-Click Test Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => login('9876543210')}
                className="p-2 bg-red-50 hover:bg-red-100 border border-red-200 text-left rounded-lg text-[11px] text-[#D71920] transition cursor-pointer"
              >
                <strong>★ Active VIP Member</strong>
                <span className="block text-[10px] text-neutral-500">Rajesh (Lifetime Plan)</span>
              </button>

              <button
                onClick={() => login('9123456780')}
                className="p-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-left rounded-lg text-[11px] text-neutral-800 transition cursor-pointer"
              >
                <strong>Regular Shopper</strong>
                <span className="block text-[10px] text-neutral-500">Suresh (Non-Member)</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
