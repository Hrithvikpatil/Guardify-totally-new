/* Guardify — site behaviour. No dependencies. */
(function () {
  'use strict';

  /* ---- sticky header + hide on scroll down ---- */
  var hdr = document.querySelector('.hdr');
  var bar = document.getElementById('progress');
  var lastY = 0;
  if (hdr) {
    var onScroll = function () {
      var y = window.scrollY || 0;
      hdr.classList.toggle('is-stuck', y > 8);
      hdr.classList.toggle('is-away', y > 140 && y > lastY && !document.body.classList.contains('nav-open'));
      lastY = y;
      if (bar) {
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        bar.hidden = false;
        bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- mobile nav ---- */
  var burger = document.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
    });
  }

  /* ---- scroll reveal ---- */
  var rv = document.querySelectorAll('.rv');
  if (rv.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    rv.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      io.observe(el);
    });
    // safety net — never leave content invisible
    setTimeout(function () { rv.forEach(function (el) { el.classList.add('in'); }); }, 2500);
  } else {
    rv.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- fee calculator ---- */
  var slider = document.getElementById('calcRange');
  if (slider) {
    var money = function (n) { return '₹' + Number(n).toLocaleString('en-IN'); };
    var paint = function () {
      var min = +slider.min, max = +slider.max, val = +slider.value;
      slider.style.setProperty('--fill', ((val - min) / (max - min) * 100) + '%');
      var fee = Math.round(val * 0.10);
      document.getElementById('calcSpend').textContent = money(val);
      document.getElementById('calcFee').textContent = money(fee);
      document.getElementById('calcKeep').textContent = money(val - fee);
    };
    slider.addEventListener('input', paint);
    paint();
  }

  /* ---- contact tabs (salon / creator) ---- */
  var tabBtns = document.querySelectorAll('.tabs__btn');
  if (tabBtns.length) {
    var showTab = function (name, focus) {
      tabBtns.forEach(function (b) {
        var on = b.getAttribute('data-tab') === name;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        var panel = document.getElementById('panel-' + b.getAttribute('data-tab'));
        if (panel) panel.classList.toggle('is-active', on);
        if (on && focus) b.focus();
      });
    };
    tabBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var name = b.getAttribute('data-tab');
        showTab(name);
        history.replaceState(null, '', '#' + name);
      });
    });
    // deep links: contact.html#creator / #brand / #salon
    var TABS = ['salon', 'creator', 'brand'];
    var fromHash = function (focus) {
      var h = (location.hash || '').replace('#', '');
      if (TABS.indexOf(h) > -1) showTab(h, focus);
    };
    fromHash(false);
    window.addEventListener('hashchange', function () { fromHash(true); });
  }

  /* ---- lead forms (works for any .js-lead form) ---- */
  document.querySelectorAll('.js-lead').forEach(function (form) {
    var msg = form.querySelector('.form-msg');
    var say = function (text, cls) { msg.textContent = text; msg.className = 'form-msg ' + cls; };

    // label text for each field, so the WhatsApp message reads properly
    var labelFor = function (input) {
      var l = form.querySelector('label[for="' + input.id + '"]');
      return (l ? l.textContent : input.name).replace(' *', '').trim();
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var missing = [];
      form.querySelectorAll('[required]').forEach(function (input) {
        if (!input.value.trim()) missing.push(labelFor(input));
      });
      if (missing.length) {
        say('Please fill in: ' + missing.join(', ') + '.', 'err');
        return;
      }

      var data = { type: form.getAttribute('data-title') };
      var lines = [form.getAttribute('data-title')];
      form.querySelectorAll('input, textarea').forEach(function (input) {
        if (!input.name) return;
        var val = input.value.trim();
        data[input.name] = val;
        lines.push(labelFor(input) + ': ' + (val || '-'));
      });

      var btn = form.querySelector('button[type=submit]');
      var label = btn.textContent;
      var endpoint = form.getAttribute('data-endpoint');

      var waLink = 'https://wa.me/' + form.getAttribute('data-wa') +
        '?text=' + encodeURIComponent(lines.join('\n'));

      // Direct path: we're still inside the user's tap, so window.open is allowed.
      var openWhatsApp = function () {
        window.open(waLink, '_blank');
        say('Opening WhatsApp with your details — just hit send and we\u2019ll take it from there.', 'ok');
        form.reset();
      };

      // Fallback path: this runs from a promise callback, where browsers block
      // window.open. Offer a link the visitor can tap instead of losing them.
      var offerWhatsApp = function () {
        msg.className = 'form-msg err';
        msg.innerHTML = 'We couldn\u2019t send that automatically. ' +
          '<a href="' + waLink + '" target="_blank" rel="noopener"><b>Tap here to send it on WhatsApp</b></a> ' +
          '— your details are already filled in.';
      };

      if (!endpoint) { openWhatsApp(); return; }

      var token = form.getAttribute('data-token');
      if (token) data.token = token;

      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(endpoint, {
        method: 'POST',
        // text/plain avoids a CORS preflight, which Apps Script does not answer.
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error('bad response');
        return r.json().catch(function () { return { ok: true }; });
      }).then(function (res) {
        if (res && res.ok === false) throw new Error(res.error || 'rejected');
        say('Thanks! We\u2019ve got your details — we\u2019ll reply on WhatsApp shortly.', 'ok');
        form.reset();
      }).catch(offerWhatsApp).then(function () {
        btn.disabled = false; btn.textContent = label;
      });
    });
  });

  /* ---- year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
