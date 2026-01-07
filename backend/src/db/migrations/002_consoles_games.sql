-- Create consoles table
CREATE TABLE IF NOT EXISTS consoles (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100),
    release_year INT,
    icon_url VARCHAR(500),
    emulator_core VARCHAR(50) NOT NULL,
    supported_extensions TEXT[] NOT NULL
);

-- Insert default consoles
INSERT INTO consoles (id, name, manufacturer, release_year, emulator_core, supported_extensions) VALUES
    ('nes', 'Nintendo Entertainment System', 'Nintendo', 1983, 'nes', ARRAY['.nes', '.zip']),
    ('snes', 'Super Nintendo Entertainment System', 'Nintendo', 1990, 'snes', ARRAY['.smc', '.sfc', '.zip']),
    ('gb', 'Game Boy', 'Nintendo', 1989, 'gb', ARRAY['.gb', '.zip']),
    ('gbc', 'Game Boy Color', 'Nintendo', 1998, 'gbc', ARRAY['.gbc', '.zip']),
    ('gba', 'Game Boy Advance', 'Nintendo', 2001, 'gba', ARRAY['.gba', '.zip']),
    ('megadrive', 'Sega Mega Drive / Genesis', 'Sega', 1988, 'segaMD', ARRAY['.md', '.bin', '.zip']),
    ('n64', 'Nintendo 64', 'Nintendo', 1996, 'n64', ARRAY['.n64', '.z64', '.zip']),
    ('psx', 'PlayStation', 'Sony', 1994, 'psx', ARRAY['.bin', '.cue', '.iso', '.zip']),
    ('dreamcast', 'Sega Dreamcast', 'Sega', 1998, 'dreamcast', ARRAY['.cdi', '.gdi', '.chd', '.zip']),
    ('ps2', 'PlayStation 2', 'Sony', 2000, 'ps2', ARRAY['.iso', '.bin', '.chd', '.zip'])
ON CONFLICT (id) DO NOTHING;

-- Create games table
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    console_id VARCHAR(20) NOT NULL REFERENCES consoles(id),
    title VARCHAR(255) NOT NULL,
    rom_filename VARCHAR(255) NOT NULL,
    rom_size_bytes BIGINT NOT NULL,
    cover_url VARCHAR(500),
    description TEXT,
    release_year INT,
    developer VARCHAR(100),
    genre VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    uploaded_by UUID REFERENCES users(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_games_console ON games(console_id);
CREATE INDEX IF NOT EXISTS idx_games_uploaded_by ON games(uploaded_by);
