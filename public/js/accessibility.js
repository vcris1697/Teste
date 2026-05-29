/* ============================================================
   js/accessibility.js
   Módulo de Acessibilidade — e-MAG 3.1 / WCAG 2.1 / VLibras
   Sistema de Agendamento UBS — Santa Maria DF
   ============================================================ */

'use strict';

/* ── CONFIGURAÇÃO ── */
const FONT_MIN   = 0.85;
const FONT_MAX   = 1.4;
const FONT_STEP  = 0.1;
const COOKIE_KEY = 'gdf_ubs_cookies';
const AC_KEY     = 'gdf_ubs_modo_escuro';
const FONT_KEY   = 'gdf_ubs_font_scale';
const LANG_KEY   = 'lang';

let fontScaleAtual = 1;

/* ============================================================
   TEXTOS DA BARRA POR IDIOMA
   ============================================================ */
const AC_LABELS = {
  pt: {
    barLabel:       'Acessibilidade',
    darkMode:       'Alternar modo escuro (Alt+C)',
    fontLabel:      'Fonte',
    fontMinus:      'Diminuir tamanho da fonte',
    fontMinusTitle: 'Diminuir fonte (Alt+-)',
    fontReset:      'Restaurar tamanho padrão da fonte',
    fontResetTitle: 'Fonte padrão (Alt+0)',
    fontPlus:       'Aumentar tamanho da fonte',
    fontPlusTitle:  'Aumentar fonte (Alt++)',
    skipBtn:        '↓ Conteúdo',
    skipLabel:      'Ir para o conteúdo principal',
    skipTitle:      'Pular navegação (Alt+1)',
    langLabel:      'Idioma',
    darkOn:         'Modo escuro ativado',
    darkOff:        'Modo claro ativado',
    cookieText:     'Este portal utiliza dados de sessão em conformidade com a <strong>LGPD (Lei nº 13.709/2018)</strong>. Ao continuar, você concorda com o uso de dados essenciais para o funcionamento do serviço.',
    cookieBtn:      'Aceitar Tudo',
    cookieAria:     'Aceitar todos os cookies e fechar',
    cookieBanner:   'Aviso de uso de dados',
    fontAnnounce:   (pct) => `Fonte: ${pct}%`,
    lgpdTitulo:     'Este portal usa cookies',
    lgpdDesc:       'Utilizamos cookies em conformidade com a <strong>LGPD (Lei nº 13.709/2018)</strong> para garantir o funcionamento do serviço e, opcionalmente, para salvar suas preferências de acessibilidade.',
    lgpdSaibaMais:  'Saiba mais sobre a LGPD',
    lgpdEssencial:  'Essenciais',
    lgpdEssencialDesc: 'Necessários para o funcionamento do sistema (sessão, segurança). Não podem ser desativados.',
    lgpdPref:       'Preferências',
    lgpdPrefDesc:   'Salvam suas escolhas de idioma, tamanho de fonte e modo escuro entre visitas.',
    lgpdAnalise:    'Análise',
    lgpdAnaliseDesc:'Permitem medir o uso do portal para melhorar os serviços. Nenhum dado pessoal é compartilhado.',
    lgpdRecusar:    'Recusar Não Essenciais',
    lgpdPersonalizar:'Personalizar',
    lgpdSalvar:     'Salvar Preferências',
    lgpdPersonalizarLabel: 'Categorias de cookies',
  },
  en: {
    barLabel:       'Accessibility',
    darkMode:       'Toggle dark mode (Alt+C)',
    fontLabel:      'Font',
    fontMinus:      'Decrease font size',
    fontMinusTitle: 'Decrease font (Alt+-)',
    fontReset:      'Restore default font size',
    fontResetTitle: 'Default font (Alt+0)',
    fontPlus:       'Increase font size',
    fontPlusTitle:  'Increase font (Alt++)',
    skipBtn:        '↓ Content',
    skipLabel:      'Skip to main content',
    skipTitle:      'Skip navigation (Alt+1)',
    langLabel:      'Language',
    darkOn:         'Dark mode enabled',
    darkOff:        'Light mode enabled',
    cookieText:     'This portal uses session data in compliance with <strong>LGPD (Law No. 13,709/2018)</strong>. By continuing, you agree to the use of essential data for the service to function.',
    cookieBtn:      'Accept All',
    cookieAria:     'Accept all cookies and close',
    cookieBanner:   'Data usage notice',
    fontAnnounce:   (pct) => `Font: ${pct}%`,
    lgpdTitulo:     'This portal uses cookies',
    lgpdDesc:       'We use cookies in compliance with <strong>LGPD (Law No. 13,709/2018)</strong> to ensure the service works properly and, optionally, to save your accessibility preferences.',
    lgpdSaibaMais:  'Learn more about LGPD',
    lgpdEssencial:  'Essential',
    lgpdEssencialDesc: 'Required for the system to function (session, security). Cannot be disabled.',
    lgpdPref:       'Preferences',
    lgpdPrefDesc:   'Save your language, font size and dark mode choices between visits.',
    lgpdAnalise:    'Analytics',
    lgpdAnaliseDesc:'Allow us to measure portal usage to improve services. No personal data is shared.',
    lgpdRecusar:    'Reject Non-Essential',
    lgpdPersonalizar:'Customize',
    lgpdSalvar:     'Save Preferences',
    lgpdPersonalizarLabel: 'Cookie categories',
  },
  es: {
    barLabel:       'Accesibilidad',
    darkMode:       'Alternar modo oscuro (Alt+C)',
    fontLabel:      'Fuente',
    fontMinus:      'Reducir tamaño de fuente',
    fontMinusTitle: 'Reducir fuente (Alt+-)',
    fontReset:      'Restaurar tamaño de fuente predeterminado',
    fontResetTitle: 'Fuente predeterminada (Alt+0)',
    fontPlus:       'Aumentar tamaño de fuente',
    fontPlusTitle:  'Aumentar fuente (Alt++)',
    skipBtn:        '↓ Contenido',
    skipLabel:      'Ir al contenido principal',
    skipTitle:      'Omitir navegación (Alt+1)',
    langLabel:      'Idioma',
    darkOn:         'Modo oscuro activado',
    darkOff:        'Modo claro activado',
    cookieText:     'Este portal utiliza datos de sesión de conformidad con la <strong>LGPD (Ley N.º 13.709/2018)</strong>. Al continuar, acepta el uso de datos esenciales para el funcionamiento del servicio.',
    cookieBtn:      'Aceptar Todo',
    cookieAria:     'Aceptar todas las cookies y cerrar',
    cookieBanner:   'Aviso de uso de datos',
    fontAnnounce:   (pct) => `Fuente: ${pct}%`,
    lgpdTitulo:     'Este portal usa cookies',
    lgpdDesc:       'Utilizamos cookies de conformidad con la <strong>LGPD (Ley N.º 13.709/2018)</strong> para garantizar el funcionamiento del servicio y, opcionalmente, para guardar sus preferencias de accesibilidad.',
    lgpdSaibaMais:  'Más información sobre la LGPD',
    lgpdEssencial:  'Esenciales',
    lgpdEssencialDesc: 'Necesarios para el funcionamiento del sistema (sesión, seguridad). No se pueden desactivar.',
    lgpdPref:       'Preferencias',
    lgpdPrefDesc:   'Guardan sus elecciones de idioma, tamaño de fuente y modo oscuro entre visitas.',
    lgpdAnalise:    'Análisis',
    lgpdAnaliseDesc:'Permiten medir el uso del portal para mejorar los servicios. No se comparten datos personales.',
    lgpdRecusar:    'Rechazar No Esenciales',
    lgpdPersonalizar:'Personalizar',
    lgpdSalvar:     'Guardar Preferencias',
    lgpdPersonalizarLabel: 'Categorías de cookies',
  }
};

