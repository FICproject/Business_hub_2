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

const VERIFICATION_ROLES = ['teacher', 'businessman', 'entrepreneur'];

// Initial default categories
const DEFAULT_BUSINESSMAN_CATS = [
  {
    id: 'construction_building_materials',
    name: 'Construction & Building Materials',
    subcategories: ['Cement', 'Steel', 'Bricks', 'Sand', 'Tiles', 'Paints', 'Roofing Materials', 'Plumbing Materials', 'Electrical Materials', 'Hardware Supplies'],
  },
  {
    id: 'engineering_architecture',
    name: 'Engineering & Architecture',
    subcategories: ['Civil Engineers', 'Structural Engineers', 'Architects', 'Surveyors', 'Quantity Surveyors', 'Engineering Consultants'],
  },
  {
    id: 'interior_design_decoration',
    name: 'Interior Design & Decoration',
    subcategories: ['Interior Designers', 'Modular Kitchens', 'Furniture', 'False Ceilings', 'Painting', 'Home Decoration'],
  },
  {
    id: 'electrical_plumbing',
    name: 'Electrical & Plumbing',
    subcategories: ['Electricians', 'Plumbers', 'Electrical Contractors', 'Lighting Solutions', 'Sanitary Fittings', 'Electrical Equipment'],
  },
  {
    id: 'contractors_construction_services',
    name: 'Contractors & Construction Services',
    subcategories: ['Building Contractors', 'Labour Contractors', 'Renovation', 'Waterproofing', 'Demolition', 'Construction Management'],
  },
  {
    id: 'real_estate_property',
    name: 'Real Estate & Property',
    subcategories: ['Builders', 'Property Developers', 'Property Dealers', 'Rental Services', 'Property Consultants'],
  },
  {
    id: 'transportation_logistics',
    name: 'Transportation & Logistics',
    subcategories: ['Packers and Movers', 'Goods Transport', 'Construction Material Transport', 'Logistics Providers', 'Delivery Services'],
  },
  {
    id: 'it_technology',
    name: 'IT & Technology',
    subcategories: ['Software Services', 'Web Development', 'Mobile App Development', 'Hardware Services', 'Computer Repair', 'Networking'],
  },
  {
    id: 'manufacturing_industrial',
    name: 'Manufacturing & Industrial',
    subcategories: ['Manufacturers', 'Fabrication', 'Machinery', 'Industrial Equipment', 'Metal Works'],
  },
  {
    id: 'professional_business_services',
    name: 'Professional & Business Services',
    subcategories: ['Chartered Accountants', 'Accounting Services', 'Legal Consultants', 'Business Consultants', 'Marketing Agencies'],
  },
  {
    id: 'agriculture_farming',
    name: 'Agriculture & Farming',
    subcategories: ['Seeds', 'Fertilizers', 'Agricultural Equipment', 'Irrigation', 'Farming Services'],
  },
  {
    id: 'retail_wholesale',
    name: 'Retail & Wholesale',
    subcategories: ['General Stores', 'Wholesalers', 'Distributors', 'Electronics', 'Furniture', 'Hardware Shops'],
  },
];

