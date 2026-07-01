const express = require('express');
const { register, login, firebaseLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/firebase', firebaseLogin);

module.exports = router;
