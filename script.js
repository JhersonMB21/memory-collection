// Control de música
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('backgroundMusic');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    
    // ✅ AÑADIR ESTA LÍNEA: Configurar volumen al 30%
    audio.volume = 0.2;
    
    // Configurar volumen al 30% y reproducir automáticamente
    function autoPlayMusic() {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Reproducción exitosa
                console.log('Música reproduciéndose automáticamente');
            }).catch(error => {
                // Reproducción automática bloqueada
                console.log('Reproducción automática bloqueada:', error);
                showPlayMessage();
            });
        }
    }
    
    // Pausar música
    function showPlayMessage() {
        // Puedes mostrar un mensaje sutil o dejar que el usuario use el botón
        console.log('Haz clic en "Reproducir Música" para iniciar');
    }
    
    // Intentar reproducción automática después de un pequeño delay
    setTimeout(autoPlayMusic, 1000);
    
    // Reproducir música (botón)
    playBtn.addEventListener('click', function() {
        audio.play().catch(e => {
            console.log('Error al reproducir:', e);
        });
    });
    
    // Pausar música
    pauseBtn.addEventListener('click', function() {
        audio.pause();
    });
    
    // Resto del código permanece igual...
    loadPhotos();
    setupImageModal();
    setupScrollAnimations();
    
    // Efectos de scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Efecto de confeti al hacer clic en los corazones
    document.querySelectorAll('.hearts, .final-hearts').forEach(heart => {
        heart.addEventListener('click', function() {
            createConfetti();
        });
    });
    
    // Optimización para dispositivos táctiles
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Mejorar la experiencia táctil
        document.querySelectorAll('.photo-item, .maki-item, .timeline-content').forEach(element => {
            element.style.cursor = 'pointer';
        });
    }
    
    // Función para cargar las fotos en la galería
    function loadPhotos() {
        const photoGrid = document.getElementById('photoGrid');
        const photoTitles = [
            "Nuestro primer día juntos",
            "Aventura en la montaña",
            "Celebración especial",
            "Momentos de risas",
            "Atardecer mágico",
            "Noche de películas",
            "Día de playa",
            "Selfie divertido",
            "Cena romántica",
            "Paseo en el parque",
            "Celebrando logros",
            "Momento tierno"
        ];
        
        // Limpiar el grid primero
        photoGrid.innerHTML = '';
        
        // Crear elementos para cada foto
        for (let i = 1; i <= 12; i++) {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item fade-in';
            photoItem.setAttribute('data-index', i);
            
            const img = document.createElement('img');
            img.src = `assets/photo${i}.jpg`;
            img.alt = `Nuestra foto ${i}`;
            img.loading = 'lazy';
            
            // Manejar errores de carga de imágenes
            img.onerror = function() {
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'photo-placeholder';
                placeholder.innerHTML = `<span>📸</span><p>Foto ${i}</p>`;
                photoItem.appendChild(placeholder);
            };
            
            // Optimización para móviles: precargar imágenes en baja calidad
            if (window.innerWidth < 768) {
                img.setAttribute('decoding', 'async');
            }
            
            const caption = document.createElement('div');
            caption.className = 'photo-caption';
            caption.textContent = photoTitles[i-1] || `Momento especial ${i}`;
            
            photoItem.appendChild(img);
            photoItem.appendChild(caption);
            photoGrid.appendChild(photoItem);
            
            // Añadir evento para abrir el modal
            photoItem.addEventListener('click', function() {
                if (img.src && img.style.display !== 'none') {
                    openModal(img.src, caption.textContent);
                }
            });
        }
        
        // Activar observador para las fotos después de crearlas
        setTimeout(() => {
            setupScrollAnimations();
        }, 100);
    }
    
    // Configurar el modal para imágenes
    function setupImageModal() {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const closeModal = document.querySelector('.close-modal');
        
        // Cerrar modal al hacer clic en la X
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Cerrar modal al hacer clic fuera de la imagen
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Cerrar modal con la tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
        
        // Optimización para móviles: cerrar modal al tocar fuera en dispositivos táctiles
        if ('ontouchstart' in window) {
            modal.addEventListener('touchstart', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
        
        // Función para abrir el modal
        window.openModal = function(src, caption) {
            modal.style.display = 'block';
            modalImg.src = src;
            modalCaption.textContent = caption;
            
            // Optimización para móviles: prevenir zoom accidental
            if ('ontouchstart' in window) {
                document.body.style.overflow = 'hidden';
            }
        };
    }
    
    // Configurar animaciones de scroll mejoradas
    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Para dispositivos móviles, reducir el umbral de animación
                    if (window.innerWidth < 768) {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    }
                }
            });
        }, observerOptions);
        
        // Observar todas las secciones
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
        
        // Observar elementos de la línea de tiempo
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.classList.add('fade-in');
            observer.observe(item);
        });
        
        // Observar tarjetas de personajes
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.add('fade-in');
            observer.observe(card);
        });
        
        // Observar elementos maki
        document.querySelectorAll('.maki-item').forEach(item => {
            item.classList.add('fade-in');
            observer.observe(item);
        });
        
        // Observar fotos de la galería
        document.querySelectorAll('.photo-item').forEach(photo => {
            observer.observe(photo);
        });
    }
    
    // Función para crear confeti (efecto simple)
    // Función para crear confeti (VERSIÓN CORREGIDA)
    function createConfetti() {
    const confettiCount = 40;
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '1000';
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.innerHTML = '✨';
        confetti.style.position = 'absolute';
        confetti.style.fontSize = '24px';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animation = `fall ${Math.random() * 2 + 2}s linear forwards`;
        
        // Colores aleatorios
        const colors = ['#FF69B4', '#6A0DAD', '#FFD700', '#4B0082'];
        confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        container.appendChild(confetti);
    }
    
    document.body.appendChild(container);
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    }, 5000);
}
    const confettiStyles = `
@keyframes fall {
    0% {
        transform: translateY(-20px) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
    }
}
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = confettiStyles;
document.head.appendChild(styleSheet);
    // Mensaje especial en la consola
    console.log(
        `%c💖 Para mi amor 💖\n\nEsta página fue creada con todo mi cariño para celebrar nuestro aniversario.\n\nEres la Twilight Sparkle y Pinkie Pie de mi vida.`,
        'color: #8A2BE2; font-size: 16px; font-weight: bold;'
    );
    
    // Detectar cambios de orientación en móviles
    window.addEventListener('orientationchange', function() {
        // Recargar animaciones después de cambiar orientación
        setTimeout(setupScrollAnimations, 100);
    });
});
// Añade esto temporalmente para probar el confeti
function testConfetti() {
    console.log('🎉 Probando confeti...');
    createConfetti();
}

// Probar confeti al hacer clic en cualquier corazón después de 3 segundos
setTimeout(() => {
    const hearts = document.querySelectorAll('.hearts, .final-hearts');
    hearts.forEach(heart => {
        heart.addEventListener('click', testConfetti);
        console.log('❤️ Confeti listo en:', heart);
    });
}, 3000);