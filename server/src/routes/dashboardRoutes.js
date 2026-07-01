const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const { getAdminOverview, getCitizenOverview, getPublicOverview } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/public', getPublicOverview);
router.get('/admin', protect, restrictTo('admin'), getAdminOverview);
router.get('/citizen', protect, getCitizenOverview);

module.exports = router;
