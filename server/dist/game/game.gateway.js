"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const room_store_1 = require("./room.store");
const shared_1 = require("@dakshina/shared");
const BOT_NAMES = [
    "Rani Saraswati (AI)",
    "Rani Bhavani (AI)",
    "Rani Durga (AI)",
    "Rani Lakshmi (AI)",
];
let GameGateway = class GameGateway {
    constructor(rooms) {
        this.rooms = rooms;
    }
    data(client) {
        return client.data;
    }
    error(client, message) {
        client.emit("errorMsg", message);
    }
    broadcast(code) {
        const state = this.rooms.get(code);
        if (state)
            this.server.to(code).emit("state", state);
    }
    broadcastCardReveal(code, payload) {
        this.server.to(code).emit("cardReveal", payload);
    }
    buildCardPayload(state, playerName, spaceName, spaceType, logText) {
        const type = spaceType;
        if (!["festival", "yagna", "planet", "weapon"].includes(type))
            return null;
        const goldMatch = logText.match(/([+-]?\d+)\s*Gold/);
        const amount = goldMatch ? parseInt(goldMatch[1]) : undefined;
        const effectMap = {
            festival: "The village goddess bestows her blessings upon the land.",
            yagna: "Sacred fire rises. The heavens record your devotion.",
            planet: amount && amount > 0
                ? "The stars align in your favour. Prosperity follows."
                : "Saturn's shadow falls. The treasury feels the weight.",
            weapon: "An ancient weapon is revealed. The arsenal grows.",
        };
        return {
            type: type,
            spaceName,
            playerName,
            amount,
            effect: effectMap[type] || logText,
        };
    }
    runBotTurns(code) {
        const state = this.rooms.get(code);
        if (!state || state.phase !== "playing")
            return;
        let safety = 0;
        while (safety < 20) {
            const p = (0, shared_1.currentPlayer)(state);
            if (!p || !p.isBot)
                break;
            const prevPos = p.pos;
            const played = (0, shared_1.botPlayTurn)(state);
            if (!played)
                break;
            const sp = shared_1.SPACES[p.pos];
            if (sp && ["festival", "yagna", "planet", "weapon"].includes(sp.t)) {
                const lastLog = state.log[state.log.length - 2]?.text ?? "";
                const payload = this.buildCardPayload(state, p.name, sp.name, sp.t, lastLog);
                if (payload) {
                    this.broadcastCardReveal(code, payload);
                }
            }
            this.broadcast(code);
            safety++;
        }
        this.broadcast(code);
    }
    onCreate(client, body) {
        const name = typeof body?.name === "string" ? body.name.trim() : "";
        const { state, playerId } = this.rooms.create(name || "Host");
        const d = this.data(client);
        d.code = state.code;
        d.playerId = playerId;
        client.join(state.code);
        this.broadcast(state.code);
        return { code: state.code, playerId };
    }
    onJoin(client, body) {
        const code = typeof body?.code === "string" ? body.code : "";
        const name = typeof body?.name === "string" ? body.name.trim() : "";
        const res = this.rooms.join(code, name || "Rani");
        if ("error" in res)
            return { error: res.error };
        const d = this.data(client);
        d.code = res.state.code;
        d.playerId = res.playerId;
        client.join(res.state.code);
        this.broadcast(res.state.code);
        return { code: res.state.code, playerId: res.playerId };
    }
    onReconnect(client, body) {
        const code = typeof body?.code === "string" ? body.code : "";
        const playerId = typeof body?.playerId === "string" ? body.playerId : "";
        if (!code || !playerId) {
            this.error(client, "Reconnect requires a room code and player id.");
            return { error: "Reconnect requires a room code and player id." };
        }
        const res = this.rooms.reconnect(code, playerId);
        if ("error" in res)
            return { error: res.error };
        const d = this.data(client);
        d.code = res.state.code;
        d.playerId = res.playerId;
        client.join(res.state.code);
        this.broadcast(res.state.code);
        return { code: res.state.code, playerId: res.playerId };
    }
    onLeave(client) {
        const { code, playerId } = this.data(client);
        if (!code || !playerId)
            return;
        const state = this.rooms.get(code);
        if (!state)
            return;
        const leavingPlayer = state.players.find((p) => p.id === playerId);
        const isHost = leavingPlayer?.isHost || state.hostId === playerId;
        if (isHost || state.phase === "lobby") {
            const roomCode = code;
            this.server.to(roomCode).emit("roomClosed", "The host has left. The court is dissolved.");
            this.server.in(roomCode).socketsLeave(roomCode);
            this.rooms.remove(roomCode);
        }
        else {
            if (leavingPlayer)
                leavingPlayer.connected = false;
            client.leave(code);
            this.broadcast(code);
        }
        const d = this.data(client);
        d.code = undefined;
        d.playerId = undefined;
    }
    onAddBot(client) {
        const { code, playerId } = this.data(client);
        if (!code || !playerId)
            return;
        const state = this.rooms.get(code);
        if (!state)
            return;
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
    withRoom(client, fn) {
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
    onChoose(client, body) {
        const raniId = typeof body?.raniId === "string" ? body.raniId : "";
        if (!shared_1.RANI_BY_ID[raniId]) {
            this.error(client, "Unknown Rani.");
            return;
        }
        this.withRoom(client, (state, pid) => (0, shared_1.chooseRani)(state, pid, raniId));
    }
    onStart(client) {
        this.withRoom(client, (state, pid) => (0, shared_1.startGame)(state, pid));
        const { code } = this.data(client);
        if (code)
            this.runBotTurns(code);
    }
    onRoll(client) {
        const { code, playerId } = this.data(client);
        if (!code || !playerId)
            return;
        const state = this.rooms.get(code);
        if (!state)
            return;
        const p = state.players.find((q) => q.id === playerId);
        const prevPos = p?.pos ?? 0;
        (0, shared_1.roll)(state, playerId);
        if (p) {
            const sp = shared_1.SPACES[p.pos];
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
    onBuy(client) {
        this.withRoom(client, (state, pid) => (0, shared_1.buyCity)(state, pid));
    }
    onFrontier(client, body) {
        const mode = body?.mode;
        if (mode !== "negotiate" && mode !== "conquer") {
            this.error(client, "Frontier mode must be negotiate or conquer.");
            return;
        }
        const villageId = typeof body?.villageId === "string" ? body.villageId : "";
        if (!shared_1.PALEGADU_BY_ID[villageId]) {
            this.error(client, "Unknown village.");
            return;
        }
        const astras = typeof body?.astras === "number" ? Math.max(0, body.astras) : 0;
        this.withRoom(client, (state, pid) => (0, shared_1.frontier)(state, pid, mode, villageId, astras));
    }
    onDecree(client) {
        this.withRoom(client, (state, pid) => (0, shared_1.useDecree)(state, pid));
    }
    onEnd(client) {
        const { code, playerId } = this.data(client);
        if (!code || !playerId)
            return;
        const state = this.rooms.get(code);
        if (!state)
            return;
        (0, shared_1.endTurn)(state, playerId);
        this.broadcast(code);
        this.runBotTurns(code);
    }
    handleDisconnect(client) {
        const { code, playerId } = this.data(client);
        if (!code || !playerId)
            return;
        const state = this.rooms.get(code);
        if (!state)
            return;
        (0, shared_1.setDisconnected)(state, playerId);
        this.broadcast(code);
        this.rooms.sweep();
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("createRoom"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onCreate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("joinRoom"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("reconnect"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onReconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("leaveRoom"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onLeave", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("addBot"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onAddBot", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("chooseRani"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onChoose", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("startGame"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("roll"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onRoll", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("buyCity"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onBuy", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("frontier"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onFrontier", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("useDecree"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onDecree", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("endTurn"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "onEnd", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: true, credentials: true } }),
    __metadata("design:paramtypes", [room_store_1.RoomStore])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map