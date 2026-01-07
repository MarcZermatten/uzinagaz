use crate::services::AuthService;
use crate::utils::ApiError;
use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    Error, HttpMessage,
};
use futures_util::future::LocalBoxFuture;
use std::future::{ready, Ready};
use uuid::Uuid;

pub struct AuthMiddleware;

impl<S, B> Transform<S, ServiceRequest> for AuthMiddleware
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = AuthMiddlewareService<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(AuthMiddlewareService { service }))
    }
}

pub struct AuthMiddlewareService<S> {
    service: S,
}

impl<S, B> Service<ServiceRequest> for AuthMiddlewareService<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        // Extract auth service from app data
        let auth_service = req
            .app_data::<actix_web::web::Data<AuthService>>()
            .cloned();

        if auth_service.is_none() {
            return Box::pin(async move {
                Err(ApiError::InternalServerError("AuthService not found".to_string()).into())
            });
        }

        let auth_service = auth_service.unwrap();

        // Extract token from Authorization header
        let token = req
            .headers()
            .get("Authorization")
            .and_then(|h| h.to_str().ok())
            .and_then(|h| {
                if h.starts_with("Bearer ") {
                    Some(h[7..].to_string())
                } else {
                    None
                }
            });

        if token.is_none() {
            return Box::pin(async move {
                Err(ApiError::Unauthorized("Missing authorization header".to_string()).into())
            });
        }

        let token = token.unwrap();

        // Verify token
        let claims = match auth_service.verify_token(&token) {
            Ok(claims) => claims,
            Err(e) => {
                return Box::pin(async move { Err(e.into()) });
            }
        };

        // Parse user_id from claims
        let user_id = match Uuid::parse_str(&claims.sub) {
            Ok(id) => id,
            Err(_) => {
                return Box::pin(async move {
                    Err(ApiError::Unauthorized("Invalid user ID in token".to_string()).into())
                });
            }
        };

        // Insert user_id into request extensions
        req.extensions_mut().insert(user_id);

        let fut = self.service.call(req);

        Box::pin(async move {
            let res = fut.await?;
            Ok(res)
        })
    }
}
