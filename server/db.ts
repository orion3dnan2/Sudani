import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Default to local PostgreSQL if no DATABASE_URL is set
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/postgres';

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });