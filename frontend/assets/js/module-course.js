if (typeof window.ADMIN_EMAILS === 'undefined') {
  window.ADMIN_EMAILS = [
    'zubayertalukdar2002@gmail.com',
    'masuma.sarker21220@gmail.com',
    'nayeemahrahman@gmail.com',
    'alfeeasha84@gmail.com',
    'jubayerjf28@gmail.com',
    'fnfahim122@gmail.com'
  ];
}

const courseLessons = {
  overview: {
    storageKey: 'onnoy_lesson_overview',
    eyebrow: 'Digital Citizenship',
    title: 'Level 1: Digital Citizenship Course',
    subtitle: 'A colorful self-paced course that prepares students for safer, wiser, and more responsible digital life.',
    nextHref: 'module-attention-literacy.html',
    callout: {
      label: 'Course Map',
      title: 'Five short lessons. One stronger digital mindset.',
      body: 'Level 1 is not about memorizing rules. It helps students notice attention traps, verify information, avoid scams, use AI carefully, and build daily habits that protect judgment.'
    },
    activity: {
      title: 'Try this before you start',
      body: 'Write one sentence: "The online habit I most want to improve is..." Keep that answer in mind while moving through each lesson.'
    },
    sections: [
      {
        label: '01',
        title: 'What You Will Learn',
        body: 'Level 1 covers the core digital citizenship skills students need before starting Level 2 missions.',
        points: ['Attention Literacy: how apps, feeds, and algorithms compete for your time.', 'Misinformation: how to pause, verify, and avoid spreading false claims.', 'Scam Safety: how to spot phishing links, OTP traps, and fake offers.', 'AI and Mindset: how to use AI with human judgment, not blind trust.']
      },
      {
        label: '02',
        title: 'How Level 2 Unlocks',
        body: 'After finishing all Level 1 checks in this browser, students can start Level 2 missions. Official recognition is still reviewed manually by Onnoy.',
        points: ['Mission 1: Spot the Lie.', 'Mission 2: Scam Alert.', 'Mission 3: AI Integrity Check.', 'Mission 4: Invite 1-5 acquaintances to complete the course.']
      },
      {
        label: '03',
        title: 'How Progress Works',
        body: 'Progress is saved in this browser with localStorage. Use the same browser and device if you want the Level 2 gate to remember your progress.',
        points: ['Each page has a mini-activity and a quiz.', 'All quiz questions must be correct to complete the page.', 'If progress disappears, revisit each lesson and complete the quiz again.']
      }
    ],
    checks: [
      {
        question: 'What is the main goal of Level 1?',
        options: [
          ['Build safer digital habits and prepare for Level 2 missions', true],
          ['Collect social media passwords', false],
          ['Make students stop using the internet forever', false]
        ]
      },
      {
        question: 'When does Level 2 unlock in this browser?',
        options: [
          ['After all five Level 1 pages are completed', true],
          ['After opening only the overview page', false],
          ['After submitting a contact form', false]
        ]
      }
    ]
  },
  attention: {
    storageKey: 'onnoy_lesson_attention',
    eyebrow: 'Lesson 1',
    title: 'Attention Literacy',
    subtitle: 'Learn how screens, feeds, and algorithms compete for your attention.',
    prevHref: 'module-overview.html',
    nextHref: 'module-misinformation.html',
    image: 'assets/images/modules/algorithm-loop.png',
    imageAlt: 'Algorithm loop showing view tracking, emotion prediction, personalized content, and infinite scroll.',
    callout: {
      label: 'Attention Budget',
      title: 'Your attention is limited, valuable, and trainable.',
      body: 'This module shows a lifetime as 80 blocks. A typical person may spend about 16.7 years on screens. Reclaiming even 2 hours a day can return years of meaningful waking life.'
    },
    activity: {
      title: 'Try this now',
      body: 'Open your phone screen-time report. Notice your top app from yesterday. Ask: "Did I choose this time, or did the feed choose it for me?"'
    },
    sections: [
      {
        label: '01',
        title: 'Your Attention Has a Budget',
        body: 'This lesson frames life as 80 blocks. A typical person may spend about 16.7 years on screens. Reclaiming even 2 hours each day can return years of useful waking life.',
        points: ['Ask if your phone was the first thing you touched today.', 'Notice when a 10-minute break becomes 30 minutes.', 'Treat attention like time, money, and health.']
      },
      {
        label: '02',
        title: 'The Late-Night Loop',
        body: 'A common pattern starts with "one quick reel" at night and ends much later with tired eyes and lost sleep. This is not only a willpower issue; the product is built to keep attention moving.',
        points: ['Autoplay removes stopping points.', 'Infinite scroll hides how much time passed.', 'Emotional posts make the next tap feel urgent.']
      },
      {
        label: '03',
        title: 'The Algorithm Is Doing Its Job',
        body: 'Feeds track what you watch, predict emotion, and show more of what keeps you scrolling. This is why doomscrolling is a design outcome, not only a willpower problem.',
        points: ['Tap Not Interested on low-value posts.', 'Search intentionally for skills and learning.', 'Follow creators who improve your life.']
      }
    ],
    checks: [
      {
        question: 'Which habit trains your feed in a healthier direction?',
        options: [
          ['Searching for topics you want to learn', true],
          ['Opening every shocking post immediately', false],
          ['Scrolling until you feel tired', false]
        ]
      },
      {
        question: 'What makes infinite scroll risky?',
        options: [
          ['It removes natural stopping points', true],
          ['It blocks all videos', false],
          ['It always improves sleep', false]
        ]
      },
      {
        question: 'What is a good first step when your phone use feels automatic?',
        options: [
          ['Pause and ask why you picked it up', true],
          ['Open more apps quickly', false],
          ['Ignore screen-time patterns', false]
        ]
      }
    ]
  },
  misinformation: {
    storageKey: 'onnoy_lesson_misinformation',
    eyebrow: 'Lesson 2',
    title: 'Misinformation',
    subtitle: 'Separate mistakes from manipulation, then verify before sharing.',
    prevHref: 'module-attention-literacy.html',
    nextHref: 'module-scam-safety.html',
    image: 'assets/images/modules/sift.png',
    imageAlt: 'SIFT fact-checking framework: Stop, Investigate, Find Better, Trace.',
    callout: {
      label: 'Before You Share',
      title: 'Strong emotion is a warning light.',
      body: 'Fear, anger, and excitement can push people to share too fast. SIFT gives students a short routine: Stop, Investigate, Find better coverage, and Trace the claim.'
    },
    activity: {
      title: 'Try this now',
      body: 'Think of one viral post you saw this week. Name the claim, the source, and one better place you could check it before sharing.'
    },
    sections: [
      {
        label: '01',
        title: 'Misinformation vs Disinformation',
        body: 'Misinformation is false information shared unknowingly. Disinformation is false information created to deceive, manipulate, or harm.',
        points: ['A fake remedy shared by a helpful friend is misinformation.', 'A fake news screenshot designed to trigger panic is disinformation.', 'Both can hurt real people.']
      },
      {
        label: '02',
        title: 'Why False News Moves Fast',
        body: 'False claims often travel quickly because they fit echo chambers and trigger outrage. Algorithms may reward posts that create strong reactions, even when the claim is weak.',
        points: ['Old photos can be reused as new events.', 'Edited screenshots can look official.', 'Local names and places can be added to foreign videos.']
      },
      {
        label: '03',
        title: 'Use SIFT',
        body: 'Pause when a post creates fear, anger, or excitement. Then check source credibility, find better coverage, and trace the claim back to its original context.',
        points: ['Read past the headline.', 'Check dates and locations.', 'Watch for fake URLs and edited screenshots.']
      }
    ],
    checks: [
      {
        question: 'What should you do first when a post makes you angry or scared?',
        options: [
          ['Stop before sharing', true],
          ['Forward it with a question mark', false],
          ['Argue in comments immediately', false]
        ]
      },
      {
        question: 'What is disinformation?',
        options: [
          ['False information created to deceive or harm', true],
          ['Any post with a long caption', false],
          ['A true story from a newspaper', false]
        ]
      },
      {
        question: 'Which action is part of SIFT?',
        options: [
          ['Trace the claim to its original context', true],
          ['Share first and check later', false],
          ['Trust the headline only', false]
        ]
      }
    ]
  },
  scams: {
    storageKey: 'onnoy_lesson_scams',
    eyebrow: 'Lesson 3',
    title: 'Scam Safety',
    subtitle: 'Spot phishing links, OTP traps, hacked-friend scams, and fake websites.',
    prevHref: 'module-misinformation.html',
    nextHref: 'module-ai-mindset.html',
    image: 'assets/images/modules/fake-link.png',
    imageAlt: 'Real link versus fake link comparison with misspellings and suspicious domains.',
    callout: {
      label: '5-Second Rule',
      title: 'Scams rush you so you skip thinking.',
      body: 'Urgency, fear, free rewards, and fake authority are common scam triggers. A five-second pause can stop a stolen account, lost money, or leaked OTP.'
    },
    activity: {
      title: 'Try this now',
      body: 'Look at a recent promotional message. Before clicking, identify the real domain, the sender, and what the message wants you to do.'
    },
    sections: [
      {
        label: '01',
        title: 'Scams Use Emotion',
        body: 'Scammers push urgency, panic, free rewards, and fake authority. The Free Fire diamond example shows how a fake login page can steal an account.',
        points: ['Do not enter passwords after clicking reward links.', 'Never share OTP codes.', 'Call a friend directly before sending money.']
      },
      {
        label: '02',
        title: 'Look Closely at Links',
        body: 'Fake links often use misspellings, number substitutions, suspicious subdomains, or copied designs. A site can look real and still be dangerous.',
        points: ['Check the real domain, not only the page design.', 'Avoid unsafe APKs and game mods.', 'Use 2FA on important accounts.']
      },
      {
        label: '03',
        title: 'Common Digital Hijacks',
        body: 'Many scams are simple social tricks. A hacked friend may ask for urgent money, a fake support page may ask for login details, or an unsafe APK may steal files.',
        points: ['No bank or company should ask for your OTP.', 'Verify money requests through a direct call.', 'Do not install game mods from unknown sources.']
      }
    ],
    checks: [
      {
        question: 'A friend messages "Claim 5,000 diamonds free" and asks you to log in. Best response?',
        options: [
          ['Do not log in; verify with the friend directly', true],
          ['Enter your password quickly before offer ends', false],
          ['Share the link with classmates', false]
        ]
      },
      {
        question: 'Which link sign is suspicious?',
        options: [
          ['Misspellings or number substitutions in the domain', true],
          ['A familiar color scheme', false],
          ['A short paragraph on the page', false]
        ]
      },
      {
        question: 'What should you do with an OTP?',
        options: [
          ['Keep it private and never share it', true],
          ['Send it to anyone who says they are support', false],
          ['Post it in a group chat', false]
        ]
      }
    ]
  },
  ai: {
    storageKey: 'onnoy_lesson_ai',
    eyebrow: 'Lesson 4',
    title: 'AI and Mindset',
    subtitle: 'Use AI as a tool, not a replacement for judgment.',
    prevHref: 'module-scam-safety.html',
    nextHref: 'level-2-missions.html',
    image: 'assets/images/modules/ai-dark-side.png',
    imageAlt: 'Helpful and harmful AI examples including education, deepfakes, misinformation, bias, and overdependence.',
    callout: {
      label: 'Human Judgment',
      title: 'AI can help. Humans remain responsible.',
      body: 'AI predicts patterns from data. It can draft, summarize, and translate, but it can also invent facts, mirror bias, and produce convincing misinformation.'
    },
    activity: {
      title: 'Try this now',
      body: 'Ask an AI tool for a factual answer, then verify that answer with one trusted source. Notice whether the AI gave evidence or only sounded confident.'
    },
    sections: [
      {
        label: '01',
        title: 'AI Predicts, It Does Not Know',
        body: 'AI can summarize, translate, recognize patterns, and generate drafts. It can also hallucinate facts, invent sources, mirror bias, and sound confident when wrong.',
        points: ['Verify important facts outside AI.', 'Use AI for drafts, not final judgment.', 'Watch for deepfakes and manipulated media.']
      },
      {
        label: '02',
        title: 'Helpful and Harmful Uses',
        body: 'AI can support education, translation, accessibility, diagnosis, and flood prediction. The same technology can also create deepfakes, fake images, biased decisions, and manipulation.',
        points: ['Ask what the AI output is based on.', 'Check whether people may be harmed by sharing it.', 'Use AI to support thinking, not replace it.']
      },
      {
        label: '03',
        title: 'Critical Thinking Is the Core Skill',
        body: 'Critical thinking means asking questions, checking evidence, and thinking before reacting. Daily habits like the First 10 Rule protect attention and judgment.',
        points: ['No phone for the first 10 minutes after waking.', 'Question quick answers and trends.', 'Keep real-life offline activities in your week.']
      }
    ],
    checks: [
      {
        question: 'What is safest when AI gives an important fact?',
        options: [
          ['Verify it with trusted sources', true],
          ['Trust it because it sounds confident', false],
          ['Share it before checking', false]
        ]
      },
      {
        question: 'What is an AI hallucination?',
        options: [
          ['A confident answer that includes false or invented information', true],
          ['A verified source list from a library', false],
          ['A phone notification sound', false]
        ]
      },
      {
        question: 'What is the best role for AI in student work?',
        options: [
          ['Helper for drafts and ideas, with human checking', true],
          ['Replacement for all judgment', false],
          ['Source that never needs verification', false]
        ]
      }
    ]
  }
};

