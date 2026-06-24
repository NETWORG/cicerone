export interface Edition {
  id: string;
  year: number;
  title: string;
  subtitle: string;
  dates: string;
  active: boolean;
  countries: string[];
  summary: string;
}

export const EDITIONS: Edition[] = [
  {
    id: 'transalpine-2026',
    year: 2026,
    title: 'Transalpine Edition',
    subtitle: 'Prague → Alps → Italy → Monaco → France → Switzerland → Germany → Prague',
    dates: '18–26 Jul 2026',
    active: true,
    countries: ['CZ', 'AT', 'IT', 'MC', 'FR', 'CH', 'DE'],
    summary:
      'The second Cicerone Rallye takes the Grand Tour across the Alps, through the Italian automotive heartland, along the Riviera, and back north through Geneva and Stuttgart.',
  },
  {
    id: 'baltica-2025',
    year: 2025,
    title: 'Baltica Edition',
    subtitle: 'Prague → Poland → Lithuania → Latvia → Prague',
    dates: 'Jul 2025',
    active: false,
    countries: ['CZ', 'PL', 'LT', 'LV'],
    summary:
      'The inaugural run. Prague to the Baltic and back. Two breakdowns, zero regrets. Proof that shitbox rallies work.',
  },
];
