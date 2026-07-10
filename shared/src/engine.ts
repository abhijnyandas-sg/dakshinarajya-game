// ====================================================================
// Dakshina Rajya — authoritative game engine (pure rules).
// The NestJS server is the only caller; it owns RNG and turn order.
// Every exported mutator returns the same GameState reference after
// mutating it, and pushes human-readable lines into state.log.
// ====================================================================

import { GameState, Player, FrontierMode, RewardEffect } from "./types";
import { SPACES, BOARD_SIZE } from "./data/board";
import { RANI_BY_ID } from "./data/ranis";
import { PALEGADU_BY_ID } from "./data/palegallu";

export const START_GOLD = 1500;
export const PASS_COURT_GOLD = 200;
export const MAX_PLAYERS = 6;
export const DEFAULT_BANNER_GOAL = 10; // villages for a Mandala victory
export const DEFAULT_GOLD_GOAL = 6000; // economic victory

let _seq = 0;
function uid(prefix: string): string {
  _seq += 1;
  return `${prefix}_${Date.now().toString(36)}${_seq.toString(36)}`;
}

function d6(): number {
  return 1 + Math.floor(Math.random() * 6);
}

function log(s: GameState, text: string): void {
  s.log.push({ t: Date.now(), text });
  if (s.log.length > 60) s.log.shift();
}

// ---- Rani derived bonuses ------------------------------------------

export interface RaniBonus {
  buildDiscount: number; // fraction off city price
  tollMult: number; // multiplier on tolls/rent collected
  rentMult: number; // extra multiplier when collecting rent
  negotiate: number; // + to negotiation rolls
  negotiateTieWins: boolean;
  freeAlliance: boolean;
  conquer: number; // + to conquest rolls
  keepTroopsOnFail: boolean;
  circuitGold: number; // bonus on passing court
  passCourtGrain: number;
  festivalScholar: number;
  festivalMult: number; // multiplier on festival gold
  cannotBanish: boolean;
  astraCapBonus: number;
  mandalaBonus: boolean; // conquest counts double toward victory
}

const ZERO: RaniBonus = {
  buildDiscount: 0,
  tollMult: 1,
  rentMult: 1,
  negotiate: 0,
  negotiateTieWins: false,
  freeAlliance: false,
  conquer: 0,
  keepTroopsOnFail: false,
  circuitGold: 0,
  passCourtGrain: 0,
  festivalScholar: 0,
  festivalMult: 1,
  cannotBanish: false,
  astraCapBonus: 0,
  mandalaBonus: false,
};

export function raniBonus(raniId: string | null): RaniBonus {
  const r = raniId ? RANI_BY_ID[raniId] : null;
  if (!r) return { ...ZERO };
  const b: RaniBonus = { ...ZERO };
  switch (r.archetype) {
    case "regent": // Naganika
      b.circuitGold = 50;
      b.conquer = 1;
      break;
    case "matriarch": // Gautami / Kundamatisri
      b.festivalMult = 1.5;
      b.negotiate = 1;
      break;
    case "patron": // builders
      b.buildDiscount = 0.25;
      break;
    case "trader":
      b.tollMult = 1.25;
      break;
    case "sovereign":
      b.rentMult = 1.1;
      b.cannotBanish = true;
      break;
    case "diplomat":
      b.negotiateTieWins = true;
      b.freeAlliance = true;
      b.negotiate = 1;
      break;
    case "devi":
      b.festivalScholar = 1;
      break;
    case "scholar":
      b.negotiate = 1; // learned counsel
      break;
    case "war":
      b.conquer = 1;
      b.keepTroopsOnFail = true;
      break;
    case "economy":
      b.passCourtGrain = 1;
      break;
    case "naga":
      b.astraCapBonus = 1;
      b.conquer = 1;
      break;
    case "conquest":
      b.conquer = 2;
      b.mandalaBonus = true;
      break;
  }
  return b;
}

// ---- factory / lobby -----------------------------------------------

