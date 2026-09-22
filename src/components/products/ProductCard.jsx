import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatINR, getDiscountPercentage } from '../../utils/formatters';
import { getProductWhatsAppUrl } from '../../utils/whatsapp';
import { Plus, Minus, ShoppingCart, MessageCircle, Sparkles } from 'lucide-react';

export default function ProductCard({ product }) {
  const { isMember, openAuthModal } = useAuth();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { settings, setSelectedProduct } = useStore();

  const currentQty = getItemQuantity(product.id);
  const memberSaving = product.normalPrice - product.memberPrice;
  const discountPercent = getDiscountPercentage(product.mrp, product.memberPrice);

  return (
    <div className="bg-white border border-neutral-200 hover:border-neutral-300 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg flex flex-col justify-between relative group">
      
      {/* Discount Badge (Top-Right) */}
      {discountPercent > 0 && (
        <span className="absolute top-3 right-3 z-10 bg-[#D71920] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
          {discountPercent}% OFF
        </span>
      )}

      {/* Product Image & Info Area (Clickable) */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="cursor-pointer p-4 pb-2"
      >
        {/* Product Image */}
        <div className="aspect-square w-full rounded-xl overflow-hidden bg-white mb-3 flex items-center justify-center relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-300"
            loading="lazy"
          />
        </div>

        {/* Product Title */}
        <h3 className="font-bold text-xs sm:text-sm text-[#111111] line-clamp-2 min-h-[2.4rem] leading-snug group-hover:text-[#D71920] transition">
          {product.name}
        </h3>

        {/* MRP */}
        <div className="text-[11px] text-neutral-400 font-medium mt-1">
          <span>MRP </span>
          <span className="line-through">{formatINR(product.mrp)}</span>
        </div>
      </div>

      {/* Pricing & Add to Cart Section */}
      <div className="p-4 pt-0 space-y-2.5">
        
        {/* Two-Tier Prices Box */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-100">
          <div>
            <span className="text-[10px] text-neutral-500 block">Normal Price</span>
            <span className="font-bold text-[#111111] text-xs sm:text-sm">
              {formatINR(product.normalPrice)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#D71920] font-bold block">Member Price</span>
            <span className="font-black text-sm sm:text-base text-[#D71920]">
              {formatINR(product.memberPrice)}
            </span>
          </div>
        </div>

        {/* Savings Note */}
        {memberSaving > 0 && (
          <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <span>✓ You Save {formatINR(memberSaving)}</span>
          </div>
        )}

        {/* Action: Solid Red Add to Cart or Stepper */}
        {currentQty === 0 ? (
          <button
            onClick={() => addToCart(product, 1)}
            className="w-full py-2.5 px-3 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold text-xs rounded-xl transition duration-150 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Add to Cart</span>
          </button>
        ) : (
          <div className="flex items-center justify-between bg-[#111111] text-white rounded-xl p-1">
            <button
              onClick={() => updateQuantity(product.id, currentQty - 1)}
              className="w-8 h-7 bg-neutral-800 hover:bg-[#D71920] rounded-lg flex items-center justify-center transition"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-xs px-2">{currentQty} in cart</span>
            <button
              onClick={() => updateQuantity(product.id, currentQty + 1)}
              className="w-8 h-7 bg-neutral-800 hover:bg-[#D71920] rounded-lg flex items-center justify-center transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
