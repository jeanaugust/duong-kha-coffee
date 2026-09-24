document.addEventListener('DOMContentLoaded', () => {
    // Chạy độc lập từng phần để tránh lỗi dây chuyền
    try {
        initFeaturesComponent();
    } catch (e) {
        console.warn('⚠️ Lỗi khởi tạo Features:', e);
    }

    try {
        loadProductCarousel();
    } catch (e) {
        console.warn('⚠️ Lỗi khởi tạo Carousel:', e);
    }
});

/**
 * COMPONENT: TRIẾT LÝ
 */
function initFeaturesComponent() {
    const container = document.getElementById('features-container');
    if (!container) return; // Bỏ qua an toàn nếu trang không có thẻ này

    const featuresData = [
        {
            svg: `<svg class="feature-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
            title: 'Tinh Tuyển Nguyên Bản',
            desc: '100% hạt cà phê chín cây được thu hái thủ công từ những vùng thổ nhưỡng cao nguyên trù phú.'
        },
        {
            svg: `<svg class="feature-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
            title: 'Rang Mộc Thuần Tinh',
            desc: 'Nghệ thuật kiểm soát nhiệt độ thủ công, không tẩm ướp hương liệu hay phụ gia hóa học.'
        },
        {
            svg: `<svg class="feature-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
            title: 'An Toàn Sức Khỏe',
            desc: 'Cam kết chất lượng sạch tuyệt đối, bảo vệ sức khỏe và trải nghiệm người thưởng thức.'
        },
        {
            svg: `<svg class="feature-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
            title: 'Hậu Vị Sâu Thẳm',
            desc: 'Công thức phối trộn độc bản cân bằng hoàn hảo giữa vị đắng thanh và hương thơm nồng nàn.'
        }
    ];

    container.innerHTML = featuresData.map(item => `
        <div class="feature-box-luxury">
            ${item.svg}
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.desc)}</p>
        </div>
    `).join('');
}

/**
 * CAROUSEL SẢN PHẨM (Xử lý đồng bộ HTML Class)
 */
async function loadProductCarousel() {
    const track = document.getElementById('product-slider-track');
    if (!track) return;

    try {
        const response = await fetch('/api/products');

        if (!response.ok) {
            throw new Error(`Lỗi kết nối Server: ${response.status}`);
        }

        const products = await response.json();

        if (!Array.isArray(products) || products.length === 0) {
            track.innerHTML = `<p style="color: var(--primary-gold); text-align: center; width: 100%; padding: 2rem;">Chưa có sản phẩm trong Database.</p>`;
            return;
        }

        // PHÒNG THỦ: Đảm bảo danh sách đủ dài
        let baseList = [...products];
        while (baseList.length < 6) {
            baseList = baseList.concat(products);
        }

        // Nhân đôi danh sách nối đuôi để trượt vô tận không giật
        const infiniteList = [...baseList, ...baseList];

        // Đặt tốc độ trượt
        const scrollDuration = Math.max(20, baseList.length * 4);
        track.style.animationDuration = `${scrollDuration}s`;

        // Render HTML khớp chính xác với CSS .slide-card & .card-img-wrapper
        track.innerHTML = infiniteList.map(product => `
            <div class="slide-card">
                <div class="card-img-wrapper">
                    <img src="${escapeHtml(product.image_url || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400')}" 
                         alt="${escapeHtml(product.name)}" 
                         onerror="this.src='https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'">
                </div>
                <h4>${escapeHtml(product.name)}</h4>
                <div class="price">${formatCurrency(product.price)}</div>
            </div>
        `).join('');

    } catch (error) {
        console.error('❌ Lỗi kết nối API Slide:', error);
        track.innerHTML = `
            <div style="color: #ff6b6b; text-align: center; width: 100%; padding: 1.5rem; border: 1px dashed #ff6b6b;">
                <p style="margin-bottom: 0.5rem; font-weight: bold;">Không thể tải danh sách sản phẩm!</p>
                <small style="color: #ccc;">Chi tiết: ${escapeHtml(error.message)}</small>
            </div>
        `;
    }
}

function formatCurrency(amount) {
    const numericAmount = Number(amount) || 0;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numericAmount);
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
    initPageLoader();
});

function initPageLoader() {
    const loader = document.getElementById('page-loader');

    // Ẩn loader sau khi trang web đã tải xong
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loader) loader.classList.add('fade-out');
        }, 300);
    });

    // Hiện lại loader khi bấm sang trang .html khác
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (
                href && 
                !href.startsWith('#') && 
                !href.startsWith('http') && 
                !href.startsWith('javascript') &&
                link.target !== '_blank'
            ) {
                e.preventDefault();
                if (loader) loader.classList.remove('fade-out');

                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });
}