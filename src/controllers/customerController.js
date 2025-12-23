const Customer = require('../models/customerModel');

class CustomerController {
  // Lấy tất cả khách hàng
  static async getAll(req, res) {
    try {
      const customers = await Customer.getAll();
      res.json({
        success: true,
        data: customers
      });
    } catch (error) {
      console.error('Lỗi lấy danh sách khách hàng:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Lấy khách hàng theo ID
  static async getById(req, res) {
    try {
      const customer = await Customer.getById(req.params.id);
      if (!customer) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy khách hàng' 
        });
      }
      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      console.error('Lỗi lấy thông tin khách hàng:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Tìm kiếm khách hàng
  static async search(req, res) {
    try {
      const { keyword } = req.query;
      if (!keyword) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vui lòng nhập từ khóa tìm kiếm' 
        });
      }
      const customers = await Customer.search(keyword);
      res.json({
        success: true,
        data: customers
      });
    } catch (error) {
      console.error('Lỗi tìm kiếm khách hàng:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Tạo khách hàng mới
  static async create(req, res) {
    try {
      const { fullName, phoneNumber, customerType } = req.body;

      if (!fullName || !phoneNumber) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vui lòng nhập họ tên và số điện thoại' 
        });
      }

      const result = await Customer.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Thêm khách hàng thành công',
        customerId: result.insertId
      });
    } catch (error) {
      console.error('Lỗi tạo khách hàng:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Cập nhật thông tin khách hàng
  static async update(req, res) {
    try {
      const result = await Customer.update(req.params.id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy khách hàng' 
        });
      }
      res.json({
        success: true,
        message: 'Cập nhật khách hàng thành công'
      });
    } catch (error) {
      console.error('Lỗi cập nhật khách hàng:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Xóa khách hàng
  static async delete(req, res) {
    try {
      const result = await Customer.delete(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy khách hàng' 
        });
      }
      res.json({
        success: true,
        message: 'Xóa khách hàng thành công'
      });
    } catch (error) {
      console.error('Lỗi xóa khách hàng:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Lấy khách hàng VIP
  static async getVIPCustomers(req, res) {
    try {
      const customers = await Customer.getVIPCustomers();
      res.json({
        success: true,
        data: customers
      });
    } catch (error) {
      console.error('Lỗi lấy khách hàng VIP:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }
}

module.exports = CustomerController;
