import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { adminApi } from '../services/api';
export const AdminBusinessesPage = () => {
    const [businesses, setBusinesses] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedDocsBusiness, setSelectedDocsBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const loadData = () => {
        setLoading(true);
        adminApi.getBusinesses({ status: statusFilter || undefined })
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
            const promptRes = prompt('Enter rejection reason for business owner:', 'Submitted credentials failed verification.');
            if (!promptRes)
                return;
            rejectionReason = promptRes;
        }
        try {
            await adminApi.reviewBusiness(id, status, rejectionReason);
            loadData();
        }
        catch (err) {
            alert(err.response?.data?.message || 'Error updating status');
        }
    };
    return (<div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Business Verification & Approvals</h1>
          <p className="text-xs text-slate-400 mt-1">
            Enforce trust and legal vetting before enterprises can publish products, services, or hire talent.
          </p>
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white">
          <option value="">All Verification Statuses</option>
          <option value="pending">Pending Admin Review</option>
          <option value="approved">Approved & Active</option>
          <option value="rejected">Rejected</option>
          <option value="draft">Draft (Incomplete)</option>
        </select>
      </div>

      {/* Businesses Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {businesses.map((b) => (<div key={b._id} className="bg-slate-950 rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300">
                  Type: {b.businessType}
                </span>
                <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border ${b.verificationStatus === 'approved'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : b.verificationStatus === 'pending'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-red-500/20 text-red-400 border-red-500/40'}`}>
                  {b.verificationStatus}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-white">{b.businessName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Owner: <span className="text-slate-200 font-bold">{b.ownerName}</span> ({b.ownerEmail})
                </p>
                <p className="text-xs text-slate-400">Phone: {b.ownerMobile}</p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{b.description}</p>

              {/* Documents attached */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Submitted Credentials:</p>
                {b.documents && b.documents.length > 0 ? (<div className="flex flex-wrap gap-2">
                    {b.documents.map((d, i) => (<a key={i} href={d.documentUrl} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-teal-400 text-[11px] font-semibold flex items-center gap-1.5 transition-colors">
                        <FileText className="w-3.5 h-3.5"/>
                        {d.documentType}
                      </a>))}
                  </div>) : (<p className="text-xs text-slate-500 italic">No verification documents attached.</p>)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
              {b.verificationStatus !== 'approved' && (<button onClick={() => handleReview(b._id, 'approved')} className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-colors">
                  Approve Business
                </button>)}
              {b.verificationStatus !== 'rejected' && (<button onClick={() => handleReview(b._id, 'rejected')} className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-red-500/20 text-red-400 font-bold text-xs border border-slate-700 transition-colors">
                  Reject
                </button>)}
              {b.verificationStatus === 'approved' && (<button onClick={() => handleReview(b._id, 'suspended')} className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-amber-500/20 text-amber-400 font-bold text-xs border border-slate-700 transition-colors">
                  Suspend Access
                </button>)}
            </div>
          </div>))}
      </div>
    </div>);
};
