export type UserRole = 'admin' | 'student' | 'teacher' | 'businessman' | 'entrepreneur' | 'normal' | 'user';

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  dob: string;
  roles: UserRole[];
  avatarUrl?: string;
  bio?: string;
  location?: string;
  education?: string;
  professionalDetails?: string;
  privacySettings?: {
    hideContact?: boolean;
    publicProfile?: boolean;
  };
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  status: 'active' | 'suspended' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

export interface ISavedItem {
  _id: string;
  userId: string;
  targetId: string;
  targetType: 'product' | 'service' | 'course' | 'job' | 'event' | 'community';
  title: string;
  category: string;
  image?: string;
  price?: number | null;
  url?: string;
  createdAt: string;
}

export interface IBusiness {
  _id: string;
  ownerId: string;
  businessName: string;
  businessType: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  email: string;
  verificationStatus: 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended' | 'blocked';
  rejectionReason?: string;
  logoUrl?: string;
  documents?: {
    documentType: string;
    documentUrl: string;
    uploadedAt: string;
  }[];
  createdAt: string;
}

export interface IProduct {
  _id: string;
  businessId: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  variants: {
    name: string;
    options: string[];
    priceOffset: number;
    stock: number;
  }[];
  specifications: { key: string; value: string }[];
  images: string[];
  status: string;
  isFeatured: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
}

export interface IService {
  _id: string;
  businessId: string;
  title: string;
  description: string;
  category: string;
  pricingType: 'fixed' | 'quote';
  price?: number;
  serviceArea: string;
  availabilitySchedule: string;
  images: string[];
  createdAt: string;
}

export interface ICartItem {
  productId: string;
  businessId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
}

export interface ICart {
  items: ICartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  userId: string;
  items: ICartItem[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
}

export interface ICourse {
  _id: string;
  instructorId: string;
  instructorName?: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnailUrl: string;
  modules: {
    title: string;
    order: number;
    lessons: {
      title: string;
      duration: string;
      videoUrl?: string;
      content?: string;
    }[];
  }[];
  isFree: boolean;
  status: string;
  enrolledStudentsCount: number;
  rating?: number;
  createdAt: string;
}

export interface ILiveClass {
  _id: string;
  instructorId: string;
  instructorName?: string;
  title: string;
  subject: string;
  description: string;
  scheduledDate: string;
  startTime: string;
  durationMinutes: number;
  studentCapacity: number;
  enrolledCount: number;
  meetingId: string;
  status: string;
  createdAt: string;
}

export interface IStudyMaterial {
  _id: string;
  authorId: string;
  authorName?: string;
  title: string;
  subject: string;
  topic: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  moderationStatus: string;
  downloadsCount: number;
  createdAt: string;
}

export interface ITuition {
  _id: string;
  teacherId: string;
  teacherName?: string;
  subject: string;
  educationLevel: string;
  description: string;
  schedule: string;
  format: 'online' | 'offline' | 'hybrid';
  fee: number;
  status: string;
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

export interface IJob {
  _id: string;
  businessId: string;
  businessName: string;
  postedBy: string;
  title: string;
  description: string;
  category: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  experienceLevel: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  location: string;
  workMode: 'remote' | 'on-site' | 'hybrid';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  deadline: string;
  status: string;
  applicantsCount?: number;
  createdAt: string;
}

export interface IJobApplication {
  _id: string;
  jobId: string;
  jobTitle?: string;
  businessId?: string;
  applicantId: string;
  fullName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter?: string;
  status: string;
  appliedAt: string;
}

export interface ISharedLink {
  _id: string;
  creatorId: string;
  targetType: 'product' | 'service' | 'job';
  targetId: string;
  code: string;
  fullUrl: string;
  clickCount: number;
  title: string;
  createdAt: string;
}

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  link?: string;
  isRead: boolean;
  createdAt: string;
}
