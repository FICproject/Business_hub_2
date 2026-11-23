import { dbStore } from '../../services/storage';
export const getMyNotifications = async (req, res) => {
    try {
        const notifications = dbStore.collection.notifications
            .filter((n) => n.userId === req.user._id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        return res.json({ success: true, count: notifications.length, unreadCount, data: notifications });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = dbStore.collection.notifications.find((n) => n._id === id && n.userId === req.user._id);
        if (notification) {
            notification.isRead = true;
            dbStore.save();
        }
        return res.json({ success: true, message: 'Notification marked as read.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const markAllAsRead = async (req, res) => {
    try {
        dbStore.collection.notifications.forEach((n) => {
            if (n.userId === req.user._id) {
                n.isRead = true;
            }
        });
        dbStore.save();
        return res.json({ success: true, message: 'All notifications marked as read.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
