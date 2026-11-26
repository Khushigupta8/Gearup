import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RichText } from '@/components/cms/RichText';
import { getPublishedPosts } from '@/server/services/blog';
import '@/styles/pages/blog.css';

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getPublishedPosts()).find((item) => item.slug === slug);
  if (!post) return { title: 'Article not found', robots: { index: false } };
  return { title: post.title, description: post.excerpt, alternates: { canonical: `/blog/${post.slug}` }, openGraph: { type: 'article', title: post.title, description: post.excerpt, publishedTime: post.publishedAt ?? undefined, ...(post.coverUrl ? { images: [post.coverUrl] } : {}) } };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = (await getPublishedPosts()).find((item) => item.slug === slug);
  if (!post) notFound();
  return <article className="pg-blog">
    <header className="phero"><div className="wrap blog-intro"><div className="crumbs"><Link href="/">Home</Link><span className="s">/</span><Link href="/blog">Blog</Link></div><h1 className="disp blog-title">{post.title}</h1><p className="lede">{post.excerpt}</p>{post.publishedAt && <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' })}</time>}</div></header>
    <div className="wrap blog-article sec">{post.coverUrl && <>
{/* eslint-disable-next-line @next/next/no-img-element */}
<img className="blog-cover" src={post.coverUrl} alt="" /></>}<div className="legal-body"><RichText text={post.body} /></div><Link href="/blog" className="lnk blog-back">← All articles</Link></div>
  </article>;
}
