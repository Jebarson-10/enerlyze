import {integer,sqliteTable,text} from 'drizzle-orm/sqlite-core';

export const adminUsers=sqliteTable('admin_users',{
 id:text('id').primaryKey(),username:text('username').notNull().unique(),passwordHash:text('password_hash').notNull(),salt:text('salt').notNull(),role:text('role').notNull(),active:integer('active').notNull().default(1),failedAttempts:integer('failed_attempts').notNull().default(0),lockedUntil:integer('locked_until').notNull().default(0),createdAt:integer('created_at').notNull(),updatedAt:integer('updated_at').notNull(),
});
export const adminSessions=sqliteTable('admin_sessions',{
 tokenHash:text('token_hash').primaryKey(),userId:text('user_id').notNull().references(()=>adminUsers.id),expiresAt:integer('expires_at').notNull(),createdAt:integer('created_at').notNull(),
});
export const loginAttempts=sqliteTable('login_attempts',{
 key:text('key').primaryKey(),attempts:integer('attempts').notNull(),windowStart:integer('window_start').notNull(),
});
export const contentChanges=sqliteTable('content_changes',{
 id:text('id').primaryKey(),targetKey:text('target_key').notNull(),kind:text('kind').notNull(),payloadJson:text('payload_json').notNull(),baseChangeId:text('base_change_id'),status:text('status').notNull().default('pending'),authorId:text('author_id').notNull().references(()=>adminUsers.id),reviewerId:text('reviewer_id').references(()=>adminUsers.id),reviewNonce:text('review_nonce'),reviewedAt:integer('reviewed_at'),createdAt:integer('created_at').notNull(),
});
export const publishedRecords=sqliteTable('published_records',{
 key:text('key').primaryKey(),payloadJson:text('payload_json').notNull(),updatedAt:integer('updated_at').notNull(),changeId:text('change_id').notNull(),
});
export const mediaAssets=sqliteTable('media_assets',{
 id:text('id').primaryKey(),objectKey:text('object_key').notNull(),mime:text('mime').notNull(),byteSize:integer('byte_size').notNull(),uploadedBy:text('uploaded_by').notNull().references(()=>adminUsers.id),published:integer('published').notNull().default(0),createdAt:integer('created_at').notNull(),
});
