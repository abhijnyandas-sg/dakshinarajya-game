import { Injectable } from "@nestjs/common";
import { GameState, createGame, MAX_PLAYERS, addPlayer, newPlayerId, RANI_BY_ID } from "@dakshina/shared";

/**
 * In-memory room repository. The single source of truth for live games.
 * (Swap for Redis/Postgres later without touching the gateway or engine.)
 */
@Injectable()
export class RoomStore {
  private rooms = new Map<string, GameState>();

  private code(): string {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let c = "";
    do {
      c = Array.from({ length: 4 }, () =>
        alphabet[Math.floor(Math.random() * alphabet.length)]
      ).join("");
    } while (this.rooms.has(c));
    return c;
  }

  create(hostName: string): { state: GameState; playerId: string } {
    const code = this.code();
    const hostId = newPlayerId();
    const state = createGame(code, hostId, hostName);
    this.rooms.set(code, state);
    return { state, playerId: hostId };
  }

  join(
    code: string,
    name: string
  ): { state: GameState; playerId: string } | { error: string } {
    const state = this.rooms.get(code.toUpperCase());
    if (!state) return { error: "No room with that code." };
    if (state.phase !== "lobby") return { error: "That game has already started." };
    if (state.players.length >= MAX_PLAYERS) return { error: "That room is full." };
    const playerId = newPlayerId();
    addPlayer(state, playerId, name);
    return { state, playerId };
  }

  get(code: string): GameState | undefined {
    return this.rooms.get(code?.toUpperCase());
  }

  openRoomCodes(): string[] {
    return Array.from(this.rooms.values())
      .filter((s) => s.phase === "lobby")
      .map((s) => s.code);
  }

  remove(code: string): void {
    this.rooms.delete(code?.toUpperCase());
  }

  reconnect(
    code: string,
    playerId: string
  ): { state: GameState; playerId: string } | { error: string } {
    const state = this.rooms.get(code.toUpperCase());
    if (!state) return { error: "No room with that code." };
    const player = state.players.find((p) => p.id === playerId);
    if (!player) return { error: "No seat with that player id." };
    player.connected = true;
    return { state, playerId };
  }

  /** prune empty/finished rooms older than 2h (called opportunistically) */
  sweep(): void {
    const now = Date.now();
    for (const [code, s] of this.rooms) {
      const allGone = s.players.every((p) => !p.connected);
      const lastLog = s.log[s.log.length - 1]?.t ?? now;
      const endedTooLong = s.phase === "ended" && now - lastLog > 30 * 60 * 1000;
      const stale = allGone && now - lastLog > 2 * 60 * 60 * 1000;
      if (endedTooLong || stale) this.rooms.delete(code);
    }
  }

  addBot(code: string, botName: string): void {
    const state = this.rooms.get(code.toUpperCase());
    if (!state || state.phase !== "lobby") return;
    if (state.players.length >= MAX_PLAYERS) return;
    const botId = newPlayerId();
    const bot = addPlayer(state, botId, botName, false, true);
    // Auto-assign a free Rani to the bot
    const freeRani = Object.keys(RANI_BY_ID).find(
      (id) => !state.players.some((p) => p.raniId === id)
    );
    if (freeRani) bot.raniId = freeRani;
    state.log.push({ t: Date.now(), text: `${botName} joins the court.` });
  }
}
