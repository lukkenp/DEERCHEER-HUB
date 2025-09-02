# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DEERCHEER HUB is a streaming platform designed for movie night streamers, featuring interactive movie roulette, real-time voting, and OBS Studio integration. The application serves both streamers (dashboard interface) and viewers (participation features) with a gaming-themed aesthetic.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Agent-Based Development

This project uses a **structured orchestration approach** with specialized Claude Code agents. Follow the orchestration workflow for best results:

### 🎯 Orchestration Workflow

#### For New Features or Major Changes:
```
1. 📋 Product Manager Agent
   ↓ (creates user stories)
2. 🏗️ System Architect Agent  
   ↓ (defines technical architecture)
3. 🛠️ Specialized Agents (parallel execution)
   ↓ (implement features)
4. 🔄 Integration & Review
```

#### For Small Changes or Fixes:
```
1. 🏗️ System Architect Agent (impact analysis)
   ↓
2. 🛠️ Appropriate Specialized Agent
```

### 🎯 **Orchestrator Agents** (Use First)

#### 📋 Product Manager Agent
**When to use:** Start here for any new feature, brainstorm, or significant change
- Converts ideas into structured user stories
- Defines acceptance criteria and priorities
- Creates development roadmaps
- **Output:** Stories.md with structured requirements

#### 🏗️ System Architect Agent  
**When to use:** After having user stories, before implementation
- Analyzes architectural impact of changes
- Designs database schema and API contracts
- Coordinates work between specialized agents
- **Output:** Architecture-Plan.md with technical specifications

### 🛠️ **Specialized Agents** (Use After Orchestration)

### 🎨 Frontend & UI Tasks → `shadcn-ui-builder` Agent
- Creating/modifying components and layouts
- Gaming theme styling and animations
- Responsive design and accessibility
- shadcn/ui component customization

### ⚡ Streaming Features → `Streaming Features Agent` 
- Movie roulette and voting systems
- Dashboard interactivity and hotkeys
- Real-time viewer engagement features
- OBS overlay functionality

### 🔐 Authentication & Security → `Authentication & Security Agent`
- User authentication and session management
- Route protection and access control
- Security policies and Supabase Auth integration

### 🛠️ Backend & Database → `Backend Database Agent` ✅ **COMPLETED**
- Database schema design and implementation ✅
- API development and data persistence ✅
- Real-time features and WebSocket connections ✅
- **Status**: Complete schema with 8 tables, RLS, triggers, and real-time features

### 📱 Mobile & PWA → `Mobile & PWA Agent`
- Mobile optimization and responsive design
- Progressive Web App features
- Touch interfaces and mobile-specific functionality

### 🎥 OBS Integration → `OBS Integration Agent`
- Overlay development for streaming
- WebSocket integration with OBS Studio
- Real-time broadcast controls and templates

### 🚀 DevOps & Performance → `DevOps & Performance Agent`
- Build optimization and performance tuning
- Deployment configuration and monitoring
- Bundle analysis and loading optimization

**📋 Agent Documentation**: Detailed specifications in `docs/agents.md`

**📊 Project Status**: Track development progress in `docs/PROJECT-STATUS.md`

### 🔄 **CLAUDE.md Update Protocol**

**When to Update CLAUDE.md:**
1. **After Phase Completion** - Update feature status, remove blockers, add new capabilities
2. **After Architecture Changes** - Update stack info, file structure, patterns
3. **After Agent Specification Changes** - Update agent roles and priorities
4. **New Feature Integration** - Update routing, components, key files

**What Should Be Updated:**
- Agent status and priorities (✅ COMPLETED vs. pending)
- Current feature capabilities and limitations
- Database/architecture status
- Next development phase priorities
- New file locations and patterns

**Responsible Agent**: System Architect Agent should propose CLAUDE.md updates as part of architecture-plan.md

## Project Architecture

### Core Stack
- **Vite**: Build tool and development server (port 8080)
- **React 18**: UI framework with hooks and context
- **TypeScript**: Type safety throughout
- **Tailwind CSS**: Utility-first styling with custom gaming theme
- **shadcn/ui**: Component library built on Radix UI
- **React Router**: Client-side routing with protected routes
- **React Query**: Server state management (ready for backend integration)
- **Supabase**: Backend as a service (Auth implemented, database schema needed)

