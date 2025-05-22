const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const auth = require('../middlewares/authmiddleware');
const requireRole = require('../middlewares/roleMiddleware');

// User creates an order
router.post('/', auth, requireRole('user'), orderController.createOrder);

// Admin-only views
router.get('/', auth, requireRole('admin'), orderController.getAllOrders);
router.put('/:id', auth, requireRole('admin'), orderController.updateOrderStatus);
router.get('/my-orders', auth,requireRole('user'), orderController.getUserOrders);
module.exports = router;
