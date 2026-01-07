use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value as JsonValue;
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct UserSettings {
    pub user_id: Uuid,
    pub theme: String,
    pub crt_effect: bool,
    pub scanline_intensity: f32,
    pub audio_volume: f32,
    pub key_mappings: JsonValue,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateSettingsRequest {
    pub theme: Option<String>,
    pub crt_effect: Option<bool>,
    pub scanline_intensity: Option<f32>,
    pub audio_volume: Option<f32>,
    pub key_mappings: Option<JsonValue>,
}
