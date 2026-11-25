import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  ShieldCheck,
  Building2,
  Rocket,
  Search,
  Filter,
  ExternalLink,
  MapPin,
  Globe,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Layers,
  FileText,
} from 'lucide-react';
import { adminApi } from '../services/api';
import { AdminDocumentReviewModal } from '../components/verification/AdminDocumentReviewModal';

export const AdminBusinessesPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState(''); // '' | 'businessman' | 'entrepreneur'
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewOwnerId, setReviewOwnerId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    adminApi
      .getBusinesses({ status: statusFilter || undefined, search: searchQuery || undefined })
      .then((res) => {
        if (res.data.success) {
          setBusinesses(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, searchQuery]);

  const handleReview = async (id, status) => {
    let rejectionReason = undefined;
    if (status === 'rejected') {
      const promptRes = prompt(
        'Enter rejection reason for business / startup applicant:',
        'Mandatory credentials or documents failed compliance checks.'
      );
      if (!promptRes) return;
      rejectionReason = promptRes;
    }
    try {
      await adminApi.reviewBusiness(id, status, rejectionReason);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const filteredBusinesses = businesses.filter((b) => {
    if (!roleFilter) return true;
    const rType = b.roleType || (b.businessType === 'unregistered_startup' ? 'entrepreneur' : 'businessman');
    return rType === roleFilter;
  });

  const businessmanCount = businesses.filter(
    (b) => (b.roleType || (b.businessType === 'unregistered_startup' ? 'entrepreneur' : 'businessman')) === 'businessman'
  ).length;

  const entrepreneurCount = businesses.filter(
    (b) => (b.roleType || (b.businessType === 'unregistered_startup' ? 'entrepreneur' : 'businessman')) === 'entrepreneur'
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-indigo-600" />
            Business &amp; Startup Approvals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Independently review, inspect mandatory documents, and approve established businessmen and innovative startups.
          </p>
        </div>

        {/* Role & Status Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 sm:w-56"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending Admin Review</option>
            <option value="approved">Approved &amp; Active</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Role Segmentation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setRoleFilter('')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            roleFilter === ''
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>All Entities</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-200">
            {businesses.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setRoleFilter('businessman')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            roleFilter === 'businessman'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Established Businessmen</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-700">
            {businessmanCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setRoleFilter('entrepreneur')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            roleFilter === 'entrepreneur'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
          }`}
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>Entrepreneur Startups</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-700">
            {entrepreneurCount}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading registered businesses &amp; startups...</p>
        </div>
      ) : filteredBusinesses.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-2">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No matching business or startup profiles found</h3>
          <p className="text-xs text-slate-400">Try adjusting your role or status filter above.</p>
        </div>
      ) : (
        /* Businesses Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBusinesses.map((b) => {
            const roleType = b.roleType || (b.businessType === 'unregistered_startup' ? 'entrepreneur' : 'businessman');
            const isEntrepreneur = roleType === 'entrepreneur';

            return (
              <div
                key={b._id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border ${
                          isEntrepreneur
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        {isEntrepreneur ? <Rocket className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                        {isEntrepreneur ? 'Entrepreneur Startup' : 'Businessman Enterprise'}
                      </span>

                      {b.businessType && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                          {b.businessType}
                        </span>
                      )}

                      {isEntrepreneur && b.stage && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          {b.stage}
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border shrink-0 ${
                        b.verificationStatus === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : b.verificationStatus === 'pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : b.verificationStatus === 'suspended'
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {b.verificationStatus}
                    </span>
                  </div>

                  {/* Business Name & Categories */}
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">{b.businessName}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-slate-500">
                      {b.category && <span className="font-semibold text-slate-700">{b.category}</span>}
                      {b.subcategory && (
                        <>
                          <span>•</span>
                          <span className="text-slate-600">{b.subcategory}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {b.description || 'No business description provided.'}
                  </p>

                  {/* Entrepreneur Specific Info */}
                  {isEntrepreneur && (
                    <div className="p-3 rounded-2xl bg-purple-50/40 border border-purple-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-purple-900">Registration Status:</span>
                        <span className="font-semibold text-purple-700">
                          {b.isStartupRegistered
                            ? `Registered (${b.registrationType || 'Company'})`
                            : 'Unregistered / Early Stage Founder Declaration'}
                        </span>
                      </div>
                      {b.registrationNumber && (
                        <div className="text-[11px] text-purple-800">
                          CIN/Reg: <strong>{b.registrationNumber}</strong>
                        </div>
                      )}
                      {b.problemStatement && (
                        <p className="text-[11px] text-slate-600 line-clamp-1">
                          <strong>Problem:</strong> {b.problemStatement}
                        </p>
                      )}
                      {b.pitchDeckUrl && (
                        <div className="pt-1">
                          <a
                            href={b.pitchDeckUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>View Investor Pitch Deck / Presentation</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Businessman Specific Info */}
                  {!isEntrepreneur && (
                    <div className="p-3 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-xs space-y-1.5">
                      {b.productsServices && (
                        <p className="text-[11px] text-slate-700">
                          <strong>Products/Services:</strong> {b.productsServices}
                        </p>
                      )}
                      {b.operatingLocations && (
                        <p className="text-[11px] text-indigo-900 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-indigo-600 shrink-0" />
                          <span>Operating Coverage: {b.operatingLocations}</span>
                        </p>
                      )}
                      {b.website && (
                        <a
                          href={b.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:underline"
                        >
                          <Globe className="w-3 h-3" />
                          <span>{b.website}</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Owner Contact Card */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                    <p className="font-bold text-slate-800">
                      Owner: {b.ownerName}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {b.ownerEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {b.ownerMobile}
                      </span>
                    </div>
                  </div>

                  {/* Secure Document Verification Trigger */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      Role Mandatory Documents
                    </span>
                    <button
                      type="button"
                      onClick={() => setReviewOwnerId(b.ownerId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Inspect &amp; Verify Documents</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  {b.verificationStatus !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleReview(b._id, 'approved')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      Approve {isEntrepreneur ? 'Startup' : 'Business'}
                    </button>
                  )}
                  {b.verificationStatus !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => handleReview(b._id, 'rejected')}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors"
                    >
                      Reject
                    </button>
                  )}
                  {b.verificationStatus === 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleReview(b._id, 'suspended')}
                      className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 transition-colors"
                    >
                      Suspend Access
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {reviewOwnerId && (
        <AdminDocumentReviewModal
          userId={reviewOwnerId}
          onClose={() => setReviewOwnerId(null)}
          onDecisionComplete={() => loadData()}
        />
      )}
    </div>
  );
};
