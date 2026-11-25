import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Store, AlertCircle, ArrowRight, ArrowLeft, KeyRound, ShieldCheck, CheckCircle2, FileCheck2 } from 'lucide-react';
import { authApi } from '../../services/api';
import { setCredentials } from '../../store';
import { DocumentVerificationPanel } from '../../components/verification/DocumentVerificationPanel';

const VERIFICATION_ROLES = ['teacher', 'businessman', 'entrepreneur'];

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

  // Multi-step Registration & Verification State
  const [step, setStep] = useState(1); // 1 = Account Info, 2 = Document Verification Upload
  const [draftId, setDraftId] = useState(null);
  const [draftToken, setDraftToken] = useState(null);
  const [checklistData, setChecklistData] = useState(null);

  // OTP Step
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [registeredData, setRegisteredData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const requiresDocUpload = VERIFICATION_ROLES.includes(selectedRole);

  // Age Calculator
  const calculateAge = (dobString) => {
    if (!dobString) return 0;
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

  const handleStep1Submit = async (e) => {
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
      if (requiresDocUpload) {
        // Initialize secure registration draft for role-specific document verification
        const defaultContext =
          selectedRole === 'entrepreneur'
            ? { isStartupRegistered: false, hasBusinessAddress: false, unregisteredDeclarationAccepted: false }
            : selectedRole === 'teacher'
            ? { hasTeachingQualification: false }
            : { isStartupRegistered: true, hasBusinessAddress: true };

        const res = await authApi.initRegistration({
          fullName,
          email,
          mobile,
          dob,
          password,
          roles: [selectedRole],
          termsAccepted,
          applicationContext: checklistData?.applicationContext || defaultContext,
        });

        if (res.data?.success) {
          setDraftId(res.data.draftId);
          setDraftToken(res.data.draftToken);
          setChecklistData(res.data);
          setStep(2);
          window.scrollTo(0, 0);
        }
      } else {
        // Direct registration for Student / Normal User
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
          setShowOtpModal(true);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmitWithDocs = async () => {
    setError(null);
    if (!checklistData?.summary?.canSubmitApplication) {
      setError('Please upload all required mandatory documents (and confirm declarations if applicable) before submitting.');
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
        draftId,
        applicationContext: checklistData.applicationContext,
      });
      if (res.data?.success) {
        setRegisteredData(res.data);
        setShowOtpModal(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Application submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode !== '123456') {
      setError('Invalid OTP code. For test purposes, enter 123456.');
      return;
    }
    dispatch(setCredentials({ user: registeredData.user, token: registeredData.token }));

    if (selectedRole === 'teacher') {
      navigate('/dashboard/teacher?tab=verification');
    } else if (selectedRole === 'businessman' || selectedRole === 'entrepreneur') {
      navigate('/dashboard/business?tab=verification');
    } else if (selectedRole === 'normal' || selectedRole === 'user') {
      navigate('/dashboard/user');
    } else {
      navigate('/dashboard/student');
    }
  };

  const categories = [
    { role: 'student', label: 'Student', desc: 'Free courses & live classes' },
    { role: 'teacher', label: 'Teacher', desc: 'Docs required for approval' },
    { role: 'businessman', label: 'Businessman', desc: 'Docs required for approval' },
    { role: 'entrepreneur', label: 'Entrepreneur', desc: 'Registered or unregistered' },
    { role: 'normal', label: 'Normal User', desc: 'Service requests & marketplace' },
  ];

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-10 bg-slate-50">
      <div className={`w-full ${step === 2 ? 'max-w-3xl' : 'max-w-xl'} bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10 space-y-6 transition-all`}>
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-500/20">
            {step === 2 ? <FileCheck2 className="w-6 h-6" /> : <Store className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
            {step === 2 ? 'Mandatory Document Verification' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-slate-500">
            {step === 2
              ? `Role-specific verification documents for ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} application`
              : 'One account unlocks Marketplace, Education, Service Requests & Jobs'}
          </p>
        </div>

        {/* Step Indicator for Verifiable Roles */}
        {requiresDocUpload && (
          <div className="flex items-center justify-center gap-3 text-xs font-bold">
            <span className={`px-3 py-1 rounded-full ${step === 1 ? 'bg-teal-600 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
              1. Account Details
            </span>
            <span className="text-slate-300">→</span>
            <span className={`px-3 py-1 rounded-full ${step === 2 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              2. Document Upload
            </span>
            <span className="text-slate-300">→</span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500">
              3. Admin Review
            </span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Account Information */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            {/* User Category Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select User Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.role}
                    type="button"
                    onClick={() => setSelectedRole(cat.role)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedRole === cat.role
                        ? 'border-teal-500 bg-teal-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-900">{cat.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{cat.desc}</p>
                  </button>
                ))}
              </div>
              {requiresDocUpload && (
                <p className="mt-2 text-[11px] text-teal-700 bg-teal-50 border border-teal-200 rounded-xl px-3 py-2 flex items-center gap-2 font-medium">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>
                    Role verification applies: you will upload mandatory {selectedRole} verification documents in the next step before Admin review.
                  </span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Marcus Vance"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@businesshub.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+1 555-0199"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Date of Birth</label>
                  <span className={`text-[11px] font-bold ${isEligibleAge ? 'text-teal-600' : 'text-red-500'}`}>
                    Age: {calculatedAge} yrs {isEligibleAge ? '✓ (18+)' : '✗ (Under 18)'}
                  </span>
                </div>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    isEligibleAge ? 'border-slate-200 focus:ring-teal-500' : 'border-red-300 focus:ring-red-400'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Terms & Privacy */}
            <div className="pt-2 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 leading-snug">
                I certify that I am at least 18 years old and I accept the{' '}
                <span className="text-teal-600 font-bold hover:underline cursor-pointer">Terms of Service</span> and{' '}
                <span className="text-teal-600 font-bold hover:underline cursor-pointer">Privacy Policy</span>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !isEligibleAge}
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading
                ? 'Validating...'
                : requiresDocUpload
                ? 'Continue to Mandatory Document Uploads'
                : 'Continue to OTP Verification'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        {/* STEP 2: Role-Specific Document Verification Upload */}
        {step === 2 && checklistData && (
          <div className="space-y-6">
            <DocumentVerificationPanel
              checklistData={checklistData}
              customToken={draftToken}
              onChecklistUpdated={(updated) => setChecklistData(updated)}
              roles={[selectedRole]}
              isPostSubmission={false}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Account Details</span>
              </button>

              <button
                type="button"
                onClick={handleFinalSubmitWithDocs}
                disabled={loading || !checklistData?.summary?.canSubmitApplication}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {loading
                    ? 'Submitting Application...'
                    : 'Submit Application for Admin Approval'}
                </span>
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-teal-600 hover:text-teal-700">
            Sign In
          </Link>
        </p>

        {/* OTP Verification Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-xl font-extrabold text-navy-900">Verify OTP Code</h3>
                <p className="text-xs text-slate-500">
                  Enter the 6-digit verification code sent to <span className="font-bold text-slate-700">{email}</span>
                </p>
                {requiresDocUpload && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-lg font-medium">
                    Your documents are submitted! Your account remains <strong>Pending Admin Approval</strong> until verified.
                  </p>
                )}
                <p className="text-[11px] text-teal-600 font-semibold bg-teal-50 py-1 rounded-md">
                  (Development Code: 123456)
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] text-2xl font-extrabold py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all"
              >
                Confirm OTP & Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
