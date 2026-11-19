import 'server-only';
import { unstable_cache } from 'next/cache';
import { db } from '../db';

export const PRODUCTS_TAG = 'products';

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
    return { products, categories };
  },
  ['shop', process.env.VERCEL_DEPLOYMENT_ID ?? 'local'],
  { tags: [PRODUCTS_TAG] },
);
