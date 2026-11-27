import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Store, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { authApi } from '../../services/api';
import { setCredentials } from '../../store';
export const LoginPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await authApi.login({ email: identifier, mobile: identifier, password });
            if (res.data.success) {
                dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
                // Redirection based on role
                const roles = res.data.user.roles || [];
                if (roles.includes('admin')) {
                    navigate('/dashboard/admin');
                }
                else if (roles.includes('teacher')) {
                    navigate('/dashboard/teacher');
                }
                else if (roles.includes('businessman') || roles.includes('entrepreneur')) {
                    navigate('/dashboard/business');
                }
                else if (roles.includes('normal') || roles.includes('user')) {
                    navigate('/dashboard/user');
                }
                else {
                    navigate('/dashboard/student');
                }
            }
        }
        catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-500/20">
            <Store className="w-6 h-6"/>
          </div>
          <h2 className="text-2xl font-extrabold text-navy-900">Sign in to Business Hub</h2>
          <p className="text-xs text-slate-500">Access your personalized role-based dashboard</p>
        </div>

        {error && (<div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0"/>
            <span>{error}</span>
          </div>)}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email or Mobile Number</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"/>
              <input type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="name@businesshub.com or +1 555-0199" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"/>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">Password</label>
              <Link to="/forgot-password" className="text-xs font-bold text-teal-600 hover:text-teal-700">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"/>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"/>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"/>
              <span>Remember me</span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2">
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4"/>}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-teal-600 hover:text-teal-700">
            Create an Account
          </Link>
        </p>
      </div>
    </div>);
};
