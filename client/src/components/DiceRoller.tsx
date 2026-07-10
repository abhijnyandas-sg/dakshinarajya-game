import { useState, useEffect } from "react";

// Dot patterns for faces 1-6
const DOTS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 22], [75, 22], [25, 50], [75, 50], [25, 78], [75, 78]],
};

function DieFace({ value, rolling }: { value: number; rolling: boolean }) {
  const dots = DOTS[value] ?? DOTS[1];
  return (
    <div
      className={"dr-die-face" + (rolling ? " dr-die-rolling" : " dr-die-settled")}
      aria-label={`Die showing ${value}`}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Die body with premium shadow */}
        <defs>
          <linearGradient id="dieFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF8E8" />
            <stop offset="100%" stopColor="#E8D4A0" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="92" height="92" rx="18" fill="url(#dieFaceGrad)" stroke="#7B5C10" strokeWidth="2.5" />
        {/* Inner highlight edge */}
        <rect x="8" y="8" width="84" height="84" rx="14" fill="none" stroke="#FFF" strokeWidth="1" opacity="0.4" />
        {/* Dots */}
        {dots.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="7.5" fill="#2A1610" />
        ))}
      </svg>
    </div>
  );
}

export function DiceRoller({
  dice,
  disabled,
  forcedRolling,
  onRoll,
}: {
  dice: [number, number];
  disabled: boolean;
  forcedRolling?: boolean;
  onRoll: () => void;
}) {
  const [rolling, setRolling] = useState(false);
  const [display, setDisplay] = useState<[number, number]>(dice);

  // When real dice change after animation, update display
  useEffect(() => {
    if (!rolling && !forcedRolling) setDisplay(dice);
  }, [dice, rolling, forcedRolling]);

  // Handle external AI rolling state
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (forcedRolling) {
      interval = setInterval(() => {
        setDisplay([
          (Math.floor(Math.random() * 6) + 1) as 1,
          (Math.floor(Math.random() * 6) + 1) as 1,
        ]);
      }, 75);
    }
    return () => clearInterval(interval);
  }, [forcedRolling]);

  function handleRoll() {
    if (disabled || rolling) return;
    setRolling(true);
    // ~2 second longer animation: start fast, slow down at the end
    let frame = 0;
    const totalFrames = 24; // More frames = longer animation
    const tick = () => {
      setDisplay([
        (Math.floor(Math.random() * 6) + 1) as 1,
        (Math.floor(Math.random() * 6) + 1) as 1,
      ]);
      frame++;
      if (frame >= totalFrames) {
        setRolling(false);
        return;
      }
      // Ease-out: start fast (60ms), slow down to 200ms near the end
      const progress = frame / totalFrames;
      const delay = 60 + Math.floor(progress * progress * 160);
      setTimeout(tick, delay);
    };
    tick();
    onRoll();
  }

  return (
    <div className="dr-roller">
      <div className="dr-dice-wrap">
        <DieFace value={display[0]} rolling={rolling} />
        <DieFace value={display[1]} rolling={rolling} />
      </div>
      {(rolling || forcedRolling) && <div className="dr-dice-rolling-label">🎲 Rolling…</div>}
      {!(rolling || forcedRolling) && dice[0] > 0 && (
        <div className="dr-dice-total">
          {dice[0] + dice[1]}
        </div>
      )}
      <button
        className="dr-btn primary dr-roll-btn"
        disabled={disabled || rolling || forcedRolling}
        onClick={handleRoll}
        id="roll-btn"
      >
        {rolling || forcedRolling ? "🎲 Rolling…" : "🎲 Roll Dice"}
      </button>
    </div>
  );
}
