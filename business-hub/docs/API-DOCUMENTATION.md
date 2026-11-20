# API Documentation - Business Hub

Base URL: `http://localhost:5000/api`

## 1. Authentication (`/api/auth`)
- `POST /register`: Register with fullName, email, mobile, dob, password, roles, termsAccepted. Enforces >=18 age.
- `POST /login`: Email & password login, returns JWT token & user profile.
- `POST /logout`: Invalidate token / clear cookie.
- `GET /me`: Get current authenticated user profile.
- `POST /send-otp`: Sends Email or SMS verification code.
- `POST /verify-otp`: Confirms OTP code and activates account flag.
- `POST /forgot-password`: Requests password reset token.
- `POST /reset-password`: Resets password using token.

## 2. User & Roles (`/api/users`, `/api/roles`)
- `GET /api/users`: Admin only - Paginated user directory with role/status filters.
- `GET /api/users/:id`: User profile details.
- `PUT /api/users/:id`: Update personal profile info.
- `PUT /api/users/:id/status`: Admin only - Suspend, block, or activate user.
- `PUT /api/users/:id/roles`: Admin only - Assign or revoke roles.

## 3. Business & Verification (`/api/business`, `/api/business-verification`)
- `POST /api/business`: Create/register business profile (Businessman/Entrepreneur).
- `GET /api/business/me`: Get authenticated user's business profile and verification status.
- `PUT /api/business/me`: Update business details.
- `POST /api/business/verification`: Upload verification documents (Tax ID, Registration, ID).
- `GET /api/business-verification`: Admin only - View all pending business applications.
- `PUT /api/business-verification/:id/status`: Admin only - Approve, reject, or request changes.

## 4. Marketplace: Products & Services (`/api/products`, `/api/services`, `/api/categories`)
- `GET /api/products`: Public - Filter by category, price, search, sorting. **Excludes seller private details**.
- `GET /api/products/:id`: Public - Product detail view with variants and specs.
- `POST /api/products`: Verified Business only - Create new product listing.
- `PUT /api/products/:id`: Business owner / Admin - Update product.
- `DELETE /api/products/:id`: Business owner / Admin - Soft delete / archive product.
- `GET /api/business/products`: Business owner - View all products owned by current business with inventory.
- `GET /api/services`: Public - Browse available business services.
- `POST /api/services`: Verified Business only - Create service listing.
- `GET /api/categories`: Public - Retrieve category taxonomy tree.

## 5. Cart, Checkout & Orders (`/api/cart`, `/api/orders`, `/api/payments`)
- `GET /api/cart`: Current user's cart items, subtotal, and tax calculation.
- `POST /api/cart/items`: Add item or update quantity.
- `DELETE /api/cart/items/:id`: Remove item from cart.
- `DELETE /api/cart`: Clear cart.
- `POST /api/orders`: Place order from cart with address and selected payment option.
- `GET /api/orders/my-orders`: Student / User purchase history with real-time tracking status.
- `GET /api/orders/business`: Business owner - Orders received for their products.
- `PUT /api/orders/:id/status`: Business owner / Admin - Update fulfillment status (processing, shipped, delivered).
- `POST /api/payments/process`: Secure payment confirmation with idempotency token.

## 6. Education: Courses, Live Classes, Materials, Tuition (`/api/courses`, `/api/live-classes`, `/api/materials`, `/api/tuition`)
- `GET /api/courses`: Public/Student - Browse all 100% free courses.
- `GET /api/courses/:id`: Course curriculum, module details, and preview.
- `POST /api/courses`: Approved Teacher / Admin - Create comprehensive course.
- `POST /api/courses/:id/enroll`: Student - Free enrollment into course.
- `PUT /api/courses/:id/progress`: Student - Track lesson completion progress.
- `GET /api/live-classes`: Student/Teacher - View scheduled and upcoming free live classes.
- `POST /api/live-classes`: Approved Teacher - Schedule live interactive class.
- `POST /api/live-classes/:id/join`: Student - Join WebRTC live room token generator.
- `POST /api/live-classes/:id/attendance`: Teacher/System - Record student attendance duration.
- `GET /api/materials`: Student - Search and download subject notes and PDF guides.
- `POST /api/materials`: Teacher - Upload PDF study materials for admin moderation.
- `GET /api/tuition`: Browse teacher tuition listings.

## 7. Teacher Compensation (`/api/teacher-payments`)
- `GET /api/teacher-payments`: Admin & Teacher - Payment records and status.
- `POST /api/teacher-payments/approve`: Admin only - Set compensation amount and approve payout.
- `PUT /api/teacher-payments/:id/pay`: Admin only - Mark payment as settled with transaction ref.

## 8. Jobs & Applications (`/api/jobs`, `/api/job-applications`)
- `GET /api/jobs`: Public - Browse and search job opportunities.
- `GET /api/jobs/:id`: View job details, requirements, and deadlines.
- `POST /api/jobs`: Verified Business / Admin - Publish job opening.
- `POST /api/jobs/:id/apply`: Student / User - Submit job application with resume.
- `GET /api/job-applications/my`: User - Track status of personal applications.
- `GET /api/job-applications/business`: Business - Review candidate applications.

## 9. Sharing & Referrals (`/api/shared-links`)
- `POST /api/shared-links`: Generate clean share link for Product, Service, or Job.
- `GET /api/shared-links/:code`: Redirect and increment click metrics without leaking private business metadata.
- `GET /api/shared-links/stats`: View personal shared link click analytics.

## 10. Admin Control & Auditing (`/api/admin`, `/api/audit-logs`, `/api/reports`)
- `GET /api/admin/metrics`: Real-time aggregated SaaS platform statistics.
- `GET /api/audit-logs`: Immutable log of sensitive admin operations.
- `GET /api/reports/sales`: Order and revenue analytics over time.
- `GET /api/reports/users`: User acquisition and role distribution reports.
