# Ofi - Nigerian Fashion Marketplace

## Overview

Ofi is a modern web application that connects customers with skilled Nigerian tailors through AI-powered body measurements and a curated marketplace. The platform enables users to get accurate measurements using their phone's camera, browse traditional Nigerian designs, and place custom orders with local artisans.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful APIs with proper error handling
- **Middleware**: Custom logging, JSON parsing, CORS handling
- **Development**: Hot module replacement via Vite integration

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon Database)
- **Schema Management**: Migrations handled via Drizzle Kit
- **Connection**: Neon serverless driver for edge compatibility

## Key Components

### User Interface Components
- **Layout**: Header/Footer with responsive navigation
- **Pages**: Home, Marketplace, Measurement, Profile, Order management
- **Components**: Design cards, tailor profiles, AR interface, 3D model viewer
- **UI Library**: Comprehensive shadcn/ui components (buttons, forms, dialogs, etc.)

### Core Features
1. **AI Measurement System**: AR-based body measurement capture
2. **Marketplace**: Browse and search Nigerian traditional designs
3. **Tailor Profiles**: Detailed artisan information with ratings/reviews
4. **Order Management**: End-to-end order processing workflow
5. **3D Visualization**: Preview designs on user's body measurements

### Business Logic
- **User Management**: Registration, profiles, preferences
- **Tailor Onboarding**: Professional verification and portfolio management
- **Design Catalog**: Categorized traditional Nigerian clothing (Agbada, Ankara, Dashiki, Kaftan)
- **Order Processing**: Custom measurement integration with design selection
- **Review System**: Rating and feedback mechanism

## Data Flow

### User Journey
1. **Onboarding**: User creates account and takes measurements via AR
2. **Discovery**: Browse marketplace by category, price, or tailor
3. **Selection**: View design details with 3D preview on user's measurements
4. **Ordering**: Submit custom order with delivery preferences
5. **Fulfillment**: Track order progress through tailor dashboard

### Data Models
- **Users**: Customer profiles with measurements and preferences
- **Tailors**: Artisan profiles with verification status and statistics
- **Designs**: Product catalog with images, pricing, and categories
- **Orders**: Transaction records linking users, designs, and tailors
- **Reviews**: Feedback system for quality assurance

### API Structure
- RESTful endpoints for CRUD operations
- Proper HTTP status codes and error handling
- Request validation using Zod schemas
- Response formatting with consistent JSON structure

## External Dependencies

### Production Dependencies
- **UI Framework**: React ecosystem (@radix-ui components, React Hook Form)
- **Styling**: Tailwind CSS with custom design tokens
- **Database**: Drizzle ORM with Neon PostgreSQL
- **Utilities**: Date-fns, class-variance-authority, clsx
- **Development**: TypeScript, Vite, PostCSS

### Development Tools
- **Build**: Vite with React plugin and runtime error overlay
- **Type Safety**: TypeScript with strict configuration
- **Code Quality**: Path aliases for clean imports
- **Replit Integration**: Cartographer plugin for development environment

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild compiles Express server to `dist/index.js`
- **Assets**: Static files served from client directory in development

### Environment Configuration
- **Development**: NODE_ENV=development with hot reloading
- **Production**: NODE_ENV=production with optimized builds
- **Database**: DATABASE_URL environment variable required

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database (Neon Database recommended)
- Static file serving capability
- Environment variable configuration

## Changelog
- July 01, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.