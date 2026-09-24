document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('products-grid');
    const countEl = document.getElementById('product-count');
    const chips = document.querySelectorAll('.chip');
    const compareBar = document.getElementById('compare-bar');
    const compareCount = document.getElementById('compare-count');
    const compareModal = document.getElementById('compare-modal');
    const compareWrap = document.getElementById('compare-table-wrap');

    let allProducts = [];
    let filteredProducts = [];
    let selectedIds = new Set();
    let currentFilter = 'all';

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount) || 0);
    }

    function getType(p) {
        const n = (p.name + ' ' + (p.description||'')).toLowerCase();
        if (n.includes('blend')) return 'blend';
        if (n.includes('arabica')) return 'arabica';
        if (n.includes('robusta')) return 'robusta';
        return 'robusta';
    }

    async function fetchProducts() {
        try {
            const res = await fetch('/api/products');
            const json = await res.json();
            // Support both {success,data} and direct array
            if (Array.isArray(json)) allProducts = json;
            else if (json.data) allProducts = json.data;
            else if (json.success && json.data) allProducts = json.data;
            else allProducts = [];

            // Fallback mock if empty for demo
            if (allProducts.length === 0) {
                allProducts = [
                    {id:1, name:'Robusta Honey Đậm', description:'Đắng êm, hậu ngọt dài, body dày', taste_notes:'Đắng êm, chocolate đen, hậu ngọt', brew_method:'Phin, Espresso, Phin lớn quán', grind_type:'Bột / Hạt', price:180000, image_url:'', shelf_life:'6 tháng'},
                    {id:2, name:'Arabica Cầu Đất', description:'Chua thanh, thơm hoa quả', taste_notes:'Chua thanh, cam quýt, hoa nhài', brew_method:'Pour Over, Cold Brew', grind_type:'Hạt rang', price:280000, image_url:''},
                    {id:3, name:'Blend Dương Kha 70/30', description:'Cân bằng cho quán', taste_notes:'Đậm, ngọt, nâu cánh gián', brew_method:'Phin, Máy', grind_type:'Bột', price:200000, image_url:''},
                ];
            }

            filteredProducts = [...allProducts];
            render();
        } catch (e) {
            console.error(e);
            grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#ff6b6b;padding:2rem">Lỗi tải sản phẩm. Kiểm tra /api/products</p>';
        }
    }

    function render() {
        countEl.textContent = `${filteredProducts.length} sản phẩm`;
        if (filteredProducts.length === 0) {
            grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted)">Không có sản phẩm phù hợp.</p>';
            return;
        }

        grid.innerHTML = filteredProducts.map(p => {
            const isSelected = selectedIds.has(String(p.id));
            const taste = escapeHtml(p.taste_notes || p.taste || 'Đắng êm, hậu ngọt');
            const brew = escapeHtml(p.brew_method || p.brewing_method || p.brew_method || 'Phin, Espresso');
            const grind = escapeHtml(p.grind_type || p.grind || 'Bột / Hạt');
            const type = getType(p);
            const img = p.image_url || `https://via.placeholder.com/400x300/141210/f3e08c?text=${encodeURIComponent(p.name)}`;
            return `
            <article class="product-card-lux ${isSelected ? 'selected' : ''} reveal" data-id="${p.id}" data-type="${type}">
                <div class="product-card-top">
                    <img src="${img}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300/141210/f3e08c?text=Coffee'">
                    <span class="card-badge">${type}</span>
                    <button class="card-compare-check" data-check="${p.id}" title="Chọn để so sánh">${isSelected ? '✓' : '+'}</button>
                </div>
                <div class="product-card-body">
                    <h3 class="product-card-title">${escapeHtml(p.name)}</h3>
                    <p class="product-card-desc">${escapeHtml(p.description || '')}</p>
                    <div class="product-specs">
                        <div class="spec-row"><span class="spec-label">Hương vị</span><span class="spec-value">${taste}</span></div>
                        <div class="spec-row"><span class="spec-label">Cách pha</span><span class="spec-value">${brew}</span></div>
                        <div class="spec-row"><span class="spec-label">Quy cách</span><span class="spec-value">${grind} · HSD: ${escapeHtml(p.shelf_life || '6 tháng')}</span></div>
                    </div>
                    <div class="product-card-footer">
                        <div class="price-group">
                            <span class="price-main">${formatCurrency(p.price)}</span>
                            <span class="price-sub">/ 1 kg · Giá sỉ inbox</span>
                        </div>
                        <a href="product-detail.html?id=${p.id}" class="btn-detail">Chi tiết</a>
                    </div>
                </div>
            </article>
            `;
        }).join('');

        // re-observe reveal
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // bind check
        grid.querySelectorAll('[data-check]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleCompare(btn.dataset.check);
            });
        });
    }

    function toggleCompare(id) {
        id = String(id);
        if (selectedIds.has(id)) selectedIds.delete(id);
        else {
            if (selectedIds.size >= 3) {
                alert('Anh/chị chỉ có thể chọn tối đa 3 sản phẩm để so sánh. Vui lòng bỏ chọn một sản phẩm trước khi thêm sản phẩm khác. Dương Kha Coffee xin cảm ơn!');
                return;
            }
            selectedIds.add(id);
        }
        updateCompareBar();
        render();
    }

    function updateCompareBar() {
        compareCount.textContent = selectedIds.size;
        if (selectedIds.size > 0) compareBar.classList.add('show');
        else compareBar.classList.remove('show');
    }

    function openCompareModal() {
        const selectedProducts = allProducts.filter(p => selectedIds.has(String(p.id)));
        if (selectedProducts.length < 2) {
            alert('Chọn ít nhất 2 sản phẩm để so sánh');
            return;
        }

        const rows = [
            { label: 'Sản phẩm', key: 'head' },
            { label: 'Giá / kg', key: 'price' },
            { label: 'Hương vị', key: 'taste' },
            { label: 'Cách pha', key: 'brew' },
            { label: 'Quy cách', key: 'grind' },
            { label: 'Mô tả', key: 'desc' },
        ];

        let html = '<table class="compare-table"><thead><tr><th></th>';
        selectedProducts.forEach(p => {
            const img = p.image_url || `https://via.placeholder.com/200x200/141210/f3e08c?text=${encodeURIComponent(p.name)}`;
            html += `<th class="compare-product-head">
                <img src="${img}" alt=""><h4>${escapeHtml(p.name)}</h4>
                <div class="price-main">${formatCurrency(p.price)}</div>
            </th>`;
        });
        html += '</tr></thead><tbody>';

        rows.slice(1).forEach(row => {
            html += `<tr><th>${row.label}</th>`;
            selectedProducts.forEach(p => {
                let val = '';
                if (row.key === 'price') val = `<span class="price-main">${formatCurrency(p.price)}</span><br><span class="price-sub">HSD: ${escapeHtml(p.shelf_life||'6 tháng')}</span>`;
                if (row.key === 'taste') val = escapeHtml(p.taste_notes || p.taste || '');
                if (row.key === 'brew') val = escapeHtml(p.brew_method || p.brewing_method || '');
                if (row.key === 'grind') val = escapeHtml((p.grind_type||p.grind||'') + ' / ' + (p.shelf_life||''));
                if (row.key === 'desc') val = escapeHtml(p.description||'');
                html += `<td><div class="spec-value">${val}</div></td>`;
            });
            html += '</tr>';
        });

        html += '</tbody></table>';
        compareWrap.innerHTML = html;
        compareModal.classList.add('open');
    }

    // Filters
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.dataset.filter;
            if (currentFilter === 'all') filteredProducts = [...allProducts];
            else filteredProducts = allProducts.filter(p => getType(p) === currentFilter);
            render();
        });
    });

    // Compare actions
    document.getElementById('clear-compare').addEventListener('click', () => {
        selectedIds.clear();
        updateCompareBar();
        render();
    });
    document.getElementById('open-compare').addEventListener('click', openCompareModal);
    document.getElementById('close-compare').addEventListener('click', () => compareModal.classList.remove('open'));
    document.getElementById('compare-overlay').addEventListener('click', () => compareModal.classList.remove('open'));

    // Reveal observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); observer.unobserve(e.target); } });
    }, { threshold: 0.12 });

    fetchProducts();
});