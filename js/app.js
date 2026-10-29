// Vanilla JS — replaces jQuery 2.1.1 (was 100kb+, used for ~10 lines of work)

// Back-to-top button
(function () {
    var btn = document.getElementById('buttonScrollToTop');
    if (btn) {
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        }, { passive: true });

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
})();

// Mobile menu toggle (called inline from hamburger-icon onclick)
function toggleMobileMenu(menu) {
    menu.classList.toggle('open');
    var nav = document.querySelector('.navigation-bar');
    if (nav) nav.classList.toggle('active');
}

// Auto-update footer year
(function () {
    var year = new Date().getFullYear();
    document.querySelectorAll('.footer-wrapper').forEach(function (el) {
        el.innerHTML = el.innerHTML.replace(/(©|&copy;)\s*\d{4}/, '© ' + year);
    });
})();
