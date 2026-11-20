import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, Ban, CheckCircle, AlertCircle } from 'lucide-react';
import { adminApi } from '../services/api';
import { IUser } from '../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    setLoading(true);
    adminApi.getUsers({
      search: search || undefined,
      role: roleFilter || undefined,
      status: statusFilter || undefined,
    })
      .then((res) => {
        if (res.data.success) {
          setUsers(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter, statusFilter]);

  const handleStatusChange = async (userId: string, newStatus: string) => {
    const reason = prompt(`Reason for setting status to ${newStatus}:`, 'Administrative review');
    try {
      await adminApi.updateUserStatus(userId, newStatus, reason || undefined);
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">User & RBAC Management</h1>
        <p className="text-xs text-slate-400 mt-1">
          Inspect registered identities, manage role-based permissions, and enforce compliance suspensions.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
            placeholder="Search by name, email, or mobile..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="businessman">Businessman</option>
            <option value="entrepreneur">Entrepreneur</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">User</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">DOB (Age)</th>
                <th className="py-3.5 px-4">Assigned Roles</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.fullName}`}
                        alt={u.fullName}
                        className="w-9 h-9 rounded-xl bg-slate-800 object-cover"
                      />
                      <div>
                        <p className="font-bold text-white text-xs">{u.fullName}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-[11px] text-slate-400">{u.mobile}</td>
                  <td className="py-4 px-4 font-medium">{u.dob}</td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r) => (
                        <span key={r} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-950 text-teal-400 border border-teal-800/60">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      u.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {u.status === 'active' ? (
                        <button
                          onClick={() => handleStatusChange(u._id, 'suspended')}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-500/20 text-amber-400 font-bold border border-slate-700 text-[10px]"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(u._id, 'active')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40 text-[10px]"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
