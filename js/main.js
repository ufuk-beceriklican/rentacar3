/* ========================================================
   Yaşar Rent a Car — main.js
   Features: Hamburger, Scroll Reveal, Active Nav, 
             Progress Bar, Form Handling (mailto fallback)
======================================================== */

'use strict';

/* ---- DOM Ready ---- */
document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initStickyHeader();
  initHamburger();
  initScrollReveal();
  initActiveNav();
  initReservationForm();
});

/* ==============================
   SCROLL PROGRESS BAR
============================== */
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const max = document.body.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
  }, { passive: true });
}

/* ==============================
   STICKY HEADER
============================== */
function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==============================
   HAMBURGER MENU
============================== */
function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const body = document.body;

  if (!btn || !mobileNav) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    body.style.overflow = isOpen ? 'hidden' : '';
    btn.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      mobileNav.classList.remove('open');
      body.style.overflow = '';
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !mobileNav.contains(e.target)) {
      btn.classList.remove('open');
      mobileNav.classList.remove('open');
      body.style.overflow = '';
    }
  });
}

/* ======================================================
   SCROLL REVEAL — Fade Up + Stagger
   Transition-based (see CSS .reveal / .reveal.visible)
====================================================== */
function initScrollReveal() {
  // Collect all .reveal elements first
  const allReveal = document.querySelectorAll('.reveal');
  if (!allReveal.length) return;

  // Assign stagger delays to cards inside grids
  // Only set the CSS custom property — do NOT re-observe or re-add classes
  const staggerParents = document.querySelectorAll(
    '.features-grid, .cars-grid, .contact-cards, .about-stats'
  );
  staggerParents.forEach(parent => {
    // Select direct card children that already have .reveal
    const cards = parent.querySelectorAll('.reveal');
    cards.forEach((card, i) => {
      // Cap at index 4 so last card doesn't wait too long
      card.style.setProperty('--card-delay', (Math.min(i, 4) * 110) + 'ms');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once only
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  // Observe each element exactly once (allReveal collected before stagger)
  allReveal.forEach(el => observer.observe(el));
}


/* ==============================
   ACTIVE NAV LINK
============================== */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], #hero');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => observer.observe(sec));
}

/* ==============================
   RESERVATION FORM
======================================================
   Uses Web3Forms API (https://web3forms.com)
   Access Key: 1e1286a0-741d-4bf4-89c4-2bbf3df93a7a
   Emails are sent to the verified address at web3forms.com
============================== */
function initReservationForm() {
  const form = document.getElementById('rezervasyon-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const kvkk = document.getElementById('kvkk-check');
    if (kvkk && !kvkk.checked) {
      alert('Lütfen KVKK metnini onaylayın.');
      return;
    }

    const submitBtn = form.querySelector('.btn-submit');
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>⏳</span> Gönderiliyor...';

    // Collect form data
    const formData = new FormData(form);

    // Build a readable message from all fields for the email body
    const adSoyad = formData.get('ad-soyad') || '-';
    const telefon = formData.get('telefon') || '-';
    const email = formData.get('email') || '-';
    const arac = formData.get('arac') || '-';
    const alisTarihi = formData.get('alis-tarihi') || '-';
    const teslimTarihi = formData.get('teslim-tarihi') || '-';
    const alisYeri = formData.get('alis-yeri') || '-';
    const tip = formData.get('tip') || '-';
    const mesaj = formData.get('mesaj') || '-';

    const emailBody = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YENİ REZERVASYON TALEBİ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ad Soyad       : ${adSoyad}
Telefon        : ${telefon}
E-posta        : ${email}

Araç           : ${arac}
Alış Tarihi    : ${alisTarihi}
Teslim Tarihi  : ${teslimTarihi}
Alış Yeri      : ${alisYeri}
Müşteri Tipi   : ${tip}

Mesaj          : ${mesaj}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Yaşar Rent a Car Web Sitesi
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    // Prepare payload for Web3Forms
    const payload = new FormData();
    payload.append('access_key', '1e1286a0-741d-4bf4-89c4-2bbf3df93a7a');
    payload.append('subject', `Yaşar Rent a Car - Yeni Rezervasyon: ${adSoyad}`);
    payload.append('from_name', 'Yaşar Rent a Car Web Sitesi');
    payload.append('message', emailBody);
    payload.append('name', adSoyad);
    payload.append('email', email || 'bildirilmedi@yasar.com');
    payload.append('phone', telefon);
    payload.append('botcheck', '');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: payload
      });

      const result = await response.json();

      if (result.success) {
        showSuccess();
      } else {
        // API returned error
        console.error('Web3Forms error:', result);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        alert('Gönderim başarısız oldu: ' + (result.message || 'Bilinmeyen hata') + '\nLütfen bizi telefon ile arayın: 0554 823 46 85');
      }
    } catch (err) {
      // Network error - fallback to mailto
      console.error('Network error, falling back to mailto:', err);
      const subject = encodeURIComponent('Yaşar Rent a Car - Rezervasyon Talebi');
      const bodyText = `Ad Soyad: ${adSoyad}\nTelefon: ${telefon}\nE-posta: ${email}\nAraç: ${arac}\nAlış Tarihi: ${alisTarihi}\nTeslim Tarihi: ${teslimTarihi}\nAlış Yeri: ${alisYeri}\nMüşteri Tipi: ${tip}\nMesaj: ${mesaj}`;
      const bodyEncoded = encodeURIComponent(bodyText);
      window.open(`mailto:yasar.byrke@gmail.com?subject=${subject}&body=${bodyEncoded}`, '_blank');
      setTimeout(showSuccess, 600);
    }
  });

  function showSuccess() {
    const formContent = form.querySelector('.form-inner');
    const successMsg = form.querySelector('.form-success');
    if (formContent) formContent.style.display = 'none';
    if (successMsg) successMsg.style.display = 'block';
  }
}

/* ==============================
   SMOOTH ANCHOR SCROLL
============================== */
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const target = document.querySelector(anchor.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  const offset = document.querySelector('header')?.offsetHeight || 80;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
});

/* ==============================
   LAZY LOAD IMAGES (native)
   already handled via loading="lazy" attr in HTML,
   this is a JS fallback for older browsers
============================== */
if ('loading' in HTMLImageElement.prototype === false) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        imgObserver.unobserve(img);
      }
    });
  });
  images.forEach(img => imgObserver.observe(img));
}
