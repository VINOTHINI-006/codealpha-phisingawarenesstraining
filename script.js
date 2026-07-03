/* ============================================
   PhishGuard Academy — script.js
   All interactive functionality
   ============================================ */

'use strict';

// ============================================================
// 1. LOADING SCREEN
// ============================================================
const loaderMessages = [
  'Loading threat database...',
  'Initialising phishing detectors...',
  'Compiling training modules...',
  'Setting up security protocols...',
  'Ready to protect you!'
];

(function initLoader() {
  const loader = document.getElementById('loader');
  const status = document.getElementById('loaderStatus');
  if (!loader) return;

  let i = 0;
  const interval = setInterval(() => {
    if (status && i < loaderMessages.length) {
      status.textContent = loaderMessages[i++];
    }
  }, 380);

  window.addEventListener('load', () => {
    clearInterval(interval);
    if (status) status.textContent = loaderMessages[loaderMessages.length - 1];
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = 'auto';
      initHeroCanvas();
      animateHeroStats();
    }, 500);
  });

  // Fallback if load never fires
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    initHeroCanvas();
    animateHeroStats();
  }, 3000);
})();

// ============================================================
// 2. HERO CANVAS — Animated particle network
// ============================================================
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, animFrame;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.r = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    const count = Math.min(Math.floor((W * H) / 12000), 80);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animFrame = requestAnimationFrame(loop);
  }

  init();
  loop();
  window.addEventListener('resize', () => { init(); });
}

// ============================================================
// 3. HERO STAT COUNTERS
// ============================================================
function animateHeroStats() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const isFloat = target % 1 !== 0;
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

// ============================================================
// 4. STICKY NAVBAR
// ============================================================
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
})();

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  let current = '';

  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });

  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

// ============================================================
// 5. DARK / LIGHT MODE TOGGLE
// ============================================================
(function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const body = document.body;

  const saved = localStorage.getItem('pg-theme') || 'dark';
  applyTheme(saved);

  btn.addEventListener('click', () => {
    const next = body.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('pg-theme', next);
  });

  function applyTheme(theme) {
    body.dataset.theme = theme;
    if (theme === 'light') {
      body.classList.remove('dark-mode');
      icon.className = 'fas fa-moon';
    } else {
      body.classList.add('dark-mode');
      icon.className = 'fas fa-sun';
    }
  }
})();

// ============================================================
// 6. SCROLL REVEAL ANIMATIONS
// ============================================================
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ============================================================
// 7. BACK TO TOP BUTTON
// ============================================================
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ============================================================
// 8. TYPES OF PHISHING — Expandable Cards
// ============================================================
(function initTypeCards() {
  document.querySelectorAll('.type-card').forEach(card => {
    const btn = card.querySelector('.expand-btn');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = card.classList.contains('expanded');
      // Close all
      document.querySelectorAll('.type-card.expanded').forEach(c => {
        c.classList.remove('expanded');
        const b = c.querySelector('.expand-btn');
        if (b) b.innerHTML = 'Learn More <i class="fas fa-chevron-down"></i>';
      });
      if (!isExpanded) {
        card.classList.add('expanded');
        btn.innerHTML = 'Show Less <i class="fas fa-chevron-down"></i>';
      }
    });
  });
})();

// ============================================================
// 9. PHISHING EMAIL — Hover Tooltips on Red Flags
// ============================================================
(function initPhishTooltip() {
  const tooltip = document.getElementById('phishTooltip');
  if (!tooltip) return;

  document.querySelectorAll('.phish-flag').forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      const tip = el.dataset.tip;
      if (!tip) return;
      tooltip.textContent = tip;
      tooltip.classList.add('visible');
      positionTooltip(e);
    });
    el.addEventListener('mousemove', positionTooltip);
    el.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });

  function positionTooltip(e) {
    const x = e.clientX + 15;
    const y = e.clientY + 15;
    const tw = tooltip.offsetWidth;
    const th = tooltip.offsetHeight;
    tooltip.style.left = (x + tw > window.innerWidth ? x - tw - 30 : x) + 'px';
    tooltip.style.top = (y + th > window.innerHeight ? y - th - 30 : y) + 'px';
  }
})();

