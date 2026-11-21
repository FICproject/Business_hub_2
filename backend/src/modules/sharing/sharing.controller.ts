import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../services/storage';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export const createShareLink = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { targetType, targetId, title } = req.body; // 'product' | 'service' | 'job'

    if (!targetType || !targetId) {
      return res.status(400).json({ success: false, message: 'targetType and targetId are required.' });
    }

    // Check if user already generated a share link for this target
    let link = dbStore.collection.sharedLinks.find(
      (l) => l.creatorId === req.user._id && l.targetType === targetType && l.targetId === targetId
    );

    if (!link) {
      const code = uuidv4().slice(0, 8);
      // Clean privacy-preserving URL: contains only target type, id and share code
      const fullUrl = `http://localhost:3000/share/${code}`;

      link = {
        _id: uuidv4(),
        creatorId: req.user._id,
        targetType,
        targetId,
        title: title || `${targetType.toUpperCase()} Link`,
        code,
        fullUrl,
        clickCount: 0,
        createdAt: new Date().toISOString(),
      };

      dbStore.collection.sharedLinks.push(link);
      dbStore.save();
    }

    return res.json({ success: true, link });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveShareLink = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const link = dbStore.collection.sharedLinks.find((l) => l.code === code);

    if (!link) {
      return res.status(404).json({ success: false, message: 'Shared link not found or expired.' });
    }

    link.clickCount = (link.clickCount || 0) + 1;
    dbStore.save();

    let redirectPath = '/';
    if (link.targetType === 'product') {
      redirectPath = `/marketplace/products/${link.targetId}`;
    } else if (link.targetType === 'service') {
      redirectPath = `/marketplace/services/${link.targetId}`;
    } else if (link.targetType === 'job') {
      redirectPath = `/jobs/${link.targetId}`;
    }

    return res.json({
      success: true,
      targetType: link.targetType,
      targetId: link.targetId,
      redirectPath,
      clickCount: link.clickCount,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMySharedLinks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const links = dbStore.collection.sharedLinks.filter((l) => l.creatorId === req.user._id);
    return res.json({ success: true, data: links });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllSharedLinks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const links = [...dbStore.collection.sharedLinks].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const totalClicks = links.reduce((sum, l) => sum + (l.clickCount || 0), 0);
    return res.json({
      success: true,
      totalLinks: links.length,
      totalClicks,
      data: links,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
