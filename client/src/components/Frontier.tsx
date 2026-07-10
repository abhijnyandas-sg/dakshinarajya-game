import { useState } from "react";
import {
  PALEGALLU,
  NAADU_NAMES,
  RANI_BY_ID,
  ARCHETYPE_COLOR,
  raniBonus,
  type GameState,
  type Player,
  type FrontierMode,
} from "@dakshina/shared";

const DISP_CLASS: Record<string, string> = {
  "Tribute-friendly": "friendly",
  Proud: "proud",
  Hostile: "hostile",
};

const NEGOTIATION_NEED: Record<string, number> = {
  "Tribute-friendly": 3,
  Proud: 6,
  Hostile: 9,
};

export function Frontier({
  state,
  me,
  isMyTurn,
  onAttempt,
}: {
  state: GameState;
  me: Player | undefined;
  isMyTurn: boolean;
  onAttempt: (mode: FrontierMode, villageId: string, astras: number) => void;
}) {
  const [naadu, setNaadu] = useState(NAADU_NAMES[0]);
  const [astras, setAstras] = useState(0);
  const villages = PALEGALLU.filter((v) => v.naadu === naadu);
  const canAct = isMyTurn && state.step === "action" && !state.frontierUsed;
  const bonus = me ? raniBonus(me.raniId) : raniBonus(null);

  function ownerColor(pid: string) {
    const p = state.players.find((q) => q.id === pid);
    const r = p?.raniId ? RANI_BY_ID[p.raniId] : null;
    return (r && ARCHETYPE_COLOR[r.archetype]) || "#777";
  }

  return (
    <div className="dr-frontier">
      <div className="dr-lbl">Frontier — claim the Palegallu</div>
      <div className="dr-naadu-tabs">
        {NAADU_NAMES.map((n) => (
          <button
            key={n}
            className={"dr-ntab" + (n === naadu ? " on" : "")}
            onClick={() => setNaadu(n)}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="dr-astra-row">
        <span>Astras to commit:</span>
        <button
          onClick={() => setAstras((a) => Math.max(0, a - 1))}
          disabled={astras <= 0}
        >
          −
        </button>
        <b>{astras}</b>
        <button
          onClick={() => setAstras((a) => Math.min(me?.astras ?? 0, a + 1))}
          disabled={astras >= (me?.astras ?? 0)}
        >
          +
        </button>
        <span className="dr-hint">(you hold {me?.astras ?? 0})</span>
      </div>

      <div className="dr-village-list">
        {villages.map((v) => {
          const ownerId = state.villages[v.id];
          const mine = ownerId === me?.id;
          const need = v.garrison * 4 + 3;
          const maxConquer = 12 + astras * 2 + bonus.conquer;
          const negotiateNeed = NEGOTIATION_NEED[v.disposition];
          const maxNegotiate = 6 + bonus.negotiate + Math.floor((me?.scholars ?? 0) / 2);

          let negotiateDisabled = !canAct;
          let negotiateReason = "";
          if (!isMyTurn) negotiateReason = "Wait for your turn";
          else if (state.step !== "action" || state.frontierUsed) negotiateReason = "One frontier action per turn";

          let conquerDisabled = !canAct;
          let conquerReason = "";
          if (!isMyTurn) conquerReason = "Wait for your turn";
          else if (state.step !== "action" || state.frontierUsed) conquerReason = "One frontier action per turn";

          return (
            <div
              key={v.id}
              className={"dr-village" + (ownerId ? " taken" : "")}
            >
              <div className="dr-vmain">
                <span className={"dr-disp " + DISP_CLASS[v.disposition]} />
                <span className="dr-vname">{v.name}</span>
                <span className="dr-vmeta">
                  {v.disposition} · garrison {v.garrison}
                </span>
              </div>
              <div className="dr-vreward">{v.rewardText}</div>
              {ownerId ? (
                <div
                  className="dr-vowner"
                  style={{ color: ownerColor(ownerId) }}
                >
                  {mine ? "★ yours" : "held by " +
                    (state.players.find((p) => p.id === ownerId)?.name ?? "rival")}
                </div>
              ) : (
                <div className="dr-vactions">
                  <button
                    disabled={negotiateDisabled}
                    title={
                      negotiateReason ||
                      `Negotiate: ${maxNegotiate} max vs ${negotiateNeed} needed`
                    }
                    onClick={() => onAttempt("negotiate", v.id, 0)}
                  >
                    Negotiate
                  </button>
                  <button
                    disabled={conquerDisabled}
                    title={
                      conquerReason ||
                      `Conquer: ${maxConquer} max vs ${need} needed`
                    }
                    onClick={() => onAttempt("conquer", v.id, astras)}
                  >
                    Conquer
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!canAct && isMyTurn && state.frontierUsed && (
        <div className="dr-hint">One frontier action per turn — end your turn.</div>
      )}
      {!isMyTurn && <div className="dr-hint">Wait for your turn to act on the frontier.</div>}
    </div>
  );
}
