import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingBag, Store, GraduationCap, Briefcase, Share2, ArrowRight, Bookmark, Sparkles, } from 'lucide-react';
import { marketplaceApi, educationApi, jobsApi, sharingApi, usersApi } from '../../services/api';
import { StatCard } from '../../components/dashboard/StatCard';
import { ProfileCompletion } from '../../components/dashboard/ProfileCompletion';
import { SavedItemsView } from '../../components/dashboard/SavedItemsView';
import { JobApplicationsView } from '../../components/dashboard/JobApplicationsView';
export const NormalUserDashboardPage = () => {
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
        }
        else {
            setSearchParams({ tab: newTab });
        }
    };
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [courses, setCourses] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [sharedLinks, setSharedLinks] = useState([]);
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        Promise.allSettled([
            marketplaceApi.getMyOrders(),
            marketplaceApi.getProducts({ limit: 8 }),
            educationApi.getCourses({ limit: 6 }),
            jobsApi.getJobs({ limit: 6 }),
            jobsApi.getMyApplications(),
            sharingApi.getMySharedLinks(),
            usersApi.getSavedItems(),
        ]).then(([ordRes, prodRes, crsRes, jobRes, appRes, shrRes, savRes]) => {
            if (ordRes.status === 'fulfilled')
                setOrders(ordRes.value.data.data || []);
            if (prodRes.status === 'fulfilled')
                setProducts(prodRes.value.data.data || []);
            if (crsRes.status === 'fulfilled')
                setCourses(crsRes.value.data.data || []);
            if (jobRes.status === 'fulfilled')
                setJobs(jobRes.value.data.data || []);
            if (appRes.status === 'fulfilled')
                setApplications(appRes.value.data.data || []);
            if (shrRes.status === 'fulfilled')
                setSharedLinks(shrRes.value.data.data || []);
            if (savRes.status === 'fulfilled')
                setSavedItems(savRes.value.data.data || []);
            setLoading(false);
        });
    }, []);
    return (<div className="space-y-6 max-w-7xl mx-auto">
      {/* =========================================================================
            OVERVIEW DASHBOARD
        ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5"/>
                Personalized Consumer & Member Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.fullName}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Browse multi-vendor goods, access 100% free courses, explore verified job openings, and share privacy-safe links with zero spam.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 z-10">
              <button onClick={() => handleTabChange('marketplace')} className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-navy-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5">
                <Store className="w-4 h-4"/>
                Explore Store
              </button>
              <button onClick={() => handleTabChange('learning')} className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-sm transition-all flex items-center gap-1.5 border border-white/10">
                <GraduationCap className="w-4 h-4 text-teal-300"/>
                Free Learning
              </button>
            </div>
          </div>

          {/* Profile Completion Tracker */}
          <ProfileCompletion user={user} compact/>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="My Orders" value={orders.length} subtext="Marketplace purchases" icon={ShoppingBag} badge="Verified" badgeColor="emerald" onClick={() => handleTabChange('orders')}/>
            <StatCard label="Saved Items" value={savedItems.length} subtext="Wishlist & bookmarks" icon={Bookmark} badge="Personal" badgeColor="amber" onClick={() => handleTabChange('saved')}/>
            <StatCard label="Job Applications" value={applications.length} subtext="Active submissions" icon={Briefcase} badge="Careers" badgeColor="blue" onClick={() => handleTabChange('applications')}/>
            <StatCard label="Shared Links" value={sharedLinks.length} subtext="Attributed clicks" icon={Share2} badge="Clean Share" badgeColor="teal" onClick={() => handleTabChange('sharing')}/>
          </div>

          {/* Recent Orders Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-navy-950 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-teal-600"/>
                Recent Orders
              </h3>
              <button onClick={() => handleTabChange('orders')} className="text-xs font-bold text-teal-600 hover:underline">
                View all ({orders.length})
              </button>
            </div>

            {orders.length === 0 ? (<div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center space-y-2">
                <p className="text-xs font-semibold text-slate-500">You haven't placed any orders yet.</p>
                <Link to="/marketplace" className="inline-block text-xs font-bold text-teal-600 hover:underline">
                  Start shopping in our multi-vendor marketplace →
                </Link>
              </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.slice(0, 3).map((ord) => (<div key={ord._id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {ord.orderStatus}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Order ID: #{ord._id.slice(0, 8)}</p>
                      <p className="text-lg font-extrabold text-navy-950">${ord.totalAmount?.toFixed(2)}</p>
                      <p className="text-xs text-slate-600 mt-1">{ord.items?.length || 0} item(s)</p>
                    </div>
                  </div>))}
              </div>)}
          </div>

          {/* Recommended Products */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-navy-950 flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-500"/>
                Recommended Products
              </h3>
              <Link to="/marketplace" className="text-xs font-bold text-teal-600 hover:underline">
                Browse Marketplace
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((prod) => (<Link key={prod._id} to={`/marketplace/products/${prod._id}`} className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                  <div className="space-y-2">
                    <div className="h-32 bg-slate-100 rounded-2xl overflow-hidden">
                      <img src={prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80'} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">{prod.category}</span>
                    <h4 className="text-xs font-extrabold text-navy-950 line-clamp-2">{prod.title}</h4>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                    <span className="text-sm font-extrabold text-navy-900">${prod.price?.toFixed(2)}</span>
                    <span className="text-[10px] font-bold text-teal-600 flex items-center gap-0.5">
                      View <ArrowRight className="w-3 h-3"/>
                    </span>
                  </div>
                </Link>))}
            </div>
          </div>

          {/* Popular Free Courses & Latest Jobs Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 100% Free Courses */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-navy-950 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-teal-600"/>
                    100% Free Learning
                  </h3>
                  <p className="text-[11px] text-slate-400">Zero tuition fees, forever open</p>
                </div>
                <Link to="/education" className="text-xs font-bold text-teal-600 hover:underline">
                  View all
                </Link>
              </div>

              <div className="space-y-2">
                {courses.slice(0, 3).map((crs) => (<Link key={crs._id} to={`/education/courses/${crs._id}`} className="p-3 rounded-2xl border border-slate-100 hover:border-teal-500 hover:bg-teal-50/20 transition-all flex items-center justify-between group block">
                    <div>
                      <p className="text-xs font-extrabold text-navy-950 group-hover:text-teal-700">{crs.title}</p>
                      <p className="text-[10px] text-slate-400">{crs.category} • Free Certificate</p>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Free
                    </span>
                  </Link>))}
              </div>
            </div>

            {/* Verified Job Openings */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-navy-950 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-600"/>
                    Verified Jobs & Careers
                  </h3>
                  <p className="text-[11px] text-slate-400">Direct applications with verified employers</p>
                </div>
                <Link to="/jobs" className="text-xs font-bold text-teal-600 hover:underline">
                  View all
                </Link>
              </div>

              <div className="space-y-2">
                {jobs.slice(0, 3).map((j) => (<Link key={j._id} to={`/jobs/${j._id}`} className="p-3 rounded-2xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex items-center justify-between group block">
                    <div>
                      <p className="text-xs font-extrabold text-navy-950 group-hover:text-blue-700">{j.title}</p>
                      <p className="text-[10px] text-slate-400">{j.businessName} • {j.location} ({j.workMode})</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600"/>
                  </Link>))}
              </div>
            </div>
          </div>
        </div>)}

      {/* 2. MARKETPLACE TAB */}
      {activeTab === 'marketplace' && (<div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-navy-950">Multi-Vendor Marketplace</h3>
              <p className="text-xs text-slate-500">Shop verified enterprise products, digital tools, and physical goods</p>
            </div>
            <button onClick={() => handleTabChange('orders')} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs">
              My Orders ({orders.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod) => (<div key={prod._id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-40 bg-slate-100 rounded-2xl overflow-hidden">
                    <img src={prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80'} alt={prod.title} className="w-full h-full object-cover"/>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">{prod.category}</span>
                  <h4 className="font-extrabold text-sm text-navy-950 line-clamp-2">{prod.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{prod.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-base font-extrabold text-navy-900">${prod.price?.toFixed(2)}</span>
                  <button onClick={() => alert(`Added ${prod.title} to your cart!`)} className="px-3.5 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm">
                    <ShoppingBag className="w-3.5 h-3.5"/>
                    Buy
                  </button>
                </div>
              </div>))}
          </div>
        </div>)}

      {/* 3. ORDERS TAB */}
      {activeTab === 'orders' && (<div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-navy-950">Marketplace Purchase History</h3>
              <p className="text-xs text-slate-500">Track shipments, receipts, and order statuses</p>
            </div>
            <Link to="/marketplace" className="px-4 py-2 rounded-xl bg-navy-900 text-white font-bold text-xs">
              Continue Shopping
            </Link>
          </div>

          {orders.length === 0 ? (<div className="py-12 text-center space-y-2">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto"/>
              <p className="text-xs text-slate-500">No marketplace purchases yet.</p>
            </div>) : (<div className="space-y-3">
              {orders.map((ord) => (<div key={ord._id} className="p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-navy-950">Order #{ord._id.slice(0, 8)}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {ord.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Date: {new Date(ord.createdAt).toLocaleDateString()} • Total: ${ord.totalAmount?.toFixed(2)}</p>
                </div>))}
            </div>)}
        </div>)}

      {/* 3. SAVED ITEMS TAB */}
      {activeTab === 'saved' && <SavedItemsView />}

      {/* 4. APPLICATIONS TAB */}
      {activeTab === 'applications' && <JobApplicationsView applications={applications}/>}

      {/* 5. RECOMMENDED COURSES TAB */}
      {activeTab === 'learning' && (<div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-navy-950">Free Learning Courses</h3>
              <p className="text-xs text-slate-500">Explore software engineering, AI, commerce, and leadership masterclasses</p>
            </div>
            <Link to="/education" className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs">
              Browse All Courses
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((crs) => (<div key={crs._id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                <span className="text-[10px] font-extrabold uppercase text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                  100% Free
                </span>
                <h4 className="font-extrabold text-navy-950 text-sm">{crs.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{crs.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 capitalize">{crs.level}</span>
                  <Link to={`/education/courses/${crs._id}`} className="text-xs font-bold text-navy-900 hover:text-teal-600">
                    Start Course →
                  </Link>
                </div>
              </div>))}
          </div>
        </div>)}

      {/* 6. CLEAN LINK SHARING TAB */}
      {activeTab === 'sharing' && (<div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-extrabold text-navy-950">Clean Link Sharing</h3>
            <p className="text-xs text-slate-500">
              Share verified products, courses, and job openings without MLM schemes, commission wallets, or spam
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <p className="font-bold text-navy-900">100% Ethical Sharing Policy</p>
            <p className="text-slate-500">
              Business Hub strictly prohibits multi-level marketing (MLM) schemes, pyramid compensation structures, and affiliate wallet games. All shared links are encrypted and provide privacy-safe click telemetry.
            </p>
          </div>

          {sharedLinks.length === 0 ? (<div className="py-8 text-center text-xs text-slate-400">
              You haven't generated any share links yet. Click "Share" on any product, course, or job card to create one!
            </div>) : (<div className="space-y-3">
              {sharedLinks.map((link) => (<div key={link._id} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold text-navy-900">{link.title || `Shared ${link.targetType}`}</p>
                    <p className="text-[11px] text-slate-400">
                      Code: {link.code} • Created {new Date(link.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-teal-50 text-teal-700">
                    {link.clickCount || 0} Clicks
                  </span>
                </div>))}
            </div>)}
        </div>)}
    </div>);
};
