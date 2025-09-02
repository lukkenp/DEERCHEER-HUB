-- ============================================================================
-- DEERCHEER HUB - Complete Database Schema
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

-- User role enumeration
CREATE TYPE user_role AS ENUM ('viewer', 'streamer', 'moderator', 'admin');

-- Session status enumeration  
CREATE TYPE session_status AS ENUM ('waiting', 'voting', 'streaming', 'ended');

-- Movie status enumeration
CREATE TYPE movie_status AS ENUM ('active', 'inactive', 'pending_approval');

-- Vote type enumeration
CREATE TYPE vote_type AS ENUM ('upvote', 'downvote');

-- Chat message type enumeration
CREATE TYPE message_type AS ENUM ('chat', 'system', 'moderator');

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Profiles table - extends auth.users with additional user information
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    role user_role DEFAULT 'viewer' NOT NULL,
    
    -- Streamer specific fields
    streaming_title TEXT,
    streaming_description TEXT,
    twitch_username VARCHAR(50),
    youtube_channel VARCHAR(100),
    
    -- User preferences
    preferred_genres TEXT[], -- Array of genre preferences
    timezone VARCHAR(50) DEFAULT 'UTC',
    notifications_enabled BOOLEAN DEFAULT true,
    
    -- Reputation and stats
    reputation_score INTEGER DEFAULT 0,
    total_votes_cast INTEGER DEFAULT 0,
    total_streams_hosted INTEGER DEFAULT 0,
    total_movies_added INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT username_length CHECK (LENGTH(username) >= 3),
    CONSTRAINT display_name_length CHECK (LENGTH(display_name) <= 100),
    CONSTRAINT reputation_score_positive CHECK (reputation_score >= 0)
);

-- Movies table - stores movie library with metadata
CREATE TABLE movies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_year INTEGER,
    duration_minutes INTEGER,
    
    -- IMDB integration
    imdb_id VARCHAR(20) UNIQUE,
    imdb_rating DECIMAL(3,1),
    
    -- Movie metadata
    genres TEXT[] NOT NULL DEFAULT '{}',
    director VARCHAR(255),
    cast_members TEXT[],
    poster_url TEXT,
    backdrop_url TEXT,
    trailer_url TEXT,
    
    -- Platform availability
    available_platforms JSONB DEFAULT '{}', -- {netflix: true, hulu: false, etc}
    
    -- Community data
    vote_count INTEGER DEFAULT 0,
    vote_score INTEGER DEFAULT 0, -- Sum of all votes (upvotes = +1, downvotes = -1)
    average_rating DECIMAL(3,1) DEFAULT 0,
    popularity_score INTEGER DEFAULT 0, -- Calculated field based on recent activity
    
    -- Moderation
    status movie_status DEFAULT 'active',
    added_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_streamed_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT release_year_valid CHECK (release_year >= 1900 AND release_year <= EXTRACT(YEAR FROM NOW()) + 5),
    CONSTRAINT duration_positive CHECK (duration_minutes > 0),
    CONSTRAINT imdb_rating_valid CHECK (imdb_rating >= 0 AND imdb_rating <= 10)
);

-- Streaming sessions table - manages streaming session lifecycle
CREATE TABLE streaming_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    streamer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Session details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status session_status DEFAULT 'waiting' NOT NULL,
    
    -- Movie selection
    selected_movie_id UUID REFERENCES movies(id) ON DELETE SET NULL,
    movie_roulette_entries INTEGER DEFAULT 0,
    
    -- Voting configuration
    voting_duration_minutes INTEGER DEFAULT 10,
    voting_started_at TIMESTAMP WITH TIME ZONE,
    voting_ends_at TIMESTAMP WITH TIME ZONE,
    
    -- Streaming details
    stream_url TEXT,
    stream_key VARCHAR(255),
    max_viewers INTEGER DEFAULT 100,
    current_viewers INTEGER DEFAULT 0,
    
    -- Session timing
    scheduled_start_time TIMESTAMP WITH TIME ZONE,
    actual_start_time TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    
    -- Session settings
    chat_enabled BOOLEAN DEFAULT true,
    votes_required_to_skip INTEGER DEFAULT 10,
    allow_movie_suggestions BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT voting_duration_valid CHECK (voting_duration_minutes > 0 AND voting_duration_minutes <= 60),
    CONSTRAINT max_viewers_positive CHECK (max_viewers > 0),
    CONSTRAINT current_viewers_valid CHECK (current_viewers >= 0 AND current_viewers <= max_viewers),
    CONSTRAINT voting_times_logical CHECK (voting_ends_at > voting_started_at OR voting_ends_at IS NULL OR voting_started_at IS NULL)
);

