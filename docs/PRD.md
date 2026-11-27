# Product Requirements Document (PRD) - Business Hub SaaS

## 1. Executive Summary
**Business Hub** is an all-in-one scalable digital SaaS ecosystem uniting:
- Multi-Vendor Marketplace (Products & Services) with strict seller privacy protections
- Education & Skill Development (100% Free Courses, Free Live Classes with WebRTC, Downloadable PDF Notes, Flexible Tuition)
- Jobs & Career Opportunities Portal
- Clean Link Sharing & Referral Tracking (No financial commissions or pyramid wallet gimmicks)
- Role-Specific Dashboards (Student, Teacher, Businessman, Entrepreneur, General User)
- Centralized High-Security Admin Control Panel (RBAC, Business Approvals, Teacher Compensation, Audit Logging, System Analytics)

## 2. User Personas & Role-Based Access Control (RBAC)
All users must be verified to be at least 18 years old.

### 2.1 User Roles
1. **Admin**: Complete system oversight, business and course verification, live class monitoring, teacher compensation approval, audit log inspection.
2. **Student**: Free course enrollment, live class attendance, notes downloads, tuition requests, job applications, marketplace ordering.
3. **Teacher**: Course authoring, live class scheduling, PDF notes publication, student attendance management, compensation tracking.
4. **Businessman / Entrepreneur**: Business verification application, catalog management (Products/Services), inventory tracking, order fulfillment, job postings.
5. **General User**: Marketplace purchasing, basic job exploration, link sharing.

## 3. Core Modules & Key Specifications

### 3.1 Authentication & Security
- Email/Mobile OTP verification flow.
- JWT Access & Refresh Token strategy with HTTP-only cookies and Authorization headers.
- Bcrypt password hashing (minimum 10 salt rounds).
- Strict 18+ Date of Birth enforcement.
- Role-based route guards and granular backend middleware permissions.

### 3.2 Marketplace & Seller Privacy
- Comprehensive catalog: Categories, tags, price, stock, variants, specifications.
- **Strict Privacy Rule**: Public marketplace items NEVER expose seller personal identities, owner names, phone numbers, or private legal details.
- Cart, checkout, subtotal calculation, tax, shipping, and mock/pluggable payment gateway with idempotency.
- Stock reservation, order status workflows (Pending, Confirmed, Shipped, Delivered, Cancelled, Refunded).

### 3.3 Education & Live Classes
- **Free Courses**: Structured modules, video lessons, text guides, downloadable resources.
- **Free Live Classes**: Teacher scheduling, student capacity limits, attendance logging.
- **Teacher Compensation**: Admin reviews completed classes and approves fair stipends directly with anti-duplicate payment guards.
- **Study Materials**: Verified PDF notes with subject/topic taxonomy and admin moderation.
- **Tuition**: Teacher listing with custom subject schedules, configurable inquiries.

### 3.4 Jobs & Career Module
- Postings exclusive to Admin and Verified Businesses.
- Filters: Title, category, work mode (Remote/On-site/Hybrid), experience level, salary range.
- Internal application tracking with resume and profile attachment.

### 3.5 Link Sharing
- Clean link generation for Products, Services, and Jobs.
- Direct sharing shortcuts (WhatsApp, Twitter/X, LinkedIn, Copy Link).
- Privacy-preserving URLs (no sensitive IDs leaked).
- Basic click analytics tracking. No MLM, affiliate cuts, or commission wallets.

### 3.6 Admin Central Panel
- Live metrics: Total users, active businesses, revenue turnover, pending approvals, ongoing classes.
- Verification workflow: Review legal identity and commercial documents with Approve, Reject, or Request Changes states.
- Teacher Compensation review and payment status management.
- Complete immutable audit logging of critical actions.