const missions = {
  spotLie: {
    storageKey: 'onnoy_mission_spot_lie',
    title: 'Mission 1: Spot the Lie',
    subtitle: 'Find five pieces of misinformation and show how you checked them.',
    prevHref: 'level-2-missions.html',
    nextHref: 'mission-scam-alert.html',
    type: 'form',
    formAction: 'https://formspree.io/f/xwvyyoqr',
    intro: 'Identify five pieces of misinformation. Upload your screenshots or PDFs in one place, then use numbered notes to explain each example.',
    guidelineTitle: 'Spot the Lie Rules',
    guidelineItems: [
      'Acceptable evidence: screenshots, image files, PDFs, source links, or video links.',
      'Submit screenshots/PDFs with the upload field. Paste video links and source links in the notes box.',
      'In the notes box, number each example 1-5 and explain what claim you found, why it may be false, and how you checked it.',
      'Hide private information before uploading. Do not submit passwords, OTPs, NID/card numbers, private messages, or harmful content.'
    ],
    notesPlaceholder: '1. Category: false claim / old image / edited screenshot / fake quote\nSource or video link:\nWhy it belongs here:\nHow I checked it:\n\n2. Category:\nSource or video link:\nWhy it belongs here:\nHow I checked it:'
  },
  scamAlert: {
    storageKey: 'onnoy_mission_scam_alert',
    title: 'Mission 2: Scam Alert',
    subtitle: 'Find five scams or suspicious messages and show your evidence.',
    prevHref: 'mission-spot-the-lie.html',
    nextHref: 'mission-ai-integrity.html',
    type: 'form',
    formAction: 'https://formspree.io/f/xwvyyoqr',
    intro: 'Identify five scams, suspicious links, or suspicious messages. Upload your screenshots or PDFs in one place, then use numbered notes to explain each example.',
    guidelineTitle: 'Scam Alert Rules',
    guidelineItems: [
      'Acceptable evidence: screenshots, image files, PDFs, suspicious links, message links, or video links.',
      'Submit screenshots/PDFs with the upload field. Paste video links, website links, and message details in the notes box.',
      'In the notes box, number each example 1-5 and explain the scam sign, what it asks people to do, and how you checked it.',
      'Hide private information before uploading. Do not submit passwords, OTPs, NID/card numbers, payment details, private messages, or live scam credentials.'
    ],
    notesPlaceholder: '1. Category: fake offer / phishing link / impersonation / payment scam\nSource or video link:\nWhy it belongs here:\nHow I checked it:\n\n2. Category:\nSource or video link:\nWhy it belongs here:\nHow I checked it:'
  },
  aiIntegrity: {
    storageKey: 'onnoy_mission_ai_integrity',
    title: 'Mission 3: AI Integrity Check',
    subtitle: 'Find five AI-related misinformation examples and show your checks.',
    prevHref: 'mission-scam-alert.html',
    nextHref: 'mission-digital-guardian.html',
    type: 'form',
    formAction: 'https://formspree.io/f/xwvyyoqr',
    intro: 'Identify five AI-generated or AI-assisted misinformation examples. Upload your screenshots or PDFs in one place, then use numbered notes to explain each example.',
    guidelineTitle: 'AI Integrity Check Rules',
    guidelineItems: [
      'Acceptable evidence: screenshots, image files, PDFs, AI output links, source links, or video links.',
      'Submit screenshots/PDFs with the upload field. Paste video links and AI/source links in the notes box.',
      'In the notes box, number each example 1-5 and explain whether it is AI-generated, AI-assisted, or AI-claimed, why it is risky, and how you verified it.',
      'Hide private information before uploading. Do not submit passwords, OTPs, NID/card numbers, private chats, or harmful synthetic content.'
    ],
    notesPlaceholder: '1. Category: AI image / AI text / fake source / deepfake claim\nSource or video link:\nWhy it belongs here:\nHow I checked it:\n\n2. Category:\nSource or video link:\nWhy it belongs here:\nHow I checked it:'
  },
  guardian: {
    storageKey: 'onnoy_mission_guardian',
    title: 'Mission 4: Digital Guardian Claim',
    subtitle: 'Invite 1-5 acquaintances to complete the course, then submit your claim.',
    prevHref: 'mission-ai-integrity.html',
    nextHref: 'modules.html',
    type: 'referral',
    formAction: 'https://formspree.io/f/xaqvvobg'
  }
};

