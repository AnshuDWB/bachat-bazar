import express from 'express';
import cors from 'cors';
import { initDB, getDB, saveDB } from './db.js';

initDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// 1. STORE SETTINGS & CATEGORIES
// ----------------------------------------------------
app.get('/api/settings', (req, res) => {
  const db = getDB();
  res.json({ success: true, settings: db.settings });
});

app.put('/api/settings', (req, res) => {
  const db = getDB();
  db.settings = { ...db.settings, ...req.body };
  saveDB();
  res.json({ success: true, settings: db.settings, message: "Settings updated successfully" });
});

app.get('/api/categories', (req, res) => {
  const db = getDB();
  res.json({ success: true, categories: db.categories });
});

// ----------------------------------------------------
// 2. PRODUCTS (With Dynamic Two-Tier Pricing)
// ----------------------------------------------------
app.get('/api/products', (req, res) => {
  const db = getDB();
  let list = [...db.products];
  const { category, search, featured, deal, sort } = req.query;

  if (category && category !== 'all') {
    list = list.filter(p => p.category === category);
  }

  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (featured === 'true') {
    list = list.filter(p => p.isFeatured);
  }

  if (deal === 'true') {
    list = list.filter(p => p.isDealOfDay);
  }

  if (sort === 'price-low') {
    list.sort((a, b) => a.normalPrice - b.normalPrice);
  } else if (sort === 'price-high') {
    list.sort((a, b) => b.normalPrice - a.normalPrice);
  } else if (sort === 'discount') {
    list.sort((a, b) => {
      const discA = ((a.mrp - a.memberPrice) / a.mrp) * 100;
      const discB = ((b.mrp - b.memberPrice) / b.mrp) * 100;
      return discB - discA;
    });
  }

  res.json({ success: true, products: list, total: list.length });
});

app.get('/api/products/:id', (req, res) => {
  const db = getDB();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
});

// Admin Add Product
app.post('/api/products', (req, res) => {
  const db = getDB();
  const { name, brand, category, unit, mrp, normalPrice, memberPrice, stock, image, description, isFeatured, isDealOfDay } = req.body;

  if (!name || !mrp || !normalPrice || !memberPrice) {
    return res.status(400).json({ success: false, message: 'Missing required product fields' });
  }

  const newProduct = {
    id: `prod-${Date.now()}`,
    name,
    brand: brand || 'Bachat Bazar',
    category: category || 'grocery',
    unit: unit || '1 unit',
    mrp: Number(mrp),
    normalPrice: Number(normalPrice),
    memberPrice: Number(memberPrice),
    stock: stock !== undefined ? Number(stock) : 50,
    image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    description: description || 'Fresh grocery item from Bachat Bazar.',
    isFeatured: Boolean(isFeatured),
    isDealOfDay: Boolean(isDealOfDay),
    rating: 4.8
  };

  db.products.unshift(newProduct);
  saveDB();
  res.status(201).json({ success: true, product: newProduct, message: 'Product added successfully' });
});

// Admin Update Product
app.put('/api/products/:id', (req, res) => {
  const db = getDB();
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  db.products[idx] = {
    ...db.products[idx],
    ...req.body,
    mrp: req.body.mrp !== undefined ? Number(req.body.mrp) : db.products[idx].mrp,
    normalPrice: req.body.normalPrice !== undefined ? Number(req.body.normalPrice) : db.products[idx].normalPrice,
    memberPrice: req.body.memberPrice !== undefined ? Number(req.body.memberPrice) : db.products[idx].memberPrice,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : db.products[idx].stock
  };

  saveDB();
  res.json({ success: true, product: db.products[idx], message: 'Product updated successfully' });
});

// Admin Delete Product
app.delete('/api/products/:id', (req, res) => {
  const db = getDB();
  const initialLength = db.products.length;
  db.products = db.products.filter(p => p.id !== req.params.id);
  if (db.products.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  saveDB();
  res.json({ success: true, message: 'Product deleted successfully' });
});

// ----------------------------------------------------
// 3. AUTH & MEMBERSHIP
// ----------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const db = getDB();
  const { identifier } = req.body; // phone or email
  if (!identifier) {
    return res.status(400).json({ success: false, message: 'Phone or Email is required' });
  }

  const cleanIdent = identifier.trim().toLowerCase();
  let user = db.users.find(u =>
    u.phone.replace(/\D/g, '') === cleanIdent.replace(/\D/g, '') ||
    u.email.toLowerCase() === cleanIdent
  );

  if (!user) {
    // If user doesn't exist, auto-create friendly demo customer
    user = {
      id: `user-${Date.now()}`,
      name: `Customer (${identifier})`,
      phone: identifier,
      email: `${identifier.replace(/\D/g, '') || 'user'}@bachatbazar.com`,
      role: 'customer',
      isMember: false,
      memberId: null,
      memberSince: null,
      addresses: [
        {
          id: `addr-${Date.now()}`,
          name: `Customer (${identifier})`,
          phone: identifier,
          house: "House / Flat No.",
          area: "Aravali Vihar / Sector",
          landmark: "Near Mansa Chowk",
          city: "Bhiwadi",
          district: "Alwar",
          state: "Rajasthan",
          pincode: "301019",
          isDefault: true
        }
      ]
    };
    db.users.push(user);
    saveDB();
  }

  res.json({ success: true, user, message: `Welcome back, ${user.name}!` });
});

