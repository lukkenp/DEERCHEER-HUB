# DEERCHEER HUB - Database Foundation Architecture Plan

## Executive Summary

This architecture plan addresses the critical blocker: **completely empty database schema** that prevents implementation of core features. The plan establishes the complete database foundation for DEERCHEER HUB's streaming platform with movie roulette, real-time voting, and community features.

## Current State Analysis

### ✅ Existing Infrastructure
- React 18 + TypeScript + Vite + Tailwind + shadcn/ui
- Supabase client configured and working
- Auth system functional (useAuth hook)
- Gaming theme with custom colors and neon effects
- Basic MovieRoulette component (localStorage only)

### ❌ Critical Blockers
- **Database schema completely empty** - no tables exist
- No user profiles system - auth exists but no profile data
- MovieRoulette uses localStorage - not persistent or shareable
- No real-time infrastructure for chat/voting
- No session management for streaming events

---

## Architecture Plan: Database Foundation

### Database Changes

#### Core Tables Schema (PostgreSQL/Supabase)

```sql
-- User Profiles Extension
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('streamer', 'viewer', 'moderator')),
  bio TEXT,
  twitch_username TEXT,
  discord_username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Movies Management
CREATE TABLE movies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  imdb_id TEXT UNIQUE,
  poster_url TEXT,
  genre TEXT,
  year INTEGER,
  rating DECIMAL(3,1),
  duration_minutes INTEGER,
  description TEXT,
  added_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Streaming Sessions
CREATE TABLE streaming_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  streamer_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'live', 'voting', 'watching', 'completed')),
  current_movie_id UUID REFERENCES movies(id),
  viewer_count INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Session Movies (for roulette)
CREATE TABLE session_movies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES streaming_sessions(id) ON DELETE CASCADE,
  movie_id UUID REFERENCES movies(id),
  added_by UUID REFERENCES profiles(id),
  vote_count INTEGER DEFAULT 0,
  is_winner BOOLEAN DEFAULT false,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, movie_id)
);

-- Voting System
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES streaming_sessions(id) ON DELETE CASCADE,
  movie_id UUID REFERENCES movies(id),
  voter_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, movie_id, voter_id)
);

-- Community Chat
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES streaming_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'emote', 'system')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session History & Analytics
CREATE TABLE session_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES streaming_sessions(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_value JSONB NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Preferences
CREATE TABLE user_preferences (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  favorite_genres TEXT[],
  notification_settings JSONB DEFAULT '{"chat": true, "voting": true, "session_start": true}'::jsonb,
  theme_preferences JSONB DEFAULT '{"theme": "dark", "colors": "gaming"}'::jsonb,
  privacy_settings JSONB DEFAULT '{"profile_visible": true, "show_viewing_history": true}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Database Indexes for Performance

```sql
-- Performance indexes
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_streaming_sessions_streamer ON streaming_sessions(streamer_id);
CREATE INDEX idx_streaming_sessions_status ON streaming_sessions(status);
CREATE INDEX idx_session_movies_session ON session_movies(session_id);
CREATE INDEX idx_votes_session_movie ON votes(session_id, movie_id);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at DESC);
```

#### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaming_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, edit own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Movies: All can read, authenticated can add
CREATE POLICY "Movies are viewable by everyone" ON movies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add movies" ON movies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update movies they added" ON movies FOR UPDATE USING (auth.uid() = added_by);

-- Streaming Sessions: Public read, streamer control
CREATE POLICY "Sessions are viewable by everyone" ON streaming_sessions FOR SELECT USING (true);
CREATE POLICY "Streamers can create sessions" ON streaming_sessions FOR INSERT WITH CHECK (auth.uid() = streamer_id);
CREATE POLICY "Streamers can update own sessions" ON streaming_sessions FOR UPDATE USING (auth.uid() = streamer_id);

-- Session Movies: Public read, participants can add
CREATE POLICY "Session movies are viewable by everyone" ON session_movies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add session movies" ON session_movies FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Votes: Users can vote once per movie per session
CREATE POLICY "Votes are viewable by everyone" ON votes FOR SELECT USING (true);
CREATE POLICY "Users can cast their own votes" ON votes FOR INSERT WITH CHECK (auth.uid() = voter_id);
CREATE POLICY "Users can update their own votes" ON votes FOR UPDATE USING (auth.uid() = voter_id);

-- Chat: Public read, authenticated write
CREATE POLICY "Chat messages are viewable by everyone" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can send messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Analytics: Streamers can view own session analytics
CREATE POLICY "Session analytics viewable by session streamer" ON session_analytics FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM streaming_sessions 
    WHERE streaming_sessions.id = session_analytics.session_id 
    AND streaming_sessions.streamer_id = auth.uid()
  )
);

-- User Preferences: Users control own preferences
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = id);
```

