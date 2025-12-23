const { sql, poolPromise } = require('../config/database');

class Medicine {
  // Tạo thuốc mới
  static async create(medicineData) {
    const { medName, category, unit, price, stockQuantity, imageURL } = medicineData;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('medName', sql.NVarChar, medName)
      .input('category', sql.NVarChar, category)
      .input('unit', sql.NVarChar, unit)
      .input('price', sql.Decimal(18, 0), price)
      .input('stockQuantity', sql.Int, stockQuantity || 0)
      .input('imageURL', sql.VarChar(sql.MAX), imageURL)
      .query(`
        INSERT INTO Medicines (MedName, Category, Unit, Price, StockQuantity, ImageURL) 
        VALUES (@medName, @category, @unit, @price, @stockQuantity, @imageURL);
        SELECT SCOPE_IDENTITY() AS insertId;
      `);
    return { insertId: result.recordset[0].insertId };
  }

  // Lấy tất cả thuốc
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM Medicines ORDER BY MedID DESC');
    return result.recordset;
  }

  // Lấy thuốc theo ID
  static async getById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Medicines WHERE MedID = @id');
    return result.recordset[0];
  }

  // Tìm kiếm thuốc theo tên
  static async search(keyword) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('keyword', sql.NVarChar, `%${keyword}%`)
      .query('SELECT * FROM Medicines WHERE MedName LIKE @keyword OR Category LIKE @keyword');
    return result.recordset;
  }

  // Cập nhật thông tin thuốc
  static async update(id, medicineData) {
    const { medName, category, unit, price, stockQuantity, imageURL } = medicineData;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('medName', sql.NVarChar, medName)
      .input('category', sql.NVarChar, category)
      .input('unit', sql.NVarChar, unit)
      .input('price', sql.Decimal(18, 0), price)
      .input('stockQuantity', sql.Int, stockQuantity)
      .input('imageURL', sql.VarChar(sql.MAX), imageURL)
      .input('id', sql.Int, id)
      .query(`
        UPDATE Medicines 
        SET MedName = @medName, Category = @category, Unit = @unit, 
            Price = @price, StockQuantity = @stockQuantity, ImageURL = @imageURL 
        WHERE MedID = @id
      `);
    return { affectedRows: result.rowsAffected[0] };
  }

  // Cập nhật số lượng tồn kho
  static async updateStock(id, quantity) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('quantity', sql.Int, quantity)
      .input('id', sql.Int, id)
      .query('UPDATE Medicines SET StockQuantity = StockQuantity + @quantity WHERE MedID = @id');
    return { affectedRows: result.rowsAffected[0] };
  }

  // Xóa thuốc
  static async delete(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Medicines WHERE MedID = @id');
    return { affectedRows: result.rowsAffected[0] };
  }

  // Lấy thuốc sắp hết hàng (dưới 10)
  static async getLowStock(threshold = 10) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('threshold', sql.Int, threshold)
      .query('SELECT * FROM Medicines WHERE StockQuantity < @threshold');
    return result.recordset;
  }
}

module.exports = Medicine;
