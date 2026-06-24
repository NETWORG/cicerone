export interface Crew {
  id: string;
  name: string;
  members: string;
  car: string;
  carYear?: number;
  carNote?: string;
  confirmed: boolean;
}

export const CREWS: Crew[] = [
  {
    id: 'crew-e30',
    name: 'Team Polaris',
    members: 'Tomas & Antonin',
    car: 'BMW E30',
    confirmed: true,
  },
  {
    id: 'crew-e30-touring',
    name: 'Team Touring',
    members: 'Adam & Zdenek',
    car: 'BMW E30 Touring',
    confirmed: true,
  },
  {
    id: 'crew-octavia',
    name: 'Team RS',
    members: 'Sam & Lukas',
    car: 'Skoda Octavia 2 RS',
    confirmed: true,
  },
  {
    id: 'crew-astra',
    name: 'Team Astra',
    members: 'Ondrej & Jan',
    car: 'Opel Astra Cabrio',
    confirmed: true,
  },
  {
    id: 'crew-cabrio',
    name: 'Team VW',
    members: 'Vladimir & Adam',
    car: 'Cabrio',
    confirmed: true,
  },
];
