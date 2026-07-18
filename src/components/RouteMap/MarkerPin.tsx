import * as LucideIcons from 'lucide-react';
import type React from 'react';
import type { LucideProps } from 'lucide-react';
import { CATEGORIES, type Stop } from '../../data/stops';

/**
 * The marker's accent color comes from CATEGORIES data at runtime, so it
 * can't be a static Tailwind class - it's applied here as a single,
 * narrowly-scoped inline style (background/border-top color only).
 */
export default function MarkerPin({ stop, index }: { stop: Stop; index: number }) {
  const meta = CATEGORIES[stop.category];
  const iconName = meta.icon as keyof typeof LucideIcons;
  const Icon = LucideIcons[iconName] as React.ComponentType<LucideProps> | undefined;

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20"
        style={{ backgroundColor: meta.color }}
      >
        {Icon && <Icon size={17} strokeWidth={1.75} color="#fff" />}
        <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-asphalt-100 text-white text-[11px] font-bold leading-none flex items-center justify-center border-2 border-white shadow">
          {index}
        </span>
      </div>
      <div
        className="w-0 h-0 border-x-[6px] border-x-transparent border-t-8"
        style={{ borderTopColor: meta.color }}
      />
    </div>
  );
}
