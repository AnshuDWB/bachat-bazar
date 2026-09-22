import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, MapPin, Phone } from 'lucide-react';

export default function TopBanner() {
  const { settings } = useStore();
  const { isMember, openAuthModal } = useAuth();

  return (
    <div className="bg-[#111111] text-white text-[11px] py-1.5 px-4 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Location */}
        <div className="flex items-center gap-1.5 text-neutral-300">
          <MapPin className="w-3.5 h-3.5 text-[#D71920] shrink-0" />
          <span className="truncate">
            Aravali Vihar, Bhiwadi (301019)
          </span>
        </div>

        {/* Center: Offer note */}
        <div className="hidden sm:inline-flex items-center gap-1 text-neutral-300 font-medium">
          <span className="text-[#D71920] font-bold">Har Din Ki Bachat:</span> Free Bhiwadi delivery on orders above ₹{settings.freeDeliveryThreshold || 499}
        </div>

        {/* Right: Phone & Member Quick Link */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${settings.phone || '7073222340'}`}
            className="text-neutral-300 hover:text-white transition flex items-center gap-1 font-semibold"
          >
            <Phone className="w-3 h-3 text-[#D71920]" />
            <span>{settings.phone || '7073222340'}</span>
          </a>

          {!isMember ? (
            <button
              onClick={() => openAuthModal('membership')}
              className="text-red-400 hover:text-red-300 font-bold transition flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span>Join Club</span>
            </button>
          ) : (
            <span className="text-yellow-400 font-bold">★ VIP Member</span>
          )}
        </div>

      </div>
    </div>
  );
}
