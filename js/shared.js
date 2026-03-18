/* =============================================
   NexBridge — Shared JavaScript
   Cursor glow, navbar scroll, mobile menu,
   mega dropdown, scroll reveal.
   ============================================= */

// ===== CURSOR GLOW =====
(function() {
    var glow = document.getElementById('cursorGlow');
    if (!glow) return;
    var cursorX = 0, cursorY = 0, glowX = 0, glowY = 0;
    document.addEventListener('mousemove', function(e) {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });
    function animate() {
        glowX += (cursorX - glowX) * 0.08;
        glowY += (cursorY - glowY) * 0.08;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animate);
    }
    animate();
})();

// ===== NAVBAR SCROLL =====
(function() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', function() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
})();

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    var nav = document.getElementById('mobileNav');
    if (nav) nav.classList.toggle('active');
}

// ===== SCROLL REVEAL =====
(function() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry, i) {
            if (entry.isIntersecting) {
                setTimeout(function() {
                    entry.target.classList.add('visible');
                }, i * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function(el) { observer.observe(el); });
})();

// ===== MEGA DROPDOWN =====
(function() {
    var triggers = document.querySelectorAll('.nav-dropdown-trigger');
    var backdrop = document.getElementById('megaBackdrop');
    if (!triggers.length || !backdrop) return;

    var closeTimeout = null;
    var activeDropdown = null;

    function openDropdown(id) {
        clearTimeout(closeTimeout);
        // Close any other open dropdown
        document.querySelectorAll('.mega-dropdown.visible').forEach(function(dd) {
            if (dd.id !== id) dd.classList.remove('visible');
        });
        document.querySelectorAll('.nav-dropdown-trigger.open').forEach(function(t) {
            if (t.dataset.dropdown !== id) t.classList.remove('open');
        });

        var dropdown = document.getElementById(id);
        if (dropdown) {
            dropdown.classList.add('visible');
            backdrop.classList.add('visible');
            activeDropdown = id;
            var trigger = document.querySelector('[data-dropdown="' + id + '"]');
            if (trigger) trigger.classList.add('open');
        }
    }

    function closeAll() {
        closeTimeout = setTimeout(function() {
            document.querySelectorAll('.mega-dropdown.visible').forEach(function(dd) { dd.classList.remove('visible'); });
            document.querySelectorAll('.nav-dropdown-trigger.open').forEach(function(t) { t.classList.remove('open'); });
            backdrop.classList.remove('visible');
            activeDropdown = null;
        }, 150);
    }

    function cancelClose() {
        clearTimeout(closeTimeout);
    }

    // Trigger hover + click
    triggers.forEach(function(trigger) {
        trigger.addEventListener('mouseenter', function(e) {
            e.preventDefault();
            openDropdown(trigger.dataset.dropdown);
        });
        trigger.addEventListener('mouseleave', closeAll);
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            var dd = document.getElementById(trigger.dataset.dropdown);
            if (dd && dd.classList.contains('visible')) {
                closeAll();
                clearTimeout(closeTimeout);
                dd.classList.remove('visible');
                trigger.classList.remove('open');
                backdrop.classList.remove('visible');
                activeDropdown = null;
            } else {
                openDropdown(trigger.dataset.dropdown);
            }
        });
    });

    // Keep open while hovering dropdown panel
    document.querySelectorAll('.mega-dropdown').forEach(function(dd) {
        dd.addEventListener('mouseenter', cancelClose);
        dd.addEventListener('mouseleave', closeAll);
    });

    // Backdrop click
    backdrop.addEventListener('click', function() {
        clearTimeout(closeTimeout);
        document.querySelectorAll('.mega-dropdown.visible').forEach(function(dd) { dd.classList.remove('visible'); });
        document.querySelectorAll('.nav-dropdown-trigger.open').forEach(function(t) { t.classList.remove('open'); });
        backdrop.classList.remove('visible');
        activeDropdown = null;
    });

    // Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && activeDropdown) {
            clearTimeout(closeTimeout);
            document.querySelectorAll('.mega-dropdown.visible').forEach(function(dd) { dd.classList.remove('visible'); });
            document.querySelectorAll('.nav-dropdown-trigger.open').forEach(function(t) { t.classList.remove('open'); });
            backdrop.classList.remove('visible');
            activeDropdown = null;
        }
    });

    // Scroll links inside mega dropdown
    document.querySelectorAll('.mega-dropdown [data-scroll-link]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = link.getAttribute('href');
            var target = document.querySelector(targetId);
            document.querySelectorAll('.mega-dropdown.visible').forEach(function(dd) { dd.classList.remove('visible'); });
            document.querySelectorAll('.nav-dropdown-trigger.open').forEach(function(t) { t.classList.remove('open'); });
            backdrop.classList.remove('visible');
            activeDropdown = null;
            if (target) {
                setTimeout(function() {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        });
    });
})();
