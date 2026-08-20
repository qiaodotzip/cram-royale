// Gambling-themed titles you buy with currency earned from winning gambles.
export const TITLES = [
  { id: 'lucky',      name: 'HOT HAND',      price: 60,   blurb: 'the deck loves you today.' },
  { id: 'degen',      name: 'DEGEN',         price: 100,  blurb: 'one more question, bro.' },
  { id: 'allin',      name: 'ALL-IN',        price: 150,  blurb: 'chips pushed, no regrets.' },
  { id: 'snakeeyes',  name: 'SNAKE EYES',    price: 180,  blurb: 'double or nothing.' },
  { id: 'counter',    name: 'CARD SHARK',    price: 240,  blurb: "you've counted every card." },
  { id: 'highroller', name: 'HIGH ROLLER',   price: 350,  blurb: 'the minimums bore you.' },
  { id: 'bookie',     name: 'PIT BOSS',      price: 500,  blurb: 'you set the lines now.' },
  { id: 'whale',      name: 'WHALE',         price: 750,  blurb: 'the casino sends a car.' },
  { id: 'house',      name: 'THE HOUSE',     price: 1000, blurb: 'you always win.' },
  { id: 'mademan',    name: 'KINGPIN',       price: 1500, blurb: 'untouchable. you run the floor.' },
];

export const TITLE_MAP = Object.fromEntries(TITLES.map((t) => [t.id, t]));
export const titleName = (id) => TITLE_MAP[id]?.name || null;
