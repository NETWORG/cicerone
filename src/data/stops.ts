export type StopCategory =
  | 'start'
  | 'finish'
  | 'pass'
  | 'cars'
  | 'factory'
  | 'track'
  | 'sea'
  | 'city'
  | 'science'
  | 'museum'
  | 'food'
  | 'sleep';

export interface Stop {
  id: string;
  name: string;
  location: string;
  country: string;
  category: StopCategory;
  coords: { lat: number; lng: number };
  date?: string;
  blurb: string;
  link?: string;
  optional?: boolean;
}

export const CATEGORIES: Record<
  StopCategory,
  { label: string; icon: string; color: string }
> = {
  start:   { label: 'Start',          icon: 'Flag',         color: '#22c55e' },
  finish:  { label: 'Finish',         icon: 'FlagOff',      color: '#22c55e' },
  pass:    { label: 'Mountain Pass',  icon: 'Mountain',     color: '#8b5cf6' },
  cars:    { label: 'Car Meetup',     icon: 'Car',          color: '#f97316' },
  factory: { label: 'Factory Tour',   icon: 'Factory',      color: '#ef4444' },
  track:   { label: 'Track Day',      icon: 'Timer',        color: '#dc2626' },
  sea:     { label: 'Sea & Sun',      icon: 'Waves',        color: '#06b6d4' },
  city:    { label: 'City',           icon: 'Building2',    color: '#3b82f6' },
  science: { label: 'Science',        icon: 'Atom',         color: '#6366f1' },
  museum:  { label: 'Museum',         icon: 'Landmark',     color: '#a855f7' },
  food:    { label: 'Food & Drink',   icon: 'Wine',         color: '#f59e0b' },
  sleep:   { label: 'Overnight',      icon: 'BedDouble',    color: '#64748b' },
};

