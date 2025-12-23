const { sql, poolPromise } = require('../config/database');

class User {
  // Tạo người dùng mới
  static async create(userData) {
    const { username, password, fullName, email, role } = userData;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, password)
      .input('fullName', sql.NVarChar, fullName)
      .input('email', sql.VarChar, email)
      .input('role', sql.NVarChar, role || 'NhanVien')
      .query(`
        INSERT INTO Users (Username, Password, FullName, Email, Role) 
        VALUES (@username, @password, @fullName, @email, @role);
        SELECT SCOPE_IDENTITY() AS insertId;
      `);
    return { insertId: result.recordset[0].insertId };
  }

  // Tìm người dùng theo username
  static async findByUsername(username) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM Users WHERE Username = @username');
    return result.recordset[0];
  }

  // Lấy tất cả người dùng
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT UserID, Username, FullName, Email, Role FROM Users');
    return result.recordset;
  }

  // Lấy người dùng theo ID
  static async getById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT UserID, Username, FullName, Email, Role FROM Users WHERE UserID = @id');
    return result.recordset[0];
  }

  // Cập nhật thông tin người dùng
  static async update(id, userData) {
    const { fullName, email, role } = userData;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('fullName', sql.NVarChar, fullName)
      .input('email', sql.VarChar, email)
      .input('role', sql.NVarChar, role)
      .input('id', sql.Int, id)
      .query('UPDATE Users SET FullName = @fullName, Email = @email, Role = @role WHERE UserID = @id');
    return { affectedRows: result.rowsAffected[0] };
  }

  // Xóa người dùng
  static async delete(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Users WHERE UserID = @id');
    return { affectedRows: result.rowsAffected[0] };
  }
}

module.exports = User;
