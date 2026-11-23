import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../services/storage';
import { logAudit } from '../../middleware/audit.middleware';
// 1. FREE COURSES
export const getCourses = async (req, res) => {
    try {
        const { category, level, search } = req.query;
        let courses = dbStore.collection.courses.filter((c) => c.status === 'published');
        if (category && category !== 'all') {
            courses = courses.filter((c) => c.category.toLowerCase() === category.toLowerCase());
        }
        if (level && level !== 'all') {
            courses = courses.filter((c) => c.level === level);
        }
        if (search) {
            const q = search.toLowerCase();
            courses = courses.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
        }
        return res.json({ success: true, count: courses.length, data: courses });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getCourseById = async (req, res) => {
    try {
        const course = dbStore.collection.courses.find((c) => c._id === req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }
        return res.json({ success: true, course });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const createCourse = async (req, res) => {
    try {
        const { title, description, category, level, thumbnailUrl, modules } = req.body;
        if (!title || !description || !category) {
            return res.status(400).json({ success: false, message: 'Course title, description, and category are required.' });
        }
        const newCourse = {
            _id: uuidv4(),
            instructorId: req.user._id,
            instructorName: req.user.fullName,
            title,
            slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            description,
            category,
            level: level || 'beginner',
            thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
            modules: modules || [],
            isFree: true, // Always free per PRD
            status: 'published',
            enrolledStudentsCount: 0,
            rating: 4.9,
            createdAt: new Date().toISOString(),
        };
        dbStore.collection.courses.push(newCourse);
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, req.user.roles[0], 'CREATE_COURSE', 'Course', newCourse._id, `Created free course "${title}"`);
        return res.status(201).json({ success: true, message: 'Free course published successfully!', course: newCourse });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = dbStore.collection.courses.find((c) => c._id === courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }
        const existingEnrollment = dbStore.collection.enrollments.find((e) => e.userId === req.user._id && e.courseId === courseId);
        if (existingEnrollment) {
            return res.json({ success: true, message: 'Already enrolled.', enrollment: existingEnrollment });
        }
        const newEnrollment = {
            _id: uuidv4(),
            userId: req.user._id,
            courseId,
            courseTitle: course.title,
            courseThumbnail: course.thumbnailUrl,
            progressPercentage: 0,
            completedLessons: [],
            isCompleted: false,
            enrolledAt: new Date().toISOString(),
        };
        dbStore.collection.enrollments.push(newEnrollment);
        course.enrolledStudentsCount = (course.enrolledStudentsCount || 0) + 1;
        dbStore.save();
        return res.status(201).json({ success: true, message: 'Successfully enrolled in course for free!', enrollment: newEnrollment });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = dbStore.collection.enrollments.filter((e) => e.userId === req.user._id);
        return res.json({ success: true, data: enrollments });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const updateCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { lessonId, progressPercentage } = req.body;
        const enrollment = dbStore.collection.enrollments.find((e) => e.userId === req.user._id && e.courseId === courseId);
        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Enrollment not found.' });
        }
        if (lessonId && !enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
        }
        if (progressPercentage !== undefined) {
            enrollment.progressPercentage = Math.min(100, Math.max(0, progressPercentage));
            if (enrollment.progressPercentage === 100) {
                enrollment.isCompleted = true;
            }
        }
        dbStore.save();
        return res.json({ success: true, message: 'Learning progress updated.', enrollment });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// 2. LIVE CLASSES (100% Free for students)
export const getLiveClasses = async (req, res) => {
    try {
        return res.json({ success: true, data: dbStore.collection.liveClasses });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const createLiveClass = async (req, res) => {
    try {
        const { title, subject, description, scheduledDate, startTime, durationMinutes, studentCapacity } = req.body;
        const newClass = {
            _id: uuidv4(),
            instructorId: req.user._id,
            instructorName: req.user.fullName,
            title,
            subject,
            description,
            scheduledDate,
            startTime,
            durationMinutes: parseInt(durationMinutes || '60', 10),
            studentCapacity: parseInt(studentCapacity || '100', 10),
            enrolledCount: 0,
            meetingId: `MEET-${uuidv4().slice(0, 8).toUpperCase()}`,
            status: 'scheduled',
            createdAt: new Date().toISOString(),
        };
        dbStore.collection.liveClasses.push(newClass);
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, req.user.roles[0], 'CREATE_LIVE_CLASS', 'LiveClass', newClass._id, `Scheduled live class "${title}"`);
        return res.status(201).json({ success: true, message: 'Live class scheduled successfully!', liveClass: newClass });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const joinLiveClass = async (req, res) => {
    try {
        const { id } = req.params;
        const liveClass = dbStore.collection.liveClasses.find((c) => c._id === id);
        if (!liveClass) {
            return res.status(404).json({ success: false, message: 'Live class not found.' });
        }
        // Record attendance
        const attendance = {
            _id: uuidv4(),
            classId: id,
            studentId: req.user._id,
            studentName: req.user.fullName,
            joinedAt: new Date().toISOString(),
            durationMinutes: 45, // Simulation of active participation
        };
        dbStore.collection.attendances.push(attendance);
        liveClass.enrolledCount = (liveClass.enrolledCount || 0) + 1;
        dbStore.save();
        // Virtual WebRTC Session Room Token
        const roomToken = Buffer.from(JSON.stringify({
            meetingId: liveClass.meetingId,
            userId: req.user._id,
            userName: req.user.fullName,
            role: liveClass.instructorId === req.user._id ? 'host' : 'participant',
        })).toString('base64');
        return res.json({
            success: true,
            message: 'Joined live class session.',
            roomToken,
            meetingId: liveClass.meetingId,
            liveClass,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// 3. STUDY MATERIALS (PDFs)
export const getStudyMaterials = async (req, res) => {
    try {
        const materials = dbStore.collection.materials.filter((m) => m.moderationStatus === 'approved');
        return res.json({ success: true, data: materials });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const uploadStudyMaterial = async (req, res) => {
    try {
        const { title, subject, topic, fileUrl, fileSize, fileType } = req.body;
        const newMaterial = {
            _id: uuidv4(),
            authorId: req.user._id,
            authorName: req.user.fullName,
            title,
            subject,
            topic,
            fileUrl: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            fileSize: fileSize || '2.4 MB',
            fileType: fileType || 'PDF',
            moderationStatus: 'approved', // Auto-approved for verified teachers
            downloadsCount: 0,
            createdAt: new Date().toISOString(),
        };
        dbStore.collection.materials.push(newMaterial);
        dbStore.save();
        return res.status(201).json({ success: true, message: 'Notes uploaded successfully!', material: newMaterial });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// 4. TUITION MODULE
export const getTuitions = async (req, res) => {
    try {
        return res.json({ success: true, data: dbStore.collection.tuitions });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const createTuition = async (req, res) => {
    try {
        const { subject, educationLevel, description, schedule, format, fee } = req.body;
        const newTuition = {
            _id: uuidv4(),
            teacherId: req.user._id,
            teacherName: req.user.fullName,
            subject,
            educationLevel,
            description,
            schedule,
            format: format || 'online',
            fee: parseFloat(fee || '0'),
            status: 'active',
            createdAt: new Date().toISOString(),
        };
        dbStore.collection.tuitions.push(newTuition);
        dbStore.save();
        return res.status(201).json({ success: true, message: 'Tuition offering created!', tuition: newTuition });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// 5. TEACHER COMPENSATION & PAYMENTS
export const getTeacherPayments = async (req, res) => {
    try {
        if (req.user.roles.includes('admin')) {
            return res.json({ success: true, data: dbStore.collection.teacherPayments });
        }
        const myPayments = dbStore.collection.teacherPayments.filter((p) => p.teacherId === req.user._id);
        return res.json({ success: true, data: myPayments });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Admin approves teacher stipend for a completed class (Guarded against duplicate payments)
export const approveTeacherPayment = async (req, res) => {
    try {
        const { liveClassId, teacherId, amount, notes } = req.body;
        // Duplicate payment prevention check
        const existingPayment = dbStore.collection.teacherPayments.find((p) => p.liveClassId === liveClassId && ['approved', 'processing', 'paid'].includes(p.status));
        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: `Duplicate payment rejected. A payment of $${existingPayment.amount} for class #${liveClassId} is already in status '${existingPayment.status}'.`,
            });
        }
        const liveClass = dbStore.collection.liveClasses.find((c) => c._id === liveClassId);
        const teacher = dbStore.collection.users.find((u) => u._id === teacherId);
        const payment = {
            _id: uuidv4(),
            teacherId,
            teacherName: teacher ? teacher.fullName : 'Teacher',
            liveClassId,
            classTitle: liveClass ? liveClass.title : 'Live Class Session',
            studentAttendanceCount: liveClass ? liveClass.enrolledCount : 15,
            amount: parseFloat(amount),
            status: 'approved',
            approvedBy: req.user.fullName,
            notes: notes || 'Admin approved compensation stipend.',
            createdAt: new Date().toISOString(),
        };
        dbStore.collection.teacherPayments.push(payment);
        // Notify teacher
        dbStore.collection.notifications.push({
            _id: uuidv4(),
            userId: teacherId,
            title: 'Class Compensation Approved!',
            message: `Admin has approved a payout of $${amount} for your completed class "${payment.classTitle}".`,
            type: 'success',
            link: '/dashboard/teacher/earnings',
            isRead: false,
            createdAt: new Date().toISOString(),
        });
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, 'admin', 'APPROVE_TEACHER_PAYMENT', 'TeacherPayment', payment._id, `Approved $${amount} for class ${payment.classTitle}`);
        return res.status(201).json({ success: true, message: 'Teacher payment approved!', payment });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const markTeacherPaymentPaid = async (req, res) => {
    try {
        const { id } = req.params;
        const { transactionRef } = req.body;
        const payment = dbStore.collection.teacherPayments.find((p) => p._id === id);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment record not found.' });
        }
        payment.status = 'paid';
        payment.paidAt = new Date().toISOString();
        payment.transactionRef = transactionRef || `REF-${uuidv4().slice(0, 8).toUpperCase()}`;
        dbStore.save();
        return res.json({ success: true, message: 'Payment marked as paid.', payment });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// 6. ADMIN MODERATION ACTIONS
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const index = dbStore.collection.courses.findIndex((c) => c._id === id);
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }
        const [removed] = dbStore.collection.courses.splice(index, 1);
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, 'admin', 'DELETE_COURSE', 'Course', id, `Deleted course "${removed?.title}"`);
        return res.json({ success: true, message: 'Course deleted successfully.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const deleteLiveClass = async (req, res) => {
    try {
        const { id } = req.params;
        const index = dbStore.collection.liveClasses.findIndex((c) => c._id === id);
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Live class not found.' });
        }
        const [removed] = dbStore.collection.liveClasses.splice(index, 1);
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, 'admin', 'CANCEL_LIVE_CLASS', 'LiveClass', id, `Cancelled live class "${removed?.title}"`);
        return res.json({ success: true, message: 'Live class cancelled and removed.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const deleteStudyMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const index = dbStore.collection.materials.findIndex((m) => m._id === id);
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Study material not found.' });
        }
        const [removed] = dbStore.collection.materials.splice(index, 1);
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, 'admin', 'DELETE_STUDY_MATERIAL', 'StudyMaterial', id, `Deleted note "${removed?.title}"`);
        return res.json({ success: true, message: 'Study material deleted successfully.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
