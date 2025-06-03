const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const auth = require('../middlewares/authmiddleware'); 
const requireRole = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management
 * 
 * components:
 *   schemas:
 *     OstukorviToode:
 *       type: object
 *       properties:
 *         OstukorviToodeID:
 *           type: integer
 *         OstukorvID:
 *           type: integer
 *         ToodeID:
 *           type: integer
 *         Kogus:
 *           type: integer
 *         Hind:
 *           type: string
 *           format: decimal
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         toode:
 *           type: object
 *           description: Product details
 *           properties:
 *             ToodeID:
 *               type: integer
 *             # Add other Toode fields here as needed
 * 
 *     Ostukorv:
 *       type: object
 *       properties:
 *         OstukorvID:
 *           type: integer
 *         KasutajaID:
 *           type: integer
 *         Staatus:
 *           type: string
 *           enum: [Aktiivne, Kinnitatud]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         ostukorviTooted:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OstukorviToode'
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ostukorv'
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toodeId
 *               - kogus
 *             properties:
 *               toodeId:
 *                 type: integer
 *                 description: ID of the product to add to cart
 *                 example: 1
 *               kogus:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantity of the product to add
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product added to cart.
 *                 cartItem:
 *                   type: object
 *                   properties:
 *                     OstukorvToodeID:
 *                       type: integer
 *                       example: 15
 *                     OstukorvID:
 *                       type: integer
 *                       example: 8
 *                     ToodeID:
 *                       type: integer
 *                       example: 1
 *                     Kogus:
 *                       type: integer
 *                       example: 2
 *                     Hind:
 *                       type: number
 *                       format: float
 *                       example: 19.99
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               examples:
 *                 invalid_input:
 *                   summary: Invalid input
 *                   value:
 *                     error: Product ID and valid quantity are required.
 *                 insufficient_stock:
 *                   summary: Insufficient stock
 *                   value:
 *                     error: Only 5 units available.
 *                 exceeds_cart_limit:
 *                   summary: Adding would exceed stock
 *                   value:
 *                     error: Adding 3 would exceed available stock. Current in cart 2, Available 4
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Product not found.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *                 detail:
 *                   type: string
 *                   example: Database connection error
 */

/**
 * @swagger
 * /cart/{productId}:
 *   put:
 *     summary: Update product quantity in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: toodeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kogus
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product quantity updated
 */

/**
 * @swagger
 * /cart/{productId}:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: toodeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to remove
 *     responses:
 *       204:
 *         description: Product removed from cart
 */

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Clear the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User's cart cleared
 */

// Kasutaja marsruudid
router.get('/:userId', auth, requireRole('user','admin'),cartController.getCart);
router.get('/', auth, requireRole('user','admin'),cartController.getCart);
router.post('/', auth, cartController.addToCart);
router.put('/:productId', auth, cartController.updateQuantity);
router.delete('/:productId', auth, cartController.remove);
router.delete('/', auth, cartController.clearUserCart);

// Admin ainult
router.get('/admin/all', auth, requireRole('admin'), cartController.getAllCarts);
// router.put('/admin/:cartId/status', auth, requireRole('admin'), cartController.updateCartStatus);
// router.put('/admin/:cartId/assign', auth, requireRole('admin'), cartController.assignRoles);
// router.get('/admin/:cartId', auth, requireRole('admin'), cartController.getCartWithAssignments);




module.exports = router;
