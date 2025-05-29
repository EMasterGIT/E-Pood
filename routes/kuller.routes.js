const express = require('express');
const router = express.Router();
const controller = require('../controllers/kuller.controller');

router.get('/', controller.getAllKullers);
router.put('/orders/:orderId/assign-kuller', controller.assignKuller);




module.exports = router;