function getLang() {
  /* Sempre inicia em PT — só usa o salvo se o usuário tiver trocado explicitamente */
  try {
    return localStorage.getItem(LANG_KEY) || 'pt';
  } catch(e) {
    return 'pt';
  }
}

/* Garante que o localStorage nunca parta de outro valor numa sessão nova */
(function _forcarPtDefault() {
  try {
    if (!localStorage.getItem(LANG_KEY)) {
      localStorage.setItem(LANG_KEY, 'pt');
    }
  } catch(e) {}
}());

function getLabels() {
  return AC_LABELS[getLang()] || AC_LABELS.pt;
}

/* ============================================================
   1. BARRA DE ACESSIBILIDADE
   ============================================================ */
function criarBarraAcessibilidade() {
  const L   = getLabels();
  const bar = document.createElement('div');
  bar.id        = 'acessibilidade-bar';
  bar.className = 'acessibilidade-bar';
  bar.setAttribute('role', 'navigation');
  bar.setAttribute('aria-label', L.barLabel);

  bar.innerHTML = `
    <span class="ac-label" id="ac-bar-label">${L.barLabel}</span>

    <!-- Modo escuro -->
    <button class="ac-btn ac-btn-icon" id="ac-contraste"
            aria-pressed="false"
            aria-label="${L.darkMode}"
            title="${L.darkMode}">
      <svg id="ac-icon-lua" xmlns="http://www.w3.org/2000/svg"
           width="15" height="15" viewBox="0 0 24 24"
           fill="currentColor" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
      </svg>
      <svg id="ac-icon-sol" xmlns="http://www.w3.org/2000/svg"
           width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true" style="display:none;">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1"  x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    </button>

    <div class="ac-separador" aria-hidden="true"></div>

    <!-- Fonte -->
    <span class="ac-label" id="ac-font-label" aria-hidden="true">${L.fontLabel}</span>

    <button class="ac-btn" id="ac-font-minus"
            aria-label="${L.fontMinus}"
            title="${L.fontMinusTitle}">
      A−
    </button>

    <button class="ac-btn ac-btn-normal" id="ac-font-reset"
            aria-label="${L.fontReset}"
            title="${L.fontResetTitle}">
      A
    </button>

    <button class="ac-btn" id="ac-font-plus"
            aria-label="${L.fontPlus}"
            title="${L.fontPlusTitle}">
      A+
    </button>

    <div class="ac-separador" aria-hidden="true"></div>

    <!-- Skip -->
    <button class="ac-btn" id="ac-skip"
            aria-label="${L.skipLabel}"
            title="${L.skipTitle}">
      ${L.skipBtn}
    </button>

    <div class="ac-separador" aria-hidden="true"></div>

    <!-- Idioma -->
    <div class="ac-lang-wrapper" id="ac-lang-wrapper">
      <button class="ac-btn ac-btn-icon ac-lang-btn"
              id="ac-lang-btn"
              aria-haspopup="listbox"
              aria-expanded="false"
              aria-label="${L.langLabel}"
              title="${L.langLabel}">
        <img src="img/translate.png"
             alt="${L.langLabel}"
             width="17" height="17"
             style="display:block;filter:brightness(0) invert(1);">
      </button>
      <ul class="ac-lang-dropdown"
          id="ac-lang-dropdown"
          role="listbox"
          aria-label="${L.langLabel}"
          style="display:none;">
        <li role="option" data-lang="pt" tabindex="0" aria-selected="true">🇧🇷 PT</li>
        <li role="option" data-lang="en" tabindex="0" aria-selected="false">🇺🇸 EN</li>
        <li role="option" data-lang="es" tabindex="0" aria-selected="false">🇪🇸 ES</li>
      </ul>
    </div>
  `;

  const skipLink = document.querySelector('.skip-link');
  if (skipLink && skipLink.nextSibling) {
    document.body.insertBefore(bar, skipLink.nextSibling);
  } else {
    document.body.insertBefore(bar, document.body.firstChild);
  }

  /* ── Eventos ── */
  document.getElementById('ac-contraste')
    .addEventListener('click', toggleModoEscuro);

  document.getElementById('ac-font-minus')
    .addEventListener('click', () => alterarFonte(-1));

  document.getElementById('ac-font-reset')
    .addEventListener('click', () => alterarFonte(0));

  document.getElementById('ac-font-plus')
    .addEventListener('click', () => alterarFonte(1));

  document.getElementById('ac-skip')
    .addEventListener('click', irParaConteudo);

  /* ── Botão de idioma com dropdown ── */
  const langBtn      = document.getElementById('ac-lang-btn');
  const langDropdown = document.getElementById('ac-lang-dropdown');

  function _abrirDropdown() {
    langDropdown.style.display = 'block';
    langBtn.setAttribute('aria-expanded', 'true');
    /* Foca o item do idioma atual */
    const current = langDropdown.querySelector(`[data-lang="${getLang()}"]`);
    if (current) current.focus();
  }

  function _fecharDropdown() {
    langDropdown.style.display = 'none';
    langBtn.setAttribute('aria-expanded', 'false');
  }

  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown.style.display === 'none' ? _abrirDropdown() : _fecharDropdown();
  });

  langDropdown.querySelectorAll('[data-lang]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      _mudarIdioma(item.dataset.lang);
      _fecharDropdown();
      langBtn.focus();
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        _mudarIdioma(item.dataset.lang);
        _fecharDropdown();
        langBtn.focus();
      }
      if (e.key === 'Escape') {
        _fecharDropdown();
        langBtn.focus();
      }
      /* Navegação com setas */
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = item.nextElementSibling;
        if (next) next.focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = item.previousElementSibling;
        if (prev) prev.focus();
      }
    });
  });

  /* Fecha ao clicar fora */
  document.addEventListener('click', () => _fecharDropdown());
}

