import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Store,
  PlusCircle,
  Briefcase,
  ShoppingBag,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
  Upload,
  FileText,
  DollarSign,
  TrendingUp,
  Share2,
} from 'lucide-react';
import { businessApi, marketplaceApi, jobsApi } from '../../services/api';
import { RootState } from '../../store';
import { IBusiness, IProduct, IService, IOrder, IJob } from '../../types';

export const BusinessDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'overview';

  const handleTabChange = (newTab: string) => {
    if (newTab === 'overview') {
      searchParams.delete('tab');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ tab: newTab });
    }
  };

  const [business, setBusiness] = useState<IBusiness | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Business verification document form
  const [docType, setDocType] = useState('Certificate of Incorporation');
  const [docUrl, setDocUrl] = useState('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);

  // Add Product Form State
  const [prodModalOpen, setProdModalOpen] = useState(false);
  const [pTitle, setPTitle] = useState('');
  const [pCategory, setPCategory] = useState('Electronics');
  const [pPrice, setPPrice] = useState('99.99');
  const [pStock, setPStock] = useState('25');
  const [pDesc, setPDesc] = useState('');

  // Add Job Form State
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [jTitle, setJTitle] = useState('');
  const [jCat, setJCat] = useState('Software Development');
  const [jWorkMode, setJWorkMode] = useState('remote');
  const [jSalaryMin, setJSalaryMin] = useState('90000');
  const [jSalaryMax, setJSalaryMax] = useState('140000');
  const [jDesc, setJDesc] = useState('');

  useEffect(() => {
    if (activeTab === 'add-product') {
      setProdModalOpen(true);
    }
  }, [activeTab]);

  const loadData = () => {
    setLoading(true);
    businessApi.getMyBusiness()
      .then((res) => {
        setBusiness(res.data.business);
      })
      .catch((err) => console.log('Business notice:', err.message))
      .finally(() => setLoading(false));

    marketplaceApi.getBusinessProducts()
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error(err));

    marketplaceApi.getBusinessOrders()
      .then((res) => setOrders(res.data.data))
      .catch((err) => console.error(err));

    jobsApi.getBusinessApplications()
      .then((res) => {})
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await businessApi.submitVerification([{ documentType: docType, documentUrl: docUrl }]);
      if (res.data.success) {
        setVerificationSubmitted(true);
        loadData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Verification submission failed');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await marketplaceApi.createProduct({
        title: pTitle,
        category: pCategory,
        price: parseFloat(pPrice),
        stock: parseInt(pStock, 10),
        description: pDesc,
      });
      setProdModalOpen(false);
      setPTitle('');
      setPDesc('');
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create product. Check business verification.');
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await jobsApi.createJob({
        title: jTitle,
        category: jCat,
        workMode: jWorkMode,
        salaryMin: jSalaryMin,
        salaryMax: jSalaryMax,
        description: jDesc,
        responsibilities: ['Build core features', 'Collaborate with team'],
        requirements: ['3+ years experience', 'Strong communication'],
        skills: ['JavaScript', 'React', 'Node.js'],
      });
      setJobModalOpen(false);
      setJTitle('');
      setJDesc('');
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to post job. Check verification status.');
    }
  };

  const isApproved = business?.verificationStatus === 'approved';

  const totalSalesRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.totalAmount : 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 bg-teal-950/60 px-2.5 py-0.5 rounded-md">
              Enterprise Dashboard
            </span>
            <span className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
              isApproved
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}>
              Verification: {business?.verificationStatus?.toUpperCase() || 'DRAFT'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{business?.businessName || 'Business Portal'}</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Publish products & services, manage customer fulfillment, and recruit top candidate talent.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              if (!isApproved) {
                alert('Your business verification must be Approved by Admin before publishing products.');
              } else {
                setProdModalOpen(true);
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Add Product
          </button>
          <button
            onClick={() => {
              if (!isApproved) {
                alert('Your business verification must be Approved by Admin before publishing jobs.');
              } else {
                setJobModalOpen(true);
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-white text-navy-900 font-bold text-xs shadow-md hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4 text-teal-600" /> Post Job
          </button>
        </div>
      </div>

      {/* Verification Warning Alert if not approved */}
      {!isApproved && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-sm">Business Verification Required</h4>
            <p className="text-amber-700">
              Your business is currently in status <span className="font-extrabold uppercase">'{business?.verificationStatus || 'DRAFT'}'</span>.
              Please upload your business registration and identity documents below for Admin review. Only Approved businesses can publish marketplace products, services, and job openings.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Products</span>
          <p className="text-2xl font-extrabold text-navy-900">{products.length}</p>
          <p className="text-[11px] font-semibold text-teal-600">Active Listings</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Customer Orders</span>
          <p className="text-2xl font-extrabold text-navy-900">{orders.length}</p>
          <p className="text-[11px] font-semibold text-slate-500">Processed Purchases</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Gross Sales</span>
          <p className="text-2xl font-extrabold text-emerald-600">${totalSalesRevenue.toFixed(2)}</p>
          <p className="text-[11px] font-semibold text-emerald-600">Total Revenue</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Privacy Status</span>
          <p className="text-sm font-extrabold text-teal-600 pt-1">Shielded 100%</p>
          <p className="text-[10px] font-semibold text-slate-400">Owner Details Hidden</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'verification', label: 'Verification & Legal Docs' },
          { id: 'products', label: `My Products (${products.length})` },
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'jobs', label: `Job Postings (${jobs.length})` },
          { id: 'services', label: `Services (${services.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id || (tab.id === 'verification' && activeTab === 'profile') || (tab.id === 'products' && activeTab === 'store')
                ? 'bg-navy-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. VERIFICATION & LEGAL DOCS */}
      {(activeTab === 'overview' || activeTab === 'profile' || activeTab === 'verification') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-navy-900">Business Verification Documents</h3>
              <p className="text-xs text-slate-500">
                Upload business registration certificates and identity filings for administrator validation.
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
              isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {business?.verificationStatus || 'DRAFT'}
            </span>
          </div>

          {/* Current Submitted Documents */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">Submitted Credentials</h4>
            {business?.documents && business.documents.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {business.documents.map((doc, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <span className="font-bold text-slate-800">{doc.documentType}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No verification documents on file.</p>
            )}
          </div>

          {/* Upload New Document Form */}
          <form onSubmit={handleDocumentSubmit} className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">Upload Verification Document</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="Certificate of Incorporation">Certificate of Incorporation</option>
                  <option value="Tax Identification Number (EIN)">Tax Identification Number (EIN)</option>
                  <option value="Identity Verification (Passport/ID)">Identity Verification (Passport/ID)</option>
                  <option value="Commercial Trade License">Commercial Trade License</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Document URL / Proof Link</label>
                <input
                  type="url"
                  required
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> Submit Document for Admin Review
            </button>
          </form>
        </div>
      )}

      {/* 2. PRODUCTS LIST */}
      {(activeTab === 'overview' || activeTab === 'products') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-navy-900">My Catalog Products</h3>
            <button
              onClick={() => {
                if (!isApproved) alert('Approved business verification required.');
                else setProdModalOpen(true);
              }}
              className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add New Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p._id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
                <img src={p.images[0]} alt={p.title} className="w-full h-40 rounded-2xl object-cover" />
                <span className="text-[10px] font-bold uppercase bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-md">
                  {p.category}
                </span>
                <h4 className="font-bold text-sm text-navy-900 line-clamp-1">{p.title}</h4>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-base font-extrabold text-navy-900">${p.price}</span>
                  <span className="font-semibold text-slate-500">Stock: {p.stock} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {prodModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-navy-900">Add New Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={pTitle}
                  onChange={(e) => setPTitle(e.target.value)}
                  placeholder="e.g. Ergonomic Office Mouse"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  placeholder="Product specifications and features..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                ></textarea>
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
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Job Modal */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-navy-900">Post Career Opening</h3>
            <form onSubmit={handleCreateJob} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={jTitle}
                  onChange={(e) => setJTitle(e.target.value)}
                  placeholder="e.g. Lead Frontend Engineer"
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
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={jDesc}
                  onChange={(e) => setJDesc(e.target.value)}
                  placeholder="Responsibilities and requirements..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                ></textarea>
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
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md"
                >
                  Post Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
