import React from "react";

/* ═══════════════════════════════════════════════════════════════════
   TileArt — Inline SVG illustrations for every board space type.
   Each renders at the tile's natural size via CSS (tile-svg-art class).
   ═══════════════════════════════════════════════════════════════════ */

export function YagnaArt() {
  return (
    <svg viewBox="0 0 60 60" className="tile-svg-art" aria-hidden="true">
      <rect x="18" y="42" width="24" height="8" rx="1" fill="#8D6E63" stroke="#5D4037" strokeWidth=".8"/>
      <line x1="24" y1="42" x2="36" y2="38" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="36" y1="42" x2="24" y2="38" stroke="#4E342E" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M30 10 Q22 30 28 42 Q30 43 32 42 Q38 30 30 10Z" fill="#FFEB3B"/>
      <path d="M28 18 Q23 34 28 42 Q30 43 32 42 Q37 34 32 18Z" fill="#FF9800" opacity=".85"/>
      <path d="M30 28 Q26 36 29 42 Q30 43 31 42 Q34 36 30 28Z" fill="#F44336" opacity=".9"/>
    </svg>
  );
}

export function FestivalArt() {
  return (
    <svg viewBox="0 0 60 60" className="tile-svg-art" aria-hidden="true">
      <path d="M12 48 Q12 16 30 16 Q48 16 48 48" fill="none" stroke="#E65100" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="38" r="2.5" fill="#FFEB3B"/>
      <circle cx="18" cy="24" r="2.5" fill="#FF9800"/>
      <circle cx="30" cy="16" r="3" fill="#E91E63"/>
      <circle cx="42" cy="24" r="2.5" fill="#FF9800"/>
      <circle cx="48" cy="38" r="2.5" fill="#FFEB3B"/>
      <rect x="24" y="34" width="12" height="14" rx="1" fill="#FF8F00" stroke="#E65100" strokeWidth=".8"/>
      <circle cx="30" cy="30" r="5" fill="#FFC107"/>
      <path d="M28 26 L30 22 L32 26Z" fill="#E65100"/>
    </svg>
  );
}

export function PlanetArt() {
  return (
    <svg viewBox="0 0 60 60" className="tile-svg-art" aria-hidden="true">
      <circle cx="30" cy="30" r="24" fill="#1A237E" stroke="#5C6BC0" strokeWidth="1"/>
      <circle cx="30" cy="30" r="16" fill="none" stroke="#FFD54F" strokeWidth=".7" opacity=".5" strokeDasharray="2 2"/>
      <ellipse cx="30" cy="30" rx="20" ry="8" fill="none" stroke="#FFC107" strokeWidth="1" transform="rotate(-30 30 30)" opacity=".7"/>
      <circle cx="30" cy="30" r="5" fill="#FFF"/>
      <circle cx="42" cy="24" r="2.5" fill="#29B6F6"/>
      <circle cx="18" cy="36" r="1.8" fill="#FF7043"/>
      <circle cx="22" cy="20" r=".7" fill="#FFF"/><circle cx="40" cy="40" r=".7" fill="#FFF"/>
    </svg>
  );
}

export function WeaponArt() {
  return (
    <svg viewBox="0 0 60 60" className="tile-svg-art" aria-hidden="true">
      <circle cx="30" cy="30" r="20" fill="#B0BEC5" stroke="#37474F" strokeWidth="1.5"/>
      <circle cx="30" cy="30" r="15" fill="#CFD8DC"/>
      <circle cx="30" cy="30" r="4" fill="#90A4AE"/>
      <g transform="rotate(45 30 30)">
        <rect x="29" y="8" width="2.5" height="38" rx="1" fill="#ECEFF1" stroke="#455A64" strokeWidth=".7"/>
        <rect x="25" y="42" width="10" height="2" rx=".5" fill="#FFC107"/>
        <rect x="28" y="44" width="4" height="8" rx=".5" fill="#8D6E63"/>
      </g>
      <g transform="rotate(-45 30 30)">
        <rect x="29" y="8" width="2.5" height="38" rx="1" fill="#ECEFF1" stroke="#455A64" strokeWidth=".7"/>
        <rect x="25" y="42" width="10" height="2" rx=".5" fill="#FFC107"/>
        <rect x="28" y="44" width="4" height="8" rx=".5" fill="#8D6E63"/>
      </g>
    </svg>
  );
}

