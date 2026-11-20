export interface IAdminMetrics {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalBusinesses: number;
  pendingApprovals: number;
  activeProducts: number;
  activeServices: number;
  totalOrders: number;
  totalRevenue: number;
  totalCourses: number;
  liveClasses: number;
  totalJobs: number;
  pendingTeacherPayments: number;
  totalTeacherPaidAmount: number;
}

export interface IChartData {
  salesChart: { month: string; revenue: number; orders: number }[];
  roleDistribution: { name: string; value: number }[];
}

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  dob: string;
  roles: string[];
  avatarUrl?: string;
  status: 'active' | 'suspended' | 'blocked';
  createdAt: string;
}

export interface IBusiness {
  _id: string;
  ownerId: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerMobile?: string;
  businessName: string;
  businessType: string;
  description: string;
  verificationStatus: 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended' | 'blocked';
  rejectionReason?: string;
  documents?: {
    documentType: string;
    documentUrl: string;
    uploadedAt: string;
  }[];
  createdAt: string;
}

export interface ITeacherPayment {
  _id: string;
  teacherId: string;
  teacherName: string;
  liveClassId: string;
  classTitle: string;
  studentAttendanceCount: number;
  amount: number;
  status: 'pending' | 'approved' | 'processing' | 'paid' | 'rejected' | 'on_hold';
  approvedBy?: string;
  paidAt?: string;
  transactionRef?: string;
  notes?: string;
  createdAt: string;
}

export interface IAuditLog {
  _id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}
