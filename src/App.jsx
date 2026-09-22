import React from 'react';
import { useStore } from './context/StoreContext';
import { useAuth } from './context/AuthContext';
import DemoAccountSwitcher from './components/common/DemoAccountSwitcher';
import Toast from './components/common/Toast';
import TopBanner from './components/layout/TopBanner';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';

// Home Views
import HeroSection from './components/home/HeroSection';
import MembershipPromo from './components/home/MembershipPromo';
import CategoryGrid from './components/home/CategoryGrid';
import DealsSection from './components/home/DealsSection';
import StoreInfoSection from './components/home/StoreInfoSection';

// Catalog & Products
import ProductGrid from './components/products/ProductGrid';
import ProductModal from './components/products/ProductModal';

// Cart & Checkout & Account Modals
import CartDrawer from './components/cart/CartDrawer';
import CheckoutModal from './components/checkout/CheckoutModal';
import OrderSuccessModal from './components/checkout/OrderSuccessModal';
import AuthModal from './components/account/AuthModal';
import AccountModal from './components/account/AccountModal';

// Admin View
import AdminPortal from './components/admin/AdminPortal';

// Legal & WhatsApp Policy Views
import LegalPages from './components/legal/LegalPages';

export default function App() {
  const { currentView } = useStore();
  const { isAdmin } = useAuth();

  const getLegalPolicyId = (view) => {
    if (view === 'opt-out-page') return 'opt-out';
    if (view.startsWith('legal-')) return view.replace('legal-', '');
    return 'privacy';
  };

  // If currently in Admin view, render Admin Portal
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-between">
        <DemoAccountSwitcher />
        <AdminPortal />
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-between">
      
      {/* Top Demo Testing Bar */}
      <DemoAccountSwitcher />

      {/* Announcements & Location Header */}
      <TopBanner />

      {/* Main Header with Logo, Live Search, Account & Cart */}
      <Header />

      {/* Main Content Area Based on Active Navigation */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection />
            <MembershipPromo />
            <CategoryGrid />
            <DealsSection />
            <ProductGrid
              title="Daily Grocery Staples"
              subtitle="Wholesale savings on Atta, Dal, Oil, Spices, Dairy & Personal Care in Bhiwadi."
            />
            <StoreInfoSection />
          </>
        )}

        {currentView === 'catalog' && (
          <ProductGrid
            title="All Grocery & Daily Needs"
            subtitle="Explore our complete inventory with transparent Normal and Member Prices."
          />
        )}

        {currentView === 'deals' && (
          <ProductGrid
            title="Today's Best Member Deals"
            subtitle="Special discounted prices with maximum savings for Bachat Bazar members."
            filterDeal={true}
          />
        )}

        {currentView === 'membership' && (
          <div className="py-8">
            <MembershipPromo />
            <StoreInfoSection />
          </div>
        )}

        {currentView === 'store-info' && (
          <div className="py-8">
            <StoreInfoSection />
          </div>
        )}

        {(currentView.startsWith('legal-') || currentView === 'opt-out-page') && (
          <LegalPages activePolicy={getLegalPolicyId(currentView)} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Sticky Bottom Navigation for Mobile */}
      <MobileNav />

      {/* Interactive Global Modals */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <AuthModal />
      <AccountModal />

      {/* Notifications Toast */}
      <Toast />

    </div>
  );
}
