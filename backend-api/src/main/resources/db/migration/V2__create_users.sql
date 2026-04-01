-- V2: Users table
-- Stores core identity. sport-specific preferences stored via JSONB in later migrations.
CREATE TABLE users (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255),               -- NULL for OAuth2-only accounts
    display_name    VARCHAR(100)    NOT NULL,
    bio             TEXT,
    profile_picture VARCHAR(512),
    role            VARCHAR(20)     NOT NULL DEFAULT 'USER',  -- USER | ADMIN
    enabled         BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users (email);
