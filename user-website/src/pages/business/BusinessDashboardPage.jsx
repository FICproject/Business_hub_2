import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Store,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  PackageCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  PlusCircle,
  AlertCircle,
  Upload,
  FileText,
  ShoppingBag,
  Share2,
  Search,
  Filter,
  X,
  ExternalLink,
  Layers,
  Trash2,
  Lock,
  Users,
  Eye,
  Check,
  Edit3,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Building2,
  Rocket,
  Globe,
  Bell,
  Settings,
  Award,
  AlertTriangle,
  User,
  Tag,
  Sliders,
  CheckSquare,
  XCircle,
} from 'lucide-react';
import {
  businessApi,
  marketplaceApi,
  requestsApi,
  notificationsApi,
  usersApi,
  documentsApi,
} from '../../services/api';
import { setActiveRole } from '../../store';
import {
  DEFAULT_BUSINESSMAN_CATS,
  DEFAULT_ENTREPRENEUR_CATS,
  BUSINESS_TYPES,
  STARTUP_STAGES,
  BUSINESS_MODELS,
  STARTUP_REGISTRATION_TYPES,
} from '../../data/roleCategories';
import { DocumentVerificationPanel } from '../../components/verification/DocumentVerificationPanel';

export const BusinessDashboardPage = () => {
  const dispatch = useDispatch();
  const { user, activeRole } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const handleTabChange = (newTab) => {
    if (newTab === 'overview') {
      searchParams.delete('tab');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ tab: newTab });
    }
  };

  // Determine available business roles and active role type
  const userRoles = user?.roles || [];
  const isBusinessman = userRoles.includes('businessman');
  const isEntrepreneur = userRoles.includes('entrepreneur');
  const isBusinessmanApproved =
    user?.roleApprovals?.businessman === 'approved' ||
    (user?.verificationStatus === 'approved' && isBusinessman);
  const isEntrepreneurApproved =
    user?.roleApprovals?.entrepreneur === 'approved' ||
    (user?.verificationStatus === 'approved' && isEntrepreneur);

  // Multi-role support: Both roles approved?
  const hasBothApprovedRoles = isBusinessmanApproved && isEntrepreneurApproved;

  // Active business profile type: 'businessman' or 'entrepreneur'
  const [currentRoleType, setCurrentRoleType] = useState(() => {
    if (activeRole === 'entrepreneur' && isEntrepreneurApproved) return 'entrepreneur';
    if (isBusinessmanApproved) return 'businessman';
    if (isEntrepreneurApproved) return 'entrepreneur';
    return isBusinessman ? 'businessman' : 'entrepreneur';
  });

  // Main state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [business, setBusiness] = useState(null);
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    newRequests: 0,
    pendingResponses: 0,
    acceptedRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    rejectedRequests: 0,
    totalConnections: 0,
  });
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);
  const [docChecklist, setDocChecklist] = useState(null);

  // Filter & Search states
  const [requestFilter, setRequestFilter] = useState('all');
  const [requestSearch, setRequestSearch] = useState('');
  const [connFilter, setConnFilter] = useState('all');
  const [connSearch, setConnSearch] = useState('');
  const [catalogSubTab, setCatalogSubTab] = useState('products'); // 'products' | 'services'
  const [notifFilter, setNotifFilter] = useState('all'); // 'all' | 'unread'

  // Modals state
  const [viewRequestModal, setViewRequestModal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [progressModal, setProgressModal] = useState(null);
  const [progressStatus, setProgressStatus] = useState('in_progress');
  const [progressNote, setProgressNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Profile Edit Modal State
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    businessName: '',
    category: '',
    subcategory: '',
    businessType: '',
    description: '',
    productsServices: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    operatingLocations: '',
    website: '',
    phone: '',
    altPhone: '',
    email: '',
    stage: '',
    businessModel: '',
    problemStatement: '',
    solutionDescription: '',
    targetMarket: '',
    pitchDeckUrl: '',
  });

  // Product Modal State
  const [prodModalOpen, setProdModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodForm, setProdForm] = useState({
    title: '',
    category: 'Construction Materials',
    price: '',
    stock: '10',
    description: '',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  });

  // Service Modal State
  const [servModalOpen, setServModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [servForm, setServForm] = useState({
    name: '',
    category: 'Engineering & Architecture',
    pricingType: 'fixed',
    price: '',
    serviceArea: 'Regional / On-site',
    description: '',
  });

  // Settings State
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passMessage, setPassMessage] = useState(null);
  const [notifPrefs, setNotifPrefs] = useState({
    emailAlerts: true,
    requestAlerts: true,
    connectionAlerts: true,
    marketingUpdates: false,
  });

  // Load All Business Data for the selected role
  const loadDashboardData = async (roleTypeToLoad = currentRoleType) => {
    try {
      setRefreshing(true);
      // 1. Fetch business profiles
      const bizRes = await businessApi.getMyBusiness({ roleType: roleTypeToLoad });
      let activeBiz = null;
      if (bizRes.data.success) {
        setBusinessProfiles(bizRes.data.businesses || []);
        activeBiz = bizRes.data.business;
        setBusiness(activeBiz);
        if (activeBiz) {
          const addr = activeBiz.address || {};
          setProfileForm({
            businessName: activeBiz.businessName || '',
            category: activeBiz.category || '',
            subcategory: activeBiz.subcategory || '',
            businessType: activeBiz.businessType || '',
            description: activeBiz.description || '',
            productsServices: Array.isArray(activeBiz.productsServices)
              ? activeBiz.productsServices.join(', ')
              : activeBiz.productsServices || '',
            street: addr.street || '',
            city: addr.city || '',
            state: addr.state || '',
            postalCode: addr.postalCode || '',
            operatingLocations: Array.isArray(activeBiz.operatingLocations)
              ? activeBiz.operatingLocations.join(', ')
              : activeBiz.operatingLocations || '',
            website: activeBiz.website || '',
            phone: activeBiz.phone || user?.mobile || '',
            altPhone: activeBiz.altPhone || '',
            email: activeBiz.email || user?.email || '',
            stage: activeBiz.stage || '',
            businessModel: activeBiz.businessModel || '',
            problemStatement: activeBiz.problemStatement || '',
            solutionDescription: activeBiz.solutionDescription || '',
            targetMarket: activeBiz.targetMarket || '',
            pitchDeckUrl: activeBiz.pitchDeckUrl || '',
          });
        }
      }

      const bizId = activeBiz?._id;

      // 2. Fetch assigned service requests & metrics
      try {
        const reqRes = await requestsApi.getMyBusinessRequests({
          businessId: bizId,
          roleType: roleTypeToLoad,
        });
        if (reqRes.data.success) {
          setRequests(reqRes.data.requests || []);
          if (reqRes.data.metrics) {
            setMetrics(reqRes.data.metrics);
          }
        }
      } catch (err) {
        console.error('Error fetching requests:', err.message);
      }

      // 3. Fetch business connections
      try {
        const connRes = await requestsApi.getMyBusinessConnections({
          businessId: bizId,
          roleType: roleTypeToLoad,
        });
        if (connRes.data.success) {
          setConnections(connRes.data.connections || []);
        }
      } catch (err) {
        console.error('Error fetching connections:', err.message);
      }

      // 4. Fetch Products & Services
      try {
        const prodRes = await marketplaceApi.getBusinessProducts({ businessId: bizId });
        setProducts(prodRes.data.data || []);
      } catch (err) {
        console.error('Error fetching products:', err.message);
      }

      try {
        const servRes = await marketplaceApi.getBusinessServices({ businessId: bizId });
        setServices(servRes.data.services || []);
      } catch (err) {
        console.error('Error fetching services:', err.message);
      }

      // 5. Fetch Notifications
      try {
        const notifRes = await notificationsApi.getMyNotifications();
        setNotificationsList(notifRes.data.data || []);
      } catch (err) {
        console.error('Error fetching notifications:', err.message);
      }

      // 6. Fetch Document Checklist
      try {
        const docRes = await documentsApi.getMyChecklist();
        if (docRes.data?.success) {
          setDocChecklist(docRes.data);
        }
      } catch (err) {
        console.error('Error fetching document checklist:', err.message);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData(currentRoleType);
  }, [currentRoleType]);

  // Handle Role Switch for Dual-Role approved users
  const handleSwitchProfile = (targetRole) => {
    if (targetRole === currentRoleType) return;
    setCurrentRoleType(targetRole);
    dispatch(setActiveRole(targetRole));
  };

  // Actions on Service Requests
  const handleAcceptRequest = async (requestId) => {
    try {
      setActionLoading(true);
      const res = await requestsApi.respondToRequest(requestId, { action: 'accept' });
      if (res.data.success) {
        alert('Service Request accepted! The customer has been notified and connection confirmed.');
        loadDashboardData(currentRoleType);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept request.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      alert('Please provide a reason for declining.');
      return;
    }
    try {
      setActionLoading(true);
      const res = await requestsApi.respondToRequest(rejectModal._id, {
        action: 'reject',
        reason: rejectReason.trim(),
      });
      if (res.data.success) {
        alert('Request declined. It has been returned to Admin for reassignment.');
        setRejectModal(null);
        setRejectReason('');
        loadDashboardData(currentRoleType);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to decline request.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await requestsApi.updateRequestProgress(progressModal._id, {
        status: progressStatus,
        progressNotes: progressNote.trim(),
      });
      if (res.data.success) {
        alert(`Request status updated to "${progressStatus === 'completed' ? 'Completed' : 'In Progress'}"!`);
        setProgressModal(null);
        setProgressNote('');
        loadDashboardData(currentRoleType);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request progress.');
    } finally {
      setActionLoading(false);
    }
  };

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const payload = {
        businessId: business?._id,
        roleType: currentRoleType,
        businessName: profileForm.businessName,
        category: profileForm.category,
        subcategory: profileForm.subcategory,
        businessType: profileForm.businessType,
        description: profileForm.description,
        productsServices: profileForm.productsServices
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        address: {
          street: profileForm.street,
          city: profileForm.city,
          state: profileForm.state,
          postalCode: profileForm.postalCode,
          country: 'India',
        },
        operatingLocations: profileForm.operatingLocations
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        website: profileForm.website,
        phone: profileForm.phone,
        altPhone: profileForm.altPhone,
        email: profileForm.email,
        stage: profileForm.stage,
        businessModel: profileForm.businessModel,
        problemStatement: profileForm.problemStatement,
        solutionDescription: profileForm.solutionDescription,
        targetMarket: profileForm.targetMarket,
        pitchDeckUrl: profileForm.pitchDeckUrl,
      };

      const res = await businessApi.saveBusiness(payload);
      if (res.data.success) {
        alert('Business profile updated successfully!');
        setEditProfileOpen(false);
        loadDashboardData(currentRoleType);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save business profile.');
    } finally {
      setActionLoading(false);
    }
  };

  // Product Management
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!isApproved) {
      alert('Only verified & approved businesses can publish products.');
      return;
    }
    try {
      setActionLoading(true);
      const payload = {
        businessId: business?._id,
        title: prodForm.title,
        category: prodForm.category,
        price: parseFloat(prodForm.price),
        stock: parseInt(prodForm.stock, 10),
        description: prodForm.description,
        images: [prodForm.image],
      };

      if (editingProduct) {
        await marketplaceApi.updateProduct(editingProduct._id, payload);
        alert('Product updated successfully!');
      } else {
        await marketplaceApi.createProduct(payload);
        alert('Product published to marketplace!');
      }
      setProdModalOpen(false);
      setEditingProduct(null);
      setProdForm({
        title: '',
        category: 'Construction Materials',
        price: '',
        stock: '10',
        description: '',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      });
      loadDashboardData(currentRoleType);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await marketplaceApi.deleteProduct(prodId);
      loadDashboardData(currentRoleType);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  // Service Management
  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!isApproved) {
      alert('Only verified & approved businesses can publish services.');
      return;
    }
    try {
      setActionLoading(true);
      const payload = {
        businessId: business?._id,
        name: servForm.name,
        category: servForm.category,
        pricingType: servForm.pricingType,
        price: servForm.price ? parseFloat(servForm.price) : undefined,
        serviceArea: servForm.serviceArea,
        description: servForm.description,
      };

      if (editingService) {
        await marketplaceApi.updateService(editingService._id, payload);
        alert('Service updated successfully!');
      } else {
        await marketplaceApi.createService(payload);
        alert('Service published successfully!');
      }
      setServModalOpen(false);
      setEditingService(null);
      setServForm({
        name: '',
        category: 'Engineering & Architecture',
        pricingType: 'fixed',
        price: '',
        serviceArea: 'Regional / On-site',
        description: '',
      });
      loadDashboardData(currentRoleType);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save service.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteService = async (servId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await marketplaceApi.deleteService(servId);
      loadDashboardData(currentRoleType);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete service.');
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMessage(null);
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    try {
      await usersApi.changePassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      setPassMessage({ type: 'success', text: 'Password successfully changed!' });
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to change password.',
      });
    }
  };

  // Mark notification read
  const handleMarkNotifRead = async (notifId) => {
    try {
      await notificationsApi.markAsRead(notifId);
      setNotificationsList((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllNotifs = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotificationsList((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  // Filtering for Requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // Tab filter
      if (requestFilter === 'new') {
        if (r.status !== 'new' && r.status !== 'assigned') return false;
      } else if (requestFilter === 'pending_responses') {
        if (r.status !== 'assigned' && r.status !== 'pending_acceptance') return false;
      } else if (requestFilter !== 'all' && r.status !== requestFilter) {
        return false;
      }

      // Search query
      if (requestSearch) {
        const q = requestSearch.toLowerCase();
        const titleMatch = (r.title || '').toLowerCase().includes(q);
        const userMatch = (r.userName || '').toLowerCase().includes(q);
        const locMatch = (r.location || '').toLowerCase().includes(q);
        const idMatch = (r._id || '').toLowerCase().includes(q);
        const catMatch = (r.category || '').toLowerCase().includes(q);
        return titleMatch || userMatch || locMatch || idMatch || catMatch;
      }
      return true;
    });
  }, [requests, requestFilter, requestSearch]);

  // Filtering for Connections
  const filteredConnections = useMemo(() => {
    return connections.filter((c) => {
      if (connFilter === 'active') {
        if (!['pending_acceptance', 'accepted', 'in_progress'].includes(c.status)) return false;
      } else if (connFilter === 'completed') {
        if (c.status !== 'completed') return false;
      } else if (connFilter === 'rejected') {
        if (c.status !== 'rejected') return false;
      }

      if (connSearch) {
        const q = connSearch.toLowerCase();
        return (
          (c.userName || '').toLowerCase().includes(q) ||
          (c.requestTitle || '').toLowerCase().includes(q) ||
          (c.location || '').toLowerCase().includes(q) ||
          (c.category || '').toLowerCase().includes(q) ||
          (c._id || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [connections, connFilter, connSearch]);

  // Filtering for Notifications
  const filteredNotifications = useMemo(() => {
    if (notifFilter === 'unread') {
      return notificationsList.filter((n) => !n.isRead);
    }
    return notificationsList;
  }, [notificationsList, notifFilter]);

  // Available categories based on active role type
  const activeTaxonomy =
    currentRoleType === 'entrepreneur' ? DEFAULT_ENTREPRENEUR_CATS : DEFAULT_BUSINESSMAN_CATS;

  const currentCategoryObj = activeTaxonomy.find((c) => c.name === profileForm.category);
  const availableSubcategories = currentCategoryObj?.subcategories || [];

  const isApproved =
    business?.verificationStatus === 'approved' ||
    user?.roleApprovals?.[currentRoleType] === 'approved';

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-500">Loading Business Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. TOP HEADER & MULTI-ROLE SWITCHER */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                {currentRoleType === 'entrepreneur' ? (
                  <Rocket className="w-6 h-6" />
                ) : (
                  <Building2 className="w-6 h-6" />
                )}
              </span>
              <div>
                <h1 className="text-2xl font-black text-navy-950 tracking-tight flex items-center gap-2">
                  <span>Business Dashboard</span>
                  <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {currentRoleType === 'entrepreneur' ? 'Entrepreneur' : 'Businessman'}
                  </span>
                </h1>
                <p className="text-xs text-slate-500">
                  Manage assigned service requests, business connections, product catalogs, and verified profile.
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details & Quick Status */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-extrabold text-navy-950 truncate max-w-[200px]">
                {business?.businessName || (currentRoleType === 'entrepreneur' ? 'My Startup' : 'My Business')}
              </p>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    isApproved ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                <span className="text-[11px] font-bold text-slate-500 capitalize">
                  {business?.verificationStatus || 'Pending Approval'}
                </span>
              </div>
            </div>

            <button
              onClick={() => loadDashboardData(currentRoleType)}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-navy-950 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* ROLE SWITCHER: Only show if user has BOTH roles approved */}
        {hasBothApprovedRoles && (
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-4 rounded-2xl border border-blue-100/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <p className="text-xs font-black text-navy-950 uppercase tracking-wide">
                  Active Business Profile Switcher
                </p>
                <p className="text-[11px] text-slate-500">
                  You have verified profiles for both roles. Toggle to manage each enterprise independently.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleSwitchProfile('businessman')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentRoleType === 'businessman'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-extrabold'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Businessman Profile</span>
                {currentRoleType === 'businessman' && <Check className="w-3.5 h-3.5 ml-1" />}
              </button>

              <button
                type="button"
                onClick={() => handleSwitchProfile('entrepreneur')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentRoleType === 'entrepreneur'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-extrabold'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Entrepreneur Profile</span>
                {currentRoleType === 'entrepreneur' && <Check className="w-3.5 h-3.5 ml-1" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. TAB CONTENT ROUTER */}
      {activeTab === 'overview' && (
        <OverviewModule
          metrics={metrics}
          requests={requests}
          connections={connections}
          business={business}
          currentRoleType={currentRoleType}
          onNavigateTab={handleTabChange}
          onViewRequest={(req) => setViewRequestModal(req)}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileModule
          business={business}
          currentRoleType={currentRoleType}
          isApproved={isApproved}
          docChecklist={docChecklist}
          onEditOpen={() => setEditProfileOpen(true)}
          onRefresh={() => loadDashboardData(currentRoleType)}
        />
      )}

      {activeTab === 'requests' && (
        <RequestsModule
          requests={filteredRequests}
          totalCount={requests.length}
          activeFilter={requestFilter}
          setFilter={setRequestFilter}
          searchQuery={requestSearch}
          setSearchQuery={setRequestSearch}
          onViewRequest={(req) => setViewRequestModal(req)}
          onAcceptRequest={handleAcceptRequest}
          onOpenReject={(req) => {
            setRejectModal(req);
            setRejectReason('');
          }}
          onOpenProgress={(req) => {
            setProgressModal(req);
            setProgressStatus(req.status === 'accepted' ? 'in_progress' : req.status);
            setProgressNote('');
          }}
          actionLoading={actionLoading}
        />
      )}

      {activeTab === 'connections' && (
        <ConnectionsModule
          connections={filteredConnections}
          totalCount={connections.length}
          activeFilter={connFilter}
          setFilter={setConnFilter}
          searchQuery={connSearch}
          setSearchQuery={setConnSearch}
          onViewRequest={(requestId) => {
            const found = requests.find((r) => r._id === requestId);
            if (found) setViewRequestModal(found);
            else alert(`Request ID: ${requestId}`);
          }}
        />
      )}

      {activeTab === 'products' && (
        <ProductsServicesModule
          products={products}
          services={services}
          isApproved={isApproved}
          subTab={catalogSubTab}
          setSubTab={setCatalogSubTab}
          onOpenAddProduct={() => {
            setEditingProduct(null);
            setProdForm({
              title: '',
              category: 'Construction Materials',
              price: '',
              stock: '10',
              description: '',
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
            });
            setProdModalOpen(true);
          }}
          onOpenEditProduct={(prod) => {
            setEditingProduct(prod);
            setProdForm({
              title: prod.title,
              category: prod.category,
              price: String(prod.price),
              stock: String(prod.stock),
              description: prod.description || '',
              image: prod.images?.[0] || '',
            });
            setProdModalOpen(true);
          }}
          onDeleteProduct={handleDeleteProduct}
          onOpenAddService={() => {
            setEditingService(null);
            setServForm({
              name: '',
              category: 'Engineering & Architecture',
              pricingType: 'fixed',
              price: '',
              serviceArea: 'Regional / On-site',
              description: '',
            });
            setServModalOpen(true);
          }}
          onOpenEditService={(serv) => {
            setEditingService(serv);
            setServForm({
              name: serv.name || serv.title,
              category: serv.category,
              pricingType: serv.pricingType || 'fixed',
              price: serv.price ? String(serv.price) : '',
              serviceArea: serv.serviceArea || '',
              description: serv.description || '',
            });
            setServModalOpen(true);
          }}
          onDeleteService={handleDeleteService}
        />
      )}

      {activeTab === 'notifications' && (
        <NotificationsModule
          notifications={filteredNotifications}
          activeFilter={notifFilter}
          setFilter={setNotifFilter}
          onMarkRead={handleMarkNotifRead}
          onMarkAllRead={handleMarkAllNotifs}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsModule
          user={user}
          business={business}
          currentRoleType={currentRoleType}
          passForm={passForm}
          setPassForm={setPassForm}
          passMessage={passMessage}
          onChangePassword={handleChangePassword}
          notifPrefs={notifPrefs}
          setNotifPrefs={setNotifPrefs}
          onEditProfile={() => setEditProfileOpen(true)}
        />
      )}

      {/* 3. MODALS */}

      {/* View Request Details Modal */}
      {viewRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded bg-blue-50 text-blue-700">
                  Request #{viewRequestModal._id}
                </span>
                <h3 className="text-xl font-black text-navy-950">{viewRequestModal.title}</h3>
              </div>
              <button
                onClick={() => setViewRequestModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-navy-950 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="font-extrabold uppercase text-slate-400 text-[10px]">Customer Name</p>
                <p className="font-bold text-navy-950 text-sm">{viewRequestModal.userName}</p>
                <p className="text-slate-500">{viewRequestModal.userMobile || 'Contact revealed on connection'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="font-extrabold uppercase text-slate-400 text-[10px]">Location & Area</p>
                <p className="font-bold text-navy-950 text-sm flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  {viewRequestModal.location}
                </p>
                <p className="text-slate-500">{viewRequestModal.address || 'Address on file'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="font-extrabold uppercase text-slate-400 text-[10px]">Category & Type</p>
                <p className="font-bold text-navy-950 text-sm">{viewRequestModal.category}</p>
                <p className="text-slate-500">{viewRequestModal.requestType || 'Service'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="font-extrabold uppercase text-slate-400 text-[10px]">Current Status</p>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded text-xs font-extrabold uppercase ${
                    viewRequestModal.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : viewRequestModal.status === 'in_progress'
                      ? 'bg-indigo-100 text-indigo-800'
                      : viewRequestModal.status === 'accepted'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {viewRequestModal.status}
                </span>
                <p className="text-[11px] text-slate-500">
                  {new Date(viewRequestModal.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-400">Request Requirements & Description</h4>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {viewRequestModal.description || 'No detailed specifications provided.'}
              </div>
            </div>

            {/* Request Timeline */}
            {viewRequestModal.timeline && viewRequestModal.timeline.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-400">Timeline & Activity History</h4>
                <div className="space-y-2 border-l-2 border-blue-500/30 pl-4 py-1 ml-2">
                  {viewRequestModal.timeline.map((entry, idx) => (
                    <div key={idx} className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-navy-950 capitalize">{entry.status}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{entry.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewRequestModal(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-navy-950 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                Decline Request
              </h3>
              <button onClick={() => setRejectModal(null)} className="p-1 text-slate-400 hover:text-navy-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Please state why your business cannot fulfill{' '}
              <strong className="text-navy-950">{rejectModal.title}</strong>. This request will return to the Admin
              for reassignment.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Reason for Rejection *
                </label>
                <textarea
                  required
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Currently at maximum capacity, material out of stock, location out of service range..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Submitting...' : 'Confirm Decline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Progress / Completion Modal */}
      {progressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-navy-950 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Update Request Progress
              </h3>
              <button onClick={() => setProgressModal(null)} className="p-1 text-slate-400 hover:text-navy-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProgressSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status Step *</label>
                <select
                  value={progressStatus}
                  onChange={(e) => setProgressStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
                >
                  <option value="in_progress">In Progress (Execution / Supply ongoing)</option>
                  <option value="completed">Completed (Work finished / Material delivered)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Progress Note or Delivery Summary
                </label>
                <textarea
                  rows={3}
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                  placeholder="e.g. Raw materials dispatched, site inspection scheduled, project handed over..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setProgressModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Updating...' : 'Save Progress'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-navy-950 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  Edit {currentRoleType === 'entrepreneur' ? 'Entrepreneur Startup' : 'Businessman Enterprise'} Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Update your official profile information displayed to clients and verified by platform admins.
                </p>
              </div>
              <button
                onClick={() => setEditProfileOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-navy-950 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
              {/* Common Name & Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    {currentRoleType === 'entrepreneur' ? 'Startup / Venture Name *' : 'Business / Enterprise Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.businessName}
                    onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    {currentRoleType === 'entrepreneur' ? 'Startup Category *' : 'Business Category *'}
                  </label>
                  <select
                    value={profileForm.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const catObj = activeTaxonomy.find((c) => c.name === newCat);
                      setProfileForm({
                        ...profileForm,
                        category: newCat,
                        subcategory: catObj?.subcategories?.[0] || '',
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Category</option>
                    {activeTaxonomy.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Subcategory *</label>
                  <select
                    value={profileForm.subcategory}
                    onChange={(e) => setProfileForm({ ...profileForm, subcategory: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Subcategory</option>
                    {availableSubcategories.map((sub, idx) => (
                      <option key={idx} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    {currentRoleType === 'entrepreneur' ? 'Registration / Entity Type' : 'Business Type *'}
                  </label>
                  <select
                    value={profileForm.businessType}
                    onChange={(e) => setProfileForm({ ...profileForm, businessType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Type</option>
                    {(currentRoleType === 'entrepreneur' ? STARTUP_REGISTRATION_TYPES : BUSINESS_TYPES).map(
                      (t, idx) => (
                        <option key={idx} value={t}>
                          {t}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Dynamic Entrepreneur Fields */}
              {currentRoleType === 'entrepreneur' && (
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-4">
                  <h4 className="font-extrabold uppercase text-indigo-900 text-[11px] flex items-center gap-1.5">
                    <Rocket className="w-4 h-4 text-indigo-600" />
                    Startup Specific Innovation Profile
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Startup Stage</label>
                      <select
                        value={profileForm.stage}
                        onChange={(e) => setProfileForm({ ...profileForm, stage: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="">Select Stage</option>
                        {STARTUP_STAGES.map((s, idx) => (
                          <option key={idx} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Business Model</label>
                      <select
                        value={profileForm.businessModel}
                        onChange={(e) => setProfileForm({ ...profileForm, businessModel: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="">Select Model</option>
                        {BUSINESS_MODELS.map((m, idx) => (
                          <option key={idx} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Problem Statement</label>
                      <textarea
                        rows={2}
                        value={profileForm.problemStatement}
                        onChange={(e) => setProfileForm({ ...profileForm, problemStatement: e.target.value })}
                        placeholder="What problem does your startup solve?"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Solution Description</label>
                      <textarea
                        rows={2}
                        value={profileForm.solutionDescription}
                        onChange={(e) => setProfileForm({ ...profileForm, solutionDescription: e.target.value })}
                        placeholder="How does your product/technology solve it?"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Target Market</label>
                      <input
                        type="text"
                        value={profileForm.targetMarket}
                        onChange={(e) => setProfileForm({ ...profileForm, targetMarket: e.target.value })}
                        placeholder="e.g. Tier 1 Cities, MSMEs, Gen-Z"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Pitch Deck Link / URL</label>
                      <input
                        type="url"
                        value={profileForm.pitchDeckUrl}
                        onChange={(e) => setProfileForm({ ...profileForm, pitchDeckUrl: e.target.value })}
                        placeholder="https://drive.google.com/..."
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Description & Products/Services */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  {currentRoleType === 'entrepreneur' ? 'Startup Overview / Mission' : 'Business Description'}
                </label>
                <textarea
                  rows={3}
                  value={profileForm.description}
                  onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                  placeholder="Describe your capabilities, history, and key offerings..."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Products and Services (Comma-separated)
                </label>
                <input
                  type="text"
                  value={profileForm.productsServices}
                  onChange={(e) => setProfileForm({ ...profileForm, productsServices: e.target.value })}
                  placeholder="e.g. Cement Supplies, Structural Consulting, Heavy Machinery Logistics"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Address & Operating Locations */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-extrabold uppercase text-slate-400 text-[10px]">
                  {currentRoleType === 'entrepreneur' ? 'Startup Base & Coverage' : 'Business Address & Locations'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={profileForm.street}
                      onChange={(e) => setProfileForm({ ...profileForm, street: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">State / Postal Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="State"
                        value={profileForm.state}
                        onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                        className="w-2/3 p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="PIN"
                        value={profileForm.postalCode}
                        onChange={(e) => setProfileForm({ ...profileForm, postalCode: e.target.value })}
                        className="w-1/3 p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Operating Locations / Delivery Areas (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={profileForm.operatingLocations}
                    onChange={(e) => setProfileForm({ ...profileForm, operatingLocations: e.target.value })}
                    placeholder="e.g. Mumbai, Navi Mumbai, Pune, Thane"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Phone</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={profileForm.website}
                    onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {prodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-navy-950 flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-600" />
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setProdModalOpen(false)} className="p-1 text-slate-400 hover:text-navy-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={prodForm.title}
                  onChange={(e) => setProdForm({ ...prodForm, title: e.target.value })}
                  placeholder="e.g. UltraTech Super Cement 50kg Bag"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Available Stock *</label>
                  <input
                    type="number"
                    required
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Image URL</label>
                  <input
                    type="url"
                    value={prodForm.image}
                    onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  placeholder="Specifications, grades, delivery details..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setProdModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : editingProduct ? 'Update Product' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {servModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-navy-950 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setServModalOpen(false)} className="p-1 text-slate-400 hover:text-navy-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Service Title / Name *</label>
                <input
                  type="text"
                  required
                  value={servForm.name}
                  onChange={(e) => setServForm({ ...servForm, name: e.target.value })}
                  placeholder="e.g. Civil Engineering Site Consultation"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={servForm.category}
                    onChange={(e) => setServForm({ ...servForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Pricing (₹ or hourly)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={servForm.price}
                    onChange={(e) => setServForm({ ...servForm, price: e.target.value })}
                    placeholder="e.g. 5000"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Service Area / Coverage</label>
                <input
                  type="text"
                  value={servForm.serviceArea}
                  onChange={(e) => setServForm({ ...servForm, serviceArea: e.target.value })}
                  placeholder="e.g. Mumbai Metropolitan Region, On-site"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Service Description</label>
                <textarea
                  rows={3}
                  value={servForm.description}
                  onChange={(e) => setServForm({ ...servForm, description: e.target.value })}
                  placeholder="Scope of work, deliverables, timeline..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setServModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : editingService ? 'Update Service' : 'Publish Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MODULE A: DASHBOARD OVERVIEW                                               */
/* -------------------------------------------------------------------------- */
const OverviewModule = ({ metrics, requests, connections, business, currentRoleType, onNavigateTab, onViewRequest }) => {
  const isApproved = business?.verificationStatus === 'approved';

  // 7 Metrics Cards
  const cards = [
    {
      title: 'Total Requests',
      value: metrics.totalRequests,
      sub: 'All assigned requests',
      icon: FileText,
      gradient: 'from-blue-600 to-indigo-700',
      badge: 'Lifetime',
    },
    {
      title: 'New Requests',
      value: metrics.newRequests,
      sub: 'Newly assigned by admin',
      icon: PlusCircle,
      gradient: 'from-amber-500 to-orange-600',
      badge: 'Action Needed',
    },
    {
      title: 'Pending Responses',
      value: metrics.pendingResponses,
      sub: 'Awaiting your accept/reject',
      icon: Clock,
      gradient: 'from-yellow-500 to-amber-600',
      badge: 'Urgent',
    },
    {
      title: 'Accepted Requests',
      value: metrics.acceptedRequests,
      sub: 'Accepted, prep ongoing',
      icon: CheckCircle2,
      gradient: 'from-sky-500 to-blue-600',
      badge: 'Active',
    },
    {
      title: 'In Progress',
      value: metrics.inProgressRequests,
      sub: 'Fulfillment underway',
      icon: TrendingUp,
      gradient: 'from-purple-600 to-indigo-700',
      badge: 'Underway',
    },
    {
      title: 'Completed Requests',
      value: metrics.completedRequests,
      sub: 'Successfully finished',
      icon: PackageCheck,
      gradient: 'from-emerald-500 to-teal-700',
      badge: 'Finished',
    },
    {
      title: 'Business Connections',
      value: metrics.totalConnections,
      sub: 'Connected client relationships',
      icon: Users,
      gradient: 'from-teal-600 to-cyan-700',
      badge: 'Network',
    },
  ];

  // Request status breakdown for interactive bar chart
  const statusCounts = [
    { label: 'New', count: metrics.newRequests, color: 'bg-amber-500' },
    { label: 'Pending', count: metrics.pendingResponses, color: 'bg-yellow-500' },
    { label: 'Accepted', count: metrics.acceptedRequests, color: 'bg-blue-500' },
    { label: 'In Progress', count: metrics.inProgressRequests, color: 'bg-purple-500' },
    { label: 'Completed', count: metrics.completedRequests, color: 'bg-emerald-500' },
    { label: 'Rejected', count: metrics.rejectedRequests, color: 'bg-rose-500' },
  ];
  const maxStatusCount = Math.max(...statusCounts.map((s) => s.count), 1);

  // Recent Activity from combined requests & connections
  const recentActivities = requests.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Verification Status Banner if not approved */}
      {!isApproved && (
        <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <p className="font-extrabold text-sm">Account Status: Under Admin Review</p>
              <p className="text-xs text-amber-800">
                Your submitted documents are undergoing verification. You can view assigned requests, but publishing
                new marketplace listings requires final Admin approval.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('profile')}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-600/20 hover:bg-amber-700 shrink-0"
          >
            Check Verification Status
          </button>
        </div>
      )}

      {/* 7 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {c.badge}
                </span>
                <div
                  className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${c.gradient} text-white flex items-center justify-center shadow-md`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-navy-950 tracking-tight">{c.value}</p>
              <p className="text-xs font-bold text-slate-700 mt-1">{c.title}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{c.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts & Status Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Request Status Distribution Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-navy-950 uppercase tracking-wider">
                Request Pipeline Distribution
              </h3>
              <p className="text-xs text-slate-500">Live breakdown of customer requests by operational status</p>
            </div>
            <button
              onClick={() => onNavigateTab('requests')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Manage Requests <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Distribution Bars */}
          <div className="space-y-3 pt-2">
            {statusCounts.map((s, idx) => {
              const pct = metrics.totalRequests > 0 ? Math.round((s.count / metrics.totalRequests) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                      {s.label}
                    </span>
                    <span className="text-slate-400 font-semibold">
                      {s.count} requests ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${s.color} rounded-full transition-all duration-500`}
                      style={{ width: `${(s.count / maxStatusCount) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* SVG Trend Banner */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-bold text-navy-950">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              High conversion rate on assigned requests
            </span>
            <span>Total Assigned: {metrics.totalRequests}</span>
          </div>
        </div>

        {/* Right: Quick Operational Shortcuts */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-black text-navy-950 uppercase tracking-wider">Quick Actions</h3>
            <p className="text-xs text-slate-500">Direct shortcuts to frequent business actions</p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => onNavigateTab('requests')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold">Review Assigned Requests</span>
                </div>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white text-navy-950 border border-slate-200">
                  {metrics.pendingResponses}
                </span>
              </button>

              <button
                onClick={() => onNavigateTab('connections')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 hover:text-teal-700 text-slate-700 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold">Customer Connections</span>
                </div>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white text-navy-950 border border-slate-200">
                  {metrics.totalConnections}
                </span>
              </button>

              <button
                onClick={() => onNavigateTab('products')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-amber-50 hover:text-amber-700 text-slate-700 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Store className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold">Showcase Products / Services</span>
                </div>
                <PlusCircle className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateTab('profile')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 text-slate-700 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold">Manage Enterprise Profile</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-navy-950 to-slate-900 text-white space-y-2 mt-4">
            <p className="text-[11px] font-extrabold uppercase text-amber-400 tracking-wider">
              {currentRoleType === 'entrepreneur' ? 'Startup Ecosystem' : 'Contractor Network'}
            </p>
            <p className="text-xs text-slate-300 leading-snug">
              Every request assigned to you has been verified by the Business Hub Admin team. Respond promptly to build
              trust.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-navy-950 uppercase tracking-wider">Recent Activity & Feed</h3>
            <p className="text-xs text-slate-500">Latest requests assigned to your business account</p>
          </div>
          <button
            onClick={() => onNavigateTab('requests')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View All ({requests.length})
          </button>
        </div>

        {recentActivities.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">No requests assigned yet</p>
            <p className="text-[11px] text-slate-400">
              When the Admin matches customer requirements with your profile, they will appear here immediately.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentActivities.map((req) => (
              <div
                key={req._id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-2xl transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      #{req._id}
                    </span>
                    <h4 className="font-bold text-navy-950 text-xs">{req.title}</h4>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        req.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'in_progress'
                          ? 'bg-purple-100 text-purple-800'
                          : req.status === 'accepted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-3">
                    <span>Customer: {req.userName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {req.location}
                    </span>
                    <span>•</span>
                    <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onViewRequest(req)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-white"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MODULE B: BUSINESS PROFILE                                                 */
/* -------------------------------------------------------------------------- */
const ProfileModule = ({ business, currentRoleType, isApproved, docChecklist, onEditOpen, onRefresh }) => {
  const isEntrepreneur = currentRoleType === 'entrepreneur';
  const addr = business?.address || {};

  return (
    <div className="space-y-6">
      {/* Top Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xl shadow-md">
              {business?.businessName?.charAt(0) || (isEntrepreneur ? 'E' : 'B')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-navy-950">
                  {business?.businessName || (isEntrepreneur ? 'My Startup' : 'My Business')}
                </h2>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {business?.verificationStatus || 'Draft'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {business?.category || 'General'} • {business?.subcategory || 'Specialist'}
              </p>
            </div>
          </div>

          <button
            onClick={onEditOpen}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile Details</span>
          </button>
        </div>

        {/* Dynamic Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {/* 1. Entity & Category info */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-3">
            <h4 className="font-extrabold uppercase text-slate-400 text-[10px] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              Entity Classification
            </h4>
            <div className="space-y-1.5">
              <div>
                <span className="text-slate-400 block text-[10px]">
                  {isEntrepreneur ? 'Registration Type' : 'Business Type'}
                </span>
                <span className="font-bold text-navy-950">{business?.businessType || 'Standard Registered'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Category & Subcategory</span>
                <span className="font-bold text-navy-950">
                  {business?.category || 'N/A'} • {business?.subcategory || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Operating Since / Created</span>
                <span className="font-bold text-navy-950">
                  {business?.createdAt ? new Date(business.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Entrepreneur specific fields or Businessman trade fields */}
          {isEntrepreneur ? (
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
              <h4 className="font-extrabold uppercase text-indigo-900 text-[10px] flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-indigo-600" />
                Startup Innovation Metrics
              </h4>
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-400 block text-[10px]">Startup Stage</span>
                  <span className="font-bold text-navy-950">{business?.stage || 'Ideation / Concept'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Business Model</span>
                  <span className="font-bold text-navy-950">{business?.businessModel || 'B2B / SaaS'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Target Market</span>
                  <span className="font-bold text-navy-950">{business?.targetMarket || 'Pan-India Enterprise'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-3">
              <h4 className="font-extrabold uppercase text-slate-400 text-[10px] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                Trade & Operations
              </h4>
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-400 block text-[10px]">GST / Tax Identification</span>
                  <span className="font-bold text-navy-950">{business?.taxId || 'Submitted on Verification'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Operating Locations</span>
                  <span className="font-bold text-navy-950">
                    {Array.isArray(business?.operatingLocations)
                      ? business.operatingLocations.join(', ')
                      : business?.operatingLocations || 'Regional Hub'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Website / Online Presence</span>
                  <span className="font-bold text-blue-600 truncate block">
                    {business?.website ? (
                      <a href={business.website} target="_blank" rel="noreferrer" className="hover:underline">
                        {business.website}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. Official Contact & Address */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-3">
            <h4 className="font-extrabold uppercase text-slate-400 text-[10px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              Headquarters & Contact
            </h4>
            <div className="space-y-1.5">
              <div>
                <span className="text-slate-400 block text-[10px]">Official Address</span>
                <span className="font-bold text-navy-950">
                  {typeof addr === 'object'
                    ? `${addr.street || ''} ${addr.city || ''} ${addr.state || ''} ${addr.postalCode || ''}`.trim() ||
                      'Address on file'
                    : String(addr || 'Address on file')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Official Phone & Email</span>
                <span className="font-bold text-navy-950 block">{business?.phone || 'N/A'}</span>
                <span className="text-slate-500 block truncate">{business?.email || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Description */}
        <div className="space-y-2">
          <h4 className="font-extrabold uppercase text-slate-400 text-[10px]">
            {isEntrepreneur ? 'Startup Mission & Description' : 'Business Description'}
          </h4>
          <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed whitespace-pre-line">
            {business?.description || 'No description entered yet. Click "Edit Profile Details" to add your company story.'}
          </p>
        </div>

        {/* Products and Services Tags */}
        <div className="space-y-2">
          <h4 className="font-extrabold uppercase text-slate-400 text-[10px]">Products & Services Handled</h4>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(business?.productsServices)
              ? business.productsServices
              : (business?.productsServices || '').split(',')
            )
              .map((p) => p.trim())
              .filter(Boolean).length === 0 ? (
              <span className="text-xs text-slate-400 italic">No products or services listed.</span>
            ) : (
              (Array.isArray(business?.productsServices)
                ? business.productsServices
                : (business?.productsServices || '').split(',')
              )
                .map((p) => p.trim())
                .filter(Boolean)
                .map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold"
                  >
                    {tag}
                  </span>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Verification Documents Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-navy-950 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Mandatory Documents
            </h3>
            <p className="text-xs text-slate-500">
              Government identification, licenses, and registration proofs verified by platform compliance
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
              isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {business?.verificationStatus || 'Draft'}
          </span>
        </div>

        {docChecklist ? (
          <DocumentVerificationPanel
            checklistData={docChecklist}
            roles={[currentRoleType]}
            isPostSubmission={true}
            onChecklistUpdated={onRefresh}
          />
        ) : (
          <div className="py-6 text-center text-xs text-slate-400">Loading document verification slots...</div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MODULE C: SERVICE REQUESTS                                                 */
/* -------------------------------------------------------------------------- */
const RequestsModule = ({
  requests,
  totalCount,
  activeFilter,
  setFilter,
  searchQuery,
  setSearchQuery,
  onViewRequest,
  onAcceptRequest,
  onOpenReject,
  onOpenProgress,
  actionLoading,
}) => {
  const filterTabs = [
    { key: 'all', label: 'All Requests' },
    { key: 'new', label: 'New' },
    { key: 'pending_responses', label: 'Pending Responses' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
    { key: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-navy-950 tracking-tight flex items-center gap-2">
            <span>Service Requests Assigned to Your Business</span>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {totalCount} Total
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Accept or decline new requests, track in-progress work, and update customer progress.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, customer, location..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 no-scrollbar">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeFilter === tab.key
                ? 'bg-navy-950 text-white shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="py-16 text-center space-y-2">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No service requests match this filter.</p>
          <p className="text-xs text-slate-400">
            {searchQuery ? 'Try clearing your search query' : 'New requests assigned by Admin will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const isAssignedPending = req.status === 'assigned' || req.status === 'pending_acceptance';
            const isAccepted = req.status === 'accepted';
            const isInProgress = req.status === 'in_progress';
            const isCompleted = req.status === 'completed';
            const isRejected = req.status === 'rejected';

            return (
              <div
                key={req._id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all space-y-3 bg-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      #{req._id}
                    </span>
                    <h3 className="font-extrabold text-navy-950 text-sm">{req.title}</h3>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isInProgress
                          ? 'bg-purple-100 text-purple-800'
                          : isAccepted
                          ? 'bg-blue-100 text-blue-800'
                          : isRejected
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-semibold">
                    Received: {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Customer</span>
                    <span className="font-bold text-navy-950">{req.userName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Location</span>
                    <span className="font-bold text-navy-950 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      {req.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Category</span>
                    <span className="font-bold text-navy-950">{req.category}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">{req.description}</p>

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onViewRequest(req)}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Full Details & History</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {/* If Assigned/Pending: Accept or Reject */}
                    {isAssignedPending && (
                      <>
                        <button
                          disabled={actionLoading}
                          onClick={() => onOpenReject(req)}
                          className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                        >
                          Decline Request
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => onAcceptRequest(req._id)}
                          className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Request</span>
                        </button>
                      </>
                    )}

                    {/* If Accepted or In Progress: Update Progress */}
                    {(isAccepted || isInProgress) && (
                      <button
                        onClick={() => onOpenProgress(req)}
                        className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm shadow-purple-500/20 transition-all flex items-center gap-1.5"
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Update Progress / Mark Complete</span>
                      </button>
                    )}

                    {isCompleted && (
                      <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Fulfillment Finished
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MODULE D: BUSINESS CONNECTIONS                                             */
/* -------------------------------------------------------------------------- */
const ConnectionsModule = ({
  connections,
  totalCount,
  activeFilter,
  setFilter,
  searchQuery,
  setSearchQuery,
  onViewRequest,
}) => {
  const filterTabs = [
    { key: 'all', label: 'All Connections' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-navy-950 tracking-tight flex items-center gap-2">
            <span>Customer Business Connections</span>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
              {totalCount} Total
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Direct client connections created upon request assignment. Direct contact info is unlocked below.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search connections..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 no-scrollbar">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeFilter === tab.key
                ? 'bg-navy-950 text-white shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {connections.length === 0 ? (
        <div className="py-16 text-center space-y-2">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No business connections found.</p>
          <p className="text-xs text-slate-400">
            Connections are established as soon as Admin connects you with a customer request.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connections.map((conn) => (
            <div
              key={conn._id}
              className="p-5 rounded-2xl border border-slate-200/90 hover:border-teal-300 hover:shadow-md transition-all bg-white space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Connection #{conn._id}
                  </span>
                  <h3 className="font-extrabold text-navy-950 text-sm mt-1">{conn.userName}</h3>
                  <p className="text-xs text-slate-500">Service: {conn.requestTitle}</p>
                </div>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    conn.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : conn.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  {conn.status}
                </span>
              </div>

              {/* Direct Unlocked Contact */}
              <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-100 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    {conn.userMobile ? (
                      <a href={`tel:${conn.userMobile}`} className="font-bold text-navy-950 hover:underline">
                        {conn.userMobile}
                      </a>
                    ) : (
                      'Phone on file'
                    )}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-bold text-navy-950">{conn.location}</span>
                  </span>
                </div>
                {conn.userEmail && (
                  <div className="flex items-center gap-1.5 text-slate-500 truncate">
                    <Mail className="w-3.5 h-3.5 text-teal-600" />
                    <a href={`mailto:${conn.userEmail}`} className="font-bold text-navy-950 hover:underline">
                      {conn.userEmail}
                    </a>
                  </div>
                )}
              </div>

              {/* Timeline / notes */}
              {conn.assignmentNotes && (
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <strong className="text-navy-950">Admin Note:</strong> {conn.assignmentNotes}
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-slate-400 text-[11px]">
                  Connected: {new Date(conn.assignedAt || conn.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => onViewRequest(conn.requestId)}
                  className="font-bold text-teal-700 hover:underline flex items-center gap-1"
                >
                  View Request Details <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MODULE E: PRODUCTS & SERVICES                                              */
/* -------------------------------------------------------------------------- */
const ProductsServicesModule = ({
  products,
  services,
  isApproved,
  subTab,
  setSubTab,
  onOpenAddProduct,
  onOpenEditProduct,
  onDeleteProduct,
  onOpenAddService,
  onOpenEditService,
  onDeleteService,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
      {/* Warning if unapproved */}
      {!isApproved && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Only verified businesses approved by Admin can publish products or services to the public marketplace.
          </span>
        </div>
      )}

      {/* Header & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'products'
                ? 'bg-blue-600 text-white font-extrabold shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Products Catalog ({products.length})
          </button>
          <button
            onClick={() => setSubTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'services'
                ? 'bg-blue-600 text-white font-extrabold shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Services Catalog ({services.length})
          </button>
        </div>

        {subTab === 'products' ? (
          <button
            onClick={onOpenAddProduct}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-950 text-white hover:bg-navy-900 text-xs font-bold shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Add New Product</span>
          </button>
        ) : (
          <button
            onClick={onOpenAddService}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-950 text-white hover:bg-navy-900 text-xs font-bold shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Add New Service</span>
          </button>
        )}
      </div>

      {/* Products Tab View */}
      {subTab === 'products' && (
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Store className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No products added yet.</p>
              <p className="text-xs text-slate-400">Add physical materials or supplies to showcase in the catalog.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm flex flex-col justify-between"
                >
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'}
                    alt={p.title}
                    className="w-full h-36 object-cover bg-slate-100"
                  />
                  <div className="p-4 space-y-2 flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {p.category}
                      </span>
                      <span className="font-black text-navy-950 text-sm">₹{p.price}</span>
                    </div>
                    <h4 className="font-bold text-navy-950 text-xs line-clamp-1">{p.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{p.description}</p>
                    <p className="text-[10px] text-slate-400 font-bold">Stock Available: {p.stock} units</p>
                  </div>
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onOpenEditProduct(p)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-navy-950 hover:bg-slate-200"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(p._id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Services Tab View */}
      {subTab === 'services' && (
        <div className="space-y-4">
          {services.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No services added yet.</p>
              <p className="text-xs text-slate-400">
                Publish professional, engineering, contracting, or IT services.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((s) => (
                <div
                  key={s._id}
                  className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                        {s.category}
                      </span>
                      {s.price && <span className="font-black text-navy-950 text-sm">₹{s.price}</span>}
                    </div>
                    <h4 className="font-bold text-navy-950 text-xs">{s.name || s.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{s.description}</p>
                    {s.serviceArea && (
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        {s.serviceArea}
                      </p>
                    )}
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onOpenEditService(s)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-navy-950 hover:bg-slate-100"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteService(s._id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MODULE F: NOTIFICATIONS                                                    */
/* -------------------------------------------------------------------------- */
const NotificationsModule = ({ notifications, activeFilter, setFilter, onMarkRead, onMarkAllRead }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-navy-950 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <span>Business Alerts & Notifications</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time notifications for assigned requests, customer connections, and verification status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter(activeFilter === 'all' ? 'unread' : 'all')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            {activeFilter === 'all' ? 'Show Unread' : 'Show All'}
          </button>
          <button
            onClick={onMarkAllRead}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="py-16 text-center space-y-2">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No notifications in your inbox.</p>
          <p className="text-xs text-slate-400">You are all caught up!</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-2xl flex items-start justify-between gap-4 transition-colors ${
                !n.isRead ? 'bg-blue-50/50' : 'hover:bg-slate-50/60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-navy-950 text-xs">{n.title}</h4>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <p className="text-xs text-slate-600">{n.message}</p>
                <span className="text-[10px] text-slate-400 block">{new Date(n.createdAt).toLocaleString()}</span>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => onMarkRead(n._id)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-white shrink-0"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MODULE G: SETTINGS                                                         */
/* -------------------------------------------------------------------------- */
const SettingsModule = ({
  user,
  business,
  currentRoleType,
  passForm,
  setPassForm,
  passMessage,
  onChangePassword,
  notifPrefs,
  setNotifPrefs,
  onEditProfile,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Account Details */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-navy-950 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          Account & Owner Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Owner Full Name</span>
            <span className="font-bold text-navy-950 text-sm">{user?.fullName}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Account Email</span>
            <span className="font-bold text-navy-950 text-sm truncate block">{user?.email}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Primary Mobile</span>
            <span className="font-bold text-navy-950 text-sm">{user?.mobile}</span>
          </div>
        </div>
      </div>

      {/* 2. Business Profile Quick Settings */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-navy-950 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-500" />
              Business Profile Settings
            </h3>
            <p className="text-xs text-slate-500">Quick updates to your registered business entity</p>
          </div>
          <button
            onClick={onEditProfile}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
          >
            Edit All Profile Fields
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Trading Name</span>
            <p className="font-bold text-navy-950">{business?.businessName || 'N/A'}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Verification Tier</span>
            <p className="font-bold text-emerald-600 capitalize">
              {business?.verificationStatus === 'approved' ? 'Verified Partner' : 'Verification Under Review'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Password Change Form */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-navy-950 uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-purple-600" />
          Change Password
        </h3>

        {passMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              passMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {passMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{passMessage.text}</span>
          </div>
        )}

        <form onSubmit={onChangePassword} className="space-y-4 max-w-lg text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Current Password *</label>
            <input
              type="password"
              required
              value={passForm.currentPassword}
              onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">New Password *</label>
              <input
                type="password"
                required
                value={passForm.newPassword}
                onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Confirm New Password *</label>
              <input
                type="password"
                required
                value={passForm.confirmPassword}
                onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* 4. Notification Preferences */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-navy-950 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          Notification Preferences
        </h3>

        <div className="space-y-3 max-w-xl text-xs">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <p className="font-bold text-navy-950">Email Notifications for New Requests</p>
              <p className="text-slate-400 text-[11px]">Receive email alerts as soon as an Admin matches a request</p>
            </div>
            <input
              type="checkbox"
              checked={notifPrefs.requestAlerts}
              onChange={(e) => setNotifPrefs({ ...notifPrefs, requestAlerts: e.target.checked })}
              className="rounded text-blue-600 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <p className="font-bold text-navy-950">Customer Connection Alerts</p>
              <p className="text-slate-400 text-[11px]">Notifications when direct client contact is established</p>
            </div>
            <input
              type="checkbox"
              checked={notifPrefs.connectionAlerts}
              onChange={(e) => setNotifPrefs({ ...notifPrefs, connectionAlerts: e.target.checked })}
              className="rounded text-blue-600 w-4 h-4"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
