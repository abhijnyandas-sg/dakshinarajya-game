export type GroupKey = "brown" | "cyan" | "pink" | "orange" | "red" | "yellow" | "green" | "darkblue";
export type SpaceType = "prop" | "route" | "tax" | "festival" | "yagna" | "planet" | "weapon" | "corner";
export interface Space {
    id: number;
    t: SpaceType;
    name: string;
    /** property colour-group / Naadu */
    g?: GroupKey;
    /** purchase price (prop / route) */
    price?: number;
    /** tax amount */
    amt?: number;
    /** corner sub-type: court | exile | lotus | banish */
    sub?: string;
    desc?: string;
}
export type Disposition = "Tribute-friendly" | "Proud" | "Hostile";
export interface Palegadu {
    id: string;
    name: string;
    naadu: string;
    disposition: Disposition;
    garrison: number;
    reward: RewardEffect[];
    rewardText: string;
}
export type RaniArchetype = "regent" | "matriarch" | "patron" | "trader" | "sovereign" | "diplomat" | "devi" | "scholar" | "war" | "economy" | "naga" | "conquest";
export interface Rani {
    id: string;
    name: string;
    dynasty: string;
    era: string;
    archetype: RaniArchetype;
    origin: "historical" | "original";
    passive: string;
    decree: string;
    note: string;
}
export type ResourceKey = "gold" | "grain" | "scholars" | "merit" | "astras";
export type RewardEffect = {
    kind: "gold";
    amount: number;
} | {
    kind: "grain";
    amount: number;
} | {
    kind: "scholars";
    amount: number;
} | {
    kind: "astras";
    amount: number;
} | {
    kind: "merit";
    amount: number;
} | {
    kind: "perTurn";
    resource: ResourceKey;
    amount: number;
} | {
    kind: "revealHand";
} | {
    kind: "freeTradeLeg";
} | {
    kind: "allianceFavour";
} | {
    kind: "naaduBannerDouble";
};
export interface Player {
    id: string;
    name: string;
    raniId: string | null;
    seat: number;
    isHost: boolean;
    isBot: boolean;
    connected: boolean;
    pos: number;
    gold: number;
    grain: number;
    scholars: number;
    merit: number;
    astras: number;
    owned: number[];
    villagesWon: string[];
    decreeUsed: boolean;
    shieldTurns: number;
    taxImmune: boolean;
    skipTurns: number;
    perTurn: Partial<Record<ResourceKey, number>>;
}
export type Phase = "lobby" | "playing" | "ended";
export type TurnStep = "roll" | "action";
export interface LogEntry {
    t: number;
    text: string;
}
export type CardRevealType = "festival" | "yagna" | "planet" | "weapon";
export interface CardRevealPayload {
    type: CardRevealType;
    spaceName: string;
    playerName: string;
    /** Positive amount for gains, negative for losses */
    amount?: number;
    /** free-form flavor line */
    effect: string;
}
export interface GameState {
    code: string;
    phase: Phase;
    hostId: string;
    players: Player[];
    turn: number;
    step: TurnStep;
    dice: [number, number];
    rolledThisTurn: boolean;
    frontierUsed: boolean;
    villages: Record<string, string | null>;
    log: LogEntry[];
    winnerId: string | null;
    bannerGoal: number;
    goldGoal: number;
    round: number;
}
export type FrontierMode = "negotiate" | "conquer";
export interface ServerToClient {
    state: (s: GameState) => void;
    joined: (p: {
        playerId: string;
        code: string;
    }) => void;
    errorMsg: (m: string) => void;
    rooms: (codes: string[]) => void;
    cardReveal: (payload: CardRevealPayload) => void;
    roomClosed: (reason: string) => void;
}
export interface ClientToServer {
    createRoom: (p: {
        name: string;
    }, cb: (r: {
        code: string;
        playerId: string;
    } | {
        error: string;
    }) => void) => void;
    joinRoom: (p: {
        code: string;
        name: string;
    }, cb: (r: {
        code: string;
        playerId: string;
    } | {
        error: string;
    }) => void) => void;
    chooseRani: (p: {
        raniId: string;
    }) => void;
    startGame: () => void;
    roll: () => void;
    buyCity: () => void;
    frontier: (p: {
        mode: FrontierMode;
        villageId: string;
        astras?: number;
    }) => void;
    useDecree: () => void;
    endTurn: () => void;
    leaveRoom: () => void;
    addBot: () => void;
}
