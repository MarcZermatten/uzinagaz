-- Migration: Save States
-- This migration creates tables for managing save states

CREATE TABLE IF NOT EXISTS save_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    slot INTEGER NOT NULL CHECK (slot >= 0 AND slot <= 9),
    save_data_filename TEXT NOT NULL,
    screenshot_filename TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, game_id, slot)
);

CREATE INDEX IF NOT EXISTS idx_save_states_user_game ON save_states(user_id, game_id);
CREATE INDEX IF NOT EXISTS idx_save_states_created ON save_states(created_at DESC);

-- Migration: User Game Statistics
CREATE TABLE IF NOT EXISTS user_game_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    total_playtime_seconds BIGINT NOT NULL DEFAULT 0,
    last_played TIMESTAMP WITH TIME ZONE,
    first_played TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    play_count INTEGER NOT NULL DEFAULT 0,
    UNIQUE (user_id, game_id)
);

CREATE INDEX IF NOT EXISTS idx_user_game_stats_user ON user_game_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_game_stats_last_played ON user_game_stats(last_played DESC);

-- Migration: User Settings
CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'default',
    crt_effect BOOLEAN DEFAULT true,
    scanline_intensity REAL DEFAULT 0.5 CHECK (scanline_intensity >= 0 AND scanline_intensity <= 1),
    audio_volume REAL DEFAULT 0.7 CHECK (audio_volume >= 0 AND audio_volume <= 1),
    key_mappings JSONB DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
