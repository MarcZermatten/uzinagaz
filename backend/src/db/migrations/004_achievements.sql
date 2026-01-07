-- Migration: Achievements System
-- This migration creates tables for the achievement system

CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    console_id TEXT REFERENCES consoles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT,
    points INTEGER NOT NULL DEFAULT 10,
    rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    criteria JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_achievements_game ON achievements(game_id);
CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON achievements(rarity);

CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked ON user_achievements(unlocked_at DESC);

-- Insert some example achievements
INSERT INTO achievements (title, description, rarity, points, criteria) VALUES
    ('First Steps', 'Play your first game', 'common', 5, '{"type": "play_count", "value": 1}'),
    ('Gaming Marathon', 'Play for 10 hours total', 'rare', 25, '{"type": "total_playtime", "value": 36000}'),
    ('Dedicated Player', 'Play for 100 hours total', 'epic', 100, '{"type": "total_playtime", "value": 360000}'),
    ('Legend', 'Play for 1000 hours total', 'legendary', 500, '{"type": "total_playtime", "value": 3600000}'),
    ('Collector', 'Play 10 different games', 'rare', 50, '{"type": "unique_games", "value": 10}'),
    ('Completionist', 'Earn all achievements', 'legendary', 1000, '{"type": "achievement_count", "value": 100}')
ON CONFLICT DO NOTHING;
