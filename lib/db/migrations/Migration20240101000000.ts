import { Migration } from '@mikro-orm/migrations'

export class Migration20240101000000 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" serial PRIMARY KEY,
        "email" varchar(255) NOT NULL UNIQUE,
        "name" varchar(255),
        "password_hash" varchar(255) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "content_entry" (
        -- ... your schema
      );

      -- Add other tables
    `)
  }
} 