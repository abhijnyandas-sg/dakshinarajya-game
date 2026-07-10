import { useEffect, useState } from "react";
import type { CardRevealPayload } from "@dakshina/shared";
import { CARD_FLAVOR } from "../flavor";

// SVG card art for each type
function FestivalArt() {
  return (
    <svg viewBox="0 0 200 200" className="cr-art-svg" aria-hidden="true">
      <defs>
        <radialGradient id="fBg" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#FF8C42" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7B2D00" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Lotus base */}
      <ellipse cx="100" cy="160" rx="60" ry="10" fill="#E65010" opacity="0.3" />
      {/* Petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse
          key={i}
          cx={100 + 35 * Math.sin((angle * Math.PI) / 180)}
          cy={110 + 35 * -Math.cos((angle * Math.PI) / 180)}
          rx="12" ry="22"
          transform={`rotate(${angle}, ${100 + 35 * Math.sin((angle * Math.PI) / 180)}, ${110 + 35 * -Math.cos((angle * Math.PI) / 180)})`}
          fill="#FF8C42" opacity="0.7"
        />
      ))}
      {/* Center circle */}
      <circle cx="100" cy="110" r="18" fill="#FFD580" />
      <circle cx="100" cy="110" r="12" fill="#E6510E" />
      {/* Shrine arch */}
      <path d="M60 170 Q60 90 100 80 Q140 90 140 170" fill="none" stroke="#C94A0A" strokeWidth="2" opacity="0.5"/>
      {/* Stars */}
      {[[30,40],[170,30],[50,60],[155,55]].map(([x,y],i) => (
        <text key={i} x={x} y={y} fontSize="10" fill="#FFD580" opacity="0.6">✦</text>
      ))}
      <circle cx="100" cy="110" r="80" fill="url(#fBg)" />
    </svg>
  );
}

function YagnaArt() {
  return (
    <svg viewBox="0 0 200 200" className="cr-art-svg" aria-hidden="true">
      <defs>
        <radialGradient id="yFire" cx="50%" cy="70%" r="50%">
          <stop offset="0%" stopColor="#FFF176" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#FF8C00" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#8B0000" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Altar base */}
      <rect x="65" y="150" width="70" height="20" rx="4" fill="#8B6914" />
      <rect x="55" y="145" width="90" height="10" rx="3" fill="#A07820" />
      {/* Logs */}
      <rect x="70" y="138" width="60" height="8" rx="3" fill="#6B4A10" transform="rotate(-10 100 142)" />
      <rect x="70" y="138" width="60" height="8" rx="3" fill="#5A3A0A" transform="rotate(10 100 142)" />
      {/* Flames */}
      <path d="M100 60 Q85 90 90 130 Q100 115 100 130 Q110 115 110 130 Q115 90 100 60Z" fill="url(#yFire)" />
      <path d="M100 80 Q88 105 92 135 Q100 122 100 135 Q108 122 108 135 Q112 105 100 80Z" fill="#FFF176" opacity="0.8" />
      {/* Smoke wisps */}
      <path d="M95 55 Q88 35 95 20" fill="none" stroke="#888" strokeWidth="1.5" opacity="0.4" strokeDasharray="3,3"/>
      <path d="M105 50 Q115 28 108 15" fill="none" stroke="#888" strokeWidth="1.5" opacity="0.3" strokeDasharray="3,3"/>
      {/* OM symbol */}
      <text x="87" y="178" fontSize="18" fill="#FFD580" fontFamily="serif">ॐ</text>
      {/* Glowing ring */}
      <circle cx="100" cy="110" r="70" fill="none" stroke="#FF8C00" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

function PlanetArt() {
  return (
    <svg viewBox="0 0 200 200" className="cr-art-svg" aria-hidden="true">
      <defs>
        <radialGradient id="pGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7B68EE" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1A0A4A" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Stars */}
      {[[20,20],[180,15],[40,80],[170,60],[30,140],[165,130],[80,170],[140,175]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i%2===0?1.5:1} fill="white" opacity={0.4+i*0.07} />
      ))}
      {/* Orbit ring */}
      <ellipse cx="100" cy="100" rx="75" ry="30" fill="none" stroke="#9980F2" strokeWidth="1" opacity="0.5" />
      {/* Saturn body */}
      <circle cx="100" cy="100" r="35" fill="#4A3B8C" />
      <circle cx="100" cy="100" r="35" fill="none" stroke="#7B68EE" strokeWidth="2" opacity="0.6"/>
      {/* Planet ring (in front) */}
      <ellipse cx="100" cy="100" rx="55" ry="22" fill="none" stroke="#9980F2" strokeWidth="3" opacity="0.7" strokeDasharray="2,2"/>
      {/* Glowing dot */}
      <circle cx="100" cy="100" r="12" fill="#C3B9FF" opacity="0.4" />
      {/* Ancient astrolabe marks */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => (
        <line
          key={i}
          x1={100 + 38 * Math.cos((a*Math.PI)/180)}
          y1={100 + 38 * Math.sin((a*Math.PI)/180)}
          x2={100 + 44 * Math.cos((a*Math.PI)/180)}
          y2={100 + 44 * Math.sin((a*Math.PI)/180)}
          stroke="#9980F2" strokeWidth="1" opacity="0.5"
        />
      ))}
      <circle cx="100" cy="100" r="90" fill="url(#pGlow)" />
    </svg>
  );
}

