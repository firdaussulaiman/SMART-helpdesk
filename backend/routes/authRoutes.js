const express = require('express');
const axios   = require('axios');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Helpers to sign our JWTs
function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      displayName: user.displayName,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { code, redirectUri } = req.body;
  try {
    // 1) Exchange code for Microsoft tokens
    const tokenRes = await axios.post(
      `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        scope: 'openid profile https://graph.microsoft.com/User.Read'
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const msAccessToken = tokenRes.data.access_token;

    // 2) Fetch MS user info
    const userRes = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${msAccessToken}` }
    });
    const msUser = userRes.data;

    // 3) Upsert into our DB
    let user = await User.findOne({ microsoftId: msUser.id });
    if (!user) {
      user = new User({
        microsoftId: msUser.id,
        displayName: msUser.displayName,
        email: msUser.mail || msUser.userPrincipalName,
        givenName: msUser.givenName,
        surname: msUser.surname,
        role: 'user',
        refreshTokens: []
      });
    } else {
      // keep info up to date
      user.displayName = msUser.displayName;
      user.email       = msUser.mail || msUser.userPrincipalName;
      user.givenName   = msUser.givenName;
      user.surname     = msUser.surname;
    }

    // 4) Generate our tokens
    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshTokens.push(refreshToken);
    await user.save();

    // 5) Send refreshToken in HttpOnly cookie, scoped to /refresh
    res.cookie('jid', refreshToken, {
      httpOnly: true,
      path: '/api/auth/refresh'
    });

    // 6) Return accessToken + user info
    res.json({ accessToken, user });
  } catch (err) {
    console.error('OAuth login failed:', err.response?.data || err.message);
    res.status(400).json({ error: 'OAuth login failed' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const token = req.cookies.jid;
  if (!token) return res.status(401).json({ error: 'No refresh token' });
  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user    = await User.findById(payload.userId);
    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (e) {
    console.error('Refresh failed:', e.message);
    res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
});

module.exports = router;