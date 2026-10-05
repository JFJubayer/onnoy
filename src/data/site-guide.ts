export interface GuideStep {
  title: string;
  body: string;
  target?: string;
  href?: string;
  action?: string;
}

export interface PageGuide {
  auto: boolean;
  steps: GuideStep[];
}

const guides: Record<string, GuideStep[]> = {
  '/': [
    { title: 'guide-home-title', body: 'guide-home-body', target: '.hero-content', href: '/workbooks', action: 'guide-explore-booklets' },
    { title: 'guide-paths-title', body: 'guide-paths-body', target: '#pillars', href: '/modules', action: 'guide-open-modules' },
    { title: 'guide-your-pace-title', body: 'guide-your-pace-body', target: '.stat-bar' },
  ],
  '/workbooks': [
    { title: 'guide-booklets-title', body: 'guide-booklets-body', target: '.workbook-grid' },
    { title: 'guide-reader-title', body: 'guide-reader-body', target: '.workbook-card .wb-actions a' },
    { title: 'guide-sponsor-title', body: 'guide-sponsor-body', target: '.chabondhu-card' },
  ],
  '/modules': [
    { title: 'guide-modules-title', body: 'guide-modules-body', target: '.module-shell', href: '/module-overview', action: 'guide-start-overview' },
    { title: 'guide-lessons-title', body: 'guide-lessons-body', target: '.module-course-grid' },
    { title: 'guide-progress-title', body: 'guide-progress-body', target: '#level2Gate' },
  ],
  '/module-overview': [
    { title: 'guide-overview-title', body: 'guide-overview-body', target: '#main' },
    { title: 'guide-learning-check-title', body: 'guide-learning-check-body', target: '.module-content-card, .module-shell', href: '/modules', action: 'guide-open-modules' },
  ],
  '/courses': [
    { title: 'guide-courses-title', body: 'guide-courses-body', target: '#main' },
    { title: 'guide-course-choice-title', body: 'guide-course-choice-body', target: '#hub-ai-start-btn', href: '/courses/interactive-course?course=ai-acknowledgement', action: 'guide-open-course' },
  ],
  '/donate': [
    { title: 'guide-donate-title', body: 'guide-donate-body', target: '.donation-note' },
    { title: 'guide-donate-reader-title', body: 'guide-donate-reader-body', target: '.donation-reading', href: '/workbooks', action: 'guide-explore-booklets' },
  ],
  '/resources-library': [
    { title: 'guide-resources-title', body: 'guide-resources-body', target: '#main' },
    { title: 'guide-resource-context-title', body: 'guide-resource-context-body', target: '.section-gap' },
  ],
  '/checklist': [
    { title: 'guide-checklist-title', body: 'guide-checklist-body', target: '#main' },
    { title: 'guide-checklist-context-title', body: 'guide-checklist-context-body', target: '.section-gap', href: '/fact-check', action: 'guide-open-fact-check' },
  ],
  '/digital-safety-laws': [
    { title: 'guide-laws-title', body: 'guide-laws-body', target: '#main' },
    { title: 'guide-laws-help-title', body: 'guide-laws-help-body', target: '.section-gap', href: '/support', action: 'guide-get-support' },
  ],
  '/faq': [
    { title: 'guide-faq-title', body: 'guide-faq-body', target: '#main' },
    { title: 'guide-faq-answer-title', body: 'guide-faq-answer-body', target: 'details, .faq-item, .section-gap' },
  ],
  '/facilitator-guide': [
    { title: 'guide-facilitator-title', body: 'guide-facilitator-body', target: '#main' },
    { title: 'guide-facilitator-prep-title', body: 'guide-facilitator-prep-body', target: '.section-gap', href: '/session-request', action: 'guide-request-session' },
  ],
  '/quiz': [
    { title: 'guide-quiz-title', body: 'guide-quiz-body', target: '#main' },
    { title: 'guide-quiz-reflect-title', body: 'guide-quiz-reflect-body', target: '.section-gap', href: '/modules', action: 'guide-open-modules' },
  ],
  '/badges': [
    { title: 'guide-badges-title', body: 'guide-badges-body', target: '#main' },
    { title: 'guide-badges-check-title', body: 'guide-badges-check-body', target: 'form, .section-gap', href: '/modules', action: 'guide-open-modules' },
  ],
  '/level-2-missions': [
    { title: 'guide-missions-title', body: 'guide-missions-body', target: '#main' },
    { title: 'guide-missions-next-title', body: 'guide-missions-next-body', target: '.section-gap', href: '/modules', action: 'guide-open-modules' },
  ],
  '/session-request': [
    { title: 'guide-session-title', body: 'guide-session-body', target: '#main' },
    { title: 'guide-form-receipt-title', body: 'guide-form-receipt-body', target: 'form.public-form, form' },
  ],
  '/fact-check': [
    { title: 'guide-fact-check-title', body: 'guide-fact-check-body', target: '#main' },
    { title: 'guide-form-receipt-title', body: 'guide-form-receipt-body', target: 'form.public-form, form' },
  ],
  '/support': [
    { title: 'guide-support-title', body: 'guide-support-body', target: '#main' },
    { title: 'guide-support-safety-title', body: 'guide-support-safety-body', target: 'form.public-form, form' },
  ],
  '/stories': [
    { title: 'guide-stories-title', body: 'guide-stories-body', target: '#main' },
    { title: 'guide-stories-reflect-title', body: 'guide-stories-reflect-body', target: '.section-gap' },
  ],
  '/privacy': [
    { title: 'guide-privacy-title', body: 'guide-privacy-body', target: '#main' },
    { title: 'guide-privacy-choice-title', body: 'guide-privacy-choice-body', target: '.section-gap, main' },
  ],
  '/login': [
    { title: 'guide-login-title', body: 'guide-login-body', target: 'form' },
    { title: 'guide-account-safety-title', body: 'guide-account-safety-body', target: 'form' },
  ],
  '/register': [
    { title: 'guide-register-title', body: 'guide-register-body', target: 'form' },
    { title: 'guide-account-safety-title', body: 'guide-account-safety-body', target: 'form' },
  ],
  '/profile': [
    { title: 'guide-profile-title', body: 'guide-profile-body', target: '#main, main' },
    { title: 'guide-profile-care-title', body: 'guide-profile-care-body', target: 'form, .section-gap' },
  ],
  '/admin-portal': [
    { title: 'guide-admin-title', body: 'guide-admin-body', target: '#main, main' },
    { title: 'guide-admin-care-title', body: 'guide-admin-care-body', target: '.admin-tabs, main' },
  ],
};

