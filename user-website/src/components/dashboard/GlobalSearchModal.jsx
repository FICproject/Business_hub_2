import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Store, GraduationCap, Briefcase, Building2, ArrowRight, ShieldCheck, } from 'lucide-react';
import { usersApi } from '../../services/api';
export const GlobalSearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [results, setResults] = useState({
        products: [],
        services: [],
        courses: [],
        jobs: [],
        businesses: [],
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (!query.trim()) {
            setResults({ products: [], services: [], courses: [], jobs: [], businesses: [] });
            return;
        }
        const timer = setTimeout(() => {
            setLoading(true);
            usersApi
                .globalSearch({ q: query, category: activeCategory })
                .then((res) => {
                if (res.data.success) {
                    setResults(res.data.data);
                }
            })
                .catch((err) => console.log('Search notice:', err))
                .finally(() => setLoading(false));
        }, 250);
        return () => clearTimeout(timer);
    }, [query, activeCategory]);
    if (!isOpen)
        return null;
    const handleSelect = (url) => {
        onClose();
        navigate(url);
    };
    const totalResultsCount = (results.products?.length || 0) +
        (results.services?.length || 0) +
        (results.courses?.length || 0) +
        (results.jobs?.length || 0) +
        (results.businesses?.length || 0);
    return (<div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0"/>
          <input type="text" autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search across Marketplace, Courses, Jobs, and Businesses..." className="w-full text-sm sm:text-base font-medium text-navy-950 placeholder:text-slate-400 focus:outline-none"/>
          {query && (<button onClick={() => setQuery('')} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <X className="w-4 h-4"/>
            </button>)}
          <button onClick={onClose} className="px-2.5 py-1 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg">
            ESC
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs font-bold scrollbar-none bg-slate-50/50">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'products', label: 'Products' },
            { id: 'courses', label: '100% Free Courses' },
            { id: 'jobs', label: 'Verified Jobs' },
            { id: 'businesses', label: 'Businesses' },
            { id: 'services', label: 'Services' },
        ].map((tab) => (<button key={tab.id} onClick={() => setActiveCategory(tab.id)} className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${activeCategory === tab.id
                ? 'bg-navy-900 text-white'
                : 'text-slate-600 hover:bg-slate-200/70'}`}>
              {tab.label}
            </button>))}
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {loading && (<div className="py-12 text-center text-xs font-semibold text-slate-400">
              Searching Business Hub database...
            </div>)}

          {!loading && !query && (<div className="py-12 text-center space-y-2">
              <Search className="w-10 h-10 text-slate-300 mx-auto"/>
              <p className="text-xs font-semibold text-slate-500">
                Type a keyword to discover products, free courses, jobs, or verified business profiles.
              </p>
            </div>)}

          {!loading && query && totalResultsCount === 0 && (<div className="py-12 text-center space-y-1">
              <p className="text-sm font-extrabold text-navy-950">No results found for "{query}"</p>
              <p className="text-xs text-slate-400">Try checking spelling or using broader keywords.</p>
            </div>)}

          {/* Products */}
          {results.products?.length > 0 && (<div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-teal-600"/>
                  Products ({results.products.length})
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {results.products.map((p) => (<div key={p._id} onClick={() => handleSelect(`/marketplace/products/${p._id}`)} className="p-3 rounded-2xl border border-slate-200/80 hover:border-teal-500 hover:bg-teal-50/30 cursor-pointer transition-all flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-navy-900">{p.title}</p>
                      <p className="text-[11px] text-slate-500">{p.category} • ${p.price?.toFixed(2)}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400"/>
                  </div>))}
              </div>
            </div>)}

          {/* Courses */}
          {results.courses?.length > 0 && (<div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-500"/>
                  Courses ({results.courses.length})
                </span>
                <span className="text-[10px] text-teal-600 font-extrabold">100% Free</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {results.courses.map((c) => (<div key={c._id} onClick={() => handleSelect(`/education/courses/${c._id}`)} className="p-3 rounded-2xl border border-slate-200/80 hover:border-amber-400 hover:bg-amber-50/30 cursor-pointer transition-all flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-navy-900">{c.title}</p>
                      <p className="text-[11px] text-slate-500">{c.category} • Free Certificate</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400"/>
                  </div>))}
              </div>
            </div>)}

          {/* Jobs */}
          {results.jobs?.length > 0 && (<div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600"/>
                  Verified Jobs ({results.jobs.length})
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {results.jobs.map((j) => (<div key={j._id} onClick={() => handleSelect(`/jobs/${j._id}`)} className="p-3 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition-all flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-navy-900">{j.title}</p>
                      <p className="text-[11px] text-slate-500">{j.businessName} • {j.location} ({j.workMode})</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400"/>
                  </div>))}
              </div>
            </div>)}

          {/* Businesses (Owner Privacy Enforced) */}
          {results.businesses?.length > 0 && (<div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-navy-700"/>
                  Enterprises & Businesses ({results.businesses.length})
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {results.businesses.map((b) => (<div key={b._id} onClick={() => handleSelect('/business')} className="p-3 rounded-2xl border border-slate-200/80 hover:border-navy-400 hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-extrabold text-navy-900">{b.businessName}</p>
                        {b.verificationStatus === 'approved' && (<ShieldCheck className="w-3.5 h-3.5 text-emerald-600"/>)}
                      </div>
                      <p className="text-[11px] text-slate-500">{b.businessType} • {b.city || 'Verified Company'}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400"/>
                  </div>))}
              </div>
            </div>)}
        </div>
      </div>
    </div>);
};