export function TaxArt() {
  return (
    <svg viewBox="0 0 60 60" className="tile-svg-art" aria-hidden="true">
      <line x1="30" y1="12" x2="30" y2="50" stroke="#7B5C10" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="18" y1="50" x2="42" y2="50" stroke="#7B5C10" strokeWidth="3" strokeLinecap="round"/>
      <line x1="14" y1="22" x2="46" y2="22" stroke="#D9AC4C" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="30" cy="22" r="3" fill="#7B5C10"/>
      <line x1="14" y1="22" x2="10" y2="36" stroke="#B8893C" strokeWidth=".8"/>
      <line x1="14" y1="22" x2="18" y2="36" stroke="#B8893C" strokeWidth=".8"/>
      <path d="M7 36 Q14 40 21 36Z" fill="#D9AC4C" stroke="#7B5C10" strokeWidth=".7"/>
      <circle cx="13" cy="34" r="2.5" fill="#FFD54F" stroke="#B8893C" strokeWidth=".4"/>
      <line x1="46" y1="22" x2="42" y2="36" stroke="#B8893C" strokeWidth=".8"/>
      <line x1="46" y1="22" x2="50" y2="36" stroke="#B8893C" strokeWidth=".8"/>
      <path d="M39 36 Q46 40 53 36Z" fill="#D9AC4C" stroke="#7B5C10" strokeWidth=".7"/>
      <circle cx="45" cy="34" r="2.5" fill="#FFD54F" stroke="#B8893C" strokeWidth=".4"/>
    </svg>
  );
}

export function RouteArt() {
  return (
    <svg viewBox="0 0 60 60" className="tile-svg-art" aria-hidden="true">
      <path d="M10 30 C 22 28, 38 32, 50 30" fill="none" stroke="#A1887F" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 2"/>
      <path d="M30 10 C 28 22, 32 38, 30 50" fill="none" stroke="#A1887F" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 2"/>
      <circle cx="30" cy="30" r="8" fill="#D9AC4C" stroke="#7B5C10" strokeWidth="1"/>
      <circle cx="30" cy="30" r="5" fill="#7B5C10"/>
      <polygon points="30,18 32,26 28,26" fill="#D84315"/>
      <polygon points="30,42 32,34 28,34" fill="#37474F"/>
    </svg>
  );
}

export function CourtArt() {
  return (
    <svg viewBox="0 0 60 60" className="tile-svg-art" aria-hidden="true">
      <rect x="14" y="30" width="32" height="22" fill="#CFD8DC" stroke="#37474F" strokeWidth="1.2"/>
      <path d="M25 52 Q30 38 35 52Z" fill="#4E342E"/>
      <line x1="30" y1="12" x2="30" y2="30" stroke="#7B5C10" strokeWidth="1.5"/>
      <path d="M22 22 Q30 12 38 22Z" fill="#FFD54F" stroke="#7B5C10" strokeWidth=".8"/>
      <path d="M24 18 Q30 10 36 18Z" fill="#FFF" stroke="#7B5C10" strokeWidth=".6"/>
      <circle cx="30" cy="38" r="4" fill="#D84315"/>
    </svg>
  );
}

export function ExileArt() {
  return (
    <svg viewBox="0 0 60 60" className="tile-svg-art" aria-hidden="true">
      <path d="M30 52 Q24 40 24 30 Q24 22 33 22 Q42 22 42 30 Q42 40 36 52Z" fill="#5D4037" stroke="#3E2723" strokeWidth="1"/>
      <circle cx="20" cy="24" r="12" fill="#2E7D32" opacity=".85"/>
      <circle cx="33" cy="18" r="14" fill="#1B5E20" opacity=".85"/>
      <circle cx="42" cy="26" r="10" fill="#388E3C" opacity=".8"/>
      <polygon points="46,48 52,42 58,48" fill="#D84315" stroke="#3E2723" strokeWidth=".7"/>
      <rect x="48" y="48" width="8" height="6" fill="#D7CCC8" stroke="#3E2723" strokeWidth=".7"/>
    </svg>
  );
}

export function LotusArt() {
  return (
    <svg viewBox="0 0 60 60" className="tile-svg-art" aria-hidden="true">
      <rect x="4" y="4" width="52" height="52" rx="6" fill="#0D1B2A"/>
      <circle cx="46" cy="16" r="5" fill="#FFE082"/>
      <circle cx="43" cy="16" r="5" fill="#0D1B2A"/>
      <path d="M16 50 L44 50 L44 44 Q44 26 30 26 Q16 26 16 44Z" fill="#E0E1DD" stroke="#1B263B" strokeWidth="1.2"/>
      <rect x="26" y="20" width="8" height="6" fill="#778DA9" stroke="#1B263B" strokeWidth=".8"/>
      <line x1="30" y1="14" x2="30" y2="20" stroke="#FFD54F" strokeWidth="1.2"/>
      <ellipse cx="30" cy="50" rx="8" ry="5" fill="#F06292" opacity=".7"/>
    </svg>
  );
}

