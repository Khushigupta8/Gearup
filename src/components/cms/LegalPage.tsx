import Link from 'next/link';
import { RichText } from '@/components/cms/RichText';
import { legalPages, type LegalSlug } from '@/lib/cms';
import { getUser, STAFF_ROLES } from '@/server/auth';
import { getBusiness, getLegalPage } from '@/server/services/cms';

/** Terms, privacy, cookies, complaints: text edited in Admin → Website → Terms & privacy. Hidden until published. */
export async function LegalPage({ slug, preview = false }: { slug: LegalSlug; preview?: boolean }) {
  // Staff can see an unpublished draft with ?preview=1 (link in the CMS).
  const user = preview ? await getUser() : null;
  const draft = Boolean(user && STAFF_ROLES.includes(user.role));
  const [page, biz] = await Promise.all([getLegalPage(slug, draft), getBusiness()]);
  const show = (page.published || draft) && page.body;
  return (
    <>
      <section className="phero">
        <div className="slab" aria-hidden="true"></div>
        <div className="wrap">
          <div>
            <div className="crumbs">
              <Link href="/">Home</Link>
              <span className="s">/</span>
              <span>{legalPages[slug].title}</span>
            </div>
            <h1 className="disp">{page.title || legalPages[slug].title}</h1>
            {page.published && page.updatedAt && <p className="lede">Last updated {new Date(page.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap prose legal-body">
          {draft && !page.published && <div className="notice" style={{ marginBottom: 24 }}>Draft preview. Only staff can see this until it is published in the CMS.</div>}
          {show ? (
            <RichText text={page.body} />
          ) : (
            <p>
              This page is being updated. For any questions, email <a href={`mailto:${biz.email}`}>{biz.email}</a> or call {biz.phone}.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
