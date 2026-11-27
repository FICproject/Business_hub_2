import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../services/storage';
import { logAudit } from '../../middleware/audit.middleware';

// Helper: Safe YouTube Video ID Extractor
export const extractYouTubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = String(url).trim().match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Helper: Notification Dispatcher
const createNotification = (userId, title, message, type = 'info', link = '/dashboard') => {
  if (!dbStore.collection.notifications) {
    dbStore.collection.notifications = [];
  }
  const notif = {
    _id: uuidv4(),
    userId,
    title,
    message,
    type,
    link,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  dbStore.collection.notifications.unshift(notif);
};

// Ensure default categories exist
const ensureDefaultCategories = () => {
  if (!dbStore.collection.educationCategories || dbStore.collection.educationCategories.length === 0) {
    dbStore.collection.educationCategories = [
      {
        _id: 'cat-cs',
        name: 'Computer Science & Software Engineering',
        slug: 'computer-science',
        description: 'Web development, mobile app architecture, cloud systems, and AI',
        icon: 'Code',
        subcategories: [
          { id: 'sub-web', name: 'Web Development (React & Node)', slug: 'web-development' },
          { id: 'sub-mobile', name: 'Mobile App Development (React Native & Flutter)', slug: 'mobile-development' },
          { id: 'sub-ai', name: 'Artificial Intelligence & Machine Learning', slug: 'ai-ml' },
          { id: 'sub-cloud', name: 'Cloud Computing & DevOps', slug: 'cloud-devops' },
          { id: 'sub-cyber', name: 'Cybersecurity & Ethical Hacking', slug: 'cybersecurity' },
        ],
        isActive: true,
        order: 1,
      },
      {
        _id: 'cat-bus',
        name: 'Business, Management & Commerce',
        slug: 'business-commerce',
        description: 'Financial management, digital marketing, corporate strategy, and entrepreneurship',
        icon: 'Briefcase',
        subcategories: [
          { id: 'sub-fin', name: 'Financial Accounting & Taxation', slug: 'accounting-tax' },
          { id: 'sub-mkt', name: 'Digital Marketing & Growth', slug: 'digital-marketing' },
          { id: 'sub-ent', name: 'Startup Incubation & Business Models', slug: 'startup-incubation' },
          { id: 'sub-ops', name: 'Supply Chain & Operations', slug: 'operations' },
        ],
        isActive: true,
        order: 2,
      },
      {
        _id: 'cat-eng',
        name: 'Engineering & Construction',
        slug: 'engineering-construction',
        description: 'Civil structural design, electrical engineering, CAD/BIM, and project management',
        icon: 'Wrench',
        subcategories: [
          { id: 'sub-civ', name: 'Civil & Structural Engineering', slug: 'civil-structural' },
          { id: 'sub-cad', name: 'AutoCAD, Revit & BIM Modeling', slug: 'cad-bim' },
          { id: 'sub-elec', name: 'Electrical Systems & Power Electronics', slug: 'electrical-systems' },
        ],
        isActive: true,
        order: 3,
      },
      {
        _id: 'cat-sci',
        name: 'Applied Science & Mathematics',
        slug: 'science-math',
        description: 'Data analytics, quantitative methods, physics, and laboratory principles',
        icon: 'Cpu',
        subcategories: [
          { id: 'sub-stat', name: 'Statistics & Probability for Data Science', slug: 'statistics' },
          { id: 'sub-math', name: 'Applied Linear Algebra & Calculus', slug: 'applied-math' },
        ],
        isActive: true,
        order: 4,
      },
      {
        _id: 'cat-des',
        name: 'Creative Arts & Product Design',
        slug: 'creative-design',
        description: 'UI/UX design, visual systems, 3D modeling, and digital media production',
        icon: 'Palette',
        subcategories: [
          { id: 'sub-ui', name: 'UI/UX Interface & Experience Design', slug: 'ui-ux' },
          { id: 'sub-3d', name: '3D Modeling & Animation (Blender)', slug: '3d-modeling' },
        ],
        isActive: true,
        order: 5,
      },
    ];
    dbStore.save();
  }
};

// ============================================================================
// 1. FREE COURSES & CURRICULUM MANAGEMENT
// ============================================================================

/**
 * Get Published Courses (Public / Student view)
 */
export const getCourses = async (req, res) => {
  try {
    ensureDefaultCategories();
    const { category, subcategory, level, search, language } = req.query;
    let courses = (dbStore.collection.courses || []).filter((c) => c.status === 'published');

    if (category && category !== 'all') {
      courses = courses.filter(
        (c) =>
          c.category?.toLowerCase() === category.toLowerCase() ||
          c.categoryId?.toLowerCase() === category.toLowerCase()
      );
    }
    if (subcategory && subcategory !== 'all') {
      courses = courses.filter(
        (c) =>
          c.subcategory?.toLowerCase() === subcategory.toLowerCase() ||
          c.subcategoryId?.toLowerCase() === subcategory.toLowerCase()
      );
    }
    if (level && level !== 'all') {
      courses = courses.filter((c) => c.level === level);
    }
    if (language && language !== 'all') {
      courses = courses.filter((c) => c.language?.toLowerCase() === language.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      courses = courses.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.instructorName?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Single Course Details by ID
 */
export const getCourseById = async (req, res) => {
  try {
    const course = (dbStore.collection.courses || []).find((c) => c._id === req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }
    return res.json({ success: true, course });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Teacher: Get My Authored Courses
 */
export const getMyTeacherCourses = async (req, res) => {
  try {
    const { status } = req.query;
    let myCourses = (dbStore.collection.courses || []).filter(
      (c) => c.instructorId === req.user._id || c.teacherId === req.user._id
    );

    if (status && status !== 'all') {
      myCourses = myCourses.filter((c) => c.status === status);
    }

    return res.json({ success: true, count: myCourses.length, data: myCourses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create New Course (Approved Teacher or Admin)
 */
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      categoryId,
      subcategory,
      subcategoryId,
      level = 'beginner',
      language = 'English',
      duration = '6 Hours',
      thumbnailUrl,
      objectives = [],
      prerequisites = [],
      targetAudience = 'All Students & Professionals',
      chapters = [],
      submitForApproval = false,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Course title, description, and category are required.',
      });
    }

    const isAdmin = req.user.roles?.includes('admin');
    // Admin directly publishes; Teacher creates as draft or submits for approval
    const initialStatus = isAdmin
      ? 'published'
      : submitForApproval
      ? 'pending_approval'
      : 'draft';

    const courseId = `CRS-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Process chapters and lessons with safe orders
    const processedChapters = (chapters.length > 0
      ? chapters
      : [
          {
            _id: `CHP-1-${uuidv4().slice(0, 6)}`,
            title: 'Chapter 1: Foundations & Architecture',
            description: 'Core concepts, environment setup, and fundamental principles.',
            order: 1,
            lessons: [
              {
                _id: `LES-1-1-${uuidv4().slice(0, 6)}`,
                title: 'Lesson 1.1: Introduction and Objectives',
                description: 'Overview of learning outcomes and tools used.',
                contentType: 'text',
                textContent: 'Welcome to this 100% free course on Business Hub.',
                duration: '20 min',
                order: 1,
                status: 'published',
              },
            ],
          },
        ]
    ).map((ch, chIdx) => ({
      _id: ch._id || `CHP-${chIdx + 1}-${uuidv4().slice(0, 6)}`,
      title: ch.title || `Chapter ${chIdx + 1}`,
      description: ch.description || '',
      order: ch.order || chIdx + 1,
      lessons: (ch.lessons || []).map((ls, lsIdx) => {
        const vId = extractYouTubeVideoId(ls.videoUrl);
        return {
          _id: ls._id || `LES-${chIdx + 1}-${lsIdx + 1}-${uuidv4().slice(0, 6)}`,
          title: ls.title || `Lesson ${lsIdx + 1}`,
          description: ls.description || '',
          contentType: ls.contentType || (ls.videoUrl ? 'video' : 'text'),
          videoUrl: ls.videoUrl || '',
          youtubeVideoId: vId,
          safeEmbedUrl: vId ? `https://www.youtube-nocookie.com/embed/${vId}` : '',
          textContent: ls.textContent || '',
          materialReferences: Array.isArray(ls.materialReferences) ? ls.materialReferences : [],
          duration: ls.duration || '25 min',
          order: ls.order || lsIdx + 1,
          status: 'published',
        };
      }),
    }));

    const newCourse = {
      _id: courseId,
      instructorId: req.user._id,
      instructorName: req.user.fullName,
      teacherId: req.user._id,
      teacherName: req.user.fullName,
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      description,
      category,
      categoryId: categoryId || '',
      subcategory: subcategory || '',
      subcategoryId: subcategoryId || '',
      level,
      language,
      duration,
      thumbnailUrl:
        thumbnailUrl ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      objectives: Array.isArray(objectives) ? objectives : [objectives].filter(Boolean),
      prerequisites: Array.isArray(prerequisites) ? prerequisites : [prerequisites].filter(Boolean),
      targetAudience,
      chapters: processedChapters,
      isFree: true, // MANDATORY: 100% Free
      status: initialStatus,
      approvalHistory: [
        {
          status: initialStatus,
          timestamp: new Date().toISOString(),
          actor: req.user.fullName,
          note: isAdmin
            ? 'Course published directly by Administrator'
            : submitForApproval
            ? 'Course submitted for Admin review'
            : 'Course saved as draft',
        },
      ],
      enrolledStudentsCount: 0,
      rating: 5.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!dbStore.collection.courses) {
      dbStore.collection.courses = [];
    }
    dbStore.collection.courses.unshift(newCourse);

    // Notify admins if submitted for approval
    if (submitForApproval) {
      const admins = (dbStore.collection.users || []).filter((u) => u.roles?.includes('admin'));
      admins.forEach((admin) => {
        createNotification(
          admin._id,
          'New Course Submitted for Review',
          `Teacher ${req.user.fullName} submitted course "${title}" for approval.`,
          'info',
          '/admin/education'
        );
      });
    }

    dbStore.save();
    logAudit(
      req.user._id,
      req.user.fullName,
      req.user.roles[0],
      'CREATE_COURSE',
      'Course',
      newCourse._id,
      `Created free course "${title}" (Status: ${initialStatus})`
    );

    return res.status(201).json({
      success: true,
      message:
        initialStatus === 'published'
          ? 'Course published successfully!'
          : submitForApproval
          ? 'Course submitted to Admin for approval!'
          : 'Course draft saved successfully!',
      course: newCourse,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Existing Course & Curriculum
 */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = (dbStore.collection.courses || []).find((c) => c._id === id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const isAdmin = req.user.roles?.includes('admin');
    if (course.instructorId !== req.user._id && course.teacherId !== req.user._id && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit this course.',
      });
    }

    const {
      title,
      description,
      category,
      categoryId,
      subcategory,
      subcategoryId,
      level,
      language,
      duration,
      thumbnailUrl,
      objectives,
      prerequisites,
      targetAudience,
      chapters,
      submitForApproval,
      status,
    } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (categoryId) course.categoryId = categoryId;
    if (subcategory !== undefined) course.subcategory = subcategory;
    if (subcategoryId !== undefined) course.subcategoryId = subcategoryId;
    if (level) course.level = level;
    if (language) course.language = language;
    if (duration) course.duration = duration;
    if (thumbnailUrl) course.thumbnailUrl = thumbnailUrl;
    if (objectives) course.objectives = Array.isArray(objectives) ? objectives : [objectives];
    if (prerequisites) course.prerequisites = Array.isArray(prerequisites) ? prerequisites : [prerequisites];
    if (targetAudience) course.targetAudience = targetAudience;

    if (chapters && Array.isArray(chapters)) {
      course.chapters = chapters.map((ch, chIdx) => ({
        _id: ch._id || `CHP-${chIdx + 1}-${uuidv4().slice(0, 6)}`,
        title: ch.title || `Chapter ${chIdx + 1}`,
        description: ch.description || '',
        order: ch.order || chIdx + 1,
        lessons: (ch.lessons || []).map((ls, lsIdx) => {
          const vId = extractYouTubeVideoId(ls.videoUrl);
          return {
            _id: ls._id || `LES-${chIdx + 1}-${lsIdx + 1}-${uuidv4().slice(0, 6)}`,
            title: ls.title || `Lesson ${lsIdx + 1}`,
            description: ls.description || '',
            contentType: ls.contentType || (ls.videoUrl ? 'video' : 'text'),
            videoUrl: ls.videoUrl || '',
            youtubeVideoId: vId,
            safeEmbedUrl: vId ? `https://www.youtube-nocookie.com/embed/${vId}` : '',
            textContent: ls.textContent || '',
            materialReferences: Array.isArray(ls.materialReferences) ? ls.materialReferences : [],
            duration: ls.duration || '25 min',
            order: ls.order || lsIdx + 1,
            status: 'published',
          };
        }),
      }));
    }

    if (submitForApproval && course.status !== 'published') {
      course.status = 'pending_approval';
      course.approvalHistory.push({
        status: 'pending_approval',
        timestamp: new Date().toISOString(),
        actor: req.user.fullName,
        note: 'Course resubmitted for Admin review',
      });
    } else if (isAdmin && status) {
      course.status = status;
    }

    course.updatedAt = new Date().toISOString();
    dbStore.save();

    return res.json({
      success: true,
      message: 'Course curriculum updated successfully!',
      course,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Review / Approve / Reject Course
 */
export const adminReviewCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason, notes } = req.body; // 'approve' | 'reject' | 'changes_requested' | 'publish' | 'unpublish' | 'archive'
    const course = (dbStore.collection.courses || []).find((c) => c._id === id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    let newStatus = course.status;
    let messageTitle = '';
    let messageBody = '';

    if (action === 'approve' || action === 'publish') {
      newStatus = 'published';
      messageTitle = 'Course Approved & Published!';
      messageBody = `Congratulations! Your course "${course.title}" has been approved by Admin and is now live for all students.`;
    } else if (action === 'reject') {
      newStatus = 'rejected';
      messageTitle = 'Course Review Update';
      messageBody = `Your course "${course.title}" was not approved. Reason: ${reason || 'Does not meet curriculum criteria.'}`;
    } else if (action === 'changes_requested') {
      newStatus = 'changes_requested';
      messageTitle = 'Changes Requested on Course';
      messageBody = `Admin has requested updates on "${course.title}": ${notes || 'Please review course materials and lesson details.'}`;
    } else if (action === 'unpublish') {
      newStatus = 'draft';
      messageTitle = 'Course Unpublished';
      messageBody = `Course "${course.title}" has been unpublished by administrator.`;
    } else if (action === 'archive') {
      newStatus = 'archived';
    }

    course.status = newStatus;
    if (reason) course.rejectionReason = reason;
    if (notes) course.adminNotes = notes;

    if (!course.approvalHistory) course.approvalHistory = [];
    course.approvalHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      actor: req.user.fullName,
      note: reason || notes || `Course status updated to ${newStatus}`,
    });

    course.updatedAt = new Date().toISOString();

    // Notify Teacher
    if (course.instructorId) {
      createNotification(
        course.instructorId,
        messageTitle,
        messageBody,
        newStatus === 'published' ? 'success' : 'warning',
        '/dashboard/teacher?tab=courses'
      );
    }

    dbStore.save();
    logAudit(
      req.user._id,
      req.user.fullName,
      'admin',
      'REVIEW_COURSE',
      'Course',
      course._id,
      `Course review action "${action}" resulted in status "${newStatus}"`
    );

    return res.json({
      success: true,
      message: `Course ${newStatus} successfully!`,
      course,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Student: Free Course Enrollment
 */
export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = (dbStore.collection.courses || []).find((c) => c._id === courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (course.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'This course is not published yet and cannot accept enrollments.',
      });
    }

    if (!dbStore.collection.enrollments) {
      dbStore.collection.enrollments = [];
    }

    const existingEnrollment = dbStore.collection.enrollments.find(
      (e) => (e.userId === req.user._id || e.studentId === req.user._id) && e.courseId === courseId
    );
    if (existingEnrollment) {
      return res.json({
        success: true,
        message: 'You are already enrolled in this course.',
        enrollment: existingEnrollment,
      });
    }

    const firstLessonId = course.chapters?.[0]?.lessons?.[0]?._id || null;
    const newEnrollment = {
      _id: `ENR-${uuidv4().slice(0, 8).toUpperCase()}`,
      userId: req.user._id,
      studentId: req.user._id,
      studentName: req.user.fullName,
      studentEmail: req.user.email,
      courseId,
      courseTitle: course.title,
      courseCategory: course.category,
      courseThumbnail: course.thumbnailUrl,
      instructorName: course.instructorName || course.teacherName,
      progressPercentage: 0,
      completedLessons: [],
      currentLessonId: firstLessonId,
      isCompleted: false,
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    };

    dbStore.collection.enrollments.unshift(newEnrollment);
    course.enrolledStudentsCount = (course.enrolledStudentsCount || 0) + 1;

    // Notify Student
    createNotification(
      req.user._id,
      'Enrolled in Course!',
      `You have successfully enrolled in "${course.title}" for 100% free. Start learning now!`,
      'success',
      `/dashboard/student?tab=courses`
    );

    // Notify Teacher
    if (course.instructorId) {
      createNotification(
        course.instructorId,
        'New Student Enrolled',
        `${req.user.fullName} enrolled in your course "${course.title}".`,
        'info',
        `/dashboard/teacher?tab=students`
      );
    }

    dbStore.save();
    return res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course for free!',
      enrollment: newEnrollment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Student: Get My Enrolled Courses
 */
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = (dbStore.collection.enrollments || []).filter(
      (e) => e.userId === req.user._id || e.studentId === req.user._id
    );

    // Populate fresh course info
    const populated = enrollments.map((enr) => {
      const crs = (dbStore.collection.courses || []).find((c) => c._id === enr.courseId);
      return {
        ...enr,
        courseDetails: crs || null,
        totalChapters: crs?.chapters?.length || 0,
        totalLessons: crs?.chapters?.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0) || 0,
      };
    });

    return res.json({ success: true, count: populated.length, data: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Student: Update Lesson Completion & Learning Progress
 */
export const updateCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonId, chapterId, isCompleted = true } = req.body;

    const enrollment = (dbStore.collection.enrollments || []).find(
      (e) => (e.userId === req.user._id || e.studentId === req.user._id) && e.courseId === courseId
    );

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment record not found.' });
    }

    const course = (dbStore.collection.courses || []).find((c) => c._id === courseId);
    const allLessons = course?.chapters?.flatMap((ch) => ch.lessons || []) || [];
    const totalLessonsCount = allLessons.length || 1;

    if (!enrollment.completedLessons) enrollment.completedLessons = [];

    if (lessonId) {
      if (isCompleted && !enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId);
      } else if (!isCompleted && enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons = enrollment.completedLessons.filter((l) => l !== lessonId);
      }
      enrollment.currentLessonId = lessonId;
    }

    // Record granular LessonProgress
    if (!dbStore.collection.lessonProgress) dbStore.collection.lessonProgress = [];
    const existingProg = dbStore.collection.lessonProgress.find(
      (lp) => lp.studentId === req.user._id && lp.courseId === courseId && lp.lessonId === lessonId
    );
    if (existingProg) {
      existingProg.isCompleted = isCompleted;
      existingProg.lastAccessedAt = new Date().toISOString();
    } else if (lessonId) {
      dbStore.collection.lessonProgress.push({
        _id: `LP-${uuidv4().slice(0, 8)}`,
        studentId: req.user._id,
        courseId,
        chapterId: chapterId || '',
        lessonId,
        isCompleted,
        lastAccessedAt: new Date().toISOString(),
      });
    }

    // Compute progress %
    const calculatedPercentage = Math.round(
      (enrollment.completedLessons.length / totalLessonsCount) * 100
    );
    enrollment.progressPercentage = Math.min(100, Math.max(0, calculatedPercentage));
    enrollment.isCompleted = enrollment.progressPercentage === 100;
    enrollment.lastAccessedAt = new Date().toISOString();

    dbStore.save();
    return res.json({
      success: true,
      message: 'Lesson progress recorded.',
      enrollment,
      progressPercentage: enrollment.progressPercentage,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// 2. STUDY MATERIALS & NOTES MANAGEMENT (PDF, PPT, DOC, YOUTUBE)
// ============================================================================

/**
 * Get Published Study Materials (Students / Public)
 */
export const getStudyMaterials = async (req, res) => {
  try {
    const { category, courseId, type, search } = req.query;
    let materials = (dbStore.collection.materials || []).filter(
      (m) => m.status === 'published' || m.moderationStatus === 'approved'
    );

    if (category && category !== 'all') {
      materials = materials.filter(
        (m) =>
          m.category?.toLowerCase() === category.toLowerCase() ||
          m.subject?.toLowerCase() === category.toLowerCase()
      );
    }
    if (courseId) {
      materials = materials.filter((m) => m.courseId === courseId);
    }
    if (type && type !== 'all') {
      materials = materials.filter(
        (m) => m.materialType?.toLowerCase() === type.toLowerCase() || m.fileType?.toLowerCase() === type.toLowerCase()
      );
    }
    if (search) {
      const q = search.toLowerCase();
      materials = materials.filter(
        (m) =>
          m.title?.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q) ||
          m.topic?.toLowerCase().includes(q) ||
          m.authorName?.toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, count: materials.length, data: materials });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Teacher: Get My Authored Study Materials
 */
export const getMyTeacherMaterials = async (req, res) => {
  try {
    const materials = (dbStore.collection.materials || []).filter(
      (m) => m.authorId === req.user._id || m.teacherId === req.user._id
    );
    return res.json({ success: true, count: materials.length, data: materials });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Upload New Study Material (Approved Teacher or Admin)
 */
export const uploadStudyMaterial = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      courseId,
      chapterId,
      lessonId,
      materialType = 'pdf', // 'pdf' | 'ppt' | 'pptx' | 'doc' | 'docx' | 'youtube' | 'link'
      fileUrl,
      fileName,
      fileSize = '2.5 MB',
      youtubeUrl,
      thumbnailUrl,
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Material title and category are required.',
      });
    }

    let finalYoutubeId = null;
    let safeEmbedUrl = null;
    if (materialType === 'youtube' || youtubeUrl) {
      finalYoutubeId = extractYouTubeVideoId(youtubeUrl || fileUrl);
      if (finalYoutubeId) {
        safeEmbedUrl = `https://www.youtube-nocookie.com/embed/${finalYoutubeId}`;
      }
    }

    const isAdmin = req.user.roles?.includes('admin');
    const status = isAdmin ? 'published' : 'approved'; // Approved for verified platform teachers

    const newMaterial = {
      _id: `MAT-${uuidv4().slice(0, 8).toUpperCase()}`,
      authorId: req.user._id,
      authorName: req.user.fullName,
      teacherId: req.user._id,
      teacherName: req.user.fullName,
      title,
      description: description || '',
      category,
      subcategory: subcategory || '',
      courseId: courseId || null,
      chapterId: chapterId || null,
      lessonId: lessonId || null,
      materialType: materialType.toLowerCase(),
      fileType: materialType.toUpperCase(),
      fileUrl: fileUrl || '',
      fileName: fileName || `${title.replace(/\s+/g, '_')}.${materialType}`,
      fileSize,
      youtubeUrl: youtubeUrl || '',
      youtubeVideoId: finalYoutubeId,
      safeEmbedUrl,
      thumbnailUrl:
        thumbnailUrl ||
        (finalYoutubeId
          ? `https://img.youtube.com/vi/${finalYoutubeId}/hqdefault.jpg`
          : 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80'),
      status,
      moderationStatus: status,
      downloadsCount: 0,
      accessCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!dbStore.collection.materials) dbStore.collection.materials = [];
    dbStore.collection.materials.unshift(newMaterial);
    dbStore.save();

    logAudit(
      req.user._id,
      req.user.fullName,
      req.user.roles[0],
      'UPLOAD_STUDY_MATERIAL',
      'StudyMaterial',
      newMaterial._id,
      `Uploaded study material "${title}" (${materialType})`
    );

    return res.status(201).json({
      success: true,
      message: 'Study material uploaded successfully!',
      material: newMaterial,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Record Material Download or Access Metric
 */
export const recordMaterialAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { action = 'download' } = req.body;
    const material = (dbStore.collection.materials || []).find((m) => m._id === id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found.' });
    }

    if (action === 'download') {
      material.downloadsCount = (material.downloadsCount || 0) + 1;
    } else {
      material.accessCount = (material.accessCount || 0) + 1;
    }
    dbStore.save();

    return res.json({
      success: true,
      downloadsCount: material.downloadsCount,
      accessCount: material.accessCount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// 3. ONLINE LIVE CLASSES WITH REAL JITSI WEBRTC CONFERENCING
// ============================================================================

/**
 * Get Published & Scheduled Live Classes
 */
export const getLiveClasses = async (req, res) => {
  try {
    const { status, category } = req.query;
    let classes = dbStore.collection.liveClasses || [];

    if (status && status !== 'all') {
      classes = classes.filter((c) => c.status === status);
    }
    if (category && category !== 'all') {
      classes = classes.filter(
        (c) => c.category?.toLowerCase() === category.toLowerCase() || c.subject?.toLowerCase() === category.toLowerCase()
      );
    }

    // Populate registration count
    const enriched = classes.map((lc) => {
      const regCount = (dbStore.collection.liveClassRegistrations || []).filter(
        (r) => r.liveClassId === lc._id && r.status !== 'cancelled'
      ).length;
      return {
        ...lc,
        registrationCount: regCount,
      };
    });

    return res.json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Schedule New Online Live Class (Approved Teacher or Admin)
 */
export const createLiveClass = async (req, res) => {
  try {
    const {
      title,
      subject,
      category,
      description,
      courseId,
      scheduledDate,
      startTime,
      endTime,
      timeZone = 'IST (UTC+5:30)',
      durationMinutes = 60,
      studentCapacity = 100,
      registrationDeadline,
      additionalInstructions,
    } = req.body;

    if (!title || !scheduledDate || !startTime) {
      return res.status(400).json({
        success: false,
        message: 'Class title, scheduled date, and start time are required.',
      });
    }

    const classId = `LIVE-${uuidv4().slice(0, 8).toUpperCase()}`;
    // Cryptographically unique Jitsi WebRTC Room Name
    const roomName = `BusinessHub_Class_${classId}_${Math.random().toString(36).substring(2, 8)}`;

    const hostLink = `https://meet.jit.si/${roomName}#userInfo.displayName=${encodeURIComponent(
      req.user.fullName + ' (Teacher)'
    )}&config.prejoinPageEnabled=false`;

    const participantLink = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false`;

    const newClass = {
      _id: classId,
      instructorId: req.user._id,
      instructorName: req.user.fullName,
      teacherId: req.user._id,
      teacherName: req.user.fullName,
      title,
      subject: subject || category || 'General',
      category: category || subject || 'General',
      description: description || '',
      courseId: courseId || null,
      scheduledDate,
      startTime,
      endTime: endTime || '',
      timeZone,
      durationMinutes: parseInt(durationMinutes || '60', 10),
      studentCapacity: parseInt(studentCapacity || '100', 10),
      registrationDeadline: registrationDeadline || '',
      additionalInstructions: additionalInstructions || '',
      meetingProvider: 'jitsi', // Real WebRTC Provider
      roomName,
      meetingId: classId,
      classLink: participantLink,
      meetingLink: participantLink,
      hostMeetingLink: hostLink, // Kept internal for host
      status: 'scheduled', // 'scheduled' | 'registration_open' | 'live' | 'completed' | 'cancelled' | 'rescheduled'
      enrolledCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!dbStore.collection.liveClasses) dbStore.collection.liveClasses = [];
    dbStore.collection.liveClasses.unshift(newClass);
    dbStore.save();

    logAudit(
      req.user._id,
      req.user.fullName,
      req.user.roles[0],
      'CREATE_LIVE_CLASS',
      'LiveClass',
      newClass._id,
      `Scheduled online live class "${title}" on ${scheduledDate}`
    );

    return res.status(201).json({
      success: true,
      message: 'Live class scheduled successfully with secure WebRTC classroom!',
      liveClass: newClass,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Student: Register for Online Live Class (100% Free)
 */
export const registerForLiveClass = async (req, res) => {
  try {
    const { id } = req.params;
    const liveClass = (dbStore.collection.liveClasses || []).find((c) => c._id === id);
    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found.' });
    }

    if (liveClass.status === 'completed' || liveClass.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `This live class is already ${liveClass.status}. Registration closed.`,
      });
    }

    if (!dbStore.collection.liveClassRegistrations) {
      dbStore.collection.liveClassRegistrations = [];
    }

    // Check duplicate
    const existing = dbStore.collection.liveClassRegistrations.find(
      (r) => r.liveClassId === id && r.studentId === req.user._id && r.status !== 'cancelled'
    );
    if (existing) {
      return res.json({
        success: true,
        message: 'You are already registered for this live class.',
        registration: existing,
      });
    }

    // Check capacity
    const currentRegs = dbStore.collection.liveClassRegistrations.filter(
      (r) => r.liveClassId === id && r.status !== 'cancelled'
    ).length;

    if (liveClass.studentCapacity && currentRegs >= liveClass.studentCapacity) {
      return res.status(400).json({
        success: false,
        message: 'This live class has reached its maximum student capacity.',
      });
    }

    const registration = {
      _id: `REG-${uuidv4().slice(0, 8).toUpperCase()}`,
      liveClassId: id,
      classTitle: liveClass.title,
      scheduledDate: liveClass.scheduledDate,
      startTime: liveClass.startTime,
      studentId: req.user._id,
      studentName: req.user.fullName,
      studentEmail: req.user.email,
      studentMobile: req.user.mobile,
      status: 'registered',
      registeredAt: new Date().toISOString(),
    };

    dbStore.collection.liveClassRegistrations.push(registration);
    liveClass.enrolledCount = currentRegs + 1;

    // Notify Student
    createNotification(
      req.user._id,
      'Live Class Registration Confirmed!',
      `You are registered for "${liveClass.title}" on ${liveClass.scheduledDate} at ${liveClass.startTime}. Join for free!`,
      'success',
      '/dashboard/student?tab=live-classes'
    );

    // Notify Teacher
    if (liveClass.instructorId) {
      createNotification(
        liveClass.instructorId,
        'New Student Registered for Live Class',
        `${req.user.fullName} registered for your upcoming class "${liveClass.title}".`,
        'info',
        '/dashboard/teacher?tab=live-classes'
      );
    }

    dbStore.save();
    return res.status(201).json({
      success: true,
      message: 'Successfully registered for the live class!',
      registration,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Student / Teacher: Join Online Live Class & Track Attendance
 */
export const joinLiveClass = async (req, res) => {
  try {
    const { id } = req.params;
    const liveClass = (dbStore.collection.liveClasses || []).find((c) => c._id === id);
    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found.' });
    }

    const isTeacher = liveClass.instructorId === req.user._id || liveClass.teacherId === req.user._id;
    const isAdmin = req.user.roles?.includes('admin');

    // If teacher starts, transition status to 'live'
    if (isTeacher && liveClass.status === 'scheduled') {
      liveClass.status = 'live';
      liveClass.actualStartTime = new Date().toISOString();
    }

    // Attendance tracking for students
    let attendanceRecord = null;
    if (!isTeacher && !isAdmin) {
      if (!dbStore.collection.attendances) dbStore.collection.attendances = [];

      const existingAtt = dbStore.collection.attendances.find(
        (a) => (a.classId === id || a.liveClassId === id) && a.studentId === req.user._id
      );

      if (existingAtt) {
        existingAtt.leaveTime = new Date().toISOString();
        existingAtt.durationMinutes = (existingAtt.durationMinutes || 0) + 15;
        attendanceRecord = existingAtt;
      } else {
        attendanceRecord = {
          _id: `ATT-${uuidv4().slice(0, 8).toUpperCase()}`,
          classId: id,
          liveClassId: id,
          classTitle: liveClass.title,
          studentId: req.user._id,
          studentName: req.user.fullName,
          studentEmail: req.user.email,
          joinTime: new Date().toISOString(),
          joinedAt: new Date().toISOString(),
          leaveTime: null,
          durationMinutes: 1,
          status: 'present',
        };
        dbStore.collection.attendances.push(attendanceRecord);
      }
    }

    dbStore.save();

    // Construct participant or host URL with authenticated display name
    const displayName = encodeURIComponent(
      isTeacher ? `${req.user.fullName} (Host)` : req.user.fullName
    );
    const roomUrl = `https://meet.jit.si/${liveClass.roomName}#userInfo.displayName=${displayName}&config.prejoinPageEnabled=false`;

    return res.json({
      success: true,
      message: isTeacher ? 'Started host classroom session.' : 'Joined live classroom session.',
      meetingUrl: roomUrl,
      roomName: liveClass.roomName,
      isHost: isTeacher || isAdmin,
      classStatus: liveClass.status,
      attendance: attendanceRecord,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Teacher / Admin: End Live Class & Calculate Session Attendance
 */
export const endLiveClass = async (req, res) => {
  try {
    const { id } = req.params;
    const liveClass = (dbStore.collection.liveClasses || []).find((c) => c._id === id);
    if (!liveClass) {
      return res.status(404).json({ success: false, message: 'Live class not found.' });
    }

    const isTeacher = liveClass.instructorId === req.user._id || liveClass.teacherId === req.user._id;
    const isAdmin = req.user.roles?.includes('admin');
    if (!isTeacher && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Only the host or admin can end this class.' });
    }

    liveClass.status = 'completed';
    liveClass.actualEndTime = new Date().toISOString();

    // Finalize all attendances for this class
    const classAttendances = (dbStore.collection.attendances || []).filter(
      (a) => a.classId === id || a.liveClassId === id
    );
    classAttendances.forEach((att) => {
      if (!att.leaveTime) att.leaveTime = liveClass.actualEndTime;
      if (att.durationMinutes < 15) att.status = 'partial';
      else att.status = 'present';
    });

    dbStore.save();
    logAudit(
      req.user._id,
      req.user.fullName,
      req.user.roles[0],
      'END_LIVE_CLASS',
      'LiveClass',
      id,
      `Ended live class "${liveClass.title}". Attendees: ${classAttendances.length}`
    );

    return res.json({
      success: true,
      message: 'Live class completed! Attendance records finalized.',
      liveClass,
      attendeesCount: classAttendances.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Live Class Registered Students & Attendance Rosters
 */
export const getClassRoster = async (req, res) => {
  try {
    const { id } = req.params;
    const registrations = (dbStore.collection.liveClassRegistrations || []).filter(
      (r) => r.liveClassId === id
    );
    const attendances = (dbStore.collection.attendances || []).filter(
      (a) => a.classId === id || a.liveClassId === id
    );

    return res.json({
      success: true,
      registrations,
      attendances,
      totalRegistered: registrations.length,
      totalAttended: attendances.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// 4. DYNAMIC EDUCATION CATEGORY MANAGEMENT (ADMIN & PUBLIC)
// ============================================================================

/**
 * Get All Education Categories
 */
export const getEducationCategories = async (req, res) => {
  try {
    ensureDefaultCategories();
    return res.json({
      success: true,
      count: dbStore.collection.educationCategories.length,
      data: dbStore.collection.educationCategories,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Create Education Category
 */
export const createEducationCategory = async (req, res) => {
  try {
    const { name, description, icon = 'BookOpen', subcategories = [] } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    ensureDefaultCategories();
    const catId = `CAT-${uuidv4().slice(0, 6)}`;
    const newCat = {
      _id: catId,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      description: description || '',
      icon,
      subcategories: Array.isArray(subcategories)
        ? subcategories.map((s, idx) => ({
            id: s.id || `SUB-${catId}-${idx + 1}`,
            name: typeof s === 'string' ? s : s.name,
            slug: (typeof s === 'string' ? s : s.name).toLowerCase().replace(/\s+/g, '-'),
          }))
        : [],
      isActive: true,
      order: dbStore.collection.educationCategories.length + 1,
    };

    dbStore.collection.educationCategories.push(newCat);
    dbStore.save();
    return res.status(201).json({ success: true, message: 'Category created!', category: newCat });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Update Education Category
 */
export const updateEducationCategory = async (req, res) => {
  try {
    const { id } = req.params;
    ensureDefaultCategories();
    const category = dbStore.collection.educationCategories.find((c) => c._id === id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const { name, description, icon, subcategories, isActive } = req.body;
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (icon) category.icon = icon;
    if (isActive !== undefined) category.isActive = isActive;
    if (subcategories && Array.isArray(subcategories)) {
      category.subcategories = subcategories.map((s, idx) => ({
        id: s.id || `SUB-${id}-${idx + 1}`,
        name: typeof s === 'string' ? s : s.name,
        slug: (typeof s === 'string' ? s : s.name).toLowerCase().replace(/\s+/g, '-'),
      }));
    }

    dbStore.save();
    return res.json({ success: true, message: 'Category updated!', category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Delete Education Category
 */
export const deleteEducationCategory = async (req, res) => {
  try {
    const { id } = req.params;
    ensureDefaultCategories();
    const index = dbStore.collection.educationCategories.findIndex((c) => c._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    dbStore.collection.educationCategories.splice(index, 1);
    dbStore.save();
    return res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// 5. TEACHER STIPEND & COMPENSATION MANAGEMENT
// ============================================================================

/**
 * Get Teacher Payments & Eligible Completed Classes
 */
export const getTeacherPayments = async (req, res) => {
  try {
    const isAdmin = req.user.roles?.includes('admin');
    let payments = dbStore.collection.teacherPayments || [];

    if (!isAdmin) {
      payments = payments.filter((p) => p.teacherId === req.user._id);
    }

    // List of completed classes awaiting stipend decision
    const completedClasses = (dbStore.collection.liveClasses || []).filter(
      (c) => c.status === 'completed'
    );

    const eligibleClasses = completedClasses.map((cls) => {
      const existingPay = (dbStore.collection.teacherPayments || []).find(
        (p) => p.liveClassId === cls._id
      );
      const attCount = (dbStore.collection.attendances || []).filter(
        (a) => a.classId === cls._id || a.liveClassId === cls._id
      ).length;
      return {
        ...cls,
        hasPayment: !!existingPay,
        paymentStatus: existingPay ? existingPay.status : 'unpaid_eligible',
        paymentRecord: existingPay || null,
        actualAttendanceCount: attCount,
      };
    });

    return res.json({
      success: true,
      data: payments,
      eligibleClasses: isAdmin
        ? eligibleClasses
        : eligibleClasses.filter((ec) => ec.instructorId === req.user._id),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Approve Custom Stipend for Completed Class (Guarded against duplicates)
 */
export const approveTeacherPayment = async (req, res) => {
  try {
    const { liveClassId, teacherId, amount, notes } = req.body;

    if (!liveClassId || !amount || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid Live Class ID and payment amount are required.',
      });
    }

    if (!dbStore.collection.teacherPayments) dbStore.collection.teacherPayments = [];

    // Duplicate check
    const existing = dbStore.collection.teacherPayments.find(
      (p) => p.liveClassId === liveClassId && ['approved', 'paid'].includes(p.status)
    );
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Duplicate payment rejected. A stipend of ₹${existing.amount} for class #${liveClassId} is already '${existing.status}'.`,
      });
    }

    const liveClass = (dbStore.collection.liveClasses || []).find((c) => c._id === liveClassId);
    const targetTeacherId = teacherId || liveClass?.instructorId;
    const teacherUser = (dbStore.collection.users || []).find((u) => u._id === targetTeacherId);

    const attCount = (dbStore.collection.attendances || []).filter(
      (a) => a.classId === liveClassId || a.liveClassId === liveClassId
    ).length;

    const payment = {
      _id: `STIP-${uuidv4().slice(0, 8).toUpperCase()}`,
      teacherId: targetTeacherId,
      teacherName: teacherUser ? teacherUser.fullName : liveClass?.instructorName || 'Teacher',
      liveClassId,
      classTitle: liveClass ? liveClass.title : 'Live Classroom Session',
      classDate: liveClass?.scheduledDate || new Date().toISOString().split('T')[0],
      studentAttendanceCount: attCount || liveClass?.enrolledCount || 1,
      amount: parseFloat(amount),
      status: 'approved',
      approvedBy: req.user.fullName,
      notes: notes || 'Admin evaluated custom class performance compensation.',
      createdAt: new Date().toISOString(),
    };

    dbStore.collection.teacherPayments.unshift(payment);

    // Notify Teacher
    if (targetTeacherId) {
      createNotification(
        targetTeacherId,
        'Class Stipend Approved!',
        `Admin approved a compensation stipend of ₹${payment.amount.toLocaleString()} for completed class "${payment.classTitle}".`,
        'success',
        '/dashboard/teacher?tab=stipends'
      );
    }

    dbStore.save();
    logAudit(
      req.user._id,
      req.user.fullName,
      'admin',
      'APPROVE_TEACHER_PAYMENT',
      'TeacherPayment',
      payment._id,
      `Approved custom stipend of ₹${amount} for class ${payment.classTitle}`
    );

    return res.status(201).json({
      success: true,
      message: 'Teacher compensation stipend approved successfully!',
      payment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Mark Payment as Paid with Transaction Ref
 */
export const markTeacherPaymentPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionRef } = req.body;
    const payment = (dbStore.collection.teacherPayments || []).find((p) => p._id === id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    payment.status = 'paid';
    payment.paidAt = new Date().toISOString();
    payment.transactionRef = transactionRef || `TXN-STIP-${uuidv4().slice(0, 8).toUpperCase()}`;

    if (payment.teacherId) {
      createNotification(
        payment.teacherId,
        'Class Stipend Paid!',
        `Your stipend of ₹${payment.amount.toLocaleString()} has been disbursed (Ref: ${payment.transactionRef}).`,
        'success',
        '/dashboard/teacher?tab=stipends'
      );
    }

    dbStore.save();
    return res.json({ success: true, message: 'Payment marked as paid.', payment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// 6. GENERAL ADMIN MODERATION / DELETION ENDPOINTS
// ============================================================================

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const index = (dbStore.collection.courses || []).findIndex((c) => c._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }
    const [removed] = dbStore.collection.courses.splice(index, 1);
    dbStore.save();
    logAudit(req.user._id, req.user.fullName, 'admin', 'DELETE_COURSE', 'Course', id, `Deleted course "${removed?.title}"`);
    return res.json({ success: true, message: 'Course deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLiveClass = async (req, res) => {
  try {
    const { id } = req.params;
    const index = (dbStore.collection.liveClasses || []).findIndex((c) => c._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Live class not found.' });
    }
    const [removed] = dbStore.collection.liveClasses.splice(index, 1);
    dbStore.save();
    logAudit(req.user._id, req.user.fullName, 'admin', 'CANCEL_LIVE_CLASS', 'LiveClass', id, `Cancelled live class "${removed?.title}"`);
    return res.json({ success: true, message: 'Live class cancelled and removed.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStudyMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const index = (dbStore.collection.materials || []).findIndex((m) => m._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Study material not found.' });
    }
    const [removed] = dbStore.collection.materials.splice(index, 1);
    dbStore.save();
    logAudit(req.user._id, req.user.fullName, 'admin', 'DELETE_STUDY_MATERIAL', 'StudyMaterial', id, `Deleted material "${removed?.title}"`);
    return res.json({ success: true, message: 'Study material deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================================================
// 8. TEACHER ENROLLED STUDENTS ROSTER
// ============================================================================

export const getTeacherStudents = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const teacherCourses = (dbStore.collection.courses || []).filter(
      (c) => c.instructorId === teacherId || c.teacherId === teacherId
    );
    const courseIds = new Set(teacherCourses.map((c) => c._id));
    const enrollments = (dbStore.collection.enrollments || []).filter((e) => courseIds.has(e.courseId));

    const studentsData = enrollments.map((enr) => {
      const student = (dbStore.collection.users || []).find((u) => u._id === (enr.studentId || enr.userId));
      const course = teacherCourses.find((c) => c._id === enr.courseId);
      return {
        _id: enr._id,
        studentId: enr.studentId || enr.userId,
        studentName: enr.studentName || student?.fullName || 'Enrolled Student',
        studentEmail: student?.email || 'student@businesshub.com',
        courseId: enr.courseId,
        courseTitle: course?.title || enr.courseTitle,
        progress: enr.progress || 0,
        completedLessonsCount: Array.isArray(enr.completedLessons) ? enr.completedLessons.length : 0,
        enrolledAt: enr.enrolledAt,
        lastAccessedAt: enr.lastAccessedAt,
      };
    });

    return res.json({ success: true, count: studentsData.length, data: studentsData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getTuitions = async (req, res) => {
  try {
    return res.json({ success: true, data: dbStore.collection.tuitions || [] });
  } catch (error) {
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
    if (!dbStore.collection.tuitions) dbStore.collection.tuitions = [];
    dbStore.collection.tuitions.push(newTuition);
    dbStore.save();
    return res.status(201).json({ success: true, message: 'Tuition offering created!', tuition: newTuition });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
