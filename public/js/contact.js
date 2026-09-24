document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const statusMsg = document.getElementById('statusMessage');
    const submitBtn = document.getElementById('submitBtn');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable nút gửi để chống Spam Request
        submitBtn.disabled = true;
        submitBtn.innerText = 'ĐANG GỬI...';
        statusMsg.innerText = '';

        const formData = {
            fullname: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                statusMsg.style.color = '#5cdb95';
                statusMsg.innerText = result.message;
                form.reset();
            } else {
                statusMsg.style.color = '#ff6b6b';
                statusMsg.innerText = result.errors ? result.errors.map(e => e.msg).join(' ') : result.message;
            }
        } catch (err) {
            console.error('Contact submission error:', err);
            statusMsg.style.color = '#ff6b6b';
            statusMsg.innerText = 'Không thể gửi thông tin do lỗi mạng. Vui lòng thử lại sau.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = 'GỬI THÔNG TIN';
        }
    });
});