const DEFAULT_ENTREPRENEUR_CATS = [
  {
    id: 'tech_it_startups',
    name: 'Technology & IT Startups',
    subcategories: ['Software Development', 'SaaS Products', 'Mobile Applications', 'Artificial Intelligence', 'Web Development', 'Cybersecurity', 'Cloud Computing', 'IT Solutions', 'Robotics and IoT'],
  },
  {
    id: 'fintech_financial_services',
    name: 'FinTech & Financial Services',
    subcategories: ['Digital Payments', 'Financial Technology', 'Accounting Platforms', 'Financial Management Solutions', 'InsurTech', 'Investment Technology'],
  },
  {
    id: 'ecommerce_online_business',
    name: 'E-commerce & Online Business',
    subcategories: ['Online Stores', 'D2C Brands', 'Online Marketplaces', 'Digital Products', 'Dropshipping', 'Subscription-based Businesses'],
  },
  {
    id: 'education_edtech',
    name: 'Education & EdTech',
    subcategories: ['Online Learning Platforms', 'Educational Applications', 'Coaching Platforms', 'Skill Development', 'Training Solutions', 'Learning Management Systems'],
  },
  {
    id: 'healthcare_healthtech',
    name: 'Healthcare & HealthTech',
    subcategories: ['Healthcare Applications', 'Medical Technology', 'Wellness Platforms', 'Healthcare Services', 'Health Monitoring Solutions', 'Medical Equipment Innovation'],
  },
  {
    id: 'agriculture_agritech',
    name: 'Agriculture & AgriTech',
    subcategories: ['Smart Farming', 'Agricultural Marketplaces', 'Farm Management Solutions', 'Food Technology', 'Agricultural Equipment Innovation'],
  },
  {
    id: 'manufacturing_hardware',
    name: 'Manufacturing & Hardware',
    subcategories: ['3D Printing & Prototyping', 'Industrial Automation', 'Hardware Devices', 'Electronic Components', 'Robotics & Drones'],
  },
  {
    id: 'cleantech_sustainability',
    name: 'CleanTech & Sustainability',
    subcategories: ['Solar & Renewable Energy', 'Waste Management & Recycling', 'Electric Vehicles & Mobility', 'Water Purification & Conservation', 'Green Packaging & Materials'],
  },
  {
    id: 'media_entertainment',
    name: 'Media, Content & Entertainment',
    subcategories: ['Digital Media & Publishing', 'Content Creation Platforms', 'Gaming & eSports', 'Streaming & Podcasting Solutions', 'AR & VR Experiences'],
  },
  {
    id: 'professional_business_solutions',
    name: 'Professional & Business Solutions',
    subcategories: ['HR & Recruitment Tech', 'LegalTech', 'Supply Chain & Logistics Tech', 'Business Analytics & BI', 'Marketing Tech & Automation'],
  },
  {
    id: 'social_impact_community',
    name: 'Social Impact & Community Startups',
    subcategories: ['Non-Profit & NGO Tech', 'Rural Development Solutions', 'Assistive & Accessible Tech', 'Community & Civic Platforms', 'Livelihood & Micro-Enterprise'],
  },
  {
    id: 'other_innovative_startups',
    name: 'Other Innovative Startups',
    subcategories: ['DeepTech & Frontier Tech', 'BioTech & Life Sciences', 'SpaceTech & Aerospace', 'Consumer Innovation & Lifestyle', 'Cross-Disciplinary Ventures'],
  },
];

const BUSINESS_TYPES = [
  'Manufacturer',
  'Supplier',
  'Distributor',
  'Retailer',
  'Wholesaler',
  'Contractor',
  'Service Provider',
];

const STARTUP_STAGES = [
  'Ideation / Concept',
  'Prototype / MVP',
  'Early Traction / Pre-Revenue',
  'Generating Revenue / Scaling',
  'Growth / Expansion',
];

