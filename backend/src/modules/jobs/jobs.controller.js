import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../services/storage';
import { logAudit } from '../../middleware/audit.middleware';
export const getJobs = async (req, res) => {
    try {
        const { category, workMode, employmentType, search } = req.query;
        let jobs = dbStore.collection.jobs.filter((j) => j.status === 'active');
        if (category && category !== 'all') {
            jobs = jobs.filter((j) => j.category.toLowerCase() === category.toLowerCase());
        }
        if (workMode && workMode !== 'all') {
            jobs = jobs.filter((j) => j.workMode === workMode);
        }
        if (employmentType && employmentType !== 'all') {
            jobs = jobs.filter((j) => j.employmentType === employmentType);
        }
        if (search) {
            const q = search.toLowerCase();
            jobs = jobs.filter((j) => j.title.toLowerCase().includes(q) ||
                j.description.toLowerCase().includes(q) ||
                j.skills.some((s) => s.toLowerCase().includes(q)));
        }
        return res.json({ success: true, count: jobs.length, data: jobs });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getJobById = async (req, res) => {
    try {
        const job = dbStore.collection.jobs.find((j) => j._id === req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found.' });
        }
        return res.json({ success: true, job });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const createJob = async (req, res) => {
    try {
        const business = dbStore.collection.businesses.find((b) => b.ownerId === req.user._id);
        if (!business && !req.user.roles.includes('admin')) {
            return res.status(403).json({ success: false, message: 'Verified business required to post job.' });
        }
        const { title, description, category, responsibilities, requirements, skills, experienceLevel, employmentType, location, workMode, salaryMin, salaryMax, deadline, } = req.body;
        const newJob = {
            _id: uuidv4(),
            businessId: business ? business._id : 'admin-system',
            businessName: business ? business.businessName : 'Business Hub Central',
            postedBy: req.user._id,
            title,
            description,
            category: category || 'Software Development',
            responsibilities: Array.isArray(responsibilities) ? responsibilities : [responsibilities],
            requirements: Array.isArray(requirements) ? requirements : [requirements],
            skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map((s) => s.trim()) : []),
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
        dbStore.collection.jobs.push(newJob);
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, req.user.roles[0], 'POST_JOB', 'Job', newJob._id, `Posted job "${title}"`);
        return res.status(201).json({ success: true, message: 'Job published successfully!', job: newJob });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const applyForJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, phone, resumeUrl, coverLetter } = req.body;
        const job = dbStore.collection.jobs.find((j) => j._id === id);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found.' });
        }
        const existingApp = dbStore.collection.jobApplications.find((a) => a.jobId === id && a.applicantId === req.user._id);
        if (existingApp) {
            return res.status(400).json({ success: false, message: 'You have already applied for this position.' });
        }
        const application = {
            _id: uuidv4(),
            jobId: id,
            jobTitle: job.title,
            businessId: job.businessId,
            applicantId: req.user._id,
            fullName: fullName || req.user.fullName,
            email: email || req.user.email,
            phone: phone || req.user.mobile,
            resumeUrl: resumeUrl || '',
            coverLetter: coverLetter || '',
            status: 'submitted',
            appliedAt: new Date().toISOString(),
        };
        dbStore.collection.jobApplications.push(application);
        job.applicantsCount = (job.applicantsCount || 0) + 1;
        // Notification to applicant
        dbStore.collection.notifications.push({
            _id: uuidv4(),
            userId: req.user._id,
            title: 'Job Application Submitted',
            message: `Your application for "${job.title}" at ${job.businessName} was submitted.`,
            type: 'info',
            link: '/dashboard/student/applications',
            isRead: false,
            createdAt: new Date().toISOString(),
        });
        dbStore.save();
        return res.status(201).json({ success: true, message: 'Job application submitted successfully!', application });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getMyApplications = async (req, res) => {
    try {
        const apps = dbStore.collection.jobApplications.filter((a) => a.applicantId === req.user._id);
        return res.json({ success: true, data: apps });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getBusinessApplications = async (req, res) => {
    try {
        const business = dbStore.collection.businesses.find((b) => b.ownerId === req.user._id);
        if (!business) {
            return res.json({ success: true, data: [] });
        }
        const apps = dbStore.collection.jobApplications.filter((a) => a.businessId === business._id);
        return res.json({ success: true, data: apps });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'submitted' | 'under_review' | 'shortlisted' | 'rejected' | 'accepted'
        const app = dbStore.collection.jobApplications.find((a) => a._id === id);
        if (!app) {
            return res.status(404).json({ success: false, message: 'Application not found.' });
        }
        app.status = status;
        // Notify candidate
        dbStore.collection.notifications.push({
            _id: uuidv4(),
            userId: app.applicantId,
            title: `Job Application Update: ${app.jobTitle}`,
            message: `Your application status is now "${status.replace('_', ' ').toUpperCase()}".`,
            type: status === 'shortlisted' || status === 'accepted' ? 'success' : 'info',
            link: '/dashboard/student/applications',
            isRead: false,
            createdAt: new Date().toISOString(),
        });
        dbStore.save();
        return res.json({ success: true, message: `Application updated to ${status}.`, application: app });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const updateJobStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'active' | 'closed'
        const job = dbStore.collection.jobs.find((j) => j._id === id);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found.' });
        }
        job.status = status;
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, req.user.roles[0], 'UPDATE_JOB_STATUS', 'Job', id, `Updated job status to ${status}`);
        return res.json({ success: true, message: `Job marked as ${status}.`, job });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const index = dbStore.collection.jobs.findIndex((j) => j._id === id);
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Job not found.' });
        }
        const [removed] = dbStore.collection.jobs.splice(index, 1);
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, 'admin', 'DELETE_JOB', 'Job', id, `Deleted job "${removed?.title}"`);
        return res.json({ success: true, message: 'Job deleted successfully.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
