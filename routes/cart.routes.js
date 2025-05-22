const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const auth = require('../middlewares/authmiddleware');

router.post('/', auth, cartController.addToCart);
router.get('/', auth, cartController.getUserCart);
router.delete('/:id', auth, cartController.removeFromCart);

module.exports = router;
