/* =============================================
   NexBridge — Language Selector
   Toggle dropdown + detect/route language.
   ============================================= */
(function() {
    // --- Toggle ---
    var langBtn = document.getElementById('langToggleBtn');
    var langSel = document.getElementById('langSelector');
    if (langBtn && langSel) {
        langBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var isOpen = langSel.classList.contains('open');
            if (isOpen) {
                langSel.classList.remove('open');
            } else {
                langSel.classList.add('open');
                setTimeout(function() {
                    document.addEventListener('click', function handler(ev) {
                        if (!langSel.contains(ev.target)) {
                            langSel.classList.remove('open');
                        }
                        document.removeEventListener('click', handler);
                    });
                }, 0);
            }
        });
    }
    // --- Detect current language and update selector ---
    var p = window.location.pathname;
    var lang = 'en';
    if (p.indexOf('/es') === 0) lang = 'es';
    else if (p.indexOf('/it') === 0) lang = 'it';
    else if (p.indexOf('/pt') === 0) lang = 'pt';
    else if (p.indexOf('/fr') === 0) lang = 'fr';
    var el = document.getElementById('currentLang');
    if (el) el.textContent = lang.toUpperCase();
    var opts = document.querySelectorAll('.lang-option');
    var page = p.replace('/' + lang, '').replace(/^\//, '').replace(/\/$/, '').replace('.html', '');
    if (!page) page = 'index';
    opts.forEach(function(o) {
        o.classList.remove('active');
        if (o.getAttribute('data-lang') === lang) o.classList.add('active');
        var l = o.getAttribute('data-lang');
        if (l === 'en') o.setAttribute('href', '/' + page);
        else o.setAttribute('href', '/' + l + '/' + page);
    });
})();
