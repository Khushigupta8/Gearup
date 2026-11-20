import type { Metadata } from 'next';
import { HeroManager } from '@/components/admin/CmsForms';
import { requireStaff } from '@/server/auth';
import { db } from '@/server/db';

export const metadata: Metadata = { title: 'Website · Home hero' };

const ymd = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : '');

export default async function WebsiteHeroPage() {
  await requireStaff(['manager', 'admin']);
  const [slides, bikes] = await Promise.all([
    db.banner.findMany({ where: { placement: 'home_hero' }, orderBy: { sortOrder: 'asc' } }),
    db.bike.findMany({ where: { status: { in: ['available', 'reserved', 'in_preparation'] } }, select: { slug: true, year: true, make: true, model: true }, orderBy: { make: 'asc' } }),
  ]);
  return (
    <HeroManager
      slides={slides.map((s) => ({ id: s.id, title: s.title, subtitle: s.subtitle, imageUrl: s.imageUrl, linkUrl: s.linkUrl, active: s.active, startsAt: ymd(s.startsAt), endsAt: ymd(s.endsAt) }))}
      bikes={bikes.map((b) => ({ slug: b.slug, name: `${b.year} ${b.make} ${b.model}` }))}
    />
  );
}
