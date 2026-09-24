import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY = 'bachat_bazar_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register' | 'membership'
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountActiveTab, setAccountActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const sendOtp = async ({ phone, role = 'customer' }) => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, role })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Server connection failed' };
    }
  };

  const verifyOtp = async ({ phone, otp, role = 'customer', name, email, joinMembership }) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, role, name, email, joinMembership })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthModalOpen(false);
        return { success: true, user: data.user, message: data.message };
      } else {
        return { success: false, message: data.message || 'OTP verification failed' };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Server connection failed' };
    }
  };

  const login = async (identifier) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setIsAuthModalOpen(false);
        return { success: true, user: data.user, message: data.message };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Server connection failed' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setIsAuthModalOpen(false);
        return { success: true, user: data.user, message: data.message };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Server connection failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAccountModalOpen(false);
  };

  const toggleMembership = async (activate = true) => {
    if (!user) {
      setAuthModalMode('membership');
      setIsAuthModalOpen(true);
      return { success: false, message: 'Please login or register to join membership' };
    }

    try {
      const res = await fetch('/api/auth/membership/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, activate })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        return { success: true, user: data.user, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Network error updating membership' };
    }
  };

  const applyMembership = async ({ planId, paymentMethod = 'CASH', notes = '', customerName = '', phone = '', email = '', address = '' }) => {
    try {
      const payload = {
        userId: user ? user.id : undefined,
        customerName: customerName || user?.name,
        phone: phone || user?.phone,
        email: email || user?.email,
        address: address || user?.addresses?.[0]?.house,
        planId,
        paymentMethod,
        notes
      };

      const res = await fetch('/api/membership/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        if (data.user) {
          setUser(data.user);
        } else if (user) {
          setUser({
            ...user,
            membershipStatus: 'PENDING_APPROVAL',
            pendingApplication: {
              planName: data.request?.planName,
              planPrice: data.request?.planPrice,
              paymentMethod: data.request?.paymentMethod,
              requestedAt: data.request?.requestedAt
            }
          });
        }
        return { success: true, message: data.message, request: data.request };
      } else {
        return { success: false, message: data.message || 'Application submission failed' };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Server connection failed' };
    }
  };

  const updateProfile = async (updateData) => {
    if (!user) return { success: false, message: 'Not logged in' };
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...updateData })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        return { success: true, user: data.user, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Network error updating profile' };
    }
  };

  // Quick switch for demo testing
  const switchDemoAccount = async (type) => {
    if (type === 'admin') {
      await login('7073222340');
    } else if (type === 'member') {
      await login('9876543210');
    } else if (type === 'regular') {
      await login('9123456780');
    } else if (type === 'guest') {
      logout();
    }
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const openAccountModal = (tab = 'profile') => {
    setAccountActiveTab(tab);
    setIsAccountModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isMember: Boolean(user?.isMember),
        isAdmin: user?.role === 'admin',
        login,
        register,
        sendOtp,
        verifyOtp,
        logout,
        toggleMembership,
        applyMembership,
        updateProfile,
        switchDemoAccount,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        isAccountModalOpen,
        setIsAccountModalOpen,
        accountActiveTab,
        setAccountActiveTab,
        openAccountModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
