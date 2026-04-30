// Smart Buyer Quiz Engine
function initQuiz(questions, resultConfig) {
  let current = 0;
  let score = 0;
  let answered = false;
  let results = [];

  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const qNum = document.getElementById('q-num');
  const qText = document.getElementById('q-text');
  const optionsWrap = document.getElementById('options');
  const explanation = document.getElementById('explanation');
  const btnWrap = document.getElementById('btn-wrap');
  const btnNext = document.getElementById('btn-next');
  const quizSection = document.getElementById('quiz-section');
  const resultsSection = document.getElementById('results-section');

  function render() {
    const q = questions[current];
    answered = false;

    // Progress
    const pct = (current / questions.length) * 100;
    progressFill.style.width = pct + '%';
    progressText.textContent = (current + 1) + ' / ' + questions.length;

    // Question
    qNum.textContent = 'Question ' + (current + 1);
    qText.textContent = q.question;

    // Options
    optionsWrap.innerHTML = '';
    q.options.forEach((opt, i) => {
      const letters = ['A','B','C','D'];
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.innerHTML = '<span class="option-letter">' + letters[i] + '</span>' + opt.text;
      btn.addEventListener('click', () => selectAnswer(i, btn));
      optionsWrap.appendChild(btn);
    });

    // Hide explanation and next
    explanation.className = 'explanation';
    explanation.innerHTML = '';
    btnWrap.className = 'btn-wrap';
    btnNext.textContent = current < questions.length - 1 ? 'Next question →' : 'See my results →';
  }

  function selectAnswer(idx, btn) {
    if (answered) return;
    answered = true;
    const q = questions[current];
    const isCorrect = idx === q.correct;
    if (isCorrect) score++;

    results.push({ question: q.question, correct: isCorrect, explanation: q.explanation });

    // Style options
    const opts = optionsWrap.querySelectorAll('.option');
    opts.forEach((o, i) => {
      o.style.pointerEvents = 'none';
      if (i === q.correct) o.classList.add('correct');
      else if (i === idx && !isCorrect) o.classList.add('incorrect');
    });

    // Show explanation
    explanation.classList.add('show');
    explanation.classList.add(isCorrect ? 'correct-exp' : 'incorrect-exp');
    explanation.innerHTML = '<div class="exp-label">' + (isCorrect ? '✓ Correct' : '✗ Incorrect') + '</div>' + q.explanation;

    btnWrap.classList.add('show');
  }

  btnNext.addEventListener('click', () => {
    current++;
    if (current < questions.length) {
      render();
    } else {
      showResults();
    }
  });

  function showResults() {
    quizSection.style.display = 'none';
    resultsSection.style.display = 'block';

    const pct = score / questions.length;
    let tier, tierClass;
    if (pct >= 0.7) { tier = 'excellent'; tierClass = 'excellent'; }
    else if (pct >= 0.4) { tier = 'good'; tierClass = 'good'; }
    else { tier = 'poor'; tierClass = 'poor'; }

    // Score circle
    document.getElementById('score-circle').className = 'score-circle ' + tierClass;
    document.getElementById('score-num').textContent = score;
    document.getElementById('score-total-label').textContent = '/ ' + questions.length;

    // Label + desc
    const cfg = resultConfig[tier];
    document.getElementById('score-label').textContent = cfg.label;
    document.getElementById('score-desc').textContent = cfg.description;

    // Recommendation
    document.getElementById('rec-title').textContent = cfg.rec.title;
    document.getElementById('rec-body').innerHTML = cfg.rec.body;

    // Breakdown
    const breakdownList = document.getElementById('breakdown-list');
    breakdownList.innerHTML = '';
    results.forEach(r => {
      const div = document.createElement('div');
      div.className = 'breakdown-item';
      div.innerHTML = '<span class="bi-icon">' + (r.correct ? '✓' : '✗') + '</span><div class="bi-q"><strong>' + r.question + '</strong>' + r.explanation + '</div>';
      div.querySelector('.bi-icon').style.color = r.correct ? '#16a34a' : '#dc2626';
      breakdownList.appendChild(div);
    });

    // Share
    document.getElementById('share-score').addEventListener('click', () => {
      const text = 'I scored ' + score + '/' + questions.length + ' on the Smart Buyer Quiz. How smart a buyer are you?';
      if (navigator.share) navigator.share({ title: 'Smart Buyer Quiz', text });
      else { navigator.clipboard.writeText(text); alert('Score copied to clipboard!'); }
    });

    document.getElementById('btn-retry').addEventListener('click', () => {
      current = 0; score = 0; answered = false; results = [];
      quizSection.style.display = 'block';
      resultsSection.style.display = 'none';
      render();
    });
  }

  render();
}
