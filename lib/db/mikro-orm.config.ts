import { defineConfig } from '@mikro-orm/postgresql';
import { User } from './entities/User';
import { ContentEntry } from './entities/ContentEntry';
import { Block } from './entities/Block';
import { Tag } from './entities/Tag';
import { Comment } from './entities/Comment';

export default defineConfig({
  entities: [User, ContentEntry, Block, Tag, Comment],
  dbName: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  debug: process.env.NODE_ENV === 'development',
  migrations: {
    path: './migrations',
    glob: '!(*.d).{js,ts}',
  },
});