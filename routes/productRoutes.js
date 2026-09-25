const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Lấy 10 ảnh phụ của 1 sản phẩm - DÙNG CHO GRID
router.get('/:id/images', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT id, image_url, position FROM product_images
             WHERE product_id = $1
             ORDER BY position ASC, id ASC
             LIMIT 10`,
            [id]
        );
        return res.json(result.rows);
    } catch (error) {
        // Nếu bảng chưa tạo thì trả về mảng rỗng để không lỗi trang
        if (error.code === '42P01') return res.json([]);
        console.error('Lỗi lấy ảnh phụ:', error.message);
        return res.status(500).json([]);
    }
});

// Lấy 1 sản phẩm (để sau này dùng nếu cần)
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public.products WHERE id = $1', [req.params.id]);
        if (!result.rows.length) return res.status(404).json({ error: 'Không tìm thấy' });
        const item = result.rows[0];
        item.price = parseFloat(item.price) || 0;
        return res.json(item);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Lấy tất cả sản phẩm - GIỮ NGUYÊN CODE CŨ CỦA BẠN
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public.products ORDER BY id ASC');
        const products = result.rows.map(item => ({
           ...item,
            price: parseFloat(item.price) || 0,
            taste: item.taste? String(item.taste).trim() : null,
            brewing_method: item.brewing_method? String(item.brewing_method).trim() : null,
            grind_type: item.grind_type? String(item.grind_type).trim() : null,
            shelf_life: item.shelf_life? String(item.shelf_life).trim() : null
        }));
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(products);
    } catch (error) {
        console.error('❌ [API ERROR]:', error.message);
        return res.status(500).json({ error: 'Lỗi máy chủ', details: error.message });
    }
});

module.exports = router;