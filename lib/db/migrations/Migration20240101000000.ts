import { Migration } from '@mikro-orm/migrations'

export class Migration20240101000000 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE "user" (
        "id" serial PRIMARY KEY,
        "email" varchar(255) NOT NULL UNIQUE,
        "name" varchar(255),
        "password_hash" varchar(255) NOT NULL,
        "role" varchar(50) NOT NULL DEFAULT 'user',
        "auth_provider" varchar(255),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE "content_entry" (
        "id" serial PRIMARY KEY,
        "slug" varchar(255) NOT NULL UNIQUE,
        "title" varchar(255) NOT NULL,
        "summary" text,
        "status" varchar(50) NOT NULL DEFAULT 'draft',
        "type" varchar(50) NOT NULL DEFAULT 'article',
        "author_id" int NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "published_at" timestamptz
      );

      CREATE INDEX "idx_content_entry_author" ON "content_entry"("author_id");
      CREATE INDEX "idx_content_entry_status" ON "content_entry"("status");
      CREATE INDEX "idx_content_entry_type" ON "content_entry"("type");

      CREATE TABLE "block" (
        "id" serial PRIMARY KEY,
        "content_entry_id" int NOT NULL REFERENCES "content_entry"(id) ON DELETE CASCADE,
        "type" varchar(50) NOT NULL,
        "position" int NOT NULL,
        "data" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "url" varchar(255),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      );

      CREATE INDEX "idx_block_content_entry" ON "block"("content_entry_id");

      CREATE TABLE "tag" (
        "id" serial PRIMARY KEY,
        "name" varchar(255) NOT NULL UNIQUE,
        "slug" varchar(255) NOT NULL UNIQUE,
        "type" varchar(50) NOT NULL,
        "description" text,
        "parent_id" int REFERENCES "tag"(id) ON DELETE CASCADE,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      );

      CREATE INDEX "idx_tag_parent" ON "tag"("parent_id");

      CREATE TABLE "content_entry_tags" (
        "content_entry_id" int NOT NULL REFERENCES "content_entry"(id) ON DELETE CASCADE,
        "tag_id" int NOT NULL REFERENCES "tag"(id) ON DELETE CASCADE,
        PRIMARY KEY ("content_entry_id", "tag_id")
      );

      CREATE TABLE "comment" (
        "id" serial PRIMARY KEY,
        "content_entry_id" int NOT NULL REFERENCES "content_entry"(id) ON DELETE CASCADE,
        "author_id" int NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        "content" text NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      );

      CREATE INDEX "idx_comment_content_entry" ON "comment"("content_entry_id");
      CREATE INDEX "idx_comment_author" ON "comment"("author_id");
    `);
  }

  async down(): Promise<void> {
    this.addSql(`
      DROP TABLE IF EXISTS "content_entry_tags";
      DROP TABLE IF EXISTS "comment";
      DROP TABLE IF EXISTS "block";
      DROP TABLE IF EXISTS "tag";
      DROP TABLE IF EXISTS "content_entry";
      DROP TABLE IF EXISTS "user";
    `);
  }
} 