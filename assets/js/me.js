/** About page: avatar modal, email reveal, decorations */
(function () {
  'use strict';

  var ruBlock = document.getElementById('ru-block');
  var modal = document.getElementById('avatarModal');
  var closeBtn = document.getElementById('avatarClose');

  if (modal && closeBtn) {
    function openModal() {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      if (!ruBlock || !ruBlock.classList.contains('ru-visible')) {
        document.body.style.overflow = '';
      }
    }

    document.querySelectorAll('.avatar').forEach(function (btn) {
      btn.addEventListener('click', openModal);
    });
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  var EMAIL = 'omit-divided-puppy@duck.com';
  var revealTimer = null;

  function revealEmail(emailEl, copyBtn) {
    emailEl.classList.remove('blurred');
    copyBtn.classList.add('visible');
    if (revealTimer) clearTimeout(revealTimer);
    revealTimer = setTimeout(function () {
      emailEl.classList.add('blurred');
      copyBtn.classList.remove('visible');
      copyBtn.classList.remove('copied');
      copyBtn.textContent = '📋';
    }, 6000);
  }

  document.querySelectorAll('.email-wrap').forEach(function (wrap) {
    var emailEl = wrap.querySelector('.email');
    var copyBtn = wrap.querySelector('.email-copy');
    if (!emailEl || !copyBtn) return;

    emailEl.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      revealEmail(emailEl, copyBtn);
    });

    copyBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      function markCopied() {
        copyBtn.textContent = '✓';
        copyBtn.classList.add('copied');
        setTimeout(function () {
          if (copyBtn.classList.contains('visible')) {
            copyBtn.textContent = '📋';
            copyBtn.classList.remove('copied');
          }
        }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(markCopied).catch(function () {
          fallbackCopy();
          markCopied();
        });
      } else {
        fallbackCopy();
        markCopied();
      }
      function fallbackCopy() {
        var ta = document.createElement('textarea');
        ta.value = EMAIL;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (_) {}
        document.body.removeChild(ta);
      }
      revealEmail(emailEl, copyBtn);
    });
  });

  var DECO_TOP = ['✨️','⭐️','🌟','❄️','⚡️','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌙','🏔','⛰️','🌋','🗻','🌐','♨️','⏳️','🎊','🎀','🪄'];
  var DECO_BOTTOM = ['🧳','🍔','🍟','🍕','🌭','🥪','🌮','🌯','🥙','🥘','🥗','🍿','🍧','🍬','🧃','🧋','🥤','☕️','🥇','🏅','🐈','🐈‍⬛','🔍','🔎','🛡','📡','🔭','🔬'];
  var decoEls = document.querySelectorAll('.avatar-deco');

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function showDeco() {
    if (!decoEls.length) return;
    var useTop = Math.random() < 0.55;
    var symbol = useTop ? pick(DECO_TOP) : pick(DECO_BOTTOM);
    var posClass = useTop ? 'pos-top' : 'pos-bottom';

    decoEls.forEach(function (el) {
      el.classList.remove('visible', 'leaving', 'pos-top', 'pos-bottom');
      void el.offsetWidth;
      el.textContent = symbol;
      el.classList.add(posClass);
      requestAnimationFrame(function () {
        el.classList.add('visible');
      });
    });

    var visibleMs = 2800 + Math.random() * 2200;
    setTimeout(function () {
      decoEls.forEach(function (el) {
        el.classList.add('leaving');
        el.classList.remove('visible');
      });
      var gap = 500 + Math.random() * 2000;
      setTimeout(showDeco, gap + 350);
    }, visibleMs);
  }

  if (decoEls.length) {
    setTimeout(showDeco, 800 + Math.random() * 1200);
  }
})();
