import React, { useState, useMemo } from 'react';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Sparkles,
  CreditCard,
  Banknote,
  QrCode,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  MapPin,
  Clock,
  Download,
  Printer,
  ChevronRight,
  PieChart,
  BarChart2,
  Award,
  Crown,
  CheckCircle2,
  Truck
} from 'lucide-react';

export default function SalesAnalytics({ orders = [], products = [], customers = [], stats = {} }) {
  const [timeframe, setTimeframe] = useState('all'); // 'today' | 'week' | 'month' | 'all'

  // Filter orders by selected timeframe
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter(ord => {
      if (!ord.date) return true;
      const orderDate = new Date(ord.date);

      if (timeframe === 'today') {
        return (
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }
      if (timeframe === 'week') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= sevenDaysAgo;
      }
      if (timeframe === 'month') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orderDate >= thirtyDaysAgo;
      }
      return true; // 'all'
    });
  }, [orders, timeframe]);

  // Key KPI Calculations
  const metrics = useMemo(() => {
    const totalRev = filteredOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalOrders = filteredOrders.length;
    const aov = totalOrders > 0 ? Math.round(totalRev / totalOrders) : 0;
    const memberSavings = filteredOrders.reduce((sum, o) => sum + (Number(o.memberSavings) || 0), 0);

    // Payment mode splits
    const codOrders = filteredOrders.filter(o => o.paymentMethod === 'COD' || o.paymentMethod === 'CASH');
    const upiOrders = filteredOrders.filter(o => o.paymentMethod === 'UPI');
    const codRev = codOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const upiRev = upiOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    // Member vs Regular splits
    const memberOrders = filteredOrders.filter(o => o.customer?.isMember || o.memberSavings > 0);
    const regularOrders = filteredOrders.filter(o => !o.customer?.isMember && (!o.memberSavings || o.memberSavings === 0));
    const memberRev = memberOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const regularRev = regularOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    // Order statuses
    const deliveredCount = filteredOrders.filter(o => o.status === 'Delivered').length;
    const pendingCount = filteredOrders.filter(o => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Processing').length;
    const outForDeliveryCount = filteredOrders.filter(o => o.status === 'Out for Delivery').length;

    return {
      totalRev,
      totalOrders,
      aov,
      memberSavings,
      codOrdersCount: codOrders.length,
      codRev,
      upiOrdersCount: upiOrders.length,
      upiRev,
      memberOrdersCount: memberOrders.length,
      memberRev,
      regularOrdersCount: regularOrders.length,
      regularRev,
      deliveredCount,
      pendingCount,
      outForDeliveryCount
    };
  }, [filteredOrders]);

  // Top Selling Products Breakdown
  const topProducts = useMemo(() => {
    const map = {};
    filteredOrders.forEach(ord => {
      (ord.items || []).forEach(item => {
        const key = item.name || item.id;
        if (!map[key]) {
          map[key] = {
            name: item.name,
            unit: item.unit || '1 unit',
            qty: 0,
            revenue: 0,
            image: products.find(p => p.name === item.name || p.id === item.id)?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80'
          };
        }
        map[key].qty += (item.quantity || 1);
        map[key].revenue += (item.appliedPrice || item.normalPrice || item.memberPrice || 0) * (item.quantity || 1);
      });
    });

    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [filteredOrders, products]);

  // Category Revenue Breakdown
  const categoryBreakdown = useMemo(() => {
    const catMap = {
      'grocery': { name: 'Grocery & Staples', revenue: 0, count: 0, color: '#D71920' },
      'dairy': { name: 'Dairy & Ghee', revenue: 0, count: 0, color: '#3B82F6' },
      'fruits-veg': { name: 'Fruits & Vegetables', revenue: 0, count: 0, color: '#10B981' },
      'snacks': { name: 'Snacks & Packaged', revenue: 0, count: 0, color: '#F59E0B' },
      'personal-care': { name: 'Personal Care', revenue: 0, count: 0, color: '#8B5CF6' },
      'household': { name: 'Household & Cleaning', revenue: 0, count: 0, color: '#EC4899' }
    };

    filteredOrders.forEach(ord => {
      (ord.items || []).forEach(item => {
        const prod = products.find(p => p.name === item.name || p.id === item.id);
        const catKey = prod?.category || 'grocery';
        if (!catMap[catKey]) {
          catMap[catKey] = { name: catKey, revenue: 0, count: 0, color: '#6B7280' };
        }
        const itemTotal = (item.appliedPrice || 100) * (item.quantity || 1);
        catMap[catKey].revenue += itemTotal;
        catMap[catKey].count += (item.quantity || 1);
      });
    });

    const list = Object.values(catMap).filter(c => c.revenue > 0);
    const maxRev = Math.max(1, ...list.map(c => c.revenue));
    return list.map(c => ({
      ...c,
      percentage: Math.round((c.revenue / (metrics.totalRev || 1)) * 100) || 0,
      barWidth: Math.round((c.revenue / maxRev) * 100)
    })).sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders, products, metrics.totalRev]);

  // Bhiwadi Delivery Locations Breakdown
  const deliveryLocations = useMemo(() => {
    const locMap = {};
    filteredOrders.forEach(ord => {
      const area = ord.shippingAddress?.area || 'Aravali Vihar';
      locMap[area] = (locMap[area] || 0) + 1;
    });

    return Object.entries(locMap)
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredOrders]);

  // 7-Days / Dynamic Revenue Bar Chart Data
  const chartBars = useMemo(() => {
    const days = [];
    const now = new Date();
    const count = timeframe === 'today' ? 12 : timeframe === 'week' ? 7 : 14;

    if (timeframe === 'today') {
      // 2-hour intervals for today
      for (let i = 8; i <= 22; i += 2) {
        const label = `${i}:00`;
        const rev = filteredOrders
          .filter(o => {
            const d = new Date(o.date);
            return d.getHours() >= i && d.getHours() < i + 2;
          })
          .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        days.push({ label, revenue: rev });
      }
    } else {
      // Daily intervals
      for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayStr = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
        const dateKey = d.toISOString().slice(0, 10);
        
        const rev = filteredOrders
          .filter(o => {
            if (!o.date) return false;
            return o.date.startsWith(dateKey) || new Date(o.date).toDateString() === d.toDateString();
          })
          .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

        days.push({ label: dayStr, revenue: rev });
      }
    }

    const maxVal = Math.max(500, ...days.map(d => d.revenue));
    return days.map(d => ({
      ...d,
      heightPercent: Math.max(8, Math.round((d.revenue / maxVal) * 100))
    }));
  }, [filteredOrders, timeframe]);

  // Export Sales Report to CSV
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert('No orders available to export in this timeframe.');
      return;
    }

    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Items Count', 'Payment Method', 'Status', 'Member Savings (INR)', 'Total Amount (INR)'];
    const rows = filteredOrders.map(o => [
      `"${o.id}"`,
      `"${formatDate(o.date)}"`,
      `"${o.customer?.name || o.shippingAddress?.name || 'Customer'}"`,
      `"${o.customer?.phone || o.shippingAddress?.phone || ''}"`,
      o.items?.length || 0,
      `"${o.paymentMethod}"`,
      `"${o.status}"`,
      o.memberSavings || 0,
      o.total || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bachat_Bazar_Sales_Report_${timeframe}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Controls Bar: Timeframe & Actions */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D71920]">
            <TrendingUp className="w-5 h-5" />
            <h2 className="text-base font-black uppercase tracking-wider text-[#111111]">
              Sales & Revenue Analytics
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time store performance, profit insights, VIP Member vs Regular sales in Bhiwadi.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Timeframe Selector Pill Group */}
          <div className="bg-[#F7F7F7] p-1 rounded-xl border border-neutral-200 flex items-center font-bold">
            {[
              { id: 'today', label: 'Today' },
              { id: 'week', label: 'Last 7 Days' },
              { id: 'month', label: 'Last 30 Days' },
              { id: 'all', label: 'All-Time' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  timeframe === tab.id
                    ? 'bg-[#D71920] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-[#111111]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Gross Revenue */}
        <div className="bg-gradient-to-br from-white to-neutral-50 p-5 rounded-2xl border border-neutral-200 shadow-sm relative overflow-hidden group hover:border-[#D71920] transition">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Total Sales Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            {formatINR(metrics.totalRev)}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{metrics.totalOrders} grocery orders processed</span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-gradient-to-br from-white to-neutral-50 p-5 rounded-2xl border border-neutral-200 shadow-sm relative overflow-hidden group hover:border-[#D71920] transition">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Average Order Value (AOV)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            {formatINR(metrics.aov)}
          </p>
          <p className="text-[11px] text-neutral-500 mt-2">
            Average basket spend per customer in Bhiwadi
          </p>
        </div>

        {/* Member Savings Given */}
        <div className="bg-gradient-to-br from-white to-neutral-50 p-5 rounded-2xl border border-neutral-200 shadow-sm relative overflow-hidden group hover:border-[#D71920] transition">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">VIP Member Savings Given</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#D71920] flex items-center justify-center border border-red-100 shadow-2xs">
              <Crown className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#D71920] tracking-tight">
            {formatINR(metrics.memberSavings)}
          </p>
          <p className="text-[11px] text-neutral-500 mt-2">
            Total discounts distributed to Bachat VIP Members
          </p>
        </div>

        {/* Delivery Fulfillment Rate */}
        <div className="bg-gradient-to-br from-white to-neutral-50 p-5 rounded-2xl border border-neutral-200 shadow-sm relative overflow-hidden group hover:border-[#D71920] transition">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Deliveries Completed</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-2xs">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            {metrics.deliveredCount} <span className="text-sm font-bold text-neutral-400">/ {metrics.totalOrders}</span>
          </p>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-600 mt-2">
            <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-[10px] font-bold">
              {metrics.pendingCount} Pending
            </span>
            <span>• {metrics.outForDeliveryCount} Out for Delivery</span>
          </div>
        </div>

      </div>

      {/* Row 2: Sales Trend Chart & Payment Mode Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Interactive Sales Trend Visualizer */}
        <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-[#111111] uppercase tracking-wider flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#D71920]" />
                Sales & Revenue Trend ({timeframe.toUpperCase()})
              </h3>
              <p className="text-xs text-neutral-500">
                Daily order revenue velocity graph in Bhiwadi
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-[#D71920] bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                Peak: {formatINR(Math.max(...chartBars.map(b => b.revenue)))}
              </span>
            </div>
          </div>

          {/* Dynamic SVG / HTML Bar Chart */}
          <div className="pt-4">
            <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-neutral-200 pb-2">
              {chartBars.map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition duration-200 bg-[#111111] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
                    {formatINR(bar.revenue)}
                  </div>

                  {/* Vertical Bar */}
                  <div
                    className="w-full max-w-[36px] bg-gradient-to-t from-[#D71920] to-[#FF4D4D] rounded-t-lg transition-all duration-500 hover:brightness-110 shadow-2xs cursor-pointer group-hover:scale-y-105 origin-bottom"
                    style={{ height: `${bar.heightPercent}%` }}
                  />

                  {/* Date Label */}
                  <span className="text-[10px] font-semibold text-neutral-500 truncate max-w-[48px] text-center">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Payment Mode & Customer Segment Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Payment Method Split (COD vs UPI) */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
            <h3 className="font-black text-xs text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#D71920]" />
              Payment Mode Breakdown
            </h3>

            {/* Split Visual Progress Bar */}
            <div className="w-full bg-neutral-200 rounded-full h-3 flex overflow-hidden">
              <div
                className="bg-emerald-600 transition-all duration-500"
                style={{ width: `${Math.round((metrics.codRev / (metrics.totalRev || 1)) * 100)}%` }}
                title={`Cash on Delivery: ${formatINR(metrics.codRev)}`}
              />
              <div
                className="bg-[#D71920] transition-all duration-500"
                style={{ width: `${Math.round((metrics.upiRev / (metrics.totalRev || 1)) * 100)}%` }}
                title={`UPI Online: ${formatINR(metrics.upiRev)}`}
              />
            </div>

            {/* Metrics List */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-emerald-700" />
                  <div>
                    <strong className="block text-emerald-950 font-bold text-xs">Cash on Delivery (COD)</strong>
                    <span className="text-[10px] text-emerald-700">{metrics.codOrdersCount} orders ({Math.round((metrics.codRev / (metrics.totalRev || 1)) * 100)}%)</span>
                  </div>
                </div>
                <span className="font-black text-xs text-emerald-800">{formatINR(metrics.codRev)}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#D71920]" />
                  <div>
                    <strong className="block text-red-950 font-bold text-xs">Online UPI / QR</strong>
                    <span className="text-[10px] text-red-700">{metrics.upiOrdersCount} orders ({Math.round((metrics.upiRev / (metrics.totalRev || 1)) * 100)}%)</span>
                  </div>
                </div>
                <span className="font-black text-xs text-[#D71920]">{formatINR(metrics.upiRev)}</span>
              </div>
            </div>
          </div>

          {/* Member vs Regular Customer Spending */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
            <h3 className="font-black text-xs text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-yellow-500" />
              Member vs Regular Revenue
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                <span className="text-neutral-600 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-yellow-500" /> VIP Member Sales:
                </span>
                <span className="font-bold text-[#D71920]">{formatINR(metrics.memberRev)} ({metrics.memberOrdersCount} orders)</span>
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                <span className="text-neutral-600 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-neutral-400" /> Regular Shopper Sales:
                </span>
                <span className="font-bold text-[#111111]">{formatINR(metrics.regularRev)} ({metrics.regularOrdersCount} orders)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Row 3: Top Selling Grocery Items Leaderboard & Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Top Selling Products Leaderboard */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-[#111111] uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-[#D71920]" />
                Top-Selling Grocery Items
              </h3>
              <p className="text-xs text-neutral-500">
                Ranked by gross sales volume and units delivered
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F7] text-neutral-600 border-b border-neutral-200 text-[11px]">
                <tr>
                  <th className="p-2.5">Rank & Product</th>
                  <th className="p-2.5 text-center">Units Sold</th>
                  <th className="p-2.5 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {topProducts.length > 0 ? (
                  topProducts.map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50 transition">
                      <td className="p-2.5 flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-cover border border-neutral-200 bg-white"
                        />
                        <div>
                          <strong className="block text-xs text-[#111111] line-clamp-1">{item.name}</strong>
                          <span className="text-[10px] text-neutral-400">{item.unit}</span>
                        </div>
                      </td>
                      <td className="p-2.5 text-center font-bold text-[#111111]">
                        <span className="bg-neutral-100 px-2 py-0.5 rounded text-xs">
                          {item.qty} units
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-black text-[#D71920]">
                        {formatINR(item.revenue)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-neutral-400 text-xs">
                      No product sales recorded in this timeframe.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 Cols: Category Distribution & Top Bhiwadi Delivery Sectors */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Category Distribution */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
            <h3 className="font-black text-xs text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-[#D71920]" />
              Category Sales Share
            </h3>

            <div className="space-y-2.5 pt-1">
              {categoryBreakdown.map((cat, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-[#111111]">{cat.name} ({cat.count} items)</span>
                    <span className="font-black text-[#D71920]">{formatINR(cat.revenue)} ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.barWidth}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Bhiwadi Delivery Sectors */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
            <h3 className="font-black text-xs text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#D71920]" />
              Top Bhiwadi Delivery Sectors
            </h3>

            <div className="space-y-2 text-xs">
              {deliveryLocations.map((loc, idx) => (
                <div key={idx} className="p-2 bg-[#F7F7F7] rounded-xl flex items-center justify-between">
                  <span className="font-medium text-[#111111]">{loc.area}</span>
                  <span className="font-bold text-[#D71920] bg-white px-2 py-0.5 rounded border border-neutral-200 text-[11px]">
                    {loc.count} deliveries
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
