import { MikroORM } from '@mikro-orm/core';
import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export const config = defineConfig({
  clientUrl: process.env.DATABASE_URL,
  pool: {
    min: 0,
    max: 10,
  },
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    path: './lib/db/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    safe: true,
  },
  entities: ['./lib/db/entities'],
  debug: process.env.NODE_ENV === 'development',
  validateRequired: true,
  forceUtcTimezone: true,
});

// Singleton pattern for connection management
let orm: MikroORM | null = null;

export async function getORM() {
  if (!orm) {
    orm = await MikroORM.init(config);
  }
  return orm;
}

export async function getEM() {
  const instance = await getORM();
  return instance.em.fork();
}

// Cleanup helper
export async function closeORM() {
  if (orm) {
    await orm.close();
    orm = null;
  }
}