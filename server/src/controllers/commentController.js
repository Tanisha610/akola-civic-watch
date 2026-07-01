const Issue = require('../models/Issue');
const Comment = require('../models/Comment');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const createComment = asyncHandler(async (req, res, next) => {
  const { text, markResolved } = req.body;
  const { issueId } = req.params;

  if (!text) {
    return next(new AppError('Comment text is required.', 400));
  }

  const issue = await Issue.findById(issueId);
  if (!issue) {
    return next(new AppError('Issue not found.', 404));
  }

  const shouldResolve = String(markResolved).toLowerCase() === 'true';
  if (shouldResolve) {
    const isOwner = String(issue.createdBy) === String(req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return next(new AppError('Only the issue creator or an admin can mark it as solved.', 403));
    }
  }

  const comment = await Comment.create({
    issueId,
    userId: req.user.id,
    text
  });

  if (shouldResolve) {
    issue.status = 'Resolved';
    await issue.save();
  }

  const populated = await Comment.findById(comment._id).populate('userId', 'name role');
  res.status(201).json({
    status: 'success',
    data: populated,
    issueStatus: issue.status,
    resolved: shouldResolve
  });
});

const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ issueId: req.params.issueId })
    .populate('userId', 'name role')
    .sort({ createdAt: 1 });

  res.json({ status: 'success', results: comments.length, data: comments });
});

module.exports = { createComment, getComments };
