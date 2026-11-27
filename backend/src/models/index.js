import mongoose from 'mongoose';

// Schema generator with string ID and timestamps
const createSchema = (fields = {}, options = {}) => {
  return new mongoose.Schema(
    {
      _id: { type: String, required: true },
      ...fields,
    },
    {
      strict: false,
      timestamps: true,
      ...options,
    }
  );
};

// 1. User Model
export const User = mongoose.models.User || mongoose.model('User', createSchema({
  email: { type: String, required: true, lowercase: true, index: true },
  mobile: { type: String, required: true, index: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  roles: [{ type: String }],
  status: { type: String, default: 'active' },
  verificationStatus: { type: String, default: 'approved' },
}));

// 2. Business Model
export const Business = mongoose.models.Business || mongoose.model('Business', createSchema({
  ownerId: { type: String, required: true, index: true },
  roleType: { type: String, index: true },
  businessName: { type: String, required: true },
  category: { type: String },
  subcategory: { type: String },
  businessType: { type: String },
  verificationStatus: { type: String, default: 'pending', index: true },
}));

// 3. Service Request Model
export const ServiceRequest = mongoose.models.ServiceRequest || mongoose.model('ServiceRequest', createSchema({
  title: { type: String, required: true },
  category: { type: String, index: true },
  userId: { type: String, required: true, index: true },
  assignedBusinessId: { type: String, index: true },
  status: { type: String, default: 'new', index: true },
}));

// 4. Business Connection Model
export const BusinessConnection = mongoose.models.BusinessConnection || mongoose.model('BusinessConnection', createSchema({
  requestId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  businessId: { type: String, required: true, index: true },
  status: { type: String, default: 'pending_acceptance', index: true },
}));

// 5. Product Model
export const Product = mongoose.models.Product || mongoose.model('Product', createSchema({
  title: { type: String, required: true },
  category: { type: String, index: true },
  price: { type: Number, required: true },
  businessId: { type: String, index: true },
  active: { type: Boolean, default: true },
}));

// 6. Service Model
export const Service = mongoose.models.Service || mongoose.model('Service', createSchema({
  name: { type: String, required: true },
  category: { type: String, index: true },
  businessId: { type: String, index: true },
  active: { type: Boolean, default: true },
}));

// 7. Order Model
export const Order = mongoose.models.Order || mongoose.model('Order', createSchema({
  userId: { type: String, required: true, index: true },
  orderStatus: { type: String, default: 'pending', index: true },
}));

// 8. Cart Model
export const Cart = mongoose.models.Cart || mongoose.model('Cart', createSchema({
  userId: { type: String, required: true, unique: true, index: true },
  items: [{ type: Object }],
}));

// 9. Course Model
export const Course = mongoose.models.Course || mongoose.model('Course', createSchema({
  title: { type: String, required: true },
  teacherId: { type: String, index: true },
}));

// 10. Enrollment Model
export const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', createSchema({
  studentId: { type: String, required: true, index: true },
  courseId: { type: String, required: true, index: true },
}));

// 11. Live Class Model
export const LiveClass = mongoose.models.LiveClass || mongoose.model('LiveClass', createSchema({
  title: { type: String, required: true },
  teacherId: { type: String, index: true },
}));

// 12. Study Material Model
export const StudyMaterial = mongoose.models.StudyMaterial || mongoose.model('StudyMaterial', createSchema({
  title: { type: String, required: true },
  teacherId: { type: String, index: true },
}));

// 13. Tuition Model
export const Tuition = mongoose.models.Tuition || mongoose.model('Tuition', createSchema({
  subject: { type: String, required: true },
  teacherId: { type: String, index: true },
}));

// 14. Teacher Payment Model
export const TeacherPayment = mongoose.models.TeacherPayment || mongoose.model('TeacherPayment', createSchema({
  teacherId: { type: String, required: true, index: true },
  status: { type: String, default: 'pending', index: true },
}));

// 15. Job Model
export const Job = mongoose.models.Job || mongoose.model('Job', createSchema({
  title: { type: String, required: true },
  businessId: { type: String, index: true },
  status: { type: String, default: 'active', index: true },
}));

// 16. Job Application Model
export const JobApplication = mongoose.models.JobApplication || mongoose.model('JobApplication', createSchema({
  jobId: { type: String, required: true, index: true },
  applicantId: { type: String, required: true, index: true },
  status: { type: String, default: 'submitted', index: true },
}));

// 17. Notification Model
export const Notification = mongoose.models.Notification || mongoose.model('Notification', createSchema({
  userId: { type: String, required: true, index: true },
  isRead: { type: Boolean, default: false, index: true },
}));

// 18. Verification Document Model
export const VerificationDocument = mongoose.models.VerificationDocument || mongoose.model('VerificationDocument', createSchema({
  userId: { type: String, index: true },
  draftId: { type: String, index: true },
  requirementId: { type: String, index: true },
  status: { type: String, default: 'Uploaded', index: true },
}));

// 19. Document Requirement Model
export const DocumentRequirement = mongoose.models.DocumentRequirement || mongoose.model('DocumentRequirement', createSchema({
  role: { type: String, index: true },
  isMandatory: { type: Boolean, default: true },
}));

// 20. Registration Draft Model
export const RegistrationDraft = mongoose.models.RegistrationDraft || mongoose.model('RegistrationDraft', createSchema({
  draftId: { type: String, required: true, unique: true, index: true },
  email: { type: String, index: true },
  mobile: { type: String, index: true },
}));

// 21. Audit Log Model
export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', createSchema({
  userId: { type: String, index: true },
  action: { type: String, index: true },
}));

