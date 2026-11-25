'use client';

/* eslint-disable @next/next/no-img-element -- DMS photos are already resized WebP files, as in BikeCard. */

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { gbp } from '@/lib/format';
import { matchesBikeSearch } from '@/lib/bike-filters';
import type { Bike } from '@/types';
import '@/styles/stock-bike-select.css';

type StockBike = Pick<Bike, 'slug' | 'year' | 'make' | 'model' | 'price' | 'image' | 'registration'>;
const nameOf = (bike: StockBike) => `${bike.year} ${bike.make} ${bike.model}`;
const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const summaryOf = (bike: StockBike) => `${bike.registration || 'Reg not listed'} · ${gbp(bike.price)}`;
const LABEL = 'Bike you are interested in (optional)';

/** Searchable photo selector backed by public, available DMS stock. */
export function StockBikeSelect({ bikes, initialSlug = '', id = 'dwant', label = LABEL }: { bikes: StockBike[]; initialSlug?: string; id?: string; label?: string }) {
  const [slug, setSlug] = useState(initialSlug);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const selected = bikes.find((bike) => bike.slug === slug);
  const term = normalise(query);
  const options: (StockBike | undefined)[] = term
    ? bikes.filter((bike) => matchesBikeSearch(bike, query))
    : [undefined, ...bikes];
  const listId = `${id}-options`;

  useEffect(() => {
    if (!open) return;
    search.current?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);

  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [open, active, query]);

  function showOptions() {
    setQuery('');
    setActive(selected ? bikes.indexOf(selected) + 1 : 0);
    setOpen(true);
  }

  function choose(index: number) {
    if (index < 0 || index >= options.length) return;
    setSlug(options[index]?.slug ?? '');
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }

  function onSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(0, Math.min(options.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1))));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      choose(active);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus({ preventScroll: true });
    } else if (event.key === 'Tab') {
      setOpen(false);
    }
  }

  return (
    <div className="fl stock-bike-select" ref={root} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <label id={`${id}-label`} htmlFor={id}>{label}</label>
      {/* Keep the stock ID and readable choice (including registration) in the enquiry. */}
      <select hidden name="bikeSlug" aria-label={label} value={selected?.slug ?? ''} onChange={(event) => setSlug(event.target.value)}>
        <option value="">Not chosen yet</option>
        {bikes.map((bike) => <option key={bike.slug} value={bike.slug}>{nameOf(bike)} · {summaryOf(bike)}</option>)}
      </select>
      <button
        ref={trigger} id={id} type="button" aria-expanded={open}
        aria-controls={open ? `${id}-popup` : undefined}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-describedby={!bikes.length ? `${id}-empty` : undefined}
        className="stock-bike-trigger"
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            showOptions();
          }
        }}
        onClick={() => { if (open) setOpen(false); else showOptions(); }}
      >
        {selected && <img src={selected.image} alt="" className="stock-bike-thumb" />}
        <span className="stock-bike-copy" id={`${id}-value`}>
          <span>{selected ? nameOf(selected) : 'Not chosen yet'}</span>
          {selected && <small>{summaryOf(selected)}</small>}
        </span>
        <Icon name="down" className="i stock-bike-chevron" />
      </button>
      {open && (
        <div id={`${id}-popup`} className="stock-bike-popup">
          <div className="stock-bike-search">
            <label htmlFor={`${id}-search`}>Search by bike name or registration</label>
            <input
              ref={search} id={`${id}-search`} type="search" role="combobox" autoComplete="off"
              placeholder="e.g. Titan or YT20 OCS" data-form-ignore
              aria-expanded="true" aria-autocomplete="list" aria-controls={listId}
              aria-activedescendant={options.length ? `${id}-option-${active}` : undefined}
              value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }}
              onKeyDown={onSearchKeyDown}
            />
          </div>
          <ul ref={list} id={listId} role="listbox" aria-labelledby={`${id}-label`} className="stock-bike-options">
            {options.map((bike, index) => (
              <li
                key={bike?.slug ?? 'none'} id={`${id}-option-${index}`} role="option"
                aria-selected={(bike?.slug ?? '') === (selected?.slug ?? '')}
                className={`stock-bike-option${index === active ? ' active' : ''}`}
                onMouseDown={(event) => event.preventDefault()} onClick={() => choose(index)}
              >
                {bike && <img src={bike.image} alt="" className="stock-bike-thumb" loading="lazy" />}
                <span className="stock-bike-copy">
                  <span>{bike ? nameOf(bike) : 'Not chosen yet'}</span>
                  {bike && <small>{summaryOf(bike)}</small>}
                </span>
                {(bike?.slug ?? '') === (selected?.slug ?? '') && <Icon name="check" className="i stock-bike-check" />}
              </li>
            ))}
          </ul>
          {!options.length && <p className="stock-bike-no-results" role="status">No bikes match. Try another name or registration.</p>}
        </div>
      )}
      {!bikes.length && <small id={`${id}-empty`}>No bikes are available to choose right now. You can still send your enquiry.</small>}
    </div>
  );
}