#### Database Functions & Triggers

```sql
-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update vote counts when votes change
CREATE OR REPLACE FUNCTION update_movie_vote_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE session_movies 
    SET vote_count = (
      SELECT COUNT(*) FROM votes 
      WHERE session_id = NEW.session_id AND movie_id = NEW.movie_id
    )
    WHERE session_id = NEW.session_id AND movie_id = NEW.movie_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE session_movies 
    SET vote_count = (
      SELECT COUNT(*) FROM votes 
      WHERE session_id = OLD.session_id AND movie_id = OLD.movie_id
    )
    WHERE session_id = OLD.session_id AND movie_id = OLD.movie_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vote_count_trigger
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW EXECUTE PROCEDURE update_movie_vote_count();

-- Update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
```

#### Real-time Subscriptions Configuration

```sql
-- Enable real-time for necessary tables
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE votes;
ALTER PUBLICATION supabase_realtime ADD TABLE session_movies;
ALTER PUBLICATION supabase_realtime ADD TABLE streaming_sessions;
```

### API Endpoints Design

#### Authentication APIs (Existing + Extensions)
```typescript
// Existing Supabase Auth + Profile Extensions
POST /auth/signup - Enhanced with profile creation
POST /auth/signin - Returns user with profile data  
POST /auth/signout
GET /auth/user - Includes profile and preferences

// Profile Management
GET /api/profiles/:id
PUT /api/profiles/:id
GET /api/profiles/me
PUT /api/profiles/me/preferences
```

#### Core Application APIs
```typescript
// Movie Management
GET /api/movies - List all movies with search/filter
POST /api/movies - Add new movie
PUT /api/movies/:id - Update movie
DELETE /api/movies/:id - Soft delete movie

// Streaming Sessions
GET /api/sessions - List active/recent sessions
POST /api/sessions - Create new session (streamers only)
GET /api/sessions/:id - Get session details
PUT /api/sessions/:id - Update session (streamer only)
DELETE /api/sessions/:id - End session (streamer only)

// Session Movies (Roulette)
GET /api/sessions/:id/movies - Get movies in session roulette
POST /api/sessions/:id/movies - Add movie to roulette
DELETE /api/sessions/:id/movies/:movieId - Remove from roulette

// Voting System
POST /api/sessions/:id/vote - Cast/update vote
DELETE /api/sessions/:id/vote/:movieId - Remove vote
GET /api/sessions/:id/results - Get voting results

// Chat System
GET /api/sessions/:id/chat - Get chat history (paginated)
POST /api/sessions/:id/chat - Send message
DELETE /api/chat/:messageId - Delete message (moderation)

// Analytics (Streamers only)
GET /api/sessions/:id/analytics - Session metrics
GET /api/streamers/me/analytics - Overall streamer analytics
```

#### Real-time WebSocket Events
```typescript
// Chat Events
'chat:new_message' - New chat message
'chat:message_deleted' - Message deleted

// Voting Events  
'voting:vote_cast' - New vote cast
'voting:vote_updated' - Vote changed
'voting:results_updated' - Real-time vote counts

// Session Events
'session:status_changed' - Session status updates
'session:movie_added' - New movie added to roulette
'session:movie_selected' - Roulette winner selected
'session:viewer_count_changed' - Live viewer count

// System Events
'system:notification' - System announcements
```

### TypeScript Interface Specifications

