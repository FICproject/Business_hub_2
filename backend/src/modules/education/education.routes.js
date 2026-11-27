import { Router } from 'express';
import { authenticateToken, requireRoles, requireApprovedTeacher } from '../../middleware/auth.middleware';
import {
  getCourses,
  getCourseById,
  getMyTeacherCourses,
  createCourse,
  updateCourse,
  adminReviewCourse,
  enrollCourse,
  getMyEnrollments,
  updateCourseProgress,
  getStudyMaterials,
  getMyTeacherMaterials,
  uploadStudyMaterial,
  recordMaterialAccess,
  getLiveClasses,
  createLiveClass,
  registerForLiveClass,
  joinLiveClass,
  endLiveClass,
  getClassRoster,
  getEducationCategories,
  createEducationCategory,
  updateEducationCategory,
  deleteEducationCategory,
  getTeacherPayments,
  approveTeacherPayment,
  markTeacherPaymentPaid,
  deleteCourse,
  deleteLiveClass,
  deleteStudyMaterial,
  getTuitions,
  createTuition,
  getTeacherStudents,
} from './education.controller';

const router = Router();
// Courses (100% Free)

// ============================================================================
// 1. FREE COURSES & CURRICULUM
// ============================================================================
router.get('/courses', getCourses);
router.get('/courses/:id', getCourseById);
router.post('/courses', authenticateToken, requireApprovedTeacher, createCourse);
router.put('/courses/:id', authenticateToken, updateCourse);
router.put('/courses/:id/review', authenticateToken, requireRoles('admin'), adminReviewCourse);
router.get('/teacher/my-courses', authenticateToken, requireApprovedTeacher, getMyTeacherCourses);
router.get('/teacher/students', authenticateToken, requireApprovedTeacher, getTeacherStudents);
router.post('/courses/:courseId/enroll', authenticateToken, enrollCourse);
router.get('/enrollments/my', authenticateToken, getMyEnrollments);
router.put('/courses/:courseId/progress', authenticateToken, updateCourseProgress);
// Live Classes

// ============================================================================
// 2. STUDY MATERIALS & NOTES
// ============================================================================
router.get('/materials', getStudyMaterials);
router.get('/teacher/my-materials', authenticateToken, requireApprovedTeacher, getMyTeacherMaterials);
router.post('/materials', authenticateToken, requireApprovedTeacher, uploadStudyMaterial);
router.post('/materials/:id/access', recordMaterialAccess);

// ============================================================================
// 3. ONLINE LIVE CLASSES WITH WEBRTC
// ============================================================================
router.get('/live-classes', getLiveClasses);
router.post('/live-classes', authenticateToken, requireApprovedTeacher, createLiveClass);
router.post('/live-classes/:id/register', authenticateToken, registerForLiveClass);
router.post('/live-classes/:id/join', authenticateToken, joinLiveClass);
// Study Materials (Notes)
router.get('/materials', getStudyMaterials);
router.post('/materials', authenticateToken, requireApprovedTeacher, uploadStudyMaterial);
// Tuition
router.get('/tuitions', getTuitions);
router.post('/tuitions', authenticateToken, requireApprovedTeacher, createTuition);
// Teacher Compensation
router.post('/live-classes/:id/end', authenticateToken, endLiveClass);
router.get('/live-classes/:id/roster', authenticateToken, getClassRoster);

// ============================================================================
// 4. DYNAMIC EDUCATION CATEGORIES
// ============================================================================
router.get('/categories', getEducationCategories);
router.post('/categories', authenticateToken, requireRoles('admin'), createEducationCategory);
router.put('/categories/:id', authenticateToken, requireRoles('admin'), updateEducationCategory);
router.delete('/categories/:id', authenticateToken, requireRoles('admin'), deleteEducationCategory);

// ============================================================================
// 5. TEACHER STIPENDS & COMPENSATION
// ============================================================================
router.get('/teacher-payments', authenticateToken, getTeacherPayments);
router.post('/teacher-payments/approve', authenticateToken, requireRoles('admin'), approveTeacherPayment);
router.put('/teacher-payments/:id/pay', authenticateToken, requireRoles('admin'), markTeacherPaymentPaid);
// Admin Moderation

// ============================================================================
// 6. ADMIN MODERATION ACTIONS
// ============================================================================
router.delete('/courses/:id', authenticateToken, requireRoles('admin'), deleteCourse);
router.delete('/live-classes/:id', authenticateToken, requireRoles('admin'), deleteLiveClass);
router.delete('/materials/:id', authenticateToken, requireRoles('admin'), deleteStudyMaterial);

// ============================================================================
// 7. TUITION
// ============================================================================
router.get('/tuitions', getTuitions);
router.post('/tuitions', authenticateToken, requireApprovedTeacher, createTuition);

export default router;