const STARTUP_REGISTRATION_TYPES = [
  'Private Limited Company (Pvt Ltd)',
  'Limited Liability Partnership (LLP)',
  'One Person Company (OPC)',
  'Partnership Firm',
  'Sole Proprietorship',
  'Section 8 / Non-Profit Company',
  'Trust / Society',
  'Other',
];

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'student';

  // Role Selection (student, teacher, businessman, entrepreneur, both, normal)
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

  // Businessman Specific Info
  const [businessmanCats, setBusinessmanCats] = useState(DEFAULT_BUSINESSMAN_CATS);
  const [bizName, setBizName] = useState('');
  const [bizCategory, setBizCategory] = useState(DEFAULT_BUSINESSMAN_CATS[0].name);
  const [bizSubcategory, setBizSubcategory] = useState(DEFAULT_BUSINESSMAN_CATS[0].subcategories[0]);
  const [bizType, setBizType] = useState(BUSINESS_TYPES[1]); // 'Supplier'
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

  // Entrepreneur Specific Info
  const [entrepreneurCats, setEntrepreneurCats] = useState(DEFAULT_ENTREPRENEUR_CATS);
  const [startupName, setStartupName] = useState('');
  const [startupCategory, setStartupCategory] = useState(DEFAULT_ENTREPRENEUR_CATS[0].name);
  const [startupSubcategory, setStartupSubcategory] = useState(DEFAULT_ENTREPRENEUR_CATS[0].subcategories[0]);
  const [startupStage, setStartupStage] = useState(STARTUP_STAGES[0]);
  const [isStartupRegistered, setIsStartupRegistered] = useState(false);
  const [startupRegType, setStartupRegType] = useState(STARTUP_REGISTRATION_TYPES[0]);
  const [startupRegNumber, setStartupRegNumber] = useState('');
  const [startupRegDate, setStartupRegDate] = useState('');
  const [unregisteredDeclarationAccepted, setUnregisteredDeclarationAccepted] = useState(false);
  const [startupIdeaSummary, setStartupIdeaSummary] = useState('');
  const [startupLaunchTimeline, setStartupLaunchTimeline] = useState('Within 3-6 months');
  const [startupDescription, setStartupDescription] = useState('');
  const [startupProblemStatement, setStartupProblemStatement] = useState('');
  const [startupSolution, setStartupSolution] = useState('');
  const [startupTargetMarket, setStartupTargetMarket] = useState('');
  const [hasBusinessAddress, setHasBusinessAddress] = useState(false);
  const [officeStreet, setOfficeStreet] = useState('');
  const [officeCity, setOfficeCity] = useState('');
  const [officeState, setOfficeState] = useState('');
  const [officePincode, setOfficePincode] = useState('');
  const [startupWebsite, setStartupWebsite] = useState('');
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

  // Load Categories from API
  useEffect(() => {
    categoriesApi.getCategories({ role: 'businessman' })
      .then((res) => {
        if (res.data?.success && res.data.categories?.length) {
          setBusinessmanCats(res.data.categories);
        }
      })
      .catch(() => {});

    categoriesApi.getCategories({ role: 'entrepreneur' })
      .then((res) => {
        if (res.data?.success && res.data.categories?.length) {
          setEntrepreneurCats(res.data.categories);
        }
      })
      .catch(() => {});
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    const found = businessmanCats.find((c) => c.name === bizCategory);
    if (found && found.subcategories?.length) {
      setBizSubcategory(found.subcategories[0]);
    }
  }, [bizCategory, businessmanCats]);

  useEffect(() => {
    const found = entrepreneurCats.find((c) => c.name === startupCategory);
    if (found && found.subcategories?.length) {
      setStartupSubcategory(found.subcategories[0]);
    }
  }, [startupCategory, entrepreneurCats]);

  // Sync business address with personal if checked
  useEffect(() => {
    if (bizSameAddress) {
      setBizStreet(personalStreet);
      setBizCity(personalCity);
      setBizState(personalState);
      setBizPincode(personalPincode);
    }
  }, [bizSameAddress, personalStreet, personalCity, personalState, personalPincode]);

  const effectiveRoles =
    selectedRole === 'both' ? ['businessman', 'entrepreneur'] : [selectedRole];
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

    // Role-specific validations
    if (effectiveRoles.includes('entrepreneur')) {
      if (!isStartupRegistered && !unregisteredDeclarationAccepted) {
        setError('For unregistered startups, the founder declaration acknowledging early stage/unregistered status is mandatory.');
        return;
      }
    }

    setLoading(true);
    try {
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

      const businessmanProfile = effectiveRoles.includes('businessman')
        ? {
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
          }
        : null;

      const entrepreneurProfile = effectiveRoles.includes('entrepreneur')
        ? {
            startupName,
            category: startupCategory,
            subcategory: startupSubcategory,
            stage: startupStage,
            isStartupRegistered,
            registrationType: isStartupRegistered ? startupRegType : '',
            registrationNumber: isStartupRegistered ? startupRegNumber : '',
            registrationDate: isStartupRegistered ? startupRegDate : '',
            unregisteredDeclarationAccepted: !isStartupRegistered ? unregisteredDeclarationAccepted : true,
            ideaSummary: startupIdeaSummary,
            targetLaunchTimeline: startupLaunchTimeline,
            description: startupDescription,
            problemStatement: startupProblemStatement,
            solutionDescription: startupSolution,
            targetMarket: startupTargetMarket,
            hasBusinessAddress,
            officeAddress: hasBusinessAddress
              ? {
                  street: officeStreet,
                  city: officeCity,
                  state: officeState,
                  postalCode: officePincode,
                  country: 'India',
                }
              : null,
            websiteUrl: startupWebsite,
            pitchDeckUrl: startupPitchDeckUrl,
          }
        : null;

      const applicationContext = {
        isStartupRegistered: Boolean(isStartupRegistered),
        hasBusinessAddress: Boolean(hasBusinessAddress),
        unregisteredDeclarationAccepted: Boolean(unregisteredDeclarationAccepted),
        hasTeachingQualification: Boolean(hasTeachingQualification),
        businessmanProfile,
        entrepreneurProfile,
        personalAddress,
        govIdDetails,
      };

      if (requiresDocUpload) {
        // Initialize registration draft
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
        // Direct registration for Student or Normal User
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
          setShowOtpModal(true);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration initialization failed. Please verify your details.');
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

      const businessmanProfile = effectiveRoles.includes('businessman')
        ? {
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
          }
        : null;

      const entrepreneurProfile = effectiveRoles.includes('entrepreneur')
        ? {
            startupName,
            category: startupCategory,
            subcategory: startupSubcategory,
            stage: startupStage,
            isStartupRegistered,
            registrationType: isStartupRegistered ? startupRegType : '',
            registrationNumber: isStartupRegistered ? startupRegNumber : '',
            registrationDate: isStartupRegistered ? startupRegDate : '',
            unregisteredDeclarationAccepted: !isStartupRegistered ? unregisteredDeclarationAccepted : true,
            ideaSummary: startupIdeaSummary,
            targetLaunchTimeline: startupLaunchTimeline,
            description: startupDescription,
            problemStatement: startupProblemStatement,
            solutionDescription: startupSolution,
            targetMarket: startupTargetMarket,
            hasBusinessAddress,
            officeAddress: hasBusinessAddress
              ? {
                  street: officeStreet,
                  city: officeCity,
                  state: officeState,
                  postalCode: officePincode,
                  country: 'India',
                }
              : null,
            websiteUrl: startupWebsite,
            pitchDeckUrl: startupPitchDeckUrl,
          }
        : null;

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
        setShowOtpModal(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Application submission failed.');
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
      await authApi.verifyOtp({ otp: trimmed, type: 'email' }, registeredData?.token);
      dispatch(setCredentials({ user: { ...registeredData.user, isEmailVerified: true }, token: registeredData.token }));

      if (effectiveRoles.includes('teacher')) {
        navigate('/dashboard/teacher?tab=verification');
      } else if (effectiveRoles.includes('businessman') || effectiveRoles.includes('entrepreneur')) {
        navigate('/dashboard/business?tab=verification');
      } else if (effectiveRoles.includes('normal') || effectiveRoles.includes('user')) {
        navigate('/dashboard/user');
      } else {
        navigate('/dashboard/student');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setOtpMessage(null);
    try {
      const res = await authApi.sendOtp({ target: email, type: 'email' });
      setOtpMessage(res.data?.message || 'A new verification code has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP code.');
    }
  };

  const categories = [
    { role: 'student', label: 'Student', icon: GraduationCap, desc: 'Free courses & live classes' },
    { role: 'teacher', label: 'Teacher', icon: Award, desc: 'Teaching & verified tutor portal' },
    { role: 'businessman', label: 'Businessman', icon: Building2, desc: 'Established enterprise, materials & contractors' },
    { role: 'entrepreneur', label: 'Entrepreneur', icon: Rocket, desc: 'Innovative startups (registered or unregistered)' },
    { role: 'both', label: 'Businessman & Entrepreneur', icon: Layers, desc: 'Apply for both established business and startup venture' },
    { role: 'normal', label: 'Normal User', icon: User, desc: 'Service requests & consumer marketplace' },
  ];

  const activeCategoryObj = categories.find((c) => c.role === selectedRole) || categories[0];
  const ActiveRoleIcon = activeCategoryObj.icon;

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-10 bg-slate-50">
      <div
        className={`w-full ${
          step === 2 || ['businessman', 'entrepreneur', 'both'].includes(selectedRole)
            ? 'max-w-4xl'
            : 'max-w-xl'
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
              : 'Join India\'s premier platform connecting clients, established businesses, innovative startups, and professionals.'}
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
            {/* User Role Selection Grid */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                Select Your Role on Business Hub
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedRole === cat.role;
                  return (
                    <button
                      key={cat.role}
                      type="button"
                      onClick={() => setSelectedRole(cat.role)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/70 shadow-sm ring-1 ring-teal-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
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
                    </button>
                  );
                })}
              </div>

              {selectedRole === 'both' && (
                <div className="mt-3 p-3 rounded-xl bg-violet-50 border border-violet-200 text-violet-800 text-xs flex items-start gap-2">
                  <Layers className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Dual Role Registration Selected</p>
                    <p className="text-[11px] text-violet-700">
                      You can register both an established business and an early-stage startup venture. Each role will be independently reviewed and approved by the Admin.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION A: Personal Information */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-navy-900 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
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
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
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
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
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
                    <label className="block text-xs font-bold text-slate-700 uppercase">Date of Birth</label>
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

              {/* Personal Address (for Businessmen, Entrepreneurs, Teachers) */}
              {requiresDocUpload && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <label className="text-xs font-bold text-slate-700 uppercase">Personal Residential Address</label>
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
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Government ID Proof Type</label>
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
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Government ID Number</label>
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

            {/* SECTION B: Businessman Business Information */}
            {(selectedRole === 'businessman' || selectedRole === 'both') && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-navy-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    Businessman Business Profile
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Established Enterprise
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Business Name</label>
                    <input
                      type="text"
                      required
                      value={bizName}
                      onChange={(e) => setBizName(e.target.value)}
                      placeholder="e.g. Apex Steel &amp; Construction Supplies"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Business Type</label>
                    <select
                      value={bizType}
                      onChange={(e) => setBizType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {BUSINESS_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 12 Categories and Dynamic Subcategories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Business Category (12 Options)</label>
                    <select
                      value={bizCategory}
                      onChange={(e) => setBizCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {businessmanCats.map((cat) => (
                        <option key={cat.id || cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subcategory</label>
                    <select
                      value={bizSubcategory}
                      onChange={(e) => setBizSubcategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {(
                        businessmanCats.find((c) => c.name === bizCategory)?.subcategories || []
                      ).map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Business Description</label>
                  <textarea
                    rows={2}
                    required
                    value={bizDescription}
                    onChange={(e) => setBizDescription(e.target.value)}
                    placeholder="Brief description of your business operations, certifications, and history..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Products / Services Offered</label>
                  <input
                    type="text"
                    required
                    value={bizProductsServices}
                    onChange={(e) => setBizProductsServices(e.target.value)}
                    placeholder="e.g. TMT Steel Bars, Grade 53 Cement, Structural Fabrication, Ready Mix Concrete"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Business Address */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase">Business Physical Address</label>
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bizSameAddress}
                        onChange={(e) => setBizSameAddress(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                      <span>Same as Residential Address</span>
                    </label>
                  </div>
                  {!bizSameAddress && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={bizStreet}
                        onChange={(e) => setBizStreet(e.target.value)}
                        placeholder="Business Commercial Street / Unit"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={bizCity}
                          onChange={(e) => setBizCity(e.target.value)}
                          placeholder="City"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                        />
                        <input
                          type="text"
                          value={bizState}
                          onChange={(e) => setBizState(e.target.value)}
                          placeholder="State"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                        />
                        <input
                          type="text"
                          value={bizPincode}
                          onChange={(e) => setBizPincode(e.target.value)}
                          placeholder="Pincode"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Operating Locations & Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Operating Locations / Service Pincodes</label>
                    <input
                      type="text"
                      required
                      value={bizOperatingLocations}
                      onChange={(e) => setBizOperatingLocations(e.target.value)}
                      placeholder="e.g. 560001, 560034, Bangalore Urban, Entire Karnataka"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Business Website (Optional)</label>
                    <input
                      type="url"
                      value={bizWebsite}
                      onChange={(e) => setBizWebsite(e.target.value)}
                      placeholder="https://apexsteel.com"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Business Phone</label>
                    <input
                      type="tel"
                      value={bizPhone}
                      onChange={(e) => setBizPhone(e.target.value)}
                      placeholder={mobile || '+91 98765 00000'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Alternate Phone (Opt)</label>
                    <input
                      type="tel"
                      value={bizAltPhone}
                      onChange={(e) => setBizAltPhone(e.target.value)}
                      placeholder="Landline / Alt mobile"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Business Email (Opt)</label>
                    <input
                      type="email"
                      value={bizEmail}
                      onChange={(e) => setBizEmail(e.target.value)}
                      placeholder={email || 'info@biz.com'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION C: Entrepreneur Startup Information */}
            {(selectedRole === 'entrepreneur' || selectedRole === 'both') && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-navy-900 flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-purple-600" />
                    Entrepreneur Startup Venture
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    Innovative Startup
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Startup / Business Name</label>
                    <input
                      type="text"
                      required
                      value={startupName}
                      onChange={(e) => setStartupName(e.target.value)}
                      placeholder="e.g. BuildFlow AI or KisanTech Logistics"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Venture Stage</label>
                    <select
                      value={startupStage}
                      onChange={(e) => setStartupStage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {STARTUP_STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Entrepreneur Categories & Subcategories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Startup Domain / Category</label>
                    <select
                      value={startupCategory}
                      onChange={(e) => setStartupCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {entrepreneurCats.map((cat) => (
                        <option key={cat.id || cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Specialized Subcategory</label>
                    <select
                      value={startupSubcategory}
                      onChange={(e) => setStartupSubcategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {(
                        entrepreneurCats.find((c) => c.name === startupCategory)?.subcategories || []
                      ).map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Registered vs Unregistered Startup Switch */}
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-950 uppercase">
                      Is your startup officially registered?
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

                  {isStartupRegistered ? (
                    <div className="space-y-3 pt-2">
                      <p className="text-[11px] text-purple-800 font-medium">
                        Enter legal entity details (Company incorporation document will be requested in document upload step):
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Registration Type</label>
                          <select
                            value={startupRegType}
                            onChange={(e) => setStartupRegType(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                          >
                            {STARTUP_REGISTRATION_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">CIN / LLPIN / Reg No.</label>
                          <input
                            type="text"
                            required={isStartupRegistered}
                            value={startupRegNumber}
                            onChange={(e) => setStartupRegNumber(e.target.value)}
                            placeholder="U72900KA2024PTC123456"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Registration Date</label>
                          <input
                            type="date"
                            value={startupRegDate}
                            onChange={(e) => setStartupRegDate(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      <div className="p-3 rounded-xl bg-white border border-purple-200/80 space-y-2">
                        <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={unregisteredDeclarationAccepted}
                            onChange={(e) => setUnregisteredDeclarationAccepted(e.target.checked)}
                            className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4 shrink-0"
                          />
                          <span className="font-semibold leading-relaxed">
                            <strong>Mandatory Founder Declaration:</strong> I declare that my startup is in early stage / ideation and is not yet formally incorporated. I confirm all submitted ideas and information are truthful. (Company incorporation documents will NOT be required).
                          </span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Core Concept Summary</label>
                          <input
                            type="text"
                            value={startupIdeaSummary}
                            onChange={(e) => setStartupIdeaSummary(e.target.value)}
                            placeholder="e.g. AI-driven logistics aggregator for rural farmers"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Target Launch Timeline</label>
                          <input
                            type="text"
                            value={startupLaunchTimeline}
                            onChange={(e) => setStartupLaunchTimeline(e.target.value)}
                            placeholder="e.g. Q2 2027 or MVP ready in 4 months"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Problem, Solution, Market */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Problem Statement</label>
                    <textarea
                      rows={2}
                      required
                      value={startupProblemStatement}
                      onChange={(e) => setStartupProblemStatement(e.target.value)}
                      placeholder="What critical market inefficiency or customer pain point does your venture solve?"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Solution / Product Description</label>
                    <textarea
                      rows={2}
                      required
                      value={startupSolution}
                      onChange={(e) => setStartupSolution(e.target.value)}
                      placeholder="Describe your innovative technology, product, or service offering..."
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Market &amp; Audience</label>
                    <input
                      type="text"
                      required
                      value={startupTargetMarket}
                      onChange={(e) => setStartupTargetMarket(e.target.value)}
                      placeholder="e.g. Tier-2 MSMEs, Civil Contractors, B2B procurement heads"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Separate Office / Co-working Space Checkbox */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasBusinessAddress}
                      onChange={(e) => setHasBusinessAddress(e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                    />
                    <span>Operating from a separate office or co-working space? (Optional)</span>
                  </label>
                  {hasBusinessAddress && (
                    <div className="space-y-2 pt-1">
                      <input
                        type="text"
                        value={officeStreet}
                        onChange={(e) => setOfficeStreet(e.target.value)}
                        placeholder="Incubator / Co-working / Office Space Address"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={officeCity}
                          onChange={(e) => setOfficeCity(e.target.value)}
                          placeholder="City"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                        />
                        <input
                          type="text"
                          value={officeState}
                          onChange={(e) => setOfficeState(e.target.value)}
                          placeholder="State"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                        />
                        <input
                          type="text"
                          value={officePincode}
                          onChange={(e) => setOfficePincode(e.target.value)}
                          placeholder="Pincode"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Startup Website / App URL (Opt)</label>
                    <input
                      type="url"
                      value={startupWebsite}
                      onChange={(e) => setStartupWebsite(e.target.value)}
                      placeholder="https://myventure.io"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pitch Deck / Presentation Link (Opt)</label>
                    <input
                      type="url"
                      value={startupPitchDeckUrl}
                      onChange={(e) => setStartupPitchDeckUrl(e.target.value)}
                      placeholder="https://drive.google.com/... or DocSend link"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION D: Teacher Specific Qualification */}
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

            {/* SECTION E: Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
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
                className="mt-1 rounded text-teal-600 focus:ring-teal-500 w-4 h-4 shrink-0"
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
                ? 'Validating Profile...'
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
              roles={effectiveRoles}
              isPostSubmission={false}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Profile Details</span>
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
                    Your documents have been submitted! Your account status is <strong>Pending Admin Approval</strong>.
                  </p>
                )}
                {otpMessage && (
                  <p className="text-[11px] text-teal-700 bg-teal-50 border border-teal-200 p-2 rounded-lg font-medium">
                    {otpMessage}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="••••••"
                  className="w-full text-center tracking-[0.5em] text-2xl font-extrabold py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all"
              >
                {loading ? 'Verifying...' : 'Confirm OTP & Continue'}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                className="w-full text-xs font-bold text-teal-600 hover:text-teal-700"
              >
                Resend verification code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
