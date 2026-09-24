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

// --- ROUTE CHIA SẺ LINK SẢN PHẨM - OG TAGS ---
app.get('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM public.products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Không tìm thấy sản phẩm');
    }

    const p = result.rows[0];
    const productUrl = `https://${req.get('host')}/product/${p.id}`;
    // Đảm bảo ảnh là link tuyệt đối https://
    const imageUrl = p.image_url.startsWith('http')? p.image_url : `https://${req.get('host')}${p.image_url}`;
    const priceFormatted = new Intl.NumberFormat('vi-VN').format(p.price) + '₫';

    // Đọc file html gốc
    let html = require('fs').readFileSync(require('path').join(__dirname, 'public', 'product-detail.html'), 'utf8');

    // Chèn thẻ OG động vào <head>
    const ogTags = `
    <title>${p.name} - ${priceFormatted} | Dương Kha Coffee</title>
    <meta name="description" content="${p.description || p.name} - Chỉ ${priceFormatted} tại Dương Kha Coffee.">
    <!-- Open Graph / Facebook / Zalo -->
    <meta property="og:type" content="product">
    <meta property="og:url" content="${productUrl}">
    <meta property="og:title" content="${p.name} - ${priceFormatted}">
    <meta property="og:description" content="${p.description || `Cà phê ${p.name} nguyên chất, đậm vị.`}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="Dương Kha Coffee">
    <meta property="product:price:amount" content="${p.price}">
    <meta property="product:price:currency" content="VND">
    <!-- Twitter / Zalo Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${p.name} - ${priceFormatted}">
    <meta name="twitter:image" content="${imageUrl}">
    `;

    html = html.replace('</title>', `</title>\n${ogTags}`);

    // Đổi JS để đọc được /product/:id
    html = html.replace(
      `js/product-detail.js`,
      `js/product-detail.js?v=${p.id}`
    );

    res.send(html);
  } catch (e) {
    console.error(e);
    res.status(500).send('Lỗi server');
  }
});

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