### Application Features

#### Current Features
- **Movie Roulette**: Interactive film selection with spin animation
- **Streaming Dashboard**: Professional interface for streamers with resizable panels
- **OBS Overlay**: Transparent overlay page for broadcast integration (`/overlay/roulette`)
- **Authentication**: Complete login/logout flow with session persistence
- **Gaming Theme**: Custom color palette with neon effects and gradients
- **Responsive Design**: Optimized for desktop streaming setups

#### Features Ready for Frontend Integration ✅
- **Movie Persistence**: Database schema ready for movie storage and management
- **Vote History**: Complete voting system with real-time updates available
- **User Profiles**: Database profile system ready for integration  
- **Real-time Voting**: WebSocket/real-time subscriptions configured
- **Community Chat**: Database and real-time infrastructure ready

### Database Architecture ✅ IMPLEMENTED

**Current Status**: Complete database schema with 8 tables, RLS policies, and real-time features

**Implemented Tables**:
```sql
profiles              -- ✅ User profiles with roles and metadata
movies               -- ✅ Movie library with IMDB integration  
streaming_sessions   -- ✅ Session lifecycle management
session_movies       -- ✅ Movies in roulette per session
votes                -- ✅ Real-time voting system
chat_messages        -- ✅ Community chat with moderation
session_analytics    -- ✅ Metrics and insights for streamers  
user_preferences     -- ✅ User customization settings
```

### Authentication System
- **Current**: Supabase Auth with React Context (`useAuth` hook)
- **Implemented**: Login/logout, session persistence, route protection
- **Ready for Integration**: User profiles, roles, preferences (database schema complete)

### Routing Structure
- `/` - Landing page with hero section and movie roulette
- `/login` - Authentication page with sign in/up
- `/dashboard` - Protected streamer control panel
- `/overlay/roulette` - OBS-optimized overlay for streaming
- **Note**: Add custom routes above the catch-all `*` route in App.tsx

### Component Organization
- `src/components/` - Reusable UI components
- `src/components/ui/` - shadcn/ui components with gaming theme
- `src/pages/` - Route-level page components
- `src/hooks/` - Custom React hooks (useAuth, useLocalStorage, etc.)
- `src/integrations/supabase/` - Supabase client and type definitions

### Gaming Theme System
- **Color Palette**: CSS variables for gaming colors (purple, blue, cyan, pink)
- **Custom Shadows**: `shadow-neon`, `shadow-glow`, `shadow-card`
- **Gradients**: `gradient-primary`, `gradient-secondary`, `gradient-accent`
- **Dark Mode**: Native dark theme optimized for streaming environments
- **Animations**: Tailwind animations with gaming-focused transitions

### Key Files
- `src/App.tsx` - Main app with providers, routing, and layout structure
- `src/integrations/supabase/client.ts` - Supabase configuration and client setup
- `src/hooks/useAuth.tsx` - Authentication context and user session management
- `src/components/StreamingDashboard.tsx` - Main streamer interface with panels
- `src/components/MovieRoulette.tsx` - Core movie selection feature
- `vite.config.ts` - Build configuration with path aliases and port settings

### Development Patterns
- **Path Aliases**: Use `@/` for src directory imports
- **State Management**: React Context for auth, localStorage for preferences
- **Component Props**: TypeScript interfaces for all component props
- **Error Handling**: Toast notifications for user feedback
- **Performance**: Lazy loading ready, code splitting opportunities identified

### Next Development Phase: Frontend Integration
1. **Authentication Integration**: Connect useAuth with new profiles database
2. **Movie Management**: Replace localStorage with database queries
3. **Real-time Features**: Implement WebSocket connections for live voting/chat
4. **Streaming Dashboard**: Integrate analytics and session management
5. **Mobile Optimization**: Responsive design for viewer participation
6. **Advanced Overlays**: Multiple overlay types for different streaming needs

### Development Notes
- ESLint configured with React hooks and TypeScript rules
- Unused variables warnings disabled for development flexibility
- Lovable-tagger plugin active in development mode
- Hot module reloading optimized for component development
- Build optimizations ready for production deployment