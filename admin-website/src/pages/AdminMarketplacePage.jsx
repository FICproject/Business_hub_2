import React, { useState, useEffect } from 'react';
import { Trash2, Search } from 'lucide-react';
import { adminApi } from '../services/api';
export const AdminMarketplacePage = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const loadProducts = () => {
        setLoading(true);
        adminApi.getProducts({ search: search || undefined })
            .then((res) => {
            if (res.data.success) {
                setProducts(res.data.data);
            }
        })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        loadProducts();
    }, []);
    const handleDelete = async (id, title) => {
        if (!confirm(`Are you sure you want to remove "${title}" from the marketplace?`))
            return;
        try {
            await adminApi.deleteProduct(id);
            loadProducts();
        }
        catch (err) {
            alert(err.response?.data?.message || 'Error removing product');
        }
    };
    return (<div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Marketplace Moderation</h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor approved listings, enforce quality guidelines, and remove non-compliant items.
        </p>
      </div>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"/>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadProducts()} placeholder="Search products..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"/>
        </div>
        <span className="text-xs font-bold text-teal-400">{products.length} Products Online</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (<div key={p._id} className="bg-slate-950 rounded-3xl p-5 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <img src={p.images[0]} alt={p.title} className="w-full h-40 rounded-2xl object-cover bg-slate-900"/>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-teal-950 text-teal-400 border border-teal-800/60">
                  {p.category}
                </span>
                <span className="text-xs font-semibold text-slate-400">Stock: {p.stock}</span>
              </div>
              <h4 className="font-bold text-sm text-white line-clamp-1">{p.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-base font-extrabold text-white">${p.price}</span>
              <button onClick={() => handleDelete(p._id, p.title)} className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs flex items-center gap-1.5 border border-red-500/30 transition-colors">
                <Trash2 className="w-3.5 h-3.5"/> Remove
              </button>
            </div>
          </div>))}
      </div>
    </div>);
};
