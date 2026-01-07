-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    console_id VARCHAR(20) REFERENCES consoles(id),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon_url VARCHAR(500),
    points INT NOT NULL DEFAULT 10,
    rarity VARCHAR(20) DEFAULT 'common',
    criteria JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create user achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_achievements_game ON achievements(game_id);
CREATE INDEX IF NOT EXISTS idx_achievements_console ON achievements(console_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement ON user_achievements(achievement_id);

-- Insert some default global achievements
INSERT INTO achievements (title, description, icon_url, points, rarity, criteria) VALUES
    ('First Steps', 'Play your first game', '/icons/achievements/first_game.png', 10, 'common', '{"type": "first_game"}'),
    ('Dedicated Gamer', 'Play for 10 hours total', '/icons/achievements/10h.png', 25, 'common', '{"type": "playtime", "value": 36000}'),
    ('Retro Enthusiast', 'Play for 100 hours total', '/icons/achievements/100h.png', 100, 'rare', '{"type": "playtime", "value": 360000}'),
    ('Collector', 'Upload 10 different games', '/icons/achievements/collector.png', 50, 'rare', '{"type": "games_uploaded", "value": 10}'),
    ('Master Collector', 'Upload 50 different games', '/icons/achievements/master_collector.png', 150, 'epic', '{"type": "games_uploaded", "value": 50}'),
    ('Console Connoisseur', 'Play games from 5 different consoles', '/icons/achievements/connoisseur.png', 75, 'epic', '{"type": "consoles_played", "value": 5}'),
    ('Speed Runner', 'Complete a game in under 2 hours', '/icons/achievements/speedrun.png', 200, 'legendary', '{"type": "game_completion_time", "value": 7200}'),
    ('Night Owl', 'Play between midnight and 4 AM', '/icons/achievements/night_owl.png', 30, 'rare', '{"type": "play_time_window", "start": "00:00", "end": "04:00"}')
ON CONFLICT DO NOTHING;
