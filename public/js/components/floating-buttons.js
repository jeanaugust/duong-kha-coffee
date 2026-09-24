// @ts-nocheck
// ==========================================================================
// FLOATING BUTTONS - BAN FIX KHONG LOI TS + LOGO TU public/images
// File: public/js/components/floating-buttons.js
// ==========================================================================

(function() {
    var CONFIG = {
        facebookPageId: '61577399067520',
        zaloPhone: '0916258049',
        // Duong dan logo trong public/images
        messengerLogo: '/images/messenger.png',
        zaloLogo: '/images/zalo.png'
    };

    function createBtn(className, label, imgSrc, fallbackText, link) {
        var el;
        if (link) {
            el = document.createElement('a');
            el.href = link;
            el.target = '_blank';
            el.rel = 'noopener';
        } else {
            el = document.createElement('button');
            el.type = 'button';
        }
        el.className = 'float-btn ' + className;
        el.setAttribute('aria-label', label);
        el.title = label;

        // Nếu có ảnh thì dùng ảnh, không thì dùng chữ
        if (imgSrc) {
            var img = document.createElement('img');
            img.src = imgSrc;
            img.alt = label;
            img.loading = 'lazy';
            // Nếu ảnh local bị lỗi thì dùng ảnh online dự phòng
            img.onerror = function() {
                if (className === 'messenger') {
                    this.src = 'https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg';
                } else if (className === 'zalo') {
                    this.src = 'https://stc-zaloprofile.s3.amazonaws.com/pc/v1/images/zalo_sharelogo.png';
                }
            };
            el.appendChild(img);
        } else {
            el.textContent = fallbackText;
        }

        return el;
    }

    function createFloatingButtons() {
        if (document.getElementById('floating-actions')) return;

        var wrapper = document.createElement('div');
        wrapper.id = 'floating-actions';
        wrapper.className = 'floating-actions';

        var messengerLink = createBtn('messenger', 'Chat Facebook', CONFIG.messengerLogo, 'M', 'https://m.me/' + CONFIG.facebookPageId);
        var zaloLink = createBtn('zalo', 'Chat Zalo', CONFIG.zaloLogo, 'Z', 'https://zalo.me/' + CONFIG.zaloPhone);
        var backBtn = createBtn('back-to-top', 'Len dau trang', null, '↑', null);
        backBtn.id = 'backToTopBtn';

        wrapper.appendChild(messengerLink);
        wrapper.appendChild(zaloLink);
        wrapper.appendChild(backBtn);
        document.body.appendChild(wrapper);

        var btn = document.getElementById('backToTopBtn');
        if (btn) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 300) {
                    btn.classList.add('show');
                } else {
                    btn.classList.remove('show');
                }
            }, { passive: true });
            btn.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingButtons);
    } else {
        createFloatingButtons();
    }
})();