# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Project Architecture

This is a React application built with Vite, TypeScript, and shadcn/ui components. The project follows a modern React architecture with these key patterns:

### Core Stack
- **Vite**: Build tool and development server (port 8080)
- **React 18**: UI framework with hooks and context
- **TypeScript**: Type safety throughout
- **Tailwind CSS**: Utility-first styling with custom gaming theme
- **shadcn/ui**: Component library built on Radix UI
- **React Router**: Client-side routing
- **React Query**: Server state management
- **Supabase**: Backend as a service for auth and data

### Authentication System
- Custom `useAuth` hook provides authentication context
- Supabase handles user sessions, sign in/up/out
- Auth state persisted in localStorage
- Routes protected via `AuthProvider` wrapper

### Routing Structure
- `/` - Landing page with hero section
- `/login` - Authentication page
- `/dashboard` - Protected user dashboard
- `/overlay/roulette` - Special overlay route for streaming
- Custom routes should be added above the catch-all `*` route in App.tsx

### Component Organization
- `src/components/` - Reusable components
- `src/components/ui/` - shadcn/ui components
- `src/pages/` - Route components
- `src/hooks/` - Custom React hooks
- `src/integrations/supabase/` - Supabase client and types

### Styling System
- Custom gaming color palette with purple/blue/cyan/pink themes
- CSS variables for theming (--primary, --gaming-*, etc.)
- Tailwind utilities with custom shadows (neon, glow, card)
- Dark mode support via CSS classes

### Key Files
- `src/App.tsx` - Main app component with providers and routing
- `src/integrations/supabase/client.ts` - Supabase configuration
- `src/hooks/useAuth.tsx` - Authentication context and logic
- `vite.config.ts` - Build configuration with path aliases (@/)

### Development Notes
- Uses `@/` alias for src directory imports
- ESLint configured with React hooks and TypeScript rules
- Unused variables warning disabled in ESLint
- lovable-tagger plugin active in development mode for Lovable integration