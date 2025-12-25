const express = require('express');
const router = express.Router();
const MedicineController = require('../controllers/medicineController');
const authMiddleware = require('../middleware/authMiddleware');

// Tất cả routes đều yêu cầu xác thực
//router.use(authMiddleware);

router.get('/', MedicineController.getAll);
router.get('/search', MedicineController.search);
router.get('/low-stock', MedicineController.getLowStock);
router.get('/:id', MedicineController.getById);
router.post('/', MedicineController.create);
router.put('/:id', MedicineController.update);
router.patch('/:id/stock', MedicineController.updateStock);
router.delete('/:id', MedicineController.delete);

module.exports = router;