export function createGame(code: string, hostId: string, hostName: string): GameState {
  const s: GameState = {
    code,
    phase: "lobby",
    hostId,
    players: [],
    turn: 0,
    step: "roll",
    dice: [1, 1],
    rolledThisTurn: false,
    frontierUsed: false,
    villages: {},
    log: [],
    winnerId: null,
    bannerGoal: DEFAULT_BANNER_GOAL,
    goldGoal: DEFAULT_GOLD_GOAL,
    round: 1,
  };
  for (const id of Object.keys(PALEGADU_BY_ID)) s.villages[id] = null;
  addPlayer(s, hostId, hostName, true);
  log(s, `${hostName} opened the royal court. Room ${code}.`);
  return s;
}

export function newPlayerId(): string {
  return uid("p");
}

export function addPlayer(
  s: GameState,
  id: string,
  name: string,
  isHost = false,
  isBot = false
): Player {
  const seat = s.players.length;
  const p: Player = {
    id,
    name: name?.trim() || `Rani ${seat + 1}`,
    raniId: null,
    seat,
    isHost,
    isBot,
    connected: true,
    pos: 0,
    gold: START_GOLD,
    grain: 3,
    scholars: 1,
    merit: 0,
    astras: 0,
    owned: [],
    villagesWon: [],
    decreeUsed: false,
    shieldTurns: 0,
    taxImmune: false,
    skipTurns: 0,
    perTurn: {},
  };
  s.players.push(p);
  return p;
}

export function findPlayer(s: GameState, id: string): Player | undefined {
  return s.players.find((p) => p.id === id);
}

export function currentPlayer(s: GameState): Player | undefined {
  return s.players[s.turn];
}

export function chooseRani(s: GameState, playerId: string, raniId: string): void {
  if (s.phase !== "lobby") return;
  if (!RANI_BY_ID[raniId]) return;
  // a Rani can only be claimed by one player
  const taken = s.players.some((p) => p.id !== playerId && p.raniId === raniId);
  if (taken) return;
  const p = findPlayer(s, playerId);
  if (!p) return;
  p.raniId = raniId;
  log(s, `${p.name} pledges to ${RANI_BY_ID[raniId].name}.`);
}

export function startGame(s: GameState, requesterId: string): void {
  if (s.phase !== "lobby") return;
  if (requesterId !== s.hostId) return;
  if (s.players.length < 2) return;
  // auto-assign a Rani to anyone who skipped
  for (const p of s.players) {
    if (!p.raniId) {
      const free = Object.keys(RANI_BY_ID).find(
        (id) => !s.players.some((q) => q.raniId === id)
      );
      p.raniId = free ?? "rani_01";
    }
  }
  s.phase = "playing";
  s.turn = 0;
  s.step = "roll";
  s.rolledThisTurn = false;
  s.frontierUsed = false;
  log(s, `The circuit of the South begins. ${currentPlayer(s)?.name} rolls first.`);
}

// ---- core turn actions ---------------------------------------------

function applyBanishment(s: GameState, p: Player): void {
  if (raniBonus(p.raniId).cannotBanish) {
    log(s, `${p.name} ignores the banishment edict (sovereign privilege).`);
    return;
  }
  p.pos = 10; // Forest Exile
  log(s, `${p.name} is banished to the Forest Exile.`);
}

function tollFor(space: { price?: number }): number {
  return Math.round((space.price ?? 0) * 0.1);
}

