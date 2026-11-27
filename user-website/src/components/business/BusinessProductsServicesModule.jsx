import React, { useState, useMemo } from 'react';
import {
  Store,
  Layers,
  PlusCircle,
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Power,
  MapPin,
  Package,
  Calendar,
  Sparkles,
  DollarSign,
  Tag,
  Truck,
  Filter,
  Search,
  X,
} from 'lucide-react';
import { marketplaceApi } from '../../services/api';

export const BusinessProductsServicesModule = ({
  products = [],
  services = [],
  isApproved,
  business,
  onRefresh,
}) => {
  const [catalogSubTab, setCatalogSubTab] = useState('products'); // 'products' | 'services'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'approved' | 'pending_approval' | 'rejected' | 'inactive'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [prodModalOpen, setProdModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [servModalOpen, setServModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Product Form State
  const initialProdForm = {
    title: '',
    category: 'Construction Materials',
    subcategory: '',
    brand: '',
    priceType: 'fixed', // 'fixed' | 'range' | 'rfq'
    price: '',
    minPrice: '',
    maxPrice: '',
    unit: 'Units',
    minOrderQty: '1',
    stock: '10',
    availability: 'in_stock', // 'in_stock' | 'out_of_stock' | 'made_to_order'
    deliveryLocations: 'All India / Pan-India',
    specifications: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    additionalInfo: '',
  };
  const [prodForm, setProdForm] = useState(initialProdForm);

  // Service Form State
  const initialServForm = {
    name: '',
    category: 'Engineering & Architecture',
    subcategory: '',
    pricingType: 'fixed', // 'fixed' | 'starting_from' | 'range' | 'rfq'
    price: '',
    minPrice: '',
    maxPrice: '',
    serviceArea: 'Regional / On-site',
    coveragePincodes: '',
    estimatedCompletionTime: '3-5 business days',
    availability: 'available', // 'available' | 'busy' | 'on_demand'
    specifications: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    additionalInfo: '',
  };
  const [servForm, setServForm] = useState(initialServForm);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      let matchesStatus = true;
      if (statusFilter !== 'all') {
        matchesStatus = p.status === statusFilter;
      }
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchesSearch =
          p.title?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q);
      }
      return matchesStatus && matchesSearch;
    });
  }, [products, statusFilter, searchQuery]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      let matchesStatus = true;
      if (statusFilter !== 'all') {
        matchesStatus = s.status === statusFilter;
      }
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchesSearch =
          s.name?.toLowerCase().includes(q) ||
          s.title?.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q) ||
          s.subcategory?.toLowerCase().includes(q);
      }
      return matchesStatus && matchesSearch;
    });
  }, [services, statusFilter, searchQuery]);

  // Open Add Product Modal
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdForm(initialProdForm);
    setProdModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (p) => {
    setEditingProduct(p);
    setProdForm({
      title: p.title || '',
      category: p.category || 'Construction Materials',
      subcategory: p.subcategory || '',
      brand: p.brand || '',
      priceType: p.priceType || 'fixed',
      price: p.price ? String(p.price) : '',
      minPrice: p.minPrice ? String(p.minPrice) : '',
      maxPrice: p.maxPrice ? String(p.maxPrice) : '',
      unit: p.unit || 'Units',
      minOrderQty: String(p.minOrderQty || '1'),
      stock: String(p.stock || '10'),
      availability: p.availability || 'in_stock',
      deliveryLocations: p.deliveryLocations || 'All India',
      specifications: Array.isArray(p.specifications)
        ? p.specifications.join(', ')
        : p.specifications || '',
      description: p.description || '',
      image: p.images?.[0] || '',
      additionalInfo: p.additionalInfo || '',
    });
    setProdModalOpen(true);
  };

  // Save Product
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
        subcategory: prodForm.subcategory,
        brand: prodForm.brand,
        priceType: prodForm.priceType,
        price: prodForm.price ? parseFloat(prodForm.price) : undefined,
        minPrice: prodForm.minPrice ? parseFloat(prodForm.minPrice) : undefined,
        maxPrice: prodForm.maxPrice ? parseFloat(prodForm.maxPrice) : undefined,
        unit: prodForm.unit,
        minOrderQty: parseInt(prodForm.minOrderQty || '1', 10),
        stock: parseInt(prodForm.stock || '10', 10),
        availability: prodForm.availability,
        deliveryLocations: prodForm.deliveryLocations,
        specifications: prodForm.specifications
          ? prodForm.specifications.split(',').map((s) => s.trim())
          : [],
        description: prodForm.description,
        images: prodForm.image ? [prodForm.image] : [],
        additionalInfo: prodForm.additionalInfo,
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
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Product Active / Inactive
  const handleToggleProductStatus = async (p) => {
    const newStatus = p.status === 'inactive' ? 'approved' : 'inactive';
    try {
      await marketplaceApi.toggleProductStatus(p._id, newStatus);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update product status.');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await marketplaceApi.deleteProduct(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  // Open Add Service Modal
  const handleOpenAddService = () => {
    setEditingService(null);
    setServForm(initialServForm);
    setServModalOpen(true);
  };

  // Open Edit Service Modal
  const handleOpenEditService = (s) => {
    setEditingService(s);
    setServForm({
      name: s.name || s.title || '',
      category: s.category || 'Engineering & Architecture',
      subcategory: s.subcategory || '',
      pricingType: s.pricingType || 'fixed',
      price: s.price ? String(s.price) : '',
      minPrice: s.minPrice ? String(s.minPrice) : '',
      maxPrice: s.maxPrice ? String(s.maxPrice) : '',
      serviceArea: s.serviceArea || s.locations || '',
      coveragePincodes: s.coveragePincodes || '',
      estimatedCompletionTime: s.estimatedCompletionTime || '3-5 business days',
      availability: s.availability || 'available',
      specifications: Array.isArray(s.specifications)
        ? s.specifications.join(', ')
        : s.specifications || '',
      description: s.description || '',
      image: s.images?.[0] || '',
      additionalInfo: s.additionalInfo || '',
    });
    setServModalOpen(true);
  };

  // Save Service
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
        title: servForm.name,
        category: servForm.category,
        subcategory: servForm.subcategory,
        pricingType: servForm.pricingType,
        price: servForm.price ? parseFloat(servForm.price) : undefined,
        minPrice: servForm.minPrice ? parseFloat(servForm.minPrice) : undefined,
        maxPrice: servForm.maxPrice ? parseFloat(servForm.maxPrice) : undefined,
        serviceArea: servForm.serviceArea,
        locations: servForm.serviceArea,
        coveragePincodes: servForm.coveragePincodes,
        estimatedCompletionTime: servForm.estimatedCompletionTime,
        availability: servForm.availability,
        specifications: servForm.specifications
          ? servForm.specifications.split(',').map((s) => s.trim())
          : [],
        description: servForm.description,
        images: servForm.image ? [servForm.image] : [],
        additionalInfo: servForm.additionalInfo,
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
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save service.');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Service Active / Inactive
  const handleToggleServiceStatus = async (s) => {
    const newStatus = s.status === 'inactive' ? 'approved' : 'inactive';
    try {
      await marketplaceApi.toggleServiceStatus(s._id, newStatus);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update service status.');
    }
  };

  // Delete Service
  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await marketplaceApi.deleteService(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete service.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            Published
          </span>
        );
      case 'pending_approval':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" />
            Pending Approval
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            <Power className="w-3 h-3 text-slate-400" />
            Inactive
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
      {/* Warning if unapproved */}
      {!isApproved && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Only verified businesses approved by Admin can publish products or services to the common Marketplace.
          </span>
        </div>
      )}

      {/* Main Header & Tab Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCatalogSubTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              catalogSubTab === 'products'
                ? 'bg-blue-600 text-white font-extrabold shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>My Products ({products.length})</span>
          </button>
          <button
            onClick={() => setCatalogSubTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              catalogSubTab === 'services'
                ? 'bg-blue-600 text-white font-extrabold shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>My Services ({services.length})</span>
          </button>
        </div>

        {catalogSubTab === 'products' ? (
          <button
            onClick={handleOpenAddProduct}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-950 text-white hover:bg-navy-900 text-xs font-bold shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Add Product</span>
          </button>
        ) : (
          <button
            onClick={handleOpenAddService}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-950 text-white hover:bg-navy-900 text-xs font-bold shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Add Service</span>
          </button>
        )}
      </div>

      {/* Status Filter Pills Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: 'all', label: 'All Listings' },
            { key: 'approved', label: 'Published Listings' },
            { key: 'pending_approval', label: 'Pending Approval' },
            { key: 'rejected', label: 'Rejected Listings' },
            { key: 'inactive', label: 'Inactive Listings' },
          ].map((pill) => (
            <button
              key={pill.key}
              onClick={() => setStatusFilter(pill.key)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === pill.key
                  ? 'bg-navy-950 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${catalogSubTab}...`}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* PRODUCTS TAB VIEW */}
      {catalogSubTab === 'products' && (
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-2 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
              <Store className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No products found.</p>
              <p className="text-xs text-slate-400">
                {statusFilter === 'all'
                  ? 'Click "Add Product" to create your first marketplace listing.'
                  : `No products matching status "${statusFilter}".`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((p) => (
                <div
                  key={p._id}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all"
                >
                  <div className="relative">
                    <img
                      src={
                        p.images?.[0] ||
                        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'
                      }
                      alt={p.title}
                      className="w-full h-40 object-cover bg-slate-100"
                    />
                    <div className="absolute top-2.5 right-2.5">{getStatusBadge(p.status)}</div>
                  </div>

                  <div className="p-4 space-y-2.5 flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {p.category}
                      </span>
                      <span className="font-black text-navy-950 text-sm">
                        {p.priceType === 'rfq'
                          ? 'RFQ Required'
                          : p.priceType === 'range'
                          ? `₹${p.minPrice} - ₹${p.maxPrice}`
                          : `₹${p.price}`}
                      </span>
                    </div>

                    <h4 className="font-bold text-navy-950 text-sm line-clamp-1">{p.title}</h4>
                    {p.brand && <p className="text-[11px] text-slate-400">Brand: {p.brand}</p>}
                    <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                      <span>Stock: {p.stock} {p.unit || 'Units'}</span>
                      <span>MOQ: {p.minOrderQty || 1}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggleProductStatus(p)}
                      title={p.status === 'inactive' ? 'Activate Listing' : 'Deactivate Listing'}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        p.status === 'inactive'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{p.status === 'inactive' ? 'Activate' : 'Deactivate'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-navy-950 hover:bg-slate-200"
                        title="Edit Product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SERVICES TAB VIEW */}
      {catalogSubTab === 'services' && (
        <div className="space-y-4">
          {filteredServices.length === 0 ? (
            <div className="py-16 text-center space-y-2 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No services found.</p>
              <p className="text-xs text-slate-400">
                {statusFilter === 'all'
                  ? 'Click "Add Service" to publish engineering, contracting, or professional offerings.'
                  : `No services matching status "${statusFilter}".`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredServices.map((s) => (
                <div
                  key={s._id}
                  className="rounded-2xl border border-slate-200 p-5 bg-white shadow-sm flex flex-col justify-between space-y-3 hover:border-blue-300 transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                        {s.category}
                      </span>
                      {getStatusBadge(s.status)}
                    </div>

                    <div className="flex items-baseline justify-between">
                      <h4 className="font-bold text-navy-950 text-sm line-clamp-1">{s.name || s.title}</h4>
                      <span className="font-black text-navy-950 text-sm">
                        {s.pricingType === 'rfq'
                          ? 'RFQ Required'
                          : s.pricingType === 'starting_from'
                          ? `From ₹${s.price}`
                          : s.pricingType === 'range'
                          ? `₹${s.minPrice} - ₹${s.maxPrice}`
                          : `₹${s.price}`}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">{s.description}</p>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                      {s.serviceArea && (
                        <p className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          <span>{s.serviceArea}</span>
                        </p>
                      )}
                      {s.estimatedCompletionTime && (
                        <p className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          <span>Est. Completion: {s.estimatedCompletionTime}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggleServiceStatus(s)}
                      title={s.status === 'inactive' ? 'Activate Listing' : 'Deactivate Listing'}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        s.status === 'inactive'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{s.status === 'inactive' ? 'Activate' : 'Deactivate'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditService(s)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-navy-950 hover:bg-slate-100"
                        title="Edit Service"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(s._id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT PRODUCT
      ========================================================================= */}
      {prodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-navy-950 flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-600" />
                <span>{editingProduct ? 'Edit Product Listing' : 'Publish Product Listing'}</span>
              </h3>
              <button
                onClick={() => setProdModalOpen(false)}
                className="p-1 text-slate-400 hover:text-navy-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={prodForm.title}
                  onChange={(e) => setProdForm({ ...prodForm, title: e.target.value })}
                  placeholder="e.g. TMT Steel Rebar 12mm Fe 500D (IS 1786)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  <label className="block font-bold text-slate-700 uppercase mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={prodForm.subcategory}
                    onChange={(e) => setProdForm({ ...prodForm, subcategory: e.target.value })}
                    placeholder="e.g. Rebars & Structural Steel"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Brand (Optional)</label>
                  <input
                    type="text"
                    value={prodForm.brand}
                    onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
                    placeholder="e.g. Tata Tiscon, JSW"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Pricing Type and Price Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Price Type *</label>
                  <select
                    value={prodForm.priceType}
                    onChange={(e) => setProdForm({ ...prodForm, priceType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="range">Price Range</option>
                    <option value="rfq">Request for Quotation</option>
                  </select>
                </div>

                {prodForm.priceType === 'fixed' && (
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={prodForm.price}
                      onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                      placeholder="e.g. 58000"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                )}

                {prodForm.priceType === 'range' && (
                  <>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Min Price (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={prodForm.minPrice}
                        onChange={(e) => setProdForm({ ...prodForm, minPrice: e.target.value })}
                        placeholder="e.g. 55000"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Max Price (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={prodForm.maxPrice}
                        onChange={(e) => setProdForm({ ...prodForm, maxPrice: e.target.value })}
                        placeholder="e.g. 62000"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </>
                )}

                {prodForm.priceType === 'rfq' && (
                  <div className="sm:col-span-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center text-slate-600 font-bold">
                    <span>Buyers will submit quotation requests directly. No upfront price is shown.</span>
                  </div>
                )}
              </div>

              {/* Units, MOQ and Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Unit of Measurement *</label>
                  <select
                    value={prodForm.unit}
                    onChange={(e) => setProdForm({ ...prodForm, unit: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="Units">Units (Pieces)</option>
                    <option value="Tonnes">Tonnes (MT)</option>
                    <option value="Bags">Bags</option>
                    <option value="Kg">Kilograms (Kg)</option>
                    <option value="Litres">Litres</option>
                    <option value="Meters">Meters</option>
                    <option value="Sq. Ft">Sq. Feet</option>
                    <option value="Boxes">Boxes</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Minimum Order Qty (MOQ) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={prodForm.minOrderQty}
                    onChange={(e) => setProdForm({ ...prodForm, minOrderQty: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Available Stock *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Availability & Delivery Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Availability *</label>
                  <select
                    value={prodForm.availability}
                    onChange={(e) => setProdForm({ ...prodForm, availability: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="in_stock">In Stock (Immediate Dispatch)</option>
                    <option value="made_to_order">Made to Order / Production on Demand</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Delivery Locations *</label>
                  <input
                    type="text"
                    value={prodForm.deliveryLocations}
                    onChange={(e) => setProdForm({ ...prodForm, deliveryLocations: e.target.value })}
                    placeholder="e.g. Pan India, Maharashtra & Gujarat"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Product Image URL</label>
                <input
                  type="url"
                  value={prodForm.image}
                  onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Specifications */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Product Specifications (comma-separated or details)
                </label>
                <input
                  type="text"
                  value={prodForm.specifications}
                  onChange={(e) => setProdForm({ ...prodForm, specifications: e.target.value })}
                  placeholder="e.g. Grade: Fe 500D, Length: 12m, BIS Certified: IS 1786"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  placeholder="Detailed material grade, packaging options, test certificates included..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
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

      {/* =========================================================================
          MODAL: ADD / EDIT SERVICE
      ========================================================================= */}
      {servModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-navy-950 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <span>{editingService ? 'Edit Service Offering' : 'Publish Service Offering'}</span>
              </h3>
              <button
                onClick={() => setServModalOpen(false)}
                className="p-1 text-slate-400 hover:text-navy-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={servForm.name}
                  onChange={(e) => setServForm({ ...servForm, name: e.target.value })}
                  placeholder="e.g. Geotechnical Soil Investigation & Site Survey"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <label className="block font-bold text-slate-700 uppercase mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={servForm.subcategory}
                    onChange={(e) => setServForm({ ...servForm, subcategory: e.target.value })}
                    placeholder="e.g. Civil Engineering & Testing"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Pricing Type and Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Pricing Type *</label>
                  <select
                    value={servForm.pricingType}
                    onChange={(e) => setServForm({ ...servForm, pricingType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="starting_from">Starting From</option>
                    <option value="range">Price Range</option>
                    <option value="rfq">Request for Quotation</option>
                  </select>
                </div>

                {(servForm.pricingType === 'fixed' || servForm.pricingType === 'starting_from') && (
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      {servForm.pricingType === 'starting_from' ? 'Starting Price (₹)' : 'Price (₹)'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={servForm.price}
                      onChange={(e) => setServForm({ ...servForm, price: e.target.value })}
                      placeholder="e.g. 25000"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                )}

                {servForm.pricingType === 'range' && (
                  <>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Min Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={servForm.minPrice}
                        onChange={(e) => setServForm({ ...servForm, minPrice: e.target.value })}
                        placeholder="e.g. 15000"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">Max Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={servForm.maxPrice}
                        onChange={(e) => setServForm({ ...servForm, maxPrice: e.target.value })}
                        placeholder="e.g. 50000"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Service Locations and Coverage Pincodes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Service Locations / Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={servForm.serviceArea}
                    onChange={(e) => setServForm({ ...servForm, serviceArea: e.target.value })}
                    placeholder="e.g. Mumbai, Navi Mumbai & Thane"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Coverage Pincodes (Optional)
                  </label>
                  <input
                    type="text"
                    value={servForm.coveragePincodes}
                    onChange={(e) => setServForm({ ...servForm, coveragePincodes: e.target.value })}
                    placeholder="e.g. 400001, 400050, 400703"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Completion Time and Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Estimated Completion Time
                  </label>
                  <input
                    type="text"
                    value={servForm.estimatedCompletionTime}
                    onChange={(e) => setServForm({ ...servForm, estimatedCompletionTime: e.target.value })}
                    placeholder="e.g. 3-5 business days"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Availability</label>
                  <select
                    value={servForm.availability}
                    onChange={(e) => setServForm({ ...servForm, availability: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="available">Available (Accepting Assignments)</option>
                    <option value="on_demand">On-Demand / Advance Booking Required</option>
                    <option value="busy">Temporarily Busy / At Full Capacity</option>
                  </select>
                </div>
              </div>

              {/* Service Image URL */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Service Banner / Image URL</label>
                <input
                  type="url"
                  value={servForm.image}
                  onChange={(e) => setServForm({ ...servForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Specifications */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Service Specifications &amp; Methodology
                </label>
                <input
                  type="text"
                  value={servForm.specifications}
                  onChange={(e) => setServForm({ ...servForm, specifications: e.target.value })}
                  placeholder="e.g. Standard Penetration Test (SPT), Core Drilling, NABL Lab Reports"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Service Description</label>
                <textarea
                  rows={3}
                  value={servForm.description}
                  onChange={(e) => setServForm({ ...servForm, description: e.target.value })}
                  placeholder="Scope of work, equipment deployed, engineer credentials, safety protocols..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
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
