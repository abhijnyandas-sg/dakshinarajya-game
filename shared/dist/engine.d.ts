import { GameState, Player, FrontierMode } from "./types";
export declare const START_GOLD = 1500;
export declare const PASS_COURT_GOLD = 200;
export declare const MAX_PLAYERS = 6;
export declare const DEFAULT_BANNER_GOAL = 10;
export declare const DEFAULT_GOLD_GOAL = 6000;
export interface RaniBonus {
    buildDiscount: number;
    tollMult: number;
    rentMult: number;
    negotiate: number;
    negotiateTieWins: boolean;
    freeAlliance: boolean;
    conquer: number;
    keepTroopsOnFail: boolean;
    circuitGold: number;
    passCourtGrain: number;
    festivalScholar: number;
    festivalMult: number;
    cannotBanish: boolean;
    astraCapBonus: number;
    mandalaBonus: boolean;
}
export declare function raniBonus(raniId: string | null): RaniBonus;
export declare function createGame(code: string, hostId: string, hostName: string): GameState;
export declare function newPlayerId(): string;
export declare function addPlayer(s: GameState, id: string, name: string, isHost?: boolean, isBot?: boolean): Player;
export declare function findPlayer(s: GameState, id: string): Player | undefined;
export declare function currentPlayer(s: GameState): Player | undefined;
export declare function chooseRani(s: GameState, playerId: string, raniId: string): void;
export declare function startGame(s: GameState, requesterId: string): void;
export declare function roll(s: GameState, playerId: string): boolean;
export declare function buyCity(s: GameState, playerId: string): boolean;
export declare function frontier(s: GameState, playerId: string, mode: FrontierMode, villageId: string, astrasSpent?: number): boolean;
export declare function useDecree(s: GameState, playerId: string): boolean;
export declare function endTurn(s: GameState, playerId: string): boolean;
export declare function villageCount(p: Player): number;
export declare function checkVictory(s: GameState): void;
export declare function setDisconnected(s: GameState, playerId: string): void;
/**
 * Execute one full AI turn (roll → optional buy → optional frontier → end).
 * Called server-side after the previous human/bot ends their turn.
 * Returns false if this is not actually a bot turn.
 */
export declare function botPlayTurn(s: GameState): boolean;
