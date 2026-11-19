import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// Local secrets live in .env.local (git-ignored). On Vercel they come from project env vars.
config({ path: '.env.local' });
config();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Migrations need a direct (non-pooled) connection.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
