// ==============================
// auth.refresh.controller.js
// ==============================
import jwt from 'jsonwebtoken';

export async function refreshToken(req, res) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token missing',
    });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: payload.id, role: payload.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' },
    );

    const newRefreshToken = jwt.sign(
      { id: payload.id, role: payload.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' },
    );

    res
      .cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 15 * 60 * 1000,
      })
      .cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: true });
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }
}
