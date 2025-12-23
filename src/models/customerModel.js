const { sql, poolPromise } = require('../config/database');

class Customer {
  // Tạo khách hàng mới
  static async create(customerData) {
    const { fullName, phoneNumber, customerType } = customerData;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('fullName', sql.NVarChar, fullName)
      .input('phoneNumber', sql.VarChar, phoneNumber)
      .input('customerType', sql.NVarChar, customerType || 'BinhThuong')
      .query(`
        INSERT INTO Customers (FullName, PhoneNumber, CustomerType) 
        VALUES (@fullName, @phoneNumber, @customerType);
        SELECT SCOPE_IDENTITY() AS insertId;
      `);
    return { insertId: result.recordset[0].insertId };
  }

  // Lấy tất cả khách hàng
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM Customers ORDER BY CustomerID DESC');
    return result.recordset;
  }

  // Lấy khách hàng theo ID
  static async getById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Customers WHERE CustomerID = @id');
    return result.recordset[0];
  }

  // Tìm kiếm khách hàng theo tên hoặc số điện thoại
  static async search(keyword) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('keyword', sql.NVarChar, `%${keyword}%`)
      .query('SELECT * FROM Customers WHERE FullName LIKE @keyword OR PhoneNumber LIKE @keyword');
    return result.recordset;
  }

  // Cập nhật thông tin khách hàng
  static async update(id, customerData) {
    const { fullName, phoneNumber, customerType } = customerData;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('fullName', sql.NVarChar, fullName)
      .input('phoneNumber', sql.VarChar, phoneNumber)
      .input('customerType', sql.NVarChar, customerType)
      .input('id', sql.Int, id)
      .query('UPDATE Customers SET FullName = @fullName, PhoneNumber = @phoneNumber, CustomerType = @customerType WHERE CustomerID = @id');
    return { affectedRows: result.rowsAffected[0] };
  }

  // Xóa khách hàng
  static async delete(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Customers WHERE CustomerID = @id');
    return { affectedRows: result.rowsAffected[0] };
  }

  // Lấy khách hàng VIP
  static async getVIPCustomers() {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('type', sql.NVarChar, 'VIP')
      .query('SELECT * FROM Customers WHERE CustomerType = @type');
    return result.recordset;
  }
}

module.exports = Customer;