app.post('/api/auth/register', (req, res) => {
  const db = getDB();
  const { name, phone, email, joinMembership, transactionalConsent, marketingConsent } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and Phone number are required' });
  }

  const existing = db.users.find(u => u.phone === phone);
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this phone number already exists. Please login.' });
  }

  const isMember = Boolean(joinMembership);
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    phone,
    email: email || `${phone}@bachatbazar.com`,
    role: 'customer',
    isMember,
    memberId: isMember ? `BB-MEM-${Math.floor(1000 + Math.random() * 9000)}` : null,
    memberSince: isMember ? new Date().toISOString() : null,
    addresses: [
      {
        id: `addr-${Date.now()}`,
        name,
        phone,
        house: "House / Flat No.",
        area: "Near Mansa Chowk, RTO Office Road",
        landmark: "",
        city: "Bhiwadi",
        district: "Alwar",
        state: "Rajasthan",
        pincode: "301019",
        isDefault: true
      }
    ]
  };

  db.users.push(newUser);

  // Record WhatsApp Consent if specified
  if (transactionalConsent || marketingConsent) {
    recordConsentInDB({
      userId: newUser.id,
      customerName: name,
      phone: phone,
      transactionalConsent: Boolean(transactionalConsent),
      marketingConsent: Boolean(marketingConsent),
      consentSource: "Registration Form",
      ipAddress: req.ip || "127.0.0.1"
    });
  }

  saveDB();
  res.status(201).json({ success: true, user: newUser, message: isMember ? 'Registered & Membership Activated!' : 'Registered successfully!' });
});

// Update Profile & Addresses
app.put('/api/auth/profile', (req, res) => {
  const db = getDB();
  const { userId, name, phone, email, addresses } = req.body;

  const idx = db.users.findIndex(u => u.id === userId);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  db.users[idx] = {
    ...db.users[idx],
    name: name || db.users[idx].name,
    phone: phone || db.users[idx].phone,
    email: email || db.users[idx].email,
    addresses: addresses || db.users[idx].addresses
  };

  saveDB();
  res.json({ success: true, user: db.users[idx], message: 'Profile updated successfully' });
});

// Toggle / Activate Membership
app.post('/api/auth/membership/toggle', (req, res) => {
  const db = getDB();
  const { userId, activate } = req.body;

  const idx = db.users.findIndex(u => u.id === userId);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const shouldActivate = activate !== undefined ? Boolean(activate) : !db.users[idx].isMember;
  db.users[idx].isMember = shouldActivate;
  if (shouldActivate) {
    db.users[idx].memberId = db.users[idx].memberId || `BB-MEM-${Math.floor(1000 + Math.random() * 9000)}`;
    db.users[idx].memberSince = db.users[idx].memberSince || new Date().toISOString();
  }

  saveDB();
  res.json({
    success: true,
    user: db.users[idx],
    message: shouldActivate ? '🎉 Congratulations! Bachat Bazar Membership Activated.' : 'Membership deactivated.'
  });
});

// Admin Customers API
app.get('/api/customers', (req, res) => {
  const db = getDB();
  const customers = db.users.map(u => {
    const userOrders = (db.orders || []).filter(o => o.customer?.id === u.id || o.customer?.phone === u.phone);
    const totalSpend = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalSavings = userOrders.reduce((sum, o) => sum + (o.memberSavings || 0), 0);
    const userConsent = db.whatsappConsents?.find(c => c.phone === u.phone || c.userId === u.id);
    return {
      ...u,
      orderCount: userOrders.length,
      totalSpend,
      totalSavings,
      orders: userOrders,
      whatsappStatus: userConsent ? userConsent.status : 'NO_CONSENT',
      marketingConsent: Boolean(userConsent?.marketingConsent),
      transactionalConsent: Boolean(userConsent?.transactionalConsent),
      whatsappConsent: userConsent || null
    };
  });
  res.json({ success: true, customers });
});

// Admin Customer Profile & Full History API
app.get('/api/customers/:id', (req, res) => {
  const db = getDB();
  const u = (db.users || []).find(user => user.id === req.params.id || user.phone === req.params.id);
  if (!u) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }

  const userOrders = (db.orders || []).filter(o => o.customer?.id === u.id || o.customer?.phone === u.phone);
  const totalSpend = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalSavings = userOrders.reduce((sum, o) => sum + (o.memberSavings || 0), 0);
  const userConsent = (db.whatsappConsents || []).find(c => c.phone === u.phone || c.userId === u.id);
  const deletionRequests = (db.dataDeletionRequests || []).filter(d => d.phone === u.phone || d.email === u.email);

  res.json({
    success: true,
    customer: {
      ...u,
      orderCount: userOrders.length,
      totalSpend,
      totalSavings,
      orders: userOrders,
      whatsappStatus: userConsent ? userConsent.status : 'NO_CONSENT',
      marketingConsent: Boolean(userConsent?.marketingConsent),
      transactionalConsent: Boolean(userConsent?.transactionalConsent),
      whatsappConsent: userConsent || null,
      deletionRequests
    }
  });
});