// ============================================================
// 10. URL SAFETY CHECKER
// ============================================================
(function initUrlChecker() {
  const input = document.getElementById('urlInput');
  const btn = document.getElementById('checkUrlBtn');
  const result = document.getElementById('urlResult');
  const examples = document.querySelectorAll('.example-url');

  if (!btn) return;

  btn.addEventListener('click', () => checkUrl(input.value.trim()));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') checkUrl(input.value.trim()); });

  examples.forEach(ex => {
    ex.addEventListener('click', () => {
      input.value = ex.dataset.url;
      checkUrl(ex.dataset.url);
    });
  });

  function checkUrl(url) {
    if (!url) {
      showResult('suspicious', '⚠️ Please enter a URL', ['Enter a full URL including http:// or https://'], []);
      return;
    }

    let fullUrl = url;
    if (!/^https?:\/\//i.test(url)) fullUrl = 'http://' + url;

    let parsed;
    try { parsed = new URL(fullUrl); }
    catch {
      showResult('dangerous', '🚨 Invalid or Malformed URL', ['This URL cannot be parsed — it may be intentionally obfuscated or broken.'], []);
      return;
    }

    const hostname = parsed.hostname.toLowerCase();
    const protocol = parsed.protocol;
    const path = parsed.pathname + parsed.search;
    const reasons = [];
    const positives = [];
    let riskScore = 0;

    // Protocol checks
    if (protocol === 'https:') { positives.push('Uses HTTPS — data is encrypted in transit'); }
    else { reasons.push('No HTTPS — data transmitted unencrypted (major risk)'); riskScore += 3; }

    // IP address as host
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      reasons.push('Uses raw IP address instead of domain name — uncommon for legitimate sites');
      riskScore += 3;
    }

    // Suspicious TLDs
    const suspiciousTLDs = ['.ru', '.cn', '.tk', '.ml', '.ga', '.cf', '.xyz', '.info', '.cc', '.pw', '.top', '.click', '.download'];
    const tldMatch = suspiciousTLDs.find(t => hostname.endsWith(t));
    if (tldMatch) { reasons.push(`Suspicious TLD: "${tldMatch}" — rarely used by legitimate major services`); riskScore += 2; }

    // Typosquatting — lookalike characters
    const lookalike = [
      { pattern: /paypa[l1]|paypa[0o]/i, brand: 'PayPal' },
      { pattern: /amaz[0o]n|amazzon/i, brand: 'Amazon' },
      { pattern: /g[0o][0o]gle|gogle|goggle/i, brand: 'Google' },
      { pattern: /micros[0o]ft|mircosoft/i, brand: 'Microsoft' },
      { pattern: /app[l1]e|aplle/i, brand: 'Apple' },
      { pattern: /faceb[0o][0o]k|facebok/i, brand: 'Facebook' },
      { pattern: /netfl[i1]x|netflixx/i, brand: 'Netflix' },
      { pattern: /[il1]nstagram/i, brand: 'Instagram' },
    ];
    lookalike.forEach(({ pattern, brand }) => {
      if (pattern.test(hostname)) {
        reasons.push(`Lookalike domain imitating "${brand}" — classic typosquatting attack`);
        riskScore += 4;
      }
    });

    // Number/letter substitutions
    if (/[0-9]/.test(hostname.replace(/\.\d+/g, ''))) {
      const domainWithoutTld = hostname.split('.').slice(0, -1).join('.');
      if (/[0o]/.test(domainWithoutTld) || /[l1]/.test(domainWithoutTld)) {
        if (!reasons.some(r => r.includes('Lookalike'))) {
          reasons.push('Domain contains numbers that may substitute letters (0→o, 1→l) — deception tactic');
          riskScore += 2;
        }
      }
    }

    // Suspicious keywords in domain
    const suspiciousKeywords = ['secure', 'security', 'verify', 'update', 'login', 'signin', 'account', 'alert', 'confirm', 'validate', 'banking', 'wallet', 'password', 'credential'];
    const foundKeywords = suspiciousKeywords.filter(k => hostname.includes(k) || path.toLowerCase().includes(k));
    if (foundKeywords.length > 0) {
      reasons.push(`Suspicious keywords in URL: "${foundKeywords.slice(0,3).join('", "')}" — used to create false trust`);
      riskScore += foundKeywords.length;
    }

    // Multiple subdomains
    const subdomainParts = hostname.split('.');
    if (subdomainParts.length > 3) {
      reasons.push('Excessive subdomain depth — attackers hide real domain at the end');
      riskScore += 2;
    }

    // Trusted domains
    const trustedDomains = ['paypal.com', 'amazon.com', 'google.com', 'microsoft.com', 'apple.com', 'facebook.com', 'netflix.com', 'instagram.com', 'github.com', 'gov.uk', '.gov', 'bbc.com', 'bbc.co.uk'];
    const isTrusted = trustedDomains.some(d => hostname === d || hostname.endsWith('.' + d));
    if (isTrusted && protocol === 'https:') {
      positives.push('Verified trusted domain');
      riskScore = Math.max(0, riskScore - 4);
    }

    // Determine risk level
    let level, title;
    if (riskScore === 0 && positives.length > 0) {
      level = 'safe';
      title = '✅ This URL Appears Safe';
    } else if (riskScore <= 3) {
      level = 'suspicious';
      title = '⚠️ Suspicious — Proceed With Caution';
    } else {
      level = 'dangerous';
      title = '🚨 Dangerous — Do Not Visit This URL';
    }

    showResult(level, title, reasons, positives);
  }

  function showResult(level, title, reasons, positives) {
    result.className = 'url-result ' + level;
    let html = `<div class="result-header">${title}</div>`;

    if (positives.length > 0) {
      html += `<ul class="result-reasons" style="color: var(--secondary); margin-bottom: 0.5rem;">`;
      positives.forEach(p => { html += `<li>✓ ${p}</li>`; });
      html += `</ul>`;
    }

    if (reasons.length > 0) {
      html += `<ul class="result-reasons">`;
      reasons.forEach(r => { html += `<li>${r}</li>`; });
      html += `</ul>`;
    }

    if (reasons.length === 0 && positives.length === 0) {
      html += `<p style="color: var(--text-dim); font-size:0.85rem;">No specific indicators detected. Always verify manually before entering credentials.</p>`;
    }

    result.innerHTML = html;
    result.classList.remove('hidden');
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
})();

// ============================================================
// 11. SOCIAL ENGINEERING — Tactic Cards
// ============================================================
(function initTacticCards() {
  document.querySelectorAll('.tactic-card').forEach(card => {
    card.addEventListener('click', () => {
      const isRevealed = card.classList.contains('revealed');
      document.querySelectorAll('.tactic-card.revealed').forEach(c => c.classList.remove('revealed'));
      if (!isRevealed) card.classList.add('revealed');
    });
  });
})();

// ============================================================
// 12. PREVENTION CHECKLIST
// ============================================================
(function initChecklist() {
  const items = document.querySelectorAll('.checklist-item');
  const countEl = document.getElementById('checkedCount');
  const progressEl = document.getElementById('checklistProgress');
  const total = items.length;

  items.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      updateProgress();
    });
  });

  function updateProgress() {
    const checked = document.querySelectorAll('.checklist-item.checked').length;
    if (countEl) countEl.textContent = checked;
    if (progressEl) progressEl.style.width = (checked / total * 100) + '%';
  }
})();

