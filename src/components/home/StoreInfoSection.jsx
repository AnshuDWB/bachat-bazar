import React from 'react';
import { useStore } from '../../context/StoreContext';
import { getGeneralWhatsAppUrl } from '../../utils/whatsapp';
import {
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  ShieldCheck,
  BadgePercent,
  Truck,
  Store,
  Clock
} from 'lucide-react';

export default function StoreInfoSection() {
  const { settings } = useStore();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    settings.address || "ARAVALI VIHAR CB-03 NEAR MANSA CHOWK RTO OFFICE ROAD BHIWADI Rajasthan 301019"
  )}`;

  const trustPoints = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#D71920]" />,
      title: "Quality Products",
      desc: "Har samaan ki guarantee"
    },
    {
      icon: <BadgePercent className="w-5 h-5 text-[#D71920]" />,
      title: "Value for Money",
      desc: "Behtar daam, zyada bachat"
    },
    {
      icon: <Truck className="w-5 h-5 text-[#D71920]" />,
      title: "Convenience",
      desc: "Ghar baithe shopping"
    },
    {
      icon: <Store className="w-5 h-5 text-[#D71920]" />,
      title: "Trusted Store",
      desc: "Aapka bharosa, hamari pehchaan"
    }
  ];

  return (
    <section className="py-10 md:py-14 bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Why Bachat Bazar? */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
                Why Bachat Bazar?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Aapke ghar ki zaroorat ka sabhi samaan, wholesale savings ke saath.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trustPoints.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAFAFA] border border-neutral-200/80 rounded-2xl p-4 flex items-start gap-3.5 hover:border-red-200 transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shrink-0 shadow-2xs">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#111111]">{item.title}</h3>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visit Our Store */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
                Visit Our Store
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Walk into our Bhiwadi store or order online for fast home delivery.
              </p>
            </div>

            <div className="bg-[#FAFAFA] border border-neutral-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                
                {/* Store Details */}
                <div className="sm:col-span-7 space-y-2.5 text-xs text-neutral-600">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {settings.address || "ARAVALI VIHAR, CB-03, NEAR MANSA CHOWK, RTO OFFICE ROAD, BHIWADI, Alwar, Rajasthan, 301019"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#D71920] shrink-0" />
                    <a href={`tel:${settings.phone || '7073222340'}`} className="font-bold text-[#111111] hover:text-[#D71920]">
                      +91 {settings.phone || '7073222340'}
                    </a>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <a
                      href={getGeneralWhatsAppUrl(settings.whatsappNumber || '917073222340')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-700 hover:underline"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>

                  <div className="pt-2">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold text-xs rounded-xl transition shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Get Directions</span>
                    </a>
                  </div>
                </div>

                {/* Map Graphic Preview */}
                <div className="sm:col-span-5 rounded-xl overflow-hidden border border-neutral-200 bg-white aspect-[4/3] flex items-center justify-center relative group">
                  <iframe
                    title="Bachat Bazar Bhiwadi Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14051.87679361732!2d76.8402863!3d28.2081691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d36b856b3e02f%3A0x89ad0b4f620e7dc9!2sMansa%20Chowk%2C%20Bhiwadi%2C%20Rajasthan%20301019!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    className="w-full h-full border-0 pointer-events-none"
                    loading="lazy"
                  ></iframe>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/10 hover:bg-black/20 transition flex items-center justify-center text-white"
                  >
                    <span className="bg-[#111111]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D71920]" />
                      Open Map
                    </span>
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
