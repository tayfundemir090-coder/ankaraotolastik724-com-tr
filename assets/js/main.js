(function () {
  'use strict';

  var body = document.body;
  var hamburger = document.getElementById('hamburger');

  // Mobil menü
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  document.querySelectorAll('.nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      body.classList.remove('nav-open');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Yıl
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Görünür olunca belirme
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Menüde aktif bölüm
  var links = document.querySelectorAll('.nav__link[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) {
      var sec = document.querySelector(l.getAttribute('href'));
      if (sec) spy.observe(sec);
    });
  }

  // Talep formu -> WhatsApp mesajı
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var lines = [
        'Merhaba Şipşak Oto Lastik,',
        'Ad Soyad: ' + (data.get('ad') || ''),
        'Telefon: ' + (data.get('telefon') || ''),
        'Hizmet: ' + (data.get('hizmet') || ''),
        'Lastik ebadı: ' + (data.get('ebat') || '-'),
        'Konum / açıklama: ' + (data.get('mesaj') || '-')
      ];
      // GTM: Google Ads gelişmiş dönüşümleri için telefon E.164 biçiminde (+905xxxxxxxxx) gönderilir.
      var tel = String(data.get('telefon') || '').replace(/\D/g, '');
      if (tel.length === 12 && tel.indexOf('90') === 0) tel = tel.slice(2);
      if (tel.length === 11 && tel.charAt(0) === '0') tel = tel.slice(1);
      var ev = { event: 'form_gonder', hizmet: data.get('hizmet') || '' };
      if (/^5\d{9}$/.test(tel)) ev.user_data = { phone_number: '+90' + tel };
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(ev);
      window.open('https://wa.me/905321530914?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  }
})();
