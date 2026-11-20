/* eslint-disable @next/next/no-img-element -- images sized by the page CSS */
import type { Metadata } from 'next';
import { pageMetadata } from '@/server/services/cms';
import Link from 'next/link';
import { ShopGrid, type ShopProduct } from '@/components/shop/ShopGrid';
import { Icon } from '@/components/ui/Icon';
import { loadShop } from '@/server/services/shop';
import '@/styles/pages/accessories.css';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/accessories', {
  title: 'Motorcycle Accessories',
  description: 'Helmets, gloves, boots, jackets, luggage and security for your bike. Posted UK-wide or collect from our showroom.',
});
}

export default async function AccessoriesPage() {
  const { products, categories } = await loadShop();
  const shop: ShopProduct[] = products
    .filter((p) => p.variants.length > 0)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      image: p.images[0] ?? null,
      meta: p.meta,
      flagText: p.flagText,
      rating: p.rating,
      reviewCount: p.reviewCount,
      category: p.category?.slug ?? null,
      popularity: p.popularity,
      createdAt: new Date(p.createdAt).getTime(),
      variants: p.variants.map((v) => ({ id: v.id, name: v.name, price: v.price, wasPrice: v.wasPrice, stock: v.stockQty })),
    }));

  return (
    <>
      <section className="phero acc-hero img-right">
        <div className="slab" aria-hidden="true"></div>
        <div className="wrap">
          <div>
            <div className="crumbs">
              <Link href="/">Home</Link>
              <span className="s">/</span>
              <span>Accessories</span>
            </div>
            <h1 className="disp">
              Kit up <em>for the road</em>
            </h1>
            <p className="lede">Helmets, gloves, boots, jackets, luggage and locks. Picked by riders, posted anywhere in the UK or ready to collect with your bike.</p>
            <div className="ctas">
              <a href="#shop" className="btn btn-red">
                Shop all kit <Icon name="right" />
              </a>
              <Link href="/basket" className="btn btn-ghost">
                <Icon name="bag" />
                View basket
              </Link>
            </div>
            <div className="chipbar">
              <span>
                <Icon name="truck" />
                UK-wide postage
              </span>
              <span>
                <Icon name="home" />
                Free showroom collection
              </span>
              <span>
                <Icon name="tag" />
                10% off kit with any bike
              </span>
            </div>
          </div>
          <div className="pimg">
            <img className="a" src="/assets/images/accessories/helmet-full-face.webp" alt="Full-face motorcycle helmet" />
            <img className="b" src="/assets/images/accessories/gloves-summer.webp" alt="Motorcycle gloves" />
          </div>
        </div>
      </section>

      <section className="sec" id="shop" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <ShopGrid products={shop} categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
        </div>
      </section>

      <section className="kitband">
        <div className="wrap">
          <div className="pct">
            10%<small>off kit</small>
          </div>
          <div>
            <h2 className="disp">Buying a bike? Kit up for less.</h2>
            <p>Take 10% off any helmet, gloves, boots or clothing when you buy a bike from us. Add it to your reservation or pick it up when you collect.</p>
          </div>
          <div className="side">
            <span className="code">
              Code <b>BIKE10</b>
            </span>
            <Link href="/used-bikes" className="btn btn-white">
              Find your bike <Icon name="right" />
            </Link>
          </div>
        </div>
      </section>

      <section className="sec dark">
        <div className="wrap">
          <div className="sh">
            <div>
              <span className="tag">Kit for your new bike</span>
              <h2 className="disp">
                Got the bike? <em>Now the gear.</em>
              </h2>
              <p>Ready-made bundles for new riders and commuters. Add one to any bike reservation and save 10%.</p>
            </div>
            <Link href="/used-bikes" className="btn btn-red">
              Browse bikes <Icon name="right" />
            </Link>
          </div>
          <div className="upsell">
            <Link href="/used-bikes" className="dt" style={{ minHeight: 420 }}>
              <img src="/assets/images/lifestyle/rider-full-kit-sportsbike.webp" alt="Rider in full kit on a sportsbike" />
              <h3>
                Matched to
                <br />
                your bike
              </h3>
              <p>Tell us which bike you are buying and we will put together the right helmet, gloves and luggage for it.</p>
              <span className="btn btn-white">
                Choose your bike <Icon name="right" />
              </span>
            </Link>
            <div className="bundles">
              {[
                ['/used-bikes?cc=125', 'helmet-modular', 'CBT & learner', 'New rider starter kit', 'Helmet, gloves, jacket and chain lock.', '£479.96', '£431.96'],
                ['/used-bikes', 'tank-bag', 'Commuter', 'All-weather commuter', 'Winter gloves, tank bag and textile bundle.', '£364.97', '£328.47'],
                ['/used-bikes', 'boots-touring', 'Touring & adventure', 'Long-distance pack', 'Modular helmet, touring boots and tank bag.', '£419.97', '£377.97'],
              ].map(([href, img, small, title, text, was, now]) => (
                <Link key={title} href={href} className="bundle">
                  <span className="bimg">
                    <img src={`/assets/images/accessories/${img}.webp`} alt="" />
                  </span>
                  <span>
                    <small>{small}</small>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </span>
                  <span className="bp">
                    <s>{was}</s>
                    <b>{now}</b>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
