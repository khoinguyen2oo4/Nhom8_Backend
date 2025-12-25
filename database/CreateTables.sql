-- 1. Bảng Danh mục (Tách riêng để quản lý tốt hơn, tránh lặp lại text)
CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName NVARCHAR(100) NOT NULL UNIQUE, -- Tên danh mục không trùng
    Description NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- 2. Bảng Người dùng (Admin/Nhân viên)
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username VARCHAR(50) NOT NULL UNIQUE, -- Không cho phép trùng username
    Password VARCHAR(255) NOT NULL,       -- Độ dài 255 để chứa chuỗi Hash sau này
    FullName NVARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE,            -- Email duy nhất
    Role NVARCHAR(20) DEFAULT 'NhanVien' CHECK (Role IN ('Admin', 'NhanVien')), -- Chỉ nhận 2 giá trị này
    IsActive BIT DEFAULT 1,               -- 1: Đang hoạt động, 0: Đã khóa (thay vì xóa)
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- 3. Bảng Thuốc (Kho hàng)
CREATE TABLE Medicines (
    MedID INT PRIMARY KEY IDENTITY(1,1),
    MedName NVARCHAR(200) NOT NULL,
    CategoryID INT, -- Liên kết bảng Category
    Unit NVARCHAR(20), 
    Price DECIMAL(18, 0) CHECK (Price >= 0),        -- Giá không được âm
    StockQuantity INT DEFAULT 0 CHECK (StockQuantity >= 0), -- Tồn kho không âm
    ImageURL VARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    
    -- Khóa ngoại liên kết danh mục
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE SET NULL
);

-- 4. Bảng Khách hàng
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15) UNIQUE, -- SĐT nên là duy nhất để tích điểm
    Email VARCHAR(100),
    CustomerType NVARCHAR(50) DEFAULT 'BinhThuong',
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- 5. Bảng Hóa đơn
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(18, 0) DEFAULT 0,
    Status NVARCHAR(20) DEFAULT 'Completed' CHECK (Status IN ('Pending', 'Completed', 'Cancelled')), -- Trạng thái đơn
    CustomerID INT,
    UserID INT, -- Ai là người tạo đơn này (Nhân viên nào)
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),

    -- Nếu khách hàng bị xóa, đơn hàng vẫn giữ lại (CustomerID = NULL)
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID) ON DELETE SET NULL,
    -- Nếu nhân viên nghỉ việc (xóa), lịch sử bán hàng vẫn còn
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL
);

-- 6. Bảng Chi tiết hóa đơn
CREATE TABLE OrderDetails (
    DetailID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT NOT NULL,
    MedID INT NOT NULL,
    Quantity INT CHECK (Quantity > 0), -- Số lượng mua phải > 0
    UnitPrice DECIMAL(18, 0), -- Giá tại thời điểm bán (đề phòng giá thuốc gốc thay đổi)
    CreatedAt DATETIME DEFAULT GETDATE(),
    
    -- Nếu xóa đơn hàng -> Xóa luôn chi tiết
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE,
    -- Không cho phép xóa thuốc nếu đã có đơn hàng bán thuốc đó (Data Integrity)
    FOREIGN KEY (MedID) REFERENCES Medicines(MedID) ON DELETE NO ACTION
);

-- 7. Bảng ActivityLog (Ghi lại lịch sử hoạt động hệ thống)
CREATE TABLE ActivityLog (
    LogID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,          -- Ai làm?
    Action NVARCHAR(50), -- Làm gì? (LOGIN, INSERT, UPDATE, DELETE)
    TableName NVARCHAR(50), -- Trên bảng nào?
    RecordID INT,        -- ID của dòng bị tác động
    Description NVARCHAR(MAX), -- Chi tiết (ví dụ: Đổi giá từ 50k -> 60k)
    Timestamp DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL
);

-- ========================= DỮ LIỆU MẪU =========================

-- 1. Thêm 5 danh mục thuốc
INSERT INTO Categories (CategoryName, Description)
VALUES
    (N'Thuốc giảm đau', N'Giảm đau, hạ sốt'),
    (N'Thuốc kháng sinh', N'Điều trị nhiễm khuẩn'),
    (N'Thuốc tiêu hóa', N'Hỗ trợ tiêu hóa'),
    (N'Thực phẩm chức năng', N'Bổ sung dinh dưỡng'),
    (N'Thuốc dị ứng', N'Chống dị ứng');

