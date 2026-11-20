# Database Schema Specification - Business Hub

All models implemented in Mongoose with strict schema typing, indexes, timestamps, and validation.

## 1. User & Authentication
- **User**: `_id`, `fullName`, `email`, `mobile`, `dob` (enforces >= 18 years), `password` (hashed with bcrypt), `roles` (`['admin' | 'student' | 'teacher' | 'businessman' | 'entrepreneur' | 'normal']`), `isEmailVerified`, `isMobileVerified`, `avatarUrl`, `status` (`['active' | 'suspended' | 'blocked']`), `createdAt`, `updatedAt`
- **Role**: `_id`, `name`, `permissions` (`[string]`), `description`

## 2. Business & Verification
- **Business**: `_id`, `ownerId` (ref: User), `businessName`, `businessType` (`['retail' | 'services' | 'technology' | 'manufacturing' | 'education' | 'other']`), `description`, `address`, `phone`, `email`, `verificationStatus` (`['draft' | 'pending' | 'approved' | 'rejected' | 'suspended' | 'blocked']`), `rejectionReason`, `logoUrl`, `createdAt`, `updatedAt`
- **BusinessVerification**: `_id`, `businessId` (ref: Business), `documentType` (`['tax_id' | 'registration_certificate' | 'identity_proof']`), `documentUrl`, `submittedAt`, `reviewedBy` (ref: User), `reviewedAt`, `reviewNotes`

## 3. Marketplace (Products, Services, Orders)
- **ProductCategory**: `_id`, `name`, `slug`, `icon`, `description`, `isActive`
- **Product**: `_id`, `businessId` (ref: Business), `title`, `slug`, `description`, `category` (ref: ProductCategory), `price`, `discountPrice`, `stock`, `variants` (`[{ name, options, priceOffset, stock }]`), `specifications` (`[{ key, value }]`), `images` (`[string]`), `status` (`['draft' | 'pending' | 'approved' | 'rejected']`), `isFeatured`, `createdAt`, `updatedAt`
  *(Notice: Business owner identity is kept private in public catalog views)*
- **Service**: `_id`, `businessId` (ref: Business), `title`, `description`, `category` (ref: ProductCategory), `pricingType` (`['fixed' | 'quote']`), `price`, `serviceArea`, `availabilitySchedule`, `images` (`[string]`), `status` (`['draft' | 'pending' | 'approved' | 'rejected']`), `createdAt`
- **Cart**: `_id`, `userId` (ref: User), `items` (`[{ productId, variant, quantity, price }]`), `updatedAt`
- **Order**: `_id`, `orderNumber`, `userId` (ref: User), `items` (`[{ productId, businessId, title, price, quantity, subtotal }]`), `shippingAddress`, `subtotal`, `taxAmount`, `shippingFee`, `totalAmount`, `orderStatus` (`['pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded']`), `paymentStatus` (`['pending' | 'paid' | 'failed' | 'refunded']`), `createdAt`, `updatedAt`
- **Payment**: `_id`, `orderId` (ref: Order), `userId` (ref: User), `amount`, `currency`, `provider` (`['stripe' | 'razorpay' | 'mock']`), `transactionId`, `idempotencyKey`, `status`, `createdAt`

## 4. Education (Courses, Live Classes, Notes, Tuition)
- **Course**: `_id`, `instructorId` (ref: User), `title`, `slug`, `description`, `category`, `level` (`['beginner' | 'intermediate' | 'advanced']`), `thumbnailUrl`, `modules` (`[{ title, order, lessons: [{ title, duration, videoUrl, content, materials: [{ name, fileUrl }] }] }]`), `isFree` (true), `status` (`['draft' | 'pending' | 'published']`), `createdAt`
- **Enrollment**: `_id`, `userId` (ref: User), `courseId` (ref: Course), `progressPercentage`, `completedLessons` (`[string]`), `isCompleted`, `enrolledAt`
- **LiveClass**: `_id`, `instructorId` (ref: User), `title`, `subject`, `description`, `scheduledDate`, `startTime`, `durationMinutes`, `studentCapacity`, `meetingId`, `roomToken`, `status` (`['scheduled' | 'live' | 'completed' | 'cancelled']`), `createdAt`
- **ClassAttendance**: `_id`, `classId` (ref: LiveClass), `studentId` (ref: User), `joinedAt`, `leftAt`, `durationMinutes`
- **StudyMaterial**: `_id`, `authorId` (ref: User), `title`, `subject`, `topic`, `fileUrl`, `fileSize`, `fileType`, `moderationStatus` (`['pending' | 'approved' | 'rejected']`), `createdAt`
- **Tuition**: `_id`, `teacherId` (ref: User), `subject`, `educationLevel`, `description`, `schedule`, `format` (`['online' | 'offline' | 'hybrid']`), `fee`, `status`
- **TeacherPayment**: `_id`, `teacherId` (ref: User), `liveClassId` (ref: LiveClass), `amount`, `status` (`['pending' | 'approved' | 'processing' | 'paid' | 'rejected' | 'on_hold']`), `approvedBy` (ref: User), `paidAt`, `transactionRef`, `notes`

## 5. Jobs & Applications
- **Job**: `_id`, `businessId` (ref: Business), `postedBy` (ref: User), `title`, `description`, `category`, `responsibilities` (`[string]`), `requirements` (`[string]`), `skills` (`[string]`), `experienceLevel`, `employmentType` (`['full-time' | 'part-time' | 'contract' | 'internship']`), `location`, `workMode` (`['remote' | 'on-site' | 'hybrid']`), `salaryMin`, `salaryMax`, `currency`, `deadline`, `status` (`['active' | 'closed' | 'expired']`), `createdAt`
- **JobApplication**: `_id`, `jobId` (ref: Job), `applicantId` (ref: User), `fullName`, `email`, `phone`, `resumeUrl`, `coverLetter`, `status` (`['submitted' | 'under_review' | 'shortlisted' | 'rejected' | 'accepted']`), `appliedAt`

## 6. Sharing, Notifications & Auditing
- **SharedLink**: `_id`, `creatorId` (ref: User), `targetType` (`['product' | 'service' | 'job']`), `targetId`, `code`, `fullUrl`, `clickCount`, `createdAt`
- **Notification**: `_id`, `userId` (ref: User), `title`, `message`, `type` (`['info' | 'success' | 'warning' | 'alert']`), `link`, `isRead`, `createdAt`
- **AuditLog**: `_id`, `actorId` (ref: User), `actorRole`, `action`, `entityType`, `entityId`, `details`, `ipAddress`, `createdAt`
- **PlatformSettings**: `_id`, `siteName`, `maintenanceMode`, `allowNewRegistrations`, `emailServiceEnabled`, `paymentProvidersEnabled`, `contactEmail`, `termsVersion`
