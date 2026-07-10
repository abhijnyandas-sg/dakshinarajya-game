# Dakshina Rajya — Kingdom of the South

A multiplayer, turn-based strategy board game set in the 5th-century
Andhra–Telangana south. Play one of **30 Ranis** (historical queens of the
Satavahana, Ikshvaku, Vakataka and Kakatiya lines, plus original characters),
circuit a Monopoly-style board of Deccan cities, and bend the **200 Palegallu**
(frontier chieftains) to your banner by negotiation or conquest — racing rivals
to a **Mandala victory**.

## Architecture (MVC + authoritative server)

```
dakshina-rajya/
├── shared/   @dakshina/shared — the MODEL: pure-TS game state + rules engine,
│             plus all data (board, 30 ranis, 200 palegallu). No I/O, no UI.
├── server/   NestJS — the CONTROLLER: REST controller for reference data +
│             rooms, a RoomStore service (in-memory repository), and a
│             Socket.IO gateway that validates turns and invokes the engine.
│             The server is the single source of truth (RNG lives here).
└── client/   React + Vite — the VIEW: lobby, board, HUD and frontier panel.
              Holds no game rules; it renders server state and emits intents.
```

- **Why a server?** Online multiplayer needs one authoritative copy of the
  game so all players agree on dice, gold and who owns what. Clients never run
  the rules — they ask the server, which runs the shared engine and broadcasts
  the new state to the room.
- **Swappable storage.** `RoomStore` is a plain in-memory Map. Replace it with
  Redis/Postgres later without touching the engine or the gateway.

## Requirements

- Node.js **18+** and npm **9+** (npm workspaces).

## Install & run (development)

```bash
# from the project root
npm install
npm run dev
```

`npm run dev` builds the shared model once, then runs three watchers
concurrently:

- `shared` — `tsc -w` (recompiles the engine on change)
- `server` — NestJS on **http://localhost:3001**
- `client` — Vite on **http://localhost:5173**

Open **http://localhost:5173**. Click **Open a new court (host)** to create a
room — you'll get a 4-letter code. Other players open the same URL (or your LAN
IP, e.g. `http://192.168.1.20:5173`) and **Join** with the code. The host picks
when to **Begin the circuit** (2–6 players).

> First run tip: if the client starts before the shared package finished its
> first compile, just restart `npm run dev` once — the prebuild step normally
> prevents this.

## Production build

```bash
npm run build          # builds shared, server and client
npm run start          # serves the NestJS API/gateway on :3001
# serve client/dist with any static host, and set VITE_SERVER_URL at build time
```

## How to play

1. **Pick a Rani.** Each has a **passive** (always on) and a one-shot **royal
   decree**. Tiers are honest: `historical` Ranis are attested in inscriptions;
   `original` ones use authentic naming but are new characters.
2. **Roll** to circuit the board. Pass the Royal Court for +200 Gold; buy
   unclaimed cities; pay tolls when you land on a rival's city; collect from
   festivals, yagnas, the weapon hoard and the planetary oracle.
3. **Work the frontier.** Once per turn, pick an open Palegadu and either
   **Negotiate** (Gold + diplomacy vs. disposition) or **Conquer** (dice +
   astras vs. garrison). Winning grants the chieftain's reward and a banner.
4. **Win** by a **Mandala victory** (control `bannerGoal` villages, default 10)
   or by **treasury** (reach `goldGoal` Gold, default 6000).

## Socket contract (server ↔ client)

Client → server: `createRoom`, `joinRoom`, `chooseRani`, `startGame`, `roll`,
`buyCity`, `frontier`, `useDecree`, `endTurn`.
Server → client: `state` (the full authoritative `GameState`, broadcast to the
room after every accepted action).

## Data

The 30 Ranis and 200 Palegallu live in `shared/src/data/` as typed modules,
transcribed from the project's `ranis.json` / `palegallu.json`. Edit there and
the change flows to both server and client.

## Notes / roadmap

- v1 keeps player identity in memory; a dropped socket marks you disconnected
  but doesn't yet restore your seat. Reconnect/seat-resume is a natural next
  step (persist `playerId` client-side + a `resume` event).
- Many Rani passives/decrees are implemented; a few advanced ones (e.g. hand
  reveals) are simplified to Merit. The mapping lives in `shared/src/engine.ts`.
