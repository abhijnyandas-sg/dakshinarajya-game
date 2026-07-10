import { useState, useEffect } from "react";
import { GameState, RANI_BY_ID } from "@dakshina/shared";
import { RANI_ROLEPLAY } from "../flavor";

interface Props {
  state: GameState;
  onComplete: () => void;
}

export function IntroSlideshow({ state, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  // Filter out players who haven't picked a Rani, just in case
  const players = state.players.filter((p) => p.raniId);

  useEffect(() => {
    if (players.length === 0) {
      onComplete();
      return;
    }

    // Each slide lasts 4 seconds
    const slideDuration = 4000;
    
    if (currentIndex >= players.length) {
      setFadingOut(true);
      const timer = setTimeout(() => {
        onComplete();
      }, 800); // Wait for fade out animation
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, slideDuration);

    return () => clearTimeout(timer);
  }, [currentIndex, players.length, onComplete]);

  if (players.length === 0 || currentIndex > players.length) return null;

  const currentPlayer = players[currentIndex] || players[players.length - 1];
  const rani = RANI_BY_ID[currentPlayer.raniId!];
  const roleplay = RANI_ROLEPLAY[rani.archetype];

  return (
    <div className={`dr-intro-slideshow ${fadingOut ? "dr-fade-out" : ""}`}>
      {/* Background with abstract cinematic glow */}
      <div className="dr-intro-bg" />
      
      <div className="dr-intro-content" key={currentIndex}>
        <div className="dr-intro-avatar">
          {currentPlayer.name[0]}
        </div>
        <h2 className="dr-intro-player-name">
          {currentPlayer.name} {currentPlayer.isBot ? "(AI)" : ""}
        </h2>
        <h1 className="dr-intro-rani-name">
          {rani.name}
        </h1>
        <div className="dr-intro-roleplay">
          <p>"{roleplay}"</p>
        </div>
        <div className="dr-intro-stats">
          Passive: {rani.passive} <br/>
          Decree: {rani.decree}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="dr-intro-progress">
        {players.map((_, i) => (
          <div 
            key={i} 
            className={`dr-intro-dot ${i === currentIndex ? "active" : i < currentIndex ? "done" : ""}`} 
          />
        ))}
      </div>

      <button className="dr-intro-skip" onClick={() => {
        setFadingOut(true);
        setTimeout(onComplete, 500);
      }}>
        Skip Intro ⏭
      </button>
    </div>
  );
}
