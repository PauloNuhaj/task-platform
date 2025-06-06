const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Merr listën e userave (vetëm për manager)
router.get('/', protect, getUsers);

module.exports = router;