const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./userModel');
const config = require('./config');

// Function to generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.jwtSecret, {
    expiresIn: '24h', // expires in 24 hours
  });
};

// Signup controller
exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send({ message: 'User already exists' });
    }

    // Create a new user
    const user = new User({
      username,
      email,
      password,
      role,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).send({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Logout controller
exports.logout = (req, res) => {
  // For JWT, logout is handled client-side by removing the token,
  // so this function might just inform the client about the process.
  res.send({ message: 'Logout successful. Please remove the token on the client side.' });
};
