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
  | 'car-museum'
  | 'tech-museum'
  | 'culture'
  | 'food'
  | 'sleep'
  | 'sport';

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
  /** Overrides the "Rest day" label in the daily distance table for
   *  zero-drive days that aren't actually a rest (e.g. a spectating day). */
  restDayLabel?: string;
}

export const CATEGORIES: Record<
  StopCategory,
  { label: string; icon: string; color: string }
> = {
  start:       { label: 'Start',          icon: 'Flag',         color: '#22c55e' },
  finish:      { label: 'Finish',         icon: 'FlagOff',      color: '#22c55e' },
  pass:        { label: 'Driving Road',   icon: 'Route',        color: '#8b5cf6' },
  cars:        { label: 'Car Meetup',     icon: 'Car',          color: '#f97316' },
  factory:     { label: 'Factory Tour',   icon: 'Factory',      color: '#ef4444' },
  track:       { label: 'Track Day',      icon: 'Gauge',        color: '#dc2626' },
  sea:         { label: 'Sea & Sun',      icon: 'Waves',        color: '#06b6d4' },
  city:        { label: 'City',           icon: 'Building2',    color: '#3b82f6' },
  science:     { label: 'Science',        icon: 'Atom',         color: '#6366f1' },
  'car-museum':  { label: 'Car Museum',      icon: 'CarFront',    color: '#14b8a6' },
  'tech-museum': { label: 'Tech Museum',     icon: 'Rocket',      color: '#0ea5e9' },
  culture:       { label: 'Film & History',  icon: 'Clapperboard', color: '#d946ef' },
  food:        { label: 'Food & Drink',   icon: 'Wine',         color: '#f59e0b' },
  sleep:       { label: 'Overnight',      icon: 'BedDouble',    color: '#64748b' },
  sport:       { label: 'Sport Event',    icon: 'Trophy',       color: '#eab308' },
};

