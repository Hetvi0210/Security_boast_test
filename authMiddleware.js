const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('./userModel');

// Middleware to verify token and protect routes
const verifyToken = (req, res, next) => {
  // Get token from header
  const token = req.headers['authorization'];

  // Check if token is not present
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  // Verify token
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    // Save user id for future requests
    req.userId = decoded.id;
    next();
  });
};

// Middleware to check if the user role matches the required role
const checkRole = (roles) => (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (roles.includes(user.role)) {
      next();
      return;
    }

    res.status(403).send({ message: "Require " + roles.join(" or ") + " Role!" });
  });
};

module.exports = {
  verifyToken,
  checkRole,
};
