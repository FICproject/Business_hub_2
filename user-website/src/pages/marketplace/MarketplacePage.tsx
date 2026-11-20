import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  ShoppingBag,
  Search,
  Filter,
  Star,
  Share2,
  Check,
  ShieldCheck,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { marketplaceApi } from '../../services/api';
import { setCart } from '../../store';
import { IProduct, IService } from '../../types';
import { ShareModal } from '../../components/sharing/ShareModal';

export const MarketplacePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'services' ? 'services' : 'products';
  const initialCategory = searchParams.get('category') || 'all';

  const [activeTab, setActiveTab] = useState<'products' | 'services'>(initialTab);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState('newest');
  const [loading, setLoading] = useState(true);

  // Share modal state
  const [shareItem, setShareItem] = useState<{ id: string; title: string; type: 'product' | 'service' } | null>(null);

  // Cart toast notification
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loadData = () => {
    setLoading(true);
    if (activeTab === 'products') {
      marketplaceApi.getProducts({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery || undefined,
        sort: sortOption,
      })
        .then((res) => setProducts(res.data.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      marketplaceApi.getServices()
        .then((res) => setServices(res.data.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, selectedCategory, sortOption]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string, title: string) => {
    e.stopPropagation();
    try {
      const res = await marketplaceApi.addToCart({ productId, quantity: 1 });
      if (res.data.success) {
        // Fetch refreshed cart to update Redux store
        const cartRes = await marketplaceApi.getCart();
        dispatch(setCart(cartRes.data.cart));
        setAddedToast(`Added "${title}" to cart!`);
        setTimeout(() => setAddedToast(null), 3000);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        alert(err.response?.data?.message || 'Could not add to cart');
      }
    }
  };

  const categories = [
    { label: 'All Categories', value: 'all' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Audio', value: 'audio' },
    { label: 'Office', value: 'office' },
    { label: 'Technology', value: 'technology' },
    { label: 'Security', value: 'security' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Alert */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-sm animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-5 h-5 text-teal-200" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">
            Strict Seller Privacy Protected
          </span>
          <h1 className="text-3xl font-extrabold text-navy-900 mt-2">Marketplace</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified enterprise equipment, workstations, developer gadgets, and professional services.
          </p>
        </div>

        {/* Product / Service Switcher */}
        <div className="flex items-center p-1 bg-slate-200/80 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'products'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'services'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Services ({services.length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {activeTab === 'products' && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 bg-slate-200/60 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-lg">No Products Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No items match your filter criteria. Try searching for a different keyword or category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/marketplace/products/${p._id}`)}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all overflow-hidden flex flex-col cursor-pointer relative"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-navy-900/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md">
                      {p.category}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShareItem({ id: p._id, title: p.title, type: 'product' });
                      }}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-sm text-slate-700 hover:text-teal-600 shadow-sm transition-colors"
                      title="Share product"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold mb-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{p.rating || 4.9}</span>
                      <span className="text-slate-400">({p.reviewsCount || 18})</span>
                    </div>

                    <h3 className="font-bold text-slate-800 text-base line-clamp-2 mb-2 group-hover:text-teal-600 transition-colors">
                      {p.title}
                    </h3>

                    {p.variants && p.variants.length > 0 && (
                      <p className="text-[11px] text-teal-600 font-semibold mb-3">
                        ✓ {p.variants.length} Variant(s) Available
                      </p>
                    )}

                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100">
                      <div>
                        <span className="text-xl font-extrabold text-slate-900">${p.discountPrice || p.price}</span>
                        {p.discountPrice && (
                          <span className="text-xs text-slate-400 line-through ml-1.5">${p.price}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, p._id, p.title)}
                        className="px-3.5 py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Services Grid */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row gap-6 items-center justify-between"
            >
              <img src={s.images[0]} alt={s.title} className="w-full sm:w-44 h-44 rounded-2xl object-cover" />
              <div className="space-y-3 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-teal-600 uppercase bg-teal-50 px-2.5 py-1 rounded-md">{s.serviceArea}</span>
                  <button
                    onClick={() => setShareItem({ id: s._id, title: s.title, type: 'service' })}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-bold text-lg text-slate-800 leading-snug">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-extrabold text-navy-800">
                    {s.pricingType === 'quote' ? 'Quote-Based Pricing' : `$${s.price} Fixed`}
                  </span>
                  <button
                    onClick={() => alert(`Configurable Service Booking: Inquiries for "${s.title}" will open direct consultation.`)}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
                  >
                    Inquire Service
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {shareItem && (
        <ShareModal
          isOpen={!!shareItem}
          onClose={() => setShareItem(null)}
          targetType={shareItem.type}
          targetId={shareItem.id}
          title={shareItem.title}
        />
      )}
    </div>
  );
};
