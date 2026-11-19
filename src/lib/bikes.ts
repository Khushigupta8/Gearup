import type { Bike } from '@/types';

export function bikeName(b: Pick<Bike, 'year' | 'make' | 'model'>): string {
  return `${b.year} ${b.make} ${b.model}`;
}

export const styleLabels: Record<Bike['style'], string> = {
  sports: 'Sportsbike',
  naked: 'Naked',
  adventure: 'Adventure',
  cruiser: 'Cruiser',
  classic: 'Classic',
  tourer: 'Tourer',
  scooter: 'Scooter/Moped',
  enduro: 'Enduro',
};

/** Bikes in the same style first, then the rest; never the bike itself. */
export function similarBikes(bike: Bike, all: Bike[], count = 3): Bike[] {
  const others = all.filter((b) => b.slug !== bike.slug);
  return [...others.filter((b) => b.style === bike.style), ...others.filter((b) => b.style !== bike.style)].slice(0, count);
}
