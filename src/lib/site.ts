export const site = {
  name: 'GearUp Motorcycles',
  description: 'Quality used motorbikes, inspected, warranted and delivered nationwide across the UK.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  phone: { display: '0744 072 1478', href: 'tel:+447440721478' },
  whatsapp: 'https://wa.me/447440721478',
  email: 'sales@gearupmotorcycles.co.uk',
  promos: [
    'Reserve any bike online for £99',
    'Nationwide UK delivery',
    '30-day warranty on every bike',
    '14-day money back guarantee',
  ],
  hours: [
    ['Mon to Fri', '9:00 to 17:30'],
    ['Saturday', '9:00 to 16:00'],
    ['Sunday', 'Closed'],
  ],
} as const;
