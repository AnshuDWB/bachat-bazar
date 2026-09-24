import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, ShoppingBag, Apple, Milk, Coffee, Sparkles, Home, Sparkle, Utensils } from 'lucide-react';

export default function CategoryGrid() {
  const { categories, setActiveCategory, setCurrentView } = useStore();

  const handleSelect = (catId) => {
    setActiveCategory(catId);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Custom icon mapper for clean modern category icons
  const getCategoryIcon = (cat) => {
    if (!cat) return <ShoppingBag className="w-6 h-6 text-[#D71920]" />;
    if (typeof cat === 'object' && cat.icon) {
      return <span className="text-2xl">{cat.icon}</span>;
    }
    const catId = typeof cat === 'string' ? cat : (cat.id || '');
    switch (catId) {
      case 'grocery': return <ShoppingBag className="w-6 h-6 text-[#D71920]" />;
      case 'fruits-veg':
      case 'fruits-vegetables': return <Apple className="w-6 h-6 text-[#D71920]" />;
      case 'dairy':
      case 'dairy-bakery': return <Milk className="w-6 h-6 text-[#D71920]" />;
      case 'snacks':
      case 'snacks-beverages': return <Coffee className="w-6 h-6 text-[#D71920]" />;
      case 'personal-care': return <Sparkles className="w-6 h-6 text-[#D71920]" />;
      case 'household': return <Home className="w-6 h-6 text-[#D71920]" />;
      case 'cleaning': return <Sparkle className="w-6 h-6 text-[#D71920]" />;
      case 'beverages': return <Utensils className="w-6 h-6 text-[#D71920]" />;
      default: return <ShoppingBag className="w-6 h-6 text-[#D71920]" />;
    }
  };

  return (
    <section className="py-10 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
            Shop by Category
          </h2>

          <button
            onClick={() => {
              setActiveCategory('all');
              setCurrentView('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-[#D71920] hover:underline transition flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {(categories || []).map((cat) => (
            <button
              key={cat?.id || Math.random()}
              onClick={() => handleSelect(cat?.id || 'all')}
              className="bg-white border border-neutral-200 hover:border-[#D71920] rounded-2xl p-4 text-center transition-all duration-200 group flex flex-col items-center justify-center gap-2.5 shadow-2xs hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Category Icon */}
              <div className="w-12 h-12 rounded-xl bg-red-50/70 border border-red-100 flex items-center justify-center group-hover:scale-110 transition">
                {getCategoryIcon(cat)}
              </div>

              {/* Category Name */}
              <h3 className="font-bold text-xs text-[#111111] group-hover:text-[#D71920] transition line-clamp-1">
                {cat?.name || 'Category'}
              </h3>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
