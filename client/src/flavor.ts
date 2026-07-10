// ===================================================================
// Dakshina Rajya — Roleplaying flavor text
// ===================================================================

import type { RaniArchetype } from "@dakshina/shared";

export interface CardFlavor {
  title: string;
  flavor: string;
  mechanical: string;
  color: string;
  gradient: string;
}

export const CARD_FLAVOR: Record<string, CardFlavor> = {
  festival: {
    title: "Festival of the Goddess",
    flavor:
      "Drums thunder through the village streets. Flower garlands adorn the shrine. The goddess smiles upon those who honor her — and gold flows like sacred water.",
    mechanical: "Receive 50 Gold and +1 Grain from the harvest celebrations.",
    color: "#E6510E",
    gradient: "linear-gradient(135deg, #7B2D00 0%, #C94A0A 50%, #E6510E 100%)",
  },
  yagna: {
    title: "Yagna Altar — Sacred Fire",
    flavor:
      "The sacred flames leap skyward. Brahmin priests intone the ancient verses. Agni himself witnesses your vow — and the heavens record your merit.",
    mechanical: "+1 Merit. Your name is inscribed in the chronicles of dharma.",
    color: "#C9882A",
    gradient: "linear-gradient(135deg, #5C3A00 0%, #9E6010 50%, #C9882A 100%)",
  },
  planet: {
    title: "Planetary Oracle",
    flavor:
      "The court astrologer gazes into the heavens. Saturn, Jupiter, Rahu… the celestial spheres turn. Fortune and ruin alike descend from the sky.",
    mechanical: "The Oracle rolls the celestial dice — gold gained or lost.",
    color: "#4A3B8C",
    gradient: "linear-gradient(135deg, #1A0A4A 0%, #3A2070 50%, #5B3AAF 100%)",
  },
  weapon: {
    title: "Weapon Hoard — Divine Arsenal",
    flavor:
      "The armorer pulls back the silk curtain. Khadgas gleam. Chakras hum with ancient energy. The arsenal of the Ikshvaku kings awaits your hand.",
    mechanical: "+1 Astra. A divine weapon is added to your arsenal.",
    color: "#2E6B45",
    gradient: "linear-gradient(135deg, #0A2A1A 0%, #1E5035 50%, #2E6B45 100%)",
  },
  tax: {
    title: "Royal Tribute",
    flavor:
      "The herald arrives bearing the royal seal. 'The treasury demands its due, Rani. The roads, the armies, the great works — all must be maintained.'",
    mechanical: "Pay Gold to the royal treasury.",
    color: "#9E2A2F",
    gradient: "linear-gradient(135deg, #3A0A0C 0%, #7A1A1F 50%, #9E2A2F 100%)",
  },
  court: {
    title: "Royal Court — Indrapalaura",
    flavor:
      "You complete the great circuit of the South. The court erupts in acclaim. The treasury rewards your endurance.",
    mechanical: "+200 Gold for completing the circuit.",
    color: "#B8893C",
    gradient: "linear-gradient(135deg, #4A3000 0%, #8A6020 50%, #B8893C 100%)",
  },
  exile: {
    title: "Forest Exile",
    flavor:
      "The royal herald reads the edict in a cold voice. 'You are banished to the forests of the South.' The trees close around you. But the wise know — exile ends.",
    mechanical: "Move to the Forest Exile space. Await your return.",
    color: "#3E6B45",
    gradient: "linear-gradient(135deg, #0A2A0E 0%, #1E4A25 50%, #3E6B45 100%)",
  },
  banish: {
    title: "Royal Banishment Edict",
    flavor:
      "The drumbeat stops. The court falls silent. The king's herald unfurls the palm-leaf scroll: 'By royal decree, you are hereby banished to the Forest!'",
    mechanical: "March immediately to Forest Exile.",
    color: "#6B2A2A",
    gradient: "linear-gradient(135deg, #2A0A0A 0%, #4A1515 50%, #6B2A2A 100%)",
  },
  lotus: {
    title: "Dharma Sangha — The Blessed Rest",
    flavor:
      "Monks in orange robes walk silently. A great stupa gleams in the morning light. This is a place of peace — no toll, no tribute, only stillness.",
    mechanical: "A free rest. No tolls or events.",
    color: "#2A3B6B",
    gradient: "linear-gradient(135deg, #0A0F2A 0%, #1A2550 50%, #2A3B6B 100%)",
  },
};

