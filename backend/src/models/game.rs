use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Console {
    pub id: String,
    pub name: String,
    pub manufacturer: Option<String>,
    pub release_year: Option<i32>,
    pub icon_url: Option<String>,
    pub emulator_core: String,
    pub supported_extensions: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Game {
    pub id: Uuid,
    pub console_id: String,
    pub title: String,
    pub rom_filename: String,
    pub rom_size_bytes: i64,
    pub cover_url: Option<String>,
    pub description: Option<String>,
    pub release_year: Option<i32>,
    pub developer: Option<String>,
    pub genre: Option<String>,
    pub created_at: DateTime<Utc>,
    pub uploaded_by: Option<Uuid>,
}

#[derive(Debug, Deserialize)]
pub struct GameUploadRequest {
    pub console_id: String,
    pub title: String,
    pub description: Option<String>,
    pub release_year: Option<i32>,
    pub developer: Option<String>,
    pub genre: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct GameListResponse {
    pub games: Vec<Game>,
    pub total: i64,
}

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

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct PlaySession {
    pub id: Uuid,
    pub user_id: Uuid,
    pub game_id: Uuid,
    pub started_at: DateTime<Utc>,
    pub ended_at: Option<DateTime<Utc>>,
    pub duration_seconds: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct TrackSessionRequest {
    pub game_id: Uuid,
    pub session_duration: i32,
}