// ============================================================
// 13. QUIZ
// ============================================================
const QUIZ_QUESTIONS = [
  {
    q: 'What is phishing?',
    options: [
      'A type of outdoor recreational sport',
      'A cyberattack that uses deception to trick users into revealing sensitive information',
      'A method for encrypting network traffic',
      'A software tool used by IT professionals to monitor networks'
    ],
    correct: 1,
    explanation: 'Phishing is a cyberattack where criminals impersonate trusted entities to trick victims into revealing passwords, financial details, or personal data.'
  },
  {
    q: 'Which of the following is the MOST reliable way to verify a suspicious email?',
    options: [
      'Click the provided link to check if it looks legitimate',
      'Reply to the email asking if it is genuine',
      'Navigate directly to the organisation\'s official website by typing the URL manually',
      'Forward the email to colleagues to get their opinion'
    ],
    correct: 2,
    explanation: 'Always navigate directly to the official website by typing the URL yourself. Never click links in suspicious emails — even the "verify" link could lead to a phishing page.'
  },
  {
    q: 'What does MFA (Multi-Factor Authentication) protect against?',
    options: [
      'Malware infections on your device',
      'Unauthorised access even when your password has been stolen',
      'Phishing emails reaching your inbox',
      'Data loss from hardware failure'
    ],
    correct: 1,
    explanation: 'MFA adds a second layer of security. Even if an attacker steals your password, they cannot access your account without the second authentication factor (e.g., a code sent to your phone).'
  },
  {
    q: 'An email claims your bank account has been suspended and asks you to click a link within 24 hours. What should you do?',
    options: [
      'Click the link immediately — you don\'t want to lose account access',
      'Reply asking for more details',
      'Do not click the link; contact your bank directly using the number on their official website',
      'Forward it to everyone in your address book as a warning'
    ],
    correct: 2,
    explanation: 'This is a classic urgency-based phishing attack. Banks never ask you to verify credentials via email. Always contact your bank directly using contact details from their official website — never from the email.'
  },
  {
    q: 'What is "spear phishing"?',
    options: [
      'A mass phishing campaign targeting thousands of random recipients',
      'Phishing attacks delivered via phone calls',
      'Highly targeted phishing attacks customised for specific individuals or organisations',
      'Phishing that specifically targets mobile devices'
    ],
    correct: 2,
    explanation: 'Spear phishing is personalised — attackers research their target using social media and company information to craft convincing, tailored messages. It\'s far more effective than generic phishing.'
  },
  {
    q: 'Which of these URLs is MOST likely to be a phishing site trying to impersonate PayPal?',
    options: [
      'https://www.paypal.com/login',
      'https://paypal.com/support',
      'http://paypa1-secure-verify.ru/login',
      'https://developer.paypal.com/docs'
    ],
    correct: 2,
    explanation: 'Three red flags: "paypa1" uses a number "1" instead of "l" (typosquatting), it uses HTTP instead of HTTPS, and it uses a .ru (Russian) domain. Legitimate PayPal URLs will always be at paypal.com.'
  },
  {
    q: 'What is "smishing"?',
    options: [
      'Phishing attacks conducted via social media platforms',
      'Phishing attacks delivered through SMS text messages',
      'A technique for cracking encrypted passwords',
      'Phishing emails with malicious file attachments'
    ],
    correct: 1,
    explanation: 'Smishing is SMS-based phishing. Common examples include fake delivery notifications, bank fraud alerts, and prize winnings sent via text message with malicious links.'
  },
  {
    q: 'You accidentally clicked a phishing link. What should you do FIRST?',
    options: [
      'Delete the email and hope for the best',
      'Disconnect your device from the internet immediately',
      'Post about it on social media',
      'Wait to see if anything suspicious happens'
    ],
    correct: 1,
    explanation: 'Immediately disconnect from the internet to stop any data being sent to the attacker and to prevent any malware from communicating with command-and-control servers. Speed is critical.'
  },
  {
    q: 'Which social engineering tactic creates a fake sense of time pressure to stop you thinking clearly?',
    options: [
      'Trust manipulation',
      'Authority impersonation',
      'Urgency tactics',
      'Curiosity exploitation'
    ],
    correct: 2,
    explanation: 'Urgency tactics are designed to make you act without thinking. Phrases like "Your account will be deleted in 24 hours!" or "Respond immediately!" are designed to bypass your rational decision-making process.'
  },
  {
    q: 'Which of the following is the BEST practice for password security?',
    options: [
      'Use one strong password for all accounts to make it easier to remember',
      'Write your passwords on a sticky note near your computer',
      'Use unique, complex passwords for each account stored in a password manager',
      'Change your main password every week and reuse old ones'
    ],
    correct: 2,
    explanation: 'A password manager allows you to have unique, complex passwords for every account. If one account is breached, attackers cannot use credential stuffing to access your other accounts.'
  }
];

