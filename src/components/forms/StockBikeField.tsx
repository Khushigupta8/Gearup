import { StockBikeSelect } from './StockBikeSelect';
import type { Bike } from '@/types';

/** Only pass the small, public stock summary across the client boundary. */
export function StockBikeField({ bikes, requestedSlug, id, label }: {
  bikes: Bike[];
  requestedSlug?: string | string[];
  id: string;
  label?: string;
}) {
  const available = bikes.filter((bike) => bike.status === 'available');
  const initialSlug = available.find((bike) => bike.slug === requestedSlug)?.slug ?? '';
  return <StockBikeSelect key={initialSlug} id={id} label={label} initialSlug={initialSlug}
    bikes={available.map(({ slug, year, make, model, price, image }) => ({ slug, year, make, model, price, image }))} />;
}
