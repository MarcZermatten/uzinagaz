#!/bin/bash
# Script to reset the Zerver database
# Run this on the Zerver server (192.168.1.21)

echo "Resetting Zerver database..."

# Drop and recreate database
psql -U marc -d postgres -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'zerver' AND pid <> pg_backend_pid();"
psql -U marc -d postgres -c "DROP DATABASE IF EXISTS zerver;"
psql -U marc -d postgres -c "CREATE DATABASE zerver;"

echo "Database reset complete. Restart the backend to run migrations."