function resolveLanding(s: GameState, p: Player, passedCourt: boolean): void {
  const bonus = raniBonus(p.raniId);
  if (passedCourt) {
    const g = PASS_COURT_GOLD + bonus.circuitGold;
    p.gold += g;
    p.grain += bonus.passCourtGrain;
    log(s, `${p.name} passes the Royal Court (+${g} Gold).`);
  }
  const sp = SPACES[p.pos];
  switch (sp.t) {
    case "tax": {
      if (p.taxImmune) {
        p.taxImmune = false;
        log(s, `${p.name} is exempt from the ${sp.name}.`);
      } else {
        const amt = sp.amt ?? 0;
        p.gold = Math.max(0, p.gold - amt);
        log(s, `${p.name} pays ${amt} Gold at the ${sp.name}.`);
      }
      break;
    }
    case "festival": {
      const g = Math.round(50 * bonus.festivalMult);
      p.gold += g;
      p.grain += 1;
      p.scholars += bonus.festivalScholar;
      log(
        s,
        `${sp.name}: ${p.name} gains ${g} Gold, +1 Grain${
          bonus.festivalScholar ? ", +1 Scholar" : ""
        }.`
      );
      break;
    }
    case "yagna": {
      p.merit += 1;
      log(s, `${p.name} performs the ${sp.name} (+1 Merit).`);
      break;
    }
    case "weapon": {
      p.astras += 1;
      log(s, `${p.name} draws an astra from the ${sp.name}.`);
      break;
    }
    case "planet": {
      const swing = d6();
      if (swing >= 4) {
        const g = swing * 25;
        p.gold += g;
        log(s, `The Oracle smiles on ${p.name} (+${g} Gold).`);
      } else {
        const g = swing * 20;
        p.gold = Math.max(0, p.gold - g);
        log(s, `The Oracle warns ${p.name} (-${g} Gold).`);
      }
      break;
    }
    case "prop":
    case "route": {
      const owner = s.players.find((q) => q.owned.includes(sp.id));
      if (!owner) {
        log(s, `${sp.name} is unclaimed — ${p.name} may buy it for ${sp.price} Gold.`);
      } else if (owner.id === p.id) {
        log(s, `${p.name} rests in their own city of ${sp.name}.`);
      } else {
        const ob = raniBonus(owner.raniId);
        let toll = tollFor(sp);
        // own more of the same group => higher toll
        const sameGroup = owner.owned.filter(
          (oid) => SPACES[oid].g && SPACES[oid].g === sp.g
        ).length;
        toll = Math.round(toll * (1 + 0.5 * (sameGroup - 1)) * ob.tollMult * ob.rentMult);
        const paid = Math.min(p.gold, toll);
        p.gold -= paid;
        owner.gold += paid;
        log(s, `${p.name} pays ${paid} Gold toll to ${owner.name} at ${sp.name}.`);
      }
      break;
    }
    case "corner": {
      // The Royal Court reward is granted via the passedCourt flag (which is
      // also set when landing exactly on it), so no extra award here.
      if (sp.sub === "banish") applyBanishment(s, p);
      else log(s, `${p.name} halts at ${sp.name}.`);
      break;
    }
  }
}

export function roll(s: GameState, playerId: string): boolean {
  if (s.phase !== "playing") return false;
  const p = currentPlayer(s);
  if (!p || p.id !== playerId) return false;
  if (s.rolledThisTurn) return false;

  applyPerTurnIncome(s, p);
  const a = d6();
  const b = d6();
  s.dice = [a, b];
  const steps = a + b;
  const before = p.pos;
  const after = (before + steps) % BOARD_SIZE;
  const passedCourt = before + steps >= BOARD_SIZE && after !== 0;
  p.pos = after;
  s.rolledThisTurn = true;
  s.step = "action";
  log(s, `${p.name} rolls ${a} + ${b} = ${steps}.`);
  resolveLanding(s, p, passedCourt || after === 0);
  checkVictory(s);
  return true;
}

export function buyCity(s: GameState, playerId: string): boolean {
  if (s.phase !== "playing") return false;
  const p = currentPlayer(s);
  if (!p || p.id !== playerId || s.step !== "action") return false;
  const sp = SPACES[p.pos];
  if (sp.t !== "prop" && sp.t !== "route") return false;
  if (s.players.some((q) => q.owned.includes(sp.id))) return false;
  const price = Math.round((sp.price ?? 0) * (1 - raniBonus(p.raniId).buildDiscount));
  if (p.gold < price) return false;
  p.gold -= price;
  p.owned.push(sp.id);
  log(s, `${p.name} annexes ${sp.name} for ${price} Gold.`);
  checkVictory(s);
  return true;
}

