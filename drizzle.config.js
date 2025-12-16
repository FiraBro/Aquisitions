import 'dotenv/config.js';

export default {
  schema: './src/models/*.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // FIXED: changed from dbCredential to dbCredentials
    url: process.env.DATABASE_URL,
  },
};
