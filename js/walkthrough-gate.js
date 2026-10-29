/* ========================================================================
   Walkthrough Gate
   Friction-signal client-side password gate for walkthrough case studies.
   Lives at /js/walkthrough-gate.js. Referenced from /walkthroughs/*.html.

   ┌─────────────────────────────────────────────────────────────────────┐
   │  CHANGE THE PASSWORD ON LINE 18 BELOW.                              │
   │                                                                     │
   │  Share with vetted walkthrough requesters in your reply email.      │
   │  Authentication is per browser session — the password prompt        │
   │  reappears when the user closes the tab and returns later.          │
   │                                                                     │
   │  ⚠ This is NOT real security. View-source reveals the password.     │
   │  It's a deliberate friction signal: "this is shared with people     │
   │  I've spoken to." Use signed PDFs for true confidentiality.         │
   └─────────────────────────────────────────────────────────────────────┘
*/
(function () {
    'use strict';

    var PASSWORD = 'wb-vp-2026';

    var STORAGE_KEY = 'tw_walkthrough_auth_v1';

    function isAuthed() {
        try {
            return sessionStorage.getItem(STORAGE_KEY) === PASSWORD;
        } catch (e) {
            return false;
        }
    }

    function markAuthed() {
        try {
            sessionStorage.setItem(STORAGE_KEY, PASSWORD);
        } catch (e) { /* ignore */ }
    }

    // Inject the locking style synchronously so body content never paints
    // before the gate is in place.
    var lockStyle = document.createElement('style');
    lockStyle.textContent =
        'html.walkthrough-locked body > *:not(.walkthrough-gate-overlay){display:none !important;}' +
        'html.walkthrough-locked body{background:#F9F9FA;}';
    document.head.appendChild(lockStyle);

    if (!isAuthed()) {
        document.documentElement.classList.add('walkthrough-locked');
    }

    function injectGateStyles() {
        var css = [
            '.walkthrough-gate-overlay{',
            '  position:fixed;inset:0;background:#F9F9FA;z-index:99999;',
            '  display:flex;align-items:center;justify-content:center;padding:24px;',
            '  font-family:"Inter",system-ui,-apple-system,sans-serif;',
            '}',
            '.walkthrough-gate-card{',
            '  background:#FFFFFF;border-radius:24px;',
            '  box-shadow:0px 2px 16px -8px rgba(27,32,39,0.16),inset 0px 0px 0px 0.5px rgba(27,32,39,0.1);',
            '  padding:48px 32px;max-width:480px;width:100%;text-align:center;',
            '}',
            '@media (min-width:640px){.walkthrough-gate-card{padding:56px 48px;}}',
            '.walkthrough-gate-icon{',
            '  width:56px;height:56px;margin:0 auto 24px;',
            '  background-color:rgba(255,153,0,0.12);border-radius:100px;',
            '  background-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23FF9900\' stroke-width=\'2.2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z\'/><path d=\'M7 11V7a5 5 0 0 1 10 0v4\'/></svg>");',
            '  background-repeat:no-repeat;background-position:center;background-size:24px 24px;',
            '}',
            '.walkthrough-gate-label{',
            '  font-size:12px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;',
            '  color:#FF9900;margin:0 0 12px;',
            '}',
            '.walkthrough-gate-card h2{',
            '  font-size:24px;line-height:32px;font-weight:700;color:#111418;',
            '  letter-spacing:-0.015em;margin:0 0 12px;',
            '}',
            '.walkthrough-gate-card p{',
            '  font-size:15px;line-height:24px;color:#5A5F66;margin:0 0 24px;',
            '}',
            '.walkthrough-gate-form{display:flex;flex-direction:column;gap:12px;}',
            '.walkthrough-gate-input{',
            '  width:100%;background:#FFFFFF;border:1px solid #ECECEF;border-radius:8px;',
            '  padding:14px 16px;font-family:"Inter",system-ui,sans-serif;font-size:16px;',
            '  color:#111418;transition:border-color .24s cubic-bezier(0,0,0,1.16);',
            '  box-sizing:border-box;',
            '}',
            '.walkthrough-gate-input:focus{outline:none;border-color:#FF9900;}',
            '.walkthrough-gate-input.error{border-color:#C51A16;}',
            '.walkthrough-gate-btn{',
            '  background:#111418;color:#FFFFFF;border:1px solid #111418;border-radius:100px;',
            '  padding:14px 28px;font-family:"Inter",system-ui,sans-serif;font-size:14px;',
            '  font-weight:700;cursor:pointer;transition:all .24s cubic-bezier(0,0,0,1.16);',
            '}',
            '.walkthrough-gate-btn:hover{background:#FF9900;border-color:#FF9900;}',
            '.walkthrough-gate-error{',
            '  color:#C51A16;font-size:13px;margin-top:4px;display:none;text-align:left;',
            '}',
            '.walkthrough-gate-error.visible{display:block;}',
            '.walkthrough-gate-note{',
            '  font-size:12px;color:#828891;margin:24px 0 0;font-style:italic;',
            '}',
            '.walkthrough-gate-note a{color:#FF9900;text-decoration:none;}',
            '.walkthrough-gate-note a:hover{text-decoration:underline;}'
        ].join('');
        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function injectGate() {
        injectGateStyles();
        var overlay = document.createElement('div');
        overlay.className = 'walkthrough-gate-overlay';
        overlay.innerHTML =
            '<div class="walkthrough-gate-card">' +
            '  <div class="walkthrough-gate-icon"></div>' +
            '  <p class="walkthrough-gate-label">Shared selectively</p>' +
            '  <h2>Walkthrough access</h2>' +
            '  <p>This case study is shared only with people I\'ve spoken with directly. Enter the access password I sent you in our conversation.</p>' +
            '  <form class="walkthrough-gate-form" id="wg-form" autocomplete="on">' +
            '    <input type="password" class="walkthrough-gate-input" id="wg-input" placeholder="Access password" autocomplete="current-password" required>' +
            '    <button type="submit" class="walkthrough-gate-btn">Unlock walkthrough</button>' +
            '    <div class="walkthrough-gate-error" id="wg-error">That password didn\'t match. Please check the email or request a walkthrough.</div>' +
            '  </form>' +
            '  <p class="walkthrough-gate-note">Don\'t have a password yet? <a href="../contact.html">Request a walkthrough &rarr;</a></p>' +
            '</div>';
        document.body.appendChild(overlay);

        var form = overlay.querySelector('#wg-form');
        var input = overlay.querySelector('#wg-input');
        var error = overlay.querySelector('#wg-error');

        // Defer autofocus so the modal is fully painted first
        setTimeout(function () { try { input.focus(); } catch (e) {} }, 50);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (input.value === PASSWORD) {
                markAuthed();
                document.documentElement.classList.remove('walkthrough-locked');
                overlay.remove();
            } else {
                input.classList.add('error');
                error.classList.add('visible');
                input.select();
            }
        });

        input.addEventListener('input', function () {
            input.classList.remove('error');
            error.classList.remove('visible');
        });
    }

    if (!isAuthed()) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', injectGate);
        } else {
            injectGate();
        }
    }
})();
