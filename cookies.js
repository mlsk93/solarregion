/* =====================================================
   GreenHorizon Energy – Cookie Consent Banner
   DSGVO-konform · Keine externen Abhängigkeiten
   Einbinden: <script src="cookies.js"></script>
   ===================================================== */
(function() {
  'use strict';

  const COOKIE_NAME = 'gh_consent';
  const COOKIE_DAYS = 365;

  // CSS
  const css = `
    #gh-cookie-overlay {
      position: fixed;
      inset: 0;
      background: rgba(10,16,13,0.45);
      z-index: 99998;
      backdrop-filter: blur(3px);
      animation: ghFadeIn .3s ease;
    }
    @keyframes ghFadeIn { from{opacity:0} to{opacity:1} }

    #gh-cookie-banner {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 99999;
      background: #fff;
      border-top: 3px solid #FF5200;
      padding: 28px 5vw 24px;
      font-family: 'DM Sans', 'Instrument Sans', sans-serif;
      box-shadow: 0 -8px 40px rgba(0,0,0,0.12);
      animation: ghSlideUp .4s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes ghSlideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }

    #gh-cookie-inner {
      max-width: 1160px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 32px;
      align-items: center;
    }

    #gh-cookie-logo {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
      font-size: 1rem;
      color: #0A100D;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    #gh-cookie-logo span { color: #FF5200; }

    #gh-cookie-text {
      font-size: 0.85rem;
      color: #6B7A6B;
      line-height: 1.6;
      max-width: 680px;
    }
    #gh-cookie-text strong { color: #1A1A1A; }
    #gh-cookie-text a {
      color: #FF5200;
      text-decoration: underline;
      text-underline-offset: 2px;
    }

    #gh-cookie-details {
      background: #F4F7F4;
      border-radius: 10px;
      padding: 14px 16px;
      margin-top: 14px;
      font-size: 0.78rem;
      color: #6B7A6B;
      display: none;
      line-height: 1.65;
    }
    #gh-cookie-details.open { display: block; }
    #gh-cookie-details table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }
    #gh-cookie-details td {
      padding: 5px 10px;
      border-bottom: 1px solid #E2E8E2;
      vertical-align: top;
    }
    #gh-cookie-details td:first-child {
      font-weight: 700;
      color: #1A1A1A;
      width: 140px;
    }
    #gh-cookie-details tr:last-child td { border-bottom: none; }

    #gh-cookie-toggle {
      background: none;
      border: none;
      color: #FF5200;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      margin-top: 8px;
      display: block;
      font-family: inherit;
      text-decoration: underline;
      text-underline-offset: 2px;
    }

    #gh-cookie-btns {
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 200px;
    }

    .gh-btn-accept {
      padding: 14px 28px;
      background: #FF5200;
      color: #fff;
      border: none;
      border-radius: 50px;
      font-family: 'DM Sans', 'Instrument Sans', sans-serif;
      font-size: 0.92rem;
      font-weight: 700;
      cursor: pointer;
      transition: all .2s;
      box-shadow: 0 4px 16px rgba(255,82,0,0.3);
      white-space: nowrap;
      text-align: center;
    }
    .gh-btn-accept:hover {
      background: #FF7A35;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(255,82,0,0.4);
    }

    .gh-btn-necessary {
      padding: 12px 28px;
      background: transparent;
      color: #6B7A6B;
      border: 1.5px solid #E2E8E2;
      border-radius: 50px;
      font-family: 'DM Sans', 'Instrument Sans', sans-serif;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: all .2s;
      white-space: nowrap;
      text-align: center;
    }
    .gh-btn-necessary:hover {
      border-color: #6B7A6B;
      color: #1A1A1A;
    }

    /* Toggle switches */
    .gh-switch-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 0;
    }
    .gh-switch-label { font-weight: 600; color: #1A1A1A; font-size: 0.82rem; }
    .gh-switch {
      position: relative;
      width: 40px; height: 22px;
      flex-shrink: 0;
    }
    .gh-switch input { opacity: 0; width: 0; height: 0; }
    .gh-slider {
      position: absolute; inset: 0;
      background: #E2E8E2;
      border-radius: 22px;
      transition: .2s;
      cursor: pointer;
    }
    .gh-slider::before {
      content: '';
      position: absolute;
      width: 16px; height: 16px;
      left: 3px; top: 3px;
      background: #fff;
      border-radius: 50%;
      transition: .2s;
    }
    input:checked + .gh-slider { background: #FF5200; }
    input:checked + .gh-slider::before { transform: translateX(18px); }
    input:disabled + .gh-slider { opacity: 0.6; cursor: not-allowed; }

    @media(max-width:768px) {
      #gh-cookie-inner {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      #gh-cookie-btns {
        flex-direction: row;
        min-width: auto;
      }
      .gh-btn-accept, .gh-btn-necessary {
        flex: 1;
        padding: 12px 16px;
        font-size: 0.85rem;
      }
    }
    @media(max-width:480px) {
      #gh-cookie-btns { flex-direction: column; }
      #gh-cookie-banner { padding: 20px 5vw 20px; }
    }
  `;

  // Helper functions
  function setCookie(name, value, days) {
    var expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + encodeURIComponent(value) +
      ';expires=' + expires.toUTCString() +
      ';path=/;SameSite=Strict';
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function removeBanner() {
    var overlay = document.getElementById('gh-cookie-overlay');
    var banner  = document.getElementById('gh-cookie-banner');
    if (overlay) overlay.remove();
    if (banner) {
      banner.style.animation = 'none';
      banner.style.transform = 'translateY(100%)';
      banner.style.transition = 'transform .3s ease';
      setTimeout(function() { banner.remove(); }, 300);
    }
  }

  function acceptAll() {
    setCookie(COOKIE_NAME, JSON.stringify({ necessary: true, analytics: false, marketing: false, ts: Date.now() }), COOKIE_DAYS);
    removeBanner();
    // Dispatch event for future analytics integration
    window.dispatchEvent(new CustomEvent('gh:consent', { detail: { analytics: false } }));
  }

  function acceptNecessary() {
    setCookie(COOKIE_NAME, JSON.stringify({ necessary: true, analytics: false, marketing: false, ts: Date.now() }), COOKIE_DAYS);
    removeBanner();
    window.dispatchEvent(new CustomEvent('gh:consent', { detail: { analytics: false } }));
  }

  function toggleDetails() {
    var d = document.getElementById('gh-cookie-details');
    var btn = document.getElementById('gh-toggle-btn');
    if (d.classList.contains('open')) {
      d.classList.remove('open');
      btn.textContent = '▸ Details anzeigen';
    } else {
      d.classList.add('open');
      btn.textContent = '▴ Details ausblenden';
    }
  }

  function renderBanner() {
    // Inject CSS
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Overlay (blocks interaction until decision)
    var overlay = document.createElement('div');
    overlay.id = 'gh-cookie-overlay';
    document.body.appendChild(overlay);

    // Banner HTML
    var banner = document.createElement('div');
    banner.id = 'gh-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie-Einstellungen');
    banner.innerHTML = `
      <div id="gh-cookie-inner">
        <div id="gh-cookie-content">
          <div id="gh-cookie-logo">&#9728; Green<span>Horizon</span> Energy</div>
          <div id="gh-cookie-text">
            <strong>Diese Website verwendet Cookies.</strong>
            Wir nutzen ausschließlich technisch notwendige Cookies – keine Tracking-Cookies, kein Google Analytics.
            Deine Daten werden nur dann verarbeitet, wenn du freiwillig das Formular ausfüllst.
            Weitere Infos in unserer <a href="datenschutz.html">Datenschutzerklärung</a>.
            <button id="gh-toggle-btn" class="gh-cookie-toggle" onclick="window._ghToggleDetails()">&#9658; Details anzeigen</button>

            <div id="gh-cookie-details">
              <div class="gh-switch-row" style="margin-bottom:6px">
                <span class="gh-switch-label">&#9989; Technisch notwendige Cookies</span>
                <label class="gh-switch">
                  <input type="checkbox" checked disabled>
                  <span class="gh-slider"></span>
                </label>
              </div>
              <div class="gh-switch-row">
                <span class="gh-switch-label">&#128202; Analyse &amp; Marketing</span>
                <label class="gh-switch">
                  <input type="checkbox" id="gh-analytics-toggle">
                  <span class="gh-slider"></span>
                </label>
              </div>
              <table>
                <tr>
                  <td>gh_consent</td>
                  <td>Speichert deine Cookie-Einstellung · 365 Tage · Eigener Server</td>
                </tr>
                <tr>
                  <td>Session</td>
                  <td>Technisch notwendig für Formular-Funktionen · Sitzungsende</td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <div id="gh-cookie-btns">
          <button class="gh-btn-accept" onclick="window._ghAcceptAll()">
            &#9728; Alle akzeptieren
          </button>
          <button class="gh-btn-necessary" onclick="window._ghAcceptNecessary()">
            Nur notwendige
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
  }

  // Expose functions to window scope (needed for onclick in innerHTML)
  window._ghAcceptAll       = acceptAll;
  window._ghAcceptNecessary = acceptNecessary;
  window._ghToggleDetails   = toggleDetails;

  // ── Main: show banner if no consent yet ──────────────────
  function init() {
    if (getCookie(COOKIE_NAME)) return; // Already consented
    renderBanner();
  }

  // Add "Cookie-Einstellungen zurücksetzen" link helper
  // Usage: <a href="#" onclick="GHConsent.reset()">Cookie-Einstellungen</a>
  window.GHConsent = {
    reset: function() {
      setCookie(COOKIE_NAME, '', -1);
      location.reload();
    },
    get: function() {
      var c = getCookie(COOKIE_NAME);
      return c ? JSON.parse(c) : null;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
