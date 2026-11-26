import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Store,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Building2,
  Rocket,
  Briefcase,
  User,
  GraduationCap,
  MapPin,
  Globe,
  Phone,
  Mail,
  Award,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { authApi, categoriesApi } from '../../services/api';
import { setCredentials } from '../../store';
import { DocumentVerificationPanel } from '../../components/verification/DocumentVerificationPanel';
import {
  DEFAULT_BUSINESSMAN_CATS,
  DEFAULT_ENTREPRENEUR_CATS,
  BUSINESS_TYPES,
  STARTUP_STAGES,
  BUSINESS_MODELS,
  STARTUP_REGISTRATION_TYPES,
} from '../../data/roleCategories';

const VERIFICATION_ROLES = ['teacher', 'businessman', 'entrepreneur', 'business'];

// Combined Comprehensive Category Taxonomy
const ALL_BUSINESS_CATS = [
  ...DEFAULT_BUSINESSMAN_CATS,
  ...DEFAULT_ENTREPRENEUR_CATS,
];

const ALL_BUSINESS_TYPES = [
  'Supplier',
  'Contractor',
  'Manufacturer',
  'Distributor',
  'Retailer',
  'Wholesaler',
  'Service Provider',
  'Private Limited Company (Pvt Ltd)',
  'Limited Liability Partnership (LLP)',
  'One Person Company (OPC)',
  'Partnership Firm',
  'Sole Proprietorship',
  'Other',
];

