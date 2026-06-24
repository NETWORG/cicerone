import React from 'react';
import * as LucideIcons from 'lucide-react';
import { type LucideProps } from 'lucide-react';
import { type StopCategory, CATEGORIES } from '../data/stops';

interface Props {
  category: StopCategory;
  size?: 'sm' | 'md';
}

export default function CategoryBadge({ category, size = 'sm' }: Props) {
  const meta = CATEGORIES[category];
  const iconName = meta.icon as keyof typeof LucideIcons;
  const Icon = LucideIcons[iconName] as React.ComponentType<LucideProps> | undefined;
  const iconSize = size === 'md' ? 14 : 12;

  return (
    <span
      className={`category-badge ${size === 'md' ? 'text-sm px-3 py-1' : ''}`}
      style={{
        backgroundColor: meta.color + '22',
        color: meta.color,
        border: `1px solid ${meta.color}44`,
      }}
    >
      {Icon && <Icon size={iconSize} strokeWidth={1.5} />}
      <span>{meta.label}</span>
    </span>
  );
}
