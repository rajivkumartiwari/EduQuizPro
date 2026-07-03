const quizData = window.quizData;

// Elements
const themeToggle = document.getElementById('themeToggle');
const dashboard = document.getElementById('dashboard');
const quizView = document.getElementById('quiz-view');
const backBtn = document.getElementById('backBtn');
const quizContent = document.getElementById('quiz-content');
const actionBtn = document.getElementById('actionBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progress-bar');
const quizStatus = document.getElementById('quiz-status');

// State
let currentMode = null;
let currentIdx = 0;
let score = 0;
let userAnswers = [];

// Utility: Shuffle
const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);

// Theme toggling
themeToggle.addEventListener('click', () => {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.textContent = isDark ? ' Dark Mode' : ' Light Mode';
});

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('data-target');
    if (!targetId) return;
    
    e.preventDefault();
    
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
      section.classList.add('hidden');
    });
    
    // Show target section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.remove('hidden');
    }
  });
});

// Dropdown sub-menu navigation (hash links)
document.querySelectorAll('.dropdown-content a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#') && href !== '#') {
      e.preventDefault();
      const subId = 'sub-' + href.substring(1);
      
      // Determine parent section based on subId
      let targetSectionId = 'about-view'; // Default for about
      if (href === '#notes') targetSectionId = 'resources-view';
      
      // Hide all sections
      document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
      });
      
      // Show target section
      const targetSection = document.getElementById(targetSectionId);
      if (targetSection) {
        targetSection.classList.remove('hidden');
      }
      
      // Scroll to sub-section if it exists
      setTimeout(() => {
        const subSection = document.getElementById(subId);
        if (subSection) {
          subSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
      // Close mobile menu if open
      const navList = document.getElementById('nav-list');
      if (navList && navList.classList.contains('active')) {
        navList.classList.remove('active');
      }
    } else if (href === '#') {
      // It's the Notes & PDFs dummy link in index.html, map to resources
      e.preventDefault();
      document.querySelectorAll('.page-section').forEach(section => section.classList.add('hidden'));
      const resSection = document.getElementById('resources-view');
      if (resSection) resSection.classList.remove('hidden');
      
      const navList = document.getElementById('nav-list');
      if (navList) navList.classList.remove('active');
    }
  });
});

// Category cards navigation on dashboard
document.querySelectorAll('.quiz-card[data-target]').forEach(card => {
  card.addEventListener('click', () => {
    const targetId = card.getAttribute('data-target');
    if (!targetId) return;
    
    document.querySelectorAll('.page-section').forEach(section => {
      section.classList.add('hidden');
    });
    
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.remove('hidden');
    }
  });
});

// Load student score history from localStorage
function loadScoreHistory() {
  const historyTable = document.getElementById('tracking-history');
  if (!historyTable) return;

  const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
  if (history.length === 0) {
    historyTable.innerHTML = `
      <tr>
        <td colspan="4" style="padding: 2rem; text-align: center; color: var(--text-muted);">
          No quizzes taken yet. Click "Quiz" above and complete one!
        </td>
      </tr>
    `;
    return;
  }

  historyTable.innerHTML = history.map(item => `
    <tr>
      <td style="padding: 1rem; border-bottom: 1px solid var(--border);">${item.date}</td>
      <td style="padding: 1rem; border-bottom: 1px solid var(--border);">${item.name}</td>
      <td style="padding: 1rem; border-bottom: 1px solid var(--border);">${item.score}</td>
      <td style="padding: 1rem; border-bottom: 1px solid var(--border);">
        <span style="color: ${item.status === 'Passed' ? 'var(--success)' : 'var(--primary)'}; font-weight: bold;">
          ${item.status}
        </span>
      </td>
    </tr>
  `).join('');
}

// URL parameters router for navigation between static pages and hubs
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const section = params.get('section');
  if (section) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(section);
    if (target) {
      target.classList.remove('hidden');
    }
  }
  
  loadScoreHistory();
});

if (backBtn) {
  backBtn.addEventListener('click', () => {
    document.querySelectorAll('.page-section').forEach(section => {
      section.classList.add('hidden');
    });
    dashboard.classList.remove('hidden');
  });
}

function startQuizMode(mode) {
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.add('hidden');
  });
  quizView.classList.remove('hidden');
  currentIdx = 0;
  score = 0;
  userAnswers = [];
  
  // Configure UI
  prevBtn.classList.add('hidden');
  nextBtn.classList.add('hidden');
  actionBtn.textContent = "Submit / Check";
  actionBtn.classList.remove('hidden');
  
  if (mode === 'mcq') initMCQ();
  else if (mode === 'trueFalse') initTrueFalse();
  else if (mode === 'matching') initMatching();
  else if (mode === 'flashcards') initFlashcards();
}

