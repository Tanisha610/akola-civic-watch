const express = require('express');
const multer = require('../middleware/upload');
const { protect, restrictTo } = require('../middleware/auth');
const {
  getIssues,
  getIssueById,
  createIssue,
  updateIssueStatus,
  upvoteIssue,
  deleteIssue,
  getHeatmapPoints
} = require('../controllers/issueController');

const router = express.Router();

router.get('/heatmap', getHeatmapPoints);
router.get('/', getIssues);
router.post('/', protect, multer.single('image'), createIssue);
router.get('/:id', getIssueById);
router.patch('/:id/status', protect, restrictTo('admin'), updateIssueStatus);
router.patch('/:id/upvote', protect, upvoteIssue);
router.delete('/:id', protect, restrictTo('admin'), deleteIssue);

module.exports = router;
