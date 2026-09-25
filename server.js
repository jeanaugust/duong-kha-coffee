const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');
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

// Tự tạo bảng product_images nếu chưa có
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        position INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Bảng product_images sẵn sàng');
  } catch (e) {
    console.error('Lỗi tạo bảng product_images:', e.message);
  }
})();

app.get('/product/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.products WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).send('Not found');
    const p = result.rows[0];
    const priceFormatted = new Intl.NumberFormat('vi-VN').format(p.price) + '₫';
    const productUrl = `${req.protocol}://${req.get('host')}/product/${p.id}`;
    let imageUrl = p.image_url || '';
    if (!imageUrl.startsWith('http')) imageUrl = `${req.protocol}://${req.get('host')}${imageUrl.startsWith('/')?'':'/'}${imageUrl}`;
    let html = fs.readFileSync(path.join(__dirname, 'public', 'product-detail.html'), 'utf8');
    const ogTags = `<meta property="og:type" content="product"><meta property="og:url" content="${productUrl}"><meta property="og:title" content="${p.name} - ${priceFormatted} | Dương Kha Coffee"><meta property="og:description" content="${(p.description||p.name).substring(0,150)}"><meta property="og:image" content="${imageUrl}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">`;
    html = html.replace(/<title>.*?<\/title>/, `<title>${p.name} - ${priceFormatted} | Dương Kha Coffee</title>\n${ogTags}`);
    res.send(html);
  } catch(e){ res.status(500).send('Lỗi'); }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);

app.use((req, res) => {
    res.status(404).send('Trang bạn tìm kiếm không tồn tại.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[DUONG KHA COFFEE] Server đang chạy tại: http://localhost:${PORT}`);
});