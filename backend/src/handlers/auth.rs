use crate::models::{AuthResponse, LoginRequest, RegisterRequest};
use crate::services::AuthService;
use crate::utils::ApiError;
use actix_web::{web, HttpResponse};
use sqlx::PgPool;
use validator::Validate;

pub async fn register(
    pool: web::Data<PgPool>,
    auth_service: web::Data<AuthService>,
    req: web::Json<RegisterRequest>,
) -> Result<HttpResponse, ApiError> {
    // Validate request
    req.validate()?;

    // Create user
    let user = auth_service
        .create_user(&pool, &req.username, &req.email, &req.password)
        .await?;

    // Generate token
    let token = auth_service.generate_token(&user.id)?;

    // Update last login
    auth_service.update_last_login(&pool, &user.id).await?;

    Ok(HttpResponse::Created().json(AuthResponse { user, token }))
}

pub async fn login(
    pool: web::Data<PgPool>,
    auth_service: web::Data<AuthService>,
    req: web::Json<LoginRequest>,
) -> Result<HttpResponse, ApiError> {
    // Validate request
    req.validate()?;

    // Get user by email
    let user = auth_service
        .get_user_by_email(&pool, &req.email)
        .await
        .map_err(|_| ApiError::Unauthorized("Invalid email or password".to_string()))?;

    // Verify password
    let is_valid = auth_service.verify_password(&req.password, &user.password_hash)?;

    if !is_valid {
        return Err(ApiError::Unauthorized("Invalid email or password".to_string()));
    }

    // Generate token
    let token = auth_service.generate_token(&user.id)?;

    // Update last login
    auth_service.update_last_login(&pool, &user.id).await?;

    Ok(HttpResponse::Ok().json(AuthResponse { user, token }))
}

pub async fn logout() -> Result<HttpResponse, ApiError> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": "Logged out successfully"
    })))
}

pub async fn get_me(
    pool: web::Data<PgPool>,
    auth_service: web::Data<AuthService>,
    user_id: web::ReqData<uuid::Uuid>,
) -> Result<HttpResponse, ApiError> {
    let user = auth_service.get_user_by_id(&pool, &user_id).await?;
    Ok(HttpResponse::Ok().json(user))
}
