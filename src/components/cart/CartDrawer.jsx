import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/formatters';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck
} from 'lucide-react';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    normalSubtotal,
    memberSubtotal,
    potentialMemberSavings,
    appliedMemberSavings,
    deliveryCharge,
    isFreeDelivery,
    amountNeededForFreeDelivery,
    freeThreshold,
    grandTotal,
    setIsCheckoutOpen
  } = useCart();

  const { isMember, openAuthModal } = useAuth();
  const { setCurrentView } = useStore();

  if (!isCartOpen) return null;

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-[#111111] text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D71920]" />
              <h2 className="text-base font-bold">Shopping Cart ({cartItems.length} items)</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-neutral-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            
            {/* Free Delivery Bar */}
            {cartItems.length > 0 && (
              <div className="bg-[#F7F7F7] border border-neutral-200 rounded-xl p-3 text-xs">
                {isFreeDelivery ? (
                  <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <Truck className="w-4 h-4" />
                    <span>🎉 You've unlocked FREE Home Delivery in Bhiwadi!</span>
                  </p>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-neutral-700 font-medium mb-1.5">
                      <span>Add <strong>{formatINR(amountNeededForFreeDelivery)}</strong> more for Free Delivery</span>
                      <span className="text-[11px] text-neutral-500 font-bold">{Math.round((subtotal / freeThreshold) * 100)}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#D71920] h-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (subtotal / freeThreshold) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Membership Savings Callout Banner */}
            {cartItems.length > 0 && (
              isMember ? (
                <div className="bg-[#FFF1F1] border border-[#FCA5A5] rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#D71920] font-bold">
                    <Sparkles className="w-4 h-4 fill-[#D71920]" />
                    <span>Member Discount Applied!</span>
                  </div>
                  <span className="font-black text-[#D71920] bg-white px-2 py-0.5 rounded border border-red-200">
                    You saved {formatINR(appliedMemberSavings)}
                  </span>
                </div>
              ) : potentialMemberSavings > 0 ? (
                <div className="bg-[#111111] text-white rounded-xl p-3.5 flex items-center justify-between gap-3 border border-neutral-800">
                  <div>
                    <p className="text-xs font-bold text-white flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                      Save {formatINR(potentialMemberSavings)} extra on this order!
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      Unlock Bachat Member prices instantly.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      openAuthModal('membership');
                    }}
                    className="px-2.5 py-1.5 bg-[#D71920] hover:bg-[#B5141A] text-white text-[11px] font-bold rounded-lg transition shrink-0"
                  >
                    Join Club
                  </button>
                </div>
              ) : null
            )}

            {/* Items List */}
            {cartItems.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="font-bold text-sm text-[#111111] mb-1">Your cart is empty</h3>
                <p className="text-xs text-neutral-500 mb-4">
                  Browse our daily essentials and save on every purchase.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('catalog');
                  }}
                  className="px-4 py-2 bg-[#D71920] text-white font-bold text-xs rounded-lg transition hover:bg-[#B5141A]"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {cartItems.map(({ product, quantity }) => {
                  const appliedPrice = isMember ? product.memberPrice : product.normalPrice;
                  const itemSaving = (product.normalPrice - product.memberPrice) * quantity;

                  return (
                    <div key={product.id} className="py-3 flex items-center justify-between gap-3">
                      {/* Product Thumbnail */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-lg border border-neutral-200 shrink-0 bg-[#F7F7F7]"
                      />

                      {/* Info & Price */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-[#111111] line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-neutral-500">{product.unit}</p>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-xs text-[#111111]">
                            {formatINR(appliedPrice)}
                          </span>
                          {isMember ? (
                            <span className="text-[10px] text-[#D71920] font-semibold bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
                              ★ Member Price
                            </span>
                          ) : (
                            <span className="text-[10px] text-neutral-400 line-through">
                              {formatINR(product.mrp)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white shrink-0">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1.5 hover:bg-neutral-100 text-neutral-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 font-bold text-xs text-[#111111]">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1.5 hover:bg-neutral-100 text-neutral-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-1 text-neutral-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Footer / Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-[#F7F7F7] space-y-3">
              
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal ({isMember ? 'Member Prices Applied' : 'Normal Prices'}):</span>
                  <span className="font-bold text-[#111111]">{formatINR(subtotal)}</span>
                </div>

                {appliedMemberSavings > 0 && (
                  <div className="flex items-center justify-between text-[#D71920] font-bold">
                    <span>Member Savings:</span>
                    <span>- {formatINR(appliedMemberSavings)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span>Delivery Charge (Bhiwadi):</span>
                  <span>{deliveryCharge === 0 ? <strong className="text-emerald-700">FREE</strong> : formatINR(deliveryCharge)}</span>
                </div>

                <div className="pt-2 border-t border-neutral-300 flex items-center justify-between text-sm font-black text-[#111111]">
                  <span>Total Amount Payable:</span>
                  <span className="text-base text-[#D71920]">{formatINR(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedCheckout}
                className="w-full py-3 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold text-xs rounded-xl transition shadow-red-glow flex items-center justify-center gap-2"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
