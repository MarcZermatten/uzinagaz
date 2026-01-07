use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Achievement {
    pub id: Uuid,
    pub game_id: Option<Uuid>,
    pub console_id: Option<String>,
    pub title: String,
    pub description: String,
    pub icon_url: Option<String>,
    pub points: i32,
    pub rarity: String,
    pub criteria: serde_json::Value,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct UserAchievement {
    pub id: Uuid,
    pub user_id: Uuid,
    pub achievement_id: Uuid,
    pub unlocked_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct UserAchievementProgress {
    pub total_achievements: i64,
    pub unlocked_achievements: i64,
    pub total_points: i32,
    pub earned_points: i32,
    pub completion_percentage: f32,
}

#[derive(Debug, Deserialize)]
pub struct UnlockAchievementRequest {
    pub achievement_id: Uuid,
    pub game_id: Option<Uuid>,
}

#[derive(Debug, Serialize)]
pub struct AchievementWithStatus {
    #[serde(flatten)]
    pub achievement: Achievement,
    pub unlocked: bool,
    pub unlocked_at: Option<DateTime<Utc>>,
}
