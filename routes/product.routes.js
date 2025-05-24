const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const auth = require('../middlewares/authmiddleware');
const requireRole = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/upload'); // <- import multer config

// Anyone can view products
router.get('/', productController.getAllProducts);

// Admin-only actions (with image upload)
router.post('/', auth, requireRole('admin'), upload.single('image'), productController.addProduct);
router.put('/:id', auth, requireRole('admin'), upload.single('image'), productController.updateProduct);
router.delete('/:id', auth, requireRole('admin'), productController.deleteProduct);
router.get('/categories', productController.getCategories);

module.exports = router;
