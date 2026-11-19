import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductForm, type ProductValues } from '@/components/admin/ProductForm';
import { db } from '@/server/db';

export const metadata: Metadata = { title: 'Product' };

const pounds = (p: number | null) => (p == null ? '' : (p / 100).toFixed(2));

/** /admin/accessories/new creates; /admin/accessories/<id> edits. */
export default async function ProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const { id } = await params;
  const { created } = await searchParams;
  const categories = await db.productCategory.findMany({ orderBy: { sortOrder: 'asc' } });
  const isNew = id === 'new';
  const p = isNew ? null : await db.product.findUnique({ where: { id }, include: { variants: { orderBy: { price: 'asc' } } } });
  if (!isNew && !p) notFound();

  const values: ProductValues = p
    ? {
        id: p.id,
        name: p.name,
        brand: p.brand ?? '',
        categoryId: p.categoryId ?? '',
        meta: p.meta ?? '',
        flagText: p.flagText ?? '',
        description: p.description ?? '',
        image: p.images[0] ?? '',
        popularity: p.popularity,
        active: p.active,
        variants: p.variants.map((v) => ({ id: v.id, name: v.name, price: pounds(v.price), wasPrice: pounds(v.wasPrice), stock: String(v.stockQty) })),
      }
    : { name: '', brand: '', categoryId: '', meta: '', flagText: '', description: '', image: '', popularity: 100, active: true, variants: [] };

  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/admin/accessories" className="adm-back">
            ← Accessories
          </Link>
          <h1>{p ? p.name : 'Add product'}</h1>
        </div>
        {p && (
          <a href="/accessories" target="_blank" rel="noopener" className="adm-link">
            View shop ↗
          </a>
        )}
      </header>
      {created && <p className="adm-notice">Product created and live in the shop.</p>}
      <ProductForm values={values} categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
    </>
  );
}
