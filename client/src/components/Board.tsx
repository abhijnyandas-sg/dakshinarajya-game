import {
  SPACES,
  gridPos,
  side,
  GROUP_COLORS,
  ARCHETYPE_COLOR,
  RANI_BY_ID,
  type GameState,
} from "@dakshina/shared";

const GLYPH: Record<string, string> = {
  festival: "✿",
  yagna: "🔥",
  planet: "☿",
  weapon: "⚔",
  tax: "⚖",
  route: "⛬",
  court: "♛",
  exile: "🌲",
  lotus: "☸",
  banish: "⚑",
};

function playerColor(state: GameState, pid: string): string {
  const p = state.players.find((q) => q.id === pid);
  const r = p?.raniId ? RANI_BY_ID[p.raniId] : null;
  return (r && ARCHETYPE_COLOR[r.archetype]) || "#9E2A2F";
}

function playerInitial(state: GameState, pid: string): string {
  const p = state.players.find((q) => q.id === pid);
  return (p?.name?.[0] ?? "?").toUpperCase();
}

export function Board({
  state,
  selected,
  myPlayerId,
  onSelect,
}: {
  state: GameState;
  selected: number;
  myPlayerId: string | null;
  onSelect: (id: number) => void;
}) {
  const currentPlayer = state.players[state.turn];

  return (
    <div className="dr-board">
      {SPACES.map((s) => {
        const sd = side(s.id);
        const [row, col] = gridPos(s.id);
        const isProp = s.t === "prop" || s.t === "route";
        const band = s.g ? GROUP_COLORS[s.g] : null;
        const owner = state.players.find((p) => p.owned.includes(s.id));
        const here = state.players.filter((p) => p.pos === s.id);
        const cls = [
          "dr-tile",
          sd,
          selected === s.id ? "sel" : "",
          isProp ? "" : "sp",
          s.t === "corner" ? "corner" : "",
        ].join(" ");
        return (
          <button
            key={s.id}
            className={cls}
            style={{ gridRow: row, gridColumn: col }}
            onClick={() => onSelect(s.id)}
            aria-label={s.name}
          >
            {band && <span className="dr-band" style={{ background: band }} />}
            {/* Ownership flag strip */}
            {owner && (
              <span
                className="dr-own-flag"
                style={{ background: playerColor(state, owner.id) }}
              />
            )}
            <span className="dr-body">
              {isProp ? (
                <>
                  <span className="dr-nm">{s.name}</span>
                  <span className="dr-pr">₹{s.price}</span>
                </>
              ) : (
                <>
                  <span className="dr-glyph">{GLYPH[s.sub || s.t] || "•"}</span>
                  <span className="dr-nm">{s.name}</span>
                </>
              )}
            </span>
            {/* Player tokens — prominently sized */}
            {here.length > 0 && (
              <div className="dr-tokens">
                {here.map((p) => {
                  const isActive = currentPlayer?.id === p.id;
                  const isMe = p.id === myPlayerId;
                  return (
                    <span
                      key={p.id}
                      className={
                        "dr-token" +
                        (isActive ? " dr-token-active" : "") +
                        (isMe ? " dr-token-me" : "") +
                        (p.isBot ? " dr-token-bot" : "")
                      }
                      title={`${p.name}${p.isBot ? " (AI)" : ""}${isActive ? " — current turn" : ""}`}
                      style={{
                        background: playerColor(state, p.id),
                        borderColor: isActive ? "#FFD580" : isMe ? "#fff" : "#fff8",
                      }}
                    >
                      {playerInitial(state, p.id)}
                    </span>
                  );
                })}
              </div>
            )}
          </button>
        );
      })}
      <div className="dr-center">
        <div className="dr-center-seal" />
        <h2>
          Dakshina
          <br />
          Rajya
        </h2>
        <div className="dr-era">Kingdom of the South</div>
        <div className="dr-center-te">దక్షిణ రాజ్య</div>
        <div className="dr-turn">
          {state.players[state.turn]?.name}&rsquo;s turn · Round {state.round}
        </div>
      </div>
    </div>
  );
}