export function BanishArt() {
  return (
    <svg viewBox="0 0 60 60" className="tile-svg-art" aria-hidden="true">
      <rect x="4" y="4" width="52" height="52" rx="6" fill="#BF360C" opacity=".8"/>
      <g transform="translate(30,34) rotate(-12)">
        <rect x="-16" y="-8" width="32" height="16" rx="1.5" fill="#FAF1D6" stroke="#5D4037" strokeWidth="1"/>
        <line x1="-10" y1="-3" x2="10" y2="-3" stroke="#8D6E63" strokeWidth=".7"/>
        <line x1="-10" y1="0" x2="8" y2="0" stroke="#8D6E63" strokeWidth=".7"/>
        <line x1="-10" y1="3" x2="6" y2="3" stroke="#8D6E63" strokeWidth=".7"/>
        <circle cx="10" cy="2" r="2.5" fill="#D84315"/>
      </g>
      <path d="M22 16 L26 10 L22 8Z" fill="#D84315"/>
      <line x1="22" y1="8" x2="22" y2="20" stroke="#FFF" strokeWidth="1"/>
      <path d="M38 16 L42 10 L38 8Z" fill="#D84315"/>
      <line x1="38" y1="8" x2="38" y2="20" stroke="#FFF" strokeWidth="1"/>
    </svg>
  );
}

export function CityArt({ name }: { name: string }) {
  // Buddhist site
  if (["Amaravati","Bhattiprolu","Jaggayyapeta","Nagarjunakonda"].some(n => name.includes(n))) {
    return (
      <svg viewBox="0 0 60 60" className="tile-svg-art" aria-hidden="true">
        <path d="M18 46 L42 46 L42 40 Q42 22 30 22 Q18 22 18 40Z" fill="#ECEFF1" stroke="#546E7A" strokeWidth="1"/>
        <rect x="25" y="14" width="10" height="8" fill="#CFD8DC" stroke="#546E7A" strokeWidth=".8"/>
        <line x1="30" y1="6" x2="30" y2="14" stroke="#546E7A" strokeWidth="1.5"/>
        <circle cx="30" cy="5" r="2" fill="#FFC107"/>
      </svg>
    );
  }
  // Port
  if (["Masulipatnam","Ghantasala","Kalingapatnam"].some(n => name.includes(n))) {
    return (
      <svg viewBox="0 0 60 60" className="tile-svg-art" aria-hidden="true">
        <rect x="10" y="16" width="8" height="30" fill="#CFD8DC" stroke="#546E7A" strokeWidth=".8"/>
        <polygon points="7,16 14,8 21,16" fill="#FF7043" stroke="#546E7A" strokeWidth=".6"/>
        <path d="M28 38 L52 38 L48 46 L32 46Z" fill="#8D6E63" stroke="#546E7A" strokeWidth=".8"/>
        <line x1="40" y1="18" x2="40" y2="38" stroke="#546E7A" strokeWidth="1.5"/>
        <polygon points="40,20 50,28 40,32" fill="#FFF" stroke="#546E7A" strokeWidth=".6"/>
      </svg>
    );
  }
  // Default fortress
  return (
    <svg viewBox="0 0 60 60" className="tile-svg-art" aria-hidden="true">
      <rect x="10" y="30" width="40" height="16" fill="#CFD8DC" stroke="#546E7A" strokeWidth="1"/>
      <rect x="10" y="16" width="10" height="14" fill="#B0BEC5" stroke="#546E7A" strokeWidth=".8"/>
      <polygon points="8,16 15,8 22,16" fill="#546E7A"/>
      <rect x="40" y="16" width="10" height="14" fill="#B0BEC5" stroke="#546E7A" strokeWidth=".8"/>
      <polygon points="38,16 45,8 52,16" fill="#546E7A"/>
      <path d="M25 46 Q30 36 35 46Z" fill="#4E342E"/>
    </svg>
  );
}

/* ── Master dispatcher ────────────────────────────────────────────── */
export function TileArt({ type, sub, name }: { type: string; sub?: string; name: string }) {
  if (type === "yagna") return <YagnaArt />;
  if (type === "festival") return <FestivalArt />;
  if (type === "planet") return <PlanetArt />;
  if (type === "weapon") return <WeaponArt />;
  if (type === "tax") return <TaxArt />;
  if (type === "route") return <RouteArt />;
  if (type === "prop") return <CityArt name={name} />;
  if (type === "corner") {
    if (sub === "court") return <CourtArt />;
    if (sub === "exile") return <ExileArt />;
    if (sub === "lotus") return <LotusArt />;
    if (sub === "banish") return <BanishArt />;
  }
  return null;
}
