'use client';

/* eslint-disable @next/next/no-img-element -- DMS photos are already resized WebP files, as in BikeCard. */

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { gbp } from '@/lib/format';
import type { Bike } from '@/types';
import '@/styles/stock-bike-select.css';

type StockBike = Pick<Bike, 'slug' | 'year' | 'make' | 'model' | 'price' | 'image'>;
const nameOf = (bike: StockBike) => `${bike.year} ${bike.make} ${bike.model}`;
const LABEL = 'Bike you are interested in (optional)';

/** Photo selector backed by the same public DMS stock as the catalogue. */
export function StockBikeSelect({ bikes, initialSlug = '', id = 'dwant', label = LABEL }: { bikes: StockBike[]; initialSlug?: string; id?: string; label?: string }) {
  const [slug, setSlug] = useState(initialSlug);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: '', at: 0 });
  const selected = bikes.find((bike) => bike.slug === slug);
  const options = [undefined, ...bikes];
  const selectedIndex = selected ? bikes.indexOf(selected) + 1 : 0;
  const listId = `${id}-options`;

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);

  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  function choose(index: number) {
    setSlug(options[index]?.slug ?? '');
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const { key } = event;
    if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Home' || key === 'End') {
      event.preventDefault();
      setActive(key === 'Home' ? 0 : key === 'End' ? bikes.length : !open ? selectedIndex : Math.max(0, Math.min(bikes.length, active + (key === 'ArrowDown' ? 1 : -1))));
      setOpen(true);
    } else if ((key === 'Enter' || key === ' ') && open) {
      event.preventDefault();
      choose(active);
    } else if (key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    } else if (key === 'Tab') {
      setOpen(false);
    } else if (key.length === 1 && key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      typed.current = { text: (now - typed.current.at < 700 ? typed.current.text : '') + key.toLowerCase(), at: now };
      const match = options.findIndex((bike) => {
        const names = bike ? [nameOf(bike), `${bike.make} ${bike.model}`] : ['Not chosen yet'];
        return names.some((name) => name.toLowerCase().startsWith(typed.current.text));
      });
      if (match >= 0) {
        setActive(match);
        setOpen(true);
      }
    }
  }

  return (
    <div className="fl stock-bike-select" ref={root} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <label id={`${id}-label`} htmlFor={id}>{label}</label>
      {/* The native field keeps both the stock ID and readable choice in the enquiry. */}
      <select hidden name="bikeSlug" aria-label={label} value={selected?.slug ?? ''} onChange={(event) => setSlug(event.target.value)}>
        <option value="">Not chosen yet</option>
        {bikes.map((bike) => <option key={bike.slug} value={bike.slug}>{nameOf(bike)} · {gbp(bike.price)}</option>)}
      </select>
      <button
        ref={trigger}
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${id}-option-${active}` : undefined}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-describedby={!bikes.length ? `${id}-empty` : undefined}
        className="stock-bike-trigger"
        onKeyDown={onKeyDown}
        onClick={() => { setActive(selectedIndex); setOpen(!open); }}
      >
        {selected && <img src={selected.image} alt="" className="stock-bike-thumb" />}
        <span className="stock-bike-copy" id={`${id}-value`}>
          <span>{selected ? nameOf(selected) : 'Not chosen yet'}</span>
          {selected && <small>{gbp(selected.price)}</small>}
        </span>
        <Icon name="down" className="i stock-bike-chevron" />
      </button>
      {open && (
        <ul ref={list} id={listId} role="listbox" aria-labelledby={`${id}-label`} className="stock-bike-options">
          {options.map((bike, index) => (
            <li
              key={bike?.slug ?? 'none'}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              className={`stock-bike-option${index === active ? ' active' : ''}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
            >
              {bike && <img src={bike.image} alt="" className="stock-bike-thumb" loading="lazy" />}
              <span className="stock-bike-copy">
                <span>{bike ? nameOf(bike) : 'Not chosen yet'}</span>
                {bike && <small>{gbp(bike.price)}</small>}
              </span>
              {index === selectedIndex && <Icon name="check" className="i stock-bike-check" />}
            </li>
          ))}
        </ul>
      )}
      {!bikes.length && <small id={`${id}-empty`}>No bikes are available to choose right now. You can still send your enquiry.</small>}
    </div>
  );
}
