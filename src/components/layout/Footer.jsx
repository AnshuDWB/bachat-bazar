import React from 'react';
import { useStore } from '../../context/StoreContext';
import { getGeneralWhatsAppUrl } from '../../utils/whatsapp';
import {
  ShoppingBag,
  MessageCircle
} from 'lucide-react';

export default function Footer() {
  const { settings, setCurrentView, setActiveCategory } = useStore();

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] text-white pt-10 pb-20 md:pb-8 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Main Clean 5-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-neutral-800/80">

          {/* Col 1: Brand & Tagline */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 text-left"
            >
              <div className="w-8 h-8 bg-[#D71920] rounded-xl flex items-center justify-center text-white font-black text-lg">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-black text-white block leading-none">
                  BACHAT <span className="text-[#D71920]">BAZAR</span>
                </span>
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mt-0.5">
                  Har Din Ki Bachat
                </span>
              </div>
            </button>

            <p className="text-xs text-neutral-400 leading-relaxed pr-2">
              Bhiwadi's favorite neighborhood grocery store. Best daily staples at two transparent prices.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('deals');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#D71920] transition font-semibold"
                >
                  Offers
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('membership');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Membership
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('store-info');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('store-info');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('legal-privacy');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('legal-terms');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Policies & Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Policies
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('legal-refund');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Refund & Cancellation
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('legal-shipping');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('legal-whatsapp-messaging');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  WhatsApp Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('legal-cookies');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Follow Us & WhatsApp */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Follow Us
            </h4>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 text-neutral-400">
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 hover:text-white transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 hover:text-white transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 hover:text-white transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>

            {/* WhatsApp Us Button */}
            <div>
              <a
                href={getGeneralWhatsAppUrl(settings.whatsappNumber || '917073222340')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Bachat Bazar. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[11px]">
            <button onClick={() => setCurrentView('legal-privacy')} className="hover:text-neutral-300">Privacy</button>
            <span>•</span>
            <button onClick={() => setCurrentView('legal-terms')} className="hover:text-neutral-300">Terms</button>
            <span>•</span>
            <button onClick={() => setCurrentView('legal-data-deletion')} className="hover:text-neutral-300">Data Deletion</button>
            <span>•</span>
            <button onClick={() => setCurrentView('legal-grievance')} className="hover:text-neutral-300">Grievance</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
