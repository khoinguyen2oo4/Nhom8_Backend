const sql = require('mssql');
require('dotenv').config();

// Cấu hình kết nối SQL Server - Dùng Named Pipes (không cần TCP/IP)
const config = {
  // Dùng server với instance name trực tiếp
  server: `${process.env.DB_SERVER}\\${process.env.DB_INSTANCE}`,
  database: process.env.DB_NAME || 'QuanLyNhaThuocMini',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // true cho Azure SQL
    trustServerCertificate: true, // true cho local development
    enableArithAbort: true,
    useUTC: false, // Sử dụng local time
    trustedConnection: true // Windows Authentication
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 60000, // Timeout 60s
  requestTimeout: 60000
};

// Nếu có user/password thì dùng SQL Authentication
if (process.env.DB_USER && process.env.DB_PASSWORD) {
  config.user = process.env.DB_USER;
  config.password = process.env.DB_PASSWORD;
  config.options.trustedConnection = false;
}

// Log cấu hình để debug
console.log('📌 Cấu hình kết nối:', {
  server: config.server,
  database: config.database,
  authType: config.options.trustedConnection ? 'Windows Authentication' : 'SQL Authentication'
});

// Tạo connection pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Kết nối SQL Server thành công!');
    return pool;
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối SQL Server:', err.message);
    console.error('🔍 Chi tiết lỗi:', err);
    console.error('\n💡 Kiểm tra:');
    console.error('   1. SQL Server đã chạy chưa?');
    console.error('   2. TCP/IP đã bật chưa?');
    console.error('   3. SQL Server Browser đã chạy chưa?');
    console.error('   4. Port có đúng không? (thường là 1433)');
    console.error('   5. Windows Authentication có được phép không?\n');
    process.exit(1);
  });

module.exports = {
  sql,
  poolPromise
};
