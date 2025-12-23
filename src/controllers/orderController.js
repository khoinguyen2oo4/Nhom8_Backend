const Order = require('../models/orderModel');
const Medicine = require('../models/medicineModel');

class OrderController {
  // Lấy tất cả đơn hàng
  static async getAll(req, res) {
    try {
      const orders = await Order.getAll();
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Lỗi lấy danh sách đơn hàng:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Lấy đơn hàng theo ID
  static async getById(req, res) {
    try {
      const order = await Order.getById(req.params.id);
      if (!order) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy đơn hàng' 
        });
      }

      // Lấy chi tiết đơn hàng
      const details = await Order.getDetails(req.params.id);
      
      res.json({
        success: true,
        data: {
          ...order,
          details
        }
      });
    } catch (error) {
      console.error('Lỗi lấy thông tin đơn hàng:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Tạo đơn hàng mới
  static async create(req, res) {
    try {
      const { totalAmount, customerId, items } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Đơn hàng phải có ít nhất 1 sản phẩm' 
        });
      }

      // Tạo đơn hàng
      const orderResult = await Order.create({ totalAmount, customerId });
      const orderId = orderResult.insertId;

      // Thêm chi tiết đơn hàng và cập nhật tồn kho
      for (const item of items) {
        await Order.createDetail({
          orderId,
          medId: item.medId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        });

        // Giảm số lượng tồn kho
        await Medicine.updateStock(item.medId, -item.quantity);
      }

      res.status(201).json({
        success: true,
        message: 'Tạo đơn hàng thành công',
        orderId
      });
    } catch (error) {
      console.error('Lỗi tạo đơn hàng:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Lấy đơn hàng theo ngày
  static async getByDate(req, res) {
    try {
      const { date } = req.query;
      if (!date) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vui lòng nhập ngày' 
        });
      }

      const orders = await Order.getByDate(date);
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Lỗi lấy đơn hàng theo ngày:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Lấy thống kê doanh thu
  static async getRevenue(req, res) {
    try {
      const { date } = req.query;
      if (!date) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vui lòng nhập ngày' 
        });
      }

      const revenue = await Order.getRevenueByDate(date);
      res.json({
        success: true,
        data: revenue
      });
    } catch (error) {
      console.error('Lỗi lấy thống kê doanh thu:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Lấy sản phẩm bán chạy
  static async getTopProducts(req, res) {
    try {
      const limit = req.query.limit || 10;
      const products = await Order.getTopProducts(limit);
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      console.error('Lỗi lấy sản phẩm bán chạy:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }

  // Xóa đơn hàng
  static async delete(req, res) {
    try {
      const result = await Order.delete(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy đơn hàng' 
        });
      }
      res.json({
        success: true,
        message: 'Xóa đơn hàng thành công'
      });
    } catch (error) {
      console.error('Lỗi xóa đơn hàng:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }
}

module.exports = OrderController;
