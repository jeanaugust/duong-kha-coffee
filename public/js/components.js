document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
});

/**
 * 1. COMPONENT HEADER DÙNG CHUNG (Tích hợp Mobile Toggle)
 */
function renderHeader() {
    const headerContainer = document.getElementById('app-header');
    if (!headerContainer) return;

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    headerContainer.innerHTML = `
        <header class="main-header">
            <div class="header-inner">
                <div class="logo-container">
                    <a href="index.html" class="logo-link">
                        <img src="images/logo.png" alt="Duong Kha Coffee" onerror="this.style.display='none'; document.getElementById('alt-logo').style.display='block';">
                        <div id="alt-logo" class="alt-logo-text" style="display: none;">
                            <span>DUONG KHA</span>
                            <small>ROASTED COFFEE</small>
                        </div>
                    </a>
                </div>

                <!-- Nút Hamburger Toggle dành riêng cho Mobile -->
                <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav class="nav-menu" id="nav-menu">
                    <ul>
                        <li><a href="index.html" class="${currentPath === 'index.html' || currentPath === '' ? 'active' : ''}">Trang Chủ</a></li>
                        <li><a href="about.html" class="${currentPath === 'about.html' ? 'active' : ''}">Giới Thiệu</a></li>
                        <li><a href="gu-cua-ban.html" class="${currentPath === 'gu-cua-ban.html' ? 'active' : ''}">GU CỦA BẠN</a></li>
                        <li><a href="products.html" class="${currentPath === 'products.html' ? 'active' : ''}">Sản Phẩm</a></li>
                        <li><a href="contact.html" class="${currentPath === 'contact.html' ? 'active' : ''}">Liên Hệ</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    `;

    // Gán sự kiện Toggle Menu Mobile ngay sau khi HTML được vẽ
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('open');
            navMenu.classList.toggle('active');
        });
    }
}

/**
 * COMPONENT FOOTER DÙNG CHUNG (Phong cách Pixelgrade - Căn trái, Chia đều không gian, Không Icon)
 */
function renderFooter() {
    const footerContainer = document.getElementById('app-footer');
    if (!footerContainer) return;

    footerContainer.innerHTML = `
        <footer class="main-footer">
            <div class="footer-container">
                <!-- Cột lớn bên trái: Thương hiệu, Slogan & Mạng xã hội -->
                <div class="footer-col footer-brand-col">
                    <h3 class="footer-brand-title">DUONG KHA COFFEE</h3>
                    <p class="footer-slogan">
                        Hơn 15 năm giữ lửa cho một di sản cà phê gia truyền – chúng tôi không chỉ rang xay cà phê, mà rang xay cả tâm huyết của nhiều thế hệ.
                    </p>
                    
                    <div class="footer-social-inline">
                        <span class="social-label">Theo dõi chúng tôi:</span>
                        <div class="social-links">
                            <a href="https://zalo.me/0916258049" target="_blank" rel="noopener noreferrer">Zalo</a>
                            <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
                            <a href="#" target="_blank" rel="noopener noreferrer">YouTube</a>
                            <a href="#" target="_blank" rel="noopener noreferrer">TikTok</a>
                        </div>
                    </div>
                </div>

                <!-- Cột 2: Thông tin liên hệ -->
                <div class="footer-col">
                    <h4 class="footer-heading">LIÊN HỆ</h4>
                    <ul class="footer-list">
                        <li>
                            <span class="list-label">Địa chỉ:</span>
                            <p class="list-text">287 Đ. Hùng Vương, Long Xuyên, An Giang 90000, Việt Nam</p>
                        </li>
                        <li>
                            <span class="list-label">Điện thoại bàn:</span>
                            <a href="tel:02963847633" class="list-link">0296 3847633</a>
                        </li>
                        <li>
                            <span class="list-label">Hotline / Zalo:</span>
                            <a href="https://zalo.me/0916258049" target="_blank" rel="noopener noreferrer" class="list-link">0916 258 049</a>
                        </li>
                    </ul>
                </div>

                <!-- Cột 3: Sitemap (Sơ đồ trang) -->
                <div class="footer-col">
                    <h4 class="footer-heading">DANH MỤC</h4>
                    <ul class="footer-list">
                        <li><a href="index.html" class="list-link">Trang Chủ</a></li>
                        <li><a href="about.html" class="list-link">Giới Thiệu</a></li>
                        <li><a href="gu-cua-ban.html" class="list-link">Gu Của Bạn</a></li>
                        <li><a href="products.html" class="list-link">Sản Phẩm</a></li>
                        <li><a href="contact.html" class="list-link">Liên Hệ</a></li>
                    </ul>
                </div>

                <!-- Cột 4: Bản đồ & Chỉ đường -->
                <div class="footer-col">
                    <h4 class="footer-heading">VỊ TRÍ</h4>
                    <ul class="footer-list">
                        <li>
                            <p class="list-text">Ghé thăm cửa hàng rang xay trực tiếp của chúng tôi.</p>
                        </li>
                        <li>
                            <a href="https://maps.app.goo.gl/Yvdh6Pust23fXW5CA" target="_blank" rel="noopener noreferrer" class="map-btn-link">
                                Xem Google Maps &rarr;
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Dòng bản quyền phía dưới -->
            <div class="footer-bottom">
                <div class="footer-bottom-inner">
                    <p>&copy; 2026 DUONG KHA COFFEE. All rights reserved.</p>
                    <p class="sub-text">Thương hiệu Cà Phê Rang Nguyên Chất Thượng Hạng</p>
                </div>
            </div>
        </footer>
    `;
    // Load floating buttons component
const fbScript = document.createElement('script');
fbScript.src = 'js/components/floating-buttons.js';
document.body.appendChild(fbScript);

var favScript = document.createElement('script');
favScript.src = '/js/components/favicon.js';
document.head.appendChild(favScript);
}