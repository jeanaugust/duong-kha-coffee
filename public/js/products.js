document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('product-container');
    if (!container) return;

    try {
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Đang tải danh sách sản phẩm...</p>';
        
        const response = await fetch('/api/products');
        const resData = await response.json();

        if (resData.success) {
            if (resData.data.length === 0) {
                container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Hiện chưa có sản phẩm nào.</p>';
                return;
            }

            container.innerHTML = resData.data.map(p => `
                <div class="product-card">
                    <img src="${p.image_url || 'https://via.placeholder.com/300x200?text=Coffee'}" 
                         alt="${p.name}" 
                         onerror="this.src='https://via.placeholder.com/300x200?text=Coffee'">
                    <div class="product-info">
                        <h3 class="product-title">${p.name}</h3>
                        <p class="product-desc">${p.description || 'Chưa có mô tả.'}</p>
                        <p class="product-price">${Number(p.price).toLocaleString('vi-VN')} VNĐ</p>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = `<p style="text-align:center; color: #ff6b6b; grid-column: 1/-1;">${resData.message}</p>`;
        }
    } catch (err) {
        console.error('Fetch error:', err);
        container.innerHTML = '<p style="text-align:center; color: #ff6b6b; grid-column: 1/-1;">Lỗi kết nối máy chủ. Không thể tải danh sách sản phẩm.</p>';
    }
});