// 22. Saved Item Model
export const SavedItem = mongoose.models.SavedItem || mongoose.model('SavedItem', createSchema({
  userId: { type: String, required: true, index: true },
  itemId: { type: String, required: true, index: true },
}));

// 23. Shared Link Model
export const SharedLink = mongoose.models.SharedLink || mongoose.model('SharedLink', createSchema({
  code: { type: String, required: true, unique: true, index: true },
  ownerId: { type: String, index: true },
}));

// 24. Document Audit Log Model
export const DocumentAuditLog = mongoose.models.DocumentAuditLog || mongoose.model('DocumentAuditLog', createSchema({
  documentId: { type: String, index: true },
  userId: { type: String, index: true },
}));

// 25. OTP Code Model
export const OtpCode = mongoose.models.OtpCode || mongoose.model('OtpCode', createSchema({
  email: { type: String, index: true },
  mobile: { type: String, index: true },
  code: { type: String, required: true },
}));

// 26. Category Taxonomy Models
export const Category = mongoose.models.Category || mongoose.model('Category', createSchema({
  name: { type: String, required: true, index: true },
  role: { type: String, index: true },
}));

export const ServiceCategory = mongoose.models.ServiceCategory || mongoose.model('ServiceCategory', createSchema({
  name: { type: String, required: true },
}));

export const MaterialCategory = mongoose.models.MaterialCategory || mongoose.model('MaterialCategory', createSchema({
  name: { type: String, required: true },
}));

// 27. Platform Setting Model
export const PlatformSetting = mongoose.models.PlatformSetting || mongoose.model('PlatformSetting', createSchema({
  key: { type: String, default: 'default_settings', unique: true, index: true },
}));

// 28. Quotation Request Model
export const QuotationRequest = mongoose.models.QuotationRequest || mongoose.model('QuotationRequest', createSchema({
  requesterId: { type: String, required: true, index: true },
  listingId: { type: String, index: true },
  listingType: { type: String, index: true },
  category: { type: String, index: true },
  status: { type: String, default: 'new', index: true },
  selectionMode: { type: String, default: 'ADMIN' },
  requesterCanViewAllQuotations: { type: Boolean, default: false },
  requesterCanSelectQuotation: { type: Boolean, default: false },
  selectedQuotationId: { type: String, index: true },
  selectedBusinessId: { type: String, index: true },
}));

// 29. Quotation Invitation Model
export const QuotationInvitation = mongoose.models.QuotationInvitation || mongoose.model('QuotationInvitation', createSchema({
  requestId: { type: String, required: true, index: true },
  businessId: { type: String, required: true, index: true },
  ownerId: { type: String, index: true },
  status: { type: String, default: 'sent', index: true },
}));

// 30. Quotation Model
export const Quotation = mongoose.models.Quotation || mongoose.model('Quotation', createSchema({
  requestId: { type: String, required: true, index: true },
  invitationId: { type: String, index: true },
  businessId: { type: String, required: true, index: true },
  ownerId: { type: String, index: true },
  status: { type: String, default: 'submitted', index: true },
  totalAmount: { type: Number },
}));

// 31. Live Class Registration Model
export const LiveClassRegistration = mongoose.models.LiveClassRegistration || mongoose.model('LiveClassRegistration', createSchema({
  liveClassId: { type: String, required: true, index: true },
  studentId: { type: String, required: true, index: true },
  status: { type: String, default: 'registered', index: true },
}));

// 32. Live Class Attendance Model
export const LiveClassAttendance = mongoose.models.LiveClassAttendance || mongoose.model('LiveClassAttendance', createSchema({
  liveClassId: { type: String, required: true, index: true },
  studentId: { type: String, required: true, index: true },
  status: { type: String, default: 'present', index: true },
}));

// 33. Lesson Progress Model
export const LessonProgress = mongoose.models.LessonProgress || mongoose.model('LessonProgress', createSchema({
  courseId: { type: String, required: true, index: true },
  lessonId: { type: String, required: true, index: true },
  studentId: { type: String, required: true, index: true },
  isCompleted: { type: Boolean, default: false, index: true },
}));

// 34. Education Category Model
export const EducationCategory = mongoose.models.EducationCategory || mongoose.model('EducationCategory', createSchema({
  name: { type: String, required: true, index: true },
  slug: { type: String, required: true, index: true },
  isActive: { type: Boolean, default: true, index: true },
}));

// Model Registry Dictionary
export const modelsMap = {
  users: User,
  businesses: Business,
  serviceRequests: ServiceRequest,
  businessConnections: BusinessConnection,
  quotationRequests: QuotationRequest,
  quotationInvitations: QuotationInvitation,
  quotations: Quotation,
  products: Product,
  services: Service,
  orders: Order,
  carts: Cart,
  courses: Course,
  enrollments: Enrollment,
  liveClasses: LiveClass,
  attendances: LiveClassAttendance,
  liveClassRegistrations: LiveClassRegistration,
  lessonProgress: LessonProgress,
  materials: StudyMaterial,
  tuitions: Tuition,
  teacherPayments: TeacherPayment,
  jobs: Job,
  jobApplications: JobApplication,
  notifications: Notification,
  verificationDocuments: VerificationDocument,
  documentRequirements: DocumentRequirement,
  registrationDrafts: RegistrationDraft,
  auditLogs: AuditLog,
  savedItems: SavedItem,
  sharedLinks: SharedLink,
  documentAuditLogs: DocumentAuditLog,
  otpCodes: OtpCode,
  categories: Category,
  serviceCategories: ServiceCategory,
  materialCategories: MaterialCategory,
  educationCategories: EducationCategory,
  platformSettings: PlatformSetting,
};
