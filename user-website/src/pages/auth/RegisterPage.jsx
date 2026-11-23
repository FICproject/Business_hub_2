import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Store, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import { authApi } from '../../services/api';
import { setCredentials } from '../../store';
export const RegisterPage = () => {
    const [searchParams] = useSearchParams();
    const defaultRole = searchParams.get('role') || 'student';
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [dob, setDob] = useState('2000-01-01');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState(defaultRole);
    const [termsAccepted, setTermsAccepted] = useState(false);
    // OTP Step
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [registeredData, setRegisteredData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Age Calculator
    const calculateAge = (dobString) => {
        if (!dobString)
            return 0;
        const birthDate = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    const calculatedAge = calculateAge(dob);
    const isEligibleAge = calculatedAge >= 18;
    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        if (!isEligibleAge) {
            setError(`Registration rejected. You must be at least 18 years old to join Business Hub. Current age calculated: ${calculatedAge} years.`);
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!termsAccepted) {
            setError('You must accept the Terms of Service and Privacy Policy.');
            return;
        }
        setLoading(true);
        try {
            const res = await authApi.register({
                fullName,
                email,
                mobile,
                dob,
                password,
                roles: [selectedRole],
                termsAccepted,
            });
            if (res.data.success) {
                setRegisteredData(res.data);
                setShowOtpModal(true); // Open OTP verification step
            }
        }
        catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please check your details.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleVerifyOtp = async () => {
        if (otpCode !== '123456') {
            setError('Invalid OTP code. For test purposes, enter 123456.');
            return;
        }
        // Login user into Redux store
        dispatch(setCredentials({ user: registeredData.user, token: registeredData.token }));
        // Role-based redirection
        if (selectedRole === 'teacher') {
            navigate('/dashboard/teacher');
        }
        else if (selectedRole === 'businessman' || selectedRole === 'entrepreneur') {
            navigate('/dashboard/business');
        }
        else if (selectedRole === 'normal' || selectedRole === 'user') {
            navigate('/dashboard/user');
        }
        else {
            navigate('/dashboard/student');
        }
    };
    const categories = [
        { role: 'student', label: 'Student', desc: 'Free courses & live classes' },
        { role: 'teacher', label: 'Teacher', desc: 'Host live classes & earn stipends' },
        { role: 'businessman', label: 'Businessman', desc: 'Sell products & hire talent' },
        { role: 'entrepreneur', label: 'Entrepreneur', desc: 'Launch & verify your startup' },
        { role: 'normal', label: 'Normal User', desc: 'Marketplace buyer & link sharer' },
    ];
    return (<div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-500/20">
            <Store className="w-6 h-6"/>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">Create Your Account</h2>
          <p className="text-xs text-slate-500">One account unlocks Marketplace, Education, and Jobs</p>
        </div>

        {error && (<div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0"/>
            <span>{error}</span>
          </div>)}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* User Category Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select User Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (<button key={cat.role} type="button" onClick={() => setSelectedRole(cat.role)} className={`p-3 rounded-xl border text-left transition-all ${selectedRole === cat.role
                ? 'border-teal-500 bg-teal-50/70 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                  <p className="text-xs font-bold text-slate-900">{cat.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{cat.desc}</p>
                </button>))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Marcus Vance" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@businesshub.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"/>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
              <input type="tel" required value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+1 555-0199" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"/>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Date of Birth</label>
                <span className={`text-[11px] font-bold ${isEligibleAge ? 'text-teal-600' : 'text-red-500'}`}>
                  Age: {calculatedAge} yrs {isEligibleAge ? '✓ (18+)' : '✗ (Under 18)'}
                </span>
              </div>
              <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${isEligibleAge ? 'border-slate-200 focus:ring-teal-500' : 'border-red-300 focus:ring-red-400'}`}/>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirm Password</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"/>
            </div>
          </div>

          {/* Terms & Privacy */}
          <div className="pt-2 flex items-start gap-2.5">
            <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"/>
            <label htmlFor="terms" className="text-xs text-slate-600 leading-snug">
              I certify that I am at least 18 years old and I accept the{' '}
              <span className="text-teal-600 font-bold hover:underline cursor-pointer">Terms of Service</span> and{' '}
              <span className="text-teal-600 font-bold hover:underline cursor-pointer">Privacy Policy</span>.
            </label>
          </div>

          <button type="submit" disabled={loading || !isEligibleAge} className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2">
            {loading ? 'Creating Account...' : 'Continue to OTP Verification'}
            {!loading && <ArrowRight className="w-4 h-4"/>}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-teal-600 hover:text-teal-700">
            Sign In
          </Link>
        </p>

        {/* OTP Verification Modal */}
        {showOtpModal && (<div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6"/>
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-xl font-extrabold text-navy-900">Verify OTP Code</h3>
                <p className="text-xs text-slate-500">
                  Enter the 6-digit verification code sent to <span className="font-bold text-slate-700">{email}</span>
                </p>
                <p className="text-[11px] text-teal-600 font-semibold bg-teal-50 py-1 rounded-md">
                  (Development Code: 123456)
                </p>
              </div>

              <div>
                <input type="text" maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="123456" className="w-full text-center tracking-[0.5em] text-2xl font-extrabold py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"/>
              </div>

              <button type="button" onClick={handleVerifyOtp} className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all">
                Confirm OTP & Enter Business Hub
              </button>
            </div>
          </div>)}
      </div>
    </div>);
};
