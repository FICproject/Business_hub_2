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
  Platform,
} from 'react-native';
import { adminApi } from './src/services/api';

export default function App() {
  // --- Admin Session State ---
  const [adminUser, setAdminUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@businesshub.com');
  const [adminPassword, setAdminPassword] = useState('admin12345');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'quotations' | 'education'>('overview');

  // --- KPI Metrics ---
  const [metrics, setMetrics] = useState<any>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);

  // --- Users Directory ---
  const [users, setUsers] = useState<any[]>([]);
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'student' | 'teacher' | 'businessman' | 'entrepreneur' | 'normal'>('all');
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  // --- Job Applications ---
  const [jobApplications, setJobApplications] = useState<any[]>([]);
  const [jobsList, setJobsList] = useState<any[]>([]);
  const [jobsSubTab, setJobsSubTab] = useState<'applications' | 'postings'>('applications');
  const [appsLoading, setAppsLoading] = useState(false);
  const [selectedAppDossier, setSelectedAppDossier] = useState<any>(null);

  // --- Quotations Coordination ---
  const [quotationRequests, setQuotationRequests] = useState<any[]>([]);
  const [quotationsLoading, setQuotationsLoading] = useState(false);
  const [selectedQuotationReq, setSelectedQuotationReq] = useState<any>(null);

  // --- Education & Teacher Payments ---
  const [courses, setCourses] = useState<any[]>([]);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [teacherPayments, setTeacherPayments] = useState<any[]>([]);
  const [eduSubTab, setEduSubTab] = useState<'courses' | 'payments' | 'live'>('courses');
  const [eduLoading, setEduLoading] = useState(false);
  const [stipendClass, setStipendClass] = useState<any>(null);
  const [customStipendAmount, setCustomStipendAmount] = useState('150');

  // ---------------------------------------------------------------------------
  // Load Admin Data on Authentication
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (adminUser) {
      loadMetrics();
      loadUsers();
      loadJobApplications();
      loadQuotationRequests();
      loadEducationAndPayments();
    }
  }, [adminUser]);

  const loadMetrics = async () => {
    setMetricsLoading(true);
    try {
      const res = await adminApi.getMetrics();
      if (res.success) {
        setMetrics(res.metrics || {});
      }
    } catch (e: any) {
      console.warn('Failed to load metrics:', e.message);
    } finally {
      setMetricsLoading(false);
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await adminApi.getUsers({
        role: userRoleFilter === 'all' ? undefined : userRoleFilter,
        search: userSearch || undefined,
        limit: 50,
      });
      if (res.success) {
        // Platform user listing strictly excludes internal admin staff accounts
        const raw = res.data || [];
        const platformUsers = raw.filter((u: any) => !(u.roles || []).includes('admin'));
        setUsers(platformUsers);
      }
    } catch (e: any) {
      console.warn('Failed to load users:', e.message);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadUsers();
    }
  }, [userRoleFilter]);

  const loadJobApplications = async () => {
    setAppsLoading(true);
    try {
      const [appRes, jobsRes] = await Promise.allSettled([
        adminApi.getJobApplications(),
        adminApi.getJobs(),
      ]);
      if (appRes.status === 'fulfilled' && appRes.value?.data) {
        setJobApplications(appRes.value.data || []);
      }
      if (jobsRes.status === 'fulfilled' && jobsRes.value?.data) {
        setJobsList(jobsRes.value.data || []);
      }
    } catch (e: any) {
      console.warn('Failed to load job applications:', e.message);
    } finally {
      setAppsLoading(false);
    }
  };

  const loadQuotationRequests = async () => {
    setQuotationsLoading(true);
    try {
      const res = await adminApi.getQuotationRequests();
      if (res.success) {
        setQuotationRequests(res.data || []);
      }
    } catch (e: any) {
      console.warn('Failed to load quotation requests:', e.message);
    } finally {
      setQuotationsLoading(false);
    }
  };

  const loadEducationAndPayments = async () => {
    setEduLoading(true);
    try {
      const [cRes, lRes, pRes] = await Promise.allSettled([
        adminApi.getCourses(),
        adminApi.getLiveClasses(),
        adminApi.getTeacherPayments(),
      ]);
      if (cRes.status === 'fulfilled' && cRes.value?.data) {
        setCourses(cRes.value.data || []);
      }
      if (lRes.status === 'fulfilled' && lRes.value?.data) {
        setLiveClasses(lRes.value.data || []);
      }
      if (pRes.status === 'fulfilled' && pRes.value?.data) {
        setTeacherPayments(pRes.value.data || []);
      }
    } catch (e: any) {
      console.warn('Failed to load education moderation:', e.message);
    } finally {
      setEduLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Admin Login
  // ---------------------------------------------------------------------------
  const handleAdminLogin = async () => {
    if (!adminEmail || !adminPassword) {
      Alert.alert('Required', 'Please enter admin email and password.');
      return;
    }
    setAuthLoading(true);
    try {
      const res = await adminApi.login({ email: adminEmail, password: adminPassword });
      if (res.success && res.token) {
        if (!res.user.roles?.includes('admin')) {
          Alert.alert('Access Denied', 'Administrator privileges required.');
          return;
        }
        adminApi.setToken(res.token);
        setAdminUser(res.user);
        Alert.alert('Signed In', 'Welcome to Central Admin Control Center.');
      }
    } catch (err: any) {
      Alert.alert('Admin Authentication Failed', err.message || 'Invalid credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminLogout = () => {
    adminApi.setToken(null);
    setAdminUser(null);
    setActiveTab('overview');
  };

  // ---------------------------------------------------------------------------
  // User Management Actions
  // ---------------------------------------------------------------------------
  const handleToggleUserStatus = async (user: any) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await adminApi.updateUserStatus(user._id, nextStatus, 'Administrative policy compliance');
      Alert.alert('Status Updated', `User account set to ${nextStatus.toUpperCase()}.`);
      loadUsers();
    } catch (err: any) {
      Alert.alert('Action Failed', err.message || 'Could not update user status.');
    }
  };

  // ---------------------------------------------------------------------------
  // Inspect Student Job Application Dossier (Auto-updates status to 'Viewed')
  // ---------------------------------------------------------------------------
  const handleOpenDossier = async (app: any) => {
    setSelectedAppDossier(app);
    try {
      const res = await adminApi.getJobApplicationById(app._id);
      if (res.success && res.data) {
        setSelectedAppDossier(res.data);
        // Reflect status in parent list
        setJobApplications((prev) =>
          prev.map((item) => (item._id === app._id ? { ...item, status: 'Viewed' } : item))
        );
      }
    } catch (e: any) {
      console.warn('Auto-mark viewed notice:', e.message);
    }
  };

  // ---------------------------------------------------------------------------
  // Course Review (Approve/Reject)
  // ---------------------------------------------------------------------------
  const handleReviewCourse = async (courseId: string, status: 'published' | 'rejected') => {
    try {
      await adminApi.reviewCourse(courseId, {
        status,
        note: `Course marked as ${status} by Mobile Administrator`,
      });
      Alert.alert('Course Updated', `Course successfully ${status}.`);
      loadEducationAndPayments();
    } catch (err: any) {
      Alert.alert('Review Failed', err.message || 'Could not review course.');
    }
  };

  // ---------------------------------------------------------------------------
  // Teacher Payment Approval
  // ---------------------------------------------------------------------------
  const handleApproveTeacherPayment = async () => {
    if (!stipendClass) return;
    const amount = parseFloat(customStipendAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid compensation stipend amount.');
      return;
    }
    try {
      await adminApi.approveTeacherPayment({
        liveClassId: stipendClass._id,
        teacherId: stipendClass.teacherId,
        amount,
        notes: 'Admin evaluated live class session delivery',
      });
      Alert.alert('Stipend Approved', `Teacher stipend of $${amount} approved.`);
      setStipendClass(null);
      loadEducationAndPayments();
    } catch (err: any) {
      Alert.alert('Approval Failed', err.message || 'Could not approve stipend.');
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER: Admin Sign In Screen
  // ---------------------------------------------------------------------------
  if (!adminUser) {
    return (
      <SafeAreaView style={styles.darkContainer}>
        <ScrollView contentContainerStyle={styles.authContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.brandHeader}>
            <View style={styles.adminIconBox}>
              <Text style={styles.adminIconText}>BH</Text>
            </View>
            <Text style={styles.adminTitle}>Central Admin Portal</Text>
            <Text style={styles.adminSub}>Restricted Mobile Administrative Center</Text>
          </View>

          <View style={styles.adminLoginCard}>
            <Text style={styles.cardHeading}>Sign in as Administrator</Text>

            <Text style={styles.inputLabelDark}>Admin Email</Text>
            <TextInput
              style={styles.inputDark}
              placeholder="admin@businesshub.com"
              placeholderTextColor="#64748B"
              keyboardType="email-address"
              autoCapitalize="none"
              value={adminEmail}
              onChangeText={setAdminEmail}
            />

            <Text style={styles.inputLabelDark}>Password</Text>
            <View style={styles.passwordRowDark}>
              <TextInput
                style={[styles.inputDark, { flex: 1 }]}
                placeholder="••••••••"
                placeholderTextColor="#64748B"
                secureTextEntry={!showAdminPassword}
                value={adminPassword}
                onChangeText={setAdminPassword}
              />
              <TouchableOpacity
                onPress={() => setShowAdminPassword(!showAdminPassword)}
                style={styles.eyeBtnDark}
              >
                <Text style={styles.eyeIcon}>{showAdminPassword ? '👁️' : '🔒'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleAdminLogin}
              disabled={authLoading}
              style={styles.adminPrimaryButton}
            >
              {authLoading ? (
                <ActivityIndicator color="#0F172A" />
              ) : (
                <Text style={styles.adminPrimaryButtonText}>Authorize Sign In</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.securityNote}>
              🔒 Secure multi-tier session encryption enabled. Access logged for platform audit.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: Authenticated Admin Portal
  // ---------------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.darkContainer}>
      {/* Top Header */}
      <View style={styles.adminHeader}>
        <View>
          <Text style={styles.adminBrandText}>
            Business Hub <Text style={styles.brandTeal}>Admin</Text>
          </Text>
          <Text style={styles.adminHostText}>Staff: {adminUser.fullName || 'Administrator'}</Text>
        </View>

        <TouchableOpacity onPress={handleAdminLogout} style={styles.adminExitBtn}>
          <Text style={styles.adminExitText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Main Tab Content */}
      <View style={styles.mainContent}>
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeaderTitle}>Platform Analytics & KPIs</Text>
              <TouchableOpacity onPress={loadMetrics} style={styles.refreshBtn}>
                <Text style={styles.refreshBtnText}>↻ Refresh</Text>
              </TouchableOpacity>
            </View>

            {metricsLoading ? (
              <ActivityIndicator size="large" color="#14B8A6" style={{ marginTop: 40 }} />
            ) : metrics ? (
              <View style={styles.kpiGrid}>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Total Platform Users</Text>
                  <Text style={styles.kpiValue}>{metrics.totalUsers || 0}</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Students Enrolled</Text>
                  <Text style={[styles.kpiValue, { color: '#60A5FA' }]}>{metrics.totalStudents || 0}</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Teachers & Tutors</Text>
                  <Text style={[styles.kpiValue, { color: '#C084FC' }]}>{metrics.totalTeachers || 0}</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Verified Businesses</Text>
                  <Text style={[styles.kpiValue, { color: '#34D399' }]}>{metrics.totalBusinesses || 0}</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>General Users</Text>
                  <Text style={[styles.kpiValue, { color: '#F472B6' }]}>
                    {metrics.totalUsers - ((metrics.totalStudents || 0) + (metrics.totalTeachers || 0) + (metrics.totalBusinesses || 0)) || 0}
                  </Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Active Listings</Text>
                  <Text style={[styles.kpiValue, { color: '#FBBF24' }]}>
                    {(metrics.activeProducts || 0) + (metrics.activeServices || 0)}
                  </Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Quotation Inquiries</Text>
                  <Text style={styles.kpiValue}>{metrics.totalRequests || 0}</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Active Job Postings</Text>
                  <Text style={styles.kpiValue}>{metrics.totalJobs || 0}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.emptyTextDark}>No platform metrics available.</Text>
            )}
          </ScrollView>
        )}

        {/* TAB 2: USER DIRECTORY & MANAGEMENT */}
        {activeTab === 'users' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Role Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRowDark}>
              {[
                { key: 'all', label: 'All Users' },
                { key: 'student', label: 'Students' },
                { key: 'teacher', label: 'Teachers' },
                { key: 'businessman', label: 'Businessmen' },
                { key: 'entrepreneur', label: 'Entrepreneurs' },
                { key: 'normal', label: 'General Users' },
              ].map((rf) => (
                <TouchableOpacity
                  key={rf.key}
                  onPress={() => setUserRoleFilter(rf.key as any)}
                  style={[styles.filterChipDark, userRoleFilter === rf.key && styles.filterChipDarkActive]}
                >
                  <Text
                    style={[styles.filterChipTextDark, userRoleFilter === rf.key && styles.filterChipTextDarkActive]}
                  >
                    {rf.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.listCountHeader}>
              Showing {users.length} Platform Participants (Admins Excluded)
            </Text>

            {usersLoading ? (
              <ActivityIndicator size="large" color="#14B8A6" style={{ marginTop: 40 }} />
            ) : users.length === 0 ? (
              <Text style={styles.emptyTextDark}>No users found in this category.</Text>
            ) : (
              users.map((u) => {
                const isStudent = (u.roles || []).includes('student');
                return (
                  <View key={u._id} style={styles.userCardDark}>
                    <View style={styles.userCardTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.userNameDark}>{u.fullName}</Text>
                        <Text style={styles.userContactDark}>{u.email} • {u.mobile}</Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadgeDark,
                          u.status === 'active' ? styles.statusActiveDark : styles.statusSuspendedDark,
                        ]}
                      >
                        <Text style={styles.statusBadgeTextDark}>{u.status?.toUpperCase()}</Text>
                      </View>
                    </View>

                    {/* Student Course & Year Details */}
                    {isStudent && (u.studentDetails || u.education) && (
                      <View style={styles.studentDetailBadgeDark}>
                        <Text style={styles.studentDetailTextDark}>
                          🎓 {u.studentDetails?.course || u.education}
                          {u.studentDetails?.year ? ` (${u.studentDetails.year})` : ''}
                        </Text>
                        {u.studentDetails?.institution && (
                          <Text style={styles.studentInstTextDark}>
                            🏛️ {u.studentDetails.institution}
                          </Text>
                        )}
                      </View>
                    )}

                    <View style={styles.userActionsRowDark}>
                      <TouchableOpacity
                        onPress={() => handleToggleUserStatus(u)}
                        style={[
                          styles.actionBtnSmallDark,
                          u.status === 'active' ? styles.btnSuspendDark : styles.btnActivateDark,
                        ]}
                      >
                        <Text style={styles.actionBtnSmallTextDark}>
                          {u.status === 'active' ? 'Suspend Access' : 'Activate User'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        )}

        {/* TAB 3: STUDENT JOB APPLICATIONS */}
        {activeTab === 'jobs' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Sub-tab switcher */}
            <View style={styles.segmentDark}>
              <TouchableOpacity
                onPress={() => setJobsSubTab('applications')}
                style={[styles.segmentBtnDark, jobsSubTab === 'applications' && styles.segmentBtnDarkActive]}
              >
                <Text
                  style={[
                    styles.segmentTextDark,
                    jobsSubTab === 'applications' && styles.segmentTextDarkActive,
                  ]}
                >
                  Student Applications ({jobApplications.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setJobsSubTab('postings')}
                style={[styles.segmentBtnDark, jobsSubTab === 'postings' && styles.segmentBtnDarkActive]}
              >
                <Text
                  style={[
                    styles.segmentTextDark,
                    jobsSubTab === 'postings' && styles.segmentTextDarkActive,
                  ]}
                >
                  Job Postings ({jobsList.length})
                </Text>
              </TouchableOpacity>
            </View>

            {appsLoading ? (
              <ActivityIndicator size="large" color="#14B8A6" style={{ marginTop: 40 }} />
            ) : jobsSubTab === 'applications' ? (
              jobApplications.length === 0 ? (
                <Text style={styles.emptyTextDark}>No student job applications submitted yet.</Text>
              ) : (
                jobApplications.map((app) => {
                  const isUnread = app.status === 'Submitted';
                  return (
                    <View key={app._id} style={styles.appCardDark}>
                      <View style={styles.appCardHeaderDark}>
                        <Text style={styles.appIdDark}>{app.applicationId || app._id}</Text>
                        <View
                          style={[
                            styles.appStatusPillDark,
                            isUnread ? styles.statusSubmittedDark : styles.statusViewedDark,
                          ]}
                        >
                          <Text style={styles.appStatusTextDark}>
                            {isUnread ? 'SUBMITTED' : 'VIEWED'}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.appStudentNameDark}>
                        {app.personalInfo?.fullName || app.studentName || 'Student Applicant'}
                      </Text>
                      <Text style={styles.appJobTitleDark}>Position: {app.jobTitle || 'Career Opportunity'}</Text>
                      <Text style={styles.appSubDark}>
                        Degree: {app.educationalDetails?.courseDegree || 'N/A'} • {app.educationalDetails?.highestQualification || ''}
                      </Text>

                      <TouchableOpacity
                        onPress={() => handleOpenDossier(app)}
                        style={styles.inspectDossierBtnDark}
                      >
                        <Text style={styles.inspectDossierTextDark}>Inspect Dossier (Auto-Marks Viewed) →</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              )
            ) : (
              jobsList.map((j) => (
                <View key={j._id} style={styles.appCardDark}>
                  <Text style={styles.appStudentNameDark}>{j.title}</Text>
                  <Text style={styles.appSubDark}>
                    Company: {j.businessName || 'Business Partner'} • Location: {j.location || 'Remote'}
                  </Text>
                  <Text style={styles.appJobTitleDark}>
                    Applications Received: {j.applicantsCount || 0}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* TAB 4: CENTRALIZED QUOTATIONS MANAGEMENT */}
        {activeTab === 'quotations' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionHeaderTitle}>Central Quotations Coordination</Text>
            <Text style={styles.adminSub}>
              Review buyer RFQs, invite matching enterprises, and confirm business connections.
            </Text>

            {quotationsLoading ? (
              <ActivityIndicator size="large" color="#14B8A6" style={{ marginTop: 40 }} />
            ) : quotationRequests.length === 0 ? (
              <Text style={styles.emptyTextDark}>No quotation inquiries received yet.</Text>
            ) : (
              quotationRequests.map((q) => (
                <View key={q._id} style={styles.appCardDark}>
                  <View style={styles.appCardHeaderDark}>
                    <Text style={styles.appIdDark}>{q.requestId || q._id}</Text>
                    <Text style={styles.quotationStatusDark}>{q.status?.toUpperCase()}</Text>
                  </View>

                  <Text style={styles.appStudentNameDark}>
                    Requested: {q.listingSnapshot?.name || 'Catalog Item'}
                  </Text>
                  <Text style={styles.appSubDark}>
                    Quantity: {q.requiredQuantity || 1} • Target: {q.targetDeliveryDate || 'Flexible'}
                  </Text>
                  <Text style={styles.appSubDark}>
                    Quotes Received: {q.quotationsCount || 0}
                  </Text>

                  {q.status === 'new' && (
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert(
                          'Invite Companies',
                          'Admin matching workflow invites verified businesses in this category.'
                        )
                      }
                      style={styles.adminPrimaryButtonSmall}
                    >
                      <Text style={styles.adminPrimaryButtonTextSmall}>Coordinate Quotes</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* TAB 5: EDUCATION & TEACHER PAYMENTS */}
        {activeTab === 'education' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.segmentDark}>
              <TouchableOpacity
                onPress={() => setEduSubTab('courses')}
                style={[styles.segmentBtnDark, eduSubTab === 'courses' && styles.segmentBtnDarkActive]}
              >
                <Text style={[styles.segmentTextDark, eduSubTab === 'courses' && styles.segmentTextDarkActive]}>
                  Courses ({courses.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setEduSubTab('payments')}
                style={[styles.segmentBtnDark, eduSubTab === 'payments' && styles.segmentBtnDarkActive]}
              >
                <Text style={[styles.segmentTextDark, eduSubTab === 'payments' && styles.segmentTextDarkActive]}>
                  Teacher Stipends ({teacherPayments.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setEduSubTab('live')}
                style={[styles.segmentBtnDark, eduSubTab === 'live' && styles.segmentBtnDarkActive]}
              >
                <Text style={[styles.segmentTextDark, eduSubTab === 'live' && styles.segmentTextDarkActive]}>
                  Live Classes ({liveClasses.length})
                </Text>
              </TouchableOpacity>
            </View>

            {eduLoading ? (
              <ActivityIndicator size="large" color="#14B8A6" style={{ marginTop: 40 }} />
            ) : eduSubTab === 'courses' ? (
              courses.map((c) => (
                <View key={c._id} style={styles.appCardDark}>
                  <Text style={styles.appStudentNameDark}>{c.title}</Text>
                  <Text style={styles.appSubDark}>
                    Status: {c.status?.toUpperCase()} • Category: {c.category}
                  </Text>
                  {c.status !== 'published' && (
                    <View style={styles.userActionsRowDark}>
                      <TouchableOpacity
                        onPress={() => handleReviewCourse(c._id, 'published')}
                        style={styles.btnActivateDark}
                      >
                        <Text style={styles.actionBtnSmallTextDark}>Publish Course Free</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            ) : eduSubTab === 'payments' ? (
              teacherPayments.length === 0 ? (
                <Text style={styles.emptyTextDark}>No teacher stipends recorded yet.</Text>
              ) : (
                teacherPayments.map((p) => (
                  <View key={p._id} style={styles.appCardDark}>
                    <Text style={styles.appStudentNameDark}>
                      Stipend: ${p.amount} • {p.teacherName || 'Accredited Tutor'}
                    </Text>
                    <Text style={styles.appSubDark}>Status: {p.status?.toUpperCase()}</Text>
                    {p.status === 'pending' && (
                      <TouchableOpacity
                        onPress={() =>
                          adminApi
                            .markTeacherPaymentPaid(p._id, 'TXN-MOBILE-' + Date.now().toString().slice(-6))
                            .then(() => {
                              Alert.alert('Payment Disbursed', 'Marked as PAID with transaction ref.');
                              loadEducationAndPayments();
                            })
                        }
                        style={styles.adminPrimaryButtonSmall}
                      >
                        <Text style={styles.adminPrimaryButtonTextSmall}>Disburse Payout</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )
            ) : (
              liveClasses.map((l) => (
                <View key={l._id} style={styles.appCardDark}>
                  <Text style={styles.appStudentNameDark}>{l.title}</Text>
                  <Text style={styles.appSubDark}>
                    Tutor: {l.teacherName} • Status: {l.status?.toUpperCase()}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setStipendClass(l)}
                    style={styles.adminPrimaryButtonSmall}
                  >
                    <Text style={styles.adminPrimaryButtonTextSmall}>Evaluate Class Stipend</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>

      {/* Admin Bottom Navigation */}
      <View style={styles.adminBottomNav}>
        {[
          { key: 'overview', label: 'KPIs', icon: '📊' },
          { key: 'users', label: 'Users', icon: '👥' },
          { key: 'jobs', label: 'Jobs', icon: '💼' },
          { key: 'quotations', label: 'Quotes', icon: '📋' },
          { key: 'education', label: 'Teaching', icon: '🎓' },
        ].map((tab) => {
          const isAct = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key as any)}
              style={styles.adminNavItem}
            >
              <Text style={styles.adminNavIcon}>{tab.icon}</Text>
              <Text style={[styles.adminNavLabel, isAct && styles.adminNavLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* --- MODALS --- */}

      {/* 1. Student Application Dossier Modal */}
      {selectedAppDossier && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <ScrollView contentContainerStyle={styles.modalBoxDark}>
              <Text style={styles.modalHeadingDark}>Student Application Dossier</Text>
              <Text style={styles.appIdDark}>{selectedAppDossier.applicationId || selectedAppDossier._id}</Text>
              <Text style={styles.modalSubDark}>Position: {selectedAppDossier.jobTitle}</Text>

              <View style={styles.dossierRowDark}>
                <Text style={styles.dossierLabelDark}>Record Status:</Text>
                <Text style={[styles.dossierValueDark, { color: '#34D399', fontWeight: '800' }]}>
                  {selectedAppDossier.status || 'Viewed'}
                </Text>
              </View>

              <View style={styles.dossierRowDark}>
                <Text style={styles.dossierLabelDark}>Student Name:</Text>
                <Text style={styles.dossierValueDark}>
                  {selectedAppDossier.personalInfo?.fullName || selectedAppDossier.studentName}
                </Text>
              </View>

              <View style={styles.dossierRowDark}>
                <Text style={styles.dossierLabelDark}>Email & Mobile:</Text>
                <Text style={styles.dossierValueDark}>
                  {selectedAppDossier.personalInfo?.email || selectedAppDossier.studentEmail} •{' '}
                  {selectedAppDossier.personalInfo?.mobile || selectedAppDossier.studentMobile}
                </Text>
              </View>

              <View style={styles.dossierRowDark}>
                <Text style={styles.dossierLabelDark}>Qualification:</Text>
                <Text style={styles.dossierValueDark}>
                  {selectedAppDossier.educationalDetails?.courseDegree || 'N/A'} (
                  {selectedAppDossier.educationalDetails?.highestQualification || ''})
                </Text>
              </View>

              <View style={styles.dossierRowDark}>
                <Text style={styles.dossierLabelDark}>College/Univ:</Text>
                <Text style={styles.dossierValueDark}>
                  {selectedAppDossier.educationalDetails?.collegeUniversity || 'N/A'}
                </Text>
              </View>

              <View style={styles.dossierRowDark}>
                <Text style={styles.dossierLabelDark}>Resume URL:</Text>
                <Text style={[styles.dossierValueDark, { color: '#14B8A6' }]}>
                  {selectedAppDossier.documents?.resumeUrl || 'None provided'}
                </Text>
              </View>

              <View style={styles.dossierRowDark}>
                <Text style={styles.dossierLabelDark}>Skills:</Text>
                <Text style={styles.dossierValueDark}>
                  {selectedAppDossier.professionalDetails?.technicalSkills?.join(', ') || 'N/A'}
                </Text>
              </View>

              <Text style={styles.policyNoticeDark}>
                ℹ️ Admin collects, views, and maintains student application records. Recruitment selection is conducted directly by employers.
              </Text>

              <TouchableOpacity
                onPress={() => setSelectedAppDossier(null)}
                style={styles.adminPrimaryButtonSmall}
              >
                <Text style={styles.adminPrimaryButtonTextSmall}>Close Dossier</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      )}

      {/* 2. Custom Teacher Stipend Modal */}
      {stipendClass && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBoxDark}>
              <Text style={styles.modalHeadingDark}>Evaluate Teacher Stipend</Text>
              <Text style={styles.modalSubDark}>Class: {stipendClass.title}</Text>
              <Text style={styles.modalSubDark}>Tutor: {stipendClass.teacherName}</Text>

              <Text style={styles.inputLabelDark}>Stipend Amount ($) *</Text>
              <TextInput
                style={styles.inputDark}
                keyboardType="numeric"
                value={customStipendAmount}
                onChangeText={setCustomStipendAmount}
              />

              <View style={styles.userActionsRowDark}>
                <TouchableOpacity onPress={() => setStipendClass(null)} style={styles.btnSuspendDark}>
                  <Text style={styles.actionBtnSmallTextDark}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleApproveTeacherPayment} style={styles.btnActivateDark}>
                  <Text style={styles.actionBtnSmallTextDark}>Approve Stipend</Text>
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
  darkContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  authContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  adminIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#14B8A6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#14B8A6',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  adminIconText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },
  adminTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  adminSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  adminLoginCard: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  inputLabelDark: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  inputDark: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#FFFFFF',
  },
  passwordRowDark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eyeBtnDark: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    backgroundColor: '#0F172A',
  },
  eyeIcon: {
    fontSize: 16,
  },
  adminPrimaryButton: {
    backgroundColor: '#14B8A6',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  adminPrimaryButtonText: {
    color: '#0F172A',
    fontWeight: '900',
    fontSize: 13,
  },
  securityNote: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 14,
  },

  // Authenticated Layout
  adminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  adminBrandText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  brandTeal: {
    color: '#14B8A6',
  },
  adminHostText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  adminExitBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  adminExitText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F87171',
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  refreshBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  refreshBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#14B8A6',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 4,
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // Chip filters
  chipRowDark: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  filterChipDark: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 8,
  },
  filterChipDarkActive: {
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  },
  filterChipTextDark: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  filterChipTextDarkActive: {
    color: '#0F172A',
  },
  listCountHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },

  // User Cards
  userCardDark: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  userCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userNameDark: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userContactDark: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  statusBadgeDark: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusActiveDark: {
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  statusSuspendedDark: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  statusBadgeTextDark: {
    fontSize: 9,
    fontWeight: '800',
    color: '#34D399',
  },
  studentDetailBadgeDark: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    padding: 8,
    gap: 2,
  },
  studentDetailTextDark: {
    fontSize: 11,
    fontWeight: '700',
    color: '#60A5FA',
  },
  studentInstTextDark: {
    fontSize: 10,
    color: '#94A3B8',
  },
  userActionsRowDark: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  actionBtnSmallDark: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnSuspendDark: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  btnActivateDark: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderWidth: 1,
    borderColor: '#14B8A6',
  },
  actionBtnSmallTextDark: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Segment
  segmentDark: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 3,
  },
  segmentBtnDark: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentBtnDarkActive: {
    backgroundColor: '#14B8A6',
  },
  segmentTextDark: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  segmentTextDarkActive: {
    color: '#0F172A',
  },

  // Application cards
  appCardDark: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 6,
  },
  appCardHeaderDark: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appIdDark: {
    fontSize: 11,
    fontWeight: '800',
    color: '#14B8A6',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  appStatusPillDark: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusSubmittedDark: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  statusViewedDark: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  appStatusTextDark: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FBBF24',
  },
  appStudentNameDark: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  appJobTitleDark: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  appSubDark: {
    fontSize: 11,
    color: '#94A3B8',
  },
  quotationStatusDark: {
    fontSize: 10,
    fontWeight: '800',
    color: '#34D399',
  },
  inspectDossierBtnDark: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderWidth: 1,
    borderColor: '#14B8A6',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  inspectDossierTextDark: {
    fontSize: 11,
    fontWeight: '700',
    color: '#14B8A6',
  },
  adminPrimaryButtonSmall: {
    backgroundColor: '#14B8A6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  adminPrimaryButtonTextSmall: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '800',
  },

  // Admin Bottom Nav
  adminBottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingVertical: 6,
  },
  adminNavItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  adminNavIcon: {
    fontSize: 18,
  },
  adminNavLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  adminNavLabelActive: {
    color: '#14B8A6',
    fontWeight: '800',
  },

  // Modals
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 16,
  },
  modalBoxDark: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  modalHeadingDark: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  modalSubDark: {
    fontSize: 11,
    color: '#94A3B8',
  },
  dossierRowDark: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 2,
  },
  dossierLabelDark: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    width: 100,
  },
  dossierValueDark: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  policyNoticeDark: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 14,
    marginVertical: 6,
  },
  emptyTextDark: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 30,
  },
});
