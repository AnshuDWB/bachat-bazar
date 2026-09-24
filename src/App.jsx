import React, { useEffect } from 'react';
import { useStore } from './context/StoreContext';
import { useAuth } from './context/AuthContext';
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

// Admin Views
import AdminPortal from './components/admin/AdminPortal';
import AdminLoginView from './components/admin/AdminLoginView';

// Legal & WhatsApp Policy Views
import LegalPages from './components/legal/LegalPages';

export default function App() {
  const { currentView, setCurrentView } = useStore();
  const { isAdmin } = useAuth();

  // Listen to URL routing (e.g. /admin or #admin)
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path.startsWith('/admin') || hash.startsWith('#admin')) {
        setCurrentView('admin');
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, [setCurrentView]);

  const getLegalPolicyId = (view) => {
    if (view === 'opt-out-page') return 'opt-out';
    if (view.startsWith('legal-')) return view.replace('legal-', '');
    return 'privacy';
  };

  // If currently in Admin view (URL /admin or www.bachatbazar.space/admin)
  if (currentView === 'admin' || window.location.pathname.startsWith('/admin')) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-between">
        {isAdmin ? <AdminPortal /> : <AdminLoginView />}
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-between">

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
