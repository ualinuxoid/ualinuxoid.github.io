/** Home page: script spoilers + source toggles */
(function () {
  'use strict';

  var I18N = window.PAGE_I18N || { uk: {}, en: {} };

  function updateSpoilerLabels(lang) {
    var t = I18N[lang] || I18N.uk || {};
    document.querySelectorAll('.script-item').forEach(function (item) {
      var content = item.querySelector('.sp-content');
      var btnSp = item.querySelector('.sp-btn');
      if (!content || !btnSp) return;
      var isOpen = content.classList.contains('open');
      var span = btnSp.querySelector('span:first-child');
      if (span) {
        span.textContent = isOpen ? (t['hide-cmd'] || 'Hide') : (t['show-cmd'] || 'Show');
      }
    });
  }

  window.onLangChange = function (lang) {
    updateSpoilerLabels(lang);
  };

  window.toggleSpoiler = function (headerEl) {
    var item = headerEl.closest('.script-item');
    var content = item.querySelector('.sp-content');
    var btn = item.querySelector('.sp-btn');
    content.classList.toggle('open');
    btn.classList.toggle('open');
    var active = document.querySelector('.lang-btn.active');
    updateSpoilerLabels((active && active.dataset.lang) || 'uk');
  };

  window.toggleSource = function (btn) {
    var item = btn.closest('.script-item');
    var content = item.querySelector('.src-content');
    content.classList.toggle('open');
    btn.classList.toggle('open');
  };

  updateSpoilerLabels('uk');
})();
