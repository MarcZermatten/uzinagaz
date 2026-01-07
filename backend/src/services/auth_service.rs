use crate::models::{Claims, User};
use crate::utils::ApiError;
use bcrypt::{hash, verify, DEFAULT_COST};
use chrono::Utc;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use sqlx::PgPool;
use uuid::Uuid;

#[derive(Clone)]
pub struct AuthService {
    jwt_secret: String,
    jwt_expiration: i64,
}

impl AuthService {
    pub fn new(jwt_secret: String, jwt_expiration: i64) -> Self {
        Self {
            jwt_secret,
            jwt_expiration,
        }
    }

    pub fn hash_password(&self, password: &str) -> Result<String, ApiError> {
        hash(password, DEFAULT_COST).map_err(|e| e.into())
    }

    pub fn verify_password(&self, password: &str, hash: &str) -> Result<bool, ApiError> {
        verify(password, hash).map_err(|e| e.into())
    }

    pub fn generate_token(&self, user_id: &Uuid) -> Result<String, ApiError> {
        let now = Utc::now().timestamp();
        let claims = Claims {
            sub: user_id.to_string(),
            exp: now + self.jwt_expiration,
            iat: now,
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.jwt_secret.as_bytes()),
        )
        .map_err(|e| e.into())
    }

    pub fn verify_token(&self, token: &str) -> Result<Claims, ApiError> {
        decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.jwt_secret.as_bytes()),
            &Validation::default(),
        )
        .map(|data| data.claims)
        .map_err(|e| e.into())
    }

    pub async fn get_user_by_id(&self, pool: &PgPool, user_id: &Uuid) -> Result<User, ApiError> {
        sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(user_id)
            .fetch_one(pool)
            .await
            .map_err(|e| e.into())
    }

    pub async fn get_user_by_email(&self, pool: &PgPool, email: &str) -> Result<User, ApiError> {
        sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = $1")
            .bind(email)
            .fetch_one(pool)
            .await
            .map_err(|e| e.into())
    }

    pub async fn create_user(
        &self,
        pool: &PgPool,
        username: &str,
        email: &str,
        password: &str,
    ) -> Result<User, ApiError> {
        // Check if username exists
        let username_exists: Option<bool> = sqlx::query_scalar(
            "SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)"
        )
        .bind(username)
        .fetch_one(pool)
        .await?;

        if username_exists == Some(true) {
            return Err(ApiError::BadRequest("Username already exists".to_string()));
        }

        // Check if email exists
        let email_exists: Option<bool> = sqlx::query_scalar(
            "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)"
        )
        .bind(email)
        .fetch_one(pool)
        .await?;

        if email_exists == Some(true) {
            return Err(ApiError::BadRequest("Email already exists".to_string()));
        }

        // Hash password
        let password_hash = self.hash_password(password)?;

        // Insert user
        let user = sqlx::query_as::<_, User>(
            "INSERT INTO users (username, email, password_hash, created_at, updated_at)
             VALUES ($1, $2, $3, NOW(), NOW())
             RETURNING *"
        )
        .bind(username)
        .bind(email)
        .bind(&password_hash)
        .fetch_one(pool)
        .await?;

        // Create default user settings
        sqlx::query(
            "INSERT INTO user_settings (user_id, theme, crt_effect, scanline_intensity, audio_volume)
             VALUES ($1, 'classic-xp', true, 0.5, 0.8)"
        )
        .bind(&user.id)
        .execute(pool)
        .await?;

        Ok(user)
    }

    pub async fn update_last_login(&self, pool: &PgPool, user_id: &Uuid) -> Result<(), ApiError> {
        sqlx::query("UPDATE users SET last_login = NOW() WHERE id = $1")
            .bind(user_id)
            .execute(pool)
            .await?;

        Ok(())
    }
}
