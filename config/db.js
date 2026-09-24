const { Pool } = require('pg');
require('dotenv').config();

let pool;

// Nếu có DATABASE_URL (trên Neon / Render) thì dùng nó - CHẾ ĐỘ FREE
if (process.env.DATABASE_URL) {
  console.log('🌐 Đang chạy ở chế độ FREE (Neon)');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Bắt buộc cho Neon
    },
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000
  });
} else {
  // Nếu không có DATABASE_URL thì chạy ở nhà bạn như cũ - CHẾ ĐỘ LOCAL
  console.log('🏠 Đang chạy ở chế độ LOCAL');
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 6868,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'duongkha_coffee',
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000
  });
}

pool.on('error', (err) => {
  console.error('❌ Lỗi đột ngột trên PostgreSQL Pool:', err.message);
});

// Kiểm tra kết nối ngay khi khởi động
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ KẾT NỐI DATABASE THẤT BẠI!');
    console.error('Chi tiết:', err.message);
  } else {
    console.log(`✅ KẾT NỐI DATABASE THÀNH CÔNG! - ${res.rows[0].now}`);
  }
});

module.exports = pool;