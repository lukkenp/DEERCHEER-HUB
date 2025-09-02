export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          role: 'viewer' | 'streamer' | 'moderator' | 'admin'
          streaming_title: string | null
          streaming_description: string | null
          twitch_username: string | null
          youtube_channel: string | null
          preferred_genres: string[]
          timezone: string
          notifications_enabled: boolean
          reputation_score: number
          total_votes_cast: number
          total_streams_hosted: number
          total_movies_added: number
          created_at: string
          updated_at: string
          last_seen_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: 'viewer' | 'streamer' | 'moderator' | 'admin'
          streaming_title?: string | null
          streaming_description?: string | null
          twitch_username?: string | null
          youtube_channel?: string | null
          preferred_genres?: string[]
          timezone?: string
          notifications_enabled?: boolean
          reputation_score?: number
          total_votes_cast?: number
          total_streams_hosted?: number
          total_movies_added?: number
          created_at?: string
          updated_at?: string
          last_seen_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: 'viewer' | 'streamer' | 'moderator' | 'admin'
          streaming_title?: string | null
          streaming_description?: string | null
          twitch_username?: string | null
          youtube_channel?: string | null
          preferred_genres?: string[]
          timezone?: string
          notifications_enabled?: boolean
          reputation_score?: number
          total_votes_cast?: number
          total_streams_hosted?: number
          total_movies_added?: number
          created_at?: string
          updated_at?: string
          last_seen_at?: string
        }
        Relationships: []
      }
      movies: {
        Row: {
          id: string
          title: string
          description: string | null
          release_year: number | null
          duration_minutes: number | null
          imdb_id: string | null
          imdb_rating: number | null
          genres: string[]
          director: string | null
          cast_members: string[]
          poster_url: string | null
          backdrop_url: string | null
          trailer_url: string | null
          available_platforms: Json
          vote_count: number
          vote_score: number
          average_rating: number
          popularity_score: number
          status: 'active' | 'inactive' | 'pending_approval'
          added_by: string | null
          approved_by: string | null
          created_at: string
          updated_at: string
          last_streamed_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          release_year?: number | null
          duration_minutes?: number | null
          imdb_id?: string | null
          imdb_rating?: number | null
          genres?: string[]
          director?: string | null
          cast_members?: string[]
          poster_url?: string | null
          backdrop_url?: string | null
          trailer_url?: string | null
          available_platforms?: Json
          vote_count?: number
          vote_score?: number
          average_rating?: number
          popularity_score?: number
          status?: 'active' | 'inactive' | 'pending_approval'
          added_by?: string | null
          approved_by?: string | null
          created_at?: string
          updated_at?: string
          last_streamed_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          release_year?: number | null
          duration_minutes?: number | null
          imdb_id?: string | null
          imdb_rating?: number | null
          genres?: string[]
          director?: string | null
          cast_members?: string[]
          poster_url?: string | null
          backdrop_url?: string | null
          trailer_url?: string | null
          available_platforms?: Json
          vote_count?: number
          vote_score?: number
          average_rating?: number
          popularity_score?: number
          status?: 'active' | 'inactive' | 'pending_approval'
          added_by?: string | null
          approved_by?: string | null
          created_at?: string
          updated_at?: string
          last_streamed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movies_added_by_fkey"
            columns: ["added_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movies_approved_by_fkey"
            columns: ["approved_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      streaming_sessions: {
        Row: {
          id: string
          streamer_id: string
          title: string
          description: string | null
          status: 'waiting' | 'voting' | 'streaming' | 'ended'
          selected_movie_id: string | null
          movie_roulette_entries: number
          voting_duration_minutes: number
          voting_started_at: string | null
          voting_ends_at: string | null
          stream_url: string | null
          stream_key: string | null
          max_viewers: number
          current_viewers: number
          scheduled_start_time: string | null
          actual_start_time: string | null
          ended_at: string | null
          chat_enabled: boolean
          votes_required_to_skip: number
          allow_movie_suggestions: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          streamer_id: string
          title: string
          description?: string | null
          status?: 'waiting' | 'voting' | 'streaming' | 'ended'
          selected_movie_id?: string | null
          movie_roulette_entries?: number
          voting_duration_minutes?: number
          voting_started_at?: string | null
          voting_ends_at?: string | null
          stream_url?: string | null
          stream_key?: string | null
          max_viewers?: number
          current_viewers?: number
          scheduled_start_time?: string | null
          actual_start_time?: string | null
          ended_at?: string | null
          chat_enabled?: boolean
          votes_required_to_skip?: number
          allow_movie_suggestions?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          streamer_id?: string
          title?: string
          description?: string | null
          status?: 'waiting' | 'voting' | 'streaming' | 'ended'
          selected_movie_id?: string | null
          movie_roulette_entries?: number
          voting_duration_minutes?: number
          voting_started_at?: string | null
          voting_ends_at?: string | null
          stream_url?: string | null
          stream_key?: string | null
          max_viewers?: number
          current_viewers?: number
          scheduled_start_time?: string | null
          actual_start_time?: string | null
          ended_at?: string | null
          chat_enabled?: boolean
          votes_required_to_skip?: number
          allow_movie_suggestions?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "streaming_sessions_streamer_id_fkey"
            columns: ["streamer_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "streaming_sessions_selected_movie_id_fkey"
            columns: ["selected_movie_id"]
            referencedRelation: "movies"
            referencedColumns: ["id"]
          }
        ]
      }
      session_movies: {
        Row: {
          id: string
          session_id: string
          movie_id: string
          added_by: string | null
          vote_count: number
          vote_score: number
          is_selected: boolean
          display_order: number
          added_at: string
        }
        Insert: {
          id?: string
          session_id: string
          movie_id: string
          added_by?: string | null
          vote_count?: number
          vote_score?: number
          is_selected?: boolean
          display_order?: number
          added_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          movie_id?: string
          added_by?: string | null
          vote_count?: number
          vote_score?: number
          is_selected?: boolean
          display_order?: number
          added_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_movies_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "streaming_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_movies_movie_id_fkey"
            columns: ["movie_id"]
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_movies_added_by_fkey"
            columns: ["added_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      votes: {
        Row: {
          id: string
          user_id: string
          session_id: string
          movie_id: string
          vote_type: 'upvote' | 'downvote'
          vote_power: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id: string
          movie_id: string
          vote_type: 'upvote' | 'downvote'
          vote_power?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          movie_id?: string
          vote_type?: 'upvote' | 'downvote'
          vote_power?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "streaming_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_movie_id_fkey"
            columns: ["movie_id"]
            referencedRelation: "movies"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          user_id: string | null
          message: string
          message_type: 'chat' | 'system' | 'moderator'
          is_deleted: boolean
          deleted_by: string | null
          deleted_at: string | null
          delete_reason: string | null
          reply_to: string | null
          mentions: string[]
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id?: string | null
          message: string
          message_type?: 'chat' | 'system' | 'moderator'
          is_deleted?: boolean
          deleted_by?: string | null
          deleted_at?: string | null
          delete_reason?: string | null
          reply_to?: string | null
          mentions?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string | null
          message?: string
          message_type?: 'chat' | 'system' | 'moderator'
          is_deleted?: boolean
          deleted_by?: string | null
          deleted_at?: string | null
          delete_reason?: string | null
          reply_to?: string | null
          mentions?: string[]
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "streaming_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_deleted_by_fkey"
            columns: ["deleted_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_reply_to_fkey"
            columns: ["reply_to"]
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          }
        ]
      }
      session_analytics: {
        Row: {
          id: string
          session_id: string
          peak_viewers: number
          total_unique_viewers: number
          average_watch_time_minutes: number
          total_chat_messages: number
          total_votes_cast: number
          total_movie_suggestions: number
          hourly_viewer_data: Json
          engagement_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          peak_viewers?: number
          total_unique_viewers?: number
          average_watch_time_minutes?: number
          total_chat_messages?: number
          total_votes_cast?: number
          total_movie_suggestions?: number
          hourly_viewer_data?: Json
          engagement_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          peak_viewers?: number
          total_unique_viewers?: number
          average_watch_time_minutes?: number
          total_chat_messages?: number
          total_votes_cast?: number
          total_movie_suggestions?: number
          hourly_viewer_data?: Json
          engagement_score?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_analytics_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "streaming_sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          email_notifications: boolean
          push_notifications: boolean
          notify_on_stream_start: boolean
          notify_on_voting_start: boolean
          notify_on_mention: boolean
          theme: string
          chat_font_size: number
          show_timestamps: boolean
          show_user_avatars: boolean
          preferred_stream_quality: string
          auto_join_chat: boolean
          show_online_status: boolean
          allow_direct_messages: boolean
          blocked_users: string[]
          muted_keywords: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_notifications?: boolean
          push_notifications?: boolean
          notify_on_stream_start?: boolean
          notify_on_voting_start?: boolean
          notify_on_mention?: boolean
          theme?: string
          chat_font_size?: number
          show_timestamps?: boolean
          show_user_avatars?: boolean
          preferred_stream_quality?: string
          auto_join_chat?: boolean
          show_online_status?: boolean
          allow_direct_messages?: boolean
          blocked_users?: string[]
          muted_keywords?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_notifications?: boolean
          push_notifications?: boolean
          notify_on_stream_start?: boolean
          notify_on_voting_start?: boolean
          notify_on_mention?: boolean
          theme?: string
          chat_font_size?: number
          show_timestamps?: boolean
          show_user_avatars?: boolean
          preferred_stream_quality?: string
          auto_join_chat?: boolean
          show_online_status?: boolean
          allow_direct_messages?: boolean
          blocked_users?: string[]
          muted_keywords?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_active_session: {
        Args: {
          streamer_uuid: string
        }
        Returns: string
      }
      can_user_vote_in_session: {
        Args: {
          user_uuid: string
          session_uuid: string
        }
        Returns: boolean
      }
      get_session_leaderboard: {
        Args: {
          session_uuid: string
        }
        Returns: {
          movie_id: string
          movie_title: string
          vote_count: number
          vote_score: number
        }[]
      }
    }
    Enums: {
      user_role: 'viewer' | 'streamer' | 'moderator' | 'admin'
      session_status: 'waiting' | 'voting' | 'streaming' | 'ended'
      movie_status: 'active' | 'inactive' | 'pending_approval'
      vote_type: 'upvote' | 'downvote'
      message_type: 'chat' | 'system' | 'moderator'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

// Helper types for easier usage
export type Profile = Tables<'profiles'>
export type Movie = Tables<'movies'>
export type StreamingSession = Tables<'streaming_sessions'>
export type SessionMovie = Tables<'session_movies'>
export type Vote = Tables<'votes'>
export type ChatMessage = Tables<'chat_messages'>
export type SessionAnalytics = Tables<'session_analytics'>
export type UserPreferences = Tables<'user_preferences'>

export type UserRole = Enums<'user_role'>
export type SessionStatus = Enums<'session_status'>
export type MovieStatus = Enums<'movie_status'>
export type VoteType = Enums<'vote_type'>
export type MessageType = Enums<'message_type'>

// Insert types
export type ProfileInsert = TablesInsert<'profiles'>
export type MovieInsert = TablesInsert<'movies'>
export type StreamingSessionInsert = TablesInsert<'streaming_sessions'>
export type SessionMovieInsert = TablesInsert<'session_movies'>
export type VoteInsert = TablesInsert<'votes'>
export type ChatMessageInsert = TablesInsert<'chat_messages'>

// Update types
export type ProfileUpdate = TablesUpdate<'profiles'>
export type MovieUpdate = TablesUpdate<'movies'>
export type StreamingSessionUpdate = TablesUpdate<'streaming_sessions'>
export type SessionMovieUpdate = TablesUpdate<'session_movies'>
export type VoteUpdate = TablesUpdate<'votes'>
export type ChatMessageUpdate = TablesUpdate<'chat_messages'>