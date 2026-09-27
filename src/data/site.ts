/** Site-wide constants and navigation. Single source of truth for URLs. */
export const SITE = {
  name: 'Onnoy-অন্বয়',
  shortName: 'Onnoy',
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://onnoy.vercel.app',
  tagline: 'Empowering Independent Thinkers',
  description:
    "Onnoy (অন্বয়) is a youth-led initiative in Mymensingh, Bangladesh helping students, parents and teachers think clearly, decide well, and use technology on their own terms.",
  locale: 'en_BD',
  ogImage: '/assets/og-image.png',
  whatsapp: `https://wa.me/${import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '8801830900746'}`,
  chabondhu: import.meta.env.PUBLIC_CHABONDHU_URL ?? 'https://www.chabondhu.com/onnoy',
  facebook: 'https://www.facebook.com/profile.php?id=61589327446397',
  youtube: 'https://www.youtube.com/@ONNOY-%E0%A6%85%E0%A6%A8%E0%A7%8D%E0%A6%AC%E0%A6%AF%E0%A6%BC',
  gaId: import.meta.env.PUBLIC_GA_MEASUREMENT_ID ?? '',
  googleSiteVerification: 'OoZ8WMjco7g1Lw3HS3PAd970qPhmi762K8jUR7R_-oA',
  location: 'Mymensingh, Bangladesh',
} as const;

export interface NavLink {
  href: string;
  label: string;
  i18n?: string;
  external?: boolean;
  children?: NavLink[];
}

export const NAV: NavLink[] = [
  { href: '/', label: 'Home', i18n: 'nav-home' },
  { href: '/modules', label: 'Modules', i18n: 'nav-modules' },
  { href: '/courses', label: 'Courses', i18n: 'nav-courses' },
  {
    href: '/workbooks',
    label: 'Resources',
    i18n: 'nav-resources',
    children: [
      { href: '/workbooks', label: 'Workbooks & Booklets' },
      { href: '/resources-library', label: 'Resource Library' },
      { href: '/checklist', label: 'Misinformation Checklist' },
      { href: '/digital-safety-laws', label: 'Digital Safety Laws' },
    ],
  },
  {
    href: '/faq',
    label: 'FAQ',
    i18n: 'nav-faq',
    children: [
      { href: '/faq', label: 'Frequently Asked Questions' },
      { href: '/facilitator-guide', label: 'Facilitator Guide' },
    ],
  },
];

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: 'Learn',
    links: [
      { href: '/modules', label: 'Digital Citizenship Modules' },
      { href: '/courses', label: 'Video Courses' },
      { href: '/level-2-missions', label: 'Level 2 Missions' },
      { href: '/quiz', label: 'Self-Assessment Quiz' },
      { href: '/badges', label: 'Verified Badges' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/workbooks', label: 'Workbooks & Booklets' },
      { href: '/resources-library', label: 'Resource Library' },
      { href: '/checklist', label: 'Misinformation Checklist' },
      { href: '/digital-safety-laws', label: 'Digital Safety Laws' },
      { href: '/facilitator-guide', label: 'Facilitator Guide' },
    ],
  },
  {
    title: 'Onnoy',
    links: [
      { href: '/session-request', label: 'Request a Session' },
      { href: '/fact-check', label: 'Submit a Fact-Check' },
      { href: '/support', label: 'Get Support' },
      { href: '/faq', label: 'FAQ' },
      { href: 'https://wa.me/8801830900746', label: 'WhatsApp Us', external: true },
    ],
  },
];
