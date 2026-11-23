import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../services/storage';
import { logAudit } from '../../middleware/audit.middleware';
export const getUsers = async (req, res) => {
    try {
        const { role, status, search, page = '1', limit = '10' } = req.query;
        let users = [...dbStore.collection.users];
        if (role) {
            users = users.filter((u) => u.roles.includes(role));
        }
        if (status) {
            users = users.filter((u) => u.status === status);
        }
        if (search) {
            const q = search.toLowerCase();
            users = users.filter((u) => u.fullName.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                u.mobile.includes(q));
        }
        const total = users.length;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const startIndex = (pageNum - 1) * limitNum;
        const paginated = users.slice(startIndex, startIndex + limitNum).map((u) => {
            const { password, ...safeUser } = u;
            return safeUser;
        });
        return res.json({
            success: true,
            data: paginated,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getUserById = async (req, res) => {
    try {
        const user = dbStore.collection.users.find((u) => u._id === req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        const { password, ...safeUser } = user;
        return res.json({ success: true, user: safeUser });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const user = dbStore.collection.users.find((u) => u._id === req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        const { fullName, avatarUrl, mobile, bio, location, education, professionalDetails, privacySettings } = req.body;
        if (fullName)
            user.fullName = fullName;
        if (avatarUrl)
            user.avatarUrl = avatarUrl;
        if (mobile)
            user.mobile = mobile;
        if (bio !== undefined)
            user.bio = bio;
        if (location !== undefined)
            user.location = location;
        if (education !== undefined)
            user.education = education;
        if (professionalDetails !== undefined)
            user.professionalDetails = professionalDetails;
        if (privacySettings !== undefined)
            user.privacySettings = privacySettings;
        user.updatedAt = new Date().toISOString();
        dbStore.save();
        const { password, ...safeUser } = user;
        return res.json({ success: true, message: 'Profile updated successfully.', user: safeUser });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Current and new passwords are required.' });
        }
        const user = dbStore.collection.users.find((u) => u._id === req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect current password.' });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.updatedAt = new Date().toISOString();
        dbStore.save();
        return res.json({ success: true, message: 'Password updated successfully.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getSavedItems = async (req, res) => {
    try {
        if (!dbStore.collection.savedItems)
            dbStore.collection.savedItems = [];
        const items = dbStore.collection.savedItems.filter((i) => i.userId === req.user._id);
        return res.json({ success: true, data: items });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const addSavedItem = async (req, res) => {
    try {
        const { targetId, targetType, title, category, image, price, url } = req.body;
        if (!targetId || !targetType) {
            return res.status(400).json({ success: false, message: 'targetId and targetType are required.' });
        }
        if (!dbStore.collection.savedItems)
            dbStore.collection.savedItems = [];
        const existing = dbStore.collection.savedItems.find((item) => item.userId === req.user._id && item.targetId === targetId);
        if (existing) {
            return res.json({ success: true, message: 'Item already saved.', item: existing });
        }
        const newItem = {
            _id: uuidv4(),
            userId: req.user._id,
            targetId,
            targetType, // 'product' | 'service' | 'course' | 'job' | 'event' | 'community'
            title: title || 'Saved Item',
            category: category || 'General',
            image: image || '',
            price: price || null,
            url: url || '',
            createdAt: new Date().toISOString(),
        };
        dbStore.collection.savedItems.push(newItem);
        dbStore.save();
        return res.status(201).json({ success: true, message: 'Item saved successfully.', item: newItem });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const removeSavedItem = async (req, res) => {
    try {
        const { id } = req.params;
        if (!dbStore.collection.savedItems)
            dbStore.collection.savedItems = [];
        const index = dbStore.collection.savedItems.findIndex((item) => (item._id === id || item.targetId === id) && item.userId === req.user._id);
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Saved item not found.' });
        }
        dbStore.collection.savedItems.splice(index, 1);
        dbStore.save();
        return res.json({ success: true, message: 'Item removed from saved list.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const searchAll = async (req, res) => {
    try {
        const query = String(req.query.q || '').toLowerCase().trim();
        const category = String(req.query.category || 'all').toLowerCase();
        if (!query) {
            return res.json({
                success: true,
                data: {
                    products: [],
                    services: [],
                    courses: [],
                    jobs: [],
                    businesses: [],
                },
            });
        }
        const products = (category === 'all' || category === 'products')
            ? dbStore.collection.products
                .filter((p) => p.title?.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query) || p.category?.toLowerCase().includes(query))
                .slice(0, 8)
            : [];
        const services = (category === 'all' || category === 'services')
            ? dbStore.collection.services
                .filter((s) => s.title?.toLowerCase().includes(query) || s.description?.toLowerCase().includes(query))
                .slice(0, 8)
            : [];
        const courses = (category === 'all' || category === 'courses')
            ? dbStore.collection.courses
                .filter((c) => c.title?.toLowerCase().includes(query) || c.description?.toLowerCase().includes(query) || c.category?.toLowerCase().includes(query))
                .slice(0, 8)
            : [];
        const jobs = (category === 'all' || category === 'jobs')
            ? dbStore.collection.jobs
                .filter((j) => j.title?.toLowerCase().includes(query) || j.description?.toLowerCase().includes(query) || j.category?.toLowerCase().includes(query))
                .slice(0, 8)
            : [];
        // Redact owner private details from public business view
        const businesses = (category === 'all' || category === 'businesses')
            ? dbStore.collection.businesses
                .filter((b) => b.businessName?.toLowerCase().includes(query) || b.description?.toLowerCase().includes(query) || b.businessType?.toLowerCase().includes(query))
                .map((b) => ({
                _id: b._id,
                businessName: b.businessName,
                businessType: b.businessType,
                description: b.description,
                verificationStatus: b.verificationStatus,
                city: b.address?.city,
                country: b.address?.country,
            }))
                .slice(0, 8)
            : [];
        return res.json({
            success: true,
            data: {
                products,
                services,
                courses,
                jobs,
                businesses,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reason } = req.body; // 'active' | 'suspended' | 'blocked'
        const user = dbStore.collection.users.find((u) => u._id === id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        user.status = status;
        user.updatedAt = new Date().toISOString();
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, 'admin', 'USER_STATUS_CHANGE', 'User', id, `User status changed to ${status}. Reason: ${reason || 'Admin action'}`);
        return res.json({ success: true, message: `User status changed to ${status}.`, user });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const updateRoles = async (req, res) => {
    try {
        const { id } = req.params;
        const { roles } = req.body;
        const user = dbStore.collection.users.find((u) => u._id === id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        user.roles = roles;
        user.updatedAt = new Date().toISOString();
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, 'admin', 'USER_ROLES_UPDATED', 'User', id, `User roles updated to [${roles.join(', ')}]`);
        return res.json({ success: true, message: 'User roles updated.', roles: user.roles });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