const lessonOrder = ['overview', 'attention', 'misinformation', 'scams', 'ai'];
const missionOrder = ['spotLie', 'scamAlert', 'aiIntegrity', 'guardian'];

function isComplete(key) {
  return localStorage.getItem(key) === 'complete';
}

function setComplete(key) {
  localStorage.setItem(key, 'complete');
}

function buildPageNav(prevHref, nextHref, nextText = 'Next') {
  const nav = document.createElement('div');
  nav.className = 'module-page-nav';
  if (prevHref) nav.innerHTML += `<a class="btn btn-outline module-outline" href="${prevHref}">Back</a>`;
  if (nextHref) nav.innerHTML += `<a class="btn btn-green" href="${nextHref}">${nextText} →</a>`;
  return nav;
}

function renderLesson() {
  const root = document.querySelector('[data-lesson]');
  if (!root) return;
  const lesson = courseLessons[root.dataset.lesson];
  if (!lesson) return;

  const status = isComplete(lesson.storageKey) ? 'Complete' : 'Not complete';
  root.innerHTML = `
    <section class="module-shell">
      <div>
        <div class="module-kicker">${lesson.eyebrow}</div>
        <h2>${lesson.title}</h2>
        <p class="module-lead">${lesson.subtitle}</p>
      </div>
      <div class="module-status-pill">${status}</div>
    </section>
  `;

  if (lesson.callout) {
    const callout = document.createElement('section');
    callout.className = 'module-callout';
    callout.innerHTML = `
      <div class="module-callout-label">${lesson.callout.label}</div>
      <h3>${lesson.callout.title}</h3>
      <p>${lesson.callout.body}</p>
    `;
    root.appendChild(callout);
  }

  lesson.sections.forEach((section) => {
    const block = document.createElement('section');
    block.className = 'module-content-card';
    block.innerHTML = `
      <div class="module-section-label">${section.label || ''}</div>
      <h3>${section.title}</h3>
      <p>${section.body}</p>
      <ul>${section.points.map((point) => `<li>${point}</li>`).join('')}</ul>
    `;
    root.appendChild(block);
  });

  if (lesson.image) {
    const figure = document.createElement('figure');
    figure.className = 'module-visual';
    figure.innerHTML = `<img src="${lesson.image}" alt="${lesson.imageAlt}">`;
    root.appendChild(figure);
  }

  if (lesson.activity) {
    const activity = document.createElement('section');
    activity.className = 'module-activity';
    activity.innerHTML = `
      <div class="module-activity-icon" aria-hidden="true">?</div>
      <div>
        <h3>${lesson.activity.title}</h3>
        <p>${lesson.activity.body}</p>
      </div>
    `;
    root.appendChild(activity);
  }

  const check = document.createElement('section');
  check.className = 'module-check';
  const checks = lesson.checks || [lesson.check];
  const answered = new Set();
  check.innerHTML = `<h3>Quick Check</h3><p>Answer all questions correctly to complete this lesson.</p><div class="module-quiz"></div><p class="module-feedback" aria-live="polite"></p>`;
  const quiz = check.querySelector('.module-quiz');
  const feedback = check.querySelector('.module-feedback');

  checks.forEach((item, index) => {
    const question = document.createElement('div');
    question.className = 'module-quiz-question';
    question.innerHTML = `
      <p class="module-question-text">${index + 1}. ${item.question}</p>
      <div class="module-options"></div>
    `;
    const options = question.querySelector('.module-options');

    item.options.forEach(([text, correct]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = text;
      button.addEventListener('click', () => {
        question.querySelectorAll('button').forEach((btn) => {
          btn.classList.remove('is-correct', 'is-wrong');
        });

        if (!correct) {
          button.classList.add('is-wrong');
          feedback.textContent = 'Try again. Pause, reread the lesson, and choose the safest answer.';
          feedback.className = 'module-feedback danger';
          return;
        }

        button.classList.add('is-correct');
        answered.add(index);
        question.querySelectorAll('button').forEach((btn) => {
          btn.disabled = true;
        });

        if (answered.size === checks.length) {
          setComplete(lesson.storageKey);
          feedback.textContent = 'Completed. Progress saved in this browser.';
          feedback.className = 'module-feedback success';
          root.querySelector('.module-status-pill').textContent = 'Complete';
          
          if (lesson.storageKey === 'onnoy_lesson_overview') {
            triggerOverviewCompletionFlow();
          }
          checkAndAwardInformedBadge();
          return;
        }

        feedback.textContent = `${answered.size} of ${checks.length} correct. Keep going.`;
        feedback.className = 'module-feedback success';
      });
      options.appendChild(button);
    });

    quiz.appendChild(question);
  });
  root.appendChild(check);
  root.appendChild(buildPageNav(lesson.prevHref, lesson.nextHref));
}

