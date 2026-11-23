import { dbStore } from '../../services/storage';
import { logAudit } from '../../middleware/audit.middleware';
export const getDashboardMetrics = async (req, res) => {
    try {
        const users = dbStore.collection.users;
        const businesses = dbStore.collection.businesses;
        const products = dbStore.collection.products;
        const services = dbStore.collection.services;
        const orders = dbStore.collection.orders;
        const courses = dbStore.collection.courses;
        const liveClasses = dbStore.collection.liveClasses;
        const jobs = dbStore.collection.jobs;
        const teacherPayments = dbStore.collection.teacherPayments;
        const totalStudents = users.filter((u) => u.roles.includes('student')).length;
        const totalTeachers = users.filter((u) => u.roles.includes('teacher')).length;
        const totalBusinesses = businesses.length;
        const pendingApprovals = businesses.filter((b) => b.verificationStatus === 'pending').length;
        const activeProducts = products.filter((p) => p.status === 'approved').length;
        const activeServices = services.filter((s) => s.status === 'approved').length;
        const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.totalAmount : 0), 0);
        const pendingTeacherPayments = teacherPayments.filter((p) => p.status === 'pending').length;
        const totalTeacherPaidAmount = teacherPayments
            .filter((p) => p.status === 'paid')
            .reduce((acc, p) => acc + p.amount, 0);
        // Monthly Analytics Mock / Aggregated Series for Charts
        const salesChart = [
            { month: 'Jun', revenue: 4200, orders: 35 },
            { month: 'Jul', revenue: 5800, orders: 48 },
            { month: 'Aug', revenue: 7300, orders: 62 },
            { month: 'Sep', revenue: 9100, orders: 75 },
            { month: 'Oct', revenue: 11400, orders: 90 },
            { month: 'Nov', revenue: totalRevenue > 0 ? Math.round(totalRevenue) : 14200, orders: orders.length + 110 },
        ];
        const roleDistribution = [
            { name: 'Students', value: totalStudents || 120 },
            { name: 'Teachers', value: totalTeachers || 24 },
            { name: 'Businesses', value: totalBusinesses || 38 },
            { name: 'Normal Users', value: users.filter((u) => u.roles.includes('normal')).length || 65 },
        ];
        return res.json({
            success: true,
            metrics: {
                totalUsers: users.length,
                totalStudents,
                totalTeachers,
                totalBusinesses,
                pendingApprovals,
                activeProducts,
                activeServices,
                totalOrders: orders.length,
                totalRevenue: Math.round(totalRevenue * 100) / 100,
                totalCourses: courses.length,
                liveClasses: liveClasses.length,
                totalJobs: jobs.length,
                pendingTeacherPayments,
                totalTeacherPaidAmount,
            },
            charts: {
                salesChart,
                roleDistribution,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getAuditLogs = async (req, res) => {
    try {
        const logs = [...dbStore.collection.auditLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return res.json({ success: true, count: logs.length, data: logs });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getPlatformSettings = async (req, res) => {
    try {
        return res.json({ success: true, settings: dbStore.collection.platformSettings });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const updatePlatformSettings = async (req, res) => {
    try {
        dbStore.collection.platformSettings = {
            ...dbStore.collection.platformSettings,
            ...req.body,
        };
        dbStore.save();
        logAudit(req.user._id, req.user.fullName, 'admin', 'PLATFORM_SETTINGS_UPDATE', 'PlatformSettings', 'global', 'Updated platform settings.');
        return res.json({ success: true, message: 'Settings saved.', settings: dbStore.collection.platformSettings });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
