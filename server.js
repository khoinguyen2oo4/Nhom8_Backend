const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const medicineRoutes = require('./src/routes/medicineRoutes');
const customerRoutes = require('./src/routes/customerRoutes');
const orderRoutes = require('./src/routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Cho phép frontend gọi API
app.use(bodyParser.json()); // Parse JSON body
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded body

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Hệ thống Quản lý Nhà thuốc Mini', 
    version: '1.0.0',
    status: 'running' 
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi server không xác định'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Không tìm thấy endpoint này'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 Server đang chạy tại:');
  console.log(`   http://localhost:${PORT}`);
  console.log('=================================');
  console.log('📋 API Endpoints:');
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET  http://localhost:${PORT}/api/medicines`);
  console.log(`   GET  http://localhost:${PORT}/api/customers`);
  console.log(`   GET  http://localhost:${PORT}/api/orders`);
  console.log('=================================');
});

module.exports = app;
