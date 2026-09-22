# Bachat Bazar — Har Din Ki Bachat 🛒

A modern, fast, responsive e-commerce platform for **Bachat Bazar**, a retail and daily-needs grocery supermarket based in Bhiwadi, Rajasthan.

---

## 🎨 Brand & Visual Identity
- **Brand Name:** BACHAT BAZAR
- **Tagline:** Har Din Ki Bachat
- **Color Palette:**
  - **Primary Red:** `#D71920`
  - **Black:** `#111111`
  - **White:** `#FFFFFF`
  - **Light Neutral:** `#F7F7F7`
- **Typography:** Poppins & Inter (Bold, Clean, Indian Retail Store Feel)

---

## 🚀 Key Features

### 1. Two-Tier Pricing System
Every product transparently displays:
1. **Normal Price**: Standard retail price for all customers.
2. **Member Price**: Highly discounted rate exclusively for Bachat Bazar VIP Members.
3. **Calculated Savings**: Clear indicators of discounts and savings from MRP.

### 2. 4-Tier VIP Membership System
- **1 Year VIP Plan** (Default ₹999 / 12 Months)
- **2 Years VIP Plan** (Default ₹1,799 / 24 Months)
- **3 Years VIP Plan** (Default ₹2,499 / 36 Months)
- **Lifetime VIP Club (Maha Bachat)** (Base ₹5,999 / Unlimited Lifetime Access)
- **Dynamic Pricing**: Admin can change membership prices dynamically anytime from the Admin Panel.
- **Payment Modes**: Cash Payment (In-Store / Doorstep) and UPI Online Payment.

### 3. Fast & Seamless Checkout Flow
- Delivery address selection with Bhiwadi localities & society landmarks.
- **Delivery Slots**: ⚡ Express (Within 2 Hours), Morning, Afternoon, Evening.
- **Payment Methods**:
  - **Cash on Delivery (COD)** / Store Counter Cash.
  - **Instant Online UPI QR Code** (Google Pay, PhonePe, Paytm, BHIM with `7073222340@upi`).
- **Post-Order Experience**:
  - Celebration confetti animation 🎉.
  - Printable invoice/receipt.
  - 1-Click WhatsApp order receipt sharing.
  - Direct order tracking in user account.

### 4. Meta & WhatsApp Business Compliance
Dedicated legal and compliance pages accessible via footer:
- Privacy Policy
- Terms of Service
- Return & Refund Policy
- Shipping & Delivery Policy
- WhatsApp Business Policy
- Contact Us
- Stop WhatsApp (Opt-out page)
- Immutable consent audit logs with timestamps and IP records.

### 5. Comprehensive Admin Portal (`/admin`)
- **Overview Dashboard**: Analytics on total sales, orders, active VIP members, and savings delivered.
- **Products Manager**: Full CRUD for products with two-tier pricing, category tags, stock, and images.
- **Hero Slider Manager**: Upload and configure banner photos, promotional badges, and featured products without code changes.
- **VIP Memberships & Approval Queue**:
  - Review customer applications with Cash / UPI status.
  - 1-Click **Approve & Activate** or **Reject** with reason.
  - Dynamic pricing editor for all 4 duration tiers.
- **Customer Directory & 1-Click History**: View complete customer profiles, lifetime spending, VIP savings, and chronological purchase histories.
- **WhatsApp Compliance & Template Manager**: Monitor opt-in consent status, manage utility/marketing message templates, and run campaign safety simulations.

---

## 🛠️ Technology Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Canvas-Confetti, QRCode
- **Backend:** Node.js, Express.js, CORS
- **Database:** Local JSON File Persistence (`server/data/db.json`) with sample data

---

## 📦 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Development
Runs both the Express backend (`http://localhost:5000`) and the Vite storefront (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

---

## 📍 Store Location
- **Address:** CB-03, Near Mansa Chowk, Bhiwadi, Rajasthan - 301019
- **Phone:** +91 70732 22340
- **Email:** support@bachatbazar.com
