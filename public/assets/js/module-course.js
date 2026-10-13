// Admin status is resolved from profiles.role (enforced by RLS), never from a client-side list.
window.onnoyIsAdmin = window.onnoyIsAdmin || (async function (user) {
  try {
    if (!user || !window.supabaseClient) return false;
    if (window.__onnoyAdmin && window.__onnoyAdmin.id === user.id) return window.__onnoyAdmin.v;
    const { data } = await window.supabaseClient.from('profiles').select('role').eq('id', user.id).maybeSingle();
    const v = !!data && data.role === 'admin';
    window.__onnoyAdmin = { id: user.id, v };
    return v;
  } catch (e) { return false; }
});

const courseLessons = {
  overview: {
    storageKey: 'onnoy_lesson_overview',
    eyebrow: 'Digital Citizenship',
    title: 'Level 1: Digital Citizenship Course',
    subtitle: 'A colorful self-paced course that prepares students for safer, wiser, and more responsible digital life.',
    objectives: [
      { en: 'Name the four digital skills covered in Level 1.', bn: 'লেভেল ১-এর চারটি ডিজিটাল দক্ষতার নাম বলতে পারবেন।' },
      { en: 'Explain how lesson progress and Level 2 unlocking work.', bn: 'পাঠের অগ্রগতি ও লেভেল ২ কীভাবে খুলবে তা বুঝতে পারবেন।' },
      { en: 'Choose one digital habit you want to improve.', bn: 'নিজের একটি ডিজিটাল অভ্যাস উন্নত করার লক্ষ্য ঠিক করবেন।' }
    ],
    scenario: {
      title: 'Speed-run or learn?',
      titleBn: 'দ্রুত শেষ, নাকি সত্যি শেখা?',
      prompt: 'A friend says, “Just click the first answer on every page so Level 2 unlocks.” What would make the course useful instead?',
      promptBn: 'এক বন্ধু বলল, “প্রতি পাতায় প্রথম উত্তরটায় ক্লিক করলেই লেভেল ২ খুলবে।” কোর্সটি সত্যি কাজে লাগাতে কী করবেন?',
      options: [
        { text: 'Click quickly and forget the lesson', textBn: 'দ্রুত ক্লিক করে পাঠ ভুলে যাব', impact: 'risky', feedback: 'Unlocking a page is not the same as building a skill. The missions will be difficult without practice.', feedbackBn: 'পাতা খোলা আর দক্ষতা তৈরি এক নয়। অনুশীলন ছাড়া মিশনগুলো কঠিন হবে।' },
        { text: 'Work through each scenario and explain one idea in my own words', textBn: 'প্রতিটি পরিস্থিতি বুঝে একটি ধারণা নিজের ভাষায় বলব', impact: 'strong', feedback: 'That turns information into a usable habit. Explaining an idea is a strong check that you understood it.', feedbackBn: 'এতে তথ্য ব্যবহারযোগ্য অভ্যাসে বদলায়। নিজের ভাষায় বোঝাতে পারা সত্যি বোঝার ভালো প্রমাণ।' },
        { text: 'Read only the headings and return later', textBn: 'শুধু শিরোনাম পড়ে পরে ফিরব', impact: 'partial', feedback: 'A preview can help, but decide when you will return and practice so “later” does not become “never.”', feedbackBn: 'আগে দেখে নেওয়া কাজে লাগে, তবে কখন ফিরে অনুশীলন করবেন তা ঠিক করুন—নইলে “পরে” আর নাও আসতে পারে।' }
      ]
    },
    nextHref: '/module-attention-literacy',
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
        hint: 'Think about what students should be able to do differently online, not what they should collect or avoid forever.',
        hintBn: 'শিক্ষার্থীরা অনলাইনে কী ভিন্নভাবে করতে পারবে তা ভাবুন—কী সংগ্রহ করবে বা চিরদিন কী এড়িয়ে চলবে তা নয়।',
        explanation: 'Level 1 builds practical habits for attention, verification, scam safety, and responsible AI use before the missions.',
        explanationBn: 'লেভেল ১ মিশনের আগে মনোযোগ, যাচাই, স্ক্যাম নিরাপত্তা ও দায়িত্বশীল এআই ব্যবহারের বাস্তব অভ্যাস গড়ে।',
        options: [
          ['Build safer digital habits and prepare for Level 2 missions', true],
          ['Collect social media passwords', false],
          ['Make students stop using the internet forever', false]
        ]
      },
      {
        question: 'When does Level 2 unlock in this browser?',
        hint: 'The gate checks every Level 1 lesson saved in this browser.',
        hintBn: 'গেটটি এই ব্রাউজারে সংরক্ষিত প্রতিটি লেভেল ১ পাঠ যাচাই করে।',
        explanation: 'All five lesson checks must be completed in the same browser before Level 2 unlocks.',
        explanationBn: 'লেভেল ২ খুলতে একই ব্রাউজারে পাঁচটি পাঠের check শেষ করতে হবে।',
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
    objectives: [
      { en: 'Recognize design features that remove stopping points.', bn: 'থামার স্বাভাবিক জায়গা সরিয়ে দেওয়া design feature চিনবেন।' },
      { en: 'Notice the trigger behind an automatic phone check.', bn: 'অজান্তে ফোন ধরার পেছনের trigger খেয়াল করবেন।' },
      { en: 'Use one small boundary to protect focused time.', bn: 'মনোযোগের সময় বাঁচাতে একটি ছোট boundary ব্যবহার করবেন।' }
    ],
    scenario: {
      title: 'The notification test',
      titleBn: 'নোটিফিকেশনের পরীক্ষা',
      prompt: 'You planned to study for 25 minutes. Three minutes in, your phone vibrates. What do you do?',
      promptBn: 'আপনি ২৫ মিনিট পড়ার পরিকল্পনা করেছেন। তিন মিনিট পর ফোন vibrate করল। কী করবেন?',
      options: [
        { text: 'Open it for “just one second”', textBn: '“এক সেকেন্ডের জন্য” খুলব', impact: 'risky', feedback: 'One check creates a new attention loop. Returning to the same depth of focus can take much longer than the notification.', feedbackBn: 'একবার দেখলেই নতুন attention loop শুরু হয়। আগের গভীর মনোযোগে ফিরতে notification-এর চেয়ে অনেক বেশি সময় লাগতে পারে।' },
        { text: 'Turn it face down and finish the 25-minute block', textBn: 'ফোন উল্টো রেখে ২৫ মিনিট শেষ করব', impact: 'strong', feedback: 'You created a visible stopping rule without needing perfect willpower. Check the phone when the planned block ends.', feedbackBn: 'নিখুঁত ইচ্ছাশক্তি ছাড়াই আপনি স্পষ্ট stopping rule বানালেন। নির্ধারিত সময় শেষে ফোন দেখুন।' },
        { text: 'Switch the phone off for the whole day', textBn: 'সারাদিন ফোন বন্ধ রাখব', impact: 'partial', feedback: 'A strong boundary can help, but an extreme rule may be hard to repeat. A smaller focus block is often more sustainable.', feedbackBn: 'কঠিন boundary কাজে লাগতে পারে, তবে চরম নিয়ম বারবার মানা কঠিন। ছোট focus block সাধারণত বেশি টেকসই।' }
      ]
    },
    prevHref: '/module-overview',
    nextHref: '/module-misinformation',
    image: '/assets/images/modules/algorithm-loop.png',
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
        hint: 'Feeds learn from deliberate searches, watch time, follows, and feedback such as “Not interested.”',
        hintBn: 'Feed আপনার search, watch time, follow ও “Not interested” feedback থেকে শেখে।',
        explanation: 'Intentional searches and feedback give the recommendation system better signals than opening every emotional post.',
        explanationBn: 'ইচ্ছাকৃত search ও feedback recommendation system-কে emotional post খোলার চেয়ে ভালো signal দেয়।',
        options: [
          ['Searching for topics you want to learn', true],
          ['Opening every shocking post immediately', false],
          ['Scrolling until you feel tired', false]
        ]
      },
      {
        question: 'What makes infinite scroll risky?',
        hint: 'Think about what normally tells your brain that an activity has ended.',
        hintBn: 'সাধারণত কোন সংকেত আপনার মস্তিষ্ককে বলে একটি কাজ শেষ হয়েছে তা ভাবুন।',
        explanation: 'Infinite scroll removes page endings, making it harder to notice time and decide consciously to stop.',
        explanationBn: 'Infinite scroll পাতার শেষ সরিয়ে দেয়, তাই সময় বোঝা ও সচেতনভাবে থামা কঠিন হয়।',
        options: [
          ['It removes natural stopping points', true],
          ['It blocks all videos', false],
          ['It always improves sleep', false]
        ]
      },
      {
        question: 'What is a good first step when your phone use feels automatic?',
        hint: 'Awareness comes before changing a habit.',
        hintBn: 'অভ্যাস বদলানোর আগে সচেতন হওয়া দরকার।',
        explanation: 'A short pause reveals the trigger—boredom, stress, a notification, or a real task—so you can choose the next action.',
        explanationBn: 'ছোট বিরতিতে trigger—একঘেয়েমি, stress, notification বা সত্যিকারের কাজ—বোঝা যায়, তারপর পরের কাজ বেছে নেওয়া যায়।',
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
    objectives: [
      { en: 'Distinguish misinformation from deliberate disinformation.', bn: 'ভুল misinformation ও ইচ্ছাকৃত disinformation আলাদা করবেন।' },
      { en: 'Use SIFT before sharing an emotional claim.', bn: 'আবেগ তৈরি করা claim share করার আগে SIFT ব্যবহার করবেন।' },
      { en: 'Trace an image or claim back to its original context.', bn: 'ছবি বা claim-এর মূল context খুঁজবেন।' }
    ],
    scenario: {
      title: 'The urgent flood photo',
      titleBn: 'জরুরি বন্যার ছবি',
      prompt: 'A cousin sends a dramatic flood photo labelled “Mymensingh right now—share urgently.” You do not recognize the source.',
      promptBn: 'এক cousin নাটকীয় বন্যার ছবি পাঠাল—“ময়মনসিংহে এখনই, জরুরি share করুন।” Source চেনেন না।',
      options: [
        { text: 'Forward it with a question mark', textBn: 'Question mark দিয়ে forward করব', impact: 'risky', feedback: 'A question mark does not stop the image spreading. People may remember the alarming claim, not your uncertainty.', feedbackBn: 'Question mark ছবি ছড়ানো থামায় না। মানুষ আপনার সন্দেহ নয়, ভয়ংকর claim-টাই মনে রাখতে পারে।' },
        { text: 'Check the date, reverse-search the image, and look for reliable local coverage', textBn: 'তারিখ দেখব, image reverse-search করব, reliable local coverage খুঁজব', impact: 'strong', feedback: 'This follows SIFT: stop, investigate, find better coverage, and trace the image to its original context.', feedbackBn: 'এটাই SIFT: থামুন, source দেখুন, ভালো coverage খুঁজুন, ছবির মূল context বের করুন।' },
        { text: 'Do not share it, but do not check either', textBn: 'Share করব না, check-ও করব না', impact: 'partial', feedback: 'Not spreading it prevents harm. Checking can also help you correct the claim for family members who already received it.', feedbackBn: 'না ছড়ালে ক্ষতি কমে। Check করলে যারা আগেই পেয়েছে তাদের ভুলটাও ধরিয়ে দিতে পারবেন।' }
      ]
    },
    prevHref: '/module-attention-literacy',
    nextHref: '/module-scam-safety',
    image: '/assets/images/modules/sift.png',
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
        hint: 'The first letter in SIFT is the first action.',
        hintBn: 'SIFT-এর প্রথম অক্ষরটিই প্রথম কাজ।',
        explanation: 'Stop before reacting. Strong emotion is a signal to slow down and investigate, not proof that a claim is true.',
        explanationBn: 'প্রতিক্রিয়ার আগে থামুন। তীব্র আবেগ ধীরে যাচাই করার signal, claim সত্য হওয়ার প্রমাণ নয়।',
        options: [
          ['Stop before sharing', true],
          ['Forward it with a question mark', false],
          ['Argue in comments immediately', false]
        ]
      },
      {
        question: 'What is disinformation?',
        hint: 'Intent is the key difference.',
        hintBn: 'মূল পার্থক্য হলো উদ্দেশ্য।',
        explanation: 'Disinformation is false or manipulated information created deliberately to deceive, influence, or harm.',
        explanationBn: 'Disinformation হলো প্রতারণা, প্রভাব বা ক্ষতির উদ্দেশ্যে ইচ্ছাকৃতভাবে বানানো ভুল বা বিকৃত তথ্য।',
        options: [
          ['False information created to deceive or harm', true],
          ['Any post with a long caption', false],
          ['A true story from a newspaper', false]
        ]
      },
      {
        question: 'Which action is part of SIFT?',
        hint: 'A screenshot may hide where a claim originally came from.',
        hintBn: 'Screenshot claim-এর মূল source লুকিয়ে রাখতে পারে।',
        explanation: 'Tracing a claim to the original post, report, image, or study reveals missing dates, edits, and context.',
        explanationBn: 'Claim-এর মূল post, report, image বা study খুঁজলে হারানো তারিখ, edit ও context দেখা যায়।',
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
    objectives: [
      { en: 'Recognize urgency, rewards, and authority as scam pressure signals.', bn: 'Urgency, reward ও authority-কে scam pressure signal হিসেবে চিনবেন।' },
      { en: 'Read a domain from right to left before trusting a link.', bn: 'Link বিশ্বাসের আগে domain ডান দিক থেকে পড়বেন।' },
      { en: 'Verify money requests through a separate trusted channel.', bn: 'টাকার অনুরোধ আলাদা trusted channel-এ যাচাই করবেন।' }
    ],
    scenario: {
      title: 'A friend needs money now',
      titleBn: 'বন্ধুর এখনই টাকা দরকার',
      prompt: 'A close friend messages from their usual account: “Emergency—send ৳2,000 now. I cannot call.” The tone feels unusual.',
      promptBn: 'ঘনিষ্ঠ বন্ধুর usual account থেকে message: “Emergency—এখনই ৳২,০০০ পাঠাও। Call করতে পারব না।” ভাষা অস্বাভাবিক লাগছে।',
      options: [
        { text: 'Call the friend on a number you already know before sending anything', textBn: 'আগে থেকে জানা নম্বরে বন্ধুকে call করে তারপর সিদ্ধান্ত নেব', impact: 'strong', feedback: 'A separate trusted channel breaks the scammer’s control of the chat. Do not use a number supplied in the suspicious message.', feedbackBn: 'আলাদা trusted channel scammer-এর chat control ভেঙে দেয়। Suspicious message-এর দেওয়া নম্বর ব্যবহার করবেন না।' },
        { text: 'Ask for proof in the same chat', textBn: 'একই chat-এ প্রমাণ চাইব', impact: 'partial', feedback: 'A hacker controlling the account can answer questions or use old messages. A separate call is much stronger verification.', feedbackBn: 'Account hacker প্রশ্নের উত্তর বা পুরোনো message ব্যবহার করতে পারে। আলাদা call অনেক শক্ত verification।' },
        { text: 'Send a smaller amount first', textBn: 'আগে অল্প টাকা পাঠাব', impact: 'risky', feedback: 'A smaller loss is still a loss and confirms you are responsive. Verify first; urgency is part of the pressure.', feedbackBn: 'অল্প ক্ষতিও ক্ষতি, আর আপনি respond করেন তা scammer বুঝবে। আগে verify করুন; urgency চাপ তৈরির অংশ।' }
      ]
    },
    prevHref: '/module-misinformation',
    nextHref: '/module-ai-mindset',
    image: '/assets/images/modules/fake-link.png',
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
        hint: 'A trusted-looking account can still be hacked.',
        hintBn: 'চেনা account-ও hack হতে পারে।',
        explanation: 'Do not use the login link. Contact the friend separately and use the game’s official app or site to check any offer.',
        explanationBn: 'Login link ব্যবহার করবেন না। বন্ধুর সঙ্গে আলাদাভাবে যোগাযোগ করুন এবং offer check করতে official app/site ব্যবহার করুন।',
        options: [
          ['Do not log in; verify with the friend directly', true],
          ['Enter your password quickly before offer ends', false],
          ['Share the link with classmates', false]
        ]
      },
      {
        question: 'Which link sign is suspicious?',
        hint: 'Page colors are easy to copy; ownership is shown in the domain.',
        hintBn: 'Page-এর রং copy করা সহজ; মালিকানা domain-এ বোঝা যায়।',
        explanation: 'Misspellings, look-alike characters, and misleading subdomains are common ways to imitate trusted sites.',
        explanationBn: 'ভুল বানান, দেখতে একই character ও misleading subdomain দিয়ে trusted site নকল করা হয়।',
        options: [
          ['Misspellings or number substitutions in the domain', true],
          ['A familiar color scheme', false],
          ['A short paragraph on the page', false]
        ]
      },
      {
        question: 'What should you do with an OTP?',
        hint: 'An OTP is a temporary key, not a customer-support code.',
        hintBn: 'OTP অস্থায়ী চাবি, customer-support code নয়।',
        explanation: 'Anyone with your OTP may approve a login or transaction. Legitimate support should never ask you to reveal it.',
        explanationBn: 'OTP পেলে কেউ login বা transaction approve করতে পারে। Legitimate support কখনো এটি জানতে চাইবে না।',
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
    objectives: [
      { en: 'Explain why fluent AI output can still be wrong.', bn: 'সাবলীল AI output-ও কেন ভুল হতে পারে তা বুঝবেন।' },
      { en: 'Verify an AI claim or citation outside the AI tool.', bn: 'AI claim বা citation tool-এর বাইরে যাচাই করবেন।' },
      { en: 'Use AI for support while keeping human responsibility.', bn: 'মানবিক দায়িত্ব রেখে AI-কে সহায়ক হিসেবে ব্যবহার করবেন।' }
    ],
    scenario: {
      title: 'The perfect-looking citation',
      titleBn: 'নিখুঁত দেখানো citation',
      prompt: 'An AI gives you a polished paragraph and a journal citation for tomorrow’s assignment. The citation sounds real.',
      promptBn: 'AI আগামীকালের assignment-এর জন্য polished paragraph ও journal citation দিল। Citation-টি সত্যি মনে হচ্ছে।',
      options: [
        { text: 'Search the title, author, and DOI in a trusted database before using it', textBn: 'ব্যবহারের আগে trusted database-এ title, author ও DOI খুঁজব', impact: 'strong', feedback: 'Verification outside the model checks whether the source exists and whether it actually supports the claim.', feedbackBn: 'Model-এর বাইরে verification করলে source সত্যি আছে কি না এবং claim সমর্থন করে কি না বোঝা যায়।' },
        { text: 'Ask the same AI, “Are you sure?”', textBn: 'একই AI-কে জিজ্ঞেস করব, “তুমি নিশ্চিত?”', impact: 'partial', feedback: 'The model may repeat the same fabrication more confidently. Ask for evidence, then verify that evidence independently.', feedbackBn: 'Model একই বানানো তথ্য আরও আত্মবিশ্বাসে বলতে পারে। Evidence চান, তারপর আলাদাভাবে verify করুন।' },
        { text: 'Submit it because academic language means it is reliable', textBn: 'Academic ভাষা বলে submit করে দেব', impact: 'risky', feedback: 'Style is not evidence. AI can imitate scholarly language and invent authors, journals, links, or statistics.', feedbackBn: 'লেখার style প্রমাণ নয়। AI scholarly ভাষা নকল করে author, journal, link বা statistics বানাতে পারে।' }
      ]
    },
    prevHref: '/module-scam-safety',
    nextHref: '/level-2-missions',
    image: '/assets/images/modules/ai-dark-side.png',
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
        hint: 'Confidence and truth are different properties.',
        hintBn: 'আত্মবিশ্বাস ও সত্য আলাদা বিষয়।',
        explanation: 'Important claims should be checked against primary or trusted sources outside the AI response.',
        explanationBn: 'গুরুত্বপূর্ণ claim AI response-এর বাইরে primary বা trusted source-এ যাচাই করা উচিত।',
        options: [
          ['Verify it with trusted sources', true],
          ['Trust it because it sounds confident', false],
          ['Share it before checking', false]
        ]
      },
      {
        question: 'What is an AI hallucination?',
        hint: 'The output can sound polished even when its facts or sources do not exist.',
        hintBn: 'তথ্য বা source না থাকলেও output polished শোনাতে পারে।',
        explanation: 'A hallucination is plausible-sounding output containing false, unsupported, or invented information.',
        explanationBn: 'Hallucination হলো বিশ্বাসযোগ্য শোনানো কিন্তু ভুল, unsupported বা বানানো তথ্যসহ output।',
        options: [
          ['A confident answer that includes false or invented information', true],
          ['A verified source list from a library', false],
          ['A phone notification sound', false]
        ]
      },
      {
        question: 'What is the best role for AI in student work?',
        hint: 'The student remains responsible for evidence, meaning, and the final submission.',
        hintBn: 'Evidence, অর্থ ও final submission-এর দায়িত্ব শিক্ষার্থীরই।',
        explanation: 'AI can help brainstorm, organize, explain, or draft, but the student must understand, verify, revise, and disclose use when required.',
        explanationBn: 'AI brainstorm, organize, explain বা draft-এ সাহায্য করতে পারে; শিক্ষার্থীকে বুঝতে, যাচাই, revise ও প্রয়োজন হলে ব্যবহার disclose করতে হবে।',
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
    subtitle: 'Find 2 pieces of misinformation and show how you checked them.',
    prevHref: '/level-2-missions',
    nextHref: '/mission-scam-alert',
    type: 'form',
    formAction: 'https://formspree.io/f/xwvyyoqr',
    intro: 'Identify 2 pieces of misinformation. Upload your screenshots or PDFs in one place, then use numbered notes to explain each example.',
    guidelineTitle: 'Spot the Lie Rules',
    guidelineItems: [
      'Acceptable evidence: screenshots, image files, PDFs, source links, or video links.',
      'Submit screenshots/PDFs with the upload field. Paste video links and source links in the notes box.',
      'In the notes box, number each example 1-2 and explain what claim you found, why it may be false, and how you checked it.',
      'Hide private information before uploading. Do not submit passwords, OTPs, NID/card numbers, private messages, or harmful content.'
    ],
    notesPlaceholder: '1. Category: false claim / old image / edited screenshot / fake quote\nSource or video link:\nWhy it belongs here:\nHow I checked it:\n\n2. Category:\nSource or video link:\nWhy it belongs here:\nHow I checked it:'
  },
  scamAlert: {
    storageKey: 'onnoy_mission_scam_alert',
    title: 'Mission 2: Scam Alert',
    subtitle: 'Find 2 scams or suspicious messages and show your evidence.',
    prevHref: '/mission-spot-the-lie',
    nextHref: '/mission-ai-integrity',
    type: 'form',
    formAction: 'https://formspree.io/f/xwvyyoqr',
    intro: 'Identify 2 scams, suspicious links, or suspicious messages. Upload your screenshots or PDFs in one place, then use numbered notes to explain each example.',
    guidelineTitle: 'Scam Alert Rules',
    guidelineItems: [
      'Acceptable evidence: screenshots, image files, PDFs, suspicious links, message links, or video links.',
      'Submit screenshots/PDFs with the upload field. Paste video links, website links, and message details in the notes box.',
      'In the notes box, number each example 1-2 and explain the scam sign, what it asks people to do, and how you checked it.',
      'Hide private information before uploading. Do not submit passwords, OTPs, NID/card numbers, payment details, private messages, or live scam credentials.'
    ],
    notesPlaceholder: '1. Category: fake offer / phishing link / impersonation / payment scam\nSource or video link:\nWhy it belongs here:\nHow I checked it:\n\n2. Category:\nSource or video link:\nWhy it belongs here:\nHow I checked it:'
  },
  aiIntegrity: {
    storageKey: 'onnoy_mission_ai_integrity',
    title: 'Mission 3: AI Integrity Check',
    subtitle: 'Find 2 AI-related misinformation examples and show your checks.',
    prevHref: '/mission-scam-alert',
    nextHref: '/mission-digital-guardian',
    type: 'form',
    formAction: 'https://formspree.io/f/xwvyyoqr',
    intro: 'Identify 2 AI-generated or AI-assisted misinformation examples. Upload your screenshots or PDFs in one place, then use numbered notes to explain each example.',
    guidelineTitle: 'AI Integrity Check Rules',
    guidelineItems: [
      'Acceptable evidence: screenshots, image files, PDFs, AI output links, source links, or video links.',
      'Submit screenshots/PDFs with the upload field. Paste video links and AI/source links in the notes box.',
      'In the notes box, number each example 1-2 and explain whether it is AI-generated, AI-assisted, or AI-claimed, why it is risky, and how you verified it.',
      'Hide private information before uploading. Do not submit passwords, OTPs, NID/card numbers, private chats, or harmful synthetic content.'
    ],
    notesPlaceholder: '1. Category: AI image / AI text / fake source / deepfake claim\nSource or video link:\nWhy it belongs here:\nHow I checked it:\n\n2. Category:\nSource or video link:\nWhy it belongs here:\nHow I checked it:'
  },
  guardian: {
    storageKey: 'onnoy_mission_guardian',
    title: 'Mission 4: Digital Guardian Claim',
    subtitle: 'Invite 1-5 acquaintances to complete the course, then submit your claim.',
    prevHref: '/mission-ai-integrity',
    nextHref: '/modules',
    type: 'referral',
    formAction: 'https://formspree.io/f/xaqvvobg'
  }
};

