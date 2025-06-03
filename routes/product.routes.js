const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const auth = require('../middlewares/authmiddleware');
const requireRole = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/upload');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/models/Toode'
 */

/**
 * @swagger
 * /products/categories:
 *   get:
 *     summary: Get all product categories
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of product categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               Nimi:
 *                 type: string
 *               Kirjeldus:
 *                 type: string
 *               Hind:
 *                 type: number
 *               Kategooria:
 *                 type: string
 *               Laoseis:
 *                 type: integer
 *               Pilt:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               Nimi:
 *                 type: string
 *               Kirjeldus:
 *                 type: string
 *               Hind:
 *                 type: number
 *               Kategooria:
 *                 type: string
 *               Laoseis:
 *                 type: integer
 *               Pilt:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to delete
 *     responses:
 *       204:
 *         description: Product deleted successfully
 */

// Avalikud marsruudid
router.get('/', productController.getAllProducts);
router.get('/categories', productController.getCategories);

// Admin ainult
router.post('/', auth, requireRole('admin'), upload.single('Pilt'), productController.addProduct);
router.put('/:id', auth, requireRole('admin'), upload.single('Pilt'), productController.updateProduct);
router.delete('/:id', auth, requireRole('admin'), productController.deleteProduct);

module.exports = router;
