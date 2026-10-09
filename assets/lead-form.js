/**
 * SolarQube lead forms -> Google Apps Script (Google Sheet + Gmail)
 * Paste your Apps Script Web app URL (ends with /exec) below.
 */
(function () {
  'use strict';

  var LEAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx-xMAlZCUy090KGFfA74LHx4vWe2mG_97cesrjQysyncgZc2mB9VVEpZ4kvJo7Bn7Spg/exec';

  var SUCCESS = {
    'contact-enquiry-form': function () { window.location.href = 'thank-you.html'; },
    'home-enquiry-form': function () { window.location.href = 'thank-you.html'; },
    'open-access-form': function () {
      alert('Thank you! Our Open Access & PPA specialists will review your HT power profile and contact you within 24 hours.');
    },
    'carport-assessment-form': function (form) {
      var msg = document.getElementById('form-success-msg');
      if (msg) msg.classList.remove('hidden');
    }
  };

  function configured() {
    return /^https:\/\/script\.google\.com\/.+\/exec/.test(LEAD_ENDPOINT);
  }

  function collect(form) {
    var params = new URLSearchParams();
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.type === 'submit' || el.type === 'button') return;
      var val = el.value;
      if (el.tagName === 'SELECT' && el.selectedIndex >= 0) val = el.options[el.selectedIndex].text;
      params.append(el.name, (val || '').trim());
    });
    params.append('source', form.getAttribute('data-lead-form') || 'Website');
    params.append('page', window.location.pathname.replace(/^\//, '') || 'index.html');
    return params;
  }

  function bind(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn ? btn.innerHTML : '';
      var done = SUCCESS[form.id] || function () {};

      // Honeypot: bots fill the hidden field; pretend success and drop it.
      var trap = form.querySelector('input[name="website"]');
      if (trap && trap.value) { done(form); return; }

      if (!configured()) {
        console.warn('SolarQube lead form: LEAD_ENDPOINT is not set in assets/lead-form.js - lead was NOT sent.');
        done(form); form.reset(); return;
      }

      if (btn) { btn.disabled = true; btn.innerHTML = 'Sending...'; }
      fetch(LEAD_ENDPOINT, { method: 'POST', mode: 'no-cors', body: collect(form) })
        .then(function () { form.reset(); done(form); })
        .catch(function () {
          alert('Sorry, we could not send your request. Please call +91 8883663001 or WhatsApp us.');
        })
        .finally(function () { if (btn) { btn.disabled = false; btn.innerHTML = original; } });
    });
  }

  function init() { document.querySelectorAll('form[data-lead-form]').forEach(bind); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
