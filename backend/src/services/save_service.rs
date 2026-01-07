use crate::models::SaveState;
use crate::utils::ApiError;
use sqlx::PgPool;
use std::fs;
use std::path::Path;
use uuid::Uuid;

#[derive(Clone)]
pub struct SaveService {
    save_storage_path: String,
}

impl SaveService {
    pub fn new(save_storage_path: String) -> Self {
        Self { save_storage_path }
    }

    pub async fn get_user_saves(
        &self,
        pool: &PgPool,
        user_id: &Uuid,
        game_id: &Uuid,
    ) -> Result<Vec<SaveState>, ApiError> {
        let saves = sqlx::query_as::<_, SaveState>(
            "SELECT * FROM save_states WHERE user_id = $1 AND game_id = $2 ORDER BY slot"
        )
        .bind(user_id)
        .bind(game_id)
        .fetch_all(pool)
        .await?;

        Ok(saves)
    }

    pub async fn get_save_state(
        &self,
        pool: &PgPool,
        save_id: &Uuid,
    ) -> Result<SaveState, ApiError> {
        let save = sqlx::query_as::<_, SaveState>(
            "SELECT * FROM save_states WHERE id = $1"
        )
        .bind(save_id)
        .fetch_one(pool)
        .await?;

        Ok(save)
    }

    pub async fn create_save_state(
        &self,
        pool: &PgPool,
        user_id: &Uuid,
        game_id: &Uuid,
        slot: i32,
        save_data: Vec<u8>,
        screenshot: Option<Vec<u8>>,
        description: Option<String>,
    ) -> Result<SaveState, ApiError> {
        // Generate unique filename for save data
        let save_filename = format!("{}_{}_slot{}.sav", user_id, game_id, slot);
        let save_path = Path::new(&self.save_storage_path).join(&save_filename);

        // Ensure storage directory exists
        if let Some(parent) = save_path.parent() {
            fs::create_dir_all(parent)
                .map_err(|e| ApiError::InternalServerError(format!("Failed to create save directory: {}", e)))?;
        }

        // Write save data to file
        fs::write(&save_path, save_data)
            .map_err(|e| ApiError::InternalServerError(format!("Failed to write save file: {}", e)))?;

        // Handle screenshot if provided
        let screenshot_filename = if let Some(screenshot_data) = screenshot {
            let screenshot_filename = format!("{}_{}_slot{}.png", user_id, game_id, slot);
            let screenshot_path = Path::new(&self.save_storage_path).join(&screenshot_filename);

            fs::write(&screenshot_path, screenshot_data)
                .map_err(|e| ApiError::InternalServerError(format!("Failed to write screenshot: {}", e)))?;

            Some(screenshot_filename)
        } else {
            None
        };

        // Delete existing save in this slot if it exists
        sqlx::query("DELETE FROM save_states WHERE user_id = $1 AND game_id = $2 AND slot = $3")
            .bind(user_id)
            .bind(game_id)
            .bind(slot)
            .execute(pool)
            .await?;

        // Insert new save state into database
        let save = sqlx::query_as::<_, SaveState>(
            "INSERT INTO save_states (user_id, game_id, slot, save_data_filename, screenshot_filename, description)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *"
        )
        .bind(user_id)
        .bind(game_id)
        .bind(slot)
        .bind(&save_filename)
        .bind(&screenshot_filename)
        .bind(&description)
        .fetch_one(pool)
        .await?;

        Ok(save)
    }

    pub async fn delete_save_state(
        &self,
        pool: &PgPool,
        save_id: &Uuid,
        user_id: &Uuid,
    ) -> Result<(), ApiError> {
        // Get save state to find filenames
        let save = self.get_save_state(pool, save_id).await?;

        // Verify ownership
        if &save.user_id != user_id {
            return Err(ApiError::Forbidden("Not authorized to delete this save state".to_string()));
        }

        // Delete files
        let save_path = Path::new(&self.save_storage_path).join(&save.save_data_filename);
        if save_path.exists() {
            fs::remove_file(&save_path)
                .map_err(|e| ApiError::InternalServerError(format!("Failed to delete save file: {}", e)))?;
        }

        if let Some(screenshot_filename) = &save.screenshot_filename {
            let screenshot_path = Path::new(&self.save_storage_path).join(screenshot_filename);
            if screenshot_path.exists() {
                fs::remove_file(&screenshot_path).ok(); // Don't fail if screenshot deletion fails
            }
        }

        // Delete from database
        sqlx::query("DELETE FROM save_states WHERE id = $1")
            .bind(save_id)
            .execute(pool)
            .await?;

        Ok(())
    }

    pub fn get_save_file_path(&self, filename: &str) -> String {
        Path::new(&self.save_storage_path)
            .join(filename)
            .to_string_lossy()
            .to_string()
    }
}
