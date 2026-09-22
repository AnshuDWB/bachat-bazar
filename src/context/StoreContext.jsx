import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [settings, setSettings] = useState({
    storeName: "BACHAT BAZAR",
    tagline: "Har Din Ki Bachat",
    address: "ARAVALI VIHAR, CB-03, NEAR MANSA CHOWK, RTO OFFICE ROAD, BHIWADI, Alwar, Rajasthan, 301019",
    phone: "7073222340",
    whatsappNumber: "917073222340",
    email: "bachatbazar.rajeshdevi@gmail.com",
    openingHours: "07:30 AM - 10:00 PM (Mon - Sun)",
    freeDeliveryThreshold: 499,
    deliveryCharge: 30,
    announcement: "📢 Free Home Delivery in Bhiwadi on orders above ₹499! Members save up to 30% extra."
  });

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'catalog' | 'deals' | 'membership' | 'store-info' | 'admin'
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHeroSlides = useCallback(async () => {
    try {
      const res = await fetch('/api/hero-slides');
      const data = await res.json();
      if (data.success && data.slides) {
        setHeroSlides(data.slides);
      }
    } catch (err) {
      console.error('Failed to load hero slides:', err);
    }
  }, []);

  const fetchMembershipPlans = useCallback(async () => {
    try {
      const res = await fetch('/api/membership/plans');
      const data = await res.json();
      if (data.success && data.plans) {
        setMembershipPlans(data.plans);
      }
    } catch (err) {
      console.error('Failed to load membership plans:', err);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchCategories();
    fetchProducts();
    fetchHeroSlides();
    fetchMembershipPlans();
  }, [fetchSettings, fetchCategories, fetchProducts, fetchHeroSlides, fetchMembershipPlans]);

  const updateMembershipPlan = async (planId, planData) => {
    try {
      const res = await fetch(`/api/admin/membership/plans/${planId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });
      const data = await res.json();
      if (data.success) {
        fetchMembershipPlans();
        showToast('Membership plan pricing updated', 'success');
        return true;
      }
      showToast(data.message || 'Error updating plan', 'error');
      return false;
    } catch (err) {
      showToast('Network error updating plan', 'error');
      return false;
    }
  };

  // Product Admin Operations
  const addProduct = async (productData) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
        showToast('Product added successfully', 'success');
        return true;
      }
      showToast(data.message || 'Error adding product', 'error');
      return false;
    } catch (err) {
      showToast('Network error adding product', 'error');
      return false;
    }
  };

  const updateProduct = async (id, updateData) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
        showToast('Product updated successfully', 'success');
        return true;
      }
      showToast(data.message || 'Error updating product', 'error');
      return false;
    } catch (err) {
      showToast('Network error updating product', 'error');
      return false;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
        showToast('Product deleted', 'success');
        return true;
      }
      showToast(data.message || 'Error deleting product', 'error');
      return false;
    } catch (err) {
      showToast('Network error deleting product', 'error');
      return false;
    }
  };

  // Hero Slide Admin Operations
  const addHeroSlide = async (slideData) => {
    try {
      const res = await fetch('/api/admin/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideData)
      });
      const data = await res.json();
      if (data.success) {
        fetchHeroSlides();
        showToast('Hero slide created successfully', 'success');
        return true;
      }
      showToast(data.message || 'Error creating hero slide', 'error');
      return false;
    } catch (err) {
      showToast('Network error creating slide', 'error');
      return false;
    }
  };

  const updateHeroSlide = async (id, updateData) => {
    try {
      const res = await fetch(`/api/admin/hero-slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      const data = await res.json();
      if (data.success) {
        fetchHeroSlides();
        showToast('Hero slide updated successfully', 'success');
        return true;
      }
      showToast(data.message || 'Error updating hero slide', 'error');
      return false;
    } catch (err) {
      showToast('Network error updating slide', 'error');
      return false;
    }
  };

  const deleteHeroSlide = async (id) => {
    try {
      const res = await fetch(`/api/admin/hero-slides/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchHeroSlides();
        showToast('Hero slide deleted', 'success');
        return true;
      }
      showToast(data.message || 'Error deleting slide', 'error');
      return false;
    } catch (err) {
      showToast('Network error deleting slide', 'error');
      return false;
    }
  };

  const updateStoreSettings = async (newSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        showToast('Store settings saved', 'success');
        return true;
      }
      return false;
    } catch (err) {
      showToast('Error saving settings', 'error');
      return false;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        categories,
        products,
        heroSlides,
        membershipPlans,
        loading,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        currentView,
        setCurrentView,
        toast,
        showToast,
        addProduct,
        updateProduct,
        deleteProduct,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        fetchHeroSlides,
        updateMembershipPlan,
        fetchMembershipPlans,
        updateStoreSettings,
        fetchProducts,
        fetchSettings
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
