// seedData.js - Script tự động tạo bảng và thêm dữ liệu mẫu cho SQL Server
// Cần cài: npm install mssql
require('dotenv').config();

const sql = require('mssql');
const fs = require('fs');
const path = require('path');

// Cấu hình kết nối SQL Server
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Đọc nội dung file CreateTables.sql
const sqlFilePath = path.join(__dirname, 'CreateTables.sql');
const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

async function runSeed() {
    try {
        // Kết nối tới SQL Server
        let pool = await sql.connect(config);
        // Tách các batch bằng GO (nếu có)
        const batches = sqlScript.split(/\bGO\b/gi);
        for (let batch of batches) {
            const trimmed = batch.trim();
            if (trimmed) {
                await pool.request().batch(trimmed);
            }
        }
        console.log('Tạo bảng và thêm dữ liệu mẫu thành công!');
        sql.close();
    } catch (err) {
        console.error('Lỗi khi seed dữ liệu:', err);
        sql.close();
    }
}

runSeed();
