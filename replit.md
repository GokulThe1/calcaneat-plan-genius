# Premium Meal Delivery Platform

## Overview

A comprehensive meal delivery platform offering two distinct service paths: a **Premium Clinical Plan** with medical supervision and personalized health assessments, and an **AI-Assisted Plan** with intelligent meal planning through interactive questionnaires. The platform serves customers seeking personalized nutrition solutions while providing specialized dashboards for administrative staff, kitchen operations, and delivery personnel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React with TypeScript for type safety and component-based architecture
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching
- shadcn/ui component library built on Radix UI primitives

**Styling Approach**
- Tailwind CSS with custom design system based on health/wellness aesthetic
- Custom color palette supporting light/dark modes with HSL color variables
- Typography: Plus Jakarta Sans (headings), Inter (body), JetBrains Mono (numerical data)
- Design inspired by premium health services (HelloFresh, Factor, BetterMe)

**State Management Strategy**
- Server state managed through React Query with automatic caching and invalidation
- Local UI state handled with React hooks
- Authentication state integrated with query system
- No global state management library needed due to server-driven architecture

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the API layer
- Session-based authentication using express-session with PostgreSQL storage
- RESTful API design with role-based access control (customer, admin, clinical, kitchen, delivery)

**Authentication System**
- OpenID Connect integration with Replit Auth
- Passport.js strategy for OAuth flow
- Session persistence in PostgreSQL via connect-pg-simple
- Role-based middleware for endpoint protection
- Auto-login support: New users are automatically logged in after signup for 7 days
- Session types: OIDC sessions (with token refresh) and auto-login sessions (7-day fixed expiration)

**API Design Patterns**
- Centralized error handling middleware
- Request/response logging for API endpoints
- Type-safe route handlers with shared schema validation
- Middleware chain for authentication and authorization

### Data Layer

**Database Architecture**
- PostgreSQL via Neon serverless (WebSocket connections)
- Drizzle ORM for type-safe database queries and migrations
- Schema-first design with Zod validation for runtime type checking

**Core Data Models**
- **Users**: Authentication and profile data with role assignment (customer, admin, consultant, lab_technician, nutritionist, chef, delivery), character selection, phone number
- **Customer Profiles**: Comprehensive health and preference data from quiz responses
- **Consultations**: Doctor appointments with scheduled date/time, doctor name, meeting type, and status tracking
- **Milestones**: 5-stage progress tracking (Physician Consultation → Test Collection → Discussion → Diet Chart → Meal Delivery)
- **Reports**: Store health assessments and diagnostic results for user download
- **Payment Sessions**: Track consultation payment status with dummy gateway integration (₹1,999 fee)
- **Orders**: Meal order management with status workflow
- **Subscriptions**: Customer plan enrollment and billing
- **Sessions**: Secure session storage for authentication
- **Acknowledgements**: Task assignment and staff confirmation tracking with UUID IDs, status (pending/acknowledged/completed), timestamps
- **Staff Activity Log**: Comprehensive audit trail of all staff actions with metadata (document uploads, task acknowledgements, deliveries)
- **Delivery Location**: Real-time GPS tracking for delivery personnel with latitude/longitude coordinates and status

**Data Access Pattern**
- Storage abstraction layer (IStorage interface) allows for flexible implementations
- **DbStorage**: Production database storage using Drizzle ORM for PostgreSQL persistence
- **MemStorage**: In-memory storage available for testing (data lost on restart)
- Database schema synced with PostgreSQL via Drizzle migrations
- All user signups, consultations, milestones, and payments are persisted to PostgreSQL

**Backend API Routes**

*Authentication & User*
- POST /api/signup-with-consultation: Creates user account with consultation booking and initial milestones
- POST /api/payment/complete-dummy: Marks dummy payment as completed
- GET /api/auth/user: Retrieves authenticated user details

*Consultant Routes*
- GET /api/consultant/customers: Lists all customers for consultant
- POST /api/consultant/upload-report: Uploads medical reports for stages 1 & 3

*Lab Technician Routes*
- GET /api/lab/customers: Lists all customers for lab technician
- POST /api/lab/upload-report: Uploads test reports for stage 2

*Nutritionist Routes*
- GET /api/nutritionist/customers: Lists customers with completed stage 3
- POST /api/nutritionist/upload-diet-chart: Uploads diet charts for stage 4

*Chef Routes*
- GET /api/chef/active-plans: Lists active diet plans for meal preparation
- POST /api/chef/mark-prepared: Marks meals as prepared with activity logging

*Delivery Routes*
- GET /api/delivery/assigned: Lists assigned deliveries
- PATCH /api/delivery/status/:orderId: Updates delivery status
- POST /api/delivery/location: Updates GPS location for delivery tracking

*Acknowledgement Routes*
- POST /api/acknowledgements: Creates new acknowledgement with activity logging
- PATCH /api/acknowledgements/:id: Updates acknowledgement status (validated with Zod, returns 404 if not found)
- GET /api/acknowledgements/staff: Gets staff's acknowledgements
- GET /api/admin/acknowledgements: Gets all acknowledgements (admin only)

