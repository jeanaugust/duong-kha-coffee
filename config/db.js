const { Pool } = require('pg');
require('dotenv').config();

// Khởi tạo Pool kết nối đọc chính xác từ .env
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 6868, // Ép kiểu số cho PORT 6868
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'duongkha_coffee',
    // Tối ưu thời gian chờ kết nối
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000
});

// Bắt lỗi kết nối ngầm để tránh crash ứng dụng
pool.on('error', (err) => {
    console.error('❌ Lỗi đột ngột trên PostgreSQL Pool:', err.message);
});

// Kiểm tra kết nối ngay khi khởi động
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ KẾT NỐI DATABASE THẤT BẠI! Kiểm tra lại thông tin trong .env hoặc cổng', process.env.DB_PORT);
        console.error('Chi tiết lỗi:', err.message);
    } else {
        console.log(`✅ KẾT NỐI DATABASE THÀNH CÔNG! (Host: ${process.env.DB_HOST}:${process.env.DB_PORT} - DB: ${process.env.DB_NAME})`);
    }
});

module.exports = pool;