-- 2. Thêm 1 tài khoản Admin
INSERT INTO Users (Username, Password, FullName, Email, Role, IsActive)
VALUES ('admin', '123456', N'Quản trị viên', 'admin@gmail.com', N'Admin', 1);

-- 3. Thêm 7 thuốc mẫu
INSERT INTO Medicines (MedName, CategoryID, Unit, Price, StockQuantity, ImageURL)
VALUES
    (N'Panadol', 1, N'Vỉ', 15000, 100, 'https://dummyimage.com/100x100/00aaff/fff&text=Panadol'),
    (N'Paracetamol', 1, N'Hộp', 20000, 80, 'https://dummyimage.com/100x100/00aaff/fff&text=Paracetamol'),
    (N'Amoxicillin', 2, N'Vỉ', 25000, 60, 'https://dummyimage.com/100x100/00aaff/fff&text=Amoxicillin'),
    (N'Bifina', 3, N'Hộp', 120000, 30, 'https://dummyimage.com/100x100/00aaff/fff&text=Bifina'),
    (N'Vitamin C', 4, N'Lọ', 50000, 50, 'https://dummyimage.com/100x100/00aaff/fff&text=Vitamin+C'),
    (N'Cetirizine', 5, N'Vỉ', 18000, 40, 'https://dummyimage.com/100x100/00aaff/fff&text=Cetirizine'),
    (N'Enterogermina', 3, N'Lọ', 90000, 25, 'https://dummyimage.com/100x100/00aaff/fff&text=Enterogermina');

-- 4. Thêm 6 khách hàng mẫu
INSERT INTO Customers (FullName, PhoneNumber, Email, CustomerType)
VALUES
    (N'Nguyễn Văn A', '0901234567', 'a@email.com', N'BinhThuong'),
    (N'Trần Thị B', '0902345678', 'b@email.com', N'KhachQuen'),
    (N'Lê Văn C', '0903456789', 'c@email.com', N'VIP'),
    (N'Phạm Thị D', '0904567890', 'd@email.com', N'BinhThuong'),
    (N'Hoàng Văn E', '0905678901', 'e@email.com', N'KhachQuen'),
    (N'Đỗ Thị F', '0906789012', 'f@email.com', N'BinhThuong');

-- 5. Thêm 5 hóa đơn mẫu
INSERT INTO Orders (OrderDate, TotalAmount, Status, CustomerID, UserID)
VALUES
    ('2025-12-01', 30000, N'Completed', 1, 1),
    ('2025-12-02', 50000, N'Completed', 2, 1),
    ('2025-12-03', 120000, N'Completed', 3, 1),
    ('2025-12-04', 18000, N'Completed', 4, 1),
    ('2025-12-05', 90000, N'Completed', 5, 1);

-- 6. Thêm 10 chi tiết hóa đơn mẫu
INSERT INTO OrderDetails (OrderID, MedID, Quantity, UnitPrice)
VALUES
    (1, 1, 2, 15000),
    (1, 2, 1, 20000),
    (2, 3, 2, 25000),
    (2, 5, 1, 50000),
    (3, 4, 1, 120000),
    (3, 6, 2, 18000),
    (4, 7, 1, 90000),
    (4, 1, 1, 15000),
    (5, 2, 2, 20000),
    (5, 5, 1, 50000);

-- 7. Thêm 5 log hoạt động mẫu
INSERT INTO ActivityLog (UserID, Action, TableName, RecordID, Description)
VALUES
    (1, N'LOGIN', N'Users', 1, N'Đăng nhập hệ thống'),
    (1, N'INSERT', N'Medicines', 1, N'Thêm thuốc Panadol'),
    (1, N'INSERT', N'Customers', 2, N'Thêm khách hàng Trần Thị B'),
    (1, N'INSERT', N'Orders', 3, N'Tạo hóa đơn cho khách VIP'),
    (1, N'UPDATE', N'Medicines', 3, N'Cập nhật tồn kho Amoxicillin');