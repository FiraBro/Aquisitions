import 'dotenv/config.js';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/http';
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export { db, sql };
