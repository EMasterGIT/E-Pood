const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authmiddleware');
const requireRole = require('../middlewares/roleMiddleware');

// Protected route for all logged-in users
router.get('/dashboard', auth, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, your role is ${req.user.roll}` });
});

// Admin-only route
router.get('/admin', auth, requireRole('admin'), (req, res) => {
  res.json({ message: 'Tere tulemast admin' });
});

module.exports = router;
