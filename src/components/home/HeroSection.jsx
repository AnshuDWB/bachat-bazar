import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { ShoppingCart, Gift, ChevronRight, ChevronLeft, Crown, Sparkles } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

const fallbackSlides = [
  {
    id: "hero-1",
    title: "Fresh Vegetables & Daily Staples",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80",
    badgeText: "Zyada Kharido, Zyada Bachao",
    productName: "Aashirvaad Shudh Atta 5kg",
    mrp: 280,
    normalPrice: 249,
    memberPrice: 229
  },
  {
    id: "hero-2",
    title: "Premium Groceries & Dry Fruits",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80",
    badgeText: "Bachat Dhamaka Offers",
    productName: "Tata Sampann Kali Mirch 100g",
    mrp: 140,
    normalPrice: 119,
    memberPrice: 105
  },
  {
    id: "hero-3",
    title: "Pure Dairy, Desi Ghee & Edible Oils",
    image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=800&auto=format&fit=crop&q=80",
    badgeText: "Shudhata Aur Bachat",
    productName: "Fortune Sunlite Refined Oil 1L",
    mrp: 165,
    normalPrice: 145,
    memberPrice: 132
  }
];

export default function HeroSection() {
  const { isMember, openAuthModal } = useAuth();
  const { setCurrentView, setActiveCategory, heroSlides } = useStore();

  // Active slides filtering (only active slides)
  const activeSlides = (heroSlides && heroSlides.length > 0)
    ? heroSlides.filter(s => s.isActive !== false)
    : fallbackSlides;

  const slidesToDisplay = activeSlides.length > 0 ? activeSlides : fallbackSlides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play slider every 5 seconds
  useEffect(() => {
    if (slidesToDisplay.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slidesToDisplay.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slidesToDisplay.length, isPaused]);

  // Ensure index stays valid when slides length changes
  useEffect(() => {
    if (currentIndex >= slidesToDisplay.length) {
      setCurrentIndex(0);
    }
  }, [slidesToDisplay.length, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slidesToDisplay.length) % slidesToDisplay.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slidesToDisplay.length);
  };

  const currentSlide = slidesToDisplay[currentIndex] || slidesToDisplay[0];

  return (
    <section className="bg-gradient-to-b from-white via-[#FAFAFA] to-[#F7F7F7] py-8 md:py-14 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Main Headline */}
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111] block tracking-tight">
                Har Din Ki
              </span>
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#D71920] block tracking-tight leading-none">
                Bachat
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111] block tracking-tight">
                Bachat Bazar Ke Saath
              </span>
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-neutral-600 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Rozmarra ki zaroorat ka samaan, behtar daam par. Fresh groceries and daily staples directly delivered to your home in Bhiwadi.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                onClick={() => {
                  setCurrentView('catalog');
                  setActiveCategory('all');
                  window.scrollTo({ top: 550, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-red-glow flex items-center gap-2 group cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Shop Now</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('deals');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-white border border-neutral-300 hover:border-[#D71920] text-[#111111] hover:text-[#D71920] font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Gift className="w-4 h-4 text-[#D71920]" />
                <span>Today's Offers</span>
              </button>
            </div>

            {/* Members Get Special Prices Strip */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-3.5 shadow-sm max-w-md mx-auto lg:mx-0 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-[#D71920] shrink-0">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#111111] block">
                    Members Get Special Prices
                  </span>
                  <span className="text-[10px] text-neutral-500 block">
                    Save up to ₹30–₹50 on every grocery item
                  </span>
                </div>
              </div>

              {!isMember ? (
                <button
                  onClick={() => openAuthModal('membership')}
                  className="px-3 py-1.5 bg-[#D71920] hover:bg-[#B5141A] text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shrink-0 shadow-xs cursor-pointer"
                >
                  <span>Join Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Active Member
                </span>
              )}
            </div>

          </div>

          {/* Right Hero Visual (Dynamic Slider + Basket + Zyada Kharido Tag) */}
          <div 
            className="lg:col-span-6 relative group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            
            {/* Dynamic Floating Badge */}
            <div className="absolute top-2 right-4 sm:right-8 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-200 shadow-md transform rotate-2 pointer-events-none transition-all duration-300">
              <span className="text-xs font-black text-[#D71920]">
                {currentSlide.badgeText || 'Zyada Kharido, Zyada Bachao'}
              </span>
            </div>

            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-red-50 to-white p-3 sm:p-5 border border-neutral-200 shadow-xl">
              
              {/* Slide Image Container */}
              <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-neutral-100">
                <img
                  key={currentSlide.id || currentIndex}
                  src={currentSlide.image}
                  alt={currentSlide.title || "Bachat Bazar Grocery"}
                  className="w-full h-full object-cover rounded-2xl transition-opacity duration-700 ease-in-out"
                />

                {/* Subtle gradient overlay at bottom for card readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Left & Right Nav Buttons (visible on hover / touch) */}
                {slidesToDisplay.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      aria-label="Previous Slide"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#111111] hover:text-[#D71920] flex items-center justify-center shadow-md backdrop-blur-xs transition transform hover:scale-110 active:scale-95 cursor-pointer opacity-90 sm:opacity-0 group-hover:opacity-100 duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handleNext}
                      aria-label="Next Slide"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#111111] hover:text-[#D71920] flex items-center justify-center shadow-md backdrop-blur-xs transition transform hover:scale-110 active:scale-95 cursor-pointer opacity-90 sm:opacity-0 group-hover:opacity-100 duration-200"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Dynamic Product Two-Tier Price Tag Overlay */}
                {currentSlide.productName && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-neutral-200 shadow-lg flex items-center justify-between text-xs z-10">
                    <div className="pr-2">
                      <span className="text-[10px] font-bold text-[#D71920] uppercase tracking-wider block">
                        Bachat Two-Price System
                      </span>
                      <strong className="text-xs font-bold text-[#111111] line-clamp-1">
                        {currentSlide.productName}
                      </strong>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-neutral-500 block">
                        Normal: {currentSlide.mrp ? <strong className="line-through text-neutral-400 font-normal mr-1">{formatINR(currentSlide.mrp)}</strong> : null}
                        <strong>{formatINR(currentSlide.normalPrice)}</strong>
                      </span>
                      <span className="text-xs font-black text-[#D71920] bg-red-50 px-2 py-0.5 rounded inline-block border border-red-200 mt-0.5">
                        Member: {formatINR(currentSlide.memberPrice)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Slider Pagination Dots */}
              {slidesToDisplay.length > 1 && (
                <div className="flex items-center justify-center gap-2 pt-3">
                  {slidesToDisplay.map((slide, idx) => (
                    <button
                      key={slide.id || idx}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                        idx === currentIndex 
                          ? 'w-7 bg-[#D71920]' 
                          : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                      }`}
                    />
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