```typescript
// Core Types
export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  role: 'streamer' | 'viewer' | 'moderator';
  bio: string | null;
  twitch_username: string | null;
  discord_username: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Movie {
  id: string;
  title: string;
  imdb_id: string | null;
  poster_url: string | null;
  genre: string | null;
  year: number | null;
  rating: number | null;
  duration_minutes: number | null;
  description: string | null;
  added_by: string | null;
  created_at: string;
  is_active: boolean;
}

export interface StreamingSession {
  id: string;
  streamer_id: string;
  title: string;
  description: string | null;
  status: 'planning' | 'live' | 'voting' | 'watching' | 'completed';
  current_movie_id: string | null;
  viewer_count: number;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  is_active: boolean;
  // Relations
  streamer?: Profile;
  current_movie?: Movie;
  session_movies?: SessionMovie[];
}

export interface SessionMovie {
  id: string;
  session_id: string;
  movie_id: string;
  added_by: string;
  vote_count: number;
  is_winner: boolean;
  added_at: string;
  // Relations
  movie?: Movie;
  added_by_user?: Profile;
}

export interface Vote {
  id: string;
  session_id: string;
  movie_id: string;
  voter_id: string;
  created_at: string;
  // Relations
  movie?: Movie;
  voter?: Profile;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  message: string;
  message_type: 'text' | 'emote' | 'system';
  created_at: string;
  // Relations
  user?: Profile;
}

export interface UserPreferences {
  id: string;
  favorite_genres: string[];
  notification_settings: {
    chat: boolean;
    voting: boolean;
    session_start: boolean;
  };
  theme_preferences: {
    theme: string;
    colors: string;
  };
  privacy_settings: {
    profile_visible: boolean;
    show_viewing_history: boolean;
  };
  updated_at: string;
}

// API Response Types
export interface SessionWithDetails extends StreamingSession {
  streamer: Profile;
  session_movies: (SessionMovie & { movie: Movie; added_by_user: Profile })[];
  _count?: {
    chat_messages: number;
    votes: number;
  };
}

export interface VotingResults {
  session_id: string;
  results: Array<{
    movie: Movie;
    vote_count: number;
    percentage: number;
  }>;
  total_votes: number;
  user_vote?: string; // movie_id that current user voted for
}
```

---

## Agent Assignment

### 1. Backend Agent (Critical Priority)
**Estimated Time: 3-4 hours**

#### Database Implementation Tasks:
- [ ] Execute complete SQL schema creation (tables, indexes, RLS)
- [ ] Set up database functions and triggers
- [ ] Configure real-time subscriptions
- [ ] Generate updated TypeScript types from database
- [ ] Test all RLS policies with different user roles

#### API Development Tasks:
- [ ] Create Supabase API service layer (`src/integrations/supabase/api.ts`)
- [ ] Implement profile management APIs
- [ ] Implement movie management APIs  
- [ ] Implement streaming session APIs
- [ ] Implement voting system APIs
- [ ] Implement chat APIs
- [ ] Set up real-time event handlers
- [ ] Create API error handling and validation

#### Data Migration Tasks:
- [ ] Create migration script for localStorage movie data
- [ ] Implement profile creation for existing auth users
- [ ] Set up data seeding for development/testing

### 2. Frontend Agent (shadcn-ui-builder)
**Estimated Time: 4-5 hours**

#### Profile System Components:
- [ ] Create `ProfileSetup` component for new users
- [ ] Update `Navigation` to show user profile
- [ ] Create `ProfileCard` and `ProfileModal` components
- [ ] Implement role-based UI rendering (streamer/viewer)

#### Enhanced Movie Components:
- [ ] Update `MovieRoulette` to use database instead of localStorage
- [ ] Create `MovieCard` with voting interface
- [ ] Implement `MovieSearch` and `MovieFilter` components
- [ ] Add `MovieDetails` modal with IMDB integration

#### Session Management UI:
- [ ] Create `SessionCreator` for streamers
- [ ] Implement `SessionCard` for session listings
- [ ] Create `SessionDashboard` with real-time updates
- [ ] Build `VotingInterface` with live results

#### Chat Interface:
- [ ] Implement `ChatContainer` with real-time messages
- [ ] Create `ChatMessage` component with user avatars
- [ ] Add `ChatInput` with emote support
- [ ] Implement basic moderation UI

### 3. Streaming Agent (Real-time & Integrations)
**Estimated Time: 3-4 hours**

#### Real-time Integration:
- [ ] Set up Supabase real-time subscriptions
- [ ] Implement WebSocket event handlers
- [ ] Create real-time voting updates
- [ ] Implement live chat functionality
- [ ] Add session status sync

#### Enhanced Streaming Features:
- [ ] Update `StreamingDashboard` with database integration
- [ ] Enhance `OverlayRoulette` with real-time voting
- [ ] Implement session analytics collection
- [ ] Add viewer count tracking

#### OBS Integration:
- [ ] Update overlay components for database data
- [ ] Implement hotkey system for session control
- [ ] Add overlay customization options

---

## Integration Plan

### Dependencies & Implementation Order

#### Phase 1: Database Foundation (Day 1)
**Critical Path - Unblocks everything else**
1. **Backend Agent**: Execute complete database schema
2. **Backend Agent**: Generate TypeScript types
3. **Backend Agent**: Test basic CRUD operations
4. **Frontend Agent**: Update auth integration with profiles

#### Phase 2: Core Features (Days 2-3)  
**Depends on: Phase 1 complete**
1. **Frontend Agent**: Profile setup and management
2. **Backend Agent**: Movie and session APIs
3. **Frontend Agent**: Enhanced MovieRoulette component
4. **Streaming Agent**: Basic real-time subscriptions

