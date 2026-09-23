document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Smooth Scroll (Menü Kaydırma)
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

    // 2. Kaydırınca Hakkımda Görseli Animasyonunu Tetikleme
    const imageWrapper = document.querySelector('.about-image-wrapper');
    if (imageWrapper) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    imageWrapper.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.3 });

        imageWrapper.style.animationPlayState = 'paused';
        observer.observe(imageWrapper);
    }

    // 3. Proje Kartları Büyüme ve Otomatik Slayt Modalı
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('projectModal');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const closeModal = document.querySelector('.close-project-modal');
    
    const modalSliderImg = document.getElementById('modalSliderImg');
    const sliderIndicators = document.getElementById('sliderIndicators');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalTags = document.getElementById('modalTags');
    const modalExternalBtn = document.getElementById('modalExternalBtn');

    let activeSlideInterval = null;

    projectCards.forEach(card => {
        const expandBtn = card.querySelector('.project-expand-btn');
        const imgContainer = card.querySelector('.project-img-container');
        
        const openModalAction = () => {
            const title = card.querySelector('h3').innerText;
            const desc = card.querySelector('p').innerText;
            const tags = card.querySelectorAll('.project-tags span');
            const imagesAttr = card.getAttribute('data-images');
            const projectLink = card.getAttribute('data-link');
            
            modalTitle.innerText = title;
            modalDesc.innerText = desc;
            
            if (projectLink) {
                modalExternalBtn.href = projectLink;
                modalExternalBtn.style.display = 'inline-flex';
            } else {
                modalExternalBtn.style.display = 'none';
            }
            
            modalTags.innerHTML = '';
            tags.forEach(tag => {
                const span = document.createElement('span');
                span.innerText = tag.innerText;
                modalTags.appendChild(span);
            });

            if (imagesAttr) {
                const images = JSON.parse(imagesAttr);
                let currentIdx = 0;

                const updateSlide = (idx) => {
                    modalSliderImg.style.opacity = '0';
                    setTimeout(() => {
                        modalSliderImg.src = images[idx];
                        modalSliderImg.style.opacity = '1';
                    }, 200);

                    const dots = sliderIndicators.querySelectorAll('.indicator');
                    dots.forEach((dot, dIdx) => {
                        dot.classList.toggle('active', dIdx === idx);
                    });
                };

                sliderIndicators.innerHTML = '';
                images.forEach((imgSrc, iIdx) => {
                    const dot = document.createElement('div');
                    dot.classList.add('indicator');
                    if (iIdx === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => {
                        currentIdx = iIdx;
                        updateSlide(currentIdx);
                        resetInterval();
                    });
                    sliderIndicators.appendChild(dot);
                });

                modalSliderImg.src = images[0];

                const startInterval = () => {
                    activeSlideInterval = setInterval(() => {
                        currentIdx = (currentIdx + 1) % images.length;
                        updateSlide(currentIdx);
                    }, 2500);
                };

                const resetInterval = () => {
                    clearInterval(activeSlideInterval);
                    startInterval();
                };

                startInterval();
            }

            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };

        expandBtn.addEventListener('click', openModalAction);
        imgContainer.addEventListener('click', openModalAction);
    });

    const closeModalAction = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        clearInterval(activeSlideInterval);
    };

    if (closeModal) closeModal.addEventListener('click', closeModalAction);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModalAction);

    // 4. Form Gönderim İşlemi (Formspree Entegrasyonu)
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Gönderiliyor...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('https://formspree.io/f/BURAYA_FORM_ID_YAZILACAK', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    alert('Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağım.');
                    contactForm.reset();
                } else {
                    alert('Bir hata oluştu, lütfen daha sonra tekrar deneyin.');
                }
            } catch (error) {
                alert('Bağlantı hatası! Mesajınız gönderilemedi.');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
            }
        });
    }
});