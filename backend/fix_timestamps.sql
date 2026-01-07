-- Fix timestamp columns to use TIMESTAMP WITH TIME ZONE
-- Run this manually against the zerver database

-- Fix users table
ALTER TABLE users
  ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE,
  ALTER COLUMN updated_at TYPE TIMESTAMP WITH TIME ZONE,
  ALTER COLUMN last_login TYPE TIMESTAMP WITH TIME ZONE;

-- Fix sessions table
ALTER TABLE sessions
  ALTER COLUMN expires_at TYPE TIMESTAMP WITH TIME ZONE,
  ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;

-- Fix save_states table
ALTER TABLE save_states
  ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;

-- Fix user_game_stats table
ALTER TABLE user_game_stats
  ALTER COLUMN last_played TYPE TIMESTAMP WITH TIME ZONE,
  ALTER COLUMN first_played TYPE TIMESTAMP WITH TIME ZONE;

-- Fix user_settings table
ALTER TABLE user_settings
  ALTER COLUMN updated_at TYPE TIMESTAMP WITH TIME ZONE;

-- Fix achievements table
ALTER TABLE achievements
  ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE;

-- Fix user_achievements table
ALTER TABLE user_achievements
  ALTER COLUMN unlocked_at TYPE TIMESTAMP WITH TIME ZONE;
