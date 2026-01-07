use crate::models::{Console, Game};
use crate::utils::ApiError;
use sqlx::PgPool;
use std::fs;
use std::path::Path;
use uuid::Uuid;

#[derive(Clone)]
pub struct GameService {
    rom_storage_path: String,
}

impl GameService {
    pub fn new(rom_storage_path: String) -> Self {
        Self { rom_storage_path }
    }

    pub async fn get_all_consoles(&self, pool: &PgPool) -> Result<Vec<Console>, ApiError> {
        let consoles = sqlx::query_as::<_, Console>("SELECT * FROM consoles ORDER BY release_year")
            .fetch_all(pool)
            .await?;

        Ok(consoles)
    }

    pub async fn get_console(&self, pool: &PgPool, console_id: &str) -> Result<Console, ApiError> {
        let console = sqlx::query_as::<_, Console>("SELECT * FROM consoles WHERE id = $1")
            .bind(console_id)
            .fetch_one(pool)
            .await?;

        Ok(console)
    }

    pub async fn scan_roms(&self, pool: &PgPool) -> Result<usize, ApiError> {
        let consoles = self.get_all_consoles(pool).await?;
        let mut total_added = 0;

        for console in consoles {
            let console_path = Path::new(&self.rom_storage_path).join(&console.id);

            if !console_path.exists() {
                log::warn!("Console directory does not exist: {:?}", console_path);
                continue;
            }

            let entries = fs::read_dir(&console_path)
                .map_err(|e| ApiError::InternalServerError(format!("Failed to read directory: {}", e)))?;

            for entry in entries {
                let entry = entry.map_err(|e| ApiError::InternalServerError(e.to_string()))?;
                let path = entry.path();

                if path.is_file() {
                    let filename = path.file_name()
                        .and_then(|n| n.to_str())
                        .ok_or_else(|| ApiError::BadRequest("Invalid filename".to_string()))?;

                    let extension = path.extension()
                        .and_then(|e| e.to_str())
                        .map(|e| format!(".{}", e))
                        .unwrap_or_default();

                    if console.supported_extensions.contains(&extension) {
                        let file_size = fs::metadata(&path)
                            .map_err(|e| ApiError::InternalServerError(e.to_string()))?
                            .len() as i64;

                        // Check if game already exists
                        let exists: Option<bool> = sqlx::query_scalar(
                            "SELECT EXISTS(SELECT 1 FROM games WHERE console_id = $1 AND rom_filename = $2)"
                        )
                        .bind(&console.id)
                        .bind(filename)
                        .fetch_one(pool)
                        .await?;

                        if exists != Some(true) {
                            // Extract title from filename (remove extension)
                            let title = filename
                                .trim_end_matches(&extension)
                                .replace('_', " ")
                                .replace('-', " ");

                            sqlx::query(
                                "INSERT INTO games (console_id, title, rom_filename, rom_size_bytes)
                                 VALUES ($1, $2, $3, $4)"
                            )
                            .bind(&console.id)
                            .bind(&title)
                            .bind(filename)
                            .bind(file_size)
                            .execute(pool)
                            .await?;

                            total_added += 1;
                            log::info!("Added game: {} ({})", title, console.id);
                        }
                    }
                }
            }
        }

        Ok(total_added)
    }

    pub async fn get_games(
        &self,
        pool: &PgPool,
        console_id: Option<&str>,
        limit: i64,
        offset: i64,
    ) -> Result<(Vec<Game>, i64), ApiError> {
        let (games, total) = if let Some(console) = console_id {
            let games = sqlx::query_as::<_, Game>(
                "SELECT * FROM games WHERE console_id = $1 ORDER BY title LIMIT $2 OFFSET $3"
            )
            .bind(console)
            .bind(limit)
            .bind(offset)
            .fetch_all(pool)
            .await?;

            let total: i64 = sqlx::query_scalar(
                "SELECT COUNT(*) FROM games WHERE console_id = $1"
            )
            .bind(console)
            .fetch_one(pool)
            .await?;

            (games, total)
        } else {
            let games = sqlx::query_as::<_, Game>(
                "SELECT * FROM games ORDER BY title LIMIT $1 OFFSET $2"
            )
            .bind(limit)
            .bind(offset)
            .fetch_all(pool)
            .await?;

            let total: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM games")
                .fetch_one(pool)
                .await?;

            (games, total)
        };

        Ok((games, total))
    }

    pub async fn get_game(&self, pool: &PgPool, game_id: &Uuid) -> Result<Game, ApiError> {
        let game = sqlx::query_as::<_, Game>("SELECT * FROM games WHERE id = $1")
            .bind(game_id)
            .fetch_one(pool)
            .await?;

        Ok(game)
    }

    pub fn get_rom_path(&self, console_id: &str, filename: &str) -> String {
        Path::new(&self.rom_storage_path)
            .join(console_id)
            .join(filename)
            .to_string_lossy()
            .to_string()
    }
}
