const User = require('../models/User');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { signToken } = require('../middleware/auth');

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Name, email, and password are required.', 400));
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return next(new AppError('An account with this email already exists.', 409));
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: process.env.ADMIN_EMAILS && process.env.ADMIN_EMAILS.split(',').includes(normalizedEmail) ? 'admin' : 'citizen'
  });

  const token = signToken(user);

  res.status(201).json({
    status: 'success',
    token,
    user
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required.', 400));
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    return next(new AppError('Invalid email or password.', 401));
  }

  const passwordMatches = await bcrypt.compare(password, user.password || '');
  if (!passwordMatches) {
    return next(new AppError('Invalid email or password.', 401));
  }

  user.password = undefined;
  const token = signToken(user);

  res.status(200).json({
    status: 'success',
    token,
    user
  });
});

const firebaseLogin = asyncHandler(async (req, res, next) => {
  return next(new AppError('Firebase login is disabled. Use email and password.', 400));
});

const syncUser = asyncHandler(async (req, res, next) => {
  const { decoded } = req.body;

  const user = await User.findOneAndUpdate(
    { email: decoded.email },
    {
      name: decoded.name || decoded.email.split('@')[0],
      email: decoded.email,
      phone: decoded.phone_number || '',
      role: process.env.ADMIN_EMAILS && process.env.ADMIN_EMAILS.split(',').includes(decoded.email) ? 'admin' : 'citizen'
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const token = signToken(user);

  res.status(200).json({
    status: 'success',
    token,
    user
  });
});

module.exports = { register, login, firebaseLogin, syncUser };
