import { MikroORM } from '@mikro-orm/core';
import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { User, ContentEntry, Block, Tag, Comment } from './entities';

export const config = defineConfig({
  clientUrl: process.env.DATABASE_URL,
  entities: [User, ContentEntry, Block, Tag, Comment],
  migrations: {
    path: './lib/db/migrations',
    glob: '!(*.d).{js,ts}',
  },
  driverOptions: {
    connection: { ssl: true },
  },
  pool: { min: 0, max: 10 },
  debug: process.env.NODE_ENV === 'development',
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