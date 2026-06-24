export interface Crew {
  id: string;
  name: string;
  members: string;
  car: string;
  carYear?: number;
  carNote?: string;
  joining: string;
  confirmed: boolean;
}

export const CREWS: Crew[] = [
  {
    id: 'crew-e30',
    name: 'Team E30',
    members: 'Tomas & Antonin',
    car: 'BMW E30',
    joining: 'Full route',
    confirmed: true,
  },
  {
    id: 'crew-e30-touring',
    name: 'Team Touring',
    members: 'Adam & Zdenek',
    car: 'BMW E30 Touring',
    joining: 'Full route',
    confirmed: true,
  },
  {
    id: 'crew-octavia',
    name: 'Team RS',
    members: 'Sam & Lukas',
    car: 'Skoda Octavia 2 RS',
    joining: 'Full route',
    confirmed: true,
  },
  {
    id: 'crew-astra',
    name: 'Team Cabrio',
    members: 'Ondrej & Jan',
    car: 'Opel Astra Cabrio',
    joining: 'Full route',
    confirmed: true,
  },
  {
    id: 'crew-cabrio',
    name: 'Team VW',
    members: 'Vladimir & Adam',
    car: 'Cabrio',
    joining: 'Full route',
    confirmed: true,
  },
];
