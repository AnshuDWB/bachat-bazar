import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useStore } from './StoreContext';

const CartContext = createContext();
const CART_STORAGE_KEY = 'bachat_bazar_cart';

export function CartProvider({ children }) {
  const { isMember } = useAuth();
  const { settings, showToast } = useStore();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, { id: product.id, product, quantity }];
      }
    });

    const price = isMember ? product.memberPrice : product.normalPrice;
    showToast(`Added ${product.name} (₹${price}) to cart`, 'success');
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemQuantity = (productId) => {
    const item = cartItems.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  // Pricing & Dual Price calculations
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Normal Total (Price for non-members)
  const normalSubtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product.normalPrice * item.quantity);
  }, 0);

  // Member Total (Price for members)
  const memberSubtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product.memberPrice * item.quantity);
  }, 0);

  // Total at MRP
  const mrpTotal = cartItems.reduce((sum, item) => {
    return sum + (item.product.mrp * item.quantity);
  }, 0);

  // Active Subtotal based on customer status
  const subtotal = isMember ? memberSubtotal : normalSubtotal;

  // Potential savings if a guest becomes a member
  const potentialMemberSavings = Math.max(0, normalSubtotal - memberSubtotal);

  // Applied member savings if customer is currently a member
  const appliedMemberSavings = isMember ? potentialMemberSavings : 0;

  // Overall savings from MRP
  const totalSavingsFromMRP = Math.max(0, mrpTotal - subtotal);

  // Delivery charge calculations
  const freeThreshold = settings.freeDeliveryThreshold || 499;
  const isFreeDelivery = subtotal >= freeThreshold;
  const deliveryCharge = totalItemCount === 0 ? 0 : (isFreeDelivery ? 0 : (settings.deliveryCharge || 30));
  const amountNeededForFreeDelivery = Math.max(0, freeThreshold - subtotal);

  const grandTotal = subtotal + deliveryCharge;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemCount,
        subtotal,
        normalSubtotal,
        memberSubtotal,
        mrpTotal,
        potentialMemberSavings,
        appliedMemberSavings,
        totalSavingsFromMRP,
        deliveryCharge,
        isFreeDelivery,
        amountNeededForFreeDelivery,
        freeThreshold,
        grandTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        lastPlacedOrder,
        setLastPlacedOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
