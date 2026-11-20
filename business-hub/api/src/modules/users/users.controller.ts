import { Response } from 'express';
import { dbStore } from '../../services/storage';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { logAudit } from '../../middleware/audit.middleware';

export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role, status, search, page = '1', limit = '10' } = req.query;
    let users = [...dbStore.collection.users];

    if (role) {
      users = users.filter((u) => u.roles.includes(role as string));
    }

    if (status) {
      users = users.filter((u) => u.status === status);
    }

    if (search) {
      const q = (search as string).toLowerCase();
      users = users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.mobile.includes(q)
      );
    }

    const total = users.length;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = dbStore.collection.users.find((u) => u._id === req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const { password, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = dbStore.collection.users.find((u) => u._id === req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { fullName, avatarUrl, mobile } = req.body;
    if (fullName) user.fullName = fullName;
    if (avatarUrl) user.avatarUrl = avatarUrl;
    if (mobile) user.mobile = mobile;
    user.updatedAt = new Date().toISOString();

    dbStore.save();
    const { password, ...safeUser } = user;
    return res.json({ success: true, message: 'Profile updated successfully.', user: safeUser });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStatus = async (req: AuthenticatedRequest, res: Response) => {
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

    logAudit(
      req.user._id,
      req.user.fullName,
      'admin',
      'USER_STATUS_CHANGE',
      'User',
      id,
      `User status changed to ${status}. Reason: ${reason || 'Admin action'}`
    );

    return res.json({ success: true, message: `User status changed to ${status}.`, user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRoles = async (req: AuthenticatedRequest, res: Response) => {
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

    logAudit(
      req.user._id,
      req.user.fullName,
      'admin',
      'USER_ROLES_UPDATED',
      'User',
      id,
      `User roles updated to [${roles.join(', ')}]`
    );

    return res.json({ success: true, message: 'User roles updated.', roles: user.roles });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
