'use client';

/* eslint-disable @next/next/no-img-element -- product photos sized by the site CSS */
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Stars } from '@/components/ui/Stars';
import { basket, basketCount, useBasket } from '@/lib/basket';

export type ShopProduct = {
  slug: string;
  name: string;
  brand: string | null;
  image: string | null;
  meta: string | null;
  flagText: string | null;
  rating: number | null;
  reviewCount: number | null;
  category: string | null;
  popularity: number;
  createdAt: number;
  variants: { id: string; name: string; price: number; wasPrice: number | null; stock: number }[];
};

const sorts = {
  pop: { label: 'Sort: Most popular', fn: (a: ShopProduct, b: ShopProduct) => a.popularity - b.popularity },
  'price-asc': { label: 'Price: low to high', fn: (a: ShopProduct, b: ShopProduct) => a.variants[0].price - b.variants[0].price },
  'price-desc': { label: 'Price: high to low', fn: (a: ShopProduct, b: ShopProduct) => b.variants[0].price - a.variants[0].price },
  new: { label: 'Newest first', fn: (a: ShopProduct, b: ShopProduct) => b.createdAt - a.createdAt },
} as const;
type SortKey = keyof typeof sorts;

const pounds = (p: number) => `£${(p / 100).toFixed(2)}`;

function ProductCard({ p }: { p: ShopProduct }) {
  const sized = p.variants.length > 1 || p.variants[0]?.name !== 'Standard';
  const [variantId, setVariantId] = useState(sized ? '' : p.variants[0]?.id);
  const [added, setAdded] = useState(false);
  const [needSize, setNeedSize] = useState(false);
  const v = p.variants.find((x) => x.id === variantId) ?? p.variants[0];
  const soldOut = p.variants.every((x) => x.stock <= 0);

  function add() {
    if (!variantId) {
      setNeedSize(true);
      return;
    }
    basket.add(variantId);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <article className="prod">
      <div className="pi">
        {p.flagText && <span className={/best|bundle/i.test(p.flagText) ? 'flag red' : 'flag'}>{p.flagText}</span>}
        {p.image && <img src={p.image} alt={p.name} loading="lazy" />}
      </div>
      <div className="pb">
        {p.brand && <span className="br">{p.brand}</span>}
        <h3>{p.name}</h3>
        {p.rating != null && (
          <div className="rt">
            <Stars full={Math.floor(p.rating)} half={p.rating % 1 >= 0.5} />({p.reviewCount ?? 0})
          </div>
        )}
        {p.meta && <div className="meta">{p.meta}</div>}
        {sized && (
          <div className="sel sizesel">
            <select
              aria-label={`Size for ${p.name}`}
              value={variantId}
              onChange={(e) => {
                setVariantId(e.target.value);
                setNeedSize(false);
              }}
              className={needSize ? 'need' : undefined}
            >
              <option value="">Choose size</option>
              {p.variants.map((x) => (
                <option key={x.id} value={x.id} disabled={x.stock <= 0}>
                  {x.name}
                  {x.stock <= 0 ? ' (sold out)' : ''}
                </option>
              ))}
            </select>
            <Icon name="down" />
          </div>
        )}
        <div className="pp">
          <span>
            {v?.wasPrice && <s>{pounds(v.wasPrice)}</s>}
            <b>{v ? pounds(v.price) : ''}</b>
          </span>
          <button className={`addb${added ? ' done' : ''}`} aria-label={added ? 'Added to basket' : `Add ${p.name} to basket`} onClick={add} disabled={soldOut}>
            <Icon name={added ? 'check' : 'plus'} />
          </button>
        </div>
        {needSize && <small className="formerr">Choose a size first</small>}
      </div>
    </article>
  );
}

export function ShopGrid({ products, categories }: { products: ShopProduct[]; categories: { slug: string; name: string }[] }) {
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortKey>('pop');
  const b = useBasket();

  const shown = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return products
      .filter((p) => cat === 'all' || p.category === cat)
      .filter((p) => {
        const hay = `${p.name} ${p.brand ?? ''} ${p.category ?? ''} ${p.meta ?? ''}`.toLowerCase();
        return words.every((w) => hay.includes(w));
      })
      .sort(sorts[sort].fn);
  }, [products, cat, q, sort]);

  const count = (slug: string) => products.filter((p) => p.category === slug).length;
  const inBasket = basketCount(b);

  return (
    <>
      <form className="kitsearch" role="search" onSubmit={(e) => e.preventDefault()}>
        <Icon name="search" />
        <label className="sr" htmlFor="ks">
          Search accessories
        </label>
        <input id="ks" placeholder="Search kit, e.g. heated grips, panniers, gloves" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn btn-red" type="submit">
          Search
        </button>
      </form>
      <div className="shop-cats">
        <button type="button" className={`chip${cat === 'all' ? ' on' : ''}`} onClick={() => setCat('all')}>
          All kit <i>{products.length}</i>
        </button>
        {categories
          .filter((c) => count(c.slug) > 0)
          .map((c) => (
            <button key={c.slug} type="button" className={`chip${cat === c.slug ? ' on' : ''}`} onClick={() => setCat(c.slug)}>
              {c.name} <i>{count(c.slug)}</i>
            </button>
          ))}
      </div>
      <div className="shopbar">
        <b>
          {cat === 'all' && !q ? 'All kit' : 'Results'}{' '}
          <small>
            {shown.length} product{shown.length === 1 ? '' : 's'}
          </small>
        </b>
        <div className="sel">
          <label className="sr" htmlFor="srt">
            Sort by
          </label>
          <select id="srt" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            {Object.entries(sorts).map(([k, s]) => (
              <option key={k} value={k}>
                {s.label}
              </option>
            ))}
          </select>
          <Icon name="down" />
        </div>
      </div>
      <div className="pgrid" id="kitGrid">
        {shown.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </div>
      {shown.length === 0 && <p className="kit-empty muted">{q ? `No kit matches "${q.trim()}". Try another word or clear the search.` : 'Nothing in this category yet.'}</p>}
      {inBasket > 0 && (
        <div className="stock-note">
          <span>
            {inBasket} item{inBasket === 1 ? '' : 's'} in your basket.
          </span>
          <Link href="/basket" className="lnk">
            View basket <Icon name="right" />
          </Link>
        </div>
      )}
    </>
  );
}