function applyPerTurnIncome(s: GameState, p: Player): void {
  const parts: string[] = [];
  for (const [res, amount] of Object.entries(p.perTurn)) {
    if (!amount) continue;
    (p as any)[res] += amount;
    parts.push(`+${amount} ${res}`);
  }
  if (parts.length > 0) {
    log(s, `${p.name} collects Palegadu tribute: ${parts.join(", ")}.`);
  }
}

// ---- frontier (Palegallu) ------------------------------------------

function negotiationCost(disposition: string): number {
  if (disposition === "Tribute-friendly") return 50;
  if (disposition === "Proud") return 100;
  return 150; // Hostile
}
function negotiationThreshold(disposition: string): number {
  if (disposition === "Tribute-friendly") return 3;
  if (disposition === "Proud") return 6;
  return 9; // Hostile
}

function applyReward(s: GameState, p: Player, effects: RewardEffect[]): void {
  const parts: string[] = [];
  for (const e of effects) {
    switch (e.kind) {
      case "gold":
        p.gold += e.amount;
        parts.push(`+${e.amount} Gold`);
        break;
      case "grain":
        p.grain += e.amount;
        parts.push(`+${e.amount} Grain`);
        break;
      case "scholars":
        p.scholars += e.amount;
        parts.push(`+${e.amount} Scholar${e.amount === 1 ? "" : "s"}`);
        break;
      case "astras":
        p.astras += e.amount;
        parts.push(`draw ${e.amount === 1 ? "an Astra" : e.amount + " Astras"}`);
        break;
      case "merit":
        p.merit += e.amount;
        parts.push(`+${e.amount} Merit`);
        break;
      case "perTurn": {
        const prev = p.perTurn[e.resource] ?? 0;
        p.perTurn[e.resource] = prev + e.amount;
        parts.push(`+${e.amount} ${e.resource} each turn`);
        break;
      }
      case "revealHand":
        parts.push("reveals a rival's hand once");
        break;
      case "freeTradeLeg":
        parts.push("a free Trade Venture leg");
        break;
      case "allianceFavour":
        parts.push("an alliance favour card");
        break;
      case "naaduBannerDouble":
        parts.push("counts double toward the Naadu banner");
        break;
    }
  }
  if (parts.length > 0) {
    log(s, `${p.name} gains ${parts.join("; ")}.`);
  }
}

export function frontier(
  s: GameState,
  playerId: string,
  mode: FrontierMode,
  villageId: string,
  astrasSpent = 0
): boolean {
  if (s.phase !== "playing") return false;
  const p = currentPlayer(s);
  if (!p || p.id !== playerId) return false;
  if (s.step !== "action" || s.frontierUsed) return false;
  const v = PALEGADU_BY_ID[villageId];
  if (!v) return false;
  if (s.villages[villageId] !== null) return false; // already taken
  const effects = v.reward;

  const bonus = raniBonus(p.raniId);
  s.frontierUsed = true;
  let won = false;

  if (mode === "negotiate") {
    const cost = bonus.freeAlliance
      ? Math.round(negotiationCost(v.disposition) / 2)
      : negotiationCost(v.disposition);
    if (p.gold < cost) {
      s.frontierUsed = false; // refund the action; nothing happened
      log(s, `${p.name} cannot afford to treat with ${v.name}.`);
      return false;
    }
    p.gold -= cost;
    const rollv = d6() + bonus.negotiate + Math.floor(p.scholars / 2);
    const need = negotiationThreshold(v.disposition);
    won = rollv > need || (rollv === need && bonus.negotiateTieWins);
    log(
      s,
      `${p.name} treats with ${v.name} (${v.disposition}) — ${rollv} vs ${need}: ${
        won ? "pledged!" : "refused."
      }`
    );
  } else {
    const spend = Math.max(0, Math.min(astrasSpent, p.astras));
    p.astras -= spend;
    const rollv = d6() + d6() + spend * 2 + bonus.conquer;
    const need = v.garrison * 4 + 3;
    won = rollv > need;
    if (!won && bonus.keepTroopsOnFail) p.astras += spend; // troops kept
    log(
      s,
      `${p.name} storms ${v.name} (garrison ${v.garrison}) — ${rollv} vs ${need}: ${
        won ? "conquered!" : "repulsed."
      }`
    );
  }

  if (won) {
    s.villages[villageId] = p.id;
    p.villagesWon.push(villageId);
    if (bonus.mandalaBonus || effects.some((e) => e.kind === "naaduBannerDouble")) {
      p.villagesWon.push(villageId + "#");
    }
    applyReward(s, p, effects);
    log(s, `${v.name} of ${v.naadu} now answers to ${p.name}. Reward: ${v.rewardText}.`);
    checkVictory(s);
  }
  return true;
}

