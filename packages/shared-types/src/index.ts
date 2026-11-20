// Role Types
export type UserRole = 'admin' | 'student' | 'teacher' | 'businessman' | 'entrepreneur' | 'normal';

export type UserStatus = 'active' | 'suspended' | 'blocked';

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  dob: string;
  roles: UserRole[];
  avatarUrl?: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// Business Types
export type BusinessType = 'retail' | 'services' | 'technology' | 'manufacturing' | 'education' | 'other';
export type VerificationStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended' | 'blocked';

export interface IBusiness {
  _id: string;
  ownerId: string;
  businessName: string;
  businessType: BusinessType;
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
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  logoUrl?: string;
  documents?: {
    documentType: string;
    documentUrl: string;
    uploadedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Marketplace Types
export interface IProductVariant {
  name: string;
  options: string[];
  priceOffset: number;
  stock: number;
}

export interface IProductSpecification {
  key: string;
  value: string;
}

export type ListingStatus = 'draft' | 'pending' | 'approved' | 'rejected';

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
  variants: IProductVariant[];
  specifications: IProductSpecification[];
  images: string[];
  status: ListingStatus;
  isFeatured: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
  updatedAt: string;
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
  status: ListingStatus;
  createdAt: string;
}

export interface ICartItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
  businessId: string;
}

export interface ICart {
  items: ICartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IOrderItem {
  productId: string;
  businessId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  userId: string;
  items: IOrderItem[];
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
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

// Education Types
export interface ILesson {
  _id?: string;
  title: string;
  duration: string;
  videoUrl?: string;
  content?: string;
  materials?: {
    name: string;
    fileUrl: string;
  }[];
}

export interface ICourseModule {
  _id?: string;
  title: string;
  order: number;
  lessons: ILesson[];
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
  modules: ICourseModule[];
  isFree: boolean;
  status: 'draft' | 'pending' | 'published';
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
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
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
  moderationStatus: 'pending' | 'approved' | 'rejected';
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
  status: 'active' | 'paused';
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

// Job Types
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
  status: 'active' | 'closed';
  applicantsCount?: number;
  createdAt: string;
}

export interface IJobApplication {
  _id: string;
  jobId: string;
  jobTitle?: string;
  applicantId: string;
  fullName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter?: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'rejected' | 'accepted';
  appliedAt: string;
}

// Sharing & Referral Types
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

// Notification & Audit Types
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