export const STOPS: Stop[] = [
  {
    id: 'prague-start',
    name: 'Prague',
    location: 'Prague, Czech Republic',
    country: 'CZ',
    category: 'start',
    coords: { lat: 50.0755, lng: 14.4378 },
    date: 'Fri, 17 Jul 2026',
    blurb:
      'The Cicerone Rallye begins. Crews assemble, engines warm up, and the Grand Tour kicks off heading south-west into Austria.',
  },
  {
    id: 'grossglockner',
    name: 'Grossglockner Alpine Road + FAT Porsche Meetup',
    location: 'Grossglockner, Salzburgerland, Austria',
    country: 'AT',
    category: 'cars',
    coords: { lat: 47.0797, lng: 12.8375 },
    date: 'Sat, 18 Jul 2026',
    blurb:
      'Europe\'s most spectacular alpine road — and this weekend the FAT International "Mankei" gathers hundreds of Porsches at the top. We crash the party (respectfully).',
    link: 'https://fat-international.com/en/pages/mankei',
  },
  {
    id: 'stelvio',
    name: 'Stelvio Pass',
    location: 'Stelvio, South Tyrol, Italy',
    country: 'IT',
    category: 'pass',
    coords: { lat: 46.5288, lng: 10.4524 },
    date: 'Sun, 19 Jul 2026',
    blurb:
      '2,758 m above sea level, 48 hairpins on the north face. Top Gear\'s "greatest driving road in the world." We do it early morning before the coaches arrive.',
  },
  {
    id: 'bardolino',
    name: 'Museo del Vino',
    location: 'Bardolino, Verona, Italy',
    country: 'IT',
    category: 'food',
    coords: { lat: 45.5494, lng: 10.7267 },
    date: 'Sun, 19 Jul 2026',
    blurb:
      'Lake Garda in the background, Bardolino wine in the glass. A wine museum that takes us through the whole process — from vine to bottle — with generous tastings at the end.',
    link: 'https://www.museodelvinoabardolino.it/',
  },
  {
    id: 'lamborghini',
    name: 'Lamborghini Factory Tour',
    location: "Sant'Agata Bolognese, Bologna, Italy",
    country: 'IT',
    category: 'factory',
    coords: { lat: 44.6617, lng: 11.1678 },
    date: 'Mon, 20 Jul 2026',
    blurb:
      'Walk the floor where Huracáns and Uruses are hand-assembled. The museum holds prototypes, race cars, and the occasional car that "wasn\'t quite right." We appreciate the honesty.',
    link: 'https://www.lamborghini.com/en-en/museum',
  },
  {
    id: 'parmigiano',
    name: 'Museo del Parmigiano-Reggiano',
    location: 'Soragna, Parma, Italy',
    country: 'IT',
    category: 'food',
    coords: { lat: 44.9302, lng: 10.1247 },
    date: 'Mon, 20 Jul 2026',
    blurb:
      "The king of cheeses in its homeland. This museum tracks 800 years of Parmigiano-Reggiano — how it's made, aged, and why the wheels are still cracked open by hand.",
    link: 'https://www.museidelfood.it/',
  },
  {
    id: 'ferrari',
    name: 'Ferrari Museum & Factory — Maranello',
    location: 'Maranello, Modena, Italy',
    country: 'IT',
    category: 'factory',
    coords: { lat: 44.5315, lng: 10.8678 },
    date: 'Tue, 21 Jul 2026',
    blurb:
      "Formula One trophies, road car evolution, and the factory where every Ferrari is still built. The smell of the prancing horse's birthplace — something you don't forget.",
    link: 'https://www.ferrari.com/en-EN/maranello/ferrari-museum',
  },
  {
    id: 'trackday',
    name: 'Track Day',
    location: 'Autodromo Enzo e Dino Ferrari, Imola, Italy',
    country: 'IT',
    category: 'track',
    coords: { lat: 44.3439, lng: 11.7167 },
    date: 'Tue, 21 Jul 2026',
    blurb:
      'Our shitboxes take to a proper race circuit. No timekeeping, no pressure — just the experience of driving on the same asphalt where Senna and Prost traded paint.',
    optional: true,
  },
  {
    id: 'riviera',
    name: 'Ligurian Coast — Sea & Swim',
    location: 'Ligurian Riviera, Italy',
    country: 'IT',
    category: 'sea',
    coords: { lat: 44.0, lng: 8.2 },
    date: 'Wed, 22 Jul 2026',
    blurb:
      'After all the factories and mountain passes, a mandatory rest on the Mediterranean. We pick a cliff or a beach depending on car temperature and crew mood.',
    optional: true,
  },
  {
    id: 'monaco',
    name: 'Monaco',
    location: 'Monaco',
    country: 'MC',
    category: 'city',
    coords: { lat: 43.7384, lng: 7.4246 },
    date: 'Wed, 22 Jul 2026',
    blurb:
      "Drive the Monaco GP circuit on public roads. Count the Ferraris parked outside casinos. Notice that our cars are more interesting than half of them.",
  },
  {
    id: 'alpe-dhuez',
    name: "Alpe d'Huez",
    location: "Alpe d'Huez, Isère, France",
    country: 'FR',
    category: 'pass',
    coords: { lat: 45.0933, lng: 6.0707 },
    date: 'Thu, 23 Jul 2026',
    blurb:
      "21 hairpins, 13.8 km, 1071 m of climbing — the most iconic Tour de France climb. We drive up instead of cycling. We have no regrets.",
  },
  {
    id: 'cern',
    name: 'CERN — Large Hadron Collider',
    location: 'Geneva, Switzerland',
    country: 'CH',
    category: 'science',
    coords: { lat: 46.2337, lng: 6.0557 },
    date: 'Thu, 23 Jul 2026',
    blurb:
      "The world's largest machine, 27 km in circumference, buried 100 m underground. We tour the place where physicists are trying to understand the universe. Free entry.",
    link: 'https://visit.cern/',
  },
  {
    id: 'mercedes',
    name: 'Mercedes-Benz Museum',
    location: 'Stuttgart, Germany',
    country: 'DE',
    category: 'museum',
    coords: { lat: 48.7878, lng: 9.2318 },
    date: 'Fri, 24 Jul 2026',
    blurb:
      '160 vehicles over nine floors tracing 140 years of automotive history — from the Patent-Motorwagen to the SLR McLaren. One of the finest car museums on earth.',
    link: 'https://www.mercedes-benz.com/en/brand/mercedes-benz-museum/',
  },
  {
    id: 'sinsheim',
    name: 'Technik Museum Sinsheim — Concorde',
    location: 'Sinsheim, Baden-Württemberg, Germany',
    country: 'DE',
    category: 'museum',
    coords: { lat: 49.2502, lng: 8.8842 },
    date: 'Fri, 24 Jul 2026',
    blurb:
      'Two Concordes (Air France F-BVFB and Aérospatiale F-WTSA) sit on the roof. Inside: Formula 1, WWII aircraft, rockets, and a working steam locomotive. Maximum density of interesting things.',
    link: 'https://www.technik-museum.de/en/sinsheim/',
  },
  {
    id: 'prague-finish',
    name: 'Prague — Finish',
    location: 'Prague, Czech Republic',
    country: 'CZ',
    category: 'finish',
    coords: { lat: 50.0755, lng: 14.4378 },
    date: 'Sat, 25 Jul 2026',
    blurb:
      'The Grand Tour ends where it began. Cars limp home, stories are told, and plans are quietly made for Edition 3.',
  },
];
