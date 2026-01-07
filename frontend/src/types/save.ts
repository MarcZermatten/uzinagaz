export interface SaveState {
  id: string;
  user_id: string;
  game_id: string;
  slot: number;
  save_data_filename: string;
  screenshot_filename?: string;
  description?: string;
  created_at: string;
}

export interface SaveStateListResponse {
  saves: SaveState[];
}
