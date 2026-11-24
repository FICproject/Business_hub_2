import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
} from 'lucide-react';
import { businessApi, marketplaceApi, jobsApi, sharingApi } from '../../services/api';
import { CommunityView } from '../../components/dashboard/CommunityView';
import { EventsView } from '../../components/dashboard/EventsView';

export const BusinessDashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
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

  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [sharedLinks, setSharedLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Business Profile & Verification Form State
  const [bizName, setBizName] = useState('');
  const [bizCategory, setBizCategory] = useState('Retail & Commerce');
  const [bizDesc, setBizDesc] = useState('');
  const [docType, setDocType] = useState('Commercial Trade License');
  const [docUrl, setDocUrl] = useState('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);

  // Add Product Form State
  const [prodModalOpen, setProdModalOpen] = useState(false);
  const [pTitle, setPTitle] = useState('');
  const [pCategory, setPCategory] = useState('Electronics');
  const [pPrice, setPPrice] = useState('99.99');
  const [pStock, setPStock] = useState('25');
  const [pDesc, setPDesc] = useState('');
  const [pImage, setPImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80');

  // Add Service Form State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [sTitle, setSTitle] = useState('');
  const [sCategory, setSCategory] = useState('Business Consulting');
  const [sPrice, setSPrice] = useState('250.00');
  const [sArea, setSArea] = useState('Global (Remote)');
  const [sDesc, setSDesc] = useState('');

  // Add Job Form State
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [jTitle, setJTitle] = useState('');
  const [jCat, setJCat] = useState('Software Development');
  const [jWorkMode, setJWorkMode] = useState('remote');
  const [jSalaryMin, setJSalaryMin] = useState('90000');
  const [jSalaryMax, setJSalaryMax] = useState('140000');
  const [jDesc, setJDesc] = useState('');

  // Share Link Form State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareTitle, setShareTitle] = useState('');

  useEffect(() => {
    if (activeTab === 'add-product') {
      setProdModalOpen(true);
    }
  }, [activeTab]);

  const loadData = () => {
    setLoading(true);
    businessApi
      .getMyBusiness()
      .then((res) => {
        const b = res.data.business;
        setBusiness(b);
        if (b) {
          setBizName(b.businessName || '');
          setBizCategory(b.businessType || 'Retail & Commerce');
          setBizDesc(b.description || '');
        }
      })
      .catch((err) => console.log('Business notice:', err.message))
      .finally(() => setLoading(false));

    marketplaceApi
      .getBusinessProducts()
      .then((res) => setProducts(res.data.data || []))
      .catch((err) => console.error(err));

    marketplaceApi
      .getServices()
      .then((res) => setServices(res.data.data || []))
      .catch((err) => console.error(err));

    marketplaceApi
      .getBusinessOrders()
      .then((res) => setOrders(res.data.data || []))
      .catch((err) => console.error(err));

    jobsApi
      .getJobs()
      .then((res) => setJobs(res.data.data || []))
      .catch((err) => console.error(err));

    jobsApi
      .getBusinessApplications()
      .then((res) => setApplications(res.data.data || []))
      .catch((err) => console.error(err));

    sharingApi
      .getMySharedLinks()
      .then((res) => setSharedLinks(res.data.data || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const verificationStatus = business?.verificationStatus || 'draft';
  const isApproved = verificationStatus === 'approved';

  // 6-stage workflow definition
  const stages = [
    { key: 'draft', label: '1. Draft Profile', desc: 'Enter business registration details' },
    { key: 'pending', label: '2. Pending Verification', desc: 'Documents uploaded for review' },
    { key: 'under_review', label: '3. Under Review', desc: 'Compliance officers auditing files' },
    { key: 'changes_required', label: '4. Changes Required', desc: 'Corrections or re-upload requested' },
    { key: 'approved', label: '5. Approved & Verified', desc: 'Full trading, hiring & storefront unlocked' },
    { key: 'rejected', label: '6. Rejected', desc: 'Application failed compliance checks' },
  ];

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await businessApi.submitVerification([{ documentType: docType, documentUrl: docUrl }]);
      if (res.data.success) {
        setVerificationSubmitted(true);
        loadData();
        alert('Verification documents submitted successfully for Admin review!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Verification submission failed');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await businessApi.saveBusiness({
        businessName: bizName,
        businessType: bizCategory,
        description: bizDesc,
      });
      alert('Business profile saved successfully!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save business profile');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!isApproved) {
      alert('Your business verification must be Approved by Admin before publishing products.');
      return;
    }
    try {
      await marketplaceApi.createProduct({
        title: pTitle,
        category: pCategory,
        price: parseFloat(pPrice),
        stock: parseInt(pStock, 10),
        description: pDesc,
        images: [pImage],
      });
      setProdModalOpen(false);
      setPTitle('');
      setPDesc('');
      loadData();
      alert('Product published successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create product. Check business verification.');
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!isApproved) {
      alert('Your business verification must be Approved by Admin before publishing services.');
      return;
    }
    try {
      await marketplaceApi.createService({
        title: sTitle,
        category: sCategory,
        price: parseFloat(sPrice),
        serviceArea: sArea,
        description: sDesc,
      });
      setServiceModalOpen(false);
      setSTitle('');
      setSDesc('');
      loadData();
      alert('Service offering created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create service.');
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!isApproved) {
      alert('Your business verification must be Approved by Admin before publishing career vacancies.');
      return;
    }
    try {
      await jobsApi.createJob({
        title: jTitle,
        category: jCat,
        workMode: jWorkMode,
        salaryMin: jSalaryMin,
        salaryMax: jSalaryMax,
        description: jDesc,
        responsibilities: ['Build core commercial features', 'Collaborate with cross-functional team'],
        requirements: ['3+ years professional experience', 'Strong team communication skills'],
        skills: ['Management', 'React', 'Node.js'],
      });
      setJobModalOpen(false);
      setJTitle('');
      setJDesc('');
      loadData();
      alert('Job opening posted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post job. Check verification status.');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await marketplaceApi.updateOrderStatus(orderId, newStatus);
      loadData();
      alert(`Order updated to '${newStatus}'`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleUpdateApplicationStatus = async (appId, newStatus) => {
    try {
      await jobsApi.updateApplicationStatus(appId, newStatus);
      loadData();
      alert(`Applicant marked as '${newStatus}'`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update application status');
    }
  };

  const handleCreateShareLink = async (e) => {
    e.preventDefault();
    try {
      await sharingApi.createShareLink({
        targetType: 'business',
        targetId: business?._id || 'business-store',
        title: shareTitle || business?.businessName || 'My Business Storefront',
      });
      setShareModalOpen(false);
      setShareTitle('');
      loadData();
      alert('Clean promotional link generated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create share link');
    }
  };

  const totalSalesRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.totalAmount : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'processing').length;
  const completedOrdersCount = orders.filter((o) => o.orderStatus === 'delivered').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* =====================================================================
          MODULE 1: OVERVIEW DASHBOARD
      ====================================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 1. BUSINESS HEADER BANNER */}
          <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-0.5 rounded-full">
                  Enterprise Merchant Suite
                </span>
                <span
                  className={`text-[11px] font-black uppercase px-3 py-0.5 rounded-full border ${
                    isApproved
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : verificationStatus === 'rejected'
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}
                >
                  Status: {verificationStatus.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {business?.businessName || 'Business Management Portal'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Manage multi-vendor catalog inventory, fulfill customer purchases, recruit corporate talent, and operate under strict seller privacy protection.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  if (!isApproved) {
                    alert('Your business must be Approved by Admin before publishing products.');
                  } else {
                    setProdModalOpen(true);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" /> Add Product
              </button>
              <button
                onClick={() => {
                  if (!isApproved) {
                    alert('Your business must be Approved by Admin before publishing services.');
                  } else {
                    setServiceModalOpen(true);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4 text-teal-400" /> Offer Service
              </button>
              <button
                onClick={() => {
                  if (!isApproved) {
                    alert('Your business must be Approved by Admin before posting jobs.');
                  } else {
                    setJobModalOpen(true);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-white text-navy-950 font-bold text-xs shadow-md hover:bg-slate-100 transition-all flex items-center gap-1.5"
              >
                <Briefcase className="w-4 h-4 text-amber-600" /> Post Job
              </button>
            </div>
          </div>

          {/* 2. COMPLIANCE ALERT (IF NOT APPROVED) */}
          {!isApproved && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex items-start gap-3.5 shadow-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
              <div className="text-xs space-y-1 flex-grow">
                <h4 className="font-extrabold text-sm text-navy-950">
                  Commercial Verification Required ({verificationStatus.replace('_', ' ').toUpperCase()})
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  Your business status is currently{' '}
                  <span className="font-extrabold uppercase text-amber-700">{verificationStatus.replace('_', ' ')}</span>.
                  To protect marketplace consumers, only administrator-verified businesses can publish products, services, and career job vacancies. Please upload your Trade License and Tax Registry filings in the <strong>Verification Status</strong> tab.
                </p>
              </div>
              <button
                onClick={() => handleTabChange('verification')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-navy-950 font-bold text-xs whitespace-nowrap hover:bg-amber-400 transition-colors"
              >
                Submit Documents →
              </button>
            </div>
          )}

          {/* 3. KPI SUMMARY CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Products</span>
              <p className="text-2xl font-extrabold text-navy-950">{products.length}</p>
              <button onClick={() => handleTabChange('products')} className="text-[11px] font-semibold text-teal-600 hover:underline">
                Manage Listings →
              </button>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Orders</span>
              <p className="text-2xl font-extrabold text-navy-950">{orders.length}</p>
              <button onClick={() => handleTabChange('orders')} className="text-[11px] font-semibold text-slate-500 hover:underline">
                {pendingOrdersCount} Pending / {completedOrdersCount} Fulfilled →
              </button>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Gross Sales</span>
              <p className="text-2xl font-extrabold text-emerald-600">${totalSalesRevenue.toFixed(2)}</p>
              <p className="text-[11px] font-semibold text-emerald-600">0% Platform Commission</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Active Job Posts</span>
              <p className="text-2xl font-extrabold text-navy-950">{jobs.length}</p>
              <button onClick={() => handleTabChange('jobs')} className="text-[11px] font-semibold text-amber-600 hover:underline">
                {applications.length} Candidates Applied →
              </button>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1 col-span-2 lg:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Privacy Status</span>
              <p className="text-sm font-extrabold text-teal-600 pt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" /> Shielded 100%
              </p>
              <p className="text-[10px] font-semibold text-slate-400">Owner Mobile &amp; Address Hidden</p>
            </div>
          </div>

          {/* 4. OVERVIEW HIGHLIGHTS: Recent Orders & Catalog Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders Spotlight */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-navy-950 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-500" /> Recent Customer Orders
                </h3>
                <button onClick={() => handleTabChange('orders')} className="text-xs font-bold text-teal-600 hover:underline">
                  View all ({orders.length}) →
                </button>
              </div>
              {orders.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No orders received yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {orders.slice(0, 3).map((ord) => (
                    <div key={ord._id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-navy-950">Order #{ord._id?.slice(-6).toUpperCase()}</p>
                        <p className="text-[11px] text-slate-500">{ord.shippingAddress?.fullName} • ${ord.totalAmount?.toFixed(2)}</p>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {ord.orderStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Products Spotlight */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-navy-950 flex items-center gap-2">
                  <Store className="w-4 h-4 text-teal-600" /> Active Catalog Inventory
                </h3>
                <button onClick={() => handleTabChange('products')} className="text-xs font-bold text-teal-600 hover:underline">
                  Manage catalog ({products.length}) →
                </button>
              </div>
              {products.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No catalog products listed yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {products.slice(0, 3).map((prod) => (
                    <div key={prod._id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={prod.thumbnailUrl || (prod.images && prod.images[0])} alt={prod.title} className="w-9 h-9 rounded-xl object-cover bg-slate-200" />
                        <div>
                          <p className="font-bold text-navy-950 line-clamp-1">{prod.title}</p>
                          <p className="text-[11px] text-slate-500">${prod.price?.toFixed(2)} • {prod.stockQuantity} in stock</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 capitalize">{prod.category}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 1: VERIFICATION & LEGAL DOCS (6-STAGE WORKFLOW)
      ====================================================================== */}
      {(activeTab === 'profile' || activeTab === 'verification') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
            <div>
              <h3 className="font-extrabold text-lg text-navy-950">6-Stage Business Verification Stepper</h3>
              <p className="text-xs text-slate-500">
                Official regulatory compliance review ensuring certified business integrity.
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                isApproved
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              Current Status: {verificationStatus.replace('_', ' ')}
            </span>
          </div>

          {/* Stepper Visualisation */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2">
            {stages.map((stg, idx) => {
              const isCurrent = verificationStatus.toLowerCase() === stg.key;
              const isPast = isApproved && stg.key !== 'rejected';
              return (
                <div
                  key={stg.key}
                  className={`p-3 rounded-2xl border text-center space-y-1 transition-all ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500 text-navy-950 font-bold shadow-sm'
                      : isPast
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] uppercase font-black tracking-wider block">Stage {idx + 1}</span>
                  <p className="text-xs font-bold leading-tight">{stg.label.split('. ')[1]}</p>
                </div>
              );
            })}
          </div>

          {/* Business Information Form */}
          <form onSubmit={handleSaveProfile} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase text-navy-950 tracking-wider">
                1. Registered Business Details
              </h4>
              <span className="text-[10px] text-slate-400">Strictly private from marketplace buyers</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Business Trade Name</label>
                <input
                  type="text"
                  required
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  placeholder="e.g. Apex Technologies Inc."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Industry / Category</label>
                <select
                  value={bizCategory}
                  onChange={(e) => setBizCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Retail & Commerce">Retail &amp; Commerce</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Education & Training">Education &amp; Training</option>
                  <option value="Manufacturing & Logistics">Manufacturing &amp; Logistics</option>
                  <option value="Professional Services">Professional Services</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Registered Tax / EIN</label>
                <input
                  type="text"
                  placeholder="e.g. EIN-9842104"
                  defaultValue="EIN-9842104"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Business Bio / Operations Description</label>
              <textarea
                rows={2}
                value={bizDesc}
                onChange={(e) => setBizDesc(e.target.value)}
                placeholder="Brief summary of commercial trade..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-navy-950 text-white font-bold text-xs hover:bg-navy-900 transition-colors"
              >
                Save Business Profile
              </button>
            </div>
          </form>

          {/* Current Submitted Documents */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-navy-950 tracking-wider">
              2. Uploaded Compliance Filings
            </h4>
            {business?.documents && business.documents.length > 0 ? (
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-3 bg-slate-50/50">
                {business.documents.map((doc, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs px-2">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-slate-800">{doc.documentType}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400">
                        Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                      </span>
                      <a
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-amber-600 hover:underline flex items-center gap-1"
                      >
                        View File <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No verification documents on file yet.</p>
            )}
          </div>

          {/* Upload New Document Form */}
          <form onSubmit={handleDocumentSubmit} className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-extrabold uppercase text-navy-950 tracking-wider">
              3. Submit Trade License &amp; Tax Documents
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Document Category</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Commercial Trade License">Commercial Trade License</option>
                  <option value="Certificate of Incorporation">Certificate of Incorporation</option>
                  <option value="Tax Identification Registry (EIN / VAT)">Tax Identification Registry (EIN / VAT)</option>
                  <option value="Owner Identity Verification (Passport/ID)">Owner Identity Verification (Passport/ID)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Document URL / Proof PDF
                </label>
                <input
                  type="url"
                  required
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-black text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> Submit Document for Admin Review
            </button>
          </form>
        </div>
      )}

      {/* =====================================================================
          TAB 2: PRODUCTS & STOREFRONT
      ====================================================================== */}
      {(activeTab === 'products' || activeTab === 'store' || activeTab === 'add-product') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-navy-950">My Catalog Products</h3>
              <p className="text-xs text-slate-500">Commercial storefront listings visible on marketplace.</p>
            </div>
            <button
              onClick={() => {
                if (!isApproved) {
                  alert('Approved business verification required.');
                } else {
                  setProdModalOpen(true);
                }
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-navy-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> Add New Product
            </button>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 space-y-3">
              <Store className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-sm text-slate-700">No products added yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Once your business is verified, you can list products, manage inventory units, and accept orders.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'}
                    alt={p.title}
                    className="w-full h-44 rounded-2xl object-cover bg-slate-100"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-md">
                      {p.category}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Active
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-navy-950 line-clamp-1">{p.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{p.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-base font-extrabold text-navy-950">${p.price}</span>
                    <span className="font-semibold text-slate-500">Stock: {p.stock} units</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 3: SERVICES
      ====================================================================== */}
      {activeTab === 'services' && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-navy-950">Commercial Services</h3>
              <p className="text-xs text-slate-500">Corporate and freelance services offered by your enterprise.</p>
            </div>
            <button
              onClick={() => {
                if (!isApproved) {
                  alert('Approved business verification required.');
                } else {
                  setServiceModalOpen(true);
                }
              }}
              className="px-4 py-2 rounded-xl bg-navy-950 text-white font-bold text-xs hover:bg-navy-900 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" /> Offer New Service
            </button>
          </div>

          {services.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 space-y-3">
              <Layers className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-sm text-slate-700">No services listed</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Offer corporate consulting, software maintenance, design retainers, or repair services.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s._id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
                  <span className="text-[10px] font-bold uppercase bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-md">
                    {s.category}
                  </span>
                  <h4 className="font-bold text-sm text-navy-950 line-clamp-1">{s.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{s.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-base font-extrabold text-emerald-600">${s.price}</span>
                    <span className="text-[11px] text-slate-400">{s.serviceArea}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 4: ORDERS & TRACKING
      ====================================================================== */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
            <div>
              <h3 className="font-extrabold text-lg text-navy-950">Customer Orders &amp; Fulfillment</h3>
              <p className="text-xs text-slate-500">Track and dispatch customer purchases in real time.</p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Total Order Volume: <strong>{orders.length} orders</strong>
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400">No customer orders have been placed yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3 px-2">Order ID</th>
                    <th className="pb-3 px-2">Customer</th>
                    <th className="pb-3 px-2">Total ($)</th>
                    <th className="pb-3 px-2">Payment</th>
                    <th className="pb-3 px-2">Fulfillment Status</th>
                    <th className="pb-3 px-2 text-right">Update Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-2 font-mono font-bold text-slate-900">{ord._id.slice(-6).toUpperCase()}</td>
                      <td className="py-3 px-2">Customer #{ord.userId?.slice(-4) || '8192'}</td>
                      <td className="py-3 px-2 font-extrabold text-emerald-600">${ord.totalAmount?.toFixed(2)}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            ord.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                            ord.orderStatus === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.orderStatus === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs bg-white font-bold text-slate-800"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 5: JOB POSTINGS & CANDIDATES
      ====================================================================== */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
            <div>
              <h3 className="font-extrabold text-lg text-navy-950">Corporate Job Openings &amp; Recruitment</h3>
              <p className="text-xs text-slate-500">
                Only approved businesses can recruit verified candidates with direct resume submissions.
              </p>
            </div>
            <button
              onClick={() => {
                if (!isApproved) {
                  alert('Approved business verification required.');
                } else {
                  setJobModalOpen(true);
                }
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-navy-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Briefcase className="w-4 h-4" /> Post Career Opening
            </button>
          </div>

          {/* Jobs List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400">Active Job Postings ({jobs.length})</h4>
            {jobs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No job postings created yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((jb) => (
                  <div key={jb._id} className="p-4 rounded-2xl border border-slate-200/80 hover:bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-700 px-2 py-0.5 rounded">
                        {jb.category}
                      </span>
                      <span className="text-[10px] font-extrabold capitalize bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {jb.workMode}
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-navy-950">{jb.title}</h5>
                    <p className="text-xs text-slate-500 line-clamp-2">{jb.description}</p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-emerald-600">
                        ${jb.salaryMin ? Number(jb.salaryMin).toLocaleString() : '80,000'} - $
                        {jb.salaryMax ? Number(jb.salaryMax).toLocaleString() : '120,000'}/yr
                      </span>
                      <span className="font-bold text-slate-500">
                        {applications.filter((a) => a.jobId === jb._id).length} Applicants
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applications Review */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400">
              Candidate Applications ({applications.length})
            </h4>
            {applications.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No candidates have applied yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-2">Candidate</th>
                      <th className="pb-2">Role Applied</th>
                      <th className="pb-2">Resume</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2 text-right">Update Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50">
                        <td className="py-2.5 font-bold text-navy-950">{app.applicantName || 'Alex Chen'}</td>
                        <td className="py-2.5">{app.jobTitle || 'Engineer'}</td>
                        <td className="py-2.5">
                          <a
                            href={app.resumeUrl || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="text-amber-600 font-bold hover:underline"
                          >
                            Download Resume
                          </a>
                        </td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700">
                            {app.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateApplicationStatus(app._id, e.target.value)}
                            className="px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white font-bold"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview Invited">Interview Invited</option>
                            <option value="Selected">Selected</option>
                            <option value="Not Selected">Not Selected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 6: CLEAN SHARE LINKS
      ====================================================================== */}
      {activeTab === 'sharing' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
            <div>
              <h3 className="font-extrabold text-lg text-navy-950">Clean Share Links</h3>
              <p className="text-xs text-slate-500">
                Ethical product promotion and job outreach links with zero MLM wallets or commission traps.
              </p>
            </div>
            <button
              onClick={() => setShareModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-navy-950 text-white font-bold text-xs hover:bg-navy-900 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Share2 className="w-4 h-4 text-amber-400" /> Create Share Link
            </button>
          </div>

          {sharedLinks.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Share2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400">No share links generated yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {sharedLinks.map((lk) => (
                <div key={lk._id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-slate-800">{lk.title || 'Promotional Link'}</h5>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {window.location.origin}/share/{lk.shareCode}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-emerald-600">{lk.clickCount || 0} Clicks</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/share/${lk.shareCode}`);
                        alert('Link copied to clipboard!');
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 7: COMMUNITY
      ====================================================================== */}
      {activeTab === 'community' && <CommunityView role="business" />}

      {/* =====================================================================
          TAB 8: EVENTS
      ====================================================================== */}
      {activeTab === 'events' && <EventsView role="business" />}

      {/* =====================================================================
          ADD PRODUCT MODAL
      ====================================================================== */}
      {prodModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-navy-950">Add New Product</h3>
              <button onClick={() => setProdModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={pTitle}
                  onChange={(e) => setPTitle(e.target.value)}
                  placeholder="e.g. Ergonomic Corporate Laptop Stand"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Audio">Audio</option>
                    <option value="Office">Office</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={pStock}
                    onChange={(e) => setPStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Product Image URL</label>
                <input
                  type="url"
                  value={pImage}
                  onChange={(e) => setPImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  placeholder="Detailed product specifications..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProdModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-black text-xs shadow-md"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          OFFER SERVICE MODAL
      ====================================================================== */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-navy-950">Offer Commercial Service</h3>
              <button onClick={() => setServiceModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateService} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={sTitle}
                  onChange={(e) => setSTitle(e.target.value)}
                  placeholder="e.g. Enterprise Security Architecture Audit"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Base Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={sPrice}
                    onChange={(e) => setSPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Service Area</label>
                  <input
                    type="text"
                    value={sArea}
                    onChange={(e) => setSArea(e.target.value)}
                    placeholder="e.g. Remote / North America"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={sDesc}
                  onChange={(e) => setSDesc(e.target.value)}
                  placeholder="Scope of work and deliverables..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-navy-950 text-white font-bold text-xs shadow-md"
                >
                  Publish Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          POST JOB MODAL
      ====================================================================== */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-navy-950">Post Career Opening</h3>
              <button onClick={() => setJobModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateJob} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={jTitle}
                  onChange={(e) => setJTitle(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Work Mode</label>
                  <select
                    value={jWorkMode}
                    onChange={(e) => setJWorkMode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-site</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={jCat}
                    onChange={(e) => setJCat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Software Development">Software Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Business Management">Business Management</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Salary Min ($)</label>
                  <input
                    type="number"
                    value={jSalaryMin}
                    onChange={(e) => setJSalaryMin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Salary Max ($)</label>
                  <input
                    type="number"
                    value={jSalaryMax}
                    onChange={(e) => setJSalaryMax(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={jDesc}
                  onChange={(e) => setJDesc(e.target.value)}
                  placeholder="Key responsibilities and qualifications..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-black text-xs shadow-md"
                >
                  Post Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          CREATE SHARE LINK MODAL
      ====================================================================== */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-navy-950">Create Clean Share Link</h3>
              <button onClick={() => setShareModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateShareLink} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Link Title / Campaign</label>
                <input
                  type="text"
                  required
                  value={shareTitle}
                  onChange={(e) => setShareTitle(e.target.value)}
                  placeholder="e.g. Summer Corporate Catalog Promo"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Clean direct share links protect user privacy and avoid MLM reward schemes.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShareModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-navy-950 text-white font-bold text-xs shadow-md"
                >
                  Generate Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
