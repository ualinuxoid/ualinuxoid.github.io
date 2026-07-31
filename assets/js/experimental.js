/** Experimental page: bash | confirm panels */
(function () {
  'use strict';

  document.querySelectorAll('[data-bash-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrap = btn.closest('.bash-wrap');
      var panel = wrap.querySelector('.bash-panel');
      panel.classList.add('visible');
      btn.style.display = 'none';
    });
  });

  document.querySelectorAll('[data-bash-yes]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.bash-panel');
      panel.querySelector('.bash-cmds').classList.add('visible');
      panel.querySelector('.bash-actions').style.display = 'none';
      panel.querySelector('.bash-warn').style.display = 'none';
    });
  });

  document.querySelectorAll('[data-bash-no]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrap = btn.closest('.bash-wrap');
      wrap.querySelector('.bash-panel').classList.remove('visible');
      wrap.querySelector('[data-bash-open]').style.display = '';
      wrap.querySelector('.bash-cmds').classList.remove('visible');
      wrap.querySelector('.bash-actions').style.display = 'flex';
      wrap.querySelector('.bash-warn').style.display = 'block';
    });
  });
})();
