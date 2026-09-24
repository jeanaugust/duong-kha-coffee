// @ts-nocheck
// FAVICON COMPONENT - File rieng de quan ly favicon
// File: public/js/components/favicon.js

(function() {
    var LOGO_URL = '/images/logo1.png?v=2'; // Doi so v=3 neu doi logo de xoa cache

    function setFavicon() {
        // Xoa favicon cu neu co
        var oldLinks = document.querySelectorAll("link[rel*='icon']");
        oldLinks.forEach(function(el) { el.remove(); });

        // Tao favicon moi
        var link1 = document.createElement('link');
        link1.rel = 'icon';
        link1.type = 'image/png';
        link1.href = LOGO_URL;
        document.head.appendChild(link1);

        var link2 = document.createElement('link');
        link2.rel = 'shortcut icon';
        link2.href = '/favicon.ico?v=2';
        document.head.appendChild(link2);

        var link3 = document.createElement('link');
        link3.rel = 'apple-touch-icon';
        link3.href = LOGO_URL;
        document.head.appendChild(link3);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setFavicon);
    } else {
        setFavicon();
    }
})();