import { SPACES, GROUP_COLORS, NAADU, type GameState } from "@dakshina/shared";
import { CARD_FLAVOR, type CardFlavor } from "../flavor";
import { TileArt } from "./TileArt";

interface Props {
  spaceId: number;
  state: GameState;
  playerId: string | null;
  onClose: () => void;
}

export function TileDetailCard({ spaceId, state, playerId, onClose }: Props) {
  const s = SPACES[spaceId];
  if (!s) return null;

  const isProp = s.t === "prop" || s.t === "route";
  const owner = state.players.find((p) => p.owned.includes(s.id));
  const flavor: CardFlavor | null = CARD_FLAVOR[s.sub || s.t] ?? null;
  const band = s.g ? GROUP_COLORS[s.g] : null;
  const naadu = s.g ? NAADU[s.g] : null;

  // Count how many properties in same group owner has
  const ownerGroupCount = owner && s.g
    ? SPACES.filter((sp) => sp.g === s.g && owner.owned.includes(sp.id)).length
    : 0;
  const groupTotal = s.g
    ? SPACES.filter((sp) => sp.g === s.g).length
    : 0;

  return (
    <div className="tdc-overlay" onClick={onClose}>
      <div className="tdc-card" onClick={(e) => e.stopPropagation()}>
        {/* Color band header */}
        {band && (
          <div className="tdc-band" style={{ background: band }} />
        )}

        {/* Card type badge */}
        <div className="tdc-type-badge">
          {s.t === "prop" ? "City" : s.t === "route" ? "Trade Route" : s.t === "corner" ? (s.sub ?? "Corner") : s.t}
        </div>

        {/* Art area */}
        <div className="tdc-art" style={flavor ? { background: flavor.gradient } : {}}>
          <TileArt type={s.t} sub={s.sub} name={s.name} />
        </div>

        {/* Title */}
        <h3 className="tdc-title">{s.name}</h3>
        {naadu && <div className="tdc-naadu">{naadu} Naadu</div>}

        {/* Flavor text */}
        {flavor && (
          <div className="tdc-flavor">
            <p className="tdc-flavor-text">{flavor.flavor}</p>
            <p className="tdc-mechanical">{flavor.mechanical}</p>
          </div>
        )}

        {/* Property stats */}
        {isProp && (
          <div className="tdc-stats">
            <div className="tdc-stat">
              <span className="tdc-stat-label">Price</span>
              <span className="tdc-stat-value">₹{s.price}</span>
            </div>
            {s.g && (
              <div className="tdc-stat">
                <span className="tdc-stat-label">Group</span>
                <span className="tdc-stat-value">{ownerGroupCount}/{groupTotal}</span>
              </div>
            )}
          </div>
        )}

        {/* Tax info */}
        {s.t === "tax" && s.amt && (
          <div className="tdc-stats">
            <div className="tdc-stat">
              <span className="tdc-stat-label">Tax</span>
              <span className="tdc-stat-value tdc-neg">₹{s.amt}</span>
            </div>
          </div>
        )}

        {/* Ownership */}
        {owner && (
          <div className="tdc-owner">
            ★ Held by {owner.id === playerId ? "you" : owner.name}
          </div>
        )}
        {isProp && !owner && (
          <div className="tdc-unclaimed">Unclaimed frontier city</div>
        )}

        {/* Description */}
        {s.desc && <div className="tdc-desc">{s.desc}</div>}

        {/* Close button */}
        <button className="tdc-close" onClick={onClose} aria-label="Close">✕</button>
      </div>
    </div>
  );
}
