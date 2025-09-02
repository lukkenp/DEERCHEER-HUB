# Database Setup Instructions

## Complete Database Schema Implementation for DEERCHEER HUB

This document provides instructions for setting up the complete database schema for the DEERCHEER HUB application.

## Prerequisites

1. **Supabase Project**: You have access to the Supabase project `wqqjjsorjmgftevhmnsg`
2. **Admin Access**: You need admin/owner access to apply the database migrations
3. **Supabase CLI**: (Optional) For CLI-based deployment

## Schema Overview

The database includes 8 core tables with comprehensive relationships:

### Core Tables
- **profiles** - User profiles with roles and metadata
- **movies** - Movie library with IMDB integration
- **streaming_sessions** - Session lifecycle management
- **session_movies** - Movies in roulette per session
- **votes** - Real-time voting system
- **chat_messages** - Community chat
- **session_analytics** - Metrics for streamers
- **user_preferences** - User customization

### Features Implemented
- ✅ Complete PostgreSQL schema with proper relationships
- ✅ Row Level Security (RLS) policies for all tables
- ✅ Database functions and triggers for automation
- ✅ Performance indexes for chat/voting queries
- ✅ Real-time subscriptions configuration
- ✅ Auto-profile creation on user signup
- ✅ Vote count triggers for real-time updates
- ✅ TypeScript types generated and updated

## Deployment Options

### Option 1: Supabase Dashboard (Recommended)

1. Open your [Supabase Dashboard](https://supabase.com/dashboard/project/wqqjjsorjmgftevhmnsg)
2. Go to **SQL Editor**
3. Copy and paste the entire content of `supabase/migrations/20250902_initial_schema.sql`
4. Click **Run** to execute the migration
5. Verify tables were created by checking the **Table Editor**

### Option 2: Supabase CLI

```bash
# Navigate to project directory
cd "/path/to/DEERCHEER-HUB"

# Link to your project (requires authentication)
supabase link --project-ref wqqjjsorjmgftevhmnsg

# Apply migration
supabase db push

# Generate types (optional - already done)
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### Option 3: Direct Database Connection

If you have the database connection string:

```bash
psql "postgresql://postgres:PASSWORD@db.wqqjjsorjmgftevhmnsg.supabase.co:5432/postgres" -f supabase/migrations/20250902_initial_schema.sql
```

## Verification Steps

After running the migration, verify the setup:

### 1. Check Tables
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
```

Expected tables: profiles, movies, streaming_sessions, session_movies, votes, chat_messages, session_analytics, user_preferences

### 2. Check RLS Policies
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

Should show multiple policies for each table.

### 3. Check Functions
```sql
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';
```

Expected functions: get_active_session, can_user_vote_in_session, get_session_leaderboard

### 4. Check Triggers
```sql
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

Should show triggers for updating timestamps and vote counts.

### 5. Test Profile Creation
Sign up a new user in your app to verify the automatic profile creation trigger works.

## Real-time Configuration

The following tables are enabled for real-time subscriptions:
- votes (for live voting)
- chat_messages (for live chat)
- session_movies (for live roulette updates)
- streaming_sessions (for session status updates)

## Database Functions Available

### `get_active_session(streamer_uuid)`
Returns the active session ID for a streamer.

### `can_user_vote_in_session(user_uuid, session_uuid)`
Checks if a user can vote in a specific session.

### `get_session_leaderboard(session_uuid)`
Returns the voting leaderboard for a session.

## Security Features

### Row Level Security (RLS)
All tables have comprehensive RLS policies:
- **profiles**: Public viewing, self-editing only
- **movies**: Public viewing of active movies, authenticated users can add
- **streaming_sessions**: Public viewing of active sessions, streamers manage own
- **votes**: Users can only see/manage their own votes in active sessions
- **chat_messages**: Messages visible in active sessions, moderation controls
- **session_analytics**: Streamers see only their own analytics
- **user_preferences**: Users manage only their own preferences

### Automatic Features
- Profile creation on user signup
- Real-time vote counting with triggers
- Updated timestamp management
- Session analytics creation
- User preferences initialization

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure you have admin access to the Supabase project
2. **Extension Errors**: Extensions are created with `IF NOT EXISTS` - safe to ignore
3. **Type Errors**: The TypeScript types file has been updated to match the schema
4. **RLS Errors**: Check that auth.uid() returns a valid UUID when testing

### Contact Support

If you encounter issues:
1. Check the Supabase Dashboard logs
2. Verify your user role in the project
3. Ensure the project ID `wqqjjsorjmgftevhmnsg` is correct

## Next Steps

After successful deployment:
1. Test user registration/profile creation
2. Create some sample movies
3. Start a streaming session
4. Test voting functionality
5. Verify real-time chat works

The database is now fully configured for the DEERCHEER HUB application with all core features ready for development.