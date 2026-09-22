import React from 'react';
import { useStore } from '../../context/StoreContext';
import ProductCard from '../products/ProductCard';
import { ArrowRight } from 'lucide-react';

export default function DealsSection() {
  const { products, setCurrentView } = useStore();

  const dealProducts = products.filter(p => p.isDealOfDay || p.isFeatured).slice(0, 5);

  if (dealProducts.length === 0) return null;

  return (
    <section className="py-10 md:py-12 bg-[#FAFAFA] border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
            Today's Best Deals
          </h2>

          <button
            onClick={() => {
              setCurrentView('deals');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-[#D71920] hover:underline transition flex items-center gap-1 group"
          >
            <span>View All Offers</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        {/* Product Cards Grid (5 columns on xl) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
