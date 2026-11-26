/**
 * CMS shapes and defaults shared by the website and the admin (/admin/website).
 * Values live in the database (Setting / Banner / Faq / Review); the defaults below are what the site
 * showed before the CMS existed and are used until staff save something.
 */

export type Business = {
  phone: string; // as shown, e.g. 0744 072 1478
  whatsapp: string; // number, e.g. 447440721478
  email: string;
  address: string; // multi-line
  legalLine: string; // footer: company number, FCA details
  hours: [day: string, time: string][];
  promos: string[]; // top red strip
  socials: { facebook: string; instagram: string; tiktok: string; youtube: string; x: string };
  trustpilot: { rating: number; count: number; url: string };
};

export const defaultBusiness: Business = {
  phone: '0744 072 1478',
  whatsapp: '447440721478',
  email: 'sales@gearupmotorcycles.co.uk',
  address: '',
  legalLine: '',
  hours: [
    ['Mon to Fri', '9:00 to 17:30'],
    ['Saturday', '9:00 to 16:00'],
    ['Sunday', 'Closed'],
  ],
  promos: ['Reserve any bike online for £99', 'Nationwide UK delivery', '30-day warranty on every bike', '14-day money back guarantee'],
  socials: { facebook: '', instagram: '', tiktok: '', youtube: '', x: '' },
  trustpilot: { rating: 4.2, count: 22, url: '' },
};

/** UK number as shown → tel: link. */
export function telHref(phone: string) {
  const d = phone.replace(/\D/g, '');
  return 'tel:' + (d.startsWith('0') ? '+44' + d.slice(1) : d.startsWith('44') ? '+' + d : d);
}
export const waHref = (n: string) => `https://wa.me/${n.replace(/\D/g, '')}`;

/** FAQ blocks staff can edit, in the order shown in the admin. */
export const faqSections: { key: string; label: string; page: string }[] = [
  { key: 'home', label: 'Home page', page: '/' },
  { key: 'faq-buying', label: 'FAQ page · Buying & reserving', page: '/faq' },
  { key: 'faq-finance', label: 'FAQ page · Finance', page: '/faq' },
  { key: 'faq-px', label: 'FAQ page · Part-ex & selling', page: '/faq' },
  { key: 'faq-delivery', label: 'FAQ page · Delivery & collection', page: '/faq' },
  { key: 'faq-account', label: 'FAQ page · My account', page: '/faq' },
  { key: 'faq-warranty', label: 'FAQ page · Warranty & returns', page: '/faq' },
  { key: 'faq-workshop', label: 'FAQ page · Workshop', page: '/faq' },
  { key: 'faq-accessories', label: 'FAQ page · Accessories orders', page: '/faq' },
  { key: 'contact', label: 'Contact page', page: '/contact' },
  { key: 'finance', label: 'Finance page', page: '/finance' },
  { key: 'part-exchange', label: 'Part-exchange page', page: '/part-exchange' },
  { key: 'sell-your-bike', label: 'Sell your bike page', page: '/sell-your-bike' },
  { key: 'insurance', label: 'Insurance page', page: '/insurance' },
  { key: 'warranty', label: 'Warranty page', page: '/warranty' },
  { key: 'delivery', label: 'Delivery page', page: '/delivery' },
];

/** Pages whose Google title and description staff can override. */
export const seoPages: { path: string; label: string }[] = [
  { path: '/', label: 'Home' },
  { path: '/used-bikes', label: 'Motorbikes (stock list)' },
  { path: '/accessories', label: 'Accessories' },
  { path: '/finance', label: 'Finance' },
  { path: '/part-exchange', label: 'Part exchange' },
  { path: '/sell-your-bike', label: 'Sell your bike' },
  { path: '/insurance', label: 'Insurance' },
  { path: '/workshop', label: 'Workshop & MOT' },
  { path: '/warranty', label: 'Warranty' },
  { path: '/faq', label: 'FAQs' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
  { path: '/delivery', label: 'Delivery' },
  { path: '/blog', label: 'Blog' },
  { path: '/legal', label: 'Legal & policies' },
];
export type SeoEntry = { title?: string; description?: string };

/** Simple text pages edited in the CMS. */
export const legalPages = {
  terms: { title: 'Terms & Conditions of Sale', path: '/legal/terms', about: 'Covers the legal terms of buying a motorcycle from us, reserving online and ordering accessories.' },
  privacy: { title: 'Privacy Policy', path: '/legal/privacy', about: 'Explains how we collect, store, use and protect your personal data.' },
  cookies: { title: 'Cookie Policy & Cookie Consent', path: '/legal/cookies', about: 'Explains the cookies we use and how to change your consent for non-essential cookies.' },
  returns: { title: 'Returns, Refunds & Cancellation Policy', path: '/legal/returns', about: 'Explains cancellations, refunds, return arrangements and your statutory consumer rights.' },
  'vehicle-condition': { title: 'Used Motorcycle Condition & Warranty Policy', path: '/legal/vehicle-condition', about: 'Explains refurbishment, vehicle condition, warranty cover and how faults are handled.' },
  delivery: { title: 'Delivery & Collection Policy', path: '/legal/delivery', about: 'Explains delivery costs, timescales, inspection on arrival, collection and transport arrangements.' },
  insurance: { title: 'Insurance Information Notice (IDD)', path: '/legal/insurance', about: 'Our status when introducing you to motorcycle insurance, and how we are paid.' },
  complaints: { title: 'Complaints Procedure', path: '/legal/complaints', about: 'How to raise a complaint and what happens next.' },
} as const;
export type LegalSlug = keyof typeof legalPages;
/** Not shown on the website until published is ticked in the CMS. */
export type LegalPage = { title: string; body: string; published?: boolean; updatedAt?: string };

/** [Bracketed placeholders] still to fill in. Markdown links ([text](url)) don't count. */
export const placeholders = (text: string) => [...text.matchAll(/\[([^\]]+)\](?!\()/g)].map((m) => m[1]);

export type HeroSlideRow = { id: string; title: string; subtitle: string | null; imageUrl: string | null; linkUrl: string | null };
