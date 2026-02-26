import React from "react";
import "./card.css";

const suitSymbols = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};

export default function Card({ value, suit }) {
  const displayValue = value ?? "?";
  const displaySuit = suit ?? "hearts";
  return (
    <div className="lux-card">
      <div className="lux-inner">

        {/* Top Left */}
        <div className={`lux-corner top ${displaySuit}`}>
          <span className="lux-value">{displayValue}</span>
          <span className="lux-suit">{suitSymbols[displaySuit]}</span>
        </div>

        {/* Center */}
        <div className={`lux-center ${displaySuit}`}>
          {suitSymbols[displaySuit]}
        </div>

        {/* Bottom Right */}
        <div className={`lux-corner bottom ${displaySuit}`}>
          <span className="lux-value">{displayValue}</span>
          <span className="lux-suit">{suitSymbols[displaySuit]}</span>
        </div>

      </div>
    </div>
  );
}