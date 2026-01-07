use crate::models::{SaveState, SaveStateListResponse};
use crate::services::SaveService;
use crate::utils::ApiError;
use actix_files::NamedFile;
use actix_multipart::Multipart;
use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};
use futures_util::stream::StreamExt;
use serde::Deserialize;
use sqlx::PgPool;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct SaveQueryParams {
    game_id: Uuid,
}

pub async fn get_user_saves(
    pool: web::Data<PgPool>,
    save_service: web::Data<SaveService>,
    query: web::Query<SaveQueryParams>,
    req: HttpRequest,
) -> Result<HttpResponse, ApiError> {
    // Get user_id from request extensions (set by auth middleware)
    let user_id = req
        .extensions()
        .get::<Uuid>()
        .cloned()
        .ok_or_else(|| ApiError::Unauthorized("User not authenticated".to_string()))?;

    let saves = save_service
        .get_user_saves(&pool, &user_id, &query.game_id)
        .await?;

    Ok(HttpResponse::Ok().json(SaveStateListResponse { saves }))
}

pub async fn upload_save_state(
    pool: web::Data<PgPool>,
    save_service: web::Data<SaveService>,
    mut payload: Multipart,
    req: HttpRequest,
) -> Result<HttpResponse, ApiError> {
    let user_id = req
        .extensions()
        .get::<Uuid>()
        .cloned()
        .ok_or_else(|| ApiError::Unauthorized("User not authenticated".to_string()))?;

    let mut game_id: Option<Uuid> = None;
    let mut slot: Option<i32> = None;
    let mut save_data: Option<Vec<u8>> = None;
    let mut screenshot: Option<Vec<u8>> = None;
    let mut description: Option<String> = None;

    while let Some(item) = payload.next().await {
        let mut field = item.map_err(|e| ApiError::BadRequest(e.to_string()))?;
        let field_name = field.name().to_string();

        match field_name.as_str() {
            "game_id" => {
                let mut bytes = Vec::new();
                while let Some(chunk) = field.next().await {
                    let chunk = chunk.map_err(|e| ApiError::BadRequest(e.to_string()))?;
                    bytes.extend_from_slice(&chunk);
                }
                let game_id_str = String::from_utf8(bytes)
                    .map_err(|_| ApiError::BadRequest("Invalid game_id format".to_string()))?;
                game_id = Some(
                    Uuid::parse_str(&game_id_str)
                        .map_err(|_| ApiError::BadRequest("Invalid game_id UUID".to_string()))?,
                );
            }
            "slot" => {
                let mut bytes = Vec::new();
                while let Some(chunk) = field.next().await {
                    let chunk = chunk.map_err(|e| ApiError::BadRequest(e.to_string()))?;
                    bytes.extend_from_slice(&chunk);
                }
                let slot_str = String::from_utf8(bytes)
                    .map_err(|_| ApiError::BadRequest("Invalid slot format".to_string()))?;
                slot = Some(
                    slot_str
                        .parse()
                        .map_err(|_| ApiError::BadRequest("Invalid slot number".to_string()))?,
                );
            }
            "save_data" => {
                let mut bytes = Vec::new();
                while let Some(chunk) = field.next().await {
                    let chunk = chunk.map_err(|e| ApiError::BadRequest(e.to_string()))?;
                    bytes.extend_from_slice(&chunk);
                }
                save_data = Some(bytes);
            }
            "screenshot" => {
                let mut bytes = Vec::new();
                while let Some(chunk) = field.next().await {
                    let chunk = chunk.map_err(|e| ApiError::BadRequest(e.to_string()))?;
                    bytes.extend_from_slice(&chunk);
                }
                if !bytes.is_empty() {
                    screenshot = Some(bytes);
                }
            }
            "description" => {
                let mut bytes = Vec::new();
                while let Some(chunk) = field.next().await {
                    let chunk = chunk.map_err(|e| ApiError::BadRequest(e.to_string()))?;
                    bytes.extend_from_slice(&chunk);
                }
                let desc_str = String::from_utf8(bytes)
                    .map_err(|_| ApiError::BadRequest("Invalid description format".to_string()))?;
                if !desc_str.is_empty() {
                    description = Some(desc_str);
                }
            }
            _ => {}
        }
    }

    let game_id = game_id.ok_or_else(|| ApiError::BadRequest("Missing game_id".to_string()))?;
    let slot = slot.ok_or_else(|| ApiError::BadRequest("Missing slot".to_string()))?;
    let save_data =
        save_data.ok_or_else(|| ApiError::BadRequest("Missing save_data".to_string()))?;

    let save = save_service
        .create_save_state(&pool, &user_id, &game_id, slot, save_data, screenshot, description)
        .await?;

    Ok(HttpResponse::Ok().json(save))
}

pub async fn download_save_state(
    pool: web::Data<PgPool>,
    save_service: web::Data<SaveService>,
    save_id: web::Path<Uuid>,
    req: HttpRequest,
) -> Result<NamedFile, ApiError> {
    let user_id = req
        .extensions()
        .get::<Uuid>()
        .cloned()
        .ok_or_else(|| ApiError::Unauthorized("User not authenticated".to_string()))?;

    let save = save_service.get_save_state(&pool, &save_id).await?;

    // Verify ownership
    if save.user_id != user_id {
        return Err(ApiError::Forbidden(
            "Not authorized to access this save state".to_string(),
        ));
    }

    let save_path = save_service.get_save_file_path(&save.save_data_filename);

    NamedFile::open(&save_path)
        .map_err(|e| ApiError::NotFound(format!("Save file not found: {}", e)))
}

pub async fn delete_save_state(
    pool: web::Data<PgPool>,
    save_service: web::Data<SaveService>,
    save_id: web::Path<Uuid>,
    req: HttpRequest,
) -> Result<HttpResponse, ApiError> {
    let user_id = req
        .extensions()
        .get::<Uuid>()
        .cloned()
        .ok_or_else(|| ApiError::Unauthorized("User not authenticated".to_string()))?;

    save_service
        .delete_save_state(&pool, &save_id, &user_id)
        .await?;

    Ok(HttpResponse::Ok().json(serde_json::json!({ "message": "Save state deleted" })))
}
