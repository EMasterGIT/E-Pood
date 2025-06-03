const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - Nimi
 *         - Email
 *         - Parool
 *       properties:
 *         Nimi:
 *           type: string
 *         Email:
 *           type: string
 *         Telefoninumber:
 *           type: string
 *         Parool:
 *           type: string
 *         Roll:
 *           type: string
 *           default: user
 *     UserLogin:
 *       type: object
 *       required:
 *         - Email
 *         - Parool
 *       properties:
 *         Email:
 *           type: string
 *         Parool:
 *           type: string
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
