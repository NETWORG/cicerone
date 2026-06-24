export interface Crew {
  id: string;
  name: string;
  members: string;
  car: string;
  carYear?: number;
  carNote?: string;
  joining: string; // e.g. "Full route"
  confirmed: boolean;
}

export const CREWS: Crew[] = [
  {
    id: 'crew-alpha',
    name: 'Team Prokop',
    members: 'Tomáš & Adam',
    car: 'Honda Accord',
    carYear: 1997,
    carNote: 'Veteran of two breakdowns, zero defeats',
    joining: 'Full route',
    confirmed: true,
  },
  {
    id: 'crew-beta',
    name: '?',
    members: '?',
    car: 'Your shitbox here',
    carNote: 'The more questionable, the better',
    joining: '?',
    confirmed: false,
  },
];
