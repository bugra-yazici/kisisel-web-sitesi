document.addEventListener('DOMContentLoaded', () => {
    
    // Smooth Scroll (Menü Kaydırma)
    const links = document.querySelectorAll('.nav-links a, .hero a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Kaydırınca Görsel Animasyonunu Tetikleme
    const imageWrapper = document.querySelector('.about-image-wrapper');
    
    if (imageWrapper) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Ekrana girince animasyon sınıfını veya stilini aktif eder
                    imageWrapper.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.3 });

        imageWrapper.style.animationPlayState = 'paused'; // Başlangıçta durdur
        observer.observe(imageWrapper);
    }
    // Form Gönderim İşlemi
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Sayfanın yeniden yüklenmesini engeller

            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;

            // Buton durumunu değiştir
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Gönderiliyor...';
            submitBtn.style.opacity = '0.7';

            // 1.5 saniye sonra başarılı simülasyonu yap
            setTimeout(() => {
                alert('Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağım.');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.opacity = '1';
            }, 1500);
        });
    }
});