import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, UserX, MessageCircle, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function WhatsAppOptOutModal({ isOpen, onClose }) {
  const { showToast } = useStore();
  const [phone, setPhone] = useState('');
  const [optOutType, setOptOutType] = useState('MARKETING_ONLY'); // 'MARKETING_ONLY' | 'ALL'
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      showToast('Please enter your 10-digit mobile number', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/whatsapp/opt-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          optOutType,
          reason
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setResponseMessage(data.message);
        showToast('Opt-out request processed', 'success');
      } else {
        showToast(data.message || 'Failed to process opt-out', 'error');
      }
    } catch (err) {
      showToast('Network error processing request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setPhone('');
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 bg-[#111111] text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#D71920] rounded-lg flex items-center justify-center font-bold text-white">
              <UserX className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Stop WhatsApp Messages</h2>
              <p className="text-[10px] text-neutral-400">Bachat Bazar WhatsApp Opt-Out Portal</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center space-y-3 py-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#111111]">Opt-Out Successful</h3>
              <p className="text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto">
                {responseMessage}
              </p>
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-5 py-2 bg-[#111111] text-white font-bold text-xs rounded-xl hover:bg-[#D71920] transition"
                >
                  Close & Return to Store
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <p className="text-neutral-600">
                Enter your mobile number below to immediately stop promotional or marketing messages on WhatsApp.
              </p>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Registered Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1.5">
                  Choose Opt-Out Preference:
                </label>
                <div className="space-y-2">
                  <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition ${
                    optOutType === 'MARKETING_ONLY' ? 'border-[#D71920] bg-[#FFF1F1]' : 'border-neutral-200'
                  }`}>
                    <input
                      type="radio"
                      name="optOutType"
                      value="MARKETING_ONLY"
                      checked={optOutType === 'MARKETING_ONLY'}
                      onChange={(e) => setOptOutType(e.target.value)}
                      className="accent-[#D71920] mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-[#111111] block">Stop Promotional Messages Only (Recommended)</span>
                      <span className="text-[11px] text-neutral-500">
                        You will still receive important order confirmations, delivery updates and invoice receipts.
                      </span>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition ${
                    optOutType === 'ALL' ? 'border-[#D71920] bg-[#FFF1F1]' : 'border-neutral-200'
                  }`}>
                    <input
                      type="radio"
                      name="optOutType"
                      value="ALL"
                      checked={optOutType === 'ALL'}
                      onChange={(e) => setOptOutType(e.target.value)}
                      className="accent-[#D71920]"
                    />
                    <div>
                      <span className="font-bold text-[#111111] block">Stop All WhatsApp Messages</span>
                      <span className="text-[11px] text-neutral-500">
                        Unsubscribe from both promotional offers and automated delivery status alerts.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Reason for Unsubscribing (Optional)
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#D71920]"
                >
                  <option value="">Select a reason...</option>
                  <option value="Too many messages">Too many messages received</option>
                  <option value="No longer in Bhiwadi">Moved outside Bhiwadi area</option>
                  <option value="Prefer SMS or Email">Prefer SMS or Email updates</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <UserX className="w-4 h-4" />
                  <span>{loading ? 'Processing Opt-Out...' : 'CONFIRM OPT-OUT'}</span>
                </button>
              </div>

              <div className="pt-2 border-t border-neutral-200 text-[10px] text-neutral-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D71920]" />
                <span>Immediate database update • You can re-subscribe anytime</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
