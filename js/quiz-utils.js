
// =======================================
// EduQuiz Pro Shared Utility Code
// =======================================

// 1. Save results to tracking
window.saveQuizResult = function(quizTitle, score, total) {
  const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const pct = (score / total) * 100;
  const status = pct >= 70 ? 'Passed' : 'Practice';
  
  history.unshift({
    date: today,
    name: quizTitle,
    score: score + '/' + total,
    status: status
  });
  
  // Keep only last 10 entries
  if (history.length > 10) history.pop();
  
  localStorage.setItem('quizHistory', JSON.stringify(history));
};

// 2. Confetti Effect
let confettiInterval;
let confettiActive = false;

window.startConfetti = function() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  let confetti = [];
  confettiActive = true;
  
  for(let i=0; i<150; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * 50 + 10,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10 - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0
    });
  }
  
  function draw() {
    if (!confettiActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confetti.forEach((c, i) => {
      c.tiltAngle += c.tiltAngleIncremental;
      c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
      c.x += Math.sin(c.d);
      c.tilt = Math.sin(c.tiltAngle) * 15;
      
      ctx.beginPath();
      ctx.lineWidth = c.r / 2;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r / 4, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 4);
      ctx.stroke();
      
      // Reset off-screen particles
      if (c.y > canvas.height) {
        confetti[i] = {
          x: Math.random() * canvas.width,
          y: -10,
          r: c.r,
          d: c.d,
          color: c.color,
          tilt: c.tilt,
          tiltAngleIncremental: c.tiltAngleIncremental,
          tiltAngle: c.tiltAngle
        };
      }
    });
    
    requestAnimationFrame(draw);
  }
  
  draw();
  
  // Stop after 5 seconds
  setTimeout(() => {
    confettiActive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 5000);
};

window.stopConfetti = function() {
  confettiActive = false;
  const canvas = document.getElementById('confetti-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

window.playVictorySound = function() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    // Ascending melody notes
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(audioCtx.destination);
      g.gain.linearRampToValueAtTime(0.0001, now + i * 0.12);
      g.gain.linearRampToValueAtTime(0.12, now + i * 0.12 + 0.02);
      g.gain.linearRampToValueAtTime(0.0001, now + i * 0.12 + 0.18);
      o.start(now + i * 0.12);
      o.stop(now + i * 0.12 + 0.22);
    });
  } catch (e) {
    console.warn('Audio Context error:', e);
  }
};

// 3. Hamburger Menu Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburger');
  const navList = document.getElementById('nav-list');
  if (hamburgerBtn && navList) {
    hamburgerBtn.addEventListener('click', () => {
      navList.classList.toggle('active');
    });
  }
});
