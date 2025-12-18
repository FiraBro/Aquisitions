// ==============================
// auth.service.js
// ==============================
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';

/* ---------------- ENV SAFETY ---------------- */
if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error('JWT secrets are not configured');
}

/* ---------------- CONSTANTS ---------------- */
const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES = '7d';

/* ---------------- HELPERS ---------------- */
const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });

const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
  });

/* ==============================
   AUTH SERVICE
================================ */
export const AuthService = {
  /* ---------- REGISTER ---------- */
  async register({ name, email, password }) {
    try {
      // Email uniqueness enforced at DB level
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const [user] = await db
        .insert(users)
        .values({
          name,
          email, // already normalized by Zod
          password: hashedPassword,
        })
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
        });

      logger.info('User registered', { userId: user.id });

      return user;
    } catch (err) {
      // Handle duplicate email constraint safely
      if (err.code === '23505') {
        err.statusCode = 409;
        err.message = 'Email already in use';
      }

      logger.error('Register failed', { error: err.message });
      throw err;
    }
  },

  /* ---------- LOGIN ---------- */
  async login({ email, password }) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Constant-time failure
    if (!user || !(await bcrypt.compare(password, user.password))) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    logger.info('User logged in', { userId: user.id });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  },
};
