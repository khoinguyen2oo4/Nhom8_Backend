const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');

// Tất cả routes đều yêu cầu xác thực
router.use(authMiddleware);

router.get('/', CustomerController.getAll);
router.get('/search', CustomerController.search);
router.get('/vip', CustomerController.getVIPCustomers);
router.get('/:id', CustomerController.getById);
router.post('/', CustomerController.create);
router.put('/:id', CustomerController.update);
router.delete('/:id', CustomerController.delete);

module.exports = router;
