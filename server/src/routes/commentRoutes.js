const express = require('express');
const { protect } = require('../middleware/auth');
const { createComment, getComments } = require('../controllers/commentController');

const router = express.Router({ mergeParams: true });

router.get('/', getComments);
router.post('/', protect, createComment);

module.exports = router;
