// Dynamic interactions: nav toggle, smooth scroll, reveal on scroll, project filtering

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Nav toggle (mobile menu sheet with a tap-to-close scrim)
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  let navScrim = null;
  if (navToggle && navList) {
    navScrim = document.createElement('div');
    navScrim.className = 'nav-scrim';
    navScrim.setAttribute('aria-hidden', 'true');
    (document.querySelector('.site-header') || document.body).prepend(navScrim);
  }
  const setMenuOpen = (open) => {
    if (!navList) return;
    navList.classList.toggle('open', open);
    navScrim?.classList.toggle('visible', open);
    navToggle?.classList.toggle('is-open', open);
    navToggle?.setAttribute('aria-expanded', String(open));
    if (navToggle) navToggle.textContent = open ? '✕' : '☰';
  };
  navToggle?.addEventListener('click', () => setMenuOpen(!navList.classList.contains('open')));
  navScrim?.addEventListener('click', () => setMenuOpen(false));
  navList?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenuOpen(false); });

  initMobileTabbar(() => setMenuOpen(false));
  initMobileEventsTimeline();

  initHomeMotion();
  initSideRail();
  initExperienceTimeline();
  initNavScrollState();
  initCustomCursor();
  initParticleField();
  initCardTilt();
  initButtonRipple();
  initHeroGlitch();
  initCountUp();

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });

  // Reveal on scroll animation
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, {threshold: 0.12});
  reveals.forEach(r => obs.observe(r));

  // Project filter
  const filter = document.getElementById('project-filter');
  const projects = Array.from(document.querySelectorAll('.project'));
  filter?.addEventListener('change', () => {
    const v = filter.value;
    projects.forEach(p => {
      if (v === 'all' || p.dataset.type === v) p.style.display = '';
      else p.style.display = 'none';
    });
  });

  // Slideshow initialization
  initSlideshows();

  // Certifications category filters
  initCertificationPageFilters();

  // Event images click-to-grow viewer
  initEventImageLightbox();

  // Create WIP overlay once
  ensureWipOverlay();
  const overlayCloseBtn = document.querySelector('#wip-overlay .close-btn');

  // Wire certification switches to show/hide overlay
  const certSwitches = document.querySelectorAll('#certifications .switch input');
  certSwitches.forEach(sw => {
    sw.addEventListener('change', () => {
      if (sw.checked) showWipOverlay();
      else hideWipOverlay();
    });
  });

  // Page-specific overlay behavior
  // Close hides overlay and resets switches (certification pages)
  overlayCloseBtn?.addEventListener('click', () => { hideWipOverlay(); resetCertificationSwitches(); });

  // Contact form submission with Web3Forms
  const contactForm = document.getElementById('contact-form');
  const confirmationMessage = document.getElementById('confirmation-message');
  
  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        contactForm.style.display = 'none';
        confirmationMessage.classList.remove('confirmation-hidden');
        confirmationMessage.scrollIntoView({behavior: 'smooth', block: 'center'});
      } else {
        alert('There was an error sending your message. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error sending your message. Please try again.');
    }
  });
});

const MOBILE_QUERY = '(max-width: 720px)';
const isMobileViewport = () => window.matchMedia(MOBILE_QUERY).matches;

