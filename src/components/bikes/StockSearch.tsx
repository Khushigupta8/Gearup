'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';

export function StockSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const query = params.get('q') ?? '';
  const [pending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = new URLSearchParams(params.toString());
    const value = String(new FormData(event.currentTarget).get('q') ?? '').trim();
    if (value) next.set('q', value);
    else next.delete('q');
    startTransition(() => router.push(`/used-bikes${next.size ? `?${next}` : ''}`, { scroll: false }));
  }

  return (
    <form className="stock-search" role="search" aria-label="Search stock" onSubmit={submit}>
      <label htmlFor="stock-search">Search make, model or registration</label>
      <div>
        <input key={query} id="stock-search" name="q" type="search" maxLength={100} defaultValue={query} placeholder="e.g. Lexmoto Titan or YT20 OCS" />
        <button type="submit" className="btn btn-ink" disabled={pending}>
          <Icon name="search" />{pending ? 'Searching…' : 'Search'}
        </button>
      </div>
    </form>
  );
}
