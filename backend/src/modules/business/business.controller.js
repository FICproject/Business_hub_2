import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../services/storage';
import { logAudit } from '../../middleware/audit.middleware';
import { buildApplicantVerificationSummary } from '../documents/documents.controller';
export const getMyBusiness = async (req, res) => {
    try {
        const business = dbStore.collection.businesses.find((b) => b.ownerId === req.user._id);
        if (!business) {
            return res.status(404).json({ success: false, message: 'No business registered for this account.' });
        }
        return res.json({ success: true, business });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const registerOrUpdateBusiness = async (req, res) => {
    try {
        const { businessName, businessType, description, address, phone, email, logoUrl } = req.body;
        let business = dbStore.collection.businesses.find((b) => b.ownerId === req.user._id);
        if (business) {
            if (businessName)
                business.businessName = businessName;
            if (businessType)
                business.businessType = businessType;
            if (description)
                business.description = description;
            if (address)
                business.address = address;
            if (phone)
                business.phone = phone;
            if (email)
                business.email = email;
            if (logoUrl)
                business.logoUrl = logoUrl;
            business.updatedAt = new Date().toISOString();
        }
        else {
            business = {
                _id: uuidv4(),
                ownerId: req.user._id,
                businessName,
                businessType: businessType || 'retail',
                description,
                address: address || { street: '', city: '', state: '', postalCode: '', country: '' },
                phone: phone || req.user.mobile,
                email: email || req.user.email,
                verificationStatus: 'draft',
                logoUrl: logoUrl || '',
                documents: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            dbStore.collection.businesses.push(business);
        }
        dbStore.save();
        return res.json({ success: true, message: 'Business profile saved successfully.', business });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const submitVerification = async (req, res) => {
    try {
        const { documents } = req.body; // array of { documentType, documentUrl }
        const business = dbStore.collection.businesses.find((b) => b.ownerId === req.user._id);
        if (!business) {
            return res.status(404).json({ success: false, message: 'Please set up your business details first.' });
        }
        if (!documents || documents.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one verification document is required.' });
        }
        business.documents = documents.map((d) => ({
            ...d,
            uploadedAt: new Date().toISOString(),
        }));
        business.verificationStatus = 'pending';
        business.rejectionReason = undefined;
        business.updatedAt = new Date().toISOString();
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, req.user.roles[0], 'BUSINESS_VERIFICATION_SUBMITTED', 'Business', business._id, `Submitted ${documents.length} document(s) for verification.`);
        return res.json({
            success: true,
            message: 'Business verification documents submitted. Awaiting Admin review.',
            business,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Admin endpoints
export const getAllBusinesses = async (req, res) => {
    try {
        const { status, type, search } = req.query;
        let businesses = [...dbStore.collection.businesses];
        if (status) {
            businesses = businesses.filter((b) => b.verificationStatus === status);
        }
        if (type) {
            businesses = businesses.filter((b) => b.businessType === type);
        }
        if (search) {
            const q = search.toLowerCase();
            businesses = businesses.filter((b) => b.businessName.toLowerCase().includes(q) ||
                b.email.toLowerCase().includes(q) ||
                b.phone.includes(q));
        }
        // Attach owner info for admin convenience
        const enriched = businesses.map((b) => {
            const owner = dbStore.collection.users.find((u) => u._id === b.ownerId);
            return {
                ...b,
                ownerName: owner ? owner.fullName : 'Unknown Owner',
                ownerEmail: owner ? owner.email : 'Unknown Email',
                ownerMobile: owner ? owner.mobile : 'Unknown Phone',
            };
        });
        return res.json({ success: true, data: enriched });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const reviewVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body; // 'approved' | 'rejected' | 'suspended' | 'blocked'
        const business = dbStore.collection.businesses.find((b) => b._id === id);
        if (!business) {
            return res.status(404).json({ success: false, message: 'Business not found.' });
        }
        const owner = dbStore.collection.users.find((u) => u._id === business.ownerId);
        if (status === 'approved' && owner) {
            const summary = buildApplicantVerificationSummary(owner);
            if (summary.requiresVerification && !summary.summary.canApproveApplication) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot approve business. All mandatory owner/business documents must be verified first: ${summary.summary.unverifiedMandatoryNames.join(', ')}`,
                    unverifiedMandatoryNames: summary.summary.unverifiedMandatoryNames,
                });
            }
            owner.status = 'active';
            owner.verificationStatus = 'approved';
            owner.updatedAt = new Date().toISOString();
        }
        business.verificationStatus = status;
        if (status === 'rejected') {
            business.rejectionReason = rejectionReason || 'Information or documents provided were insufficient or invalid.';
        }
        else {
            business.rejectionReason = undefined;
        }
        business.updatedAt = new Date().toISOString();
        // Send notification to owner
        dbStore.collection.notifications.push({
            _id: uuidv4(),
            userId: business.ownerId,
            title: `Business Verification Update: ${status.toUpperCase()}`,
            message: status === 'approved'
                ? 'Congratulations! Your business verification has been approved. You can now publish products, services, and job listings.'
                : `Your business verification has been set to ${status}. ${rejectionReason ? `Reason: ${rejectionReason}` : ''}`,
            type: status === 'approved' ? 'success' : 'warning',
            link: '/dashboard/business/verification',
            isRead: false,
            createdAt: new Date().toISOString(),
        });
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, 'admin', 'BUSINESS_REVIEW', 'Business', business._id, `Verification status updated to ${status}. Reason: ${rejectionReason || 'None'}`);
        return res.json({
            success: true,
            message: `Business verification status updated to ${status}.`,
            business,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
