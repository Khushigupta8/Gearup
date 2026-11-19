import type { Metadata } from 'next';
import Link from 'next/link';
import { money } from '@/lib/orders';
import { db } from '@/server/db';

export const metadata: Metadata = { title: 'Accessories' };

export default async function AdminAccessoriesPage() {
  const products = await db.product.findMany({ orderBy: [{ active: 'desc' }, { popularity: 'asc' }], include: { category: true, variants: true } });
  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Accessories</h1>
          <p className="adm-muted">
            {products.length} products. Changes show in the shop straight away.{' '}
            <Link href="/admin/accessories/codes" className="adm-link">
              Discount codes →
            </Link>
          </p>
        </div>
        <Link href="/admin/accessories/new" className="adm-btn adm-btn-red">
          + Add product
        </Link>
      </header>
      <div className="adm-card adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th className="adm-num">Price</th>
              <th className="adm-num">Stock</th>
              <th>In shop</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const stock = p.variants.reduce((n, v) => n + v.stockQty, 0);
              const prices = p.variants.map((v) => v.price);
              return (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/accessories/${p.id}`} className="adm-bike adm-rowlink">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {p.images[0] ? <img src={p.images[0]} alt="" style={{ objectFit: 'contain', background: '#fff' }} /> : <span className="adm-noimg" />}
                      <div>
                        <b>{p.name}</b>
                        <small>
                          {p.brand} · {p.variants.length} size{p.variants.length === 1 ? '' : 's'}
                        </small>
                      </div>
                    </Link>
                  </td>
                  <td>{p.category?.name}</td>
                  <td className="adm-num">{prices.length ? money(Math.min(...prices)) : ''}</td>
                  <td className={`adm-num${stock === 0 ? ' adm-due' : ''}`}>{stock}</td>
                  <td>{p.active ? <span className="adm-ok">Yes</span> : <span className="adm-muted">Hidden</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
