import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config';
import { dbStore } from '../../services/storage';
import { logAudit } from '../../middleware/audit.middleware';
import { buildApplicantVerificationSummary } from '../documents/documents.controller';
// Helper to calculate age
const calculateAge = (dobString) => {
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const VERIFICATION_ROLES = ['teacher', 'businessman', 'entrepreneur'];

const OTP_TTL_MS = 10 * 60 * 1000;

const issueOtpForTarget = (target, type = 'email', userId = null) => {
    const cleanTarget = String(target || '').trim().toLowerCase();
    const code = crypto.randomInt(100000, 1000000).toString();
    const now = Date.now();
    dbStore.collection.otpCodes = (dbStore.collection.otpCodes || []).filter(
        (entry) => !(entry.target === cleanTarget && entry.type === type) && entry.expiresAt > now
    );
    dbStore.collection.otpCodes.push({
        target: cleanTarget,
        type,
        userId,
        code,
        expiresAt: now + OTP_TTL_MS,
    });
    console.info(`[Auth OTP] Generated ${type} verification code for ${cleanTarget}: ${code}`);
    return code;
};

export const initRegistration = async (req, res) => {
    try {
        const {
            fullName,
            email,
            mobile,
            dob,
            password,
            roles,
            termsAccepted,
            personalAddress,
            govIdDetails,
            businessmanProfile,
            entrepreneurProfile,
            applicationContext,
        } = req.body;
        if (!fullName || !email || !mobile || !dob || !password || !roles) {
            return res.status(400).json({ success: false, message: 'All registration fields are required.' });
        }
        if (!termsAccepted) {
            return res.status(400).json({ success: false, message: 'You must accept the Terms and Privacy Policy.' });
        }
        const age = calculateAge(dob);
        if (age < config.minAge) {
            return res.status(400).json({
                success: false,
                message: `Registration rejected. You must be at least 18 years old to join Business Hub. Current age calculated: ${age} years.`,
            });
        }
        const existingEmail = dbStore.collection.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (existingEmail) {
            return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
        }
        const existingMobile = dbStore.collection.users.find((u) => u.mobile === mobile);
        if (existingMobile) {
            return res.status(400).json({ success: false, message: 'An account with this mobile number already exists.' });
        }

        let userRoles = Array.isArray(roles) ? [...roles] : [roles];
        if (userRoles.includes('business')) {
            userRoles = userRoles.filter((r) => r !== 'business');
            if (!userRoles.includes('businessman') && !userRoles.includes('entrepreneur')) {
                userRoles.push('businessman', 'entrepreneur');
            }
        }
        if (!dbStore.collection.registrationDrafts) {
            dbStore.collection.registrationDrafts = [];
        }

        const mergedContext = {
            ...(applicationContext || {}),
            isStartupRegistered: entrepreneurProfile?.isStartupRegistered !== undefined ? entrepreneurProfile.isStartupRegistered : applicationContext?.isStartupRegistered,
            hasBusinessAddress: entrepreneurProfile?.hasBusinessAddress !== undefined ? entrepreneurProfile.hasBusinessAddress : applicationContext?.hasBusinessAddress,
            unregisteredDeclarationAccepted: entrepreneurProfile?.unregisteredDeclarationAccepted !== undefined ? entrepreneurProfile.unregisteredDeclarationAccepted : applicationContext?.unregisteredDeclarationAccepted,
            businessmanProfile: businessmanProfile || applicationContext?.businessmanProfile,
            entrepreneurProfile: entrepreneurProfile || applicationContext?.entrepreneurProfile,
            personalAddress: personalAddress || applicationContext?.personalAddress,
            govIdDetails: govIdDetails || applicationContext?.govIdDetails,
        };

        let draft = dbStore.collection.registrationDrafts.find(
            (d) => d.email.toLowerCase() === email.toLowerCase()
        );
        const now = new Date().toISOString();
        if (draft) {
            draft.fullName = fullName;
            draft.mobile = mobile;
            draft.roles = userRoles;
            draft.applicationContext = mergedContext;
            draft.updatedAt = now;
        } else {
            draft = {
                draftId: uuidv4(),
                fullName,
                email: email.toLowerCase(),
                mobile,
                roles: userRoles,
                applicationContext: mergedContext,
                createdAt: now,
                updatedAt: now,
            };
            dbStore.collection.registrationDrafts.push(draft);
        }
        dbStore.save();

        const draftToken = jwt.sign(
            { scope: 'registration_draft', draftId: draft.draftId, email: draft.email },
            config.jwtSecret,
            { expiresIn: '2h' }
        );

        const verification = buildApplicantVerificationSummary(null, draft);
        return res.json({
            success: true,
            draftId: draft.draftId,
            draftToken,
            ...verification,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const register = async (req, res) => {
    try {
        const {
            fullName,
            email,
            mobile,
            dob,
            password,
            roles,
            termsAccepted,
            draftId,
            personalAddress,
            govIdDetails,
            businessmanProfile,
            entrepreneurProfile,
            applicationContext,
        } = req.body;
        // Validate required fields
        if (!fullName || !email || !mobile || !dob || !password || !roles) {
            return res.status(400).json({ success: false, message: 'All registration fields are required.' });
        }
        if (!termsAccepted) {
            return res.status(400).json({ success: false, message: 'You must accept the Terms and Privacy Policy.' });
        }
        // 18+ Age Validation
        const age = calculateAge(dob);
        if (age < config.minAge) {
            return res.status(400).json({
                success: false,
                message: `Registration rejected. You must be at least 18 years old to join Business Hub. Current age calculated: ${age} years.`,
            });
        }
        // Check duplicate email or mobile
        const existingEmail = dbStore.collection.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (existingEmail) {
            return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
        }
        const existingMobile = dbStore.collection.users.find((u) => u.mobile === mobile);
        if (existingMobile) {
            return res.status(400).json({ success: false, message: 'An account with this mobile number already exists.' });
        }

        let userRoles = Array.isArray(roles) ? [...roles] : [roles];
        if (userRoles.includes('business')) {
            userRoles = userRoles.filter((r) => r !== 'business');
            if (!userRoles.includes('businessman') && !userRoles.includes('entrepreneur')) {
                userRoles.push('businessman', 'entrepreneur');
            }
        }
        const needsDocVerification = userRoles.some((r) => VERIFICATION_ROLES.includes(r));

        let draft = null;
        if (needsDocVerification) {
            draft = (dbStore.collection.registrationDrafts || []).find((d) => d.draftId === draftId);
            if (!draft) {
                return res.status(400).json({
                    success: false,
                    message: 'Mandatory verification documents must be uploaded before submitting your application.',
                });
            }
            if (applicationContext) {
                draft.applicationContext = { ...(draft.applicationContext || {}), ...applicationContext };
            }
            draft.roles = userRoles;
            const verificationCheck = buildApplicantVerificationSummary(null, draft);
            if (!verificationCheck.summary.canSubmitApplication) {
                const missing = verificationCheck.summary.missingMandatoryNames;
                const declMsg = verificationCheck.summary.unregisteredDeclarationRequired && !verificationCheck.summary.unregisteredDeclarationAccepted
                    ? ' Unregistered startup declaration must be confirmed.'
                    : '';
                return res.status(400).json({
                    success: false,
                    message: `Cannot submit application. Missing mandatory document(s): ${missing.join(', ') || 'None'}.${declMsg}`,
                    missingMandatoryNames: missing,
                });
            }
        }

        const now = new Date().toISOString();
        // Role approvals tracking for independent review
        const roleApprovals = {};
        userRoles.forEach((r) => {
            if (VERIFICATION_ROLES.includes(r)) {
                roleApprovals[r] = 'pending';
            } else {
                roleApprovals[r] = 'approved';
            }
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const effectiveContext = {
            ...(draft ? draft.applicationContext : {}),
            ...(applicationContext || {}),
        };

        const newUser = {
            _id: uuidv4(),
            fullName,
            email: email.toLowerCase(),
            mobile,
            dob,
            password: hashedPassword,
            roles: userRoles,
            roleApprovals,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
            isEmailVerified: false,
            isMobileVerified: false,
            status: needsDocVerification ? 'pending' : 'active',
            verificationStatus: needsDocVerification ? 'pending_approval' : 'approved',
            personalAddress: personalAddress || effectiveContext.personalAddress || null,
            govIdDetails: govIdDetails || effectiveContext.govIdDetails || null,
            applicationContext: effectiveContext,
            createdAt: now,
            updatedAt: now,
        };
        dbStore.collection.users.push(newUser);

        // Attach uploaded draft verification documents to the newly registered user
        if (needsDocVerification && draft) {
            const draftDocs = (dbStore.collection.verificationDocuments || []).filter((d) => d.draftId === draft.draftId);
            for (const doc of draftDocs) {
                doc.userId = newUser._id;
                doc.draftId = null;
                doc.status = 'Under Verification';
                doc.history = [
                    ...(doc.history || []),
                    {
                        status: 'Under Verification',
                        action: 'APPLICATION_SUBMITTED',
                        actorId: newUser._id,
                        actorName: newUser.fullName,
                        actorRole: userRoles[0] || 'applicant',
                        note: 'Application submitted for Admin verification review.',
                        timestamp: now,
                    },
                ];
            }
            const draftLogs = (dbStore.collection.documentAuditLogs || []).filter((l) => l.draftId === draft.draftId);
            for (const log of draftLogs) {
                log.userId = newUser._id;
                log.draftId = null;
            }
            dbStore.collection.registrationDrafts = (dbStore.collection.registrationDrafts || []).filter(
                (d) => d.draftId !== draft.draftId
            );
        }

        // Businessman Business Profile
        if (userRoles.includes('businessman')) {
            const bProfile = effectiveContext.businessmanProfile || businessmanProfile || effectiveContext.entrepreneurProfile || entrepreneurProfile || {};
            const newBusinessmanBiz = {
                _id: uuidv4(),
                ownerId: newUser._id,
                roleType: 'businessman',
                businessName: bProfile.businessName || bProfile.startupName || `${fullName}'s Business Enterprise`,
                category: bProfile.category || 'Construction & Building Materials',
                subcategory: bProfile.subcategory || 'General',
                businessType: bProfile.businessType || 'Supplier',
                description: bProfile.description || 'Established business enterprise awaiting admin verification.',
                productsServices: bProfile.productsServices || '',
                address: bProfile.businessAddress || bProfile.officeAddress || bProfile.address || { street: '', city: '', state: '', postalCode: '', country: 'India' },
                operatingLocations: bProfile.operatingLocations || '',
                website: bProfile.businessWebsite || bProfile.websiteUrl || bProfile.website || '',
                phone: bProfile.businessPhone || bProfile.phone || mobile,
                altPhone: bProfile.businessAltPhone || bProfile.altPhone || '',
                email: (bProfile.businessEmail || bProfile.email || email).toLowerCase(),
                verificationStatus: 'pending',
                logoUrl: '',
                documents: [],
                createdAt: now,
                updatedAt: now,
            };
            dbStore.collection.businesses.push(newBusinessmanBiz);
        }

        // Entrepreneur Startup Profile
        if (userRoles.includes('entrepreneur')) {
            const eProfile = effectiveContext.entrepreneurProfile || entrepreneurProfile || effectiveContext.businessmanProfile || businessmanProfile || {};
            const isRegistered = Boolean(eProfile.isStartupRegistered || effectiveContext.isStartupRegistered);
            const newEntrepreneurStartup = {
                _id: uuidv4(),
                ownerId: newUser._id,
                roleType: 'entrepreneur',
                businessName: eProfile.startupName || eProfile.businessName || `${fullName}'s Startup Innovation`,
                category: eProfile.category || 'Technology & IT Startups',
                subcategory: eProfile.subcategory || 'Software Development',
                businessType: isRegistered ? 'registered_startup' : 'unregistered_startup',
                stage: eProfile.stage || 'Ideation / Concept',
                isStartupRegistered: isRegistered,
                registrationType: eProfile.registrationType || '',
                registrationNumber: eProfile.registrationNumber || '',
                registrationDate: eProfile.registrationDate || '',
                unregisteredDeclarationAccepted: Boolean(eProfile.unregisteredDeclarationAccepted || effectiveContext.unregisteredDeclarationAccepted),
                ideaSummary: eProfile.ideaSummary || eProfile.description || '',
                targetLaunchTimeline: eProfile.targetLaunchTimeline || '',
                description: eProfile.description || 'Emerging startup concept awaiting admin verification.',
                problemStatement: eProfile.problemStatement || '',
                solutionDescription: eProfile.solutionDescription || '',
                targetMarket: eProfile.targetMarket || '',
                hasBusinessAddress: Boolean(eProfile.hasBusinessAddress || effectiveContext.hasBusinessAddress),
                address: eProfile.officeAddress || eProfile.businessAddress || eProfile.address || { street: '', city: '', state: '', postalCode: '', country: 'India' },
                website: eProfile.websiteUrl || eProfile.businessWebsite || eProfile.website || '',
                pitchDeckUrl: eProfile.pitchDeckUrl || '',
                phone: mobile,
                email: email.toLowerCase(),
                verificationStatus: 'pending',
                logoUrl: '',
                documents: [],
                createdAt: now,
                updatedAt: now,
            };
            dbStore.collection.businesses.push(newEntrepreneurStartup);
        }

        // Fallback backward-compatibility for business if neither was triggered (shouldn't happen)
        if (!userRoles.includes('businessman') && !userRoles.includes('entrepreneur') && userRoles.includes('business')) {
            const newBiz = {
                _id: uuidv4(),
                ownerId: newUser._id,
                roleType: 'businessman',
                businessName: `${fullName}'s Business Enterprise`,
                businessType: 'enterprise',
                description: 'New business awaiting admin verification.',
                address: { street: '', city: '', state: '', postalCode: '', country: '' },
                phone: mobile,
                email: email.toLowerCase(),
                verificationStatus: 'pending',
                logoUrl: '',
                documents: [],
                createdAt: now,
                updatedAt: now,
            };
            dbStore.collection.businesses.push(newBiz);
        }
        // Create welcome notification
        dbStore.collection.notifications.push({
            _id: uuidv4(),
            userId: newUser._id,
            title: needsDocVerification ? 'Application Submitted for Admin Approval' : 'Welcome to Business Hub!',
            message: needsDocVerification
                ? 'Your registration and mandatory documents have been received and are currently Pending Admin Approval.'
                : 'Explore our Marketplace, Free Courses, and Career Opportunities.',
            type: 'success',
            link: needsDocVerification
                ? (userRoles.includes('teacher') ? '/dashboard/teacher?tab=verification' : '/dashboard/business?tab=verification')
                : '/dashboard',
            isRead: false,
            createdAt: new Date().toISOString(),
        });
        const devOtp = issueOtpForTarget(newUser.email, 'email', newUser._id);
        dbStore.save();
        // Generate JWT
        const token = jwt.sign({ id: newUser._id, email: newUser.email, roles: newUser.roles }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
        const { password: _, ...userWithoutPassword } = newUser;
        logAudit(newUser._id, newUser.fullName, newUser.roles[0], 'USER_REGISTERED', 'User', newUser._id, needsDocVerification ? 'Applicant registered with mandatory documents (Pending Admin Approval).' : 'User account registered.');
        return res.status(201).json({
            success: true,
            message: needsDocVerification
                ? 'Application and verification documents submitted! Status: Pending Admin Approval.'
                : 'Registration successful! Welcome to Business Hub.',
            token,
            user: userWithoutPassword,
            ...(config.env !== 'production' ? { devOtp } : {}),
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
    }
};
export const login = async (req, res) => {
    try {
        const identifier = req.body.email || req.body.mobile || req.body.loginId || req.body.identifier;
        const { password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: 'Email or Mobile number and password are required.' });
        }
        const cleanId = String(identifier).trim();
        const user = dbStore.collection.users.find((u) => (u.email && u.email.toLowerCase() === cleanId.toLowerCase()) ||
            (u.mobile && u.mobile.trim() === cleanId));
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials. No matching account found.' });
        }
        if (user.status === 'blocked' || user.status === 'suspended') {
            return res.status(403).json({ success: false, message: `Your account is ${user.status}. Please contact support.` });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
        }
        const token = jwt.sign({ id: user._id, email: user.email, roles: user.roles }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
        const refreshToken = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '7d' });
        const { password: _, ...userWithoutPassword } = user;
        logAudit(user._id, user.fullName, user.roles[0], 'USER_LOGIN', 'User', user._id, 'User logged in successfully.');
        return res.json({
            success: true,
            message: 'Login successful.',
            token,
            refreshToken,
            user: userWithoutPassword,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
    }
};
export const getMe = async (req, res) => {
    try {
        const { password: _, ...userWithoutPassword } = req.user;
        return res.json({ success: true, user: userWithoutPassword });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Send OTP for verification
export const sendOtp = async (req, res) => {
    try {
        const { target, email, mobile, type = 'email' } = req.body;
        const resolvedTarget = String(target || (type === 'mobile' ? mobile : email) || email || mobile || '').trim();
        if (!resolvedTarget) {
            return res.status(400).json({ success: false, message: 'Verification target (email or mobile) is required.' });
        }
        const devOtp = issueOtpForTarget(resolvedTarget, type);
        dbStore.save();
        return res.json({
            success: true,
            message: `A 6-digit verification code has been sent to ${resolvedTarget}.`,
            ...(config.env !== 'production' ? { devOtp } : {}),
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
// Verify OTP
export const verifyOtp = async (req, res) => {
    try {
        const { otp, code, type = 'email' } = req.body;
        const submittedOtp = String(otp ?? code ?? '').trim();
        if (!submittedOtp) {
            return res.status(400).json({ success: false, message: 'OTP code is required.' });
        }
        const now = Date.now();
        const userTargets = [req.user?.email, req.user?.mobile, req.body?.email, req.body?.mobile]
            .filter(Boolean)
            .map((val) => String(val).trim().toLowerCase());
        const otpRecords = dbStore.collection.otpCodes || [];
        const matchedIndex = otpRecords.findIndex(
            (entry) =>
                entry.type === type &&
                entry.expiresAt > now &&
                (entry.userId === req.user._id || userTargets.includes(entry.target)) &&
                entry.code === submittedOtp
        );
        const isDevFallbackOtp = config.env !== 'production' && submittedOtp === '123456';
        if (matchedIndex === -1 && !isDevFallbackOtp) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
        }
        if (matchedIndex !== -1) {
            otpRecords.splice(matchedIndex, 1);
        }
        dbStore.collection.otpCodes = otpRecords.filter((entry) => entry.expiresAt > now);
        const user = dbStore.collection.users.find((u) => u._id === req.user._id);
        let userWithoutPassword = null;
        if (user) {
            if (type === 'mobile') {
                user.isMobileVerified = true;
            }
            else {
                user.isEmailVerified = true;
            }
            dbStore.save();
            const { password: _, ...rest } = user;
            userWithoutPassword = rest;
        }
        return res.json({
            success: true,
            message: `${type === 'mobile' ? 'Mobile' : 'Email'} verified successfully!`,
            ...(userWithoutPassword ? { user: userWithoutPassword } : {}),
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = dbStore.collection.users.find((u) => u.email.toLowerCase() === email?.toLowerCase());
        if (!user) {
            return res.status(404).json({ success: false, message: 'No account registered with this email.' });
        }
        const resetToken = uuidv4();
        return res.json({
            success: true,
            message: 'Password reset link sent to your email. Check your inbox.',
            resetToken,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = dbStore.collection.users.find((u) => u.email.toLowerCase() === email?.toLowerCase());
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.updatedAt = new Date().toISOString();
        dbStore.save();
        return res.json({ success: true, message: 'Password has been successfully reset. You can now login.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
