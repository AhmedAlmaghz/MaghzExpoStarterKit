/**
 * Database Schema Definitions
 *
 * Drizzle ORM schema definitions for all database tables.
 * Includes users, profiles, sessions, notifications, settings, and audit logs.
 *
 * @module lib/db/schema
 */
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

/**
 * Users table - Core user authentication data
 */
export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash'),
    emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
    phone: text('phone'),
    phoneVerified: integer('phone_verified', { mode: 'boolean' }).default(false),
    role: text('role', { enum: ['user', 'admin', 'superadmin'] }).default('user'),
    status: text('status', { enum: ['active', 'inactive', 'suspended', 'pending'] }).default('pending'),
    lastLoginAt: text('last_login_at'),
    failedLoginAttempts: integer('failed_login_attempts').default(0),
    lockedUntil: text('locked_until'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
});

/**
 * User profiles table - Extended user information
 */
export const profiles = sqliteTable('profiles', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    displayName: text('display_name'),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),
    dateOfBirth: text('date_of_birth'),
    gender: text('gender', { enum: ['male', 'female', 'other', 'prefer_not_to_say'] }),
    address: text('address'),
    city: text('city'),
    country: text('country'),
    timezone: text('timezone').default('UTC'),
    locale: text('locale', { enum: ['en', 'ar'] }).default('en'),
    themeMode: text('theme_mode', { enum: ['light', 'dark', 'system'] }).default('system'),
    notificationsEnabled: integer('notifications_enabled', { mode: 'boolean' }).default(true),
    emailNotifications: integer('email_notifications', { mode: 'boolean' }).default(true),
    pushNotifications: integer('push_notifications', { mode: 'boolean' }).default(true),
    twoFactorEnabled: integer('two_factor_enabled', { mode: 'boolean' }).default(false),
    twoFactorSecret: text('two_factor_secret'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
});

/**
 * User sessions table - Active user sessions
 */
export const sessions = sqliteTable('sessions', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull(),
    refreshToken: text('refresh_token').notNull(),
    deviceInfo: text('device_info'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    expiresAt: text('expires_at').notNull(),
    createdAt: text('created_at').notNull(),
    lastAccessedAt: text('last_accessed_at'),
});

/**
 * Notifications table - User notifications
 */
export const notifications = sqliteTable('notifications', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: text('type', { enum: ['info', 'warning', 'error', 'success'] }).default('info'),
    title: text('title').notNull(),
    message: text('message').notNull(),
    data: text('data'), // JSON string for additional data
    read: integer('read', { mode: 'boolean' }).default(false),
    readAt: text('read_at'),
    actionUrl: text('action_url'),
    actionText: text('action_text'),
    scheduledFor: text('scheduled_for'),
    sentAt: text('sent_at'),
    createdAt: text('created_at').notNull(),
});

/**
 * User settings table - Application settings
 */
export const settings = sqliteTable('settings', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    key: text('key').notNull(),
    value: text('value'),
    category: text('category').default('general'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
});

/**
 * Audit logs table - System activity tracking
 */
export const auditLogs = sqliteTable('audit_logs', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id'),
    oldValues: text('old_values'), // JSON string
    newValues: text('new_values'), // JSON string
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    metadata: text('metadata'), // JSON string
    createdAt: text('created_at').notNull(),
});

/**
 * Roles table - User roles for RBAC
 */
export const roles = sqliteTable('roles', {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    displayName: text('display_name').notNull(),
    description: text('description'),
    createdAt: text('created_at').notNull(),
});

/**
 * Permissions table - System permissions
 */
export const permissions = sqliteTable('permissions', {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    displayName: text('display_name').notNull(),
    description: text('description'),
    resource: text('resource').notNull(),
    action: text('action').notNull(),
    createdAt: text('created_at').notNull(),
});

/**
 * Role-Permission junction table
 */
export const rolePermissions = sqliteTable('role_permissions', {
    roleId: text('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: text('permission_id').notNull().references(() => permissions.id, { onDelete: 'cascade' }),
});

/**
 * User-Role junction table
 */
export const userRoles = sqliteTable('user_roles', {
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    roleId: text('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
});

/**
 * Analytics events table - User activity tracking
 */
export const analyticsEvents = sqliteTable('analytics_events', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    eventName: text('event_name').notNull(),
    eventCategory: text('event_category'),
    eventLabel: text('event_label'),
    eventValue: real('event_value'),
    properties: text('properties'), // JSON string
    sessionId: text('session_id'),
    createdAt: text('created_at').notNull(),
});

// ============================================
// Relations
// ============================================

export const usersRelations = relations(users, ({ one, many }) => ({
    profile: one(profiles, {
        fields: [users.id],
        references: [profiles.userId],
    }),
    sessions: many(sessions),
    notifications: many(notifications),
    settings: many(settings),
    auditLogs: many(auditLogs),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
    user: one(users, {
        fields: [profiles.userId],
        references: [users.id],
    }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(users, {
        fields: [notifications.userId],
        references: [users.id],
    }),
}));

export const settingsRelations = relations(settings, ({ one }) => ({
    user: one(users, {
        fields: [settings.userId],
        references: [users.id],
    }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
    user: one(users, {
        fields: [auditLogs.userId],
        references: [users.id],
    }),
}));

// ============================================
// Type Exports
// ============================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
export type Role = typeof roles.$inferSelect;
export type Permission = typeof permissions.$inferSelect;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
