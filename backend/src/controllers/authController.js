const asyncHandler = require('express-async-handler');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  addresses: user.addresses,
});

// @route POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password, phone });

  res.status(201).json({
    ...sanitizeUser(user),
    token: generateToken(user._id),
  });
});

// @route POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    ...sanitizeUser(user),
    token: generateToken(user._id),
  });
});

// @route POST /api/auth/google
const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    res.status(400);
    throw new Error('Missing Google credential');
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    res.status(500);
    throw new Error('Google sign-in is not configured on the server');
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    res.status(401);
    throw new Error('Invalid Google credential');
  }

  if (!payload?.email || !payload.email_verified) {
    res.status(401);
    throw new Error('Google account email is not verified');
  }

  let user = await User.findOne({ googleId: payload.sub });

  if (!user) {
    user = await User.findOne({ email: payload.email.toLowerCase() });
    if (user) {
      // Existing email/password account signing in with Google for the first time.
      user.googleId = payload.sub;
      await user.save();
    }
  }

  if (!user) {
    user = await User.create({
      name: payload.name || payload.email.split('@')[0],
      email: payload.email,
      googleId: payload.sub,
    });
  }

  res.json({
    ...sanitizeUser(user),
    token: generateToken(user._id),
  });
});

// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json(sanitizeUser(req.user));
});

// @route PUT /api/auth/me
const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone ?? user.phone;
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updated = await user.save();
  res.json({ ...sanitizeUser(updated), token: generateToken(updated._id) });
});

// @route POST /api/auth/me/addresses
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json(user.addresses);
});

module.exports = { registerUser, loginUser, googleAuth, getMe, updateMe, addAddress };