// Mobile bottom tab bar: injected on every page, shown only by mobile.css
function initMobileTabbar(onNavigate) {
  const isHome = document.body.classList.contains('home-page');
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const onEventPage = page === 'events.html' || !!document.querySelector('.site-footer a[href="events.html"]');
  const onCertPage = page === 'certifications.html';

  const icons = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h5v-6h4v6h5V9.5"/>',
    projects: '<path d="m8 8-5 4 5 4"/><path d="m16 8 5 4-5 4"/><path d="m14 4-4 16"/>',
    events: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    certs: '<circle cx="12" cy="9" r="6"/><path d="m8.5 13.8-1.5 7.2 5-3 5 3-1.5-7.2"/>',
    contact: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  };
  const tabs = [
    { key: 'home', label: 'Home', href: isHome ? '#home' : 'index.html' },
    { key: 'projects', label: 'Projects', href: isHome ? '#projects' : 'index.html#projects' },
    { key: 'events', label: 'Events', href: 'events.html' },
    { key: 'certs', label: 'Certs', href: 'certifications.html' },
    { key: 'contact', label: 'Contact', href: isHome ? '#contact' : 'index.html#contact' },
  ];

  const bar = document.createElement('nav');
  bar.className = 'mobile-tabbar';
  bar.setAttribute('aria-label', 'Main navigation');
  const links = {};
  tabs.forEach(tab => {
    const a = document.createElement('a');
    a.href = tab.href;
    a.dataset.tab = tab.key;
    a.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[tab.key]}</svg><span>${tab.label}</span>`;
    a.addEventListener('click', () => onNavigate?.());
    bar.appendChild(a);
    links[tab.key] = a;
  });
  document.body.appendChild(bar);

  const setActive = (key) => Object.entries(links).forEach(([k, a]) => {
    a.classList.toggle('active', k === key);
    if (k === key) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });

  if (!isHome) {
    setActive(onCertPage ? 'certs' : onEventPage ? 'events' : null);
    return;
  }

  // Home page: highlight the tab that matches the section in view
  const projects = document.getElementById('projects');
  const contact = document.getElementById('contact');
  let ticking = false;
  const update = () => {
    ticking = false;
    const probe = window.scrollY + window.innerHeight * 0.4;
    const top = (el) => el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    let key = null;
    if (atBottom || probe >= top(contact)) key = 'contact';
    else if (probe >= top(projects) && probe < top(document.getElementById('competitions') || contact)) key = 'projects';
    else if (window.scrollY < window.innerHeight * 0.6) key = 'home';
    setActive(key);
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

// Events page on mobile: the timeline is a swipeable chip row, start it at the latest event
function initMobileEventsTimeline() {
  const track = document.querySelector('.events-timeline-track');
  if (!track || !isMobileViewport()) return;
  requestAnimationFrame(() => { track.scrollLeft = track.scrollWidth; });
}

// Right-edge section rail: one dot per section, active highlight, counter, back-to-top
function initSideRail() {
  if (!document.body.classList.contains('home-page')) return;

  const targets = [document.getElementById('home'), ...document.querySelectorAll('main section[id]')].filter(Boolean);
  if (targets.length < 2) return;
  const pad = (n) => String(n).padStart(2, '0');
  const total = pad(targets.length);

  const rail = document.createElement('nav');
  rail.className = 'side-rail';
  rail.setAttribute('aria-label', 'Page sections');

  const count = document.createElement('div');
  count.className = 'rail-count';
  const countNow = document.createElement('b');
  count.append(countNow, `/${total}`);

  const list = document.createElement('ol');
  list.className = 'rail-list';
  const entries = targets.map((section, i) => {
    const heading = section.querySelector('h2');
    const name = section.id === 'home' ? 'Home' : (heading ? heading.textContent.trim() : section.id);

    const li = document.createElement('li');
    li.className = 'rail-item';
    const link = document.createElement('a');
    link.className = 'rail-link';
    link.href = `#${section.id}`;
    link.setAttribute('aria-label', name);
    const label = document.createElement('span');
    label.className = 'rail-label';
    const num = document.createElement('i');
    num.textContent = pad(i + 1);
    label.append(num, name);
    const dot = document.createElement('span');
    dot.className = 'rail-dot';
    link.append(label, dot);
    li.appendChild(link);
    list.appendChild(li);
    return { section, li, link };
  });

  const top = document.createElement('a');
  top.className = 'rail-top';
  top.href = '#home';
  top.setAttribute('aria-label', 'Back to top');
  top.textContent = '↑';

  rail.append(count, list, top);
  document.body.appendChild(rail);

  let ticking = false;
  const update = () => {
    ticking = false;
    const probe = window.scrollY + window.innerHeight * 0.4;
    let current = 0;
    entries.forEach((entry, i) => {
      if (entry.section.getBoundingClientRect().top + window.scrollY <= probe) current = i;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = entries.length - 1;

    entries.forEach((entry, i) => {
      entry.li.classList.toggle('is-active', i === current);
      entry.li.classList.toggle('is-passed', i < current);
      if (i === current) entry.link.setAttribute('aria-current', 'true');
      else entry.link.removeAttribute('aria-current');
    });
    countNow.textContent = pad(current + 1);
    rail.classList.toggle('is-visible', window.scrollY > 240);
  };
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
}

// Experience timeline: the connecting line fills and nodes light up as you scroll past them
function initExperienceTimeline() {
  const track = document.querySelector('.timeline-track');
  const items = track ? Array.from(track.querySelectorAll('.tl-item')) : [];
  if (!items.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NODE_Y = 32;
  let ticking = false;

  const update = () => {
    ticking = false;
    const gap = parseFloat(getComputedStyle(track).rowGap) || 0;
    const ref = window.innerHeight * 0.55;
    let lastReached = -1;

    items.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      const nodeY = rect.top + NODE_Y;
      const reached = reduceMotion || ref >= nodeY;
      const progress = reduceMotion ? 1 : Math.min(1, Math.max(0, (ref - nodeY) / (rect.height + gap)));
      item.classList.toggle('is-reached', reached);
      item.style.setProperty('--seg', progress.toFixed(3));
      if (reached) lastReached = i;
    });
    items.forEach((item, i) => item.classList.toggle('is-current', !reduceMotion && i === lastReached));
  };
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
}

