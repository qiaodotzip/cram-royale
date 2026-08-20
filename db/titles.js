// Gambling-themed titles you buy with currency earned from winning gambles.
export const TITLES = [
  { id: 'lucky',      name: 'LUCKY',        price: 60,   blurb: 'variance is your co-pilot.' },
  { id: 'degen',      name: 'DEGENERATE',   price: 100,  blurb: 'one more question, bro.' },
  { id: 'allin',      name: 'ALL IN',       price: 150,  blurb: 'no such thing as too much.' },
  { id: 'snakeeyes',  name: 'SNAKE EYES',   price: 180,  blurb: 'double or nothing.' },
  { id: 'counter',    name: 'CARD COUNTER', price: 240,  blurb: "you've seen the deck." },
  { id: 'highroller', name: 'HIGH ROLLER',  price: 350,  blurb: 'the minimums bore you.' },
  { id: 'bookie',     name: 'THE BOOKIE',   price: 500,  blurb: 'you set the lines now.' },
  { id: 'whale',      name: 'WHALE',        price: 750,  blurb: 'the casino sends a car.' },
  { id: 'house',      name: 'THE HOUSE',    price: 1000, blurb: 'you always win.' },
  { id: 'mademan',    name: 'MADE MAN',     price: 1500, blurb: 'untouchable.' },
];

export const TITLE_MAP = Object.fromEntries(TITLES.map((t) => [t.id, t]));
export const titleName = (id) => TITLE_MAP[id]?.name || null;
