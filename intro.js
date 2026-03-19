// ================================
// EPIC INTRO ANIMATION - intro.js (FIXED)
// ================================

(function () {
  if (!document.querySelector('.hero')) return;

  // ---- Build the overlay ----
  const overlay = document.createElement('div');
  overlay.id = 'intro-overlay';
  overlay.innerHTML = `
    <canvas id="intro-canvas"></canvas>
    <div class="intro-center">
      <div class="intro-logo-wrap">
        <div class="intro-bracket left">[</div>
        <div class="intro-name">
          <span class="intro-char" style="--i:0">S</span>
          <span class="intro-char" style="--i:1">R</span>
          <span class="intro-char" style="--i:2">I</span>
          <span class="intro-char" style="--i:3">N</span>
          <span class="intro-char" style="--i:4">E</span>
          <span class="intro-char" style="--i:5">S</span>
          <span class="intro-char" style="--i:6">H</span>
        </div>
        <div class="intro-bracket right">]</div>
      </div>
      <div class="intro-tagline">
        <span class="intro-type" id="introType"></span><span class="intro-cursor">_</span>
      </div>
      <div class="intro-code-rain" id="codeRain"></div>
      <div class="intro-bar-wrap">
        <div class="intro-bar-label" id="introBarLabel">INITIALIZING...</div>
        <div class="intro-bar-track">
          <div class="intro-bar-fill" id="introBarFill"></div>
        </div>
        <div class="intro-bar-pct" id="introBarPct">0%</div>
      </div>
      <div class="intro-skip" id="introSkip">PRESS ANY KEY OR CLICK TO SKIP</div>
    </div>
    <div class="intro-corners">
      <div class="ic tl"></div>
      <div class="ic tr"></div>
      <div class="ic bl"></div>
      <div class="ic br"></div>
    </div>
    <div class="intro-scanlines"></div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  // ---- STYLES ----
  const style = document.createElement('style');
  style.textContent = `
    #intro-overlay {
      position: fixed; inset: 0; background: #02020f;
      z-index: 999999; display: flex; align-items: center;
      justify-content: center; overflow: hidden;
    }
    #intro-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
    .intro-scanlines {
      position: absolute; inset: 0; pointer-events: none; z-index: 2;
      background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px);
    }
    .intro-center {
      position: relative; z-index: 10; display: flex; flex-direction: column;
      align-items: center; gap: 1.5rem; text-align: center; padding: 2rem;
    }
    .intro-logo-wrap { display: flex; align-items: center; gap: 0.8rem; }
    .intro-bracket {
      font-family: 'Orbitron', sans-serif; font-size: clamp(2.5rem, 8vw, 5rem);
      color: #00f0ff; opacity: 0;
      animation: bracketIn 0.5s 0.3s both, bracketPulse 2s 0.8s infinite;
    }
    .intro-bracket.right { animation-delay: 0.5s, 1s; }
    @keyframes bracketIn { from { opacity:0; transform:scaleY(0); } to { opacity:1; transform:scaleY(1); } }
    @keyframes bracketPulse {
      0%,100% { text-shadow: 0 0 20px #00f0ff, 0 0 40px #00f0ff; }
      50%      { text-shadow: 0 0 40px #00f0ff, 0 0 80px #00f0ff, 0 0 120px #00f0ff; }
    }
    .intro-name { display: flex; gap: 0.1em; }
    .intro-char {
      font-family: 'Orbitron', sans-serif; font-weight: 900;
      font-size: clamp(2.5rem, 8vw, 5rem); opacity: 0; display: inline-block;
      animation: charDrop 0.4s calc(0.6s + var(--i) * 0.08s) cubic-bezier(0.2,1.4,0.5,1) both;
    }
    .intro-char:nth-child(odd)  { color: #fff; text-shadow: 0 0 20px rgba(255,255,255,0.4); }
    .intro-char:nth-child(even) { color: #00f0ff; text-shadow: 0 0 20px #00f0ff; }
    @keyframes charDrop {
      0%   { opacity:0; transform: translateY(-60px) rotateX(90deg); }
      100% { opacity:1; transform: translateY(0) rotateX(0); }
    }
    .intro-tagline {
      font-family: 'Orbitron', sans-serif; font-size: clamp(0.65rem, 2vw, 0.9rem);
      letter-spacing: 4px; color: #00f0ff; min-height: 1.5em;
      opacity: 0; animation: fadeIn 0.4s 1.4s both;
    }
    .intro-cursor { animation: blink 0.7s infinite; color: #ff0055; }
    @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
    @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
    .intro-code-rain {
      display: flex; gap: 0.3rem; height: 60px; overflow: hidden;
      opacity: 0; animation: fadeIn 0.4s 1.6s both;
    }
    .rain-col {
      font-family: 'Courier New', monospace; font-size: 0.65rem;
      color: #39ff14; text-shadow: 0 0 8px #39ff14;
      writing-mode: vertical-lr; letter-spacing: 4px;
      animation: rainFall linear infinite;
    }
    @keyframes rainFall {
      0%   { transform: translateY(-100%); opacity: 0; }
      10%  { opacity: 0.8; }
      90%  { opacity: 0.4; }
      100% { transform: translateY(100%); opacity: 0; }
    }
    .intro-bar-wrap { width: min(380px, 90vw); opacity: 0; animation: fadeIn 0.4s 1.8s both; }
    .intro-bar-label {
      font-family: 'Orbitron', sans-serif; font-size: 0.55rem;
      letter-spacing: 4px; color: #5a6a7a; margin-bottom: 0.5rem;
      text-align: left; transition: color 0.3s;
    }
    .intro-bar-track {
      height: 4px; background: rgba(0,240,255,0.1);
      border: 1px solid rgba(0,240,255,0.2); overflow: hidden;
    }
    .intro-bar-fill {
      height: 100%; width: 0%;
      background: linear-gradient(90deg, #00f0ff, #ff0055, #39ff14);
      background-size: 200% 100%; box-shadow: 0 0 12px #00f0ff;
      transition: width 0.4s ease; animation: barShimmer 1.5s linear infinite;
    }
    @keyframes barShimmer { 0% { background-position: 0% 0%; } 100% { background-position: 200% 0%; } }
    .intro-bar-pct {
      font-family: 'Orbitron', sans-serif; font-size: 0.55rem;
      letter-spacing: 2px; color: #00f0ff; text-align: right; margin-top: 0.3rem;
    }
    .intro-skip {
      font-family: 'Orbitron', sans-serif; font-size: 0.5rem;
      letter-spacing: 4px; color: rgba(90,106,122,0.6); cursor: pointer;
      opacity: 0; animation: fadeIn 0.4s 1s both, skipBlink 2s 2s infinite;
    }
    @keyframes skipBlink { 0%,100% { opacity:0.6 } 50% { opacity:0.2 } }
    .intro-corners { position: absolute; inset: 20px; pointer-events: none; z-index: 5; }
    .ic { position: absolute; width: 30px; height: 30px; opacity: 0; animation: fadeIn 0.4s 0.2s both; }
    .ic.tl { top:0; left:0;    border-top:2px solid #00f0ff; border-left:2px solid #00f0ff;   box-shadow:-4px -4px 12px rgba(0,240,255,0.4); }
    .ic.tr { top:0; right:0;   border-top:2px solid #00f0ff; border-right:2px solid #00f0ff;  box-shadow: 4px -4px 12px rgba(0,240,255,0.4); }
    .ic.bl { bottom:0; left:0;  border-bottom:2px solid #ff0055; border-left:2px solid #ff0055;  box-shadow:-4px 4px 12px rgba(255,0,85,0.4); }
    .ic.br { bottom:0; right:0; border-bottom:2px solid #ff0055; border-right:2px solid #ff0055; box-shadow: 4px 4px 12px rgba(255,0,85,0.4); }
    #intro-overlay.intro-exit {
      animation: introExit 0.8s cubic-bezier(0.7,0,1,1) both !important;
      pointer-events: none;
    }
    @keyframes introExit {
      0%   { opacity:1; transform:scale(1);    filter:brightness(1); }
      50%  { opacity:1; transform:scale(1.04); filter:brightness(4); }
      100% { opacity:0; transform:scale(0.96); filter:brightness(0); }
    }
  `;
  document.head.appendChild(style);

  // ---- CANVAS ----
  const canvas = document.getElementById('intro-canvas');
  const ctx = canvas.getContext('2d');
  let introEnded = false;

  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
    size: Math.random() * 2 + 0.5,
    color: ['#00f0ff','#ff0055','#39ff14','#ffcc00'][Math.floor(Math.random()*4)],
    alpha: Math.random() * 0.7 + 0.2,
  }));

  function drawHexGrid() {
    ctx.strokeStyle = 'rgba(0,240,255,0.04)'; ctx.lineWidth = 1;
    const s = 40, h = s * Math.sqrt(3);
    for (let row = -1; row < canvas.height / h + 1; row++) {
      for (let col = -1; col < canvas.width / (s * 1.5) + 1; col++) {
        const x = col * s * 1.5, y = row * h + (col % 2 === 0 ? 0 : h / 2);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          ctx.lineTo(x + s * Math.cos(angle), y + s * Math.sin(angle));
        }
        ctx.closePath(); ctx.stroke();
      }
    }
  }

  function animCanvas() {
    if (introEnded) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHexGrid();
    particles.forEach(p => {
      p.x = (p.x + p.vx + canvas.width)  % canvas.width;
      p.y = (p.y + p.vy + canvas.height) % canvas.height;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill(); ctx.globalAlpha = 1;
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,240,255,${0.15*(1-dist/100)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animCanvas);
  }
  animCanvas();

  // ---- CODE RAIN ----
  const rainContainer = document.getElementById('codeRain');
  const rainChars = '01アイウエオ{}[]();=>const let function import export class return if else for while';
  for (let i = 0; i < 12; i++) {
    const col = document.createElement('div');
    col.className = 'rain-col';
    col.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
    col.style.animationDelay    = (Math.random() * 2) + 's';
    col.style.opacity = (Math.random() * 0.5 + 0.2).toString();
    const len = Math.floor(Math.random() * 8 + 4);
    col.textContent = Array.from({length:len}, () => rainChars[Math.floor(Math.random()*rainChars.length)]).join('');
    rainContainer.appendChild(col);
  }

  // ---- TYPEWRITER ----
  const phrases = ['FULL STACK DEVELOPER','GAME ENTHUSIAST','BITS PILANI STUDENT','CODE. CREATE. CONQUER.'];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const typeEl = document.getElementById('introType');
  function typeWrite() {
    if (introEnded) return;
    const current = phrases[phraseIdx];
    if (!deleting) {
      typeEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) { deleting = true; setTimeout(typeWrite, 1200); return; }
    } else {
      typeEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
    }
    setTimeout(typeWrite, deleting ? 40 : 80);
  }
  setTimeout(typeWrite, 1500);

  // ---- LOADING BAR (FIXED: absolute timestamps, no chaining) ----
  const barFill  = document.getElementById('introBarFill');
  const barLabel = document.getElementById('introBarLabel');
  const barPct   = document.getElementById('introBarPct');

  const loadSteps = [
    { pct: 15,  label: 'LOADING ASSETS...',      delay: 2000 },
    { pct: 32,  label: 'COMPILING SHADERS...',    delay: 2600 },
    { pct: 50,  label: 'SPAWNING PARTICLES...',   delay: 3200 },
    { pct: 67,  label: 'INITIALIZING ENGINE...',  delay: 3800 },
    { pct: 82,  label: 'CONNECTING TO SERVER...', delay: 4400 },
    { pct: 95,  label: 'ALMOST READY...',         delay: 4900 },
    { pct: 100, label: 'PLAYER ONE — ENTER!',     delay: 5400 },
  ];

  loadSteps.forEach(step => {
    setTimeout(() => {
      if (introEnded) return;
      barFill.style.width  = step.pct + '%';
      barLabel.textContent = step.label;
      barPct.textContent   = step.pct + '%';
      if (step.pct === 100) {
        barFill.style.boxShadow = '0 0 30px #00f0ff, 0 0 60px #00f0ff';
        barLabel.style.color = '#00f0ff';
        setTimeout(endIntro, 700); // ✅ exits cleanly after 100%
      }
    }, step.delay);
  });

  // ---- END INTRO ----
  function endIntro() {
    if (introEnded) return;
    introEnded = true;
    overlay.classList.add('intro-exit');
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = '';
    }, 850);
  }

  document.addEventListener('keydown', endIntro, { once: true });
  overlay.addEventListener('click', endIntro);

  // Hard fallback — forces exit after 8s no matter what
  setTimeout(endIntro, 8000);
})();
