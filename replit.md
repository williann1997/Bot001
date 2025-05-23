# Discord Farm & Sales Management Bot

## Overview

This is a full-stack application that combines a Discord bot with a web interface for managing farm activities and sales records. The bot allows users to register farm activities (box quantities) and sales transactions through Discord interactions, while providing a clean web dashboard for data visualization and management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20
- **Database**: PostgreSQL with Drizzle ORM
- **Bot Framework**: Discord.js v14
- **Build Tool**: ESBuild for production builds

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI components with Tailwind CSS
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

### Database Schema
- **farms**: Stores farm activity records (user info, box quantities, timestamps)
- **sales**: Stores sales transaction records (user info, description, delivery status, value, timestamps)
- **users**: Basic user authentication schema (currently unused but available)

## Key Components

### Discord Bot (`server/bot.ts`)
- Handles slash commands (`/farm`, `/vendas`)
- Manages interactive components (buttons, modals)
- Processes form submissions and validates data
- Sends confirmation messages to admin channels

### Command System
- **Farm Command**: Creates interactive panels for farm registration
- **Sales Command**: Creates interactive panels for sales registration
- **Modal Handlers**: Process form submissions with validation
- **Admin Notifications**: Sends formatted messages to designated admin channels

### Data Storage
- **Interface-based Storage**: `IStorage` interface for flexible data persistence
- **Memory Storage**: In-memory implementation for development/testing
- **Database Ready**: Drizzle schema configured for PostgreSQL production use

### Web Dashboard
- **React Frontend**: Modern component-based architecture
- **Shadcn/ui Components**: Professional UI component library
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **API Integration**: TanStack Query for efficient data fetching

## Data Flow

1. **Discord Interaction**: User triggers `/farm` or `/vendas` command
2. **Bot Response**: Bot displays interactive embed with registration button
3. **Modal Form**: User clicks button, modal form appears for data entry
4. **Validation**: Bot validates form data before processing
5. **Database Storage**: Valid data is stored in appropriate table
6. **Admin Notification**: Formatted confirmation sent to admin channels
7. **Web Dashboard**: Data becomes available in web interface for management

## External Dependencies

### Discord Integration
- **Bot Token**: Required for Discord API authentication
- **Client ID**: Application identifier for command registration
- **Guild ID**: Specific Discord server for command deployment
- **Admin Channels**: Designated channels for notifications

### Database
- **PostgreSQL**: Primary database for production
- **Neon Database**: Cloud PostgreSQL provider integration
- **Connection Pooling**: Built-in connection management

### UI Framework
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide Icons**: Consistent icon library

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with HMR
- **TypeScript**: Real-time type checking
- **Concurrent Processes**: Bot and web server run simultaneously

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: ESBuild creates single Node.js bundle
- **Process Management**: Single entry point manages both bot and web server

### Hosting Configuration
- **Port**: Application serves on port 5000
- **Static Files**: Frontend assets served from `/dist/public`
- **API Routes**: Backend routes prefixed with `/api`
- **Environment Variables**: Secure configuration for tokens and database

### Database Migration
- **Drizzle Kit**: Schema management and migrations
- **Push Command**: Direct schema synchronization for development
- **Migration Files**: Version-controlled schema changes

The application is designed to be deployed on Replit with automatic scaling, PostgreSQL database provisioning, and environment variable management through the platform's interface.