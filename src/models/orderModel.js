const { sql, poolPromise } = require('../config/database');

class Order {
  // Tạo đơn hàng mới
  static async create(orderData) {
    const { totalAmount, customerId } = orderData;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('totalAmount', sql.Decimal(18, 0), totalAmount)
      .input('customerId', sql.Int, customerId || null)
      .query(`
        INSERT INTO Orders (TotalAmount, CustomerID) 
        VALUES (@totalAmount, @customerId);
        SELECT SCOPE_IDENTITY() AS insertId;
      `);
    return { insertId: result.recordset[0].insertId };
  }

  // Tạo chi tiết đơn hàng
  static async createDetail(detailData) {
    const { orderId, medId, quantity, unitPrice } = detailData;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('orderId', sql.Int, orderId)
      .input('medId', sql.Int, medId)
      .input('quantity', sql.Int, quantity)
      .input('unitPrice', sql.Decimal(18, 0), unitPrice)
      .query('INSERT INTO OrderDetails (OrderID, MedID, Quantity, UnitPrice) VALUES (@orderId, @medId, @quantity, @unitPrice)');
    return { affectedRows: result.rowsAffected[0] };
  }

  // Lấy tất cả đơn hàng
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT o.*, c.FullName as CustomerName, c.PhoneNumber 
        FROM Orders o
        LEFT JOIN Customers c ON o.CustomerID = c.CustomerID
        ORDER BY o.OrderDate DESC
      `);
    return result.recordset;
  }

  // Lấy đơn hàng theo ID
  static async getById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT o.*, c.FullName as CustomerName, c.PhoneNumber 
        FROM Orders o
        LEFT JOIN Customers c ON o.CustomerID = c.CustomerID
        WHERE o.OrderID = @id
      `);
    return result.recordset[0];
  }

  // Lấy chi tiết đơn hàng
  static async getDetails(orderId) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('orderId', sql.Int, orderId)
      .query(`
        SELECT od.*, m.MedName, m.Unit, m.ImageURL
        FROM OrderDetails od
        JOIN Medicines m ON od.MedID = m.MedID
        WHERE od.OrderID = @orderId
      `);
    return result.recordset;
  }

  // Lấy đơn hàng theo ngày
  static async getByDate(date) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('date', sql.Date, date)
      .query(`
        SELECT o.*, c.FullName as CustomerName
        FROM Orders o
        LEFT JOIN Customers c ON o.CustomerID = c.CustomerID
        WHERE CAST(o.OrderDate AS DATE) = @date
        ORDER BY o.OrderDate DESC
      `);
    return result.recordset;
  }

  // Lấy thống kê doanh thu theo ngày
  static async getRevenueByDate(date) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('date', sql.Date, date)
      .query(`
        SELECT COUNT(*) as totalOrders, SUM(TotalAmount) as totalRevenue
        FROM Orders
        WHERE CAST(OrderDate AS DATE) = @date
      `);
    return result.recordset[0];
  }

  // Lấy sản phẩm bán chạy
  static async getTopProducts(limit = 10) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('limit', sql.Int, limit)
      .query(`
        SELECT TOP (@limit) m.MedID, m.MedName, m.Price, SUM(od.Quantity) as TotalSold
        FROM OrderDetails od
        JOIN Medicines m ON od.MedID = m.MedID
        GROUP BY m.MedID, m.MedName, m.Price
        ORDER BY TotalSold DESC
      `);
    return result.recordset;
  }

  // Xóa đơn hàng
  static async delete(id) {
    const pool = await poolPromise;
    // Xóa chi tiết đơn hàng trước
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM OrderDetails WHERE OrderID = @id');
    // Xóa đơn hàng
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Orders WHERE OrderID = @id');
    return { affectedRows: result.rowsAffected[0] };
  }
}

module.exports = Order;
