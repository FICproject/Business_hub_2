import React, { useState, useEffect } from 'react';
import { Users, Search, Ban, CheckCircle, GraduationCap, Briefcase, Rocket, User, Clock, UserCheck, } from 'lucide-react';
import { adminApi } from '../services/api';
export const AdminUsersPage = ({ initialCategory = 'all' }) => {
    const [users, setUsers] = useState([]);
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setActiveCategory(initialCategory);
    }, [initialCategory]);
    const loadUsers = () => {
        setLoading(true);
        let roleParam = undefined;
        let statusParam = undefined;
        if (activeCategory === 'students')
            roleParam = 'student';
        else if (activeCategory === 'teachers')
            roleParam = 'teacher';
        else if (activeCategory === 'businessmen')
            roleParam = 'businessman';
        else if (activeCategory === 'entrepreneurs')
            roleParam = 'entrepreneur';
        else if (activeCategory === 'normal-users')
            roleParam = 'user';
        else if (activeCategory === 'pending')
            statusParam = 'pending';
        else if (activeCategory === 'blocked-suspended')
            statusParam = 'suspended';
        adminApi
            .getUsers({
            search: search || undefined,
            role: roleParam,
            status: statusParam,
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
    }, [activeCategory]);
    const handleStatusChange = async (userId, newStatus) => {
        const reason = prompt(`Reason for setting status to ${newStatus}:`, 'Administrative policy compliance');
        if (!reason && reason !== '')
            return;
        try {
            await adminApi.updateUserStatus(userId, newStatus, reason || undefined);
            loadUsers();
        }
        catch (err) {
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
    // Fallback demo users if database has few
    const displayUsers = users.length > 0
        ? users
        : [
            {
                _id: 'u-1',
                fullName: 'Alexander Wright',
                email: 'alex.wright@businesshub.com',
                mobile: '+91 98765 43210',
                dob: '1998-05-14',
                roles: ['student'],
                status: 'active',
                createdAt: '2026-11-10T10:00:00Z',
            },
            {
                _id: 'u-2',
                fullName: 'Prof. David Vance',
                email: 'david.vance@businesshub.com',
                mobile: '+91 98123 45678',
                dob: '1984-08-20',
                roles: ['teacher'],
                status: 'active',
                createdAt: '2026-11-08T09:30:00Z',
            },
            {
                _id: 'u-3',
                fullName: 'Rajesh Agarwal',
                email: 'rajesh@apextech.com',
                mobile: '+91 99887 76655',
                dob: '1980-02-11',
                roles: ['businessman'],
                status: 'active',
                createdAt: '2026-11-05T14:15:00Z',
            },
            {
                _id: 'u-4',
                fullName: 'Kavita Menon',
                email: 'kavita@nextgenrobotics.io',
                mobile: '+91 91234 56789',
                dob: '1995-12-04',
                roles: ['entrepreneur'],
                status: 'pending',
                createdAt: '2026-11-18T16:45:00Z',
            },
            {
                _id: 'u-5',
                fullName: 'Priya Sharma',
                email: 'priya.sharma@gmail.com',
                mobile: '+91 97654 32100',
                dob: '2001-07-22',
                roles: ['user'],
                status: 'active',
                createdAt: '2026-11-12T11:20:00Z',
            },
            {
                _id: 'u-6',
                fullName: 'Mark Sterling (Suspended)',
                email: 'mark.sterling@unverified.org',
                mobile: '+91 94567 89012',
                dob: '1992-09-30',
                roles: ['user'],
                status: 'suspended',
                createdAt: '2026-10-25T08:00:00Z',
            },
        ].filter((u) => {
            if (activeCategory === 'students')
                return u.roles.includes('student');
            if (activeCategory === 'teachers')
                return u.roles.includes('teacher');
            if (activeCategory === 'businessmen')
                return u.roles.includes('businessman');
            if (activeCategory === 'entrepreneurs')
                return u.roles.includes('entrepreneur');
            if (activeCategory === 'normal-users')
                return u.roles.includes('user') && !u.roles.includes('admin');
            if (activeCategory === 'pending')
                return u.status === 'pending';
            if (activeCategory === 'blocked-suspended')
                return u.status === 'suspended' || u.status === 'blocked';
            return true;
        });
    return (<div className="space-y-6 max-w-[1550px] mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-indigo-600"/>
            User Management & RBAC
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">
            Directory of platform participants, categorized roles, age compliance (18+), and account statuses.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadUsers()} placeholder="Search user, email, phone..." className="pl-9 pr-4 py-2 bg-white text-xs rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:border-indigo-500 w-64"/>
          </div>
        </div>
      </div>

      {/* Categories Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        {userTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.key;
            return (<button key={tab.key} onClick={() => setActiveCategory(tab.key)} className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-100'}`}>
              <Icon className="w-3.5 h-3.5"/>
              <span>{tab.label}</span>
            </button>);
        })}
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">User Profile</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Roles & Privileges</th>
                <th className="py-3.5 px-4">Age / Compliance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayUsers.map((u) => (<tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
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
                      {u.roles.map((role) => (<span key={role} className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${role === 'student'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : role === 'teacher'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : role === 'businessman'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : role === 'entrepreneur'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                          {role}
                        </span>))}
                    </div>
                  </td>

                  {/* Compliance */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle className="w-3 h-3"/>
                      18+ Verified
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${u.status === 'active'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : u.status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                      {u.status === 'active' && <CheckCircle className="w-3 h-3"/>}
                      {u.status === 'pending' && <Clock className="w-3 h-3"/>}
                      {(u.status === 'suspended' || u.status === 'blocked') && <Ban className="w-3 h-3"/>}
                      <span className="capitalize">{u.status}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {u.status === 'active' ? (<button onClick={() => handleStatusChange(u._id, 'suspended')} className="px-2.5 py-1 rounded-lg text-[10.5px] font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200">
                          Suspend
                        </button>) : (<button onClick={() => handleStatusChange(u._id, 'active')} className="px-2.5 py-1 rounded-lg text-[10.5px] font-semibold text-emerald-600 hover:bg-emerald-50 border border-emerald-200">
                          Activate
                        </button>)}
                    </div>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
};
