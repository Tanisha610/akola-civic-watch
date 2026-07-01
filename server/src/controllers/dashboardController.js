const Issue = require('../models/Issue');
const Comment = require('../models/Comment');
const asyncHandler = require('../utils/asyncHandler');

const buildOverview = async () => {
  const [statusStats, categoryStats, wardStats, recentIssues, commentCount] = await Promise.all([
    Issue.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Issue.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Issue.aggregate([{ $group: { _id: '$ward', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 8 }]),
    Issue.find({ status: { $ne: 'Resolved' } }).sort({ createdAt: -1 }).limit(5).populate('createdBy', 'name email'),
    Comment.countDocuments()
  ]);

  const totalComplaints = await Issue.countDocuments();
  const resolvedCount = statusStats.find((entry) => entry._id === 'Resolved')?.count || 0;
  const activeWardCount = wardStats.length;
  const openCount = totalComplaints - resolvedCount;

  return {
    statusStats,
    categoryStats,
    wardStats,
    recentIssues,
    totalComments: commentCount,
    totalComplaints,
    resolvedCount,
    activeWardCount,
    openCount
  };
};

const getPublicOverview = asyncHandler(async (req, res) => {
  const overview = await buildOverview();
  res.json({ status: 'success', data: overview });
});

const getAdminOverview = asyncHandler(async (req, res) => {
  const overview = await buildOverview();
  res.json({ status: 'success', data: overview });
});

const getCitizenOverview = asyncHandler(async (req, res) => {
  const allIssues = await Issue.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
  const issues = allIssues.filter((issue) => issue.status !== 'Resolved');
  const counts = allIssues.reduce(
    (acc, issue) => {
      acc[issue.status] = (acc[issue.status] || 0) + 1;
      return acc;
    },
    { Reported: 0, 'Under Review': 0, 'In Progress': 0, Resolved: 0 }
  );

  res.json({
    status: 'success',
    data: {
      issues,
      counts,
      total: issues.length
    }
  });
});

module.exports = { getAdminOverview, getCitizenOverview, getPublicOverview };
