const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db'); // <-- QUAN TRỌNG: thêm dòng này, không là lỗi 500
const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.' }
});
app.use('/api/', apiLimiter);

function escapeHtml(str){
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// --- ROUTE CHIA SẺ LINK SẢN PHẨM - OG TAGS CHUẨN FB/ZALO ---
app.get('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM public.products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Không tìm thấy sản phẩm');
    }

    const p = result.rows[0];
    const priceFormatted = new Intl.NumberFormat('vi-VN').format(p.price) + '₫';
    const productUrl = `${req.protocol}://${req.get('host')}/product/${p.id}`;
    
    // Đảm bảo ảnh là link tuyệt đối https:// thì Zalo mới hiện
    let imageUrl = p.image_url || '';
    if (!imageUrl.startsWith('http')) {
      imageUrl = `${req.protocol}://${req.get('host')}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }

    let html = fs.readFileSync(path.join(__dirname, 'public', 'product-detail.html'), 'utf8');

    const ogTags = `
    <meta property="og:type" content="product">
    <meta property="og:url" content="${productUrl}">
    <meta property="og:title" content="${escapeHtml(p.name)} - ${escapeHtml(priceFormatted)} | Dương Kha Coffee">
    <meta property="og:description" content="${escapeHtml((p.description || `Cà phê ${p.name} rang mộc nguyên chất.`).substring(0,150))}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:secure_url" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="Dương Kha Coffee">
    <meta property="product:price:amount" content="${p.price}">
    <meta property="product:price:currency" content="VND">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="description" content="${escapeHtml(p.description || p.name)} - Chỉ ${priceFormatted} tại Dương Kha Coffee.">
    `;

    // Thay thế title cũ bằng title mới có giá
    html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(p.name)} - ${escapeHtml(priceFormatted)} | Dương Kha Coffee</title>\n${ogTags}`);

    res.send(html);
  } catch (e) {
    console.error('[OG ERROR]', e);
    res.status(500).send('Lỗi server khi tạo link chia sẻ');
  }
});

// 5. Phục vụ tài nguyên tĩnh
app.use(express.static(path.join(__dirname, 'public')));

// 6. Routes API
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);

// 7. Bắt lỗi 404
app.use((req, res) => {
    res.status(404).send('Trang bạn tìm kiếm không tồn tại.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[DUONG KHA COFFEE] Server đang chạy tại: http://localhost:${PORT}`);
});