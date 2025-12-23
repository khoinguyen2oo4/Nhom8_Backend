const Medicine = require('../models/medicineModel');

class MedicineController {
  // Lấy tất cả thuốc
  static async getAll(req, res) {
    try {
      const medicines = await Medicine.getAll();
      res.json({
        success: true,
        data: medicines
      });
    } catch (error) {
      console.error('Lỗi lấy danh sách thuốc:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Lấy thuốc theo ID
  static async getById(req, res) {
    try {
      const medicine = await Medicine.getById(req.params.id);
      if (!medicine) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy thuốc' 
        });
      }
      res.json({
        success: true,
        data: medicine
      });
    } catch (error) {
      console.error('Lỗi lấy thông tin thuốc:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Tìm kiếm thuốc
  static async search(req, res) {
    try {
      const { keyword } = req.query;
      if (!keyword) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vui lòng nhập từ khóa tìm kiếm' 
        });
      }
      const medicines = await Medicine.search(keyword);
      res.json({
        success: true,
        data: medicines
      });
    } catch (error) {
      console.error('Lỗi tìm kiếm thuốc:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Tạo thuốc mới
  static async create(req, res) {
    try {
      const { medName, category, unit, price, stockQuantity, imageURL } = req.body;

      if (!medName || !price) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vui lòng nhập tên thuốc và giá' 
        });
      }

      const result = await Medicine.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Thêm thuốc thành công',
        medId: result.insertId
      });
    } catch (error) {
      console.error('Lỗi tạo thuốc:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Cập nhật thông tin thuốc
  static async update(req, res) {
    try {
      const result = await Medicine.update(req.params.id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy thuốc' 
        });
      }
      res.json({
        success: true,
        message: 'Cập nhật thuốc thành công'
      });
    } catch (error) {
      console.error('Lỗi cập nhật thuốc:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Cập nhật số lượng tồn kho
  static async updateStock(req, res) {
    try {
      const { quantity } = req.body;
      if (!quantity) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vui lòng nhập số lượng' 
        });
      }

      const result = await Medicine.updateStock(req.params.id, quantity);
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy thuốc' 
        });
      }
      res.json({
        success: true,
        message: 'Cập nhật tồn kho thành công'
      });
    } catch (error) {
      console.error('Lỗi cập nhật tồn kho:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Xóa thuốc
  static async delete(req, res) {
    try {
      const result = await Medicine.delete(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy thuốc' 
        });
      }
      res.json({
        success: true,
        message: 'Xóa thuốc thành công'
      });
    } catch (error) {
      console.error('Lỗi xóa thuốc:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Lấy thuốc sắp hết hàng
  static async getLowStock(req, res) {
    try {
      const threshold = req.query.threshold || 10;
      const medicines = await Medicine.getLowStock(threshold);
      res.json({
        success: true,
        data: medicines
      });
    } catch (error) {
      console.error('Lỗi lấy thuốc sắp hết:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }
}

module.exports = MedicineController;
