import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { adminApi } from '../services/api';
import { setAdminCredentials } from '../store';
export const AdminLoginPage = () => {
    const [email, setEmail] = useState('admin@businesshub.com');
    const [password, setPassword] = useState('admin12345');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await adminApi.login({ email, password });
            if (res.data.success) {
                if (!res.data.user.roles.includes('admin')) {
                    setError('Access denied. Administrator privileges required.');
                    return;
                }
                dispatch(setAdminCredentials({ user: res.data.user, token: res.data.token }));
                navigate('/');
            }
        }
        catch (err) {
            setError(err.response?.data?.message || 'Admin authentication failed.');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20 font-black text-xl">
            BH
          </div>
          <h2 className="text-2xl font-extrabold text-white">Central Admin Sign In</h2>
          <p className="text-xs text-slate-400">Restricted access portal for authorized personnel</p>
        </div>

        {error && (<div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0"/>
            <span>{error}</span>
          </div>)}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5"/>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"/>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5"/>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"/>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2">
            {loading ? 'Authenticating...' : 'Sign In as Administrator'}
            {!loading && <ArrowRight className="w-4 h-4"/>}
          </button>
        </form>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-center">
          Default Credential: <span className="font-mono text-teal-400">admin@businesshub.com / admin12345</span>
        </div>
      </div>
    </div>);
};