(function initQuiz() {
  let currentQuestion = 0;
  let score = 0;
  let answered = false;
  let quizPassed = false;

  const startBtn = document.getElementById('startQuizBtn');
  const nextBtn = document.getElementById('nextQuestionBtn');
  const retryBtn = document.getElementById('retryQuizBtn');
  const getCertBtn = document.getElementById('getCertBtn');

  if (!startBtn) return;

  startBtn.addEventListener('click', startQuiz);
  nextBtn.addEventListener('click', nextQuestion);
  retryBtn.addEventListener('click', resetQuiz);

  function startQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    showScreen('quizQuestion');
    renderQuestion();
  }

  function renderQuestion() {
    const q = QUIZ_QUESTIONS[currentQuestion];
    const letters = ['A', 'B', 'C', 'D'];

    document.getElementById('questionCounter').textContent = `Question ${currentQuestion + 1} of ${QUIZ_QUESTIONS.length}`;
    document.getElementById('quizScore').textContent = `Score: ${score}`;
    document.getElementById('questionNumber').textContent = `Q${currentQuestion + 1}`;
    document.getElementById('questionText').textContent = q.q;

    const fill = document.getElementById('quizProgressFill');
    if (fill) fill.style.width = (currentQuestion / QUIZ_QUESTIONS.length * 100) + '%';

    const grid = document.getElementById('optionsGrid');
    grid.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.dataset.letter = letters[i];
      btn.dataset.index = i;
      btn.textContent = opt;
      btn.addEventListener('click', () => selectAnswer(i, btn));
      grid.appendChild(btn);
    });

    const feedback = document.getElementById('quizFeedback');
    feedback.classList.add('hidden');
    feedback.classList.remove('correct', 'wrong');
    answered = false;

    if (nextBtn) {
      nextBtn.textContent = currentQuestion === QUIZ_QUESTIONS.length - 1 ? 'See Results ' : 'Next Question ';
      nextBtn.innerHTML += '<i class="fas fa-arrow-right"></i>';
    }
  }

  function selectAnswer(idx, btnEl) {
    if (answered) return;
    answered = true;

    const q = QUIZ_QUESTIONS[currentQuestion];
    const correct = q.correct;
    const allBtns = document.querySelectorAll('.option-btn');

    allBtns.forEach(b => {
      b.disabled = true;
      if (parseInt(b.dataset.index) === correct) b.classList.add('correct');
    });

    const isCorrect = idx === correct;
    if (isCorrect) {
      btnEl.classList.add('correct');
      score++;
    } else {
      btnEl.classList.add('wrong');
    }

    // Feedback
    const feedback = document.getElementById('quizFeedback');
    const content = document.getElementById('feedbackContent');
    feedback.classList.remove('hidden', 'correct', 'wrong');
    feedback.classList.add(isCorrect ? 'correct' : 'wrong');
    content.innerHTML = `
      <strong>${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</strong>
      <p>${q.explanation}</p>
    `;
    document.getElementById('quizScore').textContent = `Score: ${score}`;
  }

  function nextQuestion() {
    if (!answered) return;
    currentQuestion++;
    if (currentQuestion >= QUIZ_QUESTIONS.length) {
      showResults();
    } else {
      renderQuestion();
    }
  }

  function showResults() {
    showScreen('quizResults');
    const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    const total = QUIZ_QUESTIONS.length;
    quizPassed = score >= 7;

    document.getElementById('finalScoreNum').textContent = score;

    // Animate score circle
    setTimeout(() => {
      const circumference = 339.3;
      const offset = circumference - (pct / 100) * circumference;
      const circle = document.getElementById('scoreCircle');
      if (circle) {
        circle.style.strokeDashoffset = offset;
        circle.style.stroke = score >= 7 ? 'var(--secondary)' : score >= 5 ? 'var(--warning)' : 'var(--danger)';
      }
    }, 200);

    const icon = document.getElementById('resultIcon');
    const title = document.getElementById('resultTitle');
    const msg = document.getElementById('resultMessage');

    if (score >= 8) {
      icon.innerHTML = '<i class="fas fa-trophy" style="color: var(--warning);"></i>';
      title.textContent = 'Outstanding! Cyber Expert!';
      msg.textContent = `You scored ${score}/${total} (${pct}%). Excellent work — you have a strong understanding of phishing threats and how to defend against them.`;
    } else if (score >= 6) {
      icon.innerHTML = '<i class="fas fa-shield-halved" style="color: var(--secondary);"></i>';
      title.textContent = 'Well Done! Training Passed!';
      msg.textContent = `You scored ${score}/${total} (${pct}%). You passed the training. Review the modules you missed to strengthen your knowledge further.`;
    } else {
      icon.innerHTML = '<i class="fas fa-book-open" style="color: var(--primary);"></i>';
      title.textContent = 'Keep Learning!';
      msg.textContent = `You scored ${score}/${total} (${pct}%). A score of 7 or more is needed for a certificate. Review the training modules and try again — you've got this!`;
    }

    const certBtn = document.getElementById('getCertBtn');
    if (certBtn) {
      if (quizPassed) {
        certBtn.classList.remove('hidden');
        certBtn.addEventListener('click', () => {
          document.getElementById('certName').focus();
        });
        // Auto-fill quiz score in certificate section
        const certStatus = document.getElementById('certStatus');
        if (certStatus) {
          certStatus.textContent = `Quiz passed with ${score}/${total}. Enter your name to generate your certificate.`;
          certStatus.className = 'cert-status info';
        }
      } else {
        certBtn.classList.add('hidden');
      }
    }
  }

  function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    const circle = document.getElementById('scoreCircle');
    if (circle) {
      circle.style.strokeDashoffset = '339.3';
      circle.style.stroke = '#00D4FF';
    }
    showScreen('quizStart');
  }

  function showScreen(id) {
    document.querySelectorAll('.quiz-screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(id);
    if (screen) screen.classList.add('active');
  }
})();

