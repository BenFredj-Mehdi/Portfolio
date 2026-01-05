// Dynamic interactions: nav toggle, smooth scroll, reveal on scroll, project filtering

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

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
});