/* ── Atualiza textos da própria barra ao trocar idioma ── */
function _atualizarTextosBarra(lang) {
  const L = AC_LABELS[lang] || AC_LABELS.pt;

  const bar = document.getElementById('acessibilidade-bar');
  if (!bar) return;

  bar.setAttribute('aria-label', L.barLabel);

  const set = (id, prop, val) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (prop === 'text') el.textContent = val;
    else el.setAttribute(prop, val);
  };

  set('ac-bar-label',  'text',       L.barLabel);
  set('ac-font-label', 'text',       L.fontLabel);
  set('ac-contraste',  'aria-label', L.darkMode);
  set('ac-contraste',  'title',      L.darkMode);
  set('ac-font-minus', 'aria-label', L.fontMinus);
  set('ac-font-minus', 'title',      L.fontMinusTitle);
  set('ac-font-reset', 'aria-label', L.fontReset);
  set('ac-font-reset', 'title',      L.fontResetTitle);
  set('ac-font-plus',  'aria-label', L.fontPlus);
  set('ac-font-plus',  'title',      L.fontPlusTitle);
  set('ac-skip',       'aria-label', L.skipLabel);
  set('ac-skip',       'title',      L.skipTitle);

  /* Botão de idioma */
  const langBtn = document.getElementById('ac-lang-btn');
  if (langBtn) {
    langBtn.setAttribute('aria-label', L.langLabel);
    langBtn.setAttribute('title', L.langLabel);
    const img = langBtn.querySelector('img');
    if (img) img.alt = L.langLabel;
  }

  /* Dropdown: marca o item selecionado */
  const dropdown = document.getElementById('ac-lang-dropdown');
  if (dropdown) {
    dropdown.setAttribute('aria-label', L.langLabel);
    dropdown.querySelectorAll('[data-lang]').forEach(item => {
      item.setAttribute('aria-selected', item.dataset.lang === lang ? 'true' : 'false');
    });
  }

  const skipEl = document.querySelector('.skip-link');
  if (skipEl) skipEl.textContent = L.skipLabel;
}

