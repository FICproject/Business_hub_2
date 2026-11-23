import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ExternalLink, Store, GraduationCap, Briefcase, Layers, Calendar, Users, Search, } from 'lucide-react';
import { usersApi } from '../../services/api';
export const SavedItemsView = ({ onItemRemoved }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const loadSaved = () => {
        setLoading(true);
        usersApi
            .getSavedItems()
            .then((res) => {
            if (res.data.success) {
                setItems(res.data.data || []);
            }
        })
            .catch((err) => console.log('Saved items error:', err))
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        loadSaved();
    }, []);
    const handleRemove = async (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await usersApi.removeSavedItem(id);
            setItems((prev) => prev.filter((item) => item._id !== id));
            if (onItemRemoved)
                onItemRemoved();
        }
        catch (err) {
            alert(err.response?.data?.message || 'Could not remove item');
        }
    };
    const getTargetIcon = (type) => {
        switch (type) {
            case 'product':
                return <Store className="w-4 h-4 text-teal-600"/>;
            case 'course':
                return <GraduationCap className="w-4 h-4 text-amber-500"/>;
            case 'job':
                return <Briefcase className="w-4 h-4 text-blue-600"/>;
            case 'service':
                return <Layers className="w-4 h-4 text-purple-600"/>;
            case 'event':
                return <Calendar className="w-4 h-4 text-rose-500"/>;
            case 'community':
                return <Users className="w-4 h-4 text-indigo-600"/>;
            default:
                return <Bookmark className="w-4 h-4 text-slate-500"/>;
        }
    };
    const getResolvedUrl = (item) => {
        if (item.url)
            return item.url;
        switch (item.targetType) {
            case 'product':
                return `/marketplace/products/${item.targetId}`;
            case 'course':
                return `/education/courses/${item.targetId}`;
            case 'job':
                return `/jobs/${item.targetId}`;
            case 'event':
                return '/events';
            case 'community':
                return '/community';
            default:
                return '/marketplace';
        }
    };
    const filteredItems = items.filter((item) => {
        const matchesCategory = activeCategory === 'all' || item.targetType === activeCategory;
        const matchesQuery = !searchQuery ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesQuery;
    });
    return (<div className="space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold text-navy-950">Unified Saved Items & Wishlist</h3>
            <p className="text-xs text-slate-500">
              Your saved marketplace products, free masterclasses, career positions, and events
            </p>
          </div>
          <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 self-start sm:self-auto">
            {items.length} Total Saved
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            {[
            { id: 'all', label: 'All Items' },
            { id: 'product', label: 'Products' },
            { id: 'course', label: 'Courses' },
            { id: 'job', label: 'Jobs' },
            { id: 'service', label: 'Services' },
            { id: 'event', label: 'Events' },
        ].map((tab) => (<button key={tab.id} onClick={() => setActiveCategory(tab.id)} className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${activeCategory === tab.id
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {tab.label}
              </button>))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"/>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search saved items..." className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"/>
          </div>
        </div>
      </div>

      {/* Grid of Saved Items */}
      {loading ? (<div className="py-16 text-center text-xs font-semibold text-slate-400">Loading your saved items...</div>) : filteredItems.length === 0 ? (<div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto"/>
          <p className="text-sm font-extrabold text-navy-950">No saved items found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse our Marketplace, Free Courses, or Career Openings and click "Save" to build your personalized collection.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link to="/marketplace" className="px-4 py-2 rounded-xl bg-navy-900 text-white font-bold text-xs">
              Explore Products
            </Link>
            <Link to="/education" className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs">
              Free Courses
            </Link>
          </div>
        </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (<div key={item._id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                    {getTargetIcon(item.targetType)}
                    {item.targetType}
                  </span>
                  <button onClick={(e) => handleRemove(item._id, e)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Remove from saved">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>

                <div>
                  <h4 className="font-extrabold text-navy-950 text-sm sm:text-base line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>
                </div>

                {item.price !== null && item.price !== undefined && (<p className="text-base font-extrabold text-teal-700">
                    {item.price === 0 ? '100% Free' : `$${item.price.toFixed(2)}`}
                  </p>)}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  Saved {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <Link to={getResolvedUrl(item)} className="inline-flex items-center gap-1 text-xs font-bold text-navy-900 hover:text-teal-600 transition-colors">
                  View Details
                  <ExternalLink className="w-3.5 h-3.5"/>
                </Link>
              </div>
            </div>))}
        </div>)}
    </div>);
};
