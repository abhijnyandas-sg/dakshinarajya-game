"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const strict_1 = __importDefault(require("node:assert/strict"));
const engine_1 = require("./engine");
const board_1 = require("./data/board");
const palegallu_1 = require("./data/palegallu");
const ranis_1 = require("./data/ranis");
(0, node_test_1.describe)("createGame", () => {
    (0, node_test_1.it)("creates a lobby with a host", () => {
        const s = (0, engine_1.createGame)("AB12", "host_1", "Naganika");
        strict_1.default.equal(s.code, "AB12");
        strict_1.default.equal(s.phase, "lobby");
        strict_1.default.equal(s.players.length, 1);
        strict_1.default.equal(s.players[0].name, "Naganika");
        strict_1.default.equal(s.players[0].gold, 1500);
    });
});
(0, node_test_1.describe)("startGame", () => {
    (0, node_test_1.it)("requires at least 2 players", () => {
        const s = (0, engine_1.createGame)("AB12", "host_1", "Naganika");
        (0, engine_1.startGame)(s, "host_1");
        strict_1.default.equal(s.phase, "lobby");
    });
    (0, node_test_1.it)("starts with 2 players and auto-assigns ranis", () => {
        const s = (0, engine_1.createGame)("AB12", "host_1", "Naganika");
        (0, engine_1.addPlayer)(s, "p2", "Gautami");
        (0, engine_1.startGame)(s, "host_1");
        strict_1.default.equal(s.phase, "playing");
        strict_1.default.ok(s.players.every((p) => p.raniId));
    });
});
(0, node_test_1.describe)("roll", () => {
    (0, node_test_1.it)("moves the current player and grants pass-court gold", () => {
        const s = (0, engine_1.createGame)("AB12", "host_1", "Naganika");
        (0, engine_1.addPlayer)(s, "p2", "Gautami");
        (0, engine_1.chooseRani)(s, "host_1", Object.keys(ranis_1.RANI_BY_ID)[0]);
        (0, engine_1.chooseRani)(s, "p2", Object.keys(ranis_1.RANI_BY_ID)[1]);
        (0, engine_1.startGame)(s, "host_1");
        const beforeGold = s.players[0].gold;
        const beforePos = s.players[0].pos;
        (0, engine_1.roll)(s, "host_1");
        strict_1.default.equal(s.rolledThisTurn, true);
        strict_1.default.notEqual(s.dice, [1, 1]);
        strict_1.default.notEqual(s.players[0].pos, beforePos);
        // Passing court should grant 200 gold (or more with rani bonus)
        if (s.players[0].pos < beforePos) {
            strict_1.default.ok(s.players[0].gold >= beforeGold + 200);
        }
    });
    (0, node_test_1.it)("rejects rolling out of turn", () => {
        const s = (0, engine_1.createGame)("AB12", "host_1", "Naganika");
        (0, engine_1.addPlayer)(s, "p2", "Gautami");
        (0, engine_1.chooseRani)(s, "host_1", Object.keys(ranis_1.RANI_BY_ID)[0]);
        (0, engine_1.chooseRani)(s, "p2", Object.keys(ranis_1.RANI_BY_ID)[1]);
        (0, engine_1.startGame)(s, "host_1");
        const ok = (0, engine_1.roll)(s, "p2");
        strict_1.default.equal(ok, false);
    });
});
(0, node_test_1.describe)("buyCity", () => {
    (0, node_test_1.it)("deducts gold and marks ownership when on an unowned city", () => {
        const s = (0, engine_1.createGame)("AB12", "host_1", "Naganika");
        (0, engine_1.addPlayer)(s, "p2", "Gautami");
        const raniIds = Object.keys(ranis_1.RANI_BY_ID);
        (0, engine_1.chooseRani)(s, "host_1", raniIds[0]);
        (0, engine_1.chooseRani)(s, "p2", raniIds[1]);
        (0, engine_1.startGame)(s, "host_1");
        // Force the current player onto a property space
        const p = s.players[0];
        const prop = board_1.SPACES.find((sp) => sp.t === "prop" && sp.price && sp.price <= p.gold);
        p.pos = prop.id;
        s.step = "action";
        const beforeGold = p.gold;
        (0, engine_1.buyCity)(s, p.id);
        strict_1.default.ok(p.owned.includes(prop.id));
        strict_1.default.ok(p.gold < beforeGold);
    });
});
(0, node_test_1.describe)("frontier", () => {
    (0, node_test_1.it)("conquers a village and applies typed rewards", () => {
        const s = (0, engine_1.createGame)("AB12", "host_1", "Naganika");
        (0, engine_1.addPlayer)(s, "p2", "Gautami");
        const raniIds = Object.keys(ranis_1.RANI_BY_ID);
        (0, engine_1.chooseRani)(s, "host_1", raniIds[0]);
        (0, engine_1.chooseRani)(s, "p2", raniIds[1]);
        (0, engine_1.startGame)(s, "host_1");
        const p = s.players[0];
        const village = Object.keys(palegallu_1.PALEGADU_BY_ID)[0];
        const before = p.villagesWon.length;
        // Force a winning conquer by spending enough astras
        p.astras = 20;
        s.step = "action";
        (0, engine_1.frontier)(s, p.id, "conquer", village, 20);
        strict_1.default.equal(p.villagesWon.length, before + 1);
        strict_1.default.equal(s.villages[village], p.id);
    });
});
(0, node_test_1.describe)("endTurn", () => {
    (0, node_test_1.it)("advances to the next player", () => {
        const s = (0, engine_1.createGame)("AB12", "host_1", "Naganika");
        (0, engine_1.addPlayer)(s, "p2", "Gautami");
        const raniIds = Object.keys(ranis_1.RANI_BY_ID);
        (0, engine_1.chooseRani)(s, "host_1", raniIds[0]);
        (0, engine_1.chooseRani)(s, "p2", raniIds[1]);
        (0, engine_1.startGame)(s, "host_1");
        (0, engine_1.roll)(s, "host_1");
        (0, engine_1.endTurn)(s, "host_1");
        strict_1.default.equal(s.turn, 1);
        strict_1.default.equal(s.rolledThisTurn, false);
    });
});
(0, node_test_1.describe)("per-turn income", () => {
    (0, node_test_1.it)("applies per-turn income when a player rolls", () => {
        const s = (0, engine_1.createGame)("AB12", "host_1", "Naganika");
        (0, engine_1.addPlayer)(s, "p2", "Gautami");
        const raniIds = Object.keys(ranis_1.RANI_BY_ID);
        (0, engine_1.chooseRani)(s, "host_1", raniIds[0]);
        (0, engine_1.chooseRani)(s, "p2", raniIds[1]);
        (0, engine_1.startGame)(s, "host_1");
        const p = s.players[0];
        p.perTurn.gold = 25;
        const beforeGold = p.gold;
        (0, engine_1.roll)(s, "host_1");
        strict_1.default.equal(p.gold, beforeGold + 25);
    });
});
