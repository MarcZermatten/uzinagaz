export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UserSettings {
  user_id: string;
  theme: string;
  crt_effect: boolean;
  scanline_intensity: number;
  audio_volume: number;
  key_mappings?: Record<string, string>;
  updated_at: string;
}