/* ── Muda idioma: salva, atualiza barra, chama translations.js ── */
function _mudarIdioma(lang) {
  try { localStorage.setItem(LANG_KEY, lang); } catch(e) {}

  _atualizarTextosBarra(lang);

  /* Sincroniza todos os selects de idioma (inclusive os do translations.js) */
  document.querySelectorAll('.language-select').forEach(s => { s.value = lang; });

  /* Delega à função do translations.js se já estiver carregada */
  if (typeof window.changeLanguage === 'function') {
    window.changeLanguage(lang);
  }

  /* Atualiza banner de cookies se ainda visível */
  _atualizarBannerCookies(lang);
}

/* ============================================================
   2. MODO ESCURO
   ============================================================ */
function toggleModoEscuro() {
  const ativo = document.body.classList.toggle('modo-escuro');
  _sincronizarIconeModo(ativo);

  try { localStorage.setItem(AC_KEY, ativo ? '1' : '0'); } catch(e) {}

  const L = getLabels();
  anunciarLeitor(ativo ? L.darkOn : L.darkOff);
}

function _sincronizarIconeModo(ativo) {
  const btn     = document.getElementById('ac-contraste');
  const iconLua = document.getElementById('ac-icon-lua');
  const iconSol = document.getElementById('ac-icon-sol');

  if (!btn) return;

  btn.setAttribute('aria-pressed', ativo ? 'true' : 'false');
  btn.classList.toggle('ativo', ativo);

  if (iconLua) iconLua.style.display = ativo ? 'none' : 'block';
  if (iconSol) iconSol.style.display = ativo ? 'block' : 'none';
}

function restaurarModoEscuro() {
  let salvo = '0';
  try { salvo = localStorage.getItem(AC_KEY) || '0'; } catch(e) {}
  if (salvo === '1') document.body.classList.add('modo-escuro');
}

/* ============================================================
   3. TAMANHO DE FONTE
   ============================================================ */
