-- Create save states table
CREATE TABLE IF NOT EXISTS save_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    slot INT NOT NULL DEFAULT 1,
    save_data_url VARCHAR(500) NOT NULL,
    screenshot_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, game_id, slot)
);

-- Create user game statistics table
CREATE TABLE IF NOT EXISTS user_game_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    total_playtime_seconds BIGINT NOT NULL DEFAULT 0,
    last_played TIMESTAMP,
    first_played TIMESTAMP NOT NULL DEFAULT NOW(),
    play_count INT NOT NULL DEFAULT 0,
    UNIQUE(user_id, game_id)
);

-- Create play sessions table for analytics
CREATE TABLE IF NOT EXISTS play_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP,
    duration_seconds INT
);

-- Create user settings table
CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(50) DEFAULT 'classic-xp',
    crt_effect BOOLEAN DEFAULT true,
    scanline_intensity FLOAT DEFAULT 0.5,
    audio_volume FLOAT DEFAULT 0.8,
    key_mappings JSONB,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_save_states_user_game ON save_states(user_id, game_id);
CREATE INDEX IF NOT EXISTS idx_user_game_stats_user ON user_game_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_game_stats_game ON user_game_stats(game_id);
CREATE INDEX IF NOT EXISTS idx_play_sessions_user ON play_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_play_sessions_game ON play_sessions(game_id);