// Helper for Consent Recording
function recordConsentInDB({ userId, customerName, phone, transactionalConsent, marketingConsent, consentSource, ipAddress }) {
  const db = getDB();
  db.whatsappConsents = db.whatsappConsents || [];
  
  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  let consent = db.whatsappConsents.find(c => (cleanPhone && c.phone.replace(/\D/g, '') === cleanPhone) || (userId && c.userId === userId));

  let status = "NO_CONSENT";
  if (transactionalConsent && marketingConsent) {
    status = "ACTIVE";
  } else if (transactionalConsent && !marketingConsent) {
    status = "TRANSACTIONAL_ONLY";
  } else if (!transactionalConsent && !marketingConsent) {
    status = "OPTED_OUT";
  }

  const now = new Date().toISOString();
  const historyEvent = {
    action: transactionalConsent && marketingConsent ? "OPT_IN_BOTH" : transactionalConsent ? "OPT_IN_TRANSACTIONAL" : "OPT_IN_MARKETING",
    date: now,
    source: consentSource || "Website Form",
    ipAddress: ipAddress || "127.0.0.1"
  };

  if (consent) {
    consent.customerName = customerName || consent.customerName;
    consent.phone = phone || consent.phone;
    consent.transactionalConsent = transactionalConsent;
    consent.marketingConsent = marketingConsent;
    consent.status = status;
    consent.timestamp = now;
    consent.consentSource = consentSource || consent.consentSource;
    consent.history = consent.history || [];
    consent.history.push(historyEvent);
  } else {
    consent = {
      id: `wac-${Date.now()}`,
      userId: userId || null,
      customerName: customerName || "Customer",
      phone: phone,
      transactionalConsent: Boolean(transactionalConsent),
      marketingConsent: Boolean(marketingConsent),
      consentSource: consentSource || "Website Form",
      timestamp: now,
      ipAddress: ipAddress || "127.0.0.1",
      status: status,
      history: [historyEvent]
    };
    db.whatsappConsents.unshift(consent);
  }
  return consent;
}

// ----------------------------------------------------
// 4. ORDERS & SERVER-SIDE PRICING VALIDATION
// ----------------------------------------------------
app.post('/api/orders', (req, res) => {
  try {
    const db = getDB();
    const { userId, items, shippingAddress, paymentMethod, deliveryNotes, transactionalConsent, marketingConsent } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty. Please add items before placing an order.' });
    }

    // Find user to verify membership status from backend DB
    let isMember = false;
    let user = null;
    if (userId) {
      user = db.users.find(u => u.id === userId);
      if (user && user.isMember) {
        isMember = true;
      }
    } else if (shippingAddress?.phone) {
      const cleanPhone = shippingAddress.phone.replace(/\D/g, '');
      user = db.users.find(u => u.phone && u.phone.replace(/\D/g, '') === cleanPhone);
      if (user && user.isMember) {
        isMember = true;
      }
    }

    // Calculate prices using Backend Truth
    let subtotal = 0;
    let mrpTotal = 0;
    let normalTotal = 0;
    let memberSavings = 0;

    const verifiedItems = items.map(cartItem => {
      let product = db.products.find(p => p.id === cartItem.id);
      if (!product && cartItem.name) {
        product = db.products.find(p => p.name.toLowerCase() === cartItem.name.toLowerCase());
      }
      
      const qty = Math.max(1, Number(cartItem.quantity) || 1);
      const prMrp = product ? product.mrp : (Number(cartItem.mrp) || 100);
      const prNormal = product ? product.normalPrice : (Number(cartItem.normalPrice) || 80);
      const prMember = product ? product.memberPrice : (Number(cartItem.memberPrice) || 70);

      const appliedPrice = isMember ? prMember : prNormal;
      const itemSubtotal = appliedPrice * qty;
      const itemMrpTotal = prMrp * qty;
      const itemNormalTotal = prNormal * qty;
      const itemSaving = (prNormal - prMember) * qty;

      subtotal += itemSubtotal;
      mrpTotal += itemMrpTotal;
      normalTotal += itemNormalTotal;
      if (isMember) {
        memberSavings += itemSaving;
      }

      return {
        id: product ? product.id : (cartItem.id || `item-${Date.now()}`),
        name: product ? product.name : (cartItem.name || 'Grocery Item'),
        brand: product ? product.brand : 'Bachat Bazar',
        category: product ? product.category : 'grocery',
        unit: product ? product.unit : '1 unit',
        image: product ? product.image : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
        quantity: qty,
        mrp: prMrp,
        normalPrice: prNormal,
        memberPrice: prMember,
        appliedPrice: appliedPrice,
        isMemberPrice: isMember,
        itemSavings: isMember ? itemSaving : 0
      };
    });

    const freeDeliveryThreshold = db.settings.freeDeliveryThreshold || 499;
    const deliveryCharge = subtotal >= freeDeliveryThreshold ? 0 : (db.settings.deliveryCharge || 30);
    const total = subtotal + deliveryCharge;
    const totalSavingsFromMRP = Math.max(0, mrpTotal - subtotal);

    const orderId = `BB-ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      customer: user ? {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        isMember: user.isMember,
        memberId: user.memberId
      } : {
        id: 'guest',
        name: shippingAddress?.name || 'Guest Customer',
        phone: shippingAddress?.phone || '',
        email: shippingAddress?.email || '',
        isMember: false,
        memberId: null
      },
      shippingAddress: shippingAddress || {},
      items: verifiedItems,
      mrpTotal,
      normalTotal,
      subtotal,
      deliveryCharge,
      total,
      memberSavings,
      totalSavingsFromMRP,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'UPI' ? 'Paid (UPI Confirmed)' : 'Pending (Cash on Delivery)',
      status: 'Confirmed',
      deliveryNotes: deliveryNotes || '',
      statusHistory: [
        { status: "Confirmed", time: new Date().toISOString() }
      ]
    };

    db.orders.unshift(newOrder);

    // Decrement product stock
    verifiedItems.forEach(item => {
      const p = db.products.find(prod => prod.id === item.id);
      if (p && p.stock !== undefined) {
        p.stock = Math.max(0, p.stock - item.quantity);
      }
    });

    // Record WhatsApp Consent if customer opted during checkout
    const phone = shippingAddress?.phone || user?.phone;
    if (phone && (transactionalConsent !== undefined || marketingConsent !== undefined)) {
      recordConsentInDB({
        userId: user?.id || null,
        customerName: shippingAddress?.name || user?.name || "Customer",
        phone: phone,
        transactionalConsent: Boolean(transactionalConsent),
        marketingConsent: Boolean(marketingConsent),
        consentSource: "Checkout Form",
        ipAddress: req.ip || "127.0.0.1"
      });
    }

    saveDB();

    res.status(201).json({
      success: true,
      order: newOrder,
      message: `Order #${newOrder.id} placed successfully!`
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, message: 'Server error processing order: ' + err.message });
  }
});