function alterarFonte(direcao) {
  if (direcao === 0) {
    fontScaleAtual = 1;
  } else if (direcao === 1) {
    fontScaleAtual = Math.min(FONT_MAX, +(fontScaleAtual + FONT_STEP).toFixed(2));
  } else {
    fontScaleAtual = Math.max(FONT_MIN, +(fontScaleAtual - FONT_STEP).toFixed(2));
  }

  _aplicarFonte(fontScaleAtual);

  try { localStorage.setItem(FONT_KEY, String(fontScaleAtual)); } catch(e) {}

  const L   = getLabels();
  const pct = Math.round(fontScaleAtual * 100);
  anunciarLeitor(L.fontAnnounce(pct));

  const btnReset = document.getElementById('ac-font-reset');
  if (btnReset) btnReset.classList.toggle('ativo', fontScaleAtual !== 1);
}

function _aplicarFonte(scale) {
  const app = document.querySelector('.app');
  if (!app) return;

  const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

  if (isFirefox) {
    app.style.transformOrigin = 'top left';
    app.style.transform = scale === 1 ? '' : `scale(${scale})`;
    app.style.width     = scale === 1 ? '' : `${(1 / scale * 100).toFixed(4)}%`;
  } else {
    app.style.zoom      = scale === 1 ? '' : String(scale);
    app.style.transform = '';
    app.style.width     = '';
  }
}

function restaurarFonte() {
  let saved = 1;
  try { saved = parseFloat(localStorage.getItem(FONT_KEY)) || 1; } catch(e) {}
  fontScaleAtual = saved;
  if (saved !== 1) _aplicarFonte(saved);
}

/* ============================================================
   4. SKIP LINK
   ============================================================ */
function criarSkipLinks() {
  const L    = getLabels();
  const skip = document.createElement('a');
  skip.href        = '#main-content';
  skip.className   = 'skip-link';
  skip.textContent = L.skipLabel;
  document.body.insertBefore(skip, document.body.firstChild);
}

