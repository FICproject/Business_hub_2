import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Ban,
  CheckCircle,
  GraduationCap,
  Briefcase,
  Rocket,
  User,
  Clock,
  UserCheck,
  FileCheck2,
  Settings2,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '../services/api';
import { AdminDocumentReviewModal } from '../components/verification/AdminDocumentReviewModal';
import { AdminDocRequirementsModal } from '../components/verification/AdminDocRequirementsModal';

export const AdminUsersPage = ({ initialCategory = 'all' }) => {
  const [users, setUsers] = useState([]);
  const [pendingSummaries, setPendingSummaries] = useState([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviewUserId, setReviewUserId] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const loadUsers = () => {
    setLoading(true);
    let roleParam = undefined;
    let statusParam = undefined;
    if (activeCategory === 'students') roleParam = 'student';
    else if (activeCategory === 'teachers') roleParam = 'teacher';
    else if (activeCategory === 'businessmen') roleParam = 'businessman';
    else if (activeCategory === 'entrepreneurs') roleParam = 'entrepreneur';
    else if (activeCategory === 'normal-users') roleParam = 'normal';
    else if (activeCategory === 'pending') statusParam = 'pending';
    else if (activeCategory === 'blocked-suspended') statusParam = 'suspended';

    Promise.all([
      adminApi.getUsers({
        search: search || undefined,
        role: roleParam,
        status: statusParam,
        limit: 50,
      }),
      adminApi.getPendingDocumentApplicants(),
    ])
      .then(([usersRes, pendingRes]) => {
        if (usersRes.data?.success) {
          setUsers(usersRes.data.data || []);
        }
        if (pendingRes.data?.success) {
          setPendingSummaries(pendingRes.data.data || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, [activeCategory]);

  const handleStatusChange = async (userId, newStatus) => {
    const reason = prompt(`Reason for setting status to ${newStatus}:`, 'Administrative policy compliance');
    if (!reason && reason !== '') return;
    try {
      await adminApi.updateUserStatus(userId, newStatus, reason || undefined);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const userTabs = [
    { key: 'all', label: 'All Users', icon: Users },
    { key: 'students', label: 'Students', icon: GraduationCap },
    { key: 'teachers', label: 'Teachers', icon: UserCheck },
    { key: 'businessmen', label: 'Businessmen', icon: Briefcase },
    { key: 'entrepreneurs', label: 'Entrepreneurs', icon: Rocket },
    { key: 'normal-users', label: 'Normal Users', icon: User },
    { key: 'pending', label: 'Pending Verifications', icon: Clock },
    { key: 'blocked-suspended', label: 'Blocked / Suspended', icon: Ban },
  ];

  const pendingMap = {};
  for (const item of pendingSummaries) {
    pendingMap[item.user._id] = item;
  }

  return (
    <div className="space-y-6 max-w-[1550px] mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-indigo-600" />
            User Management &amp; Document Verification
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">
            Directory of platform participants, role-specific mandatory document vetting, and account approval controls.
          </p>
        </div>

        {/* Search & Document Requirements Config */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
              placeholder="Search user, email, phone..."
              className="pl-9 pr-4 py-2 bg-white text-xs rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:border-indigo-500 w-60"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs"
          >
            <Settings2 className="w-4 h-4 text-indigo-600" />
            <span>Configure Document Rules</span>
          </button>
          <button
            type="button"
            onClick={loadUsers}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 shadow-xs"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Categories Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        {userTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.key === 'pending' && pendingSummaries.length > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-white text-indigo-700' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {pendingSummaries.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dedicated Pending Documents Verification Spotlight Section inside Pending Verifications */}
      {activeCategory === 'pending' && (
        <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                Documents Verification Queue (Teachers, Businessmen &amp; Entrepreneurs)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Preview uploaded documents securely, verify or reject individual files, request replacements, and approve eligible applicants.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full self-start">
              {pendingSummaries.length} Pending Review
            </span>
          </div>

          {pendingSummaries.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center">
              All pending applicants have been reviewed.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingSummaries.map(({ user: appUser, business, verification }) => {
                const sum = verification?.summary || {};
                return (
                  <div
                    key={appUser._id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{appUser.fullName}</p>
                          <p className="text-[11px] text-slate-500">{appUser.email}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {appUser.roles.join(', ')}
                        </span>
                      </div>

                      {business && (
                        <p className="text-[11px] font-semibold text-slate-700">
                          Entity: {business.businessName}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="bg-white p-2 rounded-xl border border-slate-200">
                          <span className="text-slate-400 block">Uploaded</span>
                          <span className="font-extrabold text-slate-900">
                            {sum.uploadedMandatory || 0} / {sum.totalMandatory || 0} Mandatory
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-slate-200">
                          <span className="text-slate-400 block">Verified</span>
                          <span className={`font-extrabold ${sum.canApproveApplication ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {sum.verifiedMandatory || 0} / {sum.totalMandatory || 0} Verified
                          </span>
                        </div>
                      </div>

                      {sum.rejectedOrReplacementCount > 0 && (
                        <p className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {sum.rejectedOrReplacementCount} doc(s) rejected or replacement requested
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setReviewUserId(appUser._id)}
                      className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      <span>Open Documents Section</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Users Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">User Profile</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Roles &amp; Privileges</th>
                <th className="py-3.5 px-4">Documents / Compliance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No users found matching current filter.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const hasVerifiableRole = (u.roles || []).some((r) =>
                    ['teacher', 'businessman', 'entrepreneur'].includes(r)
                  );
                  const pendingInfo = pendingMap[u._id];
                  const canDirectApprove = pendingInfo
                    ? pendingInfo.verification?.summary?.canApproveApplication
                    : u.verificationStatus === 'approved';

                  return (
                    <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                      {/* User Profile */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center shrink-0 shadow-sm">
                            {u.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{u.fullName}</p>
                            <p className="text-[11px] text-slate-400">ID: {u._id.substring(0, 8)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-4">
                        <p className="text-slate-800 font-medium">{u.email}</p>
                        <p className="text-[11px] text-slate-400">{u.mobile}</p>
                      </td>

                      {/* Roles */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(u.roles || []).map((role) => (
                            <span
                              key={role}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                                role === 'student'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : role === 'teacher'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : role === 'businessman'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : role === 'entrepreneur'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Documents & 18+ Compliance */}
                      <td className="py-4 px-4 space-y-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          18+ Verified
                        </span>
                        {hasVerifiableRole && (
                          <div>
                            <button
                              type="button"
                              onClick={() => setReviewUserId(u._id)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline mt-0.5"
                            >
                              <FileCheck2 className="w-3.5 h-3.5" />
                              {pendingInfo
                                ? `Docs: ${pendingInfo.verification.summary.verifiedMandatory}/${pendingInfo.verification.summary.totalMandatory} Verified`
                                : 'Inspect Verification Docs'}
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                            u.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : u.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {u.status === 'active' && <CheckCircle className="w-3 h-3" />}
                          {u.status === 'pending' && <Clock className="w-3 h-3" />}
                          {(u.status === 'suspended' || u.status === 'blocked') && <Ban className="w-3 h-3" />}
                          <span className="capitalize">
                            {u.verificationStatus === 'replacement_required' ? 'Replacement Req.' : u.status}
                          </span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {hasVerifiableRole && (
                            <button
                              type="button"
                              onClick={() => setReviewUserId(u._id)}
                              className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold text-indigo-600 hover:bg-indigo-50 border border-indigo-200"
                            >
                              Documents
                            </button>
                          )}
                          {u.status === 'active' ? (
                            <button
                              onClick={() => handleStatusChange(u._id, 'suspended')}
                              className="px-2.5 py-1 rounded-lg text-[10.5px] font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              disabled={u.status === 'pending' && hasVerifiableRole && !canDirectApprove}
                              onClick={() => handleStatusChange(u._id, 'active')}
                              title={
                                u.status === 'pending' && hasVerifiableRole && !canDirectApprove
                                  ? 'Verify all mandatory documents inside Documents modal first'
                                  : 'Approve / Activate user'
                              }
                              className="px-2.5 py-1 rounded-lg text-[10.5px] font-semibold text-emerald-600 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed border border-emerald-200"
                            >
                              {u.status === 'pending' ? 'Approve' : 'Activate'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dedicated Admin Document Verification Review Modal */}
      {reviewUserId && (
        <AdminDocumentReviewModal
          userId={reviewUserId}
          onClose={() => setReviewUserId(null)}
          onDecisionComplete={() => loadUsers()}
        />
      )}

      {/* Dynamic Document Requirements Configuration Modal */}
      {showConfigModal && <AdminDocRequirementsModal onClose={() => setShowConfigModal(false)} />}
    </div>
  );
};
