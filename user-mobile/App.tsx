import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  FlatList,
  Platform,
} from 'react-native';
import { api, API_BASE_URL } from './src/services/api';

// --- Types & Constants ---
type UserRole = 'student' | 'teacher' | 'businessman' | 'entrepreneur' | 'business' | 'normal' | 'user';

const ROLE_DISPLAY_NAMES: Record<string, string> = {
  student: 'Student',
  teacher: 'Teacher',
  businessman: 'Business',
  entrepreneur: 'Business',
  business: 'Business',
  normal: 'General User',
  user: 'General User',
};

const POPULAR_STUDENT_COURSES = [
  'B.Tech / B.E (Engineering)',
  'B.Sc (Computer Science)',
  'BCA (Applications)',
  'B.Com (Commerce)',
  'BBA (Management)',
  'MBA / PGDM',
  'MCA / M.Tech',
  'Diploma in Engineering',
];

const STUDENT_YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year / Final Year',
  '5th Year (Dual/Integrated)',
  'Recent Graduate / Passed Out',
  'Postgraduate (1st Year)',
  'Postgraduate (2nd Year)',
];

export default function App() {
  // --- Global App State ---
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<'marketplace' | 'education' | 'jobs' | 'dashboard' | 'profile'>('marketplace');

  // Auth screen state ('login' | 'register')
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState(false);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Registration Form State
  const [regRole, setRegRole] = useState<'student' | 'teacher' | 'business' | 'normal'>('student');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regDob, setRegDob] = useState('2000-01-01');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regTerms, setRegTerms] = useState(false);

  // Student-specific Registration Fields
  const [studentCourse, setStudentCourse] = useState('');
  const [studentYear, setStudentYear] = useState('1st Year');
  const [studentInstitution, setStudentInstitution] = useState('');
  const [studentSpecialization, setStudentSpecialization] = useState('');

  // Business-specific Registration Fields
  const [bizName, setBizName] = useState('');
  const [bizCategory, setBizCategory] = useState('Software & Technology Services');
  const [bizType, setBizType] = useState('Supplier');
  const [bizDescription, setBizDescription] = useState('');

  // --- Marketplace & Quotations State ---
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [catalogType, setCatalogType] = useState<'products' | 'services'>('products');
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [rfqModalListing, setRfqModalListing] = useState<any>(null);
  const [rfqQuantity, setRfqQuantity] = useState('10');
  const [rfqSpecs, setRfqSpecs] = useState('');
  const [rfqDeliveryDate, setRfqDeliveryDate] = useState('2026-12-15');
  const [rfqAddress, setRfqAddress] = useState('');
  const [myQuotationsModal, setMyQuotationsModal] = useState(false);
  const [myQuotationRequests, setMyQuotationRequests] = useState<any[]>([]);

  // --- Education State ---
  const [educationSubTab, setEducationSubTab] = useState<'courses' | 'live' | 'materials'>('courses');
  const [courses, setCourses] = useState<any[]>([]);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<any[]>([]);
  const [eduLoading, setEduLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // --- Jobs State ---
  const [jobs, setJobs] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [jobsSubTab, setJobsSubTab] = useState<'listings' | 'applications'>('listings');
  const [jobsLoading, setJobsLoading] = useState(false);
  const [applyModalJob, setApplyModalJob] = useState<any>(null);
  const [applyStep, setApplyStep] = useState(1);
  const [selectedAppDossier, setSelectedAppDossier] = useState<any>(null);

  // Job Application Form Fields
  const [appFullName, setAppFullName] = useState('');
  const [appEmail, setAppEmail] = useState('');
  const [appMobile, setAppMobile] = useState('');
  const [appCity, setAppCity] = useState('');
  const [appState, setAppState] = useState('');
  const [appPincode, setAppPincode] = useState('');
  const [appQualification, setAppQualification] = useState('B.Tech');
  const [appDegree, setAppDegree] = useState('Computer Science & Engineering');
  const [appCollege, setAppCollege] = useState('');
  const [appGradYear, setAppGradYear] = useState('2026');
  const [appCgpa, setAppCgpa] = useState('8.5');
  const [appIsFresher, setAppIsFresher] = useState(true);
  const [appExperienceYears, setAppExperienceYears] = useState('0');
  const [appTechSkills, setAppTechSkills] = useState('React Native, TypeScript, Node.js');
  const [appResumeUrl, setAppResumeUrl] = useState('');
  const [appLinkedin, setAppLinkedin] = useState('');
  const [appCoverLetter, setAppCoverLetter] = useState('');

  // --- Business Dashboard Modals ---
  const [addProductModal, setAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('999');
  const [newProdCategory, setNewProdCategory] = useState('Software & IT');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdMoq, setNewProdMoq] = useState('1');

  // --- Teacher Modals ---
  const [addCourseModal, setAddCourseModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCat, setNewCourseCat] = useState('Computer Science');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  // ---------------------------------------------------------------------------
  // Load initial public content
  // ---------------------------------------------------------------------------
  useEffect(() => {
    loadCatalog();
    loadEducation();
    loadJobs();
  }, []);

  const loadCatalog = async () => {
    setCatalogLoading(true);
    try {
      const [prodRes, servRes] = await Promise.allSettled([
        api.getProducts({ limit: 20 }),
        api.getServices({ limit: 20 }),
      ]);
      if (prodRes.status === 'fulfilled' && prodRes.value?.data) {
        setProducts(prodRes.value.data || []);
      }
      if (servRes.status === 'fulfilled' && servRes.value?.data) {
        setServices(servRes.value.data || []);
      }
    } catch (e) {
      console.warn('Failed to load marketplace data:', e);
    } finally {
      setCatalogLoading(false);
    }
  };

  const loadEducation = async () => {
    setEduLoading(true);
    try {
      const [crsRes, liveRes, matRes] = await Promise.allSettled([
        api.getCourses({ limit: 20 }),
        api.getLiveClasses({ limit: 20 }),
        api.getMaterials({ limit: 20 }),
      ]);
      if (crsRes.status === 'fulfilled' && crsRes.value?.data) {
        setCourses(crsRes.value.data || []);
      }
      if (liveRes.status === 'fulfilled' && liveRes.value?.data) {
        setLiveClasses(liveRes.value.data || []);
      }
      if (matRes.status === 'fulfilled' && matRes.value?.data) {
        setMaterials(matRes.value.data || []);
      }
      if (api.getToken()) {
        const enrollRes = await api.getMyEnrollments().catch(() => ({ data: [] }));
        setMyEnrollments(enrollRes.data || []);
      }
    } catch (e) {
      console.warn('Failed to load education data:', e);
    } finally {
      setEduLoading(false);
    }
  };

  const loadJobs = async () => {
    setJobsLoading(true);
    try {
      const jobsRes = await api.getJobs({ limit: 20 }).catch(() => ({ data: [] }));
      setJobs(jobsRes.data || []);
      if (api.getToken()) {
        const myAppsRes = await api.getMyApplications().catch(() => ({ data: [] }));
        setMyApplications(myAppsRes.data || []);
      }
    } catch (e) {
      console.warn('Failed to load jobs data:', e);
    } finally {
      setJobsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Authentication Handlers
  // ---------------------------------------------------------------------------
  const handleLogin = async () => {
    if (!loginIdentifier || !loginPassword) {
      Alert.alert('Required', 'Please enter your email/mobile and password.');
      return;
    }
    setAuthLoading(true);
    try {
      const res = await api.login({
        email: loginIdentifier,
        mobile: loginIdentifier,
        password: loginPassword,
      });
      if (res.success && res.token) {
        api.setToken(res.token);
        setCurrentUser(res.user);
        const roles = res.user.roles || [];
        if (roles.includes('businessman') || roles.includes('entrepreneur')) {
          setActiveRole('business');
        } else if (roles.includes('teacher')) {
          setActiveRole('teacher');
        } else if (roles.includes('normal') || roles.includes('user')) {
          setActiveRole('normal');
        } else {
          setActiveRole('student');
        }
        // Reload user-scoped data
        loadEducation();
        loadJobs();
        Alert.alert('Welcome', `Signed in successfully as ${res.user.fullName}!`);
      }
    } catch (err: any) {
      Alert.alert('Authentication Failed', err.message || 'Please check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!regFullName || !regEmail || !regMobile || !regPassword) {
      Alert.alert('Required', 'Please fill in all personal information fields.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }
    if (!regTerms) {
      Alert.alert('Terms of Service', 'You must accept the Terms of Service and certify 18+ legal age.');
      return;
    }

    if (regRole === 'student' && (!studentCourse.trim() || !studentInstitution.trim())) {
      Alert.alert('Academic Details Required', 'Please provide what course you are currently studying and your institution name.');
      return;
    }

    if (regRole === 'business' && !bizName.trim()) {
      Alert.alert('Enterprise Details Required', 'Please enter your business or startup name.');
      return;
    }

    setAuthLoading(true);
    try {
      const effectiveRoles =
        regRole === 'business'
          ? ['businessman', 'entrepreneur']
          : [regRole];

      const studentDetails =
        regRole === 'student'
          ? {
              course: studentCourse.trim(),
              currentCourse: studentCourse.trim(),
              year: studentYear,
              currentYear: studentYear,
              institution: studentInstitution.trim(),
              specialization: studentSpecialization.trim() || undefined,
            }
          : undefined;

      const businessmanProfile =
        regRole === 'business'
          ? {
              businessName: bizName.trim(),
              category: bizCategory,
              businessType: bizType,
              businessDescription: bizDescription.trim(),
            }
          : undefined;

      const res = await api.register({
        fullName: regFullName,
        email: regEmail,
        mobile: regMobile,
        dob: regDob,
        password: regPassword,
        roles: effectiveRoles,
        termsAccepted: true,
        studentDetails,
        education: studentCourse ? `${studentCourse} (${studentYear}) • ${studentInstitution}` : undefined,
        businessmanProfile,
        entrepreneurProfile: businessmanProfile ? { ...businessmanProfile, startupName: bizName } : undefined,
      });

      if (res.success) {
        Alert.alert('Success', 'Account created successfully! You can now sign in.');
        setAuthMode('login');
        setLoginIdentifier(regEmail);
        setLoginPassword(regPassword);
      }
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Please verify your information.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    api.setToken(null);
    setCurrentUser(null);
    setActiveRole('student');
    setActiveTab('marketplace');
    Alert.alert('Signed Out', 'You have been signed out.');
  };

  // ---------------------------------------------------------------------------
  // Quotation Request Flow
  // ---------------------------------------------------------------------------
  const handleOpenRfqModal = (listing: any, type: 'product' | 'service') => {
    if (!currentUser) {
      Alert.alert('Sign In Required', 'Please sign in or create an account to request quotations.');
      return;
    }
    setRfqModalListing({ ...listing, itemType: type });
    setRfqSpecs('');
    setRfqAddress(currentUser.personalAddress ? `${currentUser.personalAddress.street || ''}, ${currentUser.personalAddress.city || ''}` : '');
  };

  const handleSubmitRfq = async () => {
    if (!rfqModalListing) return;
    try {
      const res = await api.createQuotationRequest({
        listingId: rfqModalListing._id,
        listingType: rfqModalListing.itemType,
        requiredQuantity: parseInt(rfqQuantity, 10) || 1,
        specifications: rfqSpecs || undefined,
        targetDeliveryDate: rfqDeliveryDate,
        deliveryAddress: rfqAddress || 'Delivery Address Provided On File',
      });
      if (res.success) {
        Alert.alert(
          'Quotation Requested!',
          `Your request (ID: ${res.data?.requestId || 'QREQ-2026'}) has been sent to Business Hub Admin. Admin will coordinate competitive quotes from verified partners.`
        );
        setRfqModalListing(null);
      }
    } catch (err: any) {
      Alert.alert('Request Failed', err.message || 'Could not submit quotation request.');
    }
  };

  const handleOpenMyQuotations = async () => {
    if (!currentUser) return;
    try {
      const res = await api.getMyQuotationRequests();
      setMyQuotationRequests(res.data || []);
      setMyQuotationsModal(true);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not load your quotation requests.');
    }
  };

  // ---------------------------------------------------------------------------
  // Education Handlers (100% Free for Students)
  // ---------------------------------------------------------------------------
  const handleEnrollCourse = async (courseId: string) => {
    if (!currentUser) {
      Alert.alert('Sign In Required', 'Sign in as a student to access 100% free courses.');
      return;
    }
    try {
      await api.enrollCourse(courseId);
      Alert.alert('Enrolled!', '100% Free Lifetime Access granted to this course.');
      loadEducation();
      if (selectedCourse) setSelectedCourse(null);
    } catch (err: any) {
      Alert.alert('Enrollment Notice', err.message || 'You are already enrolled.');
    }
  };

  const handleRegisterLiveClass = async (classId: string) => {
    if (!currentUser) {
      Alert.alert('Sign In Required', 'Sign in to register for free live masterclasses.');
      return;
    }
    try {
      await api.registerForLiveClass(classId);
      Alert.alert('Registered!', 'You are registered for this live session. WebRTC access link confirmed.');
      loadEducation();
    } catch (err: any) {
      Alert.alert('Registration Notice', err.message || 'Already registered.');
    }
  };

  // ---------------------------------------------------------------------------
  // Job Application Handlers
  // ---------------------------------------------------------------------------
  const handleOpenApplyModal = (job: any) => {
    if (!currentUser) {
      Alert.alert('Sign In Required', 'Please sign in to apply for career opportunities.');
      return;
    }
    setApplyModalJob(job);
    setApplyStep(1);
    // Pre-populate with existing profile info
    setAppFullName(currentUser.fullName || '');
    setAppEmail(currentUser.email || '');
    setAppMobile(currentUser.mobile || '');
    if (currentUser.studentDetails) {
      setAppDegree(currentUser.studentDetails.course || '');
      setAppCollege(currentUser.studentDetails.institution || '');
    }
  };

  const handleSubmitJobApplication = async () => {
    if (!applyModalJob) return;
    if (!appFullName || !appEmail || !appMobile) {
      Alert.alert('Required', 'Please complete personal contact information.');
      return;
    }
    if (!appResumeUrl.trim()) {
      Alert.alert('Resume Required', 'Please provide a valid resume URL or document link (.pdf, .doc, .docx).');
      return;
    }

    try {
      const applicationData = {
        personalInfo: {
          fullName: appFullName,
          email: appEmail,
          mobile: appMobile,
          city: appCity || 'Mumbai',
          state: appState || 'Maharashtra',
          pincode: appPincode || '400001',
          address: `${appCity || 'City'}, ${appState || 'State'}`,
        },
        educationalDetails: {
          highestQualification: appQualification,
          courseDegree: appDegree,
          specialization: 'Information Technology',
          collegeUniversity: appCollege || 'National Institute',
          graduationYear: appGradYear,
          percentageCgpa: appCgpa,
        },
        professionalDetails: {
          isFresher: appIsFresher,
          totalExperience: appIsFresher ? 0 : parseFloat(appExperienceYears) || 1,
          technicalSkills: appTechSkills.split(',').map((s) => s.trim()).filter(Boolean),
        },
        documents: {
          resumeUrl: appResumeUrl.trim(),
        },
        additionalInfo: {
          linkedinUrl: appLinkedin.trim() || undefined,
          coverLetter: appCoverLetter.trim() || undefined,
        },
      };

      const res = await api.applyForJob(applyModalJob._id, applicationData);
      if (res.success) {
        Alert.alert(
          'Application Submitted!',
          `Application ID: ${res.data?.applicationId || 'APP-2026'}\nStatus: SUBMITTED.\n\nYour application dossier has been securely delivered to Business Hub Admin.`
        );
        setApplyModalJob(null);
        loadJobs();
        setJobsSubTab('applications');
      }
    } catch (err: any) {
      Alert.alert('Submission Failed', err.message || 'Could not submit application.');
    }
  };

  // ---------------------------------------------------------------------------
  // Business Add Product / Service
  // ---------------------------------------------------------------------------
  const handleCreateBusinessProduct = async () => {
    if (!newProdName.trim() || !newProdPrice) {
      Alert.alert('Required', 'Product Name and Price are mandatory.');
      return;
    }
    try {
      const res = await api.createProduct({
        name: newProdName.trim(),
        price: parseFloat(newProdPrice) || 0,
        category: newProdCategory,
        description: newProdDescription.trim() || 'Verified enterprise product listing.',
        minOrderQuantity: parseInt(newProdMoq, 10) || 1,
        priceType: 'fixed',
        status: 'approved',
      });
      if (res.success) {
        Alert.alert('Published!', 'Product has been published to the Business Hub Marketplace.');
        setAddProductModal(false);
        setNewProdName('');
        loadCatalog();
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not create product.');
    }
  };

  // ---------------------------------------------------------------------------
  // Teacher Add Course
  // ---------------------------------------------------------------------------
  const handleCreateTeacherCourse = async () => {
    if (!newCourseTitle.trim()) {
      Alert.alert('Required', 'Course Title is required.');
      return;
    }
    try {
      const res = await api.createCourse({
        title: newCourseTitle.trim(),
        category: newCourseCat,
        description: newCourseDesc.trim() || 'Comprehensive 100% free curriculum for students.',
        level: 'beginner',
        chapters: [
          {
            title: 'Chapter 1: Foundations & Architecture',
            lessons: [{ title: 'Lesson 1.1: Getting Started' }, { title: 'Lesson 1.2: Core Fundamentals' }],
          },
        ],
      });
      if (res.success) {
        Alert.alert('Course Submitted!', 'Course has been submitted for Admin publication review.');
        setAddCourseModal(false);
        setNewCourseTitle('');
        loadEducation();
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not create course.');
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER: Unauthenticated Auth Modal / Screen
  // ---------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.authContainer} keyboardShouldPersistTaps="handled">
          {/* Brand Header */}
          <View style={styles.brandHeader}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandIconText}>BH</Text>
            </View>
            <Text style={styles.brandTitle}>
              Business <Text style={styles.brandTeal}>Hub</Text>
            </Text>
            <Text style={styles.brandTagline}>
              Connecting Clients, Enterprises, Startups &amp; Students
            </Text>
          </View>

          {/* Auth Card */}
          <View style={styles.authCard}>
            {/* Mode Switcher */}
            <View style={styles.authTabRow}>
              <TouchableOpacity
                onPress={() => setAuthMode('login')}
                style={[styles.authTab, authMode === 'login' && styles.authTabActive]}
              >
                <Text style={[styles.authTabText, authMode === 'login' && styles.authTabTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAuthMode('register')}
                style={[styles.authTab, authMode === 'register' && styles.authTabActive]}
              >
                <Text style={[styles.authTabText, authMode === 'register' && styles.authTabTextActive]}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* LOGIN FORM */}
            {authMode === 'login' ? (
              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>Email or Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="name@businesshub.com or +1 555-0199"
                  placeholderTextColor="#94A3B8"
                  value={loginIdentifier}
                  onChangeText={setLoginIdentifier}
                  autoCapitalize="none"
                />

                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showLoginPassword}
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowLoginPassword(!showLoginPassword)}
                    style={styles.eyeButton}
                  >
                    <Text style={styles.eyeIcon}>{showLoginPassword ? '👁️' : '🔒'}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={authLoading}
                  style={styles.primaryButton}
                >
                  {authLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Sign In</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.switchAuthPrompt}>
                  <Text style={styles.promptText}>Don't have an account yet? </Text>
                  <TouchableOpacity onPress={() => setAuthMode('register')}>
                    <Text style={styles.promptLink}>Create an Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* REGISTRATION FORM */
              <View style={styles.formSection}>
                {/* 4 Unified Role Cards */}
                <Text style={styles.inputLabel}>Select Your Role on Business Hub</Text>
                <View style={styles.rolesGrid}>
                  {[
                    { key: 'student', label: 'Student', icon: '🎓', desc: 'Free courses & learning' },
                    { key: 'teacher', label: 'Teacher', icon: '👨‍🏫', desc: 'Teaching & masterclasses' },
                    { key: 'business', label: 'Business', icon: '🏢', desc: 'Enterprise & Startups' },
                    { key: 'normal', label: 'General User', icon: '👤', desc: 'Shopping & requests' },
                  ].map((r) => {
                    const isSel = regRole === r.key;
                    return (
                      <TouchableOpacity
                        key={r.key}
                        onPress={() => setRegRole(r.key as any)}
                        style={[styles.roleCard, isSel && styles.roleCardActive]}
                      >
                        <Text style={styles.roleIcon}>{r.icon}</Text>
                        <Text style={[styles.roleTitle, isSel && styles.roleTitleActive]}>{r.label}</Text>
                        <Text style={styles.roleDesc}>{r.desc}</Text>
                        {isSel && <Text style={styles.selectedPill}>✓ Selected</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Common Personal Info */}
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Ramesh Sharma"
                  placeholderTextColor="#94A3B8"
                  value={regFullName}
                  onChangeText={setRegFullName}
                />

                <Text style={styles.inputLabel}>Email Address *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ramesh@example.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={regEmail}
                  onChangeText={setRegEmail}
                />

                <Text style={styles.inputLabel}>Mobile Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  value={regMobile}
                  onChangeText={setRegMobile}
                />

                <Text style={styles.inputLabel}>Date of Birth (18+ Mandatory)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD (e.g. 2000-01-01)"
                  placeholderTextColor="#94A3B8"
                  value={regDob}
                  onChangeText={setRegDob}
                />

                {/* STUDENT-SPECIFIC ACADEMIC FIELDS */}
                {regRole === 'student' && (
                  <View style={styles.roleSpecificBox}>
                    <Text style={styles.roleBoxHeading}>🎓 Current Academic &amp; Study Details</Text>
                    <Text style={styles.roleBoxSub}>
                      Tell us what you are currently studying and your year of study.
                    </Text>

                    <Text style={styles.inputLabel}>What are you currently studying? *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. B.Tech Computer Science, B.Sc, BCA, MBA"
                      placeholderTextColor="#94A3B8"
                      value={studentCourse}
                      onChangeText={setStudentCourse}
                    />

                    {/* Quick Course Chips */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                      {POPULAR_STUDENT_COURSES.map((c) => (
                        <TouchableOpacity
                          key={c}
                          onPress={() => setStudentCourse(c)}
                          style={[styles.chip, studentCourse === c && styles.chipActive]}
                        >
                          <Text style={[styles.chipText, studentCourse === c && styles.chipTextActive]}>
                            {c}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <Text style={styles.inputLabel}>Current Year of Study *</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                      {STUDENT_YEARS.map((yr) => (
                        <TouchableOpacity
                          key={yr}
                          onPress={() => setStudentYear(yr)}
                          style={[styles.chip, studentYear === yr && styles.chipActive]}
                        >
                          <Text style={[styles.chipText, studentYear === yr && styles.chipTextActive]}>
                            {yr}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <Text style={styles.inputLabel}>College / University / Institute *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Delhi University / Anna University"
                      placeholderTextColor="#94A3B8"
                      value={studentInstitution}
                      onChangeText={setStudentInstitution}
                    />

                    <Text style={styles.inputLabel}>Specialization / Stream (Optional)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Artificial Intelligence, Mechanical"
                      placeholderTextColor="#94A3B8"
                      value={studentSpecialization}
                      onChangeText={setStudentSpecialization}
                    />
                  </View>
                )}

                {/* BUSINESS-SPECIFIC ENTERPRISE FIELDS */}
                {regRole === 'business' && (
                  <View style={styles.roleSpecificBox}>
                    <Text style={styles.roleBoxHeading}>🏢 Enterprise &amp; Business Profile</Text>
                    <Text style={styles.roleBoxSub}>
                      One unified registration for established enterprises and innovative startups.
                    </Text>

                    <Text style={styles.inputLabel}>Business / Startup Name *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Apex Engineering Solutions"
                      placeholderTextColor="#94A3B8"
                      value={bizName}
                      onChangeText={setBizName}
                    />

                    <Text style={styles.inputLabel}>Industry Category</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Software & Technology Services"
                      placeholderTextColor="#94A3B8"
                      value={bizCategory}
                      onChangeText={setBizCategory}
                    />

                    <Text style={styles.inputLabel}>Brief Business Description</Text>
                    <TextInput
                      style={[styles.input, { height: 70 }]}
                      placeholder="Describe products, services or startup capabilities"
                      placeholderTextColor="#94A3B8"
                      multiline
                      value={bizDescription}
                      onChangeText={setBizDescription}
                    />
                  </View>
                )}

                {/* Password Fields */}
                <Text style={styles.inputLabel}>Password *</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Min 8 characters"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showRegPassword}
                    value={regPassword}
                    onChangeText={setRegPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowRegPassword(!showRegPassword)}
                    style={styles.eyeButton}
                  >
                    <Text style={styles.eyeIcon}>{showRegPassword ? '👁️' : '🔒'}</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Confirm Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showRegPassword}
                  value={regConfirmPassword}
                  onChangeText={setRegConfirmPassword}
                />

                {/* Terms Acceptance */}
                <TouchableOpacity
                  onPress={() => setRegTerms(!regTerms)}
                  style={styles.checkboxRow}
                >
                  <View style={[styles.checkbox, regTerms && styles.checkboxChecked]}>
                    {regTerms && <Text style={styles.checkboxMark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    I accept the Terms of Service &amp; Privacy Policy and certify I am 18+ years of age.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleRegister}
                  disabled={authLoading}
                  style={styles.primaryButton}
                >
                  {authLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Create Account</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.switchAuthPrompt}>
                  <Text style={styles.promptText}>Already registered? </Text>
                  <TouchableOpacity onPress={() => setAuthMode('login')}>
                    <Text style={styles.promptLink}>Sign In to Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: Authenticated Main App
  // ---------------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.appHeader}>
        <View>
          <Text style={styles.appTitle}>
            Business <Text style={styles.brandTeal}>Hub</Text>
          </Text>
          <Text style={styles.appGreeting}>Hello, {currentUser.fullName}</Text>
        </View>

        <View style={styles.headerRight}>
          {/* Active Role Badge */}
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{ROLE_DISPLAY_NAMES[activeRole] || 'Member'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutSmallBtn}>
            <Text style={styles.logoutSmallText}>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Tab Content */}
      <View style={styles.tabContentArea}>
        {/* TAB 1: MARKETPLACE & QUOTATIONS */}
        {activeTab === 'marketplace' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Action Bar */}
            <View style={styles.marketActionBar}>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  onPress={() => setCatalogType('products')}
                  style={[styles.segmentBtn, catalogType === 'products' && styles.segmentBtnActive]}
                >
                  <Text style={[styles.segmentText, catalogType === 'products' && styles.segmentTextActive]}>
                    Products ({products.length})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setCatalogType('services')}
                  style={[styles.segmentBtn, catalogType === 'services' && styles.segmentBtnActive]}
                >
                  <Text style={[styles.segmentText, catalogType === 'services' && styles.segmentTextActive]}>
                    Services ({services.length})
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleOpenMyQuotations}
                style={styles.quotationsTrackerBtn}
              >
                <Text style={styles.quotationsTrackerText}>📋 My RFQ Requests</Text>
              </TouchableOpacity>
            </View>

            {/* Catalog Items Grid */}
            {catalogLoading ? (
              <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 40 }} />
            ) : catalogType === 'products' ? (
              products.length === 0 ? (
                <Text style={styles.emptyText}>No products currently published.</Text>
              ) : (
                products.map((p) => (
                  <View key={p._id} style={styles.catalogCard}>
                    <View style={styles.catalogCardHeader}>
                      <Text style={styles.catalogItemTitle}>{p.name}</Text>
                      <Text style={styles.catalogItemPrice}>
                        {p.price ? `$${p.price}` : 'RFQ Pricing'}
                      </Text>
                    </View>
                    <Text style={styles.catalogItemCategory}>Category: {p.category}</Text>
                    <Text style={styles.catalogItemDesc} numberOfLines={2}>
                      {p.description}
                    </Text>

                    <View style={styles.cardActionsRow}>
                      <TouchableOpacity
                        onPress={() => handleOpenRfqModal(p, 'product')}
                        style={styles.rfqButton}
                      >
                        <Text style={styles.rfqButtonText}>Request Quotation</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )
            ) : services.length === 0 ? (
              <Text style={styles.emptyText}>No services currently available.</Text>
            ) : (
              services.map((s) => (
                <View key={s._id} style={styles.catalogCard}>
                  <View style={styles.catalogCardHeader}>
                    <Text style={styles.catalogItemTitle}>{s.name}</Text>
                    <Text style={styles.catalogItemPrice}>
                      {s.pricingType === 'request_for_quotation' ? 'RFQ' : `$${s.price || '0'}`}
                    </Text>
                  </View>
                  <Text style={styles.catalogItemCategory}>Category: {s.category}</Text>
                  <Text style={styles.catalogItemDesc} numberOfLines={2}>
                    {s.description}
                  </Text>

                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      onPress={() => handleOpenRfqModal(s, 'service')}
                      style={styles.rfqButton}
                    >
                      <Text style={styles.rfqButtonText}>Request Service Quote</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* TAB 2: EDUCATION (100% Free Courses & Live Sessions) */}
        {activeTab === 'education' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Sub-Navigation Switcher */}
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                onPress={() => setEducationSubTab('courses')}
                style={[styles.segmentBtn, educationSubTab === 'courses' && styles.segmentBtnActive]}
              >
                <Text style={[styles.segmentText, educationSubTab === 'courses' && styles.segmentTextActive]}>
                  Free Courses ({courses.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setEducationSubTab('live')}
                style={[styles.segmentBtn, educationSubTab === 'live' && styles.segmentBtnActive]}
              >
                <Text style={[styles.segmentText, educationSubTab === 'live' && styles.segmentTextActive]}>
                  Live Classes ({liveClasses.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setEducationSubTab('materials')}
                style={[styles.segmentBtn, educationSubTab === 'materials' && styles.segmentBtnActive]}
              >
                <Text style={[styles.segmentText, educationSubTab === 'materials' && styles.segmentTextActive]}>
                  Study Notes ({materials.length})
                </Text>
              </TouchableOpacity>
            </View>

            {eduLoading ? (
              <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 40 }} />
            ) : educationSubTab === 'courses' ? (
              courses.map((c) => {
                const isEnrolled = myEnrollments.some((e) => e.courseId === c._id);
                return (
                  <View key={c._id} style={styles.eduCard}>
                    <View style={styles.eduBadgeRow}>
                      <Text style={styles.freeBadge}>100% Free</Text>
                      <Text style={styles.levelBadge}>{c.level?.toUpperCase() || 'BEGINNER'}</Text>
                    </View>
                    <Text style={styles.eduTitle}>{c.title}</Text>
                    <Text style={styles.eduSub}>{c.category} • {c.chapters?.length || 1} Chapters</Text>
                    <Text style={styles.eduDesc} numberOfLines={3}>{c.description}</Text>

                    <TouchableOpacity
                      onPress={() => handleEnrollCourse(c._id)}
                      style={[styles.primaryButton, isEnrolled && styles.enrolledButton]}
                    >
                      <Text style={styles.primaryButtonText}>
                        {isEnrolled ? '✓ Enrolled • Continue Learning' : 'Enroll 100% Free'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            ) : educationSubTab === 'live' ? (
              liveClasses.map((l) => (
                <View key={l._id} style={styles.eduCard}>
                  <View style={styles.eduBadgeRow}>
                    <Text style={styles.freeBadge}>Free Masterclass</Text>
                    <Text style={styles.liveStatusBadge}>{l.status?.toUpperCase() || 'SCHEDULED'}</Text>
                  </View>
                  <Text style={styles.eduTitle}>{l.title}</Text>
                  <Text style={styles.eduSub}>Host: {l.teacherName || 'Accredited Tutor'}</Text>
                  <Text style={styles.eduDesc}>
                    Scheduled: {l.startTime ? new Date(l.startTime).toLocaleString() : 'Upcoming'}
                  </Text>

                  <TouchableOpacity
                    onPress={() => handleRegisterLiveClass(l._id)}
                    style={styles.primaryButton}
                  >
                    <Text style={styles.primaryButtonText}>Register for Free Live Class</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              materials.map((m) => (
                <View key={m._id} style={styles.eduCard}>
                  <Text style={styles.eduTitle}>{m.title}</Text>
                  <Text style={styles.eduSub}>Format: {m.fileType?.toUpperCase() || 'PDF'} • {m.category}</Text>
                  <TouchableOpacity
                    onPress={() => Alert.alert('Study Material', `Material URL: ${m.fileUrl || 'Included in module'}`)}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>Access Document</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* TAB 3: CAREERS & JOBS */}
        {activeTab === 'jobs' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                onPress={() => setJobsSubTab('listings')}
                style={[styles.segmentBtn, jobsSubTab === 'listings' && styles.segmentBtnActive]}
              >
                <Text style={[styles.segmentText, jobsSubTab === 'listings' && styles.segmentTextActive]}>
                  Job Openings ({jobs.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setJobsSubTab('applications')}
                style={[styles.segmentBtn, jobsSubTab === 'applications' && styles.segmentBtnActive]}
              >
                <Text style={[styles.segmentText, jobsSubTab === 'applications' && styles.segmentTextActive]}>
                  My Applications ({myApplications.length})
                </Text>
              </TouchableOpacity>
            </View>

            {jobsLoading ? (
              <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 40 }} />
            ) : jobsSubTab === 'listings' ? (
              jobs.map((j) => (
                <View key={j._id} style={styles.jobCard}>
                  <Text style={styles.jobTitle}>{j.title}</Text>
                  <Text style={styles.jobEmployer}>
                    {j.businessName || 'Business Hub Partner'} • {j.location || 'Remote'}
                  </Text>
                  <Text style={styles.jobSalary}>
                    Compensation: ${j.salaryMin?.toLocaleString()} - ${j.salaryMax?.toLocaleString()}
                  </Text>
                  <Text style={styles.jobDesc} numberOfLines={3}>{j.description}</Text>

                  <TouchableOpacity
                    onPress={() => handleOpenApplyModal(j)}
                    style={styles.primaryButton}
                  >
                    <Text style={styles.primaryButtonText}>Apply for Position</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : myApplications.length === 0 ? (
              <Text style={styles.emptyText}>You haven't submitted any job applications yet.</Text>
            ) : (
              myApplications.map((app) => (
                <TouchableOpacity
                  key={app._id}
                  onPress={() => setSelectedAppDossier(app)}
                  style={styles.appCard}
                >
                  <View style={styles.appCardHeader}>
                    <Text style={styles.appIdText}>{app.applicationId || app._id}</Text>
                    <View
                      style={[
                        styles.appStatusPill,
                        app.status === 'Submitted' ? styles.statusSubmitted : styles.statusViewed,
                      ]}
                    >
                      <Text style={styles.appStatusText}>
                        {app.status === 'Submitted' ? 'SUBMITTED' : 'VIEWED'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.appJobTitle}>{app.jobTitle || 'Career Position'}</Text>
                  <Text style={styles.appSub}>
                    Submitted: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                  </Text>
                  <Text style={styles.inspectHint}>Tap to view submitted dossier →</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}

        {/* TAB 4: DASHBOARD (Unified Business / Student / Teacher / General) */}
        {activeTab === 'dashboard' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header Card */}
            <View style={styles.dashBanner}>
              <Text style={styles.dashRoleHeading}>
                {ROLE_DISPLAY_NAMES[activeRole]} Dashboard
              </Text>
              <Text style={styles.dashSub}>
                {activeRole === 'business'
                  ? 'Common Business Dashboard for verified enterprises, suppliers, and innovative startups.'
                  : activeRole === 'teacher'
                  ? 'Manage your free courses, live class schedules, and platform stipends.'
                  : activeRole === 'student'
                  ? `Academic Track: ${currentUser.studentDetails?.course || 'Student'} (${currentUser.studentDetails?.year || '1st Year'})`
                  : 'Track your marketplace shopping orders and requests.'}
              </Text>
            </View>

            {/* Business Specific Quick Actions */}
            {activeRole === 'business' && (
              <View style={styles.dashSection}>
                <Text style={styles.dashSectionTitle}>Enterprise Management</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => setAddProductModal(true)}
                    style={styles.actionTile}
                  >
                    <Text style={styles.actionTileIcon}>📦</Text>
                    <Text style={styles.actionTileLabel}>Publish Product</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Alert.alert('Services', 'Add Service feature ready.')}
                    style={styles.actionTile}
                  >
                    <Text style={styles.actionTileIcon}>🛠️</Text>
                    <Text style={styles.actionTileLabel}>Publish Service</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Teacher Specific Quick Actions */}
            {activeRole === 'teacher' && (
              <View style={styles.dashSection}>
                <Text style={styles.dashSectionTitle}>Teaching Tools</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => setAddCourseModal(true)}
                    style={styles.actionTile}
                  >
                    <Text style={styles.actionTileIcon}>📚</Text>
                    <Text style={styles.actionTileLabel}>Create Course</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Alert.alert('Live Class', 'Schedule Live Masterclass ready.')}
                    style={styles.actionTile}
                  >
                    <Text style={styles.actionTileIcon}>🎥</Text>
                    <Text style={styles.actionTileLabel}>Schedule Live Class</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Student Specific Track */}
            {activeRole === 'student' && currentUser.studentDetails && (
              <View style={styles.studentInfoCard}>
                <Text style={styles.studentCardTitle}>🎓 Enrolled Academic Program</Text>
                <Text style={styles.studentCardDetail}>Course: {currentUser.studentDetails.course}</Text>
                <Text style={styles.studentCardDetail}>Year: {currentUser.studentDetails.year}</Text>
                <Text style={styles.studentCardDetail}>Institution: {currentUser.studentDetails.institution}</Text>
                {currentUser.studentDetails.specialization && (
                  <Text style={styles.studentCardDetail}>Stream: {currentUser.studentDetails.specialization}</Text>
                )}
              </View>
            )}
          </ScrollView>
        )}

        {/* TAB 5: PROFILE */}
        {activeTab === 'profile' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.profileCard}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>{currentUser.fullName?.charAt(0) || 'U'}</Text>
              </View>
              <Text style={styles.profileName}>{currentUser.fullName}</Text>
              <Text style={styles.profileEmail}>{currentUser.email}</Text>
              <Text style={styles.profileMobile}>{currentUser.mobile}</Text>

              <View style={styles.profileRolesRow}>
                {(currentUser.roles || []).map((r: string) => (
                  <View key={r} style={styles.profileRoleTag}>
                    <Text style={styles.profileRoleTagText}>{ROLE_DISPLAY_NAMES[r] || r}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Sign Out of Business Hub</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        {[
          { key: 'marketplace', label: 'Store', icon: '🛍️' },
          { key: 'education', label: 'Learn', icon: '🎓' },
          { key: 'jobs', label: 'Careers', icon: '💼' },
          { key: 'dashboard', label: 'Portal', icon: '📊' },
          { key: 'profile', label: 'Me', icon: '👤' },
        ].map((tab) => {
          const isAct = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key as any)}
              style={styles.tabBarItem}
            >
              <Text style={styles.tabBarIcon}>{tab.icon}</Text>
              <Text style={[styles.tabBarLabel, isAct && styles.tabBarLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* --- MODALS --- */}

      {/* 1. Request for Quotation (RFQ) Modal */}
      {rfqModalListing && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <Text style={styles.modalHeading}>Request Quotation</Text>
              <Text style={styles.modalSub}>
                Item: {rfqModalListing.name} ({rfqModalListing.itemType?.toUpperCase()})
              </Text>

              <Text style={styles.inputLabel}>Required Quantity *</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={rfqQuantity}
                onChangeText={setRfqQuantity}
              />

              <Text style={styles.inputLabel}>Target Delivery Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={rfqDeliveryDate}
                onChangeText={setRfqDeliveryDate}
              />

              <Text style={styles.inputLabel}>Delivery Address</Text>
              <TextInput
                style={styles.input}
                placeholder="City, State, Pincode"
                value={rfqAddress}
                onChangeText={setRfqAddress}
              />

              <Text style={styles.inputLabel}>Custom Requirements / Specs</Text>
              <TextInput
                style={[styles.input, { height: 60 }]}
                placeholder="Add special requirements for vendors..."
                multiline
                value={rfqSpecs}
                onChangeText={setRfqSpecs}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => setRfqModalListing(null)}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmitRfq}
                  style={styles.primaryButton}
                >
                  <Text style={styles.primaryButtonText}>Submit to Admin</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* 2. My Quotations Tracker Modal */}
      {myQuotationsModal && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalBox, { maxHeight: '80%' }]}>
              <Text style={styles.modalHeading}>My Quotation Requests</Text>
              <ScrollView style={{ marginVertical: 10 }}>
                {myQuotationRequests.length === 0 ? (
                  <Text style={styles.emptyText}>No requests submitted yet.</Text>
                ) : (
                  myQuotationRequests.map((q) => (
                    <View key={q._id} style={styles.quotationItemCard}>
                      <Text style={styles.appIdText}>{q.requestId || q._id}</Text>
                      <Text style={styles.itemTitle}>{q.listingSnapshot?.name || 'Inquiry'}</Text>
                      <Text style={styles.appSub}>Status: {q.status?.toUpperCase()}</Text>
                      <Text style={styles.appSub}>
                        Quotes Received: {q.quotationsCount || 0}
                      </Text>
                    </View>
                  ))
                )}
              </ScrollView>
              <TouchableOpacity
                onPress={() => setMyQuotationsModal(false)}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* 3. Student Job Application Wizard Modal */}
      {applyModalJob && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <ScrollView contentContainerStyle={styles.modalBox}>
              <Text style={styles.modalHeading}>Job Application</Text>
              <Text style={styles.modalSub}>Position: {applyModalJob.title}</Text>
              <Text style={styles.stepBadge}>Step {applyStep} of 3</Text>

              {applyStep === 1 ? (
                <View style={styles.wizardSection}>
                  <Text style={styles.sectionMiniTitle}>Personal & Contact Details</Text>
                  <Text style={styles.inputLabel}>Full Name *</Text>
                  <TextInput style={styles.input} value={appFullName} onChangeText={setAppFullName} />

                  <Text style={styles.inputLabel}>Email Address *</Text>
                  <TextInput style={styles.input} value={appEmail} onChangeText={setAppEmail} />

                  <Text style={styles.inputLabel}>Mobile *</Text>
                  <TextInput style={styles.input} value={appMobile} onChangeText={setAppMobile} />

                  <Text style={styles.inputLabel}>City & State</Text>
                  <TextInput style={styles.input} placeholder="Mumbai, Maharashtra" value={appCity} onChangeText={setAppCity} />
                </View>
              ) : applyStep === 2 ? (
                <View style={styles.wizardSection}>
                  <Text style={styles.sectionMiniTitle}>Education & Professional Background</Text>
                  <Text style={styles.inputLabel}>Highest Qualification</Text>
                  <TextInput style={styles.input} value={appQualification} onChangeText={setAppQualification} />

                  <Text style={styles.inputLabel}>Course / Degree</Text>
                  <TextInput style={styles.input} value={appDegree} onChangeText={setAppDegree} />

                  <Text style={styles.inputLabel}>College / University</Text>
                  <TextInput style={styles.input} value={appCollege} onChangeText={setAppCollege} />

                  <Text style={styles.inputLabel}>Technical Skills (comma-separated) *</Text>
                  <TextInput style={styles.input} value={appTechSkills} onChangeText={setAppTechSkills} />
                </View>
              ) : (
                <View style={styles.wizardSection}>
                  <Text style={styles.sectionMiniTitle}>Resume & Additional Profiles</Text>
                  <Text style={styles.inputLabel}>Resume / CV Link * (.pdf, .doc, .docx)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="https://drive.google.com/your-resume.pdf"
                    value={appResumeUrl}
                    onChangeText={setAppResumeUrl}
                  />

                  <Text style={styles.inputLabel}>LinkedIn Profile</Text>
                  <TextInput style={styles.input} placeholder="https://linkedin.com/in/..." value={appLinkedin} onChangeText={setAppLinkedin} />

                  <Text style={styles.inputLabel}>Cover Letter</Text>
                  <TextInput
                    style={[styles.input, { height: 70 }]}
                    placeholder="Briefly state your motivation..."
                    multiline
                    value={appCoverLetter}
                    onChangeText={setAppCoverLetter}
                  />
                </View>
              )}

              <View style={styles.modalActions}>
                {applyStep > 1 ? (
                  <TouchableOpacity
                    onPress={() => setApplyStep(applyStep - 1)}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>Back</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setApplyModalJob(null)}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                  </TouchableOpacity>
                )}

                {applyStep < 3 ? (
                  <TouchableOpacity
                    onPress={() => setApplyStep(applyStep + 1)}
                    style={styles.primaryButton}
                  >
                    <Text style={styles.primaryButtonText}>Next →</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleSubmitJobApplication}
                    style={styles.primaryButton}
                  >
                    <Text style={styles.primaryButtonText}>Submit to Admin</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}

      {/* 4. Application Dossier Inspection Modal */}
      {selectedAppDossier && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <ScrollView contentContainerStyle={styles.modalBox}>
              <Text style={styles.modalHeading}>Application Record</Text>
              <Text style={styles.appIdText}>{selectedAppDossier.applicationId || selectedAppDossier._id}</Text>
              <Text style={styles.modalSub}>Position: {selectedAppDossier.jobTitle}</Text>

              <View style={styles.dossierRow}>
                <Text style={styles.dossierLabel}>Record Status:</Text>
                <Text style={styles.dossierValue}>{selectedAppDossier.status}</Text>
              </View>
              <View style={styles.dossierRow}>
                <Text style={styles.dossierLabel}>Applicant:</Text>
                <Text style={styles.dossierValue}>
                  {selectedAppDossier.personalInfo?.fullName || selectedAppDossier.studentName}
                </Text>
              </View>
              <View style={styles.dossierRow}>
                <Text style={styles.dossierLabel}>Email:</Text>
                <Text style={styles.dossierValue}>
                  {selectedAppDossier.personalInfo?.email || selectedAppDossier.studentEmail}
                </Text>
              </View>
              <View style={styles.dossierRow}>
                <Text style={styles.dossierLabel}>Degree:</Text>
                <Text style={styles.dossierValue}>
                  {selectedAppDossier.educationalDetails?.courseDegree || 'N/A'}
                </Text>
              </View>
              <View style={styles.dossierRow}>
                <Text style={styles.dossierLabel}>Resume:</Text>
                <Text style={[styles.dossierValue, { color: '#0D9488' }]}>
                  {selectedAppDossier.documents?.resumeUrl || 'Uploaded'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedAppDossier(null)}
                style={[styles.primaryButton, { marginTop: 16 }]}
              >
                <Text style={styles.primaryButtonText}>Close Dossier</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      )}

      {/* 5. Business Add Product Modal */}
      {addProductModal && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <Text style={styles.modalHeading}>Publish Enterprise Product</Text>
              <Text style={styles.inputLabel}>Product Name *</Text>
              <TextInput style={styles.input} value={newProdName} onChangeText={setNewProdName} />

              <Text style={styles.inputLabel}>Price ($) *</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={newProdPrice} onChangeText={setNewProdPrice} />

              <Text style={styles.inputLabel}>Minimum Order Quantity</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={newProdMoq} onChangeText={setNewProdMoq} />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput style={[styles.input, { height: 60 }]} multiline value={newProdDescription} onChangeText={setNewProdDescription} />

              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setAddProductModal(false)} style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreateBusinessProduct} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Publish</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* 6. Teacher Add Course Modal */}
      {addCourseModal && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <Text style={styles.modalHeading}>Create 100% Free Course</Text>
              <Text style={styles.inputLabel}>Course Title *</Text>
              <TextInput style={styles.input} value={newCourseTitle} onChangeText={setNewCourseTitle} />

              <Text style={styles.inputLabel}>Category</Text>
              <TextInput style={styles.input} value={newCourseCat} onChangeText={setNewCourseCat} />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput style={[styles.input, { height: 60 }]} multiline value={newCourseDesc} onChangeText={setNewCourseDesc} />

              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setAddCourseModal(false)} style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreateTeacherCourse} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Submit Course</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  authContainer: {
    padding: 20,
    alignItems: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  brandIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandIconText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 22,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },
  brandTeal: {
    color: '#0D9488',
  },
  brandTagline: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  authCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  authTabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  authTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  authTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  authTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  authTabTextActive: {
    color: '#0D9488',
  },
  formSection: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#FAFAFA',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eyeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
  },
  eyeIcon: {
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#0D9488',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  secondaryButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 13,
  },
  switchAuthPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  promptText: {
    fontSize: 12,
    color: '#64748B',
  },
  promptLink: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0D9488',
  },
  rolesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleCard: {
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#FFFFFF',
    gap: 4,
  },
  roleCardActive: {
    borderColor: '#0D9488',
    backgroundColor: '#F0FDFA',
  },
  roleIcon: {
    fontSize: 20,
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  roleTitleActive: {
    color: '#0D9488',
  },
  roleDesc: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 14,
  },
  selectedPill: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
    marginTop: 2,
  },
  roleSpecificBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    gap: 8,
    marginTop: 6,
  },
  roleBoxHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  roleBoxSub: {
    fontSize: 11,
    color: '#64748B',
  },
  chipRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  checkboxMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },

  // App Layout
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  appGreeting: {
    fontSize: 11,
    color: '#64748B',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
    textTransform: 'uppercase',
  },
  logoutSmallBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  logoutSmallText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  tabContentArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#0D9488',
  },
  marketActionBar: {
    gap: 8,
  },
  quotationsTrackerBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  quotationsTrackerText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },

  // Cards
  catalogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  catalogCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  catalogItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  catalogItemPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0D9488',
    marginLeft: 8,
  },
  catalogItemCategory: {
    fontSize: 11,
    color: '#64748B',
  },
  catalogItemDesc: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  rfqButton: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  rfqButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
  },

  // Education
  eduCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  eduBadgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  freeBadge: {
    backgroundColor: '#CCFBF1',
    color: '#0F766E',
    fontWeight: '800',
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  levelBadge: {
    backgroundColor: '#F1F5F9',
    color: '#475569',
    fontWeight: '700',
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveStatusBadge: {
    backgroundColor: '#FEF3C7',
    color: '#B45309',
    fontWeight: '800',
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  eduTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  eduSub: {
    fontSize: 11,
    color: '#64748B',
  },
  eduDesc: {
    fontSize: 12,
    color: '#334155',
  },
  enrolledButton: {
    backgroundColor: '#0F766E',
  },

  // Jobs
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  jobEmployer: {
    fontSize: 11,
    color: '#64748B',
  },
  jobSalary: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  jobDesc: {
    fontSize: 12,
    color: '#334155',
  },
  appCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  appCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appIdText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D9488',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  appStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusSubmitted: {
    backgroundColor: '#FEF3C7',
  },
  statusViewed: {
    backgroundColor: '#E0F2FE',
  },
  appStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E293B',
  },
  appJobTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  appSub: {
    fontSize: 11,
    color: '#64748B',
  },
  inspectHint: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '600',
    marginTop: 4,
  },

  // Dashboard
  dashBanner: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    gap: 6,
  },
  dashRoleHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  dashSub: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  dashSection: {
    gap: 10,
  },
  dashSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  actionTileIcon: {
    fontSize: 24,
  },
  actionTileLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  studentInfoCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  studentCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F766E',
  },
  studentCardDetail: {
    fontSize: 12,
    color: '#334155',
  },

  // Profile
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  profileAvatarText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileEmail: {
    fontSize: 12,
    color: '#64748B',
  },
  profileMobile: {
    fontSize: 12,
    color: '#64748B',
  },
  profileRolesRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  profileRoleTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  profileRoleTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 13,
  },

  // Bottom Tab Bar
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 6,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  tabBarIcon: {
    fontSize: 18,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabBarLabelActive: {
    color: '#0D9488',
    fontWeight: '800',
  },

  // Modals
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 16,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    gap: 10,
    maxHeight: '90%',
  },
  modalHeading: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  quotationItemCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  wizardSection: {
    gap: 8,
  },
  sectionMiniTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0D9488',
    textTransform: 'uppercase',
  },
  stepBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  dossierRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 2,
  },
  dossierLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    width: 100,
  },
  dossierValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 30,
  },
});