function irParaConteudo() {
  const main = document.getElementById('main-content') || document.querySelector('main');
  if (main) {
    main.setAttribute('tabindex', '-1');
    main.focus();
    main.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ============================================================
   5. VLIBRAS
   ============================================================ */
function inicializarVLibras() {
  const div = document.createElement('div');
  div.setAttribute('vw', '');
  div.className = 'enabled';
  div.innerHTML = `
    <div vw-access-button class="active"></div>
    <div vw-plugin-wrapper>
      <div class="vw-plugin-top-wrapper"></div>
    </div>
  `;
  document.body.appendChild(div);

  const script  = document.createElement('script');
  script.src    = 'https://vlibras.gov.br/app/vlibras-plugin.js';
  script.async  = true;
  script.onload = () => {
    if (window.VLibras) new window.VLibras.Widget('https://vlibras.gov.br/app');
  };
  script.onerror = () => {
    console.warn('VLibras indisponível — sem conexão com vlibras.gov.br');
  };
  document.head.appendChild(script);
}

/* ============================================================
   6. ATALHOS DE TECLADO
   ============================================================ */
function configurarAtalhos() {
  document.addEventListener('keydown', (e) => {
    if (!e.altKey) return;

    switch (e.key) {
      case '1': e.preventDefault(); irParaConteudo(); break;

      case '2':
        e.preventDefault();
        const nav = document.querySelector('.nav-item');
        if (nav) nav.focus();
        break;

      case '3':
        e.preventDefault();
        const rodape = document.querySelector('footer, .footer');
        if (rodape) rodape.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'c': case 'C':
        e.preventDefault();
        toggleModoEscuro();
        break;

      case '+': case '=':
        e.preventDefault();
        alterarFonte(1);
        break;

      case '-':
        e.preventDefault();
        alterarFonte(-1);
        break;

      case '0':
        e.preventDefault();
        alterarFonte(0);
        break;
    }
  });
}

/* ============================================================
   7. ARIA LIVE REGION
   ============================================================ */
let liveRegion = null;

function criarLiveRegion() {
  liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.style.cssText =
    'position:absolute;width:1px;height:1px;padding:0;margin:-1px;' +
    'overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
  document.body.appendChild(liveRegion);
}

function anunciarLeitor(texto) {
  if (!liveRegion) return;
  liveRegion.textContent = '';
  requestAnimationFrame(() => { liveRegion.textContent = texto; });
}

/* ============================================================
   8. LGPD — CONSENTIMENTO DE COOKIES (REAL)
   Categorias: essencial (sempre ativo), preferências, análise
   Armazena: document.cookie (180 dias) + localStorage (backup)
   Registro: timestamp + versão da política
   ============================================================ */

const LGPD_COOKIE_NAME    = 'gdf_ubs_lgpd_consent';
const LGPD_POLICY_VERSION = '1.0';   /* incremente para pedir novo consentimento */
const LGPD_MAX_AGE        = 60 * 60 * 24 * 180; /* 180 dias em segundos */

/* ── Lê o consentimento salvo (cookie HTTP ou localStorage) ── */
function _lerConsentimento() {
  /* Tenta cookie HTTP primeiro */
  try {
    const match = document.cookie
      .split(';')
      .map(c => c.trim())
      .find(c => c.startsWith(LGPD_COOKIE_NAME + '='));
    if (match) {
      const raw = decodeURIComponent(match.split('=').slice(1).join('='));
      const obj = JSON.parse(raw);
      if (obj && obj.version === LGPD_POLICY_VERSION) return obj;
    }
  } catch(e) {}

  /* Fallback: localStorage */
  try {
    const raw = localStorage.getItem(LGPD_COOKIE_NAME);
    if (raw) {
      const obj = JSON.parse(raw);
      if (obj && obj.version === LGPD_POLICY_VERSION) return obj;
    }
  } catch(e) {}

  return null;
}

/* ── Grava o consentimento em cookie HTTP + localStorage ── */
function _gravarConsentimento(preferencias, analise) {
  const record = {
    version:     LGPD_POLICY_VERSION,
    timestamp:   new Date().toISOString(),
    essencial:   true,          /* sempre obrigatório */
    preferencias: preferencias,
    analise:      analise,
  };

  const value = encodeURIComponent(JSON.stringify(record));

  /* Cookie HTTP com SameSite=Strict, Secure omitido pois pode ser HTTP local */
  document.cookie =
    `${LGPD_COOKIE_NAME}=${value}; max-age=${LGPD_MAX_AGE}; path=/; SameSite=Strict`;

  /* Backup localStorage */
  try { localStorage.setItem(LGPD_COOKIE_NAME, JSON.stringify(record)); } catch(e) {}

  /* Dispara evento customizado para outros scripts usarem */
  window.dispatchEvent(new CustomEvent('lgpdConsentimento', { detail: record }));

  return record;
}

/* ── Aplica as preferências salvas ao ambiente ── */
function _aplicarConsentimento(record) {
  if (!record) return;

  /* Cookies de preferência: idioma, fonte, modo escuro já usamos localStorage.
     Aqui apenas documentamos — em produção, ativar/desativar scripts de terceiros. */
  if (!record.preferencias) {
    /* Remove prefs salvas se usuário recusou */
    try {
      localStorage.removeItem(FONT_KEY);
      localStorage.removeItem(AC_KEY);
    } catch(e) {}
  }

  if (!record.analise) {
    /* Bloqueia analytics de terceiros — em produção: não carregar GA, Hotjar etc. */
    window._lgpdAnaliseAtiva = false;
  } else {
    window._lgpdAnaliseAtiva = true;
  }
}

/* ── Fecha o banner com animação ── */
function _fecharBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  banner.style.transition = 'opacity 0.3s, transform 0.3s';
  banner.style.opacity    = '0';
  banner.style.transform  = 'translateY(20px)';
  setTimeout(() => banner.remove(), 320);
}

/* ── Aceitar tudo ── */
function aceitarCookies() {
  const record = _gravarConsentimento(true, true);
  _aplicarConsentimento(record);
  _fecharBanner();
}

/* ── Recusar não-essenciais ── */
function recusarCookies() {
  const record = _gravarConsentimento(false, false);
  _aplicarConsentimento(record);
  _fecharBanner();
}

/* ── Salvar preferências personalizadas ── */
function salvarPreferenciasCookies() {
  const pref   = document.getElementById('lgpd-pref')   ? document.getElementById('lgpd-pref').checked   : false;
  const analise= document.getElementById('lgpd-analise') ? document.getElementById('lgpd-analise').checked : false;
  const record = _gravarConsentimento(pref, analise);
  _aplicarConsentimento(record);
  _fecharBanner();
}

/* ── Abre/fecha o painel de personalização ── */
function _togglePersonalizar() {
  const painel = document.getElementById('lgpd-painel');
  if (!painel) return;
  const aberto = painel.style.display !== 'none';
  painel.style.display = aberto ? 'none' : 'block';
  const btn = document.getElementById('lgpd-btn-personalizar');
  if (btn) btn.setAttribute('aria-expanded', String(!aberto));
}

/* ── Cria o banner LGPD completo ── */
function criarBannerCookies() {
  /* Já consentiu com a versão atual? */
  const existente = _lerConsentimento();
  if (existente) {
    _aplicarConsentimento(existente);
    return;
  }

  const L      = getLabels();
  const banner = document.createElement('div');
  banner.id    = 'cookieBanner';
  banner.setAttribute('role',       'dialog');
  banner.setAttribute('aria-modal', 'true');
  banner.setAttribute('aria-label', L.cookieBanner);
  banner.setAttribute('aria-live',  'polite');

  banner.innerHTML = `
    <div class="lgpd-body">
      <div class="lgpd-icon" aria-hidden="true">🔒</div>
      <div class="lgpd-texto">
        <p class="lgpd-titulo">${L.lgpdTitulo}</p>
        <p class="lgpd-desc">${L.lgpdDesc}</p>
        <a href="https://www.gov.br/saude/pt-br/acesso-a-informacao/lgpd"
           target="_blank" rel="noopener noreferrer"
           class="lgpd-link">${L.lgpdSaibaMais}</a>
      </div>
    </div>

    <!-- Painel de personalização (oculto por padrão) -->
    <div id="lgpd-painel" style="display:none;" class="lgpd-painel" role="group" aria-label="${L.lgpdPersonalizarLabel}">
      <div class="lgpd-categoria lgpd-categoria-disabled">
        <label class="lgpd-cat-label">
          <input type="checkbox" checked disabled aria-disabled="true">
          <span class="lgpd-cat-nome">${L.lgpdEssencial}</span>
        </label>
        <span class="lgpd-cat-desc">${L.lgpdEssencialDesc}</span>
      </div>
      <div class="lgpd-categoria">
        <label class="lgpd-cat-label">
          <input type="checkbox" id="lgpd-pref" checked>
          <span class="lgpd-cat-nome">${L.lgpdPref}</span>
        </label>
        <span class="lgpd-cat-desc">${L.lgpdPrefDesc}</span>
      </div>
      <div class="lgpd-categoria">
        <label class="lgpd-cat-label">
          <input type="checkbox" id="lgpd-analise">
          <span class="lgpd-cat-nome">${L.lgpdAnalise}</span>
        </label>
        <span class="lgpd-cat-desc">${L.lgpdAnaliseDesc}</span>
      </div>
    </div>

    <div class="lgpd-btns">
      <button class="lgpd-btn lgpd-btn-recusar"
              onclick="recusarCookies()"
              aria-label="${L.lgpdRecusar}">
        ${L.lgpdRecusar}
      </button>
      <button class="lgpd-btn lgpd-btn-personalizar"
              id="lgpd-btn-personalizar"
              onclick="_togglePersonalizar()"
              aria-expanded="false"
              aria-controls="lgpd-painel">
        ${L.lgpdPersonalizar}
      </button>
      <button class="lgpd-btn lgpd-btn-salvar"
              id="lgpd-btn-salvar"
              onclick="salvarPreferenciasCookies()"
              style="display:none;">
        ${L.lgpdSalvar}
      </button>
      <button class="lgpd-btn lgpd-btn-aceitar"
              onclick="aceitarCookies()"
              aria-label="${L.cookieAria}">
        ${L.cookieBtn}
      </button>
    </div>
  `;

  document.body.appendChild(banner);

  /* Ao abrir personalizar, mostra botão Salvar e esconde Aceitar Tudo */
  const btnPers  = document.getElementById('lgpd-btn-personalizar');
  const btnSalvar= document.getElementById('lgpd-btn-salvar');
  const btnAceitar = banner.querySelector('.lgpd-btn-aceitar');
  const painel   = document.getElementById('lgpd-painel');

  btnPers.addEventListener('click', () => {
    const aberto = painel.style.display !== 'none';
    if (!aberto) {
      btnSalvar.style.display  = 'inline-flex';
      btnAceitar.style.display = 'none';
    } else {
      btnSalvar.style.display  = 'none';
      btnAceitar.style.display = 'inline-flex';
    }
  });

  /* Foco acessível: foca o primeiro botão ao abrir */
  setTimeout(() => {
    const primeiro = banner.querySelector('.lgpd-btn-recusar');
    if (primeiro) primeiro.focus();
  }, 100);
}

/* ── Atualiza textos do banner ao trocar idioma ── */
function _atualizarBannerCookies(lang) {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  const L = AC_LABELS[lang] || AC_LABELS.pt;
  banner.setAttribute('aria-label', L.cookieBanner);

  const desc = banner.querySelector('.lgpd-desc');
  if (desc) desc.innerHTML = L.lgpdDesc;

  const titulo = banner.querySelector('.lgpd-titulo');
  if (titulo) titulo.textContent = L.lgpdTitulo;

  const link = banner.querySelector('.lgpd-link');
  if (link) link.textContent = L.lgpdSaibaMais;

  const btnAceitar = banner.querySelector('.lgpd-btn-aceitar');
  if (btnAceitar) { btnAceitar.textContent = L.cookieBtn; btnAceitar.setAttribute('aria-label', L.cookieAria); }

  const btnRecusar = banner.querySelector('.lgpd-btn-recusar');
  if (btnRecusar) { btnRecusar.textContent = L.lgpdRecusar; btnRecusar.setAttribute('aria-label', L.lgpdRecusar); }

  const btnPers = document.getElementById('lgpd-btn-personalizar');
  if (btnPers) btnPers.textContent = L.lgpdPersonalizar;

  const btnSalvar = document.getElementById('lgpd-btn-salvar');
  if (btnSalvar) btnSalvar.textContent = L.lgpdSalvar;
}

/* ── Expõe para uso global (onclick no HTML inline) ── */
window._togglePersonalizar     = _togglePersonalizar;
window.salvarPreferenciasCookies = salvarPreferenciasCookies;
window.recusarCookies          = recusarCookies;

/* ============================================================
   9. SEMÂNTICA
   ============================================================ */
function melhorarSemantica() {
  const content = document.querySelector('.content');
  if (content) {
    if (!content.id) content.id = 'main-content';
    content.setAttribute('tabindex', '-1');
  }

  document.querySelectorAll('.nav-item').forEach(item => {
    if (!item.getAttribute('role'))     item.setAttribute('role', 'link');
    if (!item.getAttribute('tabindex')) item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
    });
  });

  document.querySelectorAll('.home-card').forEach(card => {
    if (!card.getAttribute('role'))     card.setAttribute('role', 'button');
    if (!card.getAttribute('tabindex')) card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });
}

