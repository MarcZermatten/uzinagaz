use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct SaveState {
    pub id: Uuid,
    pub user_id: Uuid,
    pub game_id: Uuid,
    pub slot: i32,
    pub save_data_filename: String,
    pub screenshot_filename: Option<String>,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct SaveStateUploadRequest {
    pub game_id: Uuid,
    pub slot: i32,
    pub screenshot: Option<String>,  // base64 encoded
}

#[derive(Debug, Serialize)]
pub struct SaveStateListResponse {
    pub saves: Vec<SaveState>,
}
