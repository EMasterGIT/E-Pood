const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const auth = require('../middlewares/authmiddleware'); 
const requireRole = require('../middlewares/roleMiddleware');



router.get('/', auth, cartController.getCart);
router.post('/', auth, cartController.addToCart);

router.put('/:productId', auth, cartController.updateQuantity); 
router.delete('/:productId', auth, cartController.remove);      
router.delete('/', auth, cartController.clearUserCart); 

// Admin routes 
router.get('/admin/all', auth, requireRole('admin'), cartController.getAllCarts);
router.put('/admin/:cartId/status', auth, requireRole('admin'), cartController.updateCartStatus);
router.put('/admin/:cartId/assign', auth, requireRole('admin'), cartController.assignRoles);
router.get('/admin/:cartId', auth, requireRole('admin'), cartController.getCartWithAssignments);


router.get('/:userId', cartController.getCart);

module.exports = router;


