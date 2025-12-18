import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
export const users = pgTable('user', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAT: timestamp().defaultNow().notNull(),
});