/* ============================================================
   10. VALIDAÇÃO ACESSÍVEL
   ============================================================ */
function marcarErro(campoId, mensagem) {
  const campo = document.getElementById(campoId);
  if (!campo) return;

  campo.setAttribute('aria-invalid', 'true');
  campo.setAttribute('aria-describedby', `erro-${campoId}`);

  let erroEl = document.getElementById(`erro-${campoId}`);
  if (!erroEl) {
    erroEl = document.createElement('span');
    erroEl.id        = `erro-${campoId}`;
    erroEl.className = 'field-error';
    erroEl.setAttribute('role', 'alert');
    campo.parentNode.appendChild(erroEl);
  }

  erroEl.textContent = mensagem;
  erroEl.classList.add('visivel');
  campo.focus();
}

function limparErro(campoId) {
  const campo = document.getElementById(campoId);
  if (!campo) return;
  campo.removeAttribute('aria-invalid');
  campo.removeAttribute('aria-describedby');
  const erroEl = document.getElementById(`erro-${campoId}`);
  if (erroEl) erroEl.classList.remove('visivel');
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  criarSkipLinks();
  criarBarraAcessibilidade();
  criarLiveRegion();
  restaurarFonte();
  restaurarModoEscuro();
  _sincronizarIconeModo(document.body.classList.contains('modo-escuro'));
  configurarAtalhos();
  melhorarSemantica();
  inicializarVLibras();
  criarBannerCookies();

  /* Aplica o idioma salvo assim que translations.js estiver disponível */
  const lang = getLang();
  if (lang !== 'pt') {
    /* Pequeno delay para garantir que translations.js já carregou */
    setTimeout(() => {
      if (typeof window.changeLanguage === 'function') {
        window.changeLanguage(lang);
      }
      _atualizarTextosBarra(lang);
    }, 0);
  }

  /* Expõe para uso externo (ex: translations.js também chama _mudarIdioma) */
  window._acMudarIdioma = _mudarIdioma;
});

/* ── Expõe globalmente ── */
window.aceitarCookies   = aceitarCookies;
window.anunciarLeitor   = anunciarLeitor;
window.marcarErro       = marcarErro;
window.limparErro       = limparErro;
window.toggleModoEscuro = toggleModoEscuro;
window.alterarFonte     = alterarFonte;
window.irParaConteudo   = irParaConteudo;