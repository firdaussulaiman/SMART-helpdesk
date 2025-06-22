const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Public route
router.get('/public', (req, res) => {
  res.json({ message: 'This is a public route' });
});

// Protected route
router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Access granted to protected route',
    user: req.user, // user decoded from token
  });
});

module.exports = router;
// This route file defines both public and protected routes
// using the authMiddleware to protect the '/protected' route.		