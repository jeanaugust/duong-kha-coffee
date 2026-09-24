const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// 1. Helmet: Thiết lập HTTP Headers an toàn
app.use(helmet({
    contentSecurityPolicy: false // Tắt CSP để cho phép nạp ảnh demo dễ dàng
}));

// 2. CORS: Giới hạn/Cho phép chia sẻ tài nguyên
app.use(cors());

// 3. Body Parsers: Đọc JSON và Form Data
app.use(express.json({ limit: '10kb' })); // Giới hạn body tối đa 10kb phòng DDoS
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Rate Limiting: Chống spam API & DDoS
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // Tối đa 100 request/IP trong 15 phút
    message: { success: false, message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.' }
});
app.use('/api/', apiLimiter);

// 5. Phục vụ tài nguyên tĩnh (HTML, CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));

// 6. Routes
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);

// 7. Bắt lỗi 404 cho Route không tồn tại
app.use((req, res) => {
    res.status(404).send('Trang bạn tìm kiếm không tồn tại.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[DUONG KHA COFFEE] Server đang chạy tại: http://localhost:${PORT}`);
});