-- Session movies table - movies in the roulette for each session
CREATE TABLE session_movies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES streaming_sessions(id) ON DELETE CASCADE,
    movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    
    -- Movie in session details
    added_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    vote_count INTEGER DEFAULT 0,
    vote_score INTEGER DEFAULT 0,
    is_selected BOOLEAN DEFAULT false,
    
    -- Display order
    display_order INTEGER DEFAULT 0,
    
    -- Timestamps
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(session_id, movie_id),
    CONSTRAINT vote_count_positive CHECK (vote_count >= 0),
    CONSTRAINT display_order_positive CHECK (display_order >= 0),
    CONSTRAINT only_one_selected_per_session EXCLUDE (session_id WITH =) WHERE (is_selected = true)
);

-- Votes table - real-time voting system
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES streaming_sessions(id) ON DELETE CASCADE,
    movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    
    -- Vote details
    vote_type vote_type NOT NULL,
    vote_power INTEGER DEFAULT 1, -- Future: allow different vote weights
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints - one vote per user per movie per session
    UNIQUE(user_id, session_id, movie_id),
    CONSTRAINT vote_power_positive CHECK (vote_power > 0)
);

-- Chat messages table - community chat for streaming sessions
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES streaming_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- NULL for system messages
    
    -- Message content
    message TEXT NOT NULL,
    message_type message_type DEFAULT 'chat' NOT NULL,
    
    -- Moderation
    is_deleted BOOLEAN DEFAULT false,
    deleted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    delete_reason TEXT,
    
    -- Message metadata
    reply_to UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
    mentions UUID[], -- Array of user IDs mentioned in the message
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT message_not_empty CHECK (LENGTH(TRIM(message)) > 0),
    CONSTRAINT message_reasonable_length CHECK (LENGTH(message) <= 500),
    CONSTRAINT system_messages_no_user CHECK (
        (message_type = 'system' AND user_id IS NULL) OR 
        (message_type != 'system' AND user_id IS NOT NULL)
    )
);

-- Session analytics table - metrics and insights for streamers
CREATE TABLE session_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES streaming_sessions(id) ON DELETE CASCADE,
    
    -- Viewer metrics
    peak_viewers INTEGER DEFAULT 0,
    total_unique_viewers INTEGER DEFAULT 0,
    average_watch_time_minutes DECIMAL(8,2) DEFAULT 0,
    
    -- Engagement metrics
    total_chat_messages INTEGER DEFAULT 0,
    total_votes_cast INTEGER DEFAULT 0,
    total_movie_suggestions INTEGER DEFAULT 0,
    
    -- Popular time periods (for future analytics dashboard)
    hourly_viewer_data JSONB DEFAULT '{}',
    
    -- Calculated fields
    engagement_score DECIMAL(5,2) DEFAULT 0, -- Calculated engagement metric
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT peak_viewers_positive CHECK (peak_viewers >= 0),
    CONSTRAINT total_unique_viewers_positive CHECK (total_unique_viewers >= 0),
    CONSTRAINT average_watch_time_positive CHECK (average_watch_time_minutes >= 0),
    CONSTRAINT engagement_score_valid CHECK (engagement_score >= 0)
);

