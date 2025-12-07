
        // Custom Cursor
        const cursor = document.getElementById('cursor');
        const cursorDot = document.getElementById('cursorDot');

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            
            cursorDot.style.left = e.clientX - 3 + 'px';
            cursorDot.style.top = e.clientY - 3 + 'px';
        });

        // Cursor hover effect
        const hoverElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-card, .bento-item, .indicator');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        // Horizontal Scroll
        const wrapper = document.getElementById('horizontalWrapper');
        const sections = document.querySelectorAll('.section');
        const indicators = document.querySelectorAll('.indicator');
        const progressBar = document.getElementById('progressBar');
        
        let currentScroll = 0;
        let targetScroll = 0;
        let totalWidth = 0;
        let isAnimating = false;

        // Calculate total width
        function calculateWidth() {
            totalWidth = 0;
            sections.forEach(section => {
                totalWidth += section.offsetWidth;
            });
            totalWidth -= window.innerWidth;
        }
        calculateWidth();
        window.addEventListener('resize', calculateWidth);

        // Scroll handler
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
            targetScroll += e.deltaY;
            targetScroll = Math.max(0, Math.min(targetScroll, totalWidth));
        }, { passive: false });

        // Touch support
        let touchStart = 0;
        document.addEventListener('touchstart', (e) => {
            touchStart = e.touches[0].clientX;
        });

        document.addEventListener('touchmove', (e) => {
            const touchDelta = touchStart - e.touches[0].clientX;
            targetScroll += touchDelta * 2;
            targetScroll = Math.max(0, Math.min(targetScroll, totalWidth));
            touchStart = e.touches[0].clientX;
        });

        // Smooth scroll animation
        function smoothScroll() {
            currentScroll += (targetScroll - currentScroll) * 0.08;
            wrapper.style.transform = `translateX(-${currentScroll}px)`;
            
            // Update progress bar
            const progress = (currentScroll / totalWidth) * 100;
            progressBar.style.width = progress + '%';
            
            // Update indicators
            let currentSection = 0;
            let accWidth = 0;
            sections.forEach((section, index) => {
                if (currentScroll >= accWidth - section.offsetWidth / 2) {
                    currentSection = index;
                }
                accWidth += section.offsetWidth;
            });
            
            indicators.forEach((ind, index) => {
                ind.classList.toggle('active', index === currentSection);
            });

            // Animate skill bars when in view
            const skillsSection = document.getElementById('skills');
            const skillsRect = skillsSection.getBoundingClientRect();
            if (skillsRect.left < window.innerWidth && skillsRect.right > 0) {
                document.querySelectorAll('.skill-progress').forEach(bar => {
                    bar.style.width = bar.dataset.progress + '%';
                });
            }

            requestAnimationFrame(smoothScroll);
        }
        smoothScroll();

        // Indicator click
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                let scrollTo = 0;
                for (let i = 0; i < index; i++) {
                    scrollTo += sections[i].offsetWidth;
                }
                targetScroll = scrollTo;
            });
        });

        // Nav links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    let scrollTo = 0;
                    sections.forEach((section, index) => {
                        if (section.id === targetId) return;
                        if ([...sections].indexOf(targetSection) > index) {
                            scrollTo += section.offsetWidth;
                        }
                    });
                    targetScroll = scrollTo;
                }
            });
        });

        // Parallax effects
        function parallax() {
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const offset = (window.innerWidth / 2 - centerX) / 20;
                
                const content = section.querySelector('.hero-content, .about-content, .skills-content, .projects-content, .experience-content, .contact-content');
                if (content) {
                    content.style.transform = `translateX(${offset}px)`;
                }
            });
            requestAnimationFrame(parallax);
        }
        parallax();

        // Reveal animations on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.project-card, .skill-card, .bento-item, .timeline-item, .stat-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Check visibility and animate
        function checkVisibility() {
            document.querySelectorAll('.project-card, .skill-card, .bento-item, .timeline-item, .stat-item').forEach((el, index) => {
                const rect = el.getBoundingClientRect();
                if (rect.left < window.innerWidth && rect.right > 0) {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
            requestAnimationFrame(checkVisibility);
        }
        checkVisibility();

        // Magnetic buttons
        document.querySelectorAll('.btn, .social-link').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });

        // Typing effect for hero title
        const heroLines = document.querySelectorAll('.hero-title .line span');
        heroLines.forEach((line, index) => {
            line.style.animationDelay = `${index * 0.2}s`;
        });

        console.log('🚀 Portfolio loaded! Scroll or swipe to explore.');