const lessonOrder = ['overview', 'attention', 'misinformation', 'scams', 'ai'];
const missionOrder = ['spotLie', 'scamAlert', 'aiIntegrity', 'guardian'];

function isComplete(key) {
  try {
    return localStorage.getItem(key) === 'complete';
  } catch {
    return false;
  }
}

function setComplete(key) {
  try {
    localStorage.setItem(key, 'complete');
  } catch {}
  if (typeof syncLocalBadgesToDatabase === 'function') {
    syncLocalBadgesToDatabase();
  }
}

function lessonLanguage() {
  return document.documentElement.lang === 'bn' ? 'bn' : 'en';
}

function lessonText(english, bangla) {
  return lessonLanguage() === 'bn' && bangla ? bangla : english;
}

function readLearningState(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

function saveLearningState(key, state) {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {}
}

function shuffledLessonOptions(options) {
  const shuffled = [...options];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapWith = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapWith]] = [shuffled[swapWith], shuffled[index]];
  }
  return shuffled;
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
  const learningKey = `${lesson.storageKey}_learning_v2`;
  const learningState = {
    slideIndex: 0,
    explored: false,
    practiced: false,
    scenarioChoice: null,
    reflection: '',
    ...readLearningState(learningKey)
  };

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
    <section class="module-learning-status" aria-label="Lesson progress">
      <span data-learning-stage="explore"><b>1</b>${lessonText('Explore', 'দেখুন')}</span>
      <span data-learning-stage="practice"><b>2</b>${lessonText('Practice', 'অনুশীলন')}</span>
      <span data-learning-stage="check"><b>3</b>${lessonText('Check', 'যাচাই')}</span>
    </section>
    <section class="module-objectives" aria-labelledby="lesson-objectives-title">
      <div class="module-kicker">${lessonText('Learning goals', 'শেখার লক্ষ্য')}</div>
      <h3 id="lesson-objectives-title">${lessonText('By the end, you can…', 'শেষে আপনি যা করতে পারবেন…')}</h3>
      <ul>${lesson.objectives.map((objective) => `<li>${lessonText(objective.en, objective.bn)}</li>`).join('')}</ul>
    </section>
  `;

  const updateLearningStatus = () => {
    const states = {
      explore: !!learningState.explored,
      practice: !!learningState.practiced,
      check: isComplete(lesson.storageKey)
    };
    Object.entries(states).forEach(([stage, complete]) => {
      root.querySelector(`[data-learning-stage="${stage}"]`)?.classList.toggle('is-complete', complete);
    });
  };
  updateLearningStatus();

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

  const presentation = document.createElement('section');
  presentation.className = 'module-presentation';
  presentation.setAttribute('aria-labelledby', 'lesson-presentation-title');
  presentation.innerHTML = `
    <header class="module-presentation-header">
      <div>
        <div class="module-kicker">${lessonText('Interactive lesson', 'ইন্টারঅ্যাকটিভ পাঠ')}</div>
        <h3 id="lesson-presentation-title">${lessonText('Learn one idea at a time', 'একবারে একটি ধারণা শিখুন')}</h3>
      </div>
      <strong class="module-slide-count" aria-live="polite"></strong>
    </header>
    <div class="module-presentation-progress" aria-hidden="true"><span></span></div>
    <div class="module-slide-tabs" role="tablist" aria-label="Lesson sections"></div>
    <div class="module-slides"></div>
    <nav class="module-presentation-nav" aria-label="Presentation controls">
      <button type="button" class="module-slide-back">← ${lessonText('Previous', 'আগেরটি')}</button>
      <button type="button" class="module-slide-next">${lessonText('Next idea', 'পরের ধারণা')} →</button>
    </nav>
  `;
  const slides = presentation.querySelector('.module-slides');
  const tabs = presentation.querySelector('.module-slide-tabs');
  lesson.sections.forEach((section, index) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.id = `lesson-tab-${index}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `lesson-slide-${index}`);
    tab.textContent = section.label || String(index + 1).padStart(2, '0');
    tabs.appendChild(tab);

    const slide = document.createElement('article');
    slide.className = 'module-slide';
    slide.id = `lesson-slide-${index}`;
    slide.setAttribute('role', 'tabpanel');
    slide.setAttribute('aria-labelledby', tab.id);
    slide.tabIndex = -1;
    slide.innerHTML = `
      <div class="module-section-label">${section.label || ''}</div>
      <h3>${section.title}</h3>
      <p>${section.body}</p>
      <ul>${section.points.map((point) => `<li>${point}</li>`).join('')}</ul>
    `;
    slides.appendChild(slide);
  });
  root.appendChild(presentation);

  const slideElements = Array.from(presentation.querySelectorAll('.module-slide'));
  const tabElements = Array.from(presentation.querySelectorAll('[role="tab"]'));
  const slideBack = presentation.querySelector('.module-slide-back');
  const slideNext = presentation.querySelector('.module-slide-next');
  const slideCount = presentation.querySelector('.module-slide-count');
  const slideProgress = presentation.querySelector('.module-presentation-progress span');
  let activeSlide = Math.max(0, Math.min(Number(learningState.slideIndex) || 0, slideElements.length - 1));

  const showSlide = (nextIndex, moveFocus = false) => {
    activeSlide = Math.max(0, Math.min(nextIndex, slideElements.length - 1));
    slideElements.forEach((slide, index) => { slide.hidden = index !== activeSlide; });
    tabElements.forEach((tab, index) => {
      tab.setAttribute('aria-selected', String(index === activeSlide));
      tab.tabIndex = index === activeSlide ? 0 : -1;
    });
    slideBack.disabled = activeSlide === 0;
    slideNext.disabled = activeSlide === slideElements.length - 1;
    slideNext.textContent = activeSlide === slideElements.length - 1
      ? lessonText('Ideas reviewed ✓', 'ধারণাগুলো দেখা হয়েছে ✓')
      : `${lessonText('Next idea', 'পরের ধারণা')} →`;
    slideCount.textContent = `${activeSlide + 1} / ${slideElements.length}`;
    slideProgress.style.width = `${((activeSlide + 1) / slideElements.length) * 100}%`;
    learningState.slideIndex = activeSlide;
    if (activeSlide === slideElements.length - 1) learningState.explored = true;
    saveLearningState(learningKey, learningState);
    updateLearningStatus();
    if (moveFocus) slideElements[activeSlide].focus({ preventScroll: true });
  };
  slideBack.addEventListener('click', () => showSlide(activeSlide - 1, true));
  slideNext.addEventListener('click', () => showSlide(activeSlide + 1, true));
  tabElements.forEach((tab, index) => tab.addEventListener('click', () => showSlide(index, true)));
  showSlide(activeSlide);

  if (lesson.image) {
    const figure = document.createElement('figure');
    figure.className = 'module-visual';
    figure.innerHTML = `<img src="${lesson.image}" alt="${lesson.imageAlt}">`;
    root.appendChild(figure);
  }

  if (lesson.scenario) {
    const scenario = document.createElement('section');
    scenario.className = 'module-scenario';
    scenario.innerHTML = `
      <div class="module-kicker">${lessonText('Decision lab', 'সিদ্ধান্তের অনুশীলন')}</div>
      <h3>${lessonText(lesson.scenario.title, lesson.scenario.titleBn)}</h3>
      <p class="module-scenario-prompt">${lessonText(lesson.scenario.prompt, lesson.scenario.promptBn)}</p>
      <div class="module-scenario-options"></div>
      <div class="module-scenario-feedback" aria-live="polite" hidden></div>
    `;
    const scenarioOptions = scenario.querySelector('.module-scenario-options');
    const scenarioFeedback = scenario.querySelector('.module-scenario-feedback');
    const chooseScenario = (button, option, index) => {
      scenarioOptions.querySelectorAll('button').forEach((choice) => {
        choice.classList.remove('is-strong', 'is-partial', 'is-risky');
        choice.setAttribute('aria-pressed', 'false');
      });
      button.classList.add(`is-${option.impact}`);
      button.setAttribute('aria-pressed', 'true');
      scenarioFeedback.className = `module-scenario-feedback is-${option.impact}`;
      scenarioFeedback.innerHTML = `<strong>${lessonText(option.impact === 'strong' ? 'Strong response' : option.impact === 'partial' ? 'Useful, but incomplete' : 'Pause and reconsider', option.impact === 'strong' ? 'শক্ত সিদ্ধান্ত' : option.impact === 'partial' ? 'কাজের, তবে অসম্পূর্ণ' : 'থেমে আবার ভাবুন')}</strong><p>${lessonText(option.feedback, option.feedbackBn)}</p>`;
      scenarioFeedback.hidden = false;
      learningState.scenarioChoice = index;
      learningState.practiced = true;
      saveLearningState(learningKey, learningState);
      updateLearningStatus();
    };
    lesson.scenario.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-pressed', 'false');
      button.innerHTML = `<span>${String.fromCharCode(65 + index)}</span>${lessonText(option.text, option.textBn)}`;
      button.addEventListener('click', () => chooseScenario(button, option, index));
      scenarioOptions.appendChild(button);
    });
    root.appendChild(scenario);
    if (Number.isInteger(learningState.scenarioChoice) && lesson.scenario.options[learningState.scenarioChoice]) {
      const option = lesson.scenario.options[learningState.scenarioChoice];
      const button = scenarioOptions.children[learningState.scenarioChoice];
      chooseScenario(button, option, learningState.scenarioChoice);
    }
  }

  if (lesson.activity) {
    const activity = document.createElement('section');
    activity.className = 'module-reflection';
    activity.innerHTML = `
      <div class="module-reflection-copy">
        <div class="module-activity-icon" aria-hidden="true">✎</div>
        <div>
          <div class="module-kicker">${lessonText('Your reflection', 'আপনার ভাবনা')}</div>
          <h3>${lesson.activity.title}</h3>
          <p>${lesson.activity.body}</p>
        </div>
      </div>
      <label for="lessonReflection">${lessonText('Write a short note for yourself', 'নিজের জন্য ছোট একটি নোট লিখুন')}</label>
      <textarea id="lessonReflection" maxlength="500" rows="4" placeholder="${lessonText('Keep it practical and specific…', 'বাস্তব ও নির্দিষ্ট করে লিখুন…')}"></textarea>
      <div class="module-reflection-footer">
        <p>${lessonText('Saved only in this browser. Do not include names, passwords, OTPs, or private messages.', 'শুধু এই ব্রাউজারে থাকবে। নাম, password, OTP বা private message লিখবেন না।')}</p>
        <button type="button">${lessonText('Save reflection', 'ভাবনা সংরক্ষণ করুন')}</button>
      </div>
      <p class="module-reflection-status" aria-live="polite"></p>
    `;
    const reflection = activity.querySelector('textarea');
    const saveReflection = activity.querySelector('button');
    const reflectionStatus = activity.querySelector('.module-reflection-status');
    reflection.value = typeof learningState.reflection === 'string' ? learningState.reflection : '';
    reflection.addEventListener('input', () => { reflectionStatus.textContent = ''; });
    saveReflection.addEventListener('click', () => {
      learningState.reflection = reflection.value.trim();
      saveLearningState(learningKey, learningState);
      reflectionStatus.textContent = lessonText('Saved on this device.', 'এই device-এ সংরক্ষিত হয়েছে।');
    });
    root.appendChild(activity);
  }

  const check = document.createElement('section');
  check.className = 'module-check';
  const checks = lesson.checks || [lesson.check];
  const answered = new Set();
  check.innerHTML = `<div class="module-kicker">${lessonText('Apply what you learned', 'শেখা বিষয় কাজে লাগান')}</div><h3>${lessonText('Quick Check', 'দ্রুত যাচাই')}</h3><p>${lessonText('Choose carefully. Every answer gives a hint or explains why it works.', 'ভেবে উত্তর দিন। প্রতিটি উত্তর hint দেবে বা কেন ঠিক তা বোঝাবে।')}</p><div class="module-quiz"></div><p class="module-feedback" aria-live="polite"></p>`;
  const quiz = check.querySelector('.module-quiz');
  const feedback = check.querySelector('.module-feedback');

  checks.forEach((item, index) => {
    const question = document.createElement('div');
    question.className = 'module-quiz-question';
    question.innerHTML = `
      <p class="module-question-text">${index + 1}. ${item.question}</p>
      <div class="module-options"></div>
      <p class="module-question-feedback" aria-live="polite"></p>
    `;
    const options = question.querySelector('.module-options');
    const questionFeedback = question.querySelector('.module-question-feedback');

    shuffledLessonOptions(item.options).forEach(([text, correct]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = text;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        question.querySelectorAll('button').forEach((btn) => {
          if (!btn.disabled) btn.classList.remove('is-wrong');
          if (!btn.disabled) btn.setAttribute('aria-pressed', 'false');
        });

        if (!correct) {
          button.classList.add('is-wrong');
          button.setAttribute('aria-pressed', 'true');
          questionFeedback.textContent = `${lessonText('Not yet', 'এখনো নয়')}: ${lessonText(item.hint, item.hintBn)}`;
          questionFeedback.className = 'module-question-feedback danger';
          return;
        }

        button.classList.add('is-correct');
        button.setAttribute('aria-pressed', 'true');
        answered.add(index);
        question.querySelectorAll('button').forEach((btn) => {
          btn.disabled = true;
        });
        questionFeedback.textContent = `${lessonText('Why it works', 'কেন ঠিক')}: ${lessonText(item.explanation, item.explanationBn)}`;
        questionFeedback.className = 'module-question-feedback success';

        if (answered.size === checks.length) {
          const newlyCompleted = !isComplete(lesson.storageKey);
          setComplete(lesson.storageKey);
          feedback.textContent = lessonText('Lesson complete. You explored, practiced, and checked your understanding. Progress is saved in this browser.', 'পাঠ শেষ। আপনি দেখেছেন, অনুশীলন করেছেন এবং নিজের বোঝা যাচাই করেছেন। অগ্রগতি এই ব্রাউজারে সংরক্ষিত।');
          feedback.className = 'module-feedback success';
          root.querySelector('.module-status-pill').textContent = 'Complete';
          updateLearningStatus();
          if (newlyCompleted) window.onnoyTrack?.('lesson_complete', { lesson_id: root.dataset.lesson || 'unknown' });
          
          if (lesson.storageKey === 'onnoy_lesson_overview') {
            triggerOverviewCompletionFlow();
          }
          return;
        }

        feedback.textContent = lessonText(`${answered.size} of ${checks.length} understood. Keep going.`, `${checks.length}টির মধ্যে ${answered.size}টি বোঝা হয়েছে। চালিয়ে যান।`);
        feedback.className = 'module-feedback success';
      });
      options.appendChild(button);
    });

    quiz.appendChild(question);
  });
  root.appendChild(check);
  root.appendChild(buildPageNav(lesson.prevHref, lesson.nextHref));

  if (!root.dataset.languageListener) {
    root.dataset.languageListener = 'true';
    document.addEventListener('onnoy:langchange', renderLesson);
  }
}

