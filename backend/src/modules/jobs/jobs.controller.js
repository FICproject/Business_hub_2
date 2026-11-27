import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../services/storage';
import { logAudit } from '../../middleware/audit.middleware';

// Allowed Document Formats: PDF, DOC, DOCX, JPG, JPEG, PNG
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
const isValidDocumentFormat = (url) => {
  if (!url) return true;
  const cleanUrl = String(url).split('?')[0].toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => cleanUrl.endsWith(ext));
};

export const getJobs = async (req, res) => {
  try {
    const { category, workMode, employmentType, search } = req.query;
    let jobs = (dbStore.collection.jobs || []).filter((j) => j.status === 'active');
    if (category && category !== 'all') {
      jobs = jobs.filter((j) => j.category?.toLowerCase() === category.toLowerCase());
    }
    if (workMode && workMode !== 'all') {
      jobs = jobs.filter((j) => j.workMode === workMode);
    }
    if (employmentType && employmentType !== 'all') {
      jobs = jobs.filter((j) => j.employmentType === employmentType);
    }
    if (search) {
      const q = search.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.description?.toLowerCase().includes(q) ||
          (Array.isArray(j.skills) && j.skills.some((s) => s.toLowerCase().includes(q)))
      );
    }
    return res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = (dbStore.collection.jobs || []).find((j) => j._id === req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }
    return res.json({ success: true, job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const business = (dbStore.collection.businesses || []).find((b) => b.ownerId === req.user._id);
    if (!business && !req.user.roles?.includes('admin')) {
      return res.status(403).json({ success: false, message: 'Verified business required to post job.' });
    }
    const {
      title,
      description,
      category,
      responsibilities,
      requirements,
      skills,
      experienceLevel,
      employmentType,
      location,
      workMode,
      salaryMin,
      salaryMax,
      deadline,
    } = req.body;

    const newJob = {
      _id: uuidv4(),
      businessId: business ? business._id : 'admin-system',
      businessName: business ? business.businessName : 'Business Hub Central',
      postedBy: req.user._id,
      title,
      description,
      category: category || 'Software Development',
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [responsibilities].filter(Boolean),
      requirements: Array.isArray(requirements) ? requirements : [requirements].filter(Boolean),
      skills: Array.isArray(skills) ? skills : skills ? skills.split(',').map((s) => s.trim()) : [],
      experienceLevel: experienceLevel || 'Mid Level',
      employmentType: employmentType || 'full-time',
      location: location || 'Remote',
      workMode: workMode || 'remote',
      salaryMin: parseFloat(salaryMin || '50000'),
      salaryMax: parseFloat(salaryMax || '80000'),
      currency: 'USD',
      deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'active',
      applicantsCount: 0,
      createdAt: new Date().toISOString(),
    };

    if (!dbStore.collection.jobs) dbStore.collection.jobs = [];
    dbStore.collection.jobs.push(newJob);
    dbStore.save();
    logAudit(req.user._id, req.user.fullName, req.user.roles[0], 'POST_JOB', 'Job', newJob._id, `Posted job "${title}"`);
    return res.status(201).json({ success: true, message: 'Job published successfully!', job: newJob });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Student Job Application Submission (PRD Section 1 & 2)
 */
export const applyForJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = (dbStore.collection.jobs || []).find((j) => j._id === id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    if (!dbStore.collection.jobApplications) {
      dbStore.collection.jobApplications = [];
    }

    // Check duplicate applications
    const existingApp = dbStore.collection.jobApplications.find(
      (a) => a.jobId === id && a.applicantId === req.user._id
    );
    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this position.',
        applicationId: existingApp._id,
      });
    }

    const {
      // 1. Personal Information
      fullName,
      email,
      mobile,
      dob,
      gender,
      address,
      city,
      state,
      pincode,

      // 2. Educational Details
      highestQualification,
      courseDegree,
      specialization,
      collegeUniversity,
      graduationYear,
      percentageCgpa,
      additionalQualifications,

      // 3. Professional Details
      experienceType = 'fresher', // 'fresher' | 'experienced'
      totalExperience,
      previousCompany,
      previousRole,
      technicalSkills,
      softSkills,
      certifications,
      internshipDetails,

      // 4. Documents
      resumeUrl,
      educationalCertificatesUrl,
      experienceCertificatesUrl,
      portfolioDocumentsUrl,

      // 5. Additional Information
      linkedInUrl,
      gitHubUrl,
      portfolioUrl,
      expectedSalary,
      noticePeriod,
      coverLetter,
      additionalInformation,
    } = req.body;

    // Validate Mandatory Personal Details
    if (!fullName || !email || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Personal details (Full Name, Email, Mobile) are mandatory.',
      });
    }

    // Validate Mandatory Document (Resume)
    if (!resumeUrl || !resumeUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Resume / CV is mandatory for application submission.',
      });
    }

    // Validate Document Formats (PDF, DOC, DOCX, JPG, JPEG, PNG)
    const docsToCheck = [
      { name: 'Resume / CV', url: resumeUrl },
      { name: 'Educational Certificate', url: educationalCertificatesUrl },
      { name: 'Experience Certificate', url: experienceCertificatesUrl },
      { name: 'Portfolio Document', url: portfolioDocumentsUrl },
    ];

    for (const doc of docsToCheck) {
      if (doc.url && !isValidDocumentFormat(doc.url)) {
        return res.status(400).json({
          success: false,
          message: `${doc.name} must be a valid document format: PDF, DOC, DOCX, JPG, JPEG, or PNG.`,
        });
      }
    }

    // Generate Unique Application ID
    const applicationId = `APP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const application = {
      _id: applicationId,
      applicationId,
      jobId: id,
      jobTitle: job.title,
      businessId: job.businessId,
      businessName: job.businessName || 'Business Hub Partner',
      applicantId: req.user._id,

      // 1. Personal Information
      fullName: fullName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      dob: dob || '',
      gender: gender || 'Not Specified',
      address: address || '',
      city: city || 'Bengaluru',
      state: state || 'Karnataka',
      pincode: pincode || '560001',

      // 2. Educational Details
      highestQualification: highestQualification || 'Bachelor of Engineering (B.E / B.Tech)',
      courseDegree: courseDegree || 'Computer Science & Engineering',
      specialization: specialization || 'Software Systems',
      collegeUniversity: collegeUniversity || 'Engineering College',
      graduationYear: graduationYear || '2025',
      percentageCgpa: percentageCgpa || '8.2 CGPA',
      additionalQualifications: additionalQualifications || '',

      // 3. Professional Details
      experienceType: experienceType || 'fresher',
      totalExperience: experienceType === 'experienced' ? totalExperience || '1 Year' : 'Fresher (0 Years)',
      previousCompany: previousCompany || '',
      previousRole: previousRole || '',
      technicalSkills: Array.isArray(technicalSkills)
        ? technicalSkills
        : String(technicalSkills || 'JavaScript, React, Node.js')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
      softSkills: softSkills || 'Problem Solving, Communication',
      certifications: certifications || '',
      internshipDetails: internshipDetails || '',

      // 4. Documents
      resumeUrl: resumeUrl.trim(),
      educationalCertificatesUrl: educationalCertificatesUrl ? educationalCertificatesUrl.trim() : '',
      experienceCertificatesUrl: experienceCertificatesUrl ? experienceCertificatesUrl.trim() : '',
      portfolioDocumentsUrl: portfolioDocumentsUrl ? portfolioDocumentsUrl.trim() : '',

      // 5. Additional Information
      linkedInUrl: linkedInUrl || '',
      gitHubUrl: gitHubUrl || '',
      portfolioUrl: portfolioUrl || '',
      expectedSalary: expectedSalary || '',
      noticePeriod: noticePeriod || 'Immediate Joiner',
      coverLetter: coverLetter || '',
      additionalInformation: additionalInformation || '',

      // Status: Strictly "Submitted" | "Viewed" (PRD Section 4)
      status: 'Submitted',
      appliedAt: new Date().toISOString(),
      viewedAt: null,
      history: [
        {
          status: 'Submitted',
          timestamp: new Date().toISOString(),
          note: 'Application successfully submitted to Business Hub Admin',
        },
      ],
    };

    dbStore.collection.jobApplications.unshift(application);
    job.applicantsCount = (job.applicantsCount || 0) + 1;

    // Send confirmation notification to student (PRD Section 5)
    if (!dbStore.collection.notifications) dbStore.collection.notifications = [];
    dbStore.collection.notifications.unshift({
      _id: uuidv4(),
      userId: req.user._id,
      title: 'Job Application Submitted Successfully',
      message: `Your application for "${job.title}" at ${job.businessName} has been submitted to Business Hub Admin. Application ID: ${applicationId}.`,
      type: 'success',
      link: '/dashboard/student?tab=applications',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    dbStore.save();
    logAudit(
      req.user._id,
      req.user.fullName,
      req.user.roles[0],
      'SUBMIT_JOB_APPLICATION',
      'JobApplication',
      applicationId,
      `Submitted application ${applicationId} for job "${job.title}"`
    );

    return res.status(201).json({
      success: true,
      message: 'Job application submitted successfully to Business Hub Admin!',
      application,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Get All Submitted Applications with Filters & Search (PRD Section 3)
 */
export const getAllApplications = async (req, res) => {
  try {
    const { search, jobTitle, qualification, location, status, dateFrom, dateTo } = req.query;
    let apps = dbStore.collection.jobApplications || [];

    if (search) {
      const q = search.toLowerCase();
      apps = apps.filter(
        (a) =>
          a._id?.toLowerCase().includes(q) ||
          a.applicationId?.toLowerCase().includes(q) ||
          a.fullName?.toLowerCase().includes(q) ||
          a.email?.toLowerCase().includes(q) ||
          a.mobile?.includes(q) ||
          a.jobTitle?.toLowerCase().includes(q)
      );
    }

    if (jobTitle && jobTitle !== 'all') {
      apps = apps.filter((a) => a.jobTitle?.toLowerCase().includes(jobTitle.toLowerCase()));
    }

    if (qualification && qualification !== 'all') {
      apps = apps.filter((a) =>
        a.highestQualification?.toLowerCase().includes(qualification.toLowerCase())
      );
    }

    if (location && location !== 'all') {
      apps = apps.filter(
        (a) =>
          a.city?.toLowerCase().includes(location.toLowerCase()) ||
          a.state?.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (status && status !== 'all') {
      apps = apps.filter((a) => a.status?.toLowerCase() === status.toLowerCase());
    }

    if (dateFrom) {
      apps = apps.filter((a) => new Date(a.appliedAt) >= new Date(dateFrom));
    }

    if (dateTo) {
      apps = apps.filter((a) => new Date(a.appliedAt) <= new Date(dateTo));
    }

    // Attach latest job details
    const populated = apps.map((app) => {
      const job = (dbStore.collection.jobs || []).find((j) => j._id === app.jobId);
      return {
        ...app,
        jobDetails: job || {
          title: app.jobTitle,
          businessName: app.businessName,
          location: app.city || 'Remote',
        },
      };
    });

    return res.json({ success: true, count: populated.length, data: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Single Application Details (Admin or Candidate)
 * Automatically marks application as 'Viewed' when opened by Admin (PRD Section 4)
 */
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const app = (dbStore.collection.jobApplications || []).find(
      (a) => a._id === id || a.applicationId === id
    );

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const isAdmin = req.user.roles?.includes('admin');
    const isOwner = app.applicantId === req.user._id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // Automatically mark as Viewed if Admin opens it (PRD Section 4)
    if (isAdmin && (app.status === 'Submitted' || app.status === 'submitted')) {
      app.status = 'Viewed';
      app.viewedAt = new Date().toISOString();
      if (!app.history) app.history = [];
      app.history.push({
        status: 'Viewed',
        timestamp: new Date().toISOString(),
        actor: req.user.fullName,
        note: 'Application viewed by Administrator',
      });
      dbStore.save();
    }

    const job = (dbStore.collection.jobs || []).find((j) => j._id === app.jobId);

    return res.json({
      success: true,
      application: {
        ...app,
        jobDetails: job || null,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Student: Get My Submitted Applications
 */
export const getMyApplications = async (req, res) => {
  try {
    const apps = (dbStore.collection.jobApplications || []).filter(
      (a) => a.applicantId === req.user._id
    );

    const populated = apps.map((app) => {
      const job = (dbStore.collection.jobs || []).find((j) => j._id === app.jobId);
      return {
        ...app,
        jobDetails: job || null,
      };
    });

    return res.json({ success: true, count: populated.length, data: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Business: Get Applications (Read-only view)
 */
export const getBusinessApplications = async (req, res) => {
  try {
    const business = (dbStore.collection.businesses || []).find((b) => b.ownerId === req.user._id);
    if (!business) {
      return res.json({ success: true, data: [] });
    }
    const apps = (dbStore.collection.jobApplications || []).filter((a) => a.businessId === business._id);
    return res.json({ success: true, count: apps.length, data: apps });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Application Status (Restricted to 'Submitted' and 'Viewed' per PRD Section 4)
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Submitted', 'Viewed', 'submitted', 'viewed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Only "Submitted" and "Viewed" record statuses are supported.',
      });
    }

    const app = (dbStore.collection.jobApplications || []).find(
      (a) => a._id === id || a.applicationId === id
    );
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const normalizedStatus = status.toLowerCase() === 'viewed' ? 'Viewed' : 'Submitted';
    app.status = normalizedStatus;
    if (normalizedStatus === 'Viewed' && !app.viewedAt) {
      app.viewedAt = new Date().toISOString();
    }

    dbStore.save();
    return res.json({
      success: true,
      message: `Application marked as ${normalizedStatus}.`,
      application: app,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'active' | 'closed'
    const job = (dbStore.collection.jobs || []).find((j) => j._id === id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }
    job.status = status;
    dbStore.save();
    logAudit(req.user._id, req.user.fullName, req.user.roles[0], 'UPDATE_JOB_STATUS', 'Job', id, `Updated job status to ${status}`);
    return res.json({ success: true, message: `Job marked as ${status}.`, job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const index = (dbStore.collection.jobs || []).findIndex((j) => j._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }
    const [removed] = dbStore.collection.jobs.splice(index, 1);
    dbStore.save();
    logAudit(req.user._id, req.user.fullName, 'admin', 'DELETE_JOB', 'Job', id, `Deleted job "${removed?.title}"`);
    return res.json({ success: true, message: 'Job deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
