import React from "react";
import "./card.css";

const suitSymbols = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};

export default function Card({ value, suit }) {
  return (
    <div className="lux-card">
      <div className="lux-inner">

        {/* Top Left */}
        <div className={`lux-corner top ${suit}`}>
          <span className="lux-value">{value}</span>
          <span className="lux-suit">{suitSymbols[suit]}</span>
        </div>

        {/* Center */}
        <div className={`lux-center ${suit}`}>
          {suitSymbols[suit]}
        </div>

        {/* Bottom Right */}
        <div className={`lux-corner bottom ${suit}`}>
          <span className="lux-value">{value}</span>
          <span className="lux-suit">{suitSymbols[suit]}</span>
        </div>

      </div>
    </div>
  );
}