function updateProgress(current, total) {
  const pct = (current / total) * 100;
  progressBar.style.width = pct + '%';
  quizStatus.textContent = `${current} / ${total}`;
}

// --- MCQ Engine ---
let shuffledMcq = [];
function initMCQ() {
  shuffledMcq = shuffle(quizData.mcq).slice(0, 5); // 5 questions for demo
  shuffledMcq.forEach(q => q.shuffledOptions = shuffle(q.options));
  userAnswers = new Array(shuffledMcq.length).fill(null);
  
  actionBtn.classList.add('hidden');
  prevBtn.classList.remove('hidden');
  nextBtn.classList.remove('hidden');
  
  prevBtn.onclick = () => { if(currentIdx > 0) { currentIdx--; renderMCQ(); } };
  nextBtn.onclick = () => {
    if(currentIdx < shuffledMcq.length - 1) { currentIdx++; renderMCQ(); }
    else finishMCQ();
  };
  
  renderMCQ();
}

function renderMCQ() {
  const q = shuffledMcq[currentIdx];
  updateProgress(currentIdx + 1, shuffledMcq.length);
  
  nextBtn.textContent = currentIdx === shuffledMcq.length - 1 ? 'Finish' : 'Next';
  prevBtn.disabled = currentIdx === 0;

  quizContent.innerHTML = `
    <div class="question-text">${currentIdx + 1}. ${q.q}</div>
    <div class="options-grid">
      ${q.shuffledOptions.map((opt, i) => `
        <button class="option-btn ${userAnswers[currentIdx] === opt ? 'selected' : ''}" data-opt="${opt.replace(/"/g, '&quot;')}">
          ${opt.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </button>
      `).join('')}
    </div>
  `;

  quizContent.querySelectorAll('.option-btn').forEach(btn => {
    btn.onclick = () => {
      userAnswers[currentIdx] = btn.getAttribute('data-opt');
      renderMCQ(); // re-render to show selection
    };
  });
}

function finishMCQ() {
  score = 0;
  shuffledMcq.forEach((q, i) => {
    if (userAnswers[i] === q.answer) score++;
  });
  quizContent.innerHTML = `
    <div class="question-text" style="text-align:center; font-size: 2rem;">Quiz Completed!</div>
    <div style="text-align:center; font-size: 1.5rem; margin-top: 2rem;">Score: ${score} / ${shuffledMcq.length}</div>
  `;
  prevBtn.classList.add('hidden');
  nextBtn.classList.add('hidden');
}

// --- True/False Engine ---
function initTrueFalse() {
  shuffledMcq = shuffle(quizData.trueFalse).slice(0, 5);
  userAnswers = new Array(shuffledMcq.length).fill(null);
  
  actionBtn.classList.add('hidden');
  prevBtn.classList.remove('hidden');
  nextBtn.classList.remove('hidden');
  
  prevBtn.onclick = () => { if(currentIdx > 0) { currentIdx--; renderTF(); } };
  nextBtn.onclick = () => {
    if(currentIdx < shuffledMcq.length - 1) { currentIdx++; renderTF(); }
    else finishTF();
  };
  
  renderTF();
}

function renderTF() {
  const q = shuffledMcq[currentIdx];
  updateProgress(currentIdx + 1, shuffledMcq.length);
  nextBtn.textContent = currentIdx === shuffledMcq.length - 1 ? 'Finish' : 'Next';
  prevBtn.disabled = currentIdx === 0;

  quizContent.innerHTML = `
    <div class="question-text">${currentIdx + 1}. ${q.q}</div>
    <div class="options-grid" style="grid-template-columns: 1fr 1fr;">
      <button class="option-btn ${userAnswers[currentIdx] === true ? 'selected' : ''}" data-val="true">True</button>
      <button class="option-btn ${userAnswers[currentIdx] === false ? 'selected' : ''}" data-val="false">False</button>
    </div>
  `;

  quizContent.querySelectorAll('.option-btn').forEach(btn => {
    btn.onclick = () => {
      userAnswers[currentIdx] = btn.getAttribute('data-val') === 'true';
      renderTF();
    };
  });
}

function finishTF() {
  score = 0;
  shuffledMcq.forEach((q, i) => {
    if (userAnswers[i] === q.a) score++;
  });
  quizContent.innerHTML = `
    <div class="question-text" style="text-align:center; font-size: 2rem;">Quiz Completed!</div>
    <div style="text-align:center; font-size: 1.5rem; margin-top: 2rem;">Score: ${score} / ${shuffledMcq.length}</div>
  `;
  prevBtn.classList.add('hidden');
  nextBtn.classList.add('hidden');
}

