// File: backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Verify JWT and attach payload to req.user
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = payload; // contains userId, email, displayName, role, iat, exp
    next();
  });
}

// Authorize only specified roles
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Requires one of [${allowedRoles.join(', ')}]` });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };

// This middleware verifies JWT tokens and checks user roles
// for access control. It can be used in routes to protect endpoints
// and restrict access based on user roles like 'admin', 'agent', etc.
// Usage example in a route file:			