import { type StopCategory, CATEGORIES } from '../data/stops';

interface Props {
  category: StopCategory;
  size?: 'sm' | 'md';
}

export default function CategoryBadge({ category, size = 'sm' }: Props) {
  const meta = CATEGORIES[category];
  return (
    <span
      className={`category-badge ${size === 'md' ? 'text-sm px-3 py-1' : ''}`}
      style={{
        backgroundColor: meta.color + '22',
        color: meta.color,
        border: `1px solid ${meta.color}44`,
      }}
    >
      <span>{meta.emoji}</span>
      <span>{meta.label}</span>
    </span>
  );
}
