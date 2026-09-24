const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Đường dẫn kết nối CSDL PostgreSQL

router.get('/', async (req, res) => {
    try {
        // Truy vấn tất cả các cột trong bảng products
        const result = await pool.query('SELECT * FROM public.products ORDER BY id ASC');
        
        // Chuẩn hóa dữ liệu trước khi trả về Client
        const products = result.rows.map(item => ({
            ...item,
            // 1. Ép kiểu giá tiền về dạng số
            price: parseFloat(item.price) || 0,
            
            // 2. Bảo vệ dữ liệu chuỗi: Loại bỏ khoảng trắng thừa hoặc gán giá trị giữ chỗ nếu null
            taste: item.taste ? String(item.taste).trim() : null,
            brewing_method: item.brewing_method ? String(item.brewing_method).trim() : null,
            grind_type: item.grind_type ? String(item.grind_type).trim() : null,
            shelf_life: item.shelf_life ? String(item.shelf_life).trim() : null
        }));

        // Đặt Header và trả phản hồi DUY NHẤT một lần
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(products);

    } catch (error) {
        console.error('❌ [API ERROR] Lỗi khi thực hiện Query SQL:', error.message);
        return res.status(500).json({ 
            error: 'Lỗi máy chủ khi lấy dữ liệu sản phẩm',
            details: error.message 
        });
    }
});

module.exports = router;