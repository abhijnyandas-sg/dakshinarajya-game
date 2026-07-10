import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RoomStore } from "./room.store";
import {
  chooseRani,
  startGame,
  roll,
  buyCity,
  frontier,
  useDecree,
  endTurn,
  setDisconnected,
  botPlayTurn,
  currentPlayer,
  RANI_BY_ID,
  PALEGADU_BY_ID,
  SPACES,
  FrontierMode,
  GameState,
  CardRevealPayload,
  exploreCity,
  resolveEvent,
} from "@dakshina/shared";

interface SockData {
  code?: string;
  playerId?: string;
}

// Bot names rotated through
const BOT_NAMES = [
  "Rani Saraswati (AI)",
  "Rani Bhavani (AI)",
  "Rani Durga (AI)",
  "Rani Lakshmi (AI)",
];

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class GameGateway implements OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  // Rate limiting: IP -> { count, resetAt }
  private rateLimits = new Map<string, { count: number; resetAt: number }>();

  constructor(private readonly rooms: RoomStore) {}

  // Basic token-bucket style rate limiter per connection IP
  private isRateLimited(client: Socket, maxHits = 10, windowMs = 5000): boolean {
    const ip = client.handshake.address;
    const now = Date.now();
    let record = this.rateLimits.get(ip);
    if (!record || now > record.resetAt) {
      record = { count: 0, resetAt: now + windowMs };
    }
    record.count++;
    this.rateLimits.set(ip, record);
    return record.count > maxHits;
  }

  private data(client: Socket): SockData {
    return client.data as SockData;
  }

  private error(client: Socket, message: string) {
    client.emit("errorMsg", message);
  }

  /** push the authoritative state to everyone in the room */
  private broadcast(code: string) {
    const state = this.rooms.get(code);
    if (state) this.server.to(code).emit("state", state);
  }

  /** Broadcast a card reveal to everyone in the room, then state */
  private broadcastCardReveal(code: string, payload: CardRevealPayload) {
    this.server.to(code).emit("cardReveal", payload);
  }

  /**
   * Builds a CardRevealPayload by inspecting the latest log entry and
   * the space that was just landed on.
   */
  private buildCardPayload(
    state: GameState,
    playerName: string,
    spaceName: string,
    spaceType: string,
    logText: string
  ): CardRevealPayload | null {
    const type = spaceType as CardRevealPayload["type"];
    if (!["festival", "yagna", "planet", "weapon"].includes(type)) return null;

    // Extract gold amounts from log
    const goldMatch = logText.match(/([+-]?\d+)\s*Gold/);
    const amount = goldMatch ? parseInt(goldMatch[1]) : undefined;

    const effectMap: Record<string, string> = {
      festival: "The village goddess bestows her blessings upon the land.",
      yagna: "Sacred fire rises. The heavens record your devotion.",
      planet: amount && amount > 0
        ? "The stars align in your favour. Prosperity follows."
        : "Saturn's shadow falls. The treasury feels the weight.",
      weapon: "An ancient weapon is revealed. The arsenal grows.",
    };

    return {
      type: type as CardRevealPayload["type"],
      spaceName,
      playerName,
      amount,
      effect: effectMap[type] || logText,
    };
  }

  /** Run bot turns in sequence after a human or bot ends their turn */
  private async runBotTurns(code: string) {
    const state = this.rooms.get(code);
    if (!state || state.phase !== "playing") return;

    // Keep playing bot turns as long as the current player is a bot
    let safety = 0;
    while (safety < 20) {
      const p = currentPlayer(state);
      if (!p || !p.isBot) break;

      // 1. Tell client the bot is rolling
      state.botIsRolling = true;
      this.broadcast(code);

      // 2. Wait 2 seconds for client animation
      await new Promise((r) => setTimeout(r, 2000));

      // 3. Ensure the room hasn't been closed or state changed drastically during the wait
      const currentState = this.rooms.get(code);
      if (!currentState || currentState.phase !== "playing") break;
      const currentP = currentPlayer(currentState);
      if (!currentP || currentP.id !== p.id) break;

      currentState.botIsRolling = false;

      // Capture space before bot rolls to detect special card landings
      const prevPos = currentP.pos;

      const played = botPlayTurn(currentState);
      if (!played) break;

      // Check if bot landed on a special space and emit card reveal
      const sp = SPACES[currentP.pos];
      if (sp && ["festival", "yagna", "planet", "weapon"].includes(sp.t)) {
        const lastLog = currentState.log[currentState.log.length - 2]?.text ?? "";
        const payload = this.buildCardPayload(currentState, currentP.name, sp.name, sp.t, lastLog);
        if (payload) {
          this.broadcastCardReveal(code, payload);
        }
      }

      this.broadcast(code);
      safety++;
    }

    this.broadcast(code);
  }

  // ---- lobby -------------------------------------------------------

  @SubscribeMessage("createRoom")
  onCreate(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { name: string }
  ) {
    if (this.isRateLimited(client, 5, 10000)) {
      this.error(client, "Too many requests. Please wait.");
      return { error: "Too many requests." };
    }
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const { state, playerId } = this.rooms.create(name || "Host");
    const d = this.data(client);
    d.code = state.code;
    d.playerId = playerId;
    client.join(state.code);
    this.broadcast(state.code);
    return { code: state.code, playerId };
  }

  @SubscribeMessage("joinRoom")
  onJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { code: string; name: string }
  ) {
    if (this.isRateLimited(client, 10, 10000)) {
      this.error(client, "Too many requests. Please wait.");
      return { error: "Too many requests." };
    }
    const code = typeof body?.code === "string" ? body.code : "";
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const res = this.rooms.join(code, name || "Rani");
    if ("error" in res) return { error: res.error };
    const d = this.data(client);
    d.code = res.state.code;
    d.playerId = res.playerId;
    client.join(res.state.code);
    this.broadcast(res.state.code);
    return { code: res.state.code, playerId: res.playerId };
  }

  @SubscribeMessage("reconnect")
  onReconnect(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { code: string; playerId: string }
  ) {
    const code = typeof body?.code === "string" ? body.code : "";
    const playerId = typeof body?.playerId === "string" ? body.playerId : "";
    if (!code || !playerId) {
      this.error(client, "Reconnect requires a room code and player id.");
      return { error: "Reconnect requires a room code and player id." };
    }
    const res = this.rooms.reconnect(code, playerId);
    if ("error" in res) return { error: res.error };
    const d = this.data(client);
    d.code = res.state.code;
    d.playerId = res.playerId;
    client.join(res.state.code);
    this.broadcast(res.state.code);
    return { code: res.state.code, playerId: res.playerId };
  }

  @SubscribeMessage("leaveRoom")
  onLeave(@ConnectedSocket() client: Socket) {
    const { code, playerId } = this.data(client);
    if (!code || !playerId) return;
    const state = this.rooms.get(code);
    if (!state) return;

    const leavingPlayer = state.players.find((p) => p.id === playerId);
    const isHost = leavingPlayer?.isHost || state.hostId === playerId;

    if (isHost || state.phase === "lobby") {
      // Host leaving (or lobby): close the whole room
      const roomCode = code;
      this.server.to(roomCode).emit("roomClosed", "The host has left. The court is dissolved.");
      // Kick all sockets from the room
      this.server.in(roomCode).socketsLeave(roomCode);
      this.rooms.remove(roomCode);
    } else {
      // Non-host leaving in-game: mark disconnected
      if (leavingPlayer) leavingPlayer.connected = false;
      client.leave(code);
      this.broadcast(code);
    }

    const d = this.data(client);
    d.code = undefined;
    d.playerId = undefined;
  }

  @SubscribeMessage("addBot")
  onAddBot(@ConnectedSocket() client: Socket) {
    const { code, playerId } = this.data(client);
    if (!code || !playerId) return;
    const state = this.rooms.get(code);
    if (!state) return;
    if (state.phase !== "lobby") {
      this.error(client, "Cannot add bots after the game has started.");
      return;
    }
    if (state.hostId !== playerId) {
      this.error(client, "Only the host can add bot players.");
      return;
    }
    const botCount = state.players.filter((p) => p.isBot).length;
    if (state.players.length >= 6) {
      this.error(client, "The room is full.");
      return;
    }
    const botName = BOT_NAMES[botCount % BOT_NAMES.length];
    this.rooms.addBot(code, botName);
    this.broadcast(code);
  }

  // ---- in-game actions --------------------------------------------

  private withRoom(
    client: Socket,
    fn: (state: GameState, playerId: string) => void
  ): boolean {
    const { code, playerId } = this.data(client);
    if (!code || !playerId) {
      this.error(client, "You are not in a room.");
      return false;
    }
    const state = this.rooms.get(code);
    if (!state) {
      this.error(client, "Room not found.");
      return false;
    }
    fn(state, playerId);
    this.broadcast(code);
    return true;
  }

  @SubscribeMessage("chooseRani")
  onChoose(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { raniId: string }
  ) {
    const raniId = typeof body?.raniId === "string" ? body.raniId : "";
    if (!RANI_BY_ID[raniId]) {
      this.error(client, "Unknown Rani.");
      return;
    }
    this.withRoom(client, (state, pid) => chooseRani(state, pid, raniId));
  }

  @SubscribeMessage("startGame")
  onStart(@ConnectedSocket() client: Socket) {
    this.withRoom(client, (state, pid) => startGame(state, pid));
    // After starting, if the first player is a bot, auto-play
    const { code } = this.data(client);
    if (code) this.runBotTurns(code);
  }

  @SubscribeMessage("roll")
  onRoll(@ConnectedSocket() client: Socket) {
    const { code, playerId } = this.data(client);
    if (!code || !playerId) return;
    const state = this.rooms.get(code);
    if (!state) return;

    // Capture player pos before roll for card reveal detection
    const p = state.players.find((q) => q.id === playerId);
    const prevPos = p?.pos ?? 0;

    roll(state, playerId);

    // Check for special space landing and emit card reveal
    if (p) {
      const sp = SPACES[p.pos];
      if (sp && ["festival", "yagna", "planet", "weapon"].includes(sp.t)) {
        const lastLog = state.log[state.log.length - 1]?.text ?? "";
        const payload = this.buildCardPayload(state, p.name, sp.name, sp.t, lastLog);
        if (payload) {
          this.broadcastCardReveal(code, payload);
        }
      }
    }

    this.broadcast(code);
  }

  @SubscribeMessage("buyCity")
  onBuy(@ConnectedSocket() client: Socket) {
    this.withRoom(client, (state, pid) => buyCity(state, pid));
  }

  @SubscribeMessage("frontier")
  onFrontier(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { mode: FrontierMode; villageId: string; astras?: number }
  ) {
    const mode = body?.mode;
    if (mode !== "negotiate" && mode !== "conquer") {
      this.error(client, "Frontier mode must be negotiate or conquer.");
      return;
    }
    const villageId = typeof body?.villageId === "string" ? body.villageId : "";
    if (!PALEGADU_BY_ID[villageId]) {
      this.error(client, "Unknown village.");
      return;
    }
    const astras = typeof body?.astras === "number" ? Math.max(0, body.astras) : 0;
    this.withRoom(client, (state, pid) =>
      frontier(state, pid, mode, villageId, astras)
    );
  }

  @SubscribeMessage("exploreCity")
  onExplore(@ConnectedSocket() client: Socket) {
    this.withRoom(client, (state, pid) => exploreCity(state, pid));
  }

  @SubscribeMessage("resolveEvent")
  onResolveEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { choiceIndex: number }
  ) {
    const choiceIndex = typeof body?.choiceIndex === "number" ? body.choiceIndex : -1;
    if (choiceIndex < 0) {
      this.error(client, "Invalid choice.");
      return;
    }
    this.withRoom(client, (state, pid) => resolveEvent(state, pid, choiceIndex));
    // If the event resolved and it was the end of turn logic (though the player can still buy the city or end turn),
    // they manually end the turn via the "End Turn" button afterwards.
  }

  @SubscribeMessage("useDecree")
  onDecree(@ConnectedSocket() client: Socket) {
    this.withRoom(client, (state, pid) => useDecree(state, pid));
  }

  @SubscribeMessage("endTurn")
  onEnd(@ConnectedSocket() client: Socket) {
    const { code, playerId } = this.data(client);
    if (!code || !playerId) return;
    const state = this.rooms.get(code);
    if (!state) return;
    endTurn(state, playerId);
    this.broadcast(code);
    // Run any bot turns that follow
    this.runBotTurns(code);
  }

  // ---- lifecycle ---------------------------------------------------

  handleDisconnect(client: Socket) {
    const { code, playerId } = this.data(client);
    if (!code || !playerId) return;
    const state = this.rooms.get(code);
    if (!state) return;
    setDisconnected(state, playerId);
    this.broadcast(code);
    this.rooms.sweep();
  }
}
