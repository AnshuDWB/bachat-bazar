import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
  Zap,
  Crown,
  Clock,
  Banknote,
  QrCode,
  ArrowRight,
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
    description: "1 Saal tak 500+ items par VIP Member rate & priority delivery"
  },
  {
    id: "plan-2yr",
    name: "2 Years VIP Plan",
    duration: "2 Years",
    price: 1799,
    mrp: 2999,
    badge: "Most Popular",
    description: "2 Saal ki guaranteed bachat & extra seasonal festive offers"
  },
  {
    id: "plan-3yr",
    name: "3 Years VIP Plan",
    duration: "3 Years",
    price: 2499,
    mrp: 4499,
    badge: "Family Saver",
    description: "Large families ke liye 3 saal tak maximum wholesale savings"
  },
  {
    id: "plan-lifetime",
    name: "Lifetime VIP Club (Maha Bachat)",
    duration: "Lifetime",
    price: 5999,
    mrp: 9999,
    badge: "Best Value • Lifetime",
    description: "Zindagi bhar ki bachat — One-time payment, unlimited lifetime VIP rates"
  }
];

export default function MembershipCard() {
  const { user, isMember, applyMembership, toggleMembership, openAuthModal } = useAuth();
  const { showToast, membershipPlans } = useStore();

  const activePlans = (membershipPlans && membershipPlans.length > 0) ? membershipPlans : fallbackPlans;

  const [selectedPlanId, setSelectedPlanId] = useState('plan-lifetime');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('CASH'); // 'CASH' | 'UPI'
  const [loading, setLoading] = useState(false);

  const currentPlan = activePlans.find(p => p.id === selectedPlanId) || activePlans[3] || activePlans[0];

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('membership');
      return;
    }

    setLoading(true);
    const res = await applyMembership({
      planId: selectedPlanId,
      paymentMethod: selectedPaymentMode,
      notes: selectedPaymentMode === 'CASH' 
        ? 'Customer selected Cash payment at Store Counter / Doorstep' 
        : 'Customer selected UPI payment'
    });
    setLoading(false);

    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleDeactivate = async () => {
    const res = await toggleMembership(false);
    if (res.success) {
      showToast('Membership deactivated', 'success');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Digital Member Card Graphic */}
      <div className="relative rounded-2xl overflow-hidden p-6 sm:p-7 text-white shadow-xl bg-gradient-to-br from-[#111111] via-[#1C1C1C] to-[#2B0B0C] border border-[#D71920]/40">
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#D71920]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex items-center justify-between relative z-10 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#D71920] rounded-xl flex items-center justify-center font-black text-white text-xl shadow-red-glow">
              B
            </div>
            <div>
              <span className="text-base font-black tracking-tight block leading-none">
                BACHAT <span className="text-[#D71920]">BAZAR</span>
              </span>
              <span className="text-[10px] tracking-widest text-neutral-400 font-semibold uppercase block mt-0.5">
                VIP Member Card
              </span>
            </div>
          </div>

          <div className="text-right">
            {isMember ? (
              <span className="bg-[#D71920] text-white font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-yellow-300" />
                ACTIVE VIP
              </span>
            ) : user?.membershipStatus === 'PENDING_APPROVAL' ? (
              <span className="bg-amber-500 text-white font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                PENDING APPROVAL
              </span>
            ) : (
              <span className="bg-neutral-800 text-neutral-400 font-bold text-xs px-3 py-1 rounded-full border border-neutral-700">
                INACTIVE
              </span>
            )}
          </div>
        </div>

        {/* Card Number / ID */}
        <div className="relative z-10 my-3">
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Membership Number</p>
          <p className="text-xl sm:text-2xl font-mono font-bold tracking-widest text-white mt-0.5">
            {user?.memberId || 'BB-MEM-APPLY-NOW'}
          </p>
        </div>

        {/* Card Bottom: Plan, Holder Name & Validity */}
        <div className="flex items-end justify-between relative z-10 pt-4 border-t border-neutral-800/80 text-xs">
          <div>
            <p className="text-[10px] text-neutral-400 uppercase font-semibold">Card Holder</p>
            <p className="font-bold text-white uppercase text-sm mt-0.5">{user?.name || 'GUEST USER'}</p>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-neutral-400 uppercase font-semibold">Plan Validity</p>
            <p className="font-bold text-[#D71920] text-sm mt-0.5">
              {isMember 
                ? (user?.membershipExpiryDate ? `Valid till ${formatDate(user.membershipExpiryDate)}` : 'Lifetime VIP (No Expiry)')
                : user?.membershipStatus === 'PENDING_APPROVAL' 
                  ? 'Verification in Progress' 
                  : 'Not Subscribed'}
            </p>
          </div>
        </div>

      </div>

      {/* If User has Pending Application */}
      {user?.membershipStatus === 'PENDING_APPROVAL' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Membership Application Under Admin Verification</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Aapki <strong>{user?.pendingApplication?.planName || 'VIP Membership'}</strong> ({formatINR(user?.pendingApplication?.planPrice || 5999)}) ki request submit ho chuki hai. Payment mode: <strong>{user?.pendingApplication?.paymentMethod || 'CASH'}</strong>.
          </p>
          <p className="text-[11px] text-amber-700">
            💵 <strong>Cash Payment:</strong> Aap cash amount Bachat Bazar counter (CB-03 Mansa Chowk) par de sakte hain ya hamare delivery person ko de sakte hain. Admin dwara payment confirm hote hi membership turant activate ho jayegi.
          </p>
        </div>
      )}

      {/* If Active Member */}
      {isMember ? (
        <div className="bg-[#F7F7F7] border border-neutral-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111] flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#D71920]" />
              Your Active Plan: <span className="text-[#D71920]">{user?.membershipPlanName || 'VIP Club'}</span>
            </h4>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              ✓ Active
            </span>
          </div>

          <div className="space-y-2 text-xs text-neutral-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D71920]" />
              <span>Special Two-Tier Member Prices automatically applied on all 500+ items</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D71920]" />
              <span>Free Home Delivery on all orders above ₹499 in Bhiwadi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D71920]" />
              <span>Priority Customer Support & Special WhatsApp Deals</span>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">
              Member Since: {user?.membershipStartDate ? formatDate(user.membershipStartDate) : 'Active'}
            </span>
            <button
              onClick={handleDeactivate}
              className="text-[11px] text-neutral-500 hover:text-red-600 underline cursor-pointer"
            >
              Deactivate membership
            </button>
          </div>
        </div>
      ) : user?.membershipStatus !== 'PENDING_APPROVAL' && (
        
        /* Non-Member: Interactive 4-Tier Plan Selection & Cash/UPI Apply */
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-5 shadow-xs">
          <div>
            <span className="text-xs font-black text-[#D71920] uppercase tracking-wider block">
              Choose Your Membership Validity Category
            </span>
            <p className="text-xs text-neutral-600 mt-0.5">
              1 Year, 2 Years, 3 Years ya Lifetime VIP Club choose karein aur har shopping par rupaye bachayein.
            </p>
          </div>

          {/* 4 Plan Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activePlans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const isLifetime = plan.id === 'plan-lifetime' || plan.duration === 'Lifetime';

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#D71920] bg-red-50/60 shadow-sm'
                      : 'border-neutral-200 bg-[#FBFBFB] hover:border-neutral-300'
                  }`}
                >
                  {plan.badge && (
                    <span className={`absolute -top-2.5 right-3 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-2xs ${
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
                    <p className="text-[10px] text-neutral-500 mt-1 leading-tight">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-neutral-200/80 flex items-baseline justify-between">
                    <span className="text-[10px] text-neutral-500 font-semibold">{plan.duration} Validity</span>
                    <div className="text-right">
                      {plan.mrp && (
                        <span className="text-[10px] text-neutral-400 line-through mr-1 font-normal">
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

          {/* Payment Method Selector */}
          <div className="pt-1 space-y-2">
            <label className="block text-xs font-bold text-neutral-800">
              Payment Mode (Aap payment kaise karenge?)
            </label>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <label
                onClick={() => setSelectedPaymentMode('CASH')}
                className={`p-3.5 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition ${
                  selectedPaymentMode === 'CASH'
                    ? 'border-[#D71920] bg-red-50 text-[#D71920] font-bold'
                    : 'border-neutral-200 bg-[#F7F7F7] text-neutral-700'
                }`}
              >
                <Banknote className="w-5 h-5 shrink-0" />
                <div>
                  <span className="block text-xs">Cash Payment</span>
                  <span className="text-[10px] text-neutral-500 block font-normal leading-tight">Counter ya Doorstep collection</span>
                </div>
              </label>

              <label
                onClick={() => setSelectedPaymentMode('UPI')}
                className={`p-3.5 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition ${
                  selectedPaymentMode === 'UPI'
                    ? 'border-[#D71920] bg-red-50 text-[#D71920] font-bold'
                    : 'border-neutral-200 bg-[#F7F7F7] text-neutral-700'
                }`}
              >
                <QrCode className="w-5 h-5 shrink-0" />
                <div>
                  <span className="block text-xs">UPI / Online</span>
                  <span className="text-[10px] text-neutral-500 block font-normal leading-tight">GPay / PhonePe / Paytm</span>
                </div>
              </label>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleApply}
            disabled={loading}
            className="w-full py-3.5 bg-[#D71920] hover:bg-[#B5141A] text-white font-black text-xs sm:text-sm rounded-xl transition shadow-red-glow flex items-center justify-center gap-2 cursor-pointer"
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
            ✓ Application submit hone ke baad Admin payment verify karke aapka VIP rate turant activate karega.
          </p>
        </div>
      )}

    </div>
  );
}
