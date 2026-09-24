const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { body, validationResult } = require('express-validator');

// API: Thu thập thông tin khách hàng kèm Sanitize & Validate (Chống XSS/Rác)
router.post('/', [
    body('fullname')
        .trim()
        .notEmpty().withMessage('Họ và tên không được để trống.')
        .escape(),
    body('email')
        .trim()
        .isEmail().withMessage('Định dạng email không hợp lệ.')
        .normalizeEmail(),
    body('phone')
        .trim()
        .optional({ checkFalsy: true })
        .isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ.'),
    body('message')
        .trim()
        .escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    const { fullname, email, phone, message } = req.body;

    try {
        const insertQuery = `
            INSERT INTO customer_contacts (fullname, email, phone, message)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `;
        await db.query(insertQuery, [fullname, email, phone || null, message || null]);

        res.status(201).json({
            success: true,
            message: 'Cảm ơn bạn đã liên hệ! Thông tin của bạn đã được ghi nhận thành công.'
        });
    } catch (err) {
        console.error('Lỗi khi lưu thông tin khách hàng:', err.message);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi hệ thống, không thể lưu thông tin lúc này.'
        });
    }
});

module.exports = router;