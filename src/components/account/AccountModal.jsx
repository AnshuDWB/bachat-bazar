import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { formatINR, formatDate } from '../../utils/formatters';
import MembershipCard from './MembershipCard';
import {
  X,
  User,
  MapPin,
  Sparkles,
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  Shield,
  LogOut,
  MessageCircle,
  AlertCircle
} from 'lucide-react';

export default function AccountModal() {
  const {
    user,
    isMember,
    isAccountModalOpen,
    setIsAccountModalOpen,
    accountActiveTab,
    setAccountActiveTab,
    updateProfile,
    logout
  } = useAuth();

  const { showToast, setCurrentView } = useStore();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');

  // New Address Form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newHouse, setNewHouse] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newLandmark, setNewLandmark] = useState('');

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileEmail(user.email || '');
    }
  }, [user]);

  // Fetch past orders for this customer
  useEffect(() => {
    if (user && isAccountModalOpen && accountActiveTab === 'orders') {
      const fetchOrders = async () => {
        try {
          setLoadingOrders(true);
          const res = await fetch(`/api/orders?userId=${user.id}`);
          const data = await res.json();
          if (data.success && data.orders) {
            setOrders(data.orders);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [user, isAccountModalOpen, accountActiveTab]);

  if (!isAccountModalOpen || !user) return null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const res = await updateProfile({
      name: profileName,
      phone: profilePhone,
      email: profileEmail
    });
    if (res.success) {
      showToast('Profile updated successfully', 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newHouse.trim() || !newArea.trim()) {
      showToast('Please provide house/flat and area details', 'error');
      return;
    }

    const currentAddresses = user.addresses || [];
    const newAddr = {
      id: `addr-${Date.now()}`,
      name: user.name,
      phone: user.phone,
      house: newHouse,
      area: newArea,
      landmark: newLandmark,
      city: 'Bhiwadi',
      district: 'Alwar',
      state: 'Rajasthan',
      pincode: '301019',
      isDefault: currentAddresses.length === 0
    };

    const res = await updateProfile({ addresses: [...currentAddresses, newAddr] });
    if (res.success) {
      setShowAddressForm(false);
      setNewHouse('');
      setNewArea('');
      setNewLandmark('');
      showToast('New delivery address saved', 'success');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const updated = (user.addresses || []).filter(a => a.id !== addressId);
    const res = await updateProfile({ addresses: updated });
    if (res.success) {
      showToast('Address removed', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[95vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 bg-[#111111] text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D71920] rounded-xl flex items-center justify-center font-bold text-white text-lg">
              {(user.name || user.phone || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{user.name || user.phone || 'Customer'}</h2>
                {isMember && (
                  <span className="bg-[#FFF1F1] text-[#D71920] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    ★ Member ({user.memberId})
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400">{user.phone} • {user.email || 'No email'}</p>
            </div>
          </div>

          <button
            onClick={() => setIsAccountModalOpen(false)}
            className="p-1 text-neutral-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 text-xs font-bold text-neutral-600 bg-neutral-50 overflow-x-auto">
          <button
            onClick={() => setAccountActiveTab('profile')}
            className={`flex-1 py-3 px-2 text-center border-b-2 transition flex items-center justify-center gap-1.5 shrink-0 ${
              accountActiveTab === 'profile' ? 'border-[#D71920] text-[#D71920] bg-white' : 'border-transparent hover:text-black'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Address</span>
          </button>

          <button
            onClick={() => setAccountActiveTab('membership')}
            className={`flex-1 py-3 px-2 text-center border-b-2 transition flex items-center justify-center gap-1.5 shrink-0 ${
              accountActiveTab === 'membership' ? 'border-[#D71920] text-[#D71920] bg-white' : 'border-transparent hover:text-black'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>Membership</span>
          </button>

          <button
            onClick={() => setAccountActiveTab('orders')}
            className={`flex-1 py-3 px-2 text-center border-b-2 transition flex items-center justify-center gap-1.5 shrink-0 ${
              accountActiveTab === 'orders' ? 'border-[#D71920] text-[#D71920] bg-white' : 'border-transparent hover:text-black'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>My Orders</span>
          </button>

          <button
            onClick={() => setAccountActiveTab('whatsapp')}
            className={`flex-1 py-3 px-2 text-center border-b-2 transition flex items-center justify-center gap-1.5 shrink-0 ${
              accountActiveTab === 'whatsapp' ? 'border-[#D71920] text-[#D71920] bg-white' : 'border-transparent hover:text-black'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Preferences</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: Profile & Addresses */}
          {accountActiveTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Profile Details Form */}
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#D71920]" />
                  Basic Profile Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#111111] hover:bg-[#D71920] text-white text-xs font-bold rounded-lg transition"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>

              {/* Saved Delivery Addresses in Bhiwadi */}
              <div className="pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D71920]" />
                    Saved Delivery Addresses (Bhiwadi)
                  </h4>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="text-xs font-bold text-[#D71920] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add New Address
                  </button>
                </div>

                {/* Add Address Form */}
                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="bg-[#F7F7F7] p-4 rounded-xl border border-neutral-200 mb-4 space-y-3">
                    <h5 className="font-bold text-xs text-[#111111]">Add New Delivery Address</h5>
                    <div className="space-y-2">
                      <input
                        type="text"
                        required
                        value={newHouse}
                        onChange={(e) => setNewHouse(e.target.value)}
                        placeholder="House / Flat No., Building / Society Name *"
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                      />
                      <input
                        type="text"
                        required
                        value={newArea}
                        onChange={(e) => setNewArea(e.target.value)}
                        placeholder="Area, Sector or Road in Bhiwadi *"
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                      />
                      <input
                        type="text"
                        value={newLandmark}
                        onChange={(e) => setNewLandmark(e.target.value)}
                        placeholder="Nearby Landmark (Optional)"
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-[#D71920] text-white text-xs font-bold rounded-lg hover:bg-[#B5141A]"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-3 py-1.5 bg-neutral-200 text-neutral-700 text-xs rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Address Cards List */}
                <div className="space-y-2.5">
                  {(user.addresses || []).map((addr) => (
                    <div
                      key={addr.id}
                      className="p-3.5 bg-white border border-neutral-200 rounded-xl flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[#111111]">{addr.house}</p>
                          <p className="text-neutral-600">{addr.area} {addr.landmark ? `(Near ${addr.landmark})` : ''}</p>
                          <p className="text-neutral-500 text-[11px]">{addr.city}, {addr.state} - {addr.pincode}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-neutral-400 hover:text-red-600 transition p-1"
                        title="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logout Button */}
              <div className="pt-4 border-t border-neutral-200 flex justify-end">
                <button
                  onClick={logout}
                  className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-lg transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout from Account</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: Membership Card */}
          {accountActiveTab === 'membership' && (
            <MembershipCard />
          )}

          {/* TAB 3: My Orders */}
          {accountActiveTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111]">
                  My Past Orders ({orders.length})
                </h4>
              </div>

              {loadingOrders ? (
                <div className="py-8 text-center text-xs text-neutral-500">
                  Loading order history...
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center bg-[#F7F7F7] rounded-xl border border-neutral-200">
                  <ShoppingBag className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                  <p className="font-bold text-sm text-[#111111]">No orders placed yet</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Your orders will appear here once placed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-[#F7F7F7] border border-neutral-200 rounded-xl p-4 space-y-3 text-xs"
                    >
                      {/* Order Title & Status */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-200">
                        <div>
                          <span className="font-mono font-bold text-[#111111]">#{ord.id}</span>
                          <span className="text-neutral-500 text-[11px] block">{formatDate(ord.date)}</span>
                        </div>

                        <div className="text-right">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            <Clock className="w-3 h-3" />
                            {ord.status}
                          </span>
                          <span className="block font-black text-sm text-[#D71920] mt-0.5">{formatINR(ord.total)}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1 text-neutral-700">
                        {ord.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px]">
                            <span>• {item.name} ({item.unit}) × {item.quantity}</span>
                            <span className="font-semibold">{formatINR(item.appliedPrice * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Savings */}
                      {ord.memberSavings > 0 && (
                        <div className="p-2 bg-[#FFF1F1] rounded-lg border border-[#FCA5A5] text-[11px] text-[#D71920] font-bold flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 fill-[#D71920]" />
                            Member Savings on this order:
                          </span>
                          <span>{formatINR(ord.memberSavings)}</span>
                        </div>
                      )}

                      {/* Address */}
                      <div className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-200">
                        Delivered to: {ord.shippingAddress?.house}, {ord.shippingAddress?.area}, {ord.shippingAddress?.city} ({ord.shippingAddress?.pincode})
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 4: WhatsApp Preferences & Consent */}
          {accountActiveTab === 'whatsapp' && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-neutral-200 pb-3">
                <h4 className="font-bold text-sm text-[#111111] flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Communication</span>
                </h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Manage your WhatsApp communication preferences from Bachat Bazar (+{user.phone}).
                </p>
              </div>

              <div className="space-y-3">
                {/* Toggle 1: Order Updates */}
                <div className="bg-[#FAFAFA] border border-neutral-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#111111] block">Order Updates & Customer Support</span>
                      <span className="text-[11px] text-neutral-500">
                        Order confirmations, delivery updates, and customer support.
                      </span>
                    </div>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <div className="w-10 h-6 bg-emerald-600 rounded-full transition relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                    </div>
                  </div>
                </div>

                {/* Toggle 2: Offers & Promotions */}
                <div className="bg-[#FAFAFA] border border-neutral-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#D71920] shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#111111] block">Offers & Promotions</span>
                      <span className="text-[11px] text-neutral-500">
                        Discounts, new products, member offers, and exclusive deals.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentView('opt-out-page');
                      setIsAccountModalOpen(false);
                    }}
                    className="px-3 py-1.5 bg-neutral-200 hover:bg-[#D71920] hover:text-white rounded-xl text-[11px] font-bold transition text-neutral-700 shrink-0"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-neutral-100 rounded-2xl text-neutral-600 text-[11px] space-y-1">
                <p>
                  You can also type <strong>STOP</strong> on WhatsApp to unsubscribe from promotional messages at any time.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
