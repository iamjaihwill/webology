/* ========================================================================
   Contact form handler
   ----------------------------------------------------------------------
   No backend required. On submit, builds a mailto: URL with the form
   values pre-populated and opens the user's default mail client.

   When ready to upgrade to a real form backend (recommended for production):
   1. Sign up at https://formspree.io, https://web3forms.com, or
      https://basin.org and get an endpoint URL
   2. Replace the mailto logic below with a fetch() POST to the endpoint
   3. The success/error message UI is already in place

   For now: works on day one, no signup, no API key.
   ======================================================================== */
(function () {
    'use strict';

    var EMAIL_TO = 'webology@me.com';
    var form = document.getElementById('reused_form');
    if (!form) return;

    var successEl = document.getElementById('success_message');
    var errorEl = document.getElementById('error_message');

    function getValue(id) {
        var el = document.getElementById(id);
        return el ? (el.value || '').trim() : '';
    }

    function buildMailtoBody(firstName, lastName, email, company, message) {
        var parts = [];
        parts.push('From: ' + firstName + ' ' + lastName + ' <' + email + '>');
        if (company) parts.push('Company: ' + company);
        parts.push('');
        parts.push('---');
        parts.push('');
        parts.push(message);
        parts.push('');
        parts.push('---');
        parts.push('Sent from webology.me/contact.html');
        return parts.join('\n');
    }

    function showSuccess(name, email) {
        successEl.innerHTML =
            '<strong>Thanks, ' + (name || 'there') + '.</strong> ' +
            'Your default mail app should be opening with your message pre-filled &mdash; please send it from there and I\'ll respond within 48 hours.<br><br>' +
            'If your mail app didn\'t open, write me directly at <a href="mailto:' + EMAIL_TO + '" style="color:#FF9900;">' + EMAIL_TO + '</a>.';
        successEl.style.display = 'block';
        errorEl.style.display = 'none';
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function showError(msg) {
        errorEl.innerHTML = msg || 'Sorry, something went wrong. Please email me directly at <a href="mailto:' + EMAIL_TO + '" style="color:#FF9900;">' + EMAIL_TO + '</a>.';
        errorEl.style.display = 'block';
        successEl.style.display = 'none';
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var firstName = getValue('name');
        var lastName = getValue('lastName');
        var email = getValue('Email');
        var company = getValue('Company');
        var subject = getValue('Subject');
        var message = getValue('message');

        // Basic validation (HTML5 required attributes also enforce this)
        if (!firstName || !lastName || !email || !subject || !message) {
            showError('Please fill in all required fields.');
            return;
        }

        var mailtoSubject = '[webology.me] ' + subject + ' — from ' + firstName + ' ' + lastName;
        var mailtoBody = buildMailtoBody(firstName, lastName, email, company, message);
        var mailtoUrl = 'mailto:' + EMAIL_TO +
            '?subject=' + encodeURIComponent(mailtoSubject) +
            '&body=' + encodeURIComponent(mailtoBody);

        // Disable submit button
        var btn = form.querySelector('button[type="submit"]');
        var origLabel = '';
        if (btn) {
            origLabel = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Opening mail app…';
        }

        // Try opening the user's mail client
        window.location.href = mailtoUrl;

        // Show success UI after a short delay (mailto navigation doesn't
        // change location, so this runs reliably)
        setTimeout(function () {
            showSuccess(firstName, email);
            if (btn) {
                btn.disabled = false;
                btn.textContent = origLabel || 'Request a Walkthrough';
            }
        }, 400);
    });
})();
