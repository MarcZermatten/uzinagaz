use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct UserGameStats {
    pub id: Uuid,
    pub user_id: Uuid,
    pub game_id: Uuid,
    pub total_playtime_seconds: i64,
    pub last_played: Option<DateTime<Utc>>,
    pub first_played: DateTime<Utc>,
    pub play_count: i32,
}

#[derive(Debug, Deserialize)]
pub struct TrackSessionRequest {
    pub game_id: Uuid,
    pub playtime_seconds: i64,
}
