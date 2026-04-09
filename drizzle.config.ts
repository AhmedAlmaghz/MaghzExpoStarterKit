/**
 * Drizzle ORM Configuration
 *
 * Configuration for Drizzle Kit to manage database migrations.
 * Update the connection string and schema path as needed.
 *
 * @see https://orm.drizzle.team/kit-docs/config-reference
 */
import type { Config } from 'drizzle-kit';

const drizzleConfig: Config = {
    schema: './src/db/schema.ts',
    out: './src/db/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'postgresql://localhost:5432/expotemplate',
    },
    verbose: true,
    strict: true,
};

export default drizzleConfig;