export interface Crew {
  id: string;
  name: string;
  members: string;
  car: string;
  carYear?: number;
  carNote?: string;
  confirmed: boolean;
  brandLogo?: string;
}

export const CREWS: Crew[] = [
  {
    id: 'crew-e30-polaris',
    name: 'Team Polaris',
    members: 'prokop_adam & prokop_tomas',
    car: 'E30 Polaris',
    confirmed: true,
    brandLogo: 'bmw',
  },
  {
    id: 'crew-megane',
    name: 'Team Megane',
    members: 'honzakostejn, martinrehak, zdeneksrejber & pavlicekondrej',
    car: 'Megane',
    confirmed: true,
    brandLogo: 'renault',
  },
  {
    id: 'crew-eos',
    name: 'Team Eos',
    members: 'Crmax & Vnown',
    car: 'Eos',
    confirmed: true,
    brandLogo: 'vw',
  },
  {
    id: 'crew-ereso',
    name: 'Team Ereso',
    members: 'gump_lord & sam.handl',
    car: 'Ereso',
    confirmed: true,
    brandLogo: 'skoda',
  },
];