function initNavScrollState() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initCustomCursor() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches;
  if (reduceMotion || coarsePointer) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  document.body.classList.add('has-custom-cursor');

  let ringX = window.innerWidth / 2, ringY = window.innerHeight / 2;
  let targetX = ringX, targetY = ringY;

  window.addEventListener('pointermove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    dot.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%,-50%)`;
  });

  const animateRing = () => {
    ringX += (targetX - ringX) * 0.18;
    ringY += (targetY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateRing);
  };
  requestAnimationFrame(animateRing);

  const interactiveSelector = 'a, button, .card, input, textarea, select';
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest(interactiveSelector)) ring.classList.add('is-active');
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest(interactiveSelector)) ring.classList.remove('is-active');
  });
}

function initParticleField() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (isMobileViewport()) return; // save battery and keep scrolling smooth on phones

  const canvas = document.createElement('canvas');
  canvas.className = 'fx-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');

  let width, height, nodes;

  const buildNodes = () => {
    const count = Math.min(70, Math.round((width * height) / 22000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }));
  };

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    buildNodes();
  };
  window.addEventListener('resize', resize);
  resize();

  const linkDist = 140;
  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDist) {
          ctx.strokeStyle = `rgba(94,231,247,${0.14 * (1 - dist / linkDist)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(94,231,247,.55)';
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}

function initCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const bounds = card.getBoundingClientRect();
      const px = (e.clientX - bounds.left) / bounds.width;
      const py = (e.clientY - bounds.top) / bounds.height;
      const rotateY = (px - 0.5) * 8;
      const rotateX = (0.5 - py) * 8;
      card.style.setProperty('--rx', `${rotateX}deg`);
      card.style.setProperty('--ry', `${rotateY}deg`);
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

function initButtonRipple() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const bounds = btn.getBoundingClientRect();
    const size = Math.max(bounds.width, bounds.height) * 1.6;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - bounds.left}px`;
    ripple.style.top = `${e.clientY - bounds.top}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

function initHeroGlitch() {
  const name = document.querySelector('.hero .name');
  if (!name) return;
  name.dataset.text = name.textContent;
  requestAnimationFrame(() => name.classList.add('glitch-in'));
}

function initCountUp() {
  const metrics = document.querySelectorAll('.hero-metrics strong');
  if (!metrics.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateMetric = (el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)(.*)$/);
    if (!match) return;
    const [, digits, suffix] = match;
    const target = parseInt(digits, 10);
    if (reduceMotion) return;

    const duration = 1100;
    const start = performance.now();
    const pad = digits.length;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.textContent = `${String(value).padStart(pad, '0')}${suffix}`;
      if (t < 1) requestAnimationFrame(step);
    };
    el.textContent = `${'0'.padStart(pad, '0')}${suffix}`;
    requestAnimationFrame(step);
  };

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateMetric(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  metrics.forEach((el) => obs.observe(el));
}

function initHomeMotion() {
  if (!document.body.classList.contains('home-page')) return;

  const progress = document.querySelector('.scroll-progress span');
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-list a[href^="#"]'));
  const portrait = document.querySelector('.portrait-frame');

  const updateScrollState = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
    const current = sections.reduce((active, section) => window.scrollY + 180 >= section.offsetTop ? section.id : active, 'cursus');
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  document.querySelector('.hero')?.addEventListener('pointermove', (event) => {
    if (!portrait || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5;
    const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
    portrait.style.transform = `rotate(-3deg) perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  document.querySelector('.hero')?.addEventListener('pointerleave', () => {
    if (portrait) portrait.style.transform = 'rotate(-3deg)';
  });
}