app.get('/api/orders', (req, res) => {
  const db = getDB();
  const { userId, phone } = req.query;

  let list = [...db.orders];
  if (userId) {
    list = list.filter(o => o.customer?.id === userId);
  } else if (phone) {
    list = list.filter(o => o.customer?.phone === phone || o.shippingAddress?.phone === phone);
  }

  res.json({ success: true, orders: list });
});

app.get('/api/orders/:id', (req, res) => {
  const db = getDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

// Admin Update Order Status
app.put('/api/orders/:id/status', (req, res) => {
  const db = getDB();
  const { status, paymentStatus } = req.body;

  const idx = db.orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (status) {
    db.orders[idx].status = status;
    db.orders[idx].statusHistory = db.orders[idx].statusHistory || [];
    db.orders[idx].statusHistory.push({ status, time: new Date().toISOString() });
  }

  if (paymentStatus) {
    db.orders[idx].paymentStatus = paymentStatus;
  }

  saveDB();
  res.json({ success: true, order: db.orders[idx], message: `Order #${req.params.id} updated to ${status}` });
});

// ----------------------------------------------------
// 5. ADMIN ANALYTICS & STATS
// ----------------------------------------------------
app.get('/api/admin/stats', (req, res) => {
  const db = getDB();
  const totalRevenue = db.orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = db.orders.length;
  const activeMembers = db.users.filter(u => u.isMember).length;
  const lowStockCount = db.products.filter(p => p.stock < 20).length;
  const totalMemberSavingsGiven = db.orders.reduce((sum, o) => sum + (o.memberSavings || 0), 0);

  res.json({
    success: true,
    stats: {
      totalRevenue,
      totalOrders,
      activeMembers,
      totalProducts: db.products.length,
      lowStockCount,
      totalMemberSavingsGiven
    }
  });
});

// ----------------------------------------------------
// 6. WHATSAPP CONSENT & COMPLIANCE APIS
// ----------------------------------------------------

// Submit / Update Consent
app.post('/api/whatsapp/consent', (req, res) => {
  const { userId, customerName, phone, transactionalConsent, marketingConsent, consentSource } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  const consent = recordConsentInDB({
    userId,
    customerName,
    phone,
    transactionalConsent: Boolean(transactionalConsent),
    marketingConsent: Boolean(marketingConsent),
    consentSource: consentSource || "Direct Opt-In",
    ipAddress: req.ip || "127.0.0.1"
  });

  saveDB();
  res.json({ success: true, consent, message: "WhatsApp preferences updated successfully." });
});

// Get Consent status by phone or userId
app.get('/api/whatsapp/consent', (req, res) => {
  const db = getDB();
  const { phone, userId } = req.query;
  db.whatsappConsents = db.whatsappConsents || [];

  let consent = null;
  if (phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    consent = db.whatsappConsents.find(c => c.phone.replace(/\D/g, '') === cleanPhone);
  } else if (userId) {
    consent = db.whatsappConsents.find(c => c.userId === userId);
  }

  res.json({ success: true, consent: consent || null });
});

// Customer Opt-Out ("Stop WhatsApp Messages")
app.post('/api/whatsapp/opt-out', (req, res) => {
  const db = getDB();
  const { phone, optOutType, reason } = req.body; // optOutType: 'MARKETING_ONLY' | 'ALL'

  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required for opt-out' });
  }

  db.whatsappConsents = db.whatsappConsents || [];
  const cleanPhone = phone.replace(/\D/g, '');
  let consent = db.whatsappConsents.find(c => c.phone.replace(/\D/g, '') === cleanPhone);

  const now = new Date().toISOString();
  const isAll = optOutType === 'ALL';

  if (consent) {
    consent.marketingConsent = false;
    if (isAll) {
      consent.transactionalConsent = false;
      consent.status = "OPTED_OUT";
    } else {
      consent.status = consent.transactionalConsent ? "TRANSACTIONAL_ONLY" : "OPTED_OUT";
    }
    consent.timestamp = now;
    consent.history = consent.history || [];
    consent.history.push({
      action: isAll ? "OPT_OUT_ALL" : "OPT_OUT_MARKETING",
      date: now,
      source: "Stop WhatsApp Page",
      reason: reason || "Customer request",
      ipAddress: req.ip || "127.0.0.1"
    });
  } else {
    consent = {
      id: `wac-${Date.now()}`,
      userId: null,
      customerName: "Customer",
      phone: phone,
      transactionalConsent: !isAll,
      marketingConsent: false,
      consentSource: "Stop WhatsApp Page",
      timestamp: now,
      ipAddress: req.ip || "127.0.0.1",
      status: isAll ? "OPTED_OUT" : "TRANSACTIONAL_ONLY",
      history: [{
        action: isAll ? "OPT_OUT_ALL" : "OPT_OUT_MARKETING",
        date: now,
        source: "Stop WhatsApp Page",
        reason: reason || "Customer request",
        ipAddress: req.ip || "127.0.0.1"
      }]
    };
    db.whatsappConsents.unshift(consent);
  }

  saveDB();
  res.json({
    success: true,
    consent,
    message: isAll
      ? "You have been unsubscribed from all WhatsApp messages from Bachat Bazar."
      : "You have been successfully unsubscribed from Bachat Bazar promotional WhatsApp messages. Transactional updates for your orders will remain active."
  });
});

// Admin WhatsApp Compliance Metrics & Full Audit Table
app.get('/api/admin/whatsapp-compliance', (req, res) => {
  const db = getDB();
  const consents = db.whatsappConsents || [];
  const users = db.users || [];

  const marketingOptIn = consents.filter(c => c.marketingConsent && c.status !== 'OPTED_OUT').length;
  const transactionalOptIn = consents.filter(c => c.transactionalConsent).length;
  const optedOut = consents.filter(c => c.status === 'OPTED_OUT').length;
  const totalOptIn = consents.filter(c => (c.transactionalConsent || c.marketingConsent) && c.status !== 'OPTED_OUT').length;
  
  // Calculate users with no consent recorded yet
  const consentedPhones = new Set(consents.map(c => c.phone.replace(/\D/g, '')));
  const noConsent = users.filter(u => !consentedPhones.has(u.phone.replace(/\D/g, ''))).length;

  res.json({
    success: true,
    stats: {
      totalOptIn,
      marketingOptIn,
      transactionalOptIn,
      optedOut,
      noConsent,
      totalRegisteredUsers: users.length
    },
    consents
  });
});

// ----------------------------------------------------
// 7. WHATSAPP TEMPLATES MANAGEMENT
// ----------------------------------------------------
app.get('/api/admin/whatsapp-templates', (req, res) => {
  const db = getDB();
  res.json({ success: true, templates: db.whatsappTemplates || [] });
});

app.post('/api/admin/whatsapp-templates', (req, res) => {
  const db = getDB();
  const { name, category, language, message, variables } = req.body;

  if (!name || !message) {
    return res.status(400).json({ success: false, message: 'Template name and message content are required' });
  }

  const newTemplate = {
    id: `tpl-${Date.now()}`,
    name: name.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
    category: category || 'UTILITY',
    language: language || 'en',
    message,
    variables: variables || [],
    status: 'Draft',
    approvalStatus: 'Draft (Pending Meta Submission)',
    createdDate: new Date().toISOString()
  };

  db.whatsappTemplates = db.whatsappTemplates || [];
  db.whatsappTemplates.push(newTemplate);
  saveDB();

  res.status(201).json({ success: true, template: newTemplate, message: 'Template created in Draft state' });
});

app.put('/api/admin/whatsapp-templates/:id', (req, res) => {
  const db = getDB();
  db.whatsappTemplates = db.whatsappTemplates || [];

  const idx = db.whatsappTemplates.findIndex(t => t.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Template not found' });
  }

  db.whatsappTemplates[idx] = {
    ...db.whatsappTemplates[idx],
    ...req.body,
    approvalStatus: req.body.status === 'Approved' ? 'Meta Approved' : req.body.status === 'Submitted' ? 'Under Review by Meta' : req.body.approvalStatus || db.whatsappTemplates[idx].approvalStatus
  };

  saveDB();
  res.json({ success: true, template: db.whatsappTemplates[idx], message: 'Template updated successfully' });
});

// ----------------------------------------------------
// 8. WHATSAPP CAMPAIGN SAFETY & RECIPIENT SIMULATOR
// ----------------------------------------------------
app.post('/api/admin/whatsapp-campaign/simulate', (req, res) => {
  const db = getDB();
  const { templateId } = req.body;

  const template = (db.whatsappTemplates || []).find(t => t.id === templateId);
  if (!template) {
    return res.status(400).json({ success: false, message: 'Please select a valid WhatsApp template' });
  }

  const isTemplateApproved = template.status === 'Approved';
  const isMarketing = template.category === 'MARKETING';

  const consents = db.whatsappConsents || [];
  const users = db.users || [];

  const eligibleRecipients = [];
  const excludedRecipients = [];

  // Evaluate each registered customer
  users.forEach(u => {
    const cleanPhone = u.phone ? u.phone.replace(/\D/g, '') : '';
    const consent = consents.find(c => c.phone.replace(/\D/g, '') === cleanPhone || c.userId === u.id);

    if (!cleanPhone || cleanPhone.length < 10) {
      excludedRecipients.push({ name: u.name, phone: u.phone, reason: 'Invalid or missing mobile number' });
      return;
    }

    if (!consent) {
      excludedRecipients.push({ name: u.name, phone: u.phone, reason: 'No WhatsApp consent on record' });
      return;
    }

    if (consent.status === 'OPTED_OUT') {
      excludedRecipients.push({ name: u.name, phone: u.phone, reason: 'Customer explicitly opted-out' });
      return;
    }

    if (isMarketing && !consent.marketingConsent) {
      excludedRecipients.push({ name: u.name, phone: u.phone, reason: 'Missing marketing/promotional consent' });
      return;
    }

    if (!isMarketing && !consent.transactionalConsent) {
      excludedRecipients.push({ name: u.name, phone: u.phone, reason: 'Missing transactional messaging consent' });
      return;
    }

    eligibleRecipients.push({
      name: u.name,
      phone: u.phone,
      consentDate: consent.timestamp,
      consentSource: consent.consentSource,
      isMember: Boolean(u.isMember)
    });
  });

  res.json({
    success: true,
    template,
    isTemplateApproved,
    summary: {
      totalAudience: users.length,
      eligibleCount: eligibleRecipients.length,
      excludedCount: excludedRecipients.length,
      policyComplianceRate: users.length > 0 ? Math.round((eligibleRecipients.length / users.length) * 100) : 0,
      safetyWarning: !isTemplateApproved ? "⚠️ Meta Policy Warning: This template is not in 'Approved' status. Production broadcast will be rejected." : null
    },
    eligibleRecipients,
    excludedRecipients
  });
});

// ----------------------------------------------------
// 9. DATA DELETION REQUESTS APIS
// ----------------------------------------------------
app.post('/api/data-deletion', (req, res) => {
  const db = getDB();
  const { name, phone, email, requestType, reason } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and Phone number are required to submit data deletion request.' });
  }

  const newRequest = {
    id: `ddr-${Date.now()}`,
    name,
    phone,
    email: email || '',
    requestType: requestType || 'Full Account & Data Deletion',
    reason: reason || 'Customer requested data removal',
    status: 'PENDING',
    dateRequested: new Date().toISOString(),
    resolutionNotes: ''
  };

  db.dataDeletionRequests = db.dataDeletionRequests || [];
  db.dataDeletionRequests.unshift(newRequest);
  saveDB();

  res.status(201).json({
    success: true,
    request: newRequest,
    message: `Data deletion request #${newRequest.id} received. Our Data Grievance Officer will review and process within 7 business days.`
  });
});

