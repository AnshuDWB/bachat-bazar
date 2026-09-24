import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { getGeneralWhatsAppUrl } from '../../utils/whatsapp';
import { formatINR } from '../../utils/formatters';
import {
  Search,
  ShoppingCart,
  User,
  MessageCircle,
  Menu,
  X,
  Sparkles,
  Shield,
  ChevronDown,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

export default function Header() {
  const { user, isMember, isAdmin, openAuthModal, openAccountModal, logout } = useAuth();
  const { totalItemCount, setIsCartOpen } = useCart();
  const {
    settings,
    categories,
    products,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    currentView,
    setCurrentView,
    setSelectedProduct
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  // Filter products for instant auto-complete suggestions
  const searchSuggestions = searchQuery.trim().length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (view, category = 'all') => {
    setCurrentView(view);
    setActiveCategory(category);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSuggestion = (product) => {
    setSelectedProduct(product);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-18 sm:h-20 gap-4">

          {/* Left: Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left group flex items-center gap-2.5 shrink-0 focus:outline-none"
          >
            <div className="w-10 h-10 bg-[#D71920] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#111111] group-hover:text-[#D71920] transition block leading-none">
                BACHAT <span className="text-[#D71920]">BAZAR</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-neutral-500 uppercase block mt-1">
                Har Din Ki Bachat
              </span>
            </div>
          </button>

          {/* Center: Search Bar with Autocomplete */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 relative" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search for products, brands and more..."
                className="w-full bg-[#F7F7F7] hover:bg-white focus:bg-white text-[#111111] placeholder-neutral-400 text-xs sm:text-sm rounded-full pl-11 pr-10 py-2.5 border border-neutral-200 focus:border-[#D71920] focus:ring-2 focus:ring-[#D71920]/15 transition outline-none"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-3" />

              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="absolute right-3.5 top-3 text-neutral-400">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            {/* Live Autocomplete Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-50">
                <div className="p-2.5 border-b border-neutral-100 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Suggested Products
                </div>
                <div className="divide-y divide-neutral-100">
                  {searchSuggestions.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => handleSelectSuggestion(prod)}
                      className="w-full p-2.5 flex items-center justify-between hover:bg-[#FFF1F1] text-left transition"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-9 h-9 object-cover rounded-lg border border-neutral-200"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#111111] line-clamp-1">{prod.name}</p>
                          <p className="text-[10px] text-neutral-500">{prod.brand} • {prod.unit}</p>
                        </div>
                      </div>
                      <div className="text-right pl-2">
                        <span className="text-xs font-black text-[#D71920]">
                          {formatINR(isMember ? prod.memberPrice : prod.normalPrice)}
                        </span>
                        {isMember && (
                          <span className="block text-[10px] text-neutral-400 line-through">
                            {formatINR(prod.normalPrice)}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setCurrentView('catalog');
                    setIsSearchFocused(false);
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-[#D71920] bg-neutral-50 hover:bg-[#FFF1F1] transition"
                >
                  View all matching results →
                </button>
              </div>
            )}
          </div>

          {/* Right Header Controls: Login, Cart, WhatsApp */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Login / User Account */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${
                    isMember
                      ? 'bg-[#FFF1F1] text-[#D71920] border-[#FCA5A5]'
                      : 'bg-[#F7F7F7] text-[#111111] border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <User className="w-4 h-4 text-[#D71920]" />
                  <span className="hidden sm:inline max-w-[90px] truncate">
                    {(user.name || user.phone || 'User').split(' ')[0]}
                  </span>
                  {isMember && <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400 hidden sm:inline" />}
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {/* Account Dropdown */}
                {isAccountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="text-xs font-bold text-[#111111] truncate">{user.name || user.phone || 'Customer'}</p>
                      <p className="text-[10px] text-neutral-500">{user.phone}</p>
                      {isMember ? (
                        <div className="mt-1 inline-flex items-center gap-1 bg-red-100 text-[#D71920] text-[10px] font-bold px-2 py-0.5 rounded">
                          ★ Active Member ({user.memberId})
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setIsAccountDropdownOpen(false);
                            openAuthModal('membership');
                          }}
                          className="mt-1 text-[11px] font-bold text-[#D71920] hover:underline"
                        >
                          Unlock Member Prices →
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setIsAccountDropdownOpen(false);
                        openAccountModal('profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-[#D71920] transition"
                    >
                      My Profile & Addresses
                    </button>

                    <button
                      onClick={() => {
                        setIsAccountDropdownOpen(false);
                        openAccountModal('orders');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-[#D71920] transition"
                    >
                      My Orders & History
                    </button>

                    <button
                      onClick={() => {
                        setIsAccountDropdownOpen(false);
                        openAccountModal('membership');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-[#D71920] transition"
                    >
                      Membership Benefits
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setIsAccountDropdownOpen(false);
                          setCurrentView('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-[#D71920] bg-red-50 hover:bg-red-100 transition flex items-center gap-1.5"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="border-t border-neutral-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setIsAccountDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold text-[#111111] hover:text-[#D71920] transition border border-transparent hover:border-neutral-200"
              >
                <User className="w-4 h-4 text-[#D71920]" />
                <span className="hidden sm:inline">Login / Register</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#F7F7F7] hover:bg-neutral-200/80 text-[#111111] transition flex items-center justify-center"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5 text-[#111111]" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D71920] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* Green WhatsApp Us Pill */}
            <a
              href={getGeneralWhatsAppUrl(settings.whatsappNumber || '917073222340')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl transition shadow-xs"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-neutral-700 hover:text-[#D71920] rounded-xl hover:bg-neutral-100 transition"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Bottom Horizontal Desktop Navigation Bar */}
        <div className="hidden md:flex items-center justify-between py-2.5 border-t border-neutral-100 text-xs font-semibold">
          <nav className="flex items-center gap-6 text-neutral-600">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-[#D71920] transition pb-1 ${
                currentView === 'home' ? 'text-[#D71920] font-bold border-b-2 border-[#D71920]' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('catalog')}
              className={`hover:text-[#D71920] transition pb-1 ${
                currentView === 'catalog' ? 'text-[#D71920] font-bold border-b-2 border-[#D71920]' : ''
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => handleNavClick('deals')}
              className={`hover:text-[#D71920] transition pb-1 ${
                currentView === 'deals' ? 'text-[#D71920] font-bold border-b-2 border-[#D71920]' : ''
              }`}
            >
              Offers
            </button>
            <button
              onClick={() => handleNavClick('membership')}
              className={`hover:text-[#D71920] transition pb-1 ${
                currentView === 'membership' ? 'text-[#D71920] font-bold border-b-2 border-[#D71920]' : ''
              }`}
            >
              Membership
            </button>
            <button
              onClick={() => handleNavClick('store-info')}
              className={`hover:text-[#D71920] transition pb-1 ${
                currentView === 'store-info' ? 'text-[#D71920] font-bold border-b-2 border-[#D71920]' : ''
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('store-info')}
              className="hover:text-[#D71920] transition pb-1"
            >
              Contact
            </button>
          </nav>

          <div className="text-[11px] text-neutral-500 font-medium">
            📍 Aravali Vihar, Bhiwadi • <strong className="text-[#D71920]">Free Delivery above ₹{settings.freeDeliveryThreshold || 499}</strong>
          </div>
        </div>

      </div>

      {/* Mobile Search Bar (Below Header on Mobile) */}
      <div className="md:hidden px-4 py-2.5 bg-white border-t border-neutral-100">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, brands and more..."
            className="w-full bg-[#F7F7F7] text-xs rounded-full pl-9 pr-8 py-2 border border-neutral-200 focus:border-[#D71920] outline-none"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2 text-neutral-400">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 px-4 py-3 space-y-2 text-xs font-semibold">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left py-2 px-2 hover:bg-neutral-50 rounded-lg"
          >
            🏠 Home
          </button>
          <button
            onClick={() => handleNavClick('catalog')}
            className="w-full text-left py-2 px-2 hover:bg-neutral-50 rounded-lg"
          >
            📦 All Categories
          </button>
          <button
            onClick={() => handleNavClick('deals')}
            className="w-full text-left py-2 px-2 hover:bg-neutral-50 rounded-lg text-[#D71920]"
          >
            🔥 Today's Offers
          </button>
          <button
            onClick={() => handleNavClick('membership')}
            className="w-full text-left py-2 px-2 hover:bg-neutral-50 rounded-lg"
          >
            ⭐ Bachat Membership
          </button>
          <button
            onClick={() => handleNavClick('store-info')}
            className="w-full text-left py-2 px-2 hover:bg-neutral-50 rounded-lg"
          >
            📍 Store & Contact
          </button>
          <a
            href={getGeneralWhatsAppUrl(settings.whatsappNumber || '917073222340')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-2 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp ({settings.phone || '7073222340'})
          </a>
        </div>
      )}

    </header>
  );
}