export const RANI_ROLEPLAY: Record<RaniArchetype, string> = {
  regent:
    "The Regent moves like a seasoned general — decisive, calculating. Every gold coin is a soldier. Every city, a stronghold.",
  matriarch:
    "The Matriarch has guided dynasties through flood and drought. Her wisdom is the soil in which kingdoms grow.",
  patron:
    "The Patron of the arts and temples builds with a deft hand. Her cities rise swiftly, her treasury wisely spent.",
  trader:
    "Where routes cross, the Trader's ears prick up. Every road is a river of gold, and she knows every ford.",
  sovereign:
    "The Sovereign rules by rightful claim alone. No banishment can break her — she is the law made flesh.",
  diplomat:
    "The Diplomat's words are worth a thousand swords. She negotiates where others fight and wins without a single arrow.",
  devi:
    "The Devi walks between worlds — worshipped by villages, feared by rival queens. The goddess herself is her ally.",
  scholar:
    "The Scholar decodes what others cannot read. Ancient scrolls, diplomatic codes, the language of stars — all yield to her.",
  war:
    "The Warlord does not negotiate. Her battle cry silences the frontier. Every conquest carves her legend deeper.",
  economy:
    "The Economist sees the kingdom as a ledger. Every grain accounted for, every tax optimized, every toll maximized.",
  naga:
    "The Naga Queen draws power from the earth's deep currents. Ancient weapons answer her call. Rivers know her name.",
  conquest:
    "The Conqueror builds an empire through sheer will. Each village brought to heel is a stone in her Mandala of dominion.",
};

/** Get the flavor entry for a space sub-type or space type */
export function getCardFlavor(spaceTypeOrSub: string): CardFlavor | null {
  return CARD_FLAVOR[spaceTypeOrSub] ?? null;
}

// How To Play slides
export interface HowToPlaySlide {
  icon: string;
  title: string;
  body: string;
}

export const HOW_TO_PLAY_SLIDES: HowToPlaySlide[] = [
  {
    icon: "🏰",
    title: "The Goal",
    body: "Rule the South! Claim cities and frontier villages to grow your kingdom. Win by collecting 10 villages (Mandala Victory) or amassing 6,000 Gold (Treasury Victory). Choose your Rani wisely — her powers shape your strategy.",
  },
  {
    icon: "🎲",
    title: "Taking Your Turn",
    body: "Each turn: Roll the dice to move your piece around the 40-space board. You will pass through ancient cities, sacred sites, and treacherous corners. When you complete the circuit, collect 200 Gold from the Royal Court.",
  },
  {
    icon: "🏙️",
    title: "Cities & Tolls",
    body: "Land on an unclaimed city and buy it on your turn. Once you own it, rivals who land there pay you a toll. Own multiple cities in the same Naadu (color group) to multiply your tolls. Trade routes double the effect.",
  },
  {
    icon: "⚔️",
    title: "Frontier — Palegallu",
    body: "The frontier holds villages guarded by local chieftains (Palegallu). Each turn you may make ONE frontier action: Negotiate (spend scholars & gold) or Conquer (spend astras). Hostile chieftains need more power to subdue. Each village won grants resources and counts toward your Mandala.",
  },
  {
    icon: "👑",
    title: "Your Rani's Powers",
    body: "Each Rani has a Passive ability (always active) and a Decree (one-per-game special action). The Regent conquers easily. The Trader earns more tolls. The Diplomat negotiates freely. Choose carefully — your Rani defines your path to victory.",
  },
  {
    icon: "🌟",
    title: "Special Spaces",
    body: "Sacred spaces change your fate! Yagna Altar grants Merit. Weapon Hoard gives an Astra weapon. Festival spaces reward Gold and Grain. The Planetary Oracle brings fortune or misfortune. Royal Banishment sends you to Forest Exile. Watch where you step!",
  },
];
