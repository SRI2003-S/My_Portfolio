// ========================
// GAMING PORTFOLIO - MAIN.JS
// ========================

// Particle generator for hero background
(function generateParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const delay = Math.random() * 8;
    const dur = Math.random() * 6 + 6;
    p.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      background: rgba(0, 240, 255, ${Math.random() * 0.5 + 0.1});
      border-radius: 50%;
      left: ${x}%;
      bottom: -10px;
      animation: floatUp ${dur}s ${delay}s infinite linear;
      box-shadow: 0 0 ${size * 2}px rgba(0,240,255,0.5);
    `;
    container.appendChild(p);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatUp {
      0%   { transform: translateY(0) translateX(0); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 0.5; }
      100% { transform: translateY(-100vh) translateX(${Math.random()>0.5?'':'-'}${Math.random()*80}px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

// Filter buttons on projects page
(function initFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.proj-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.cat === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeUp 0.4s both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

// Contact form submit
function handleSubmit(e) {
  e.preventDefault();
  const success = document.getElementById('formSuccess');
  if (success) {
    success.style.display = 'block';
    e.target.reset();
    setTimeout(() => { success.style.display = 'none'; }, 5000);
  }
}

// Scroll reveal for cards / sections
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeUp 0.6s both';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .proj-card, .tl-card, .cl-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
})();

// Glitch effect on nav logo hover
(function initGlitch() {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;
  logo.addEventListener('mouseenter', () => {
    logo.style.animation = 'glitch 0.3s steps(2)';
    setTimeout(() => { logo.style.animation = ''; }, 300);
  });
})();

// Add glitch keyframes
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
  @keyframes glitch {
    0%   { text-shadow: 2px 0 #ff0055, -2px 0 #00f0ff; }
    25%  { text-shadow: -2px 0 #ff0055, 2px 0 #00f0ff; clip-path: inset(10% 0 80% 0); }
    50%  { text-shadow: 2px 0 #39ff14, -2px 0 #ffcc00; clip-path: inset(40% 0 40% 0); }
    75%  { text-shadow: -2px 0 #ff0055, 2px 0 #00f0ff; clip-path: inset(70% 0 5% 0); }
    100% { text-shadow: none; clip-path: none; }
  }
`;
document.head.appendChild(glitchStyle);

// Custom cursor trail
(function initCursor() {
  const trail = [];
  const trailLen = 8;
  for (let i = 0; i < trailLen; i++) {
    const dot = document.createElement('div');
    const size = (trailLen - i) * 1.5 + 2;
    dot.style.cssText = `
      position: fixed;
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: rgba(0, 240, 255, ${0.5 - i * 0.05});
      pointer-events: none;
      z-index: 99999;
      transition: transform 0.05s;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animTrail() {
    let x = mx, y = my;
    trail.forEach((dot, i) => {
      dot.x += (x - dot.x) * 0.4;
      dot.y += (y - dot.y) * 0.4;
      dot.el.style.left = (dot.x - dot.el.offsetWidth / 2) + 'px';
      dot.el.style.top  = (dot.y - dot.el.offsetHeight / 2) + 'px';
      if (i < trail.length - 1) {
        x = dot.x; y = dot.y;
      }
    });
    requestAnimationFrame(animTrail);
  }
  animTrail();
})();
