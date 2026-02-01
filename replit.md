# VCI Birthday Reminder Form

## Overview

This is a React-based web application for collecting VCI (member organization) birthday and personal information. The form collects member details, spouse information, family members, and business data, then submits it to a Google Sheets backend via Google Apps Script. The application is built as a single-page form with client-side validation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Stack
- **React 18** with TypeScript for the UI layer
- **Vite** as the build tool and development server (runs on port 5000)
- **TailwindCSS** for styling with a custom design system using CSS variables
- **shadcn/ui** component library built on Radix UI primitives
- **React Router** for client-side routing (currently single page with 404 handling)
- **TanStack Query** for data fetching and server state management
- **React Hook Form** with Zod resolvers for form handling and validation

### Component Architecture
- Form components are organized in `src/components/` with reusable pieces like `FormField`, `FormSection`, and `FamilyMemberCard`
- UI primitives live in `src/components/ui/` following shadcn/ui conventions
- Pages are in `src/pages/` with Index serving the main form

### Data Flow
1. User fills out the multi-section form (VCI details, spouse, family members, business info)
2. Client-side validation runs on submission
3. Data is posted as JSON to a Google Apps Script web app endpoint
4. Google Apps Script parses and writes data to a Google Sheet

### Styling Approach
- CSS variables define the color palette in `src/index.css`
- Tailwind extends these variables in `tailwind.config.ts`
- Component variants use `class-variance-authority` (cva)
- Dark mode support via CSS class toggling

### Testing
- Vitest configured with jsdom environment
- Test files use `*.test.ts` or `*.spec.ts` naming
- Setup file at `src/test/setup.ts` for test utilities

## External Dependencies

### Google Sheets Integration
- **Google Apps Script** serves as the backend API
- Script receives POST requests with JSON data
- Writes to a specific Google Sheet (ID configured in script)
- Column structure includes: Timestamp, VCI details, spouse info, business data, and family members as JSON string
- Setup documentation in `docs/GOOGLE_APPS_SCRIPT.md`

### Third-Party Libraries
- **date-fns** for date formatting and manipulation
- **lucide-react** for icons
- **sonner** and Radix toast for notifications
- **embla-carousel-react** for carousel components
- **cmdk** for command palette functionality
- **next-themes** for theme switching support
- **vaul** for drawer components