# Business Hub – Unified MERN Stack Enterprise SaaS Platform

> **Everything Your Business and Career Needs in One Place.**  
> Discover products, explore services, learn new skills, connect with opportunities, and grow your business with Business Hub.

---

## 🌟 Executive Overview
**Business Hub** is an all-in-one scalable digital SaaS ecosystem uniting:
1. **Multi-Vendor Marketplace** (Hardware, software, accessories & professional services with strict seller privacy)
2. **Online Education & Live Masterclasses** (100% Free courses, WebRTC virtual classrooms, PDF study notes, and tuition)
3. **Jobs & Career Opportunities** (Direct listings from verified employers with internal application tracking)
4. **Clean Link Sharing & Click Analytics** (Privacy-preserving link generator, zero MLM commission pyramid wallets)
5. **Role-Specific Dashboards** (Student, Teacher, Businessman, Entrepreneur, Normal User)
6. **Centralized Admin Management** (RBAC, Business Approvals, Teacher Compensation, Audit Logging, and System Metrics)

---

## 🚀 Monorepo Architecture & Folder Structure

```
Business_Hub_2/
├── admin-website/          # React Admin Control Center (Vite + React + Recharts + Redux)
├── admin-mobile/           # React Native / Expo Admin Mobile App
├── users-website/          # React Users Website (Vite + React + TS + Tailwind + Redux)
├── user-mobile/            # React Native / Expo Users Mobile App
├── backend/                # ONE Common Unified Node.js / Express / TypeScript Backend
│   ├── src/
│   │   ├── config/         # Environment, ports, database connectors
│   │   ├── middleware/     # JWT Auth, RBAC, 18+ Age Validation, Audit Logger, Uploads
│   │   ├── modules/
│   │   │   ├── auth/       # Registration, Login, OTP verification, Password Reset
│   │   │   ├── users/      # User management, role assignment, suspensions
│   │   │   ├── business/   # Enterprise verification, legal doc filings
│   │   │   ├── marketplace/# Products, Services, Cart, Orders, Idempotent Payments
│   │   │   ├── education/  # Free courses, WebRTC live classes, Materials, Tuition
│   │   │   ├── jobs/       # Career vacancies & applicant tracking
│   │   │   ├── sharing/    # Privacy-preserving shareable links & click metrics
│   │   │   ├── admin/      # Aggregate KPIs, audit logs, platform toggles
│   │   │   └── notifications/
│   │   ├── services/       # Persistent JSON DB storage engine (fallback for zero-config run)
│   │   ├── utils/          # Database seeder with realistic test data
│   │   ├── app.ts          # Express application & route mounts
│   │   └── server.ts       # Server bootstrap on port 5000
│   ├── tests/              # Automated unit and integration test suite
│   ├── .env                # Local development environment configuration
│   ├── .env.example        # Environment variable template
│   ├── .gitignore          # Backend ignore rules
│   └── package.json
│
├── docs/                   # PRD.md, API-DOCUMENTATION.md, DATABASE-SCHEMA.md
├── packages/               # Shared packages (types, utils, validation, config)
├── infrastructure/docker/  # Dockerfiles & docker-compose.yml
├── package.json            # Root workspace configuration
└── README.md
```

---

## 🔑 Demo Login Credentials

The database comes pre-seeded with realistic demonstration accounts:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@businesshub.com` | `admin12345` | Full Admin Console, Approvals, Compensation, Audit Logs |
| **🎓 Teacher** | `teacher@businesshub.com` | `teacher12345` | Course Authoring, Live Class Hosting, Stipend Tracking |
| **📚 Student** | `student@businesshub.com` | `student12345` | Free Course Enrollment, Live Classrooms, Jobs, Orders |
| **🏢 Businessman** | `business@businesshub.com` | `business12345` | Apex Global Technologies (Approved), Product & Job Publishing |
| **🚀 Entrepreneur**| `entrepreneur@businesshub.com` | `business12345` | NextGen Robotics (Pending Verification), Startup Workspace |
| **👤 Normal User** | `user@businesshub.com` | `user12345` | Marketplace Purchasing, Link Sharing, Career Exploration |

*(Note: In the login screen on the Users Website, one-click demo test account buttons are available for instant testing without typing).*

---

## 🛡️ Critical PRD Requirements & Architectural Compliance

### 1. Strict Seller Privacy
- In all public marketplace views, product search results, and shared links, **business owner names, private mobile numbers, and personal identity documents are completely omitted**.
- Only verified catalog information (product title, specs, category, pricing, reviews) is returned by the public API.
- Legal documents are restricted exclusively to authorized administrators.

### 2. 100% Free Education & Teacher Compensation
- Every student can enroll in courses, download lecture PDF notes, and join interactive live masterclasses with zero tuition.
- Teachers receive compensation stipends approved directly by administrators upon live class completion.
- Anti-duplicate payment safeguards prevent double payout for the same class session.

### 3. Strict 18+ Age Validation
- The registration flow calculates user age based on Date of Birth.
- Anyone under 18 years is blocked on the client and rejected by backend middleware with an explicit validation error.

### 4. Idempotent Checkout & Stock Reservation
- Checkout operations accept unique idempotency keys to eliminate double callbacks or duplicate order placements.
- Inventory is deducted upon confirmed payment.

### 5. Clean Link Sharing (No Pyramid Schemes)
- Clean link generation for Products, Services, and Jobs.
- Direct shortcuts to WhatsApp, Twitter, LinkedIn, and native device share sheets.
- No affiliate earnings, commission wallets, or multi-level marketing gimmicks.

---

## ⚡ Quick Start Guide

### Step 1: Start the Backend
```bash
cd backend
npm install
npm run dev
```
*API runs at `http://localhost:5000` (Health check at `http://localhost:5000/api/health`).*

### Step 2: Start the Users Website
```bash
cd users-website
npm install
npm run dev
```
*Users website runs at `http://localhost:3000`.*

### Step 3: Start the Admin Website
```bash
cd admin-website
npm install
npm run dev
```
*Admin panel runs at `http://localhost:3001`.*

---

## 🐳 Docker Deployment
```bash
cd infrastructure/docker
docker-compose up --build
```
This spins up MongoDB, Node.js API, Users Website, and Admin Website in isolated containers.
