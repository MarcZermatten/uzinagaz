export interface Console {
  id: string;
  name: string;
  manufacturer?: string;
  release_year?: number;
  icon_url?: string;
  emulator_core: string;
  supported_extensions: string[];
}

export interface Game {
  id: string;
  console_id: string;
  title: string;
  rom_filename: string;
  rom_size_bytes: number;
  cover_url?: string;
  description?: string;
  release_year?: number;
  developer?: string;
  genre?: string;
  created_at: string;
  uploaded_by?: string;
}

export interface GameListResponse {
  games: Game[];
  total: number;
}

export interface UserGameStats {
  id: string;
  user_id: string;
  game_id: string;
  total_playtime_seconds: number;
  last_played?: string;
  first_played: string;
  play_count: number;
}