#### Phase 3: Interactive Features (Days 4-5)
**Depends on: Phase 2 complete**
1. **Backend Agent**: Voting and chat APIs
2. **Frontend Agent**: Voting interface and chat UI
3. **Streaming Agent**: Real-time voting and chat
4. **All Agents**: Integration testing and bug fixes

#### Phase 4: Advanced Features (Days 6-7)
**Depends on: Phase 3 complete**
1. **Backend Agent**: Analytics implementation
2. **Frontend Agent**: Analytics dashboard
3. **Streaming Agent**: Enhanced OBS integration
4. **All Agents**: Performance optimization and testing

### Testing Strategy

#### Unit Testing
- [ ] Database functions and triggers
- [ ] API endpoint validation
- [ ] Component rendering and interactions
- [ ] Real-time event handling

#### Integration Testing
- [ ] Auth flow with profile creation
- [ ] Complete movie roulette workflow
- [ ] Voting system end-to-end
- [ ] Chat functionality with multiple users
- [ ] Session lifecycle management

#### User Acceptance Testing
- [ ] Streamer creates session and manages roulette
- [ ] Viewers join, vote, and chat in real-time
- [ ] Vote results update live for all users
- [ ] Session analytics capture correctly
- [ ] OBS overlays display current data

### Performance Considerations

#### Database Optimization
- Implement proper indexing for chat and voting queries
- Use database functions for vote counting (avoid N+1 queries)
- Set up connection pooling for high concurrent users
- Implement caching for movie data and user profiles

#### Real-time Optimization
- Batch real-time updates to prevent spam
- Implement rate limiting for chat messages
- Use Supabase's built-in real-time filtering
- Set up proper error handling for WebSocket disconnects

#### Frontend Performance
- Implement virtual scrolling for chat history
- Use React.memo for expensive components
- Implement optimistic updates for voting
- Add loading states and skeleton components

---

## Risk Mitigation

### Critical Risks & Solutions

#### 1. Database Schema Complexity
**Risk**: Complex schema might have design flaws
**Mitigation**: 
- Start with core tables, iterate
- Extensive testing with sample data
- Plan for schema migrations

#### 2. Real-time Performance
**Risk**: High concurrent users might overwhelm system
**Mitigation**:
- Implement rate limiting
- Use Supabase's built-in scaling
- Monitor and optimize queries
- Plan for connection pooling

#### 3. Data Migration from localStorage
**Risk**: Users lose existing movie data
**Mitigation**:
- Create migration utility in UI
- Allow manual data export/import
- Maintain localStorage as backup initially

#### 4. Authentication Edge Cases  
**Risk**: Profile creation failures, orphaned auth users
**Mitigation**:
- Robust error handling in auth flow
- Retry mechanisms for profile creation
- Admin tools for data cleanup

### Rollback Strategy

If critical issues arise:
1. **Database**: Keep schema migrations in separate files for easy rollback
2. **Frontend**: Feature flags to disable new components
3. **Real-time**: Fallback to polling if WebSocket fails
4. **Data**: Maintain localStorage as backup during transition

---

## Success Criteria

### Phase 1 Success (Database Foundation)
- [ ] All tables created and accessible
- [ ] RLS policies working correctly  
- [ ] TypeScript types generated and integrated
- [ ] Basic CRUD operations functional
- [ ] Auth integration with profiles working

### Phase 2 Success (Core Features)
- [ ] MovieRoulette uses database instead of localStorage  
- [ ] Users can create and join streaming sessions
- [ ] Movie addition and management working
- [ ] Profile system fully functional

### Phase 3 Success (Interactive Features)
- [ ] Real-time voting system operational
- [ ] Live chat functionality working
- [ ] Vote results update in real-time
- [ ] Session status changes propagate immediately

### Phase 4 Success (Advanced Features)
- [ ] Analytics dashboard showing session metrics
- [ ] Enhanced OBS overlay integration
- [ ] Performance optimizations implemented
- [ ] Full test coverage achieved

---

## Next Steps

1. **Backend Agent** should begin immediately with database schema implementation
2. **Frontend Agent** should wait for types generation before starting UI updates
3. **Streaming Agent** should coordinate with Backend for real-time setup
4. All agents should communicate dependencies and blockers immediately

**Estimated Total Implementation Time: 10-14 hours across 7 days**

This foundational work will unblock all future features and establish DEERCHEER HUB as a fully functional streaming platform with real-time interactivity.