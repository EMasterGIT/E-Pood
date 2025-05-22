const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const auth = require('../middlewares/authmiddleware');
const requireRole = require('../middlewares/roleMiddleware');

// Anyone can view products
router.get('/', productController.getAllProducts);

// Admin-only actions
router.post('/', auth, requireRole('admin'), productController.addProduct);
router.put('/:id', auth, requireRole('admin'), productController.updateProduct);
router.delete('/:id', auth, requireRole('admin'), productController.deleteProduct);

module.exports = router;