export const STOPS: Stop[] = [
  {
    id: 'prague-start',
    name: 'Prague - Start',
    location: 'Sokolovská, Prague, Czech Republic',
    country: 'CZ',
    category: 'start',
    coords: { lat: 50.110124, lng: 14.497942 },
    date: 'Sat, 18 Jul 2026',
    time: '07:30',
    blurb:
      'The Cicerone Rallye begins. Crews assemble, engines warm up, and the route kicks off heading south-west into Austria.',
  },
  {
    id: 'hangar-7',
    name: 'Red Bull Hangar-7',
    location: 'Salzburg, Austria',
    country: 'AT',
    category: 'tech-museum',
    coords: { lat: 47.7935315, lng: 13.0077824 },
    date: 'Sat, 18 Jul 2026',
    time: '13:00',
    blurb:
      'A glass-and-steel hangar in Salzburg housing Red Bull\'s collection of historic aircraft and Formula 1 cars, with a restaurant and lounge under one curved roof. A scenic detour on the way to Grossglockner.',
    link: 'https://www.hangar-7.com/en',
    driveFromPrevious: { distanceKm: 388.0, durationMin: 266 },
  },
  {
    id: 'grossglockner',
    name: 'Grossglockner Alpine Road + FAT Porsche Meetup',
    location: 'Grossglockner, Salzburgerland, Austria',
    country: 'AT',
    category: 'cars',
    coords: { lat: 47.112985, lng: 12.830887 },
    date: 'Sat, 18 Jul 2026',
    time: '15:30',
    blurb:
      'Europe\'s most spectacular alpine road - and this weekend the FAT International "Mankei" gathers hundreds of Porsches at the top. We crash the party (respectfully).',
    link: 'https://fat-international.com/en/pages/mankei',
    driveFromPrevious: { distanceKm: 122.3, durationMin: 109 },
  },
  {
    id: 'staller-sattel',
    name: 'Staller Sattel + Gasthaus Obersee',
    location: 'St. Jakob in Defereggen, Tyrol, Austria',
    country: 'AT',
    category: 'pass',
    coords: { lat: 46.8911868, lng: 12.2046279 },
    date: 'Sat, 18 Jul 2026',
    time: '17:30',
    blurb:
      'A high, narrow border crossing (2,052 m) between the Defereggental in Osttirol and the Antholzertal in South Tyrol - fewer hairpins than the big-name passes, but a proper mountain crossing all the same. Dinner stop at Gasthaus Obersee by the lake before the final push to Huben.',
    driveFromPrevious: { distanceKm: 112.3, durationMin: 117 },
  },
  {
    id: 'huben',
    name: 'Huben 120 - Overnight',
    location: 'Huben 120, Tyrol, Austria',
    country: 'AT',
    category: 'sleep',
    coords: { lat: 47.0410251, lng: 10.9741592 },
    date: 'Sat, 18 Jul 2026',
    time: '23:00',
    blurb:
      "First night's camp in Huben, Tyrol. Cars cool down, boots come off, day one is in the books. Leave by 08:30 on Sunday, first stop Passo del Rombo before continuing to the Stelvio Pass.",
    driveFromPrevious: { distanceKm: 208.1, durationMin: 189 },
  },
  {
    id: 'passo-rombo',
    name: 'Passo del Rombo (Timmelsjoch)',
    location: 'Timmelsjoch, South Tyrol, Italy',
    country: 'IT',
    category: 'pass',
    coords: { lat: 46.9051198, lng: 11.0973166 },
    date: 'Sun, 19 Jul 2026',
    time: '09:15',
    blurb:
      "One of the highest paved border crossings in the Alps (2,509 m), linking Austria's Ötztal with South Tyrol's Passeiertal. A quick photo stop at the Timmelsjoch Experience pass museum before dropping down toward the Stelvio.",
    link: 'https://www.timmelsjoch.com/en/',
    driveFromPrevious: { distanceKm: 33.2, durationMin: 41 },
  },
  {
    id: 'stelvio',
    name: 'Stelvio Pass',
    location: 'Stelvio, South Tyrol, Italy',
    country: 'IT',
    category: 'pass',
    coords: { lat: 46.527266, lng: 10.452183 },
    date: 'Sun, 19 Jul 2026',
    time: '11:50',
    blurb:
      '2,758 m above sea level, 48 numbered hairpins on the Prato allo Stelvio ascent - Top Gear\'s "greatest driving road in the world." Coming down from the Passo del Rombo, we take on the climb, then cross straight over to the Bormio side for the descent.',
    driveFromPrevious: { distanceKm: 125.0, durationMin: 158 },
  },
  {
    id: 'gavia',
    name: 'Passo di Gavia (via Bormio)',
    location: 'Passo di Gavia, Lombardy, Italy',
    country: 'IT',
    category: 'pass',
    coords: { lat: 46.343491, lng: 10.484626 },
    date: 'Sun, 19 Jul 2026',
    time: '12:55',
    blurb:
      'Down the Stelvio\'s Bormio side (34 more hairpins, wider and faster than the morning\'s climb), then straight up one of the narrowest, most exposed passes in the Alps. Two legendary climbs before lunch.',
    driveFromPrevious: { distanceKm: 47.4, durationMin: 66 },
  },
  {
    id: 'speck',
    name: 'Il Maso dello Speck',
    location: 'Val Venosta area, South Tyrol, Italy',
    country: 'IT',
    category: 'food',
    coords: { lat: 46.066302, lng: 11.122535 },
    date: 'Sun, 19 Jul 2026',
    time: '15:05',
    blurb:
      'South Tyrolean speck straight from the smokehouse - cured ham with an Alpine twist, paired with local bread and something cold to drink.',
    driveFromPrevious: { distanceKm: 112, durationMin: 131 },
  },
  {
    id: 'overnight-modena',
    name: 'Overnight - Modena (Piazza Grande)',
    location: 'Piazza Grande, Modena, Italy',
    country: 'IT',
    category: 'sleep',
    coords: { lat: 44.6459588, lng: 10.9259916 },
    date: 'Sun, 19 Jul 2026',
    time: '22:30',
    blurb:
      "Second night's camp right on Piazza Grande in Modena, under the shadow of the Duomo. A long day of Alpine passes meant a late arrival, but a great base for tomorrow's supercar factories.",
    driveFromPrevious: { distanceKm: 188.4, durationMin: 130 },
  },
  {
    id: 'ferrari',
    name: 'Ferrari Museum & Factory - Maranello',
    location: 'Maranello, Modena, Italy',
    country: 'IT',
    category: 'factory',
    coords: { lat: 44.529792, lng: 10.861412 },
    date: 'Mon, 20 Jul 2026',
    time: '10:15',
    blurb:
      "Formula One trophies, road car evolution, and the factory where every Ferrari is still built. The smell of the prancing horse's birthplace - something you don't forget.",
    link: 'https://www.ferrari.com/en-EN/maranello/ferrari-museum',
    driveFromPrevious: { distanceKm: 22.3, durationMin: 31 },
  },
  {
    id: 'lunch',
    name: 'Ristorante Cavallino',
    location: 'Maranello, Modena, Italy',
    country: 'IT',
    category: 'food',
    coords: { lat: 44.5325578, lng: 10.8637456 },
    date: 'Mon, 20 Jul 2026',
    time: '12:00',
    blurb:
      "Lunch right across from the Ferrari factory gate - the historic canteen where Enzo Ferrari and his drivers used to eat. Then it's off to San Cesario for a hypercar detour before Sant'Agata.",
    driveFromPrevious: { distanceKm: 0.4, durationMin: 2 },
  },
  {
    id: 'pagani',
    name: 'Museo Horacio Pagani',
    location: 'San Cesario sul Panaro, Modena, Italy',
    country: 'IT',
    category: 'factory',
    coords: { lat: 44.5889079, lng: 11.024146 },
    date: 'Mon, 20 Jul 2026',
    time: '13:30',
    blurb:
      "Museum and atelier at the Pagani factory - Zonda and Huayra hypercars up close, plus the story of Horacio Pagani's carbon-fibre obsession. A quick detour on the way to Sant'Agata.",
    link: 'https://www.pagani.com/pagani-museo-e-atelier/',
    driveFromPrevious: { distanceKm: 23.4, durationMin: 28 },
  },
  {
    id: 'lamborghini',
    name: 'Lamborghini Factory Tour',
    location: "Sant'Agata Bolognese, Bologna, Italy",
    country: 'IT',
    category: 'factory',
    coords: { lat: 44.657641, lng: 11.123959 },
    date: 'Mon, 20 Jul 2026',
    time: '14:45',
    blurb:
      'Walk the floor where Huracáns and Uruses are hand-assembled. The museum holds prototypes, race cars, and the occasional car that "wasn\'t quite right." We appreciate the honesty. Booked tour slot - be on time.',
    link: 'https://www.lamborghini.com/en-en/museum',
    driveFromPrevious: { distanceKm: 16.9, durationMin: 19 },
  },
  {
    id: 'winery',
    name: 'Terre Rosse Vallania',
    location: 'Zola Predosa, Bologna, Italy',
    country: 'IT',
    category: 'food',
    coords: { lat: 44.4825824, lng: 11.2086453 },
    date: 'Mon, 20 Jul 2026',
    time: '16:45',
    blurb:
      "A historic Colli Bolognesi estate running since the 1960s - Pignoletto, Sauvignon and Cabernet on a guided tasting paired with local food.",
    link: 'https://vignetoterrerosse.com/en/tastings-and-wine-tourism/',
    driveFromPrevious: { distanceKm: 28.6, durationMin: 33 },
  },
  {
    id: 'overnight-bologna',
    name: 'Overnight - Bologna',
    location: 'Viale Giambattista Ercolani, 5, Bologna, Italy',
    country: 'IT',
    category: 'sleep',
    coords: { lat: 44.4925186, lng: 11.3567354 },
    date: 'Mon, 20 Jul 2026',
    time: '20:00',
    blurb:
      "Third night's camp near Porta San Vitale, a short walk from Bologna's historic centre and the university quarter.",
    driveFromPrevious: { distanceKm: 21.3, durationMin: 31 },
  },
  {
    id: 'balsamic',
    name: 'Acetaia Giusti - Since 1605',
    location: 'Strada delle Quattro Ville, 52, Modena, Italy',
    country: 'IT',
    category: 'food',
    coords: { lat: 44.6906038, lng: 10.9005435 },
    date: 'Tue, 21 Jul 2026',
    time: '10:45',
    blurb:
      'The oldest balsamic vinegar house in Modena, still run by the Giusti family in its 17th generation. A free guided tour through the museum and ageing rooms, then a tasting flight that ranges from everyday drizzle to vinegar older than some countries.',
    link: 'https://giusti.com/pages/casa-giusti',
    driveFromPrevious: { distanceKm: 60.3, durationMin: 50 },
  },
  {
    id: 'agrinascente',
    name: 'Silvano Romani | Agrinascente',
    location: 'Via Federico Fellini, 22/b, 43036 Fidenza PR, Italy',
    country: 'IT',
    category: 'food',
    coords: { lat: 44.8845354, lng: 10.0861353 },
    date: 'Tue, 21 Jul 2026',
    time: '15:00',
    blurb:
      "Skipped the Parmigiano and prosciutto museums and went straight for the good stuff instead - a proper deli right off the A1 at Fidenza, stocked with Parmigiano-Reggiano, Prosciutto di Parma, Culatello di Zibello and more. Stocked up on both.",
    link: 'https://agrinascente.it/',
    driveFromPrevious: { distanceKm: 72.0, durationMin: 48 },
  },
  {
    id: 'trackday',
    name: 'Motodromo Castelletto di Branduzzo',
    location: 'Castelletto di Branduzzo, Pavia, Italy',
    country: 'IT',
    category: 'track',
    coords: { lat: 45.07129, lng: 9.103941 },
    date: 'Tue, 21 Jul 2026',
    time: '17:45',
    blurb:
      'Our cars get a proper race circuit for an afternoon. No timekeeping, no pressure - just seat time on real asphalt.',
    optional: true,
    driveFromPrevious: { distanceKm: 99.7, durationMin: 75 },
  },
  {
    id: 'overnight-genoa',
    name: 'Overnight - Genoa area',
    location: 'Genoa area, Italy',
    country: 'IT',
    category: 'sleep',
    coords: { lat: 44.504682, lng: 8.923697 },
    date: 'Tue, 21 Jul 2026',
    time: '20:00',
    blurb: 'Fourth night\'s camp, exact hotel/spot not booked yet.',
    driveFromPrevious: { distanceKm: 94.6, durationMin: 76 },
  },
  {
    id: 'chocolate',
    name: 'Fabbrica di Cioccolato Viganotti',
    location: 'Genoa, Italy',
    country: 'IT',
    category: 'food',
    coords: { lat: 44.406117, lng: 8.933043 },
    date: 'Wed, 22 Jul 2026',
    time: '08:15',
    blurb:
      "A historic chocolate workshop in Genoa's old town, still hand-crafting bars and pralines the way they did generations ago.",
    driveFromPrevious: { distanceKm: 18.4, durationMin: 22 },
  },
  {
    id: 'pesto',
    name: "Il Pesto di Pra' di Bruzzone e Ferrari",
    location: "Pra', Genoa, Italy",
    country: 'IT',
    category: 'food',
    coords: { lat: 44.430011, lng: 8.782949 },
    date: 'Wed, 22 Jul 2026',
    time: '09:45',
    blurb:
      'The birthplace of pesto alla genovese. Basil, pine nuts, and a mortar and pestle - the real deal, no blender allowed.',
    driveFromPrevious: { distanceKm: 17.4, durationMin: 24 },
  },
  {
    id: 'baia-dei-saraceni',
    name: 'Baia dei Saraceni - Semaforo Capo Noli',
    location: 'Capo Noli, Savona, Italy',
    country: 'IT',
    category: 'sea',
    coords: { lat: 44.189544, lng: 8.407462 },
    date: 'Wed, 22 Jul 2026',
    time: '11:30',
    blurb:
      'A hidden cove below the Capo Noli lighthouse on the Ligurian coast - a quick swim stop before the olive groves and the drive to Monaco.',
    driveFromPrevious: { distanceKm: 53.1, durationMin: 47 },
  },
  {
    id: 'olive-oil',
    name: 'Sommariva Tradizione Agricola',
    location: 'Imperia, Liguria, Italy',
    country: 'IT',
    category: 'food',
    coords: { lat: 44.050271, lng: 8.211492 },
    date: 'Wed, 22 Jul 2026',
    time: '14:15',
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
    time: '16:30',
    blurb:
      "Drive the Monaco GP circuit on public roads. Count the Ferraris parked outside casinos. Notice that our cars are more interesting than half of them.",
    driveFromPrevious: { distanceKm: 100.5, durationMin: 80 },
  },
  {
    id: 'saint-tropez-overnight',
    name: 'Saint-Tropez - Overnight',
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
    name: 'Musée de la Gendarmerie et du Cinéma',
    location: '2 Place Blanqui, Saint-Tropez, Var, France',
    country: 'FR',
    category: 'culture',
    coords: { lat: 43.2694, lng: 6.6356 },
    date: 'Thu, 23 Jul 2026',
    time: '09:30',
    blurb:
      "Housed in the old gendarmerie made famous by Louis de Funès' Gendarme de Saint-Tropez films, this quirky museum blends real police history with movie memorabilia - a fun, offbeat stop before the coastal roads pull us back inland.",
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
      'Base camp in the French Alps, at the foot of the legendary Alpe d\'Huez climb, for two nights.',
    driveFromPrevious: { distanceKm: 376.0, durationMin: 314 },
  },
  {
    id: 'alpe-dhuez-tdf',
    name: 'Alpe d\'Huez - Tour de France Stage 19 Finish',
    location: 'Alpe d\'Huez, Isère, France',
    country: 'FR',
    category: 'sport',
    coords: { lat: 45.0918, lng: 6.06972 },
    date: 'Fri, 24 Jul 2026',
    time: '16:30',
    blurb:
      'No driving today. Gondolas up from Allemond for a morning hike in the high mountains, then over to Alpe d\'Huez to watch the actual Tour de France Stage 19 finish live, one of the legendary hairpin climbs. Gondolas back down to Allemond in the evening, cars parked the whole time.',
    driveFromPrevious: { distanceKm: 0, durationMin: 0 },
    restDayLabel: 'Tour de France day',
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
    blurb: 'Back at base after the Tour de France, cars right where we left them.',
    driveFromPrevious: { distanceKm: 0, durationMin: 0 },
  },
  {
    id: 'cern',
    name: 'CERN - Large Hadron Collider',
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
    time: '17:30',
    blurb:
      'One of the great Swiss Alpine passes - hairpins, glacier views, and a starring role in the Bond film Goldfinger.',
    driveFromPrevious: { distanceKm: 273.7, durationMin: 216 },
  },
  {
    id: 'overnight-central-switzerland',
    name: 'Overnight - Central Switzerland',
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
    category: 'car-museum',
    coords: { lat: 48.788201, lng: 9.233992 },
    date: 'Sun, 26 Jul 2026',
    time: '11:30',
    blurb:
      '160 vehicles over nine floors tracing 140 years of automotive history - from the Patent-Motorwagen to the SLR McLaren. One of the finest car museums on earth.',
    link: 'https://www.mercedes-benz.com/en/brand/mercedes-benz-museum/',
    driveFromPrevious: { distanceKm: 249.4, durationMin: 214 },
  },
  {
    id: 'sinsheim',
    name: 'Technik Museum Sinsheim - Concorde',
    location: 'Sinsheim, Baden-Württemberg, Germany',
    country: 'DE',
    category: 'tech-museum',
    coords: { lat: 49.238345, lng: 8.897235 },
    date: 'Sun, 26 Jul 2026',
    time: '15:45',
    blurb:
      'Two Concordes sit on the roof. Inside: Formula 1, WWII aircraft, rockets, and a working steam locomotive. Maximum density of interesting things.',
    link: 'https://www.technik-museum.de/en/sinsheim/',
    driveFromPrevious: { distanceKm: 85.7, durationMin: 71 },
  },
  {
    id: 'prague-finish',
    name: 'Prague - Finish',
    location: 'Sokolovská, Prague, Czech Republic',
    country: 'CZ',
    category: 'finish',
    coords: { lat: 50.110124, lng: 14.497942 },
    date: 'Sun, 26 Jul 2026',
    time: '23:30',
    blurb:
      'The rallye ends where it began - a long final day\'s drive from Sinsheim, straight through to Prague. Cars limp home, stories are told, and plans are quietly made for next year.',
    driveFromPrevious: { distanceKm: 430, durationMin: 464, estimated: true },
  },
];
