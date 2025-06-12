
// ===========================
// 📁 File: backend/routes/authRoutes.js
// ===========================

const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

// 🔐 Microsoft Login Handler
router.post('/login', async (req, res) => {
  const { code, redirectUri } = req.body;

  try {
    const tokenRes = await axios.post(
      `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        scope: 'https://graph.microsoft.com/User.Read',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const profile = userRes.data;

    let user = await User.findOne({ microsoftId: profile.id });

    if (!user) {
      user = new User({
        microsoftId: profile.id,
        displayName: profile.displayName,
        email: profile.mail || profile.userPrincipalName,
        givenName: profile.givenName,
        surname: profile.surname,
        preferredLanguage: profile.preferredLanguage,
        jobTitle: profile.jobTitle,
      });
      await user.save();
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        displayName: user.displayName,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error('❌ OAuth Error:', err.response?.data || err.message);
    res.status(400).json({ error: 'OAuth login failed' });
  }
});

module.exports = router;