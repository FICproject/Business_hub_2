import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  ShoppingBag,
  Search,
  Star,
  Share2,
  Check,
  ShieldCheck,
  ArrowRight,
  Layers,
  Sparkles,
  Package,
  Cpu,
  Headphones,
  Laptop,
  Briefcase,
  Lock,
  FileText,
  MapPin,
  Clock,
  Eye,
  Send,
} from 'lucide-react';
import { marketplaceApi } from '../../services/api';
import { setCart } from '../../store';
import { ShareModal } from '../../components/sharing/ShareModal';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { RequestQuotationModal } from '../../components/quotations/RequestQuotationModal';
export const MarketplacePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') === 'services' ? 'services' : 'products';
    const initialCategory = searchParams.get('category') || 'all';
    const initialSearch = searchParams.get('search') || '';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [sortOption, setSortOption] = useState('newest');
    const [loading, setLoading] = useState(true);
    // Share modal state
    const [shareItem, setShareItem] = useState(null);
    // RFQ modal state
    const [rfqItem, setRfqItem] = useState(null);
    // Cart toast notification
    const [addedToast, setAddedToast] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loadData = () => {
        setLoading(true);
        if (activeTab === 'products') {
            marketplaceApi
                .getProducts({
                category: selectedCategory !== 'all' ? selectedCategory : undefined,
                search: searchQuery || undefined,
                sort: sortOption,
            })
                .then((res) => {
                if (res.data?.data) {
                    setProducts(res.data.data);
                }
            })
                .catch((err) => console.error('Products load notice:', err.message))
                .finally(() => setLoading(false));
        }
        else {
            marketplaceApi
                .getServices()
                .then((res) => {
                if (res.data?.data) {
                    setServices(res.data.data);
                }
            })
                .catch((err) => console.error('Services load notice:', err.message))
                .finally(() => setLoading(false));
        }
    };
    useEffect(() => {
        loadData();
    }, [activeTab, selectedCategory, sortOption]);
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        loadData();
    };
    const handleAddToCart = async (e, productId, title) => {
        e.stopPropagation();
        try {
            const res = await marketplaceApi.addToCart({ productId, quantity: 1 });
            if (res.data?.success) {
                const cartRes = await marketplaceApi.getCart();
                dispatch(setCart(cartRes.data.cart));
                setAddedToast(`Added "${title}" to your cart!`);
                setTimeout(() => setAddedToast(null), 3000);
            }
        }
        catch (err) {
            if (err.response?.status === 401) {
                navigate('/login');
            }
            else {
                alert(err.response?.data?.message || 'Could not add to cart');
            }
        }
    };
    const categories = [
        { label: 'All Categories', value: 'all', icon: Layers },
        { label: 'Electronics', value: 'electronics', icon: Cpu },
        { label: 'Audio & Sound', value: 'audio', icon: Headphones },
        { label: 'Office & Desk', value: 'office', icon: Briefcase },
        { label: 'Technology', value: 'technology', icon: Laptop },
        { label: 'Security & Access', value: 'security', icon: Lock },
    ];
    // Featured products (top rated / featured flag)
    const featuredProducts = products.filter((p) => p.isFeatured || p.price > 100).slice(0, 4);
    // Popular products (high stock or reviews)
    const popularProducts = products.slice(0, 6);
    return (<div className="bg-white min-h-screen text-[#0A255C] font-sans pb-16">
      {/* Toast Alert */}
      {addedToast && (<div className="fixed bottom-6 right-6 z-50 bg-[#0A255C] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs sm:text-sm border border-amber-400/40 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-[3]"/>
          </div>
          <span>{addedToast}</span>
        </div>)}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Breadcrumb Navigation */}
        <Breadcrumb currentPage="Marketplace"/>

        {/* =====================================================================
            1. MARKETPLACE HERO SECTION
        ====================================================================== */}
        <section className="relative rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-[#071536] via-[#0D2459] to-[#153A8A] text-white shadow-2xl overflow-hidden mb-12">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"/>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"/>

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB800] text-xs font-bold tracking-wide">
              <ShoppingBag className="w-3.5 h-3.5"/>
              <span>Verified Commercial Marketplace</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Explore Enterprise Gear, <br />
              <span className="text-[#FFB800]">Products &amp; Services</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed font-normal">
              Direct trade between verified sellers and customers. Zero counterfeit risks, transparent pricing, mandatory seller privacy, and instant checkout.
            </p>

            {/* Quick Hero Search & Switcher */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"/>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products, workstations, gadgets, services..." className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FFB800] shadow-lg"/>
              </form>

              <button type="button" onClick={handleSearchSubmit} className="px-7 py-3.5 rounded-2xl bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-xs sm:text-sm shadow-lg hover:scale-105 transition-all text-center flex items-center justify-center gap-2">
                <span>Search Now</span>
                <ArrowRight className="w-4 h-4 font-bold"/>
              </button>
            </div>

            {/* Trust Badges Row */}
            <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400"/>
                <span>Strict Seller Privacy</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Package className="w-4 h-4 text-amber-400"/>
                <span>Verified Direct Shipping</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-400"/>
                <span>Zero Commission Scams</span>
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================================
            2. PRODUCT CATEGORIES BROWSER
        ====================================================================== */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A255C]">Browse by Category</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Filter inventory across top commercial sectors</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.value;
            return (<button key={cat.value} type="button" onClick={() => {
                    setSelectedCategory(cat.value);
                    setActiveTab('products');
                }} className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all group ${isSelected
                    ? 'bg-[#0A255C] text-white border-[#0A255C] shadow-md scale-[1.02]'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700 hover:border-slate-300 shadow-sm'}`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 ${isSelected ? 'bg-white/10 text-[#FFB800]' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-5 h-5"/>
                  </div>
                  <span className="text-xs font-bold leading-tight">{cat.label}</span>
                </button>);
        })}
          </div>
        </section>

        {/* =====================================================================
            3. TAB SWITCHER (Products vs Services) & FILTER BAR
        ====================================================================== */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          {/* Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl w-full md:w-auto">
            <button type="button" onClick={() => setActiveTab('products')} className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${activeTab === 'products'
            ? 'bg-[#0A255C] text-white shadow-sm'
            : 'text-slate-600 hover:text-[#0A255C]'}`}>
              Products ({products.length})
            </button>
            <button type="button" onClick={() => setActiveTab('services')} className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${activeTab === 'services'
            ? 'bg-[#0A255C] text-white shadow-sm'
            : 'text-slate-600 hover:text-[#0A255C]'}`}>
              Services ({services.length})
            </button>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A255C]">
              {categories.map((c) => (<option key={c.value} value={c.value}>
                  {c.label}
                </option>))}
            </select>

            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A255C]">
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* =====================================================================
            4. FEATURED PRODUCTS HIGHLIGHT
        ====================================================================== */}
        {activeTab === 'products' && featuredProducts.length > 0 && selectedCategory === 'all' && !searchQuery && (<section className="mb-14">
            <div className="flex items-center gap-2 mb-4">
              <span className="p-1 rounded-lg bg-amber-100 text-amber-700">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500"/>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A255C]">Featured Selections</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (<div key={p._id} onClick={() => navigate(`/marketplace/products/${p._id}`)} className="bg-white rounded-3xl border border-amber-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer relative">
                  <div className="relative h-52 bg-slate-50 overflow-hidden">
                    <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                    <span className="absolute top-3 left-3 bg-[#0A255C] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
                      Featured
                    </span>
                    <button type="button" onClick={(e) => {
                    e.stopPropagation();
                    setShareItem({ id: p._id, title: p.title, type: 'product' });
                }} className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#0A255C] shadow-sm transition-all" title="Share link">
                      <Share2 className="w-3.5 h-3.5"/>
                    </button>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded w-fit mb-1.5">
                      {p.category}
                    </span>
                    <h3 className="font-extrabold text-[#0A255C] text-base group-hover:text-amber-600 transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{p.description}</p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 font-medium">Price</span>
                        <p className="text-lg font-black text-[#0A255C] leading-none">${p.price.toFixed(2)}</p>
                      </div>

                      <button type="button" onClick={(e) => handleAddToCart(e, p._id, p.title)} className="px-4 py-2 rounded-xl bg-[#0A255C] hover:bg-[#071B42] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5"/>
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>))}
            </div>
          </section>)}

        {/* =====================================================================
            5. MAIN PRODUCTS CATALOG GRID
        ====================================================================== */}
        {activeTab === 'products' ? (<section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0A255C]">
                  {selectedCategory === 'all' ? 'All Products Catalog' : `${selectedCategory.toUpperCase()} Listings`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Showing {products.length} verified listings
                </p>
              </div>
            </div>

            {loading ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (<div key={n} className="h-80 bg-slate-100 rounded-3xl animate-pulse"/>))}
              </div>) : products.length === 0 ? (<div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto"/>
                <h3 className="font-extrabold text-[#0A255C] text-lg">No Products Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No items match your filter criteria. Try adjusting your keyword or category.
                </p>
                <button type="button" onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                }} className="px-5 py-2.5 rounded-full bg-[#0A255C] text-white font-bold text-xs">
                  Reset Filters
                </button>
              </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((p) => (<div key={p._id} onClick={() => navigate(`/marketplace/products/${p._id}`)} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer relative">
                    <div className="relative h-48 bg-slate-50 overflow-hidden">
                      <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                      <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        Stock: {p.stock} {p.unit || 'Units'}
                      </span>
                      <button type="button" onClick={(e) => {
                        e.stopPropagation();
                        setShareItem({ id: p._id, title: p.title, type: 'product' });
                    }} className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-[#0A255C] shadow-sm transition-all" title="Share link">
                        <Share2 className="w-3.5 h-3.5"/>
                      </button>
                    </div>

                    <div className="p-5 flex flex-col flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {p.category}
                        </span>
                        {p.deliveryLocations && (
                          <span className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]" title={p.deliveryLocations}>
                            📍 {p.deliveryLocations}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-[#0A255C] text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                        {p.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{p.description}</p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Price</span>
                          <p className="text-base font-black text-[#0A255C]">
                            {p.priceType === 'rfq'
                              ? 'RFQ Required'
                              : p.priceType === 'range'
                              ? `₹${p.minPrice} - ₹${p.maxPrice}`
                              : `₹${p.price}`}
                          </p>
                        </div>
                      </div>

                      {/* Prominent Action Buttons */}
                      <div className="pt-2 grid grid-cols-2 gap-2 mt-auto">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRfqItem({ item: p, type: 'product' });
                          }}
                          className="py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Quote</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/marketplace/products/${p._id}`);
                          }}
                          className="py-2 px-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </div>
                    </div>
                  </div>))}
              </div>)}
          </section>) : (
        /* =====================================================================
            6. SERVICES SECTION SHOWCASE
        ====================================================================== */
        <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0A255C]">Professional Services</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Hire verified engineering, contracting, architectural, and commercial services
                </p>
              </div>
            </div>

            {services.length === 0 && !loading ? (<div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
                <Layers className="w-12 h-12 text-slate-300 mx-auto"/>
                <h3 className="font-extrabold text-[#0A255C] text-lg">No Services Available</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Verified providers are currently updating their commercial service offerings.
                </p>
              </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((s) => (<div key={s._id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                          {s.category}
                        </span>
                        <span className="text-sm font-black text-[#0A255C]">
                          {s.pricingType === 'rfq'
                            ? 'RFQ Required'
                            : s.pricingType === 'starting_from'
                            ? `From ₹${s.price}`
                            : s.pricingType === 'range'
                            ? `₹${s.minPrice} - ₹${s.maxPrice}`
                            : s.price ? `₹${s.price}` : 'Quote Based'}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-[#0A255C] line-clamp-1">{s.title || s.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{s.description}</p>

                      <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>Coverage: {s.serviceArea || s.locations || 'All Regions'}</span>
                        </p>
                        {s.estimatedCompletionTime && (
                          <p className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>Timeline: {s.estimatedCompletionTime}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        Admin Verified
                      </span>
                      <button
                        type="button"
                        onClick={() => setRfqItem({ item: s, type: 'service' })}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Request Quotation</span>
                      </button>
                    </div>
                  </div>))}
              </div>)}
          </section>)}

        {/* =====================================================================
            7. VIEW ALL & SELLER CTA BANNER
        ====================================================================== */}
        <section className="mt-16 bg-gradient-to-r from-[#0A255C] to-[#153A8A] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">Are you a merchant or store owner?</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              List your inventory on Business Hub with guaranteed identity privacy and zero commission traps.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/business" className="px-6 py-3 rounded-full bg-[#FFB800] hover:bg-[#FFAE00] text-[#0A255C] font-black text-xs shadow-md transition-all">
              Start Selling Today
            </Link>
          </div>
        </section>
      </div>

      {/* Share Modal */}
      {shareItem && (<ShareModal isOpen={!!shareItem} onClose={() => setShareItem(null)} targetType={shareItem.type} targetId={shareItem.id} title={shareItem.title}/>)}

      {/* Request Quotation Modal */}
      {rfqItem && (
        <RequestQuotationModal
          isOpen={!!rfqItem}
          onClose={() => setRfqItem(null)}
          item={rfqItem.item}
          type={rfqItem.type}
          onSuccess={() => {
            setAddedToast('Quotation request submitted to Central Admin!');
            setTimeout(() => setAddedToast(null), 4000);
          }}
        />
      )}
    </div>);
};
