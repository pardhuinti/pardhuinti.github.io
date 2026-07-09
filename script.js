/* ==========================================================================
   Premium Student Portfolio - JavaScript Interactions (Black & White Theme)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Custom Cursor System ---
    const cursorDot = document.getElementById('custom-cursor-dot');
    const cursorOutline = document.getElementById('custom-cursor-outline');
    
    let mouseX = 0;
    let mouseY = 0;
    
    let dotX = 0;
    let dotY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    const dotEasing = 0.35;      // Faster snap
    const outlineEasing = 0.15;  // Lagged trailing effect
    
    let cursorVisible = false;

    // Mouse movement tracker
    document.addEventListener('mousemove', (e) => {
        if (!cursorVisible) {
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
            cursorVisible = true;
        }
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor coordinates smoothly
    function animateCursor() {
        // Dot tracking
        dotX += (mouseX - dotX) * dotEasing;
        dotY += (mouseY - dotY) * dotEasing;
        cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

        // Outline tracking
        outlineX += (mouseX - outlineX) * outlineEasing;
        outlineY += (mouseY - outlineY) * outlineEasing;
        cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;

        requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Hide cursor when leaving viewport
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
        cursorVisible = false;
    });

    // Detect clickable elements to trigger hover states
    const clickables = document.querySelectorAll('a, button, .btn, .tilt-card, .social-link-item, .mobile-nav-toggle');
    clickables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        item.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });


    // --- 2. Interactive Spotlight Mouse-Tracking ---
    const glassCards = document.querySelectorAll('.glass-card');
    
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    // --- 3. 3D Tilt Effect on Cards ---
    const tiltCards = document.querySelectorAll('.tilt-card');
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;

    if (!isMobile) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const cardWidth = rect.width;
                const cardHeight = rect.height;
                
                // Mouse position relative to center of the card
                const mouseX = e.clientX - rect.left - (cardWidth / 2);
                const mouseY = e.clientY - rect.top - (cardHeight / 2);
                
                // Map values to tilt rotation angles (max tilt degrees: X = 8, Y = 8)
                const rotateX = -((mouseY / (cardHeight / 2)) * 8).toFixed(2);
                const rotateY = ((mouseX / (cardWidth / 2)) * 8).toFixed(2);
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }


    // --- 4. Typing Animation System ---
    const typingText = document.getElementById('typing-text');
    const titles = ["Aspiring Software Engineer", "App Developer", "Computer Science Student"];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeWriter() {
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            // Delete text
            typingText.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Speed up deleting
        } else {
            // Write text
            typingText.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Default typing speed
        }

        // Handle states
        if (!isDeleting && charIndex === currentTitle.length) {
            // Text is fully typed, pause before deleting
            typingSpeed = 2200; // Hold typed string
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Text is fully deleted, move to next title
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 400; // Pause before typing next
        }

        setTimeout(typeWriter, typingSpeed);
    }
    setTimeout(typeWriter, 1000); // Start writer with brief delay


    // --- 5. Mobile Navigation Overlay ---
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('.primary-navigation');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && primaryNav) {
        const toggleMenu = () => {
            const isOpened = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isOpened);
            mobileToggle.classList.toggle('open');
            primaryNav.classList.toggle('open');
            document.body.classList.toggle('nav-lock'); // Prevent scrolling behind overlay
        };

        mobileToggle.addEventListener('click', toggleMenu);

        // Close mobile nav when linking to section
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (primaryNav.classList.contains('open')) {
                    toggleMenu();
                }
            });
        });
    }


    // --- 6. Scroll Spy & Sticky Navbar Logic ---
    const navbar = document.querySelector('.navbar-container');
    const sections = document.querySelectorAll('section');
    
    // Add box shadow and reduce size on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active Section Scroll Spy
    const scrollSpyOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Center active window bias
        threshold: 0
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, scrollSpyOptions);

    sections.forEach(section => scrollSpyObserver.observe(section));


    // --- 7. Scroll Reveal & Skill Progress Trigger ---
    const animatedBars = document.querySelectorAll('.skill-bar-fill');
    
    const revealOptions = {
        root: null,
        threshold: 0.12, // Trigger early when entering viewport
        rootMargin: '0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it's the skills section, animate skill bars inside it
                if (entry.target.id === 'skills') {
                    animatedBars.forEach(bar => {
                        const widthValue = bar.getAttribute('data-progress');
                        bar.style.width = widthValue;
                    });
                }
                
                revealObserver.unobserve(entry.target); // Trigger animation once
            }
        });
    }, revealOptions);

    // Track all sections and revealable items
    const revealItems = document.querySelectorAll('.reveal-on-scroll, section');
    revealItems.forEach(item => revealObserver.observe(item));


    // --- 8. Canvas Particle Background Engine ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleCount = 45; // Subtle particle density

    // Resize Canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
    resizeCanvas();

    // Particle Object
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5; // Very small premium dots
            this.speedX = Math.random() * 0.2 - 0.1; // Slower horizontal drift
            this.speedY = -(Math.random() * 0.3 + 0.15); // Slow upward drift
            this.alpha = Math.random() * 0.18 + 0.05; // Faint, subtle styling
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Simple mouse interaction (slight drift away from cursor)
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                const force = (150 - distance) / 150;
                this.x += (dx / distance) * force * 1.2;
                this.y += (dy / distance) * force * 1.2;
            }

            // Loop screen boundaries
            if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
                this.y = canvas.height + 10;
            }
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        // Adjust particle density based on screen size
        if (window.innerWidth < 768) {
            particleCount = 20;
        } else {
            particleCount = 45;
        }
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();


    // --- 9. Copyright Year Auto-Updater ---
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- 10. Preloader System ---
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
        }
    });
});
