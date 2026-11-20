import { Router } from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  enrollCourse,
  getMyEnrollments,
  updateCourseProgress,
  getLiveClasses,
  createLiveClass,
  joinLiveClass,
  getStudyMaterials,
  uploadStudyMaterial,
  getTuitions,
  createTuition,
  getTeacherPayments,
  approveTeacherPayment,
  markTeacherPaymentPaid,
} from './education.controller';
import {
  authenticateToken,
  requireRoles,
  requireApprovedTeacher,
} from '../../middleware/auth.middleware';

const router = Router();

// Courses (100% Free)
router.get('/courses', getCourses);
router.get('/courses/:id', getCourseById);
router.post('/courses', authenticateToken, requireApprovedTeacher, createCourse);
router.post('/courses/:courseId/enroll', authenticateToken, enrollCourse);
router.get('/enrollments/my', authenticateToken, getMyEnrollments);
router.put('/courses/:courseId/progress', authenticateToken, updateCourseProgress);

// Live Classes
router.get('/live-classes', getLiveClasses);
router.post('/live-classes', authenticateToken, requireApprovedTeacher, createLiveClass);
router.post('/live-classes/:id/join', authenticateToken, joinLiveClass);

// Study Materials (Notes)
router.get('/materials', getStudyMaterials);
router.post('/materials', authenticateToken, requireApprovedTeacher, uploadStudyMaterial);

// Tuition
router.get('/tuitions', getTuitions);
router.post('/tuitions', authenticateToken, requireApprovedTeacher, createTuition);

// Teacher Compensation
router.get('/teacher-payments', authenticateToken, getTeacherPayments);
router.post('/teacher-payments/approve', authenticateToken, requireRoles('admin'), approveTeacherPayment);
router.put('/teacher-payments/:id/pay', authenticateToken, requireRoles('admin'), markTeacherPaymentPaid);

export default router;
