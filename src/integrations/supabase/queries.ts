import { supabase } from './client'
import type { 
  Profile, 
  Movie, 
  StreamingSession, 
  Vote, 
  ChatMessage, 
  SessionMovie,
  ProfileUpdate,
  MovieInsert,
  StreamingSessionInsert,
  VoteInsert,
  ChatMessageInsert,
  SessionMovieInsert
} from './types'

// ============================================================================
// PROFILE QUERIES
// ============================================================================

export const profileQueries = {
  // Get current user profile
  getCurrentProfile: async () => {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single()
    
    if (error) throw error
    return data as Profile
  },

  // Update current user profile
  updateProfile: async (updates: ProfileUpdate) => {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.user.id)
      .select()
      .single()
    
    if (error) throw error
    return data as Profile
  },

  // Get profile by username
  getProfileByUsername: async (username: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()
    
    if (error) throw error
    return data as Profile
  }
}

// ============================================================================
// MOVIE QUERIES
// ============================================================================

export const movieQueries = {
  // Get all active movies
  getActiveMovies: async () => {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('status', 'active')
      .order('popularity_score', { ascending: false })
    
    if (error) throw error
    return data as Movie[]
  },

  // Search movies by title
  searchMovies: async (searchTerm: string) => {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('status', 'active')
      .ilike('title', `%${searchTerm}%`)
      .order('vote_score', { ascending: false })
    
    if (error) throw error
    return data as Movie[]
  },

  // Add new movie
  addMovie: async (movie: MovieInsert) => {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('movies')
      .insert({ ...movie, added_by: user.user.id })
      .select()
      .single()
    
    if (error) throw error
    return data as Movie
  },

  // Get movie by ID
  getMovie: async (id: string) => {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Movie
  }
}

// ============================================================================
// STREAMING SESSION QUERIES
// ============================================================================

export const sessionQueries = {
  // Get active sessions
  getActiveSessions: async () => {
    const { data, error } = await supabase
      .from('streaming_sessions')
      .select(`
        *,
        streamer:profiles(username, display_name, avatar_url),
        selected_movie:movies(title, poster_url)
      `)
      .in('status', ['waiting', 'voting', 'streaming'])
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Create new session
  createSession: async (session: StreamingSessionInsert) => {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('streaming_sessions')
      .insert({ ...session, streamer_id: user.user.id })
      .select()
      .single()
    
    if (error) throw error
    return data as StreamingSession
  },

  // Get session by ID with full details
  getSession: async (id: string) => {
    const { data, error } = await supabase
      .from('streaming_sessions')
      .select(`
        *,
        streamer:profiles(username, display_name, avatar_url),
        selected_movie:movies(title, poster_url, description)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Update session status
  updateSessionStatus: async (id: string, status: StreamingSession['status']) => {
    const { data, error } = await supabase
      .from('streaming_sessions')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as StreamingSession
  }
}

// ============================================================================
// VOTING QUERIES
// ============================================================================

export const voteQueries = {
  // Get session movies (roulette entries)
  getSessionMovies: async (sessionId: string) => {
    const { data, error } = await supabase
      .from('session_movies')
      .select(`
        *,
        movie:movies(title, poster_url, description, genres),
        added_by_user:profiles(username, display_name)
      `)
      .eq('session_id', sessionId)
      .order('vote_score', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Add movie to session
  addMovieToSession: async (sessionMovie: SessionMovieInsert) => {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('session_movies')
      .insert({ ...sessionMovie, added_by: user.user.id })
      .select()
      .single()
    
    if (error) throw error
    return data as SessionMovie
  },

  // Cast or update vote
  vote: async (vote: VoteInsert) => {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('votes')
      .upsert({ ...vote, user_id: user.user.id }, { 
        onConflict: 'user_id,session_id,movie_id' 
      })
      .select()
      .single()
    
    if (error) throw error
    return data as Vote
  },

  // Get user's votes for session
  getUserVotesForSession: async (sessionId: string) => {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', user.user.id)
    
    if (error) throw error
    return data as Vote[]
  }
}

// ============================================================================
// CHAT QUERIES
// ============================================================================

export const chatQueries = {
  // Get recent chat messages
  getChatMessages: async (sessionId: string, limit = 50) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        user:profiles(username, display_name, avatar_url, role)
      `)
      .eq('session_id', sessionId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data.reverse() // Return in chronological order
  },

  // Send chat message
  sendMessage: async (message: ChatMessageInsert) => {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ ...message, user_id: user.user.id })
      .select(`
        *,
        user:profiles(username, display_name, avatar_url, role)
      `)
      .single()
    
    if (error) throw error
    return data
  }
}

// ============================================================================
// REALTIME SUBSCRIPTIONS
// ============================================================================

export const realtimeSubscriptions = {
  // Subscribe to chat messages in a session
  subscribeToChatMessages: (sessionId: string, callback: (message: any) => void) => {
    return supabase
      .channel(`session_chat_${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `session_id=eq.${sessionId}`
      }, callback)
      .subscribe()
  },

  // Subscribe to votes in a session
  subscribeToVotes: (sessionId: string, callback: (vote: any) => void) => {
    return supabase
      .channel(`session_votes_${sessionId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'votes',
        filter: `session_id=eq.${sessionId}`
      }, callback)
      .subscribe()
  },

  // Subscribe to session movie updates (vote counts)
  subscribeToSessionMovies: (sessionId: string, callback: (sessionMovie: any) => void) => {
    return supabase
      .channel(`session_movies_${sessionId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'session_movies',
        filter: `session_id=eq.${sessionId}`
      }, callback)
      .subscribe()
  },

  // Subscribe to session status changes
  subscribeToSessionStatus: (sessionId: string, callback: (session: any) => void) => {
    return supabase
      .channel(`session_status_${sessionId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'streaming_sessions',
        filter: `id=eq.${sessionId}`
      }, callback)
      .subscribe()
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const helperQueries = {
  // Call custom database functions
  getActiveSession: async (streamerId: string) => {
    const { data, error } = await supabase.rpc('get_active_session', {
      streamer_uuid: streamerId
    })
    
    if (error) throw error
    return data
  },

  canUserVoteInSession: async (userId: string, sessionId: string) => {
    const { data, error } = await supabase.rpc('can_user_vote_in_session', {
      user_uuid: userId,
      session_uuid: sessionId
    })
    
    if (error) throw error
    return data
  },

  getSessionLeaderboard: async (sessionId: string) => {
    const { data, error } = await supabase.rpc('get_session_leaderboard', {
      session_uuid: sessionId
    })
    
    if (error) throw error
    return data
  }
}