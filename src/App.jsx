import { useState } from "react";
import { createDeck, shuffleDeck } from "./game/deck";
import "./App.css";

function App() {
  // ---------------- SETUP STATE ----------------
  const [players, setPlayers] = useState([]);
  const [dealerIndex, setDealerIndex] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  // ---------------- GAME STATE ----------------
  const [deck, setDeck] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [discard, setDiscard] = useState([]);
  const [stage, setStage] = useState(1);
  const [alert, setAlert] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const currentPlayer = players[currentPlayerIndex];
  const dealerName = players[dealerIndex];

  // ---------------- PLAYER SETUP ----------------

  function addPlayer() {
    if (!newPlayerName.trim()) return;
    setPlayers(prev => [...prev, newPlayerName.trim()]);
    setNewPlayerName("");
  }

  function startGame() {
    if (players.length < 2) return;

    let finalDealer = dealerIndex;

    if (finalDealer === null) {
      finalDealer = Math.floor(Math.random() * players.length);
      setDealerIndex(finalDealer);
    }

    const shuffled = shuffleDeck(createDeck());
    setDeck(shuffled);

    const firstPlayer = (finalDealer + 1) % players.length;

    setCurrentPlayerIndex(firstPlayer);
    setGameStarted(true);
  }

  function nextPlayer() {
    let next = (currentPlayerIndex + 1) % players.length;

    if (next === dealerIndex) {
      next = (next + 1) % players.length;
    }

    setCurrentPlayerIndex(next);
    setRevealed([]);
    setStage(1);
  }

  // ---------------- CARD LOGIC ----------------

  function drawCard() {
    if (deck.length === 0) return null;

    const newDeck = [...deck];
    const card = newDeck.shift();
    setDeck(newDeck);

    setActiveCard(card);
    setFlipped(false);
    setTimeout(() => setFlipped(true), 50);

    return card;
  }

  function showAlert(message, type) {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 2000);
  }

  function resolveCard(card, correct, nextStageIfCorrect) {
    setIsResolving(true);

    setTimeout(() => {
      if (correct) {
        setRevealed(prev => [...prev, card]);

        if (nextStageIfCorrect === 5) {
          showAlert(`${currentPlayer} completed the row! 🎉`, "success");

          setTimeout(() => {
            setRevealed([]);
            setStage(1);
            nextPlayer();
          }, 900);
        } else {
          setStage(nextStageIfCorrect);
        }
      } else {
        setDiscard(prev => [...prev, ...revealed, card]);
        showAlert(`${currentPlayer} drinks 2! 🍺`, "danger");

        setTimeout(() => {
          setRevealed([]);
          setStage(1);
          nextPlayer();
        }, 900);
      }

      setActiveCard(null);
      setIsResolving(false);
    }, 900);
  }

  // ---------------- GAME STAGES ----------------

  function handleColorGuess(color) {
    if (isResolving) return;
    const card = drawCard();
    if (!card) return;
    resolveCard(card, card.color === color, 2);
  }

  function handleHigherLower(choice) {
    if (isResolving) return;
    const card = drawCard();
    if (!card) return;

    const prev = revealed[revealed.length - 1];
    const correct =
      (choice === "higher" && card.rank > prev.rank) ||
      (choice === "lower" && card.rank < prev.rank);

    resolveCard(card, correct, 3);
  }

  function handleInsideOutside(choice) {
    if (isResolving) return;
    const card = drawCard();
    if (!card) return;

    const first = revealed[0];
    const second = revealed[1];

    const min = Math.min(first.rank, second.rank);
    const max = Math.max(first.rank, second.rank);

    const correct =
      choice === "inside"
        ? card.rank > min && card.rank < max
        : card.rank < min || card.rank > max;

    resolveCard(card, correct, 4);
  }

  function handleSuitGuess(suit) {
    if (isResolving) return;
    const card = drawCard();
    if (!card) return;
    resolveCard(card, card.suit === suit, 5);
  }

  // ---------------- CARD RENDER ----------------

  function renderCardFace(card) {
    const suits = {
      hearts: "♥",
      diamonds: "♦",
      clubs: "♣",
      spades: "♠",
    };

    const color = card.color === "red" ? "#ff004c" : "#111"; // FIXED black

    return (
      <>
        <div style={{ color }}>{card.name}</div>
        <div style={{ fontSize: "30px", color }}>
          {suits[card.suit]}
        </div>
      </>
    );
  }

  // ---------------- SETUP SCREEN ----------------

  if (!gameStarted) {
    return (
      <div className="setup-container">
        <h1>Red or Black</h1>

        <div className="player-input-row">
          <input
            value={newPlayerName}
            placeholder="Enter player name"
            onChange={(e) => setNewPlayerName(e.target.value)}
          />
          <button className="neon-btn" onClick={addPlayer}>
            Add
          </button>
        </div>

        <div className="player-list">
          {players.map((p, i) => (
            <div key={i} className="player-row">
              <span>{p}</span>
              <button
                className="neon-btn"
                onClick={() => setDealerIndex(i)}
              >
                {dealerIndex === i ? "Dealer ✓" : "Make Dealer"}
              </button>
            </div>
          ))}
        </div>

        <button
          className="start-button neon-btn"
          onClick={startGame}
          disabled={players.length < 2}
        >
          Start Game
        </button>
      </div>
    );
  }

  // ---------------- GAME SCREEN ----------------

  return (
    <div className="game-container">
      <h1>Red or Black</h1>

      <div className="info-bar">
        <div><strong>Dealer:</strong> {dealerName}</div>
        <div><strong>Current Player:</strong> {currentPlayer}</div>
      </div>

      <div className="table-area">
        {/* DECK */}
        <div className="deck-area">
          <div className="deck">🂠</div>
          <div className="pile-label">
            DECK ({deck.length})
          </div>
        </div>

        {/* PLAY AREA */}
        <div className="play-area">
          <div className="card-row">
            {revealed.map((card, i) => (
              <div key={i} className="card revealed">
                {renderCardFace(card)}
              </div>
            ))}

            {activeCard && (
              <div className={`card ${flipped ? "flip" : ""}`}>
                <div className="card-inner">
                  <div className="card-front">🂠</div>
                  <div className="card-back">
                    {renderCardFace(activeCard)}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="button-area">
            {stage === 1 && (
              <>
                <button className="neon-btn" onClick={() => handleColorGuess("red")}>Red</button>
                <button className="neon-btn" onClick={() => handleColorGuess("black")}>Black</button>
              </>
            )}
            {stage === 2 && (
              <>
                <button className="neon-btn" onClick={() => handleHigherLower("higher")}>Higher</button>
                <button className="neon-btn" onClick={() => handleHigherLower("lower")}>Lower</button>
              </>
            )}
            {stage === 3 && (
              <>
                <button className="neon-btn" onClick={() => handleInsideOutside("inside")}>Inside</button>
                <button className="neon-btn" onClick={() => handleInsideOutside("outside")}>Outside</button>
              </>
            )}
            {stage === 4 && (
              <>
                <button className="neon-btn" onClick={() => handleSuitGuess("hearts")}>♥</button>
                <button className="neon-btn" onClick={() => handleSuitGuess("diamonds")}>♦</button>
                <button className="neon-btn" onClick={() => handleSuitGuess("clubs")}>♣</button>
                <button className="neon-btn" onClick={() => handleSuitGuess("spades")}>♠</button>
              </>
            )}
          </div>
        </div>

        {/* DISCARD */}
        <div className="discard-area">
          <div className="discard-stack">
            {discard.length > 0 && (
              <div className="discard-card top">{discard.length}</div>
            )}
          </div>
          <div className="pile-label">DISCARD</div>
        </div>
      </div>

      {alert && (
        <div className={`custom-alert ${alert.type}`}>
          {alert.message}
        </div>
      )}
    </div>
  );
}

export default App;