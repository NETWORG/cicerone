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
        className="relative w-7 h-7 rounded-full flex items-center justify-center shadow border-2 border-white/20"
        style={{ backgroundColor: meta.color }}
      >
        {Icon && <Icon size={12} strokeWidth={1.75} color="#fff" />}
        <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-asphalt-100 text-white text-[9px] font-bold leading-none flex items-center justify-center border-2 border-white shadow">
          {index}
        </span>
      </div>
      <div
        className="w-0 h-0 border-x-[4px] border-x-transparent border-t-[6px]"
        style={{ borderTopColor: meta.color }}
      />
    </div>
  );
}
