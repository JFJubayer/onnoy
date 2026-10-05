export type Lang = 'en' | 'bn';
export type Dict = Record<string, { en: string; bn: string }>;

export const translations: Dict = {
  // Navigation
  "nav-logo": { "en": "Onnoy-অন্বয়", "bn": "Onnoy-অন্বয়" },
  "nav-home": { "en": "Home", "bn": "মূল পাতা" },
  "nav-modules": { "en": "Modules", "bn": "মডিউল" },
  "nav-courses": { "en": "Courses", "bn": "কোর্স" },
  "nav-resources": { "en": "Resources", "bn": "রিসোর্স" },
  "nav-faq": { "en": "FAQ", "bn": "প্রশ্নোত্তর" },
  "nav-learn": { "en": "Learn", "bn": "শিখুন" },
  "nav-about": { "en": "About", "bn": "আমাদের সম্পর্কে" },
  "nav-contact": { "en": "Contact Us", "bn": "যোগাযোগ" },
  "nav-cta": { "en": "Request a Session", "bn": "সেশন অনুরোধ করুন" },
  "nav-login": { "en": "Log In", "bn": "লগইন" },
  "nav-register": { "en": "Register", "bn": "নিবন্ধন" },
  "nav-signout": { "en": "Sign Out", "bn": "লগআউট" },
  "nav-loading": { "en": "Loading...", "bn": "লোড হচ্ছে..." },
  "nav-profile-id": { "en": "Profile ID", "bn": "প্রোফাইল আইডি" },
  "auth-login-title": { "en": "Log In to Onnoy", "bn": "অন্বয়-এ লগইন করুন" },
  "auth-login-subtitle": { "en": "Access your portal", "bn": "আপনার পোর্টালে প্রবেশ করুন" },
  "auth-register-title": { "en": "Join Onnoy", "bn": "অন্বয়-এ যোগ দিন" },
  "auth-register-subtitle": { "en": "Start your digital journey", "bn": "আপনার ডিজিটাল যাত্রা শুরু করুন" },
  "auth-email": { "en": "Email Address", "bn": "ইমেইল ঠিকানা" },
  "auth-password": { "en": "Password", "bn": "পাসওয়ার্ড" },
  "auth-submit-login": { "en": "Log In", "bn": "লগইন করুন" },
  "auth-submit-register": { "en": "Register", "bn": "নিবন্ধন করুন" },
  "auth-no-account": { "en": "Don't have an account?", "bn": "অ্যাকাউন্ট নেই?" },
  "auth-have-account": { "en": "Already have an account?", "bn": "ইতিমধ্যে অ্যাকাউন্ট আছে?" },

  "form-submit-session": { "en": "Submit session request", "bn": "সেশনের অনুরোধ পাঠান" },
  "form-submit-fact-check": { "en": "Send for verification", "bn": "যাচাইয়ের জন্য পাঠান" },
  "form-submit-support": { "en": "Send message to Onnoy", "bn": "অন্বয়কে বার্তা পাঠান" },
  "form-submit-guide": { "en": "Notify me", "bn": "আমাকে জানান" },
  "form-sending": { "en": "Saving your submission...", "bn": "আপনার অনুরোধ সংরক্ষণ করা হচ্ছে..." },
  "form-success-session": { "en": "Your session request has been received. The Onnoy team will contact you using the details you provided.", "bn": "আপনার সেশনের অনুরোধ পাওয়া গেছে। অন্বয় দল আপনার দেওয়া তথ্য অনুযায়ী যোগাযোগ করবে।" },
  "form-success-fact-check": { "en": "Your fact-check request has been received. The Onnoy team will review it and reply to your email.", "bn": "আপনার তথ্য যাচাইয়ের অনুরোধ পাওয়া গেছে। অন্বয় দল যাচাই করে আপনার ইমেইলে উত্তর দেবে।" },
  "form-success-support": { "en": "Your message has been received privately. The Onnoy team will contact you using the details you provided.", "bn": "আপনার বার্তা গোপনীয়ভাবে পাওয়া গেছে। অন্বয় দল আপনার দেওয়া তথ্য অনুযায়ী যোগাযোগ করবে।" },
  "form-success-guide": { "en": "Your signup has been saved. We will let you know when the facilitator guide is ready.", "bn": "আপনার নিবন্ধন সংরক্ষণ করা হয়েছে। ফ্যাসিলিটেটর গাইড তৈরি হলে আমরা আপনাকে জানাব।" },
  "form-unavailable": { "en": "Your submission could not be saved. Your entries are still here. Please try again, or contact Onnoy directly.", "bn": "আপনার অনুরোধ সংরক্ষণ করা যায়নি। আপনার লেখা তথ্য মুছে যায়নি। আবার চেষ্টা করুন অথবা সরাসরি অন্বয়ের সঙ্গে যোগাযোগ করুন।" },
  "form-rate-limit": { "en": "Too many requests have been sent from this connection. Please try again in 15 minutes.", "bn": "এই সংযোগ থেকে অনেক অনুরোধ পাঠানো হয়েছে। ১৫ মিনিট পর আবার চেষ্টা করুন।" },
  "form-captcha": { "en": "Please complete the security check and try again.", "bn": "নিরাপত্তা যাচাই সম্পন্ন করে আবার চেষ্টা করুন।" },
  "form-error-invalid": { "en": "Please check your details and try again.", "bn": "আপনার তথ্য যাচাই করে আবার চেষ্টা করুন।" },
  "form-error-required": { "en": "Please complete this required field.", "bn": "অনুগ্রহ করে এই প্রয়োজনীয় ঘরটি পূরণ করুন।" },
  "form-error-too_long": { "en": "This entry is too long. Please shorten it.", "bn": "এই লেখাটি অনেক দীর্ঘ। অনুগ্রহ করে সংক্ষিপ্ত করুন।" },
  "form-error-invalid_email": { "en": "Please enter a valid email address.", "bn": "অনুগ্রহ করে সঠিক ইমেইল ঠিকানা লিখুন।" },
  "form-error-invalid_phone": { "en": "Please enter a valid phone number, including the country code if needed.", "bn": "প্রয়োজনে দেশের কোডসহ সঠিক ফোন নম্বর লিখুন।" },
  "form-error-invalid_date": { "en": "Please choose a valid date.", "bn": "অনুগ্রহ করে সঠিক তারিখ নির্বাচন করুন।" },
  "form-error-invalid_option": { "en": "Please select one of the available options.", "bn": "অনুগ্রহ করে দেওয়া বিকল্পগুলোর একটি নির্বাচন করুন।" },
  "form-error-invalid_url": { "en": "Please enter a complete HTTP or HTTPS link.", "bn": "অনুগ্রহ করে সম্পূর্ণ HTTP অথবা HTTPS লিংক লিখুন।" },
  "form-error-spam": { "en": "Your submission could not be accepted. Please check your details and try again.", "bn": "আপনার অনুরোধ গ্রহণ করা যায়নি। তথ্য যাচাই করে আবার চেষ্টা করুন।" },

  "admin-title": { "en": "Admin Portal", "bn": "অ্যাডমিন পোর্টাল" },
  "inbox-title": { "en": "Requests", "bn": "অনুরোধ" },
  "inbox-guide-title": { "en": "Guide signups", "bn": "গাইডের জন্য নিবন্ধন" },
  "inbox-search": { "en": "Search", "bn": "খুঁজুন" },
  "inbox-search-placeholder": { "en": "Name, contact, institution, or message", "bn": "নাম, যোগাযোগ, প্রতিষ্ঠান অথবা বার্তা" },
  "inbox-email-search": { "en": "Search email", "bn": "ইমেইল খুঁজুন" },
  "inbox-type": { "en": "Type", "bn": "ধরন" },
  "inbox-all-types": { "en": "All types", "bn": "সব ধরনের" },
  "inbox-all-statuses": { "en": "All statuses", "bn": "সব অবস্থা" },
  "inbox-status": { "en": "Status", "bn": "অবস্থা" },
  "inbox-kind-session": { "en": "Session", "bn": "সেশন" },
  "inbox-kind-fact_check": { "en": "Fact-check", "bn": "তথ্য যাচাই" },
  "inbox-kind-support": { "en": "Support", "bn": "সহায়তা" },
  "inbox-status-new": { "en": "New", "bn": "নতুন" },
  "inbox-status-in_progress": { "en": "In progress", "bn": "চলমান" },
  "inbox-status-resolved": { "en": "Resolved", "bn": "সমাধান হয়েছে" },
  "inbox-status-archived": { "en": "Archived", "bn": "আর্কাইভ করা" },
  "inbox-status-subscribed": { "en": "Signed up", "bn": "নিবন্ধিত" },
  "inbox-status-notified": { "en": "Notified", "bn": "জানানো হয়েছে" },
  "inbox-status-disabled": { "en": "Not configured", "bn": "সেটআপ হয়নি" },
  "inbox-status-pending": { "en": "Pending", "bn": "অপেক্ষমাণ" },
  "inbox-status-sent": { "en": "Sent", "bn": "পাঠানো হয়েছে" },
  "inbox-status-failed": { "en": "Failed", "bn": "ব্যর্থ" },
  "inbox-refresh": { "en": "Refresh", "bn": "আবার লোড করুন" },
  "inbox-export": { "en": "Export CSV", "bn": "CSV ডাউনলোড" },
  "inbox-received": { "en": "Received", "bn": "পাওয়ার সময়" },
  "inbox-name": { "en": "Name", "bn": "নাম" },
  "inbox-contact": { "en": "Contact", "bn": "যোগাযোগ" },
  "inbox-email": { "en": "Email", "bn": "ইমেইল" },
  "inbox-phone": { "en": "Phone", "bn": "ফোন" },
  "inbox-alert": { "en": "Staff alert", "bn": "দলের বিজ্ঞপ্তি" },
  "inbox-actions": { "en": "Actions", "bn": "পদক্ষেপ" },
  "inbox-previous": { "en": "Previous", "bn": "আগের পাতা" },
  "inbox-next": { "en": "Next", "bn": "পরের পাতা" },
  "inbox-detail": { "en": "Request details", "bn": "অনুরোধের বিবরণ" },
  "inbox-private-notes": { "en": "Private team notes", "bn": "দলের ব্যক্তিগত নোট" },
  "inbox-assignee": { "en": "Assigned to", "bn": "দায়িত্বপ্রাপ্ত" },
  "inbox-unassigned": { "en": "Unassigned", "bn": "কাউকে দায়িত্ব দেওয়া হয়নি" },
  "inbox-email-action": { "en": "Email", "bn": "ইমেইল করুন" },
  "inbox-call-action": { "en": "Call", "bn": "ফোন করুন" },
  "inbox-close": { "en": "Close", "bn": "বন্ধ করুন" },
  "inbox-save": { "en": "Save changes", "bn": "পরিবর্তন সংরক্ষণ" },
  "inbox-open": { "en": "Open", "bn": "দেখুন" },
  "inbox-loading": { "en": "Loading records...", "bn": "তথ্য লোড হচ্ছে..." },
  "inbox-ready": { "en": "", "bn": "" },
  "inbox-empty": { "en": "No matching records.", "bn": "কোনো তথ্য পাওয়া যায়নি।" },
  "inbox-unavailable": { "en": "Records could not be loaded. Check your access and migration 007, then refresh.", "bn": "তথ্য লোড করা যায়নি। আপনার অনুমতি ও মাইগ্রেশন ০০৭ যাচাই করে আবার লোড করুন।" },
  "inbox-saving": { "en": "Saving changes...", "bn": "পরিবর্তন সংরক্ষণ হচ্ছে..." },
  "inbox-save-error": { "en": "Changes could not be saved. Your entries are still here.", "bn": "পরিবর্তন সংরক্ষণ করা যায়নি। আপনার লেখা মুছে যায়নি।" },
  "inbox-stale": { "en": "This record changed or is no longer available. Refresh before saving again.", "bn": "এই তথ্য পরিবর্তিত হয়েছে অথবা আর পাওয়া যাচ্ছে না। আবার সংরক্ষণের আগে লোড করুন।" },
  "inbox-export-error": { "en": "The export could not be completed. Please try again.", "bn": "ডাউনলোড সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।" },
  "inbox-export-limit": { "en": "More than 5,000 records match. Narrow your filters before exporting.", "bn": "৫,০০০-এর বেশি তথ্য পাওয়া গেছে। ডাউনলোডের আগে ফিল্টার দিয়ে সংখ্যা কমান।" },
  "inbox-unnamed": { "en": "Name not provided", "bn": "নাম দেওয়া হয়নি" },
  "inbox-records": { "en": "requests", "bn": "অনুরোধ" },
  "inbox-signups": { "en": "signups", "bn": "নিবন্ধন" },
  "inbox-field-designation": { "en": "Designation", "bn": "পদবি" },
  "inbox-field-college": { "en": "Institution", "bn": "প্রতিষ্ঠান" },
  "inbox-field-district": { "en": "District", "bn": "জেলা" },
  "inbox-field-students": { "en": "Students", "bn": "শিক্ষার্থী" },
  "inbox-field-date": { "en": "Preferred date", "bn": "পছন্দের তারিখ" },
  "inbox-field-notes": { "en": "Additional notes", "bn": "অতিরিক্ত নোট" },
  "inbox-field-source": { "en": "Source", "bn": "উৎস" },
  "inbox-field-content": { "en": "Message", "bn": "বার্তা" },
  "inbox-field-link": { "en": "Source link", "bn": "উৎসের লিংক" },
  "inbox-field-issue": { "en": "Issue", "bn": "সমস্যা" },
  "inbox-field-time": { "en": "When it happened", "bn": "কখন ঘটেছে" },

  // Hero Section
  "hero-title": { 
    "en": "Empowering Independent Thinkers", 
    "bn": "স্বাধীন চিন্তার বিকাশ ও সঠিক সিদ্ধান্ত গ্রহণ" 
  },
  "hero-brand": {
    "en": "Onnoy - অন্বয়",
    "bn": "অন্বয় - Onnoy"
  },
  "hero-tagline": {
    "en": "Helping Bangladesh's youth think clearly, decide well, and use technology on their own terms.",
    "bn": "তরুণ প্রজন্মকে স্পষ্ট চিন্তা, সঠিক সিদ্ধান্ত ও প্রযুক্তির সুস্থ ব্যবহারে সহায়তা।"
  },
  "hero-p": { 
    "en": "A youth-led mentorship and decision-making platform in Bangladesh. We equip students, parents, and teachers with practical workbooks, courses, and tools to make sound life and digital choices.", 
    "bn": "বাংলাদেশের একটি যুব-নেতৃত্বাধীন মেন্টরশিপ ও সিদ্ধান্ত গ্রহণ প্ল্যাটফর্ম। আমরা শিক্ষার্থী, অভিভাবক ও শিক্ষকদের বাস্তবসম্মত গাইডবুক, কোর্স ও মেন্টরিংয়ের মাধ্যমে জীবন ও প্রযুক্তির গুরুত্বপূর্ণ সিদ্ধান্ত স্বাধীনভাবে নিতে সহায়তা করি।" 
  },
  "hero-quiz-question": {
    "en": "Ready to test your critical thinking & digital awareness?",
    "bn": "আপনার বিশ্লেষণ ক্ষমতা ও ডিজিটাল সচেতনতা যাচাই করতে প্রস্তুত?"
  },
  "btn-start": { "en": "Explore Workbooks & Booklets →", "bn": "ওয়ার্কবুক ও বুকলেট দেখুন →" },
  "btn-quiz": { "en": "Take Self-Assessment", "bn": "স্ব-মূল্যায়ন করুন" },
  "stat-assessment": { "en": "Self Assessment", "bn": "স্ব-মূল্যায়ন" },
  "stat-modules": { "en": "2 Video Courses", "bn": "২টি ভিডিও কোর্স" },
  "stat-missions": { "en": "Workbooks & Booklets", "bn": "ওয়ার্কবুক ও বুকলেট" },
  "stat-badges": { "en": "3 Verified Badges", "bn": "৩টি ভেরিফাইড ব্যাজ" },

  // FAQ Page
  "faq-title": { "en": "Frequently Asked Questions", "bn": "সাধারণ প্রশ্নোত্তর" },
  "faq-subtitle": { "en": "Common Questions", "bn": "সাধারণ প্রশ্নোত্তর" },
  "faq-p": { "en": "Everything schools, students, and partners ask us most.", "bn": "স্কুল, শিক্ষার্থী এবং পার্টনারদের সবচেয়ে সাধারণ প্রশ্নের উত্তর এখানে পাবেন।" },

  // Session Request Page
  "session-label": { "en": "Bring Onnoy to Your Campus", "bn": "আপনার ক্যাম্পাসে অন্বয়কে আমন্ত্রণ জানান" },
  "session-title": { "en": "Invite Onnoy to Your College", "bn": "আপনার কলেজে অন্বয়কে আমন্ত্রণ জানান" },
  "session-subtitle": { "en": "Invite Onnoy to Your Campus", "bn": "আপনার কলেজে আমন্ত্রণ জানান" },
  "session-p": { 
    "en": "We deliver free, high-impact sessions on the ethical use of technology. Join the growing list of colleges empowering their students with digital wisdom.", 
    "bn": "আমরা প্রযুক্তির নৈতিক ব্যবহারের উপর বিনামূল্যে, উচ্চ-প্রভাবশালী সেশন পরিচালনা করি। ডিজিটাল প্রজ্ঞার মাধ্যমে শিক্ষার্থীদের ক্ষমতায়নকারী কলেজগুলোর তালিকায় যোগ দিন।" 
  },

  // Resources Page
  "res-card-1-subtitle": { "en": "Is this true?", "bn": "এটা কি সত্যি?" },
  "res-card-2-subtitle": { "en": "Need Help?", "bn": "সাহায্য দরকার?" },

  // Support Page
  "support-title": { "en": "We're Here", "bn": "আমরা আছি" },
  "support-p": { 
    "en": "You don't have to face this alone. Reach out to Onnoy — everything you share stays between us.", 
    "bn": "আপনাকে একা এই পরিস্থিতির মোকাবিলা করতে হবে না। অন্বয়ের সাথে যোগাযোগ করুন — আপনার শেয়ার করা সবকিছু আমাদের মধ্যেই থাকবে।" 
  },

  // Impact Section
  "impact-title": { "en": "Our Impact", "bn": "আমাদের প্রভাব" },
  "impact-sessions": { "en": "Sessions & Discussions", "bn": "সেশন এবং আলোচনা" },
  "impact-students": { "en": "Students Reached", "bn": "শিক্ষার্থী সংখ্যা" },
  "impact-citizens": { "en": "Informed Citizens", "bn": "অবহিত নাগরিক" },
  "impact-guardians": { "en": "Guardians", "bn": "অভিভাবক" },
  "impact-note": {
    "en": "Numbers updated after every session. Last updated: June 2026.",
    "bn": "প্রতিটি সেশনের পর সংখ্যা আপডেট করা হয়। সর্বশেষ আপডেট: জুন ২০২৬।"
  },
  "about-title-sub": { "en": "We Are", "bn": "আমরা হলাম" },
  "about-title-main": { "en": "Onnoy - অন্বয়", "bn": "অন্বয় - Onnoy" },
  "about-p": {
    "en": "Equipping Bangladesh's students, parents, and teachers with practical tools, mentorship, and workbooks to think independently and decide wisely on education, technology, and life.",
    "bn": "বাংলাদেশের শিক্ষার্থী, অভিভাবক ও শিক্ষকদের বাস্তবমুখী টুলস, মেন্টরশিপ ও গাইডবুকের মাধ্যমে শিক্ষা, প্রযুক্তি ও জীবনের গুরুত্বপূর্ণ বিষয়ে স্বাধীন চিন্তা ও সঠিক সিদ্ধান্ত গ্রহণের সক্ষমতা তৈরি।"
  },

  // Footer
  "footer-tagline": { "en": "Onnoy - অন্বয় | Connecting Necessary Dots...", "bn": "Onnoy - অন্বয় | প্রয়োজনীয় বিন্দুগুলি সংযুক্ত করা..." },
  "footer-address": { "en": "Empowering Independent Thinkers for Bangladesh", "bn": "স্বাধীন চিন্তার বিকাশ ও সঠিক সিদ্ধান্ত গ্রহণে যুব উদ্যোগ" },
  "footer-location": { "en": "Mymensingh, Bangladesh", "bn": "ময়মনসিংহ, বাংলাদেশ" },
  "modules-title": { "en": "Learning Modules", "bn": "লার্নিং মডিউল" },
  "modules-subtitle": { "en": "Step-by-step guides to digital responsibility", "bn": "ডিজিটাল দায়িত্বশীলতার ধাপে ধাপে নির্দেশিকা" },
  "res-title": { "en": "Resources", "bn": "রিসোর্স" },
  "res-subtitle": { "en": "Tools and guides for a safer digital life", "bn": "নিরাপদ ডিজিটাল জীবনের জন্য সরঞ্জাম এবং নির্দেশিকা" },
  "facilitator-subtitle": { "en": "", "bn": "সেশন পরিচালনার গাইড" },
  "missions-login-to-proceed": {
    "en": "You need to log in to get the Unique ID and to go on. The Unique ID will be sent with the confirmation email.",
    "bn": "সামনে যাওয়ার জন্য এবং ইউনিক আইডি (Unique ID) পেতে আপনাকে লগইন করতে হবে। কনফার্মেশন ইমেলের সাথে ইউনিক আইডি পাঠানো হবে।"
  },

  // ChaBondhu & Community Support
  "nav-support": { "en": "Support Us", "bn": "পাশে থাকুন" },
  "chabondhu-btn": { "en": "Support on ChaBondhu ☕", "bn": "চাবন্ধুতে পাশে থাকুন ☕" },
  "chabondhu-sponsor-btn": { "en": "Sponsor on ChaBondhu ☕", "bn": "চাবন্ধুতে স্পন্সর করুন ☕" },
  "chabondhu-badge": { "en": "Community Powered", "bn": "জনগণের ভালোবাসায় পরিচালিত" },
  "chabondhu-heading": { "en": "Help Us Keep Youth Education 100% Free", "bn": "শিক্ষার্থীদের শিক্ষা বিনামূল্যে রাখতে আমাদের পাশে থাকুন" },
  "chabondhu-desc": {
    "en": "Onnoy is run entirely by passionate youth volunteers in Bangladesh. We never charge schools or students. Treat our volunteer team to a cup of tea on ChaBondhu (৳5) to sponsor printed workbooks, regional school sessions, and student safety.",
    "bn": "অন্বয় সম্পূর্ণ তরুণ স্বেচ্ছাসেবকদের প্রচেষ্টায় পরিচালিত। আমরা স্কুল বা শিক্ষার্থীদের কাছ থেকে কোনো ফি নিই না। চাবন্ধুতে আমাদের এক কাপ চায়ের বিনিময়ে (৳৫) পাশে থেকে আপনি শিক্ষার্থীদের প্রিন্টেড ওয়ার্কবুক, আঞ্চলিক সেশন ও মানসিক সহায়তায় অংশ নিতে পারেন।"
  },
  "chabondhu-tier1-title": { "en": "৳5 · 1 Cup of Tea", "bn": "৳৫ · এক কাপ চা" },
  "chabondhu-tier1-desc": { "en": "Sponsors a printed decision-making workbook for 1 high-school student.", "bn": "১ জন শিক্ষার্থীর জন্য ১টি সম্পূর্ণ প্রিন্টেড সিদ্ধান্ত গ্রহণ সহায়িকা স্পন্সর করে।" },
  "chabondhu-tier2-title": { "en": "৳15 · 3 Cups of Tea", "bn": "৳১৫ · ৩ কাপ চা" },
  "chabondhu-tier2-desc": { "en": "Equips a teacher or school mentor with complete discussion kits & guides.", "bn": "১ জন শিক্ষক বা মেন্টরের জন্য সম্পূর্ণ গাইড ও ক্লাসরুম কিট সরবরাহ করে।" },
  "chabondhu-tier3-title": { "en": "৳500 · School Circle", "bn": "৳৫০০ · একটি সেশন" },
  "chabondhu-tier3-desc": { "en": "Funds travel and classroom materials for volunteers to reach a regional school.", "bn": "আঞ্চলিক স্কুলে গিয়ে স্বেচ্ছাসেবকদের সেশন পরিচালনার যাতায়াত ও উপকরণ বহন করে।" },
  "footer-chabondhu-text": {
    "en": "Onnoy is an independent youth initiative in Bangladesh. We keep all our workshops, workbooks, and cyber support 100% free. Support our volunteer team with a cup of tea on ChaBondhu.",
    "bn": "অন্বয় বাংলাদেশের একটি স্বাধীন যুব উদ্যোগ। শিক্ষার্থীদের জন্য আমাদের সকল ওয়ার্কবুক, সেশন ও সাইবার সুরক্ষা সম্পূর্ণ উন্মুক্ত। চাবন্ধুতে এক কাপ চায়ের বিনিময়ে আমাদের পাশে থাকুন।"
  },
  "donation-back": { "en": "Back to workbooks", "bn": "ওয়ার্কবুক পাতায় ফিরুন" },
  "donation-eyebrow": { "en": "A little kindness, passed on", "bn": "একটু ভালোবাসা, আরও একজনের জন্য" },
  "donation-title": { "en": "Support Onnoy", "bn": "অন্বয়ের পাশে থাকুন" },
  "donation-lead": { "en": "A young person shouldn't have to figure everything out alone.", "bn": "একজন তরুণকে সব কঠিন প্রশ্নের উত্তর একা খুঁজতে হবে কেন?" },
  "donation-story": {
    "en": "A subject to choose. A future that feels uncertain. A conversation at home that is hard to begin. We make these resources for those moments, when a little guidance can mean a lot.",
    "bn": "কোন বিষয়ে পড়ব? ভবিষ্যৎটা কেমন হবে? পরিবারের সঙ্গে কথাটা শুরু করব কীভাবে? এসব মুহূর্তের জন্যই আমরা এই উপকরণ তৈরি করি, যখন একটু দিকনির্দেশনা অনেক বড় ভরসা হয়ে ওঠে।"
  },
  "donation-invite": {
    "en": "If these pages have been useful to you, help us create the next ones. Your contribution supports the time, care, and work behind Onnoy's booklets and learning sessions.",
    "bn": "এই পাতাগুলো আপনার কাজে লাগলে, পরের পাতাগুলো তৈরিতে আমাদের পাশে থাকুন। আপনার সহায়তা অন্বয়ের বই ও শিক্ষামূলক সেশনের পেছনের সময়, যত্ন ও শ্রমকে এগিয়ে নিতে সাহায্য করে।"
  },
  "donation-button": { "en": "Donate on ChaBondhu", "bn": "চাবন্ধুতে অনুদান দিন" },
  "donation-optional": { "en": "Give what feels right. A donation is not required to download this PDF.", "bn": "সামর্থ্য ও ইচ্ছা অনুযায়ী পাশে থাকুন। এই পিডিএফ ডাউনলোড করতে অনুদান দেওয়া বাধ্যতামূলক নয়।" },
  "donation-gratitude": { "en": "With gratitude,", "bn": "কৃতজ্ঞতায়," },
  "donation-team": { "en": "The Onnoy volunteers", "bn": "অন্বয়ের স্বেচ্ছাসেবকেরা" },
  "donation-ready": { "en": "Your PDF is ready", "bn": "আপনার পিডিএফ প্রস্তুত" },
  "donation-download": { "en": "Download PDF", "bn": "পিডিএফ ডাউনলোড করুন" },
  "donation-read": { "en": "Read online", "bn": "অনলাইনে পড়ুন" },
  "donation-download-status": { "en": "Download requested. Thank you for reading.", "bn": "ডাউনলোডের অনুরোধ পাঠানো হয়েছে। পড়ার জন্য ধন্যবাদ।" },
  "donation-library": { "en": "Explore the workbooks & booklets", "bn": "ওয়ার্কবুক ও বুকলেট দেখুন" },
  "donation-qr-heading": { "en": "A small gesture. A shared future.", "bn": "ছোট্ট একটি উদ্যোগ। সবার জন্য সুন্দর ভবিষ্যৎ।" },
  "donation-payment": { "en": "Contributions are handled on ChaBondhu.", "bn": "অনুদানের লেনদেন চাবন্ধুতে সম্পন্ন হয়।" },
  "donation-purpose": { "en": "What your support makes possible", "bn": "আপনার সহায়তায় যা এগিয়ে যায়" },
  "donation-purpose-resources": { "en": "Better learning resources", "bn": "আরও ভালো শিক্ষামূলক উপকরণ" },
  "donation-purpose-resources-text": { "en": "Time to write, illustrate, and improve thoughtful guidance for students and families.", "bn": "শিক্ষার্থী ও পরিবারের জন্য যত্ন নিয়ে লেখা, আঁকা ও সহায়িকাগুলো উন্নত করার সময়।" },
  "donation-purpose-sessions": { "en": "More meaningful conversations", "bn": "আরও অর্থবহ কথোপকথন" },
  "donation-purpose-sessions-text": { "en": "Materials and preparation for learning sessions with schools and communities.", "bn": "শিক্ষাপ্রতিষ্ঠান ও কমিউনিটিতে শিক্ষামূলক সেশনের প্রস্তুতি ও প্রয়োজনীয় উপকরণ।" },
  "donation-purpose-volunteers": { "en": "An independent youth initiative", "bn": "একটি স্বাধীন যুব উদ্যোগ" },
  "donation-purpose-volunteers-text": { "en": "Practical support for the volunteers who keep this work moving.", "bn": "এই কাজ এগিয়ে নেওয়া স্বেচ্ছাসেবকদের জন্য বাস্তব সহায়তা।" },
  "donation-thanks": { "en": "Whether you give, share something helpful, or simply use these pages well: thank you for being part of Onnoy.", "bn": "অনুদান দিন, দরকারি কিছু অন্যের সঙ্গে ভাগ করুন, কিংবা এই পাতাগুলো নিজের জীবনে কাজে লাগান: অন্বয়ের সঙ্গে থাকার জন্য ধন্যবাদ।" },
  "donation-print-heading": { "en": "You reached the last page. Help someone begin their first.", "bn": "আপনি শেষ পাতায় পৌঁছেছেন। আরেকজনের নতুন শুরুতে পাশে থাকুন।" },
  "donation-print-body": {
    "en": "If this booklet helped you pause, think, or start a conversation, consider supporting the people behind it. Your kindness helps us make thoughtful resources for more young people and families in Bangladesh.",
    "bn": "এই বইটি যদি আপনাকে ভাবতে বা নতুন কথোপকথন শুরু করতে সাহায্য করে থাকে, অন্বয়ের পাশে থাকুন। আপনার সহায়তা আরও তরুণ ও পরিবারের জন্য এমন উপকরণ তৈরি করতে আমাদের শক্তি জোগাবে।"
  },
  "donation-print-thanks": { "en": "Your support is voluntary. Thank you for reading.", "bn": "অনুদান সম্পূর্ণ ঐচ্ছিক। পড়ার জন্য ধন্যবাদ।" },
  "opening-label": { "en": "Onnoy opening animation", "bn": "অন্বয়ের সূচনা অ্যানিমেশন" },
  "opening-skip": { "en": "Skip opening animation", "bn": "সূচনা অ্যানিমেশন এড়িয়ে যান" },
  "brain-reset-title": { "en": "The Brain Reset", "bn": "ব্রেইন রিসেট" },
  "brain-reset-tag": { "en": "Illustrated Focus Guide", "bn": "মনোযোগের সচিত্র সহায়িকা" },
  "brain-reset-audience": { "en": "Students & young adults", "bn": "শিক্ষার্থী ও তরুণদের জন্য" },
  "brain-reset-subtitle": { "en": "A practical guide to focus and everyday digital habits", "bn": "মনোযোগ ও দৈনন্দিন ডিজিটাল অভ্যাসের বাস্তবমুখী সহায়িকা" },
  "brain-reset-description": {
    "en": "An illustrated guide to reducing distractions, making room for rest, and building manageable study habits. Practical exercises encourage small experiments without promising instant brain changes.",
    "bn": "বিক্ষেপ কমানো, বিশ্রামের সুযোগ তৈরি এবং বাস্তবসম্মত পড়াশোনার অভ্যাস গড়ার সচিত্র সহায়িকা। মস্তিষ্কের তাৎক্ষণিক পরিবর্তনের প্রতিশ্রুতি নয়, ছোট ছোট বাস্তব অনুশীলনকে গুরুত্ব দেওয়া হয়েছে।"
  },
  "brain-reset-lessons": { "en": "Eight illustrated lessons on focus and digital habits", "bn": "মনোযোগ ও ডিজিটাল অভ্যাস নিয়ে আটটি সচিত্র পাঠ" },
  "brain-reset-worksheet": { "en": "Seven-day worksheet with space for personal notes", "bn": "নিজের অভিজ্ঞতা লেখার জায়গাসহ সাত দিনের অনুশীলন" },
  "brain-reset-evidence": { "en": "Evidence notes, practical exceptions, and well-being guidance", "bn": "গবেষণার সূত্র, বাস্তব প্রয়োজনের ব্যতিক্রম ও সুস্থতার পরামর্শ" },
  "brain-reset-format": { "en": "PDF / English", "bn": "পিডিএফ / ইংরেজি" },
  "brain-reset-edition": { "en": "Revised edition", "bn": "পরিমার্জিত সংস্করণ" },
  "reader-title": { "en": "A little about you", "bn": "আপনার কিছু তথ্য" },
  "reader-description": { "en": "Your details help us understand which schools and districts our resources reach.", "bn": "আমাদের উপকরণ কোন শিক্ষাপ্রতিষ্ঠান ও জেলার পাঠকদের কাছে পৌঁছাচ্ছে, আপনার তথ্য তা বুঝতে সাহায্য করে।" },
  "reader-name": { "en": "Full name", "bn": "আপনার পুরো নাম" },
  "reader-school": { "en": "School / institution", "bn": "স্কুল / শিক্ষাপ্রতিষ্ঠান" },
  "reader-age": { "en": "Age", "bn": "বয়স" },
  "reader-district": { "en": "District", "bn": "জেলা" },
  "reader-continue-read": { "en": "Continue to read", "bn": "পড়তে এগিয়ে যান" },
  "reader-continue-download": { "en": "Continue to download", "bn": "ডাউনলোড করতে এগিয়ে যান" },
  "reader-preparing": { "en": "Preparing access...", "bn": "প্রস্তুত করা হচ্ছে..." },
  "reader-required": { "en": "Please enter this detail.", "bn": "অনুগ্রহ করে এই তথ্যটি দিন।" },
  "reader-age-invalid": { "en": "Enter a whole-number age between 1 and 120.", "bn": "১ থেকে ১২০-এর মধ্যে পূর্ণসংখ্যায় বয়স লিখুন।" },
  "reader-privacy": { "en": "These details are used for Onnoy's educational reach records. No payment is required.", "bn": "অন্বয়ের শিক্ষামূলক কার্যক্রমের বিস্তার বোঝার জন্য এই তথ্য ব্যবহার করা হয়। কোনো অর্থ দেওয়া বাধ্যতামূলক নয়।" },
  "reader-unavailable": { "en": "The reader details form is unavailable.", "bn": "পাঠকের তথ্য দেওয়ার ফর্মটি এখন পাওয়া যাচ্ছে না।" }
};

if (typeof window !== 'undefined') (window as any).translations = translations;
