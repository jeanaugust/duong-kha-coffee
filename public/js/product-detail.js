document.addEventListener('DOMContentLoaded', async () => {
    const root = document.getElementById('product-detail-root');
    const relatedRoot = document.getElementById('related-products');
    const relatedGrid = document.getElementById('related-grid');
    if (!root) return;

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
            root.innerHTML = '<p style="text-align:center;color:#ff6b6b">Sản phẩm không tồn tại.</p>';
            return;
        }

        const img = p.image_url || `https://via.placeholder.com/600x600/141210/f3e08c?text=${encodeURIComponent(p.name)}`;
        const taste = escapeHtml(p.taste_notes || p.taste || 'Đắng êm, hậu ngọt, chocolate');
        const brew = escapeHtml(p.brew_method || p.brewing_method || 'Phin, Espresso, Phin lớn');
        const grind = escapeHtml(p.grind_type || p.grind || 'Bột / Hạt');
        const shelf = escapeHtml(p.shelf_life || '6 tháng');
        const desc = escapeHtml(p.description || 'Cà phê rang mộc gia truyền từ 2010, không tẩm bơ, không hương liệu.');
        const shareUrl = `${window.location.origin}/product/${p.id}`;

        document.title = `${p.name} - ${formatCurrency(p.price)} | Dương Kha Coffee`;

        root.innerHTML = `
            <div class="pd-layout">
                <div class="pd-gallery">
                    <img class="pd-main-img" id="pd-main-img" src="${img}" alt="${escapeHtml(p.name)}" onerror="this.src='https://via.placeholder.com/600x600/141210/f3e08c?text=Coffee'">
                    <div id="extra-gallery" class="extra-gallery"></div>
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
                        <div class="spec-row"><span class="spec-label">Bảo quản</span><span class="spec-value">HSD ${shelf}</span></div>
                    </div>
                    <div class="pd-actions">
                        <a href="https://zalo.me/0916258049?text=Mình muốn đặt ${encodeURIComponent(p.name)}" target="_blank" class="btn-primary">Đặt sỉ qua Zalo</a>
                        <button class="btn-secondary" id="btn-copy-link">Copy link</button>
                    </div>
                    <div class="share-section">
                        <button class="share-btn" id="btn-share-fb">Chia sẻ về Facebook</button>
                        <button class="share-btn messenger" id="btn-share-messenger">Chia sẻ qua Messenger</button>
                    </div>
                    <div class="pd-extra">
                        <h4>Phù hợp cho quán</h4>
                        <ul>
                            <li>Rang mới trong 7 ngày, giao trong An Giang 24h</li>
                            <li>Xay theo yêu cầu: Bột phin / Espresso / Hạt</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        // --- LOGIC ẢNH PHỤ 10 ẢNH GRID NGẪU NHIÊN ---
        const mainImgEl = document.getElementById('pd-main-img');
        const extraGalleryEl = document.getElementById('extra-gallery');

        async function loadExtraImages() {
            try {
                const r = await fetch(`/api/products/${productId}/images`);
                if (!r.ok) return;
                const images = await r.json();
                if (!images.length) { extraGalleryEl.style.display='none'; return; }

                extraGalleryEl.innerHTML = images.map((item, idx) => {
                    const url = escapeHtml(item.image_url);
                    // Tự cân: ảnh đầu và ảnh thứ 5 to hơn để grid không đều đều
                    const spanClass = (idx === 0 || idx % 5 === 0) && images.length > 3? 'span-2' : '';
                    return `<img src="${url}" class="${spanClass}" alt="Ảnh ${idx+1}" loading="lazy" onerror="this.style.display='none'">`;
                }).join('');

                extraGalleryEl.querySelectorAll('img').forEach(imgEl => {
                    imgEl.addEventListener('click', () => {
                        mainImgEl.src = imgEl.src;
                        mainImgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    });
                });
            } catch(e) { console.log('Không có ảnh phụ', e); }
        }
        loadExtraImages();

        // Copy + Share giữ nguyên
        document.getElementById('btn-copy-link')?.addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(shareUrl); alert('Đã copy link:\n' + shareUrl); }
            catch { prompt('Copy link này:', shareUrl); }
        });
        document.getElementById('btn-share-fb')?.addEventListener('click', () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
        });
        document.getElementById('btn-share-messenger')?.addEventListener('click', () => {
            const webMessengerUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(shareUrl)}&display=popup`;
            window.open(webMessengerUrl, '_blank', 'width=600,height=500');
        });

        const related = allProducts.filter(x => String(x.id)!== String(productId) && getType(x) === getType(p)).slice(0,3);
        if (related.length > 0 && relatedRoot && relatedGrid) {
            relatedRoot.style.display = 'block';
            relatedGrid.innerHTML = related.map(r => `
                <div class="product-card-lux">
                    <div class="product-card-top"><img src="${r.image_url || ''}" alt="${escapeHtml(r.name)}"></div>
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
    } catch (err) {
        console.error(err);
        root.innerHTML = `<p style="text-align:center;color:#ff6b6b">Lỗi: ${escapeHtml(err.message)}</p>`;
    }
});