-- User preferences table - detailed user customization
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    
    -- Notification preferences
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    notify_on_stream_start BOOLEAN DEFAULT true,
    notify_on_voting_start BOOLEAN DEFAULT true,
    notify_on_mention BOOLEAN DEFAULT true,
    
    -- Display preferences
    theme VARCHAR(20) DEFAULT 'dark',
    chat_font_size INTEGER DEFAULT 14,
    show_timestamps BOOLEAN DEFAULT true,
    show_user_avatars BOOLEAN DEFAULT true,
    
    -- Streaming preferences
    preferred_stream_quality VARCHAR(10) DEFAULT 'auto',
    auto_join_chat BOOLEAN DEFAULT true,
    
    -- Privacy preferences
    show_online_status BOOLEAN DEFAULT true,
    allow_direct_messages BOOLEAN DEFAULT true,
    
    -- Filters
    blocked_users UUID[] DEFAULT '{}',
    muted_keywords TEXT[] DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT theme_valid CHECK (theme IN ('light', 'dark', 'auto')),
    CONSTRAINT chat_font_size_valid CHECK (chat_font_size >= 8 AND chat_font_size <= 24),
    CONSTRAINT stream_quality_valid CHECK (preferred_stream_quality IN ('auto', '480p', '720p', '1080p'))
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Profiles indexes
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_last_seen ON profiles(last_seen_at);

-- Movies indexes
CREATE INDEX idx_movies_title ON movies(title);
CREATE INDEX idx_movies_genres ON movies USING GIN(genres);
CREATE INDEX idx_movies_imdb_id ON movies(imdb_id);
CREATE INDEX idx_movies_status ON movies(status);
CREATE INDEX idx_movies_vote_score ON movies(vote_score DESC);
CREATE INDEX idx_movies_popularity ON movies(popularity_score DESC);
CREATE INDEX idx_movies_created_at ON movies(created_at DESC);

-- Streaming sessions indexes
CREATE INDEX idx_streaming_sessions_streamer ON streaming_sessions(streamer_id);
CREATE INDEX idx_streaming_sessions_status ON streaming_sessions(status);
CREATE INDEX idx_streaming_sessions_scheduled_start ON streaming_sessions(scheduled_start_time);
CREATE INDEX idx_streaming_sessions_created_at ON streaming_sessions(created_at DESC);

-- Session movies indexes
CREATE INDEX idx_session_movies_session ON session_movies(session_id);
CREATE INDEX idx_session_movies_movie ON session_movies(movie_id);
CREATE INDEX idx_session_movies_vote_score ON session_movies(session_id, vote_score DESC);
CREATE INDEX idx_session_movies_is_selected ON session_movies(session_id) WHERE is_selected = true;

-- Votes indexes (critical for real-time performance)
CREATE INDEX idx_votes_session_movie ON votes(session_id, movie_id);
CREATE INDEX idx_votes_user_session ON votes(user_id, session_id);
CREATE INDEX idx_votes_created_at ON votes(created_at DESC);

-- Chat messages indexes (critical for real-time chat performance)
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id, created_at DESC);
CREATE INDEX idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_chat_messages_not_deleted ON chat_messages(session_id, created_at DESC) WHERE is_deleted = false;

-- Analytics indexes
CREATE INDEX idx_session_analytics_session ON session_analytics(session_id);

