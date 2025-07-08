# البيت السوداني - Sudanese House Community App

## Overview

This is a full-stack web application called "البيت السوداني" (Sudanese House) designed to serve the Sudanese community in Kuwait. The app provides a platform for community members to access markets, services, job listings, and announcements. It features a mobile-first design with Arabic (RTL) support and uses modern web technologies for both frontend and backend development.

## System Architecture

The application follows a monorepo structure with a clear separation between client, server, and shared components:

**Frontend Architecture:**
- React 18 with TypeScript for type safety
- Vite as the build tool for fast development and optimized production builds
- Wouter for lightweight client-side routing
- TanStack Query for server state management and caching
- Tailwind CSS for styling with custom CSS variables for theming
- shadcn/ui component library for consistent UI components
- Mobile-first responsive design with Arabic/RTL language support

**Backend Architecture:**
- Express.js server with TypeScript
- RESTful API architecture with `/api` prefix for all routes
- Modular route structure for maintainability
- Built-in request/response logging middleware
- Error handling middleware for consistent error responses

**Database Architecture:**
- PostgreSQL as the primary database
- Drizzle ORM for type-safe database operations
- Neon Database serverless PostgreSQL for cloud hosting
- Schema-first approach with shared types between client and server

## Key Components

**Frontend Components:**
- `Header`: Main navigation header with app branding and user actions
- `Navigation`: Bottom navigation bar for main app sections
- `UI Components`: Complete shadcn/ui component library for consistent design
- Page components for each main section (Dashboard, Market, Services, Jobs, Announcements)

**Backend Components:**
- `routes.ts`: Central route registration and HTTP server setup
- `storage.ts`: Database abstraction layer with in-memory fallback
- `vite.ts`: Development server integration with Vite

**Shared Components:**
- Database schema definitions with Drizzle
- Type definitions shared between client and server
- Validation schemas using Zod

## Data Flow

1. **Client Request Flow:**
   - User interacts with React components
   - TanStack Query manages API calls and caching
   - API requests go to Express server endpoints prefixed with `/api`
   - Server processes requests using storage abstraction layer

2. **Database Flow:**
   - Storage interface provides CRUD operations
   - Drizzle ORM handles SQL query generation and type safety
   - PostgreSQL database stores persistent data
   - In-memory storage available as fallback during development

3. **UI State Management:**
   - Local component state for UI interactions
   - TanStack Query for server state and caching
   - React Context for global UI state (toasts, tooltips)

## External Dependencies

**Database:**
- Neon Database for serverless PostgreSQL hosting
- Drizzle Kit for database migrations and schema management

**UI Framework:**
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography

**Development Tools:**
- Vite for fast development and building
- TypeScript for type safety across the stack
- ESBuild for server-side bundling

**Fonts:**
- Google Fonts (Cairo for Arabic text, Inter for Latin text)

## Deployment Strategy

**Development:**
- Vite dev server with HMR for frontend development
- tsx for running TypeScript server code directly
- Concurrent development of client and server

**Production Build:**
- Vite builds optimized client bundle to `dist/public`
- ESBuild bundles server code to `dist/index.js`
- Static file serving of client assets through Express
- Environment-based configuration for database connections

**Database Management:**
- `drizzle-kit push` for applying schema changes
- Migration files stored in `./migrations` directory
- Environment variable `DATABASE_URL` required for database connection

The application is designed to be easily deployable to platforms like Replit, with proper build scripts and environment configuration.

## Changelog

Changelog:
- July 07, 2025. Initial setup
- July 07, 2025. Enhanced Market Page with WhatsApp integration, category filtering, and mobile-optimized design
- July 07, 2025. Added PostgreSQL database integration with full CRUD API endpoints for products, services, jobs, and announcements
- July 07, 2025. Implemented comprehensive "Add Item" functionality for all sections with database-connected forms and real-time updates
- July 08, 2025. Migrated project from Replit Agent to Replit environment with PostgreSQL database setup
- July 08, 2025. Updated application name from "سوداني في الكويت" to "البيت السوداني" throughout the application
- July 08, 2025. Added new "محلات" page with navigation and comprehensive store directory functionality
- July 08, 2025. Enhanced Services page with specialized sections: "شركات شحن", "شركات سفر وسياحة", "عيادات وأطباء سودانيين"
- July 08, 2025. Added comprehensive authentication system with user roles (regular users and business owners) including login page and business dashboard

## User Preferences

Preferred communication style: Simple, everyday language.