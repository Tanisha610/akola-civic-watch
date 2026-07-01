const path = require('path');
const Issue = require('../models/Issue');
const Comment = require('../models/Comment');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const wardCoordinates = require('../data/wardCoordinates');
const validWards = require('../data/wards');

const DEFAULT_COORDINATES = { latitude: 20.7168, longitude: 77.0016 };

const normalizeWardKey = (ward) =>
  String(ward || '')
    .trim()
    .toLowerCase()
    .replace(/^ward\s*\d+\s*[:\-]?\s*/i, '')
    .replace(/^ward\s*/i, '')
    .trim();

const normalizeWardList = validWards.map((ward) => normalizeWardKey(ward));

const getWardCoordinates = (ward) => {
  const normalizedWard = normalizeWardKey(ward);
  return wardCoordinates[normalizedWard] || wardCoordinates[`ward ${normalizedWard}`] || null;
};

const resolveCanonicalWard = (ward) => {
  const normalizedWard = normalizeWardKey(ward);
  const wardIndex = normalizeWardList.indexOf(normalizedWard);
  return wardIndex === -1 ? null : validWards[wardIndex];
};

const resolveIssueCoordinates = (issue) => {
  const coords = getWardCoordinates(issue.ward);
  const latitude = Number(coords?.latitude ?? issue.latitude ?? DEFAULT_COORDINATES.latitude);
  const longitude = Number(coords?.longitude ?? issue.longitude ?? DEFAULT_COORDINATES.longitude);

  return {
    latitude: Number.isFinite(latitude) ? latitude : DEFAULT_COORDINATES.latitude,
    longitude: Number.isFinite(longitude) ? longitude : DEFAULT_COORDINATES.longitude
  };
};

const applyWardCoordinates = (issue) => {
  const coords = resolveIssueCoordinates(issue);

  return {
    ...issue.toObject(),
    latitude: coords.latitude,
    longitude: coords.longitude
  };
};

const buildIssueFilter = (query) => {
  const filter = { status: { $ne: 'Resolved' } };

  if (String(query.includeResolved).toLowerCase() === 'true') {
    delete filter.status;
  }

  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;
  if (query.ward) filter.ward = new RegExp(query.ward, 'i');
  if (query.search) {
    filter.$or = [
      { title: new RegExp(query.search, 'i') },
      { description: new RegExp(query.search, 'i') },
      { ward: new RegExp(query.search, 'i') }
    ];
  }

  return filter;
};

const getIssues = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
  const skip = (page - 1) * limit;
  const filter = buildIssueFilter(req.query);

  const [issues, total] = await Promise.all([
    Issue.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Issue.countDocuments(filter)
  ]);

  res.json({
    status: 'success',
    results: issues.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: issues.map(applyWardCoordinates)
  });
});

const getIssueById = asyncHandler(async (req, res, next) => {
  const issue = await Issue.findById(req.params.id).populate('createdBy', 'name email role');
  if (!issue) {
    return next(new AppError('Issue not found.', 404));
  }

  const comments = await Comment.find({ issueId: issue._id })
    .populate('userId', 'name role')
    .sort({ createdAt: 1 });

  res.json({ status: 'success', data: { issue: applyWardCoordinates(issue), comments } });
});

const createIssue = asyncHandler(async (req, res, next) => {
  let { title, description, category, latitude, longitude, ward } = req.body;

  if (!title || !description || !category || !ward) {
    return next(new AppError('Title, description, category and ward are required.', 400));
  }

  const canonicalWard = resolveCanonicalWard(ward);
  if (!canonicalWard) {
    return next(new AppError('Please select a valid Akola ward.', 400));
  }

  ward = canonicalWard;

  const coords = resolveIssueCoordinates({ ward, latitude, longitude });
  latitude = coords.latitude;
  longitude = coords.longitude;

  const image = req.file ? `/uploads/${path.basename(req.file.path)}` : '';

  const issue = await Issue.create({
    title,
    description,
    category,
    latitude,
    longitude,
    ward,
    image,
    createdBy: req.user.id
  });

  res.status(201).json({ status: 'success', data: issue });
});

const updateIssueStatus = asyncHandler(async (req, res, next) => {
  const { status, department } = req.body;
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    return next(new AppError('Issue not found.', 404));
  }

  if (status) issue.status = status;
  if (department !== undefined) issue.department = department;
  await issue.save();

  res.json({ status: 'success', data: issue });
});

const upvoteIssue = asyncHandler(async (req, res, next) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    return next(new AppError('Issue not found.', 404));
  }

  issue.votes += 1;
  await issue.save();

  res.json({ status: 'success', data: { votes: issue.votes } });
});

const deleteIssue = asyncHandler(async (req, res, next) => {
  const issue = await Issue.findByIdAndDelete(req.params.id);
  if (!issue) {
    return next(new AppError('Issue not found.', 404));
  }

  await Comment.deleteMany({ issueId: issue._id });

  res.json({ status: 'success', message: 'Issue deleted successfully' });
});

const getHeatmapPoints = asyncHandler(async (req, res) => {
  const issues = await Issue.find({ status: { $ne: 'Resolved' } }, 'latitude longitude status category ward');
  res.json({
    status: 'success',
    data: issues.map((issue) => {
      const coords = resolveIssueCoordinates(issue);
      return [coords.latitude, coords.longitude, issue.status === 'Resolved' ? 0.4 : 1];
    })
  });
});

module.exports = {
  getIssues,
  getIssueById,
  createIssue,
  updateIssueStatus,
  upvoteIssue,
  deleteIssue,
  getHeatmapPoints
};
