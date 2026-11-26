import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../services/storage';
import { logAudit } from '../../middleware/audit.middleware';
import { buildApplicantVerificationSummary } from '../documents/documents.controller';
export const getMyBusiness = async (req, res) => {
    try {
        const { roleType } = req.query;
        const allMyBusinesses = dbStore.collection.businesses.filter((b) => b.ownerId === req.user._id);
        if (allMyBusinesses.length === 0) {
            return res.status(404).json({ success: false, message: 'No business registered for this account.' });
        }
        let business = null;
        if (roleType) {
            business = allMyBusinesses.find((b) => b.roleType === roleType);
        }
        if (!business) {
            business = allMyBusinesses[0];
        }
        return res.json({ success: true, business, businesses: allMyBusinesses });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const registerOrUpdateBusiness = async (req, res) => {
    try {
        const {
            businessId,
            roleType,
            businessName,
            category,
            subcategory,
            businessType,
            description,
            productsServices,
            address,
            operatingLocations,
            website,
            phone,
            altPhone,
            email,
            logoUrl,
            stage,
            businessModel,
            problemStatement,
            solutionDescription,
            targetMarket,
            pitchDeckUrl,
        } = req.body;

        let business = null;
        if (businessId) {
            business = dbStore.collection.businesses.find((b) => b._id === businessId && b.ownerId === req.user._id);
        } else if (roleType) {
            business = dbStore.collection.businesses.find((b) => b.ownerId === req.user._id && b.roleType === roleType);
        }
        if (!business) {
            business = dbStore.collection.businesses.find((b) => b.ownerId === req.user._id);
        }

        if (business) {
            if (businessName) business.businessName = businessName;
            if (category) business.category = category;
            if (subcategory) business.subcategory = subcategory;
            if (businessType) business.businessType = businessType;
            if (description !== undefined) business.description = description;
            if (productsServices !== undefined) business.productsServices = productsServices;
            if (address) business.address = address;
            if (operatingLocations !== undefined) business.operatingLocations = operatingLocations;
            if (website !== undefined) business.website = website;
            if (phone) business.phone = phone;
            if (altPhone !== undefined) business.altPhone = altPhone;
            if (email) business.email = email;
            if (logoUrl !== undefined) business.logoUrl = logoUrl;
            if (stage !== undefined) business.stage = stage;
            if (businessModel !== undefined) business.businessModel = businessModel;
            if (problemStatement !== undefined) business.problemStatement = problemStatement;
            if (solutionDescription !== undefined) business.solutionDescription = solutionDescription;
            if (targetMarket !== undefined) business.targetMarket = targetMarket;
            if (pitchDeckUrl !== undefined) business.pitchDeckUrl = pitchDeckUrl;
            business.updatedAt = new Date().toISOString();
        }
        else {
            business = {
                _id: uuidv4(),
                ownerId: req.user._id,
                roleType: roleType || (req.user.roles.includes('entrepreneur') ? 'entrepreneur' : 'businessman'),
                businessName: businessName || `${req.user.fullName}'s Business`,
                category: category || 'General',
                subcategory: subcategory || 'General',
                businessType: businessType || 'Supplier',
                description: description || '',
                productsServices: productsServices || '',
                address: address || { street: '', city: '', state: '', postalCode: '', country: 'India' },
                operatingLocations: operatingLocations || '',
                website: website || '',
                phone: phone || req.user.mobile,
                altPhone: altPhone || '',
                email: email || req.user.email,
                verificationStatus: 'draft',
                logoUrl: logoUrl || '',
                stage: stage || '',
                businessModel: businessModel || '',
                problemStatement: problemStatement || '',
                solutionDescription: solutionDescription || '',
                targetMarket: targetMarket || '',
                pitchDeckUrl: pitchDeckUrl || '',
                documents: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            dbStore.collection.businesses.push(business);
        }
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, req.user.roles[0], 'BUSINESS_PROFILE_UPDATED', 'Business', business._id, `Updated business profile: ${business.businessName}`);
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
        const roleType = business.roleType || (business.businessType === 'unregistered_startup' ? 'entrepreneur' : 'businessman');

        if (status === 'approved' && owner) {
            const summary = buildApplicantVerificationSummary(owner, null, roleType);
            if (summary.requiresVerification && !summary.summary.canApproveApplication) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot approve ${roleType} profile. All mandatory ${roleType} documents must be verified first: ${summary.summary.unverifiedMandatoryNames.join(', ')}`,
                    unverifiedMandatoryNames: summary.summary.unverifiedMandatoryNames,
                });
            }
            owner.roleApprovals = owner.roleApprovals || {};
            owner.roleApprovals[roleType] = 'approved';

            const verifiableRoles = (owner.roles || []).filter((r) => ['teacher', 'businessman', 'entrepreneur'].includes(r));
            const allApproved = verifiableRoles.every((r) => owner.roleApprovals[r] === 'approved');

            owner.status = 'active';
            owner.verificationStatus = allApproved ? 'approved' : 'partially_approved';
            owner.updatedAt = new Date().toISOString();
        } else if (status === 'rejected' && owner) {
            owner.roleApprovals = owner.roleApprovals || {};
            owner.roleApprovals[roleType] = 'rejected';
            const verifiableRoles = (owner.roles || []).filter((r) => ['teacher', 'businessman', 'entrepreneur'].includes(r));
            const allRejected = verifiableRoles.every((r) => owner.roleApprovals[r] === 'rejected');
            if (allRejected) {
                owner.verificationStatus = 'rejected';
            }
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
            title: `${roleType === 'entrepreneur' ? 'Startup' : 'Business'} Verification Update: ${status.toUpperCase()}`,
            message: status === 'approved'
                ? `Congratulations! Your ${roleType === 'entrepreneur' ? 'startup' : 'business'} verification has been approved. You can now access full features.`
                : `Your ${roleType === 'entrepreneur' ? 'startup' : 'business'} verification has been set to ${status}. ${rejectionReason ? `Reason: ${rejectionReason}` : ''}`,
            type: status === 'approved' ? 'success' : 'warning',
            link: '/dashboard/business/verification',
            isRead: false,
            createdAt: new Date().toISOString(),
        });
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, 'admin', 'BUSINESS_REVIEW', 'Business', business._id, `Verification status for ${business.businessName} (${roleType}) updated to ${status}. Reason: ${rejectionReason || 'None'}`);
        return res.json({
            success: true,
            message: `${roleType === 'entrepreneur' ? 'Startup' : 'Business'} verification status updated to ${status}.`,
            business,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
