import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { Home, Grid, Tag, ShoppingCart, User } from 'lucide-react';

export default function MobileNav() {
  const { user, openAuthModal, openAccountModal } = useAuth();
  const { totalItemCount, setIsCartOpen } = useCart();
  const { currentView, setCurrentView, setActiveCategory } = useStore();

  const handleNav = (view, cat = 'all') => {
    setCurrentView(view);
    setActiveCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E5E5] px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">

        {/* Home */}
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition ${
            currentView === 'home' ? 'text-[#D71920]' : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Home</span>
        </button>

        {/* Categories */}
        <button
          onClick={() => handleNav('catalog', 'all')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition ${
            currentView === 'catalog' ? 'text-[#D71920]' : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Categories</span>
        </button>

        {/* Offers */}
        <button
          onClick={() => handleNav('deals')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition ${
            currentView === 'deals' ? 'text-[#D71920]' : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Tag className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Offers</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center py-1 px-2 rounded-lg text-neutral-500 hover:text-[#D71920] relative transition"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-[#D71920]" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#D71920] text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center">
                {totalItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Cart</span>
        </button>

        {/* Account */}
        <button
          onClick={() => {
            if (user) {
              openAccountModal('profile');
            } else {
              openAuthModal('login');
            }
          }}
          className="flex flex-col items-center py-1 px-2 rounded-lg text-neutral-500 hover:text-black transition"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">{user ? 'Account' : 'Login'}</span>
        </button>

      </div>
    </div>
  );
}