// Slideshow functionality
let slideIndex = 1;
let slideTimer = null;

function initSlideshows() {
  showSlides(slideIndex);
  // Ensure auto-play starts immediately
  setTimeout(() => {
    autoAdvanceSlide();
  }, 1500);
}

function autoAdvanceSlide() {
  slideIndex++;
  let slides = document.getElementsByClassName("mySlides");
  if (slides.length === 0) return;
  
  if (slideIndex > slides.length) slideIndex = 1;
  showSlides(slideIndex);
  
  // Schedule next advance
  slideTimer = setTimeout(() => {
    autoAdvanceSlide();
  }, 2000);
}

function startAutoSlideshow() {
  if (slideTimer) clearTimeout(slideTimer);
  slideTimer = setTimeout(() => {
    autoAdvanceSlide();
  }, 2000);
}

// Next/previous controls
function plusSlides(n) {
  if (slideTimer) clearTimeout(slideTimer);
  slideIndex += n;
  showSlides(slideIndex);
  startAutoSlideshow();
}

// Thumbnail image controls
function currentSlide(n) {
  if (slideTimer) clearTimeout(slideTimer);
  slideIndex = n;
  showSlides(slideIndex);
  startAutoSlideshow();
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  
  if (slides.length === 0) return;
  
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

// WIP overlay helpers
function ensureWipOverlay(){
  if (document.getElementById('wip-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'wip-overlay';
  overlay.className = 'wip-overlay';
  const content = document.createElement('div');
  content.className = 'overlay-content';
  const img = document.createElement('img');
  img.src = 'Images/Work in Progress.jpg';
  img.alt = 'Work in Progress';
  const close = document.createElement('button');
  close.className = 'close-btn';
  close.type = 'button';
  close.textContent = 'Close';
  content.appendChild(img);
  content.appendChild(close);
  overlay.appendChild(content);
  document.body.appendChild(overlay);
}

function showWipOverlay(){
  const overlay = document.getElementById('wip-overlay');
  overlay?.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function hideWipOverlay(){
  const overlay = document.getElementById('wip-overlay');
  overlay?.classList.remove('visible');
  document.body.style.overflow = '';
}

function resetCertificationSwitches(){
  const certSwitches = document.querySelectorAll('#certifications .switch input');
  certSwitches.forEach(sw => {
    sw.checked = false;
  });
}

// Event images lightbox
function initEventImageLightbox() {
  const eventImages = document.querySelectorAll('.event-gallery img');
  if (!eventImages.length) return;

  const lightbox = ensureEventImageLightbox();
  const lightboxImage = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.event-image-lightbox-close');
  const counter = lightbox.querySelector('.event-image-lightbox-counter');
  const prevBtn = lightbox.querySelector('.event-image-lightbox-prev');
  const nextBtn = lightbox.querySelector('.event-image-lightbox-next');
  const images = Array.from(eventImages);
  let current = 0;

  const show = (index) => {
    current = (index + images.length) % images.length;
    const img = images[current];
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt || 'Event image';
    counter.textContent = `${current + 1} / ${images.length}`;
  };

  images.forEach((img, i) => {
    img.classList.add('clickable-event-image');
    img.addEventListener('click', () => {
      show(i);
      lightbox.classList.add('visible');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('visible');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImage.style.transform = '';
  };

  // Tap the backdrop (not the photo or controls) to close
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lightboxClose?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => show(current - 1));
  nextBtn?.addEventListener('click', () => show(current + 1));
  if (images.length < 2) { prevBtn.hidden = true; nextBtn.hidden = true; }

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('visible')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });

  // Touch: swipe left/right to browse, swipe down to close
  let startX = 0, startY = 0, dx = 0, dy = 0, tracking = false;
  lightbox.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    tracking = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    dx = dy = 0;
    lightboxImage.style.transition = 'none';
  }, { passive: true });
  lightbox.addEventListener('touchmove', (e) => {
    if (!tracking) return;
    dx = e.touches[0].clientX - startX;
    dy = e.touches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy)) lightboxImage.style.transform = `translateX(${dx}px)`;
    else if (dy > 0) lightboxImage.style.transform = `translateY(${dy}px) scale(${Math.max(0.85, 1 - dy / 1200)})`;
  }, { passive: true });
  lightbox.addEventListener('touchend', () => {
    if (!tracking) return;
    tracking = false;
    lightboxImage.style.transition = '';
    lightboxImage.style.transform = '';
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
    else if (dy > 90 && dy > Math.abs(dx)) closeLightbox();
  });
}

