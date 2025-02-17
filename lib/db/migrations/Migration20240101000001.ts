import { Migration } from '@mikro-orm/migrations'

export class Migration20240101000001 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "content_entry" (
        "id" serial PRIMARY KEY,
        "slug" varchar(255) NOT NULL UNIQUE,
        "title" varchar(255) NOT NULL,
        "summary" text,
        "status" varchar(50) NOT NULL DEFAULT 'draft',
        "type" varchar(50) NOT NULL DEFAULT 'article',
        "author_id" int NOT NULL REFERENCES "user"(id),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "published_at" timestamptz
      );

      CREATE TABLE IF NOT EXISTS "block" (
        "id" serial PRIMARY KEY,
        "content_entry_id" int NOT NULL REFERENCES "content_entry"(id) ON DELETE CASCADE,
        "type" varchar(50) NOT NULL,
        "position" int NOT NULL,
        "data" jsonb NOT NULL DEFAULT '{}',
        "url" varchar(255),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "tag" (
        "id" serial PRIMARY KEY,
        "name" varchar(255) NOT NULL UNIQUE,
        "slug" varchar(255) NOT NULL UNIQUE,
        "type" varchar(50) NOT NULL,
        "description" text,
        "parent_id" int REFERENCES "tag"(id),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "content_entry_tags" (
        "content_entry_id" int NOT NULL REFERENCES "content_entry"(id) ON DELETE CASCADE,
        "tag_id" int NOT NULL REFERENCES "tag"(id) ON DELETE CASCADE,
        PRIMARY KEY ("content_entry_id", "tag_id")
      );

      CREATE TABLE IF NOT EXISTS "comment" (
        "id" serial PRIMARY KEY,
        "content_entry_id" int NOT NULL REFERENCES "content_entry"(id) ON DELETE CASCADE,
        "author_id" int NOT NULL REFERENCES "user"(id),
        "content" text NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      );

      -- Create indexes for better performance
      CREATE INDEX "idx_content_entry_author" ON "content_entry"("author_id");
      CREATE INDEX "idx_content_entry_status" ON "content_entry"("status");
      CREATE INDEX "idx_content_entry_type" ON "content_entry"("type");
      CREATE INDEX "idx_block_content_entry" ON "block"("content_entry_id");
      CREATE INDEX "idx_tag_parent" ON "tag"("parent_id");
      CREATE INDEX "idx_comment_content_entry" ON "comment"("content_entry_id");
      CREATE INDEX "idx_comment_author" ON "comment"("author_id");
    `)
  }

  async down(): Promise<void> {
    this.addSql(`
      DROP TABLE IF EXISTS "content_entry_tags";
      DROP TABLE IF EXISTS "comment";
      DROP TABLE IF EXISTS "block";
      DROP TABLE IF EXISTS "tag";
      DROP TABLE IF EXISTS "content_entry";
    `)
  }
} 