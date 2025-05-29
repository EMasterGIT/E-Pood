const express = require('express');
const router = express.Router();
const controller = require('../controllers/teenindaja.controller');

// Fetch all teenindajad
router.get('/', controller.getAllTeenindajad);


router.post('/orders/:orderId/assign-teenindaja', controller.assignTeenindaja);


module.exports = router;