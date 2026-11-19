'use client';

import { Fragment, useMemo, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { monthlyPayment } from '@/lib/format';
import type { Bike } from '@/types';
import { BikeCard } from './BikeCard';

const PER_PAGE = 8;
/** On page 1 the promo tile sits after this many bikes (8 bikes + tile = full 3 x 3 grid). */
const PROMO_AFTER = 5;

const sorts = {
  new: { label: 'Newest arrivals', fn: () => 0 },
  'price-asc': { label: 'Price: low to high', fn: (a: Bike, b: Bike) => a.price - b.price },
  'price-desc': { label: 'Price: high to low', fn: (a: Bike, b: Bike) => b.price - a.price },
  'mo-asc': { label: 'Monthly: low to high', fn: (a: Bike, b: Bike) => monthlyPayment(a.price, 48) - monthlyPayment(b.price, 48) },
  'miles-asc': { label: 'Mileage: lowest', fn: (a: Bike, b: Bike) => a.mileage - b.mileage },
  'year-desc': { label: 'Year: newest', fn: (a: Bike, b: Bike) => b.year - a.year },
} as const;
type SortKey = keyof typeof sorts;

/** Toolbar, sort, pager and grid for /used-bikes. `filters` is the sidebar, `promo` the tile shown on page 1. */
export function BikeListing({ bikes, filters, promo, applied = [] }: { bikes: Bike[]; filters: ReactNode; promo: ReactNode; applied?: ReactNode[] }) {
  const [sort, setSort] = useState<SortKey>('new');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const toolbar = useRef<HTMLDivElement>(null);

  const sorted = useMemo(() => [...bikes].sort(sorts[sort].fn), [bikes, sort]);
  const pages = Math.ceil(sorted.length / PER_PAGE);
  const shown = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function goTo(p: number) {
    setPage(p);
    toolbar.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="listing">
      <aside className="filters" aria-label="Filters" style={filtersOpen ? { display: 'block' } : undefined}>
        {filters}
      </aside>

      <div>
        <div className="toolbar" ref={toolbar}>
          <b>
            {bikes.length} {bikes.length === 1 ? 'bike' : 'bikes'}
          </b>
          <div className="tr">
            <button className="btn btn-ink mfilter" type="button" style={{ height: 44 }} onClick={() => setFiltersOpen((o) => !o)}>
              <Icon name="filter" />
              Filters
            </button>
            <div className="sel">
              <label className="sr" htmlFor="srt">
                Sort
              </label>
              <select
                id="srt"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortKey);
                  setPage(1);
                }}
              >
                {Object.entries(sorts).map(([key, s]) => (
                  <option key={key} value={key}>
                    {s.label}
                  </option>
                ))}
              </select>
              <Icon name="down" />
            </div>
            <div className="vt">
              <span className="on">
                <Icon name="grid" />
              </span>
              <span>
                <Icon name="list" />
              </span>
            </div>
          </div>
        </div>
        {applied.length > 0 && <div className="applied">{applied}</div>}
        {bikes.length === 0 && (
          <div className="listing-empty">
            <h3>No bikes match those filters</h3>
            <p>Try removing a filter, or set up a stock alert below and we will message you when a match arrives.</p>
          </div>
        )}
        <div className="lgrid" id="bikeGrid">
          {shown.map((bike, i) => (
            <Fragment key={bike.slug}>
              {page === 1 && i === PROMO_AFTER && promo}
              <BikeCard bike={bike} />
            </Fragment>
          ))}
        </div>
        <p className="note muted" style={{ fontSize: 13, marginTop: 18 }}>
          Monthly figures are an example over 48 months, £0 deposit, 19.9% APR representative. Finance subject to status and
          affordability.
        </p>
        {pages > 1 && (
          <div className="pager">
            {page > 1 && (
              <button type="button" onClick={() => goTo(page - 1)} aria-label="Previous page">
                <Icon name="left" />
              </button>
            )}
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                type="button"
                key={p}
                className={p === page ? 'on' : undefined}
                aria-current={p === page ? 'page' : undefined}
                onClick={() => goTo(p)}
              >
                {p}
              </button>
            ))}
            {page < pages && (
              <button type="button" onClick={() => goTo(page + 1)} aria-label="Next page">
                <Icon name="right" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
