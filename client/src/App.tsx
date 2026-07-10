import { useEffect, useState } from "react";
import { socket, api, saveSession, loadSession, clearSession } from "./socket";
import {
  SPACES,
  GROUP_COLORS,
  NAADU,
  RANI_BY_ID,
  raniBonus,
  type GameState,
  type CardRevealPayload,
} from "@dakshina/shared";
import { Board } from "./components/Board";
import { Frontier } from "./components/Frontier";
import { RaniPicker } from "./components/RaniPicker";
import { CardReveal } from "./components/CardReveal";
import { DiceRoller } from "./components/DiceRoller";
import { HowToPlay } from "./components/HowToPlay";
import { TileDetailCard } from "./components/TileDetailCard";
import { StoryEventCard } from "./components/StoryEventCard";
import { IntroSlideshow } from "./components/IntroSlideshow";
import { EventLogToast } from "./components/EventLogToast";
import { RANI_ROLEPLAY } from "./flavor";

export default function App() {
  const [state, setState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [selected, setSelected] = useState(21);
  const [connected, setConnected] = useState(socket.connected);
  const [session] = useState(() => loadSession());
  const [cardPayload, setCardPayload] = useState<CardRevealPayload | null>(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showTileDetail, setShowTileDetail] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  // Sidebar collapse state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hudOpen, setHudOpen] = useState(true);
  const [frontierOpen, setFrontierOpen] = useState(true);
  const [logOpen, setLogOpen] = useState(true);

  useEffect(() => {
    const onState = (s: GameState) => setState(s);
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onError = (m: string) => {
      setToast(m);
      setTimeout(() => setToast(""), 4000);
    };
    const onCardReveal = (payload: CardRevealPayload) => {
      setCardPayload(payload);
    };
    const onRoomClosed = (reason: string) => {
      setToast(reason);
      clearSession();
      setTimeout(() => {
        setState(null);
        setPlayerId(null);
      }, 2500);
    };
    socket.on("state", onState);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("errorMsg", onError);
    socket.on("cardReveal", onCardReveal);
    socket.on("roomClosed", onRoomClosed);
    return () => {
      socket.off("state", onState);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("errorMsg", onError);
      socket.off("cardReveal", onCardReveal);
      socket.off("roomClosed", onRoomClosed);
    };
  }, []);

  const me = state?.players.find((p) => p.id === playerId);
  const current = state ? state.players[state.turn] : undefined;
  const isMyTurn = !!me && current?.id === me.id;

  function setSession(code: string, id: string) {
    saveSession(code, id);
    setPlayerId(id);
  }

  async function create() {
    try {
      setError("");
      const r = await api.createRoom(name || "Host");
      setSession(r.code, r.playerId);
    } catch (e: any) {
      setError(e.message);
    }
  }
  async function join() {
    try {
      setError("");
      const r = await api.joinRoom(joinCode, name || "Rani");
      setSession(r.code, r.playerId);
    } catch (e: any) {
      setError(e.message);
    }
  }
  async function reconnect() {
    if (!session) return;
    try {
      setError("");
      const r = await api.reconnect(session.code, session.playerId);
      setSession(r.code, r.playerId);
    } catch (e: any) {
      setError(e.message);
      clearSession();
    }
  }

  function handleLeaveRoom() {
    api.leaveRoom();
    clearSession();
    setState(null);
    setPlayerId(null);
  }

  // ---- entry screen -------------------------------------------------
  if (!state || !playerId) {
    return (
      <div className="dr-root">
        {toast && <div className="dr-toast">{toast}</div>}
        {showHowToPlay && <HowToPlay onClose={() => setShowHowToPlay(false)} />}
        <div className="dr-entry">
          <div className="dr-entry-logo">
            <h1 className="dr-title">
              Dakshina Rajya
            </h1>
            <div className="dr-title-te">దక్షిణ రాజ్య</div>
            <div className="dr-sub">Kingdom of the South · Live Multiplayer</div>
          </div>
          {!connected && <div className="dr-warn">⚡ Connecting to the royal court…</div>}
          {session && (
            <div className="dr-resume">
              <button className="dr-btn primary" onClick={reconnect} disabled={!connected}>
                Rejoin room {session.code}
              </button>
              <div className="dr-or">— or start fresh —</div>
            </div>
          )}
          <input
            className="dr-input"
            placeholder="Your name (Rani's title)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={18}
            id="entry-name"
          />
          <button className="dr-btn primary" onClick={create} disabled={!connected} id="create-btn">
            ⚔ Open a New Court (Host)
          </button>
          <div className="dr-or">— or join a room —</div>
          <div className="dr-join">
            <input
              className="dr-input dr-join-code"
              placeholder="ROOM"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={4}
              id="join-code"
            />
            <button className="dr-btn" onClick={join} disabled={!connected} id="join-btn">
              Join
            </button>
          </div>
          {error && <div className="dr-error">{error}</div>}
          <button
            className="dr-btn dr-htp-btn"
            onClick={() => setShowHowToPlay(true)}
            id="how-to-play-btn"
          >
            📜 How to Play
          </button>
        </div>
      </div>
    );
  }

  // ---- waiting room -------------------------------------------------
  if (state.phase === "lobby") {
    const canStart = me?.isHost && state.players.length >= 2;
    const botCount = state.players.filter((p) => p.isBot).length;
    const canAddBot = me?.isHost && state.players.length < 6;

    return (
      <div className="dr-root">
        {showHowToPlay && <HowToPlay onClose={() => setShowHowToPlay(false)} />}
        {toast && <div className="dr-toast">{toast}</div>}
        <div className="dr-wrap">
          <div className="dr-cartouche dr-room-head">
            <div>
              <div className="dr-title">
                Room <span className="dr-code">{state.code}</span>
              </div>
              <div className="dr-sub">Share this code with friends</div>
            </div>
            <div className="dr-room-actions">
              <button
                className="dr-btn dr-htp-btn"
                onClick={() => setShowHowToPlay(true)}
              >
                📜 Guide
              </button>
              <button
                className="dr-btn dr-leave-btn"
                onClick={handleLeaveRoom}
              >
                ← Leave
              </button>
            </div>
          </div>

          {/* Players in lobby */}
          <div className="dr-cartouche">
            <div className="dr-lbl">Players in Room</div>
            <div className="dr-seats">
              {state.players.map((p) => (
                <div key={p.id} className={"dr-seat-card" + (p.id === playerId ? " self" : "") + (p.isBot ? " bot" : "")}>
                  <span className="dr-seat-av" style={{ background: p.raniId ? (RANI_BY_ID[p.raniId] ? `var(--sindoor)` : "#666") : "#888" }}>
                    {p.name[0]}
                  </span>
                  <div className="dr-seat-info">
                    <div className="dr-seat-name">
                      {p.name}
                      {p.isHost ? " 👑" : ""}
                      {p.isBot ? " 🤖" : ""}
                    </div>
                    <div className="dr-seat-rani">
                      {p.raniId ? RANI_BY_ID[p.raniId]?.name ?? "—" : "Choosing…"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dr-cartouche">
            <RaniPicker state={state} me={me} onChoose={api.chooseRani} />
          </div>

          <div className="dr-cartouche dr-room-foot">
            <div className="dr-lobby-actions">
              {me?.isHost && canAddBot && (
                <button
                  className="dr-btn dr-bot-btn"
                  onClick={() => api.addBot()}
                  disabled={!canAddBot}
                >
                  🤖 Add AI Player {botCount > 0 ? `(${botCount})` : ""}
                </button>
              )}
              {me?.isHost ? (
                <button
                  className="dr-btn primary"
                  disabled={!canStart}
                  onClick={api.startGame}
                  id="start-game-btn"
                >
                  {state.players.length < 2
                    ? "Need at least 2 players"
                    : "⚔ Begin the Circuit"}
                </button>
              ) : (
                <div className="dr-hint">Waiting for the host to begin…</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- in game ------------------------------------------------------
  const selTile = SPACES[selected];
  const mySpace = me ? SPACES[me.pos] : null;
  const onBuyable =
    mySpace &&
    (mySpace.t === "prop" || mySpace.t === "route") &&
    !state.players.some((p) => p.owned.includes(mySpace.id));
  const buyPrice = mySpace
    ? Math.round((mySpace.price ?? 0) * (1 - raniBonus(me?.raniId ?? null).buildDiscount))
    : 0;
  const canBuy =
    isMyTurn &&
    state.step === "action" &&
    onBuyable &&
    (me?.gold ?? 0) >= buyPrice;
    
  const canExplore =
    isMyTurn &&
    state.step === "action" &&
    !state.cityExplored &&
    mySpace &&
    (mySpace.t === "prop" || mySpace.t === "route");
  const myRani = me?.raniId ? RANI_BY_ID[me.raniId] : null;
  const winner = state.winnerId
    ? state.players.find((p) => p.id === state.winnerId)
    : null;
  const turnLabel = isMyTurn
    ? "Your turn"
    : current
    ? `Waiting for ${current.name}${current.isBot ? " (AI)" : ""}`
    : "";

  const myArchetype = myRani?.archetype;
  const roleplayLine = myArchetype ? RANI_ROLEPLAY[myArchetype] : null;

  return (
    <div className="dr-root dr-game-root">
      {!hasSeenIntro && (
        <IntroSlideshow 
          state={state} 
          onComplete={() => setHasSeenIntro(true)} 
        />
      )}
      
      {toast && <div className="dr-toast">{toast}</div>}
      {showHowToPlay && <HowToPlay onClose={() => setShowHowToPlay(false)} />}
      <CardReveal payload={cardPayload} onDismiss={() => setCardPayload(null)} />
      <StoryEventCard state={state} onResolve={api.resolveEvent} mySeat={me?.seat ?? -1} />

      {/* ── Top strip ─────────────────────────────────────────── */}
      <div className="dr-topbar">
        <div className="dr-topbar-left">
          <span className="dr-topbar-title">Dakshina Rajya</span>
          <span className="dr-topbar-room">Room {state.code}</span>
        </div>
        <div className="dr-topbar-players">
          {state.players.map((p) => {
            const r = p.raniId ? RANI_BY_ID[p.raniId] : null;
            const isActive = current?.id === p.id;
            return (
              <div
                key={p.id}
                className={
                  "dr-pchip" +
                  (isActive ? " active" : "") +
                  (p.id === playerId ? " self" : "") +
                  (!p.connected ? " gone" : "") +
                  (p.isBot ? " bot" : "")
                }
                title={r?.name ?? "No Rani"}
              >
                <span className="dr-pchip-av" style={{ background: isActive ? "var(--sindoor)" : "var(--inkSoft)" }}>
                  {p.name[0]}
                </span>
                <div className="dr-pchip-info">
                  <span className="dr-pchip-name">{p.name}{p.isBot ? " 🤖" : ""}</span>
                  <span className="dr-pstats">₹{p.gold} · 🏯{p.villagesWon.length}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="dr-topbar-right">
          <button
            className="dr-btn dr-htp-btn"
            onClick={() => setShowHowToPlay(true)}
            title="How to Play"
          >
            📜
          </button>
          <button
            className="dr-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            title="Toggle sidebar"
          >
            {sidebarOpen ? "▶" : "◀"}
          </button>
        </div>
      </div>

      {/* ── Main game area ────────────────────────────────────── */}
      <div className={"dr-game-layout" + (sidebarOpen ? "" : " dr-nosidebar")}>
        {/* Board — dominant */}
        <div className="dr-board-wrap">
          <EventLogToast log={state.log} />
          {winner && (
            <div className="dr-victory-banner">
              👑 {winner.name} has won — long live the Rani of the South!
            </div>
          )}
          <Board
            state={state}
            selected={selected}
            myPlayerId={playerId}
            onSelect={(id) => { setSelected(id); setShowTileDetail(true); }}
          />
          {showTileDetail && (
            <TileDetailCard
              spaceId={selected}
              state={state}
              playerId={playerId}
              onClose={() => setShowTileDetail(false)}
            />
          )}
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="dr-sidebar">
            {/* ── HUD ── */}
            <div className="dr-panel">
              <button
                className="dr-panel-header"
                onClick={() => setHudOpen((v) => !v)}
              >
                <span>⚔ Your Status</span>
                <span>{hudOpen ? "▲" : "▼"}</span>
              </button>
              {hudOpen && (
                <div className="dr-panel-body">
                  <div className="dr-hud-rani">
                    <div className="dr-rn big">{me?.name}</div>
                    {myRani && (
                      <div className="dr-hud-raniname">{myRani.name}</div>
                    )}
                    {roleplayLine && (
                      <div className="dr-roleplay-line">"{roleplayLine}"</div>
                    )}
                  </div>
                  <div className="dr-turn-banner-sm">{turnLabel}</div>
                  <div className="dr-coins">
                    <div className="dr-coin">
                      <b>{me?.gold ?? 0}</b>
                      <span>Gold</span>
                    </div>
                    <div className="dr-coin">
                      <b>{me?.grain ?? 0}</b>
                      <span>Grain</span>
                    </div>
                    <div className="dr-coin">
                      <b>{me?.scholars ?? 0}</b>
                      <span>Scholars</span>
                    </div>
                    <div className="dr-coin">
                      <b>{me?.merit ?? 0}</b>
                      <span>Merit</span>
                    </div>
                    <div className="dr-coin">
                      <b>{me?.astras ?? 0}</b>
                      <span>Astras</span>
                    </div>
                  </div>
                  <div className="dr-actions">
                    <DiceRoller
                      dice={state.dice}
                      disabled={!isMyTurn || state.rolledThisTurn || state.phase !== "playing"}
                      forcedRolling={state.botIsRolling}
                      onRoll={api.roll}
                    />
                    <div className="dr-action-row">
                      <button
                        className="dr-btn"
                        disabled={!canBuy}
                        title={
                          onBuyable
                            ? canBuy
                              ? `Buy for ₹${buyPrice}`
                              : `Need ₹${buyPrice}`
                            : "Not a city or route"
                        }
                        onClick={api.buyCity}
                        id="buy-btn"
                      >
                        {onBuyable ? `🏙 Buy ₹${buyPrice}` : "🏙 Buy"}
                      </button>
                      <button
                        className="dr-btn"
                        disabled={!canExplore}
                        title={!canExplore ? "Can only explore once per turn on a city" : "Seek random fortune or misfortune"}
                        onClick={api.exploreCity}
                        id="explore-btn"
                      >
                        🗺 Explore
                      </button>
                      <button
                        className="dr-btn"
                        disabled={!isMyTurn || !!me?.decreeUsed || state.step !== "action"}
                        onClick={api.useDecree}
                        title={myRani?.decree}
                        id="decree-btn"
                      >
                        📜 Decree
                      </button>
                      <button
                        className="dr-btn primary"
                        disabled={!isMyTurn || !state.rolledThisTurn || state.phase === "ended"}
                        onClick={api.endTurn}
                        id="end-turn-btn"
                      >
                        End Turn →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Selected Tile ── */}
            <div className="dr-panel">
              <div className="dr-panel-header dr-panel-static">
                <span>📍 {selTile.name}</span>
              </div>
              <div className="dr-panel-body dr-tile-detail">
                {selTile.t === "prop" || selTile.t === "route" ? (
                  <>
                    <div className="dr-naadu">
                      {selTile.g ? NAADU[selTile.g] : "Trade"} · Naadu
                    </div>
                    <div className="dr-dname">
                      {selTile.g && (
                        <span
                          className="dr-chip"
                          style={{ background: GROUP_COLORS[selTile.g] }}
                        />
                      )}
                      {selTile.name}
                    </div>
                    <div className="dr-dera">Price ₹{selTile.price}</div>
                    {(() => {
                      const owner = state.players.find((p) =>
                        p.owned.includes(selTile.id)
                      );
                      if (owner)
                        return (
                          <div className="dr-dyes">
                            ★ Held by {owner.id === playerId ? "you" : owner.name}.
                          </div>
                        );
                      return <div className="dr-hint">Unclaimed frontier city.</div>;
                    })()}
                  </>
                ) : (
                  <>
                    <div className="dr-naadu">{selTile.t}</div>
                    <div className="dr-dname">{selTile.name}</div>
                    <div className="dr-dhist">{selTile.desc}</div>
                  </>
                )}
              </div>
            </div>

            {/* ── Frontier ── */}
            <div className="dr-panel">
              <button
                className="dr-panel-header"
                onClick={() => setFrontierOpen((v) => !v)}
              >
                <span>🏯 Frontier</span>
                <span>{frontierOpen ? "▲" : "▼"}</span>
              </button>
              {frontierOpen && (
                <div className="dr-panel-body">
                  <Frontier
                    state={state}
                    me={me}
                    isMyTurn={isMyTurn}
                    onAttempt={api.frontier}
                  />
                </div>
              )}
            </div>

            {/* ── Game Log ── */}
            <div className="dr-panel">
              <button
                className="dr-panel-header"
                onClick={() => setLogOpen((v) => !v)}
              >
                <span>📜 Chronicle</span>
                <span>{logOpen ? "▲" : "▼"}</span>
              </button>
              {logOpen && (
                <div className="dr-panel-body">
                  <div className="dr-log">
                    {state.log
                      .slice(-10)
                      .reverse()
                      .map((l, i) => (
                        <div key={l.t + "-" + i} className="dr-log-line">
                          {l.text}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
