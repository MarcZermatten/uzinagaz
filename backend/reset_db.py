#!/usr/bin/env python3
"""
Script to reset the Zerver PostgreSQL database
"""
import sys

try:
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
except ImportError:
    print("Installing psycopg2-binary...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "psycopg2-binary"])
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Database connection parameters
DB_HOST = "192.168.1.21"
DB_PORT = "5432"
DB_USER = "marc"
DB_PASSWORD = "postgres123"
DB_NAME = "zerver"

print("Connecting to PostgreSQL server...")

# Connect to PostgreSQL server (to postgres database to manage other databases)
conn = psycopg2.connect(
    host=DB_HOST,
    port=DB_PORT,
    user=DB_USER,
    password=DB_PASSWORD,
    database="postgres"
)
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cursor = conn.cursor()

print("Terminating existing connections to zerver database...")
cursor.execute("""
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = %s
    AND pid <> pg_backend_pid()
""", (DB_NAME,))

print("Dropping existing zerver database...")
cursor.execute(f"DROP DATABASE IF EXISTS {DB_NAME}")

print("Creating new zerver database...")
cursor.execute(f"CREATE DATABASE {DB_NAME}")

print("Database reset complete!")
cursor.close()
conn.close()

print("\nYou can now restart the backend to run migrations with correct timestamp types.")