function ensureEventImageLightbox() {
  const existing = document.getElementById('event-image-lightbox');
  if (existing) return existing;

  const lightbox = document.createElement('div');
  lightbox.id = 'event-image-lightbox';
  lightbox.className = 'event-image-lightbox';
  lightbox.setAttribute('aria-hidden', 'true');

  const image = document.createElement('img');
  image.alt = 'Event image preview';

  const closeButton = document.createElement('button');
  closeButton.className = 'event-image-lightbox-close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close image preview');
  closeButton.textContent = '✕';

  const prev = document.createElement('button');
  prev.className = 'event-image-lightbox-nav event-image-lightbox-prev';
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Previous photo');
  prev.textContent = '‹';

  const next = document.createElement('button');
  next.className = 'event-image-lightbox-nav event-image-lightbox-next';
  next.type = 'button';
  next.setAttribute('aria-label', 'Next photo');
  next.textContent = '›';

  const counter = document.createElement('div');
  counter.className = 'event-image-lightbox-counter';
  counter.setAttribute('aria-live', 'polite');

  lightbox.appendChild(image);
  lightbox.appendChild(prev);
  lightbox.appendChild(next);
  lightbox.appendChild(counter);
  lightbox.appendChild(closeButton);
  document.body.appendChild(lightbox);

  return lightbox;
}