-- User preferences indexes
CREATE INDEX idx_user_preferences_user ON user_preferences(user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movies_updated_at BEFORE UPDATE ON movies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streaming_sessions_updated_at BEFORE UPDATE ON streaming_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_votes_updated_at BEFORE UPDATE ON votes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_session_analytics_updated_at BEFORE UPDATE ON session_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, username, display_name, created_at, updated_at, last_seen_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
        NOW(),
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Trigger to create profile on user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_profile_for_new_user();

-- Function to update vote counts on session_movies
CREATE OR REPLACE FUNCTION update_session_movie_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE session_movies 
        SET 
            vote_count = vote_count + 1,
            vote_score = vote_score + (CASE WHEN NEW.vote_type = 'upvote' THEN 1 ELSE -1 END)
        WHERE session_id = NEW.session_id AND movie_id = NEW.movie_id;
        
        -- Also update the main movies table
        UPDATE movies 
        SET 
            vote_count = vote_count + 1,
            vote_score = vote_score + (CASE WHEN NEW.vote_type = 'upvote' THEN 1 ELSE -1 END),
            updated_at = NOW()
        WHERE id = NEW.movie_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle vote change (upvote to downvote or vice versa)
        UPDATE session_movies 
        SET 
            vote_score = vote_score - (CASE WHEN OLD.vote_type = 'upvote' THEN 1 ELSE -1 END) + (CASE WHEN NEW.vote_type = 'upvote' THEN 1 ELSE -1 END)
        WHERE session_id = NEW.session_id AND movie_id = NEW.movie_id;
        
        UPDATE movies 
        SET 
            vote_score = vote_score - (CASE WHEN OLD.vote_type = 'upvote' THEN 1 ELSE -1 END) + (CASE WHEN NEW.vote_type = 'upvote' THEN 1 ELSE -1 END),
            updated_at = NOW()
        WHERE id = NEW.movie_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE session_movies 
        SET 
            vote_count = vote_count - 1,
            vote_score = vote_score - (CASE WHEN OLD.vote_type = 'upvote' THEN 1 ELSE -1 END)
        WHERE session_id = OLD.session_id AND movie_id = OLD.movie_id;
        
        UPDATE movies 
        SET 
            vote_count = vote_count - 1,
            vote_score = vote_score - (CASE WHEN OLD.vote_type = 'upvote' THEN 1 ELSE -1 END),
            updated_at = NOW()
        WHERE id = OLD.movie_id;
        
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger for vote count updates
CREATE TRIGGER update_vote_counts_on_vote_change
    AFTER INSERT OR UPDATE OR DELETE ON votes
    FOR EACH ROW EXECUTE FUNCTION update_session_movie_vote_counts();

-- Function to update user last_seen_at
CREATE OR REPLACE FUNCTION update_user_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles 
    SET last_seen_at = NOW()
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update last_seen_at on various user activities
CREATE TRIGGER update_last_seen_on_vote
    AFTER INSERT ON votes
    FOR EACH ROW EXECUTE FUNCTION update_user_last_seen();

CREATE TRIGGER update_last_seen_on_chat
    AFTER INSERT ON chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_user_last_seen();

-- Function to automatically create session analytics
CREATE OR REPLACE FUNCTION create_session_analytics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO session_analytics (session_id, created_at, updated_at)
    VALUES (NEW.id, NOW(), NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create analytics record for new sessions
CREATE TRIGGER create_analytics_on_session_create
    AFTER INSERT ON streaming_sessions
    FOR EACH ROW EXECUTE FUNCTION create_session_analytics();

-- Function to automatically create user preferences
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_preferences (user_id, created_at, updated_at)
    VALUES (NEW.id, NOW(), NOW())
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create preferences for new profiles
CREATE TRIGGER create_preferences_on_profile_create
    AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION create_user_preferences();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaming_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Movies policies
CREATE POLICY "Movies are viewable by everyone" ON movies
    FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can add movies" ON movies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Movie creators and moderators can update movies" ON movies
    FOR UPDATE USING (
        auth.uid() = added_by OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
    );

-- Streaming sessions policies
CREATE POLICY "Active sessions are viewable by everyone" ON streaming_sessions
    FOR SELECT USING (status != 'ended' OR created_at > NOW() - INTERVAL '24 hours');

CREATE POLICY "Streamers can create sessions" ON streaming_sessions
    FOR INSERT WITH CHECK (
        auth.uid() = streamer_id AND
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('streamer', 'moderator', 'admin'))
    );

CREATE POLICY "Streamers can update their own sessions" ON streaming_sessions
    FOR UPDATE USING (auth.uid() = streamer_id);

-- Session movies policies
CREATE POLICY "Session movies are viewable by everyone" ON session_movies
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM streaming_sessions WHERE id = session_id AND status != 'ended')
    );

CREATE POLICY "Users can add movies to active sessions" ON session_movies
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM streaming_sessions 
            WHERE id = session_id AND status IN ('waiting', 'voting') AND allow_movie_suggestions = true
        )
    );

