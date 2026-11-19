'use client';

/* eslint-disable @next/next/no-img-element -- product photos sized by the site CSS */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { basket, useBasket } from '@/lib/basket';
import { money } from '@/lib/orders';

type Quote = {
  lines: { variantId: string; productSlug: string; name: string; size: string | null; image: string | null; unit: number; qty: number; total: number; inStock: boolean }[];
  itemsTotal: number;
  discount: { code: string; label: string; amount: number } | null;
  codeError: string | null;
  postage: number;
  missing: string[];
};

export function BasketView({ children }: { children?: React.ReactNode }) {
  const b = useBasket();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [code, setCode] = useState(b.code ?? '');
  const key = JSON.stringify([b.lines, b.code]);

  useEffect(() => {
    let live = true;
    fetch('/api/basket/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lines: b.lines, code: b.code, fulfilment: 'delivery' }) })
      .then((r) => r.json())
      .then((q: Quote) => {
        if (!live) return;
        setQuote(q);
        q.missing.forEach((id) => basket.setQty(id, 0)); // products removed from sale
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const empty = quote && quote.lines.length === 0;
  const kit = quote ? quote.itemsTotal - (quote.discount?.amount ?? 0) : 0;

  return (
    <div className="split">
      <div>
        <div className="formcard bk-sec">
          <h2>Kit &amp; accessories</h2>
          {!quote && <p className="muted">Loading your basket…</p>}
          {empty && (
            <p className="muted">
              Your basket is empty. <Link href="/accessories">Shop helmets, gloves, boots and more</Link>.
            </p>
          )}
          {quote?.lines.map((l) => (
            <div className="bkline" key={l.variantId}>
              {l.image ? <img src={l.image} alt="" /> : <span />}
              <div>
                <small>{[l.size && `Size ${l.size}`, !l.inStock && 'Low stock: we will call you'].filter(Boolean).join(' · ')}</small>
                <b>{l.name}</b>
                <div className="qty">
                  <button type="button" aria-label="One less" onClick={() => basket.setQty(l.variantId, l.qty - 1)}>
                    <Icon name="minus" />
                  </button>
                  <span>{l.qty}</span>
                  <button type="button" aria-label="One more" onClick={() => basket.setQty(l.variantId, l.qty + 1)}>
                    <Icon name="plus" />
                  </button>
                </div>
              </div>
              <div className="pr">
                {money(l.total)}
                <button type="button" className="linkbtn" onClick={() => basket.setQty(l.variantId, 0)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <Link href="/accessories" className="lnk mt2">
            Add more kit <Icon name="right" />
          </Link>
        </div>
        <div className="formcard bk-sec">
          <h2>Buying a bike too?</h2>
          <p>
            Open the bike and press <b>Reserve online for £99</b>. Your kit is added to the same payment and can come on the van with your bike.
          </p>
          <Link href="/used-bikes" className="lnk mt2">
            Find your bike <Icon name="right" />
          </Link>
        </div>
        {children}
      </div>
      <aside className="stick">
        <div className="summary">
          <h3 className="disp" style={{ fontSize: 30 }}>
            Order summary
          </h3>
          <form
            className="promo-in"
            onSubmit={(e) => {
              e.preventDefault();
              basket.setCode(code);
            }}
          >
            <label className="sr" htmlFor="pcode">
              Discount code
            </label>
            <input id="pcode" placeholder="Discount code" value={code} onChange={(e) => setCode(e.target.value)} />
            <button type="submit">Apply</button>
          </form>
          {quote?.codeError && b.code && (
            <p className="note" style={{ color: '#ff6b70', margin: '8px 0 0' }}>
              {quote.codeError}
            </p>
          )}
          <dl>
            <dt>Kit subtotal</dt>
            <dd>{quote ? money(quote.itemsTotal) : '…'}</dd>
            {quote?.discount && (
              <>
                <dt>{quote.discount.label}</dt>
                <dd style={{ color: '#ff6b70' }}>−{money(quote.discount.amount)}</dd>
              </>
            )}
            <dt>Postage</dt>
            <dd>{quote ? (quote.postage ? money(quote.postage) : 'Free') : '…'}</dd>
            <dt className="tot">Total</dt>
            <dd>{quote ? money(kit + quote.postage) : '…'}</dd>
          </dl>
          <p className="note">Free collection from the showroom, or free postage over £75. Kit bought with a bike comes on the van for free.</p>
          {empty ? (
            <Link href="/accessories" className="btn btn-red" style={{ width: '100%', height: 56, marginTop: 16 }}>
              Shop kit
            </Link>
          ) : (
            <Link href="/checkout" className="btn btn-red" style={{ width: '100%', height: 56, marginTop: 16 }}>
              <Icon name="lock" />
              Checkout securely
            </Link>
          )}
          <div className="secure" style={{ color: '#a5a5ac' }}>
            <Icon name="lock" />
            Secure payment by Stripe
          </div>
        </div>
      </aside>
    </div>
  );
}
