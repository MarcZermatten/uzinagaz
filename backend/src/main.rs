mod config;
mod db;
mod handlers;
mod middleware;
mod models;
mod services;
mod utils;

use actix_cors::Cors;
use actix_web::{middleware::Logger, web, App, HttpServer};
use config::Config;
use db::{create_pool, run_migrations};
use services::{AuthService, GameService, SaveService};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize logger
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // Load configuration
    let config = Config::from_env().expect("Failed to load configuration");
    log::info!("Configuration loaded successfully");

    // Create database pool
    let pool = create_pool(&config.database_url)
        .await
        .expect("Failed to create database pool");
    log::info!("Database connection pool created");

    // Run migrations
    run_migrations(&pool)
        .await
        .expect("Failed to run migrations");

    // Create auth service
    let auth_service = AuthService::new(config.jwt_secret.clone(), config.jwt_expiration);

    // Create game service
    let game_service = GameService::new(config.rom_storage_path.clone());

    // Create save service
    let save_service = SaveService::new(config.save_storage_path.clone());

    let server_address = config.server_address();
    let cors_origin = config.cors_origin.clone();

    log::info!("Starting server on {}", server_address);

    // Start HTTP server
    HttpServer::new(move || {
        // Configure CORS
        let cors = Cors::default()
            .allowed_origin(&cors_origin)
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"])
            .allowed_headers(vec![
                actix_web::http::header::AUTHORIZATION,
                actix_web::http::header::ACCEPT,
                actix_web::http::header::CONTENT_TYPE,
            ])
            .supports_credentials()
            .max_age(3600);

        App::new()
            .app_data(web::Data::new(pool.clone()))
            .app_data(web::Data::new(auth_service.clone()))
            .app_data(web::Data::new(game_service.clone()))
            .app_data(web::Data::new(save_service.clone()))
            .wrap(cors)
            .wrap(Logger::default())
            .service(
                web::scope("/api/v1")
                    // Auth routes (public)
                    .service(
                        web::scope("/auth")
                            .route("/register", web::post().to(handlers::register))
                            .route("/login", web::post().to(handlers::login))
                            .route("/logout", web::post().to(handlers::logout))
                            .service(
                                web::resource("/me")
                                    .wrap(middleware::AuthMiddleware)
                                    .route(web::get().to(handlers::get_me)),
                            ),
                    )
                    // Game routes
                    .service(
                        web::scope("/games")
                            .wrap(middleware::AuthMiddleware)
                            .route("", web::get().to(handlers::get_games))
                            .route("/{id}", web::get().to(handlers::get_game))
                            .route("/{id}/rom", web::get().to(handlers::get_rom))
                            .route("/scan", web::post().to(handlers::scan_roms)),
                    )
                    // Console routes
                    .service(
                        web::scope("/consoles")
                            .route("", web::get().to(handlers::get_consoles)),
                    )
                    // Save state routes
                    .service(
                        web::scope("/saves")
                            .wrap(middleware::AuthMiddleware)
                            .route("", web::get().to(handlers::get_user_saves))
                            .route("/upload", web::post().to(handlers::upload_save_state))
                            .route("/{id}/download", web::get().to(handlers::download_save_state))
                            .route("/{id}", web::delete().to(handlers::delete_save_state)),
                    )
                    // Future routes
                    // .service(web::scope("/achievements").wrap(middleware::AuthMiddleware))
                    // .service(web::scope("/stats").wrap(middleware::AuthMiddleware))
            )
            .route("/health", web::get().to(|| async { "OK" }))
    })
    .bind(&server_address)?
    .run()
    .await
}
