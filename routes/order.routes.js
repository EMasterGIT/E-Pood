const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const auth = require('../middlewares/authmiddleware');
const requireRole = require('../middlewares/roleMiddleware');



router.post('/', auth, requireRole('user'), orderController.createOrder);
router.get('/my-carts', auth, requireRole('user'), orderController.getUserCarts);
router.get('/unassigned', orderController.getUnassignedOrders);

// Admin routes
router.get('/all', auth, requireRole('admin'), orderController.getAllOrders);
router.put('/:id/status', auth, requireRole('admin'), orderController.updateOrderStatus);




module.exports = router;
