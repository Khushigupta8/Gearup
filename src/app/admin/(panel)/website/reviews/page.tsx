import type { Metadata } from 'next';
import { ReviewManager } from '@/components/admin/CmsForms';
import { db } from '@/server/db';

export const metadata: Metadata = { title: 'Website · Reviews' };

export default async function WebsiteReviewsPage() {
  const reviews = await db.review.findMany({ orderBy: [{ featured: 'desc' }, { date: 'desc' }] });
  return <ReviewManager reviews={reviews.map((r) => ({ ...r, date: r.date.toISOString().slice(0, 10) }))} />;
}
