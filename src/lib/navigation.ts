import type { IconName } from '@/components/ui/Icon';
import { PHASE2 } from '@/lib/features';

export type NavItem = { href: string; label: string; icon?: IconName };

export const mainNav: NavItem[] = [
  { href: '/used-bikes', label: 'Motorbikes', icon: 'moto' },
  { href: '/finance', label: 'Finance', icon: 'card' },
  { href: '/part-exchange', label: 'Part exchange', icon: 'swap' },
  { href: '/sell-your-bike', label: 'Sell your bike', icon: 'tag' },
  { href: '/accessories', label: 'Accessories', icon: 'helmet' },
  { href: '/insurance', label: 'Insurance', icon: 'shieldcheck' },
  { href: '/workshop', label: 'Workshop & MOT', icon: 'wrench' },
];

export const mobileNav: NavItem[] = [
  ...mainNav,
  { href: '/basket', label: 'Basket' },
  ...(PHASE2 ? [{ href: '/delivery', label: 'Delivery' }] : []),
  { href: '/warranty', label: 'Warranty' },
  { href: '/account', label: PHASE2 ? 'Track my bike' : 'My account' },
  { href: '/contact', label: 'Contact' },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: 'Buy',
    links: [
      { href: '/used-bikes', label: 'Motorbikes' },
      { href: '/used-bikes?cc=125', label: '125cc & learner' },
      { href: '/finance', label: 'Finance' },
      { href: '/part-exchange', label: 'Part exchange' },
      { href: '/sell-your-bike', label: 'Sell your bike' },
      { href: '/accessories', label: 'Accessories' },
      { href: '/insurance', label: 'Insurance' },
    ],
  },
  {
    title: 'Help',
    links: [
      ...(PHASE2 ? [{ href: '/delivery', label: 'Delivery & tracking' }] : []),
      { href: '/warranty', label: 'Warranty' },
      { href: '/workshop', label: 'Workshop & MOT' },
      { href: '/faq', label: 'FAQs' },
      { href: '/account', label: PHASE2 ? 'Track my bike' : 'My account' },
      { href: '/contact', label: 'Contact us' },
    ],
  },
];

export const accountNav: NavItem[] = [
  { href: '/account', label: PHASE2 ? 'Track my bike' : 'My reservation', icon: PHASE2 ? 'pin' : 'key' },
  { href: '/account/orders', label: 'My orders', icon: 'bag' },
  { href: '/account/saved', label: 'Saved bikes', icon: 'heart' },
  ...(PHASE2 ? [{ href: '/account/documents', label: 'Documents', icon: 'doc' as const }] : []),
  { href: '/account/part-exchange', label: 'Part-exchange', icon: 'key' },
  { href: '/account/details', label: 'Details', icon: 'user' },
];
