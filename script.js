// Dynamic interactions: nav toggle, smooth scroll, reveal on scroll, project filtering

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  navToggle?.addEventListener('click', () => {
    navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
  });

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

  eventImages.forEach((img) => {
    img.classList.add('clickable-event-image');
    img.addEventListener('click', () => {
      lightboxImage.src = img.currentSrc || img.src;
      lightboxImage.alt = img.alt || 'Event image';
      lightbox.classList.add('visible');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('visible');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lightboxClose?.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
      closeLightbox();
    }
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

  lightbox.appendChild(image);
  lightbox.appendChild(closeButton);
  document.body.appendChild(lightbox);

  return lightbox;
}
