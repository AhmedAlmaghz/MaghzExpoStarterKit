-- ============================================
-- Supabase Database Schema
-- Expo Template Project
-- Migration: 001_initial_schema
-- Created: 2026-04-10
-- ============================================

-- ============================================
-- Enable Extensions
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    phone TEXT,
    phone_verified BOOLEAN DEFAULT FALSE,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
    last_login_at TIMESTAMPTZ,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Profiles Table
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    address TEXT,
    city TEXT,
    country TEXT,
    timezone TEXT DEFAULT 'UTC',
    locale TEXT DEFAULT 'en' CHECK (locale IN ('en', 'ar')),
    theme_mode TEXT DEFAULT 'system' CHECK (theme_mode IN ('light', 'dark', 'system')),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Sessions Table
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    device_info TEXT,
    ip_address TEXT,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_accessed_at TIMESTAMPTZ
);

-- ============================================
-- Notifications Table
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    action_url TEXT,
    action_text TEXT,
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Settings Table
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value TEXT,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Audit Logs Table
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Roles Table
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Permissions Table
-- ============================================
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Role Permissions Junction Table
-- ============================================
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- ============================================
-- User Roles Junction Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- ============================================
-- Analytics Events Table
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_name TEXT NOT NULL,
    event_category TEXT,
    event_label TEXT,
    event_value REAL,
    properties JSONB,
    session_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_settings_user_id ON settings(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- Users: Users can view/update their own data
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);

-- Profiles: Users manage their own profile
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE USING (auth.uid() = user_id);

-- Sessions: Users manage their own sessions
CREATE POLICY "sessions_select_own" ON sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sessions_insert_own" ON sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sessions_update_own" ON sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "sessions_delete_own" ON sessions FOR DELETE USING (auth.uid() = user_id);

-- Notifications: Users manage their own notifications
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert_own" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_delete_own" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- Settings: Users manage their own settings
CREATE POLICY "settings_select_own" ON settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "settings_insert_own" ON settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "settings_update_own" ON settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "settings_delete_own" ON settings FOR DELETE USING (auth.uid() = user_id);

-- Audit Logs: Only admins can view
CREATE POLICY "audit_logs_admin_only" ON audit_logs FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'superadmin')
    )
);

-- Roles: Public read, admin write
CREATE POLICY "roles_public_select" ON roles FOR SELECT USING (true);
CREATE POLICY "roles_admin_insert" ON roles FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = 'superadmin'
    )
);

-- Permissions: Public read, admin write
CREATE POLICY "permissions_public_select" ON permissions FOR SELECT USING (true);
CREATE POLICY "permissions_admin_insert" ON permissions FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = 'superadmin'
    )
);

-- Role Permissions: Admin manage
CREATE POLICY "role_permissions_public_select" ON role_permissions FOR SELECT USING (true);
CREATE POLICY "role_permissions_admin_insert" ON role_permissions FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = 'superadmin'
    )
);

-- User Roles: Public read, admin manage
CREATE POLICY "user_roles_public_select" ON user_roles FOR SELECT USING (true);
CREATE POLICY "user_roles_admin_insert" ON user_roles FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'superadmin')
    )
);

-- Analytics Events: Users insert their own, admins view all
CREATE POLICY "analytics_events_insert_own" ON analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "analytics_events_admin_select" ON analytics_events FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'superadmin')
    )
);

-- ============================================
-- Functions & Triggers
-- ============================================

-- Function: Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update updated_at on users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update updated_at on settings
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Storage Buckets
-- ============================================

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create documents bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create assets bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Storage Buckets Setup (Manual)
-- ============================================
-- Note: Create storage buckets manually from Supabase Dashboard
-- Storage > Buckets > Create new bucket
--
-- Required buckets:
-- 1. avatars (public: true)   - For user profile pictures
-- 2. documents (public: false) - For private user documents
-- 3. assets (public: true)    - For app assets
--
-- Storage RLS policies will be auto-generated by Supabase.
-- Configure custom policies from: Storage > Policies

-- ============================================
-- Seed Data (Production Safe)
-- ============================================

-- Insert default roles
INSERT INTO roles (id, name, display_name, description) VALUES
    ('00000000-0000-0000-0000-000000000001', 'user', 'User', 'Standard user with basic access'),
    ('00000000-0000-0000-0000-000000000002', 'admin', 'Administrator', 'Admin with elevated privileges'),
    ('00000000-0000-0000-0000-000000000003', 'superadmin', 'Super Administrator', 'Full system access')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (id, name, display_name, description, resource, action) VALUES
    ('00000000-0000-0000-0000-000000000010', 'profile:read', 'View Profile', 'View own profile', 'profile', 'read'),
    ('00000000-0000-0000-0000-000000000011', 'profile:update', 'Update Profile', 'Update own profile', 'profile', 'update'),
    ('00000000-0000-0000-0000-000000000012', 'settings:read', 'View Settings', 'View own settings', 'settings', 'read'),
    ('00000000-0000-0000-0000-000000000013', 'settings:manage', 'Manage Settings', 'Manage own settings', 'settings', 'manage'),
    ('00000000-0000-0000-0000-000000000014', 'notifications:read', 'View Notifications', 'View own notifications', 'notifications', 'read'),
    ('00000000-0000-0000-0000-000000000015', 'notifications:manage', 'Manage Notifications', 'Manage own notifications', 'notifications', 'manage'),
    ('00000000-0000-0000-0000-000000000016', 'users:read', 'View Users', 'View user list', 'users', 'read'),
    ('00000000-0000-0000-0000-000000000017', 'users:manage', 'Manage Users', 'Create, update, delete users', 'users', 'manage'),
    ('00000000-0000-0000-0000-000000000018', 'audit_logs:read', 'View Audit Logs', 'View system audit logs', 'audit_logs', 'read'),
    ('00000000-0000-0000-0000-000000000019', 'roles:manage', 'Manage Roles', 'Manage system roles', 'roles', 'manage'),
    ('00000000-0000-0000-0000-000000000020', 'permissions:manage', 'Manage Permissions', 'Manage system permissions', 'permissions', 'manage'),
    ('00000000-0000-0000-0000-000000000021', 'analytics:read', 'View Analytics', 'View analytics data', 'analytics', 'read')
ON CONFLICT (name) DO NOTHING;

-- Insert role-permission mappings
-- User role permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010'),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011'),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000012'),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000013'),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000014'),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000015')
ON CONFLICT DO NOTHING;

-- Admin role permissions (all user permissions + admin)
INSERT INTO role_permissions (role_id, permission_id) VALUES
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000011'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000012'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000013'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000014'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000015'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000016'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000017'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000018'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000021')
ON CONFLICT DO NOTHING;

-- Superadmin role permissions (all permissions)
INSERT INTO role_permissions (role_id, permission_id) VALUES
    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000010'),
    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000011'),
    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000012'),
    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000013'),
    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000014'),
    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000015'),
    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000016'),
    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000017'),
    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000018'),
    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000019'),
    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000020'),
    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000021')
ON CONFLICT DO NOTHING;

-- ============================================
-- Migration Complete
-- ============================================