function renderHubProgress() {
  const courseList = document.getElementById('courseProgress');
  if (courseList) {
    courseList.innerHTML = lessonOrder.map((id) => {
      const lesson = courseLessons[id];
      let lessonUrl = 'module-overview.html';
      if (id === 'attention') lessonUrl = 'module-attention-literacy.html';
      else if (id === 'misinformation') lessonUrl = 'module-misinformation.html';
      else if (id === 'scams') lessonUrl = 'module-scam-safety.html';
      else if (id === 'ai') lessonUrl = 'module-ai-mindset.html';
      
      return `<li style="padding: 0;"><a href="${lessonUrl}" style="display: flex; width: 100%; justify-content: space-between; align-items: center; padding: 14px 0 14px 24px; text-decoration: none; color: inherit;"><span>${lesson.title}</span><strong style="color: var(--green);">${isComplete(lesson.storageKey) ? 'Complete' : 'Open →'}</strong></a></li>`;
    }).join('');
  }

  const level2Gate = document.getElementById('level2Gate');
  if (level2Gate) {
    const ready = lessonOrder.every((id) => isComplete(courseLessons[id].storageKey));
    const btn = level2Gate.querySelector('a');
    const textPara = level2Gate.querySelector('p');

    if (btn && !btn.dataset.hasListener) {
      btn.dataset.hasListener = 'true';
      btn.addEventListener('click', (e) => {
        if (btn.getAttribute('aria-disabled') === 'true') {
          e.preventDefault();
          const href = btn.getAttribute('href');
          if (href && href !== '#') {
            window.location.href = href;
          }
        }
      });
    }

    if (!ready) {
      level2Gate.classList.add('is-locked');
      if (btn) {
        btn.setAttribute('aria-disabled', 'true');
        btn.href = '#';
      }
      if (textPara) {
        textPara.textContent = 'Finish all five Level 1 pages in this browser to unlock Level 2.';
      }
    } else {
      // Level 1 is complete! Check Supabase verification status
      if (btn) {
        btn.setAttribute('aria-disabled', 'true');
        btn.href = '#';
      }
      if (textPara) {
        textPara.textContent = 'Checking authorization status...';
      }

      const verifyStatus = async () => {
        try {
          if (window.supabaseClient) {
            const { data: { session } } = await window.supabaseClient.auth.getSession().catch(() => ({ data: { session: null } }));
            if (!session || !session.user) {
              if (textPara) {
                const lang = document.documentElement.getAttribute('lang') || localStorage.getItem('onnoy_lang') || 'en';
                const dict = typeof translations !== 'undefined' ? translations : {};
                const loginMsg = (dict['missions-login-to-proceed'] && dict['missions-login-to-proceed'][lang]) || "You need to log in to get the Unique ID and to go on. The Unique ID will be sent with the confirmation email.";
                textPara.innerHTML = `<span style="color: var(--danger-fg); font-weight: 500;">${loginMsg} <a href="login.html" style="color: var(--green); font-weight: 600; text-decoration: underline;">${lang === 'bn' ? 'লগইন করুন' : 'Log In'}</a></span>`;
              }
              if (btn) {
                btn.setAttribute('aria-disabled', 'true');
                btn.href = 'login.html';
              }
              return;
            }

            // Admin bypass check
            if (window.ADMIN_EMAILS.includes(session.user.email)) {
              level2Gate.classList.remove('is-locked');
              if (btn) {
                btn.setAttribute('aria-disabled', 'false');
                btn.href = 'level-2-missions.html';
              }
              if (textPara) {
                textPara.textContent = 'Admin Mode: Level 2 is fully unlocked.';
              }
              return;
            }

            // Fetch profile status
            const { data: profile, error } = await window.supabaseClient
              .from('profiles')
              .select('status, unique_id')
              .eq('id', session.user.id)
              .single()
              .catch(() => ({ data: null }));

            if (error || !profile) {
              if (textPara) {
                textPara.innerHTML = '<span style="color: var(--danger-fg);">Error fetching profile status. Please reload.</span>';
              }
              return;
            }

            // Sync: If overview is complete and profile status is pending, auto-approve it!
            if (profile.status === 'pending' && isComplete('onnoy_lesson_overview')) {
              console.log("Syncing completed overview: auto-approving profile status.");
              const { error: updateError } = await window.supabaseClient
                .from('profiles')
                .update({ status: 'Approved' })
                .eq('id', session.user.id);
              if (!updateError) {
                profile.status = 'Approved';
              }
            }

            // Since any status other than pending means approved for Level 2 in general
            if (profile.status && profile.status !== 'pending') {
              level2Gate.classList.remove('is-locked');
              if (btn) {
                btn.setAttribute('aria-disabled', 'false');
                btn.href = 'level-2-missions.html';
              }
              if (textPara) {
                textPara.textContent = `Level 2 is unlocked! Your account is verified (ID: ${profile.unique_id || 'None'}).`;
              }
            } else {
              level2Gate.classList.add('is-locked');
              if (btn) {
                btn.setAttribute('aria-disabled', 'true');
                btn.href = '#';
              }
              if (textPara) {
                textPara.innerHTML = `<span style="color: var(--caution-fg); font-weight: 600;">Pending Admin Verification (ID: ${profile.unique_id || 'Pending'}). Your submissions are being reviewed.</span>`;
              }
            }
          } else {
            setTimeout(verifyStatus, 200);
          }
        } catch (err) {
          console.error("Verification error:", err);
          if (textPara) {
            textPara.textContent = 'Error verifying status. Please refresh.';
          }
        }
      };
      verifyStatus();
    }
  }

  const missionList = document.getElementById('missionProgress');
  if (missionList) {
    missionList.innerHTML = missionOrder.map((id) => {
      const mission = missions[id];
      const missionUrl = id === 'spotLie' ? 'mission-spot-the-lie.html' : id === 'scamAlert' ? 'mission-scam-alert.html' : id === 'aiIntegrity' ? 'mission-ai-integrity.html' : 'mission-digital-guardian.html';
      return `<li style="padding: 0;"><a href="${missionUrl}" style="display: flex; width: 100%; justify-content: space-between; align-items: center; padding: 14px 0 14px 24px; text-decoration: none; color: inherit;"><span>${mission.title}</span><strong style="color: var(--green);">${isComplete(mission.storageKey) ? 'Complete' : 'Open →'}</strong></a></li>`;
    }).join('');
  }
  renderBadgesDisplay();
}

function renderMission() {
  const root = document.querySelector('[data-mission]');
  if (!root) return;
  const missionId = root.dataset.mission;
  const mission = missions[missionId];
  if (!mission) return;

  root.innerHTML = `
    <section class="module-shell">
      <div class="module-kicker">Level 2</div>
      <h2>${mission.title}</h2>
      <p class="module-lead">${mission.subtitle}</p>
      <div class="module-status-pill">${isComplete(mission.storageKey) ? 'Submitted for final review' : 'Manual review happens after all missions'}</div>
    </section>
  `;

  const levelOneDone = lessonOrder.every((id) => isComplete(courseLessons[id].storageKey));
  if (!levelOneDone) {
    const gate = document.createElement('section');
    gate.className = 'module-check';
    gate.innerHTML = '<h3>Level 2 Locked</h3><p>Complete all five Level 1 pages in this browser before starting missions.</p>';
    root.appendChild(gate);
    root.appendChild(buildPageNav('modules.html', 'module-overview.html', 'Start Level 1'));
    return;
  }

  const currentIndex = missionOrder.indexOf(missionId);
  const priorMissionsDone = currentIndex <= 0 || missionOrder.slice(0, currentIndex).every((id) => isComplete(missions[id].storageKey));
  if (!priorMissionsDone) {
    const gate = document.createElement('section');
    gate.className = 'module-check';
    gate.innerHTML = '<h3>Mission Locked</h3><p>Complete the earlier Level 2 missions in this browser before opening this one.</p>';
    root.appendChild(gate);
    root.appendChild(buildPageNav(mission.prevHref, 'level-2-missions.html', 'Mission List'));
    return;
  }

  if (mission.type === 'quiz') {
    const block = document.createElement('section');
    block.className = 'module-check';
    block.innerHTML = `<h3>Scenario</h3><p>${mission.scenario}</p><h3>${mission.question}</h3><div class="module-options"></div><p class="module-feedback" aria-live="polite"></p>`;
    const options = block.querySelector('.module-options');
    const feedback = block.querySelector('.module-feedback');
    mission.options.forEach(([text, correct]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = text;
      button.addEventListener('click', () => {
        if (!correct) {
          feedback.textContent = 'Try again. Use SIFT and verify before acting.';
          feedback.className = 'module-feedback danger';
          return;
        }
        setComplete(mission.storageKey);
        feedback.textContent = 'Mission completed in this browser.';
        feedback.className = 'module-feedback success';
        block.querySelectorAll('button').forEach((btn) => (btn.disabled = true));
      });
      options.appendChild(button);
    });
    root.appendChild(block);
  }

  if (mission.type === 'form') {
    root.appendChild(buildMissionForm(mission, false));
  }

  if (mission.type === 'referral') {
    root.appendChild(buildReferralForm(mission));
  }

  root.appendChild(buildPageNav(mission.prevHref, mission.nextHref, mission.type === 'referral' ? 'Finish' : 'Next Mission'));
}

