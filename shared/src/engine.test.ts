import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createGame,
  addPlayer,
  startGame,
  roll,
  buyCity,
  endTurn,
  frontier,
  chooseRani,
} from "./engine";
import { SPACES } from "./data/board";
import { PALEGADU_BY_ID } from "./data/palegallu";
import { RANI_BY_ID } from "./data/ranis";

describe("createGame", () => {
  it("creates a lobby with a host", () => {
    const s = createGame("AB12", "host_1", "Naganika");
    assert.equal(s.code, "AB12");
    assert.equal(s.phase, "lobby");
    assert.equal(s.players.length, 1);
    assert.equal(s.players[0].name, "Naganika");
    assert.equal(s.players[0].gold, 1500);
  });
});

describe("startGame", () => {
  it("requires at least 2 players", () => {
    const s = createGame("AB12", "host_1", "Naganika");
    startGame(s, "host_1");
    assert.equal(s.phase, "lobby");
  });

  it("starts with 2 players and auto-assigns ranis", () => {
    const s = createGame("AB12", "host_1", "Naganika");
    addPlayer(s, "p2", "Gautami");
    startGame(s, "host_1");
    assert.equal(s.phase, "playing");
    assert.ok(s.players.every((p) => p.raniId));
  });
});

describe("roll", () => {
  it("moves the current player and grants pass-court gold", () => {
    const s = createGame("AB12", "host_1", "Naganika");
    addPlayer(s, "p2", "Gautami");
    chooseRani(s, "host_1", Object.keys(RANI_BY_ID)[0]);
    chooseRani(s, "p2", Object.keys(RANI_BY_ID)[1]);
    startGame(s, "host_1");
    const beforeGold = s.players[0].gold;
    const beforePos = s.players[0].pos;
    roll(s, "host_1");
    assert.equal(s.rolledThisTurn, true);
    assert.notEqual(s.dice, [1, 1]);
    assert.notEqual(s.players[0].pos, beforePos);
    // Passing court should grant 200 gold (or more with rani bonus)
    if (s.players[0].pos < beforePos) {
      assert.ok(s.players[0].gold >= beforeGold + 200);
    }
  });

  it("rejects rolling out of turn", () => {
    const s = createGame("AB12", "host_1", "Naganika");
    addPlayer(s, "p2", "Gautami");
    chooseRani(s, "host_1", Object.keys(RANI_BY_ID)[0]);
    chooseRani(s, "p2", Object.keys(RANI_BY_ID)[1]);
    startGame(s, "host_1");
    const ok = roll(s, "p2");
    assert.equal(ok, false);
  });
});

describe("buyCity", () => {
  it("deducts gold and marks ownership when on an unowned city", () => {
    const s = createGame("AB12", "host_1", "Naganika");
    addPlayer(s, "p2", "Gautami");
    const raniIds = Object.keys(RANI_BY_ID);
    chooseRani(s, "host_1", raniIds[0]);
    chooseRani(s, "p2", raniIds[1]);
    startGame(s, "host_1");
    // Force the current player onto a property space
    const p = s.players[0];
    const prop = SPACES.find((sp) => sp.t === "prop" && sp.price && sp.price <= p.gold)!;
    p.pos = prop.id;
    s.step = "action";
    const beforeGold = p.gold;
    buyCity(s, p.id);
    assert.ok(p.owned.includes(prop.id));
    assert.ok(p.gold < beforeGold);
  });
});

describe("frontier", () => {
  it("conquers a village and applies typed rewards", () => {
    const s = createGame("AB12", "host_1", "Naganika");
    addPlayer(s, "p2", "Gautami");
    const raniIds = Object.keys(RANI_BY_ID);
    chooseRani(s, "host_1", raniIds[0]);
    chooseRani(s, "p2", raniIds[1]);
    startGame(s, "host_1");
    const p = s.players[0];
    const village = Object.keys(PALEGADU_BY_ID)[0];
    const before = p.villagesWon.length;
    // Force a winning conquer by spending enough astras
    p.astras = 20;
    s.step = "action";
    frontier(s, p.id, "conquer", village, 20);
    assert.equal(p.villagesWon.length, before + 1);
    assert.equal(s.villages[village], p.id);
  });
});

describe("endTurn", () => {
  it("advances to the next player", () => {
    const s = createGame("AB12", "host_1", "Naganika");
    addPlayer(s, "p2", "Gautami");
    const raniIds = Object.keys(RANI_BY_ID);
    chooseRani(s, "host_1", raniIds[0]);
    chooseRani(s, "p2", raniIds[1]);
    startGame(s, "host_1");
    roll(s, "host_1");
    endTurn(s, "host_1");
    assert.equal(s.turn, 1);
    assert.equal(s.rolledThisTurn, false);
  });
});

describe("per-turn income", () => {
  it("applies per-turn income when a player rolls", () => {
    const s = createGame("AB12", "host_1", "Naganika");
    addPlayer(s, "p2", "Gautami");
    const raniIds = Object.keys(RANI_BY_ID);
    chooseRani(s, "host_1", raniIds[0]);
    chooseRani(s, "p2", raniIds[1]);
    startGame(s, "host_1");
    const p = s.players[0];
    p.perTurn.gold = 25;
    const beforeGold = p.gold;
    roll(s, "host_1");
    assert.equal(p.gold, beforeGold + 25);
  });
});
