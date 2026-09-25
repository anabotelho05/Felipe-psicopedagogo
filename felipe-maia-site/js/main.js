/* ================================================================
   MAIN.JS — Felipe Maia Psicopedagogo
   Lê SITE_CONFIG e popula todo o site dinamicamente.
   ================================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────────
     UTILS
     ────────────────────────────────────────────────────────────── */
  function buildWA(number, msg) {
    var clean = number.replace(/\D/g, '');
    var full  = clean.startsWith('55') ? clean : '55' + clean;
    var base  = 'https://wa.me/' + full;
    return msg ? base + '?text=' + encodeURIComponent(msg) : base;
  }

  function el(id) { return document.getElementById(id); }

  function setText(id, text) {
    var e = el(id);
    if (e) e.textContent = text;
  }

  function setHref(id, href) {
    var e = el(id);
    if (e) e.href = href;
  }

  /* ──────────────────────────────────────────────────────────────
     PREENCHE DADOS DO CONFIG
     ────────────────────────────────────────────────────────────── */
  function applyConfig() {
    var c  = SITE_CONFIG;
    var wa = buildWA(c.whatsapp, 'Olá! Gostaria de saber mais sobre o atendimento psicopedagógico.');

    /* Navbar */
    setHref('navbar-cta-wa', wa);
    setHref('mobile-wa', wa);

    /* Hero */
    setHref('hero-wa', wa);

    /* Sobre — info */
    setText('info-formacao',    c.formacao);
    setText('info-experiencia', c.experiencia);

    /* Sobre — tags de especialização */
    var tagsEl = el('sobre-tags');
    if (tagsEl) {
      c.especializacoes.forEach(function (tag) {
        var span = document.createElement('span');
        span.className = 'sobre-tag';
        span.textContent = tag;
        tagsEl.appendChild(span);
      });
    }

    /* Contato — canais */
    setText('contato-phone-wa',      c.telefone);
    setText('contato-phone-display', c.telefone);
    setText('contato-email-display', c.email);
    setText('contato-ig-display',    '@' + c.instagram);
    setText('contato-endereco',      c.endereco);
    setText('contato-horario',       c.horario);

    setHref('contato-wa',    wa);
    setHref('contato-tel',   'tel:' + c.whatsapp.replace(/\D/g,''));
    setHref('contato-email', 'mailto:' + c.email);
    setHref('contato-ig',    'https://instagram.com/' + c.instagram);

    /* Footer */
    setHref('footer-ig', 'https://instagram.com/' + c.instagram);
    setHref('footer-wa', wa);
    setHref('footer-tel',   'tel:' + c.whatsapp.replace(/\D/g,''));
    setHref('footer-email', 'mailto:' + c.email);

    var footTel = el('footer-tel');
    if (footTel) footTel.textContent = c.telefone;
    var footEmail = el('footer-email');
    if (footEmail) footEmail.textContent = c.email;
    setText('footer-horario', c.horario);

    /* Copyright */
    var yearEl = el('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* WhatsApp float */
    setHref('wa-float', wa);

    /* Galeria */
    renderGallery();

    /* Depoimentos */
    renderTestimonials();

    /* FAQ */
    renderFAQ();
  }

  /* ──────────────────────────────────────────────────────────────
     GALERIA
     ────────────────────────────────────────────────────────────── */
  function renderGallery() {
    var grid = el('gallery-grid');
    if (!grid) return;

    SITE_CONFIG.galeria.forEach(function (img, i) {
      var item = document.createElement('div');
      item.className = 'gallery-item fade-in';
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', 'Ver imagem: ' + img.alt);
      item.style.transitionDelay = (i % 3 * 0.1) + 's';

      item.innerHTML = [
        '<img class="gallery-img"',
        '     src="' + img.src + '"',
        '     alt="' + img.alt + '"',
        '     loading="lazy"',
        '     width="400" height="300"',
        '     onerror="this.parentElement.querySelector(\'.gallery-placeholder\').style.display=\'flex\';this.style.display=\'none\'"',
        '/>',
        '<div class="gallery-placeholder" style="display:none" aria-hidden="true">',
        '  <svg width="40" height="22" viewBox="0 0 120 66" fill="none"><path d="M60 33 C60 33 52 16 38 16 C24 16 14 24 14 33 C14 42 24 50 38 50 C52 50 60 33 60 33 C60 33 68 16 82 16 C96 16 106 24 106 33 C106 42 96 50 82 50 C68 50 60 33 60 33 Z" fill="none" stroke="#8EC9E8" stroke-width="7" stroke-linecap="round"/></svg>',
        '  <span>Foto do espaço</span>',
        '</div>',
        '<div class="gallery-overlay" aria-hidden="true">',
        '  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
        '</div>',
      ].join('');

      var openLightbox = function () { openLightboxWith(img); };
      item.addEventListener('click', openLightbox);
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(); }
      });

      grid.appendChild(item);
    });
  }

  /* ──────────────────────────────────────────────────────────────
     LIGHTBOX
     ────────────────────────────────────────────────────────────── */
  function openLightboxWith(img) {
    var lb  = el('lightbox');
    var lbi = el('lightbox-img');
    var lbc = el('lightbox-caption');
    if (!lb || !lbi) return;

    lbi.src = img.src;
    lbi.alt = img.alt;
    if (lbc) lbc.textContent = img.alt;

    lb.classList.add('open');
    document.body.classList.add('no-scroll');

    var closeBtn = el('lightbox-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    var lb = el('lightbox');
    if (lb) lb.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  window.addEventListener('DOMContentLoaded', function () {
    var lb      = el('lightbox');
    var closeBtn = el('lightbox-close');

    if (lb) {
      lb.addEventListener('click', function (e) {
        if (e.target === lb) closeLightbox();
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  });

  /* ──────────────────────────────────────────────────────────────
     DEPOIMENTOS
     ────────────────────────────────────────────────────────────── */
  function renderTestimonials() {
    var grid = el('testimonials-grid');
    if (!grid) return;

    SITE_CONFIG.depoimentos.forEach(function (dep, i) {
      var initials = dep.nome.split(' ').map(function(w){ return w[0]; }).join('').slice(0,2).toUpperCase();
      var delay = (i * 0.1) + 's';

      var item = document.createElement('div');
      item.className = 'testimonial fade-in';
      item.style.transitionDelay = delay;

      item.innerHTML = [
        '<span class="testimonial-quote" aria-hidden="true">"</span>',
        '<p class="testimonial-text">' + escapeHtml(dep.texto) + '</p>',
        '<div class="testimonial-author">',
        '  <div class="testimonial-avatar" aria-hidden="true">' + escapeHtml(initials) + '</div>',
        '  <div>',
        '    <div class="testimonial-name">' + escapeHtml(dep.nome) + '</div>',
        '    ' + (dep.subtitulo ? '<div class="testimonial-role">' + escapeHtml(dep.subtitulo) + '</div>' : ''),
        '  </div>',
        '</div>',
      ].join('');

      grid.appendChild(item);
    });
  }

  /* ──────────────────────────────────────────────────────────────
     FAQ
     ────────────────────────────────────────────────────────────── */
  function renderFAQ() {
    var list = el('faq-list');
    if (!list) return;

    SITE_CONFIG.faq.forEach(function (item, i) {
      var id = 'faq-' + i;
      var bodyId = 'faq-body-' + i;

      var div = document.createElement('div');
      div.className = 'faq-item';
      div.id = id;

      div.innerHTML = [
        '<button class="faq-trigger" type="button"',
        '        aria-expanded="false"',
        '        aria-controls="' + bodyId + '"',
        '        id="faq-btn-' + i + '">',
        '  <span>' + escapeHtml(item.pergunta) + '</span>',
        '  <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
        '       stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
        '    <polyline points="6 9 12 15 18 9"/>',
        '  </svg>',
        '</button>',
        '<div class="faq-body" id="' + bodyId + '" role="region"',
        '     aria-labelledby="faq-btn-' + i + '" aria-hidden="true">',
        '  <p class="faq-answer">' + escapeHtml(item.resposta) + '</p>',
        '</div>',
      ].join('');

      var trigger = div.querySelector('.faq-trigger');
      var body    = div.querySelector('.faq-body');

      trigger.addEventListener('click', function () {
        var isOpen = div.classList.contains('open');

        /* Fecha todos */
        document.querySelectorAll('.faq-item.open').forEach(function (other) {
          other.classList.remove('open');
          other.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-body').setAttribute('aria-hidden', 'true');
        });

        /* Abre este se estava fechado */
        if (!isOpen) {
          div.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
          body.setAttribute('aria-hidden', 'false');
        }
      });

      list.appendChild(div);
    });
  }

  /* ──────────────────────────────────────────────────────────────
     NAVBAR — scroll + hamburger
     ────────────────────────────────────────────────────────────── */
  function initNavbar() {
    var navbar    = el('navbar');
    var hamburger = el('hamburger');
    var menu      = el('mobile-menu');
    if (!navbar) return;

    /* Scroll effect */
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
    navbar.classList.toggle('scrolled', window.scrollY > 80);

    /* Hamburger */
    if (hamburger && menu) {
      hamburger.addEventListener('click', function () {
        var open = menu.classList.contains('open');
        if (open) {
          menu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          menu.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('no-scroll');
        } else {
          menu.classList.add('open');
          hamburger.setAttribute('aria-expanded', 'true');
          menu.setAttribute('aria-hidden', 'false');
          document.body.classList.add('no-scroll');
        }
      });

      /* Fecha ao clicar nos links */
      menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          menu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          menu.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('no-scroll');
        });
      });

      /* Fecha com Escape */
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
          menu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          menu.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('no-scroll');
          hamburger.focus();
        }
      });

      /* Fecha ao redimensionar para desktop */
      window.addEventListener('resize', function () {
        if (window.innerWidth >= 768) {
          menu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          menu.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('no-scroll');
        }
      });
    }

    /* Smooth scroll */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = this.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          var top = target.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ──────────────────────────────────────────────────────────────
     FADE-IN — IntersectionObserver
     ────────────────────────────────────────────────────────────── */
  function initAnimations() {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.fade-in').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ──────────────────────────────────────────────────────────────
     FORMULÁRIO DE CONTATO
     ────────────────────────────────────────────────────────────── */
  function initForm() {
    var form    = el('contact-form');
    var success = el('form-success');
    if (!form) return;

    function validate() {
      var valid = true;

      var fields = [
        { id: 'f-nome',    errId: 'err-nome',   msg: 'Por favor, informe seu nome.', check: function(v){ return v.trim().length > 1; } },
        { id: 'f-crianca', errId: 'err-crianca', msg: 'Por favor, informe o nome da criança.', check: function(v){ return v.trim().length > 0; } },
        { id: 'f-tel',     errId: 'err-tel',    msg: 'Por favor, informe um telefone.', check: function(v){ return v.replace(/\D/g,'').length >= 10; } },
        { id: 'f-email',   errId: 'err-email',  msg: 'Por favor, informe um e-mail válido.', check: function(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
        { id: 'f-msg',     errId: 'err-msg',    msg: 'Por favor, escreva sua mensagem.', check: function(v){ return v.trim().length > 5; } },
      ];

      fields.forEach(function (f) {
        var input = el(f.id);
        var err   = el(f.errId);
        if (!input) return;
        var ok = f.check(input.value);
        input.classList.toggle('error', !ok);
        if (err) err.classList.toggle('show', !ok);
        if (!ok) valid = false;
      });

      return valid;
    }

    /* Limpa erro ao digitar */
    form.querySelectorAll('.form-input, .form-textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        this.classList.remove('error');
        var errId = 'err-' + this.id.replace('f-', '');
        var errEl = el(errId);
        if (errEl) errEl.classList.remove('show');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      /* Simula envio — integrar com Formspree, EmailJS, etc. */
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Enviando...';

      setTimeout(function () {
        form.style.display = 'none';
        if (success) success.classList.add('show');
      }, 1200);
    });
  }

  /* ──────────────────────────────────────────────────────────────
     HELPER — escapa HTML
     ────────────────────────────────────────────────────────────── */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ──────────────────────────────────────────────────────────────
     INIT
     ────────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    applyConfig();
    initNavbar();
    initAnimations();
    initForm();
  });

})();
