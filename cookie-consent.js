/* ─────────────────────────────────────────────────────────────────
   Cookie Consent — GDPR compliant
   AdSense only loads after explicit user acceptance
───────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  const KEY    = 'ndp_consent';
  const CLIENT = 'ca-pub-2039083276334321';

  /* ── Helpers ── */
  function getConsent()      { try { return localStorage.getItem(KEY); } catch(e) { return null; } }
  function saveConsent(val)  { try { localStorage.setItem(KEY, val); }  catch(e) {} }

  function loadAdSense() {
    if (document.querySelector('script[src*="adsbygoogle"]')) return;
    const s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + CLIENT;
    document.head.appendChild(s);
  }

  function hideAdSlots() {
    document.querySelectorAll('.ad-slot, .ad-slot-homepage, .ad-slot-faq').forEach(function(el) {
      el.style.display = 'none';
    });
  }

  /* ── Banner ── */
  var BANNER_HTML = '<div id="cookie-banner" role="dialog" aria-label="Cookie consent" aria-live="polite">' +
    '<div class="cb-inner">' +
      '<div class="cb-text">' +
        '<strong>🍪 We use cookies</strong>' +
        '<p>We use Google AdSense to show ads that help keep this tool free. AdSense sets cookies to personalise ads. You can accept or decline — the quiz works either way.</p>' +
        '<a href="privacy.html" class="cb-link">Privacy Policy</a>' +
      '</div>' +
      '<div class="cb-actions">' +
        '<button id="cb-decline" class="cb-btn cb-btn-ghost">Decline non-essential</button>' +
        '<button id="cb-accept"  class="cb-btn cb-btn-primary">Accept all cookies</button>' +
      '</div>' +
    '</div>' +
  '</div>';

  var BANNER_CSS = '<style>' +
    '#cookie-banner{' +
      'position:fixed;bottom:0;left:0;right:0;z-index:9999;' +
      'background:#1F2937;color:#F9FAFB;' +
      'padding:20px 24px;' +
      'box-shadow:0 -4px 24px rgba(0,0,0,0.25);' +
      'transform:translateY(100%);' +
      'transition:transform 0.35s cubic-bezier(0.4,0,0.2,1);' +
    '}' +
    '.cb-inner{max-width:900px;margin:0 auto;display:flex;align-items:center;gap:24px;flex-wrap:wrap;}' +
    '.cb-text{flex:1;min-width:260px;}' +
    '.cb-text strong{font-size:0.95rem;display:block;margin-bottom:4px;}' +
    '.cb-text p{font-size:0.82rem;color:rgba(255,255,255,0.7);line-height:1.55;margin:0;}' +
    '.cb-link{font-size:0.78rem;color:#93C5FD;text-underline-offset:2px;}' +
    '.cb-actions{display:flex;gap:10px;flex-shrink:0;flex-wrap:wrap;}' +
    '.cb-btn{padding:10px 20px;border-radius:8px;font-size:0.88rem;font-weight:700;cursor:pointer;border:2px solid transparent;font-family:inherit;white-space:nowrap;}' +
    '.cb-btn-ghost{background:transparent;color:rgba(255,255,255,0.7);border-color:rgba(255,255,255,0.25);}' +
    '.cb-btn-ghost:hover{background:rgba(255,255,255,0.08);}' +
    '.cb-btn-primary{background:#2563EB;color:#fff;border-color:#2563EB;}' +
    '.cb-btn-primary:hover{background:#1D4ED8;}' +
    '@media(max-width:480px){.cb-inner{flex-direction:column;gap:14px;}.cb-actions{width:100%;}.cb-btn{flex:1;}}' +
  '</style>';

  function removeBanner() {
    var b = document.getElementById('cookie-banner');
    if (!b) return;
    b.style.transform = 'translateY(100%)';
    setTimeout(function() { if (b.parentNode) b.parentNode.removeChild(b); }, 380);
  }

  function accept() {
    saveConsent('accepted');
    removeBanner();
    loadAdSense();
  }

  function decline() {
    saveConsent('declined');
    removeBanner();
    hideAdSlots();
  }

  function showBanner() {
    document.head.insertAdjacentHTML('beforeend', BANNER_CSS);
    document.body.insertAdjacentHTML('beforeend', BANNER_HTML);
    // Animate in after a tick
    setTimeout(function() {
      var b = document.getElementById('cookie-banner');
      if (b) b.style.transform = 'translateY(0)';
    }, 80);
    document.getElementById('cb-accept').addEventListener('click', accept);
    document.getElementById('cb-decline').addEventListener('click', decline);
  }

  /* ── Init ── */
  function init() {
    var consent = getConsent();
    if (consent === 'accepted') {
      loadAdSense();
    } else if (consent === 'declined') {
      hideAdSlots();
    } else {
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for any "change preferences" links
  window.cookieConsent = { accept: accept, decline: decline };

}());
