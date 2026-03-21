/* =====================================================
   GreenHorizon – Floating Solar Chatbot
   Mini-Funnel: Besucher → Qualifizierung → Solar-Check
   ===================================================== */
(function() {

  const STEPS = [
    {
      id: 'start',
      bot: '👋 Hallo! Ich bin dein Solar-Assistent von GreenHorizon.\n\nKann ich dir kurz zeigen, wie viel du mit Solar sparen kannst?',
      choices: [
        { label: '✅ Ja, zeig mir meine Ersparnis!', next: 'eigenheim' },
        { label: '❓ Was macht ihr genau?', next: 'erklaerung' },
      ]
    },
    {
      id: 'erklaerung',
      bot: '☀️ Wir verbinden dich kostenlos mit geprüften Solarfachbetrieben aus deiner Region in NRW.\n\nKein Verkäufer – nur echte Angebote. 100% unverbindlich.',
      choices: [
        { label: '👍 Super, weiter!', next: 'eigenheim' },
        { label: '❌ Nein danke', next: 'abschied' },
      ]
    },
    {
      id: 'eigenheim',
      bot: '🏠 Besitzt du eine eigene Immobilie?',
      choices: [
        { label: '✅ Ja, Eigenheim', next: 'strom', score: 30 },
        { label: '❌ Nein, ich bin Mieter', next: 'mieter' },
      ]
    },
    {
      id: 'mieter',
      bot: '😕 Schade – für eine eigene Solaranlage wird ein eigenes Gebäude benötigt.\n\nVielleicht hilft dir unser Ratgeber weiter?',
      choices: [
        { label: '📖 Ratgeber lesen', action: () => window.location.href = 'ratgeber-lohnt-sich-solar.html' },
        { label: '🏠 Zurück zum Start', next: 'start' },
      ]
    },
    {
      id: 'strom',
      bot: '⚡ Wie hoch sind deine monatlichen Stromkosten ungefähr?',
      choices: [
        { label: '💡 unter 100 €', next: 'zeitrahmen', score: 0 },
        { label: '⚡ 100 – 200 €', next: 'zeitrahmen', score: 10 },
        { label: '🔥 200 – 300 €', next: 'zeitrahmen', score: 30 },
        { label: '🚀 über 300 €', next: 'zeitrahmen', score: 30 },
      ]
    },
    {
      id: 'zeitrahmen',
      bot: '📅 Wann möchtest du deine Solaranlage umsetzen?',
      choices: [
        { label: '🔥 Sofort / 1–3 Monate', next: 'cta_hot', score: 40 },
        { label: '📅 3–6 Monate', next: 'cta_warm', score: 20 },
        { label: '🕐 Später / unsicher', next: 'cta_cold', score: 0 },
      ]
    },
    {
      id: 'cta_hot',
      bot: '🚀 Perfekt! Du hast ein sehr hohes Sparpotenzial.\n\nJetzt in 2 Minuten dein kostenloses Angebot sichern – regionale Fachbetriebe melden sich bei dir!',
      choices: [
        { label: '☀️ Jetzt Angebot sichern →', action: () => window.location.href = 'solar-check.html' },
      ]
    },
    {
      id: 'cta_warm',
      bot: '👍 Guter Plan! Damit hast du noch genug Zeit, die besten Angebote zu vergleichen.\n\nStarte jetzt deinen kostenlosen Solar-Check – unverbindlich & kostenlos.',
      choices: [
        { label: '☀️ Kostenlos prüfen →', action: () => window.location.href = 'solar-check.html' },
        { label: '📖 Erst Ratgeber lesen', action: () => window.location.href = 'ratgeber-lohnt-sich-solar.html' },
      ]
    },
    {
      id: 'cta_cold',
      bot: '👌 Kein Problem! Informier dich erstmal in Ruhe.\n\nUnser Ratgeber erklärt alles zu Kosten, Förderung & Amortisation.',
      choices: [
        { label: '📖 Ratgeber lesen', action: () => window.location.href = 'ratgeber-lohnt-sich-solar.html' },
        { label: '☀️ Solar-Check starten', action: () => window.location.href = 'solar-check.html' },
      ]
    },
    {
      id: 'abschied',
      bot: '👋 Kein Problem! Falls du doch Fragen hast – ich bin immer hier.\n\nEinfach auf den Button klicken. 😊',
      choices: [
        { label: '💬 Doch nochmal fragen', next: 'start' },
      ]
    },
  ];

  let score = 0;

  /* ── CSS ── */
  const css = `
    #gh-chat-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      width: 62px; height: 62px; border-radius: 50%;
      background: linear-gradient(135deg, #FF5200, #FF8040);
      box-shadow: 0 6px 28px rgba(255,82,0,0.45);
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.6rem; transition: all .3s;
      animation: gh-bounce 3s ease infinite;
    }
    #gh-chat-btn:hover { transform: scale(1.1); box-shadow: 0 10px 36px rgba(255,82,0,0.55); }
    @keyframes gh-bounce {
      0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)}
    }
    #gh-chat-btn .gh-notif {
      position: absolute; top: -3px; right: -3px;
      width: 18px; height: 18px; border-radius: 50%;
      background: #FFB800; border: 2px solid #fff;
      font-size: 0.65rem; font-weight: 800; color: #000;
      display: flex; align-items: center; justify-content: center;
    }
    #gh-chat-window {
      position: fixed; bottom: 104px; right: 28px; z-index: 9998;
      width: 340px; max-height: 520px;
      background: #fff; border-radius: 20px;
      box-shadow: 0 20px 64px rgba(0,0,0,0.16);
      display: flex; flex-direction: column;
      overflow: hidden; font-family: 'DM Sans', 'Instrument Sans', sans-serif;
      transition: all .3s cubic-bezier(.34,1.56,.64,1);
      transform-origin: bottom right;
    }
    #gh-chat-window.hidden {
      opacity: 0; transform: scale(0.85); pointer-events: none;
    }
    .gh-chat-head {
      background: linear-gradient(135deg, #0D2B1A, #1C4A2E);
      padding: 16px 18px; display: flex; align-items: center; gap: 12px;
      flex-shrink: 0;
    }
    .gh-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: rgba(255,82,0,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.2rem; flex-shrink: 0;
    }
    .gh-head-info { flex: 1; }
    .gh-head-info strong { color: #fff; font-size: .88rem; display: block; }
    .gh-head-info span { color: rgba(255,255,255,0.6); font-size: .72rem; display: flex; align-items: center; gap: 5px; }
    .gh-online-dot { width: 6px; height: 6px; background: #4ADE80; border-radius: 50%; display: inline-block; }
    .gh-close {
      background: none; border: none; color: rgba(255,255,255,0.6);
      font-size: 1.2rem; cursor: pointer; padding: 4px; line-height: 1;
      transition: color .2s;
    }
    .gh-close:hover { color: #fff; }
    .gh-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
      scroll-behavior: smooth;
    }
    .gh-messages::-webkit-scrollbar { width: 4px; }
    .gh-messages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
    .gh-bubble {
      max-width: 85%; padding: 11px 14px;
      border-radius: 16px; font-size: .88rem; line-height: 1.55;
      animation: gh-msg-in .3s ease forwards;
    }
    @keyframes gh-msg-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    .gh-bubble.bot {
      background: #F4F7F4; color: #1A1A1A;
      border-bottom-left-radius: 4px; align-self: flex-start;
      white-space: pre-line;
    }
    .gh-bubble.user {
      background: linear-gradient(135deg, #FF5200, #FF7A35);
      color: #fff; border-bottom-right-radius: 4px;
      align-self: flex-end;
    }
    .gh-typing {
      display: flex; gap: 4px; padding: 12px 16px;
      background: #F4F7F4; border-radius: 16px; border-bottom-left-radius: 4px;
      align-self: flex-start; width: 52px;
    }
    .gh-typing span {
      width: 7px; height: 7px; background: #aaa; border-radius: 50%;
      animation: gh-dot .9s infinite;
    }
    .gh-typing span:nth-child(2){animation-delay:.15s}
    .gh-typing span:nth-child(3){animation-delay:.3s}
    @keyframes gh-dot { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
    .gh-choices {
      padding: 0 14px 14px; display: flex; flex-direction: column; gap: 7px;
      flex-shrink: 0;
    }
    .gh-choice-btn {
      width: 100%; padding: 10px 14px;
      background: #fff; border: 1.5px solid #E2E8E2;
      border-radius: 10px; font-family: inherit; font-size: .84rem;
      font-weight: 600; color: #1A1A1A; cursor: pointer;
      text-align: left; transition: all .18s;
    }
    .gh-choice-btn:hover { border-color: #FF5200; color: #FF5200; background: rgba(255,82,0,0.04); }
    .gh-restart {
      padding: 10px 16px; text-align: center; border-top: 1px solid #F0F0F0;
      flex-shrink: 0;
    }
    .gh-restart button {
      background: none; border: none; font-size: .72rem;
      color: #aaa; cursor: pointer; font-family: inherit;
      transition: color .2s;
    }
    .gh-restart button:hover { color: #FF5200; }
    @media(max-width:400px){
      #gh-chat-window { width: calc(100vw - 32px); right: 16px; }
      #gh-chat-btn { right: 16px; bottom: 16px; }
    }
  `;

  /* ── Inject CSS ── */
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ── HTML ── */
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <button id="gh-chat-btn" onclick="ghToggle()" title="Solar-Berater öffnen">
      ☀
      <div class="gh-notif">1</div>
    </button>

    <div id="gh-chat-window" class="hidden">
      <div class="gh-chat-head">
        <div class="gh-avatar">☀</div>
        <div class="gh-head-info">
          <strong>Solar-Assistent</strong>
          <span><span class="gh-online-dot"></span> GreenHorizon Energy · Online</span>
        </div>
        <button class="gh-close" onclick="ghToggle()">✕</button>
      </div>
      <div class="gh-messages" id="ghMessages"></div>
      <div class="gh-choices" id="ghChoices"></div>
      <div class="gh-restart"><button onclick="ghRestart()">↺ Neu starten</button></div>
    </div>
  `;
  document.body.appendChild(wrap);

  /* ── State ── */
  let open = false;
  let started = false;

  window.ghToggle = function() {
    open = !open;
    const win = document.getElementById('gh-chat-window');
    const btn = document.getElementById('gh-chat-btn');
    if (open) {
      win.classList.remove('hidden');
      btn.innerHTML = '<span style="color:#fff;font-size:1.4rem;font-weight:700">✕</span>';
      // Remove notification dot
      const dot = btn.querySelector('.gh-notif');
      if (dot) dot.remove();
      if (!started) { started = true; setTimeout(() => ghShowStep('start'), 300); }
    } else {
      win.classList.add('hidden');
      btn.innerHTML = '☀';
    }
  };

  window.ghRestart = function() {
    score = 0;
    document.getElementById('ghMessages').innerHTML = '';
    document.getElementById('ghChoices').innerHTML = '';
    ghShowStep('start');
  };

  function ghShowStep(id) {
    const step = STEPS.find(s => s.id === id);
    if (!step) return;

    // Clear choices
    document.getElementById('ghChoices').innerHTML = '';

    // Show typing indicator
    const msgs = document.getElementById('ghMessages');
    const typing = document.createElement('div');
    typing.className = 'gh-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;

    setTimeout(() => {
      typing.remove();
      // Add bot bubble
      const bubble = document.createElement('div');
      bubble.className = 'gh-bubble bot';
      bubble.textContent = step.bot;
      msgs.appendChild(bubble);
      msgs.scrollTop = msgs.scrollHeight;

      // Add choices
      const choicesEl = document.getElementById('ghChoices');
      step.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'gh-choice-btn';
        btn.textContent = choice.label;
        btn.onclick = () => {
          // Add user bubble
          const userBubble = document.createElement('div');
          userBubble.className = 'gh-bubble user';
          userBubble.textContent = choice.label;
          msgs.appendChild(userBubble);
          msgs.scrollTop = msgs.scrollHeight;
          choicesEl.innerHTML = '';

          // Add score
          if (choice.score) score += choice.score;

          // Action or next step
          if (choice.action) {
            setTimeout(choice.action, 300);
          } else if (choice.next) {
            setTimeout(() => ghShowStep(choice.next), 500);
          }
        };
        choicesEl.appendChild(btn);
      });
    }, 900);
  }

  // Auto-open after 8 seconds on first visit
  const shown = sessionStorage.getItem('gh_chat_shown');
  if (!shown) {
    setTimeout(() => {
      sessionStorage.setItem('gh_chat_shown', '1');
      if (!open) ghToggle();
    }, 8000);
  }

})();
