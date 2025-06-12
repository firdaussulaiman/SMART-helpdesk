const jwt = require('jsonwebtoken');

// 🔐 Middleware to verify JWT in the Authorization header
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Extract token from "Bearer <token>" format
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Verify JWT using the secret
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('❌ JWT verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach user info from token to the request object
    req.user = decoded;
    next();
  });
}

module.exports = authenticateToken;
