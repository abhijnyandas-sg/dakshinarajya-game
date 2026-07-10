"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomStore = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@dakshina/shared");
let RoomStore = class RoomStore {
    constructor() {
        this.rooms = new Map();
    }
    code() {
        const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let c = "";
        do {
            c = Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
        } while (this.rooms.has(c));
        return c;
    }
    create(hostName) {
        const code = this.code();
        const hostId = (0, shared_1.newPlayerId)();
        const state = (0, shared_1.createGame)(code, hostId, hostName);
        this.rooms.set(code, state);
        return { state, playerId: hostId };
    }
    join(code, name) {
        const state = this.rooms.get(code.toUpperCase());
        if (!state)
            return { error: "No room with that code." };
        if (state.phase !== "lobby")
            return { error: "That game has already started." };
        if (state.players.length >= shared_1.MAX_PLAYERS)
            return { error: "That room is full." };
        const playerId = (0, shared_1.newPlayerId)();
        (0, shared_1.addPlayer)(state, playerId, name);
        return { state, playerId };
    }
    get(code) {
        return this.rooms.get(code?.toUpperCase());
    }
    openRoomCodes() {
        return Array.from(this.rooms.values())
            .filter((s) => s.phase === "lobby")
            .map((s) => s.code);
    }
    remove(code) {
        this.rooms.delete(code?.toUpperCase());
    }
    reconnect(code, playerId) {
        const state = this.rooms.get(code.toUpperCase());
        if (!state)
            return { error: "No room with that code." };
        const player = state.players.find((p) => p.id === playerId);
        if (!player)
            return { error: "No seat with that player id." };
        player.connected = true;
        return { state, playerId };
    }
    sweep() {
        const now = Date.now();
        for (const [code, s] of this.rooms) {
            const allGone = s.players.every((p) => !p.connected);
            const lastLog = s.log[s.log.length - 1]?.t ?? now;
            const endedTooLong = s.phase === "ended" && now - lastLog > 30 * 60 * 1000;
            const stale = allGone && now - lastLog > 2 * 60 * 60 * 1000;
            if (endedTooLong || stale)
                this.rooms.delete(code);
        }
    }
    addBot(code, botName) {
        const state = this.rooms.get(code.toUpperCase());
        if (!state || state.phase !== "lobby")
            return;
        if (state.players.length >= shared_1.MAX_PLAYERS)
            return;
        const botId = (0, shared_1.newPlayerId)();
        const bot = (0, shared_1.addPlayer)(state, botId, botName, false, true);
        const freeRani = Object.keys(shared_1.RANI_BY_ID).find((id) => !state.players.some((p) => p.raniId === id));
        if (freeRani)
            bot.raniId = freeRani;
        state.log.push({ t: Date.now(), text: `${botName} joins the court.` });
    }
};
exports.RoomStore = RoomStore;
exports.RoomStore = RoomStore = __decorate([
    (0, common_1.Injectable)()
], RoomStore);
//# sourceMappingURL=room.store.js.map