-- ============================================================================
-- DEERCHEER HUB - Database Query Examples
-- ============================================================================

-- These are example queries for testing and development purposes
-- Execute these AFTER the main schema migration has been applied

-- ============================================================================
-- SAMPLE DATA INSERTION (for testing)
-- ============================================================================

-- Insert sample movies (requires authenticated user)
INSERT INTO movies (title, description, release_year, genres, director, poster_url, status) VALUES
('The Matrix', 'A computer programmer discovers reality isn''t what it seems.', 1999, ARRAY['Action', 'Sci-Fi'], 'The Wachowskis', 'https://example.com/matrix.jpg', 'active'),
('Inception', 'A thief who steals corporate secrets through dream-sharing technology.', 2010, ARRAY['Action', 'Sci-Fi', 'Thriller'], 'Christopher Nolan', 'https://example.com/inception.jpg', 'active'),
('Pulp Fiction', 'The lives of two mob hitmen, a boxer, and others intertwine.', 1994, ARRAY['Crime', 'Drama'], 'Quentin Tarantino', 'https://example.com/pulpfiction.jpg', 'active'),
('The Dark Knight', 'Batman battles the Joker in Gotham City.', 2008, ARRAY['Action', 'Crime', 'Drama'], 'Christopher Nolan', 'https://example.com/darkknight.jpg', 'active'),
('Forrest Gump', 'The presidencies of Kennedy and Johnson through the eyes of an Alabama man.', 1994, ARRAY['Drama', 'Romance'], 'Robert Zemeckis', 'https://example.com/forrestgump.jpg', 'active');

-- ============================================================================
-- USEFUL DEVELOPMENT QUERIES
-- ============================================================================

-- Get all profiles with their role information
SELECT 
    p.id,
    p.username,
    p.display_name,
    p.role,
    p.reputation_score,
    p.total_votes_cast,
    p.total_streams_hosted,
    p.created_at
FROM profiles p
ORDER BY p.created_at DESC;

-- Get active streaming sessions with streamer info
SELECT 
    s.id,
    s.title,
    s.description,
    s.status,
    s.current_viewers,
    s.max_viewers,
    p.username as streamer_name,
    p.display_name as streamer_display_name,
    s.created_at
FROM streaming_sessions s
JOIN profiles p ON p.id = s.streamer_id
WHERE s.status IN ('waiting', 'voting', 'streaming')
ORDER BY s.created_at DESC;

-- Get session leaderboard with movie details
SELECT 
    sm.session_id,
    m.title,
    m.release_year,
    m.genres,
    sm.vote_count,
    sm.vote_score,
    sm.is_selected
FROM session_movies sm
JOIN movies m ON m.id = sm.movie_id
WHERE sm.session_id = 'YOUR_SESSION_ID_HERE'
ORDER BY sm.vote_score DESC, sm.vote_count DESC;

-- Get recent chat messages for a session
SELECT 
    cm.id,
    cm.message,
    cm.message_type,
    cm.created_at,
    p.username,
    p.display_name
FROM chat_messages cm
LEFT JOIN profiles p ON p.id = cm.user_id
WHERE cm.session_id = 'YOUR_SESSION_ID_HERE'
    AND cm.is_deleted = false
ORDER BY cm.created_at DESC
LIMIT 50;

-- Get user voting history
SELECT 
    v.created_at,
    m.title as movie_title,
    v.vote_type,
    s.title as session_title,
    p.username as streamer_name
FROM votes v
JOIN movies m ON m.id = v.movie_id
JOIN streaming_sessions s ON s.id = v.session_id
JOIN profiles p ON p.id = s.streamer_id
WHERE v.user_id = 'YOUR_USER_ID_HERE'
ORDER BY v.created_at DESC;

-- Get popular movies by vote score
SELECT 
    m.title,
    m.release_year,
    m.genres,
    m.vote_count,
    m.vote_score,
    m.average_rating,
    m.popularity_score,
    m.last_streamed_at
