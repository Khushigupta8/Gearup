import Link from 'next/link';
import { RichText } from '@/components/cms/RichText';
import { legalPages, type LegalSlug } from '@/lib/cms';
import { getBusiness, getLegalPage } from '@/server/services/cms';

/** Terms / privacy: text edited in Admin → Website → Pages. */
export async function LegalPage({ slug }: { slug: LegalSlug }) {
  const [page, biz] = await Promise.all([getLegalPage(slug), getBusiness()]);
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
            {page.updatedAt && <p className="lede">Last updated {new Date(page.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap prose legal-body">
          {page.body ? (
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
