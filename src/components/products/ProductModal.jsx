import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatINR, getDiscountPercentage } from '../../utils/formatters';
import { getProductWhatsAppUrl } from '../../utils/whatsapp';
import {
  X,
  Plus,
  Minus,
  ShoppingCart,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Truck,
  CheckCircle2
} from 'lucide-react';

export default function ProductModal() {
  const { selectedProduct, setSelectedProduct, settings } = useStore();
  const { isMember, openAuthModal } = useAuth();
  const { addToCart, setIsCheckoutOpen, setIsCartOpen } = useCart();

  const [qty, setQty] = useState(1);

  if (!selectedProduct) return null;

  const product = selectedProduct;
  const memberSaving = product.normalPrice - product.memberPrice;
  const discountPercent = getDiscountPercentage(product.mrp, isMember ? product.memberPrice : product.normalPrice);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setSelectedProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-3 right-3 z-20 p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 bg-[#F7F7F7] p-6 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-neutral-200">
          <div className="w-full aspect-square max-w-[280px] rounded-xl overflow-hidden bg-white shadow-sm border border-neutral-200 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-4 flex items-center gap-3 text-[11px] text-neutral-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#D71920]" /> 100% Genuine
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-[#D71920]" /> Fast Delivery
            </span>
          </div>
        </div>

        {/* Right: Product Details & Two-Tier Pricing */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Brand & Stock */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D71920]">
                {product.brand}
              </span>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> In Stock ({product.stock} units)
              </span>
            </div>

            {/* Product Title */}
            <h2 className="text-lg sm:text-xl font-bold text-[#111111] leading-snug mb-1">
              {product.name}
            </h2>

            <p className="text-xs text-neutral-500 mb-4 font-medium">
              Net Quantity / Weight: <strong className="text-[#111111]">{product.unit}</strong>
            </p>

            {/* Two-Price Engine Box */}
            <div className="bg-[#F7F7F7] border border-neutral-200 rounded-xl p-3.5 mb-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-600">
                <span>Maximum Retail Price (MRP):</span>
                <span className="line-through text-neutral-400 font-semibold">{formatINR(product.mrp)}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
                <span>Normal Customer Price:</span>
                <span className="text-sm font-bold">{formatINR(product.normalPrice)}</span>
              </div>

              {/* Special Member Price Box */}
              <div className="p-2.5 bg-[#FFF1F1] border border-[#FCA5A5] rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#D71920] font-black text-xs">
                    <Sparkles className="w-4 h-4 fill-[#D71920]" />
                    <span>MEMBER PRICE:</span>
                  </div>
                  <span className="text-xl font-black text-[#D71920]">
                    {formatINR(product.memberPrice)}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-600">Extra savings for members:</span>
                  <span className="font-bold text-[#D71920] bg-white px-2 py-0.5 rounded border border-red-200">
                    Save {formatINR(memberSaving)}
                  </span>
                </div>
              </div>

              {!isMember && (
                <p className="text-[11px] text-neutral-500 text-center pt-1">
                  Login or{' '}
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      openAuthModal('membership');
                    }}
                    className="text-[#D71920] font-bold underline"
                  >
                    Join Membership
                  </button>{' '}
                  to unlock {formatINR(product.memberPrice)} price.
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Product Description
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {product.description || 'Premium quality daily grocery item delivered directly from Bachat Bazar Bhiwadi.'}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-3 pt-3 border-t border-neutral-200">
            {/* Quantity Selector & Add to Cart */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-2 hover:bg-neutral-100 text-neutral-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 font-bold text-sm text-[#111111]">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="p-2 hover:bg-neutral-100 text-neutral-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-2.5 px-4 bg-[#111111] hover:bg-[#D71920] text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>ADD TO CART ({formatINR((isMember ? product.memberPrice : product.normalPrice) * qty)})</span>
              </button>
            </div>

            {/* Buy Now & WhatsApp Row */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleBuyNow}
                className="flex-1 py-2 px-3 bg-[#D71920] hover:bg-[#B5141A] text-white text-xs font-bold rounded-lg transition"
              >
                BUY NOW DIRECTLY
              </button>

              <a
                href={getProductWhatsAppUrl(product, isMember, settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Ask on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