FROM movies m
WHERE m.status = 'active'
ORDER BY m.vote_score DESC, m.vote_count DESC
LIMIT 20;

-- ============================================================================
-- ANALYTICS QUERIES
-- ============================================================================

-- Session analytics summary
SELECT 
    s.title as session_title,
    p.username as streamer_name,
    sa.peak_viewers,
    sa.total_unique_viewers,
    sa.average_watch_time_minutes,
    sa.total_chat_messages,
    sa.total_votes_cast,
    sa.engagement_score,
    s.created_at
FROM session_analytics sa
JOIN streaming_sessions s ON s.id = sa.session_id
JOIN profiles p ON p.id = s.streamer_id
ORDER BY sa.engagement_score DESC;

-- User engagement metrics
SELECT 
    p.username,
    p.display_name,
    p.role,
    p.reputation_score,
    p.total_votes_cast,
    p.total_streams_hosted,
    p.total_movies_added,
    p.last_seen_at
FROM profiles p
WHERE p.total_votes_cast > 0 OR p.total_streams_hosted > 0
ORDER BY p.reputation_score DESC;

-- Movie popularity trends
SELECT 
    m.title,
    m.genres,
    COUNT(v.id) as total_votes_all_time,
    SUM(CASE WHEN v.vote_type = 'upvote' THEN 1 ELSE 0 END) as upvotes,
    SUM(CASE WHEN v.vote_type = 'downvote' THEN 1 ELSE 0 END) as downvotes,
    AVG(CASE WHEN v.vote_type = 'upvote' THEN 1.0 ELSE 0.0 END) * 100 as upvote_percentage
FROM movies m
LEFT JOIN votes v ON v.movie_id = m.id
WHERE m.status = 'active'
GROUP BY m.id, m.title, m.genres
HAVING COUNT(v.id) > 0
ORDER BY total_votes_all_time DESC, upvote_percentage DESC;

-- ============================================================================
-- TESTING FUNCTIONS
-- ============================================================================

-- Test getting active session for a user
SELECT get_active_session('YOUR_STREAMER_ID_HERE') as active_session_id;

-- Test vote permission check
SELECT can_user_vote_in_session('YOUR_USER_ID_HERE', 'YOUR_SESSION_ID_HERE') as can_vote;

-- Test session leaderboard function
SELECT * FROM get_session_leaderboard('YOUR_SESSION_ID_HERE');

-- ============================================================================
-- MAINTENANCE QUERIES
-- ============================================================================

-- Clean up old ended sessions (optional - for maintenance)
-- DELETE FROM streaming_sessions 
-- WHERE status = 'ended' AND ended_at < NOW() - INTERVAL '30 days';

-- Update movie popularity scores (this could be run periodically)
UPDATE movies 
SET popularity_score = (
    vote_score * 10 + 
    vote_count * 5 + 
    CASE 
        WHEN last_streamed_at > NOW() - INTERVAL '7 days' THEN 50
        WHEN last_streamed_at > NOW() - INTERVAL '30 days' THEN 25
        ELSE 0
    END
)
WHERE status = 'active';

-- ============================================================================
-- REALTIME SUBSCRIPTION EXAMPLES (for frontend)
-- ============================================================================

/*
// Example JavaScript subscriptions for real-time features

// Subscribe to chat messages in a session
const chatSubscription = supabase
  .channel('session_chat')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'chat_messages',
    filter: `session_id=eq.${sessionId}`
  }, (payload) => {
    console.log('New chat message:', payload.new)
  })
  .subscribe()

// Subscribe to votes in a session
const voteSubscription = supabase
  .channel('session_votes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'votes',
    filter: `session_id=eq.${sessionId}`
  }, (payload) => {
    console.log('Vote change:', payload)
  })
  .subscribe()

// Subscribe to session movie updates
const movieSubscription = supabase
  .channel('session_movies')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'session_movies',
    filter: `session_id=eq.${sessionId}`
  }, (payload) => {
    console.log('Movie votes updated:', payload)
  })
  .subscribe()
*/