CREATE POLICY "Session owners can manage session movies" ON session_movies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM streaming_sessions 
            WHERE id = session_id AND streamer_id = auth.uid()
        )
    );

-- Votes policies
CREATE POLICY "Users can view votes in active sessions" ON votes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM streaming_sessions 
            WHERE id = session_id AND status IN ('voting', 'streaming')
        )
    );

CREATE POLICY "Users can vote in active sessions" ON votes
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM streaming_sessions 
            WHERE id = session_id AND status = 'voting'
        )
    );

CREATE POLICY "Users can update their own votes" ON votes
    FOR UPDATE USING (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM streaming_sessions 
            WHERE id = session_id AND status = 'voting'
        )
    );

CREATE POLICY "Users can delete their own votes" ON votes
    FOR DELETE USING (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM streaming_sessions 
            WHERE id = session_id AND status = 'voting'
        )
    );

-- Chat messages policies
CREATE POLICY "Chat messages are viewable in active sessions" ON chat_messages
    FOR SELECT USING (
        NOT is_deleted AND
        EXISTS (
            SELECT 1 FROM streaming_sessions 
            WHERE id = session_id AND (status != 'ended' OR created_at > NOW() - INTERVAL '2 hours')
        )
    );

CREATE POLICY "Users can send chat messages in active sessions" ON chat_messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM streaming_sessions 
            WHERE id = session_id AND status IN ('waiting', 'voting', 'streaming') AND chat_enabled = true
        )
    );

CREATE POLICY "Moderators and streamers can manage chat messages" ON chat_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN streaming_sessions s ON (s.streamer_id = p.id OR p.role IN ('moderator', 'admin'))
            WHERE p.id = auth.uid() AND s.id = session_id
        )
    );

-- Session analytics policies
CREATE POLICY "Streamers can view their own analytics" ON session_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM streaming_sessions 
            WHERE id = session_id AND streamer_id = auth.uid()
        )
    );

CREATE POLICY "System can update analytics" ON session_analytics
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM streaming_sessions 
            WHERE id = session_id AND streamer_id = auth.uid()
        )
    );

-- User preferences policies
CREATE POLICY "Users can view and manage their own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- REAL-TIME SUBSCRIPTIONS SETUP
-- ============================================================================

-- Enable realtime for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE votes;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE session_movies;
ALTER PUBLICATION supabase_realtime ADD TABLE streaming_sessions;

-- ============================================================================
-- HELPER FUNCTIONS FOR APPLICATION
-- ============================================================================

-- Function to get active session for a streamer
CREATE OR REPLACE FUNCTION get_active_session(streamer_uuid UUID)
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT id FROM streaming_sessions 
        WHERE streamer_id = streamer_uuid 
        AND status IN ('waiting', 'voting', 'streaming')
        ORDER BY created_at DESC 
        LIMIT 1
    );
END;
$$ language 'plpgsql' security definer;

-- Function to check if user can vote in session
CREATE OR REPLACE FUNCTION can_user_vote_in_session(user_uuid UUID, session_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM streaming_sessions 
        WHERE id = session_uuid 
        AND status = 'voting' 
        AND (voting_ends_at IS NULL OR voting_ends_at > NOW())
    );
END;
$$ language 'plpgsql' security definer;

-- Function to get session leaderboard
CREATE OR REPLACE FUNCTION get_session_leaderboard(session_uuid UUID)
RETURNS TABLE (
    movie_id UUID,
    movie_title TEXT,
    vote_count INTEGER,
    vote_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sm.movie_id,
        m.title,
        sm.vote_count,
        sm.vote_score
    FROM session_movies sm
    JOIN movies m ON m.id = sm.movie_id
    WHERE sm.session_id = session_uuid
    ORDER BY sm.vote_score DESC, sm.vote_count DESC, sm.added_at ASC;
END;
$$ language 'plpgsql' security definer;

-- ============================================================================
-- SAMPLE DATA (Optional - for development/testing)
-- ============================================================================

-- Note: This will be populated by the application or separate seed files
-- The schema is now complete and ready for use!