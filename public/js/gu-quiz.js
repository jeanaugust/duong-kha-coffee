document.addEventListener('DOMContentLoaded', async () => {
    const root = document.getElementById('gu-quiz-root');
    if (!root) return;

    const QUESTIONS = [
        {
            id: 'flavor',
            q: 'Bạn thường có bao nhiêu thời gian để pha?',
            sub: 'Để mình gợi ý cách pha hợp lý nhất - Bước 1/3',
            options: [
                { id: 'dam', label: 'Nhanh gọn < 2 phút', desc: 'Sáng vội, cần tỉnh táo ngay, pha phin, pha máy quán' },
                { id: 'chua_thanh', label: 'Thư thả 4-5 phút', desc: 'Thích ngắm cà phê chảy, pha pour over, chill buổi sáng' },
                { id: 'can_bang', label: 'Pha sẵn để tủ lạnh', desc: 'Thích cold brew, uống cả ngày, ít chua, ít đắng gắt' },
            ]
        },
        {
            id: 'brew_time',
            q: 'Gu hương vị của bạn thiên về đâu?',
            sub: 'Gu đậm hay thanh sẽ quyết định loại hạt - Bước 2/3',
            options: [
                { id: 'dam', label: 'Đậm đắng, socola, hậu ngọt', desc: 'Gu truyền thống, đen đá mạnh, uống tỉnh táo' },
                { id: 'chua_thanh', label: 'Chua thanh, thơm hoa quả', desc: 'Gu hiện đại, nhẹ nhàng, Arabica Cầu Đất' },
                { id: 'can_bang', label: 'Cân bằng, vừa phải', desc: 'Không quá đắng, không quá chua, dễ uống mỗi ngày' },
            ]
        },
        {
            id: 'style',
            q: 'Bạn thường uống kiểu nào?',
            sub: 'Đen, sữa hay nhẹ - Bước 3/3',
            options: [
                { id: 'den_da', label: 'Đen đá nguyên chất', desc: 'Không đường, cần body dày, đậm, hậu dài' },
                { id: 'bac_siu', label: 'Bạc sỉu, nâu sữa béo', desc: 'Thích béo thơm, cà phê phải đậm mới át được sữa' },
                { id: 'nhe_nhang', label: 'Nhẹ nhàng, ít caffeine', desc: 'Uống chiều tối vẫn ngủ được, không bị say' },
            ]
        }
    ];

    let step = 0;
    let answers = {};
    let allProducts = [];

    // LAY DUNG DATA THAT TU API CUA BAN
    try {
        const response = await fetch('/api/products');
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
            allProducts = resData.data;
        } else if (Array.isArray(resData)) {
            allProducts = resData;
        } else if (resData.data) {
            allProducts = resData.data;
        }
        console.log('Loaded products for quiz:', allProducts.length);
    } catch (e) {
        console.error('Quiz fetch error', e);
    }

    function scoreProduct(product) {
        const text = (product.name + ' ' + (product.description||'') + ' ' + (product.taste_notes||'')).toLowerCase();
        let score = 0;
        // mapping gu
        if (answers.flavor === 'dam' || answers.brew_time === 'dam' || answers.style === 'den_da') {
            if (text.includes('robusta') || text.includes('đậm') || text.includes('honey') || text.includes('socola') || text.includes('đắng')) score += 3;
            if (text.includes('blend') && text.includes('70')) score += 2;
        }
        if (answers.flavor === 'chua_thanh' || answers.brew_time === 'chua_thanh' || answers.style === 'nhe_nhang') {
            if (text.includes('arabica') || text.includes('cầu đất') || text.includes('chua') || text.includes('hoa quả') || text.includes('cam')) score += 3;
        }
        if (answers.flavor === 'can_bang' || answers.style === 'bac_siu') {
            if (text.includes('blend') || text.includes('cân bằng') || text.includes('vừa')) score += 3;
        }
        // ưu tiên thời gian pha
        if (answers.flavor === 'dam' && (text.includes('phin') || text.includes('máy'))) score += 1;
        if (answers.flavor === 'chua_thanh' && (text.includes('pour') || text.includes('cold brew'))) score += 1;

        return score;
    }

    function getRecommendation() {
        if (allProducts.length === 0) return null;
        // tinh diem cho tung san pham
        const scored = allProducts.map(p => ({ p, s: scoreProduct(p) })).sort((a,b)=> b.s - a.s);
        // nếu điểm bằng nhau thì lấy giá trị đầu tiên
        return scored[0]?.p || allProducts[0];
    }

    function render() {
        if (step < QUESTIONS.length) {
            const q = QUESTIONS[step];
            root.innerHTML = `
                <div class="quiz-card">
                    <div class="quiz-progress">${QUESTIONS.map((_,i)=>`<span class="${i<=step?'active':''}"></span>`).join('')}</div>
                    <span class="gold-leaf-divider">❖</span>
                    <h2 class="quiz-question">${q.q}</h2>
                    <p class="quiz-sub">${q.sub}</p>
                    <div class="quiz-options">
                        ${q.options.map(o=>`
                            <button class="quiz-opt ${answers[q.id]===o.id?'selected':''}" data-id="${o.id}">
                                <b>${o.label}</b>
                                <small>${o.desc}</small>
                            </button>
                        `).join('')}
                    </div>
                    <div class="quiz-actions">
                        <button class="btn-gold-outline" id="btn-prev" style="${step===0?'visibility:hidden':''}">← QUAY LẠI</button>
                        <button class="btn-gold-outline" id="btn-next" ${!answers[q.id]?'disabled':''}>TIẾP TỤC →</button>
                    </div>
                </div>
            `;
            root.querySelectorAll('.quiz-opt').forEach(btn=>{
                btn.addEventListener('click', ()=>{
                    answers[q.id] = btn.dataset.id;
                    render();
                });
            });
            root.querySelector('#btn-prev')?.addEventListener('click', ()=>{ step--; render(); });
            root.querySelector('#btn-next')?.addEventListener('click', ()=>{ step++; render(); });
        } else {
            renderResult();
        }
    }

    function renderResult() {
        const rec = getRecommendation();
        if (!rec) {
            root.innerHTML = `<div class="quiz-card" style="text-align:center"><p style="color:var(--text-muted)">Chưa có sản phẩm trong database. Vui lòng thêm sản phẩm ở /api/products</p><a href="product.html" class="btn-gold-outline" style="margin-top:1rem;display:inline-block">Xem sản phẩm</a></div>`;
            return;
        }
        const img = rec.image_url || `https://via.placeholder.com/400x400/141210/f3e08c?text=${encodeURIComponent(rec.name)}`;
        const taste = rec.taste_notes || rec.description || 'Rang mộc gia truyền, không tẩm';

        root.innerHTML = `
            <div class="quiz-card" style="text-align:center">
                <span class="result-badge">Gu của bạn</span>
                <h2 class="result-title">Dương Kha gợi ý cho bạn</h2>
                <p class="result-desc">Dựa trên câu trả lời của bạn, đây là loại hợp gu nhất trong xưởng rang của Dương Kha hiện tại:</p>

                <div class="result-product">
                    <img src="${img}" alt="${rec.name}" onerror="this.src='https://via.placeholder.com/400x400/141210/f3e08c?text=Coffee'">
                    <div style="text-align:left; flex:1">
                        <h4 style="color:var(--text-light); font-size:1.1rem; margin-bottom:6px;">${rec.name}</h4>
                        <p style="color:var(--text-muted); font-size:.85rem; line-height:1.6; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">${taste}</p>
                        <div style="margin-top:10px; color:var(--primary-gold); font-family:var(--font-heading); font-size:1.25rem; font-weight:600;">${Number(rec.price).toLocaleString('vi-VN')} VNĐ</div>
                    </div>
                </div>

                <div style="display:flex; gap:10px;">
                    <a href="product-detail.html?id=${rec.id}" class="btn-gold-outline" style="flex:1; background:var(--primary-gold); color:var(--bg-dark);">Xem chi tiết & đặt thử</a>
                    <button class="btn-gold-outline" id="retry-quiz" style="flex:0.4">Làm lại</button>
                </div>
            </div>
        `;
        document.getElementById('retry-quiz').addEventListener('click', ()=>{ step=0; answers={}; render(); });
    }

    render();
});