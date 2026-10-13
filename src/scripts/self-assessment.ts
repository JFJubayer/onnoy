import { assessmentDomains, assessmentQuestions, type AssessmentDomain } from '@data/self-assessment';
import { translations } from '@data/translations';

type Answer = { optionIndex: number; score: number; domain: AssessmentDomain };

function initializeSelfAssessment() {
  const intro = document.querySelector<HTMLElement>('#assessmentIntro');
  const start = document.querySelector<HTMLButtonElement>('#assessmentStart');
  const quiz = document.querySelector<HTMLElement>('#assessmentQuiz');
  const counter = document.querySelector<HTMLElement>('#assessmentCounter');
  const domain = document.querySelector<HTMLElement>('#assessmentDomain');
  const progress = document.querySelector<HTMLElement>('#assessmentProgress');
  const scenario = document.querySelector<HTMLElement>('#assessmentScenario');
  const question = document.querySelector<HTMLElement>('#assessmentQuestion');
  const options = document.querySelector<HTMLElement>('#assessmentOptions');
  const feedback = document.querySelector<HTMLElement>('#assessmentFeedback');
  const feedbackText = document.querySelector<HTMLElement>('#assessmentFeedbackText');
  const previous = document.querySelector<HTMLButtonElement>('#assessmentPrevious');
  const next = document.querySelector<HTMLButtonElement>('#assessmentNext');
  const results = document.querySelector<HTMLElement>('#assessmentResults');
  const score = document.querySelector<HTMLElement>('#assessmentScore');
  const resultMessage = document.querySelector<HTMLElement>('#assessmentResultMessage');
  const domainResults = document.querySelector<HTMLElement>('#assessmentDomainResults');
  const strongest = document.querySelector<HTMLElement>('#assessmentStrongest');
  const focus = document.querySelector<HTMLElement>('#assessmentFocus');
  const focusLink = document.querySelector<HTMLAnchorElement>('#assessmentFocusLink');
  const review = document.querySelector<HTMLElement>('#assessmentReview');
  const retake = document.querySelector<HTMLButtonElement>('#assessmentRetake');
  if (!intro || !start || !quiz || !counter || !domain || !progress || !scenario || !question || !options || !feedback || !feedbackText || !previous || !next || !results || !score || !resultMessage || !domainResults || !strongest || !focus || !focusLink || !review || !retake) return;

  const answers: Array<Answer | undefined> = new Array(assessmentQuestions.length);
  let current = 0;
  let showingResults = false;
  let resultTracked = false;

  const language = () => document.documentElement.lang === 'bn' ? 'bn' : 'en';
  const localized = (value: { en: string; bn: string }) => value[language()];
  const text = (key: string, values: Record<string, string | number> = {}) => {
    let value = translations[key]?.[language()] ?? '';
    Object.entries(values).forEach(([name, replacement]) => { value = value.replace(`{${name}}`, String(replacement)); });
    return value;
  };

  const showAnswerFeedback = (optionIndex: number) => {
    const selected = assessmentQuestions[current].options[optionIndex];
    feedbackText.textContent = localized(selected.feedback);
    feedback.dataset.level = selected.score === 3 ? 'strong' : selected.score === 2 ? 'growing' : 'practice';
    feedback.hidden = false;
  };

  const renderQuestion = () => {
    const item = assessmentQuestions[current];
    const answer = answers[current];
    counter.textContent = text('assessment-question-progress', { current: current + 1, total: assessmentQuestions.length });
    domain.textContent = localized(assessmentDomains[item.domain].name);
    progress.style.width = `${((current + 1) / assessmentQuestions.length) * 100}%`;
    scenario.textContent = localized(item.scenario);
    question.textContent = localized(item.prompt);
    options.replaceChildren();
    feedback.hidden = true;

    item.options.forEach((option, optionIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'assessment-option';
      button.setAttribute('aria-pressed', String(answer?.optionIndex === optionIndex));
      button.innerHTML = `<span>${String.fromCharCode(65 + optionIndex)}</span><strong>${localized(option.text)}</strong>`;
      button.addEventListener('click', () => {
        answers[current] = { optionIndex, score: option.score, domain: item.domain };
        options.querySelectorAll('button').forEach((choice, index) => choice.setAttribute('aria-pressed', String(index === optionIndex)));
        showAnswerFeedback(optionIndex);
        next.disabled = false;
      });
      options.appendChild(button);
    });

    previous.disabled = current === 0;
    next.disabled = !answer;
    next.textContent = current === assessmentQuestions.length - 1 ? text('assessment-see-results') : text('assessment-next');
    if (answer) showAnswerFeedback(answer.optionIndex);
    question.focus({ preventScroll: true });
  };

  const calculateDomains = () => {
    const totals = Object.fromEntries(Object.keys(assessmentDomains).map((key) => [key, { earned: 0, possible: 0 }])) as Record<AssessmentDomain, { earned: number; possible: number }>;
    assessmentQuestions.forEach((item, index) => {
      totals[item.domain].possible += 3;
      totals[item.domain].earned += answers[index]?.score ?? 0;
    });
    return totals;
  };

  const showResults = () => {
    showingResults = true;
    quiz.hidden = true;
    results.hidden = false;
    const total = answers.reduce((sum, answer) => sum + (answer?.score ?? 0), 0);
    const percentage = Math.round((total / (assessmentQuestions.length * 3)) * 100);
    const totals = calculateDomains();
    const ranked = (Object.keys(totals) as AssessmentDomain[]).sort((left, right) => (totals[right].earned / totals[right].possible) - (totals[left].earned / totals[left].possible));
    const strengthDomain = ranked[0];
    const focusDomain = ranked[ranked.length - 1];

    score.textContent = text('assessment-score-label', { score: percentage });
    resultMessage.textContent = text(percentage >= 80 ? 'assessment-result-strong' : percentage >= 55 ? 'assessment-result-growing' : 'assessment-result-start');
    strongest.innerHTML = `<span>${text('assessment-strongest-title')}</span><strong>${localized(assessmentDomains[strengthDomain].name)}</strong>`;
    focus.innerHTML = `<span>${text('assessment-focus-title')}</span><strong>${localized(assessmentDomains[focusDomain].name)}</strong><p>${localized(assessmentDomains[focusDomain].description)}</p>`;
    focusLink.href = assessmentDomains[focusDomain].href;
    focusLink.textContent = text('assessment-open-lesson');

    domainResults.replaceChildren();
    (Object.keys(assessmentDomains) as AssessmentDomain[]).forEach((key) => {
      const value = Math.round((totals[key].earned / totals[key].possible) * 100);
      const row = document.createElement('div');
      row.className = 'assessment-domain-row';
      row.style.setProperty('--assessment-value', `${value}%`);
      row.innerHTML = `<div><strong>${localized(assessmentDomains[key].name)}</strong><span>${value}%</span></div><div class="assessment-domain-meter" role="progressbar" aria-label="${localized(assessmentDomains[key].name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}"><span></span></div>`;
      domainResults.appendChild(row);
    });

    review.replaceChildren();
    assessmentQuestions.forEach((item, index) => {
      const answer = answers[index];
      if (!answer) return;
      const selected = item.options[answer.optionIndex];
      const details = document.createElement('details');
      details.innerHTML = `<summary>${index + 1}. ${localized(assessmentDomains[item.domain].name)}</summary><p>${localized(item.scenario)}</p><p><strong>${text('assessment-your-response')}:</strong> ${localized(selected.text)}</p><p>${localized(selected.feedback)}</p>`;
      review.appendChild(details);
    });

    try {
      localStorage.setItem('onnoy_self_assessment_v2', JSON.stringify({ percentage, domains: totals, completedAt: new Date().toISOString() }));
    } catch {}
    if (!resultTracked) {
      window.onnoyTrack?.('assessment_complete', { score_band: percentage >= 80 ? 'strong' : percentage >= 55 ? 'growing' : 'starting', focus_domain: focusDomain });
      resultTracked = true;
    }
    results.focus({ preventScroll: true });
  };

  start.addEventListener('click', () => {
    document.body.classList.add('assessment-active');
    intro.hidden = true;
    quiz.hidden = false;
    showingResults = false;
    renderQuestion();
  });
  previous.addEventListener('click', () => {
    if (current === 0) return;
    current--;
    renderQuestion();
  });
  next.addEventListener('click', () => {
    if (!answers[current]) return;
    if (current === assessmentQuestions.length - 1) showResults();
    else { current++; renderQuestion(); }
  });
  retake.addEventListener('click', () => {
    document.body.classList.add('assessment-active');
    answers.fill(undefined);
    current = 0;
    showingResults = false;
    resultTracked = false;
    results.hidden = true;
    quiz.hidden = false;
    renderQuestion();
  });
  document.addEventListener('onnoy:langchange', () => {
    if (showingResults) showResults();
    else if (!quiz.hidden) renderQuestion();
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeSelfAssessment, { once: true });
else initializeSelfAssessment();