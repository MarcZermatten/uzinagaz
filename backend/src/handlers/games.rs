use crate::models::{Game, GameListResponse};
use crate::services::GameService;
use crate::utils::ApiError;
use actix_files::NamedFile;
use actix_web::{web, HttpRequest, HttpResponse};
use sqlx::PgPool;
use uuid::Uuid;

pub async fn get_games(
    pool: web::Data<PgPool>,
    game_service: web::Data<GameService>,
    query: web::Query<std::collections::HashMap<String, String>>,
) -> Result<HttpResponse, ApiError> {
    let console_id = query.get("console").map(|s| s.as_str());
    let limit = query
        .get("limit")
        .and_then(|s| s.parse::<i64>().ok())
        .unwrap_or(50);
    let offset = query
        .get("offset")
        .and_then(|s| s.parse::<i64>().ok())
        .unwrap_or(0);

    let (games, total) = game_service
        .get_games(&pool, console_id, limit, offset)
        .await?;

    Ok(HttpResponse::Ok().json(GameListResponse { games, total }))
}

pub async fn get_game(
    pool: web::Data<PgPool>,
    game_service: web::Data<GameService>,
    game_id: web::Path<Uuid>,
) -> Result<HttpResponse, ApiError> {
    let game = game_service.get_game(&pool, &game_id).await?;
    Ok(HttpResponse::Ok().json(game))
}

pub async fn get_rom(
    pool: web::Data<PgPool>,
    game_service: web::Data<GameService>,
    game_id: web::Path<Uuid>,
    _req: HttpRequest,
) -> Result<NamedFile, ApiError> {
    let game = game_service.get_game(&pool, &game_id).await?;
    let rom_path = game_service.get_rom_path(&game.console_id, &game.rom_filename);

    NamedFile::open(&rom_path)
        .map_err(|e| ApiError::NotFound(format!("ROM file not found: {}", e)))
}

pub async fn get_consoles(
    pool: web::Data<PgPool>,
    game_service: web::Data<GameService>,
) -> Result<HttpResponse, ApiError> {
    let consoles = game_service.get_all_consoles(&pool).await?;
    Ok(HttpResponse::Ok().json(serde_json::json!({ "consoles": consoles })))
}

pub async fn scan_roms(
    pool: web::Data<PgPool>,
    game_service: web::Data<GameService>,
) -> Result<HttpResponse, ApiError> {
    let count = game_service.scan_roms(&pool).await?;
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": format!("Scanned and added {} new games", count),
        "count": count
    })))
}
