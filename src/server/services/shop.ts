import 'server-only';
import { unstable_cache } from 'next/cache';
import { db } from '../db';

export const PRODUCTS_TAG = 'products';

const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL'];
/** Sizes in the order riders expect (S, M, L, XL), numeric sizes ascending, anything else by price. */
function bySize(a: { name: string; price: number }, b: { name: string; price: number }) {
  const ia = SIZE_ORDER.indexOf(a.name.toUpperCase());
  const ib = SIZE_ORDER.indexOf(b.name.toUpperCase());
  if (ia !== -1 && ib !== -1) return ia - ib;
  const na = parseFloat(a.name);
  const nb = parseFloat(b.name);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
  return a.price - b.price;
}

/** Active products for the accessories page, cached until a product is saved in the admin. */
export const loadShop = unstable_cache(
  async () => {
    const [products, categories] = await Promise.all([
      db.product.findMany({
        where: { active: true },
        include: { category: true, variants: { orderBy: { price: 'asc' } } },
        orderBy: { popularity: 'asc' },
      }),
      db.productCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
    ]);
    return { products: products.map((p) => ({ ...p, variants: [...p.variants].sort(bySize) })), categories };
  },
  ['shop', process.env.VERCEL_DEPLOYMENT_ID ?? 'local'],
  { tags: [PRODUCTS_TAG] },
);
