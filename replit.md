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
- **Users**: Authentication and profile data with role assignment, character selection (preset or upload), phone number
- **Customer Profiles**: Comprehensive health and preference data from quiz responses
- **Consultations**: Doctor appointments with scheduled date/time, doctor name, meeting type, and status tracking
- **Milestones**: 5-stage progress tracking (Physician Consultation → Test Collection → Discussion → Diet Chart → Meal Delivery)
- **Reports**: Store health assessments and diagnostic results for user download
- **Payment Sessions**: Track consultation payment status with dummy gateway integration (₹1,999 fee)
- **Orders**: Meal order management with status workflow
- **Subscriptions**: Customer plan enrollment and billing
- **Sessions**: Secure session storage for authentication

**Data Access Pattern**
- Storage abstraction layer (IStorage interface) allows for flexible implementations
- In-memory storage (MemStorage) currently used for all environments
- Database schema synced with PostgreSQL via Drizzle migrations

**Backend API Routes**
- POST /api/signup-with-consultation: Creates user account with consultation booking and initial milestones
- POST /api/payment/complete-dummy: Marks dummy payment as completed
- GET /api/auth/user: Retrieves authenticated user details
- GET /api/admin/customers: Lists all customer accounts (admin only)
- PATCH /api/admin/milestones/:id: Updates milestone status (admin only)

### External Dependencies

**Third-Party Services**
- **Stripe**: Payment processing integration (@stripe/stripe-js, @stripe/react-stripe-js)
- **Replit Auth**: OAuth authentication provider via OpenID Connect
- **Neon Database**: Serverless PostgreSQL hosting with WebSocket support

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