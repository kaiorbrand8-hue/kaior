const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendEmail } = require('../utils/sendEmail');

function primaryClientUrl() {
  return (process.env.CLIENT_URL || '').split(',')[0].trim() || 'http://localhost:3000';
}

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

// @route POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  // Same response whether or not the account exists, and whether it's a
  // Google-only account with no password — never reveal which emails are
  // registered.
  const genericResponse = {
    message: 'If an account with that email exists, a reset link has been sent.',
  };

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.password) {
    res.json(genericResponse);
    return;
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  const resetUrl = `${primaryClientUrl()}/reset-password/${rawToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your KAIOR password',
      html: `
        <p>Hi ${user.name},</p>
        <p>Click the link below to reset your KAIOR password. This link expires in 1 hour.</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });
  } catch (err) {
    // Don't leave a dangling reset token if the email never went out.
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(500);
    throw new Error('Failed to send the reset email. Please try again later.');
  }

  res.json(genericResponse);
});

// @route POST /api/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    res.status(400);
    throw new Error('Token and new password are required');
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) {
    res.status(400);
    throw new Error('This reset link is invalid or has expired');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password updated. You can now log in.' });
});

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  getMe,
  updateMe,
  addAddress,
  forgotPassword,
  resetPassword,
};
