// Indian Rupee currency formatter
export function formatINR(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

// Calculate discount percentage from MRP
export function getDiscountPercentage(mrp, salePrice) {
  if (!mrp || !salePrice || mrp <= salePrice) return 0;
  return Math.round(((mrp - salePrice) / mrp) * 100);
}

// Format readable date
export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
