import { formatINR } from './formatters.js';

// Default store phone/whatsapp
const DEFAULT_PHONE = "917073222340";

export function getGeneralWhatsAppUrl(phone = DEFAULT_PHONE) {
  const cleanPhone = phone.replace(/\D/g, '');
  const text = encodeURIComponent("Namaste Bachat Bazar! I would like to inquire about grocery delivery and membership offers.");
  return `https://wa.me/${cleanPhone}?text=${text}`;
}

export function getProductWhatsAppUrl(product, isMember = false, phone = DEFAULT_PHONE) {
  const cleanPhone = phone.replace(/\D/g, '');
  const price = isMember ? product.memberPrice : product.normalPrice;
  const text = encodeURIComponent(
    `Namaste Bachat Bazar!\nI want to order / inquire about:\n\n*${product.name}*\nBrand: ${product.brand}\nUnit: ${product.unit}\nPrice: ${formatINR(price)}${isMember ? ' (Member Price)' : ''}\nMRP: ${formatINR(product.mrp)}\n\nIs this currently available for home delivery in Bhiwadi?`
  );
  return `https://wa.me/${cleanPhone}?text=${text}`;
}

export function getOrderWhatsAppUrl(order, phone = DEFAULT_PHONE) {
  let cleanPhone = (phone || DEFAULT_PHONE).replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }

  const itemsList = (order.items || []).map(item =>
    `• ${item.name} (${item.unit}) x ${item.quantity} = ${formatINR(item.appliedPrice * item.quantity)}`
  ).join('\n');

  const addressLines = [
    order.shippingAddress?.house,
    order.shippingAddress?.area,
    order.shippingAddress?.landmark ? `Landmark: ${order.shippingAddress.landmark}` : null,
    `${order.shippingAddress?.city || 'Bhiwadi'}, ${order.shippingAddress?.state || 'Rajasthan'} - ${order.shippingAddress?.pincode || '301019'}`
  ].filter(Boolean).join(', ');

  const text = encodeURIComponent(
    `🛒 *NEW ORDER - BACHAT BAZAR*\n` +
    `--------------------------------\n` +
    `*Order ID:* #${order.id}\n` +
    `*Customer:* ${order.customer?.name || order.shippingAddress?.name}\n` +
    `*Phone:* ${order.customer?.phone || order.shippingAddress?.phone}\n` +
    `*Membership:* ${order.customer?.isMember ? '✅ Active VIP Member' : '❌ Regular Customer'}\n` +
    (order.deliverySlot ? `*Delivery Slot:* ${order.deliverySlot}\n` : '') +
    `\n*Items Ordered:*\n${itemsList}\n\n` +
    `--------------------------------\n` +
    `*Subtotal:* ${formatINR(order.subtotal)}\n` +
    `*Delivery Charge:* ${order.deliveryCharge === 0 ? 'FREE' : formatINR(order.deliveryCharge)}\n` +
    `*Total Payable:* ${formatINR(order.total)}\n` +
    (order.memberSavings > 0 ? `*Member Savings:* ${formatINR(order.memberSavings)}\n` : '') +
    `*Payment Mode:* ${order.paymentMethod} (${order.paymentStatus})\n\n` +
    `*Delivery Address:*\n${addressLines}\n` +
    (order.deliveryNotes ? `*Special Notes:* ${order.deliveryNotes}\n` : '') +
    `\n🙏 Please confirm order and delivery timing. Thank you!`
  );

  return `https://wa.me/${cleanPhone}?text=${text}`;
}