function WeaponArt() {
  return (
    <svg viewBox="0 0 200 200" className="cr-art-svg" aria-hidden="true">
      <defs>
        <linearGradient id="wBlade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8E8E8" />
          <stop offset="50%" stopColor="#7BB8C4" />
          <stop offset="100%" stopColor="#2E6B80" />
        </linearGradient>
        <radialGradient id="wGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7BB8C4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0A2A30" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Glow bg */}
      <circle cx="100" cy="100" r="80" fill="url(#wGlow)" />
      {/* Khadga (sword) */}
      <path d="M100 30 L110 140 L100 150 L90 140 Z" fill="url(#wBlade)" stroke="#AAC8D0" strokeWidth="0.5"/>
      {/* Crossguard */}
      <rect x="78" y="138" width="44" height="8" rx="4" fill="#C9A24B" />
      {/* Handle */}
      <rect x="94" y="146" width="12" height="28" rx="4" fill="#8B6914" />
      <rect x="96" y="146" width="8" height="28" rx="3" fill="#A07820" opacity="0.5"/>
      {/* Divine glow lines */}
      {[45,90,135,225,270,315].map((a,i) => (
        <line
          key={i}
          x1={100 + 12 * Math.cos((a*Math.PI)/180)}
          y1={85 + 12 * Math.sin((a*Math.PI)/180)}
          x2={100 + 28 * Math.cos((a*Math.PI)/180)}
          y2={85 + 28 * Math.sin((a*Math.PI)/180)}
          stroke="#7BB8C4" strokeWidth="1" opacity="0.5"
        />
      ))}
      {/* Chakra */}
      <circle cx="148" cy="65" r="16" fill="none" stroke="#C9A24B" strokeWidth="2" opacity="0.7"/>
      <circle cx="148" cy="65" r="6" fill="#C9A24B" opacity="0.5"/>
      {[0,45,90,135,180,225,270,315].map((a,i)=>(
        <line key={i}
          x1={148+8*Math.cos(a*Math.PI/180)} y1={65+8*Math.sin(a*Math.PI/180)}
          x2={148+14*Math.cos(a*Math.PI/180)} y2={65+14*Math.sin(a*Math.PI/180)}
          stroke="#C9A24B" strokeWidth="1.5" opacity="0.7"
        />
      ))}
    </svg>
  );
}

const ART_MAP: Record<string, () => JSX.Element> = {
  festival: FestivalArt,
  yagna: YagnaArt,
  planet: PlanetArt,
  weapon: WeaponArt,
};

export function CardReveal({
  payload,
  onDismiss,
}: {
  payload: CardRevealPayload | null;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (payload) {
      setVisible(true);
      setFlipped(false);
      const t1 = setTimeout(() => setFlipped(true), 80);
      const t2 = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 400);
      }, 5000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [payload]);

  if (!payload) return null;

  const flavor = CARD_FLAVOR[payload.type];
  const Art = ART_MAP[payload.type] ?? (() => <span style={{fontSize:64}}>✦</span>);
  const amtLabel = payload.amount !== undefined
    ? (payload.amount > 0 ? `+${payload.amount} Gold` : `${payload.amount} Gold`)
    : null;

  return (
    <div
      className={"cr-overlay" + (visible ? " cr-visible" : "")}
      onClick={() => { setVisible(false); setTimeout(onDismiss, 400); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Card reveal: ${payload.spaceName}`}
    >
      <div className={"cr-scene" + (flipped ? " cr-flipped" : "")}>
        {/* Back of card */}
        <div className="cr-card cr-back">
          <div className="cr-back-inner">
            <div className="cr-back-seal">✦</div>
            <div className="cr-back-text">Dakshina Rajya</div>
          </div>
        </div>

        {/* Front of card */}
        <div
          className="cr-card cr-front"
          style={{ background: flavor?.gradient ?? "linear-gradient(135deg,#2a1a0a,#4a3020)" }}
        >
          <div className="cr-card-header">
            <div className="cr-card-type">{payload.type.toUpperCase()}</div>
            <div className="cr-card-title">{payload.spaceName}</div>
          </div>
          <div className="cr-card-art">
            <Art />
          </div>
          <div className="cr-card-player">✦ {payload.playerName} ✦</div>
          <div className="cr-card-flavor">{flavor?.flavor}</div>
          <div className="cr-card-effect">
            {amtLabel && <span className={"cr-amount" + (payload.amount! > 0 ? " cr-pos" : " cr-neg")}>{amtLabel}</span>}
            {flavor?.mechanical}
          </div>
          <div className="cr-dismiss-hint">Tap to dismiss</div>
        </div>
      </div>
    </div>
  );
}
