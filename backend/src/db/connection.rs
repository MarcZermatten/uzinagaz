use sqlx::{postgres::PgPoolOptions, PgPool};
use std::time::Duration;

pub async fn create_pool(database_url: &str) -> Result<PgPool, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(10)
        .acquire_timeout(Duration::from_secs(30))
        .connect(database_url)
        .await
}

pub async fn run_migrations(pool: &PgPool) -> Result<(), sqlx::Error> {
    log::info!("Running database migrations...");

    // Read and execute migration files
    let migrations = vec![
        ("001_users.sql", include_str!("migrations/001_users.sql")),
        ("002_consoles_games.sql", include_str!("migrations/002_consoles_games.sql")),
        ("003_save_states.sql", include_str!("migrations/003_save_states.sql")),
        ("004_achievements.sql", include_str!("migrations/004_achievements.sql")),
    ];

    for (name, migration) in migrations.iter() {
        log::info!("Executing migration {}...", name);

        // Execute the entire migration file using raw SQL
        // This handles multiple statements properly
        for statement in migration.split(';') {
            // Remove SQL comments (lines starting with --)
            let cleaned: String = statement
                .lines()
                .filter(|line| !line.trim().starts_with("--"))
                .collect::<Vec<&str>>()
                .join("\n");

            let cleaned = cleaned.trim();

            // Skip empty statements
            if cleaned.is_empty() {
                continue;
            }

            // Log the statement being executed
            log::debug!("Executing SQL: {}", &cleaned[..cleaned.len().min(100)]);
            // Execute raw SQL
            sqlx::raw_sql(cleaned).execute(pool).await.map_err(|e| {
                log::error!("Failed to execute SQL: {}\nError: {:?}", cleaned, e);
                e
            })?;
        }
    }

    log::info!("Migrations completed successfully");
    Ok(())
}
