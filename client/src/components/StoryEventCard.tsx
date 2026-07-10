import { GameState } from "@dakshina/shared";
import { EVENTS, StoryChoice } from "@dakshina/shared/src/data/events";

interface Props {
  state: GameState;
  onResolve: (choiceIndex: number) => void;
  mySeat: number;
}

export function StoryEventCard({ state, onResolve, mySeat }: Props) {
  if (state.step !== "event" || !state.activeEvent) return null;

  const event = EVENTS.find((e) => e.id === state.activeEvent!.id);
  if (!event) return null;

  const isMyTurn = state.turn === mySeat;
  const activePlayer = state.players[state.turn];

  return (
    <div className="tdc-overlay">
      <div className="tdc-card">
        {/* Color band header */}
        <div className="tdc-band" style={{ background: "var(--goldDeep)" }} />

        {/* Card type badge */}
        <div className="tdc-type-badge" style={{ background: "var(--paperLight)" }}>
          Story Event
        </div>

        {/* Art area - simple gradient for now, can be expanded later */}
        <div className="tdc-art" style={{ background: "linear-gradient(135deg, #4a2a16, #2a0c0e)", height: "80px" }}>
          <span style={{ fontSize: "32px" }}>📜</span>
        </div>

        {/* Title & Flavor */}
        <h3 className="tdc-title" style={{ marginTop: "24px" }}>{event.title}</h3>
        <div className="tdc-flavor" style={{ border: "none", background: "transparent", marginTop: "8px" }}>
          <p className="tdc-flavor-text" style={{ fontSize: "14px", color: "var(--ink)" }}>
            {event.text}
          </p>
        </div>

        {/* Choices or Waiting State */}
        <div className="tdc-stats" style={{ flexDirection: "column", gap: "12px", margin: "20px 18px 0" }}>
          {isMyTurn ? (
            event.choices.map((choice: StoryChoice, i: number) => (
              <button
                key={i}
                className="dr-btn"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  height: "auto",
                  padding: "12px 16px",
                  background: choice.riskChance < 1.0 ? "rgba(158,42,47,0.05)" : "var(--paperLight)",
                  border: `1px solid ${choice.riskChance < 1.0 ? "rgba(158,42,47,0.3)" : "var(--paperDark)"}`
                }}
                onClick={() => onResolve(i)}
              >
                <div style={{ fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>
                  {choice.label}
                </div>
                <div style={{ fontSize: "11px", color: "var(--inkSoft)", display: "flex", gap: "8px" }}>
                  <span>{choice.riskChance === 1.0 ? "100% Safe" : `${Math.round(choice.riskChance * 100)}% Success Chance`}</span>
                </div>
              </button>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "24px", color: "var(--inkSoft)", fontStyle: "italic" }}>
              Waiting for {activePlayer?.name} to make a choice...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