app.get('/api/admin/data-deletion', (req, res) => {
  const db = getDB();
  res.json({ success: true, requests: db.dataDeletionRequests || [] });
});

app.put('/api/admin/data-deletion/:id', (req, res) => {
  const db = getDB();
  db.dataDeletionRequests = db.dataDeletionRequests || [];

  const idx = db.dataDeletionRequests.findIndex(r => r.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  db.dataDeletionRequests[idx] = {
    ...db.dataDeletionRequests[idx],
    ...req.body,
    resolutionDate: new Date().toISOString()
  };

  saveDB();
  res.json({ success: true, request: db.dataDeletionRequests[idx], message: 'Data deletion request status updated.' });
});

// ----------------------------------------------------
// 10. HERO SLIDER MANAGEMENT APIS
// ----------------------------------------------------

// Public: Get Active Hero Slides for Storefront
app.get('/api/hero-slides', (req, res) => {
  const db = getDB();
  const slides = (db.heroSlides || [])
    .filter(s => s.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json({ success: true, slides });
});

// Admin: Get All Hero Slides
app.get('/api/admin/hero-slides', (req, res) => {
  const db = getDB();
  const slides = [...(db.heroSlides || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json({ success: true, slides });
});

// Admin: Create Hero Slide
app.post('/api/admin/hero-slides', (req, res) => {
  const db = getDB();
  const { title, image, badgeText, productName, mrp, normalPrice, memberPrice, order, isActive } = req.body;

  if (!image) {
    return res.status(400).json({ success: false, message: 'Image URL is required' });
  }

  const newSlide = {
    id: `hero-${Date.now()}`,
    title: title || 'Bachat Bazar Special',
    image: image.trim(),
    badgeText: badgeText || 'Zyada Kharido, Zyada Bachao',
    productName: productName || 'Aashirvaad Shudh Atta 5kg',
    mrp: Number(mrp) || 280,
    normalPrice: Number(normalPrice) || 249,
    memberPrice: Number(memberPrice) || 229,
    order: Number(order) || (db.heroSlides?.length || 0) + 1,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
    createdAt: new Date().toISOString()
  };

  db.heroSlides = db.heroSlides || [];
  db.heroSlides.push(newSlide);
  saveDB();

  res.status(201).json({ success: true, slide: newSlide, message: 'Hero slide created successfully.' });
});

// Admin: Update Hero Slide
app.put('/api/admin/hero-slides/:id', (req, res) => {
  const db = getDB();
  db.heroSlides = db.heroSlides || [];

  const idx = db.heroSlides.findIndex(s => s.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Hero slide not found' });
  }

  db.heroSlides[idx] = {
    ...db.heroSlides[idx],
    ...req.body,
    mrp: req.body.mrp !== undefined ? Number(req.body.mrp) : db.heroSlides[idx].mrp,
    normalPrice: req.body.normalPrice !== undefined ? Number(req.body.normalPrice) : db.heroSlides[idx].normalPrice,
    memberPrice: req.body.memberPrice !== undefined ? Number(req.body.memberPrice) : db.heroSlides[idx].memberPrice,
    order: req.body.order !== undefined ? Number(req.body.order) : db.heroSlides[idx].order,
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : db.heroSlides[idx].isActive,
    updatedAt: new Date().toISOString()
  };

  saveDB();
  res.json({ success: true, slide: db.heroSlides[idx], message: 'Hero slide updated successfully.' });
});

// Admin: Delete Hero Slide
app.delete('/api/admin/hero-slides/:id', (req, res) => {
  const db = getDB();
  db.heroSlides = db.heroSlides || [];

  const initialLen = db.heroSlides.length;
  db.heroSlides = db.heroSlides.filter(s => s.id !== req.params.id);

  if (db.heroSlides.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Hero slide not found' });
  }

  saveDB();
  res.json({ success: true, message: 'Hero slide deleted successfully.' });
});

// ----------------------------------------------------
// 11. MEMBERSHIP PLANS & APPLICATION APPROVAL APIS
// ----------------------------------------------------

// Public: Get Active Membership Plans
app.get('/api/membership/plans', (req, res) => {
  const db = getDB();
  const plans = (db.membershipPlans || []).filter(p => p.isActive !== false);
  res.json({ success: true, plans });
});

// Admin: Get All Membership Plans
app.get('/api/admin/membership/plans', (req, res) => {
  const db = getDB();
  res.json({ success: true, plans: db.membershipPlans || [] });
});

// Admin: Update Membership Plan (Price, MRP, Name, Features, etc.)
app.put('/api/admin/membership/plans/:id', (req, res) => {
  const db = getDB();
  db.membershipPlans = db.membershipPlans || [];
  const idx = db.membershipPlans.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Membership plan not found' });
  }

  db.membershipPlans[idx] = {
    ...db.membershipPlans[idx],
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : db.membershipPlans[idx].price,
    mrp: req.body.mrp !== undefined ? Number(req.body.mrp) : db.membershipPlans[idx].mrp,
    updatedAt: new Date().toISOString()
  };

  saveDB();
  res.json({ success: true, plan: db.membershipPlans[idx], message: 'Membership plan updated successfully.' });
});

// Customer: Apply for Membership (Cash or UPI)
app.post('/api/membership/apply', (req, res) => {
  const db = getDB();
  const { userId, customerName, phone, email, address, planId, paymentMethod, notes } = req.body;

  if (!phone || !planId) {
    return res.status(400).json({ success: false, message: 'Phone and membership plan are required.' });
  }

  const plan = (db.membershipPlans || []).find(p => p.id === planId);
  if (!plan) {
    return res.status(404).json({ success: false, message: 'Selected plan not found.' });
  }

  // Find or create user
  let user = null;
  if (userId) {
    user = (db.users || []).find(u => u.id === userId);
  }
  if (!user && phone) {
    user = (db.users || []).find(u => u.phone === phone);
  }

  const newRequest = {
    id: `mem-req-${Date.now()}`,
    userId: user ? user.id : `user-${Date.now()}`,
    customerName: customerName || user?.name || 'Valued Customer',
    customerPhone: phone,
    customerEmail: email || user?.email || '',
    customerAddress: address || (user?.addresses?.[0]?.house ? `${user.addresses[0].house}, ${user.addresses[0].area}, ${user.addresses[0].city}` : 'Bhiwadi, Rajasthan'),
    planId: plan.id,
    planName: plan.name,
    planDuration: plan.duration,
    planPrice: plan.price,
    paymentMethod: paymentMethod || 'CASH', // 'CASH' | 'UPI'
    paymentStatus: paymentMethod === 'CASH' ? 'PENDING_COLLECTION' : 'PENDING_VERIFICATION',
    status: 'PENDING_APPROVAL', // PENDING_APPROVAL | APPROVED | REJECTED | DEACTIVATED
    requestedAt: new Date().toISOString(),
    approvedAt: null,
    approvedBy: null,
    notes: notes || (paymentMethod === 'CASH' ? 'Customer selected Cash payment at Store Counter / Doorstep collection' : 'Online / UPI Payment Request')
  };

  db.membershipRequests = db.membershipRequests || [];
  db.membershipRequests.unshift(newRequest);

  // Update user object if existing
  if (user) {
    user.membershipStatus = 'PENDING_APPROVAL';
    user.pendingApplication = {
      requestId: newRequest.id,
      planName: plan.name,
      planPrice: plan.price,
      paymentMethod: newRequest.paymentMethod,
      requestedAt: newRequest.requestedAt
    };
  }

  saveDB();
  res.status(201).json({
    success: true,
    request: newRequest,
    user: user || null,
    message: `🎉 Membership application submitted for ${plan.name}! Payment Mode: ${newRequest.paymentMethod}. Admin will verify and activate your membership shortly.`
  });
});

// Admin: Get All Membership Requests
app.get('/api/admin/membership/requests', (req, res) => {
  const db = getDB();
  res.json({ success: true, requests: db.membershipRequests || [] });
});

// Admin: Approve Membership Request (Activates Member & Calculates Expiry)
app.post('/api/admin/membership/requests/:id/approve', (req, res) => {
  const db = getDB();
  db.membershipRequests = db.membershipRequests || [];
  const reqIdx = db.membershipRequests.findIndex(r => r.id === req.params.id);
  if (reqIdx === -1) {
    return res.status(404).json({ success: false, message: 'Membership request not found' });
  }

  const membershipReq = db.membershipRequests[reqIdx];
  const now = new Date();

  // Determine expiration based on plan duration
  let expiryDate = null;
  const plan = (db.membershipPlans || []).find(p => p.id === membershipReq.planId);
  const durationMonths = plan?.durationMonths || (membershipReq.planDuration === '1 Year' ? 12 : membershipReq.planDuration === '2 Years' ? 24 : membershipReq.planDuration === '3 Years' ? 36 : null);

  if (durationMonths) {
    const exp = new Date(now);
    exp.setMonth(exp.getMonth() + durationMonths);
    expiryDate = exp.toISOString();
  } // Lifetime has null expiryDate

  // Update request
  membershipReq.status = 'APPROVED';
  membershipReq.paymentStatus = 'COLLECTED';
  membershipReq.approvedAt = now.toISOString();
  membershipReq.approvedBy = req.body.approvedBy || 'Admin';
  membershipReq.expiryDate = expiryDate;

  // Find and update user
  let userIdx = (db.users || []).findIndex(u => u.id === membershipReq.userId || u.phone === membershipReq.customerPhone);
  if (userIdx !== -1) {
    db.users[userIdx].isMember = true;
    db.users[userIdx].memberId = db.users[userIdx].memberId || `BB-MEM-${Math.floor(1000 + Math.random() * 9000)}`;
    db.users[userIdx].membershipPlan = membershipReq.planId;
    db.users[userIdx].membershipPlanName = membershipReq.planName;
    db.users[userIdx].membershipStartDate = now.toISOString();
    db.users[userIdx].membershipExpiryDate = expiryDate;
    db.users[userIdx].membershipStatus = 'ACTIVE';
    delete db.users[userIdx].pendingApplication;
  }

  saveDB();
  res.json({
    success: true,
    request: membershipReq,
    user: userIdx !== -1 ? db.users[userIdx] : null,
    message: `✓ Membership approved & activated for ${membershipReq.customerName} (${membershipReq.planName})!`
  });
});

// Admin: Reject Membership Request
app.post('/api/admin/membership/requests/:id/reject', (req, res) => {
  const db = getDB();
  db.membershipRequests = db.membershipRequests || [];
  const reqIdx = db.membershipRequests.findIndex(r => r.id === req.params.id);
  if (reqIdx === -1) {
    return res.status(404).json({ success: false, message: 'Membership request not found' });
  }

  const membershipReq = db.membershipRequests[reqIdx];
  membershipReq.status = 'REJECTED';
  membershipReq.rejectedAt = new Date().toISOString();
  membershipReq.rejectionReason = req.body.reason || 'Payment not received or customer cancelled';

  // Update user
  const userIdx = (db.users || []).findIndex(u => u.id === membershipReq.userId || u.phone === membershipReq.customerPhone);
  if (userIdx !== -1) {
    delete db.users[userIdx].pendingApplication;
    if (!db.users[userIdx].membershipStartDate) {
      db.users[userIdx].membershipStatus = 'NONE';
    }
  }

  saveDB();
  res.json({ success: true, request: membershipReq, message: 'Membership request rejected.' });
});

// Admin: Direct User VIP Toggle (Activate / Deactivate with Plan Option)
app.post('/api/admin/membership/user/:userId/toggle', (req, res) => {
  const db = getDB();
  const userIdx = (db.users || []).findIndex(u => u.id === req.params.userId);
  if (userIdx === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const { activate, planId } = req.body;
  const shouldActivate = activate !== undefined ? Boolean(activate) : !db.users[userIdx].isMember;

  db.users[userIdx].isMember = shouldActivate;
  if (shouldActivate) {
    const plan = (db.membershipPlans || []).find(p => p.id === planId) || db.membershipPlans?.[3] || { name: 'Lifetime VIP Club', durationMonths: null };
    const now = new Date();
    let expiryDate = null;
    if (plan.durationMonths) {
      const exp = new Date(now);
      exp.setMonth(exp.getMonth() + plan.durationMonths);
      expiryDate = exp.toISOString();
    }

    db.users[userIdx].memberId = db.users[userIdx].memberId || `BB-MEM-${Math.floor(1000 + Math.random() * 9000)}`;
    db.users[userIdx].membershipPlan = plan.id || 'plan-lifetime';
    db.users[userIdx].membershipPlanName = plan.name || 'Lifetime VIP Club';
    db.users[userIdx].membershipStartDate = now.toISOString();
    db.users[userIdx].membershipExpiryDate = expiryDate;
    db.users[userIdx].membershipStatus = 'ACTIVE';
  } else {
    db.users[userIdx].membershipStatus = 'DEACTIVATED';
  }

  saveDB();
  res.json({
    success: true,
    user: db.users[userIdx],
    message: shouldActivate ? `VIP Membership activated for ${db.users[userIdx].name}` : `Membership deactivated for ${db.users[userIdx].name}`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Bachat Bazar Server running on http://localhost:${PORT}`);
});


