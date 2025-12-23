# Backend - Hệ thống Quản lý Nhà thuốc Mini

Backend API cho hệ thống quản lý nhà thuốc mini, được xây dựng với Node.js, Express và SQL Server.

## 📋 Yêu cầu hệ thống

- Node.js >= 14.x
- SQL Server 2017 hoặc cao hơn (hoặc SQL Server Express)
- npm hoặc yarn

## 🚀 Cài đặt

### 1. Cài đặt dependencies

```bash
cd Nhom8_Backend
npm install
```

### 2. Cấu hình Database

Tạo database trong SQL Server:

**Cách 1: Sử dụng SQL Server Management Studio (SSMS)**
```sql
CREATE DATABASE QuanLyNhaThuocMini;
GO

USE QuanLyNhaThuocMini;
GO
```

**Cách 2: Sử dụng sqlcmd**
```bash
sqlcmd -S localhost -U sa -P your_password
CREATE DATABASE QuanLyNhaThuocMini;
GO
```

Chạy file SQL để tạo bảng:

```bash
# Sử dụng SSMS: Mở file CreateTables.sql và Execute
# Hoặc dùng sqlcmd:
sqlcmd -S localhost -U sa -P your_password -d QuanLyNhaThuocMini -i ../Nhom8_Frontend/database/CreateTables.sql
```
SERVER=localhost
DB_USER=sa
DB_PASSWORD=your_password
DB_NAME=QuanLyNhaThuocMini
DB_ENCRYPT=false
PORT=3000
JWT_SECRET=your_secret_key
```

**Lưu ý:** 
- `DB_SERVER`: Tên SQL Server instance (ví dụ: `localhost` hoặc `localhost\SQLEXPRESS`)
- `DB_ENCRYPT`: Đặt `true` nếu dùng Azure SQL, `false` cho local development.env.example .env
```

Chỉnh sửa file `.env` với thông tin database của bạn:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=QuanLyNhaThuocMini
PORT=3000
JWT_SECRET=your_secret_key
```

### 4. Chạy server

**Development mode (với nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📚 API Documentation

### Authentication

#### Đăng ký
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "password": "123456",
  "fullName": "Nguyễn Văn A",
  "email": "admin@example.com",
  "role": "Admin"
}
```

#### Đăng nhập
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "123456"
}
```

Response:
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "username": "admin",
    "fullName": "Nguyễn Văn A",
    "email": "admin@example.com",
    "role": "Admin"
  }
}
```

### Medicines (Thuốc)

**Lưu ý:** Tất cả API dưới đây cần có token xác thực trong header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Lấy tất cả thuốc
```http
GET /api/medicines
```

#### Lấy thuốc theo ID
```http
GET /api/medicines/:id
```

#### Tìm kiếm thuốc
```http
GET /api/medicines/search?keyword=paracetamol
```

#### Lấy thuốc sắp hết hàng
```http
GET /api/medicines/low-stock?threshold=10
```

#### Thêm thuốc mới
```http
POST /api/medicines
Content-Type: application/json

{
  "medName": "Paracetamol 500mg",
  "category": "Thuốc",
  "unit": "Hộp",
  "price": 25000,
  "stockQuantity": 100,
  "imageURL": "/img/paracetamol.jpg"
}
```

#### Cập nhật thông tin thuốc
```http
PUT /api/medicines/:id
Content-Type: application/json

{
  "medName": "Paracetamol 500mg",
  "category": "Thuốc",
  "unit": "Hộp",
  "price": 27000,
  "stockQuantity": 150,
  "imageURL": "/img/paracetamol.jpg"
}
```

#### Cập nhật số lượng tồn kho
```http
PATCH /api/medicines/:id/stock
Content-Type: application/json

{
  "quantity": 50
}
```

#### Xóa thuốc
```http
DELETE /api/medicines/:id
```

### Customers (Khách hàng)

#### Lấy tất cả khách hàng
```http
GET /api/customers
```

#### Lấy khách hàng theo ID
```http
GET /api/customers/:id
```

#### Tìm kiếm khách hàng
```http
GET /api/customers/search?keyword=Nguyen
```

#### Lấy khách hàng VIP
```http
GET /api/customers/vip
```

#### Thêm khách hàng mới
```http
POST /api/customers
Content-Type: application/json

{
  "fullName": "Nguyễn Văn B",
  "phoneNumber": "0909123456",
  "customerType": "BinhThuong"
}
```

#### Cập nhật thông tin khách hàng
```http
PUT /api/customers/:id
Content-Type: application/json

{
  "fullName": "Nguyễn Văn B",
  "phoneNumber": "0909123456",
  "customerType": "VIP"
}
```

#### Xóa khách hàng
```http
DELETE /api/customers/:id
```

### Orders (Đơn hàng)

#### Lấy tất cả đơn hàng
```http
GET /api/orders
```

#### Lấy đơn hàng theo ID
```http
GET /api/orders/:id
```

#### Lấy đơn hàng theo ngày
```http
GET /api/orders/by-date?date=2024-01-15
```

#### Lấy thống kê doanh thu theo ngày
```http
GET /api/orders/revenue?date=2024-01-15
```

#### Lấy sản phẩm bán chạy
```http
GET /api/orders/top-products?limit=10
```

#### Tạo đơn hàng mới
```http
POST /api/orders
Content-Type: application/json

{
  "totalAmount": 150000,
  "customerId": 1,
  "items": [
    {
      "medId": 1,
      "quantity": 2,
      "unitPrice": 25000
    },
    {
      "medId": 2,
      "quantity": 1,
      "unitPrice": 100000
    }
  ]
}
```

#### Xóa đơn hàng
```http
DELETE /api/orders/:id
```

## 🗂️ Cấu trúc thư mục

```
Nhom8_Backend/
├── src/
│   ├── config/
│   │   └── database.js          # Cấu hình kết nối database
│   ├── controllers/
│   │   ├── authController.js    # Xử lý đăng ký, đăng nhập
│   │   ├── medicineController.js # Xử lý CRUD thuốc
│   │   ├── customerController.js # Xử lý CRUD khách hàng
│   │   └── orderController.js   # Xử lý đơn hàng
│   ├── models/
│   │   ├── userModel.js         # Model người dùng
│   │   ├── medicineModel.js     # Model thuốc
│   │   ├── customerModel.js     # Model khách hàng
│   │   └── orderModel.js        # Model đơn hàng
│   ├── routes/
│   │   ├── authRoutes.js        # Routes xác thực
│   │   ├── medicineRoutes.js    # Routes thuốc
│   │   ├── customerRoutes.js    # Routes khách hàng
│   │   └── orderRoutes.js       # Routes đơn hàng
│   └── middleware/
│       └── authMiddleware.js    # Middleware xác thực JWT
├── server.js                    # Entry point
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🔐 Bảo mật

- Mật khẩu được mã hóa bằng bcrypt
- Sử dụng JWT cho xác thực
- CORS được cấu hình cho phép frontend gọi API
- Middleware xác thực bảo vệ các API quan trọng
mssql** - SQL Server driver for Node.js
## 🛠️ Công nghệ sử dụng

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MySQL2** - Database driver
- **bcryptjs** - Mã hóa mật khẩu
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables
- **body-parser** - Parse request body

## 👥 Tác giả

Nhóm 8 - Đồ án Hệ thống Quản lý Nhà thuốc Mini

## 📝 License

ISC
