import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalPage } from '@/components/cms/LegalPage';
import { legalPages, type LegalSlug } from '@/lib/cms';
import { getLegalPage, pageMetadata } from '@/server/services/cms';

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string }> };

const isSlug = (s: string): s is LegalSlug => s in legalPages;

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isSlug(slug)) return {};
  const page = await getLegalPage(slug);
  // Kept out of Google until the text is published in the CMS.
  return pageMetadata(legalPages[slug].path, {
    title: legalPages[slug].title,
    description: legalPages[slug].about,
    robots: page.published ? undefined : { index: false },
  });
}

export default async function LegalSlugPage({ params, searchParams }: Props) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  return <LegalPage slug={slug} preview={(await searchParams).preview === '1'} />;
}
