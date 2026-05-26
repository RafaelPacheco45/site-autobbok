/* ===========================
   AUTOBOOK — SCRIPT.JS
=========================== */

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== MOBILE HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMobile.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-mobile-link, .nav-mobile .btn').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMobile.classList.remove('open');
  });
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

// Stagger sibling reveals
function staggerReveal(container, selector, baseDelay = 80) {
  const items = container.querySelectorAll(selector);
  items.forEach((item, index) => {
    item.dataset.delay = index * baseDelay;
  });
}

document.querySelectorAll('.benefits-grid').forEach(g => staggerReveal(g, '.benefit-card', 90));
document.querySelectorAll('.features-grid').forEach(g => staggerReveal(g, '.feature-card', 60));
document.querySelectorAll('.partners-grid').forEach(g => staggerReveal(g, '.partner-card', 100));
document.querySelectorAll('.steps-container').forEach(g => staggerReveal(g, '.step', 120));
document.querySelectorAll('.metrics-container').forEach(g => staggerReveal(g, '.metric-item', 100));
document.querySelectorAll('.faq-list').forEach(g => staggerReveal(g, '.faq-item', 70));

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== FAQ ACCORDION =====
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item.open').forEach(openItem => {
    openItem.classList.remove('open');
  });

  // Open clicked if it was closed
  if (!isOpen) {
    item.classList.add('open');
  }
}
window.toggleFaq = toggleFaq;

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(s => sectionObserver.observe(s));

// ===== RANK BAR ANIMATION ON SCROLL =====
const rankBarsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.rank-bar');
        bars.forEach(bar => {
          const targetW = bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => { bar.style.width = targetW; }, 150);
        });
        rankBarsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

const rankCard = document.querySelector('.rank-card-wrap');
if (rankCard) rankBarsObserver.observe(rankCard);

// ===== NUMBER COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1800) {
  const isDecimal = String(target).includes('.');
  let start = 0;
  const increment = target / (duration / 16);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    const display = isDecimal
      ? start.toFixed(1)
      : Math.floor(start).toLocaleString('pt-BR');
    el.textContent = prefix + display + suffix;
  }, 16);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.dataset.target;
        if (raw) animateCounter(el, parseFloat(raw));
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

// Setup counter targets
const metricNumbers = document.querySelectorAll('.metric-number');
const metricTargets = [500, 2000, 50, 1];
metricNumbers.forEach((el, i) => {
  const t = metricTargets[i];
  if (t !== undefined) {
    el.dataset.target = t;
    el.dataset.suffix = i === 0 ? '+' : i === 1 ? '+' : i === 2 ? '+' : '';
    el.textContent = '0';
    counterObserver.observe(el);
  }
});

// ===== PARALLAX SUBTLE on hero glows =====
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const glow1 = document.querySelector('.hero-glow-1');
  const glow2 = document.querySelector('.hero-glow-2');
  if (glow1) glow1.style.transform = `translateY(${scrolled * 0.15}px)`;
  if (glow2) glow2.style.transform = `translateY(${scrolled * -0.1}px)`;
}, { passive: true });

// ===== CURSOR GLOW EFFECT on cards =====
document.querySelectorAll('.benefit-card, .feature-card, .partner-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(14,165,233,0.07), transparent 60%), var(--bg-card)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

// ===== NAV ACTIVE STYLE =====
const style = document.createElement('style');
style.textContent = `.nav-link.active { color: var(--blue-400) !important; }`;
document.head.appendChild(style);
