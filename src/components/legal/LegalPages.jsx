import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Shield,
  FileText,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RotateCcw,
  Truck,
  Cookie,
  UserX,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Sparkles,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

export default function LegalPages({ activePolicy = 'privacy' }) {
  const { settings, setCurrentView, showToast } = useStore();
  const [selectedTab, setSelectedTab] = useState(activePolicy);

  useEffect(() => {
    if (activePolicy) {
      setSelectedTab(activePolicy);
    }
  }, [activePolicy]);

  // Data Deletion Form State
  const [delName, setDelName] = useState('');
  const [delPhone, setDelPhone] = useState('');
  const [delEmail, setDelEmail] = useState('');
  const [delType, setDelType] = useState('Full Account & Data Deletion');
  const [delReason, setDelReason] = useState('');
  const [delSubmitted, setDelSubmitted] = useState(false);
  const [submittingDel, setSubmittingDel] = useState(false);

  const policyList = [
    { id: 'privacy', title: 'Privacy Policy', icon: <Lock className="w-4 h-4" /> },
    { id: 'terms', title: 'Terms & Conditions', icon: <FileText className="w-4 h-4" /> },
    { id: 'whatsapp-messaging', title: 'WhatsApp Messaging Policy', icon: <MessageCircle className="w-4 h-4 text-emerald-600" /> },
    { id: 'opt-in', title: 'WhatsApp Opt-In Policy', icon: <CheckCircle2 className="w-4 h-4 text-[#D71920]" /> },
    { id: 'opt-out', title: 'WhatsApp Opt-Out Policy', icon: <UserX className="w-4 h-4 text-neutral-600" /> },
    { id: 'whatsapp-terms', title: 'WhatsApp Messaging Terms', icon: <Shield className="w-4 h-4 text-emerald-700" /> },
    { id: 'refund', title: 'Refund & Cancellation Policy', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'shipping', title: 'Shipping & Delivery Policy', icon: <Truck className="w-4 h-4" /> },
    { id: 'cookies', title: 'Cookie Policy', icon: <Cookie className="w-4 h-4" /> },
    { id: 'data-deletion', title: 'Data Deletion Request', icon: <UserX className="w-4 h-4 text-red-600" /> },
    { id: 'grievance', title: 'Customer Support & Grievance', icon: <Phone className="w-4 h-4" /> },
    { id: 'contact', title: 'Contact & Business Info', icon: <MapPin className="w-4 h-4 text-[#D71920]" /> }
  ];

  const handleDataDeletionSubmit = async (e) => {
    e.preventDefault();
    if (!delName || !delPhone) {
      showToast('Please provide your name and phone number', 'error');
      return;
    }

    try {
      setSubmittingDel(true);
      const res = await fetch('/api/data-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: delName,
          phone: delPhone,
          email: delEmail,
          requestType: delType,
          reason: delReason
        })
      });

      const data = await res.json();
      if (data.success) {
        setDelSubmitted(true);
        showToast(data.message, 'success');
      } else {
        showToast(data.message || 'Error submitting request', 'error');
      }
    } catch (err) {
      showToast('Network error submitting request', 'error');
    } finally {
      setSubmittingDel(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-[#D71920] transition bg-white px-3 py-1.5 rounded-lg border border-neutral-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </button>

          <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-200/70 px-2.5 py-1 rounded-md">
            Legal & Meta WhatsApp Compliance Center
          </span>
        </div>

        {/* Hero Legal Banner */}
        <div className="bg-[#111111] text-white p-6 sm:p-8 rounded-2xl shadow-md border border-neutral-800">
          <div className="flex items-center gap-2 text-[#D71920] font-black text-xs uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4" />
            <span>Official Store Policies & Customer Rights</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Legal, Privacy & WhatsApp Business Policies
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Bachat Bazar is committed to transparent grocery commerce, user privacy, compliant WhatsApp communications, and prompt customer redressal.
          </p>

          {/* Meta Policy Disclaimer */}
          <div className="mt-4 p-3 bg-neutral-900/90 border border-neutral-700 rounded-xl text-[11px] text-neutral-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Meta / WhatsApp Compliance Notice:</strong> {settings.metaComplianceDisclaimer || "WhatsApp Business Platform access and approval are subject to Meta/WhatsApp eligibility requirements, review and applicable policies. WhatsApp policies and requirements may change from time to time."}
            </p>
          </div>
        </div>

        {/* 2-Column Policy Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Policy Navigation Menu */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-neutral-200 shadow-sm p-3 space-y-1">
            <div className="p-2 text-[11px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
              Select Legal Policy
            </div>

            {policyList.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedTab(p.id);
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className={`w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition ${
                  selectedTab === p.id
                    ? 'bg-[#FFF1F1] text-[#D71920] font-bold border border-[#FCA5A5]'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {p.icon}
                  <span>{p.title}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </div>

          {/* Right Column: Policy Document Reader */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8 space-y-6 text-xs text-neutral-700 leading-relaxed">
            
            {/* 1. PRIVACY POLICY */}
            {selectedTab === 'privacy' && (
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-3">
                  <h2 className="text-xl font-black text-[#111111]">Privacy Policy</h2>
                  <p className="text-[11px] text-neutral-400">Last updated: September 2026 • Compliant with Indian DPDP Act 2023 & Meta Platform Terms</p>
                </div>

                <p>
                  Welcome to <strong>Bachat Bazar</strong> ("we", "our", or "us"), located at <strong>ARAVALI VIHAR, CB-03, NEAR MANSA CHOWK, RTO OFFICE ROAD, BHIWADI, Alwar, Rajasthan, 301019</strong>. We respect your privacy and are committed to protecting the personal data you share with us.
                </p>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  1. Information We Collect
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Personal Identification:</strong> Full Name, Mobile Phone Number, Email Address.</li>
                  <li><strong>Delivery & Location Details:</strong> House/Flat No., Colony/Sector in Bhiwadi, Landmark, PIN Code (301019).</li>
                  <li><strong>Order & Transaction Records:</strong> Purchased grocery items, applied price type (Normal Price vs Member Price), total amount, payment mode (COD / UPI).</li>
                  <li><strong>Communication & WhatsApp Consent Records:</strong> Explicit opt-in timestamp, consent type (Transactional / Marketing), IP address, source of consent, and opt-out history.</li>
                </ul>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  2. Purpose & Use of Customer Information
                </h3>
                <p>We process your personal information strictly for legitimate commercial and fulfillment purposes, including:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Processing, packing, and dispatching grocery orders to your address in Bhiwadi.</li>
                  <li>Generating and issuing digital invoices and receipts.</li>
                  <li>Sending real-time delivery status updates and arrival notifications.</li>
                  <li>Administering the <strong>Bachat Bazar Membership System</strong> and verifying discounted Member Price eligibility.</li>
                  <li>Providing responsive customer support and addressing complaints.</li>
                  <li>Sending promotional discounts, seasonal offers, and coupon codes <em>only when you have provided explicit marketing consent</em>.</li>
                </ul>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  3. Dedicated WhatsApp Communication & Consent Notice
                </h3>
                <div className="bg-[#FFF1F1] border border-[#FCA5A5] rounded-xl p-4 space-y-2">
                  <p className="font-bold text-[#D71920]">
                    WhatsApp Business Messaging Protocol:
                  </p>
                  <p>
                    Bachat Bazar utilizes the official WhatsApp Business Platform to communicate with customers who have opted in. We strictly distinguish between:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Transactional Communications:</strong> Order confirmation, digital invoice link, out-for-delivery alert, and customer support conversations.</li>
                    <li><strong>Promotional Communications:</strong> Weekly member deals, festive bundles, and special discounts. Sent only with separate marketing opt-in.</li>
                  </ul>
                  <p className="text-[11px] text-neutral-600">
                    You may opt out of promotional messages at any time by visiting the <strong>Stop WhatsApp Messages</strong> page or messaging 'STOP' on our WhatsApp helpline.
                  </p>
                </div>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  4. Data Protection & No Unauthorized Selling
                </h3>
                <p>
                  We do not sell, rent, or lease customer phone numbers or personal records to third-party marketing brokers. Data is accessible solely to authorized store dispatch staff and technology infrastructure strictly necessary for order delivery.
                </p>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  5. Data Retention & Deletion Rights
                </h3>
                <p>
                  You have the right to request deletion of your account and communication records at any time. Submit your request through our <button onClick={() => setSelectedTab('data-deletion')} className="text-[#D71920] font-bold underline">Data Deletion Request Form</button>.
                </p>
              </div>
            )}

            {/* 2. TERMS & CONDITIONS */}
            {selectedTab === 'terms' && (
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-3">
                  <h2 className="text-xl font-black text-[#111111]">Terms & Conditions</h2>
                  <p className="text-[11px] text-neutral-400">Effective from September 2026</p>
                </div>

                <p>
                  These Terms and Conditions govern the purchase of grocery goods and use of services provided by <strong>Bachat Bazar</strong> in Bhiwadi, Rajasthan. By browsing this website, registering an account, or placing an order, you agree to these terms.
                </p>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  1. Two-Tier Pricing System
                </h3>
                <p>
                  Every product listed on Bachat Bazar features two transparent prices:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Normal Price:</strong> The standard retail price available to all customers.</li>
                  <li><strong>Member Price:</strong> A special discounted price available exclusively to registered Bachat Bazar VIP Members.</li>
                </ul>
                <p>
                  The server validates membership status at the time of checkout. Non-members will be charged the Normal Price. Tampering with client-side code will not alter the final invoice price.
                </p>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  2. Orders & Delivery in Bhiwadi
                </h3>
                <p>
                  We fulfill delivery orders within the municipality and residential sectors of Bhiwadi, Alwar district, Rajasthan (PIN 301019). Orders above <strong>₹{settings.freeDeliveryThreshold || 499}</strong> qualify for Free Home Delivery. Orders below this amount incur a nominal delivery charge of <strong>₹{settings.deliveryCharge || 30}</strong>.
                </p>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  3. Payment Terms
                </h3>
                <p>
                  We accept Cash on Delivery (COD) and Online UPI payments (Google Pay, PhonePe, Paytm, BHIM). For UPI payments, transactions are verified upon confirmation.
                </p>
              </div>
            )}

            {/* 3. WHATSAPP BUSINESS MESSAGING POLICY */}
            {selectedTab === 'whatsapp-messaging' && (
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-3">
                  <h2 className="text-xl font-black text-[#111111]">WhatsApp Business Messaging Policy</h2>
                  <p className="text-[11px] text-neutral-400">Strict Meta Policy Compliance Standard</p>
                </div>

                <p>
                  Bachat Bazar operates its official WhatsApp channel (<strong>+{settings.phone || '917073222340'}</strong>) in complete accordance with Meta's WhatsApp Business Messaging Policies and Commerce Policy.
                </p>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  1. Permitted Message Categories
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-[#F7F7F7] rounded-xl border border-neutral-200">
                    <p className="font-bold text-[#111111] mb-1">Utility & Transactional</p>
                    <p className="text-[11px] text-neutral-600">Order placement receipts, billing slips, delivery out for delivery updates, address confirmations.</p>
                  </div>

                  <div className="p-3 bg-[#F7F7F7] rounded-xl border border-neutral-200">
                    <p className="font-bold text-[#111111] mb-1">Marketing & Promotions</p>
                    <p className="text-[11px] text-neutral-600">Exclusive member discounts, weekly deals, festive grocery savings. Requires separate affirmative consent.</p>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  2. Pre-Approved Meta Templates Requirement
                </h3>
                <p>
                  In compliance with Meta guidelines, all business-initiated messages sent by Bachat Bazar utilize pre-approved WhatsApp message templates. Freeform promotional broadcasting without prior template review is strictly prohibited in our operational systems.
                </p>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  3. Message Frequency & Spam Prevention
                </h3>
                <p>
                  We maintain a strict quality threshold to avoid message fatigue. Marketing broadcasts are limited to maximum 1 to 2 relevant updates per week for opted-in customers.
                </p>
              </div>
            )}

            {/* 4. WHATSAPP OPT-IN POLICY */}
            {selectedTab === 'opt-in' && (
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-3">
                  <h2 className="text-xl font-black text-[#111111]">WhatsApp Opt-In Policy</h2>
                  <p className="text-[11px] text-neutral-400">Clear & Affirmative Consent Guidelines</p>
                </div>

                <p>
                  Meta requires that businesses obtain affirmative customer consent before initiating WhatsApp messages. Bachat Bazar enforces this through a robust opt-in mechanism.
                </p>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  1. Explicit, Un-Checked Consent Checkboxes
                </h3>
                <p>
                  Whenever you provide your mobile number (on Account Registration, Checkout, or Profile Update), you will see two separate, <strong>un-checked</strong> checkboxes:
                </p>
                <div className="p-3 bg-[#F7F7F7] border border-neutral-200 rounded-xl space-y-2 font-mono text-[11px]">
                  <p>☐ I agree to receive WhatsApp messages from Bachat Bazar regarding my orders, invoices, delivery updates, membership and customer support.</p>
                  <p>☐ I agree to receive promotional offers and marketing messages from Bachat Bazar on WhatsApp.</p>
                </div>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  2. Consent Audit Trail Logging
                </h3>
                <p>
                  Every opt-in action is stored with an immutable timestamp, customer phone number, consent source (e.g. "Checkout Form"), IP address, and status to satisfy audit obligations.
                </p>
              </div>
            )}

            {/* 5. WHATSAPP OPT-OUT POLICY */}
            {selectedTab === 'opt-out' && (
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-3">
                  <h2 className="text-xl font-black text-[#111111]">WhatsApp Opt-Out Policy</h2>
                  <p className="text-[11px] text-neutral-400">Easy & Immediate Unsubscribe</p>
                </div>

                <p>
                  Customers have the full right to stop receiving WhatsApp promotional messages at any time, with zero penalty and no impact on their membership status or purchasing ability.
                </p>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  How to Opt-Out:
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Online Opt-Out Tool:</strong> Use our dedicated <button onClick={() => setCurrentView('opt-out-page')} className="text-[#D71920] font-bold underline">Stop WhatsApp Messages</button> page to enter your mobile number.
                  </li>
                  <li>
                    <strong>Direct WhatsApp Keyword:</strong> Reply with the word <strong>STOP</strong> or <strong>UNSUBSCRIBE</strong> directly in our WhatsApp chat thread.
                  </li>
                  <li>
                    <strong>Customer Support:</strong> Call our store helpline at <strong>{settings.phone || '7073222340'}</strong> or email <strong>{settings.email}</strong>.
                  </li>
                </ul>

                <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-300">
                  <p className="font-bold text-[#111111]">Automated Campaign Exclusion:</p>
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    Upon opt-out, our database immediately updates your record to <code className="bg-white px-1 py-0.5 rounded border">OPTED_OUT</code> and our campaign safety simulator automatically excludes your number from all future marketing broadcasts.
                  </p>
                </div>
              </div>
            )}

            {/* 6. WHATSAPP MESSAGING TERMS */}
            {selectedTab === 'whatsapp-terms' && (
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-3">
                  <h2 className="text-xl font-black text-[#111111]">WhatsApp Messaging Terms</h2>
                  <p className="text-[11px] text-neutral-400">Service Level Agreement & Communication Terms</p>
                </div>

                <p>
                  These terms govern interactions between customers and Bachat Bazar on the WhatsApp platform.
                </p>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  1. Operating Hours & Response Time
                </h3>
                <p>
                  Our WhatsApp support operates during standard store hours: <strong>{settings.openingHours || '07:30 AM - 10:00 PM'}</strong> (Mon - Sun). Customer queries received via WhatsApp are typically answered within 15 to 30 minutes during store hours.
                </p>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  2. Acceptable Use
                </h3>
                <p>
                  Customers agree not to transmit abusive, harassing, or fraudulent messages through our communication channels.
                </p>
              </div>
            )}

            {/* 7. REFUND & CANCELLATION */}
            {selectedTab === 'refund' && (
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-3">
                  <h2 className="text-xl font-black text-[#111111]">Refund & Cancellation Policy</h2>
                  <p className="text-[11px] text-neutral-400">Fresh Grocery Guarantee</p>
                </div>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920]">
                  1. Order Cancellation
                </h3>
                <p>
                  You can cancel your order free of charge before it leaves our store for delivery. Once an order is "Out for Delivery", cancellation may be subject to delivery executive logistics.
                </p>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  2. Doorstep Inspection & Instant Replacement
                </h3>
                <p>
                  We encourage customers to verify grocery items at the time of delivery. If any item is damaged, defective, or expired, our delivery personnel will replace it or deduct the amount on the spot.
                </p>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  3. Refund Timeline
                </h3>
                <p>
                  For online prepaid orders, refunds are credited back to the original UPI / bank account within <strong>2 to 4 business days</strong>.
                </p>
              </div>
            )}

            {/* 8. SHIPPING & DELIVERY */}
            {selectedTab === 'shipping' && (
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-3">
                  <h2 className="text-xl font-black text-[#111111]">Shipping & Delivery Policy</h2>
                  <p className="text-[11px] text-neutral-400">Local Delivery within Bhiwadi, Rajasthan</p>
                </div>

                <p>
                  All orders placed on Bachat Bazar are packed fresh and dispatched directly from our local supermarket located at Aravali Vihar, Bhiwadi.
                </p>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  Delivery Coverage:
                </h3>
                <p>
                  Aravali Vihar, Mansa Chowk, UIT Sector 1, 2, 3, 4, 7, 8, 9, Thada Road, Ashiana Town, Ashiana Angan, Ashiana Rangoli, Capital Mall road, and all residential apartments in Bhiwadi (PIN 301019).
                </p>

                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider text-[#D71920] pt-2">
                  Delivery Charges:
                </h3>
                <p>
                  • <strong>FREE Delivery:</strong> On all orders of ₹{settings.freeDeliveryThreshold || 499} and above.<br />
                  • <strong>₹{settings.deliveryCharge || 30} Delivery Fee:</strong> For small orders below ₹{settings.freeDeliveryThreshold || 499}.
                </p>
              </div>
            )}

            {/* 9. COOKIE POLICY */}
            {selectedTab === 'cookies' && (
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-3">
                  <h2 className="text-xl font-black text-[#111111]">Cookie & Storage Policy</h2>
                  <p className="text-[11px] text-neutral-400">Essential Storage for Cart & Session</p>
                </div>

                <p>
                  Bachat Bazar uses minimal browser local storage and essential cookies solely to ensure your shopping cart items, selected delivery address, and active membership status persist across visits. We do not deploy intrusive third-party cross-site tracking cookies.
                </p>
              </div>
            )}

            {/* 10. DATA DELETION REQUEST FORM */}
            {selectedTab === 'data-deletion' && (
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-3">
                  <h2 className="text-xl font-black text-[#111111]">Data Deletion Request</h2>
                  <p className="text-[11px] text-neutral-400">Customer Right to Erasure under DPDP Act</p>
                </div>

                <p>
                  You have the right to request erasure of your personal data, communication history, and account profile from Bachat Bazar's databases. Submit the formal request below:
                </p>

                {delSubmitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h3 className="font-bold text-base text-emerald-900">Request Submitted Successfully</h3>
                    <p className="text-xs text-emerald-700 max-w-md mx-auto">
                      Our Data Grievance Officer has logged your request. Your records will be reviewed and purged within 7 business days. A confirmation will be sent to your phone number.
                    </p>
                    <button
                      onClick={() => setDelSubmitted(false)}
                      className="mt-2 text-xs font-bold text-emerald-800 underline"
                    >
                      Submit another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleDataDeletionSubmit} className="bg-[#F7F7F7] border border-neutral-200 rounded-2xl p-5 space-y-3.5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111]">
                      Request Data Erasure Form
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={delName}
                          onChange={(e) => setDelName(e.target.value)}
                          placeholder="e.g. Ramesh Sharma"
                          className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Registered Mobile Number *</label>
                        <input
                          type="tel"
                          required
                          value={delPhone}
                          onChange={(e) => setDelPhone(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={delEmail}
                        onChange={(e) => setDelEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Request Type</label>
                      <select
                        value={delType}
                        onChange={(e) => setDelType(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                      >
                        <option value="Full Account & Data Deletion">Full Account & Data Deletion</option>
                        <option value="WhatsApp Communication Data Deletion">WhatsApp Communication & Marketing Data Deletion</option>
                        <option value="Order History & Delivery Records Erasure">Order History & Delivery Records Erasure</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Reason for Request (Optional)</label>
                      <textarea
                        rows="2"
                        value={delReason}
                        onChange={(e) => setDelReason(e.target.value)}
                        placeholder="Please tell us why you are requesting data deletion..."
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingDel}
                      className="w-full py-2.5 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold text-xs rounded-xl transition shadow-sm"
                    >
                      {submittingDel ? 'Submitting...' : 'SUBMIT DATA DELETION REQUEST'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 11. CUSTOMER SUPPORT & GRIEVANCE */}
            {selectedTab === 'grievance' && (
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-3">
                  <h2 className="text-xl font-black text-[#111111]">Customer Support & Grievance Redressal</h2>
                  <p className="text-[11px] text-neutral-400">Statutory Grievance Redressal Mechanism</p>
                </div>

                <p>
                  In accordance with the Consumer Protection (E-Commerce) Rules, 2020 and Information Technology Act, the details of our designated Grievance Officer are published below:
                </p>

                <div className="bg-[#F7F7F7] border border-neutral-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[#D71920] font-black text-xs uppercase tracking-wider">
                    <Shield className="w-4 h-4" />
                    <span>Appointed Grievance Officer</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-neutral-500 block text-[10px]">Officer Name & Title:</span>
                      <strong className="text-sm text-[#111111] block">
                        {settings.grievanceOfficer?.name || "Rajesh Devi / Grievance Redressal Officer"}
                      </strong>
                      <span className="text-neutral-600">{settings.grievanceOfficer?.designation || "Customer Support Manager"}</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 block text-[10px]">Helpline Phone:</span>
                      <strong className="text-sm text-[#D71920] block">
                        {settings.grievanceOfficer?.phone || settings.phone || "7073222340"}
                      </strong>
                      <span className="text-neutral-500 text-[10px]">Hours: 7:30 AM – 10:00 PM (All 7 Days)</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 block text-[10px]">Official Email:</span>
                      <a href={`mailto:${settings.grievanceOfficer?.email || settings.email}`} className="font-bold text-[#111111] hover:underline">
                        {settings.grievanceOfficer?.email || settings.email || "bachatbazar.rajeshdevi@gmail.com"}
                      </a>
                    </div>

                    <div>
                      <span className="text-neutral-500 block text-[10px]">Postal Address:</span>
                      <p className="text-neutral-700 leading-snug">
                        {settings.grievanceOfficer?.address || settings.address}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-200 text-[11px] text-neutral-600">
                    ⏱️ <strong>Response SLA:</strong> All formal grievances are acknowledged within 24 hours and redressed within 48 to 72 business hours.
                  </div>
                </div>
              </div>
            )}

            {/* 12. CONTACT US */}
            {selectedTab === 'contact' && (
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-3">
                  <h2 className="text-xl font-black text-[#111111]">Contact & Business Information</h2>
                  <p className="text-[11px] text-neutral-400">Bachat Bazar Retail Supermarket</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F7F7F7] rounded-xl border border-neutral-200 space-y-2">
                    <div className="flex items-center gap-2 text-[#D71920] font-bold">
                      <MapPin className="w-4 h-4" />
                      <span>Physical Store Address</span>
                    </div>
                    <p className="text-neutral-700 leading-relaxed">
                      {settings.address || "ARAVALI VIHAR, CB-03, NEAR MANSA CHOWK, RTO OFFICE ROAD, BHIWADI, Alwar, Rajasthan, 301019"}
                    </p>
                  </div>

                  <div className="p-4 bg-[#F7F7F7] rounded-xl border border-neutral-200 space-y-2">
                    <div className="flex items-center gap-2 text-[#D71920] font-bold">
                      <Phone className="w-4 h-4" />
                      <span>Phone & WhatsApp</span>
                    </div>
                    <p className="text-neutral-700">
                      Telephone: <strong>{settings.phone || '7073222340'}</strong><br />
                      WhatsApp: <strong>+{settings.whatsappNumber || '917073222340'}</strong>
                    </p>
                  </div>

                  <div className="p-4 bg-[#F7F7F7] rounded-xl border border-neutral-200 space-y-2">
                    <div className="flex items-center gap-2 text-[#D71920] font-bold">
                      <Mail className="w-4 h-4" />
                      <span>Email Support</span>
                    </div>
                    <p className="text-neutral-700">
                      {settings.email || 'bachatbazar.rajeshdevi@gmail.com'}
                    </p>
                  </div>

                  <div className="p-4 bg-[#F7F7F7] rounded-xl border border-neutral-200 space-y-2">
                    <div className="flex items-center gap-2 text-[#D71920] font-bold">
                      <Clock className="w-4 h-4" />
                      <span>Operating Hours</span>
                    </div>
                    <p className="text-neutral-700">
                      {settings.openingHours || '07:30 AM - 10:00 PM (Monday through Sunday)'}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
