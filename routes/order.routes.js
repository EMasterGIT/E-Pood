const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const auth = require('../middlewares/authmiddleware');
const requireRole = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 * 
 * components:
 *   schemas:
 *     Tellimus:
 *       type: object
 *       properties:
 *         TellimusID:
 *           type: integer
 *         KasutajaID:
 *           type: integer
 *         OstukorvID:
 *           type: integer
 *           nullable: true
 *         KullerID:
 *           type: integer
 *           nullable: true
 *         Staatus:
 *           type: string
 *           example: Ootel
 *         Asukoht:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         kasutaja:
 *           type: object
 *           description: User who made the order
 *         ostukorv:
 *           type: object
 *           description: Cart associated with the order
 *         kuller:
 *           type: object
 *           description: Courier assigned to the order
 */


/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order (Tellimus)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ostukorvId
 *               - location
 *             properties:
 *               ostukorvId:
 *                 type: integer
 *                 description: ID of the shopping cart to create order from
 *                 example: 5
 *               location:
 *                 type: string
 *                 description: Delivery location
 *                 example: Tallinn, Tartu mnt 1
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tellimus edukalt loodud
 *                 order:
 *                   type: object
 *                   properties:
 *                     TellimusID:
 *                       type: integer
 *                       example: 123
 *                     KasutajaID:
 *                       type: integer
 *                       example: 4
 *                     OstukorvID:
 *                       type: integer
 *                       example: 5
 *                     KullerID:
 *                       type: integer
 *                       example: 2
 *                     Staatus:
 *                       type: string
 *                       example: Ootel
 *                     Asukoht:
 *                       type: string
 *                       example: Tallinn, Tartu mnt 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 orderId:
 *                   type: integer
 *                   example: 123
 *                 assignedKuller:
 *                   type: object
 *                   properties:
 *                     KullerID:
 *                       type: integer
 *                       example: 2
 *                     Nimi:
 *                       type: string
 *                       example: Jaan Tamm
 *                 assignedTeenindaja:
 *                   type: object
 *                   properties:
 *                     TeenindajaID:
 *                       type: integer
 *                       example: 45
 *                     Nimi:
 *                       type: string
 *                       example: Teenindaja tellimuse jaoks 123
 *                     TellimusID:
 *                       type: integer
 *                       example: 123
 *                     KullerID:
 *                       type: integer
 *                       example: 2
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
 *                 missing_fields:
 *                   summary: Missing required fields
 *                   value:
 *                     error: Asukoht on vaja sisestada
 *                 cart_not_found:
 *                   summary: Active cart not found
 *                   value:
 *                     error: Aktiivset ostukorvi ei leitud
 *                 empty_cart:
 *                   summary: Cart is empty
 *                   value:
 *                     error: Ostukorv on tühi
 *                 insufficient_stock:
 *                   summary: Insufficient stock
 *                   value:
 *                     error: Ebapiisav kogus ProductName. Saadaval 5, Nõutud 10
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Tellimuse loomine nurjus
 *                 detail:
 *                   type: string
 *                   example: Database connection error
 */

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to delete
 *     responses:
 *       204:
 *         description: Order deleted successfully
 */

/**
 * @swagger
 * /orders/my-carts:
 *   get:
 *     summary: Get user's carts
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user's carts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tellimus'
 */

/**
 * @swagger
 * /orders/all:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tellimus'
 */

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Saadetud"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 */

router.post('/', auth, requireRole('user','admin'), orderController.createOrder);
router.get('/my-carts', auth, requireRole('user','admin'), orderController.getUserCarts);

// Admin ainult
router.get('/all', auth, requireRole('admin'), orderController.getAllOrders);
router.put('/:id/status', auth, requireRole('admin'), orderController.updateOrderStatus);
router.delete('/:id', auth, requireRole('admin'), orderController.deleteOrder);

module.exports = router;
