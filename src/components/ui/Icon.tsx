import type { iconNames } from './IconSprite';

export type IconName = (typeof iconNames)[number];

export function Icon({ name, className = 'i' }: { name: IconName; className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}
