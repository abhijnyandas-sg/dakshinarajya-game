import { io, Socket } from "socket.io-client";
import type { GameState, FrontierMode } from "@dakshina/shared";

const URL =
  (import.meta as any).env?.VITE_SERVER_URL ||
  `${window.location.protocol}//${window.location.hostname}:3001`;

export const socket: Socket = io(URL, { autoConnect: true });

type Ack<T> = (r: T) => void;

const SESSION_KEY = "dr_session";

export interface SavedSession {
  code: string;
  playerId: string;
}

export function saveSession(code: string, playerId: string) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ code, playerId }));
  } catch {}
}

export function loadSession(): SavedSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.code && parsed?.playerId) return parsed as SavedSession;
  } catch {}
  return null;
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

export const api = {
  createRoom(name: string): Promise<{ code: string; playerId: string }> {
    return new Promise((resolve, reject) => {
      socket.emit(
        "createRoom",
        { name },
        (r: { code: string; playerId: string } | { error: string }) =>
          "error" in r ? reject(new Error(r.error)) : resolve(r)
      );
    });
  },
  joinRoom(code: string, name: string): Promise<{ code: string; playerId: string }> {
    return new Promise((resolve, reject) => {
      socket.emit(
        "joinRoom",
        { code, name },
        (r: { code: string; playerId: string } | { error: string }) =>
          "error" in r ? reject(new Error(r.error)) : resolve(r)
      );
    });
  },
  reconnect(code: string, playerId: string): Promise<{ code: string; playerId: string }> {
    return new Promise((resolve, reject) => {
      socket.emit(
        "reconnect",
        { code, playerId },
        (r: { code: string; playerId: string } | { error: string }) =>
          "error" in r ? reject(new Error(r.error)) : resolve(r)
      );
    });
  },
  chooseRani(raniId: string) {
    socket.emit("chooseRani", { raniId });
  },
  startGame() {
    socket.emit("startGame");
  },
  roll() {
    socket.emit("roll");
  },
  buyCity() {
    socket.emit("buyCity");
  },
  frontier(mode: FrontierMode, villageId: string, astras = 0) {
    socket.emit("frontier", { mode, villageId, astras });
  },
  useDecree() {
    socket.emit("useDecree");
  },
  endTurn() {
    socket.emit("endTurn");
  },
  leaveRoom() {
    socket.emit("leaveRoom");
  },
  addBot() {
    socket.emit("addBot");
  },
};

export type { GameState };

declare global {
  interface Window {
    __unused?: Ack<unknown>;
  }
}
