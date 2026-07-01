const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-__v');
  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  res.json({ status: 'success', data: user });
});

const updateMe = asyncHandler(async (req, res, next) => {
  const allowedFields = ['name', 'phone', 'ward'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-__v');

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  res.json({ status: 'success', data: user });
});

module.exports = { getMe, updateMe };