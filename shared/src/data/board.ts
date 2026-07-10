import { Space, GroupKey } from "../types";

// Colour-group -> hex (UI hint, also exported for the client)
export const GROUP_COLORS: Record<GroupKey, string> = {
  brown: "#A26F44",
  cyan: "#3E7D8C",
  pink: "#C46E7A",
  orange: "#C97A2B",
  red: "#9E2A2F",
  yellow: "#C9A24B",
  green: "#3E6B45",
  darkblue: "#2A3B6B",
};

// Colour-group -> Naadu (frontier region) name
export const NAADU: Record<GroupKey, string> = {
  brown: "Sabbinadu",
  cyan: "Karmaraashtra",
  pink: "Andhrapatha",
  orange: "Andhraka",
  red: "Sriparvata",
  yellow: "Kalinga Coast",
  green: "Velanadu",
  darkblue: "Trikalinga",
};

export const SPACES: Space[] = [
  { id: 0, t: "corner", sub: "court", name: "Royal Court", desc: "Pass to collect 200 Gold as the court rewards your circuit." },
  { id: 1, t: "prop", name: "Peddabankur", g: "brown", price: 60 },
  { id: 2, t: "festival", name: "Grama Devata", desc: "Draw a Festival of the village goddesses." },
  { id: 3, t: "prop", name: "Kondapur", g: "brown", price: 60 },
  { id: 4, t: "tax", name: "Royal Tribute", amt: 200, desc: "Pay 200 Gold to the treasury." },
  { id: 5, t: "route", name: "Dakshinapatha", g: "brown", price: 200, desc: "Trade route — own more to multiply tolls." },
  { id: 6, t: "prop", name: "Ghantasala", g: "cyan", price: 100 },
  { id: 7, t: "yagna", name: "Yagna Altar", desc: "Perform a fire ritual for blessings." },
  { id: 8, t: "prop", name: "Bhattiprolu", g: "cyan", price: 100 },
  { id: 9, t: "prop", name: "Masulipatnam", g: "cyan", price: 120 },
  { id: 10, t: "corner", sub: "exile", name: "Forest Exile", desc: "Banished to the southern forests." },
  { id: 11, t: "prop", name: "Amaravati", g: "pink", price: 140 },
  { id: 12, t: "route", name: "Silk Route East", g: "pink", price: 200 },
  { id: 13, t: "prop", name: "Dharanikota", g: "pink", price: 140 },
  { id: 14, t: "prop", name: "Jaggayyapeta", g: "pink", price: 160 },
  { id: 15, t: "festival", name: "River Festival", desc: "Draw a Festival of the great rivers." },
  { id: 16, t: "prop", name: "Vengi", g: "orange", price: 180 },
  { id: 17, t: "planet", name: "Planetary Oracle", desc: "The court astrologers read your chart." },
  { id: 18, t: "prop", name: "Indrapalaura", g: "orange", price: 180 },
  { id: 19, t: "prop", name: "Phanigiri", g: "orange", price: 200 },
  { id: 20, t: "corner", sub: "lotus", name: "Dharma Sangha", desc: "Rest among the monks. A free halt." },
  { id: 21, t: "prop", name: "Nagarjunakonda", g: "red", price: 220 },
  { id: 22, t: "weapon", name: "Weapon Hoard", desc: "Draw an astra from the arsenal." },
  { id: 23, t: "prop", name: "Vijayapuri", g: "red", price: 220 },
  { id: 24, t: "prop", name: "Srisailam", g: "red", price: 240 },
  { id: 25, t: "route", name: "Nagarjuna Marg", g: "red", price: 200 },
  { id: 26, t: "prop", name: "Salihundam", g: "yellow", price: 260 },
  { id: 27, t: "yagna", name: "Yagna Altar", desc: "Perform a fire ritual for blessings." },
  { id: 28, t: "prop", name: "Bavikonda", g: "yellow", price: 260 },
  { id: 29, t: "prop", name: "Pithapuram", g: "yellow", price: 280 },
  { id: 30, t: "corner", sub: "banish", name: "Royal Banishment", desc: "March at once to Forest Exile." },
  { id: 31, t: "prop", name: "Kotilingala", g: "green", price: 300 },
  { id: 32, t: "prop", name: "Chebrolu", g: "green", price: 300 },
  { id: 33, t: "tax", name: "Merchant Tax", amt: 100, desc: "Pay 100 Gold to the guild collectors." },
  { id: 34, t: "prop", name: "Rajamahendri", g: "green", price: 320 },
  { id: 35, t: "route", name: "Coastal Route", g: "green", price: 200 },
  { id: 36, t: "planet", name: "Planetary Oracle", desc: "Fortune or affliction turns on the sky." },
  { id: 37, t: "prop", name: "Kalingapatnam", g: "darkblue", price: 350 },
  { id: 38, t: "festival", name: "River Festival", desc: "Draw a Festival of the great rivers." },
  { id: 39, t: "prop", name: "Dantapura", g: "darkblue", price: 400 },
];

export const BOARD_SIZE = SPACES.length; // 40

/** grid placement for the 11x11 ring (row, col), 1-indexed for CSS grid */
export function gridPos(id: number): [number, number] {
  if (id === 0) return [11, 11];
  if (id === 10) return [11, 1];
  if (id === 20) return [1, 1];
  if (id === 30) return [1, 11];
  if (id < 10) return [11, 11 - id];
  if (id < 20) return [11 - (id - 10), 1];
  if (id < 30) return [1, 1 + (id - 20)];
  return [1 + (id - 30), 11];
}

export function side(id: number): "corner" | "bottom" | "left" | "top" | "right" {
  if ([0, 10, 20, 30].includes(id)) return "corner";
  if (id < 10) return "bottom";
  if (id < 20) return "left";
  if (id < 30) return "top";
  return "right";
}