function buildMissionForm(mission, referralMode) {
  const section = document.createElement('section');
  section.className = 'module-form-card';
  const guideline = mission.guidelineItems
    ? `
      <div class="mission-guidelines">
        <h4>${mission.guidelineTitle || 'Mission Rules'}</h4>
        <ul>${mission.guidelineItems.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>
    `
    : '';
  section.innerHTML = `<h3>Submit for Review</h3>${guideline}<p>${mission.intro || 'Send this to Onnoy for manual review.'}</p><p>Team Onnoy will manually review all mission submissions together at the end. You can continue to the next mission after submitting this form.</p>`;
  
  // Create Alert Box for status feedback
  const alertBox = document.createElement('div');
  alertBox.className = 'note-box';
  alertBox.style.display = 'none';
  alertBox.style.marginBottom = '20px';
  alertBox.style.padding = '15px';
  alertBox.style.borderRadius = 'var(--radius)';
  section.appendChild(alertBox);

  const form = document.createElement('form');
  form.action = mission.formAction;
  form.method = 'POST';
  form.enctype = 'multipart/form-data';
  form.innerHTML = `
    <input type="hidden" name="_subject" value="${mission.title}">
    <input type="hidden" name="mission_title" value="${mission.title}">
    <div class="form-group">
      <label class="form-label" for="unique_id">Unique ID *</label>
      <input class="form-control" id="unique_id" name="unique_id" required>
      <p class="mission-upload-help" id="unique_id_hint" style="margin-top: 6px; display: flex; align-items: flex-start; gap: 6px;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:2px; color: var(--green);"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span id="unique_id_hint_text">Your Unique ID is visible in the <strong>top-right navbar dropdown</strong> next to your email.</span>
      </p>
    </div>
    <div class="form-group"><label class="form-label" for="student_name">Name *</label><input class="form-control" id="student_name" name="student_name" required></div>
    <div class="form-group"><label class="form-label" for="student_email">Email Address *</label><input class="form-control" id="student_email" name="student_email" type="email" required></div>
    <div class="form-group">
      <label class="form-label" for="evidence_files">Screenshots or PDF Files *</label>
      <div class="file-drop-zone" id="file_drop_zone">
        <svg width="32" height="32" fill="none" stroke="var(--green)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <p class="file-drop-label">Drag &amp; drop files here, or <span class="file-drop-browse">browse</span></p>
        <p class="mission-upload-help" style="margin:4px 0 0;">Images and PDFs only. Video links go in the notes box below.</p>
        <input class="form-control" id="evidence_files" name="evidence_files" type="file" accept="image/*,.pdf" multiple required style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;">
      </div>
      <ul class="file-list" id="file_list"></ul>
    </div>
    <div class="form-group">
      <label class="form-label" for="evidence_notes">Numbered Evidence Notes *</label>
      <textarea class="form-control" id="evidence_notes" name="evidence_notes" rows="10" required>${mission.notesPlaceholder || '1. Category:\nSource or video link:\nWhy it belongs here:\nHow I checked it:'}</textarea>
    </div>
  `;
  const buttonText = referralMode ? 'Submit Recognition Claim' : 'Submit Mission for Review';
  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn btn-green full-submit';
  submitBtn.type = 'submit';
  submitBtn.textContent = `${buttonText} →`;
  form.appendChild(submitBtn);
  // Wire up custom file drop zone
  const fileInput = form.querySelector('#evidence_files');
  const fileList = form.querySelector('#file_list');
  const dropZone = form.querySelector('#file_drop_zone');

  const renderFileList = (files) => {
    fileList.innerHTML = '';
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file, i) => {
      const li = document.createElement('li');
      li.className = 'file-list-item';
      const ext = file.name.split('.').pop().toUpperCase();
      const isPdf = ext === 'PDF';
      li.innerHTML = `
        <span class="file-list-icon">${isPdf ? '📄' : '🖼️'}</span>
        <span class="file-list-name">${i + 1}. ${file.name}</span>
        <span class="file-list-size">${(file.size / 1024).toFixed(0)} KB</span>
      `;
      fileList.appendChild(li);
    });
  };

  fileInput.addEventListener('change', () => renderFileList(fileInput.files));

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    // Transfer dragged files to the input
    const dt = new DataTransfer();
    Array.from(e.dataTransfer.files).forEach(f => {
      if (f.type.startsWith('image/') || f.type === 'application/pdf') dt.items.add(f);
    });
    fileInput.files = dt.files;
    renderFileList(fileInput.files);
  });

  // Pre-fill user details if logged in

  const prefillUserDetails = async () => {
    try {
      if (window.supabaseClient) {
        const { data: { session } } = await window.supabaseClient.auth.getSession().catch(() => ({ data: { session: null } }));
        if (session && session.user) {
          const user = session.user;
          const emailInput = form.querySelector('#student_email');
          const nameInput = form.querySelector('#student_name');
          const idInput = form.querySelector('#unique_id');

          if (emailInput && !emailInput.value) emailInput.value = user.email || '';
          if (nameInput && !nameInput.value) nameInput.value = user.user_metadata?.full_name || '';

          const { data: profile } = await window.supabaseClient
            .from('profiles')
            .select('unique_id')
            .eq('id', user.id)
            .single()
            .catch(() => ({ data: null }));

          if (profile && profile.unique_id && idInput) {
            idInput.value = profile.unique_id;
            idInput.readOnly = true;
            // Update hint to confirm auto-fill
            const hintText = form.querySelector('#unique_id_hint_text');
            if (hintText) {
              hintText.innerHTML = `✅ Auto-filled: <strong>${profile.unique_id}</strong>. Your Unique ID is also visible in the <strong>top-right navbar dropdown</strong> next to your email.`;
            }
            const hintSvg = form.querySelector('#unique_id_hint svg');
            if (hintSvg) hintSvg.style.display = 'none';
          } else if (idInput) {
            const hintText = form.querySelector('#unique_id_hint_text');
            if (hintText) {
              hintText.innerHTML = `Your Unique ID is visible in the <strong>top-right navbar dropdown</strong> next to your email.`;
            }
          }
        }
      } else {
        setTimeout(prefillUserDetails, 200);
      }
    } catch (e) {
      console.warn("Error prefilling user details:", e);
    }
  };
  prefillUserDetails();

  form.addEventListener('submit', async (e) => {
    // If Supabase is not configured, fallback to standard Formspree action
    if (!window.supabaseClient) {
      console.warn("Supabase client not initialized. Falling back to Formspree submit.");
      setComplete(mission.storageKey);
      return; // Let browser do the standard form POST
    }

    e.preventDefault();
    alertBox.style.display = 'none';

    const uniqueId = form.querySelector('#unique_id').value.trim();
    const name = form.querySelector('#student_name').value.trim();
    const email = form.querySelector('#student_email').value.trim();
    const notes = form.querySelector('#evidence_notes').value.trim();
    const fileInput = form.querySelector('#evidence_files');
    const files = fileInput ? fileInput.files : [];

    if (!uniqueId || !name || !email || !notes || files.length === 0) {
      alertBox.textContent = "Please fill in all required fields and select at least one file.";
      alertBox.style.backgroundColor = 'var(--danger-bg)';
      alertBox.style.color = 'var(--danger-fg)';
      alertBox.style.borderColor = 'var(--danger-fg)';
      alertBox.style.display = 'block';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading files...';
    alertBox.textContent = 'Uploading screenshots to Supabase Storage...';
    alertBox.style.backgroundColor = 'var(--caution-bg)';
    alertBox.style.color = 'var(--caution-fg)';
    alertBox.style.borderColor = 'var(--caution-fg)';
    alertBox.style.display = 'block';

    try {
      const fileUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${uniqueId}/${Date.now()}_${cleanFileName}`;
        
        const { data, error } = await window.supabaseClient.storage
          .from('mission-screenshots')
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = window.supabaseClient.storage
          .from('mission-screenshots')
          .getPublicUrl(filePath);

        fileUrls.push(publicUrl);
      }

      alertBox.textContent = 'Saving submission data to Supabase database...';

      const { data: { session } } = await window.supabaseClient.auth.getSession().catch(() => ({ data: { session: null } }));
      const userId = session?.user?.id || null;

      const { error: insertError } = await window.supabaseClient
        .from('submissions')
        .insert([
          {
            user_id: userId,
            unique_id: uniqueId,
            student_name: name,
            student_email: email,
            mission_title: mission.title,
            evidence_notes: notes,
            screenshot_urls: fileUrls
          }
        ]);

      if (insertError) throw insertError;

      // Success
      setComplete(mission.storageKey);
      checkAndAwardAwareBadge();
      
      const root = document.querySelector('[data-mission]');
      if (root) {
        const statusPill = root.querySelector('.module-status-pill');
        if (statusPill) statusPill.textContent = 'Submitted for final review';
      }

      alertBox.textContent = 'Success! Your submission has been saved to Supabase. You can now proceed to the next mission.';
      alertBox.style.backgroundColor = 'var(--success-bg)';
      alertBox.style.color = 'var(--success-fg)';
      alertBox.style.borderColor = 'var(--success-fg)';
      alertBox.style.display = 'block';

      // Replace form contents with a success banner
      form.innerHTML = `
        <div style="text-align: center; padding: 30px; border: 2px dashed var(--green); border-radius: var(--radius); margin-top: 20px;">
          <svg width="48" height="48" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 15px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <h4 style="color: var(--green); margin-bottom: 10px;">Submission Completed</h4>
          <p style="color: var(--ink-mid); font-size: 0.95rem;">All files uploaded successfully. Your progress is marked as complete.</p>
        </div>
      `;
    } catch (err) {
      console.error("Submission error:", err);
      alertBox.textContent = `Submission failed: ${err.message || err}`;
      alertBox.style.backgroundColor = 'var(--danger-bg)';
      alertBox.style.color = 'var(--danger-fg)';
      alertBox.style.borderColor = 'var(--danger-fg)';
      alertBox.style.display = 'block';
      
      submitBtn.disabled = false;
      submitBtn.textContent = `${buttonText} →`;
    }
  });

  section.appendChild(form);
  return section;
}

function buildReferralForm(mission) {
  const section = document.createElement('section');
  section.className = 'module-form-card';
  section.innerHTML = `
    <h3>Official Recognition Claim</h3>
    <p>Submit 1-5 acquaintances who completed the course. Onnoy manually verifies. 1-4 approved referrals earn Responsible Digital Citizen. 5 approved referrals earn Guardian.</p>
  `;
  const form = document.createElement('form');
  form.action = mission.formAction;
  form.method = 'POST';
  form.innerHTML = `
    <input type="hidden" name="_subject" value="Mission 4 Digital Guardian Claim">
    <div class="form-group"><label class="form-label" for="student_name">Your Name *</label><input class="form-control" id="student_name" name="student_name" required></div>
    <div class="form-group"><label class="form-label" for="student_contact">Your Email or Phone *</label><input class="form-control" id="student_contact" name="student_contact" required></div>
  `;
  for (let i = 1; i <= 5; i += 1) {
    form.innerHTML += `
      <div class="referral-row">
        <div class="form-group"><label class="form-label" for="ref_${i}_name">Acquaintance ${i} Name${i === 1 ? ' *' : ''}</label><input class="form-control" id="ref_${i}_name" name="ref_${i}_name" ${i === 1 ? 'required' : ''}></div>
        <div class="form-group"><label class="form-label" for="ref_${i}_contact">Acquaintance ${i} Contact${i === 1 ? ' *' : ''}</label><input class="form-control" id="ref_${i}_contact" name="ref_${i}_contact" ${i === 1 ? 'required' : ''}></div>
      </div>
    `;
  }
  form.innerHTML += '<button class="btn btn-green full-submit" type="submit">Submit Recognition Claim →</button>';
  form.addEventListener('submit', () => {
    setComplete(mission.storageKey);
    checkAndAwardGuardianBadge();
  });
  section.appendChild(form);
  return section;
}

async function triggerOverviewCompletionFlow() {
  try {
    if (window.supabaseClient) {
      const { data: { session } } = await window.supabaseClient.auth.getSession().catch(() => ({ data: { session: null } }));
      if (session && session.user) {
        const user = session.user;
        if (window.ADMIN_EMAILS.includes(user.email)) return;
        
        // 1. Fetch Unique ID from profile
        const { data: profile } = await window.supabaseClient
          .from('profiles')
          .select('unique_id, status')
          .eq('id', user.id)
          .single()
          .catch(() => ({ data: null }));
          
        if (profile) {
          const uniqueId = profile.unique_id;
          
          // 2. Set profile status to Approved in Supabase
          if (profile.status === 'pending') {
            await window.supabaseClient
              .from('profiles')
              .update({ status: 'Approved' })
              .eq('id', user.id);
          }
          
          // 3. Send email notification via Formspree
          const formAction = 'https://formspree.io/f/xwvyyoqr';
          const formData = new FormData();
          formData.append('email', user.email);
          formData.append('_subject', 'Onnoy-অন্বয়: Your Unique ID and Course Start');
          formData.append('student_name', user.user_metadata?.full_name || 'Student');
          formData.append('unique_id', uniqueId);
          formData.append('message', `Congratulations! You have completed the Course Overview. Your Unique ID is: ${uniqueId}. Save this ID for your missions!`);
          
          fetch(formAction, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          }).then(res => console.log('Overview Formspree submit status:', res.status))
            .catch(err => console.error('Overview Formspree submit error:', err));
        }
      }
    }
  } catch (e) {
    console.error("Error in overview completion flow:", e);
  }
}

// Restrict Level 2 mission cards and page access sequentially
async function restrictMissionAccess() {
  const isMissionsPage = window.location.pathname.endsWith('level-2-missions.html');
  const root = document.querySelector('[data-mission]');
  
  if (!isMissionsPage && !root) return;
  
  try {
    if (window.supabaseClient) {
      const { data: { session } } = await window.supabaseClient.auth.getSession().catch(() => ({ data: { session: null } }));
      
      const fileNames = [
        'mission-spot-the-lie.html',
        'mission-scam-alert.html',
        'mission-ai-integrity.html',
        'mission-digital-guardian.html'
      ];

      const startBtn = document.querySelector('.module-page-nav a.btn-green');

      if (!session || !session.user) {
        const lang = document.documentElement.getAttribute('lang') || localStorage.getItem('onnoy_lang') || 'en';
        const dict = typeof translations !== 'undefined' ? translations : {};
        const loginToProceedMsg = (dict['missions-login-to-proceed'] && dict['missions-login-to-proceed'][lang]) || "You need to log in to get the Unique ID and to go on. The Unique ID will be sent with the confirmation email.";

        if (isMissionsPage) {
          lockAllMissionCards(loginToProceedMsg);
          if (startBtn) {
            startBtn.href = 'login.html';
            startBtn.textContent = lang === 'bn' ? 'শুরু করতে লগইন করুন →' : 'Log In to Start →';
          }
        } else if (root) {
          blockMissionPage(loginToProceedMsg);
        }
        return;
      }
      
      const isAdmin = window.ADMIN_EMAILS.includes(session.user.email);
      
      const { data: profile } = await window.supabaseClient
        .from('profiles')
        .select('status')
        .eq('id', session.user.id)
        .single()
        .catch(() => ({ data: null }));
        
      const status = profile?.status || 'pending';
      
      const unlockedMissions = new Set();
      if (status === 'Approved' || status === 'Mission2Unlocked' || status === 'Mission3Unlocked' || status === 'Mission4Unlocked' || isAdmin) {
        unlockedMissions.add('spotLie');
      }
      if (status === 'Mission2Unlocked' || status === 'Mission3Unlocked' || status === 'Mission4Unlocked' || isAdmin) {
        unlockedMissions.add('scamAlert');
      }
      if (status === 'Mission3Unlocked' || status === 'Mission4Unlocked' || isAdmin) {
        unlockedMissions.add('aiIntegrity');
      }
      if (status === 'Mission4Unlocked' || isAdmin) {
        unlockedMissions.add('guardian');
      }
      
      if (isMissionsPage) {
        const cards = document.querySelectorAll('.mission-card');
        const order = ['spotLie', 'scamAlert', 'aiIntegrity', 'guardian'];
        
        cards.forEach((card, idx) => {
          const mKey = order[idx];
          if (!unlockedMissions.has(mKey)) {
            card.classList.add('is-locked');
            card.setAttribute('aria-disabled', 'true');
            card.href = '#';
            
            if (!card.dataset.hasLockListener) {
              card.dataset.hasLockListener = 'true';
              card.addEventListener('click', (e) => {
                if (card.classList.contains('is-locked')) {
                  e.preventDefault();
                }
              });
            }
            
            const p = card.querySelector('p');
            if (p) {
              p.innerHTML = `<span class="lock-msg" style="color: var(--caution-fg); font-weight: 600;">🔒 Locked - Pending Admin Approval of previous mission.</span>`;
            }
          } else {
            card.classList.remove('is-locked');
            card.removeAttribute('aria-disabled');
            card.href = fileNames[idx];
            
            const p = card.querySelector('p');
            if (p && p.querySelector('.lock-msg')) {
              const originalDescs = [
                'Upload five misinformation examples and your fact-check notes.',
                'Upload five scam examples and explain your checks.',
                'Upload five AI-related misinformation examples and verification notes.',
                'Invite 1-5 acquaintances to complete the course.'
              ];
              p.textContent = originalDescs[idx];
            }
          }
        });

        // Update green start button dynamically
        if (startBtn) {
          if (status === 'Approved') {
            startBtn.href = 'mission-spot-the-lie.html';
            startBtn.textContent = 'Start Mission 1 →';
          } else if (status === 'Mission2Unlocked') {
            startBtn.href = 'mission-scam-alert.html';
            startBtn.textContent = 'Start Mission 2 →';
          } else if (status === 'Mission3Unlocked') {
            startBtn.href = 'mission-ai-integrity.html';
            startBtn.textContent = 'Start Mission 3 →';
          } else if (status === 'Mission4Unlocked') {
            startBtn.href = 'mission-digital-guardian.html';
            startBtn.textContent = 'Start Mission 4 →';
          } else {
            startBtn.href = 'mission-spot-the-lie.html';
            startBtn.textContent = 'Start Mission 1 →';
          }
        }
      } else if (root) {
        const currentMissionKey = root.dataset.mission;
        if (!unlockedMissions.has(currentMissionKey)) {
          blockMissionPage("This mission is locked. Please complete and submit the previous mission, and wait for admin approval.");
        }
      }
    } else {
      setTimeout(restrictMissionAccess, 200);
    }
  } catch (e) {
    console.error("Error restricting mission access:", e);
  }
}

function lockAllMissionCards(message) {
  const cards = document.querySelectorAll('.mission-card');
  cards.forEach(card => {
    card.classList.add('is-locked');
    card.setAttribute('aria-disabled', 'true');
    card.href = '#';
    if (!card.dataset.hasLockListener) {
      card.dataset.hasLockListener = 'true';
      card.addEventListener('click', (e) => {
        if (card.classList.contains('is-locked')) {
          e.preventDefault();
        }
      });
    }
    const p = card.querySelector('p');
    if (p) p.innerHTML = `<span class="lock-msg" style="color: var(--danger-fg); font-weight: 600;">${message}</span>`;
  });
}

function blockMissionPage(message, buttonText = "Back to Modules", buttonHref = "modules.html") {
  const root = document.querySelector('[data-mission]');
  if (root) {
    root.innerHTML = `
      <div class="note-box" style="margin: 40px auto; max-width: 600px; padding: 30px; text-align: center; border-radius: var(--radius); border: 1px solid var(--border);">
        <svg width="48" height="48" fill="none" stroke="var(--caution-fg)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 20px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        <h3 style="color: var(--caution-fg); margin-bottom: 15px;">Mission Access Restricted</h3>
        <p style="color: var(--ink-mid); margin-bottom: 20px; line-height: 1.5;">${message}</p>
        <a href="${buttonHref}" class="btn btn-green">${buttonText}</a>
      </div>
    `;
  }
}

// --- GAMIFICATION / BADGES SYSTEM ---

function showBadgeEarnedModal(badgeId) {
  if (document.getElementById('badge-modal-overlay')) return;

  const badgeInfo = {
    informed: {
      name: 'Informed',
      title: 'Informed Badge Unlocked!',
      desc: 'Congratulations! You have completed all five Level 1 modules on digital citizenship. You are now prepared for Level 2 missions.',
      image: 'assets/images/badges/informed.png',
      color: '#06d6a0'
    },
    aware: {
      name: 'Aware',
      title: 'Aware Badge Unlocked!',
      desc: 'Incredible work! You have successfully completed three Level 2 missions. Your awareness of online threats is outstanding.',
      image: 'assets/images/badges/aware.png',
      color: '#2563eb'
    },
    guardian: {
      name: 'Guardian',
      title: 'Guardian Badge Unlocked!',
      desc: 'Congratulations! You have completed all four Level 2 missions and claimed the ultimate Digital Guardian status!',
      image: 'assets/images/badges/guardian.png',
      color: '#ef476f'
    }
  };

  const badge = badgeInfo[badgeId];
  if (!badge) return;

  // Load confetti script dynamically if not present
  if (!window.confetti) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    script.onload = () => {
      triggerConfetti();
    };
    document.head.appendChild(script);
  } else {
    setTimeout(triggerConfetti, 100);
  }

  function triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.6 }
        });
      }, 250);
    }
  }

  const overlay = document.createElement('div');
  overlay.id = 'badge-modal-overlay';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.backgroundColor = 'rgba(11, 19, 43, 0.85)';
  overlay.style.backdropFilter = 'blur(10px)';
  overlay.style.webkitBackdropFilter = 'blur(10px)';
  overlay.style.zIndex = '99999';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.padding = '20px';
  overlay.style.animation = 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

  const basePath = window.location.pathname.includes('/courses/') ? '../' : '';
  const imgUrl = basePath + badge.image;

  overlay.innerHTML = `
    <div id="badge-modal-card" style="background: #ffffff; border-radius: 24px; padding: 40px; text-align: center; max-width: 440px; width: 100%; border: 2px solid ${badge.color}; box-shadow: 0 20px 40px rgba(0,0,0,0.3); transform: scale(0.9); animation: scaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; box-sizing: border-box;">
      <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; color: ${badge.color}; font-weight: 700; margin-bottom: 15px;">New Achievement!</div>
      <div style="position: relative; margin-bottom: 25px; display: inline-block;">
        <div style="position: absolute; inset: -15px; border-radius: 50%; background: ${badge.color}; opacity: 0.1; filter: blur(15px); animation: pulse 2s infinite alternate;"></div>
        <img src="${imgUrl}" alt="${badge.name} Badge" style="width: 160px; height: 160px; object-fit: contain; position: relative;">
      </div>
      <h2 style="font-size: 1.8rem; color: #0b132b; margin: 0 0 12px 0; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800;">${badge.title}</h2>
      <p style="color: #4b5563; font-size: 0.95rem; line-height: 1.6; margin: 0 0 30px 0;">${badge.desc}</p>
      <button id="close-badge-btn" class="btn" style="background: ${badge.color}; color: #ffffff; width: 100%; padding: 14px; border-radius: 12px; font-weight: 700; border: none; cursor: pointer; transition: transform 0.2s, filter 0.2s; font-size: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">Awesome! →</button>
    </div>
  `;

  if (!document.getElementById('badge-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'badge-modal-styles';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleUp {
        to { transform: scale(1); }
      }
      @keyframes pulse {
        from { transform: scale(0.95); opacity: 0.05; }
        to { transform: scale(1.05); opacity: 0.15; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector('#close-badge-btn');
  closeBtn.addEventListener('click', () => {
    overlay.style.animation = 'fadeIn 0.3s reverse forwards';
    const card = overlay.querySelector('#badge-modal-card');
    card.style.animation = 'scaleUp 0.3s reverse cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards';
    setTimeout(() => {
      overlay.remove();
      renderBadgesDisplay();
    }, 300);
  });
}

const addBadgeToDatabase = async (badgeName) => {
  try {
    if (window.supabaseClient) {
      const { data: { session } } = await window.supabaseClient.auth.getSession().catch(() => ({ data: { session: null } }));
      if (session && session.user) {
        const { data: profile } = await window.supabaseClient
          .from('profiles')
          .select('badges')
          .eq('id', session.user.id)
          .single()
          .catch(() => ({ data: null }));

        let currentBadges = [];
        if (profile && profile.badges) {
          currentBadges = Array.isArray(profile.badges) ? profile.badges : [];
        }

        if (!currentBadges.includes(badgeName)) {
          currentBadges.push(badgeName);
          await window.supabaseClient
            .from('profiles')
            .update({ badges: currentBadges })
            .eq('id', session.user.id);
          console.log(`Successfully saved badge ${badgeName} to database.`);
        }
      }
    }
  } catch (err) {
    console.error("Error saving badge to database:", err);
  }
};

const syncLocalBadgesToDatabase = async () => {
  try {
    if (window.supabaseClient) {
      const { data: { session } } = await window.supabaseClient.auth.getSession().catch(() => ({ data: { session: null } }));
      if (session && session.user) {
        const localBadges = [];
        if (localStorage.getItem('onnoy_badge_informed_shown') === 'true') localBadges.push('informed');
        if (localStorage.getItem('onnoy_badge_aware_shown') === 'true') localBadges.push('aware');
        if (localStorage.getItem('onnoy_badge_guardian_shown') === 'true') localBadges.push('guardian');

        if (localBadges.length > 0) {
          const { data: profile } = await window.supabaseClient
            .from('profiles')
            .select('badges')
            .eq('id', session.user.id)
            .single()
            .catch(() => ({ data: null }));

          let dbBadges = [];
          if (profile && profile.badges) {
            dbBadges = Array.isArray(profile.badges) ? profile.badges : [];
          }

          let updated = false;
          localBadges.forEach(badge => {
            if (!dbBadges.includes(badge)) {
              dbBadges.push(badge);
              updated = true;
            }
          });

          if (updated) {
            await window.supabaseClient
              .from('profiles')
              .update({ badges: dbBadges })
              .eq('id', session.user.id);
            console.log("Synced local badges to Supabase:", dbBadges);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error syncing local badges:", err);
  }
};

function checkAndAwardInformedBadge() {
  const allComplete = lessonOrder.every(id => isComplete(courseLessons[id].storageKey));
  if (allComplete) {
    if (localStorage.getItem('onnoy_badge_informed_shown') !== 'true') {
      localStorage.setItem('onnoy_badge_informed_shown', 'true');
      showBadgeEarnedModal('informed');
      addBadgeToDatabase('informed');
    }
  }
}

function checkAndAwardAwareBadge() {
  const threeMissions = ['spotLie', 'scamAlert', 'aiIntegrity'];
  const threeComplete = threeMissions.every(id => isComplete(missions[id].storageKey));
  if (threeComplete) {
    if (localStorage.getItem('onnoy_badge_aware_shown') !== 'true') {
      localStorage.setItem('onnoy_badge_aware_shown', 'true');
      showBadgeEarnedModal('aware');
      addBadgeToDatabase('aware');
    }
  }
}

function checkAndAwardGuardianBadge() {
  if (isComplete(missions.guardian.storageKey)) {
    if (localStorage.getItem('onnoy_badge_guardian_shown') !== 'true') {
      localStorage.setItem('onnoy_badge_guardian_shown', 'true');
      showBadgeEarnedModal('guardian');
      addBadgeToDatabase('guardian');
    }
  }
}

function renderBadgesDisplay() {
  const progressCard = document.getElementById('courseProgress')?.closest('.module-content-card') || 
                       document.getElementById('missionProgress')?.closest('.module-content-card');
  if (!progressCard) return;

  let badgesCard = document.getElementById('badges-achievements-card');
  const basePath = window.location.pathname.includes('/courses/') ? '../' : '';
  
  const badges = [
    {
      id: 'informed',
      name: 'Informed',
      image: 'assets/images/badges/informed.png',
      desc: 'Complete all Level 1 modules'
    },
    {
      id: 'aware',
      name: 'Aware',
      image: 'assets/images/badges/aware.png',
      desc: 'Complete 3 missions'
    },
    {
      id: 'guardian',
      name: 'Guardian',
      image: 'assets/images/badges/guardian.png',
      desc: 'Complete 4 missions'
    }
  ];

  const htmlList = badges.map(b => {
    const isEarned = (b.id === 'informed' && localStorage.getItem('onnoy_badge_informed_shown') === 'true') ||
                     (b.id === 'aware' && localStorage.getItem('onnoy_badge_aware_shown') === 'true') ||
                     (b.id === 'guardian' && localStorage.getItem('onnoy_badge_guardian_shown') === 'true');
                     
    const style = isEarned ? 'opacity: 1; filter: none;' : 'opacity: 0.35; filter: grayscale(100%);';
    const borderStyle = isEarned ? 'border: 2px solid var(--green);' : 'border: 1px dashed var(--border);';
    const badgeStatus = isEarned ? '<span style="color: var(--green); font-weight: 600; font-size: 0.8rem;">Unlocked ✅</span>' : '<span style="color: var(--ink-light); font-size: 0.8rem;">Locked 🔒</span>';

    return `
      <div class="badge-item" style="flex: 1; min-width: 120px; max-width: 150px; text-align: center; padding: 15px; border-radius: var(--radius); ${borderStyle} transition: all 0.3s ease; box-sizing: border-box; background: rgba(255,255,255,0.02);">
        <img src="${basePath + b.image}" alt="${b.name}" style="width: 70px; height: 70px; object-fit: contain; margin-bottom: 10px; ${style}">
        <h4 style="margin: 0 0 5px 0; font-size: 0.95rem; font-weight: 700; color: var(--ink);">${b.name}</h4>
        <p style="margin: 0 0 10px 0; font-size: 0.72rem; color: var(--ink-mid); min-height: 30px; line-height: 1.3;">${b.desc}</p>
        ${badgeStatus}
      </div>
    `;
  }).join('');

  if (!badgesCard) {
    badgesCard = document.createElement('section');
    badgesCard.className = 'module-content-card';
    badgesCard.id = 'badges-achievements-card';
    badgesCard.style.marginBottom = '24px';
    progressCard.parentNode.insertBefore(badgesCard, progressCard);
  }

  badgesCard.innerHTML = `
    <h3>Your Badges & Achievements</h3>
    <div style="display: flex; gap: 15px; justify-content: space-around; flex-wrap: wrap; margin-top: 20px;">
      ${htmlList}
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderLesson();
  renderHubProgress();
  renderMission();
  
  renderBadgesDisplay();
  checkAndAwardInformedBadge();
  checkAndAwardAwareBadge();
  checkAndAwardGuardianBadge();
  
  const initLocks = () => {
    if (window.supabaseClient) {
      restrictMissionAccess();
      syncLocalBadgesToDatabase();
      window.supabaseClient.auth.onAuthStateChange(() => {
        restrictMissionAccess();
        syncLocalBadgesToDatabase();
      });
    } else {
      setTimeout(initLocks, 100);
    }
  };
  initLocks();
});
