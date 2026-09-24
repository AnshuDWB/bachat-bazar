import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/formatters';
import { getOrderWhatsAppUrl } from '../../utils/whatsapp';
import {
  X,
  MapPin,
  Phone,
  User,
  Clock,
  CreditCard,
  Banknote,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  ArrowRight,
  MessageCircle,
  Check,
  Building,
  Home,
  Zap
} from 'lucide-react';
import QRCode from 'qrcode';

export default function CheckoutModal() {
  const { user, isMember, openAuthModal } = useAuth();
  const {
    cartItems,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsCartOpen,
    subtotal,
    normalSubtotal,
    appliedMemberSavings,
    deliveryCharge,
    grandTotal,
    clearCart,
    setLastPlacedOrder
  } = useCart();
  const { settings, showToast, setCurrentView } = useStore();

  useEffect(() => {
    if (isCheckoutOpen && !user) {
      setIsCheckoutOpen(false);
      openAuthModal('login');
      showToast('Kripya checkout ke liye WhatsApp OTP se login karein', 'info');
    }
  }, [isCheckoutOpen, user, setIsCheckoutOpen, openAuthModal, showToast]);

  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    house: user?.addresses?.[0]?.house && user.addresses[0].house !== "House / Flat No." ? user.addresses[0].house : (user ? 'Flat 402, Ashiana Town' : ''),
    area: user?.addresses?.[0]?.area || 'Aravali Vihar / Mansa Chowk',
    landmark: user?.addresses?.[0]?.landmark || 'Near Mansa Chowk',
    city: 'Bhiwadi',
    state: 'Rajasthan',
    pincode: '301019',
    deliverySlot: 'Express Delivery (Within 2 Hours)',
    paymentMethod: 'COD', // 'COD' | 'UPI'
    deliveryNotes: '',
    transactionalConsent: true,
    marketingConsent: false
  });

  useEffect(() => {
    if (user) {
      const defaultAddr = user.addresses?.[0];
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
        house: defaultAddr?.house && defaultAddr.house !== "House / Flat No." ? defaultAddr.house : (prev.house || 'Flat 402, Ashiana Town'),
        area: defaultAddr?.area || prev.area || 'Aravali Vihar / Mansa Chowk',
        landmark: defaultAddr?.landmark || prev.landmark || 'Near Mansa Chowk',
        city: defaultAddr?.city || 'Bhiwadi',
        state: defaultAddr?.state || 'Rajasthan',
        pincode: defaultAddr?.pincode || '301019'
      }));
    }
  }, [user]);

  // Handle saved address selection
  const handleSelectSavedAddress = (addr, idx) => {
    setSelectedAddressIndex(idx);
    setFormData(prev => ({
      ...prev,
      house: addr.house || '',
      area: addr.area || '',
      landmark: addr.landmark || '',
      city: addr.city || 'Bhiwadi',
      state: addr.state || 'Rajasthan',
      pincode: addr.pincode || '301019'
    }));
  };

  // Generate UPI QR Code
  useEffect(() => {
    if (formData.paymentMethod === 'UPI') {
      const upiUrl = `upi://pay?pa=7073222340@upi&pn=Bachat%20Bazar&am=${grandTotal}&cu=INR&tn=Bachat%20Bazar%20Order`;
      QRCode.toDataURL(upiUrl, { width: 160, margin: 1 }, (err, url) => {
        if (!err) setQrCodeUrl(url);
      });
    }
  }, [formData.paymentMethod, grandTotal]);

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      showToast('Your cart is empty. Please add items before checking out.', 'error');
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim() || !formData.house.trim() || !formData.area.trim()) {
      showToast('Please fill all required customer name, phone, and delivery address fields', 'error');
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        userId: user?.id || null,
        items: cartItems.map(item => ({
          id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          mrp: item.product.mrp,
          normalPrice: item.product.normalPrice,
          memberPrice: item.product.memberPrice
        })),
        shippingAddress: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          house: formData.house.trim(),
          area: formData.area.trim(),
          landmark: formData.landmark.trim(),
          city: formData.city || 'Bhiwadi',
          state: formData.state || 'Rajasthan',
          pincode: formData.pincode || '301019'
        },
        deliverySlot: formData.deliverySlot || 'Express Delivery (Within 2 Hours)',
        paymentMethod: formData.paymentMethod || 'COD',
        deliveryNotes: formData.deliveryNotes.trim(),
        transactionalConsent: formData.transactionalConsent,
        marketingConsent: formData.marketingConsent
      };

      // 1. Post to Admin Panel backend database
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success && data?.order) {
        const placedOrder = data.order;

        // 2. Open WhatsApp directly in single click
        const whatsappUrl = getOrderWhatsAppUrl(placedOrder, settings?.whatsappNumber || '917073222340');
        try {
          window.open(whatsappUrl, '_blank');
        } catch (openErr) {
          console.warn('Could not auto open window:', openErr);
        }

        // 3. Clear cart and set placed order for confirmation modal
        clearCart();
        setIsCheckoutOpen(false);
        setLastPlacedOrder(placedOrder);
        showToast(`🎉 Order #${placedOrder.id} Placed & WhatsApp launched!`, 'success');
      } else {
        showToast(data?.message || 'Failed to place order. Please try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to order server', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[95vh] flex flex-col border border-neutral-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#111111] text-white flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#D71920] uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-[#D71920]" />
                1-Click Direct Order
              </span>
            </div>
            <h2 className="text-lg font-black text-white">Bachat Bazar Checkout (Bhiwadi)</h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Form */}
        {cartItems.length === 0 ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
              <Banknote className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-[#111111]">Your Cart is Currently Empty</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Please add fresh grocery items to your cart before proceeding to checkout.
            </p>
            <button
              onClick={() => {
                setIsCheckoutOpen(false);
                setCurrentView('catalog');
              }}
              className="px-5 py-2.5 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-2"
            >
              <span>Explore Grocery Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Active Pricing Notice */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
              isMember
                ? 'bg-[#FFF1F1] border-[#FCA5A5] text-[#D71920]'
                : 'bg-[#F7F7F7] border-neutral-200 text-neutral-700'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D71920] shrink-0" />
                <span>
                  Applied Pricing: <strong>{isMember ? '★ Active VIP Member Pricing' : 'Regular Customer Pricing'}</strong>
                </span>
              </div>
              {isMember && (
                <span className="font-bold bg-white px-2.5 py-0.5 rounded-full border border-red-200 shadow-xs">
                  Saved {formatINR(appliedMemberSavings)}
                </span>
              )}
            </div>

            {/* Section 1: Customer Details */}
            <div>
              <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#D71920]" />
                1. Customer Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Mobile Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Address Selection & Delivery Details */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D71920]" />
                  2. Delivery Address in Bhiwadi
                </h3>
              </div>

              {/* Saved Address Cards (if customer has registered addresses) */}
              {user?.addresses && user.addresses.length > 0 && (
                <div className="mb-3">
                  <p className="text-[11px] font-semibold text-neutral-500 mb-2">Select Saved Address or Edit Below:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {user.addresses.map((addr, idx) => (
                      <div
                        key={addr.id || idx}
                        onClick={() => handleSelectSavedAddress(addr, idx)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-start justify-between gap-2 ${
                          selectedAddressIndex === idx
                            ? 'border-[#D71920] bg-[#FFF1F1] text-[#111111]'
                            : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-600'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <Home className={`w-4 h-4 mt-0.5 shrink-0 ${selectedAddressIndex === idx ? 'text-[#D71920]' : 'text-neutral-400'}`} />
                          <div className="leading-tight">
                            <span className="font-bold block text-[11px] text-[#111111]">{addr.house}</span>
                            <span className="text-[10px] text-neutral-500">{addr.area}, {addr.city}</span>
                          </div>
                        </div>
                        {selectedAddressIndex === idx && (
                          <span className="w-4 h-4 bg-[#D71920] text-white rounded-full flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">House / Flat / Tower / Plot No. *</label>
                  <input
                    type="text"
                    required
                    value={formData.house}
                    onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                    placeholder="e.g. Flat 402, Tower B, Ashiana Town / House No. 24"
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Area / Society / Road *</label>
                  <input
                    type="text"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g. Aravali Vihar / Thada Road / Sector 3"
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    placeholder="e.g. Near Mansa Chowk / Community Center"
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">City</label>
                    <input
                      type="text"
                      disabled
                      value={formData.city}
                      className="w-full bg-neutral-200 border border-neutral-300 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">State</label>
                    <input
                      type="text"
                      disabled
                      value={formData.state}
                      className="w-full bg-neutral-200 border border-neutral-300 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">PIN Code</label>
                    <input
                      type="text"
                      disabled
                      value={formData.pincode}
                      className="w-full bg-neutral-200 border border-neutral-300 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Delivery Slot & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D71920]" />
                  3. Delivery Slot
                </h3>
                <select
                  value={formData.deliverySlot}
                  onChange={(e) => setFormData({ ...formData, deliverySlot: e.target.value })}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                >
                  <option value="Express Delivery (Within 2 Hours)">⚡ Express Delivery (Within 2 Hours)</option>
                  <option value="Morning Slot (8:00 AM - 12:00 PM)">🌅 Morning Slot (8:00 AM - 12:00 PM)</option>
                  <option value="Afternoon Slot (12:00 PM - 4:00 PM)">☀️ Afternoon Slot (12:00 PM - 4:00 PM)</option>
                  <option value="Evening Slot (5:00 PM - 9:00 PM)">🌙 Evening Slot (5:00 PM - 9:00 PM)</option>
                </select>
              </div>

              <div>
                <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">
                  Special Delivery Notes (Optional)
                </h3>
                <input
                  type="text"
                  value={formData.deliveryNotes}
                  onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                  placeholder="e.g. Ring bell twice / leave at guard desk"
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                />
              </div>
            </div>

            {/* Section 4: Payment Mode Selection */}
            <div>
              <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Banknote className="w-4 h-4 text-[#D71920]" />
                4. Select Payment Mode (Cash / UPI)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {/* Cash on Delivery Option */}
                <label className={`border-2 rounded-xl p-3.5 flex items-start gap-3 cursor-pointer transition ${
                  formData.paymentMethod === 'COD' ? 'border-[#D71920] bg-[#FFF1F1]' : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="accent-[#D71920] mt-1"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#111111] block flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] text-neutral-500 block mt-0.5">Pay cash or UPI at doorstep when order arrives</span>
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Popular Choice
                    </span>
                  </div>
                </label>

                {/* UPI QR Code Option */}
                <label className={`border-2 rounded-xl p-3.5 flex items-start gap-3 cursor-pointer transition ${
                  formData.paymentMethod === 'UPI' ? 'border-[#D71920] bg-[#FFF1F1]' : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={formData.paymentMethod === 'UPI'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="accent-[#D71920] mt-1"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#111111] block flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-[#D71920]" />
                      Online UPI / QR Code
                    </span>
                    <span className="text-[11px] text-neutral-500 block mt-0.5">Google Pay, PhonePe, Paytm, BHIM</span>
                    <span className="inline-block mt-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Instant Scan & Pay
                    </span>
                  </div>
                </label>
              </div>

              {/* UPI QR Code Preview */}
              {formData.paymentMethod === 'UPI' && qrCodeUrl && (
                <div className="bg-[#F7F7F7] border border-neutral-300 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left animate-fadeIn">
                  <div className="bg-white p-2 rounded-lg border border-neutral-300 shadow-sm shrink-0">
                    <img src={qrCodeUrl} alt="Bachat Bazar UPI QR Code" className="w-28 h-28 mx-auto" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#111111]">Scan & Pay via any UPI App</p>
                    <p className="text-[11px] text-neutral-600">Store UPI ID: <strong className="text-[#D71920]">7073222340@upi</strong></p>
                    <p className="text-[11px] text-neutral-600">Amount to Pay: <strong>{formatINR(grandTotal)}</strong></p>
                    <p className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block border border-emerald-200">
                      Instant verification on single-click order submission
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Bill Summary */}
            <div className="bg-[#F7F7F7] border border-neutral-200 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Items Total ({cartItems.length} items):</span>
                <span className="font-semibold">{formatINR(subtotal)}</span>
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

              <div className="pt-2 border-t border-neutral-300 flex items-center justify-between text-base font-black text-[#111111]">
                <span>Final Amount to Pay:</span>
                <span className="text-[#D71920]">{formatINR(grandTotal)}</span>
              </div>
            </div>

            {/* Section 5: WhatsApp Consent Preferences */}
            <div className="bg-[#F7F7F7] border border-neutral-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#111111] uppercase tracking-wider">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Notification & Updates</span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Transactional */}
                <label className="flex items-start gap-2.5 cursor-pointer text-neutral-700">
                  <input
                    type="checkbox"
                    checked={formData.transactionalConsent}
                    onChange={(e) => setFormData({ ...formData, transactionalConsent: e.target.checked })}
                    className="accent-[#D71920] mt-0.5 rounded"
                  />
                  <span className="leading-tight text-[11px]">
                    I agree to receive order receipts, invoice breakdown, and delivery updates from Bachat Bazar on WhatsApp.
                  </span>
                </label>

                {/* Marketing */}
                <label className="flex items-start gap-2.5 cursor-pointer text-neutral-700">
                  <input
                    type="checkbox"
                    checked={formData.marketingConsent}
                    onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
                    className="accent-[#D71920] mt-0.5 rounded"
                  />
                  <span className="leading-tight text-[11px]">
                    I agree to receive weekly offers & discounts from Bachat Bazar on WhatsApp.
                  </span>
                </label>
              </div>
            </div>

            {/* Single Click Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full py-4 bg-[#D71920] hover:bg-[#B5141A] disabled:bg-neutral-400 text-white font-black text-sm rounded-xl transition shadow-red-glow flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Processing & Syncing Order...</span>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 fill-white text-[#D71920]" />
                    <span>PLACE ORDER ON WHATSAPP & ADMIN ({formatINR(grandTotal)})</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-700 font-semibold text-center mt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Single Click Action: Registers order in Admin Panel & opens WhatsApp prefilled with order details!</span>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
