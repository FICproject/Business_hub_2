import jwt from 'jsonwebtoken';
import { config } from '../config';
import { dbStore } from '../services/storage';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. Authentication token required.' });
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        const user = dbStore.collection.users.find((u) => u._id === decoded.id || u._id === decoded._id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User associated with token no longer exists.' });
        }
        if (user.status === 'blocked' || user.status === 'suspended') {
            return res.status(403).json({ success: false, message: `Your account has been ${user.status}. Please contact support.` });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
    }
};
export const requireRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized. Authentication required.' });
        }
        const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
        if (!hasRole) {
            return res.status(403).json({
                success: false,
                message: `Forbidden. This action requires one of the following roles: [${allowedRoles.join(', ')}]`,
            });
        }
        next();
    };
};
export const requireApprovedBusiness = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }
    // Admins can bypass business approval check
    if (req.user.roles.includes('admin')) {
        return next();
    }
    const targetBizId = req.body?.businessId || req.query?.businessId;
    let business = null;
    if (targetBizId) {
        business = dbStore.collection.businesses.find((b) => b._id === targetBizId && b.ownerId === req.user._id);
    }
    if (!business) {
        // Find approved business first
        business = dbStore.collection.businesses.find((b) => b.ownerId === req.user._id && b.verificationStatus === 'approved') ||
                   dbStore.collection.businesses.find((b) => b.ownerId === req.user._id);
    }
    if (!business) {
        return res.status(403).json({
            success: false,
            message: 'You have not registered a business yet. Please register your business first.',
        });
    }
    if (business.verificationStatus !== 'approved') {
        return res.status(403).json({
            success: false,
            message: `Your business verification is currently in status '${business.verificationStatus}'. Only Admin-approved businesses can publish products, services, or jobs.`,
            verificationStatus: business.verificationStatus,
        });
    }
    req.business = business;
    next();
};
export const requireApprovedTeacher = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }
    if (req.user.roles.includes('admin')) {
        return next();
    }
    if (req.user.roles.includes('teacher')) {
        if (req.user.status === 'pending' || (req.user.verificationStatus && req.user.verificationStatus !== 'approved')) {
            return res.status(403).json({
                success: false,
                message: 'Your teacher application and mandatory documents are currently pending Admin verification and approval.',
                verificationStatus: req.user.verificationStatus || 'pending_approval',
            });
        }
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'Teacher authorization required to publish courses, schedule classes, or upload notes.',
    });
};
