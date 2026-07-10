import {
  RANIS,
  ARCHETYPE_COLOR,
  type GameState,
  type Player,
} from "@dakshina/shared";

export function RaniPicker({
  state,
  me,
  onChoose,
}: {
  state: GameState;
  me: Player | undefined;
  onChoose: (raniId: string) => void;
}) {
  const takenBy = (raniId: string) =>
    state.players.find((p) => p.raniId === raniId && p.id !== me?.id);

  const selected = me?.raniId ? RANIS.find((r) => r.id === me.raniId) : null;

  return (
    <div className="dr-rani-wrap">
      <div className="dr-lbl">Choose your Rani</div>
      <div className="dr-rani-grid">
        {RANIS.map((r) => {
          const taken = takenBy(r.id);
          const on = me?.raniId === r.id;
          return (
            <button
              key={r.id}
              className={"dr-rani" + (on ? " on" : "") + (taken ? " taken" : "")}
              disabled={!!taken}
              onClick={() => onChoose(r.id)}
              title={`${r.passive}\n\nDecree: ${r.decree}`}
            >
              <span
                className="dr-av"
                style={{ background: ARCHETYPE_COLOR[r.archetype] }}
              >
                {r.name[0]}
              </span>
              <span className="dr-rn">{r.name}</span>
              <span className={"dr-tier " + r.origin}>{r.origin}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="dr-rani-detail">
          <div className="dr-rd-name">{selected.name}</div>
          <div className="dr-rd-meta">
            {selected.dynasty} · {selected.era}
          </div>
          <div className="dr-rd-line">
            <b>Passive.</b> {selected.passive}
          </div>
          <div className="dr-rd-line">
            <b>Decree.</b> {selected.decree}
          </div>
          <div className="dr-rd-note">{selected.note}</div>
        </div>
      )}
    </div>
  );
}