// ---- decrees --------------------------------------------------------

function openVillages(s: GameState): string[] {
  return Object.keys(s.villages).filter((id) => s.villages[id] === null);
}

function pledgeOne(s: GameState, p: Player, prefer?: string): void {
  const open = openVillages(s);
  const pick =
    open.find((id) => PALEGADU_BY_ID[id].disposition === (prefer ?? "Tribute-friendly")) ??
    open[0];
  if (!pick) return;
  s.villages[pick] = p.id;
  p.villagesWon.push(pick);
  applyReward(s, p, PALEGADU_BY_ID[pick].reward);
  log(s, `${p.name} pledges ${PALEGADU_BY_ID[pick].name} by royal decree.`);
}

export function useDecree(s: GameState, playerId: string): boolean {
  if (s.phase !== "playing") return false;
  const p = currentPlayer(s);
  if (!p || p.id !== playerId || p.decreeUsed) return false;
  const r = p.raniId ? RANI_BY_ID[p.raniId] : null;
  if (!r) return false;
  p.decreeUsed = true;
  const others = s.players.filter((q) => q.id !== p.id);
  const decree = r.decree.toLowerCase();

  if (decree.includes("great caravan")) {
    let take = 0;
    for (const q of others) {
      const g = Math.min(q.gold, 25);
      q.gold -= g;
      take += g;
    }
    p.gold += take;
    log(s, `Great Caravan — ${p.name} collects ${take} Gold from rivals.`);
  } else if (decree.includes("royal peace")) {
    p.taxImmune = true;
    p.shieldTurns = 1;
    log(s, `Royal Peace — ${p.name} is shielded from the next attack and tax.`);
  } else if (decree.includes("sanctuary")) {
    p.shieldTurns = 1;
    log(s, `Sanctuary — ${p.name} is shielded this round.`);
  } else if (decree.includes("granary")) {
    if (p.grain >= 5) {
      p.grain -= 5;
      p.gold += 250;
      log(s, `Granary — ${p.name} sells 5 Grain for 250 Gold.`);
    } else {
      p.decreeUsed = false;
      log(s, `${p.name} lacks the Grain for the Granary decree.`);
      return false;
    }
  } else if (decree.includes("edict")) {
    for (const q of others) {
      const g = Math.min(q.gold, 50);
      q.gold -= g;
    }
    log(s, `Edict — every rival forfeits 50 Gold of works.`);
  } else if (decree.includes("serpent coil")) {
    others.slice(0, 2).forEach((q) => (q.skipTurns += 1));
    log(s, `Serpent Coil — two rivals lose their next turn.`);
  } else if (decree.includes("convocation") || decree.includes("war drums")) {
    p.astras += 2;
    log(s, `${r.decree.split("—")[0].trim()} — ${p.name} draws 2 astras.`);
  } else if (decree.includes("sealed alliance")) {
    pledgeOne(s, p, "Tribute-friendly");
  } else if (decree.includes("kakatiya charge")) {
    pledgeOne(s, p, "Tribute-friendly");
    pledgeOne(s, p, "Proud");
  } else if (decree.includes("lead the army")) {
    p.astras += 2;
    log(s, `Lead the Army — ${p.name} musters 2 astras for the assault.`);
  } else if (decree.includes("mahachaitya")) {
    p.merit += 3;
    log(s, `Found the Mahachaitya — ${p.name} earns 3 Merit.`);
  } else {
    p.merit += 2;
    log(s, `${r.name} issues a royal decree (+2 Merit).`);
  }
  checkVictory(s);
  return true;
}

