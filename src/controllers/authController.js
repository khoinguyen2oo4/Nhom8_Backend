const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

class AuthController {
  // Đăng ký người dùng mới
  static async register(req, res) {
    try {
      const { username, password, fullName, email, role } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vui lòng nhập tên đăng nhập và mật khẩu' 
        });
      }

      // Kiểm tra xem username đã tồn tại chưa
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Tên đăng nhập đã tồn tại' 
        });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo người dùng mới
      const result = await User.create({
        username,
        password: hashedPassword,
        fullName,
        email,
        role: role || 'NhanVien'
      });

      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        userId: result.insertId
      });
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server khi đăng ký' 
      });
    }
  }

  // Đăng nhập
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vui lòng nhập tên đăng nhập và mật khẩu' 
        });
      }

      // Tìm người dùng
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Tên đăng nhập không tồn tại' 
        });
      }

      // Kiểm tra mật khẩu (Sửa lại để nhận mật khẩu thường)
      const isPasswordValid = password === user.Password;
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: 'Mật khẩu không đúng' 
        });
      }

      // Tạo JWT token
      const token = jwt.sign(
        { 
          userId: user.UserID, 
          username: user.Username,
          role: user.Role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        token,
        user: {
          userId: user.UserID,
          username: user.Username,
          fullName: user.FullName,
          email: user.Email,
          role: user.Role
        }
      });
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server khi đăng nhập' 
      });
    }
  }

  // Lấy thông tin người dùng hiện tại (từ token)
  static async getCurrentUser(req, res) {
    try {
      const user = await User.getById(req.userId);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy người dùng' 
        });
      }

      res.json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Lỗi lấy thông tin người dùng:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server' 
      });
    }
  }
}

module.exports = AuthController;