function initCertificationPageFilters() {
  const page = document.getElementById('certifications-page');
  if (!page) return;

  const toggle = document.getElementById('show-all-certs-toggle');
  const buttons = Array.from(document.querySelectorAll('.cert-filter-btn'));
  const sections = Array.from(document.querySelectorAll('.cert-category-section'));
  const providerCheckboxes = Array.from(document.querySelectorAll('.provider-filter'));

  const categoryGroup = document.getElementById('category-filter-group') || document.querySelector('.cert-filter-group');
  const providerGroup = document.getElementById('provider-filter-group');
  const modeToggleBtn = document.getElementById('filter-mode-toggle');

  // filter mode: 'category' (default) or 'provider'
  let filterMode = 'category';

  let selectedCategory = buttons.find(btn => btn.classList.contains('active'))?.dataset.filter || 'cybersecurity';

  // ensure provider controls hidden initially (category-first UX)
  if (providerGroup) providerGroup.style.display = 'none';

  const getArticleProvider = (article) => {
    const issuerEl = article.querySelector('.issuer');
    if (!issuerEl) return '';
    const txt = issuerEl.textContent.toLowerCase();
    if (txt.includes('aws') || txt.includes('amazon')) return 'AWS';
    if (txt.includes('ine') || txt.includes('elearn')) return 'INE';
    if (txt.includes('cyberwarfare') || txt.includes('cyberwarfare labs') || txt.includes('cwl')) return 'CyberWarfare';
    if (txt.includes('microsoft')) return 'Microsoft';
    if (txt.includes('red hat') || txt.includes('redhat')) return 'Red Hat';
    if (txt.includes('tryhackme')) return 'TryHackMe';
    if (txt.includes('python institute') || txt.includes('python')) return 'Python Institute';
    return 'Other';
  };
  const applyFilter = () => {
    const showAll = !!toggle?.checked;

    // determine selected providers (empty = all)
    const selectedProviders = providerCheckboxes.filter(c => c.checked).map(c => c.value);
    // provider mode: render a flat deduplicated results list
    if (filterMode === 'provider') {
      const container = ensureProviderResultsContainer();
      container.innerHTML = '';
      const seen = new Set();

      // hide original category sections while showing provider results
      sections.forEach(s => s.style.display = 'none');

      // ensure all articles are considered even if previously hidden by category filtering
      const allArticles = Array.from(document.querySelectorAll('article.card'));
      allArticles.forEach(a => { a.style.display = ''; });

      allArticles.forEach(a => {
        const prov = getArticleProvider(a);
        const matches = selectedProviders.length === 0 || selectedProviders.includes(prov);
        if (!matches) return;

        // compute stable key: prefer explicit data-cert-id, then badge image src, then credential link href, then title
        let key = a.dataset.certId;
        if (!key) {
          const img = a.querySelector('.badge-img');
          if (img && img.src) key = (img.src || '').split('?')[0].split('#')[0].toLowerCase();
        }
        if (!key) {
          const credLink = a.querySelector('.cert-links a[href]');
          if (credLink && credLink.href) key = (credLink.href || '').split('?')[0].split('#')[0];
        }
        if (!key) key = a.querySelector('h3')?.textContent.trim();

        if (!key || seen.has(key)) return;
        seen.add(key);
        const clone = a.cloneNode(true);
        clone.classList.remove('reveal','visible');
        container.appendChild(clone);
      });

      container.style.display = container.children.length ? '' : 'none';
      return;
    }

    // category mode: provider controls ignored; show articles for selected category (or all)
    sections.forEach(section => {
      const articles = Array.from(section.querySelectorAll('article.card'));
      const categoryMatch = showAll || section.dataset.category === selectedCategory;

      articles.forEach(a => {
        a.style.display = categoryMatch ? '' : 'none';
      });

      section.style.display = categoryMatch ? '' : 'none';
    });
  };

  // create or return provider results container (flat list) inserted after controls
  function ensureProviderResultsContainer() {
    let container = document.getElementById('provider-results');
    if (container) return container;
    const controls = document.querySelector('.certifications-controls');
    container = document.createElement('div');
    container.id = 'provider-results';
    container.className = 'grid cert-grid provider-results';
    container.style.display = 'none';
    if (controls && controls.parentNode) controls.parentNode.insertBefore(container, controls.nextSibling);
    else if (sections.length) sections[0].parentNode.insertBefore(container, sections[0]);
    else page.appendChild(container);
    return container;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCategory = btn.dataset.filter;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // ensure category mode when clicking categories
      filterMode = 'category';
      if (providerGroup) providerGroup.style.display = 'none';
      if (modeToggleBtn) modeToggleBtn.textContent = 'Use provider filters';

      if (toggle) toggle.checked = false;
      applyFilter();
    });
  });

  // mode toggle: switch between category-first UX and provider mode
  modeToggleBtn?.addEventListener('click', () => {
    if (filterMode === 'category') {
      filterMode = 'provider';
      // show provider controls (use flex to override stylesheet hiding)
      if (providerGroup) providerGroup.style.display = 'flex';
      // visually disable category buttons
      buttons.forEach(b => b.disabled = true);
      // clear provider selections so all certs show initially
      providerCheckboxes.forEach(cb => cb.checked = false);
      modeToggleBtn.textContent = 'Back to categories';
    } else {
      filterMode = 'category';
      if (providerGroup) providerGroup.style.display = 'none';
      buttons.forEach(b => b.disabled = false);
      modeToggleBtn.textContent = 'Use provider filters';
      // hide and clear provider results when returning to category mode
      const pr = document.getElementById('provider-results');
      if (pr) {
        pr.style.display = 'none';
        pr.innerHTML = '';
      }
    }

    // apply the filter immediately in the chosen mode
    applyFilter();
  });

  toggle?.addEventListener('change', applyFilter);
  providerCheckboxes.forEach(cb => cb.addEventListener('change', () => {
    // provider changes only apply in provider mode
    if (filterMode === 'provider') applyFilter();
  }));

  applyFilter();
}
