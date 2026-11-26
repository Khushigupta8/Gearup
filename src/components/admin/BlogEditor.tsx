'use client';

import { startTransition, useActionState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveBlogPost } from '@/app/admin/(panel)/website/blog/actions';
import type { CmsResult } from '@/app/admin/(panel)/website/actions';
import { blogSlug, type BlogPost } from '@/lib/blog';

export function BlogEditor({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<CmsResult, FormData>(async (previous, form) => {
    const result = await saveBlogPost(previous, form);
    if (result?.ok) {
      if (!post) router.replace(`/admin/website/blog?edit=${String(form.get('slug') ?? '').trim() || blogSlug(String(form.get('title') ?? ''))}`);
      router.refresh();
    }
    return result;
  }, null);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); startTransition(() => action(form)); }
  return <form onSubmit={submit} className="adm-card adm-form adm-blog-editor">
    <h2>{post ? 'Edit article' : 'New article'}</h2>
    <input type="hidden" name="mode" value={post ? 'edit' : 'new'} />
    <label>Title<input name="title" defaultValue={post?.title ?? ''} required maxLength={150} /></label>
    <label>Article address<input name="slug" defaultValue={post?.slug ?? ''} readOnly={Boolean(post)} maxLength={100} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="Leave blank to use the title" /><small className="adm-muted">{post ? 'The address stays the same when you edit this article.' : 'Shown after /blog/. Use lowercase words separated by hyphens.'}</small></label>
    <label>Short introduction<textarea name="excerpt" defaultValue={post?.excerpt ?? ''} maxLength={300} rows={3} /></label>
    <label>Cover image link (optional)<input name="coverUrl" defaultValue={post?.coverUrl ?? ''} placeholder="https://…" /></label>
    <label>Article<textarea name="body" defaultValue={post?.body ?? ''} maxLength={60000} rows={16} /><small className="adm-muted">Use blank lines for paragraphs, ## for headings, **bold**, - for lists, and [text](https://…) for links.</small></label>
    <label className="adm-check"><input name="published" type="checkbox" defaultChecked={post?.published ?? false} />Published — show this article on the website</label>
    {state && <p className={state.ok ? 'adm-ok' : 'adm-err'} role="status">{state.ok ? state.message : state.error}</p>}
    <div className="adm-inline"><button className="adm-btn adm-btn-red" disabled={pending}>{pending ? 'Saving…' : 'Save article'}</button><Link href="/admin/website/blog" className="adm-link">All articles</Link>{post?.published && <Link href={`/blog/${post.slug}`} target="_blank" className="adm-link">View article ↗</Link>}</div>
  </form>;
}
