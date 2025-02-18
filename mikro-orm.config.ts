import { defineConfig } from '@mikro-orm/postgresql'
import { config } from './lib/db'

export default defineConfig(config)