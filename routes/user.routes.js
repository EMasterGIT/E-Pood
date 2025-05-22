const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Protected route for all logged-in users
router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, your role is ${req.user.roll}` });
});

// Admin-only route
router.get('/admin', authMiddleware, roleMiddleware('admin'), (req, res) => {
  res.json({ message: 'Welcome admin, you have special access.' });
});

module.exports = router;