const ALL_BUSINESS_STAGES = [
  'Established & Revenue Generating',
  'Scaling & Market Expansion',
  'Early Traction / Pre-Revenue',
  'Prototype / MVP in Testing',
  'Ideation & Early Concept',
];

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const rawRoleParam = (searchParams.get('role') || 'student').toLowerCase();
  const isBusinessParam = ['business', 'businessman', 'entrepreneur', 'both'].includes(rawRoleParam);
  const defaultRole = isBusinessParam ? 'business' : rawRoleParam;
  const defaultTrack = rawRoleParam === 'entrepreneur' ? 'entrepreneur' : rawRoleParam === 'businessman' ? 'businessman' : 'both';

  // Role Selection (student, teacher, business, normal)
  const [selectedRole, setSelectedRole] = useState(defaultRole);

  // Common Personal Information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('2000-01-01');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Personal Address & Identity
  const [personalStreet, setPersonalStreet] = useState('');
  const [personalCity, setPersonalCity] = useState('');
  const [personalState, setPersonalState] = useState('');
  const [personalPincode, setPersonalPincode] = useState('');
  const [govIdType, setGovIdType] = useState('Aadhaar Card');
  const [govIdNumber, setGovIdNumber] = useState('');

  // Teacher Specific
  const [hasTeachingQualification, setHasTeachingQualification] = useState(false);

  // Unified Business & Entrepreneur State (Single Common Registration)
  const [bizTrack, setBizTrack] = useState(defaultTrack); // 'businessman' | 'entrepreneur' | 'both'
  const [businessCats, setBusinessCats] = useState(ALL_BUSINESS_CATS);
  const [bizName, setBizName] = useState('');
  const [bizCategory, setBizCategory] = useState(ALL_BUSINESS_CATS[0].name);
  const [bizSubcategory, setBizSubcategory] = useState(ALL_BUSINESS_CATS[0].subcategories[0]);
  const [bizType, setBizType] = useState(ALL_BUSINESS_TYPES[0]);
  const [bizStage, setBizStage] = useState(ALL_BUSINESS_STAGES[0]);
  const [bizDescription, setBizDescription] = useState('');
  const [bizProductsServices, setBizProductsServices] = useState('');
  const [bizSameAddress, setBizSameAddress] = useState(true);
  const [bizStreet, setBizStreet] = useState('');
  const [bizCity, setBizCity] = useState('');
  const [bizState, setBizState] = useState('');
  const [bizPincode, setBizPincode] = useState('');
  const [bizOperatingLocations, setBizOperatingLocations] = useState('');
  const [bizWebsite, setBizWebsite] = useState('');
  const [bizPhone, setBizPhone] = useState('');
  const [bizAltPhone, setBizAltPhone] = useState('');
  const [bizEmail, setBizEmail] = useState('');

  // Startup Specific Optional Options
  const [isStartupRegistered, setIsStartupRegistered] = useState(true);
  const [startupRegType, setStartupRegType] = useState(STARTUP_REGISTRATION_TYPES[0]);
  const [startupRegNumber, setStartupRegNumber] = useState('');
  const [startupRegDate, setStartupRegDate] = useState('');
  const [unregisteredDeclarationAccepted, setUnregisteredDeclarationAccepted] = useState(false);
  const [startupProblemStatement, setStartupProblemStatement] = useState('');
  const [startupSolution, setStartupSolution] = useState('');
  const [startupTargetMarket, setStartupTargetMarket] = useState('');
  const [startupPitchDeckUrl, setStartupPitchDeckUrl] = useState('');

  // Multi-step Registration State
  const [step, setStep] = useState(1); // 1 = Details, 2 = Mandatory Document Uploads
  const [draftId, setDraftId] = useState(null);
  const [draftToken, setDraftToken] = useState(null);
  const [checklistData, setChecklistData] = useState(null);

  // OTP Step
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpMessage, setOtpMessage] = useState(null);
  const [registeredData, setRegisteredData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load Categories from API if available
  useEffect(() => {
    categoriesApi
      .getCategories({ role: 'businessman' })
      .then((res) => {
        if (res.data?.success && res.data.categories?.length) {
          setBusinessCats((prev) => {
            const combined = [...res.data.categories];
            prev.forEach((cat) => {
              if (!combined.some((c) => c.name === cat.name)) {
                combined.push(cat);
              }
            });
            return combined;
          });
        }
      })
      .catch(() => {});
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    const found = businessCats.find((c) => c.name === bizCategory);
    if (found && found.subcategories?.length) {
      setBizSubcategory(found.subcategories[0]);
    }
  }, [bizCategory, businessCats]);

  // Sync business address with personal if checked
  useEffect(() => {
    if (bizSameAddress) {
      setBizStreet(personalStreet);
      setBizCity(personalCity);
      setBizState(personalState);
      setBizPincode(personalPincode);
    }
  }, [bizSameAddress, personalStreet, personalCity, personalState, personalPincode]);

  // Determine Effective Roles for the user
  const effectiveRoles = React.useMemo(() => {
    if (selectedRole === 'business') {
      if (bizTrack === 'businessman') return ['businessman'];
      if (bizTrack === 'entrepreneur') return ['entrepreneur'];
      return ['businessman', 'entrepreneur'];
    }
    return [selectedRole];
  }, [selectedRole, bizTrack]);

  const requiresDocUpload = effectiveRoles.some((r) => VERIFICATION_ROLES.includes(r));

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

  // Unified Profile Object
  const buildProfiles = () => {
    const personalAddress = {
      street: personalStreet,
      city: personalCity,
      state: personalState,
      postalCode: personalPincode,
      country: 'India',
    };
    const govIdDetails = {
      idType: govIdType,
      idNumber: govIdNumber,
    };

    const unifiedBiz = {
      businessName: bizName,
      category: bizCategory,
      subcategory: bizSubcategory,
      businessType: bizType,
      description: bizDescription,
      productsServices: bizProductsServices,
      businessAddress: {
        street: bizSameAddress ? personalStreet : bizStreet,
        city: bizSameAddress ? personalCity : bizCity,
        state: bizSameAddress ? personalState : bizState,
        postalCode: bizSameAddress ? personalPincode : bizPincode,
        country: 'India',
      },
      operatingLocations: bizOperatingLocations,
      businessWebsite: bizWebsite,
      businessPhone: bizPhone || mobile,
      businessAltPhone: bizAltPhone,
      businessEmail: bizEmail || email,
      stage: bizStage,
      isStartupRegistered,
      registrationType: isStartupRegistered ? startupRegType : '',
      registrationNumber: isStartupRegistered ? startupRegNumber : '',
      registrationDate: isStartupRegistered ? startupRegDate : '',
      unregisteredDeclarationAccepted: !isStartupRegistered ? unregisteredDeclarationAccepted : true,
      ideaSummary: bizDescription,
      problemStatement: startupProblemStatement,
      solutionDescription: startupSolution,
      targetMarket: startupTargetMarket,
      hasBusinessAddress: !bizSameAddress,
      officeAddress: {
        street: bizSameAddress ? personalStreet : bizStreet,
        city: bizSameAddress ? personalCity : bizCity,
        state: bizSameAddress ? personalState : bizState,
        postalCode: bizSameAddress ? personalPincode : bizPincode,
        country: 'India',
      },
      websiteUrl: bizWebsite,
      pitchDeckUrl: startupPitchDeckUrl,
    };

    const isBusiness = selectedRole === 'business';
    const businessmanProfile = isBusiness ? { ...unifiedBiz } : null;
    const entrepreneurProfile = isBusiness
      ? {
          startupName: bizName,
          ...unifiedBiz,
        }
      : null;

    return { personalAddress, govIdDetails, businessmanProfile, entrepreneurProfile };
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!isEligibleAge) {
      setError(
        `Registration rejected. You must be at least 18 years old to join Business Hub. Current age calculated: ${calculatedAge} years.`
      );
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

    if (selectedRole === 'business' && (bizTrack === 'entrepreneur' || bizTrack === 'both')) {
      if (!isStartupRegistered && !unregisteredDeclarationAccepted) {
        setError(
          'For unregistered early-stage startups, the founder declaration acknowledging unregistered status is required.'
        );
        return;
      }
    }

    setLoading(true);
    try {
      const { personalAddress, govIdDetails, businessmanProfile, entrepreneurProfile } = buildProfiles();

      const applicationContext = {
        isStartupRegistered: Boolean(isStartupRegistered),
        hasBusinessAddress: !bizSameAddress,
        unregisteredDeclarationAccepted: Boolean(unregisteredDeclarationAccepted),
        hasTeachingQualification: Boolean(hasTeachingQualification),
        businessmanProfile,
        entrepreneurProfile,
        personalAddress,
        govIdDetails,
      };

      if (requiresDocUpload) {
        const res = await authApi.initRegistration({
          fullName,
          email,
          mobile,
          dob,
          password,
          roles: effectiveRoles,
          termsAccepted,
          personalAddress,
          govIdDetails,
          businessmanProfile,
          entrepreneurProfile,
          applicationContext,
        });

        if (res.data?.success) {
          setDraftId(res.data.draftId);
          setDraftToken(res.data.draftToken);
          setChecklistData(res.data);
          setStep(2);
          window.scrollTo(0, 0);
        }
      } else {
        const res = await authApi.register({
          fullName,
          email,
          mobile,
          dob,
          password,
          roles: effectiveRoles,
          termsAccepted,
          personalAddress,
          govIdDetails,
        });
        if (res.data?.success) {
          setRegisteredData(res.data);
          if (res.data.devOtp) {
            setOtpMessage(`Verification code sent! (Dev OTP: ${res.data.devOtp})`);
          }
          setShowOtpModal(true);
        }
      }
    } catch (err) {
      console.error('Registration init error:', err);
      const errMsg =
        err.response?.data?.message ||
        (!err.response || err.message === 'Network Error'
          ? 'Unable to connect to the backend server. Please verify the server is running on port 5000.'
          : err.message) ||
        'Registration initialization failed. Please verify your details.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmitWithDocs = async () => {
    setError(null);
    if (!checklistData?.summary?.canSubmitApplication) {
      setError('Please upload all required mandatory documents before submitting your application.');
      return;
    }

    setLoading(true);
    try {
      const { personalAddress, govIdDetails, businessmanProfile, entrepreneurProfile } = buildProfiles();

      const res = await authApi.register({
        fullName,
        email,
        mobile,
        dob,
        password,
        roles: effectiveRoles,
        termsAccepted,
        draftId,
        personalAddress,
        govIdDetails,
        businessmanProfile,
        entrepreneurProfile,
        applicationContext: checklistData.applicationContext,
      });

      if (res.data?.success) {
        setRegisteredData(res.data);
        if (res.data.devOtp) {
          setOtpMessage(`Verification code sent! (Dev OTP: ${res.data.devOtp})`);
        }
        setShowOtpModal(true);
      }
    } catch (err) {
      console.error('Registration final submit error:', err);
      const errMsg =
        err.response?.data?.message ||
        (err.message === 'Network Error'
          ? 'Unable to connect to the backend server. Please verify the server is running on port 5000.'
          : err.message) ||
        'Application submission failed. Please verify your uploaded documents.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setOtpMessage(null);
    const trimmed = otpCode.trim();
    if (trimmed.length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(
        { otp: trimmed, type: 'email', email, mobile },
        registeredData?.token
      );
      if (res.data?.success) {
        setOtpMessage('Verification successful! Signing into your portal...');
        dispatch(
          setCredentials({
            user: res.data.user || registeredData.user,
            token: res.data.token || registeredData.token,
          })
        );
        setTimeout(() => {
          if (effectiveRoles.includes('teacher')) {
            navigate('/dashboard/teacher');
          } else if (
            effectiveRoles.includes('businessman') ||
            effectiveRoles.includes('entrepreneur') ||
            effectiveRoles.includes('business')
          ) {
            navigate('/dashboard/business');
          } else if (effectiveRoles.includes('normal') || effectiveRoles.includes('user')) {
            navigate('/dashboard/user');
          } else {
            navigate('/dashboard/student');
          }
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setOtpMessage(null);
    try {
      const res = await authApi.sendOtp({ target: email, email, mobile, type: 'email' });
      const devHint = res.data?.devOtp ? ` (Dev OTP: ${res.data.devOtp})` : '';
      setOtpMessage(`New 6-digit verification code sent to ${email}.${devHint}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP code.');
    }
  };

  // 4 Unified Roles in the Selection Grid
  const categories = [
    {
      role: 'student',
      label: 'Student',
      icon: GraduationCap,
      desc: 'Free courses, learning materials & live classes',
    },
    {
      role: 'teacher',
      label: 'Teacher',
      icon: Award,
      desc: 'Teaching & verified tutor workspace',
    },
    {
      role: 'business',
      label: 'Business / Entrepreneur',
      icon: Building2,
      desc: 'One common registration for established enterprises, suppliers, contractors & innovative startups',
    },
    {
      role: 'normal',
      label: 'Normal User',
      icon: User,
      desc: 'Service requests, consumer shopping & community',
    },
  ];

  const activeCategoryObj = categories.find((c) => c.role === selectedRole) || categories[2];
  const ActiveRoleIcon = activeCategoryObj.icon;

  const currentCategoryObj = businessCats.find((c) => c.name === bizCategory);
  const availableSubcategories = currentCategoryObj?.subcategories || [];

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-10 bg-slate-50">
      <div
        className={`w-full ${
          step === 2 || selectedRole === 'business' ? 'max-w-4xl' : 'max-w-xl'
        } bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10 space-y-6 transition-all`}
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-500/20">
            {step === 2 ? <FileCheck2 className="w-6 h-6" /> : <ActiveRoleIcon className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
            {step === 2 ? 'Mandatory Document Verification' : 'Create Your Business Hub Account'}
          </h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            {step === 2
              ? `Upload role-specific verification documents for your ${effectiveRoles.join(' & ')} application`
              : "Join India's premier platform connecting clients, established businesses, innovative startups, and professionals."}
          </p>
        </div>

        {/* Step Indicator for Verifiable Roles */}
        {requiresDocUpload && (
          <div className="flex items-center justify-center gap-3 text-xs font-bold">
            <span
              className={`px-3 py-1 rounded-full ${
                step === 1 ? 'bg-teal-600 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              1. Profile &amp; Business Details
            </span>
            <span className="text-slate-300">→</span>
            <span
              className={`px-3 py-1 rounded-full ${
                step === 2 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              2. Document Uploads
            </span>
            <span className="text-slate-300">→</span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500">
              3. Independent Admin Approval
            </span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Registration Form */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-6">
            {/* User Role Selection Grid: 4 Clean, Unified Options */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                Select Your Role on Business Hub
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedRole === cat.role;
                  return (
                    <button
                      key={cat.role}
                      type="button"
                      onClick={() => setSelectedRole(cat.role)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/70 shadow-sm ring-1 ring-teal-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="space-y-2">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{cat.label}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{cat.desc}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-extrabold text-teal-700 mt-2 block">
                          ✓ Selected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION A: Personal Information */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-navy-900 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600" />
                Personal Information (Applicant / Owner)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Date of Birth *</label>
                    <span className={`text-[11px] font-bold ${isEligibleAge ? 'text-teal-600' : 'text-red-500'}`}>
                      Age: {calculatedAge} yrs {isEligibleAge ? '✓ (18+)' : '✗ (Must be 18+)'}
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

              {/* Personal Address & Gov ID for Verifiable Roles */}
              {requiresDocUpload && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Personal Residential Address *
                    </label>
                  </div>
                  <input
                    type="text"
                    required={requiresDocUpload}
                    value={personalStreet}
                    onChange={(e) => setPersonalStreet(e.target.value)}
                    placeholder="Street Address / Flat / Building"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      required={requiresDocUpload}
                      value={personalCity}
                      onChange={(e) => setPersonalCity(e.target.value)}
                      placeholder="City / Town"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      required={requiresDocUpload}
                      value={personalState}
                      onChange={(e) => setPersonalState(e.target.value)}
                      placeholder="State"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      required={requiresDocUpload}
                      value={personalPincode}
                      onChange={(e) => setPersonalPincode(e.target.value)}
                      placeholder="Pincode"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Gov Identity Proof */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Government ID Proof Type *
                      </label>
                      <select
                        value={govIdType}
                        onChange={(e) => setGovIdType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="Aadhaar Card">Aadhaar Card</option>
                        <option value="PAN Card">PAN Card</option>
                        <option value="Passport">Passport</option>
                        <option value="Voter ID">Voter ID</option>
                        <option value="Driving License">Driving License</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Government ID Number *
                      </label>
                      <input
                        type="text"
                        required={requiresDocUpload}
                        value={govIdNumber}
                        onChange={(e) => setGovIdNumber(e.target.value)}
                        placeholder="e.g. XXXX-XXXX-XXXX or ABCDE1234F"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION B: UNIFIED BUSINESS & STARTUP PROFILE (Same common form for both) */}
            {selectedRole === 'business' && (
              <div className="space-y-5 pt-4 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-extrabold text-navy-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      Business &amp; Startup Profile
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Unified commercial registration for established businesses, suppliers, contractors, and startups
                    </p>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto">
                    Commercial Portal
                  </span>
                </div>

                {/* Focus Classification Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Enterprise Classification &amp; Track
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setBizTrack('businessman')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        bizTrack === 'businessman'
                          ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-bold shadow-xs ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="text-xs font-bold">Established Business</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Contractor, supplier, materials, distributor, or manufacturer
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBizTrack('entrepreneur')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        bizTrack === 'entrepreneur'
                          ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-bold shadow-xs ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-purple-600 shrink-0" />
                        <span className="text-xs font-bold">Startup Venture</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Tech, SaaS, FinTech, D2C, or innovative early-stage concept
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBizTrack('both')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        bizTrack === 'both'
                          ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-bold shadow-xs ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-teal-600 shrink-0" />
                        <span className="text-xs font-bold">Both (Business &amp; Startup)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Combined established business and innovative venture
                      </p>
                    </button>
                  </div>
                </div>

                {/* Business Name & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Business / Venture Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={bizName}
                      onChange={(e) => setBizName(e.target.value)}
                      placeholder="e.g. Apex Steel & Construction or BuildFlow AI"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Legal Entity / Business Type *
                    </label>
                    <select
                      value={bizType}
                      onChange={(e) => setBizType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {ALL_BUSINESS_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category & Subcategory */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Primary Industry Category *
                    </label>
                    <select
                      value={bizCategory}
                      onChange={(e) => setBizCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {businessCats.map((cat) => (
                        <option key={cat.id || cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Specialized Subcategory *
                    </label>
                    <select
                      value={bizSubcategory}
                      onChange={(e) => setBizSubcategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {availableSubcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Operating Stage */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Current Operating Stage *
                  </label>
                  <select
                    value={bizStage}
                    onChange={(e) => setBizStage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ALL_BUSINESS_STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description & Products */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Business / Startup Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={bizDescription}
                    onChange={(e) => setBizDescription(e.target.value)}
                    placeholder="Brief description of your business operations, services, products, or technology..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Products &amp; Services Handled (Comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={bizProductsServices}
                    onChange={(e) => setBizProductsServices(e.target.value)}
                    placeholder="e.g. Steel Bars, Cement, Civil Consulting, Heavy Machinery, Web App Development"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Business Address & Operating Locations */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Business Registered / Operational Address
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bizSameAddress}
                        onChange={(e) => setBizSameAddress(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span>Same as personal residential address</span>
                    </label>
                  </div>

                  {!bizSameAddress && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        required={!bizSameAddress}
                        value={bizStreet}
                        onChange={(e) => setBizStreet(e.target.value)}
                        placeholder="Business / Office Street Address"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          required={!bizSameAddress}
                          value={bizCity}
                          onChange={(e) => setBizCity(e.target.value)}
                          placeholder="City"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                        />
                        <input
                          type="text"
                          required={!bizSameAddress}
                          value={bizState}
                          onChange={(e) => setBizState(e.target.value)}
                          placeholder="State"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                        />
                        <input
                          type="text"
                          required={!bizSameAddress}
                          value={bizPincode}
                          onChange={(e) => setBizPincode(e.target.value)}
                          placeholder="Pincode"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Operating Locations / Service Areas *
                      </label>
                      <input
                        type="text"
                        required
                        value={bizOperatingLocations}
                        onChange={(e) => setBizOperatingLocations(e.target.value)}
                        placeholder="e.g. Mumbai, Navi Mumbai, Pune, Entire Maharashtra, Pan-India"
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Business Website / Portfolio (Optional)
                      </label>
                      <input
                        type="url"
                        value={bizWebsite}
                        onChange={(e) => setBizWebsite(e.target.value)}
                        placeholder="https://apexenterprise.in"
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Business Phone
                    </label>
                    <input
                      type="tel"
                      value={bizPhone}
                      onChange={(e) => setBizPhone(e.target.value)}
                      placeholder={mobile || '+91 98765 00000'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Alternate Phone (Opt)
                    </label>
                    <input
                      type="tel"
                      value={bizAltPhone}
                      onChange={(e) => setBizAltPhone(e.target.value)}
                      placeholder="Landline / Alt mobile"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Business Email (Opt)
                    </label>
                    <input
                      type="email"
                      value={bizEmail}
                      onChange={(e) => setBizEmail(e.target.value)}
                      placeholder={email || 'info@biz.com'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                {/* Startup & Innovation Track Options (If startup or both selected) */}
                {(bizTrack === 'entrepreneur' || bizTrack === 'both') && (
                  <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-950 uppercase">
                        Startup Legal Registration Status
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsStartupRegistered(false)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            !isStartupRegistered
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          Unregistered / Early Stage
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsStartupRegistered(true)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            isStartupRegistered
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          Registered Entity
                        </button>
                      </div>
                    </div>

                    {!isStartupRegistered && (
                      <div className="p-3 bg-white rounded-xl border border-purple-200 text-xs text-purple-900 space-y-2">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={unregisteredDeclarationAccepted}
                            onChange={(e) => setUnregisteredDeclarationAccepted(e.target.checked)}
                            className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4 shrink-0"
                          />
                          <span className="font-semibold leading-relaxed">
                            <strong>Mandatory Founder Declaration:</strong> I declare that my startup is in early
                            stage / ideation and is not yet formally incorporated. I confirm all submitted ideas and
                            information are truthful. (Company incorporation documents will NOT be required).
                          </span>
                        </label>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Pitch Deck / Presentation Link (Optional)
                        </label>
                        <input
                          type="url"
                          value={startupPitchDeckUrl}
                          onChange={(e) => setStartupPitchDeckUrl(e.target.value)}
                          placeholder="https://drive.google.com/... or DocSend link"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Target Customer Market (Optional)
                        </label>
                        <input
                          type="text"
                          value={startupTargetMarket}
                          onChange={(e) => setStartupTargetMarket(e.target.value)}
                          placeholder="e.g. B2B Contractors, Tier-2 MSMEs, Builders"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION C: Teacher Specific Qualification */}
            {selectedRole === 'teacher' && (
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-slate-800 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasTeachingQualification}
                    onChange={(e) => setHasTeachingQualification(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>I hold a formal teaching certification, B.Ed, or pedagogical diploma.</span>
                </label>
                <p className="text-[11px] text-amber-700">
                  Checking this adds Teaching Qualification Certificate to your mandatory upload list.
                </p>
              </div>
            )}

            {/* SECTION D: Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password *</label>
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
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirm Password *</label>
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
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 mt-0.5 w-4 h-4"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer select-none">
                I agree to the{' '}
                <Link to="/terms" className="font-bold text-teal-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and acknowledge the{' '}
                <Link to="/privacy-policy" className="font-bold text-teal-600 hover:underline">
                  Privacy Policy
                </Link>
                . I certify that I am at least 18 years of age.
              </label>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                'Processing Registration...'
              ) : requiresDocUpload ? (
                <>
                  <span>Continue to Step 2: Upload Mandatory Documents</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Mandatory Document Uploads (For Business / Teacher) */}
        {step === 2 && checklistData && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">
                  Document Requirements Checklist ({effectiveRoles.join(' & ')})
                </p>
                <p className="text-sky-700 mt-0.5">
                  Identity proof, business registration, address verification, and owner photo are required before
                  submitting for approval.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-3 py-1.5 rounded-xl border border-sky-300 text-sky-800 hover:bg-white text-xs font-bold"
              >
                ← Back to Details
              </button>
            </div>

            {/* Document Verification Slots */}
            <DocumentVerificationPanel
              checklistData={checklistData}
              customToken={draftToken}
              onChecklistUpdated={(updated) => setChecklistData(updated)}
              roles={effectiveRoles}
            />

            {/* Final Submission Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
              >
                ← Back to Details
              </button>

              <button
                type="button"
                disabled={loading || !checklistData.summary?.canSubmitApplication}
                onClick={handleFinalSubmitWithDocs}
                className={`px-8 py-3.5 rounded-2xl text-xs font-black shadow-md transition-all flex items-center gap-2 ${
                  checklistData.summary?.canSubmitApplication
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  'Submitting Application...'
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit Application for Admin Approval</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-teal-600 hover:text-teal-700 hover:underline">
            Sign in to your account
          </Link>
        </p>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-navy-950">Verify Your Mobile &amp; Email</h3>
              <p className="text-xs text-slate-500">
                Enter the 6-digit verification code sent to <strong>{mobile}</strong> and <strong>{email}</strong>
              </p>
            </div>

            {otpMessage && (
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs text-center font-semibold">
                {otpMessage}
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="1 2 3 4 5 6"
                className="w-full text-center text-2xl font-black tracking-widest py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              <button
                type="button"
                disabled={loading}
                onClick={handleVerifyOtp}
                className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-md transition-all"
              >
                {loading ? 'Verifying...' : 'Verify Code & Complete Sign Up'}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="font-bold text-teal-600 hover:underline"
                >
                  Resend Code
                </button>
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
