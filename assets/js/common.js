/**
 * Shared site logic: RU gate, theme toggle, language switch.
 * Pages set window.PAGE_I18N = { uk: {...}, en: {...} } before this script.
 * Optional: window.onLangChange = function (lang) { ... }
 */
(function () {
  'use strict';

  var RU_TZ = new Set([
    'Europe/Kaliningrad', 'Europe/Moscow', 'Europe/Samara',
    'Asia/Yekaterinburg', 'Asia/Omsk', 'Asia/Krasnoyarsk',
    'Asia/Novosibirsk', 'Asia/Barnaul', 'Asia/Tomsk', 'Asia/Novokuznetsk',
    'Asia/Irkutsk', 'Asia/Chita', 'Asia/Yakutsk', 'Asia/Khandyga',
    'Asia/Vladivostok', 'Asia/Ust-Nera', 'Asia/Magadan',
    'Asia/Sakhalin', 'Asia/Srednekolymsk', 'Asia/Kamchatka', 'Asia/Anadyr'
  ]);

  var PHRASES = [
    'I lost count how many times your oil infrastructure was on fire',
    'Your warship drowned, so be you',
    'Who gave you access to VPN?',
    'Did you know, that internet was invented in USA? Why are you using western technology?!',
    'What are you doing here? All vodka jars are empty?',
    'You should get a new "skrepi". Wait a second... Wildberries on fire!'
  ];

  function isRuLanguageTag(tag) {
    if (!tag || typeof tag !== 'string') return false;
    return /^ru([-_]|$)/i.test(tag.trim());
  }

  function signalsSuggestRussian() {
    try {
      var langs = Array.isArray(navigator.languages) && navigator.languages.length
        ? navigator.languages
        : [navigator.language || ''];
      var primary = (langs[0] || '').trim();
      var hasRuPrimary = isRuLanguageTag(primary);
      var ruCount = langs.filter(isRuLanguageTag).length;
      var strongLang = hasRuPrimary || ruCount >= 2;
      var tz = '';
      try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (_) {}
      var hasRuTz = RU_TZ.has(tz);
      var intlLoc = '';
      try { intlLoc = Intl.DateTimeFormat().resolvedOptions().locale || ''; } catch (_) {}
      var hasRuIntl = isRuLanguageTag(intlLoc);
      return hasRuPrimary || (hasRuTz && (ruCount > 0 || hasRuIntl)) || (strongLang && hasRuIntl);
    } catch (_) {
      return false;
    }
  }

  function initRuGate() {
    var ruBlock = document.getElementById('ru-block');
    var mainContent = document.getElementById('main-content');
    if (!ruBlock || !mainContent) return;

    var phraseEl = document.getElementById('ru-phrase');
    if (phraseEl) {
      phraseEl.textContent = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    }

    var unlocked = localStorage.getItem('ua_unlocked') === '1';
    if (signalsSuggestRussian() && !unlocked) {
      ruBlock.classList.add('ru-visible');
      ruBlock.setAttribute('aria-hidden', 'false');
      mainContent.classList.add('ru-hidden');
      document.body.style.overflow = 'hidden';
    }

    var notRuBtn = document.getElementById('not-ru-btn');
    var proveBox = document.getElementById('ru-prove');
    var input = document.getElementById('ru-input');
    var submit = document.getElementById('ru-submit');
    var hintBtn = document.getElementById('ru-hint-btn');
    var hintText = document.getElementById('ru-hint-text');
    var errorEl = document.getElementById('ru-error');

    function unlock() {
      localStorage.setItem('ua_unlocked', '1');
      ruBlock.classList.remove('ru-visible');
      ruBlock.setAttribute('aria-hidden', 'true');
      mainContent.classList.remove('ru-hidden');
      document.body.style.overflow = '';
    }

    if (notRuBtn && proveBox && input) {
      notRuBtn.addEventListener('click', function () {
        notRuBtn.style.display = 'none';
        proveBox.classList.add('visible');
        input.focus();
      });
    }

    if (hintBtn && hintText) {
      hintBtn.addEventListener('click', function () {
        hintText.classList.toggle('visible');
      });
    }

    function checkAnswer() {
      if (!input) return;
      var val = (input.value || '').trim().toLowerCase();
      if (val === 'слава україні' || val === 'glory to ukraine') {
        unlock();
      } else if (errorEl) {
        errorEl.classList.add('visible');
        input.value = '';
        input.focus();
        setTimeout(function () { errorEl.classList.remove('visible'); }, 2000);
      }
    }

    if (submit) submit.addEventListener('click', checkAnswer);
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') checkAnswer();
      });
    }
  }

  function initTheme() {
    var themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark');
    }
    themeToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark');
      localStorage.setItem(
        'theme',
        document.body.classList.contains('dark') ? 'dark' : 'light'
      );
    });
  }

  function initLang() {
    var I18N = window.PAGE_I18N || { uk: {}, en: {} };
    var langBtns = document.querySelectorAll('.lang-btn');
    var langBlocks = document.querySelectorAll('.lang-block');

    function applyI18n(lang) {
      var t = I18N[lang] || I18N.uk || {};
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
      });
      if (typeof window.onLangChange === 'function') {
        window.onLangChange(lang);
      }
    }

    function setLang(lang) {
      langBtns.forEach(function (b) {
        b.classList.toggle('active', b.dataset.lang === lang);
      });
      langBlocks.forEach(function (block) {
        block.classList.toggle('active', block.dataset.lang === lang);
      });
      document.documentElement.lang = lang === 'uk' ? 'uk' : 'en';
      applyI18n(lang);
    }

    langBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.dataset.lang);
      });
    });

    applyI18n('uk');
  }

  initRuGate();
  initTheme();
  initLang();
})();
