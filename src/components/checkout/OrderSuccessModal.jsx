import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR, formatDate } from '../../utils/formatters';
import { getOrderWhatsAppUrl } from '../../utils/whatsapp';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Sparkles,
  Printer,
  MessageCircle,
  ShoppingBag,
  MapPin,
  Clock,
  ArrowRight,
  X,
  Home
} from 'lucide-react';

export default function OrderSuccessModal() {
  const { lastPlacedOrder, setLastPlacedOrder } = useCart();
  const { settings, setCurrentView } = useStore();
  const { openAccountModal } = useAuth();

  useEffect(() => {
    if (lastPlacedOrder) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [lastPlacedOrder]);

  if (!lastPlacedOrder) return null;

  const order = lastPlacedOrder;

  const handleClose = () => {
    setLastPlacedOrder(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleContinueShopping = () => {
    setLastPlacedOrder(null);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewOrders = () => {
    setLastPlacedOrder(null);
    openAccountModal('orders');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={handleClose} />

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[95vh] flex flex-col print:max-w-none print:shadow-none print:rounded-none z-10 border border-neutral-200">
        
        {/* Printable / Viewable Header with Close Button */}
        <div className="p-6 bg-[#111111] text-white text-center border-b border-neutral-800 relative">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition cursor-pointer print:hidden"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 text-white shadow-lg">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Order Placed Successfully!
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Thank you for shopping with Bachat Bazar. Your order has been registered and WhatsApp has been launched.
          </p>

          <div className="mt-3 inline-block bg-neutral-900 border border-neutral-700 px-3 py-1 rounded-lg text-xs font-mono font-bold text-[#D71920]">
            Order #{order.id}
          </div>
        </div>

        {/* Order Details Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Order Info & Bhiwadi Store Address Header */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pb-4 border-b border-neutral-200">
            <div>
              <p className="font-bold text-sm text-[#111111]">BACHAT BAZAR (Bhiwadi Store)</p>
              <p className="text-neutral-500 text-[11px]">{settings.address}</p>
              <p className="text-neutral-500 text-[11px]">Phone: {settings.phone} • GST Registered Retailer</p>
            </div>
            <div className="sm:text-right">
              <p className="text-neutral-500">Order Placed: <strong>{formatDate(order.date)}</strong></p>
              <p className="text-neutral-500">Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})</p>
              <p className="text-emerald-700 font-bold">Status: {order.status}</p>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-[#F7F7F7] border border-neutral-200 rounded-xl p-3.5 flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#111111] mb-0.5">Delivery Address:</strong>
              <p className="text-neutral-700">
                {order.shippingAddress?.name} ({order.shippingAddress?.phone})<br />
                {order.shippingAddress?.house}, {order.shippingAddress?.area}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111] mb-2">
              Ordered Items
            </h4>
            <div className="border border-neutral-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#F7F7F7] text-neutral-600 text-[11px] border-b border-neutral-200">
                  <tr>
                    <th className="p-2.5">Item</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Price Applied</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {order.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50">
                      <td className="p-2.5 font-medium text-[#111111]">
                        {item.name} <span className="text-neutral-400 text-[10px]">({item.unit})</span>
                        {item.isMemberPrice && (
                          <span className="block text-[10px] text-[#D71920] font-bold">★ Member Price Applied</span>
                        )}
                      </td>
                      <td className="p-2.5 text-center font-bold">{item.quantity}</td>
                      <td className="p-2.5 text-right">{formatINR(item.appliedPrice)}</td>
                      <td className="p-2.5 text-right font-bold">{formatINR(item.appliedPrice * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="bg-[#F7F7F7] border border-neutral-200 rounded-xl p-4 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-neutral-600">
              <span>Items Subtotal:</span>
              <span className="font-semibold">{formatINR(order.subtotal)}</span>
            </div>

            {order.memberSavings > 0 && (
              <div className="flex items-center justify-between text-[#D71920] font-bold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Total Member Savings:
                </span>
                <span>- {formatINR(order.memberSavings)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-neutral-600">
              <span>Delivery Charge (Bhiwadi):</span>
              <span>{order.deliveryCharge === 0 ? <strong className="text-emerald-700">FREE</strong> : formatINR(order.deliveryCharge)}</span>
            </div>

            <div className="pt-2 border-t border-neutral-300 flex items-center justify-between text-base font-black text-[#111111]">
              <span>Grand Total:</span>
              <span className="text-[#D71920]">{formatINR(order.total)}</span>
            </div>
          </div>

        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="p-4 bg-white border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          
          <div className="flex items-center gap-2">
            {/* Print Slip */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>

            {/* WhatsApp Direct Notification */}
            <a
              href={getOrderWhatsAppUrl(order, settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send on WhatsApp</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-neutral-300 hover:border-black text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>

            <button
              onClick={handleContinueShopping}
              className="px-4 py-2 bg-[#D71920] hover:bg-[#B5141A] text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
