import React, { useState, useEffect } from 'react';
import { FileCheck2, ShieldCheck, Building2 } from 'lucide-react';
import { adminApi } from '../services/api';
import { AdminDocumentReviewModal } from '../components/verification/AdminDocumentReviewModal';

export const AdminBusinessesPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [reviewOwnerId, setReviewOwnerId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    adminApi
      .getBusinesses({ status: statusFilter || undefined })
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
  }, [statusFilter]);

  const handleReview = async (id, status) => {
    let rejectionReason = undefined;
    if (status === 'rejected') {
      const promptRes = prompt(
        'Enter rejection reason for business owner:',
        'Submitted credentials failed verification.'
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-indigo-600" />
            Business Verification &amp; Approvals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review mandatory owner/business documents via secure previews before approving enterprises to list services or accept requests.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs"
        >
          <option value="">All Verification Statuses</option>
          <option value="pending">Pending Admin Review</option>
          <option value="approved">Approved &amp; Active</option>
          <option value="rejected">Rejected</option>
          <option value="draft">Draft (Incomplete)</option>
        </select>
      </div>

      {/* Businesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {businesses.map((b) => (
          <div
            key={b._id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                  Type: {b.businessType}
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border ${
                    b.verificationStatus === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : b.verificationStatus === 'pending'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {b.verificationStatus}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-slate-900">{b.businessName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Owner: <span className="text-slate-800 font-bold">{b.ownerName}</span> ({b.ownerEmail})
                </p>
                <p className="text-xs text-slate-500">Phone: {b.ownerMobile}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{b.description}</p>

              {/* Secure Document Verification Trigger */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Encrypted Document Vault
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
                  onClick={() => handleReview(b._id, 'approved')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Approve Business
                </button>
              )}
              {b.verificationStatus !== 'rejected' && (
                <button
                  onClick={() => handleReview(b._id, 'rejected')}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors"
                >
                  Reject
                </button>
              )}
              {b.verificationStatus === 'approved' && (
                <button
                  onClick={() => handleReview(b._id, 'suspended')}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 transition-colors"
                >
                  Suspend Access
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

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
