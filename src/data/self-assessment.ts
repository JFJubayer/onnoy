export type AssessmentLanguage = 'en' | 'bn';
export type AssessmentDomain = 'attention' | 'verification' | 'security' | 'ai' | 'respect';

export interface LocalizedText {
  en: string;
  bn: string;
}

export interface AssessmentOption {
  text: LocalizedText;
  score: 0 | 1 | 2 | 3;
  feedback: LocalizedText;
}

export interface AssessmentQuestion {
  id: string;
  domain: AssessmentDomain;
  scenario: LocalizedText;
  prompt: LocalizedText;
  options: AssessmentOption[];
}

export const assessmentDomains: Record<AssessmentDomain, {
  name: LocalizedText;
  description: LocalizedText;
  href: string;
}> = {
  attention: {
    name: { en: 'Attention', bn: 'মনোযোগ' },
    description: { en: 'Using screens intentionally instead of automatically.', bn: 'অজান্তে নয়, উদ্দেশ্য নিয়ে screen ব্যবহার।' },
    href: '/module-attention-literacy',
  },
  verification: {
    name: { en: 'Verification', bn: 'তথ্য যাচাই' },
    description: { en: 'Checking source, evidence, date, and context before sharing.', bn: 'Share করার আগে source, evidence, date ও context দেখা।' },
    href: '/module-misinformation',
  },
  security: {
    name: { en: 'Scam safety', bn: 'স্ক্যাম নিরাপত্তা' },
    description: { en: 'Slowing down and verifying requests through trusted channels.', bn: 'ধীরে সিদ্ধান্ত নেওয়া ও trusted channel-এ request যাচাই।' },
    href: '/module-scam-safety',
  },
  ai: {
    name: { en: 'AI judgment', bn: 'এআই বিচারবোধ' },
    description: { en: 'Using AI for support while verifying facts and owning the final work.', bn: 'তথ্য যাচাই ও final কাজের দায়িত্ব রেখে AI ব্যবহার।' },
    href: '/module-ai-mindset',
  },
  respect: {
    name: { en: 'Digital respect', bn: 'ডিজিটাল সম্মান' },
    description: { en: 'Protecting consent, privacy, and people when something goes wrong.', bn: 'সমস্যায় consent, privacy ও মানুষকে রক্ষা করা।' },
    href: '/module-overview',
  },
};

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'attention-study-notification',
    domain: 'attention',
    scenario: {
      en: 'You sit down for a 25-minute study block. Three minutes later, your phone vibrates with a social notification.',
      bn: 'আপনি ২৫ মিনিট পড়তে বসেছেন। তিন মিনিট পর social notification-এ ফোন vibrate করল।',
    },
    prompt: { en: 'What do you usually do?', bn: 'আপনি সাধারণত কী করেন?' },
    options: [
      {
        text: { en: 'Open it quickly, then try to return to studying', bn: 'দ্রুত খুলে দেখে আবার পড়ায় ফিরি' },
        score: 1,
        feedback: { en: '“Quick” checks restart the attention loop. Returning to the same depth of focus often takes longer than expected.', bn: '“দ্রুত” check নতুন attention loop শুরু করে। আগের গভীর মনোযোগে ফিরতে ধারণার চেয়ে বেশি সময় লাগে।' },
      },
      {
        text: { en: 'Leave it face down and check after the study block', bn: 'ফোন উল্টো রাখি, study block শেষে দেখি' },
        score: 3,
        feedback: { en: 'A clear stopping rule protects focus without requiring perfect willpower.', bn: 'স্পষ্ট stopping rule নিখুঁত willpower ছাড়াই মনোযোগ রক্ষা করে।' },
      },
      {
        text: { en: 'Keep checking whenever it vibrates', bn: 'যখনই vibrate করে, তখনই দেখি' },
        score: 0,
        feedback: { en: 'The notification now decides when your task changes. Try one short phone-free block as an experiment.', bn: 'কখন কাজ বদলাবে তা notification ঠিক করছে। পরীক্ষা হিসেবে একটি ছোট phone-free block চেষ্টা করুন।' },
      },
      {
        text: { en: 'Mute it, but keep it in my hand or beside the book', bn: 'Mute করি, তবে হাতে বা বইয়ের পাশে রাখি' },
        score: 2,
        feedback: { en: 'Muting removes sound, but visibility can still trigger checking. A little distance makes the boundary stronger.', bn: 'Mute করলে শব্দ বন্ধ হয়, কিন্তু চোখে পড়লেও check করার trigger আসে। একটু দূরে রাখলে boundary শক্ত হয়।' },
      },
    ],
  },
  {
    id: 'attention-late-night',
    domain: 'attention',
    scenario: {
      en: 'It is close to bedtime. You planned to watch one short video, but autoplay has already started the fourth.',
      bn: 'ঘুমের সময় হয়ে এসেছে। একটি short video দেখার কথা ছিল, কিন্তু autoplay-এ চতুর্থটি শুরু হয়েছে।',
    },
    prompt: { en: 'What is closest to your usual response?', bn: 'কোনটি আপনার সাধারণ আচরণের সবচেয়ে কাছাকাছি?' },
    options: [
      {
        text: { en: 'Continue until I feel sleepy enough to stop', bn: 'আরও ঘুম না আসা পর্যন্ত চালিয়ে যাই' },
        score: 0,
        feedback: { en: 'Autoplay removes the stopping point, while stimulating content can delay sleep rather than create it.', bn: 'Autoplay থামার জায়গা সরায়, আর stimulating content ঘুম আনার বদলে দেরি করাতে পারে।' },
      },
      {
        text: { en: 'Feel guilty, but keep scrolling anyway', bn: 'খারাপ লাগে, তবু scroll চালাই' },
        score: 1,
        feedback: { en: 'Noticing the loop matters; guilt alone rarely changes it. Add a concrete stopping action such as charging the phone away from bed.', bn: 'Loop বুঝতে পারা জরুরি; শুধু guilt সাধারণত বদলায় না। বিছানা থেকে দূরে charge দেওয়ার মতো stopping action নিন।' },
      },
      {
        text: { en: 'Stop autoplay and put the phone at a charging spot away from bed', bn: 'Autoplay বন্ধ করে ফোন বিছানা থেকে দূরে charge দিই' },
        score: 3,
        feedback: { en: 'You restored a stopping point and changed the environment, which is more reliable than relying on tired willpower.', bn: 'আপনি stopping point ফিরিয়েছেন এবং environment বদলেছেন—ক্লান্ত willpower-এর চেয়ে এটি বেশি নির্ভরযোগ্য।' },
      },
      {
        text: { en: 'Set a timer but usually dismiss it once', bn: 'Timer দিই, তবে সাধারণত একবার dismiss করি' },
        score: 2,
        feedback: { en: 'A timer creates awareness. Pair it with a physical action—stand up, plug in the phone, or leave the app—to make it effective.', bn: 'Timer সচেতন করে। কার্যকর করতে দাঁড়ানো, phone plug-in করা বা app ছাড়ার মতো physical action জুড়ুন।' },
      },
    ],
  },
  {
    id: 'verification-health-forward',
    domain: 'verification',
    scenario: {
      en: 'A family group receives: “URGENT—this kitchen remedy cures dengue. Hospitals are hiding it. Share with everyone.”',
      bn: 'Family group-এ message: “জরুরি—এই ঘরোয়া উপায়ে dengue সারে। Hospital লুকাচ্ছে। সবাইকে share করুন।”',
    },
    prompt: { en: 'What would you do first?', bn: 'প্রথমে কী করবেন?' },
    options: [
      {
        text: { en: 'Forward it with “not sure if true”', bn: '“সত্যি কি না জানি না” লিখে forward করি' },
        score: 0,
        feedback: { en: 'The warning does not stop the remedy spreading. Health misinformation can delay real treatment.', bn: 'Warning দিলেও remedy ছড়ানো থামে না। Health misinformation আসল treatment দেরি করাতে পারে।' },
      },
      {
        text: { en: 'Ask another relative whether they have heard it', bn: 'আরেক relative শুনেছে কি না জিজ্ঞেস করি' },
        score: 1,
        feedback: { en: 'Familiarity is not medical evidence. Look for guidance from qualified health authorities or clinicians.', bn: 'পরিচিত শোনা medical evidence নয়। Qualified health authority বা clinician-এর guidance দেখুন।' },
      },
      {
        text: { en: 'Pause and check trusted health guidance before responding', bn: 'থেমে trusted health guidance check করে তারপর উত্তর দিই' },
        score: 3,
        feedback: { en: 'This protects the group from an urgent but unsupported claim and gives you evidence for a calm correction.', bn: 'এতে unsupported জরুরি claim থেকে group রক্ষা পায় এবং শান্তভাবে correction দেওয়ার evidence পাওয়া যায়।' },
      },
      {
        text: { en: 'Ignore it without sharing', bn: 'Share না করে ignore করি' },
        score: 2,
        feedback: { en: 'Not sharing prevents further harm. A brief evidence-based correction may also help relatives who already believe it.', bn: 'না ছড়ালে ক্ষতি কমে। ছোট evidence-based correction যারা বিশ্বাস করেছে তাদেরও সাহায্য করতে পারে।' },
      },
    ],
  },
  {
    id: 'verification-old-photo',
    domain: 'verification',
    scenario: {
      en: 'A dramatic photo says it shows today’s event in your district, but the post gives no photographer, date, or source.',
      bn: 'একটি নাটকীয় photo-তে বলা হচ্ছে আজ আপনার জেলার ঘটনা, কিন্তু photographer, date বা source নেই।',
    },
    prompt: { en: 'Which response gives you the strongest evidence?', bn: 'কোন কাজটি সবচেয়ে শক্ত evidence দেবে?' },
    options: [
      {
        text: { en: 'Reverse-search the image and compare reliable local coverage', bn: 'Image reverse-search করে reliable local coverage মিলিয়ে দেখি' },
        score: 3,
        feedback: { en: 'Tracing the image can reveal an older event, another country, a crop, or the original caption.', bn: 'Image trace করলে পুরোনো ঘটনা, অন্য দেশ, crop বা original caption বের হতে পারে।' },
      },
      {
        text: { en: 'Read the comments for people saying “fake” or “real”', bn: 'Comment-এ “fake” বা “real” বলা হচ্ছে কি না দেখি' },
        score: 1,
        feedback: { en: 'Comments are clues, not verification. Look for the original image and independent reporting.', bn: 'Comment clue, verification নয়। Original image ও independent reporting খুঁজুন।' },
      },
      {
        text: { en: 'Trust it if a familiar page posted it', bn: 'পরিচিত page post করলে বিশ্বাস করি' },
        score: 0,
        feedback: { en: 'Familiar pages can make mistakes or repost without checking. Evidence should travel with the claim.', bn: 'পরিচিত page-ও ভুল করতে বা check ছাড়া repost করতে পারে। Claim-এর সঙ্গে evidence দরকার।' },
      },
      {
        text: { en: 'Wait to see whether it becomes viral', bn: 'Viral হয় কি না অপেক্ষা করি' },
        score: 2,
        feedback: { en: 'Waiting avoids immediate sharing, but popularity still does not prove context. Trace it before deciding.', bn: 'অপেক্ষায় দ্রুত share হয় না, কিন্তু popularity context প্রমাণ করে না। সিদ্ধান্তের আগে trace করুন।' },
      },
    ],
  },
  {
    id: 'security-friend-money',
    domain: 'security',
    scenario: {
      en: 'A close friend’s usual account messages: “Emergency—send ৳2,000 now. I cannot call.” The writing style feels unusual.',
      bn: 'ঘনিষ্ঠ বন্ধুর usual account থেকে message: “Emergency—এখনই ৳২,০০০ পাঠাও। Call করতে পারব না।” লেখার ধরন অস্বাভাবিক।',
    },
    prompt: { en: 'What is your next move?', bn: 'পরের কাজ কী?' },
    options: [
      {
        text: { en: 'Ask a personal question in the same chat', bn: 'একই chat-এ personal প্রশ্ন করি' },
        score: 2,
        feedback: { en: 'This adds friction, but a hijacked account may contain old messages. A separate known channel is stronger.', bn: 'এতে বাধা বাড়ে, তবে hijacked account-এ পুরোনো message থাকতে পারে। আলাদা known channel শক্তিশালী।' },
      },
      {
        text: { en: 'Call a number I already know before sending anything', bn: 'কিছু পাঠানোর আগে আগে থেকে জানা নম্বরে call করি' },
        score: 3,
        feedback: { en: 'A separate trusted channel breaks the scammer’s control of the conversation.', bn: 'আলাদা trusted channel scammer-এর conversation control ভেঙে দেয়।' },
      },
      {
        text: { en: 'Send a small amount first', bn: 'আগে অল্প টাকা পাঠাই' },
        score: 0,
        feedback: { en: 'A small loss is still a loss and confirms that you respond under pressure. Verify before any transfer.', bn: 'অল্প ক্ষতিও ক্ষতি, আর আপনি pressure-এ respond করেন তা বোঝায়। Transfer-এর আগে verify করুন।' },
      },
      {
        text: { en: 'Reply that I will send it later', bn: 'পরে পাঠাব বলে reply করি' },
        score: 1,
        feedback: { en: 'Delay reduces urgency, but the identity is still unverified. Contact the friend separately.', bn: 'Delay urgency কমায়, কিন্তু পরিচয় verify হয়নি। বন্ধুর সঙ্গে আলাদাভাবে যোগাযোগ করুন।' },
      },
    ],
  },
  {
    id: 'security-scholarship-link',
    domain: 'security',
    scenario: {
      en: 'A scholarship link uses a familiar logo and says the deadline is in 20 minutes. It asks for your email password and an OTP.',
      bn: 'Scholarship link-এ পরিচিত logo, deadline ২০ মিনিট। Email password ও OTP চাইছে।',
    },
    prompt: { en: 'Which detail matters most?', bn: 'কোন detail সবচেয়ে গুরুত্বপূর্ণ?' },
    options: [
      {
        text: { en: 'The logo looks official', bn: 'Logo official দেখাচ্ছে' },
        score: 0,
        feedback: { en: 'Logos and page designs are easy to copy. They do not prove who controls the site.', bn: 'Logo ও page design সহজে copy করা যায়। Site কে চালায় তা এতে প্রমাণ হয় না।' },
      },
      {
        text: { en: 'The deadline is very close', bn: 'Deadline খুব কাছে' },
        score: 1,
        feedback: { en: 'Urgency is a pressure signal, not proof. Slow down when a page tries to remove thinking time.', bn: 'Urgency pressure signal, প্রমাণ নয়। Page যখন ভাবার সময় কমায়, তখন ধীরে চলুন।' },
      },
      {
        text: { en: 'Friends have already shared it', bn: 'বন্ধুরা আগেই share করেছে' },
        score: 2,
        feedback: { en: 'Friends may also be misled. Check the organizer’s official domain independently.', bn: 'বন্ধুরাও ভুল বুঝতে পারে। Organizer-এর official domain আলাদাভাবে check করুন।' },
      },
      {
        text: { en: 'A real scholarship should not ask for my password or OTP', bn: 'Real scholarship password বা OTP চাইবে না' },
        score: 3,
        feedback: { en: 'Passwords and OTPs are account keys. Never submit them through an application or support link.', bn: 'Password ও OTP account-এর চাবি। Application বা support link-এ কখনো দেবেন না।' },
      },
    ],
  },
  {
    id: 'ai-citation',
    domain: 'ai',
    scenario: {
      en: 'An AI gives you a polished paragraph and a journal citation for an assignment. The citation sounds convincing.',
      bn: 'AI assignment-এর জন্য polished paragraph ও journal citation দিল। Citation বিশ্বাসযোগ্য শোনাচ্ছে।',
    },
    prompt: { en: 'What do you do before using it?', bn: 'ব্যবহারের আগে কী করবেন?' },
    options: [
      {
        text: { en: 'Search the title, author, and DOI in a trusted database', bn: 'Trusted database-এ title, author ও DOI খুঁজি' },
        score: 3,
        feedback: { en: 'Independent verification checks whether the source exists and actually supports the claim.', bn: 'Independent verification source আছে কি না ও claim সমর্থন করে কি না দেখায়।' },
      },
      {
        text: { en: 'Ask the AI whether it is certain', bn: 'AI-কে নিশ্চিত কি না জিজ্ঞেস করি' },
        score: 1,
        feedback: { en: 'The model may repeat the same fabrication more confidently. Verify outside the model.', bn: 'Model একই বানানো তথ্য আরও আত্মবিশ্বাসে বলতে পারে। Model-এর বাইরে verify করুন।' },
      },
      {
        text: { en: 'Use it because academic language sounds reliable', bn: 'Academic ভাষা reliable শোনায় বলে ব্যবহার করি' },
        score: 0,
        feedback: { en: 'Style is not evidence. AI can invent journals, authors, statistics, and links.', bn: 'Style evidence নয়। AI journal, author, statistics ও link বানাতে পারে।' },
      },
      {
        text: { en: 'Remove the citation but keep the paragraph unchanged', bn: 'Citation বাদ দিয়ে paragraph অপরিবর্তিত রাখি' },
        score: 2,
        feedback: { en: 'Removing a citation does not verify the paragraph. Check each important claim and rewrite from understanding.', bn: 'Citation বাদ দিলে paragraph verify হয় না। গুরুত্বপূর্ণ claim check করে বুঝে নিজের ভাষায় লিখুন।' },
      },
    ],
  },
  {
    id: 'ai-homework',
    domain: 'ai',
    scenario: {
      en: 'You ask AI to explain a difficult chapter. It gives a clear answer, but one example conflicts with your textbook.',
      bn: 'কঠিন chapter বোঝাতে AI ব্যবহার করলেন। উত্তর পরিষ্কার, কিন্তু একটি example textbook-এর সঙ্গে মিলছে না।',
    },
    prompt: { en: 'How do you handle the conflict?', bn: 'এই অমিল কীভাবে সামলাবেন?' },
    options: [
      {
        text: { en: 'Assume the newer AI must be right', bn: 'নতুন AI-ই ঠিক ধরে নিই' },
        score: 0,
        feedback: { en: 'Newer or more fluent does not mean correct. AI has no automatic authority over the textbook.', bn: 'নতুন বা fluent মানেই ঠিক নয়। Textbook-এর ওপর AI-এর automatic authority নেই।' },
      },
      {
        text: { en: 'Copy the AI answer but avoid that example', bn: 'Example বাদ দিয়ে AI answer copy করি' },
        score: 1,
        feedback: { en: 'Avoiding one conflict does not show that the rest is reliable or understood.', bn: 'একটি conflict এড়ালে বাকি অংশ reliable বা বোঝা হয়েছে—তা প্রমাণ হয় না।' },
      },
      {
        text: { en: 'Compare the textbook, teacher guidance, and another credible source', bn: 'Textbook, teacher guidance ও আরেক credible source মিলিয়ে দেখি' },
        score: 3,
        feedback: { en: 'Triangulating sources helps resolve the conflict and turns AI into a learning aid rather than an answer machine.', bn: 'একাধিক source মিলিয়ে conflict বোঝা যায় এবং AI answer machine না হয়ে learning aid হয়।' },
      },
      {
        text: { en: 'Ask the AI to explain its reasoning and stop there', bn: 'AI-কে reasoning বোঝাতে বলে সেখানেই থামি' },
        score: 2,
        feedback: { en: 'Asking for reasoning can expose assumptions, but the reasoning still needs outside verification.', bn: 'Reasoning চাইলে assumption ধরা পড়ে, তবে সেটিও বাইরে verify করতে হবে।' },
      },
    ],
  },
  {
    id: 'respect-photo-consent',
    domain: 'respect',
    scenario: {
      en: 'A funny photo of a classmate is being shared in a group. They ask everyone to delete it and say they feel humiliated.',
      bn: 'Classmate-এর funny photo group-এ share হচ্ছে। সে delete করতে বলেছে এবং অপমানিত লাগছে বলেছে।',
    },
    prompt: { en: 'What is the most helpful response?', bn: 'সবচেয়ে সহায়ক response কোনটি?' },
    options: [
      {
        text: { en: 'Do nothing because I did not post it', bn: 'আমি post করিনি, তাই কিছু করি না' },
        score: 1,
        feedback: { en: 'Not adding harm matters, but bystanders can also help stop the spread and support the person.', bn: 'ক্ষতি না বাড়ানো জরুরি, তবে bystander-ও ছড়ানো থামাতে ও মানুষটিকে support করতে পারে।' },
      },
      {
        text: { en: 'Delete my copy but keep reacting to the jokes', bn: 'নিজের copy delete করি, তবে joke-এ react করি' },
        score: 0,
        feedback: { en: 'Reactions reward the humiliation and keep the group attention on it.', bn: 'Reaction অপমানকে reward করে এবং group-এর attention ধরে রাখে।' },
      },
      {
        text: { en: 'Tell them privately to ignore it', bn: 'Private-এ ignore করতে বলি' },
        score: 2,
        feedback: { en: 'Private support can help, but the person should not carry the whole burden of stopping the group.', bn: 'Private support কাজে লাগে, তবে group থামানোর পুরো বোঝা ওই ব্যক্তির নয়।' },
      },
      {
        text: { en: 'Delete it, ask the group to stop, and help them report it if needed', bn: 'Delete করি, group-কে থামতে বলি, দরকারে report করতে সাহায্য করি' },
        score: 3,
        feedback: { en: 'This respects consent, reduces further spread, and gives practical support without blaming the person harmed.', bn: 'এতে consent মানা হয়, ছড়ানো কমে এবং ক্ষতিগ্রস্ত ব্যক্তিকে blame না করে বাস্তব support দেওয়া হয়।' },
      },
    ],
  },
  {
    id: 'respect-rumor-repair',
    domain: 'respect',
    scenario: {
      en: 'You shared a rumor in a group, then discover it was false. Several people have already seen your message.',
      bn: 'আপনি group-এ rumor share করেছিলেন, পরে জানলেন false। কয়েকজন message দেখে ফেলেছে।',
    },
    prompt: { en: 'What should you do now?', bn: 'এখন কী করা উচিত?' },
    options: [
      {
        text: { en: 'Delete it quietly and hope nobody remembers', bn: 'চুপচাপ delete করি, কেউ মনে না রাখুক' },
        score: 1,
        feedback: { en: 'Deleting limits future views, but people who saw it may still believe or repeat it.', bn: 'Delete করলে নতুন view কমে, কিন্তু যারা দেখেছে তারা বিশ্বাস বা repeat করতে পারে।' },
      },
      {
        text: { en: 'Post a clear correction, name the reliable source, and apologize', bn: 'স্পষ্ট correction, reliable source ও apology দিই' },
        score: 3,
        feedback: { en: 'Repair should travel to the same audience as the mistake. A clear correction helps replace the false memory.', bn: 'ভুল যে audience পেয়েছে, repair-ও তাদের কাছে যেতে হবে। স্পষ্ট correction false memory বদলাতে সাহায্য করে।' },
      },
      {
        text: { en: 'Say “I was only forwarding what I received”', bn: 'বলি, “আমি শুধু পাওয়া message forward করেছি”' },
        score: 0,
        feedback: { en: 'Passing responsibility does not repair the harm. Sharing makes us part of the information chain.', bn: 'দায় সরালে ক্ষতি ঠিক হয় না। Share করলে আমরা information chain-এর অংশ হই।' },
      },
      {
        text: { en: 'Message only one friend with the correction', bn: 'শুধু এক বন্ধুকে correction জানাই' },
        score: 2,
        feedback: { en: 'Correcting one person helps, but the wider group that saw the rumor still needs the update.', bn: 'একজনকে correction সাহায্য করে, তবে rumor দেখা পুরো group-এর update দরকার।' },
      },
    ],
  },
];