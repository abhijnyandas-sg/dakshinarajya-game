import { RewardEffect } from "../types";

export interface StoryChoice {
  label: string;
  /** Probability of success from 0 to 1 */
  riskChance: number;
  successText: string;
  successReward: RewardEffect[];
  failText?: string;
  failPenalty?: RewardEffect[];
}

export interface StoryEvent {
  id: string;
  title: string;
  text: string;
  choices: StoryChoice[];
}

export const EVENTS: StoryEvent[] = [
  {
    id: "e1_ascetic",
    title: "The Wandering Ascetic",
    text: "An ascetic draped in saffron robes sits beneath a banyan tree near the city gates. He offers a blessing that could clear your karmic debt, but his rituals require expensive incense.",
    choices: [
      {
        label: "Offer 50 Gold",
        riskChance: 1.0, // Guaranteed
        successText: "The ascetic blesses you, and the heavens notice.",
        successReward: [{ kind: "gold", amount: -50 }, { kind: "merit", amount: 2 }],
      },
      {
        label: "Seek a free blessing",
        riskChance: 0.3, // 30% chance of success
        successText: "Amused by your boldness, he grants a small boon.",
        successReward: [{ kind: "scholars", amount: 1 }],
        failText: "He curses your stinginess.",
        failPenalty: [{ kind: "gold", amount: -25 }],
      },
      {
        label: "Walk past",
        riskChance: 1.0,
        successText: "You ignore him and save your coin.",
        successReward: [],
      },
    ],
  },
  {
    id: "e2_smugglers",
    title: "Smuggler's Cache",
    text: "In the bustling bazaar, a cloaked merchant whispers of a hidden cache of Chola artifacts outside the city walls. Finding it will be dangerous, but lucrative.",
    choices: [
      {
        label: "Hire mercenaries (Cost: 1 Astra)",
        riskChance: 0.8, // 80% success
        successText: "Your troops secure the cache safely.",
        successReward: [{ kind: "astras", amount: -1 }, { kind: "gold", amount: 200 }],
        failText: "The mercenaries betray you and flee with the loot.",
        failPenalty: [{ kind: "astras", amount: -1 }],
      },
      {
        label: "Go personally (High Risk)",
        riskChance: 0.4,
        successText: "You bravely recover the artifacts yourself!",
        successReward: [{ kind: "gold", amount: 350 }, { kind: "merit", amount: 1 }],
        failText: "You are ambushed and robbed.",
        failPenalty: [{ kind: "gold", amount: -100 }],
      },
      {
        label: "Report them to the guards",
        riskChance: 1.0,
        successText: "The local magistrate rewards you with a small bounty.",
        successReward: [{ kind: "gold", amount: 50 }],
      },
    ],
  },
  {
    id: "e3_drought",
    title: "Famine in the Naadu",
    text: "The local granaries are empty, and the peasants are starving. The city elders beseech you for aid.",
    choices: [
      {
        label: "Donate 2 Grain",
        riskChance: 1.0,
        successText: "The people sing songs of your generosity.",
        successReward: [{ kind: "grain", amount: -2 }, { kind: "merit", amount: 2 }],
      },
      {
        label: "Sell grain at inflated prices",
        riskChance: 0.5,
        successText: "Desperate merchants pay exorbitant sums.",
        successReward: [{ kind: "grain", amount: -1 }, { kind: "gold", amount: 150 }],
        failText: "A riot breaks out, and your caravan is looted.",
        failPenalty: [{ kind: "grain", amount: -1 }, { kind: "gold", amount: -50 }],
      },
      {
        label: "Offer empty sympathies",
        riskChance: 1.0,
        successText: "You save your resources, but lose face.",
        successReward: [{ kind: "merit", amount: -1 }],
      },
    ],
  },
  {
    id: "e4_spy",
    title: "The Captured Spy",
    text: "Your guards drag a hooded figure before you. He carries encrypted scrolls bearing a rival's seal. How do you deal with him?",
    choices: [
      {
        label: "Interrogate him harshly",
        riskChance: 0.6,
        successText: "He breaks and reveals enemy troop movements.",
        successReward: [{ kind: "astras", amount: 2 }],
        failText: "He dies before revealing anything useful.",
        failPenalty: [{ kind: "merit", amount: -1 }],
      },
      {
        label: "Employ him as a double agent",
        riskChance: 0.5,
        successText: "He feeds you invaluable intelligence.",
        successReward: [{ kind: "scholars", amount: 2 }],
        failText: "He tricks you and escapes with your secrets.",
        failPenalty: [{ kind: "gold", amount: -50 }],
      },
    ],
  },
  {
    id: "e5_temple_ruin",
    title: "The Sunken Temple",
    text: "Recent floods have revealed a long-lost Pallava temple. The entrance is unstable, but gold glimmers within.",
    choices: [
      {
        label: "Send scholars to excavate safely",
        riskChance: 0.9,
        successText: "Careful excavation yields historical treasures.",
        successReward: [{ kind: "scholars", amount: -1 }, { kind: "gold", amount: 150 }, { kind: "merit", amount: 1 }],
        failText: "A collapse traps the expedition.",
        failPenalty: [{ kind: "scholars", amount: -1 }],
      },
      {
        label: "Rush in and grab what you can",
        riskChance: 0.35,
        successText: "You escape just before the ceiling caves in!",
        successReward: [{ kind: "gold", amount: 400 }],
        failText: "You are badly injured in a cave-in.",
        failPenalty: [{ kind: "gold", amount: -150 }],
      },
      {
        label: "Leave it for the monks",
        riskChance: 1.0,
        successText: "You show pious restraint.",
        successReward: [{ kind: "merit", amount: 1 }],
      },
    ],
  },
  {
    id: "e6_rebellion",
    title: "Whispers of Rebellion",
    text: "Dissidents are distributing pamphlets in the city square, urging the populace to rise against the Crown.",
    choices: [
      {
        label: "Crush them (Cost: 1 Astra)",
        riskChance: 0.85,
        successText: "The rebellion is swiftly put down. Property seized.",
        successReward: [{ kind: "astras", amount: -1 }, { kind: "gold", amount: 100 }],
        failText: "The soldiers sympathize and mutiny!",
        failPenalty: [{ kind: "astras", amount: -2 }],
      },
      {
        label: "Debate their leaders",
        riskChance: 0.5,
        successText: "Your scholars outwit them publicly, winning over the crowd.",
        successReward: [{ kind: "merit", amount: 2 }],
        failText: "You are humiliated in the debate. Unrest grows.",
        failPenalty: [{ kind: "gold", amount: -100 }],
      },
    ],
  },
  {
    id: "e7_caravan",
    title: "The Lost Caravan",
    text: "A wealthy spice caravan from the coast has lost its way in the nearby jungles. They offer a heavy purse for a royal escort.",
    choices: [
      {
        label: "Provide a full escort (Cost: 2 Astras)",
        riskChance: 0.95,
        successText: "The escort is flawless. The merchants pay handsomely.",
        successReward: [{ kind: "astras", amount: -2 }, { kind: "gold", amount: 300 }],
        failText: "Bandits overwhelm your guards.",
        failPenalty: [{ kind: "astras", amount: -2 }, { kind: "gold", amount: -50 }],
      },
      {
        label: "Guide them yourself (Risk)",
        riskChance: 0.45,
        successText: "You successfully navigate the treacherous jungle.",
        successReward: [{ kind: "gold", amount: 200 }],
        failText: "You get hopelessly lost. The merchants abandon you.",
        failPenalty: [],
      },
      {
        label: "Demand payment upfront",
        riskChance: 0.3,
        successText: "Intimidated, they pay you before you even lift a finger.",
        successReward: [{ kind: "gold", amount: 150 }],
        failText: "They scoff at your extortion and find another guide.",
        failPenalty: [{ kind: "merit", amount: -1 }],
      },
    ],
  }
];
