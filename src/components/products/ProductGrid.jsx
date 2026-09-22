import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import ProductCard from './ProductCard';
import { Search, RefreshCw } from 'lucide-react';

export default function ProductGrid({ title, subtitle, filterDeal = false, filterFeatured = false }) {
  const {
    products,
    categories,
    loading,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [sortBy, setSortBy] = useState('default');
  const [selectedBrand, setSelectedBrand] = useState('all');

  // Extract unique brands for filtering
  const brands = useMemo(() => {
    const list = new Set();
    products.forEach(p => {
      if (p.brand) list.add(p.brand);
    });
    return Array.from(list);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (filterDeal) {
      list = list.filter(p => p.isDealOfDay);
    }

    if (filterFeatured) {
      list = list.filter(p => p.isFeatured);
    }

    if (activeCategory && activeCategory !== 'all') {
      list = list.filter(p => p.category === activeCategory);
    }

    if (selectedBrand && selectedBrand !== 'all') {
      list = list.filter(p => p.brand === selectedBrand);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.normalPrice - b.normalPrice);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.normalPrice - a.normalPrice);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => {
        const discA = ((a.mrp - a.memberPrice) / a.mrp) * 100;
        const discB = ((b.mrp - b.memberPrice) / b.mrp) * 100;
        return discB - discA;
      });
    }

    return list;
  }, [products, filterDeal, filterFeatured, activeCategory, selectedBrand, searchQuery, sortBy]);

  return (
    <section className="py-10 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
              {title || "Daily Grocery Staples"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              {subtitle || "Wholesale savings on Atta, Dal, Oil, Spices, Dairy & Personal Care in Bhiwadi."}
            </p>
          </div>

          {/* Controls: Brand & Sorting */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-[#F7F7F7] border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-neutral-700 outline-none focus:border-[#D71920]"
            >
              <option value="all">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#F7F7F7] border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-neutral-700 outline-none focus:border-[#D71920]"
            >
              <option value="default">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              activeCategory === 'all'
                ? 'bg-[#D71920] text-white shadow-xs'
                : 'bg-[#F7F7F7] text-neutral-700 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            All Items ({products.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-[#D71920] text-white shadow-xs font-bold'
                  : 'bg-[#F7F7F7] text-neutral-700 border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div key={n} className="bg-neutral-100 rounded-2xl p-4 animate-pulse h-72"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-[#FAFAFA] rounded-3xl p-10 text-center border border-neutral-200 max-w-md mx-auto my-8">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3 text-neutral-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#111111] mb-1">No products found</h3>
            <p className="text-xs text-neutral-500 mb-4">
              We couldn't find any products matching your selected filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedBrand('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#D71920] text-white font-bold text-xs rounded-xl transition hover:bg-[#B5141A] inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        ) : (
          /* 5 Columns Product Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