function renderHubProgress() {
  document.querySelectorAll('[data-lesson-card]').forEach((card) => {
    const id = card.dataset.lessonCard;
    const lesson = courseLessons[id];
    const status = card.querySelector('[data-lesson-status]');
    if (!lesson || !status) return;
    const complete = isComplete(lesson.storageKey);
    const started = !complete && !!localStorage.getItem(`${lesson.storageKey}_learning_v2`);
    card.classList.toggle('is-complete', complete);
    card.classList.toggle('is-in-progress', started);
    status.textContent = complete ? 'Complete' : started ? 'Continue' : 'Start';
  });

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
                textPara.innerHTML = `<span style="color: var(--danger-fg); font-weight: 500;">${loginMsg} <a href="/login" style="color: var(--green); font-weight: 600; text-decoration: underline;">${lang === 'bn' ? 'লগইন করুন' : 'Log In'}</a></span>`;
              }
              if (btn) {
                btn.setAttribute('aria-disabled', 'true');
                btn.href = '/login';
              }
              return;
            }

            // Admin bypass check
            if (await window.onnoyIsAdmin(session.user)) {
              level2Gate.classList.remove('is-locked');
              if (btn) {
                btn.setAttribute('aria-disabled', 'false');
                btn.href = '/level-2-missions';
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
              .single();

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
                btn.href = '/level-2-missions';
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
      const missionUrl = id === 'spotLie' ? '/mission-spot-the-lie' : id === 'scamAlert' ? '/mission-scam-alert' : id === 'aiIntegrity' ? '/mission-ai-integrity' : '/mission-digital-guardian';
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
    root.appendChild(buildPageNav('/modules', '/module-overview', 'Start Level 1'));
    return;
  }

  const currentIndex = missionOrder.indexOf(missionId);
  const priorMissionsDone = currentIndex <= 0 || missionOrder.slice(0, currentIndex).every((id) => isComplete(missions[id].storageKey));
  if (!priorMissionsDone) {
    const gate = document.createElement('section');
    gate.className = 'module-check';
    gate.innerHTML = '<h3>Mission Locked</h3><p>Complete the earlier Level 2 missions in this browser before opening this one.</p>';
    root.appendChild(gate);
    root.appendChild(buildPageNav(mission.prevHref, '/level-2-missions', 'Mission List'));
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
        feedback.textContent = 'Mission submitted for review. Please wait for admin approval.';
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
  form.action = '/login';
  form.method = 'GET';
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
        <p class="mission-upload-help" style="margin:4px 0 0;">JPG, PNG, WebP, or PDF only. Maximum 10 files and 10 MB per file. Video links go in the notes box below.</p>
        <input class="form-control" id="evidence_files" name="evidence_files" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" multiple required style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;">
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

  let accumulatedFiles = [];

  const updateFileInputAndList = () => {
    const dt = new DataTransfer();
    accumulatedFiles.forEach(file => dt.items.add(file));
    fileInput.files = dt.files;

    fileList.innerHTML = '';
    if (accumulatedFiles.length === 0) return;
    accumulatedFiles.forEach((file, i) => {
      const li = document.createElement('li');
      li.className = 'file-list-item';
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      li.style.justifyContent = 'space-between';
      li.style.padding = '8px 12px';
      li.style.border = '1px solid var(--border)';
      li.style.borderRadius = '8px';
      li.style.marginBottom = '8px';
      li.style.background = 'var(--bg-light)';

      const ext = file.name.split('.').pop().toUpperCase();
      const isPdf = ext === 'PDF';

      li.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="file-list-icon">${isPdf ? '📄' : '🖼️'}</span>
          <span class="file-list-name" style="font-size:0.9rem; font-weight:500;">${i + 1}. ${file.name}</span>
          <span class="file-list-size" style="font-size:0.8rem; color:var(--ink-light);">${(file.size / 1024).toFixed(0)} KB</span>
        </div>
        <button type="button" class="remove-file-btn" data-index="${i}" style="background:none; border:none; color:var(--danger-fg); cursor:pointer; font-size:1.1rem; display:flex; align-items:center; padding:0 4px; line-height:1;">&times;</button>
      `;
      fileList.appendChild(li);
    });

    fileList.querySelectorAll('.remove-file-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = parseInt(btn.dataset.index, 10);
        accumulatedFiles.splice(idx, 1);
        updateFileInputAndList();
      });
    });
  };

  fileInput.addEventListener('change', () => {
    if (fileInput.files) {
      Array.from(fileInput.files).forEach(f => {
        if (!accumulatedFiles.some(existing => existing.name === f.name && existing.size === f.size)) {
          accumulatedFiles.push(f);
        }
      });
      updateFileInputAndList();
    }
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach(f => {
        if (f.type.startsWith('image/') || f.type === 'application/pdf') {
          if (!accumulatedFiles.some(existing => existing.name === f.name && existing.size === f.size)) {
            accumulatedFiles.push(f);
          }
        }
      });
      updateFileInputAndList();
    }
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
            .single();

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
        } else {
          alertBox.innerHTML = 'Sign in before submitting private mission evidence. <a href="/login">Log in securely →</a>';
          alertBox.style.backgroundColor = 'var(--caution-bg)';
          alertBox.style.color = 'var(--caution-fg)';
          alertBox.style.borderColor = 'var(--caution-fg)';
          alertBox.style.display = 'block';
          submitBtn.disabled = true;
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
    e.preventDefault();
    if (!window.supabaseClient) {
      alertBox.textContent = 'Secure mission submission is unavailable right now. Please try again later.';
      alertBox.style.backgroundColor = 'var(--danger-bg)';
      alertBox.style.color = 'var(--danger-fg)';
      alertBox.style.borderColor = 'var(--danger-fg)';
      alertBox.style.display = 'block';
      return;
    }

    alertBox.style.display = 'none';

    const { data: { session } } = await window.supabaseClient.auth.getSession().catch(() => ({ data: { session: null } }));
    if (!session?.user) {
      alertBox.innerHTML = 'Your session has expired. <a href="/login">Log in again →</a>';
      alertBox.style.backgroundColor = 'var(--caution-bg)';
      alertBox.style.color = 'var(--caution-fg)';
      alertBox.style.borderColor = 'var(--caution-fg)';
      alertBox.style.display = 'block';
      return;
    }

    const uniqueId = form.querySelector('#unique_id').value.trim();
    const name = form.querySelector('#student_name').value.trim();
    const email = form.querySelector('#student_email').value.trim();
    const notes = form.querySelector('#evidence_notes').value.trim();
    const fileInput = form.querySelector('#evidence_files');
    const files = fileInput ? fileInput.files : [];

    if (!uniqueId || !name || !email || !notes || files.length === 0 || files.length > 10) {
      alertBox.textContent = "Please complete every field and select between 1 and 10 evidence files.";
      alertBox.style.backgroundColor = 'var(--danger-bg)';
      alertBox.style.color = 'var(--danger-fg)';
      alertBox.style.borderColor = 'var(--danger-fg)';
      alertBox.style.display = 'block';
      return;
    }

    const allowedTypes = new Map([
      ['image/jpeg', 'jpg'], ['image/png', 'png'], ['image/webp', 'webp'], ['application/pdf', 'pdf']
    ]);
    const invalidFile = Array.from(files).find((file) => !allowedTypes.has(file.type) || file.size <= 0 || file.size > 10 * 1024 * 1024);
    if (invalidFile) {
      alertBox.textContent = `${invalidFile.name} is not an allowed JPG, PNG, WebP, or PDF under 10 MB.`;
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

    const evidencePaths = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const extension = allowedTypes.get(file.type);
        const filePath = `${session.user.id}/${crypto.randomUUID()}.${extension}`;
        
        const { data, error } = await window.supabaseClient.storage
          .from('mission-screenshots')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (error) throw error;
        evidencePaths.push(data.path);
      }

      alertBox.textContent = 'Saving submission data to Supabase database...';

      const { error: insertError } = await window.supabaseClient
        .from('submissions')
        .insert([
          {
            user_id: session.user.id,
            unique_id: uniqueId,
            student_name: name,
            student_email: email,
            mission_title: mission.title,
            evidence_notes: notes,
            screenshot_urls: evidencePaths
          }
        ]);

      if (insertError) throw insertError;

      // Success
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
      if (evidencePaths.length > 0) {
        await window.supabaseClient.storage.from('mission-screenshots').remove(evidencePaths).catch(() => null);
      }
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
    // Form submits to formspree, admin reviews later.
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
        if (await window.onnoyIsAdmin(user)) return;
        
        // 1. Fetch Unique ID from profile
        const { data: profile } = await window.supabaseClient
          .from('profiles')
          .select('unique_id, status')
          .eq('id', user.id)
          .single();
          
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
  const isMissionsPage = window.location.pathname.endsWith('/level-2-missions');
  const root = document.querySelector('[data-mission]');
  
  if (!isMissionsPage && !root) return;
  
  try {
    if (window.supabaseClient) {
      const { data: { session } } = await window.supabaseClient.auth.getSession().catch(() => ({ data: { session: null } }));
      
      const fileNames = [
        '/mission-spot-the-lie',
        '/mission-scam-alert',
        '/mission-ai-integrity',
        '/mission-digital-guardian'
      ];

      const startBtn = document.querySelector('.module-page-nav a.btn-green');

      if (!session || !session.user) {
        const lang = document.documentElement.getAttribute('lang') || localStorage.getItem('onnoy_lang') || 'en';
        const dict = typeof translations !== 'undefined' ? translations : {};
        const loginToProceedMsg = (dict['missions-login-to-proceed'] && dict['missions-login-to-proceed'][lang]) || "You need to log in to get the Unique ID and to go on. The Unique ID will be sent with the confirmation email.";

        if (isMissionsPage) {
          lockAllMissionCards(loginToProceedMsg);
          if (startBtn) {
            startBtn.href = '/login';
            startBtn.textContent = lang === 'bn' ? 'শুরু করতে লগইন করুন →' : 'Log In to Start →';
          }
        } else if (root) {
          blockMissionPage(loginToProceedMsg);
        }
        return;
      }
      
      const isAdmin = await window.onnoyIsAdmin(session.user);
      
      const { data: profile } = await window.supabaseClient
        .from('profiles')
        .select('status')
        .eq('id', session.user.id)
        .single();
        
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
                'Upload 2 misinformation examples and your fact-check notes.',
                'Upload 2 scam examples and explain your checks.',
                'Upload 2 AI-related misinformation examples and verification notes.',
                'Invite 1-5 acquaintances to complete the course.'
              ];
              p.textContent = originalDescs[idx];
            }
          }
        });

        // Update green start button dynamically
        if (startBtn) {
          if (status === 'Approved') {
            startBtn.href = '/mission-spot-the-lie';
            startBtn.textContent = 'Start Mission 1 →';
          } else if (status === 'Mission2Unlocked') {
            startBtn.href = '/mission-scam-alert';
            startBtn.textContent = 'Start Mission 2 →';
          } else if (status === 'Mission3Unlocked') {
            startBtn.href = '/mission-ai-integrity';
            startBtn.textContent = 'Start Mission 3 →';
          } else if (status === 'Mission4Unlocked') {
            startBtn.href = '/mission-digital-guardian';
            startBtn.textContent = 'Start Mission 4 →';
          } else {
            startBtn.href = '/mission-spot-the-lie';
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

function blockMissionPage(message, buttonText = "Back to Modules", buttonHref = "/modules") {
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
      image: '/assets/images/badges/informed.png',
      color: '#06d6a0'
    },
    aware: {
      name: 'Aware',
      title: 'Aware Badge Unlocked!',
      desc: 'Incredible work! You have successfully completed three Level 2 missions. Your awareness of online threats is outstanding.',
      image: '/assets/images/badges/aware.png',
      color: '#2563eb'
    },
    guardian: {
      name: 'Guardian',
      title: 'Guardian Badge Unlocked!',
      desc: 'Congratulations! You have completed all four Level 2 missions and claimed the ultimate Digital Guardian status!',
      image: '/assets/images/badges/guardian.png',
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
          .single();

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



function renderBadgesDisplay() {
  const progressAnchor = document.getElementById('courseProgressAnchor') ||
                         document.getElementById('missionProgress')?.closest('.module-content-card');
  if (!progressAnchor) return;

  let badgesCard = document.getElementById('badges-achievements-card');
  const basePath = window.location.pathname.includes('/courses/') ? '../' : '';
  
  const badges = [
    {
      id: 'informed',
      name: 'Informed',
      image: '/assets/images/badges/informed.png',
      desc: 'Complete all Level 1 modules'
    },
    {
      id: 'aware',
      name: 'Aware',
      image: '/assets/images/badges/aware.png',
      desc: 'Complete 3 missions'
    },
    {
      id: 'guardian',
      name: 'Guardian',
      image: '/assets/images/badges/guardian.png',
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
    progressAnchor.parentNode.insertBefore(badgesCard, progressAnchor);
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
  
  const initLocks = () => {
    if (window.supabaseClient) {
      restrictMissionAccess();
      window.supabaseClient.auth.onAuthStateChange(() => {
        restrictMissionAccess();
      });
    } else {
      setTimeout(initLocks, 100);
    }
  };
  initLocks();
});
