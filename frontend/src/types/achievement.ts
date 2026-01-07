export interface Achievement {
  id: string;
  game_id?: string;
  console_id?: string;
  title: string;
  description: string;
  icon_url?: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: Record<string, any>;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface UserAchievementProgress {
  total_achievements: number;
  unlocked_achievements: number;
  total_points: number;
  earned_points: number;
  completion_percentage: number;
}

export interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlocked_at?: string;
}
