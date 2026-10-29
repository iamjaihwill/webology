/* Cookie consent + conditional Google Analytics 4 loader.
   Defers GA4 until user accepts. Stores choice in localStorage so the banner
   doesn't reappear on subsequent visits. */
(function () {
    var STORAGE_KEY = 'webology-consent-v1';
    var GA_ID = 'G-58DB61ZNWT';

    function loadGA() {
        if (window.gtagLoaded) return;
        window.gtagLoaded = true;
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        gtag('js', new Date());
        gtag('config', GA_ID, { anonymize_ip: true });
    }

    function getConsent() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function setConsent(value) {
        try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
    }

    function hideBanner() {
        var b = document.getElementById('consent-banner');
        if (b && b.parentNode) b.parentNode.removeChild(b);
    }

    function buildBanner() {
        var banner = document.createElement('div');
        banner.id = 'consent-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Privacy and analytics consent');
        banner.innerHTML =
            '<div class="consent-inner">' +
                '<p class="consent-text">This site uses analytics to understand how visitors interact with the work. No personal data, no cross-site tracking, just anonymous traffic patterns. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">How Google handles data</a>.</p>' +
                '<div class="consent-actions">' +
                    '<button type="button" id="consent-decline" class="consent-btn consent-btn-text">Decline</button>' +
                    '<button type="button" id="consent-accept" class="consent-btn consent-btn-primary">Accept</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(banner);

        document.getElementById('consent-accept').addEventListener('click', function () {
            setConsent('accepted');
            hideBanner();
            loadGA();
        });
        document.getElementById('consent-decline').addEventListener('click', function () {
            setConsent('declined');
            hideBanner();
        });
    }

    function showBanner() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', buildBanner);
        } else {
            buildBanner();
        }
    }

    // Init
    var existing = getConsent();
    if (existing === 'accepted') {
        loadGA();
    } else if (existing !== 'declined') {
        showBanner();
    }
    // If declined: do nothing — no GA, no banner.
})();
