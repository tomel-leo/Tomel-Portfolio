/* ═══════════════════════════════════════════════
   TOMEL — Portfolio Script
═══════════════════════════════════════════════ */

/* ── Page Loader ──────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.body.classList.remove('loading');
    triggerHeroReveal();
  }, 900);
});

function triggerHeroReveal() {
  document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach(el => {
    el.classList.add('in-view');
  });
}

/* ── Progress Bar ─────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = scrolled + '%';
});

/* ── Custom Cursor ────────────────────────────── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

if (cursor && follower && window.matchMedia('(pointer:fine)').matches) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    setTimeout(() => {
      follower.style.left = e.clientX + 'px';
      follower.style.top  = e.clientY + 'px';
    }, 80);
  });

  document.querySelectorAll('a, button, .interest-card, .project-item').forEach(el => {
    el.addEventListener('mouseenter', () => follower.style.transform = 'translate(-50%,-50%) scale(2)');
    el.addEventListener('mouseleave', () => follower.style.transform = 'translate(-50%,-50%) scale(1)');
  });
}

/* ── Dark Mode ────────────────────────────────── */
const toggle = document.getElementById('darkModeToggle');
const root   = document.documentElement;
const toggleIcon = toggle.querySelector('.toggle-icon');

if (localStorage.getItem('theme') === 'dark') {
  root.setAttribute('data-theme', 'dark');
  toggleIcon.textContent = '☀️';
}

toggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  root.setAttribute('data-theme', isDark ? '' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  toggleIcon.textContent = isDark ? '🌙' : '☀️';
});

/* ── Mobile Menu ──────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose= document.getElementById('mobileClose');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

mobileClose.addEventListener('click', closeMobileMenu);

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

/* ── Smooth Scroll ────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = document.querySelector('.header').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Header on Scroll ─────────────────────────── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
}, { passive: true });

/* ── Active Nav ───────────────────────────────── */
function updateActiveNav() {
  let current = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

/* ── Scroll Reveal ────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  // Skip hero elements — they're handled by loader callback
  if (!el.closest('.hero')) revealObserver.observe(el);
});

/* ── Counter Animation ────────────────────────── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

/* ── Testimonials Infinite Ticker ─────────────── */
const track = document.getElementById('tickerTrack');
if (track) {
  // Clone for seamless loop
  Array.from(track.children).forEach(card => {
    track.appendChild(card.cloneNode(true));
  });

  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');

  let touchPaused = false;
  track.addEventListener('touchstart', () => {
    touchPaused = !touchPaused;
    track.style.animationPlayState = touchPaused ? 'paused' : 'running';
  }, { passive: true });
}

/* ── Contact Form ─────────────────────────────── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function(e) {
    const name    = this.querySelector('[name="name"]').value.trim();
    const email   = this.querySelector('[name="email"]').value.trim();
    const subject = this.querySelector('[name="subject"]').value.trim();
    const message = this.querySelector('[name="message"]').value.trim();

    if (!name || !email || !subject || !message) {
      e.preventDefault();
      showFormError('Please fill in all fields before submitting.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.preventDefault();
      showFormError('Please enter a valid email address.');
      return;
    }

    const btn = this.querySelector('.submit-btn');
    btn.querySelector('.btn-text').textContent = 'Sending…';
    btn.disabled = true;
  });

  // Label float effect
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.form-group').classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.closest('.form-group').classList.remove('focused');
    });
  });
}

function showFormError(msg) {
  let err = document.querySelector('.form-error');
  if (!err) {
    err = document.createElement('p');
    err.className = 'form-error';
    err.style.cssText = 'color:#e53e3e;font-size:14px;margin-top:-12px;margin-bottom:16px;';
    document.querySelector('.submit-btn').before(err);
  }
  err.textContent = msg;
  setTimeout(() => err.remove(), 4000);
}

/* ── Scroll to Top ────────────────────────────── */
document.getElementById('scrollTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Init ─────────────────────────────────────── */
document.body.classList.add('loading');
window.scrollTo(0, 0);
