import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/formatters';
import { Crown, Percent, Gift, ShoppingBag, History, Sparkles, Banknote, ShieldCheck } from 'lucide-react';

export default function MembershipPromo() {
  const { user, isMember, openAuthModal } = useAuth();
  const { membershipPlans } = useStore();

  const lifetimePlan = membershipPlans?.find(p => p.id === 'plan-lifetime') || { price: 5999 };

  const features = [
    {
      icon: <Percent className="w-4 h-4 text-[#D71920]" />,
      title: "1, 2, 3 Yr & Lifetime"
    },
    {
      icon: <Banknote className="w-4 h-4 text-[#D71920]" />,
      title: "Cash / UPI Payment"
    },
    {
      icon: <ShoppingBag className="w-4 h-4 text-[#D71920]" />,
      title: "Wholesale Member Rates"
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-[#D71920]" />,
      title: "Admin Verified Activation"
    }
  ];

  return (
    <section className="py-10 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="bg-[#FFF8F8] border border-red-100 rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-xs">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Title & Subtitle */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#D71920] text-white flex items-center justify-center shadow-sm">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#111111] tracking-tight">
                      Bachat Bazar VIP Membership Club
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 font-medium">
                      1 Year, 2 Years, 3 Years ya Lifetime VIP Club ({formatINR(lifetimePlan.price)}) chuniyen aur har shopping par maximum bachat paayein.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {!isMember ? (
                  <>
                    <button
                      onClick={() => openAuthModal('membership')}
                      className="px-6 py-3 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-red-glow cursor-pointer"
                    >
                      View Plans & Apply (Cash Mode Available)
                    </button>

                    {!user && (
                      <button
                        onClick={() => openAuthModal('login')}
                        className="px-6 py-3 bg-white border border-neutral-300 hover:border-[#D71920] text-[#111111] hover:text-[#D71920] font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
                      >
                        Login
                      </button>
                    )}
                  </>
                ) : (
                  <div className="px-5 py-2.5 bg-white border border-red-200 rounded-xl font-bold text-xs text-[#D71920] flex items-center gap-2 shadow-2xs">
                    <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                    <span>Active Member ID: {user?.memberId} ({user?.membershipPlanName || 'VIP Member'})</span>
                  </div>
                )}
              </div>

              {/* 4 Feature Points */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-red-100/80">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/80 border border-red-50 p-2.5 rounded-xl shadow-2xs">
                    <div className="w-7 h-7 rounded-lg bg-red-100/70 flex items-center justify-center shrink-0">
                      {f.icon}
                    </div>
                    <span className="text-[11px] font-bold text-[#111111]">
                      {f.title}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Graphic / Image */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-md border-2 border-white">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
                  alt="Happy Bachat Bazar Shoppers"
                  className="w-full h-56 sm:h-64 object-cover"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
