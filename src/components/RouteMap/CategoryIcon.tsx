import * as LucideIcons from 'lucide-react';
import type React from 'react';
import type { LucideProps } from 'lucide-react';
import { CATEGORIES, type StopCategory } from '../../data/stops';

/**
 * Category colors are per-category theme accents defined in data/stops.ts,
 * not static design tokens, so they're passed straight to Lucide's `color`
 * prop rather than baked into a Tailwind class.
 */
export default function CategoryIcon({ category, size = 12 }: { category: StopCategory; size?: number }) {
  const meta = CATEGORIES[category];
  const iconName = meta.icon as keyof typeof LucideIcons;
  const Icon = LucideIcons[iconName] as React.ComponentType<LucideProps> | undefined;
  return Icon ? <Icon size={size} strokeWidth={1.5} color={meta.color} /> : null;
}