// ============================================================
// 14. CERTIFICATE GENERATOR
// ============================================================
(function initCertificate() {
  const nameInput = document.getElementById('certName');
  const genBtn = document.getElementById('generateCertBtn');
  const previewArea = document.getElementById('certPreviewArea');
  const certStatus = document.getElementById('certStatus');
  const nameDisplay = document.getElementById('certNameDisplay');
  const certDateEl = document.getElementById('certDate');
  const downloadBtn = document.getElementById('downloadCertBtn');
  const printBtn = document.getElementById('printCertBtn');

  if (!genBtn) return;

  // Set today's date
  function getFormattedDate() {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  genBtn.addEventListener('click', () => {
    const name = nameInput ? nameInput.value.trim() : '';

    if (!name) {
      if (certStatus) {
        certStatus.textContent = 'Please enter your full name to generate the certificate.';
        certStatus.className = 'cert-status error';
      }
      nameInput.focus();
      return;
    }

    if (name.length < 2) {
      if (certStatus) {
        certStatus.textContent = 'Please enter a valid full name (at least 2 characters).';
        certStatus.className = 'cert-status error';
      }
      return;
    }

    // Update certificate
    if (nameDisplay) nameDisplay.textContent = name;
    if (certDateEl) certDateEl.textContent = getFormattedDate();
    if (certStatus) {
      certStatus.textContent = '';
      certStatus.className = 'cert-status';
    }

    // Show certificate
    if (previewArea) {
      previewArea.classList.remove('hidden');
      previewArea.classList.add('visible');
      setTimeout(() => {
        previewArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  });

  // Download as PDF using jsPDF + html2canvas
  if (downloadBtn) {
    downloadBtn.addEventListener('click', async () => {
      const certEl = document.getElementById('certificateEl');
      if (!certEl) return;

      downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
      downloadBtn.disabled = true;

      try {
        const canvas = await html2canvas(certEl, {
          scale: 2,
          backgroundColor: '#0A192F',
          logging: false,
          useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width / 2, canvas.height / 2]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);

        const name = (document.getElementById('certName') || {}).value || 'certificate';
        const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        pdf.save(`PhishGuard_Certificate_${safeName}.pdf`);

        downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
        setTimeout(() => {
          downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Certificate (PDF)';
          downloadBtn.disabled = false;
        }, 3000);

      } catch (err) {
        console.error('PDF generation error:', err);
        downloadBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error — try again';
        downloadBtn.disabled = false;
      }
    });
  }

  // Print
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      const certEl = document.getElementById('certificateEl');
      if (!certEl) return;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>PhishGuard Certificate</title>
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@400;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
          <style>
            body { margin: 0; padding: 20px; background: #0A192F; display: flex; justify-content: center; }
            ${document.querySelector('style') ? '' : ''}
          </style>
          <link rel="stylesheet" href="style.css">
        </head>
        <body>
          ${certEl.outerHTML}
          <script>window.onload = function() { window.print(); window.close(); }<\/script>
        </body>
        </html>
      `);
      printWindow.document.close();
    });
  }
})();

// ============================================================
// 15. SMOOTH SCROLL for all anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============================================================
// 16. ACTIVE SECTION HIGHLIGHTING on load
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNavLink();
});

// ============================================================
// 17. FLOWCHART STEP HIGHLIGHT on scroll
// ============================================================
(function initFlowchart() {
  const steps = document.querySelectorAll('.flow-step');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.borderLeft = '3px solid var(--primary)';
      }
    });
  }, { threshold: 0.5 });

  steps.forEach(step => observer.observe(step));
})();

// ============================================================
// 18. TYPING EFFECT for hero badge (subtle)
// ============================================================
(function initTypeEffect() {
  const badge = document.querySelector('.hero-badge');
  if (!badge) return;
  const text = badge.textContent.trim();
  badge.textContent = '';
  badge.style.opacity = '1';

  let i = 0;
  const icon = document.createElement('i');
  icon.className = 'fas fa-lock';
  badge.appendChild(icon);
  badge.appendChild(document.createTextNode(' '));

  setTimeout(() => {
    const textNode = document.createTextNode('');
    badge.appendChild(textNode);
    const interval = setInterval(() => {
      const plain = text.replace(/^.*?Cybersecurity/, 'Cybersecurity');
      if (i <= plain.length) {
        textNode.textContent = plain.slice(0, i++);
      } else {
        clearInterval(interval);
      }
    }, 50);
  }, 1500);
})();

// ============================================================
// 19. CONSOLE EASTER EGG
// ============================================================
console.log('%c PhishGuard Academy ', 'background: #00D4FF; color: #0A192F; font-size: 18px; font-weight: bold; padding: 8px 16px; border-radius: 4px;');
console.log('%c Think Before You Click! 🛡️', 'color: #64FFDA; font-size: 14px;');
console.log('%c Built for CodeAlpha Cybersecurity Internship', 'color: #8892B0; font-size: 12px;');
