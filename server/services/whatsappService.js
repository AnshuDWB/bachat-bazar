/**
 * Bachat Bazar - Meta WhatsApp Business Cloud API Service
 * Official API integration for sending OTPs, Order Confirmations, and Marketing Updates.
 */

const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || 'v21.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

/**
 * Format 10-digit Indian mobile number to E.164 without '+'
 */
export function formatPhoneNumber(phone) {
  const clean = String(phone).replace(/\D/g, '');
  if (clean.length === 10) return '91' + clean;
  if (clean.startsWith('91') && clean.length === 12) return clean;
  if (clean.startsWith('0') && clean.length === 11) return '91' + clean.slice(1);
  return clean;
}

/**
 * Send raw text message or template message via Meta WhatsApp Cloud API
 */
export async function sendWhatsAppMessage({ to, type = 'text', text, template }) {
  const recipient = formatPhoneNumber(to);

  // If Meta API credentials are not configured, log & return simulation mode
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.log(`[WhatsApp Simulated Dispatch] -> To: +${recipient} | Type: ${type}`);
    return {
      success: true,
      simulated: true,
      message: 'WhatsApp Cloud API credentials not configured. Message simulated in dev console.',
      recipient
    };
  }

  const endpoint = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: recipient,
    type: type
  };

  if (type === 'text') {
    payload.text = { preview_url: false, body: text };
  } else if (type === 'template') {
    payload.template = template;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[WhatsApp API Error Response]:', data);
      return {
        success: false,
        error: data.error || 'Failed to send WhatsApp message via Meta Cloud API'
      };
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
      data
    };
  } catch (error) {
    console.error('[WhatsApp API Network Error]:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 1. Send OTP Verification Code via WhatsApp
 */
export async function sendOtpViaWhatsApp(phone, otpCode, isCustomer = true) {
  const text = isCustomer
    ? `🔐 *BACHAT BAZAR LOGIN OTP*\n\nYour 6-digit verification code is: *${otpCode}*\n\n⏰ Valid for: 5 Minutes\n🛒 Wholesale grocery savings in Bhiwadi.\n\n⚠️ Do not share this OTP code with anyone.`
    : `🛡️ *BACHAT BAZAR ADMIN PORTAL ACCESS*\n\nYour Admin Access OTP is: *${otpCode}*\n\n🔒 Domain: *bachatbazar.space/admin*\n⏰ Valid for: 5 Minutes\n\n⚠️ Confidential admin verification code.`;

  return sendWhatsAppMessage({
    to: phone,
    type: 'text',
    text
  });
}

/**
 * 2. Send Order Confirmation Notification via WhatsApp
 */
export async function sendOrderConfirmationWhatsApp(order) {
  const phone = order.customer?.phone || order.shippingAddress?.phone;
  if (!phone) return null;

  const itemsSummary = (order.items || []).map(i => `• ${i.name} (${i.unit}) x ${i.quantity} = ₹${i.appliedPrice * i.quantity}`).join('\n');

  const text = 
    `🛒 *ORDER CONFIRMED - BACHAT BAZAR*\n\n` +
    `Namaste *${order.customer?.name || 'Customer'}*,\n` +
    `Your order *#${order.id}* has been received successfully!\n\n` +
    `*Order Summary:*\n${itemsSummary}\n\n` +
    `*Total Amount:* ₹${order.total}\n` +
    `*Payment Mode:* ${order.paymentMethod} (${order.paymentStatus})\n` +
    `*Delivery Slot:* ${order.deliverySlot || 'Within 2 Hours in Bhiwadi'}\n\n` +
    `🚚 Our delivery partner will reach your address shortly. For help call: *7073222340*.\n\n` +
    `_Thank you for choosing Bachat Bazar - Har Din Ki Bachat!_`;

  return sendWhatsAppMessage({
    to: phone,
    type: 'text',
    text
  });
}

/**
 * 3. Send Order Status Update via WhatsApp (Dispatched, Delivered, etc.)
 */
export async function sendOrderStatusUpdateWhatsApp(order, newStatus) {
  const phone = order.customer?.phone || order.shippingAddress?.phone;
  if (!phone) return null;

  const statusEmojis = {
    'Confirmed': '✅',
    'Processing': '📦',
    'Out for Delivery': '🚚',
    'Delivered': '🎉',
    'Cancelled': '❌'
  };

  const emoji = statusEmojis[newStatus] || '📢';

  const text = 
    `${emoji} *ORDER UPDATE - BACHAT BAZAR*\n\n` +
    `Namaste *${order.customer?.name || 'Customer'}*,\n` +
    `Your order *#${order.id}* is now: *${newStatus.toUpperCase()}*.\n\n` +
    `*Total Bill:* ₹${order.total}\n` +
    `*Delivery Address:* ${order.shippingAddress?.house || ''}, ${order.shippingAddress?.area || 'Bhiwadi'}\n\n` +
    `Need instant help? Call us at *7073222340* or reply to this message.`;

  return sendWhatsAppMessage({
    to: phone,
    type: 'text',
    text
  });
}