// ---- end of turn / victory -----------------------------------------

export function endTurn(s: GameState, playerId: string): boolean {
  if (s.phase !== "playing") return false;
  const p = currentPlayer(s);
  if (!p || p.id !== playerId) return false;
  if (!s.rolledThisTurn) return false; // must roll before ending

  if (p.shieldTurns > 0) p.shieldTurns -= 1;

  // advance to the next player, skipping frozen ones
  let guard = 0;
  do {
    s.turn = (s.turn + 1) % s.players.length;
    if (s.turn === 0) s.round += 1;
    const next = s.players[s.turn];
    if (next.skipTurns > 0) {
      next.skipTurns -= 1;
      log(s, `${next.name} loses a turn (frozen).`);
      guard++;
      continue;
    }
    break;
  } while (guard < s.players.length * 2);

  s.step = "roll";
  s.rolledThisTurn = false;
  s.frontierUsed = false;
  log(s, `It is now ${currentPlayer(s)?.name}'s turn.`);
  return true;
}

export function villageCount(p: Player): number {
  return p.villagesWon.length;
}

export function checkVictory(s: GameState): void {
  if (s.phase !== "playing") return;
  for (const p of s.players) {
    if (p.villagesWon.length >= s.bannerGoal) {
      s.phase = "ended";
      s.winnerId = p.id;
      log(s, `${p.name} achieves the Mandala victory with ${p.villagesWon.length} villages!`);
      return;
    }
    if (p.gold >= s.goldGoal) {
      s.phase = "ended";
      s.winnerId = p.id;
      log(s, `${p.name} wins by treasury, amassing ${p.gold} Gold!`);
      return;
    }
  }
}

export function setDisconnected(s: GameState, playerId: string): void {
  const p = findPlayer(s, playerId);
  if (p) p.connected = false;
}

/**
 * Execute one full AI turn (roll → optional buy → optional frontier → end).
 * Called server-side after the previous human/bot ends their turn.
 * Returns false if this is not actually a bot turn.
 */
export function botPlayTurn(s: GameState): boolean {
  if (s.phase !== "playing") return false;
  const p = currentPlayer(s);
  if (!p || !p.isBot) return false;

  // 1. Roll
  roll(s, p.id);

  // 2. Buy if affordable and on unclaimed property
  const sp = SPACES[p.pos];
  if (sp && (sp.t === "prop" || sp.t === "route")) {
    const price = Math.round((sp.price ?? 0) * (1 - raniBonus(p.raniId).buildDiscount));
    const owned = s.players.some((q) => q.owned.includes(sp.id));
    if (!owned && p.gold >= price) {
      buyCity(s, p.id);
    }
  }

  // 3. Attempt a random frontier action (one per turn)
  if (!s.frontierUsed) {
    const entries = Object.entries(s.villages).filter(([, owner]) => owner === null);
    if (entries.length > 0) {
      const [villageId] = entries[Math.floor(Math.random() * entries.length)];
      // Try negotiate with no astras (bot never spends astras)
      frontier(s, p.id, "negotiate", villageId, 0);
    }
  }

  // 4. Use decree occasionally (every other game round)
  if (!p.decreeUsed && s.round % 2 === 0 && s.step === "action") {
    useDecree(s, p.id);
  }

  // 5. End turn
  endTurn(s, p.id);
  return true;
}
