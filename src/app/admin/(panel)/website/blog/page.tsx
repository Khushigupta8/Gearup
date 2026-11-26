import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogEditor } from '@/components/admin/BlogEditor';
import { getAdminPosts } from '@/server/services/blog';
import { requireStaff } from '@/server/auth';

export const metadata: Metadata = { title: 'Website · Blog' };

export default async function BlogAdmin({ searchParams }: { searchParams: Promise<{ edit?: string; new?: string }> }) {
  await requireStaff(['manager', 'admin']);
  const [params, posts] = await Promise.all([searchParams, getAdminPosts()]);
  const post = posts.find((item) => item.slug === params.edit);
  if (params.edit && !post) notFound();
  if (params.new || post) return <BlogEditor key={post?.slug ?? 'new'} post={post} />;
  return <div className="adm-stack">
    <div className="adm-sec-head"><p className="adm-muted">Write articles, save drafts and publish when they are ready.</p><Link href="/admin/website/blog?new=1" className="adm-btn adm-btn-red">New article</Link></div>
    {posts.length ? <div className="adm-card"><table className="adm-table"><thead><tr><th>Article</th><th>Status</th><th>Actions</th></tr></thead><tbody>{posts.map((item) => <tr key={item.slug}><td>{item.title}</td><td>{item.published ? 'Published' : 'Draft'}</td><td><Link href={`/admin/website/blog?edit=${item.slug}`} className="adm-link">Edit article</Link></td></tr>)}</tbody></table></div> : <div className="adm-card"><h2>No articles yet</h2><p>Create the first post above. Drafts remain private until you tick Published.</p></div>}
  </div>;
}
