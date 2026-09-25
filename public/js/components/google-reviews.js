// @ts-nocheck
// GOOGLE REVIEWS COMPONENT - Duong Kha
// File: public/js/components/google-reviews.js
// Link Map: https://maps.app.goo.gl/fMKkp5VKwsnGWFzs9

(function() {
  
    var REVIEWS = [
        {
            name: "kuma.",
            avatar: "k",
            verified: "Người dùng được xác minh",
            rating: 5,
            text: "cà phê ngon, cô chú chủ quán rất dễ thương, hiền lành. Quán lâu đời, uy tín. Giá cả tốt hơn nhiều so với những nơi khác, cứ mua thử sẽ rõ vì chất lượng cần nếm thử mới biết. 5 sao nhé. Quán mới đổi bao bì nhìn đẹp thật sự."
        },
        {
            name: "Minh Triết Hồ",
            avatar: "M",
            verified: "Người dùng được xác minh",
            rating: 5,
            text: "Cà phê khá đậm, uống tỉnh người, sáng mới mua 1 bịch về tự pha ở nhà, ai thích uống đậm có thể mua"
        },
        {
            name: "Nguyen Duong Nguyen",
            avatar: "N",
            verified: "Người dùng được xác minh",
            rating: 5,
            text: "Cà phê thật. Đã thử nghiệm và kết quả là cà phê vừa ngon vừa chất lượng. Giá càng cao thì vị càng ngon. Cà phê túi nhật chỗ này bán tiện lợi, đổ nước sôi vào là có cà phê ngay. Ly cà phê màu rất đẹp, hàng chất lượng."
        },
        {
            name: "Mike Tran",
            avatar: "M",
            verified: "Người dùng được xác minh",
            rating: 5,
            text: "Cà phê nước ngon, cà phê bột ngon, nguyên chất. Không gian thanh bình, mát mẻ. Nhân viên vui vẻ, lịch sự, tư vấn tận tình. Giá cả phải chăn. Trên google hiện chỉ thanh toán tiền mặt nhưng hiện tại chỗ này có nhận chuyển khoản rồi."
        },
        {
            name: "Thu An",
            avatar: "T",
            verified: "Người dùng được xác minh",
            rating: 5,
            text: "Cà phê ngon. Đi công tác nên thử đại nhưng công nhận ngon với chất lượng,  giá cả hợp lý"
        },
        {
            name: "Stephen Zhang",
            avatar: "S",
            verified: "Người dùng được xác minh",
            rating: 5,
            text: "Cà phê ngon, có miễn phí xay sẵn. Chủ tốt bụng, dễ mến. Ai mới tập uống cà phê có thể ghé vì chủ tư vấn dễ thương, nhiệt tình và chi tiết lắm. Hiếm thấy chỗ nào vừa có tinh thần và môi trường tích cực như ở đây. Có bán túi lọc, anh em hay đi du lịch mua mang theo là không sợ thiếu cà phê. 😄😄 Thích lắm mới cho 5 sao đó nhe."
        }
    ];

    var GOOGLE_MAP_LINK = "https://maps.app.goo.gl/fMKkp5VKwsnGWFzs9";
    var PLACE_ID = "ChIJ4VnyI_1yPTERMN39Me28mNg"; // ID từ link bạn gửi

    function render() {
        var root = document.getElementById('google-reviews-root');
        if (!root) return;

        var html = '';
        html += '<div class="google-reviews-section">';
        html += '  <div class="google-reviews-header">';
        html += '    <h3 class="google-reviews-title">ĐÁNH GIÁ TỪ <span>GOOGLE MAP</span></h3>';
        html += '    <div class="google-reviews-summary">';
        html += '      <div class="google-rating-big">4.9</div>';
        html += '      <div class="google-stars">★★★★★</div>';
        html += '      <a href="' + GOOGLE_MAP_LINK + '" target="_blank" class="btn-view-map">Xem trên Maps →</a>';
        html += '    </div>';
        html += '  </div>';
        html += '  <div class="google-reviews-grid">';

        REVIEWS.forEach(function(r) {
            var stars = '★'.repeat(r.rating);
            html += '<div class="review-card-lux">';
            html += '  <div class="review-card-head">';
            html += '    <div class="review-avatar">' + r.avatar + '</div>';
            html += '    <div><div class="review-name">' + r.name + '</div><div class="review-verified">' + r.verified + ' · <span class="google-stars">' + stars + '</span></div></div>';
            html += '  </div>';
            html += '  <div class="review-text">"' + r.text + '"</div>';
            html += '</div>';
        });

        html += '  </div>';
        html += '</div>';

        root.innerHTML = html;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }
})();