const lessonSteps: GuideStep[] = [
  { title: 'guide-lesson-title', body: 'guide-lesson-body', target: '#main' },
  { title: 'guide-learning-check-title', body: 'guide-learning-check-body', target: '.module-content-card, .module-shell' },
  { title: 'guide-progress-title', body: 'guide-progress-body', target: '.module-check, .module-shell', href: '/modules', action: 'guide-open-modules' },
];
const missionSteps: GuideStep[] = [
  { title: 'guide-mission-task-title', body: 'guide-mission-task-body', target: '#main' },
  { title: 'guide-mission-evidence-title', body: 'guide-mission-evidence-body', target: 'form, .section-gap', href: '/level-2-missions', action: 'guide-open-missions' },
];
const playerSteps: GuideStep[] = [
  { title: 'guide-player-title', body: 'guide-player-body', target: '#main, main, .course-player' },
  { title: 'guide-player-check-title', body: 'guide-player-check-body', target: '.course-player, .section-gap', href: '/courses', action: 'guide-open-courses' },
];

export function getPageGuide(pathname: string): PageGuide {
  const path = pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  const focused = ['/support', '/login', '/register', '/profile', '/admin-portal'].includes(path) || path.startsWith('/courses/');
  const family = path.startsWith('/module-') ? lessonSteps : path.startsWith('/mission-') ? missionSteps : path.startsWith('/courses/') ? playerSteps : undefined;
  return {
    auto: !focused,
    steps: guides[path] ?? family ?? [
      { title: 'guide-page-title', body: 'guide-page-body', target: '#main' },
      { title: 'guide-return-title', body: 'guide-return-body', target: '.navbar' },
    ],
  };
}