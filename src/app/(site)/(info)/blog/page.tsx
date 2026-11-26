import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { getPublishedPosts } from '@/server/services/blog';
import { pageMetadata } from '@/server/services/cms';
import '@/styles/pages/blog.css';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/blog', { title: 'Blog', description: 'News, motorcycle stories and updates from GearUp Motorcycles.' });
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return <div className="pg-blog">
    <section className="phero"><div className="slab" aria-hidden="true" /><div className="wrap blog-intro"><div className="crumbs"><Link href="/">Home</Link><span className="s">/</span><span>Blog</span></div><h1 className="disp">The GearUp <em>blog</em></h1><p className="lede">News, motorcycle stories and updates from the team.</p></div></section>
    <section className="sec"><div className="wrap">
      {posts.length ? <div className="blog-grid">{posts.map((post) => <article className="blog-card" key={post.slug}>
        {post.coverUrl && <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={post.coverUrl} alt="" loading="lazy" /></Link>}
        {post.publishedAt && <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' })}</time>}
        <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p><Link href={`/blog/${post.slug}`} className="lnk" aria-label={`Read ${post.title}`}>Read article <Icon name="right" /></Link>
      </article>)}</div> : <div className="blog-empty"><Icon name="doc" /><h2 className="disp">More from GearUp, soon</h2><p>Our latest news and articles will appear here. In the meantime, take a look at the bikes in stock or get in touch with the team.</p><div className="ctas"><Link href="/used-bikes" className="btn btn-red">Browse bikes <Icon name="right" /></Link><Link href="/contact" className="btn btn-line">Contact us</Link></div></div>}
    </div></section>
  </div>;
}
