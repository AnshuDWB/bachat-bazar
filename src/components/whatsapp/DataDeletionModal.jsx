import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, UserX, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function DataDeletionModal({ isOpen, onClose }) {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState('Full Account & Data Deletion');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast('Please provide your name and phone number', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/data-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          requestType,
          reason
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        showToast('Data deletion request submitted', 'success');
      } else {
        showToast(data.message || 'Error submitting request', 'error');
      }
    } catch (err) {
      showToast('Network error submitting request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    setEmail('');
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
              <h2 className="text-sm font-bold text-white">Request Data Deletion</h2>
              <p className="text-[10px] text-neutral-400">Statutory Data Erasure Form</p>
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
              <h3 className="text-base font-bold text-[#111111]">Request Submitted Successfully</h3>
              <p className="text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto">
                Our Data Grievance Officer will review your request and complete the data erasure within 7 business days in accordance with DPDP regulations.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-5 py-2 bg-[#111111] text-white font-bold text-xs rounded-xl hover:bg-[#D71920] transition"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Registered Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit phone number"
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Request Type</label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                >
                  <option value="Full Account & Data Deletion">Full Account & Data Deletion</option>
                  <option value="WhatsApp Communication Data Deletion">WhatsApp Communication & Marketing Data Deletion</option>
                  <option value="Order History & Delivery Records Erasure">Order History & Delivery Records Erasure</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Reason for Deletion (Optional)</label>
                <textarea
                  rows="2"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly describe your request..."
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold text-xs rounded-xl transition shadow-sm"
                >
                  {loading ? 'Submitting Request...' : 'SUBMIT DATA DELETION REQUEST'}
                </button>
              </div>

              <div className="pt-2 border-t border-neutral-200 text-[10px] text-neutral-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D71920]" />
                <span>Reviewed by Grievance Officer • 7-day fulfillment SLA</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
