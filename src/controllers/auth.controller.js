// ==============================
// auth.controller.js
// ==============================
import { AuthService } from '#services/auth.service.js';
import { registerSchema, loginSchema } from '#validations/auth.validator.js';
/* ---------------- COOKIE OPTIONS ---------------- */
const accessCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const AuthController = {
  /* ---------- REGISTER ---------- */
  async register(req, res, next) {
    try {
      const data = registerSchema.parse(req.body);

      const user = await AuthService.register(data);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user,
      });
    } catch (err) {
      next(err); // handled by global error middleware
    }
  },

  /* ---------- LOGIN ---------- */
  async login(req, res, next) {
    try {
      const data = loginSchema.parse(req.body);

      const { user, accessToken, refreshToken } = await AuthService.login(data);

      res
        .cookie('accessToken', accessToken, accessCookieOptions)
        .cookie('refreshToken', refreshToken, refreshCookieOptions)
        .status(200)
        .json({
          success: true,
          message: 'Login successful',
          data: user,
        });
    } catch (err) {
      next(err); // handled by global error middleware
    }
  },

  /* ---------- LOGOUT ---------- */
  async logout(req, res) {
    res
      .clearCookie('accessToken', { path: '/' })
      .clearCookie('refreshToken', { path: '/auth/refresh' })
      .status(200)
      .json({
        success: true,
        message: 'Logged out successfully',
      });
  },
};
