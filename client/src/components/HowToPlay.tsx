import { useState } from "react";
import { HOW_TO_PLAY_SLIDES } from "../flavor";

export function HowToPlay({ onClose }: { onClose: () => void }) {
  const [slide, setSlide] = useState(0);
  const total = HOW_TO_PLAY_SLIDES.length;
  const s = HOW_TO_PLAY_SLIDES[slide];

  return (
    <div
      className="htp-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="How to Play"
    >
      <div className="htp-modal">
        <div className="htp-top">
          <div className="htp-badge">How to Play</div>
          <button
            className="htp-close"
            onClick={onClose}
            aria-label="Close guide"
          >
            ✕
          </button>
        </div>

        <div className="htp-slides-track">
          <div className="htp-slide" key={slide}>
            <div className="htp-slide-icon">{s.icon}</div>
            <h2 className="htp-slide-title">{s.title}</h2>
            <p className="htp-slide-body">{s.body}</p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="htp-dots">
          {HOW_TO_PLAY_SLIDES.map((_, i) => (
            <button
              key={i}
              className={"htp-dot" + (i === slide ? " on" : "")}
              onClick={() => setSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="htp-nav">
          <button
            className="dr-btn htp-prev"
            disabled={slide === 0}
            onClick={() => setSlide((s) => Math.max(0, s - 1))}
          >
            ← Prev
          </button>
          <span className="htp-counter">
            {slide + 1} / {total}
          </span>
          {slide < total - 1 ? (
            <button
              className="dr-btn primary htp-next"
              onClick={() => setSlide((s) => Math.min(total - 1, s + 1))}
            >
              Next →
            </button>
          ) : (
            <button className="dr-btn primary htp-next" onClick={onClose}>
              Play! ✦
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
