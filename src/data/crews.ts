export interface Crew {
  id: string;
  name: string;
  members: string;
  car: string;
  carYear?: number;
  carNote?: string;
  confirmed: boolean;
  brandLogo?: string;
  /** Marker/badge color for this crew's car on the map, chosen to stay
   *  visually distinct from the other crews at a glance. */
  color: string;
}

export const CREWS: Crew[] = [
  {
    id: 'crew-e30-polaris',
    name: 'Team Polaris',
    members: 'prokop_adam & prokop_tomas',
    car: 'E30 Polaris',
    confirmed: true,
    brandLogo: 'bmw',
    color: '#6b7280', // gray
  },
  {
    id: 'crew-megane',
    name: 'Team Megane',
    members: 'honzakostejn, martinrehak, zdeneksrejber & pavlicekondrej',
    car: 'Megane',
    confirmed: true,
    brandLogo: 'renault',
    color: '#1e3a8a', // dark blue
  },
  {
    id: 'crew-eos',
    name: 'Team Eos',
    members: 'Crmax & Vnown',
    car: 'Eos',
    confirmed: true,
    brandLogo: 'vw',
    color: '#0c4a6e', // navy - distinct from Megane's dark blue
  },
  {
    id: 'crew-ereso',
    name: 'Team Ereso',
    members: 'gump_lord & sam.handl',
    car: 'Ereso',
    confirmed: true,
    brandLogo: 'skoda',
    color: '#22d3ee', // neon blue
  },
];
