import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  Shield,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings as SettingsIcon,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  CheckCircle,
  Clock,
  Search,
  Sparkles,
  DollarSign,
  AlertTriangle,
  X,
  Phone,
  ArrowLeft,
  MessageCircle,
  MessageSquare,
  CheckSquare,
  Send,
  Filter,
  ShieldCheck,
  FileCheck,
  RefreshCw,
  AlertCircle,
  UserCheck,
  UserX,
  Eye,
  Info,
  Image as ImageIcon,
  User,
  MapPin,
  Calendar,
  CreditCard,
  Receipt,
  History,
  Mail,
  ExternalLink,
  ChevronRight,
  Crown,
  Check,
  Award,
  Banknote,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import SalesAnalytics from './SalesAnalytics';

const presetHeroImages = [
  { label: 'Fresh Vegetables & Grocery Basket', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Spices, Pulses & Dry Fruits', url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80' },
  { label: 'Dairy, Desi Ghee & Edible Oils', url: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=800&auto=format&fit=crop&q=80' },
  { label: 'Supermarket Produce Aisle', url: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop&q=80' },
  { label: 'Fresh Fruits & Juices', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=80' }
];

export default function AdminPortal() {
  const {
    products,
    categories,
    settings,
    heroSlides,
    membershipPlans,
    updateMembershipPlan,
    fetchMembershipPlans,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    fetchHeroSlides,
    updateStoreSettings,
    showToast,
    setCurrentView
  } = useStore();

  const { user, isAdmin, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'products' | 'orders' | 'customers' | 'memberships' | 'hero-slider' | 'whatsapp-compliance' | 'whatsapp-templates' | 'whatsapp-campaigns' | 'settings'
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // VIP Memberships & Approval Queue State
  const [membershipRequests, setMembershipRequests] = useState([]);
  const [membershipReqFilter, setMembershipReqFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  const [membershipReqSearch, setMembershipReqSearch] = useState('');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({
    name: '',
    duration: '',
    durationMonths: null,
    price: '',
    mrp: '',
    badge: '',
    description: '',
    isPopular: false,
    isActive: true
  });

  // Customer Profile & History Modal State
  const [isCustomerProfileModalOpen, setIsCustomerProfileModalOpen] = useState(false);
  const [selectedCustomerProfile, setSelectedCustomerProfile] = useState(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState('ALL'); // 'ALL' | 'MEMBERS' | 'REGULAR'
  const [profileLoading, setProfileLoading] = useState(false);

  // WhatsApp Compliance & Templates State
  const [complianceStats, setComplianceStats] = useState(null);
  const [consentsList, setConsentsList] = useState([]);
  const [deletionRequests, setDeletionRequests] = useState([]);
  const [consentSearch, setConsentSearch] = useState('');
  const [consentFilter, setConsentFilter] = useState('ALL');

  // WhatsApp Templates State
  const [templates, setTemplates] = useState([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    category: 'UTILITY',
    language: 'en',
    message: '',
    status: 'Approved',
    variables: []
  });

  // Campaign Simulator State
  const [simTemplateId, setSimTemplateId] = useState('');
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Product Form Modal State (for Add or Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    category: 'grocery',
    unit: '1 kg',
    mrp: '',
    normalPrice: '',
    memberPrice: '',
    stock: '50',
    image: '',
    description: '',
    isFeatured: false,
    isDealOfDay: false
  });

  // Dynamic Category Creation State in Product Modal
  const [showAddCategoryInline, setShowAddCategoryInline] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Hero Slider Form Modal State
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [editingHeroSlide, setEditingHeroSlide] = useState(null);
  const [heroForm, setHeroForm] = useState({
    title: '',
    image: presetHeroImages[0].url,
    badgeText: 'Zyada Kharido, Zyada Bachao',
    productName: '',
    mrp: '',
    normalPrice: '',
    memberPrice: '',
    order: 1,
    isActive: true
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState(settings);

  // Load Admin Stats & Orders & Customers & Compliance & Membership Requests
  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes, custRes, compRes, tplRes, delRes, memReqRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/orders'),
        fetch('/api/customers'),
        fetch('/api/admin/whatsapp-compliance'),
        fetch('/api/admin/whatsapp-templates'),
        fetch('/api/admin/data-deletion'),
        fetch('/api/admin/membership/requests')
      ]);

      const [statsData, ordersData, custData, compData, tplData, delData, memReqData] = await Promise.all([
        statsRes.json(),
        ordersRes.json(),
        custRes.json(),
        compRes.json(),
        tplRes.json(),
        delRes.json(),
        memReqRes.json()
      ]);

      if (statsData.success) setStats(statsData.stats);
      if (ordersData.success) setOrders(ordersData.orders);
      if (custData.success) setCustomers(custData.customers);
      if (compData.success) {
        setComplianceStats(compData.stats);
        setConsentsList(compData.consents || []);
      }
      if (tplData.success) {
        setTemplates(tplData.templates || []);
        if (tplData.templates?.length > 0 && !simTemplateId) {
          setSimTemplateId(tplData.templates[0].id);
        }
      }
      if (delData.success) setDeletionRequests(delData.requests || []);
      if (memReqData.success) setMembershipRequests(memReqData.requests || []);
      if (fetchMembershipPlans) fetchMembershipPlans();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [activeTab]);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Product Add / Edit Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setShowAddCategoryInline(false);
    setNewCatName('');
    setNewCatIcon('📦');
    setProductForm({
      name: '',
      brand: 'Bachat Bazar',
      category: categories.length > 0 ? categories[0].id : 'grocery',
      unit: '1 kg',
      mrp: '',
      normalPrice: '',
      memberPrice: '',
      stock: '50',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      description: '',
      isFeatured: false,
      isDealOfDay: false
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setShowAddCategoryInline(false);
    setNewCatName('');
    setNewCatIcon('📦');
    setProductForm({
      name: prod.name,
      brand: prod.brand,
      category: prod.category,
      unit: prod.unit,
      mrp: String(prod.mrp),
      normalPrice: String(prod.normalPrice),
      memberPrice: String(prod.memberPrice),
      stock: String(prod.stock),
      image: prod.image,
      description: prod.description || '',
      isFeatured: Boolean(prod.isFeatured),
      isDealOfDay: Boolean(prod.isDealOfDay)
    });
    setIsProductModalOpen(true);
  };

  const handleCreateNewCategory = async (e) => {
    if (e) e.preventDefault();
    if (!newCatName.trim()) {
      showToast('Please enter category name', 'warning');
      return;
    }
    setIsCreatingCategory(true);
    try {
      const created = await addCategory({
        name: newCatName.trim(),
        icon: newCatIcon || '📦'
      });
      if (created) {
        setProductForm(prev => ({ ...prev, category: created.id }));
        setNewCatName('');
        setShowAddCategoryInline(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.normalPrice || !productForm.memberPrice) {
      showToast('Please fill all required price and name fields', 'error');
      return;
    }

    if (editingProduct) {
      const ok = await updateProduct(editingProduct.id, productForm);
      if (ok) setIsProductModalOpen(false);
    } else {
      const ok = await addProduct(productForm);
      if (ok) setIsProductModalOpen(false);
    }
    loadAdminData();
  };

  // Order Status Update Handler
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        loadAdminData();
      }
    } catch (err) {
      showToast('Error updating status', 'error');
    }
  };

  // Customer Membership Toggle Handler
  const handleToggleCustomerMembership = async (userId, currentStatus) => {
    try {
      const res = await fetch('/api/auth/membership/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, activate: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        loadAdminData();
      }
    } catch (err) {
      showToast('Error toggling member status', 'error');
    }
  };

  // VIP Membership Request Approval & Rejection Handlers
  const handleApproveMembershipRequest = async (requestId) => {
    try {
      const res = await fetch(`/api/admin/membership/requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: 'Approved & Activated via Admin Panel' })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'VIP Membership Approved & Activated!', 'success');
        loadAdminData();
      } else {
        showToast(data.message || 'Error approving membership', 'error');
      }
    } catch (err) {
      showToast('Network error approving membership', 'error');
    }
  };

  const handleRejectMembershipRequest = async (requestId) => {
    const reason = window.prompt('Please enter a rejection reason (e.g. Cash payment not received):', 'Cash payment not received at counter');
    if (reason === null) return;

    try {
      const res = await fetch(`/api/admin/membership/requests/${requestId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Membership application rejected', 'info');
        loadAdminData();
      } else {
        showToast(data.message || 'Error rejecting membership', 'error');
      }
    } catch (err) {
      showToast('Network error rejecting membership', 'error');
    }
  };

  // Plan Price & Details Edit Handlers
  const handleOpenEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name || '',
      duration: plan.duration || '',
      durationMonths: plan.durationMonths,
      price: String(plan.price || 0),
      mrp: String(plan.mrp || 0),
      badge: plan.badge || '',
      description: plan.description || '',
      isPopular: Boolean(plan.isPopular),
      isActive: plan.isActive !== false
    });
    setIsPlanModalOpen(true);
  };

  const handlePlanFormSubmit = async (e) => {
    e.preventDefault();
    if (!editingPlan) return;
    if (!planForm.price || Number(planForm.price) <= 0) {
      showToast('Please enter a valid membership price', 'error');
      return;
    }

    const payload = {
      name: planForm.name,
      duration: planForm.duration,
      durationMonths: planForm.durationMonths ? Number(planForm.durationMonths) : null,
      price: Number(planForm.price),
      mrp: Number(planForm.mrp) || Number(planForm.price),
      badge: planForm.badge,
      description: planForm.description,
      isPopular: Boolean(planForm.isPopular),
      isActive: Boolean(planForm.isActive)
    };

    const ok = await updateMembershipPlan(editingPlan.id, payload);
    if (ok) {
      setIsPlanModalOpen(false);
      loadAdminData();
    }
  };

  // Store Settings Save Handler
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const ok = await updateStoreSettings(settingsForm);
    if (ok) showToast('Settings saved successfully', 'success');
  };

  // WhatsApp Consent Status Update Handler
  const handleToggleConsent = async (consent) => {
    try {
      const isMarketing = consent.marketingConsent;
      const res = await fetch('/api/whatsapp/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: consent.userId,
          customerName: consent.customerName,
          phone: consent.phone,
          transactionalConsent: consent.transactionalConsent,
          marketingConsent: !isMarketing,
          consentSource: 'Admin Portal Manual Override'
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Consent status updated', 'success');
        loadAdminData();
      }
    } catch (err) {
      showToast('Error updating consent status', 'error');
    }
  };

  // WhatsApp Data Deletion Request Status Handler
  const handleUpdateDeletionStatus = async (requestId, status, resolutionNotes = '') => {
    try {
      const res = await fetch(`/api/admin/data-deletion/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, resolutionNotes })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        loadAdminData();
      }
    } catch (err) {
      showToast('Error updating deletion request status', 'error');
    }
  };

  // WhatsApp Template Handlers
  const handleOpenAddTemplate = () => {
    setEditingTemplate(null);
    setTemplateForm({
      name: '',
      category: 'UTILITY',
      language: 'en',
      message: 'Namaste {{1}}, your Bachat Bazar order {{2}} has been confirmed! Total amount: {{3}}.',
      status: 'Approved',
      variables: ['Customer Name', 'Order ID', 'Total Amount']
    });
    setIsTemplateModalOpen(true);
  };

  const handleOpenEditTemplate = (tpl) => {
    setEditingTemplate(tpl);
    setTemplateForm({
      name: tpl.name,
      category: tpl.category,
      language: tpl.language || 'en',
      message: tpl.message,
      status: tpl.status || 'Approved',
      variables: tpl.variables || []
    });
    setIsTemplateModalOpen(true);
  };

  const handleTemplateFormSubmit = async (e) => {
    e.preventDefault();
    if (!templateForm.name || !templateForm.message) {
      showToast('Template name and message are required', 'error');
      return;
    }

    try {
      if (editingTemplate) {
        const res = await fetch(`/api/admin/whatsapp-templates/${editingTemplate.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(templateForm)
        });
        const data = await res.json();
        if (data.success) {
          showToast('Template updated', 'success');
          setIsTemplateModalOpen(false);
          loadAdminData();
        }
      } else {
        const res = await fetch('/api/admin/whatsapp-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(templateForm)
        });
        const data = await res.json();
        if (data.success) {
          showToast('Template created', 'success');
          setIsTemplateModalOpen(false);
          loadAdminData();
        }
      }
    } catch (err) {
      showToast('Error saving template', 'error');
    }
  };

  // Campaign Simulator Handler
  const handleSimulateCampaign = async () => {
    if (!simTemplateId) {
      showToast('Please select a template to simulate', 'error');
      return;
    }

    try {
      setSimulating(true);
      const res = await fetch('/api/admin/whatsapp-campaign/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: simTemplateId })
      });
      const data = await res.json();
      if (data.success) {
        setSimulationResult(data);
        showToast('Safety simulation completed', 'success');
      } else {
        showToast(data.message || 'Simulation failed', 'error');
      }
    } catch (err) {
      showToast('Network error running simulation', 'error');
    } finally {
      setSimulating(false);
    }
  };

  // Hero Slider Handlers
  const handleOpenAddHeroSlide = () => {
    setEditingHeroSlide(null);
    setHeroForm({
      title: '',
      image: presetHeroImages[0].url,
      badgeText: 'Zyada Kharido, Zyada Bachao',
      productName: '',
      mrp: '',
      normalPrice: '',
      memberPrice: '',
      order: (heroSlides?.length || 0) + 1,
      isActive: true
    });
    setIsHeroModalOpen(true);
  };

  const handleOpenEditHeroSlide = (slide) => {
    setEditingHeroSlide(slide);
    setHeroForm({
      title: slide.title || '',
      image: slide.image || '',
      badgeText: slide.badgeText || '',
      productName: slide.productName || '',
      mrp: slide.mrp !== undefined && slide.mrp !== null ? String(slide.mrp) : '',
      normalPrice: slide.normalPrice !== undefined && slide.normalPrice !== null ? String(slide.normalPrice) : '',
      memberPrice: slide.memberPrice !== undefined && slide.memberPrice !== null ? String(slide.memberPrice) : '',
      order: slide.order || 1,
      isActive: slide.isActive !== false
    });
    setIsHeroModalOpen(true);
  };

  const handleHeroFormSubmit = async (e) => {
    e.preventDefault();
    if (!heroForm.image) {
      showToast('Image URL is required', 'error');
      return;
    }

    const payload = {
      title: heroForm.title || 'Bachat Bazar Offer',
      image: heroForm.image,
      badgeText: heroForm.badgeText || 'Zyada Kharido, Zyada Bachao',
      productName: heroForm.productName || '',
      mrp: heroForm.mrp ? Number(heroForm.mrp) : 0,
      normalPrice: heroForm.normalPrice ? Number(heroForm.normalPrice) : 0,
      memberPrice: heroForm.memberPrice ? Number(heroForm.memberPrice) : 0,
      order: Number(heroForm.order) || 1,
      isActive: Boolean(heroForm.isActive)
    };

    if (editingHeroSlide) {
      const ok = await updateHeroSlide(editingHeroSlide.id, payload);
      if (ok) {
        setIsHeroModalOpen(false);
        fetchHeroSlides();
      }
    } else {
      const ok = await addHeroSlide(payload);
      if (ok) {
        setIsHeroModalOpen(false);
        fetchHeroSlides();
      }
    }
  };

  const handleDeleteHeroSlide = async (slideId) => {
    if (window.confirm('Are you sure you want to delete this Hero Slide?')) {
      await deleteHeroSlide(slideId);
      fetchHeroSlides();
    }
  };

  const handleToggleHeroActive = async (slide) => {
    await updateHeroSlide(slide.id, {
      ...slide,
      isActive: !slide.isActive
    });
    fetchHeroSlides();
  };

  // Customer Profile & History View Handler
  const handleViewCustomerProfile = async (customerOrId) => {
    try {
      setProfileLoading(true);
      setIsCustomerProfileModalOpen(true);
      const targetId = typeof customerOrId === 'object' ? (customerOrId.id || customerOrId.phone) : customerOrId;
      
      const res = await fetch(`/api/customers/${targetId}`);
      const data = await res.json();
      
      if (data.success && data.customer) {
        setSelectedCustomerProfile(data.customer);
      } else if (typeof customerOrId === 'object') {
        const userOrders = orders.filter(o => o.customer?.id === customerOrId.id || o.customer?.phone === customerOrId.phone);
        setSelectedCustomerProfile({
          ...customerOrId,
          orders: userOrders
        });
      }
    } catch (err) {
      if (typeof customerOrId === 'object') {
        const userOrders = orders.filter(o => o.customer?.id === customerOrId.id || o.customer?.phone === customerOrId.phone);
        setSelectedCustomerProfile({
          ...customerOrId,
          orders: userOrders
        });
      } else {
        showToast('Failed to load customer profile', 'error');
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // Filtered Customers for Members Tab
  const filteredCustomers = (customers || []).filter(c => {
    if (!c) return false;
    const matchQuery =
      c.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone?.includes(customerSearch) ||
      c.memberId?.toLowerCase().includes(customerSearch.toLowerCase());

    if (!matchQuery) return false;
    if (customerFilter === 'MEMBERS') return c.isMember;
    if (customerFilter === 'REGULAR') return !c.isMember;
    return true;
  });

  // Filtered Membership Applications for Queue Tab
  const pendingMembershipRequestsCount = (membershipRequests || []).filter(r => r && r.status === 'PENDING_APPROVAL').length;
  const filteredMembershipRequests = (membershipRequests || []).filter(req => {
    if (!req) return false;
    const matchQuery =
      req.customerName?.toLowerCase().includes(membershipReqSearch.toLowerCase()) ||
      req.customerPhone?.includes(membershipReqSearch) ||
      req.planName?.toLowerCase().includes(membershipReqSearch.toLowerCase()) ||
      req.id?.toLowerCase().includes(membershipReqSearch.toLowerCase());

    if (!matchQuery) return false;
    if (membershipReqFilter === 'PENDING') return req.status === 'PENDING_APPROVAL';
    if (membershipReqFilter === 'APPROVED') return req.status === 'APPROVED';
    if (membershipReqFilter === 'REJECTED') return req.status === 'REJECTED';
    return true;
  });

  // Filtered Consents for Table
  const filteredConsents = (consentsList || []).filter(c => {
    if (!c) return false;
    const matchQuery =
      c.customerName?.toLowerCase().includes(consentSearch.toLowerCase()) ||
      c.phone?.includes(consentSearch);

    if (!matchQuery) return false;

    if (consentFilter === 'MARKETING') return c.marketingConsent && c.status !== 'OPTED_OUT';
    if (consentFilter === 'TRANSACTIONAL') return c.transactionalConsent && !c.marketingConsent && c.status !== 'OPTED_OUT';
    if (consentFilter === 'OPTED_OUT') return c.status === 'OPTED_OUT';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Admin Navigation Header */}
        <div className="bg-[#111111] text-white p-5 rounded-2xl shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border border-neutral-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setCurrentView('home');
              }}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition cursor-pointer"
              title="Return to Storefront"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#D71920]" />
                <h1 className="text-lg font-black text-white">Bachat Bazar Admin Control</h1>
              </div>
              <p className="text-xs text-neutral-400">Store Management • WhatsApp OTP Authenticated (+91 7073222340)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logout();
                window.history.pushState({}, '', '/admin');
                setCurrentView('admin');
                showToast('Admin logged out successfully', 'info');
              }}
              className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Log Out Admin
            </button>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex items-center flex-wrap gap-1.5 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-[#D71920] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'analytics' ? 'bg-[#D71920] text-white shadow-sm' : 'text-emerald-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sales Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'products' ? 'bg-[#D71920] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Products ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'orders' ? 'bg-[#D71920] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Orders ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'customers' ? 'bg-[#D71920] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Customer Directory
            </button>

            {/* NEW: Dedicated VIP Memberships & Approvals Tab */}
            <button
              onClick={() => setActiveTab('memberships')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'memberships' ? 'bg-[#D71920] text-white shadow-sm' : 'text-amber-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-yellow-400" />
              <span>VIP Memberships</span>
              {pendingMembershipRequestsCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                  {pendingMembershipRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('hero-slider')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'hero-slider' ? 'bg-[#D71920] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Hero Slider ({heroSlides?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('whatsapp-compliance')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'whatsapp-compliance' ? 'bg-[#D71920] text-white' : 'text-emerald-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              WhatsApp Compliance
            </button>

            <button
              onClick={() => setActiveTab('whatsapp-templates')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'whatsapp-templates' ? 'bg-[#D71920] text-white' : 'text-amber-400 hover:text-white'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              Templates
            </button>

            <button
              onClick={() => setActiveTab('whatsapp-campaigns')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'whatsapp-campaigns' ? 'bg-[#D71920] text-white' : 'text-red-400 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              Campaign Safety
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'settings' ? 'bg-[#D71920] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              Store Settings
            </button>
          </div>
        </div>

        {/* TAB 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* 4 Analytics Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-black text-[#111111]">{formatINR(stats?.totalRevenue || 0)}</p>
                <p className="text-[11px] text-neutral-400 mt-1">Processed grocery orders</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                  <ShoppingBag className="w-5 h-5 text-[#D71920]" />
                </div>
                <p className="text-2xl font-black text-[#111111]">{stats?.totalOrders || orders.length}</p>
                <p className="text-[11px] text-neutral-400 mt-1">Direct home deliveries</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Members</span>
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-2xl font-black text-[#D71920]">{stats?.activeMembers || 0}</p>
                <p className="text-[11px] text-neutral-400 mt-1">Registered VIP shoppers</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Member Savings Given</span>
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-black text-emerald-600">{formatINR(stats?.totalMemberSavingsGiven || 0)}</p>
                <p className="text-[11px] text-neutral-400 mt-1">Discounts provided to members</p>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left: Recent Orders */}
              <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm text-[#111111] uppercase tracking-wider">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-[#D71920] hover:underline cursor-pointer">
                    View All Orders →
                  </button>
                </div>

                <div className="divide-y divide-neutral-100 text-xs">
                  {orders.slice(0, 5).map((ord) => (
                    <div key={ord.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#111111]">#{ord.id} • {ord.customer?.name}</p>
                        <p className="text-neutral-500 text-[11px]">{ord.items?.length} items • {formatDate(ord.date)}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-black text-[#D71920]">{formatINR(ord.total)}</p>
                          <p className="text-[10px] text-neutral-500">{ord.paymentMethod}</p>
                        </div>

                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-[#F7F7F7] border border-neutral-300 rounded-lg px-2 py-1 text-xs font-bold outline-none cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Quick Store Operations & Analytics Shortcut */}
              <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                <h3 className="font-black text-sm text-[#111111] uppercase tracking-wider">Store Operations</h3>
                
                <button
                  onClick={handleOpenAddProduct}
                  className="w-full py-3 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold text-xs rounded-xl transition shadow-red-glow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>View Full Sales Analytics →</span>
                </button>

                <div className="p-4 bg-[#F7F7F7] rounded-xl border border-neutral-200 space-y-2 text-xs">
                  <p className="font-bold text-[#111111]">Bhiwadi Store Info</p>
                  <p className="text-neutral-600 text-[11px]">{settings.address}</p>
                  <p className="text-neutral-600 text-[11px]">Helpline: <strong>{settings.phone}</strong></p>
                  <p className="text-neutral-600 text-[11px]">Free Delivery: <strong>Above ₹{settings.freeDeliveryThreshold}</strong></p>
                </div>
              </div>

            </div>

            {/* Embedded Live Sales Analytics Suite in Dashboard */}
            <SalesAnalytics
              orders={orders}
              products={products}
              customers={customers}
              stats={stats}
            />

          </div>
        )}

        {/* TAB: Dedicated Sales Analytics View */}
        {activeTab === 'analytics' && (
          <SalesAnalytics
            orders={orders}
            products={products}
            customers={customers}
            stats={stats}
          />
        )}

        {/* TAB 2: Products Manager (CRUD) */}
        {activeTab === 'products' && (
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-[#111111] uppercase tracking-wider">Product Inventory ({products.length})</h3>
                <p className="text-xs text-neutral-500">Configure MRP, Normal Price, and Red Member Price</p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-neutral-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F7F7] text-neutral-600 border-b border-neutral-200 text-[11px]">
                  <tr>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Unit</th>
                    <th className="p-3 text-right">MRP</th>
                    <th className="p-3 text-right">Normal Price</th>
                    <th className="p-3 text-right text-[#D71920] font-bold">Member Price</th>
                    <th className="p-3 text-center">Stock</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50">
                      <td className="p-3 flex items-center gap-2.5 font-medium text-[#111111]">
                        <img src={p.image} alt={p.name} className="w-9 h-9 object-cover rounded-md border border-neutral-200" />
                        <div>
                          <p className="font-bold">{p.name}</p>
                          <p className="text-[10px] text-neutral-500">{p.brand}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded text-[11px] font-medium text-neutral-800">
                          <span>{categories.find(c => c.id === p.category)?.icon || '📦'}</span>
                          <span>{categories.find(c => c.id === p.category)?.name || p.category}</span>
                        </span>
                      </td>
                      <td className="p-3">{p.unit}</td>
                      <td className="p-3 text-right line-through text-neutral-400">{formatINR(p.mrp)}</td>
                      <td className="p-3 text-right font-bold">{formatINR(p.normalPrice)}</td>
                      <td className="p-3 text-right font-black text-[#D71920] bg-red-50/50">{formatINR(p.memberPrice)}</td>
                      <td className="p-3 text-center font-bold">{p.stock}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 text-neutral-600 hover:text-[#D71920] rounded hover:bg-neutral-100"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Orders Manager */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-black text-[#111111] uppercase tracking-wider">Customer Orders ({orders.length})</h3>
              <p className="text-xs text-neutral-500">Live order fulfillment and delivery dispatch</p>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="border border-neutral-200 rounded-xl p-4 bg-[#F7F7F7] space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-200">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#111111]">Order #{ord.id}</span>
                      <span className="text-neutral-500 text-[11px] block">{formatDate(ord.date)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm font-black text-[#D71920]">{formatINR(ord.total)}</span>
                        <span className="text-[11px] text-neutral-500 block">{ord.paymentMethod} ({ord.paymentStatus})</span>
                      </div>

                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:border-[#D71920]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="font-bold text-[#111111] mb-1">Customer & Delivery Details:</p>
                      <p className="text-neutral-700">
                        {ord.customer?.name} ({ord.customer?.phone})<br />
                        {ord.shippingAddress?.house}, {ord.shippingAddress?.area}, {ord.shippingAddress?.city} ({ord.shippingAddress?.pincode})
                      </p>
                      {ord.customer?.isMember && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-[#D71920] bg-red-100 px-2 py-0.5 rounded">
                          ★ VIP Member Order (Saved {formatINR(ord.memberSavings)})
                        </span>
                      )}

                      {/* 1-Click Customer Profile & History Button in Order */}
                      <div className="pt-2">
                        <button
                          onClick={() => handleViewCustomerProfile(ord.customer)}
                          className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-300 hover:border-[#D71920] text-neutral-800 hover:text-[#D71920] text-[11px] font-bold rounded-lg transition inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 text-[#D71920]" />
                          <span>Customer Profile & History</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-[#111111] mb-1">Items:</p>
                      <ul className="space-y-1 text-neutral-600">
                        {ord.items?.map((it, idx) => (
                          <li key={idx}>• {it.name} ({it.unit}) × {it.quantity} = {formatINR(it.appliedPrice * it.quantity)}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Customers & Membership Manager */}
        {activeTab === 'customers' && (
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-[#111111] uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#D71920]" />
                  Customer Directory & VIP Members ({filteredCustomers.length})
                </h3>
                <p className="text-xs text-neutral-500">
                  Customer profiles, addresses, total lifetime spent, member savings aur complete order history ek click mein dekhein.
                </p>
              </div>

              {/* Search & Filters */}
              <div className="flex items-center flex-wrap gap-2 text-xs">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Search name, phone, or member ID..."
                    className="pl-8 pr-3 py-1.5 bg-[#F7F7F7] border border-neutral-300 rounded-lg text-xs outline-none focus:border-[#D71920] w-56 sm:w-64"
                  />
                </div>

                <div className="flex items-center bg-[#F7F7F7] p-1 rounded-lg border border-neutral-300">
                  <button
                    onClick={() => setCustomerFilter('ALL')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                      customerFilter === 'ALL' ? 'bg-[#111111] text-white' : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    All ({customers.length})
                  </button>
                  <button
                    onClick={() => setCustomerFilter('MEMBERS')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                      customerFilter === 'MEMBERS' ? 'bg-[#D71920] text-white' : 'text-neutral-600 hover:text-[#D71920]'
                    }`}
                  >
                    ★ Members ({customers.filter(c => c.isMember).length})
                  </button>
                  <button
                    onClick={() => setCustomerFilter('REGULAR')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                      customerFilter === 'REGULAR' ? 'bg-neutral-300 text-neutral-900' : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    Regular ({customers.filter(c => !c.isMember).length})
                  </button>
                </div>
              </div>
            </div>

            {/* Customers Table */}
            <div className="overflow-x-auto border border-neutral-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F7F7] text-neutral-600 border-b border-neutral-200 text-[11px]">
                  <tr>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Phone & WhatsApp</th>
                    <th className="p-3">VIP Membership</th>
                    <th className="p-3 text-center">Orders</th>
                    <th className="p-3 text-right">Total Spent</th>
                    <th className="p-3 text-right">VIP Savings</th>
                    <th className="p-3 text-center">One-Click Profile & History</th>
                    <th className="p-3 text-center">Status Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((c) => (
                      <tr key={c.id} className="hover:bg-neutral-50 transition">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <strong className="text-xs text-[#111111] block">{c.name}</strong>
                              <span className="text-[11px] text-neutral-400 block">{c.email || 'No email provided'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono">
                          <span className="text-[#111111] font-semibold block">{c.phone}</span>
                          <a
                            href={`https://wa.me/91${c.phone.replace(/\D/g, '')}?text=Namaste%20${encodeURIComponent(c.name || 'Customer')},%20Bachat%20Bazar%20Bhiwadi%20se...`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold inline-flex items-center gap-1 mt-0.5"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp Chat</span>
                          </a>
                        </td>
                        <td className="p-3">
                          {c.isMember ? (
                            <div>
                              <span className="bg-red-100 text-[#D71920] font-bold text-[10px] px-2 py-0.5 rounded inline-block border border-red-200">
                                ★ VIP Member
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                                ID: {c.memberId || 'BB-MEM'}
                              </span>
                            </div>
                          ) : (
                            <span className="bg-neutral-100 text-neutral-500 text-[10px] px-2 py-0.5 rounded inline-block">
                              Regular Customer
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <span className="font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded text-xs">
                            {c.orderCount || 0}
                          </span>
                        </td>
                        <td className="p-3 text-right font-black text-[#111111]">
                          {formatINR(c.totalSpend || 0)}
                        </td>
                        <td className="p-3 text-right font-bold text-emerald-600">
                          {formatINR(c.totalSavings || 0)}
                        </td>
                        <td className="p-3 text-center">
                          {/* 1-CLICK CUSTOMER PROFILE AND HISTORY BUTTON */}
                          <button
                            onClick={() => handleViewCustomerProfile(c)}
                            className="px-3 py-1.5 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-1.5 shadow-xs cursor-pointer transform hover:scale-105"
                          >
                            <User className="w-3.5 h-3.5 text-[#D71920]" />
                            <span>Profile & History</span>
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleCustomerMembership(c.id, c.isMember)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              c.isMember
                                ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'
                                : 'bg-[#D71920] hover:bg-[#B5141A] text-white shadow-xs'
                            }`}
                          >
                            {c.isMember ? 'Deactivate' : 'Activate VIP'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-neutral-500">
                        No customers match your search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: VIP Memberships, 4 Duration Categories & Cash Approval Queue */}
        {activeTab === 'memberships' && (
          <div className="space-y-6">
            
            {/* VIP Top Overview Banner & KPI Metrics */}
            <div className="bg-[#111111] text-white p-6 rounded-2xl border border-neutral-800 shadow-md relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Crown className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-xl font-black text-white">VIP Club Memberships & Approvals</h2>
                  </div>
                  <p className="text-xs text-neutral-300 mt-1 max-w-2xl">
                    1 Year, 2 Years, 3 Years aur Lifetime VIP Plans ki pricing dynamically manage karein. Customer Cash/UPI applications ko verify karke 1-click mein approve/activate ya deactivate karein.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={loadAdminData}
                    className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 border border-neutral-700 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#D71920]" />
                    <span>Refresh Queue</span>
                  </button>
                </div>
              </div>

              {/* 4 Summary Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-neutral-800 text-xs">
                <div className="bg-neutral-900/90 p-3.5 rounded-xl border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Pending Approvals</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-amber-400">{pendingMembershipRequestsCount}</span>
                    <Clock className="w-5 h-5 text-amber-400/60" />
                  </div>
                  <span className="text-[10px] text-neutral-400 block mt-1">Cash / UPI pending verification</span>
                </div>

                <div className="bg-neutral-900/90 p-3.5 rounded-xl border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Active VIP Members</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-emerald-400">{customers.filter(c => c.isMember).length}</span>
                    <Sparkles className="w-5 h-5 text-emerald-400/60" />
                  </div>
                  <span className="text-[10px] text-neutral-400 block mt-1">Enjoying 2-tier VIP pricing</span>
                </div>

                <div className="bg-neutral-900/90 p-3.5 rounded-xl border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Lifetime Club Members</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-purple-400">
                      {customers.filter(c => c.isMember && c.membershipPlan?.includes('Lifetime')).length || 1}
                    </span>
                    <Crown className="w-5 h-5 text-purple-400/60" />
                  </div>
                  <span className="text-[10px] text-neutral-400 block mt-1">₹5,999 Lifetime VIP access</span>
                </div>

                <div className="bg-neutral-900/90 p-3.5 rounded-xl border border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Configured Plans</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-white">{membershipPlans?.length || 4}</span>
                    <Award className="w-5 h-5 text-neutral-400" />
                  </div>
                  <span className="text-[10px] text-neutral-400 block mt-1">1 Yr, 2 Yrs, 3 Yrs, Lifetime</span>
                </div>
              </div>
            </div>

            {/* SECTION 1: 4 Membership Duration Categories & Dynamic Pricing Manager */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-[#111111] uppercase tracking-wider flex items-center gap-2">
                    <Crown className="w-5 h-5 text-[#D71920]" />
                    4 Duration Categories & Dynamic Pricing Manager
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Prices hard-coded nahi hain. Aap yahan se 1 Year, 2 Years, 3 Years aur Lifetime Plans ka price upar-niche (edit) kar sakte hain. Changes storefront par turant dikhenge.
                  </p>
                </div>
              </div>

              {/* Dynamic Price Alert Callout */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-900 font-bold">Dynamic Pricing Live Notice:</strong>
                  <span>
                    Lifetime VIP Club base price ₹5,999 set hai. Jab bhi market requirement ke hisab se price badalna ho, "Edit Price" button daba kar naya price save karein.
                  </span>
                </div>
              </div>

              {/* 4 Plan Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {membershipPlans && membershipPlans.length > 0 ? (
                  membershipPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`border rounded-2xl p-4.5 flex flex-col justify-between transition hover:shadow-md relative bg-white ${
                        plan.id === 'plan-lifetime'
                          ? 'border-[#D71920] bg-red-50/20 ring-1 ring-[#D71920]/20'
                          : 'border-neutral-200'
                      }`}
                    >
                      {/* Top Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          plan.id === 'plan-lifetime'
                            ? 'bg-[#D71920] text-white shadow-xs'
                            : 'bg-neutral-900 text-white'
                        }`}>
                          {plan.badge || plan.duration}
                        </span>
                        
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          plan.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-600'
                        }`}>
                          {plan.isActive !== false ? '● Active' : '○ Disabled'}
                        </span>
                      </div>

                      {/* Plan Content */}
                      <div className="space-y-2">
                        <h4 className="font-black text-sm text-[#111111] line-clamp-1">
                          {plan.name}
                        </h4>

                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="text-2xl font-black text-[#D71920]">
                            {formatINR(plan.price)}
                          </span>
                          {plan.mrp && plan.mrp > plan.price && (
                            <span className="text-xs text-neutral-400 line-through">
                              {formatINR(plan.mrp)}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                          {plan.description || 'VIP member rates on all grocery items'}
                        </p>

                        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                          <span>Duration:</span>
                          <strong className="text-neutral-800">
                            {plan.durationMonths ? `${plan.durationMonths} Months (${plan.duration})` : 'Lifetime Access'}
                          </strong>
                        </div>
                      </div>

                      {/* Edit Button */}
                      <div className="pt-4 mt-3 border-t border-neutral-100">
                        <button
                          onClick={() => handleOpenEditPlan(plan)}
                          className="w-full py-2 px-3 bg-neutral-900 hover:bg-[#D71920] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Plan Price & Details</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 text-center py-8 text-neutral-500 text-xs">
                    Loading membership plans...
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2: Customer Membership Applications Approval Queue */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-[#111111] uppercase tracking-wider flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-[#D71920]" />
                    Customer Membership Approval Queue ({filteredMembershipRequests.length})
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Customer ne Cash (Counter / Doorstep) ya UPI mode select karke apply kiya hai. Cash verify karke Approve & Activate button dabayein.
                  </p>
                </div>

                {/* Search & Filter Controls */}
                <div className="flex items-center flex-wrap gap-2 text-xs">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={membershipReqSearch}
                      onChange={(e) => setMembershipReqSearch(e.target.value)}
                      placeholder="Search customer, phone, plan..."
                      className="pl-8 pr-3 py-1.5 bg-[#F7F7F7] border border-neutral-300 rounded-lg text-xs outline-none focus:border-[#D71920] w-52 sm:w-60"
                    />
                  </div>

                  <div className="flex items-center bg-[#F7F7F7] p-1 rounded-lg border border-neutral-300">
                    <button
                      onClick={() => setMembershipReqFilter('ALL')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                        membershipReqFilter === 'ALL' ? 'bg-[#111111] text-white' : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      All ({membershipRequests.length})
                    </button>
                    <button
                      onClick={() => setMembershipReqFilter('PENDING')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                        membershipReqFilter === 'PENDING' ? 'bg-[#D71920] text-white' : 'text-neutral-600 hover:text-[#D71920]'
                      }`}
                    >
                      Pending ({pendingMembershipRequestsCount})
                    </button>
                    <button
                      onClick={() => setMembershipReqFilter('APPROVED')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                        membershipReqFilter === 'APPROVED' ? 'bg-emerald-600 text-white' : 'text-neutral-600 hover:text-emerald-700'
                      }`}
                    >
                      Approved ({membershipRequests.filter(r => r.status === 'APPROVED').length})
                    </button>
                    <button
                      onClick={() => setMembershipReqFilter('REJECTED')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                        membershipReqFilter === 'REJECTED' ? 'bg-neutral-800 text-white' : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      Rejected ({membershipRequests.filter(r => r.status === 'REJECTED').length})
                    </button>
                  </div>
                </div>
              </div>

              {/* Applications Approval Queue Table */}
              <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F7] text-neutral-600 border-b border-neutral-200 text-[11px]">
                    <tr>
                      <th className="p-3">Customer Info</th>
                      <th className="p-3">Applied Plan Tier</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment Mode & Collection</th>
                      <th className="p-3">Applied On</th>
                      <th className="p-3">Application Status</th>
                      <th className="p-3 text-center">Customer History</th>
                      <th className="p-3 text-center">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredMembershipRequests.length > 0 ? (
                      filteredMembershipRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-neutral-50 transition">
                          {/* Customer Info */}
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                {req.customerName ? req.customerName.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <strong className="text-xs text-[#111111] block">{req.customerName}</strong>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-[11px] text-neutral-600">{req.customerPhone}</span>
                                  <a
                                    href={`https://wa.me/91${req.customerPhone?.replace(/\D/g, '')}?text=Namaste%20${encodeURIComponent(req.customerName || 'Customer')},%20Bachat%20Bazar%20membership%20application%20ke%20sambandh%20mein...`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold inline-flex items-center gap-0.5"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>Chat</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Applied Plan */}
                          <td className="p-3">
                            <div className="space-y-0.5">
                              <strong className="text-[#111111] block text-xs">{req.planName}</strong>
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded inline-block ${
                                req.planDuration === 'Lifetime' ? 'bg-purple-100 text-purple-800' : 'bg-neutral-100 text-neutral-700'
                              }`}>
                                {req.planDuration}
                              </span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="p-3 font-black text-sm text-[#D71920]">
                            {formatINR(req.planPrice)}
                          </td>

                          {/* Payment Mode */}
                          <td className="p-3">
                            <div className="space-y-1">
                              {req.paymentMethod === 'CASH' ? (
                                <span className="bg-amber-100 text-amber-900 font-bold text-[11px] px-2 py-0.5 rounded inline-flex items-center gap-1 border border-amber-200">
                                  <Banknote className="w-3.5 h-3.5 text-amber-700" />
                                  <span>Cash (Counter / Doorstep)</span>
                                </span>
                              ) : (
                                <span className="bg-blue-100 text-blue-900 font-bold text-[11px] px-2 py-0.5 rounded inline-flex items-center gap-1 border border-blue-200">
                                  <CreditCard className="w-3.5 h-3.5 text-blue-700" />
                                  <span>UPI / Online</span>
                                </span>
                              )}
                              <span className="text-[10px] text-neutral-500 block font-mono">
                                Status: {req.paymentStatus === 'PAID' ? '✓ Payment Received' : '⏳ Pending Collection'}
                              </span>
                            </div>
                          </td>

                          {/* Applied On */}
                          <td className="p-3 font-mono text-neutral-600 text-[11px]">
                            {req.requestedAt ? formatDate(req.requestedAt) : '-'}
                          </td>

                          {/* Application Status */}
                          <td className="p-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block ${
                              req.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse' :
                              req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                              'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              {req.status === 'PENDING_APPROVAL' ? '⏳ Pending Approval' :
                               req.status === 'APPROVED' ? '✓ Approved & Active' : '✗ Rejected'}
                            </span>
                            {req.rejectionReason && (
                              <span className="text-[10px] text-red-600 block mt-0.5 font-medium">
                                Reason: {req.rejectionReason}
                              </span>
                            )}
                          </td>

                          {/* One-Click Profile & History Button */}
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleViewCustomerProfile(req.userId || { id: req.userId, name: req.customerName, phone: req.customerPhone })}
                              className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[11px] rounded-lg transition inline-flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <User className="w-3 h-3 text-[#D71920]" />
                              <span>Profile</span>
                            </button>
                          </td>

                          {/* Admin Action Buttons */}
                          <td className="p-3 text-center">
                            {req.status === 'PENDING_APPROVAL' ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleApproveMembershipRequest(req.id)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 shadow-xs cursor-pointer"
                                  title="Approve membership & activate 2-tier VIP pricing immediately"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve & Activate</span>
                                </button>
                                <button
                                  onClick={() => handleRejectMembershipRequest(req.id)}
                                  className="px-2.5 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-neutral-300 hover:border-red-300 font-bold text-xs rounded-xl transition cursor-pointer"
                                  title="Reject application"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            ) : req.status === 'APPROVED' ? (
                              <div className="text-center">
                                <span className="text-[10px] font-bold text-emerald-700 block">
                                  Member ID: {req.memberId || 'BB-MEM'}
                                </span>
                                <span className="text-[10px] text-neutral-400 font-mono block">
                                  {req.membershipExpiryDate ? `Valid till: ${formatDate(req.membershipExpiryDate)}` : 'Lifetime VIP'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-neutral-400 text-[11px]">No actions available</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-8 text-neutral-500 text-xs">
                          No membership applications match your query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 3: Direct VIP Activation & Deactivation Directory */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-[#111111] uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#D71920]" />
                    Direct Customer VIP Status & Expiry Directory
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Registered users ko direct manually VIP activate ya deactivate karein bina application ke.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F7] text-neutral-600 border-b border-neutral-200 text-[11px]">
                    <tr>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Current VIP Status</th>
                      <th className="p-3">Plan / Validity Expiry</th>
                      <th className="p-3 text-right">VIP Savings</th>
                      <th className="p-3 text-center">1-Click Profile</th>
                      <th className="p-3 text-center">Direct VIP Toggle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-neutral-50 transition">
                        <td className="p-3">
                          <strong className="text-xs text-[#111111] block">{c.name}</strong>
                          <span className="text-[11px] text-neutral-400 block">{c.email || 'No email'}</span>
                        </td>
                        <td className="p-3 font-mono text-[#111111]">{c.phone}</td>
                        <td className="p-3">
                          {c.isMember ? (
                            <span className="bg-red-100 text-[#D71920] font-bold text-[10px] px-2 py-0.5 rounded border border-red-200">
                              ★ VIP Member ({c.memberId || 'BB-MEM'})
                            </span>
                          ) : (
                            <span className="bg-neutral-100 text-neutral-500 text-[10px] px-2 py-0.5 rounded">
                              Regular Shopper
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-[11px] text-neutral-600">
                          {c.isMember ? (
                            c.membershipExpiryDate ? (
                              <span>Expires: {formatDate(c.membershipExpiryDate)}</span>
                            ) : (
                              <span className="font-bold text-purple-700">★ Lifetime Unlimited</span>
                            )
                          ) : (
                            <span className="text-neutral-400">Not enrolled</span>
                          )}
                        </td>
                        <td className="p-3 text-right font-bold text-emerald-600">
                          {formatINR(c.totalSavings || 0)}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleViewCustomerProfile(c)}
                            className="px-2.5 py-1 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-[11px] rounded-lg transition inline-flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <User className="w-3 h-3 text-[#D71920]" />
                            <span>Profile</span>
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleCustomerMembership(c.id, c.isMember)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              c.isMember
                                ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'
                                : 'bg-[#D71920] hover:bg-[#B5141A] text-white shadow-xs'
                            }`}
                          >
                            {c.isMember ? 'Deactivate VIP' : 'Activate VIP'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB: Hero Slider Manager */}
        {activeTab === 'hero-slider' && (
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-[#111111] uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#D71920]" />
                  Hero Slider & Banner Images ({heroSlides?.length || 0})
                </h3>
                <p className="text-xs text-neutral-500">
                  Website ke top Hero Section ki photos, floating badges aur sample product cards bina code change kiye add, edit ya delete karein.
                </p>
              </div>

              <button
                onClick={handleOpenAddHeroSlide}
                className="px-4 py-2.5 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Hero Slide</span>
              </button>
            </div>

            {/* Quick Helper Banner */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 text-xs text-neutral-600 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111] block mb-0.5">Slider Auto-Rotation & Live Updates:</strong>
                <span>
                  Storefront par Hero Slider automatically har 5 second mein rotate hota hai aur user hover karne par pause hota hai. Jo slides <span className="text-emerald-700 font-bold">Active</span> hain wahi customer ko dikhengi.
                </span>
              </div>
            </div>

            {/* Slides Cards Grid */}
            {heroSlides && heroSlides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {heroSlides.map((slide, idx) => (
                  <div 
                    key={slide.id || idx}
                    className={`border rounded-2xl overflow-hidden bg-white shadow-xs flex flex-col justify-between transition hover:shadow-md ${
                      slide.isActive !== false ? 'border-neutral-200' : 'border-neutral-300 opacity-70 bg-neutral-50'
                    }`}
                  >
                    <div>
                      {/* Image Preview with Badges */}
                      <div className="relative h-48 w-full bg-neutral-100 overflow-hidden border-b border-neutral-200">
                        <img
                          src={slide.image}
                          alt={slide.title || 'Slide Image'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80';
                          }}
                        />

                        {/* Floating Badge on top-right */}
                        {slide.badgeText && (
                          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-neutral-200 shadow-xs">
                            <span className="text-[10px] font-black text-[#D71920]">
                              {slide.badgeText}
                            </span>
                          </div>
                        )}

                        {/* Order Badge on top-left */}
                        <div className="absolute top-2 left-2 bg-[#111111]/80 text-white backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                          #{slide.order || idx + 1}
                        </div>

                        {/* Sample Product Two-Tier Price Preview */}
                        {slide.productName && (
                          <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm rounded-lg p-2 border border-neutral-200 shadow-xs flex items-center justify-between text-[11px]">
                            <div className="truncate pr-1">
                              <span className="text-[9px] font-bold text-neutral-400 block uppercase">Product Tag</span>
                              <strong className="text-[#111111] truncate block">{slide.productName}</strong>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[10px] text-neutral-500 block">
                                Normal: {formatINR(slide.normalPrice)}
                              </span>
                              <span className="text-[10px] font-bold text-[#D71920] bg-red-50 px-1.5 py-0.5 rounded border border-red-200 block">
                                Member: {formatINR(slide.memberPrice)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Content Info */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-[#111111] line-clamp-1">
                            {slide.title || 'Untitled Slide'}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                            slide.isActive !== false 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-neutral-200 text-neutral-600'
                          }`}>
                            {slide.isActive !== false ? '● Live' : '○ Inactive'}
                          </span>
                        </div>

                        <p className="text-[11px] text-neutral-500 font-mono truncate" title={slide.image}>
                          {slide.image}
                        </p>
                      </div>
                    </div>

                    {/* Card Action Controls */}
                    <div className="p-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-2 text-xs">
                      <button
                        onClick={() => handleToggleHeroActive(slide)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                          slide.isActive !== false 
                            ? 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700' 
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {slide.isActive !== false ? 'Hide from Store' : 'Make Active'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditHeroSlide(slide)}
                          className="p-1.5 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-700 rounded-lg transition"
                          title="Edit Slide"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteHeroSlide(slide.id)}
                          className="p-1.5 bg-white hover:bg-red-50 border border-neutral-300 hover:border-red-300 text-red-600 rounded-lg transition"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-2xl p-6">
                <ImageIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="font-bold text-sm text-[#111111]">No Hero Slides Found</p>
                <p className="text-xs text-neutral-500 mt-1 mb-4">Add your first promotional slider banner to customize the storefront.</p>
                <button
                  onClick={handleOpenAddHeroSlide}
                  className="px-4 py-2 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Slide</span>
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 5: Store Settings */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4 text-xs">
            <div>
              <h3 className="text-base font-black text-[#111111] uppercase tracking-wider">Store Details & Configuration</h3>
              <p className="text-xs text-neutral-500">Edit WhatsApp number, store address, and delivery settings</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Store Name</label>
                <input
                  type="text"
                  value={settingsForm.storeName || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Store Tagline</label>
                <input
                  type="text"
                  value={settingsForm.tagline || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Store Physical Address (Bhiwadi)</label>
                <input
                  type="text"
                  value={settingsForm.address || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={settingsForm.phone || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">WhatsApp Number (e.g. 917073222340)</label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Free Delivery Minimum Amount (₹)</label>
                <input
                  type="number"
                  value={settingsForm.freeDeliveryThreshold || 499}
                  onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Delivery Charge Below Minimum (₹)</label>
                <input
                  type="number"
                  value={settingsForm.deliveryCharge || 30}
                  onChange={(e) => setSettingsForm({ ...settingsForm, deliveryCharge: Number(e.target.value) })}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Announcement Banner Text</label>
                <input
                  type="text"
                  value={settingsForm.announcement || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold rounded-xl transition shadow-sm"
              >
                Save All Settings
              </button>
            </div>
          </form>
        )}

        {/* TAB 6: WhatsApp Compliance & Audit Trail */}
        {activeTab === 'whatsapp-compliance' && (
          <div className="space-y-6">
            
            {/* Compliance KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Active Opt-Ins</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xl font-black text-emerald-600">{complianceStats?.totalOptIn || 0}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Valid customer consents</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Marketing Opt-Ins</span>
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xl font-black text-blue-600">{complianceStats?.marketingOptIn || 0}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Promotions & offers eligible</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Transactional Only</span>
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-xl font-black text-purple-600">{complianceStats?.transactionalOptIn || 0}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Order alerts & invoices only</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Opted-Out</span>
                  <UserX className="w-4 h-4 text-[#D71920]" />
                </div>
                <p className="text-xl font-black text-[#D71920]">{complianceStats?.optedOut || 0}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Explicitly unsubscribed</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">No Consent Logged</span>
                  <AlertCircle className="w-4 h-4 text-neutral-400" />
                </div>
                <p className="text-xl font-black text-neutral-600">{complianceStats?.noConsent || 0}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Excluded from all outreach</p>
              </div>
            </div>

            {/* Consent Audit Trail Table */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-[#111111] uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    Customer WhatsApp Consent Audit Trail ({filteredConsents.length})
                  </h3>
                  <p className="text-xs text-neutral-500">Immutable opt-in records logged with source, timestamps, and IP addresses</p>
                </div>

                {/* Filters */}
                <div className="flex items-center flex-wrap gap-2 text-xs">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={consentSearch}
                      onChange={(e) => setConsentSearch(e.target.value)}
                      placeholder="Search name or phone..."
                      className="pl-8 pr-3 py-1.5 bg-[#F7F7F7] border border-neutral-300 rounded-lg text-xs outline-none focus:border-[#D71920] w-48"
                    />
                  </div>

                  <select
                    value={consentFilter}
                    onChange={(e) => setConsentFilter(e.target.value)}
                    className="bg-[#F7F7F7] border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-[#D71920]"
                  >
                    <option value="ALL">All Records</option>
                    <option value="MARKETING">Marketing Opt-In</option>
                    <option value="TRANSACTIONAL">Transactional Only</option>
                    <option value="OPTED_OUT">Opted-Out</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F7] text-neutral-600 border-b border-neutral-200 text-[11px]">
                    <tr>
                      <th className="p-3">Customer & Phone</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Transactional</th>
                      <th className="p-3 text-center">Marketing</th>
                      <th className="p-3">Consent Source & IP</th>
                      <th className="p-3">Last Updated</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredConsents.map((c) => (
                      <tr key={c.id || c.phone} className="hover:bg-neutral-50">
                        <td className="p-3">
                          <p className="font-bold text-[#111111]">{c.customerName || 'Customer'}</p>
                          <p className="font-mono text-neutral-500 text-[11px]">{c.phone}</p>
                        </td>
                        <td className="p-3 text-center">
                          {c.status === 'OPTED_OUT' ? (
                            <span className="bg-red-100 text-[#D71920] font-bold text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <UserX className="w-3 h-3" /> Opted Out
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {c.transactionalConsent ? (
                            <span className="text-emerald-600 font-bold">✓ Granted</span>
                          ) : (
                            <span className="text-neutral-400">✗ No</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {c.marketingConsent ? (
                            <span className="text-blue-600 font-bold">✓ Granted</span>
                          ) : (
                            <span className="text-neutral-400">✗ No</span>
                          )}
                        </td>
                        <td className="p-3 text-neutral-600">
                          <p className="font-medium text-[#111111]">{c.consentSource || 'Web Portal'}</p>
                          <p className="font-mono text-[10px] text-neutral-400">IP: {c.ipAddress || '127.0.0.1'}</p>
                        </td>
                        <td className="p-3 text-neutral-500 text-[11px]">
                          {formatDate(c.timestamp)}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleConsent(c)}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                              c.marketingConsent
                                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                                : 'bg-[#D71920] hover:bg-[#B5141A] text-white'
                            }`}
                          >
                            {c.marketingConsent ? 'Revoke Marketing' : 'Allow Marketing'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Data Deletion Requests Manager */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-[#111111] uppercase tracking-wider flex items-center gap-2">
                    <UserX className="w-5 h-5 text-[#D71920]" />
                    Customer Data Deletion & Grievance Requests ({deletionRequests.length})
                  </h3>
                  <p className="text-xs text-neutral-500">Compliance with DPDP Act 2023 and Meta Privacy Policy</p>
                </div>
              </div>

              <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F7] text-neutral-600 border-b border-neutral-200 text-[11px]">
                    <tr>
                      <th className="p-3">Request ID & Date</th>
                      <th className="p-3">Customer Details</th>
                      <th className="p-3">Request Type</th>
                      <th className="p-3">Reason / Details</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Change Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {deletionRequests.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-6 text-center text-neutral-400">No active data deletion requests logged.</td>
                      </tr>
                    ) : (
                      deletionRequests.map((r) => (
                        <tr key={r.id} className="hover:bg-neutral-50">
                          <td className="p-3">
                            <span className="font-mono font-bold text-[#111111]">{r.id}</span>
                            <span className="text-neutral-500 text-[10px] block">{formatDate(r.dateRequested)}</span>
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-[#111111]">{r.name}</p>
                            <p className="text-[11px] text-neutral-500">{r.phone} {r.email && `• ${r.email}`}</p>
                          </td>
                          <td className="p-3 font-medium text-neutral-700">{r.requestType}</td>
                          <td className="p-3 text-neutral-600 max-w-xs truncate">{r.reason}</td>
                          <td className="p-3 text-center">
                            {r.status === 'COMPLETED' ? (
                              <span className="bg-emerald-100 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded">Completed</span>
                            ) : r.status === 'IN_PROGRESS' ? (
                              <span className="bg-blue-100 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded">In Progress</span>
                            ) : r.status === 'REJECTED' ? (
                              <span className="bg-red-100 text-red-700 font-bold text-[10px] px-2 py-0.5 rounded">Rejected</span>
                            ) : (
                              <span className="bg-amber-100 text-amber-700 font-bold text-[10px] px-2 py-0.5 rounded">Pending</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <select
                              value={r.status}
                              onChange={(e) => handleUpdateDeletionStatus(r.id, e.target.value)}
                              className="bg-[#F7F7F7] border border-neutral-300 rounded px-2 py-1 text-xs font-bold outline-none"
                            >
                              <option value="PENDING">Pending</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="REJECTED">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 7: WhatsApp Templates Manager */}
        {activeTab === 'whatsapp-templates' && (
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-[#111111] uppercase tracking-wider flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-amber-500" />
                  Meta WhatsApp Message Templates ({templates.length})
                </h3>
                <p className="text-xs text-neutral-500">Create, manage and review Meta-approved transactional & promotional WhatsApp templates</p>
              </div>

              <button
                onClick={handleOpenAddTemplate}
                className="px-4 py-2 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Template</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((tpl) => (
                <div key={tpl.id} className="border border-neutral-200 rounded-2xl p-4 bg-[#F7F7F7] flex flex-col justify-between space-y-3">
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-neutral-200">
                      <div>
                        <span className="font-bold text-xs text-[#111111] font-mono block">{tpl.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            tpl.category === 'MARKETING' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {tpl.category}
                          </span>
                          <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded uppercase font-semibold">
                            {tpl.language || 'en'}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tpl.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                        tpl.status === 'Submitted' ? 'bg-amber-100 text-amber-700' :
                        tpl.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-neutral-200 text-neutral-600'
                      }`}>
                        {tpl.status === 'Approved' ? '✓ Meta Approved' : tpl.status}
                      </span>
                    </div>

                    {/* WhatsApp Chat Preview Bubble */}
                    <div className="my-3 p-3 bg-[#DCF8C6] text-[#111111] rounded-xl rounded-tl-none text-xs shadow-sm border border-emerald-200/60 leading-relaxed font-normal relative">
                      <p>{tpl.message}</p>
                      <span className="text-[9px] text-neutral-500 block text-right mt-1 font-mono">12:00 PM • ✓✓</span>
                    </div>

                    {/* Variables */}
                    {tpl.variables?.length > 0 && (
                      <div className="text-[10px] text-neutral-500">
                        <span className="font-semibold text-neutral-700">Variables: </span>
                        {tpl.variables.map((v, i) => (
                          <span key={i} className="inline-block bg-white border border-neutral-200 px-1.5 py-0.5 rounded mr-1 mb-1 font-mono">
                            {`{{${i+1}}}`} {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400">{tpl.approvalStatus || 'Meta Ready'}</span>
                    <button
                      onClick={() => handleOpenEditTemplate(tpl)}
                      className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-700 text-xs font-bold rounded-lg transition"
                    >
                      Edit Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: WhatsApp Campaign Safety Simulator */}
        {activeTab === 'whatsapp-campaigns' && (
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-black text-[#111111] uppercase tracking-wider flex items-center gap-2">
                <Send className="w-5 h-5 text-[#D71920]" />
                WhatsApp Campaign Safety & Audience Filter Simulator
              </h3>
              <p className="text-xs text-neutral-500">
                Safeguard Bachat Bazar's Meta Business Quality Score. Automatically filter out customers without active marketing consent or opted-out status before sending broadcasts.
              </p>
            </div>

            {/* Template Selector & Trigger */}
            <div className="p-4 bg-[#F7F7F7] rounded-xl border border-neutral-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex-1 space-y-1.5">
                <label className="block font-bold text-xs text-[#111111]">
                  Select WhatsApp Template to Simulate:
                </label>
                <select
                  value={simTemplateId}
                  onChange={(e) => setSimTemplateId(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#D71920]"
                >
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name} ({tpl.category}) — [{tpl.status}]
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSimulateCampaign}
                disabled={simulating}
                className="px-6 py-2.5 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold text-xs rounded-xl transition shadow-red-glow flex items-center justify-center gap-2 shrink-0"
              >
                {simulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{simulating ? 'Analyzing Recipients...' : 'Run Safety Simulation'}</span>
              </button>
            </div>

            {/* Simulation Results */}
            {simulationResult && (
              <div className="space-y-6">
                
                {/* Status Summary Banner */}
                <div className="p-5 rounded-2xl bg-neutral-900 text-white space-y-3 border border-neutral-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-6 h-6 text-emerald-400" />
                      <div>
                        <h4 className="font-bold text-sm text-white">Policy Compliance Analysis</h4>
                        <p className="text-xs text-neutral-400">
                          Template: <strong className="text-white font-mono">{simulationResult.template?.name}</strong> • Category: <span className="text-emerald-400 font-bold">{simulationResult.template?.category}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-400">{simulationResult.summary?.policyComplianceRate}%</span>
                        <span className="text-[10px] text-neutral-400 block">Eligible Rate</span>
                      </div>
                    </div>
                  </div>

                  {simulationResult.summary?.safetyWarning && (
                    <div className="p-3 bg-amber-500/20 border border-amber-500/50 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>{simulationResult.summary.safetyWarning}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                    <div className="bg-neutral-800/80 p-2.5 rounded-xl">
                      <span className="text-neutral-400 block text-[10px]">Total Audience</span>
                      <strong className="text-base text-white">{simulationResult.summary?.totalAudience}</strong>
                    </div>
                    <div className="bg-emerald-950/60 border border-emerald-800/60 p-2.5 rounded-xl">
                      <span className="text-emerald-300 block text-[10px]">Safe / Eligible</span>
                      <strong className="text-base text-emerald-400">{simulationResult.summary?.eligibleCount}</strong>
                    </div>
                    <div className="bg-red-950/60 border border-red-800/60 p-2.5 rounded-xl">
                      <span className="text-red-300 block text-[10px]">Blocked / Excluded</span>
                      <strong className="text-base text-[#D71920]">{simulationResult.summary?.excludedCount}</strong>
                    </div>
                  </div>
                </div>

                {/* Excluded & Eligible Breakdowns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left: Excluded List with Reasons */}
                  <div className="border border-red-200 bg-red-50/30 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-red-200">
                      <h4 className="font-bold text-xs text-[#D71920] flex items-center gap-1.5 uppercase tracking-wider">
                        <UserX className="w-4 h-4" />
                        Excluded Recipients ({simulationResult.excludedRecipients?.length})
                      </h4>
                      <span className="text-[10px] text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded">
                        Blocked by Policy
                      </span>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
                      {simulationResult.excludedRecipients?.map((ex, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded-xl border border-red-100 flex items-center justify-between gap-2 shadow-xs">
                          <div>
                            <p className="font-bold text-[#111111]">{ex.name || 'Customer'}</p>
                            <p className="font-mono text-[10px] text-neutral-500">{ex.phone}</p>
                          </div>
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded text-right">
                            {ex.reason}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Eligible List */}
                  <div className="border border-emerald-200 bg-emerald-50/30 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                      <h4 className="font-bold text-xs text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Eligible Recipients ({simulationResult.eligibleRecipients?.length})
                      </h4>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                        Safe to Send
                      </span>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
                      {simulationResult.eligibleRecipients?.map((el, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded-xl border border-emerald-100 flex items-center justify-between gap-2 shadow-xs">
                          <div>
                            <p className="font-bold text-[#111111]">{el.name} {el.isMember && <span className="text-[#D71920] font-bold text-[10px]">★ Member</span>}</p>
                            <p className="font-mono text-[10px] text-neutral-500">{el.phone}</p>
                          </div>
                          <span className="text-[10px] font-medium text-neutral-500">
                            Opt-in via {el.consentSource}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}
          </div>
        )}

      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <div className="p-4 bg-[#111111] text-white flex items-center justify-between border-b border-neutral-800">
              <h3 className="font-bold text-sm text-white">
                {editingProduct ? 'Edit Product Details' : 'Add New Grocery Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductFormSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Aashirvaad Shudh Chakki Atta 5kg"
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-neutral-700">Category *</label>
                    <button
                      type="button"
                      onClick={() => setShowAddCategoryInline(!showAddCategoryInline)}
                      className="text-[11px] text-[#D71920] hover:text-[#B5141A] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {showAddCategoryInline ? 'Choose Existing' : '+ Add New Category'}
                    </button>
                  </div>

                  {!showAddCategoryInline ? (
                    <select
                      value={productForm.category}
                      onChange={(e) => {
                        if (e.target.value === '__add_new__') {
                          setShowAddCategoryInline(true);
                        } else {
                          setProductForm({ ...productForm, category: e.target.value });
                        }
                      }}
                      className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920] font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon ? `${c.icon} ` : ''}{c.name}
                        </option>
                      ))}
                      <option value="__add_new__" className="font-bold text-[#D71920]">
                        ➕ + Add New Category...
                      </option>
                    </select>
                  ) : (
                    <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-3 space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                          ✨ Create New Category
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowAddCategoryInline(false)}
                          className="text-neutral-400 hover:text-neutral-700 text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <div className="w-16">
                          <label className="block text-[10px] font-bold text-neutral-600 mb-0.5">Icon</label>
                          <select
                            value={newCatIcon}
                            onChange={(e) => setNewCatIcon(e.target.value)}
                            className="w-full bg-white border border-amber-300 rounded-lg py-1.5 px-1 text-center text-sm font-bold outline-none focus:border-[#D71920]"
                          >
                            <option value="📦">📦 General</option>
                            <option value="🌾">🌾 Grocery</option>
                            <option value="🥛">🥛 Dairy</option>
                            <option value="🥦">🥦 Veggies</option>
                            <option value="🍪">🍪 Snacks</option>
                            <option value="☕">☕ Drinks</option>
                            <option value="🧼">🧼 Clean</option>
                            <option value="🧴">🧴 Care</option>
                            <option value="🏠">🏠 Home</option>
                            <option value="🍫">🍫 Sweets</option>
                            <option value="🥤">🥤 Beverages</option>
                            <option value="🍎">🍎 Fruits</option>
                            <option value="🍞">🍞 Bakery</option>
                            <option value="🧃">🧃 Juices</option>
                            <option value="🍯">🍯 Spices</option>
                            <option value="🍜">🍜 Noodles</option>
                            <option value="🧂">🧂 Masala</option>
                          </select>
                        </div>

                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-neutral-600 mb-0.5">Category Name *</label>
                          <input
                            type="text"
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            placeholder="e.g. Organic & Spices"
                            className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#D71920] font-medium"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleCreateNewCategory();
                              }
                            }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isCreatingCategory || !newCatName.trim()}
                        onClick={handleCreateNewCategory}
                        className="w-full bg-[#D71920] hover:bg-[#B5141A] disabled:opacity-50 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        {isCreatingCategory ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving & Selecting...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Save & Select Category</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.mrp}
                    onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Normal Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.normalPrice}
                    onChange={(e) => setProductForm({ ...productForm, normalPrice: e.target.value })}
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#D71920] mb-1">Member Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.memberPrice}
                    onChange={(e) => setProductForm({ ...productForm, memberPrice: e.target.value })}
                    className="w-full bg-[#FFF1F1] border border-[#FCA5A5] rounded-lg px-3 py-2 font-bold text-[#D71920] outline-none focus:ring-1 focus:ring-[#D71920]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Unit / Pack Size</label>
                  <input
                    type="text"
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="e.g. 5 kg / 1 Litre"
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Product Image URL</label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                ></textarea>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isDealOfDay}
                    onChange={(e) => setProductForm({ ...productForm, isDealOfDay: e.target.checked })}
                    className="accent-[#D71920]"
                  />
                  <span>Mark as Today's Hot Deal</span>
                </label>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold rounded-lg shadow-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit WhatsApp Template Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <div className="p-4 bg-[#111111] text-white flex items-center justify-between border-b border-neutral-800">
              <h3 className="font-bold text-sm text-white">
                {editingTemplate ? 'Edit Meta WhatsApp Template' : 'Create New WhatsApp Template'}
              </h3>
              <button onClick={() => setIsTemplateModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTemplateFormSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Template Name (Lowercase & Underscores) *</label>
                <input
                  type="text"
                  required
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  placeholder="e.g. order_confirmation_bhiwadi"
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 font-mono outline-none focus:border-[#D71920]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Category *</label>
                  <select
                    value={templateForm.category}
                    onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                  >
                    <option value="UTILITY">UTILITY (Order updates / alerts)</option>
                    <option value="MARKETING">MARKETING (Offers / deals)</option>
                    <option value="AUTHENTICATION">AUTHENTICATION (OTP / Login)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Language</label>
                  <select
                    value={templateForm.language}
                    onChange={(e) => setTemplateForm({ ...templateForm, language: e.target.value })}
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                  >
                    <option value="en">English (en)</option>
                    <option value="hi">Hindi (hi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Template Message Body *</label>
                <p className="text-[10px] text-neutral-500 mb-1">Use {"{{1}}"}, {"{{2}}"} for placeholders (e.g. Customer Name, Order ID, Price).</p>
                <textarea
                  rows="4"
                  required
                  value={templateForm.message}
                  onChange={(e) => setTemplateForm({ ...templateForm, message: e.target.value })}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Meta Review Status</label>
                <select
                  value={templateForm.status}
                  onChange={(e) => setTemplateForm({ ...templateForm, status: e.target.value })}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 font-bold outline-none focus:border-[#D71920]"
                >
                  <option value="Approved">Approved (Ready for live broadcasts)</option>
                  <option value="Submitted">Submitted (Under review by Meta)</option>
                  <option value="Draft">Draft</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold rounded-lg shadow-sm"
                >
                  {editingTemplate ? 'Save Template Changes' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Hero Slide Modal */}
      {isHeroModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
            <div className="p-4 bg-[#111111] text-white flex items-center justify-between border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#D71920]" />
                <h3 className="font-bold text-sm text-white">
                  {editingHeroSlide ? 'Edit Hero Slider Slide' : 'Add New Hero Slide Image'}
                </h3>
              </div>
              <button 
                onClick={() => setIsHeroModalOpen(false)} 
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleHeroFormSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Slide Title */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Slide Title / Internal Name *</label>
                <input
                  type="text"
                  required
                  value={heroForm.title}
                  onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                  placeholder="e.g. Fresh Daily Staples & Vegetables"
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                />
              </div>

              {/* Image URL & Instant Preview */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Slide Image URL *</label>
                <input
                  type="url"
                  required
                  value={heroForm.image}
                  onChange={(e) => setHeroForm({ ...heroForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                />

                {/* Quick Presets */}
                <div className="mt-2">
                  <span className="text-[10px] text-neutral-500 font-semibold block mb-1">Quick Preset Grocery Images:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {presetHeroImages.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setHeroForm({ ...heroForm, image: preset.url })}
                        className={`text-[10px] px-2 py-1 rounded border transition cursor-pointer ${
                          heroForm.image === preset.url
                            ? 'bg-red-50 border-[#D71920] text-[#D71920] font-bold'
                            : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Preview Box */}
                {heroForm.image && (
                  <div className="mt-2.5 relative h-36 w-full rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                    <img
                      src={heroForm.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-white/95 px-2 py-0.5 rounded-full text-[9px] font-bold text-[#D71920] shadow-xs">
                      {heroForm.badgeText || 'Badge Preview'}
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Badge Text */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Floating Badge Text</label>
                <input
                  type="text"
                  value={heroForm.badgeText}
                  onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
                  placeholder="e.g. Zyada Kharido, Zyada Bachao"
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                />
              </div>

              {/* Sample Product Overlay Tag */}
              <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 rounded-xl space-y-3">
                <span className="text-[11px] font-bold text-[#111111] uppercase tracking-wider block">
                  Optional Sample Product Two-Tier Price Overlay
                </span>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={heroForm.productName}
                    onChange={(e) => setHeroForm({ ...heroForm, productName: e.target.value })}
                    placeholder="e.g. Aashirvaad Shudh Atta 5kg"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block font-semibold text-neutral-600 mb-1">MRP (₹)</label>
                    <input
                      type="number"
                      value={heroForm.mrp}
                      onChange={(e) => setHeroForm({ ...heroForm, mrp: e.target.value })}
                      placeholder="e.g. 280"
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 outline-none focus:border-[#D71920]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111111] mb-1">Normal Price (₹)</label>
                    <input
                      type="number"
                      value={heroForm.normalPrice}
                      onChange={(e) => setHeroForm({ ...heroForm, normalPrice: e.target.value })}
                      placeholder="e.g. 249"
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 outline-none focus:border-[#D71920]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#D71920] mb-1">Member Price (₹)</label>
                    <input
                      type="number"
                      value={heroForm.memberPrice}
                      onChange={(e) => setHeroForm({ ...heroForm, memberPrice: e.target.value })}
                      placeholder="e.g. 229"
                      className="w-full bg-red-50 border border-red-200 text-[#D71920] font-bold rounded-lg px-3 py-1.5 outline-none focus:border-[#D71920]"
                    />
                  </div>
                </div>
              </div>

              {/* Order & Active Toggle */}
              <div className="grid grid-cols-2 gap-3 items-center pt-1">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Display Order Index</label>
                  <input
                    type="number"
                    min="1"
                    value={heroForm.order}
                    onChange={(e) => setHeroForm({ ...heroForm, order: e.target.value })}
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
                    <input
                      type="checkbox"
                      checked={heroForm.isActive}
                      onChange={(e) => setHeroForm({ ...heroForm, isActive: e.target.checked })}
                      className="accent-[#D71920] w-4 h-4"
                    />
                    <span>Active on Storefront</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsHeroModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  {editingHeroSlide ? 'Save Slide Changes' : 'Add Slide'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ONE-BUTTON CUSTOMER PROFILE & PURCHASE HISTORY MODAL */}
      {isCustomerProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col border border-neutral-200">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#111111] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#D71920] text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                  {selectedCustomerProfile?.name ? selectedCustomerProfile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-white">
                      {selectedCustomerProfile?.name || 'Customer Profile'}
                    </h3>
                    {selectedCustomerProfile?.isMember ? (
                      <span className="bg-[#D71920] text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                        ★ VIP Member
                      </span>
                    ) : (
                      <span className="bg-neutral-800 text-neutral-400 font-medium text-[10px] px-2 py-0.5 rounded-full border border-neutral-700">
                        Regular Customer
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    Phone: {selectedCustomerProfile?.phone || '-'} {selectedCustomerProfile?.memberId ? `• Member ID: ${selectedCustomerProfile.memberId}` : ''}
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {selectedCustomerProfile?.phone && (
                  <>
                    <a
                      href={`https://wa.me/91${selectedCustomerProfile.phone.replace(/\D/g, '')}?text=Namaste%20${encodeURIComponent(selectedCustomerProfile.name || 'Customer')},%20Bachat%20Bazar%20Bhiwadi%20se...`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`tel:${selectedCustomerProfile.phone}`}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-neutral-700"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </>
                )}
                <button
                  onClick={() => setIsCustomerProfileModalOpen(false)}
                  className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-xl transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs bg-[#FBFBFB]">
              
              {/* 4 Lifetime Performance KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-500 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-[#D71920]" />
                  </div>
                  <p className="text-xl font-black text-[#111111]">
                    {selectedCustomerProfile?.orders?.length || selectedCustomerProfile?.orderCount || 0}
                  </p>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">Lifetime purchases</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-500 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Total Spent</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xl font-black text-[#111111]">
                    {formatINR(selectedCustomerProfile?.totalSpend || 0)}
                  </p>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">Total order value</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-500 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">VIP Savings</span>
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xl font-black text-emerald-600">
                    {formatINR(selectedCustomerProfile?.totalSavings || 0)}
                  </p>
                  <span className="text-[10px] text-emerald-600/70 block mt-0.5">Discount benefits</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-neutral-500 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider">VIP Club</span>
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className={`text-xs font-bold block ${selectedCustomerProfile?.isMember ? 'text-[#D71920]' : 'text-neutral-600'}`}>
                      {selectedCustomerProfile?.isMember ? 'Active Member' : 'Not Enrolled'}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      if (selectedCustomerProfile) {
                        await handleToggleCustomerMembership(selectedCustomerProfile.id, selectedCustomerProfile.isMember);
                        setSelectedCustomerProfile(prev => ({
                          ...prev,
                          isMember: !prev.isMember,
                          memberId: !prev.isMember ? (prev.memberId || `BB-MEM-${Math.floor(1000 + Math.random() * 9000)}`) : prev.memberId
                        }));
                      }
                    }}
                    className={`mt-2 py-1 px-2 rounded text-[10px] font-bold transition text-center cursor-pointer ${
                      selectedCustomerProfile?.isMember
                        ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                        : 'bg-[#D71920] hover:bg-[#B5141A] text-white'
                    }`}
                  >
                    {selectedCustomerProfile?.isMember ? 'Deactivate VIP' : 'Activate VIP Member'}
                  </button>
                </div>
              </div>

              {/* Customer Info & WhatsApp Compliance Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Left: Contact & Address Information */}
                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs space-y-3">
                  <h4 className="font-black text-xs text-[#111111] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-neutral-100">
                    <User className="w-4 h-4 text-[#D71920]" />
                    Customer Details & Address
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start justify-between">
                      <span className="text-neutral-500">Full Name:</span>
                      <strong className="text-[#111111]">{selectedCustomerProfile?.name || '-'}</strong>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-neutral-500">Primary Phone:</span>
                      <strong className="font-mono text-[#111111]">{selectedCustomerProfile?.phone || '-'}</strong>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-neutral-500">Email Address:</span>
                      <span className="text-neutral-700">{selectedCustomerProfile?.email || 'None'}</span>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-neutral-500">Primary Delivery Address:</span>
                      <span className="text-right text-neutral-800 max-w-[60%] font-medium">
                        {selectedCustomerProfile?.address || selectedCustomerProfile?.orders?.[0]?.shippingAddress?.house || 'Bhiwadi, Rajasthan 301019'}
                        {selectedCustomerProfile?.orders?.[0]?.shippingAddress?.area ? `, ${selectedCustomerProfile.orders[0].shippingAddress.area}` : ''}
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-neutral-500">Member Since:</span>
                      <span className="text-neutral-600 font-mono">
                        {selectedCustomerProfile?.memberSince || selectedCustomerProfile?.createdAt ? formatDate(selectedCustomerProfile.memberSince || selectedCustomerProfile.createdAt) : 'Active Customer'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: WhatsApp Consent Status */}
                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs space-y-3">
                  <h4 className="font-black text-xs text-[#111111] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-neutral-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    WhatsApp Compliance Status
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Overall Consent Status:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        selectedCustomerProfile?.whatsappStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                        selectedCustomerProfile?.whatsappStatus === 'TRANSACTIONAL_ONLY' ? 'bg-purple-100 text-purple-700' :
                        selectedCustomerProfile?.whatsappStatus === 'OPTED_OUT' ? 'bg-red-100 text-red-700' :
                        'bg-neutral-100 text-neutral-600'
                      }`}>
                        {selectedCustomerProfile?.whatsappStatus || 'NO_CONSENT'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Transactional Order Updates:</span>
                      <span className={`font-bold ${selectedCustomerProfile?.transactionalConsent ? 'text-emerald-600' : 'text-neutral-400'}`}>
                        {selectedCustomerProfile?.transactionalConsent ? '✓ Enabled (Order alerts, invoice)' : '✗ Disabled'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Promotional & Offers Outreach:</span>
                      <span className={`font-bold ${selectedCustomerProfile?.marketingConsent ? 'text-blue-600' : 'text-neutral-400'}`}>
                        {selectedCustomerProfile?.marketingConsent ? '✓ Opted In (Weekly savings deals)' : '✗ Not Opted In'}
                      </span>
                    </div>

                    {selectedCustomerProfile?.whatsappConsent?.consentSource && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500">Opt-in Source:</span>
                        <span className="text-neutral-700 font-medium">
                          {selectedCustomerProfile.whatsappConsent.consentSource}
                        </span>
                      </div>
                    )}

                    {selectedCustomerProfile?.whatsappConsent?.timestamp && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500">Consent Logged:</span>
                        <span className="text-neutral-600 font-mono">
                          {formatDate(selectedCustomerProfile.whatsappConsent.timestamp)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Complete Purchase & Order History Timeline */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                  <div>
                    <h4 className="font-black text-sm text-[#111111] uppercase tracking-wider flex items-center gap-2">
                      <History className="w-4 h-4 text-[#D71920]" />
                      Complete Order History ({selectedCustomerProfile?.orders?.length || 0})
                    </h4>
                    <p className="text-[11px] text-neutral-500">Chronological history of all orders placed by this customer</p>
                  </div>
                </div>

                {selectedCustomerProfile?.orders && selectedCustomerProfile.orders.length > 0 ? (
                  <div className="space-y-4">
                    {selectedCustomerProfile.orders.map((ord, idx) => (
                      <div key={ord.id || idx} className="border border-neutral-200 rounded-xl p-4 bg-[#FBFBFB] hover:bg-neutral-50 transition space-y-3">
                        
                        {/* Order Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-neutral-200 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-[#111111]">Order #{ord.id}</span>
                            <span className="text-neutral-400 font-mono text-[11px]">• {formatDate(ord.date)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                              ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                              ord.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                              ord.status === 'Processing' || ord.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              ● {ord.status}
                            </span>
                            <span className="text-[11px] font-bold text-neutral-700 bg-neutral-200 px-2 py-0.5 rounded">
                              {ord.paymentMethod} ({ord.paymentStatus || 'Paid'})
                            </span>
                          </div>
                        </div>

                        {/* Items Purchased List */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Items Ordered:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {ord.items?.map((it, itemIdx) => (
                              <div key={itemIdx} className="bg-white p-2.5 rounded-lg border border-neutral-200 flex items-center justify-between gap-2">
                                <div>
                                  <strong className="text-[#111111] block line-clamp-1">{it.name}</strong>
                                  <span className="text-[10px] text-neutral-500">
                                    Pack: {it.unit} • Qty: <strong className="text-neutral-800">{it.quantity}</strong>
                                  </span>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="font-bold text-[#111111] block">
                                    {formatINR(it.appliedPrice * it.quantity)}
                                  </span>
                                  {it.itemSavings > 0 && (
                                    <span className="text-[9px] font-bold text-emerald-600 block">
                                      Saved {formatINR(it.itemSavings * it.quantity)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Delivery & Total Summary */}
                        <div className="pt-2 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                          <div className="text-neutral-500 text-[11px]">
                            <span>Delivery to: </span>
                            <strong className="text-neutral-800">
                              {ord.shippingAddress?.house}, {ord.shippingAddress?.area}, {ord.shippingAddress?.city}
                            </strong>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            {ord.memberSavings > 0 && (
                              <span className="text-[11px] font-bold text-[#D71920] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                VIP Saved: {formatINR(ord.memberSavings)}
                              </span>
                            )}
                            <div className="text-right">
                              <span className="text-xs text-neutral-500">Order Total: </span>
                              <strong className="text-sm font-black text-[#111111]">{formatINR(ord.total)}</strong>
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-neutral-300 rounded-xl p-6 bg-[#FAFAFA]">
                    <ShoppingBag className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                    <p className="font-bold text-xs text-neutral-700">No Past Orders Found</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">This customer has not placed any online grocery orders yet.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-neutral-100 border-t border-neutral-200 flex justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsCustomerProfileModalOpen(false)}
                className="px-5 py-2 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EDIT MEMBERSHIP PLAN & DYNAMIC PRICING MODAL */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative border border-neutral-200 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#111111] text-white flex items-center justify-between border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <h3 className="font-black text-sm text-white">
                  Edit Plan Pricing & Details — {editingPlan?.name || 'Membership Plan'}
                </h3>
              </div>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handlePlanFormSubmit} className="p-5 space-y-4 text-xs">
              
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 text-[11px] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Yahan price change karte hi storefront par customer ko naya price dikhai dega.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  Plan Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Special VIP Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={planForm.price}
                    onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 font-bold text-[#D71920] text-sm outline-none focus:border-[#D71920]"
                    placeholder="e.g. 5999"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Original MRP (₹) (Strikethrough)
                  </label>
                  <input
                    type="number"
                    value={planForm.mrp}
                    onChange={(e) => setPlanForm({ ...planForm, mrp: e.target.value })}
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                    placeholder="e.g. 9999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Duration Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={planForm.duration}
                    onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                    placeholder="e.g. Lifetime / 1 Year / 2 Years"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Duration in Months (Blank for Lifetime)
                  </label>
                  <input
                    type="number"
                    value={planForm.durationMonths || ''}
                    onChange={(e) => setPlanForm({ ...planForm, durationMonths: e.target.value ? Number(e.target.value) : null })}
                    className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                    placeholder="e.g. 12, 24, 36 (leave blank for Lifetime)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  Highlight Badge Text
                </label>
                <input
                  type="text"
                  value={planForm.badge}
                  onChange={(e) => setPlanForm({ ...planForm, badge: e.target.value })}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                  placeholder="e.g. Best Value • Lifetime"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  Plan Description & Benefits
                </label>
                <textarea
                  rows={3}
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  className="w-full bg-[#F7F7F7] border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-[#D71920]"
                  placeholder="Explain benefits to customers..."
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={planForm.isActive}
                    onChange={(e) => setPlanForm({ ...planForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#D71920] rounded border-neutral-300 focus:ring-[#D71920]"
                  />
                  <span className="font-bold text-neutral-800">Active (Visible to Customers)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={planForm.isPopular}
                    onChange={(e) => setPlanForm({ ...planForm, isPopular: e.target.checked })}
                    className="w-4 h-4 text-[#D71920] rounded border-neutral-300 focus:ring-[#D71920]"
                  />
                  <span className="font-bold text-neutral-800">Mark as Popular</span>
                </label>
              </div>

              {/* Modal Footer Buttons */}
              <div className="p-3 bg-neutral-100 -mx-5 -mb-5 mt-4 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Plan Pricing</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
