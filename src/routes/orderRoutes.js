const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Tất cả routes đều yêu cầu xác thực
router.use(authMiddleware);

router.get('/', OrderController.getAll);
router.get('/by-date', OrderController.getByDate);
router.get('/revenue', OrderController.getRevenue);
router.get('/top-products', OrderController.getTopProducts);
router.get('/:id', OrderController.getById);
router.post('/', OrderController.create);
router.delete('/:id', OrderController.delete);

module.exports = router;
