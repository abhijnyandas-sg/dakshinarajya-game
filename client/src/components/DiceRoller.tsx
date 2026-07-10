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
        {/* Die body */}
        <rect x="4" y="4" width="92" height="92" rx="18" fill="#FAF1D6" stroke="#7B5C10" strokeWidth="2.5" />
        {/* Subtle inner shadow */}
        <rect x="8" y="8" width="84" height="84" rx="14" fill="none" stroke="#C9B27A" strokeWidth="1" opacity="0.5" />
        {/* Dots */}
        {dots.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="7" fill="#2A1610" />
        ))}
      </svg>
    </div>
  );
}

export function DiceRoller({
  dice,
  disabled,
  onRoll,
}: {
  dice: [number, number];
  disabled: boolean;
  onRoll: () => void;
}) {
  const [rolling, setRolling] = useState(false);
  const [display, setDisplay] = useState<[number, number]>(dice);

  // When real dice change after animation, update display
  useEffect(() => {
    if (!rolling) setDisplay(dice);
  }, [dice, rolling]);

  function handleRoll() {
    if (disabled || rolling) return;
    setRolling(true);
    // Shuffle display values during animation
    let frame = 0;
    const interval = setInterval(() => {
      setDisplay([
        (Math.floor(Math.random() * 6) + 1) as 1,
        (Math.floor(Math.random() * 6) + 1) as 1,
      ]);
      frame++;
      if (frame >= 8) {
        clearInterval(interval);
        setRolling(false);
      }
    }, 75);
    onRoll();
  }

  return (
    <div className="dr-roller">
      <div className="dr-dice-wrap">
        <DieFace value={display[0]} rolling={rolling} />
        <DieFace value={display[1]} rolling={rolling} />
      </div>
      {!rolling && dice[0] > 0 && (
        <div className="dr-dice-total">
          {dice[0] + dice[1]}
        </div>
      )}
      <button
        className="dr-btn primary dr-roll-btn"
        disabled={disabled || rolling}
        onClick={handleRoll}
        id="roll-btn"
      >
        {rolling ? "Rolling…" : "Roll Dice"}
      </button>
    </div>
  );
}
