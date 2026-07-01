// Navbar toggle, smooth scroll, active link, reveal motion, dark mode, and localization

document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('js-ready');

    // Load Supabase initialization & navbar helper scripts
    const basePath = window.location.pathname.includes('/courses/') ? '../' : '';
    const isAdminPage = window.location.pathname.endsWith('admin.html');
    if (!isAdminPage) {
        const initScript = document.createElement('script');
        initScript.src = `${basePath}assets/js/supabase-init.js`;
        initScript.onload = () => {
            const navScript = document.createElement('script');
            navScript.src = `${basePath}assets/js/auth-nav.js`;
            document.body.appendChild(navScript);
        };
        document.body.appendChild(initScript);
    }

    // Hide Loader
    const loader = document.getElementById('loader');
    const hideLoader = () => {
        if (loader) loader.classList.add('fade-out');
    };
    // Since we are running inside the DOMContentLoaded handler, the DOM is ready.
    // Hide the loader immediately to prevent getting stuck on slow external assets.
    hideLoader();

    let hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navContainer = document.querySelector('.nav-container');

    if (navContainer && navLinks && !hamburger) {
        hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.type = 'button';
        hamburger.setAttribute('aria-label', 'Toggle navigation');
        hamburger.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-menu"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        navContainer.appendChild(hamburger);
    }
    if (hamburger && !hamburger.innerHTML.trim()) {
        hamburger.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-menu"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    }

    // 1. Inject Theme & Language Toggles into Navbar
    let navRight = document.querySelector('.nav-right');
    if (navContainer && !navRight) {
        navRight = document.createElement('div');
        navRight.className = 'nav-right';
        navContainer.insertBefore(navRight, hamburger || null);
    }

    if (navLinks && navRight) {
        const desktopCta = navRight.querySelector('.nav-cta');
        if (desktopCta && !navLinks.querySelector('.mobile-nav-cta')) {
            const mobileCta = desktopCta.cloneNode(true);
            mobileCta.classList.remove('nav-cta');
            mobileCta.classList.add('mobile-nav-cta');
            navLinks.appendChild(mobileCta);
        }
    }

    if (navRight && !document.querySelector('.nav-controls')) {
        const controls = document.createElement('div');
        controls.className = 'nav-controls';
        controls.innerHTML = `
            <button class="lang-toggle" id="langToggle" type="button" title="Switch Language" aria-label="Switch language">BN</button>
            <button class="theme-toggle" id="themeToggle" type="button" title="Toggle Dark Mode" aria-label="Toggle dark mode"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg></button>
        `;
        navRight.appendChild(controls);

        // 2. Theme Toggle Logic
        const themeToggle = document.getElementById('themeToggle');
        const moonIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        const sunIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
        const currentTheme = localStorage.getItem('onnoy_theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.innerHTML = currentTheme === 'dark' ? sunIcon : moonIcon;

        themeToggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('onnoy_theme', theme);
            themeToggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
        });

        // 3. Language Toggle Logic
        const langToggle = document.getElementById('langToggle');
        let currentLang = localStorage.getItem('onnoy_lang') || 'en';
        const dictionary = typeof translations !== 'undefined' ? translations : {};

        const updateLanguage = (lang) => {
            document.documentElement.setAttribute('lang', lang);
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (dictionary[key] && dictionary[key][lang] !== undefined) {
                    el.textContent = dictionary[key][lang];
                }
            });
            langToggle.textContent = lang === 'en' ? 'BN' : 'EN';
        };

        updateLanguage(currentLang);

        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'bn' : 'en';
            localStorage.setItem('onnoy_lang', currentLang);
            updateLanguage(currentLang);
        });
    }

    // 4. Navbar Logic
    if (hamburger && navLinks) {
        if (!navLinks.id) navLinks.id = 'primary-navigation';
        hamburger.setAttribute('aria-controls', navLinks.id);
        hamburger.setAttribute('aria-expanded', 'false');

        const setNavOpen = (open) => {
            navLinks.classList.toggle('open', open);
            hamburger.setAttribute('aria-expanded', String(open));
            hamburger.innerHTML = open ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        };

        hamburger.addEventListener('click', (event) => {
            event.stopPropagation();
            setNavOpen(!navLinks.classList.contains('open'));
        });

        navLinks.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (!link || (link.classList.contains('dropdown-toggle') && window.innerWidth <= 768)) return;
            if (window.innerWidth <= 768) setNavOpen(false);
        });

        document.addEventListener('click', (event) => {
            if (window.innerWidth > 768) return;
            if (!navContainer || navContainer.contains(event.target)) return;
            setNavOpen(false);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') setNavOpen(false);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                setNavOpen(false);
                document.querySelectorAll('.dropdown-menu.open').forEach(menu => menu.classList.remove('open'));
                document.querySelectorAll('.dropdown-toggle[aria-expanded="true"]').forEach(toggle => {
                    toggle.setAttribute('aria-expanded', 'false');
                });
            }
        });
    }

    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const menu = this.closest('.dropdown').querySelector('.dropdown-menu');
                document.querySelectorAll('.dropdown-menu.open').forEach(m => {
                    if (m !== menu) {
                        m.classList.remove('open');
                        const otherToggle = m.closest('.dropdown')?.querySelector('.dropdown-toggle');
                        if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
                    }
                });
                const isOpen = menu.classList.toggle('open');
                this.setAttribute('aria-expanded', String(isOpen));
            }
        });
    });

    // 5. Active Link Highlight
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.split('/').pop() === currentPath) link.classList.add('active');
    });

    // 6. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                // Move focus to the target for keyboard users (e.g. skip link → main).
                target.focus({ preventScroll: true });
            }
        });
    });

    // 7. Subtle reveal animations
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animatedElements = document.querySelectorAll(
        '.fade-in, .card, .impact-card, .resource-card, .scenario-card, .story-card, .feature-card, .question-card, .about-teaser, .form-section, .step, .law-card, .law-concern-card, .law-provision, .module-shell, .module-content-card, .module-check, .module-form-card, .module-level-gate, .mission-card'
    );

    animatedElements.forEach((el, index) => {
        if (!el.classList.contains('fade-in')) el.classList.add('fade-in');
        el.style.setProperty('--reveal-delay', `${Math.min((index % 6) * 45, 225)}ms`);
    });

    if (motionQuery.matches || !('IntersectionObserver' in window)) {
        animatedElements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animatedElements.forEach(el => observer.observe(el));

    // Reveal safety net: content must never stay stuck hidden, even if the
    // IntersectionObserver fires late or misbehaves. On scroll/resize/load we
    // force-reveal any element within (or above) the viewport. Below-fold
    // elements still wait until scrolled into view, preserving reveal-on-scroll.
    let scheduled = false;
    const revealInView = () => {
        scheduled = false;
        let remaining = 0;
        animatedElements.forEach(el => {
            if (el.classList.contains('visible')) return;
            if (el.getBoundingClientRect().top < window.innerHeight - 40) {
                el.classList.add('visible');
                observer.unobserve(el);
            } else {
                remaining++;
            }
        });
        if (remaining === 0) {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        }
    };
    const onScroll = () => {
        if (scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(revealInView);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', () => window.setTimeout(revealInView, 1200), { once: true });
});