*Activity Log Routes*
- GET /api/activity/staff: Gets staff's activity logs
- GET /api/activity/customer/:userId: Gets customer's activity logs
- GET /api/admin/activity: Gets all activity logs (admin only)

*Admin Routes*
- GET /api/admin/customers: Lists all customer accounts
- GET /api/admin/delivery-locations: Gets all delivery personnel locations
- GET /api/admin/staff/:role: Gets staff members by role
- PATCH /api/admin/milestones/:id: Updates milestone status
- POST /api/admin/documents: Creates document record after upload

*Object Storage*
- POST /api/objects/upload: Gets presigned URL for file upload
- GET /objects/:objectPath: Downloads private files with ACL verification

### External Dependencies

**Third-Party Services**
- **Stripe**: Payment processing integration (@stripe/stripe-js, @stripe/react-stripe-js)
- **Replit Auth**: OAuth authentication provider via OpenID Connect
- **Neon Database**: Serverless PostgreSQL hosting with WebSocket support
- **Replit Object Storage**: Google Cloud Storage-backed file storage for protected document uploads
  - Presigned URL uploads via Uppy for medical documents, test results, and diet charts
  - ACL-based access control (owner-based permissions)
  - Private document directory with authenticated download endpoints

**Development Tools**
- **Replit Plugins**: Runtime error overlay, cartographer (dev mode), dev banner
- **Drizzle Kit**: Database migrations and schema management

**UI Component Libraries**
- **Radix UI**: Accessible, unstyled component primitives for custom design system
- **Lucide React**: Icon library for consistent iconography
- **Recharts**: Data visualization for nutritional charts (via chart components)

**Form & Validation**
- **React Hook Form**: Form state management with @hookform/resolvers
- **Zod**: Runtime schema validation integrated with Drizzle

**Utilities**
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional className utilities
- **memoizee**: Function memoization for performance optimization

## Recent Implementation (October 2025)

### Clinical Staff Workflow System - Complete

**All 19 Tasks Completed ✅**

The comprehensive clinical staff workflow system is now fully implemented with role-based panels, acknowledgement tracking, activity logging, and delivery sync.

**Clinical Staff Roles**
- **Consultant**: Handles physician consultations (Stage 1) and discussion reports (Stage 3)
- **Lab Technician**: Manages test collection and uploads test reports (Stage 2)
- **Nutritionist**: Creates diet charts and meal plans (Stage 4)
- **Chef**: Views active plans, marks meals as prepared (auto-creates delivery orders)
- **Delivery**: Manages deliveries with GPS tracking and status updates
- **Admin**: Monitors all staff, acknowledgements, delivery tracking, and reports

**Implemented Panels**
1. **Consultant Panel** (/consultant): Customer list, Stage 1 & 3 uploads, patient overview, acknowledgements
2. **Lab Technician Panel** (/lab): Customer queue, Stage 2 uploads, test log, acknowledgements
3. **Nutritionist Panel** (/nutritionist): Customer queue, Stage 4 diet charts, edit charts, acknowledgements
4. **Chef Panel** (/chef): Active diet plans, mark meals as prepared (auto-creates orders)
5. **Delivery Panel** (/delivery-panel): Assigned deliveries, status updates, GPS tracking
6. **Admin Panel** (/admin): Staff monitoring, acknowledgements, delivery tracking, report access

**Key Features Implemented**
- **Acknowledgement System**: UUID-based task tracking with status flow (pending → acknowledged → completed)
- **Activity Logging**: Comprehensive audit trail of all staff actions with metadata
- **Delivery Sync**: Chef marks prepared → auto-creates order (status: 'prepared') → admin assigns → delivery updates to 'delivered'
- **GPS Tracking**: Real-time delivery location updates with latitude/longitude
- **PDF Generation**: Server-side diet chart and consolidated report generation using pdfkit
- **Notification System**: Toast notifications for stage completions, acknowledgement reminders, delivery alerts
- **Role-Based Navigation**: AuthenticatedLayout with RoleBasedSidebar showing role-specific menus
- **Object Storage**: Presigned URL uploads via Uppy with ACL-based access control

**Technical Implementation**
- Database: Extended schema with acknowledgements, staff_activity_log, delivery_location tables
- API: 40+ endpoints with role-based middleware protection
- Order Status Flow: 'prepared' → 'in_transit' → 'delivered' (aligned across all routes)
- Query Invalidation: Customer-specific cache invalidation on all mutations
- Address Validation: Guards prevent order creation without delivery addresses
- **Payment Gateway**: Razorpay initialization is optional (gracefully handles missing secrets, excludes payment for now)

**6-Stage Clinical Workflow**
1. Stage 1: Physician Consultation (consultant uploads)
2. Stage 2: Test Collection (lab technician uploads)
3. Stage 3: Discussion (consultant uploads)
4. Stage 4: Diet Chart (nutritionist uploads)
5. Stage 5: Payment (manual/excluded)
6. Stage 6: Meal Delivery (chef → admin → delivery)