import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config';
import { dbStore } from '../../services/storage';
import { logAudit } from '../../middleware/audit.middleware';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

// Helper to calculate age
const calculateAge = (dobString: string): number => {
  const birthDate = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, mobile, dob, password, roles, termsAccepted } = req.body;

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
    const existingEmail = dbStore.collection.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const existingMobile = dbStore.collection.users.find((u) => u.mobile === mobile);
    if (existingMobile) {
      return res.status(400).json({ success: false, message: 'An account with this mobile number already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRoles = Array.isArray(roles) ? roles : [roles];

    const newUser = {
      _id: uuidv4(),
      fullName,
      email: email.toLowerCase(),
      mobile,
      dob,
      password: hashedPassword,
      roles: userRoles,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
      isEmailVerified: false,
      isMobileVerified: false,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbStore.collection.users.push(newUser);

    // If businessman or entrepreneur, automatically initialize draft business profile
    if (userRoles.includes('businessman') || userRoles.includes('entrepreneur')) {
      const newBusiness = {
        _id: uuidv4(),
        ownerId: newUser._id,
        businessName: `${fullName}'s Business Enterprise`,
        businessType: 'other',
        description: 'New business awaiting profile completion and admin verification.',
        address: { street: '', city: '', state: '', postalCode: '', country: '' },
        phone: mobile,
        email: email.toLowerCase(),
        verificationStatus: 'draft',
        logoUrl: '',
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dbStore.collection.businesses.push(newBusiness);
    }

    // Create welcome notification
    dbStore.collection.notifications.push({
      _id: uuidv4(),
      userId: newUser._id,
      title: 'Welcome to Business Hub!',
      message: 'Explore our Marketplace, Free Courses, and Career Opportunities.',
      type: 'success',
      link: '/dashboard',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    dbStore.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, roles: newUser.roles },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    );

    const { password: _, ...userWithoutPassword } = newUser;

    logAudit(newUser._id, newUser.fullName, newUser.roles[0], 'USER_REGISTERED', 'User', newUser._id, 'User account registered.');

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Business Hub.',
      token,
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const identifier = req.body.email || req.body.mobile || req.body.loginId || req.body.identifier;
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Email or Mobile number and password are required.' });
    }

    const cleanId = String(identifier).trim();
    const user = dbStore.collection.users.find(
      (u) =>
        (u.email && u.email.toLowerCase() === cleanId.toLowerCase()) ||
        (u.mobile && u.mobile.trim() === cleanId)
    );

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

    const token = jwt.sign(
      { id: user._id, email: user.email, roles: user.roles },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    logAudit(user._id, user.fullName, user.roles[0], 'USER_LOGIN', 'User', user._id, 'User logged in successfully.');

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      refreshToken,
      user: userWithoutPassword,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { password: _, ...userWithoutPassword } = req.user;
    return res.json({ success: true, user: userWithoutPassword });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Send mock OTP for verification
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { target, type } = req.body; // type: 'email' | 'mobile'
    const otp = '123456'; // Standard predictable mock OTP for development
    return res.json({
      success: true,
      message: `OTP sent to ${target}. Use code 123456 to verify.`,
      debugOtp: otp,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Verify OTP
export const verifyOtp = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { otp, type } = req.body;
    if (otp !== '123456') {
      return res.status(400).json({ success: false, message: 'Invalid OTP code.' });
    }

    const user = dbStore.collection.users.find((u) => u._id === req.user._id);
    if (user) {
      if (type === 'mobile') {
        user.isMobileVerified = true;
      } else {
        user.isEmailVerified = true;
      }
      dbStore.save();
    }

    return res.json({ success: true, message: `${type === 'mobile' ? 'Mobile' : 'Email'} verified successfully!` });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
