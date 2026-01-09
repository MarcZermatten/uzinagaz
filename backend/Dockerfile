# Build stage - using Debian for easier sqlx compilation
FROM rustlang/rust:nightly-bookworm-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Enable edition 2024 feature
ENV RUSTFLAGS="--cfg edition2024"

# Copy Cargo files
COPY Cargo.toml Cargo.lock* ./

# Create dummy src to cache dependencies
RUN mkdir -p src/db && echo "fn main() {}" > src/main.rs

# Build dependencies only (will fail but caches deps)
RUN cargo build --release 2>/dev/null || true
RUN rm -rf src

# Copy actual source code
COPY src ./src

# Build with SQLX_OFFLINE mode (requires .sqlx folder with cached queries)
# If no cached queries, will need DATABASE_URL at build time
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ENV SQLX_OFFLINE=true

RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libssl3 \
    libpq5 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy binary from builder
COPY --from=builder /app/target/release/zerver /app/zerver

# Copy migrations
COPY src/db/migrations ./migrations

EXPOSE 8080

ENV RUST_LOG=info

CMD ["./zerver"]
