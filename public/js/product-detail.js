document.addEventListener('DOMContentLoaded', async () => {
    const root = document.getElementById('product-detail-root');
    const relatedRoot = document.getElementById('related-products');
    const relatedGrid = document.getElementById('related-grid');
    if (!root) return;

    // --- FIX 1: Hỗ trợ cả 2 dạng link /product/5 và product-detail.html?id=5 ---
    function getProductId() {
        const pathMatch = window.location.pathname.match(/\/product\/(\d+)/);
        if (pathMatch) return pathMatch[1];
        return new URLSearchParams(window.location.search).get('id');
    }
    const productId = getProductId();

    if (!productId) {
        root.innerHTML = '<p style="text-align:center;color:#ff6b6b">Không tìm thấy ID sản phẩm.</p>';
        return;
    }

    function escapeHtml(str){ return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
    function formatCurrency(amount){ return new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(Number(amount)||0); }
    function getType(p){
        const n = (p.name + ' ' + (p.description||'')).toLowerCase();
        if (n.includes('blend')) return 'blend';
        if (n.includes('arabica')) return 'arabica';
        return 'robusta';
    }

    try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('API loi ' + res.status);
        const json = await res.json();
        const allProducts = Array.isArray(json)? json : (json.data || json.data?.data || []);

        const p = allProducts.find(item => String(item.id) === String(productId));
        if (!p) {
            root.innerHTML = '<p style="text-align:center;color:#ff6b6b">Sản phẩm không tồn tại hoặc đã bị xóa.</p>';
            return;
        }

        const img = p.image_url || `https://via.placeholder.com/600x600/141210/f3e08c?text=${encodeURIComponent(p.name)}`;
        const taste = escapeHtml(p.taste_notes || p.taste || 'Đắng êm, hậu ngọt, chocolate');
        const brew = escapeHtml(p.brew_method || p.brewing_method || 'Phin, Espresso, Phin lớn');
        const grind = escapeHtml(p.grind_type || p.grind || 'Bột / Hạt');
        const shelf = escapeHtml(p.shelf_life || '6 tháng');
        const desc = escapeHtml(p.description || 'Cà phê rang mộc gia truyền từ 2010, không tẩm bơ, không hương liệu.');

        document.title = `${p.name} - ${formatCurrency(p.price)} | Dương Kha Coffee`;

        root.innerHTML = `
            <div class="pd-layout reveal active">
                <div class="pd-gallery">
                    <img src="${img}" alt="${escapeHtml(p.name)}" onerror="this.src='https://via.placeholder.com/600x600/141210/f3e08c?text=Coffee'">
                </div>
                <div class="pd-content">
                    <span class="pd-badge">${getType(p).toUpperCase()} · RANG MỘC</span>
                    <h1 class="pd-title">${escapeHtml(p.name)}</h1>
                    <p class="pd-desc-main">${desc}</p>

                    <div class="pd-price-box">
                        <div class="price-main">${formatCurrency(p.price)}</div>
                        <div class="price-sub">/ 1 kg · Giá sỉ inbox Zalo để được giá tốt nhất</div>
                    </div>

                    <div class="pd-specs">
                        <div class="spec-row"><span class="spec-label">Hương vị</span><span class="spec-value">${taste}</span></div>
                        <div class="spec-row"><span class="spec-label">Cách pha</span><span class="spec-value">${brew}</span></div>
                        <div class="spec-row"><span class="spec-label">Quy cách</span><span class="spec-value">${grind}</span></div>
                        <div class="spec-row"><span class="spec-label">Bảo quản</span><span class="spec-value">HSD ${shelf} · Đậy kín, tránh nắng</span></div>
                    </div>

                    <div class="pd-actions">
                        <a href="https://zalo.me/0916258049?text=Mình muốn đặt ${encodeURIComponent(p.name)}" target="_blank" class="btn-primary">Đặt sỉ qua Zalo</a>
                        <button class="btn-secondary" id="btn-copy-link">Copy link</button>
                    </div>

                    <!-- FIX 2: Nút chia sẻ chuyên nghiệp - CSS tách riêng -->
                    <div class="share-section">
                        <button class="share-btn" id="btn-share-fb">📘 Facebook</button>
                        <button class="share-btn zalo" id="btn-share-zalo">💬 Zalo</button>
                    </div>

                    <div class="pd-extra">
                        <h4>Phù hợp cho quán</h4>
                        <ul>
                            <li>Rang mới trong 7 ngày, giao trong An Giang 24h</li>
                            <li>Xay theo yêu cầu: Bột phin / Espresso / Hạt</li>
                            <li>Hỗ trợ công thức pha chuẩn cho quán mới</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        // --- FIX 3: Xử lý nút share ---
        const currentUrl = window.location.href;
        document.getElementById('btn-copy-link')?.addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(currentUrl); alert('Đã copy link: ' + currentUrl); }
            catch { prompt('Copy link này:', currentUrl); }
        });
        document.getElementById('btn-share-zalo')?.addEventListener('click', () => {
            window.open(`https://zalo.me/share?url=${encodeURIComponent(currentUrl)}`, '_blank');
        });
        document.getElementById('btn-share-fb')?.addEventListener('click', () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
        });

        // 2. Render related - cùng loại - FIX 4: Link mới /product/id
        const related = allProducts.filter(x => String(x.id)!== String(productId) && getType(x) === getType(p)).slice(0,3);
        if (related.length > 0 && relatedRoot && relatedGrid) {
            relatedRoot.style.display = 'block';
            relatedGrid.innerHTML = related.map(r => `
                <div class="product-card-lux">
                    <div class="product-card-top">
                        <img src="${r.image_url || ''}" alt="${escapeHtml(r.name)}" onerror="this.src='https://via.placeholder.com/400x300/141210/f3e08c?text=Coffee'">
                    </div>
                    <div class="product-card-body">
                        <h3 class="product-card-title">${escapeHtml(r.name)}</h3>
                        <div class="product-card-footer">
                            <span class="price-main">${formatCurrency(r.price)}</span>
                            <a href="/product/${r.id}" class="btn-detail">Xem</a>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // reveal animation
        const observer = new IntersectionObserver((entries)=>{
            entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('active'); observer.unobserve(e.target); } });
        },{threshold:0.12});
        document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

    } catch (err) {
        console.error(err);
        root.innerHTML = `<p style="text-align:center;color:#ff6b6b">Lỗi kết nối máy chủ. ${escapeHtml(err.message)}</p>`;
    }
});