// --- Matching Engine ---
function initMatching() {
  updateProgress(0, 0);
  quizStatus.textContent = "Match the Column";
  const items = shuffle(quizData.matching).slice(0, 4);
  const targets = shuffle([...items]);
  
  quizContent.innerHTML = `
    <p style="margin-bottom: 2rem; color: var(--text-muted);">Drag answers from right and drop them on the left boxes.</p>
    <div style="display:flex; gap:2rem;">
      <div id="m-left" style="flex:1; display:flex; flex-direction:column; gap:1rem;"></div>
      <div id="m-right" style="flex:1; display:flex; flex-direction:column; gap:1rem;"></div>
    </div>
  `;

  const mLeft = document.getElementById('m-left');
  const mRight = document.getElementById('m-right');

  items.forEach(item => {
    const box = document.createElement('div');
    box.className = 'matching-box';
    box.innerHTML = `<strong>${item.question}</strong><br><span style="font-size:0.8rem; opacity:0.7;">Drop here</span>`;
    box.dataset.correct = item.answer;
    
    box.ondragover = e => e.preventDefault();
    box.ondrop = e => {
      e.preventDefault();
      const draggedAnswer = e.dataTransfer.getData('text/plain');
      const dragId = e.dataTransfer.getData('drag-id');
      if(draggedAnswer === box.dataset.correct) {
        box.classList.add('matched');
        box.innerHTML = `<strong>${item.question}</strong><br><span style="color:var(--success)">${draggedAnswer}</span>`;
        const draggedEl = document.getElementById(dragId);
        if (draggedEl) draggedEl.style.visibility = 'hidden';
      } else {
        box.classList.add('wrong');
        setTimeout(() => box.classList.remove('wrong'), 800);
      }
    };
    mLeft.appendChild(box);
  });

  targets.forEach((t, i) => {
    const dragBox = document.createElement('div');
    dragBox.className = 'matching-box draggable';
    dragBox.id = `dragbox-${i}`;
    dragBox.draggable = true;
    dragBox.textContent = t.answer;
    
    dragBox.ondragstart = e => {
      e.dataTransfer.setData('text/plain', t.answer);
      e.dataTransfer.setData('drag-id', dragBox.id);
    };
    mRight.appendChild(dragBox);
  });

  actionBtn.classList.add('hidden');
}

// --- Flashcards Engine ---
function initFlashcards() {
  updateProgress(0, 0);
  quizStatus.textContent = "Select Category";
  
  quizContent.innerHTML = `
    <div style="text-align:center; margin-bottom:2rem;">
      <select id="fc-category" style="padding:0.5rem; border-radius:0.5rem; font-size:1rem;">
        <option value="">-- Choose Category --</option>
        <option value="Input Device">Input Device</option>
        <option value="Output Device">Output Device</option>
        <option value="Secondary Storage">Secondary Storage</option>
      </select>
    </div>
    <div id="fc-grid" class="flashcards-grid"></div>
  `;

  actionBtn.onclick = () => {
    const selected = document.getElementById('fc-category').value;
    if(!selected) return alert("Please select a category first.");
    
    let correct = 0;
    document.querySelectorAll('.flashcard').forEach(card => {
      const isSelected = card.dataset.selected === 'true';
      const isMatch = card.dataset.category === selected;
      
      if(isSelected && isMatch) { card.classList.add('correct'); correct++; }
      else if(isSelected && !isMatch) card.classList.add('wrong');
      else if(!isSelected && isMatch) card.classList.add('wrong');
    });
    
    quizStatus.textContent = `Score: ${correct}`;
  };

  document.getElementById('fc-category').onchange = (e) => {
    const cat = e.target.value;
    if(!cat) return;
    
    const correctItems = quizData.flashcards.filter(f => f.category === cat);
    const otherItems = shuffle(quizData.flashcards.filter(f => f.category !== cat)).slice(0, 8);
    const renderItems = shuffle([...correctItems, ...otherItems]).slice(0, 8);
    
    const grid = document.getElementById('fc-grid');
    grid.innerHTML = '';
    
    renderItems.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'flashcard';
      card.dataset.category = item.category;
      card.dataset.selected = 'false';
      
      card.innerHTML = `
        <div class="fc-front">
          <img src="${item.img}" alt="${item.answer}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\'><rect fill=\\'%23ddd\\' width=\\'100\\' height=\\'100\\'/><text x=\\'50\\' y=\\'50\\' font-size=\\'12\\' text-anchor=\\'middle\\' alignment-baseline=\\'middle\\'>Image</text></svg>'">
          <div>${item.answer}</div>
        </div>
        <div class="fc-back">Selected</div>
      `;
      
      card.onclick = () => {
        card.dataset.selected = card.dataset.selected === 'true' ? 'false' : 'true';
        card.classList.toggle('flipped');
      };
      
      grid.appendChild(card);
    });
  };
}
