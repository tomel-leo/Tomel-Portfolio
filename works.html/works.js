/* ═══════════════════════════════════════════════
   TOMEL WORKS — works.js
   Features: viewer modal, download tracking,
   email notification via EmailJS, search, filter
═══════════════════════════════════════════════ */

/* ── Config ───────────────────────────────────
   1. Go to https://www.emailjs.com and create a free account
   2. Create a service (Gmail) → copy Service ID
   3. Create an email template → copy Template ID
   4. Copy your Public Key from Account → API Keys
   5. Replace the values below
─────────────────────────────────────────────── */
const EMAILJS_CONFIG = {
  publicKey:   'YOUR_PUBLIC_KEY',      // ← replace
  serviceId:   'YOUR_SERVICE_ID',      // ← replace
  templateId:  'YOUR_TEMPLATE_ID',     // ← replace
  notifyTemplateId: 'YOUR_NOTIFY_TEMPLATE_ID', // ← for subscriber notifications
  ownerEmail:  'olugboyeayomideferanmi@gmail.com'
};

/* ── Init EmailJS ─────────────────────────────── */
if (typeof emailjs !== 'undefined') {
  emailjs.init(EMAILJS_CONFIG.publicKey);
}

/* ── DOM refs ─────────────────────────────────── */
const modalOverlay   = document.getElementById('modalOverlay');
const modalIframe    = document.getElementById('modalIframe');
const modalTitle     = document.getElementById('modalTitle');
const modalClose     = document.getElementById('modalClose');
const modalDlBtn     = document.getElementById('modalDownloadBtn');
const toast          = document.getElementById('toast');
const searchInput    = document.getElementById('searchInput');
const filterTabs     = document.querySelectorAll('.filter-tab');
const docsGrid       = document.getElementById('docsGrid');
const emptyState     = document.getElementById('emptyState');
const docCountEl     = document.getElementById('docCount');
const notifyForm     = document.getElementById('notifyForm');
const header         = document.getElementById('header');

/* ── Count active docs ────────────────────────── */
const totalDocs = docsGrid.querySelectorAll('.doc-card:not(.placeholder)').length;
if (docCountEl) docCountEl.textContent = totalDocs;

/* ── Header scroll ────────────────────────────── */
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Toast helper ─────────────────────────────── */
let toastTimer;
function showToast(msg, type = '') {
  toast.textContent = msg;
  toast.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = 'toast'; }, 3500);
}

/* ── Email notification to owner ─────────────── */
async function notifyOwner(docTitle, docType, action) {
  if (typeof emailjs === 'undefined') return;
  if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') return; // not configured yet

  const now = new Date();
  const time = now.toLocaleString('en-NG', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Lagos'
  });

  try {
    await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
      to_email:   EMAILJS_CONFIG.ownerEmail,
      doc_title:  docTitle,
      doc_type:   docType,
      action:     action,        // 'Viewed' or 'Downloaded'
      time:       time,
      user_agent: navigator.userAgent.slice(0, 80),
    });
  } catch (err) {
    console.warn('EmailJS notification failed:', err);
  }
}

/* ── Modal ────────────────────────────────────── */
let currentDownloadUrl = '';
let currentDocTitle    = '';
let currentDocType     = '';

function openModal(viewUrl, downloadUrl, title, type) {
  currentDownloadUrl = downloadUrl;
  currentDocTitle    = title;
  currentDocType     = type;

  modalTitle.textContent = title;
  modalIframe.src = viewUrl;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Notify owner of view
  notifyOwner(title, type, 'Viewed');
  showToast('Opening document…');
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { modalIframe.src = ''; }, 400);
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ── Modal Download Button ────────────────────── */
modalDlBtn.addEventListener('click', () => {
  triggerDownload(currentDownloadUrl, currentDocTitle, currentDocType);
});

/* ── Download trigger ─────────────────────────── */
function triggerDownload(url, title, type) {
  // Open download in new tab
  window.open(url, '_blank', 'noopener,noreferrer');

  // Notify owner
  notifyOwner(title, type, 'Downloaded');

  showToast('Download started — thank you! 🎉', 'success');
}

/* ── Bind view buttons ────────────────────────── */
docsGrid.addEventListener('click', (e) => {
  // View button
  const viewBtn = e.target.closest('.btn-view:not(.disabled)');
  if (viewBtn) {
    const viewUrl     = viewBtn.dataset.view;
    const downloadUrl = viewBtn.dataset.download;
    const title       = viewBtn.dataset.title;
    const type        = viewBtn.dataset.type;
    openModal(viewUrl, downloadUrl, title, type);
    return;
  }

  // Download button (card-level, not modal)
  const dlBtn = e.target.closest('.btn-download:not(.disabled)');
  if (dlBtn) {
    const url   = dlBtn.dataset.download;
    const title = dlBtn.dataset.title;
    const type  = dlBtn.dataset.type;
    triggerDownload(url, title, type);
  }
});

/* ── Search ───────────────────────────────────── */
searchInput.addEventListener('input', applyFilters);

/* ── Filter tabs ──────────────────────────────── */
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    applyFilters();
  });
});

function applyFilters() {
  const query  = searchInput.value.trim().toLowerCase();
  const active = document.querySelector('.filter-tab.active')?.dataset.filter || 'all';
  const cards  = docsGrid.querySelectorAll('.doc-card');
  let visible  = 0;

  cards.forEach(card => {
    const type     = card.dataset.type || '';
    const title    = (card.dataset.title || '').toLowerCase();
    const bodyText = card.querySelector('.doc-body')?.innerText.toLowerCase() || '';

    const matchesFilter = active === 'all' || type === active;
    const matchesSearch = !query || title.includes(query) || bodyText.includes(query);
    const isPlaceholder = card.classList.contains('placeholder');

    // Always show placeholders unless search query is active
    const show = isPlaceholder
      ? (!query && matchesFilter)
      : (matchesFilter && matchesSearch);

    card.style.display = show ? '' : 'none';
    if (show && !isPlaceholder) visible++;
  });

  // Show empty state only if no real docs visible and query exists
  emptyState.style.display = (visible === 0 && query) ? 'block' : 'none';
}

/* ── Notify form ──────────────────────────────── */
notifyForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const emailInput = document.getElementById('notifyEmail');
  const email = emailInput.value.trim();
  const btn = notifyForm.querySelector('button');

  if (!email) return;

  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
      // Notify owner of new subscriber
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
        to_email:       EMAILJS_CONFIG.ownerEmail,
        doc_title:      'N/A',
        doc_type:       'N/A',
        action:         `New subscriber: ${email}`,
        time:           new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }),
        user_agent:     navigator.userAgent.slice(0, 80),
      });
      showToast('You\'re subscribed! 🎉', 'success');
    } else {
      // EmailJS not configured — log and still show success to user
      console.info('Subscriber email (EmailJS not configured):', email);
      showToast('You\'re on the list! 🎉', 'success');
    }
    emailInput.value = '';
  } catch (err) {
    showToast('Something went wrong. Please try again.', 'error');
    console.error(err);
  } finally {
    btn.textContent = 'Notify Me';
    btn.disabled = false;
  }
});

/* ── Scroll reveal ────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

docsGrid.querySelectorAll('.doc-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(32px)';
  card.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
  revealObs.observe(card);
});

/* ── Page load ────────────────────────────────── */
window.scrollTo(0, 0);
