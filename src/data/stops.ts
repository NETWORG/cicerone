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

export interface DriveLeg {
  /** Driving distance from the previous stop, in kilometers. */
  distanceKm: number;
  /** Driving duration from the previous stop, in minutes. */
  durationMin: number;
  /** True when the leg's distance/duration is an estimate rather than a routed value. */
  estimated?: boolean;
}

export interface Stop {
  id: string;
  name: string;
  location: string;
  country: string;
  category: StopCategory;
  coords: { lat: number; lng: number };
  date?: string;
  /** Local arrival time at this stop, e.g. "14:27". */
  time?: string;
  blurb: string;
  link?: string;
  optional?: boolean;
  /** Drive distance/duration from the previous stop in the itinerary. */
  driveFromPrevious?: DriveLeg;
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
    name: 'Prague — Start',
    location: 'Sokolovská, Prague, Czech Republic',
    country: 'CZ',
    category: 'start',
    coords: { lat: 50.110124, lng: 14.497942 },
    date: 'Sat, 18 Jul 2026',
    time: '06:00',
    blurb:
      'The Cicerone Rallye begins. Crews assemble, engines warm up, and the route kicks off heading south-west into Austria.',
  },
  {
    id: 'grossglockner',
    name: 'Grossglockner Alpine Road + FAT Porsche Meetup',
    location: 'Grossglockner, Salzburgerland, Austria',
    country: 'AT',
    category: 'cars',
    coords: { lat: 47.112985, lng: 12.830887 },
    date: 'Sat, 18 Jul 2026',
    time: '14:27',
    blurb:
      'Europe\'s most spectacular alpine road — and this weekend the FAT International "Mankei" gathers hundreds of Porsches at the top. We crash the party (respectfully).',
    link: 'https://fat-international.com/en/pages/mankei',
    driveFromPrevious: { distanceKm: 595.7, durationMin: 507 },
  },
  {
    id: 'meranerhuette',
    name: 'Meranerhütte - Rifugio Merano',
    location: 'Meran 2000, South Tyrol, Italy',
    country: 'IT',
    category: 'sleep',
    coords: { lat: 46.683272, lng: 11.281948 },
    date: 'Sat, 18 Jul 2026',
    time: '20:55',
    blurb:
      "First night's camp, high above Merano. Cars cool down, boots come off, day one is in the books.",
    driveFromPrevious: { distanceKm: 253.5, durationMin: 269 },
  },
  {
    id: 'stelvio',
    name: 'Stelvio Pass',
    location: 'Stelvio, South Tyrol, Italy',
    country: 'IT',
    category: 'pass',
    coords: { lat: 46.527266, lng: 10.452183 },
    date: 'Sun, 19 Jul 2026',
    time: '10:11',
    blurb:
      '2,758 m above sea level, 48 hairpins on the north face. Top Gear\'s "greatest driving road in the world." We do it early morning before the coaches arrive.',
    driveFromPrevious: { distanceKm: 102.1, durationMin: 131 },
  },
  {
    id: 'speck',
    name: '[Speck] Il Maso dello Speck',
    location: 'Val Venosta area, South Tyrol, Italy',
    country: 'IT',
    category: 'food',
    coords: { lat: 46.066302, lng: 11.122535 },
    date: 'Sun, 19 Jul 2026',
    time: '13:31',
    blurb:
      'South Tyrolean speck straight from the smokehouse — cured ham with an Alpine twist, paired with local bread and something cold to drink.',
    driveFromPrevious: { distanceKm: 157.5, durationMin: 140 },
  },
  {
    id: 'overnight-trentino',
    name: 'Overnight — Trentino',
    location: 'Trentino, Italy',
    country: 'IT',
    category: 'sleep',
    coords: { lat: 45.73675, lng: 10.954811 },
    date: 'Sun, 19 Jul 2026',
    time: '14:18',
    blurb:
      "Second night's camp, exact hotel/spot not booked yet. Somewhere in Trentino to sleep off Stelvio's 48 hairpins.",
    driveFromPrevious: { distanceKm: 45.3, durationMin: 32 },
  },
  {
    id: 'lamborghini',
    name: 'Lamborghini Factory Tour',
    location: "Sant'Agata Bolognese, Bologna, Italy",
    country: 'IT',
    category: 'factory',
    coords: { lat: 44.657641, lng: 11.123959 },
    date: 'Mon, 20 Jul 2026',
    time: '09:57',
    blurb:
      'Walk the floor where Huracáns and Uruses are hand-assembled. The museum holds prototypes, race cars, and the occasional car that "wasn\'t quite right." We appreciate the honesty.',
    link: 'https://www.lamborghini.com/en-en/museum',
    driveFromPrevious: { distanceKm: 159.0, durationMin: 117 },
  },
  {
    id: 'ferrari',
    name: 'Ferrari Museum & Factory — Maranello',
    location: 'Maranello, Modena, Italy',
    country: 'IT',
    category: 'factory',
    coords: { lat: 44.529792, lng: 10.861412 },
    date: 'Mon, 20 Jul 2026',
    time: '12:45',
    blurb:
      "Formula One trophies, road car evolution, and the factory where every Ferrari is still built. The smell of the prancing horse's birthplace — something you don't forget.",
    link: 'https://www.ferrari.com/en-EN/maranello/ferrari-museum',
    driveFromPrevious: { distanceKm: 34.5, durationMin: 47 },
  },
  {
    id: 'white-wine',
    name: '[White Wine] Manaresi Agricoltura e Vini',
    location: 'Modena countryside, Italy',
    country: 'IT',
    category: 'food',
    coords: { lat: 44.491693, lng: 11.19604 },
    date: 'Mon, 20 Jul 2026',
    time: '15:19',
    blurb:
      "A hillside winery in the Modena countryside — we swap Lambrusco reds for their crisp whites for an afternoon.",
    driveFromPrevious: { distanceKm: 32.1, durationMin: 34 },
  },
  {
    id: 'pizza',
    name: '[Pizza] Pistamentuccia',
    location: 'Modena area, Italy',
    country: 'IT',
    category: 'food',
    coords: { lat: 44.498865, lng: 11.340915 },
    date: 'Mon, 20 Jul 2026',
    time: '16:39',
    blurb:
      'Proper Italian pizza break — thin crust, wood-fired, no apologies.',
    driveFromPrevious: { distanceKm: 13.8, durationMin: 19 },
  },
  {
    id: 'balsamic',
    name: '[Balsamic Vinegar] Acetaia Giusti - Since 1605',
    location: 'Modena, Italy',
    country: 'IT',
    category: 'food',
    coords: { lat: 44.683997, lng: 10.940194 },
    date: 'Mon, 20 Jul 2026',
    time: '18:30',
    blurb:
      'The oldest balsamic vinegar house in Modena, running since 1605. A tasting flight that ranges from everyday drizzle to vinegar older than some countries.',
    driveFromPrevious: { distanceKm: 55.5, durationMin: 51 },
  },
  {
    id: 'overnight-reggio-emilia',
    name: 'Overnight — Reggio Emilia area',
    location: 'Reggio Emilia area, Italy',
    country: 'IT',
    category: 'sleep',
    coords: { lat: 44.802744, lng: 10.443689 },
    date: 'Mon, 20 Jul 2026',
    time: '19:23',
    blurb: 'Third night\'s camp, exact hotel/spot not booked yet.',
    driveFromPrevious: { distanceKm: 45.9, durationMin: 33 },
  },
  {
    id: 'parmigiano',
    name: 'Museo del Parmigiano-Reggiano',
    location: 'Soragna, Parma, Italy',
    country: 'IT',
    category: 'food',
    coords: { lat: 44.927383, lng: 10.119963 },
    date: 'Tue, 21 Jul 2026',
    time: '08:28',
    blurb:
      "The king of cheeses in its homeland. This museum tracks 800 years of Parmigiano-Reggiano — how it's made, aged, and why the wheels are still cracked open by hand.",
    link: 'https://www.museidelfood.it/',
    driveFromPrevious: { distanceKm: 35.6, durationMin: 28 },
  },
  {
    id: 'prosciutto',
    name: '[Prosciutto] Museo del Prosciutto e dei Salumi di Parma',
    location: 'Langhirano, Parma, Italy',
    country: 'IT',
    category: 'food',
    coords: { lat: 44.61197, lng: 10.268382 },
    date: 'Tue, 21 Jul 2026',
    time: '10:29',
    blurb:
      'Deep in prosciutto country. The museum walks through centuries of curing tradition in the hills above Parma — then lets us taste the results.',
    driveFromPrevious: { distanceKm: 59.9, durationMin: 61 },
  },
  {
    id: 'trackday',
    name: '[Trackday] Motodromo Castelletto di Branduzzo',
    location: 'Castelletto di Branduzzo, Pavia, Italy',
    country: 'IT',
    category: 'track',
    coords: { lat: 45.07129, lng: 9.103941 },
    date: 'Tue, 21 Jul 2026',
    time: '13:27',
    blurb:
      'Our shitboxes take to a proper race circuit. No timekeeping, no pressure — just seat time on real asphalt.',
    optional: true,
    driveFromPrevious: { distanceKm: 146.0, durationMin: 118 },
  },
  {
    id: 'overnight-genoa',
    name: 'Overnight — Genoa area',
    location: 'Genoa area, Italy',
    country: 'IT',
    category: 'sleep',
    coords: { lat: 44.504682, lng: 8.923697 },
    date: 'Tue, 21 Jul 2026',
    time: '15:44',
    blurb: 'Fourth night\'s camp, exact hotel/spot not booked yet.',
    driveFromPrevious: { distanceKm: 94.6, durationMin: 76 },
  },
  {
    id: 'chocolate',
    name: '[Chocolate] Fabbrica di Cioccolato Viganotti',
    location: 'Genoa, Italy',
    country: 'IT',
    category: 'food',
    coords: { lat: 44.406117, lng: 8.933043 },
    date: 'Wed, 22 Jul 2026',
    time: '08:22',
    blurb:
      "A historic chocolate workshop in Genoa's old town, still hand-crafting bars and pralines the way they did generations ago.",
    driveFromPrevious: { distanceKm: 18.4, durationMin: 22 },
  },
  {
    id: 'pesto',
    name: "[Pesto] Il Pesto di Pra' di Bruzzone e Ferrari",
    location: "Pra', Genoa, Italy",
    country: 'IT',
    category: 'food',
    coords: { lat: 44.430011, lng: 8.782949 },
    date: 'Wed, 22 Jul 2026',
    time: '09:46',
    blurb:
      'The birthplace of pesto alla genovese. Basil, pine nuts, and a mortar and pestle — the real deal, no blender allowed.',
    driveFromPrevious: { distanceKm: 17.4, durationMin: 24 },
  },
  {
    id: 'baia-dei-saraceni',
    name: '[Beach] Baia dei Saraceni - Semaforo Capo Noli',
    location: 'Capo Noli, Savona, Italy',
    country: 'IT',
    category: 'sea',
    coords: { lat: 44.189544, lng: 8.407462 },
    date: 'Wed, 22 Jul 2026',
    time: '11:33',
    blurb:
      'A hidden cove below the Capo Noli lighthouse on the Ligurian coast — a quick swim stop before the olive groves and the drive to Monaco.',
    driveFromPrevious: { distanceKm: 53.1, durationMin: 47 },
  },
  {
    id: 'olive-oil',
    name: '[Olive Oil] Sommariva Tradizione Agricola',
    location: 'Imperia, Liguria, Italy',
    country: 'IT',
    category: 'food',
    coords: { lat: 44.050271, lng: 8.211492 },
    date: 'Wed, 22 Jul 2026',
    time: '14:08',
    blurb:
      "Liguria's olive groves produce some of Italy's finest oil. A tasting among the trees before we cross into France.",
    driveFromPrevious: { distanceKm: 33.1, durationMin: 35 },
  },
  {
    id: 'monaco',
    name: 'Monaco',
    location: 'Monaco',
    country: 'MC',
    category: 'city',
    coords: { lat: 43.73141, lng: 7.41903 },
    date: 'Wed, 22 Jul 2026',
    time: '16:27',
    blurb:
      "Drive the Monaco GP circuit on public roads. Count the Ferraris parked outside casinos. Notice that our cars are more interesting than half of them.",
    driveFromPrevious: { distanceKm: 100.5, durationMin: 80 },
  },
  {
    id: 'saint-tropez-overnight',
    name: 'Saint-Tropez — Overnight',
    location: 'Saint-Tropez area, Var, France',
    country: 'FR',
    category: 'sleep',
    coords: { lat: 43.270873, lng: 6.636532 },
    date: 'Wed, 22 Jul 2026',
    time: '20:00',
    blurb: 'First night on the Côte d\'Azur. Camp/hotel details still being finalized for this stretch.',
    driveFromPrevious: { distanceKm: 133.4, durationMin: 111 },
  },
  {
    id: 'saint-tropez',
    name: 'Saint-Tropez',
    location: 'Saint-Tropez, Var, France',
    country: 'FR',
    category: 'sea',
    coords: { lat: 43.270873, lng: 6.636532 },
    date: 'Thu, 23 Jul 2026',
    time: '09:26',
    blurb:
      'Sun, yachts, and impossibly narrow streets. A morning to explore Saint-Tropez before the coastal roads pull us back inland.',
    driveFromPrevious: { distanceKm: 0, durationMin: 0 },
  },
  {
    id: 'allemond-1',
    name: 'Allemond (Night 1/2)',
    location: 'Allemond, Isère, France',
    country: 'FR',
    category: 'sleep',
    coords: { lat: 45.13235, lng: 6.033781 },
    date: 'Thu, 23 Jul 2026',
    time: '22:00',
    blurb:
      'Base camp in the French Alps, at the foot of the legendary Alpe d\'Huez climb, for a two-night rest.',
    driveFromPrevious: { distanceKm: 376.0, durationMin: 314 },
  },
  {
    id: 'allemond-2',
    name: 'Allemond (Night 2/2)',
    location: 'Allemond, Isère, France',
    country: 'FR',
    category: 'sleep',
    coords: { lat: 45.13235, lng: 6.033781 },
    date: 'Fri, 24 Jul 2026',
    time: '17:00',
    blurb: 'A full rest day before the final stretch toward Geneva.',
    driveFromPrevious: { distanceKm: 0, durationMin: 0 },
  },
  {
    id: 'cern',
    name: 'CERN — Large Hadron Collider',
    location: 'Geneva, Switzerland',
    country: 'CH',
    category: 'science',
    coords: { lat: 46.233448, lng: 6.055549 },
    date: 'Sat, 25 Jul 2026',
    time: '10:00',
    blurb:
      "The world's largest machine, 27 km in circumference, buried 100 m underground. We tour the place where physicists are trying to understand the universe. Free entry.",
    link: 'https://visit.cern/',
    driveFromPrevious: { distanceKm: 195.9, durationMin: 155 },
  },
  {
    id: 'furka',
    name: 'Furka Passhöhe',
    location: 'Furka Pass, Switzerland',
    country: 'CH',
    category: 'pass',
    coords: { lat: 46.572905, lng: 8.415352 },
    date: 'Sat, 25 Jul 2026',
    time: '17:32',
    blurb:
      'One of the great Swiss Alpine passes — hairpins, glacier views, and a starring role in the Bond film Goldfinger.',
    driveFromPrevious: { distanceKm: 273.7, durationMin: 216 },
  },
  {
    id: 'overnight-central-switzerland',
    name: 'Overnight — Central Switzerland',
    location: 'Central Switzerland, near Lucerne',
    country: 'CH',
    category: 'sleep',
    coords: { lat: 47.196677, lng: 8.45605 },
    date: 'Sat, 25 Jul 2026',
    time: '20:00',
    blurb: 'Fifth night\'s camp, exact hotel/spot not booked yet.',
    driveFromPrevious: { distanceKm: 101.4, durationMin: 87 },
  },
  {
    id: 'mercedes',
    name: 'Mercedes-Benz Museum',
    location: 'Stuttgart, Germany',
    country: 'DE',
    category: 'museum',
    coords: { lat: 48.788201, lng: 9.233992 },
    date: 'Sun, 26 Jul 2026',
    time: '11:34',
    blurb:
      '160 vehicles over nine floors tracing 140 years of automotive history — from the Patent-Motorwagen to the SLR McLaren. One of the finest car museums on earth.',
    link: 'https://www.mercedes-benz.com/en/brand/mercedes-benz-museum/',
    driveFromPrevious: { distanceKm: 249.4, durationMin: 214 },
  },
  {
    id: 'sinsheim',
    name: 'Technik Museum Sinsheim — Concorde',
    location: 'Sinsheim, Baden-Württemberg, Germany',
    country: 'DE',
    category: 'museum',
    coords: { lat: 49.238345, lng: 8.897235 },
    date: 'Sun, 26 Jul 2026',
    time: '15:46',
    blurb:
      'Two Concordes sit on the roof. Inside: Formula 1, WWII aircraft, rockets, and a working steam locomotive. Maximum density of interesting things.',
    link: 'https://www.technik-museum.de/en/sinsheim/',
    driveFromPrevious: { distanceKm: 85.7, durationMin: 71 },
  },
  {
    id: 'prague-finish',
    name: 'Prague — Finish',
    location: 'Sokolovská, Prague, Czech Republic',
    country: 'CZ',
    category: 'finish',
    coords: { lat: 50.110124, lng: 14.497942 },
    date: 'Sun, 26 Jul 2026',
    time: '20:00',
    blurb:
      'The rallye ends where it began — a long final day\'s drive from Sinsheim, straight through to Prague. Cars limp home, stories are told, and plans are quietly made for next year.',
    driveFromPrevious: { distanceKm: 430, durationMin: 255, estimated: true },
  },
];
